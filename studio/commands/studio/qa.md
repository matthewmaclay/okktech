---
name: studio-qa
description: "QA Engineer. Test plan, rollout strategy. Используй после /studio-frontend."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Studio QA

Запускает агент QA Engineer для создания test plan и rollout strategy.

## Input
Change package ID: $ARGUMENTS

## Validation
Проверь что `$ARGUMENTS` — валидный CHG-ID.
Проверь что `docs/changes/$ARGUMENTS/frontend-proposal.md` существует.
Если нет — предложи запустить `/studio-frontend` сначала.

## Process

### Step 1: Загрузи агент
Прочитай файл с определением агента:
1. `~/.claude/studio/agents/studio-qa.md`
2. `studio/agents/studio-qa.md`
3. `.claude/skills/qa-plan/SKILL.md` (fallback)

### Step 2: Загрузи контекст
Прочитай ВСЕ документы из `docs/changes/$ARGUMENTS/`:
- `metadata.yaml`, `change-draft.md`, `product-spec.md`
- `backend-proposal.md`, `frontend-proposal.md`
- `10-open-questions.md` (если есть)

### Step 3: Запусти агент
Агент должен:
- Создать `test-plan.md` с acceptance criteria → test cases mapping
- Покрыть edge cases и error scenarios
- Описать rollout strategy (feature flags, canary, percentage rollout)
- Определить rollback criteria
- Зафиксировать smoke tests для production verification

### Step 4: Результат
Выведи:
- Количество test cases
- Покрытие acceptance criteria (%)
- Rollout strategy summary
- Рекомендацию: "Запусти `/studio-verify $ARGUMENTS` для финальной проверки"
