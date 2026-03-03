import { MonitoringStrategy, LoggerDataProvider, MonitoringTarget } from '../interfaces/monitoringStrategy';
import { Logger } from '../interfaces/logger';
import { FileLogger } from '../logger';
import { LocalMonitoringStrategy } from '../strategies/localMonitoringStrategy';
import { DbMonitoringStrategy } from '../strategies/dbMonitoringStrategy';
import { createLoggerDataProvider } from '../providers/loggerDataProvider';

// ---------------------------------------------------------------------------
// Provider Factory Interface
// ---------------------------------------------------------------------------

/**
 * ProviderFactory — the DI composition root for all strategy and provider creation.
 *
 * Rules:
 *  - getLogger()        → returns the shared application-level Logger instance.
 *  - createService()    → returns the appropriate MonitoringStrategy by target.
 *                         Services consume MonitoringStrategy without knowing the source.
 *  - createDataLogger() → returns a fresh LoggerDataProvider for a new SSE session.
 */
export interface ProviderFactory {
    getLogger(): Logger;
    createService(target: MonitoringTarget): MonitoringStrategy;
    createDataLogger(): LoggerDataProvider;
}

// ---------------------------------------------------------------------------
// Factory Implementation
// ---------------------------------------------------------------------------

export const createProviderFactory = (): ProviderFactory => {
    // Strategies are instantiated once and selected by target key.
    const strategies: Record<MonitoringTarget, MonitoringStrategy> = {
        local: LocalMonitoringStrategy(),
        db: DbMonitoringStrategy(),
    };

    // Logger is created once inside the factory — accessible to all consumers via getLogger().
    const logger: Logger = new FileLogger();

    // Define each method before returning so the return is purely declarative.
    const getLogger = (): Logger => logger;

    const createService = (target: MonitoringTarget): MonitoringStrategy =>
        strategies[target];

    const createDataLogger = (): LoggerDataProvider => createLoggerDataProvider();

    return { getLogger, createService, createDataLogger };
};
