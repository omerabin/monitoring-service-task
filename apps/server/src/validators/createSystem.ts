import { z } from 'zod';
import { CpuConfigSchema } from './cpuConfig';
import { MemoryConfigSchema } from './memoryConfig';
import { DiskConfigSchema } from './diskConfig';

/**
 * Zod schema for the POST /start request body.
 * Composes the three hardware config schemas.
 */
export const StartMonitoringRequestSchema = z.object({
    cpu: CpuConfigSchema,
    memory: MemoryConfigSchema,
    disk: DiskConfigSchema,
});

export type StartMonitoringRequest = z.infer<typeof StartMonitoringRequestSchema>;
