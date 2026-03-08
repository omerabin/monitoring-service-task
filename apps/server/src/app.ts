import express, { Application, RequestHandler, ErrorRequestHandler } from 'express';
import { ProviderFactory } from './factories/providerFactory';

/**
 * InitExpressParams — all injected components required to build the Express app.
 *
 * Developer MUST pass all wired components from server.ts.
 * Do NOT add any business logic here — only composition.
 *
 * @param factory         - The shared ProviderFactory (DI root)
 * @param errorMiddleware - The error-handling middleware (from middleware/error)
 *                          Must be created via createErrorMiddleware(...) and injected here.
 *                          Registered LAST so Express treats it as a 4-arg error handler.
 */
export interface InitExpressParams {
    factory: ProviderFactory;
    errorMiddleware: ErrorRequestHandler;
}

/**
 * initExpress — Express application factory and DI composition root.
 *
 * Developer MUST call this from server.ts, passing all wired components.
 * Do NOT add any business logic here — only composition.
 *
 * ── DI Wiring Graph ──────────────────────────────────────────────────────────
 *
 *   ProviderFactory          ← create via createProviderFactory() from factories/providerFactory
 *     ├─► Logger             ← accessible via factory.getLoggerDataProvider() → .getLogger()
 *     ├─► MonitoringStrategy ← per session via factory.createService(target)
 *     └─► LoggerDataProvider ← per session via factory.createDataLogger()
 *
 *   SseSessionMap            ← create a new Map<string, SseSession>() in server.ts
 *
 *   MetricsRouter            ← call initMetricsRouter(factory, sessions) from routes/metrics
 *                               initMetricsRouter internally wires:
 *                               factory + sessions → initMetricsController → createMetricsController
 *                                                  → createMetricsRouter
 *
 *   ErrorMiddleware          ← call createErrorMiddleware(...) from middleware/error
 *                               inject logger via factory.getLoggerDataProvider().getLogger()
 *                               register LAST so Express routes it as error middleware (4-arg)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @param params - Injected components: factory and errorMiddleware
 */
export const initExpress = ({ factory, errorMiddleware }: InitExpressParams): Application => {
    void factory;
    const app = express();

    // ── Middleware ─────────────────────────────────────────────────────────
    app.use(express.json());

    // ── Routes ────────────────────────────────────────────────────────────

    // TODO: Call initMetricsRouter(factory, sessions) and mount the returned router
    // Example: app.use('/metrics', initMetricsRouter(factory, sessions));

    // ── Error Middleware ───────────────────────────────────────────────────
    // Must be registered LAST — Express identifies error handlers by their 4-arg signature
    app.use(errorMiddleware as unknown as RequestHandler);

    return app;
};
