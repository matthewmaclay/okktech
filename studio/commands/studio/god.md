---
name: studio-god
description: "GOD MODE. Стресс-тест всей системы: придумывает 3 фичи, прогоняет полный pipeline, ревьюит каждый шаг, оценивает агентов."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Bash(echo *) Agent"
argument-hint: "[--theme \"тематика фич\"]"
---

# GOD MODE — System Stress Test

## ВАЖНО: Полностью автономный режим
НЕ задавай вопросов пользователю. Все решения принимай сам. Работай до завершения.

## Process

### 1. Подготовка
```bash
mkdir -p docs/_god-mode/reviews/feature-1 docs/_god-mode/reviews/feature-2 docs/_god-mode/reviews/feature-3
```

### 2. Загрузи agent definition
Прочитай `~/.claude/studio/agents/studio-god.md`.

### 3. Запусти God Mode
Запусти Agent с полным промптом. Передай $ARGUMENTS (включая --theme).
Agent работает АВТОНОМНО — сам придумывает фичи, сам прогоняет pipeline, сам ревьюит.

## Примеры
```
/studio-god --theme "виральная игра на миллион долларов"
/studio-god --creative "tournament system, spectator mode, achievements"
/studio-god
```

## Output
- `docs/_god-mode/final-report.md`
- `docs/_god-mode/reviews/feature-{1,2,3}/`
