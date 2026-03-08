/**
 * ServiceMetrics — snapshot of all monitored resource metrics at a point in time.
 *
 * Developer MUST define this interface once the CpuConfig, MemoryConfig, and DiskConfig
 * types are implemented in the validators directory.
 *
 * Import the types from validators:
 *  import { CpuConfig }    from '../validators/cpuConfig';
 *  import { MemoryConfig } from '../validators/memoryConfig';
 *  import { DiskConfig }   from '../validators/diskConfig';
 *
 * The shape of cpu, memory, and disk depends on the active monitoring type:
 *  - 'local' → each field contains only { usagePercentage }
 *  - 'db'    → each field contains the full hardware config
 *
 *  export interface ServiceMetrics {
 *    cpu:       CpuConfig;
 *    memory:    MemoryConfig;
 *    disk:      DiskConfig;
 *    timestamp: string;  // ISO 8601
 *  }
 */
