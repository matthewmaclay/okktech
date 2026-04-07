# Backend proposal · CHG-0001

## Impacted modules
- `src/modules/training-session/session.aggregate.ts`
- `src/modules/training-session/session.service.ts`
- `src/modules/training-session/dto/`

## API implementation
- `POST /sessions/{id}/turns`: перед добавлением Turn проверяем `session.turns.length < session.maxTurns`. Если лимит достигнут — возвращаем 200 с `{sessionCompleted: true, outcome: "completed"}` и публикуем SessionFinished.
- `POST /sessions`: при создании копируем `maxTurns` из Scenario.

## Model changes
```diff
 interface Session {
   id: string
   scenarioId: string
   learnerId: string
   status: SessionStatus
+  maxTurns: number
   turns: Turn[]
   outcome?: SessionOutcome
 }
```

## Events emitted
- SessionFinished — дополняется `reason: "turn_limit" | "manual" | "timeout"`

## Migration plan
1. Добавить колонку `max_turns` с дефолтом 20
2. Задеплоить код с поддержкой maxTurns
3. Обновить существующие сценарии (заполнить maxTurns)

## Risks
- Race condition при быстрой отправке ходов — решается оптимистичной блокировкой

## Fallback strategy
- Убрать проверку лимита в коде. Колонка остаётся, просто не используется.
