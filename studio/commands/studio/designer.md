---
name: studio-designer
description: "UI/UX Designer. HTML/CSS мокапы экранов. Используй после /studio-analyst."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Studio Designer

Запускает агент UI/UX Designer для создания HTML/CSS мокапов.

## Input
Change package ID: $ARGUMENTS

## Validation
Проверь что `$ARGUMENTS` — валидный CHG-ID.
Проверь что `docs/changes/$ARGUMENTS/product-spec.md` существует (выход аналитика).
Если нет — предложи сначала запустить `/studio-analyst`.

## Process

### Step 1: Загрузи агент
Прочитай файл с определением агента:
1. `~/.claude/studio/agents/studio-designer.md`
2. `studio/agents/studio-designer.md`
3. Если не найден — используй встроенные инструкции ниже

### Step 2: Загрузи контекст
Прочитай из `docs/changes/$ARGUMENTS/`:
- `metadata.yaml`
- `product-spec.md` — спецификация от аналитика
- `change-draft.md` — исходный черновик

Прочитай `docs/contexts/frontend/` для понимания UI-стека.

### Step 3: Запусти агент
Агент должен:
- Создать HTML/CSS мокапы экранов в `docs/changes/$ARGUMENTS/mockups/`
- Описать user flows (основной + error states)
- Определить UI-компоненты и их состояния
- Зафиксировать дизайн-решения

### Step 4: Результат
Выведи:
- Список созданных мокапов
- Описание user flows
- Рекомендацию: "Запусти `/studio-backend $ARGUMENTS` для продолжения"
