import { Request, Response, NextFunction } from 'express';
import { Logger } from '../interfaces/logger';
import { HttpError, ErrorCode } from '../errors/HttpError';


/**
 * createErrorMiddleware — functional error-handling middleware factory.
 *
 * Developer MUST implement the returned Express error handler:
 *  - If `err` is a ZodError → respond 400 with structured field-level issues
 *    and code ErrorCode.VALIDATION_ERROR
 *  - If `err` is an HttpError → log it via `logger.error(...)` to console,
 *    respond with err.statusCode and JSON: { error: err.message, code?: string }
 *  - Otherwise → log as unexpected error via `logger.error(...)` to console, respond 500
 *  - Never leak stack traces to the client in production
 *
 * @param logger - Injected console-backed Logger (NOT FileLogger).
 *                 All error logging here goes to console via logger.error().
 *                 FileLogger is only for info-level metric data in the data provider.
 */
export const createErrorMiddleware = ({ logger }: { logger: Logger }) => {
    void logger;
    void HttpError;
    void ErrorCode;
    return (
        _err: unknown,
        _req: Request,
        _res: Response,
        _next: NextFunction
    ): void => {
        throw new Error('createErrorMiddleware not implemented');
    };
};
