---
name: studio-feature
description: "Full pipeline. PM -> Analyst -> Designer -> Backend -> Frontend -> QA -> Verify. Полный цикл проработки фичи."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[описание фичи]"
---

# Studio Feature Pipeline

Оркестратор полного цикла проработки фичи. Последовательно запускает все роли как отдельные агенты.

## Input
Описание фичи: $ARGUMENTS

## Pipeline

### Stage 1: Product Manager
Запусти Agent с промптом:
```
Выполни команду /studio-pm с аргументами: $ARGUMENTS
Создай change package и верни CHG-ID.
```
Дождись завершения. Извлеки CHG-ID из вывода.
Прочитай `docs/changes/CHG-XXXX/metadata.yaml` — убедись что status: draft.

Покажи пользователю: "PM завершил. Создан CHG-XXXX. Продолжить к Analyst?"
Дождись подтверждения.

### Stage 2: System Analyst
Запусти Agent:
```
Выполни команду /studio-analyst CHG-XXXX
```
Дождись завершения. Прочитай metadata.yaml — проверь прогресс.

Покажи: "Analyst завершил. Продолжить к Designer?"

### Stage 3: UI/UX Designer
Запусти Agent:
```
Выполни команду /studio-designer CHG-XXXX
```
Покажи: "Designer завершил. Продолжить к Backend?"

### Stage 4: Backend Architect
Запусти Agent:
```
Выполни команду /studio-backend CHG-XXXX
```
Покажи: "Backend завершил. Продолжить к Frontend?"

### Stage 5: Frontend Architect
Запусти Agent:
```
Выполни команду /studio-frontend CHG-XXXX
```
Покажи: "Frontend завершил. Продолжить к QA?"

### Stage 6: QA Engineer
Запусти Agent:
```
Выполни команду /studio-qa CHG-XXXX
```
Покажи: "QA завершил. Запустить верификацию?"

### Stage 7: Verification
Запусти Agent:
```
Выполни команду /studio-verify CHG-XXXX
```

### Final Report
Прочитай финальный metadata.yaml. Выведи:
- CHG-ID и название
- Все созданные документы
- Открытые вопросы (если остались)
- Общий статус: "Ready for development" или "Needs attention"
