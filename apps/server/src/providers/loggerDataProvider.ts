import { LoggerDataProvider } from '../interfaces/monitoringStrategy';

/**
 * createLoggerDataProvider — factory for session-scoped file logging.
 *
 * Developer MUST implement:
 *  - Accept a sessionId to scope log files per SSE connection
 *  - Write structured metric events to a file: logs/<sessionId>.log
 *  - Handle file stream lifecycle (open on creation, close on session end)
 */
export const createLoggerDataProvider = (): LoggerDataProvider => ({
    log: (_sessionId: string, _data: string): void => {
        // TODO: append a timestamped line to logs/<sessionId>.log
        throw new Error('LoggerDataProvider.log not implemented');
    },
});
