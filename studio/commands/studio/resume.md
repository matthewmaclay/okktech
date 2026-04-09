---
name: studio-resume
description: "Возобновляет работу с места остановки. Читает STATE.md и предлагает следующий шаг."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Studio Resume

Возобновляет работу над change package с места остановки.

## Input
Change package ID (опционально): $ARGUMENTS

## Process

### Step 1: Определи CHG
Если `$ARGUMENTS` указан — используй его.
Если пусто:
1. Прочитай `.planning/STATE.md` — найди последний активный CHG
2. Если STATE.md нет — найди самый свежий CHG в `docs/changes/` по дате в metadata.yaml
3. Если ничего нет — предложи `/studio-pm` для старта

### Step 2: Определи текущую стадию
Прочитай `docs/changes/CHG-XXXX/metadata.yaml`.
Проверь наличие файлов для определения последней завершённой стадии:

| Файл | Стадия завершена |
|------|-----------------|
| `change-draft.md` | PM |
| `product-spec.md` | Analyst |
| `mockups/` | Designer |
| `backend-proposal.md` | Backend |
| `frontend-proposal.md` | Frontend |
| `test-plan.md` | QA |

### Step 3: Проверь открытые вопросы
Прочитай `10-open-questions.md` — есть ли блокирующие вопросы без ответа?

### Step 4: Предложи действие
Выведи:
```
## Resume: CHG-XXXX — [title]
Status: [status from metadata]
Last completed stage: [stage]
Open questions: [count] ([blocking] blocking)

### Recommended action:
/studio-[next-role] CHG-XXXX
```

Если есть блокирующие вопросы — предупреди и предложи сначала ответить на них.
