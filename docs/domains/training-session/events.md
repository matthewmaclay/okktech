---
type: events
domain: training-session
tags:
  - domain/training-session
  - event
---

# Domain events · Training Session

| Event | Producer | Consumers | Payload | Guarantees | Idempotency |
|---|---|---|---|---|---|
| SessionStarted | Session | Assessment, Analytics | `{sessionId, learnerId, scenarioId, startedAt}` | at-least-once | by sessionId |
| TurnCompleted | Session | Analytics | `{sessionId, turnNumber, userMessage, aiResponse, durationMs}` | at-least-once | by sessionId + turnNumber |
| SessionFinished | Session | Assessment, Learner Progress, Analytics | `{sessionId, outcome, totalTurns, durationMs, finishedAt}` | at-least-once | by sessionId |
| SessionAbandoned | Session | Analytics, Learner Progress | `{sessionId, learnerId, lastTurnNumber, reason}` | at-least-once | by sessionId |

## Event flow

```mermaid
sequenceDiagram
    participant S as Session
    participant A as Assessment
    participant LP as Learner Progress
    participant AN as Analytics

    S->>AN: SessionStarted
    S->>AN: TurnCompleted (x N)
    alt completed / turn_limit
        S->>A: SessionFinished
        S->>LP: SessionFinished
        S->>AN: SessionFinished
    else abandoned / timeout
        S->>LP: SessionAbandoned
        S->>AN: SessionAbandoned
    end
```
