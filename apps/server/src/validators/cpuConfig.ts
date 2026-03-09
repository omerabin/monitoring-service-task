import { z } from 'zod';

// ── LocalCpuConfigSchema (local OS monitoring) ────────────────────────────────
// Only usagePercentage is needed — no hardware/total data required.

export const LocalCpuConfigSchema = z.object({
    usagePercentage: z.number().min(0).max(100),
});
export type LocalCpuConfig = z.infer<typeof LocalCpuConfigSchema>;

// ── DbCpuConfigSchema (fake DB / remote monitoring) ───────────────────────────
// Full hardware config included.

export const DbCpuConfigSchema = z.object({
    cores: z.number().int().positive(),
    threads: z.number().int().positive(),
    frequencyGHz: z.number().positive(),
    usagePercentage: z.number().min(0).max(100),
});
export type DbCpuConfig = z.infer<typeof DbCpuConfigSchema>;

// ── Union ─────────────────────────────────────────────────────────────────────
export type CpuConfig = LocalCpuConfig | DbCpuConfig;
