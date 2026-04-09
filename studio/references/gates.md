# Gate types

Гейты контролируют переходы между стадиями pipeline. Каждый гейт — это проверка перед допуском к следующему этапу.

## 4 типа гейтов

### Pre-flight gate
Валидация предусловий ПЕРЕД началом работы.
- Пример: Перед запуском /analyst — проверить что change-draft.md существует и заполнен
- Действие при failure: БЛОКИРОВКА входа, сообщение что не хватает

### Revision gate
Оценка качества OUTPUT после завершения. Может отправить на доработку.
- Пример: После /analyst — проверить что ≥5 acceptance criteria, ≥5 edge cases
- Действие при failure: ВОЗВРАТ к автору с feedback (max 3 итерации)
- Stall detection: если после 3 итераций качество не улучшилось → escalation

### Escalation gate
Проблема, которую AI не может решить самостоятельно.
- Пример: Нарушенный инвариант домена, конфликт между CHG
- Действие: СТОП, показать пользователю, ждать решения

### Abort gate
Немедленная остановка для предотвращения ущерба.
- Пример: Контекст < 25%, STATE.md повреждён
- Действие: Сохранить STATE.md, остановить выполнение

## Gate matrix

| Stage transition | Pre-flight | Revision | Escalation | Abort |
|-----------------|------------|----------|------------|-------|
| draft → discovery | change-draft filled | — | — | — |
| discovery → spec | actors, happy path | ≥5 edge cases | — | context < 25% |
| spec → analysis | ≥5 AC | — | invariant violated | context < 25% |
| analysis → design | domain-impact filled | — | domain conflict | — |
| design → in-progress | ≥1 mockup HTML | mockup matches spec | — | — |
| in-progress → done | all docs filled | cross-ref audit | blocking questions | — |
