import { Request, Response, NextFunction } from 'express';
import { Logger } from '../interfaces/logger';

/**
 * Custom application error class.
 *
 * Use this to distinguish operational errors (expected) from programmer
 * errors (unexpected). The `statusCode` maps directly to the HTTP response status.
 */
export class AppError extends Error {
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
 * Well-known error types used throughout the application.
 * Throw these (via AppError) to trigger the correct HTTP response.
 */
export const ErrorCode = {
    /** Thrown when POST /connect is called before POST /start */
    SYSTEM_NOT_STARTED: 'SYSTEM_NOT_STARTED',
    /** Thrown when > 5 concurrent SSE connections are attempted */
    MAX_CONNECTIONS_EXCEEDED: 'MAX_CONNECTIONS_EXCEEDED',
} as const;

/**
 * createErrorMiddleware — functional error-handling middleware factory.
 *
 * Developer MUST implement:
 *  - Distinguish AppError (operational) from unknown runtime errors
 *  - Log every error via the injected logger
 *  - Return JSON: { error: string, code?: string }
 *  - Set the correct HTTP status code
 *  - Never leak stack traces to the client in production
 *
 * @param logger - Injected Logger implementation (no console.log)
 */
export const createErrorMiddleware = (logger: Logger) => {
    return (
        err: unknown,
        _req: Request,
        res: Response,
        _next: NextFunction
    ): void => {
        // TODO: implement error classification, logging, and JSON response
        void logger;
        void err;
        void res;
        throw new Error('createErrorMiddleware not implemented');
    };
};
