---
type: index
tags:
  - domains
  - dashboard
---

# Domains

> [!tip] Живой дашборд
> Таблица ниже автоматически собирается из frontmatter domain README.

## All domains

```dataview
TABLE owner, status, length(file.outlinks) AS "links"
FROM "domains"
WHERE type = "domain"
SORT domain
```

## Invariants across all domains

```dataview
TASK FROM "domains"
WHERE file.name = "invariants"
GROUP BY file.folder
```

## Domain events

```dataview
TABLE domain
FROM "domains"
WHERE type = "events"
SORT domain
```
