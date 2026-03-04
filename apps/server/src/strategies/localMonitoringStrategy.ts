/**
 * LocalMonitoringStrategy — reads real metrics from the host OS via Node's `os` module.
 *
 * Developer MUST design and implement the strategy pattern here.
 * The factory function must return a MonitoringStrategy object.
 *
 * Requirements:
 *  - getCpu()    → sample CPU usage % from os.cpus() (idle vs total tick delta)
 *  - getMemory() → compute used % from os.totalmem() and os.freemem()
 *  - getDisk()   → retrieve disk usage % via a library (e.g. `diskusage`) or by
 *                  spawning `df` with child_process
 *
 * Each method must return a Promise<number> in the range 0–100.
 * The service layer is unaware of HOW values are obtained — keep all OS detail here.
 */
