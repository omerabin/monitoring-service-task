import express, { Application } from 'express';
import { createProviderFactory } from './factories/providerFactory';
import { createMetricsController } from './controllers/metricsController';
import { createMetricsRouter } from './routes/metrics';
import { createErrorMiddleware } from './middleware/error';
import { SseSessionMap } from './types/sse';

/**
 * createApp — Express application factory and DI composition root.
 *
 * Dependency graph (top → bottom):
 *
 *   ProviderFactory
 *     ├─► FileLogger           (via factory.getLogger())
 *     ├─► MonitoringStrategy   (via factory.createService)
 *     └─► LoggerDataProvider   (via factory.createDataLogger)
 *   SseSessionMap  (shared mutable registry, created here)
 *   MetricsController (factory + sessions + target — logger accessed inside via factory)
 *   MetricsRouter     (controller injected)
 *   ErrorMiddleware   (logger injected via factory.getLogger())
 *
 * Nothing below this function should import concrete implementations.
 * All wiring happens here.
 */
export const createApp = (): Application => {
    const app = express();

    // ── Middleware ─────────────────────────────────────────────────────────
    app.use(express.json());

    // ── DI Root ───────────────────────────────────────────────────────────

    // 1. Factory — single source for logger, strategies, and data logger providers.
    //    Logger is NOT created separately; use factory.getLogger() everywhere.
    const factory = createProviderFactory();

    // 2. Shared SSE session registry — single source of truth for active connections.
    const sessions: SseSessionMap = new Map();

    // 3. Controller — receives factory, sessions, and monitoring target.
    //    Developer may read MONITORING_TARGET from env to switch local ↔ db.
    const monitoringTarget =
        (process.env['MONITORING_TARGET'] as 'local' | 'db' | undefined) ?? 'local';

    const metricsController = createMetricsController({
        factory,
        sessions,
        monitoringTarget,
    });

    // 4. Router — receives the fully-wired controller.
    const metricsRouter = createMetricsRouter(metricsController);

    // ── Routes ────────────────────────────────────────────────────────────
    app.use('/metrics', metricsRouter);

    // ── Error Middleware ───────────────────────────────────────────────────
    // Logger is sourced from the factory — no duplicate instantiation.
    // Must be registered last — Express identifies error middleware by arity (4).
    app.use(createErrorMiddleware(factory.getLogger()));

    return app;
};
