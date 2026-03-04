import express, { Application } from 'express';

/**
 * createApp — Express application factory and DI composition root.
 *
 * Developer MUST implement this function following the wiring graph below.
 * Do NOT add any business logic here — only composition.
 *
 * ── DI Wiring Graph ──────────────────────────────────────────────────────────
 *
 *   ProviderFactory          ← create via createProviderFactory() from factories/providerFactory
 *     ├─► Logger             ← accessible via factory.getLogger() — do NOT instantiate separately
 *     ├─► MonitoringStrategy ← per session via factory.createService(target)
 *     └─► LoggerDataProvider ← per session via factory.createDataLogger()
 *
 *   SseSessionMap            ← create a new Map<string, SseSession>() here
 *
 *   MetricsRouter            ← call initMetricsRouter(factory, sessions) from routes/metrics
 *                               initMetricsRouter internally wires:
 *                               factory + sessions → initMetricsController → createMetricsController
 *                                                  → createMetricsRouter
 *
 *   ErrorMiddleware          ← call createErrorMiddleware(...) from middleware/error
 *                               inject logger via factory.getLogger()
 *                               register LAST so Express routes it as error middleware (4-arg)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const createApp = (): Application => {
    const app = express();

    // ── Middleware ─────────────────────────────────────────────────────────
    app.use(express.json());

    // ── DI Root ───────────────────────────────────────────────────────────

    // TODO: Create the shared SSE session registry

    // ── Routes ────────────────────────────────────────────────────────────

    // TODO: Initialize and mount the metrics router

    // ── Error Middleware ───────────────────────────────────────────────────

    // TODO: Register error middleware — must be last, inject logger via factory.getLogger()


    return app;
};
