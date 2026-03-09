import { MonitoringStrategy } from '../interfaces/monitoringStrategy';
import { ServiceMetrics } from '../interfaces/serviceMetrics';
import { Logger } from '../interfaces/logger';
import { ResourceType } from '../validators/connectParams';

// ---------------------------------------------------------------------------
// Props & Interface
// ---------------------------------------------------------------------------

/**
 * MetricsServiceProps — injected dependencies for the metrics service.
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
    collectMetrics(resourceType?: ResourceType): Promise<ServiceMetrics>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * createMetricsService — factory that wires MetricsService with its dependencies.
 *
 * Calls strategy.getCpu(), getMemory(), getDisk() in parallel via Promise.all
 * and returns a ServiceMetrics snapshot with the current timestamp.
 *
 * @param strategy - Injected MonitoringStrategy (local or db)
 * @param logger   - Injected Logger instance (obtained from factory.getLogger())
 */
export const createMetricsService = ({ strategy, logger }: MetricsServiceProps): MetricsService => ({
    collectMetrics: async (resourceType?: ResourceType): Promise<ServiceMetrics> => {
        try {
            const metrics: ServiceMetrics = {
                timestamp: new Date().toISOString(),
            };

            const resourceToFetch: Record<ResourceType, () => Promise<void>> = {
                cpu: async () => { metrics.cpu = await strategy.getCpu(); },
                memory: async () => { metrics.memory = await strategy.getMemory(); },
                disk: async () => { metrics.disk = await strategy.getDisk(); },
            };

            if (resourceType) {
                await resourceToFetch[resourceType]();
            } else {
                await Promise.all(Object.values(resourceToFetch).map(handler => handler()));
            }

            return metrics;
        } catch (err) {
            logger.error(`collectMetrics failed: ${String(err)}`);
            throw err;
        }
    },
});
