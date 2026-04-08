---
type: invariants
domain: training-session
tags:
  - domain/training-session
  - invariant
---

# Invariants · Training Session

> [!danger] Invariants
> Не могут быть нарушены ни при каких обстоятельствах. Каждое изменение домена ОБЯЗАНО пройти проверку по этому списку.

- [ ] Session всегда привязана к существующему Scenario ID
- [ ] Session всегда привязана к аутентифицированному Learner ID
- [ ] Количество Turns в сессии <= maxTurns
- [ ] Статус сессии движется только вперёд: `draft → in_progress → completed | abandoned | timed_out`
- [ ] Каждый Turn имеет уникальный порядковый номер внутри сессии (монотонно возрастающий)
- [ ] У одного Learner не более одной сессии в статусе `in_progress`
- [ ] Завершённая сессия (completed, abandoned, timed_out) не может быть изменена
