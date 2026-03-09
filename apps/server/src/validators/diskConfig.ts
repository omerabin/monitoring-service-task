//import { z } from 'zod';

/**
 * DiskConfig Zod schemas — two variants based on monitoring type.
 *
 * Developer MUST implement both schemas and export the types:
 *
 * ── LocalDiskConfigSchema (local OS monitoring) ───────────────────────────
 *  Only usagePercentage is needed — total/used GB are not required.
 *
 *  export const LocalDiskConfigSchema = z.object({
 *    usagePercentage: z.number().min(0).max(100),
 *  });
 *  export type LocalDiskConfig = z.infer<typeof LocalDiskConfigSchema>;
 *
 * ── DbDiskConfigSchema (fake DB / remote monitoring) ─────────────────────
 *  Full disk config included.
 *
 *  export const DbDiskConfigSchema = z.object({
 *    totalGb:         z.number().positive(),
 *    usedGb:          z.number().min(0),
 *    usagePercentage: z.number().min(0).max(100),
 *  });
 *  export type DbDiskConfig = z.infer<typeof DbDiskConfigSchema>;
 *
 * ── Union ─────────────────────────────────────────────────────────────────
 *  export type DiskConfig = LocalDiskConfig | DbDiskConfig;
 *
 * ── Discriminated union via refine (if used in a single pipeline) ─────────
 *  Use z.union([LocalDiskConfigSchema, DbDiskConfigSchema]).refine(...) to
 *  validate that the fields match the active monitoringType discriminator.
 */
