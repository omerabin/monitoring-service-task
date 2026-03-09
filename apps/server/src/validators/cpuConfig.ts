//import { z } from 'zod';

/**
 * CpuConfig Zod schemas — two variants based on monitoring type.
 *
 * Developer MUST implement both schemas and export the types:
 *
 * ── LocalCpuConfigSchema (local OS monitoring) ────────────────────────────
 *  Only usagePercentage is needed — no total/hardware data required.
 *
 *  export const LocalCpuConfigSchema = z.object({
 *    usagePercentage: z.number().min(0).max(100),
 *  });
 *  export type LocalCpuConfig = z.infer<typeof LocalCpuConfigSchema>;
 *
 * ── DbCpuConfigSchema (fake DB / remote monitoring) ──────────────────────
 *  Full hardware config included (used by the DB fake-data strategy).
 *
 *  export const DbCpuConfigSchema = z.object({
 *    cores:           z.number().int().positive(),
 *    threads:         z.number().int().positive(),
 *    frequencyGHz:    z.number().positive(),
 *    usagePercentage: z.number().min(0).max(100),
 *  });
 *  export type DbCpuConfig = z.infer<typeof DbCpuConfigSchema>;
 *
 * ── Union ─────────────────────────────────────────────────────────────────
 *  export type CpuConfig = LocalCpuConfig | DbCpuConfig;
 *
 * ── Discriminated union via refine (if used in a single pipeline) ─────────
 *  Use z.union([LocalCpuConfigSchema, DbCpuConfigSchema]).refine(...) to
 *  validate that the fields match the active monitoringType discriminator.
 */
