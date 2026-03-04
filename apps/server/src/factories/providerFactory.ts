// import { MonitoringStrategy, LoggerDataProvider, MonitoringTarget } from '../interfaces/monitoringStrategy';
// import { Logger } from '../interfaces/logger';

// ---------------------------------------------------------------------------
// Provider Factory Interface
// ---------------------------------------------------------------------------

/**
 * ProviderFactory — the DI composition root for all strategy and provider creation.
 *
 * Developer MUST design and implement `createProviderFactory`.
 *
 * Rules:
 *  - getLogger()        → return the shared application-level Logger instance.
 *                         Instantiate it once inside the factory (e.g. new FileLogger()).
 *  - createService(target) → return the appropriate MonitoringStrategy by target key.
 *                            Instantiate both strategies once; select by target.
 *                            Services consume MonitoringStrategy without knowing the source.
 *  - createDataLogger() → return a fresh LoggerDataProvider for each new SSE session.
 *                         Call createLoggerDataProvider() (from providers/) each time.
 */
export interface ProviderFactory {
}

// ---------------------------------------------------------------------------
// Factory Implementation
// ---------------------------------------------------------------------------

/**
 * createProviderFactory — builds and returns the application DI root.
 *
 * Developer MUST implement this function following the rules above.
 * All strategies and the logger should be instantiated inside this factory
 * so app.ts only needs to call createProviderFactory() once.
 */
export const createProviderFactory = (): ProviderFactory => {
    throw new Error('createProviderFactory not implemented');
};
