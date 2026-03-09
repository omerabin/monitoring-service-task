//import { z } from 'zod';

/**
 * ConnectParams — Zod schema for the POST /connect/:resourceType route params.
 *
 * Developer MUST implement ConnectParamsSchema with:
 *  - resourceType: one of 'cpu' | 'memory' | 'disk'
 *
 *  export const ConnectParamsSchema = z.object({
 *    resourceType: z.enum(['cpu', 'memory', 'disk']),
 *  });
 *  export type ConnectParams = z.infer<typeof ConnectParamsSchema>;
 */

/**
 * ResourceType — the union of valid resource identifiers.
 * Derived manually here to allow sse.ts to reference the type before the
 * schema is implemented. Once ConnectParamsSchema is implemented above,
 * replace this with:
 *   export type ConnectParams = z.infer<typeof ConnectParamsSchema>;
 * and derive ResourceType from ConnectParams['resourceType'] in sse.ts.
 */
export type ResourceType = 'cpu' | 'memory' | 'disk';

export interface ConnectParams {
    resourceType: ResourceType;
}