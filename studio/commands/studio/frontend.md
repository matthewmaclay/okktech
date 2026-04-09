---
name: studio-frontend
description: "Frontend Architect. UI states, permissions, accessibility. Используй после /studio-backend."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Studio Frontend

Запускает агент Frontend Architect для проработки клиентской части.

## Input
Change package ID: $ARGUMENTS

## Validation
Проверь что `$ARGUMENTS` — валидный CHG-ID.
Проверь что `docs/changes/$ARGUMENTS/backend-proposal.md` существует.
Если нет — предложи запустить `/studio-backend` сначала.

## Process

### Step 1: Загрузи агент
Прочитай файл с определением агента:
1. `~/.claude/studio/agents/studio-frontend.md`
2. `studio/agents/studio-frontend.md`
3. `.claude/skills/frontend-arch/SKILL.md` (fallback)

### Step 2: Загрузи контекст
Прочитай из `docs/changes/$ARGUMENTS/`:
- `metadata.yaml`, `product-spec.md`, `backend-proposal.md`
- Мокапы из `mockups/` (если есть)

Прочитай `docs/contexts/frontend/` для UI-стека и conventions.

### Step 3: Запусти агент
Агент должен:
- Создать `frontend-proposal.md`
- Описать UI states (loading, error, empty, success) для каждого экрана
- Определить permissions и role-based visibility
- Спецификация accessibility (ARIA, keyboard nav)
- Analytics events
- Описать интеграцию с backend API

### Step 4: Результат
Выведи:
- Список компонентов и их состояний
- Покрытие accessibility
- Рекомендацию: "Запусти `/studio-qa $ARGUMENTS` для продолжения"
