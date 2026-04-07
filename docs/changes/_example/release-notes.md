# Release notes · CHG-0001

## Summary
Добавлен лимит ходов в тренировочных сессиях. Каждый сценарий теперь задаёт максимальное количество ходов. При достижении лимита сессия автоматически завершается.

## What changed
- Сессия хранит maxTurns и автоматически завершается при достижении
- Прогресс-бар в UI показывает текущий/максимальный ходы
- Предупреждение за 2 хода до лимита
- SessionFinished событие дополнено полем `reason`

## Breaking changes
- (нет)

## Migration required
- Колонка `max_turns` в таблице sessions (дефолт 20)
- Существующие сценарии получают maxTurns = 20

## Feature flags introduced
- `TURN_LIMIT_ENABLED` — включение лимита ходов
- `TURN_LIMIT_PROGRESS_BAR` — отображение прогресс-бара

## Domain docs updated
- domains/training-session/business-rules.md — добавлено правило «Turn Limit»
- domains/training-session/invariants.md — добавлен инвариант Turns <= maxTurns
- domains/training-session/aggregates.md — обновлены consistency rules Session
