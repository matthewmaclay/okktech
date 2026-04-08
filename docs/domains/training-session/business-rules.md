---
type: business-rules
domain: training-session
tags:
  - domain/training-session
  - business-rule
---

# Business rules · Training Session

## Rules

### Turn Limit

> [!info] Rule: Turn Limit
> Сессия автоматически завершается с outcome `completed` при достижении максимального числа ходов, заданного сценарием.

- **Rationale:** Предотвращает бесконечные диалоги и контролирует стоимость API-вызовов к LLM.
- **Source:** Product decision

> [!bug] Edge case
> Если AI-ответ не успел сгенерироваться на последнем ходу — ход считается незавершённым, сессия переходит в `timed_out`.

### Session Timeout

> [!info] Rule: Session Timeout
> Если пользователь не отправляет ход в течение 30 минут, сессия автоматически завершается с outcome `abandoned`.

- **Rationale:** Освобождение ресурсов, корректная статистика прохождений.
- **Source:** Product decision

> [!bug] Edge case
> Таймер сбрасывается при каждом ходе пользователя. Таймер не действует в статусе `draft`.

### One Active Session Per Learner

> [!info] Rule: One Active Session Per Learner
> У ученика может быть только одна сессия в статусе `in_progress` одновременно.

- **Rationale:** Упрощает UX и предотвращает параллельную нагрузку на LLM от одного пользователя.
- **Source:** Product decision

> [!bug] Edge case
> При попытке начать новую сессию — предыдущая незавершённая переходит в `abandoned`.

### Manual Completion

> [!info] Rule: Manual Completion
> Ученик может завершить сессию досрочно в любой момент. Outcome — `completed`.

- **Rationale:** Свобода ученика прервать тренировку, если цель достигнута.
- **Source:** Product decision

> [!bug] Edge case
> Если ни одного Turn не было — outcome `abandoned`, а не `completed`.

## Policies
- Все сообщения внутри сессии сохраняются для последующего анализа в Assessment
- Время ответа AI (Facilitator) не входит в таймаут неактивности

## Corner cases

> [!warning] Потеря связи
> Потеря связи во время генерации AI-ответа: Turn остаётся в состоянии `pending_ai`, фоновый процесс доставляет ответ при reconnect.

> [!warning] Параллельные ходы
> Одновременная отправка двух ходов: принимается только первый, второй отклоняется с ошибкой conflict.
