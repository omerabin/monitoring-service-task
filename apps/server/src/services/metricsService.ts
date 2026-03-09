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
    collectMetrics: async (): Promise<ServiceMetrics> => {
        try {
            const [cpuUsage, memoryUsage, diskUsage] = await Promise.all([
                strategy.getCpu(),
                strategy.getMemory(),
                strategy.getDisk(),
            ]);

            return {
                cpu: { usagePercentage: cpuUsage },
                memory: { usagePercentage: memoryUsage },
                disk: { usagePercentage: diskUsage },
                timestamp: new Date().toISOString(),
            };
        } catch (err) {
            logger.error(`collectMetrics failed: ${String(err)}`);
            throw err;
        }
    },
});
