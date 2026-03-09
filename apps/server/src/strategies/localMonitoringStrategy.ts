import { MonitoringStrategy } from '../interfaces/monitoringStrategy';
import si from 'systeminformation';

export const createLocalMonitoringStrategy = (): MonitoringStrategy => ({
    getCpu: () => si.currentLoad().then(({ currentLoad }) => ({ usagePercentage: currentLoad })),
    getMemory: () => si.mem().then(({ total, available }) => ({ usagePercentage: ((total - available) / total) * 100 })),
    getDisk: () => si.fsSize().then(data => ({ usagePercentage: data[0].use })), // already a percentage
});