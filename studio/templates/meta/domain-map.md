---
type: meta
tags:
  - meta
  - map
---

# Domain Map

## Overview

```mermaid
graph TB
    subgraph Core
        TS[Training Session]
    end

    subgraph Planned
        SC[Scenario Catalog]
        AS[Assessment]
        LP[Learner Progress]
    end

    subgraph Infrastructure
        LLM[LLM Gateway]
        AUTH[Auth / Identity]
        AN[Analytics]
    end

    SC -->|provides scenario| TS
    AUTH -->|validates user| TS
    TS -->|generates responses| LLM
    TS -->|SessionFinished| AS
    TS -->|SessionFinished| LP
    TS -->|all events| AN

    style TS fill:#4a9eff,color:#fff
    style SC fill:#ffc107,color:#000
    style AS fill:#ffc107,color:#000
    style LP fill:#ffc107,color:#000
    style LLM fill:#6c757d,color:#fff
    style AUTH fill:#6c757d,color:#fff
    style AN fill:#6c757d,color:#fff
```

> [!info] Legend
> - Синий: Active (домен задокументирован)
> - Жёлтый: Planned (упоминается в интеграциях, но не создан)
> - Серый: Infrastructure (внешние сервисы)

## Active domains

```dataview
TABLE owner, status, length(file.inlinks) AS "refs"
FROM "domains"
WHERE type = "domain"
SORT domain
```

## Domain relationships

```dataview
TABLE domain, file.folder AS "path"
FROM "domains"
WHERE type = "integrations"
SORT domain
```
