---
name: studio-status
description: "Показывает текущее состояние: активные CHG, позиция в pipeline, открытые вопросы."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: ""
---

# Studio Status

Показывает текущее состояние проекта: активные change packages, позицию в pipeline, открытые вопросы.

## Process

### Step 1: Прочитай STATE
Проверь наличие и прочитай `.planning/STATE.md` — глобальное состояние.
Если файла нет — это нормально, продолжай без него.

### Step 2: Собери информацию о CHG
Найди все change packages:
```
ls docs/changes/
```

Для каждой директории CHG-XXXX:
1. Прочитай `metadata.yaml` — извлеки status, title, domains, created
2. Определи текущую стадию pipeline по наличию файлов:
   - Только `change-draft.md` → PM done, нужен Analyst
   - Есть `product-spec.md` → Analyst done, нужен Designer
   - Есть `mockups/` → Designer done, нужен Backend
   - Есть `backend-proposal.md` → Backend done, нужен Frontend
   - Есть `frontend-proposal.md` → Frontend done, нужен QA
   - Есть `test-plan.md` → QA done, нужна Verification
3. Подсчитай открытые вопросы в `10-open-questions.md` (если есть)

### Step 3: Выведи dashboard
```
## Studio Status

### Active Changes
| CHG | Title | Stage | Next Action | Open Qs |
|-----|-------|-------|-------------|---------|
| ... | ...   | ...   | ...         | ...     |

### Recommended Next Action
[Что делать дальше — конкретная команда]
```

Если нет активных CHG — предложи `/studio-pm` для старта.
