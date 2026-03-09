import { CpuConfig } from '../validators/cpuConfig';
import { MemoryConfig } from '../validators/memoryConfig';
import { DiskConfig } from '../validators/diskConfig';

/**
 * MonitoringStrategy interface.
 *
 * Concrete strategies (local OS / fake DB) implement this contract.
 * Services consume this interface without knowing the underlying source.
 */
export interface MonitoringStrategy {
    getCpu(): Promise<CpuConfig>;
    getMemory(): Promise<MemoryConfig>;
    getDisk(): Promise<DiskConfig>;
}

/**
 * LoggerDataProvider interface.
 *
 * Abstraction over the file-based logging mechanism used during metric cycles.
 * Concrete implementation must write entries to a session-scoped log file.
 */
export interface LoggerDataProvider {
    log(data: string): void;
}

/**
 * Discriminated union of valid monitoring targets.
 */
export type MonitoringTarget = 'local' | 'db';
