import { Logger } from '../interfaces/logger';

/**
 * FileLogger — concrete implementation placeholder.
 *
 * Developer MUST implement:
 *  - Writing log entries to a session-scoped file (e.g., logs/<sessionId>.log)
 *  - Proper file stream management and cleanup on process exit
 *  - ISO timestamp prefix on every log line
 *  - No console.log — all output goes to file
 *
 * The constructor may accept a session ID or log file path so that
 * each SSE session writes to its own isolated log file.
 */
export class FileLogger implements Logger {
    // TODO: inject a writable stream or file path via constructor

    debug(_message: string): void {
        // TODO: write "[DEBUG] <timestamp> <message>" to log file
        throw new Error('FileLogger.debug not implemented');
    }

    info(_message: string): void {
        // TODO: write "[INFO] <timestamp> <message>" to log file
        throw new Error('FileLogger.info not implemented');
    }

    warn(_message: string): void {
        // TODO: write "[WARN] <timestamp> <message>" to log file
        throw new Error('FileLogger.warn not implemented');
    }

    error(_message: string): void {
        // TODO: write "[ERROR] <timestamp> <message>" to log file
        throw new Error('FileLogger.error not implemented');
    }
}
