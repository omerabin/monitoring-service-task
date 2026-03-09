import { Request, Response, NextFunction } from 'express';
import { ProviderFactory } from '../factories/providerFactory';
import { SseSessionMap, SessionIdSchema } from '../types/sse';
import { MonitoringTarget } from '../interfaces/monitoringStrategy';
import { createMetricsService } from '../services/metricsService';
import { HttpError, ErrorCode, HttpStatusCode } from '../errors/HttpError';
import { v4 as uuidv4 } from 'uuid';
import { openSseConnection } from '../utils/SseConnection';
import { ConnectParamsSchema } from '../validators/connectParams';

// ---------------------------------------------------------------------------
// Props & Interface
// ---------------------------------------------------------------------------
const MAX_SSE_CONNECTIONS = 5;

export interface MetricsControllerProps {
    factory: ProviderFactory;
    sessions: SseSessionMap;
    monitoringTarget: MonitoringTarget;
}

export interface MetricsController {
    connect(req: Request, res: Response, next: NextFunction): void;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export const createMetricsController = ({
    factory,
    sessions,
    monitoringTarget,
}: MetricsControllerProps): MetricsController => {
    const logger = factory.getLoggerDataProvider().getLogger();
    const strategy = factory.createService(monitoringTarget);
    const service = createMetricsService({ strategy, logger });

    return {
        connect: (req: Request, res: Response, next: NextFunction): void => {
            if (sessions.size >= MAX_SSE_CONNECTIONS) {
                next(new HttpError(
                    `Maximum SSE connections reached (${MAX_SSE_CONNECTIONS}).`,
                    HttpStatusCode[ErrorCode.MAX_CONNECTIONS_EXCEEDED],
                ));
                return;
            }

            const resourceTypeResult = ConnectParamsSchema.safeParse(req.params);
            if (!resourceTypeResult.success) {
                next(new HttpError('Invalid resource type. Must be one of: cpu, memory, disk.', 400));
                return;
            }

            const sessionIdResult = SessionIdSchema.safeParse(uuidv4());
            if (!sessionIdResult.success) {
                next(new HttpError('Failed to generate valid session ID.', 500, false));
                return;
            }

            openSseConnection({
                req,
                res,
                sessionId: sessionIdResult.data,
                resourceType: resourceTypeResult.data.resourceType,
                sessions,
                service,
                loggerDataProvider: factory.createDataLogger(sessionIdResult.data),
                logger,
            });
        },
    };
};

// ---------------------------------------------------------------------------
// Initializer (called by routes/metrics.ts)
// ---------------------------------------------------------------------------

/**
 * initMetricsController — composes and returns a ready-to-use MetricsController.
 *
 * Reads MONITORING_TARGET from process.env (default: 'local').
 * Warns if an unrecognised value is supplied so misconfiguration is visible in logs.
 */
export const initMetricsController = (
    factory: ProviderFactory,
    sessions: SseSessionMap,
): MetricsController => {
    const logger = factory.getLoggerDataProvider().getLogger();
    const raw = process.env['MONITORING_TARGET'] ?? 'local';

    let target: MonitoringTarget;
    if (raw === 'db' || raw === 'local') {
        target = raw;
    } else {
        logger.warn(
            `Unrecognised MONITORING_TARGET="${raw}" — falling back to "local". ` +
            `Valid values are: local, db.`,
        );
        target = 'local';
    }

    return createMetricsController({ factory, sessions, monitoringTarget: target });
};