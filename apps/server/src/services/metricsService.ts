import { MonitoringStrategy } from '../interfaces/monitoringStrategy';
import { SystemMetrics } from '../interfaces/systemMetrics';
import { CreateSystemDto } from '../dto/createSystem';
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
 *  - initSystem: store the dto config so /connect can access it during metric cycles
 *  - collectMetrics: call strategy methods to build a SystemMetrics snapshot
 */
export interface MetricsService {
    initSystem(dto: CreateSystemDto): void;
    collectMetrics(): Promise<SystemMetrics>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * createMetricsService — factory that wires MetricsService with its props.
 *
 * No business logic here — only the shape of the returned object.
 *
 * @param props - Injected strategy + logger
 */
export const createMetricsService = (props: MetricsServiceProps): MetricsService => {
    const initSystem = (_dto: CreateSystemDto): void => {
        // TODO: store dto config (e.g., in closure-scoped variable)
        void props;
        throw new Error('metricsService.initSystem not implemented');
    };

    const collectMetrics = async (): Promise<SystemMetrics> => {
        // TODO: call props.strategy.getCpu(), getMemory(), getDisk()
        // TODO: build and return a SystemMetrics object with the current timestamp
        void props;
        throw new Error('metricsService.collectMetrics not implemented');
    };

    return { initSystem, collectMetrics };
};
