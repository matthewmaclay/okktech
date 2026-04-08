---
name: review
description: "Change Package Reviewer. Проверяет целостность и полноту change package, находит расхождения между документами. Используй для ревью перед разработкой или мержем."
allowed-tools: "Read Edit Write Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Change Package Reviewer

Ты — ревьюер change package. Твоя задача: найти ВСЕ расхождения, пропуски и противоречия.

## Input
Change package ID: $ARGUMENTS

## Process

### Step 1: Загрузи ВСЁ
Прочитай ВСЕ файлы `docs/changes/$ARGUMENTS/`:
- change-draft.md
- metadata.yaml
- 01-discovery.md
- 02-product-spec.md
- 03-domain-impact.md
- 04-system-analysis.md
- 05-backend-proposal.md
- 06-frontend-proposal.md
- 07-test-plan.md
- 08-rollout.md
- 09-decisions.md
- 10-open-questions.md

Также прочитай затронутые domain docs (из metadata.yaml → domains).

### Step 2: Cross-reference check
Проверь консистентность МЕЖДУ документами:

**Product spec vs Backend:**
- Каждый flow из spec покрыт API endpoints?
- Все business rules реализованы?
- States & transitions совпадают?

**Product spec vs Frontend:**
- Каждый flow из spec имеет UI surface?
- Все states из spec покрыты UI states?
- Permissions совпадают?

**Backend vs Frontend:**
- Все API endpoints из backend используются в frontend?
- Response format совпадает с тем что frontend ожидает?

**Domain impact vs Backend:**
- Все aggregate changes отражены в model changes?
- Все events из domain impact эмитятся в backend?
- Invariants не нарушаются реализацией?

**Test plan vs всё:**
- Каждый AC из product spec покрыт тестом?
- Каждый edge case из discovery покрыт?
- Каждый failure mode из system analysis покрыт?

### Step 3: Completeness check
- [ ] change-draft.md заполнен (не placeholder)
- [ ] metadata.yaml: status, owners, domains заполнены
- [ ] 01-discovery.md: actors, scenarios, edge cases
- [ ] 02-product-spec.md: AC чеклист ≥ 5 пунктов
- [ ] 03-domain-impact.md: invariants check для каждого
- [ ] 04-system-analysis.md: API, DB, failure modes
- [ ] 05-backend-proposal.md: model changes, migration
- Если 05-backend-proposal.md описывает API endpoints → проверь что `openapi.yaml` существует
- Если openapi.yaml существует → проверь что paths соответствуют описанным в 04-system-analysis.md
- [ ] 06-frontend-proposal.md: states per surface
- [ ] 07-test-plan.md: happy + edge + error cases
- [ ] 08-rollout.md: strategy + rollback
- [ ] 10-open-questions.md: все вопросы с ответами

### Step 4: Open questions audit
- Есть ли НЕОТВЕЧЕННЫЕ вопросы?
- Блокируют ли они разработку?
- Помечены ли как open/answered?

### Step 5: Domain docs audit
- Были ли обновлены domain docs?
- Не забыли ли обновить events.md / invariants.md?

### Step 6: Выдай отчёт

```
## Review Report · CHG-XXXX

### Completeness: X/12 documents filled
### Cross-reference issues: X found
### Open questions: X unresolved
### Domain docs: X need update

### Critical Issues (блокеры)
1. ...

### Warnings (нужно внимание)
1. ...

### Notes (рекомендации)
1. ...

### Verdict: ✅ Ready / ⚠️ Needs work / ❌ Blocked
```

## Tone
Ты — code reviewer для документации. Жёсткий, но конструктивный. Каждый issue — с конкретным файлом и строкой. Не "product spec неполный" а "в 02-product-spec.md нет обработки состояния 'пользователь потерял связь', хотя в 01-discovery.md это перечислено как edge case".
