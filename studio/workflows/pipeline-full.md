# Pipeline: Full Feature

Оркестрация полного цикла: PM → Analyst ⇄ PM review → Designer → Backend ⇄ Analyst review → Frontend ⇄ Backend review → QA ⇄ Frontend review → Verify → Merge.

**Каждый stage проходит перекрёстное ревью от соседнего специалиста.**

## Architecture
Каждая роль = отдельный Agent с fresh context. Orchestrator остаётся lean.

## Change types
- **DMNCHG-XXXX** — single-domain → `docs/domains/{domain}/changes/`
- **CHG-XXXX** — cross-domain → `docs/changes/`

## Cross-review matrix

```
Автор          → Ревьюер         → Фокус ревью
─────────────────────────────────────────────────
PM             → Analyst          → Полнота требований, пропущенные сценарии, невыявленные актёры
Analyst        → Backend          → Реализуемость, consistency model, пропущенные failure modes
Backend        → Analyst          → Не нарушает ли реализация доменную модель, инварианты, UL
Backend        → Frontend         → API контракт понятен, все states покрыты, error codes ясны
Frontend       → Backend          → API удобен для UI, нет лишних round-trips, pagination есть
Frontend       → QA               → Тестируемость UI, data-test-id покрытие, states проверяемы
QA             → Frontend         → Все edge cases имеют UI state, error messages user-friendly
```

## Execution

### Stage 1: PM Intake
1. Запусти Agent: studio-pm.md + "Feature: $ARGUMENTS"
2. Результат: {chg_id, title, open_questions}
3. STATE.md: current_phase: draft

### Stage 1.5: Cross-review — Analyst reviews PM
Analyst читает change-draft.md и проверяет (БЕЗ технических деталей):
- Все ли пользовательские сценарии описаны?
- Нет ли пропущенных актёров?
- Метрики успеха измеримы?
- Out of scope достаточен?
- AC из change-draft покрывает все flows?

Результат: `cross-review-pm.md` в change package.
Если critical issues → вернуть PM на доработку.

### Stage 2: Analyst
1. Запусти Agent: studio-analyst.md + "CHG: $CHG_ID"
2. Результат: {domains_affected, invariants_violated, new_events}
3. STATE.md: current_phase: analysis

