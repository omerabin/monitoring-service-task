/**
 * HttpError — custom application error class.
 *
 * Use this to distinguish operational errors (expected) from programmer
 * errors (unexpected). The `statusCode` maps directly to the HTTP response status.
 *
 * @param message       - Human-readable error description
 * @param statusCode    - HTTP status code to send in the response
 * @param isOperational - true for expected errors, false for bugs/programmer errors
 */
export class HttpError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Well-known error codes used throughout the application.
 * Throw these (via HttpError) to trigger the correct HTTP response.
 *
 * SYSTEM_NOT_STARTED      — POST /connect called before POST /start
 * MAX_CONNECTIONS_EXCEEDED — more than 5 concurrent SSE connections attempted
 * VALIDATION_ERROR         — request body or params failed Zod schema validation
 */
export const ErrorCode = {
    SYSTEM_NOT_STARTED: 'SYSTEM_NOT_STARTED',
    MAX_CONNECTIONS_EXCEEDED: 'MAX_CONNECTIONS_EXCEEDED',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;
