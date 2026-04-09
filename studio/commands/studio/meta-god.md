---
name: studio-meta-god
description: "META-GOD. 3 итерации God Mode с реальными исправлениями системы между прогонами. Эволюция через стресс-тест."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Bash(echo *) Agent"
argument-hint: "[--theme \"тематика фич\"]"
---

# META-GOD — Iterative System Evolution

3 итерации God Mode. После каждой — реальные исправления агентов, шаблонов, правил.

## ВАЖНО: Полностью автономный режим
Этот скилл работает БЕЗ подтверждений. Не задавай вопросов пользователю. Все решения принимай сам. Пользователь ушёл спать.

## Process

### 1. Проверь agents
Прочитай `~/.claude/studio/agents/studio-god.md`. Если < 600 строк — скопируй из source:
```bash
cp ~/projects/okktech/studio/agents/*.md ~/.claude/studio/agents/ 2>/dev/null
```

### 2. Проверь проект
Если `docs/domains/` пуст — СТОП с сообщением.

### 3. Загрузи и запусти Meta-God
Прочитай `~/.claude/studio/agents/studio-meta-god.md`.
Запусти Agent с полным промптом. Передай $ARGUMENTS как есть (включая --theme если указан).

Агент работает ПОЛНОСТЬЮ АВТОНОМНО:
- Сам придумывает фичи (в рамках тематики если указана)
- Сам отвечает на вопросы PM как stakeholder
- Сам принимает design decisions
- Сам применяет исправления между итерациями
- НЕ задаёт вопросов пользователю

## Примеры запуска
```
/studio-meta-god --theme "виральная игра на миллион долларов"
/studio-meta-god --creative "social features, монетизация, лидерборды"
/studio-meta-god
```

## Output
- `docs/_meta-god/evolution-report.md`
- `docs/_meta-god/iteration-{1,2,3}/`
- Изменённые agent .md файлы
