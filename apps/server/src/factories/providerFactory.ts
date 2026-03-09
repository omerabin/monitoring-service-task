import { MonitoringStrategy, LoggerDataProvider, MonitoringTarget } from '../interfaces/monitoringStrategy';
import { Logger } from '../interfaces/logger';
import { createLocalMonitoringStrategy } from '../strategies/localMonitoringStrategy';
import { createDbMonitoringStrategy } from '../strategies/dbMonitoringStrategy';
import { createLoggerDataProvider } from '../providers/loggerDataProvider';

// ---------------------------------------------------------------------------
// ConsoleLogger — console-backed Logger for errors/warnings (NOT FileLogger)
// ---------------------------------------------------------------------------

const createConsoleLogger = (): Logger => ({
    debug: (message: string): void => {
        process.stderr.write(`[DEBUG] ${new Date().toISOString()} ${message}\n`);
    },
    info: (message: string): void => {
        process.stderr.write(`[INFO] ${new Date().toISOString()} ${message}\n`);
    },
    warn: (message: string): void => {
        process.stderr.write(`[WARN] ${new Date().toISOString()} ${message}\n`);
    },
    error: (message: string): void => {
        process.stderr.write(`[ERROR] ${new Date().toISOString()} ${message}\n`);
    },
});

// ---------------------------------------------------------------------------
// ProviderFactory Interface
// ---------------------------------------------------------------------------

/**
 * ProviderFactory — the DI composition root for all strategy and provider creation.
 *
 *  - getLoggerDataProvider() → returns a fixed object with .getLogger() for the console Logger.
 *  - createService(target)   → returns the appropriate MonitoringStrategy by target key.
 *  - createDataLogger(sessionId) → creates a fresh LoggerDataProvider per SSE session.
 */
export interface ProviderFactory {
    getLoggerDataProvider(): { getLogger(): Logger };
    createService(target: MonitoringTarget): MonitoringStrategy;
    createDataLogger(sessionId: string): LoggerDataProvider;
}

// ---------------------------------------------------------------------------
// Factory Implementation
// ---------------------------------------------------------------------------

/**
 * createProviderFactory — builds and returns the application DI root.
 *
 * Both strategies and the console Logger are instantiated once inside the closure.
 * Server.ts calls this function once and passes the result down.
 */
export const createProviderFactory = (): ProviderFactory => {
    const consoleLogger = createConsoleLogger();
    const localStrategy = createLocalMonitoringStrategy();
    const dbStrategy = createDbMonitoringStrategy();

    return {
        getLoggerDataProvider: () => ({
            getLogger: (): Logger => consoleLogger,
        }),

        createService: (target: MonitoringTarget): MonitoringStrategy =>
            target === 'db' ? dbStrategy : localStrategy,

        createDataLogger: (sessionId: string): LoggerDataProvider =>
            createLoggerDataProvider(sessionId),
    };
};
