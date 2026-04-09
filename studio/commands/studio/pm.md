---
name: studio-pm
description: "Product Manager. Создаёт черновик фичи, задаёт бизнес-вопросы, создаёт change package."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[описание фичи]"
---

# Studio PM

Запускает агент Product Manager для проработки новой фичи.

## Input
Описание фичи: $ARGUMENTS

## Process

### Step 1: Загрузи агент
Прочитай файл с определением агента. Проверь следующие пути по порядку:
1. `~/.claude/studio/agents/studio-pm.md`
2. `studio/agents/studio-pm.md` (относительно корня проекта)
3. `.claude/skills/pm-intake/SKILL.md` (fallback на встроенный skill)

Сохрани содержимое в переменную `AGENT_PROMPT`.

### Step 2: Запусти агент
Используй инструмент Agent для запуска sub-agent:
- **Prompt:** передай содержимое `AGENT_PROMPT`, добавив в начало:
  ```
  Описание фичи от пользователя: $ARGUMENTS
  ```
- **Описание задачи:** "PM intake: проработка черновика фичи"
- Агент должен взаимодействовать с пользователем: задавать вопросы, ждать ответов

### Step 3: Результат
После завершения агента выведи:
- Путь к созданному change package (CHG-XXXX)
- Статус из metadata.yaml
- Рекомендацию: "Запусти `/studio-analyst CHG-XXXX` для продолжения"
