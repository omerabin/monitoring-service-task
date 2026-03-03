import { MonitoringStrategy } from '../interfaces/monitoringStrategy';

/**
 * DbMonitoringStrategy — returns fake/randomly-generated metric values.
 *
 * Developer MUST implement:
 *  - getCpu()    → return a random float between 0–100
 *  - getMemory() → return a random float between 0–100
 *  - getDisk()   → return a random float between 0–100
 *
 * This strategy simulates a remote DB data source without real I/O.
 * The service layer is completely unaware that values are synthetic.
 */
export const DbMonitoringStrategy = (): MonitoringStrategy => ({
    getCpu: (): Promise<number> => {
        // TODO: implement fake CPU usage generator (e.g. Math.random() * 100)
        throw new Error('DbMonitoringStrategy.getCpu not implemented');
    },

    getMemory: (): Promise<number> => {
        // TODO: implement fake memory usage generator
        throw new Error('DbMonitoringStrategy.getMemory not implemented');
    },

    getDisk: (): Promise<number> => {
        // TODO: implement fake disk usage generator
        throw new Error('DbMonitoringStrategy.getDisk not implemented');
    },
});
