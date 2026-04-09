---
name: studio-verify
description: "Goal-backward verification. Проверяет что цели change package достигнуты."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Studio Verify

Goal-backward verification: проверяет что все заявленные цели change package достигнуты в документации.

## Input
Change package ID: $ARGUMENTS

## Validation
Проверь что `docs/changes/$ARGUMENTS/` существует и содержит минимум change-draft.md.

## Process

### Step 1: Загрузи контекст
Прочитай ВСЕ файлы из `docs/changes/$ARGUMENTS/`:
- `change-draft.md` — исходные цели и acceptance criteria
- `product-spec.md` — спецификация
- `backend-proposal.md` — backend решения
- `frontend-proposal.md` — frontend решения
- `test-plan.md` — план тестирования
- `metadata.yaml` — статус и метаданные
- `10-open-questions.md` — открытые вопросы

### Step 2: Goal-backward analysis
Для каждой цели из change-draft.md (секция Goals / Acceptance Criteria):
1. Найди где эта цель реализована (в каком документе, какая секция)
2. Оцени: COVERED / PARTIAL / MISSING
3. Если PARTIAL или MISSING — опиши что именно не покрыто

### Step 3: Проверка open questions
Для каждого вопроса из 10-open-questions.md:
- Есть ли ответ?
- Блокирует ли неотвеченный вопрос какую-то цель?

### Step 4: Результат
Выведи verification report:
```
## Verification: $ARGUMENTS
Goals: X/Y covered, Z partial, W missing
Open questions: X resolved, Y blocking
Overall: READY / NEEDS WORK
```
Если NEEDS WORK — конкретный список что доделать и кем (какая роль).
