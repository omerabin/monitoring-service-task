import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * validator — generic Zod validation middleware factory.
 *
 * Works like a NestJS pipe/decorator: applied per-route before the controller handler.
 * On success, replaces req[target] with the parsed (coerced) data.
 * On failure, forwards the raw ZodError to the Express error middleware via next().
 *
 * Developer MUST implement the function body:
 *  1. Call schema.safeParse(req[target]) to validate the request data.
 *  2. If result.success is false → call next(result.error) and return.
 *     The raw ZodError is forwarded to createErrorMiddleware for structured handling.
 *  3. If result.success is true → replace req[target] with result.data (parsed/coerced),
 *     then call next() to proceed to the route handler.
 *
 * @param schema - Zod schema to validate against
 * @param target - Which part of the request to validate: 'body' or 'params'
 */
export const validator =
    (schema: ZodSchema, _target: 'body' | 'params') =>
        (_req: Request, _res: Response, _next: NextFunction): void => {
            void schema;
            throw new Error('validator middleware not implemented');
        };
