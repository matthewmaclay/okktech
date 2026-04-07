# Documentation Schema

## Philosophy

Документация — конвейер, не архив.
Каждый переход между ролями — это документ.
Нет документа — нет задачи, физически.

В системе две оси:
- **Knowledge base** — стабильное описание системы как она есть
- **Change packages** — описание системы как она меняется

## Folder separation rules

```
/domains      → ЧТО делает бизнес (язык, правила, события, инварианты)
               БЕЗ реализации. БЕЗ UI. БЕЗ имён сервисов.

/contexts     → КАК устроена платформа по дисциплинам
               Стабильное архитектурное знание по каждой дисциплине.

/changes      → ПОЧЕМУ и КАК было сделано конкретное изменение
               Иммутабельно после мержа. Никогда не удаляется.

/adrs         → ПОЧЕМУ принято кросс-доменное архитектурное решение
               Иммутабельно после принятия.
```

## Hard rules

1. PR без ссылки на CHG-* не мержится
2. Domain docs обновляются в том же PR что и код
3. Нет документа — нет задачи
4. Вопросы фиксируются в 10-open-questions.md, не решаются на созвонах
5. Статус документа всегда явно указан в metadata.yaml
6. Frontend proposal и backend proposal остаются в change package навсегда — не переносятся в domain docs
7. Domain docs содержат только бизнес-знание — никаких UI-компонентов, никаких деталей реализации
8. После мержа: в domain docs уходят только business rules, aggregates, events, invariants

## Stage pipeline

```
Stage 00 · Intake            → change-draft.md + metadata.yaml
Stage 01 · Discovery         → 01-discovery.md
Stage 02 · Product spec      → 02-product-spec.md
Stage 03 · Domain impact     → 03-domain-impact.md
Stage 04 · System analysis   → 04-system-analysis.md
Stage 05 · Backend proposal  → 05-backend-proposal.md
Stage 06 · Frontend proposal → 06-frontend-proposal.md
Stage 07 · Test + rollout    → 07-test-plan.md + 08-rollout.md + 09-decisions.md
Stage 08 · PR → merge        → PR refs + release-notes.md + обновлённые domain docs
```

## AI role per stage

```
Stage 00: Генерирует черновик из текста запроса на фичу
Stage 01: Задаёт вопросы об актёрах и edge cases
Stage 02: Проверяет полноту AC, находит неопределённые состояния
Stage 03: Маппит фичу на domain docs, находит конфликты инвариантов
Stage 04: Генерирует черновик API-контрактов из domain impact
Stage 05: Генерирует черновик из system analysis
Stage 06: Генерирует черновик UI-состояний из product spec
Stage 07: Генерирует тест-кейсы из acceptance criteria
Stage 08: Проверяет PR на соответствие спеке, находит расхождения
```

## What lives where

```
Question                                     → Location
─────────────────────────────────────────────────────
Что делает этот домен?                       → domains/[name]/README.md
Какие бизнес-правила?                        → domains/[name]/business-rules.md
Что не может быть нарушено?                  → domains/[name]/invariants.md
Какие события генерирует домен?              → domains/[name]/events.md
Как устроен фронтенд?                        → contexts/frontend/architecture.md
Какие UI-поверхности существуют?             → contexts/frontend/ui-capabilities.md
Как именуются события аналитики?             → contexts/frontend/analytics-conventions.md
Какие feature flags существуют?              → contexts/frontend/feature-flags.md
Почему принято это архитектурное решение?    → adrs/ADR-XXX.md
Что изменилось в этой фиче?                 → changes/CHG-XXXX/
Почему мы сделали это именно так?            → changes/CHG-XXXX/09-decisions.md
Что делает фронтенд в этой фиче?            → changes/CHG-XXXX/06-frontend-proposal.md
Что делает бэкенд в этой фиче?              → changes/CHG-XXXX/05-backend-proposal.md
```
