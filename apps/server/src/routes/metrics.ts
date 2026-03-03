import { Router } from 'express';
import { MetricsController } from '../controllers/metricsController';

/**
 * createMetricsRouter — wires the /metrics route group.
 *
 * Routes:
 *  POST /start
 *    → Body: CreateSystemDto
 *    → Initialises the system configuration; must be called before /connect.
 *
 *  POST /connect/:objectType/:minAlert
 *    → Params: objectType ('cpu' | 'memory' | 'disk'), minAlert (number)
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

    router.post('/start', controller.start);

    router.post('/connect/:objectType/:minAlert', controller.connect);

    return router;
};
