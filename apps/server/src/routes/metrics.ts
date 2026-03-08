import { Router } from 'express';
import { ProviderFactory } from '../factories/providerFactory';
import { MetricsController } from '../controllers/metricsController';
import { SseSessionMap } from '../types/sse';
// import { validator } from '../middleware/validator';
// import { StartMonitoringRequestSchema } from '../validators/createSystem'; // TODO: uncomment once schema is implemented
// import { ConnectParamsSchema } from '../validators/connectParams';         // TODO: uncomment once schema is implemented

// ---------------------------------------------------------------------------
// Route Definitions
// ---------------------------------------------------------------------------

/**
 * createMetricsRouter — wires the /metrics route group.
 *
 * Routes:
 *  POST /start
 *    → Body: StartMonitoringRequest
 *    → Initialises the system configuration; must be called before /connect.
 *
 *  POST /connect/:resourceType
 *    → Params: resourceType ('cpu' | 'memory' | 'disk')
 *    → Opens an SSE stream for the requested metric type.
 *    → Validates that /start has been called (error handled by error middleware).
 *    → Enforces max 5 concurrent connections (error handled by error middleware).
 *    → Assigns a UUID session to every new connection.
 *    → Streams metrics every 30 seconds and writes to session log file.
 *
 * @param controller - Injected MetricsController instance
 */
export const createMetricsRouter = (controller: MetricsController): Router => {
    const router = Router();

    // validator() acts as a per-route decorator (NestJS-style pipe):
    // it parses and validates the request before the handler runs.
    // TODO: add validator(StartMonitoringRequestSchema, 'body') once schema is implemented
    router.post('/start', controller.start);

    // TODO: add validator(ConnectParamsSchema, 'params') once schema is implemented
    router.post('/connect/:resourceType', controller.connect);

    return router;
};

// ---------------------------------------------------------------------------
// Initializer (called by app.ts)
// ---------------------------------------------------------------------------

/**
 * initMetricsRouter — composes the controller then the router and returns both.
 *
 * Developer MUST implement this function:
 *  - Call initMetricsController(factory, sessions) to get a wired controller
 *  - Call createMetricsRouter(controller) to get the Express Router
 *  - Return the router so app.ts can register it
 *
 * This is the single entry point from app.ts into the metrics feature.
 * app.ts should only call this function and mount the returned router.
 *
 * @param factory  - The shared ProviderFactory instance (from app.ts DI root)
 * @param sessions - The shared SseSessionMap registry (from app.ts)
 */
export const initMetricsRouter = (
    _factory: ProviderFactory,
    _sessions: SseSessionMap
): Router => {
    throw new Error('initMetricsRouter not implemented');
};
