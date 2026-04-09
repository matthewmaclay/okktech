---
paths:
  - "docs/**"
---

# Obsidian-specific conventions

## Vault structure
- Obsidian — основной инструмент для работы с документацией
- Vault root: `docs/`
- Canvas файлы (`.canvas`): в `_meta/` для визуальных карт
- Dataview дашборды: `domains-dashboard.md`, `changes-dashboard.md`

## Graph view optimization
- Каждый файл ДОЛЖЕН иметь осмысленное имя (НЕ `index.md`)
- Frontmatter `tags:` используются для группировки и цветов в graph view
- Рекомендуемые группы в graph:
  - `path:"domains"` → синий (бизнес-домены)
  - `path:"changes"` → зелёный (change packages)
  - `path:"adrs"` → фиолетовый (решения)
  - `path:"contexts"` → оранжевый (платформа)
  - `path:"_meta"` → серый (метаданные)

## Canvas files
- Формат: JSON Canvas (открытый стандарт)
- Nodes: embed domain README.md через `type: "file"`
- Edges: подписи = domain events или API contracts
- Colors: `"4"` = active, `"6"` = planned, `"0"` = infrastructure

## Dataview patterns
```
# Таблица из frontmatter:
TABLE field1, field2 FROM "folder" WHERE type = "X" SORT field1

# Задачи из чеклистов:
TASK FROM "folder" WHERE file.name = "invariants"

# Группировка:
TABLE status FROM "changes" WHERE type = "change" GROUP BY status
```

## Embeds
- Используй `![[file]]` для встраивания в дашборды
- Используй `![[file#heading]]` для встраивания секции
- Canvas: `type: "file"` для embed из vault

## Plugins required
- **Dataview** — живые дашборды, запросы по frontmatter
- **Templater** (optional) — динамическое создание файлов из шаблонов
- **Kanban** (optional) — kanban-доски из markdown
- **Mermaid** — встроен в Obsidian, доп. плагин не нужен
