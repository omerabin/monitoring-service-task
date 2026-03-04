import { z } from 'zod';

export const CpuConfigSchema = z.object({
    cores: z.number().int().positive(),
    threads: z.number().int().positive(),
    frequencyGHz: z.number().positive(),
    usagePercentage: z.number().min(0).max(100),
});

export type CpuConfig = z.infer<typeof CpuConfigSchema>;
