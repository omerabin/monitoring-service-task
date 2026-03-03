import { Request, Response, NextFunction } from 'express';
import { ProviderFactory } from '../factories/providerFactory';
import { createMetricsService, MetricsService } from '../services/metricsService';
import { MonitoringTarget } from '../interfaces/monitoringStrategy';
import { ObjectType, SseSessionMap } from '../types/sse';

// ---------------------------------------------------------------------------
// Props & Interface
// ---------------------------------------------------------------------------

/**
 * MetricsControllerProps — all dependencies injected into the controller.
 *
 * Logger is NOT injected separately — use props.factory.getLogger() instead.
 *
 * The controller creates the MetricsService internally via the factory,
 * so it does not need to receive a pre-built service from the outside.
 */
export interface MetricsControllerProps {
    factory: ProviderFactory;
    /** Shared SSE session registry — enforces the max 5 connections rule */
    sessions: SseSessionMap;
    /** Strategy target: 'local' (OS) or 'db' (fake generator) */
    monitoringTarget: MonitoringTarget;
}

/**
 * MetricsController — the public handler surface exposed to the router.
 */
export interface MetricsController {
    start(req: Request, res: Response, next: NextFunction): void;
    connect(req: Request, res: Response, next: NextFunction): void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum number of concurrent SSE sessions allowed. */
export const MAX_SSE_CONNECTIONS = 5;

/** Interval in milliseconds at which metrics are sampled and logged. */
export const METRICS_INTERVAL_MS = 30_000;

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * createMetricsController — wires the controller with its injected props.
 *
 * Developer MUST implement:
 *
 * `start` handler:
 *  - Parse and validate CreateSystemDto from req.body
 *  - Call service.initSystem(dto) to store the system config
 *  - Respond 200 { message: 'System started' }
 *
 * `connect` handler:
 *  - Validate that /start has already been called
 *    → If not, call next(new AppError('...', 400, ErrorCode.SYSTEM_NOT_STARTED))
 *  - Enforce MAX_SSE_CONNECTIONS
 *    → If exceeded, call next(new AppError('...', 429, ErrorCode.MAX_CONNECTIONS_EXCEEDED))
 *  - Generate a UUID (v4) for the session
 *  - Set SSE response headers (Content-Type: text/event-stream, etc.)
 *  - Register the session in props.sessions
 *  - Retrieve a fresh LoggerDataProvider via props.factory.createDataLogger()
 *  - Set up a setInterval (METRICS_INTERVAL_MS) to:
 *      1. Call service.collectMetrics()
 *      2. Stream result via res.write(`data: ${JSON.stringify(metrics)}\n\n`)
 *      3. Write to file via loggerDataProvider
 *      4. Evaluate minAlert threshold and emit `event: alert` if exceeded
 *  - On client disconnect (req.on('close', ...)):
 *      1. Clear the interval
 *      2. Delete the session from props.sessions
 *
 * @param props - Injected factory, sessions registry, and monitoring target
 */
export const createMetricsController = (
    props: MetricsControllerProps
): MetricsController => {
    // Service is created once per controller instance.
    // Logger is obtained from the factory — no separate logger injection.
    const logger = props.factory.getLogger();
    const strategy = props.factory.createService(props.monitoringTarget);
    const service: MetricsService = createMetricsService({ strategy, logger });

    // ── Handlers defined as named consts ──────────────────────────────────

    const start = (_req: Request, _res: Response, _next: NextFunction): void => {
        // TODO: implement — see JSDoc above
        throw new Error('metricsController.start not implemented');
    };

    const connect = (_req: Request, _res: Response, _next: NextFunction): void => {
        // TODO: implement — see JSDoc above
        // params: _req.params.objectType as ObjectType, Number(_req.params.minAlert)
        void service;
        void (_req.params as { objectType: ObjectType; minAlert: string });
        throw new Error('metricsController.connect not implemented');
    };

    return { start, connect };
};
