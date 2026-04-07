# Rollout · CHG-0001

## Strategy
Feature flag → постепенная раскатка (10% → 50% → 100%)

## Feature flags
| Flag | Default | Condition to enable |
|---|---|---|
| TURN_LIMIT_ENABLED | false | Включить для 10% пользователей, затем расширять |
| TURN_LIMIT_PROGRESS_BAR | false | Включить вместе с TURN_LIMIT_ENABLED |

## Rollback plan
1. Выключить флаг TURN_LIMIT_ENABLED
2. Новые сессии создаются без проверки лимита
3. Существующие сессии с лимитом продолжают работать (обратная совместимость)

## Communication plan
- Уведомление авторам сценариев о новом поле maxTurns
- Запись в changelog

## Success criteria for rollout
- Нет роста ошибок 5xx
- NPS тренировки не падает более чем на 2 пункта
- Средняя стоимость сессии снижается на 30%+
