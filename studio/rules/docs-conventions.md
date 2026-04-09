---
paths:
  - "docs/**"
---

# Documentation conventions

## File naming
- Файлы: kebab-case на английском (`business-rules.md`, `ubiquitous-language.md`)
- Папки доменов: kebab-case (`training-session`, `scenario-catalog`)
- Change packages: `CHG-XXXX` (четырёхзначный номер)
- НЕ называть файлы `index.md` — Obsidian graph показывает имя файла. Используй осмысленные имена (`domains-dashboard.md`, `changes-dashboard.md`)
- Файлы внутри CHG-папок: по шаблону (`01-discovery.md`, `02-product-spec.md`, ...)

## Heading hierarchy
- H1 (`#`) — только один на файл, название документа
- H2 (`##`) — основные секции
- H3 (`###`) — подсекции
- H4+ — не использовать без необходимости

## YAML frontmatter (ОБЯЗАТЕЛЬНО)
Каждый .md файл в docs/ ДОЛЖЕН иметь frontmatter:
```yaml
---
type: domain | change | adr | meta | aggregate | events | invariants | business-rules | ubiquitous-language | integrations | ownership | index
domain: training-session    # если файл относится к домену
status: draft | active | accepted | deprecated
tags:
  - domain/training-session  # nested tag = домен
  - aggregate               # тип документа
owner: team-name
created: YYYY-MM-DD
---
```

## Tags (nested hierarchy)
```
#domain/<name>              — принадлежность к домену
#change/CHG-XXXX           — принадлежность к change package
#status/<state>             — текущий статус
#adr/ADR-XXX               — ссылка на ADR
#aggregate, #event, #invariant, #business-rule — тип документа
```

## Links & references
- Между документами vault: wikilinks `[[path/to/file]]`
- Внешние URL: markdown `[text](https://url)`
- Embeds (встраивание содержимого): `![[file]]`
- Block references: `[[file#^block-id]]`

## Callouts (семантическая разметка)
- `> [!danger]` — инварианты (НЕЛЬЗЯ нарушить)
- `> [!warning]` — corner cases, breaking changes, риски
- `> [!info]` — business rules, контекст, пояснения
- `> [!bug]` — edge cases, известные проблемы
- `> [!question]` — открытые вопросы
- `> [!tip]` — рекомендации, живые дашборды
- `> [!example]` — примеры использования

## Mermaid diagrams
- `stateDiagram-v2` — в aggregates.md (state machine агрегата)
- `erDiagram` — в aggregates.md (структура данных)
- `sequenceDiagram` — в events.md (flow событий между consumers)
- `graph` — в integrations.md (карта upstream/downstream зависимостей)
- `mindmap` — в capability-map.md (дерево возможностей)
- `gantt` — в rollout.md (таймлайн раскатки)

## Dataview queries
- Для живых дашбордов в index/dashboard файлах
- Запросы строятся по frontmatter полям (type, domain, status, tags)
- НЕ дублировать данные руками — если можно собрать dataview, собирай dataview

## Tables
- Всегда с заголовками
- Пустые ячейки: `—` (не пусто)

## Status tracking
- Статус документа: в frontmatter `status:` И в metadata.yaml для change packages
- Допустимые статусы change: `draft | discovery | spec | analysis | in-progress | done`
- Допустимые статусы domain: `draft | active | deprecated`
- Допустимые статусы ADR: `proposed | accepted | deprecated | superseded`
