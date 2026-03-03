import { CpuConfig } from './cpu';
import { MemoryConfig } from './memory';
import { DiskConfig } from './disk';

export interface SystemMetrics {
    cpu: CpuConfig;
    memory: MemoryConfig;
    disk: DiskConfig;
    timestamp: string;
}
