import { CpuConfig } from '../interfaces/cpu';
import { MemoryConfig } from '../interfaces/memory';
import { DiskConfig } from '../interfaces/disk';

/**
 * DTO for POST /start
 *
 * The request body must conform to this shape.
 * Developer must validate and transform incoming JSON into this interface.
 */
export interface CreateSystemDto {
    cpu: CpuConfig;
    memory: MemoryConfig;
    disk: DiskConfig;
}
