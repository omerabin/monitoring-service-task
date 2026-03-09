/**
 * Logger interface — must be implemented by the concrete Logger class.
 *
 * Logging semantics:
 *  - error / warn / debug → go to console (via the basic Logger implementation)
 *  - info (metric events)  → go to file (via FileLogger, used by LoggerDataProvider)
 *
 * The main application-level Logger writes errors to console.
 * FileLogger is a separate specialisation used only for info-level metric data.
 */
export interface Logger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
