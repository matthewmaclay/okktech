---
type: aggregate
domain: training-session
tags:
  - domain/training-session
  - aggregate
---

# Aggregates · Training Session

## Session

### Responsibility
Управляет жизненным циклом одной тренировочной сессии: от создания через обмен сообщениями до завершения с фиксацией outcome.

### State diagram

```mermaid
stateDiagram-v2
    [*] --> draft
    draft --> in_progress: start()
    in_progress --> completed: finish() / turn_limit / manual
    in_progress --> abandoned: timeout(30min) / manual(0 turns)
    in_progress --> timed_out: ai_generation_timeout
    completed --> [*]
    abandoned --> [*]
    timed_out --> [*]
```

### Boundaries
- Содержит упорядоченный список Turn
- Хранит ссылку на Scenario (по scenarioId) и Learner (по learnerId)
- Хранит текущий статус, метаданные (время старта, лимиты), и outcome
- Не содержит сам шаблон сценария и не хранит оценку

### Structure

```mermaid
erDiagram
    SESSION ||--o{ TURN : contains
    SESSION }o--|| SCENARIO : "created from (ref)"
    SESSION }o--|| LEARNER : "belongs to (ref)"
    SESSION {
        uuid id PK
        uuid scenarioId FK
        uuid learnerId FK
        enum status "draft|in_progress|completed|abandoned|timed_out"
        int maxTurns
        enum outcome "completed|abandoned|timed_out"
        timestamp startedAt
        timestamp finishedAt
    }
    TURN {
        uuid id PK
        int turnNumber "unique within session"
        text userMessage
        text aiResponse
        int durationMs
        enum status "pending_user|pending_ai|completed"
    }
```

### Consistency rules
- Новый Turn можно добавить только в статусе `in_progress`
- Переход статуса только вперёд: `draft → in_progress → completed | abandoned | timed_out`
- Количество Turns не может превышать `maxTurns` (задаётся при создании из сценария)
- При завершении обязательно фиксируется outcome

### Cannot be split from
- **Turn** — ходы существуют только внутри сессии и не имеют смысла вне её контекста
