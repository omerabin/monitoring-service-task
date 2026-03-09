import { z } from 'zod';
import { Response } from 'express';
import { ResourceType } from '../validators/connectParams';

/**
 * SessionId — UUID v4, validated by Zod.
 * Developers must generate this with a UUID library (e.g., `uuid` v4) and
 * validate/narrowing it through SessionIdSchema before storing in SseSession.
 */
export const SessionIdSchema = z.string().uuid();
export type SessionId = z.infer<typeof SessionIdSchema>;

/**
 * Describes a single active SSE connection session.
 *
 * Developer must:
 *  - Generate a UUID (v4) per connection, validate it with SessionIdSchema,
 *    and store the result as sessionId.
 *  - Hold a reference to the Express Response object for streaming.
 *  - Track the resourceType being monitored for this session.
 *  - Clean up this session on client disconnect.
 */
export interface SseSession {
    sessionId: SessionId;
    resourceType: ResourceType;
    res: Response;
}

/**
 * Registry type for tracking all active SSE sessions.
 * Key = sessionId, Value = SseSession
 */
export type SseSessionMap = Map<string, SseSession>;
