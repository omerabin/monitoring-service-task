import { z } from 'zod';

/**
 * Zod schema for the POST /connect/:resourceType route params.
 */
export const ConnectParamsSchema = z.object({
    resourceType: z.enum(['cpu', 'memory', 'disk']),
});

export type ConnectParams = z.infer<typeof ConnectParamsSchema>;
