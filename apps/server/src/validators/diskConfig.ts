import { z } from 'zod';

// ── LocalDiskConfigSchema (local OS monitoring) ───────────────────────────────
// Only usagePercentage needed.

export const LocalDiskConfigSchema = z.object({
    usagePercentage: z.number().min(0).max(100),
});
export type LocalDiskConfig = z.infer<typeof LocalDiskConfigSchema>;

// ── DbDiskConfigSchema (fake DB / remote monitoring) ─────────────────────────
// Full disk config included.

export const DbDiskConfigSchema = z.object({
    totalGb: z.number().positive(),
    usedGb: z.number().min(0),
    usagePercentage: z.number().min(0).max(100),
});
export type DbDiskConfig = z.infer<typeof DbDiskConfigSchema>;

// ── Union ─────────────────────────────────────────────────────────────────────
export type DiskConfig = LocalDiskConfig | DbDiskConfig;
