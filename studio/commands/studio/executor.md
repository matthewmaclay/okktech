---
name: studio-executor
description: "Code Executor. Реализует фичу строго по документации. Backend + Frontend + Tests."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(date *) Bash(grep *) Bash(echo *) Agent"
argument-hint: "[CHG-XXXX или DMNCHG-XXXX]"
---

# Code Executor

Реализует фичу СТРОГО по документации. Код = исполнение спецификации.

## Process
1. Прочитай `~/.claude/studio/agents/studio-executor.md`
2. Запусти Agent с CHG ID: $ARGUMENTS
3. Agent пишет: backend (models, routes, services, migrations, tests) + frontend (components, pages, state, tests)
4. Каждое отклонение от документации → deviation-log.md

## Output
- Реальные файлы кода
- deviation-log.md (где код отклонился от доки и почему)
