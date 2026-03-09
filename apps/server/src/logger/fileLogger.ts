import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../interfaces/logger';

/**
 * FileLogger — writes info-level metric data to a session-scoped log file.
 *
 * Only `info()` writes to the file. debug/warn/error are no-ops because those
 * levels belong to the console-backed Logger used in the error middleware.
 *
 * Format: [INFO] <ISO-8601 timestamp> <message>
 */
export class FileLogger implements Logger {
    private readonly filePath: string;

    constructor(filePath: string) {
        // Ensure the logs directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        this.filePath = filePath;
    }

    debug(_message: string): void {
        // FileLogger does not handle debug — use the basic console Logger instead
    }

    info(message: string): void {
        const line = `[INFO] ${new Date().toISOString()} ${message}\n`;
        fs.appendFileSync(this.filePath, line, 'utf8');
    }

    warn(_message: string): void {
        // FileLogger does not handle warn — use the basic console Logger instead
    }

    error(_message: string): void {
        // Errors must NOT be written to file — use the console-backed Logger instead
    }
}
