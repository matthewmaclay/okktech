# System analysis · CHG-0001

## API changes

### New endpoints
(нет)

### Modified endpoints
- `POST /sessions` — добавляется `maxTurns` в ответ (копируется из сценария)
- `POST /sessions/{id}/turns` — при достижении лимита возвращает 200 с `sessionCompleted: true`
- `GET /sessions/{id}` — добавляется поле `maxTurns` и `currentTurn`

### Deprecated
(нет)

## DB impact
- Tables affected: `sessions`
- New indexes: (нет)
- Migration required: да, `ALTER TABLE sessions ADD COLUMN max_turns INTEGER DEFAULT 20`

## Async flows
Без изменений. SessionFinished событие уже существует, дополняется полем `reason`.

## Consistency model
Строгая внутри агрегата Session. Проверка `turns.length < maxTurns` выполняется синхронно при добавлении Turn.

## Failure modes
| Failure | Probability | Mitigation |
|---|---|---|
| Race condition при параллельных ходах | Низкая | Оптимистичная блокировка по version |
| AI не отвечает на последнем ходу | Средняя | Таймаут 30с → outcome `timed_out` |

## Backward compatibility
Полная. Старые сессии без maxTurns продолжают работать. Новые сессии получают maxTurns из сценария.

## Observability
- New metrics: `session.completed.by_reason` (turn_limit / manual / timeout)
- New logs: `session.turn_limit_reached` при достижении лимита
- Alerts needed: нет
