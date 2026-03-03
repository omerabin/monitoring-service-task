import { Response } from 'express';

/**
 * Represents the type of metric object being monitored over SSE.
 */
export type ObjectType = 'cpu' | 'memory' | 'disk';

/**
 * Describes a single active SSE connection session.
 *
 * Developer must:
 *  - Generate a UUID (v4) per connection and store it as sessionId.
 *  - Hold a reference to the Express Response object for streaming.
 *  - Track the objectType and minAlert threshold for this session.
 *  - Clean up this session on client disconnect.
 */
export interface SseSession {
    sessionId: string;
    objectType: ObjectType;
    minAlert: number;
    res: Response;
}

/**
 * Registry type for tracking all active SSE sessions.
 * Key = sessionId, Value = SseSession
 */
export type SseSessionMap = Map<string, SseSession>;
