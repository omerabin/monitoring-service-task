import { MonitoringStrategy } from '../interfaces/monitoringStrategy';

import { DbCpuConfig } from '../validators/cpuConfig';
import { DbMemoryConfig } from '../validators/memoryConfig';
import { DbDiskConfig } from '../validators/diskConfig';

/**
 * createDbMonitoringStrategy — returns random float values (0–100) simulating a remote DB source.
 *
 * The service layer is completely unaware that the values are synthetic.
 */
export const createDbMonitoringStrategy = (): MonitoringStrategy => ({
    getCpu: (): Promise<DbCpuConfig> => {
        return Promise.resolve({
            cores: 8,
            threads: 16,
            frequencyGHz: 3.5,
            usagePercentage: Math.random() * 100
        });
    },
    getMemory: (): Promise<DbMemoryConfig> => {
        const totalGb = 32;
        const usedGb = Math.random() * totalGb;
        return Promise.resolve({
            totalGb,
            usedGb,
            usagePercentage: (usedGb / totalGb) * 100
        });
    },
    getDisk: (): Promise<DbDiskConfig> => {
        const totalGb = 1024;
        const usedGb = Math.random() * totalGb;
        return Promise.resolve({
            totalGb,
            usedGb,
            usagePercentage: (usedGb / totalGb) * 100
        });
    },
});
