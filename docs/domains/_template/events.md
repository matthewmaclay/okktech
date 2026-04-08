---
type: events
domain: DOMAIN_NAME
tags:
  - domain/DOMAIN_NAME
  - event
---

# Domain events · [Domain name]

| Event | Producer | Consumers | Payload | Guarantees | Idempotency |
|---|---|---|---|---|---|

## Event flow

```mermaid
sequenceDiagram
    participant P as Producer
    participant C1 as Consumer 1
    participant C2 as Consumer 2

    P->>C1: EventName
    P->>C2: EventName
```
