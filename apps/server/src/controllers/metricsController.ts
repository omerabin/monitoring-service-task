import { Request, Response, NextFunction } from 'express';
import { ProviderFactory } from '../factories/providerFactory';
import { SseSessionMap } from '../types/sse';
import { MonitoringTarget } from '../interfaces/monitoringStrategy';

// ---------------------------------------------------------------------------
// Props & Interface
// ---------------------------------------------------------------------------

/**
 * MetricsControllerProps — all dependencies injected into the controller.
 *
 * Logger is NOT injected separately — use factory.getLogger() instead.
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
 * createMetricsController — wires the controller with its injected dependencies.
 *
 * Developer MUST define this function and implement:
 *
 * `start` handler:
 *  - Parse StartMonitoringRequest from req.body (already validated by middleware)
 *  - Call service.initService(dto) to store the system config
 *  - Respond 200 { message: 'System started' }
 *
 * `connect` handler:
 *  - Validate that /start has already been called
 *    → If not, call next(new HttpError('...', 400)) with ErrorCode.SYSTEM_NOT_STARTED
 *  - Enforce MAX_SSE_CONNECTIONS
 *    → If exceeded, call next(new HttpError('...', 429)) with ErrorCode.MAX_CONNECTIONS_EXCEEDED
 *  - Generate a UUID (v4) for the session
 *  - Set SSE response headers (Content-Type: text/event-stream, etc.)
 *  - Register the session in sessions
 *  - Retrieve a fresh LoggerDataProvider via factory.createDataLogger()
 *  - Set up a setInterval (METRICS_INTERVAL_MS) to:
 *      1. Call service.collectMetrics()
 *      2. Stream result via res.write(`data: ${JSON.stringify(metrics)}\n\n`)
 *      3. Write to file via loggerDataProvider
 *  - On client disconnect (req.on('close', ...)):
 *      1. Clear the interval
 *      2. Delete the session from sessions
 *
 * The function should accept a MetricsControllerProps object and return a MetricsController.
 */


// ---------------------------------------------------------------------------
// Initializer (called by routes/metrics.ts)
// ---------------------------------------------------------------------------

/**
 * initMetricsController — composes and returns a ready-to-use MetricsController.
 *
 * Developer MUST implement this function:
 *  - Read MONITORING_TARGET from process.env (default: 'local')
 *  - Call createMetricsController({ factory, sessions, monitoringTarget })
 *  - Return the resulting controller
 *
 * This function is the single call-site that wires dependencies into the controller.
 * It is called from routes/metrics.ts — not from app.ts directly.
 *
 * @param factory  - The shared ProviderFactory instance
 * @param sessions - The shared SseSessionMap registry
 */
export const initMetricsController = (
    _factory: ProviderFactory,
    _sessions: SseSessionMap
): MetricsController => {
    throw new Error('initMetricsController not implemented');
};
