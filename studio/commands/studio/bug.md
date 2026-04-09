---
name: studio-bug
description: "Bug Hunter. Исследует баг через Sentry, код, domain docs."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[описание бага | Sentry URL]"
---

# Studio Bug

Запускает агент Bug Hunter для исследования бага.

## Input
Описание бага или Sentry URL: $ARGUMENTS

## Process

### Step 1: Загрузи агент
Прочитай определение:
1. `~/.claude/studio/agents/studio-bug.md`
2. `studio/agents/studio-bug.md`
3. `.claude/skills/bug-hunt/SKILL.md` (fallback)

### Step 2: Определи тип input
- Если `$ARGUMENTS` содержит URL (sentry.io) — это Sentry issue
- Иначе — текстовое описание бага

### Step 3: Запусти агент
Агент выполняет расследование:

**Если Sentry URL:**
1. Получи детали issue из Sentry (stacktrace, breadcrumbs, tags)
2. Найди затронутый код по stacktrace
3. Проверь domain docs на релевантные бизнес-правила
4. Определи root cause

**Если текстовое описание:**
1. Поиск по коду: grep паттерны, связанные с описанием
2. Проверь domain docs: инварианты, правила, события
3. Проверь последние changes: что менялось в затронутой области
4. Сформулируй гипотезу root cause

**Общие шаги:**
- Определи severity (critical / high / medium / low)
- Предложи fix с конкретными файлами и изменениями
- Определи затронутые домены
- Проверь нет ли похожих багов в истории

### Step 4: Результат
Выведи bug report:
- Root cause
- Affected code (файлы, строки)
- Affected domains
- Proposed fix
- Severity и рекомендация (hotfix / next sprint / backlog)
