---
type: change
domain: training-session
status: done
tags:
  - change/CHG-0000
  - domain/training-session
  - test-plan
created: 2026-04-08
---

# Test plan · CHG-0000

## Scope

Тестирование системы ретроспективы сессии: генерация AI-анализа ходов, кеширование результатов, отображение в UI, обработка ошибок.

**Затронутые модули:**
- Backend: `training-session/retrospective/`
- Frontend: `session-results/RetrospectivePanel`
- Infrastructure: job queue, LLM service integration

## Test cases

### Happy path

- [ ] **HP-01: Генерация ретроспективы для completed сессии с 5 ходами**
  - Precondition: Session status=`completed`, 5 Turns
  - Action: POST `/sessions/:id/retrospective/generate`
  - Expected: 202 Accepted → polling → 200 OK с `turnAnalyses` (5 элементов) и `recommendations` (1-3 элемента)
  - Verify: каждый TurnAnalysis содержит `turnNumber`, `analysis` (непустой), `quality` (одно из трёх значений)

- [ ] **HP-02: Просмотр кешированной ретроспективы**
  - Precondition: Ретроспектива уже сгенерирована (status=`ready`)
  - Action: GET `/sessions/:id/retrospective`
  - Expected: 200 OK мгновенно (без генерации), тело ответа идентично первоначальному

- [ ] **HP-03: Навигация по ходам в UI**
  - Precondition: Ретроспектива отображена, 5 ходов
  - Action: Клик по accordion каждого хода
  - Expected: Анализ хода раскрывается/сворачивается. Keyboard navigation (Arrow keys) работает

- [ ] **HP-04: Генерация ретроспективы для старой completed сессии**
  - Precondition: Session status=`completed`, создана до релиза фичи, без ретроспективы
  - Action: Кнопка «Ретроспектива» → генерация
  - Expected: Генерация проходит успешно, результат сохраняется

### Edge cases

- [ ] **EC-01: Сессия с 0 ходов (completed без Turn)**
  - Precondition: Session status=`completed`, 0 Turns
  - Action: POST `/sessions/:id/retrospective/generate`
  - Expected: 422 Unprocessable Entity `{ error: "no_turns" }`
  - UI: сообщение «Недостаточно данных для анализа»

- [ ] **EC-02: Abandoned session**
  - Precondition: Session status=`abandoned`
  - Action: POST `/sessions/:id/retrospective/generate`
  - Expected: 409 Conflict `{ error: "session_not_completed" }`
  - UI: кнопка «Ретроспектива» отсутствует

- [ ] **EC-03: Timed out session**
  - Precondition: Session status=`timed_out`
  - Action: POST `/sessions/:id/retrospective/generate`
  - Expected: 409 Conflict `{ error: "session_not_completed" }`

- [ ] **EC-04: Одноходовая сессия (1 Turn)**
  - Precondition: Session status=`completed`, 1 Turn
  - Action: Генерация ретроспективы
  - Expected: Генерация проходит успешно. `turnAnalyses` содержит 1 элемент. `recommendations` содержит 1-3 элемента

- [ ] **EC-05: Сессия с maxTurns ходов (15 ходов)**
  - Precondition: Session status=`completed`, 15 Turns (maxTurns=15)
  - Action: Генерация ретроспективы
  - Expected: Детальный анализ для последних 10 ходов, сокращённый для первых 5

- [ ] **EC-06: Повторный запрос генерации (idempotency)**
  - Precondition: Ретроспектива уже сгенерирована
  - Action: POST `/sessions/:id/retrospective/generate`
  - Expected: 200 OK с существующим результатом (не 202, не новая генерация)

- [ ] **EC-07: Конкурентные запросы генерации**
  - Precondition: Ретроспектива не существует
  - Action: Два одновременных POST `/sessions/:id/retrospective/generate`
  - Expected: Первый получает 202, второй получает 202 с тем же jobId. Генерация запускается один раз

- [ ] **EC-08: Сессия в статусе draft**
  - Action: POST `/sessions/:id/retrospective/generate`
  - Expected: 409 Conflict

- [ ] **EC-09: Сессия в статусе in_progress**
  - Action: POST `/sessions/:id/retrospective/generate`
  - Expected: 409 Conflict

### Error cases

- [ ] **ER-01: LLM недоступен (timeout)**
  - Setup: Mock LLM service → timeout 61 секунда
  - Action: Генерация ретроспективы
  - Expected: 3 retry с exponential backoff (5s, 15s, 45s). После 3 неудачных попыток — status=`failed`. UI: «Анализ временно недоступен» + кнопка «Повторить»

- [ ] **ER-02: Несуществующая сессия**
  - Action: GET `/sessions/nonexistent-uuid/retrospective`
  - Expected: 404 Not Found

- [ ] **ER-03: Доступ к чужой сессии**
  - Precondition: Session принадлежит другому Learner
  - Action: GET `/sessions/:id/retrospective` (другой пользователь)
  - Expected: 403 Forbidden

- [ ] **ER-04: LLM возвращает некорректный формат**
  - Setup: Mock LLM → возвращает невалидный JSON
  - Action: Генерация ретроспективы
  - Expected: Retry с уточнённым промптом. После 3 попыток — status=`failed`

- [ ] **ER-05: Ручной retry после failure**
  - Precondition: generationStatus=`failed`
  - Action: POST `/sessions/:id/retrospective/generate`
  - Expected: status переходит в `generating`, новая попытка генерации

## Manual testing checklist

- [ ] Пройти полную сессию (5+ ходов) → завершить → открыть ретроспективу → убедиться, что анализ содержателен
- [ ] Проверить skeleton-загрузку: анимация плавная, прогресс-бар адекватный
- [ ] Проверить responsive layout: desktop, tablet, mobile
- [ ] Проверить keyboard navigation: Tab, Enter/Space, Arrow keys через accordion
- [ ] Проверить screen reader: VoiceOver (macOS) читает анализ ходов и рекомендации
- [ ] Проверить quality badges: цвета различимы, текстовые метки есть
- [ ] Проверить reduced motion: анимации отключены
- [ ] Проверить deep link: прямая ссылка `/sessions/:id/results#retrospective` открывает панель
- [ ] Проверить feature flag off: UI ретроспективы полностью скрыт

## Performance considerations

| Metric | Target | Measurement method |
|---|---|---|
| Generation latency (p95) | ≤30 секунд | `retrospective.generation.duration_ms` histogram |
| GET retrospective (cached) | ≤200ms | API response time |
| Frontend render (ready state) | ≤100ms FCP | Lighthouse |
| Polling overhead | ≤1 req/2s | Network tab |

### Load testing

- 50 concurrent generation requests → queue handles gracefully, no duplicates
- 200 concurrent GET requests (cached) → ≤200ms p99

## Regression areas

| Area | Risk | Test |
|---|---|---|
| Session lifecycle | Генерация ретроспективы не должна влиять на Session.status | Unit test: Session status immutable during/after retrospective generation |
| Turn immutability | Анализ ходов — read-only, ходы не модифицируются | Unit test: Turns unchanged after retrospective |
| Session Results page | Существующий UI не сломан | E2E: все существующие тесты Session Results pass |
| Event consumers | Новое событие RetrospectiveGenerated не ломает существующих consumers | Integration test: SessionFinished consumers unaffected |
| Auth | Новые эндпоинты защищены так же, как существующие Session endpoints | Security test: unauthorized access returns 403 |
