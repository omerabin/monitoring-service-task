import { z } from 'zod';

export const MemoryConfigSchema = z.object({
    totalGb: z.number().positive(),
    usedGb: z.number().min(0),
    usagePercentage: z.number().min(0).max(100),
});

export type MemoryConfig = z.infer<typeof MemoryConfigSchema>;
