import { z } from 'zod';

export const DiskConfigSchema = z.object({
    totalGb: z.number().positive(),
    usedGb: z.number().min(0),
    usagePercentage: z.number().min(0).max(100),
});

export type DiskConfig = z.infer<typeof DiskConfigSchema>;
