import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * validator — generic Zod validation middleware factory.
 *
 * Works like a NestJS pipe/decorator: applied per-route before the controller handler.
 * On success, replaces req[target] with the parsed (coerced) data.
 * On failure, forwards the raw ZodError to the Express error middleware via next().
 *
 * @param schema - Zod schema to validate against
 * @param target - Which part of the request to validate: 'body' or 'params'
 */
export const validator =
    (schema: ZodSchema, target: 'body' | 'params') =>
        (req: Request, _res: Response, next: NextFunction): void => {
            const result = schema.safeParse(req[target]);
            if (!result.success) {
                next(result.error); // forward ZodError — handled by createErrorMiddleware
                return;
            }
            // Replace with parsed/coerced value so handlers receive clean data
            req[target] = result.data;
            next();
        };