import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Logger } from '../interfaces/logger';
import { HttpError, ErrorCode } from '../errors/HttpError';

/**
 * createErrorMiddleware — functional error-handling middleware factory.
 *
 *  - ZodError   → 400 with structured field-level issues + VALIDATION_ERROR code
 *  - HttpError  → err.statusCode + { error, code }
 *  - Unknown    → 500 Internal server error (never leaks stack traces)
 */
export const createErrorMiddleware = ({ logger }: { logger: Logger }) => {
    return (
        err: unknown,
        _req: Request,
        res: Response,
        _next: NextFunction
    ): void => {
        if (err instanceof ZodError) {
            res.status(400).json({
                error: err.issues,
                code: ErrorCode.VALIDATION_ERROR,
            });
            return;
        }

        if (err instanceof HttpError) {
            logger.error(`[HttpError] ${err.statusCode} — ${err.message}`);
            res.status(err.statusCode).json({
                error: err.message,
                code: err.isOperational ? ErrorCode.MAX_CONNECTIONS_EXCEEDED : undefined,
            });
            return;
        }

        // Unknown / unexpected error — never leak internals
        logger.error(`[UnexpectedError] ${String(err)}`);
        res.status(500).json({ error: 'Internal server error' });
    };
};
