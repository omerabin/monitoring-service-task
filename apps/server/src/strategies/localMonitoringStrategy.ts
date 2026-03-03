import { MonitoringStrategy } from '../interfaces/monitoringStrategy';

/**
 * LocalMonitoringStrategy — reads metrics from the host OS via Node's `os` module.
 *
 * Developer MUST implement:
 *  - getCpu()    → derive CPU usage % from os.cpus() (idle vs total tick sampling)
 *  - getMemory() → compute used % from os.totalmem() and os.freemem()
 *  - getDisk()   → use a library (e.g. `diskusage`) or spawn `df` for disk stats
 */
export const LocalMonitoringStrategy = (): MonitoringStrategy => ({
    getCpu: (): Promise<number> => {
        // TODO: implement real CPU usage sampling via os module
        throw new Error('LocalMonitoringStrategy.getCpu not implemented');
    },

    getMemory: (): Promise<number> => {
        // TODO: implement real memory usage via os.totalmem / os.freemem
        throw new Error('LocalMonitoringStrategy.getMemory not implemented');
    },

    getDisk: (): Promise<number> => {
        // TODO: implement real disk usage via diskusage or child_process
        throw new Error('LocalMonitoringStrategy.getDisk not implemented');
    },
});
