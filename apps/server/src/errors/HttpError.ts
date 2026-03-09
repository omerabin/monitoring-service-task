/**
 * HttpError — custom application error class.
 *
 * Use this to distinguish operational errors (expected) from programmer
 * errors (unexpected). The `statusCode` maps directly to the HTTP response status.
 *
 * @param message       - Human-readable error description
 * @param statusCode    - HTTP status code to send in the response (use HttpStatusCode enum)
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
 * HttpStatusCode — numeric HTTP status codes used throughout the application.
 * Use these constants in `new HttpError(message, HttpStatusCode.BAD_REQUEST)` calls.
 */
export const HttpStatusCode = {
    // 4xx Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    // 5xx Server Errors
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = typeof HttpStatusCode[keyof typeof HttpStatusCode];

/**
 * Well-known error codes used throughout the application.
 * Throw these (via HttpError) to trigger the correct HTTP response.
 *
 * MAX_CONNECTIONS_EXCEEDED  — more than 5 concurrent SSE connections attempted
 * VALIDATION_ERROR          — request body or params failed Zod schema validation
 */
export const ErrorCode = {
    MAX_CONNECTIONS_EXCEEDED: 'MAX_CONNECTIONS_EXCEEDED',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;
