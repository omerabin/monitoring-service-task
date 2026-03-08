import { Logger } from '../interfaces/logger';

/**
 * FileLogger — concrete implementation placeholder.
 *
 * FileLogger is used ONLY for writing info-level metric data to a session-scoped
 * log file. It is NOT used for error logging — errors must go to console via
 * the basic Logger implementation.
 *
 * Developer MUST implement:
 *  - Writing info-level metric log entries to a session-scoped file (e.g., logs/<sessionId>.log)
 *  - ISO timestamp prefix on every log line
 *  - Proper file stream management and cleanup on process exit
 *  - No console.log — all output goes to file
 *
 * The constructor may accept a session ID or log file path so that
 * each SSE session writes to its own isolated log file.
 *
 * Error, warn, and debug levels are NOT written to file — those belong
 * to the console-backed Logger used in the error middleware.
 */
export class FileLogger implements Logger {
    // TODO: inject a writable stream or file path via constructor

    debug(_message: string): void {
        // FileLogger does not handle debug — use the basic console Logger instead
        throw new Error('FileLogger.debug not implemented');
    }

    info(_message: string): void {
        // TODO: write "[INFO] <timestamp> <message>" to log file
        // This is the only level actively used by FileLogger (metric info events)
        throw new Error('FileLogger.info not implemented');
    }

    warn(_message: string): void {
        // FileLogger does not handle warn — use the basic console Logger instead
        throw new Error('FileLogger.warn not implemented');
    }

    error(_message: string): void {
        // Errors must NOT be written to file.
        // Use the basic console-backed Logger for error logging instead.
        throw new Error('FileLogger.error not implemented — errors go to console Logger');
    }
}
