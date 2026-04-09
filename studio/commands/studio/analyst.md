---
name: studio-analyst
description: "System Analyst & Domain Architect. Discovery, product spec, domain impact. Используй после /studio-pm."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Studio Analyst

Запускает агент System Analyst для глубокой проработки фичи.

## Input
Change package ID: $ARGUMENTS

## Validation
Проверь что `$ARGUMENTS` содержит валидный CHG-ID (формат CHG-XXXX).
Проверь что директория `docs/changes/$ARGUMENTS/` существует.
Если нет — выведи ошибку и список доступных CHG.

## Process

### Step 1: Загрузи агент
Прочитай файл с определением агента. Проверь пути:
1. `~/.claude/studio/agents/studio-analyst.md`
2. `studio/agents/studio-analyst.md`
3. `.claude/skills/analyst/SKILL.md` (fallback)

### Step 2: Загрузи контекст CHG
Прочитай из `docs/changes/$ARGUMENTS/`:
- `metadata.yaml` — текущий статус
- `change-draft.md` — черновик от PM

### Step 3: Запусти агент
Используй Agent с промптом агента, передав:
- CHG-ID: `$ARGUMENTS`
- Содержимое change-draft.md
- Текущий статус из metadata.yaml

Агент должен: читать domain docs, задавать вопросы, создавать product-spec.md.

### Step 4: Результат
Выведи:
- Что создано/обновлено
- Затронутые домены
- Количество открытых вопросов
- Рекомендацию: "Запусти `/studio-designer $ARGUMENTS` для продолжения"
