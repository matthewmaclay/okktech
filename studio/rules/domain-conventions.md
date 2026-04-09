---
paths:
  - "docs/domains/**"
---

# Domain modeling rules

## Aggregate rules
- Агрегат = граница консистентности
- Один агрегат — одна транзакция
- Ссылки между агрегатами — только по ID
- Если данные нужны из другого домена — это ref, а не вложение

## Ubiquitous language
- Каждый термин определён ровно в одном домене
- Forbidden synonyms — жёстко, нельзя использовать нигде
- Conflicts with — задокументировать, если термин значит другое в другом домене

## Invariants
- Инвариант = правило, которое НИКОГДА не может быть нарушено
- Отличие от business rule: бизнес-правило может иметь исключения, инвариант — нет
- Формулировка: утвердительная (`Session всегда привязана к Learner ID`)

## Events
- Формат: PastTense (`SessionStarted`, `TurnCompleted`)
- Payload: минимально необходимый набор данных
- Гарантии: at-least-once по умолчанию
- Idempotency: всегда указывать ключ идемпотентности

## Domain boundaries
- Если сомневаешься, вынеси в отдельный домен
- Лучше мелкие домены, чем один god-domain
- README.md: секция "Outside this domain" — обязательна

## When reading domain docs
- Всегда читай README.md первым — понять границы
- Потом ubiquitous-language.md — понять термины
- Потом invariants.md — понять ограничения
- Только потом остальное
