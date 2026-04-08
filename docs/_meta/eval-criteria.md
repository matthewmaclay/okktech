---
type: meta
status: active
tags:
  - meta
  - testing
  - quality
created: 2026-04-08
---

# Evaluation criteria

Критерии оценки качества вывода AI-скиллов. Каждый критерий — проверяемый (да/нет или числовой).

## /pm (Product Manager Intake)

### Структурная полнота
- [ ] change-draft.md существует и заполнен
- [ ] metadata.yaml заполнен с правильным id, status: draft, датами, product owner
- [ ] index.md содержит ссылки на все документы
- [ ] 10-open-questions.md заполнен (если есть нерешённые вопросы)

### Качество содержания
- [ ] Goal — одно ясное предложение (что и зачем)
- [ ] Why now — конкретная бизнес-причина (не "потому что надо")
- [ ] Affected capabilities — не пустой список
- [ ] Hypotheses — минимум 1
- [ ] Out of scope — минимум 2 пункта
- [ ] Risks — минимум 1

### Отсутствие проблем
- [ ] Нет placeholder-текстов (CHG-XXXX, YYYY-MM-DD, [Feature name])
- [ ] Нет технического жаргона (bounded context, aggregate, event)
- [ ] Язык: заголовки English, содержание Russian

---

## /analyst (System Analyst & Domain Architect)

### Структурная полнота
- [ ] 01-discovery.md заполнен
- [ ] 02-product-spec.md заполнен
- [ ] 03-domain-impact.md заполнен
- [ ] Domain docs обновлены (если требуется)

### 01-discovery.md качество
- [ ] Actors table ≥ 1 строка с данными
- [ ] Happy path ≥ 3 пронумерованных шага
- [ ] Edge cases ≥ 5 пунктов
- [ ] Error cases ≥ 3 пункта
- [ ] Success metrics указаны
- [ ] Out of scope заполнен

### 02-product-spec.md качество
- [ ] Goal — одно предложение
- [ ] User stories / JTBD — конкретные (не "пользователь хочет")
- [ ] Flows — пронумерованные шаги для каждого сценария
- [ ] Business rules — чёткие, проверяемые
- [ ] States & transitions — все состояния перечислены
- [ ] Acceptance criteria ≥ 5 пунктов
- [ ] Каждый AC проверяемый (не "должно работать хорошо")

### 03-domain-impact.md качество
- [ ] Affected bounded contexts — таблица с impact level
- [ ] Aggregate changes — конкретные изменения
- [ ] Domain events — таблица с producer, consumers, guarantees
- [ ] Invariants check — каждый инвариант домена проверен (✅/⚠️/❌)
- [ ] Нет нарушенных инвариантов без решения
- [ ] Ubiquitous language — новые термины определены

### Отсутствие проблем
- [ ] Нет placeholder-текстов
- [ ] DDD-термины используются корректно
- [ ] Нет конфликтов с существующим ubiquitous language

---

## /backend (Backend Architect)

### Структурная полнота
- [ ] 04-system-analysis.md заполнен
- [ ] 05-backend-proposal.md заполнен
- [ ] openapi.yaml существует (если есть API endpoints)

### 04-system-analysis.md качество
- [ ] API changes — все endpoints описаны (method, path, описание)
- [ ] DB impact — таблицы, индексы, миграции
- [ ] Async flows — описаны если применимо
- [ ] Failure modes — таблица ≥ 2 строки (failure, probability, mitigation)
- [ ] Backward compatibility — явно указано
- [ ] Observability — метрики, логи, алерты

### 05-backend-proposal.md качество
- [ ] Impacted modules — конкретный список
- [ ] API implementation — детали валидации, авторизации
- [ ] Model changes — diff схемы
- [ ] Events emitted — список с payload
- [ ] Migration plan — пронумерованные шаги
- [ ] Risks — минимум 1
- [ ] Fallback strategy — конкретный план

### openapi.yaml качество (если есть)
- [ ] OpenAPI 3.0.3 формат
- [ ] Все paths из system-analysis описаны
- [ ] Request/response schemas определены
- [ ] Error codes (400, 401, 403, 404, 500) описаны

---

## /frontend (Frontend Architect)

### Структурная полнота
- [ ] 06-frontend-proposal.md заполнен

### Качество содержания
- [ ] Surfaces — все UI-поверхности перечислены
- [ ] States per surface — минимум 4 состояния (loading, error, empty, success)
- [ ] Permissions — определены по ролям
- [ ] Validation rules — клиентская валидация описана
- [ ] Analytics events — таблица (event, trigger, properties)
- [ ] Feature flags — описаны если нужны
- [ ] Accessibility — keyboard, screen reader, focus, contrast

---

## /qa (QA Engineer)

### Структурная полнота
- [ ] 07-test-plan.md заполнен
- [ ] 08-rollout.md заполнен

### 07-test-plan.md качество
- [ ] Happy path test cases ≥ 3
- [ ] Edge case test cases ≥ 5
- [ ] Error case test cases ≥ 3
- [ ] Все acceptance criteria покрыты тестами
- [ ] Manual testing checklist заполнен
- [ ] Performance considerations указаны
- [ ] Regression areas определены

### 08-rollout.md качество
- [ ] Strategy выбрана и обоснована
- [ ] Feature flags таблица (если applicable)
- [ ] Rollback plan — конкретные шаги
- [ ] Success criteria для раскатки
- [ ] Communication plan

---

## Scoring

Для каждого скилла:
- **PASS** (≥ 80% критериев выполнено, нет критических пропусков)
- **NEEDS IMPROVEMENT** (50-79% или есть критические пропуски)
- **FAIL** (< 50%)

Критические пропуски (автоматический FAIL):
- Для /analyst: нарушенный инвариант без решения
- Для /backend: API endpoint без error handling
- Для /qa: acceptance criteria без покрытия тестами
