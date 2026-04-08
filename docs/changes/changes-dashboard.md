---
type: index
tags:
  - changes
  - dashboard
---

# Change Packages

> [!tip] Живой дашборд
> Таблица ниже автоматически обновляется из frontmatter всех change packages.

## Active changes

```dataview
TABLE id, status, domains, owner
FROM "changes"
WHERE type = "change" AND status != "done"
SORT status ASC
```

## All changes

```dataview
TABLE id, status, domains, created
FROM "changes"
WHERE type = "change"
SORT created DESC
```

## Open questions across all changes

```dataview
TASK FROM "changes"
WHERE !completed AND contains(file.name, "open-questions")
GROUP BY file.folder
```

## Pipeline

```mermaid
graph LR
    D[Draft] --> DI[Discovery]
    DI --> SP[Spec]
    SP --> AN[Analysis]
    AN --> IP[In Progress]
    IP --> DN[Done]

    style D fill:#6c757d,color:#fff
    style DI fill:#ffc107,color:#000
    style SP fill:#fd7e14,color:#fff
    style AN fill:#dc3545,color:#fff
    style IP fill:#0d6efd,color:#fff
    style DN fill:#198754,color:#fff
```
