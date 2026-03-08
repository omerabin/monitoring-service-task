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
 * Logger is NOT injected separately — access via factory.getLoggerDataProvider().getLogger().
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
 *  - Wire the Observer pattern (see below) before starting the interval
 *  - Set up a setInterval (METRICS_INTERVAL_MS) to trigger subject.notify()
 *  - On client disconnect (req.on('close', ...)):
 *      1. Clear the interval
 *      2. Detach all observers from the subject
 *      3. Delete the session from sessions
 *
 * ── Observer Pattern ────────────────────────────────────────────────────────
 *
 * The `connect` handler MUST use the Observer pattern (see interfaces/observer.ts)
 * to decouple metric broadcasting from file logging.
 *
 * Roles:
 *  - Subject<ServiceMetrics>  — the metric emitter, triggered on each interval tick.
 *                               Holds a list of attached observers and calls update()
 *                               on each of them when new metrics are collected.
 *
 *  - Observer #1 (SSE writer) — streams the metrics snapshot to the HTTP response:
 *                               res.write(`data: ${JSON.stringify(metrics)}\n\n`)
 *
 *  - Observer #2 (file logger)— writes the snapshot to the session log file via
 *                               the LoggerDataProvider obtained from factory.createDataLogger()
 *
 * Wiring:
 *  1. Create a Subject<ServiceMetrics> instance (your own implementation)
 *  2. Implement two Observer<ServiceMetrics> objects (one for SSE, one for logging)
 *  3. Call subject.attach(sseObserver) and subject.attach(loggerObserver)
 *  4. Inside the setInterval callback:
 *       a. Call service.collectMetrics() to get a fresh snapshot
 *       b. Store the snapshot on the subject
 *       c. Call subject.notify() — this triggers both observers automatically
 *  5. On disconnect, call subject.detach(sseObserver) and subject.detach(loggerObserver)
 *
 * Why Observer here?
 *  The controller should not know HOW metrics are consumed — only that they are
 *  produced. Adding a new consumer (e.g., alerting, DB writes) requires zero
 *  changes to the controller: just attach another observer.
 *
 * ────────────────────────────────────────────────────────────────────────────
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
