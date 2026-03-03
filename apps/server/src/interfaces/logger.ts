/**
 * Logger interface — must be implemented by the concrete Logger class.
 * All log output must go to file; no console.log allowed.
 */
export interface Logger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
