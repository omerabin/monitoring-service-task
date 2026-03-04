/**
 * DbMonitoringStrategy — returns fake/randomly-generated metric values.
 *
 * Developer MUST design and implement the strategy pattern here.
 * The factory function must return a MonitoringStrategy object.
 *
 * Requirements:
 *  - getCpu()    → return a random float between 0–100
 *  - getMemory() → return a random float between 0–100
 *  - getDisk()   → return a random float between 0–100
 *
 * Each method must return a Promise<number>.
 * This strategy simulates a remote DB data source without real I/O.
 * The service layer is completely unaware that the values are synthetic.
 */
