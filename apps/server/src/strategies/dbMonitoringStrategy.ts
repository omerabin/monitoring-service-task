import { MonitoringStrategy } from '../interfaces/monitoringStrategy';

/**
 * createDbMonitoringStrategy — returns random float values (0–100) simulating a remote DB source.
 *
 * The service layer is completely unaware that the values are synthetic.
 */
export const createDbMonitoringStrategy = (): MonitoringStrategy => ({
    getCpu:    (): Promise<number> => Promise.resolve(Math.random() * 100),
    getMemory: (): Promise<number> => Promise.resolve(Math.random() * 100),
    getDisk:   (): Promise<number> => Promise.resolve(Math.random() * 100),
});
