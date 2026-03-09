import { MonitoringStrategy } from '../interfaces/monitoringStrategy';
import { ServiceMetrics } from '../interfaces/serviceMetrics';
import { Logger } from '../interfaces/logger';

// ---------------------------------------------------------------------------
// Props & Interface
// ---------------------------------------------------------------------------

/**
 * MetricsServiceProps — injected dependencies for the metrics service.
 *
 * Note: `logger` is obtained via `factory.getLogger()` at the call site
 * and passed in here so the service remains decoupled from the factory.
 */
export interface MetricsServiceProps {
    strategy: MonitoringStrategy;
    logger: Logger;
}

/**
 * MetricsService — the public API surface of the service layer.
 *
 * Developer MUST implement:
 *  - collectMetrics: call strategy methods to build a SystemMetrics snapshot
 */
export interface MetricsService {
    collectMetrics(): Promise<ServiceMetrics>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * createMetricsService — factory that wires MetricsService with its dependencies.
 *
 * Developer MUST implement:
 *  - collectMetrics: call strategy.getCpu(), getMemory(), getDisk() and build
 *    a ServiceMetrics snapshot with the current timestamp
 *
 * @param strategy - Injected MonitoringStrategy (local or db)
 * @param logger   - Injected Logger instance (obtained from factory.getLogger())
 */
export const createMetricsService = ({ strategy, logger }: MetricsServiceProps): MetricsService => {
    void strategy;
    void logger;
    throw new Error('createMetricsService not implemented');
};
