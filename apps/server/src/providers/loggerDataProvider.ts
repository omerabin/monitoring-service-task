import * as path from 'path';
import { LoggerDataProvider } from '../interfaces/monitoringStrategy';
import { FileLogger } from '../logger/fileLogger';

/**
 * createLoggerDataProvider — factory for session-scoped file logging.
 *
 * Creates a FileLogger scoped to logs/<sessionId>.log.
 * The log() method writes structured metric events to that file.
 */
export const createLoggerDataProvider = (sessionId: string): LoggerDataProvider => {
    const logsDir = path.resolve(process.cwd(), 'logs');
    const filePath = path.join(logsDir, `${sessionId}.log`);
    const fileLogger = new FileLogger(filePath);

    return {
        log: (data: string): void => {
            fileLogger.info(data);
        },
    };
};