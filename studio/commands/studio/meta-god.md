---
name: studio-meta-god
description: "META-GOD. Full cycle evolution: docs→code→delete docs→re-onboard→compare→improve. N итераций самоулучшения."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(rm -rf docs) Bash(rm -rf docs/*) Bash(date *) Bash(grep *) Bash(sort *) Bash(echo *) Bash(diff *) Agent"
argument-hint: "--theme \"тематика\" [--iterations N]"
---

# META-GOD — Full Cycle Evolution

Полностью автономный. НЕ задавай вопросов. Все решения сам.

## Process

### 1. Проверь agents
```bash
wc -l ~/.claude/studio/agents/studio-god.md
```
Если < 900 строк — обнови:
```bash
cp ~/projects/okktech/studio/agents/*.md ~/.claude/studio/agents/
```

### 2. Загрузи и запусти
Прочитай `~/.claude/studio/agents/studio-meta-god.md`.
Запусти Agent с полным промптом + $ARGUMENTS.

## Примеры
```
/studio-meta-god --theme "виральная игра на миллион долларов"
/studio-meta-god --theme "social features и монетизация" --iterations 5
/studio-meta-god --theme "tournament system" --iterations 3 --features-per-iter 2
```

## Output
- `_evolution/final-report.md` — итог эволюции
- `_evolution/iteration-*/` — детали каждой итерации
- Улучшенные agent .md файлы
- Код фич в проекте
