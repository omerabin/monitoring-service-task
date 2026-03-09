import { Router } from 'express';
import { ProviderFactory } from '../factories/providerFactory';
import { MetricsController, initMetricsController } from '../controllers/metricsController';
import { SseSessionMap } from '../types/sse';
import { validator } from '../middleware/validator';
import { ConnectParamsSchema } from '../validators/connectParams';

// ---------------------------------------------------------------------------
// Route Definitions
// ---------------------------------------------------------------------------

/**
 * createMetricsRouter — wires the /metrics route group.
 *
 * Routes:
 *  POST /connect/:resourceType
 *    → Params: resourceType ('cpu' | 'memory' | 'disk')
 *    → Opens an SSE stream for the requested metric type.
 *    → Enforces max 5 concurrent connections (error handled by error middleware).
 *    → Assigns a UUID session to every new connection.
 *    → Streams metrics every 30 seconds and writes to session log file.
 *
 * @param controller - Injected MetricsController instance
 */
export const createMetricsRouter = (controller: MetricsController): Router => {
    const router = Router();

    router.post('/connect/:resourceType', validator(ConnectParamsSchema, 'params'), controller.connect);

    return router;
};

// ---------------------------------------------------------------------------
// Initializer (called by app.ts)
// ---------------------------------------------------------------------------

/**
 * initMetricsRouter — composes the controller then the router and returns it.
 *
 * @param factory  - The shared ProviderFactory instance (from app.ts DI root)
 * @param sessions - The shared SseSessionMap registry (from app.ts)
 */
export const initMetricsRouter = (
    factory: ProviderFactory,
    sessions: SseSessionMap
): Router => {
    const controller = initMetricsController(factory, sessions);
    return createMetricsRouter(controller);
};
