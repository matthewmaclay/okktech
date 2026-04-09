---
type: meta
tags:
  - meta
  - glossary
---

# Glossary

> [!tip] Auto-index
> Этот глоссарий автоматически собирает термины из всех доменов.

## All terms across domains

```dataview
TABLE domain AS "Domain"
FROM "domains"
WHERE type = "ubiquitous-language"
SORT domain
```

## Manual cross-domain terms

| Term | Definition | Domain | Notes |
|---|---|---|---|
| CHG | Change package — иммутабельный набор документов, описывающий одно изменение | _meta | Формат: CHG-XXXX |
| ADR | Architecture Decision Record — запись архитектурного решения | _meta | Формат: ADR-XXX |
| Bounded Context | Явная граница, внутри которой модель имеет определённый смысл | _meta | DDD-термин |
| Aggregate | Кластер доменных объектов, обрабатываемых как единица | _meta | DDD-термин |
| Invariant | Правило, которое не может быть нарушено ни при каких обстоятельствах | _meta | Строже чем business rule |
