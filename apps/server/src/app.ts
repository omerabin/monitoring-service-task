import express, { Application, RequestHandler, ErrorRequestHandler } from 'express';
import { ProviderFactory } from './factories/providerFactory';
import { SseSessionMap } from './types/sse';
import { initMetricsRouter } from './routes/metrics';

/**
 * InitExpressParams — all injected components required to build the Express app.
 *
 * @param factory         - The shared ProviderFactory (DI root)
 * @param sessions        - The shared SseSessionMap registry
 * @param errorMiddleware - The error-handling middleware (registered LAST)
 */
export interface InitExpressParams {
    factory: ProviderFactory;
    sessions: SseSessionMap;
    errorMiddleware: ErrorRequestHandler;
}

/**
 * initExpress — Express application factory and DI composition root.
 */
export const initExpress = ({ factory, sessions, errorMiddleware }: InitExpressParams): Application => {
    const app = express();

    // ── Middleware ─────────────────────────────────────────────────────────
    app.use(express.json());

    // ── Routes ────────────────────────────────────────────────────────────
    app.use('/metrics', initMetricsRouter(factory, sessions));

    // ── Error Middleware ───────────────────────────────────────────────────
    // Must be registered LAST — Express identifies error handlers by their 4-arg signature
    app.use(errorMiddleware as unknown as RequestHandler);

    return app;
};
