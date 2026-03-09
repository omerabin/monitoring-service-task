import { Request, Response } from 'express';
import { Observer } from '../interfaces/observer';
import { ServiceMetrics } from '../interfaces/serviceMetrics';
import { MetricsService } from '../services/metricsService';
import { LoggerDataProvider } from '../interfaces/monitoringStrategy';
import { Logger } from '../interfaces/logger';
import { SseSessionMap } from '../types/sse';
import { createMetricsSubject } from '../observers/metricsSubject';
import { ResourceType } from '../validators/connectParams';

export const METRICS_INTERVAL_MS = 30_000;
export const HEARTBEAT_INTERVAL_MS = 15_000;

export interface SseConnectionOptions {
    req: Request;
    res: Response;
    sessionId: string;
    resourceType: ResourceType;
    sessions: SseSessionMap;
    service: MetricsService;
    loggerDataProvider: LoggerDataProvider;
    logger: Logger;
}

/**
 * openSseConnection — sets up headers, observers, intervals, and cleanup
 * for a single SSE session. Extracted from the controller to keep connect()
 * focused on validation and wiring only.
 */
export const openSseConnection = ({
    req,
    res,
    sessionId,
    resourceType,
    sessions,
    service,
    loggerDataProvider,
    logger,
}: SseConnectionOptions): void => {
    // 1. SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // 2. Register session
    sessions.set(sessionId, { sessionId, resourceType, res });

    // 3. Observers
    const subject = createMetricsSubject();

    const sseObserver: Observer<ServiceMetrics> = {
        update: (data) => res.write(`data: ${JSON.stringify(data)}\n\n`),
    };

    const loggerObserver: Observer<ServiceMetrics> = {
        update: (data) => loggerDataProvider.log(JSON.stringify(data)),
    };

    subject.attach(sseObserver);
    subject.attach(loggerObserver);

    // 4. Metrics polling
    const metricsInterval = setInterval(() => {
        service.collectMetrics(resourceType)
            .then(metrics => {
                subject.setData(metrics);
                subject.notify();
            })
            .catch(err => {
                logger.error(`Metrics collection error [${sessionId}]: ${String(err)}`);
            });
    }, METRICS_INTERVAL_MS);

    // 5. Heartbeat — prevents proxy / browser idle-connection drops
    const heartbeatInterval = setInterval(
        () => res.write(': ping\n\n'),
        HEARTBEAT_INTERVAL_MS,
    );

    // 6. Cleanup — shared between 'close' and 'error' with double-call guard
    let cleaned = false;
    const cleanup = (): void => {
        if (cleaned) return;
        cleaned = true;
        clearInterval(metricsInterval);
        clearInterval(heartbeatInterval);
        subject.detach(sseObserver);
        subject.detach(loggerObserver);
        sessions.delete(sessionId);
    };

    req.on('close', cleanup);
    req.on('error', (err) => {
        logger.error(`SSE request error [${sessionId}]: ${String(err)}`);
        cleanup();
    });
};