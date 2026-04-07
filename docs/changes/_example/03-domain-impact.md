# Domain impact · CHG-0001

## Affected bounded contexts
| Context | Impact level | Source of truth |
|---|---|---|
| Training Session | Высокий | domains/training-session/ |
| Scenario Catalog | Средний | (будет создан) |

## Aggregate changes

### Session
- Добавляется поле `maxTurns` (копируется из Scenario при создании сессии)
- Логика завершения: при `turns.length >= maxTurns` → автоматический переход в `completed`

## Domain events
| Event | Producer | Consumers | Guarantees |
|---|---|---|---|
| SessionFinished | Session | Assessment, Learner Progress, Analytics | at-least-once |

Payload SessionFinished дополняется: `{..., reason: "turn_limit" | "manual" | "timeout"}`

## Invariants check
- [x] Session привязана к Scenario ID · ✅ preserved
- [x] Session привязана к Learner ID · ✅ preserved
- [x] Количество Turns <= maxTurns · ✅ preserved (это и есть новый инвариант)
- [x] Статус движется только вперёд · ✅ preserved
- [x] Уникальный номер Turn · ✅ preserved
- [x] Одна активная сессия на ученика · ✅ preserved

## Anti-corruption layer needed?
Нет. Изменение затрагивает только внутреннюю логику Session.

## Shared kernel risks
- Поле maxTurns дублируется в Session (копия из Scenario). Это сознательное решение: сессия не должна зависеть от изменений сценария после старта.

## Open questions
- (все отвечены)
