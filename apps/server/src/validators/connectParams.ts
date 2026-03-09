import { z } from 'zod';

/**
 * ConnectParamsSchema — Zod schema for the POST /connect/:resourceType route params.
 */
export const ConnectParamsSchema = z.object({
    resourceType: z.enum(['cpu', 'memory', 'disk']),
});

export type ConnectParams = z.infer<typeof ConnectParamsSchema>;

/**
 * ResourceType — derived from ConnectParams so there is a single source of truth.
 */
export type ResourceType = ConnectParams['resourceType'];