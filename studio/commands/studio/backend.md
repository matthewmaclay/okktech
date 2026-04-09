---
name: studio-backend
description: "Backend Architect. System analysis, API contracts, DB impact, OpenAPI spec. Используй после /studio-designer."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Studio Backend

Запускает агент Backend Architect для технической проработки серверной части.

## Input
Change package ID: $ARGUMENTS

## Validation
Проверь что `$ARGUMENTS` — валидный CHG-ID.
Проверь что `docs/changes/$ARGUMENTS/product-spec.md` существует.
Если нет — предложи запустить предыдущие этапы.

## Process

### Step 1: Загрузи агент
Прочитай файл с определением агента:
1. `~/.claude/studio/agents/studio-backend.md`
2. `studio/agents/studio-backend.md`
3. `.claude/skills/backend-arch/SKILL.md` (fallback)

### Step 2: Загрузи контекст
Прочитай из `docs/changes/$ARGUMENTS/`:
- `metadata.yaml`, `product-spec.md`, `change-draft.md`
- Мокапы из `mockups/` (если есть)

Прочитай `docs/contexts/backend/` для понимания текущей архитектуры.

### Step 3: Запусти агент
Агент должен:
- Создать `backend-proposal.md` с API contracts, DB schema changes, async flows
- Сгенерировать OpenAPI spec (если применимо)
- Описать failure modes и rollback strategy
- Оценить impact на существующие сервисы

### Step 4: Результат
Выведи:
- Затронутые API endpoints
- DB migrations (если есть)
- Риски и mitigation
- Рекомендацию: "Запусти `/studio-frontend $ARGUMENTS` для продолжения"
