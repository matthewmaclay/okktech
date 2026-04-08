---
type: change
domain: training-session
status: done
tags:
  - change/CHG-0000
  - domain/training-session
  - decisions
created: 2026-04-08
---

# Decisions · CHG-0000

## Decision log

### DEC-001: Cache vs Regenerate

- **Date:** 2026-04-08
- **Made by:** Иван Сидоров, Анна Петрова
- **Options considered:**
  1. **Cache once (generate and store forever)** — ретроспектива генерируется один раз и сохраняется навсегда. Повторные запросы возвращают кешированный результат.
  2. **Allow regeneration** — пользователь может запросить повторную генерацию, старый результат заменяется новым.
  3. **TTL cache (expire after 30 days)** — ретроспектива кешируется, но через 30 дней удаляется и может быть перегенерирована.
- **Decision:** Option 1 — Cache once (generate and store forever)
- **Rationale:**
  - Консистентность: пользователь всегда видит одни и те же оценки → доверие к системе
  - Совместимость с инвариантом «завершённая сессия immutable» — ретроспектива как часть Session тоже immutable
  - Экономия LLM-бюджета: один вызов на сессию
  - Простота реализации: нет логики версионирования
- **Trade-offs accepted:**
  - Если промпт улучшится, старые ретроспективы не обновятся (приемлемо — они корректны на момент генерации)
  - Нет возможности «пересмотреть» анализ (приемлемо — assessment domain может дать другую точку зрения)

---

### DEC-002: Sync vs Async generation

- **Date:** 2026-04-08
- **Made by:** Иван Сидоров
- **Options considered:**
  1. **Synchronous (inline)** — API блокирует запрос до получения ответа от LLM. Простая реализация, но 10-30 секунд ожидания HTTP-ответа.
  2. **Asynchronous (job queue + polling)** — API возвращает 202, ставит задачу в очередь. Frontend поллит GET endpoint каждые 2 секунды.
  3. **Asynchronous (SSE / WebSocket)** — API возвращает 202, результат приходит через server-sent events или WebSocket.
- **Decision:** Option 2 — Asynchronous с job queue + polling
- **Rationale:**
  - HTTP timeout: 30-секундный ответ рискован для прокси и load balancer (default timeout 30s)
  - Job queue даёт retry, backpressure, observability из коробки (BullMQ)
  - Polling проще SSE: нет persistent connections, работает через CDN, нет проблем с reconnect
  - Polling каждые 2 секунды при ожидаемых 20 секундах генерации — ~10 запросов, приемлемая нагрузка
- **Trade-offs accepted:**
  - Polling создаёт небольшую дополнительную нагрузку на API (приемлемо: GET кешированного результата — быстрый)
  - UX менее responsive, чем SSE (приемлемо: skeleton + progress bar компенсируют)
  - Если в будущем нужен real-time — можно добавить SSE поверх, не ломая текущий контракт

---

### DEC-003: Separate table vs Embedded field

- **Date:** 2026-04-08
- **Made by:** Иван Сидоров
- **Options considered:**
  1. **Embedded JSONB field в таблице sessions** — добавить nullable колонку `retrospective JSONB` в существующую таблицу.
  2. **Separate table `retrospective_results`** — новая таблица с FK на sessions, 1:1 relation.
  3. **Separate microservice** — полностью отдельный сервис с собственной БД.
- **Decision:** Option 2 — Separate table
- **Rationale:**
  - Separation of concerns: sessions таблица не раздувается (retrospective ~5KB JSON)
  - Lazy loading: ретроспектива загружается только при прямом запросе, не при каждом SELECT sessions
  - Независимый lifecycle: generationStatus управляется отдельно от Session.status
  - Простота миграции: CREATE TABLE не блокирует sessions, rollback — DROP TABLE
  - Microservice (option 3) — overkill для данного scope, добавляет сетевую латентность и operational complexity
- **Trade-offs accepted:**
  - JOIN при запросе ретроспективы (приемлемо: 1:1 по PK, мгновенный)
  - Два INSERT при генерации: session update не нужен, только INSERT в retrospective_results (приемлемо)
  - Каскадное удаление: ON DELETE CASCADE, если сессия удаляется — ретроспектива тоже (маловероятно, completed sessions immutable)
