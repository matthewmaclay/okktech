---
name: studio-onboard
description: "Project Onboarding. Рекурсивный анализ кодовой базы, извлечение доменов. Работает с проектами любого размера."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[path] [--auto]"
---

# Studio Onboard

Запускает workflow онбординга существующего проекта на documentation-first фреймворк.

## Input
Путь к проекту и опциональные флаги: $ARGUMENTS

Режимы:
- **Interactive** (по умолчанию): останавливается между фазами для подтверждения
- **Autonomous** (с флагом `--auto`): работает без остановок, логирует решения

## Process

### Step 1: Загрузи workflow
Прочитай определение workflow. Проверь пути:
1. `~/.claude/studio/workflows/onboard-project.md`
2. `studio/workflows/onboard-project.md`
3. `.claude/skills/onboard-project/SKILL.md` (fallback)

### Step 2: Запусти агент
Используй Agent с полным текстом workflow и передай:
- Путь к проекту из `$ARGUMENTS`
- Режим работы (interactive/autonomous)

Workflow выполняет:
1. **Scan** — рекурсивный обход файловой структуры, подсчёт размера
2. **Chunk** — разбивка на зоны анализа (по размеру контекстного окна)
3. **Analyze** — анализ каждой зоны: паттерны, домены, зависимости
4. **Synthesize** — объединение результатов, создание domain map
5. **Scaffold** — создание доменов и контекстов из шаблонов
6. **Fill** — заполнение domain docs извлечёнными знаниями

### Step 3: Результат
Выведи:
- Количество найденных доменов
- Созданные директории
- Confidence levels
- Рекомендуемые следующие шаги
