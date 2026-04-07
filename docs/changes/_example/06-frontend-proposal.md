# Frontend proposal · CHG-0001

## Surfaces
- Экран сессии (чат)
- Экран завершения сессии

## States per surface

### Экран сессии
- Loading: скелетон чата + прогресс-бар в 0
- Error: баннер «Не удалось загрузить сессию»
- Empty: (не применимо — сессия начинается с промпта Facilitator)
- Success: чат + прогресс-бар `currentTurn / maxTurns`
- Warning: за 2 хода до лимита — жёлтый баннер «Осталось 2 хода»
- Limit reached: переход на экран завершения

### Экран завершения
- Loading: спиннер
- Error: «Не удалось сохранить результат»
- Success: карточка с outcome, количеством ходов, длительностью

## Permissions
Без изменений. Прогресс-бар виден всем участникам сессии.

## Validation rules
- Кнопка «Отправить» дизейблится при `currentTurn >= maxTurns`

## Analytics events
| Event | Trigger | Properties |
|---|---|---|
| session.turn_limit_warning_shown | За 2 хода до лимита | sessionId, turnsRemaining |
| session.completed_by_turn_limit | Достигнут лимит | sessionId, maxTurns |

## Feature flags
- `TURN_LIMIT_PROGRESS_BAR` — показывать ли прогресс-бар (для A/B теста)

## Accessibility notes
- Прогресс-бар имеет `aria-valuenow`, `aria-valuemax`
- Предупреждение «Осталось 2 хода» озвучивается screen reader через `aria-live="polite"`
