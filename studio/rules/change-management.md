---
paths:
  - "docs/changes/**"
---

# Change management rules

## Change package structure
Каждый change package — папка `CHG-XXXX/` со следующими файлами:
```
index.md            → Оглавление
change-draft.md     → Черновик (что и зачем)
metadata.yaml       → Машиночитаемые метаданные
01-discovery.md     → Актёры, сценарии, edge cases
02-product-spec.md  → Продуктовая спецификация
03-domain-impact.md → Влияние на домены
04-system-analysis.md → Системный анализ
05-backend-proposal.md → Backend предложение
06-frontend-proposal.md → Frontend предложение
07-test-plan.md     → План тестирования
08-rollout.md       → План раскатки
09-decisions.md     → Лог решений
10-open-questions.md → Открытые вопросы
release-notes.md    → Release notes
```

## Stage pipeline
```
Stage 00 · Intake       → change-draft.md + metadata.yaml
Stage 01 · Discovery    → 01-discovery.md
Stage 02 · Product spec → 02-product-spec.md
Stage 03 · Domain impact → 03-domain-impact.md
Stage 04 · System analysis → 04-system-analysis.md
Stage 05 · Backend      → 05-backend-proposal.md
Stage 06 · Frontend     → 06-frontend-proposal.md
Stage 07 · QA + Rollout → 07-test-plan.md + 08-rollout.md
Stage 08 · Ship         → PR + release-notes.md + domain docs update
```

## Iteration rules
- Если на Stage 05 backend задал вопрос, меняющий product spec:
  1. Зафиксировать вопрос в 10-open-questions.md
  2. Обновить 02-product-spec.md
  3. Перепроверить 03-domain-impact.md
  4. Обновить 05-backend-proposal.md
- Каскадное обновление — обязательно

## Metadata rules
- `id`: уникальный, инкрементальный CHG-XXXX
- `status`: обновляется при каждом переходе
- `owners`: заполняется на этапе intake
- `domains`: заполняется на этапе domain impact
- `open_questions`: синхронизируется с 10-open-questions.md

## Immutability
- После мержа change package ЗАМОРАЖИВАЕТСЯ
- Исправления — новый CHG с `related_changes` ссылкой

## Conflict resolution

Два change package могут одновременно менять один домен. Это нормально, но требует явного управления.

### Обнаружение
При создании или обновлении change package AI-роль ОБЯЗАНА:
1. Просканировать все активные CHG (status ≠ done) через `ls docs/changes/`
2. Прочитать `metadata.yaml` каждого активного CHG
3. Сравнить поля `domains` и `capabilities`
4. Если пересечение найдено → объявить CONFLICT

### Уведомление
При обнаружении конфликта:
1. Добавить запись в `metadata.yaml` → `conflicts_with`
2. Добавить вопрос в `10-open-questions.md` с тегом `[CONFLICT]`
3. Сообщить пользователю: какой CHG конфликтует и по каким доменам

### Разрешение
1. Определить domain owner из `docs/domains/[name]/ownership.md`
2. Domain owner — арбитр, решает приоритет
3. Менее приоритетный CHG получает `blocked_by: CHG-XXXX`
4. После мержа приоритетного CHG — менее приоритетный обязан:
   - Rebase domain impact (03-domain-impact.md)
   - Перепроверить инварианты
   - Обновить backend/frontend proposals если затронуты

### Трекинг
Обновить `conflicts_with` запись:
- `resolution: resolved`
- `resolution_note: "описание как решили"`

## Stage gates

Переход между стадиями контролируется валидационным хуком. При попытке изменить `status` в metadata.yaml хук проверяет exit criteria текущей стадии.

### draft → discovery
- [ ] `change-draft.md` заполнен (не placeholder)
- [ ] `metadata.yaml` → title не пустой
- [ ] `metadata.yaml` → owners.product указан

### discovery → spec
- [ ] `01-discovery.md` заполнен
- [ ] Actors table содержит данные (≥ 1 строка)
- [ ] Happy path содержит ≥ 3 шага
- [ ] Edge cases содержит ≥ 3 пункта

### spec → analysis
- [ ] `02-product-spec.md` заполнен
- [ ] Acceptance criteria содержит ≥ 5 проверяемых пунктов
- [ ] Flows секция заполнена

### analysis → in-progress
- [ ] `03-domain-impact.md` заполнен
- [ ] `04-system-analysis.md` заполнен
- [ ] `05-backend-proposal.md` заполнен
- [ ] `metadata.yaml` → domains не пустой

### in-progress → done
- [ ] `06-frontend-proposal.md` заполнен
- [ ] `07-test-plan.md` заполнен
- [ ] `08-rollout.md` заполнен
- [ ] `release-notes.md` заполнен
- [ ] Нет вопросов с тегом `[BLOCKING]` в `10-open-questions.md`

### Placeholder detection
Хук предупреждает (без блокировки) если файл содержит placeholder-тексты из шаблона:
`CHG-XXXX`, `YYYY-MM-DD`, `[Feature name]`, `[Flow name]`, `[Aggregate name]`, `[Decision title]`, `[Surface name]`
