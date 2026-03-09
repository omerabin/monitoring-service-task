import { z } from 'zod';

// ── LocalMemoryConfigSchema (local OS monitoring) ─────────────────────────────
// Only usagePercentage needed.

export const LocalMemoryConfigSchema = z.object({
    usagePercentage: z.number().min(0).max(100),
});
export type LocalMemoryConfig = z.infer<typeof LocalMemoryConfigSchema>;

// ── DbMemoryConfigSchema (fake DB / remote monitoring) ────────────────────────
// Full memory config included.

export const DbMemoryConfigSchema = z.object({
    totalGb: z.number().positive(),
    usedGb: z.number().min(0),
    usagePercentage: z.number().min(0).max(100),
});
export type DbMemoryConfig = z.infer<typeof DbMemoryConfigSchema>;

// ── Union ─────────────────────────────────────────────────────────────────────
export type MemoryConfig = LocalMemoryConfig | DbMemoryConfig;
