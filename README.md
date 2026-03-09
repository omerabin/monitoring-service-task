# Monitoring Service — Architecture Skeleton

> **This is an architecture test project.**
> The skeleton defines the full dependency injection graph, interfaces, types, and route signatures.
> **You must implement all business logic.** Nothing executes meaningfully until you do.

---

## Project Goal

This project tests your ability to implement a production-quality monitoring service following strict architectural rules. The skeleton gives you the structure. Your job is to fill in every `TODO` without violating the constraints below.

The service exposes two HTTP routes:

| `/metrics/connect/:resourceType` | POST | Open an SSE stream for a given metric type |

---

## What You MUST Implement

### Core Logic
- [ ] **`FileLogger`** (`src/logger.ts`) — write `[DEBUG/INFO/WARN/ERROR] <ISO timestamp> <message>` to a file. No `console.log` anywhere.
- [ ] **`LocalMonitoringStrategy`** (`src/factories/providerFactory.ts`) — use Node's `os` module to read real CPU, memory, and disk usage.
- [ ] **`DbMonitoringStrategy`** (`src/factories/providerFactory.ts`) — return random float values (0–100) simulating a remote DB source.
- [ ] **`LoggerDataProvider`** (`src/factories/providerFactory.ts`) — write metric events to a session-scoped file (`logs/<sessionId>.log`).
- [ ] **`metricsService.collectMetrics`** (`src/services/metricsService.ts`) — call `strategy.getCpu()`, `strategy.getMemory()`, `strategy.getDisk()`, and return a `SystemMetrics` object.
- [ ] **Wire `createMetricsService`** inside `createMetricsController` — remove the throw and inject the service properly.



### `metricsController.connect`
- **Enforce max 5 connections**. If `sessions.size >= MAX_SSE_CONNECTIONS`, call `next(new AppError('...', 429))` with `ErrorCode.MAX_CONNECTIONS_EXCEEDED`.
- `req.params.resourceType` is **already validated** as a `ResourceType` by the upstream `validator(ConnectParamsSchema, 'params')` middleware.
- **Generate a UUID** (v4) for the session.
- **Set SSE headers**: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`.
- **Register** the session in the `sessions` map.
- **Start interval** (`METRICS_INTERVAL_MS = 30 000 ms`):
  1. Call `service.collectMetrics()`.
  2. Stream result via `res.write(`data: ${JSON.stringify(metrics)}\n\n`)`.
  3. Log to file via `loggerDataProvider.log(sessionId, ...)`.
- **On disconnect** (`req.on('close', ...)`): clear interval, delete session from map.

### Error Middleware (`src/middleware/error.ts`)
- Distinguish `AppError` (operational) from unknown errors.
- Log every error via the injected logger.
- Return `{ error: string, code?: string }` JSON with the correct HTTP status code.
- Never leak stack traces to clients in production.

### Observer Pattern
- Implement `Observer<ServiceMetrics>` and `Subject<ServiceMetrics>` (defined in `src/interfaces/observer.ts`).
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



### `POST /metrics/connect/:resourceType`

**Params**
- `resourceType` — `"cpu"` | `"memory"` | `"disk"`

**SSE Events (streamed every 30 s)**
```
data: {"cpu":{...},"memory":{...},"disk":{...},"timestamp":"..."}
```

**Error responses (JSON)**
```json
{ "error": "Maximum SSE connections reached (5).", "code": "MAX_CONNECTIONS_EXCEEDED" }
{ "error": [{"code": "invalid_enum_value", "path": ["resourceType"], "message": "..."}], "code": "VALIDATION_ERROR" }
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
│   └── metricsController.ts      ← connect handler (implement me)
├── services/
│   └── metricsService.ts         ← collectMetrics (implement me)
├── factories/
│   └── providerFactory.ts        ← strategies + logger provider (implement me)
├── routes/
│   └── metrics.ts                ← POST /connect/:resourceType
├── middleware/
│   └── error.ts                  ← error handler (implement me)

├── interfaces/
│   ├── cpu.ts                    ← CpuConfig
│   ├── memory.ts                 ← MemoryConfig
│   ├── disk.ts                   ← DiskConfig
│   ├── systemMetrics.ts          ← SystemMetrics
│   ├── observer.ts               ← Observer<T>, Subject<T>
│   ├── logger.ts                 ← Logger interface
│   └── monitoringStrategy.ts     ← MonitoringStrategy, LoggerDataProvider, MonitoringTarget
├── validators/
│   ├── cpuConfig.validator.ts        ← Zod schema for CpuConfig
│   ├── memoryConfig.validator.ts     ← Zod schema for MemoryConfig
│   ├── diskConfig.validator.ts       ← Zod schema for DiskConfig
│   └── connectParams.validator.ts   ← Zod schema for POST /connect/:resourceType params
└── types/
    └── sse.ts                    ← SseSession, SseSessionMap, ResourceType
```
