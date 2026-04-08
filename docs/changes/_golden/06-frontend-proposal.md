---
type: change
domain: training-session
status: done
tags:
  - change/CHG-0000
  - domain/training-session
  - frontend-proposal
created: 2026-04-08
---

# Frontend proposal · CHG-0000

## Surfaces

| Surface | Description | Route |
|---|---|---|
| Session Results Page | Экран результатов после завершения сессии. Добавляется кнопка «Ретроспектива» | `/sessions/:id/results` |
| Retrospective Panel | Панель с AI-анализом ходов и рекомендациями. Встраивается в Session Results | `/sessions/:id/results#retrospective` |

## States per surface

### Session Results Page

| State | UI | Condition |
|---|---|---|
| No retrospective (eligible) | Кнопка «Посмотреть ретроспективу» (primary) | Session `completed`, ≥1 Turn, ретроспектива не сгенерирована |
| No retrospective (ineligible) | Кнопка отсутствует | Session `abandoned`/`timed_out` или 0 Turns |
| Retrospective ready | Кнопка «Посмотреть ретроспективу» (outlined) + badge "Ready" | Ретроспектива уже сгенерирована |

### Retrospective Panel

| State | UI | Condition |
|---|---|---|
| Loading | Skeleton: 3 блока-загрузки с пульсирующей анимацией. Текст: «AI анализирует вашу тренировку...» Прогресс-бар (estimated 20 сек) | generationStatus = `generating` |
| Ready | Список ходов с анализом (accordion). Блок рекомендаций справа/снизу (responsive). Навигация по ходам: prev/next | generationStatus = `ready` |
| Error | Иконка ошибки + «Не удалось сгенерировать анализ» + кнопка «Попробовать снова» | generationStatus = `failed` |
| Empty | Иконка пустого состояния + «Недостаточно данных для анализа. Пройдите тренировку хотя бы с одним ходом.» | Session `completed` но 0 Turns |

### Component tree

```
SessionResultsPage
├── SessionSummaryCard (existing)
├── TurnListCard (existing)
└── RetrospectiveSection (NEW)
    ├── RetrospectiveButton         # Trigger generation
    ├── RetrospectivePanel          # Main container
    │   ├── RetrospectiveLoading    # Skeleton + progress
    │   ├── TurnAnalysisList        # Accordion of turn analyses
    │   │   └── TurnAnalysisCard    # Single turn analysis
    │   ├── RecommendationsBlock    # 1-3 recommendation cards
    │   │   └── RecommendationCard  # Single recommendation
    │   └── RetrospectiveError      # Error state
    └── RetrospectiveEmpty          # Empty state (0 turns)
```

## Permissions

| Action | Condition | Error handling |
|---|---|---|
| View retrospective | `session.learnerId === currentUser.id` | Redirect to 403 page |
| Generate retrospective | `session.learnerId === currentUser.id` AND `session.status === 'completed'` AND `session.turns.length >= 1` | Button disabled + tooltip |
| Retry generation | `retrospective.generationStatus === 'failed'` | Button visible only in error state |

## Validation rules

| Field | Rule | Error message |
|---|---|---|
| sessionId (URL param) | UUID format | «Некорректный ID сессии» |
| Session ownership | learnerId match | «У вас нет доступа к этой сессии» |
| Session status | `completed` only | «Ретроспектива доступна только для завершённых тренировок» |
| Turns count | ≥1 | «Недостаточно данных для анализа» |

## Analytics events

| Event | Trigger | Properties |
|---|---|---|
| `retrospective.button_clicked` | Learner нажимает кнопку «Ретроспектива» | `{ sessionId, isFirstTime: boolean }` |
| `retrospective.generation_started` | Генерация началась | `{ sessionId }` |
| `retrospective.generation_completed` | Генерация успешно завершена | `{ sessionId, durationMs, turnCount }` |
| `retrospective.generation_failed` | Генерация не удалась | `{ sessionId, error }` |
| `retrospective.retry_clicked` | Learner нажимает «Попробовать снова» | `{ sessionId, attemptNumber }` |
| `retrospective.turn_viewed` | Learner открывает анализ конкретного хода | `{ sessionId, turnNumber }` |
| `retrospective.time_spent` | Learner закрывает/уходит со страницы | `{ sessionId, durationMs, turnsViewed }` |

## Feature flags

| Flag | Default | Type | Description |
|---|---|---|---|
| `retrospective.enabled` | `false` | Boolean | Глобальный kill switch. Скрывает весь UI ретроспективы |
| `retrospective.generation.enabled` | `true` | Boolean | Разрешает генерацию новых ретроспектив. Если false — показываем только существующие |
| `retrospective.show_quality_badge` | `true` | Boolean | Показывать ли badge quality (strong/adequate/needs_improvement) на каждом ходе |

## Accessibility notes

| Requirement | Implementation |
|---|---|
| Keyboard navigation | Accordion ходов: Enter/Space для toggle, Arrow Up/Down для навигации между ходами |
| Screen reader | `aria-expanded` на accordion items. `aria-live="polite"` на loading/error states. `role="status"` на прогресс-баре |
| Color contrast | Quality badges (strong=green, adequate=yellow, needs_improvement=red): текстовая метка дублирует цвет. WCAG AA contrast ratio |
| Focus management | После завершения генерации — фокус на первый TurnAnalysisCard. После retry — фокус на loading state |
| Reduced motion | Skeleton-анимация заменяется статическим placeholder при `prefers-reduced-motion: reduce` |
| Touch targets | Кнопки и accordion items: минимум 44x44px |

## Responsive behavior

| Breakpoint | Layout |
|---|---|
| Desktop (≥1024px) | Ходы слева (60%), рекомендации справа (40%) — sidebar |
| Tablet (768-1023px) | Ходы сверху, рекомендации снизу — stacked |
| Mobile (<768px) | Одноколоночный layout, рекомендации после последнего хода |
