# Monitoring Service — Architecture Skeleton

> **This is an architecture test project.**
> The skeleton defines the full dependency injection graph, interfaces, types, and route signatures.
> **You must implement all business logic.** Nothing executes meaningfully until you do.

---

## Project Goal

This project tests your ability to implement a production-quality monitoring service following strict architectural rules. The skeleton gives you the structure. Your job is to fill in every `TODO` without violating the constraints below.

The service exposes two HTTP routes:

| Route | Method | Purpose |
|---|---|---|
| `/metrics/start` | POST | Initialise the system with CPU/memory/disk config |
| `/metrics/connect/:objectType/:minAlert` | POST | Open an SSE stream for a given metric type |

---

## What You MUST Implement

### Core Logic
- [ ] **`FileLogger`** (`src/logger.ts`) — write `[INFO/WARN/ERROR] <ISO timestamp> <message>` to a file. No `console.log` anywhere.
- [ ] **`LocalMonitoringStrategy`** (`src/factories/providerFactory.ts`) — use Node's `os` module to read real CPU, memory, and disk usage.
- [ ] **`DbMonitoringStrategy`** (`src/factories/providerFactory.ts`) — return random float values (0–100) simulating a remote DB source.
- [ ] **`LoggerDataProvider`** (`src/factories/providerFactory.ts`) — write metric events to a session-scoped file (`logs/<sessionId>.log`).
- [ ] **`metricsService.initSystem`** (`src/services/metricsService.ts`) — store the `CreateSystemDto` for later use during metric collection intervals.
- [ ] **`metricsService.collectMetrics`** (`src/services/metricsService.ts`) — call `strategy.getCpu()`, `strategy.getMemory()`, `strategy.getDisk()`, and return a `SystemMetrics` object.
- [ ] **Wire `createMetricsService`** inside `createMetricsController` — remove the throw and inject the service properly.

### `metricsController.start`
- Parse and validate `CreateSystemDto` from `req.body`.
- Call `service.initSystem(dto)`.
- Respond `200 { message: 'System started' }`.

### `metricsController.connect`
- **Validate** that `/start` has been called. If not, call `next(new AppError('...', 400))` with `ErrorCode.SYSTEM_NOT_STARTED`.
- **Enforce max 5 connections**. If `sessions.size >= MAX_SSE_CONNECTIONS`, call `next(new AppError('...', 429))` with `ErrorCode.MAX_CONNECTIONS_EXCEEDED`.
- **Generate a UUID** (v4) for the session.
- **Set SSE headers**: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`.
- **Register** the session in the `sessions` map.
- **Start interval** (`METRICS_INTERVAL_MS = 30 000 ms`):
  1. Call `service.collectMetrics()`.
  2. Stream result via `res.write(`data: ${JSON.stringify(metrics)}\n\n`)`.
  3. Log to file via `loggerDataProvider.log(sessionId, ...)`.
  4. Evaluate `minAlert` threshold; emit `event: alert` if exceeded.
- **On disconnect** (`req.on('close', ...)`): clear interval, delete session from map.

### Error Middleware (`src/middleware/error.ts`)
- Distinguish `AppError` (operational) from unknown errors.
- Log every error via the injected logger.
- Return `{ error: string, code?: string }` JSON with the correct HTTP status code.
- Never leak stack traces to clients in production.

### Observer Pattern
- Implement `Observer<SystemMetrics>` and `Subject<SystemMetrics>` (defined in `src/interfaces/observer.ts`).
- Wire SSE clients as observers on the metrics subject.
- `notify()` dispatches to all attached observers — one per SSE session.

---

## Architectural Expectations

| Rule | Detail |
|---|---|
| DI-first | All dependencies flow from `app.ts` downward via factory parameters |
| Functional style | No `class` except `FileLogger` and `AppError` |
| No globals | No module-level mutable singletons |
| No circular deps | Interfaces only in shared layers; no cross-service imports |
| No `console.log` | All output must go through `Logger` to file |
| No `any` / `unknown` | Strict TypeScript throughout |
| Observer for SSE | Each SSE session is an `Observer<SystemMetrics>` |
| Session isolation | Every SSE connection has its own UUID and log file |
| Max connections | Hard limit of 5 concurrent SSE sessions (enforced in controller) |
| Validate `/start` | `/connect` must throw if `/start` was never called |
| SOLID principles | Single responsibility, open/closed, dependency inversion everywhere |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `MONITORING_TARGET` | `local` | `"local"` (OS metrics) or `"db"` (fake generator) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run server in dev mode (from repo root)
npm run dev

# Build all packages
npm run build
```

---

## API Reference

### `POST /metrics/start`

**Body**
```json
{
  "cpu":    { "cores": 8, "threads": 16, "frequencyGHz": 3.6, "usagePercentage": 0 },
  "memory": { "totalGb": 32, "usedGb": 0, "usagePercentage": 0 },
  "disk":   { "totalGb": 512, "usedGb": 0, "usagePercentage": 0 }
}
```

**Response** `200 OK`
```json
{ "message": "System started" }
```

---

### `POST /metrics/connect/:objectType/:minAlert`

**Params**
- `objectType` — `"cpu"` | `"memory"` | `"disk"`
- `minAlert` — numeric threshold (e.g., `80`)

**SSE Events (streamed every 30 s)**
```
data: {"cpu":{...},"memory":{...},"disk":{...},"timestamp":"..."}

event: alert
data: {"sessionId":"...","objectType":"cpu","minAlert":80,"currentValue":91.2,"timestamp":"..."}
```

**Error responses (JSON)**
```json
{ "error": "System not started. Call /start first.", "code": "SYSTEM_NOT_STARTED" }
{ "error": "Maximum SSE connections reached (5).", "code": "MAX_CONNECTIONS_EXCEEDED" }
```

---

## Bonus Points

- **Unit tests** — mock the strategy and assert controller / service behaviour.
- **Graceful shutdown** — clear all intervals and close SSE connections on `SIGTERM`.
- **Connection tracking dashboard** — expose `GET /metrics/sessions` (read-only) showing active sessions.
- **Clean unsubscribe** — implement `Subject.detach` properly so no memory leaks occur.
- **Interface-driven design** — every exported function accepts and returns interfaces, never concrete types.

---

## File Map

```
apps/server/src/
├── app.ts                        ← DI composition root
├── server.ts                     ← HTTP server entry point
├── logger.ts                     ← FileLogger class (implement me)
├── controllers/
│   └── metricsController.ts      ← start + connect handlers (implement me)
├── services/
│   └── metricsService.ts         ← initSystem + collectMetrics (implement me)
├── factories/
│   └── providerFactory.ts        ← strategies + logger provider (implement me)
├── routes/
│   └── metrics.ts                ← POST /start, POST /connect/:objectType/:minAlert
├── middleware/
│   └── error.ts                  ← error handler (implement me)
├── dto/
│   ├── createSystem.ts           ← CreateSystemDto
│   └── alert.ts                  ← AlertDto
├── interfaces/
│   ├── cpu.ts                    ← CpuConfig
│   ├── memory.ts                 ← MemoryConfig
│   ├── disk.ts                   ← DiskConfig
│   ├── systemMetrics.ts          ← SystemMetrics
│   ├── observer.ts               ← Observer<T>, Subject<T>
│   ├── logger.ts                 ← Logger interface
│   └── monitoringStrategy.ts     ← MonitoringStrategy, LoggerDataProvider, MonitoringTarget
└── types/
    └── sse.ts                    ← SseSession, SseSessionMap, ObjectType
```