### Stage 2.5: Cross-review — Backend reviews Analyst
Backend Architect читает 01-discovery, 02-product-spec, 03-domain-impact и проверяет:
- Можно ли это реализовать с текущим стеком?
- Consistency model описан? (eventual vs strong)
- Failure modes очевидные учтены?
- Event granularity правильная? (не слишком мелко / не слишком крупно)
- Data model реалистичен? (нет невозможных JOIN'ов, нереальных индексов)

Результат: `cross-review-analyst.md`.
Если critical → вернуть Analyst на доработку.

### Stage 3: Designer
1. Запусти Agent: studio-designer.md + "CHG: $CHG_ID"
2. Результат: {mockups_created, surfaces}
3. STATE.md: current_phase: design

### Stage 4: Backend
1. Запусти Agent: studio-backend.md + "CHG: $CHG_ID"
2. Результат: {endpoints_count, has_openapi, migration_required}

### Stage 4.5: Cross-review — Analyst reviews Backend
Analyst перечитывает 04-system-analysis и 05-backend-proposal и проверяет:
- Реализация не нарушает доменную модель?
- Aggregate boundaries соблюдены?
- Events payload соответствует domain events?
- Naming соответствует ubiquitous language?
- Инварианты не нарушены реализацией?
- API naming консистентен с доменной моделью?

Результат: `cross-review-backend.md`.
Если инвариант нарушен → ESCALATION, вернуть Backend на доработку.

### Stage 5: Frontend
1. Запусти Agent: studio-frontend.md + "CHG: $CHG_ID"
2. Результат: {surfaces_count, states_count, analytics_events}

**ВАЖНО:** Frontend ОБЯЗАН указать `data-test-id` для каждого интерактивного элемента:
- Кнопки: `data-test-id="btn-{action}"`
- Инпуты: `data-test-id="input-{field}"`
- Формы: `data-test-id="form-{name}"`
- Списки: `data-test-id="list-{name}"`
- Модалы: `data-test-id="modal-{name}"`
- States: `data-test-id="state-{name}-{state}"` (loading, error, empty, success)

### Stage 5.5: Cross-reviews (два параллельно)

**Backend reviews Frontend:**
- API endpoints из frontend-proposal совпадают с openapi.yaml?
- Error codes все обрабатываются?
- Нет ли лишних API calls (N+1, waterfall)?
- Auth tokens передаются правильно?
- Pagination/infinite scroll соответствует backend capabilities?

**Frontend reviews Backend:**
- API удобен для UI? Не приходится делать 5 запросов для одного экрана?
- Response format удобен для отображения? Или нужна трансформация?
- WebSocket/SSE events — frontend подписан на правильные?
- Bulk operations есть если UI нужен batch?

Результаты: `cross-review-frontend-by-backend.md`, `cross-review-backend-by-frontend.md`.

### Stage 6: QA
1. Запусти Agent: studio-qa.md + "CHG: $CHG_ID"
2. Результат: {test_cases_count, rollback_defined}

**QA обязан проверить data-test-id покрытие:**
- Каждый test case ссылается на конкретный `data-test-id`
- Нет test case без target selector
- Все interactive elements из frontend-proposal имеют data-test-id

### Stage 6.5: Cross-reviews (два параллельно)

**Frontend reviews QA:**
- Все UI states имеют test cases?
- Error messages в тестах соответствуют реальным?
- Test cases учитывают responsive (mobile/tablet/desktop)?
- Accessibility test cases есть?

**QA reviews Frontend:**
- Все interactive elements имеют `data-test-id`?
- Naming конвенция `data-test-id` консистентна?
- Нет ли elements без accessible name?
- States можно различить программно (не только визуально)?
- Все error states имеют уникальный `data-test-id` для error message?

Результаты: `cross-review-qa-by-frontend.md`, `cross-review-frontend-by-qa.md`.

### Stage 7: Verify
1. Запусти Agent: studio-verifier.md + "CHG: $CHG_ID"
2. Верификатор ТАКЖЕ проверяет все cross-review файлы:
   - Все critical issues из cross-reviews разрешены?
   - Нет ли unresolved cross-review findings?
3. Результат: {verified_count, gaps_count, verdict}

### Stage 8: Domain Merge
1. Запусти Agent: studio-domain-merger.md + "CHG: $CHG_ID"
2. Перелей знания в domain docs
3. metadata.yaml → status: done

### Финал
```
DMNCHG-XXXX / CHG-XXXX · [title]
Documents: 15+ files created
Cross-reviews: 7 cross-review files
Mockups: N HTML files
data-test-ids: N selectors defined
OpenAPI: yes/no
Test cases: N (all with data-test-id targets)
Verification: PASS/GAPS/FAIL
Domain merge: N domains updated
```

## Cross-review format

Каждый cross-review файл:
```markdown
# Cross-review: [Author] reviewed by [Reviewer]

## Verdict: APPROVED / NEEDS WORK / BLOCKED

## Findings
| # | Finding | Severity | File:Section | Recommendation |
|---|---------|----------|-------------|---------------|

## Critical (must fix before next stage)
-

## Recommendations (nice to have)
-
```

## Autonomous mode
Если `--auto`:
- Cross-reviews выполняются автоматически
- NEEDS WORK → автоматическая доработка (max 2 итерации per stage)
- BLOCKED → запись в decisions-log, продолжить
- Не спрашивать пользователя

## Iteration rules
Если cross-review возвращает NEEDS WORK:
1. Автор дорабатывает свой документ
2. Ревьюер перечитывает
3. Max 2 итерации, потом → escalation или продолжить с пометкой
