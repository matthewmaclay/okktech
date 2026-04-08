# AI Web Studio · OKKTech

## Overview
Монорепо: документация + код AI-тренажёра. Documentation-first подход.
Нет документа — нет задачи. PR без ссылки на CHG-* не мержится.

## Project structure
```
docs/              → Документация (Obsidian vault)
docs/domains/      → Бизнес-домены (DDD): язык, правила, события, инварианты
docs/changes/      → Change packages: иммутабельные после мержа
docs/adrs/         → Architecture Decision Records
docs/contexts/     → Platform knowledge: frontend, backend, qa, analytics
docs/_meta/        → Схема документации, карты доменов, глоссарий
.claude/skills/    → AI-роли (PM, Analyst, Backend, Frontend, QA)
.claude/rules/     → Контекстные правила для AI
```

## Language rules
- Заголовки, названия секций, имена файлов → английский
- Содержимое (описания, правила, комментарии) → русский
- Термины из ubiquitous language → без перевода (Session, Turn, Facilitator)

## Documentation hard rules
1. Domain docs содержат ТОЛЬКО бизнес-знание — никакого UI, никаких имён сервисов
2. Change packages иммутабельны после мержа — никогда не удаляются
3. Вопросы фиксируются в `10-open-questions.md`, не решаются устно
4. При изменении domain docs — обязательна ссылка на CHG-*
5. Frontend/backend proposals остаются в change package навсегда
6. После мержа в domain docs уходят только: business rules, aggregates, events, invariants

## Documentation pipeline
@docs/_meta/doc-schema.md

## AI Studio skills
@docs/_meta/doc-schema.md (секция "AI Studio · Roles & Skills")

## Templates & examples
- Новый домен: `docs/domains/_template/`
- Новый change: `docs/changes/_template/`
- Новый ADR: `docs/adrs/_template.md`
- Примеры: `docs/domains/training-session/`, `docs/changes/_example/`, `docs/adrs/_example.md`

## When creating documents
- Всегда копируй структуру из _template
- ОБЯЗАТЕЛЬНО: YAML frontmatter с `type`, `domain`, `tags`, `status`, `created`
- Заполняй metadata.yaml с правильным статусом
- Генерируй уникальный CHG-ID (инкрементальный)
- Не оставляй placeholder-тексты из шаблона
- Используй Mermaid диаграммы для визуализации (state, ER, sequence, graph)
- Используй callouts для семантической разметки (danger, warning, info, bug, question)

## When modifying domain docs
- Сначала прочитай ВСЕ файлы домена
- Проверь что изменение не нарушает инварианты (invariants.md)
- Проверь что термины соответствуют ubiquitous-language.md
- Обнови events.md если появляются новые события
- Обнови frontmatter (tags, status) если контекст изменился

## Obsidian rules
@.claude/rules/obsidian-conventions.md
