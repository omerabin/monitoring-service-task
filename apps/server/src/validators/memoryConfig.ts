//import { z } from 'zod';

/**
 * MemoryConfig Zod schemas — two variants based on monitoring type.
 *
 * Developer MUST implement both schemas and export the types:
 *
 * ── LocalMemoryConfigSchema (local OS monitoring) ─────────────────────────
 *  Only usagePercentage is needed — total/used GB are not required.
 *
 *  export const LocalMemoryConfigSchema = z.object({
 *    usagePercentage: z.number().min(0).max(100),
 *  });
 *  export type LocalMemoryConfig = z.infer<typeof LocalMemoryConfigSchema>;
 *
 * ── DbMemoryConfigSchema (fake DB / remote monitoring) ───────────────────
 *  Full memory config included.
 *
 *  export const DbMemoryConfigSchema = z.object({
 *    totalGb:         z.number().positive(),
 *    usedGb:          z.number().min(0),
 *    usagePercentage: z.number().min(0).max(100),
 *  });
 *  export type DbMemoryConfig = z.infer<typeof DbMemoryConfigSchema>;
 *
 * ── Union ─────────────────────────────────────────────────────────────────
 *  export type MemoryConfig = LocalMemoryConfig | DbMemoryConfig;
 *
 * ── Discriminated union via refine (if used in a single pipeline) ─────────
 *  Use z.union([LocalMemoryConfigSchema, DbMemoryConfigSchema]).refine(...) to
 *  validate that the fields match the active monitoringType discriminator.
 */
