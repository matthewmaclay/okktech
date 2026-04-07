# Contributing to OKK.PRO Documentation

## Quick start

```
docs/
├── _meta/          ← Схема, принципы, глоссарий (читай первым)
├── domains/        ← ЧТО делает бизнес (язык, правила, события)
├── contexts/       ← КАК устроена платформа (по дисциплинам)
├── changes/        ← ПОЧЕМУ и КАК менялась система (change packages)
└── adrs/           ← ПОЧЕМУ принято архитектурное решение
```

## Философия

1. **Документация — конвейер, не архив.** Каждый переход между ролями — это документ.
2. **Нет документа — нет задачи.** PR без ссылки на CHG-* не мержится.
3. **Домены — только бизнес.** Ни UI-компонентов, ни имён сервисов, ни деталей реализации.
4. **Change package — иммутабелен.** После мержа не редактируется и не удаляется.

## Как начать работу над фичей

### Шаг 1. Создай change package

```bash
cp -r docs/changes/_template docs/changes/CHG-0042
```

Заполни `metadata.yaml` — ID, название, владельцы, затронутые домены.

### Шаг 2. Пройди pipeline по стадиям

```
00 · Intake            → change-draft.md       (цель, гипотезы, риски)
01 · Discovery         → 01-discovery.md       (актёры, сценарии, edge cases)
02 · Product spec      → 02-product-spec.md    (flows, AC, состояния)
03 · Domain impact     → 03-domain-impact.md   (агрегаты, события, инварианты)
04 · System analysis   → 04-system-analysis.md (API, DB, failure modes)
05 · Backend proposal  → 05-backend-proposal.md
06 · Frontend proposal → 06-frontend-proposal.md
07 · Test + rollout    → 07-test-plan.md + 08-rollout.md + 09-decisions.md
08 · PR → merge        → release-notes.md + обновлённые domain docs
```

Каждая стадия — отдельный документ. Статус всегда явный в `metadata.yaml`.

### Шаг 3. Обнови domain docs в том же PR

После мержа из change package в domain docs уходят только:
- Business rules
- Aggregates
- Events
- Invariants

Frontend/backend proposals остаются в change package навсегда.

## Как работать с доменами

### Создать новый домен

```bash
cp -r docs/domains/_template docs/domains/my-domain
```

Заполни все файлы:

| Файл | Что содержит |
|---|---|
| `README.md` | Описание, границы, use cases, владелец |
| `ubiquitous-language.md` | Термины с определениями и запрещёнными синонимами |
| `aggregates.md` | Агрегаты, их границы и правила консистентности |
| `business-rules.md` | Правила, политики, corner cases |
| `events.md` | Доменные события с payload и гарантиями |
| `invariants.md` | То, что не может быть нарушено ни при каких условиях |
| `integrations.md` | Upstream/downstream зависимости и контракты |
| `ownership.md` | Владелец, ответственности, эскалация |
| `links.yaml` | Машиночитаемые связи (домены, ADR, code refs) |

### Правила написания domain docs

- **Язык** — используй термины из `ubiquitous-language.md`, запрещённые синонимы не допускаются
- **Границы** — явно указывай что внутри и что вне домена
- **Без реализации** — никаких имён таблиц, сервисов, компонентов
- **Инварианты** — формулируй как утверждения, которые всегда истинны
- **События** — указывай producer, consumers, payload, гарантии доставки, правило идемпотентности

## Как работать с ADR

### Когда нужен ADR

- Решение влияет на несколько доменов или контекстов
- Решение необратимо или дорого в откате
- По решению был спор в команде

### Создать ADR

```bash
cp docs/adrs/_template.md docs/adrs/ADR-001.md
```

Статусы: `proposed → accepted → deprecated | superseded by ADR-XXX`

## Как работать с contexts

Contexts — стабильное знание о платформе по дисциплинам:

| Context | Что описывает |
|---|---|
| `backend/` | Архитектура, async flows, паттерны интеграции, карта сервисов |
| `frontend/` | Архитектура, роутинг, стейт, UI capabilities, feature flags |
| `qa/` | Стратегия тестирования, quality gates, карта регрессии |
| `analytics/` | Таксономия событий, метрики |

Contexts обновляются когда меняется платформа в целом, не при каждой фиче.

## Роль AI на каждой стадии

AI — полноправный участник конвейера. На каждой стадии у него конкретная задача:

| Стадия | Что делает AI |
|---|---|
| 00 Intake | Генерирует draft из текста запроса на фичу |
| 01 Discovery | Задаёт вопросы об актёрах и edge cases |
| 02 Product spec | Проверяет полноту AC, находит неопределённые состояния |
| 03 Domain impact | Маппит фичу на domain docs, находит конфликты инвариантов |
| 04 System analysis | Генерирует черновик API-контрактов из domain impact |
| 05 Backend proposal | Генерирует черновик из system analysis |
| 06 Frontend proposal | Генерирует UI-состояния из product spec |
| 07 Test plan | Генерирует тест-кейсы из acceptance criteria |
| 08 PR review | Проверяет PR на соответствие спеке, находит расхождения |

## Open questions

Вопросы фиксируются в `10-open-questions.md`, не решаются на созвонах.

| # | Question | Asked by | Date | Status | Answer |
|---|---|---|---|---|---|
| 1 | Текст вопроса | Имя | YYYY-MM-DD | open | |

Статусы: `open → answered`

## Чеклист перед PR

- [ ] Change package создан (`CHG-XXXX`)
- [ ] `metadata.yaml` заполнен и статус актуален
- [ ] Все затронутые domain docs обновлены в этом же PR
- [ ] Инварианты проверены — ни один не нарушен
- [ ] Ubiquitous language — используются правильные термины
- [ ] Нет деталей реализации в domain docs
- [ ] Open questions либо отвечены, либо явно помечены как open
- [ ] Release notes заполнены
- [ ] PR description содержит ссылку `CHG-XXXX`
