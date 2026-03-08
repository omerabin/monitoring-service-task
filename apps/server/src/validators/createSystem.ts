//import { z } from 'zod';
// import { LocalCpuConfigSchema, DbCpuConfigSchema } from './cpuConfig';
// import { LocalMemoryConfigSchema, DbMemoryConfigSchema } from './memoryConfig';
// import { LocalDiskConfigSchema, DbDiskConfigSchema } from './diskConfig';

/**
 * StartMonitoringRequest — Zod schema for the POST /start request body.
 *
 * Developer MUST implement this schema once the CPU/Memory/Disk schemas are defined.
 *
 * When monitoringType is 'local':
 *  - cpu, memory, disk each contain only usagePercentage
 * When monitoringType is 'db':
 *  - cpu, memory, disk contain the full hardware config
 *
 * Use z.discriminatedUnion or z.union + .refine() to enforce the correct shape:
 *
 *  export const StartMonitoringRequestSchema = z.object({
 *    monitoringType: z.enum(['local', 'db']),
 *    cpu:    z.union([LocalCpuConfigSchema, DbCpuConfigSchema]),
 *    memory: z.union([LocalMemoryConfigSchema, DbMemoryConfigSchema]),
 *    disk:   z.union([LocalDiskConfigSchema, DbDiskConfigSchema]),
 *  }).refine((data) => {
 *    // validate that child fields match the declared monitoringType
 *    ...
 *  });
 *
 *  export type StartMonitoringRequest = z.infer<typeof StartMonitoringRequestSchema>;
 */
