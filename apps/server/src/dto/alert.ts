/**
 * DTO representing an alert payload.
 *
 * Developer should populate this when a metric exceeds the configured
 * minAlert threshold and broadcast it to active SSE sessions.
 */
export interface AlertDto {
    sessionId: string;
    objectType: 'cpu' | 'memory' | 'disk';
    minAlert: number;
    currentValue: number;
    timestamp: string;
}
