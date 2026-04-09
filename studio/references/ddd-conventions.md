# DDD conventions

## Domain docs structure
Каждый домен = папка с 8 файлами:
1. README.md — что делает, границы (inside/outside)
2. ubiquitous-language.md — термины, определения, запрещённые синонимы
3. aggregates.md — корень агрегата, state machine, ER diagram
4. business-rules.md — правила с rationale и edge cases
5. events.md — события, producers, consumers, payload, guarantees
6. invariants.md — неломаемые правила (чеклист)
7. integrations.md — upstream/downstream, контракты, SLA
8. ownership.md — кто владеет, кто апрувит, эскалация

## Principles
- Aggregate = consistency boundary, one transaction
- References between aggregates ONLY by ID
- Each term defined in EXACTLY one domain
- Invariants are STRONGER than business rules (invariants cannot be broken, rules can have exceptions)
- Events in PastTense format (SessionStarted, TurnCompleted)
- Prefer many small domains over one god-domain

## Domain docs contain ONLY business knowledge
- NO UI components
- NO service names
- NO implementation details
- NO code snippets
- After CHG merge: only business rules, aggregates, events, invariants go to domain docs
