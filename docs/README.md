# OKK.PRO Documentation

Документация как конвейер разработки. Каждый переход между ролями — документ. Нет документа — нет задачи.

## Структура

```
docs/
│
├── _meta/                  Схема документации, принципы, глоссарий
│   ├── doc-schema.md       Главный документ: философия, правила, pipeline
│   ├── architecture-principles.md
│   ├── capability-map.md
│   ├── domain-map.md
│   └── glossary.md
│
├── domains/                ЧТО делает бизнес
│   ├── _template/          Шаблон нового домена
│   └── training-session/   Пример: домен тренировочных сессий
│
├── contexts/               КАК устроена платформа
│   ├── backend/            Архитектура, async, интеграции
│   ├── frontend/           UI, роутинг, стейт, feature flags
│   ├── qa/                 Тестирование, quality gates
│   └── analytics/          Таксономия событий, метрики
│
├── changes/                ПОЧЕМУ и КАК менялась система
│   └── _template/          Шаблон change package (13 документов)
│
└── adrs/                   ПОЧЕМУ принято архитектурное решение
    └── _template.md        Шаблон ADR
```

## Два типа знания

| | Knowledge base | Change packages |
|---|---|---|
| **Что** | Система как она есть | Система как она меняется |
| **Где** | `domains/`, `contexts/` | `changes/` |
| **Мутабельность** | Обновляется с каждым PR | Иммутабелен после мержа |
| **Пример** | "Session не может иметь > maxTurns ходов" | "CHG-0042: добавили лимит ходов" |

## Pipeline разработки

```
Идея → CHG-XXXX → Discovery → Spec → Domain Impact → System Analysis
  → Backend Proposal → Frontend Proposal → Test Plan → PR → Merge
```

Каждая стадия — отдельный документ в change package. Подробнее: [`_meta/doc-schema.md`](_meta/doc-schema.md)

## Как начать

1. Прочитай [`_meta/doc-schema.md`](_meta/doc-schema.md) — философия и правила
2. Прочитай [`CONTRIBUTING.md`](CONTRIBUTING.md) — процесс работы
3. Изучи пример домена: [`domains/training-session/`](domains/training-session/)
4. Создай change package из шаблона: `cp -r changes/_template changes/CHG-XXXX`

## Hard rules

1. **PR без CHG-\* — не мержится**
2. **Domain docs обновляются в том же PR что и код**
3. **Нет документа — нет задачи**
4. **Вопросы пишутся в 10-open-questions.md, не решаются на созвонах**
5. **Domain docs содержат только бизнес-знание**
