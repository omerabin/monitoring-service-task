import { MonitoringStrategy } from '../interfaces/monitoringStrategy';
import si from 'systeminformation';

export const createLocalMonitoringStrategy = (): MonitoringStrategy => ({
    getCpu: () => si.currentLoad().then(({ currentLoad }) => currentLoad),
    getMemory: () => si.mem().then(({ total, available }) => ((total - available) / total) * 100),
    getDisk: () => si.fsSize().then(data => data[0].use), // already a percentage
});