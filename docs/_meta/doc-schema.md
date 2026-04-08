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

## AI Studio · Roles & Skills

AI-роли реализованы как Claude Code Skills. Каждая роль — отдельный скилл с уникальной экспертизой и тоном.

### Roles

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│  /pm             │────▶│  /analyst         │────▶│  /backend      │
│  Product Manager │     │  System Analyst & │     │  Backend       │
│  Intake + draft  │     │  Domain Architect │     │  Architect     │
│                  │     │  Discovery + Spec │     │                │
│                  │     │  + Domain Impact  │     │                │
└─────────────────┘     └──────────────────┘     └───────┬────────┘
                                                          │
                         ┌──────────────┐         ┌───────▼────────┐
                         │  /qa         │◀────────│  /frontend     │
                         │  QA Engineer │         │  Frontend      │
                         │  Test plan + │         │  Architect     │
                         │  Rollout     │         │                │
                         └──────────────┘         └────────────────┘
```

### Skill reference

| Skill | Role | Input | Output | Tone |
|-------|------|-------|--------|------|
| `/pm` | Product Manager | Описание фичи | change-draft.md, metadata.yaml, Linear issue | Дружелюбный, настойчивый |
| `/analyst` | System Analyst & Domain Architect | CHG-XXXX | 01-discovery.md, 02-product-spec.md, 03-domain-impact.md, обновлённые domain docs | Педант + DDD-эксперт |
| `/backend` | Backend Architect | CHG-XXXX | 04-system-analysis.md, 05-backend-proposal.md | Прагматик |
| `/frontend` | Frontend Architect | CHG-XXXX | 06-frontend-proposal.md | UX-перфекционист |
| `/qa` | QA Engineer | CHG-XXXX | 07-test-plan.md, 08-rollout.md | Параноик |
| `/review` | Reviewer | CHG-XXXX | Отчёт с cross-reference issues | Жёсткий code reviewer |
| `/new-feature` | Orchestrator | Описание фичи | Полный change package (все этапы) | Меняет роль на каждом этапе |
| `/bug` | Bug Hunter | Баг / Sentry URL | Root cause + fix proposal | Шерлок Холмс |
| `/new-domain` | DDD Architect | domain-name | Полный набор domain docs | Строгий коуч |
| `/sync-linear` | Sync | CHG-XXXX / all | Linear issues синхронизированы | Исполнитель |

### Usage patterns

**Full pipeline (новая фича):**
```
/new-feature добавить систему оценки тренировок
```
Или поэтапно:
```
/pm добавить систему оценки тренировок
/analyst CHG-0002
/backend CHG-0002
/frontend CHG-0002
/qa CHG-0002
/review CHG-0002
```

**Bug investigation:**
```
/bug https://sentry.io/issues/PROJ-123/
/bug при завершении сессии не обновляется счётчик
```

**New domain:**
```
/new-domain assessment
```

**Sync with Linear:**
```
/sync-linear CHG-0002
/sync-linear all
```

### AI role per stage

```
Stage 00 · /pm       → Генерирует черновик, задаёт бизнес-вопросы
Stage 01 · /analyst  → Находит edge cases, определяет актёров, ломает happy path
Stage 02 · /analyst  → Проверяет полноту AC, находит неопределённые состояния
Stage 03 · /analyst  → Маппит на домены, проверяет инварианты, обновляет domain docs
Stage 04 · /backend  → API контракты, DB impact, failure modes
Stage 05 · /backend  → Backend proposal с migration plan
Stage 06 · /frontend → UI states, permissions, a11y, analytics
Stage 07 · /qa       → Test cases из AC, rollout strategy
Stage 08 · /review   → Cross-reference check, completeness audit
```

### Iteration rules

На ЛЮБОМ этапе роль может обнаружить проблему в предыдущем этапе:

1. Зафиксировать в `10-open-questions.md`
2. Если проблема критическая (меняет scope/spec) — СТОП, уведомить пользователя
3. Если некритическая — зафиксировать и продолжить
4. При возврате на предыдущий этап — каскадное обновление всех downstream документов

```
/backend находит проблему в product spec
    → обновляет 10-open-questions.md
    → пользователь решает: "исправить"
    → обновляется 02-product-spec.md
    → перепроверяется 03-domain-impact.md
    → обновляется 05-backend-proposal.md
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
