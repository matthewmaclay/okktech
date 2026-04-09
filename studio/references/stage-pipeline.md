# Stage pipeline

## Pipeline overview

```
Stage 00  /pm        → change-draft.md + metadata.yaml
Stage 01  /analyst   → 01-discovery.md
Stage 02  /analyst   → 02-product-spec.md
Stage 03  /analyst   → 03-domain-impact.md + domain docs update
Stage 3.5 /designer  → 03.5-design-mockups.md + mockups/*.html
Stage 04  /backend   → 04-system-analysis.md
Stage 05  /backend   → 05-backend-proposal.md + openapi.yaml
Stage 06  /frontend  → 06-frontend-proposal.md
Stage 07  /qa        → 07-test-plan.md + 08-rollout.md
Stage 08  /verify    → VERIFICATION.md
Stage 09  Ship       → PR + release-notes.md
```

## Status values
`draft → discovery → spec → analysis → design → in-progress → done`

## Parallel stages
После завершения analysis (Stage 03):
- Designer (Stage 3.5) и Backend (Stage 04-05) могут работать ПАРАЛЛЕЛЬНО
- Frontend (Stage 06) ждёт и мокапы И backend proposal
- QA (Stage 07) может начать test plan от acceptance criteria ещё на этапе spec

## Iteration rules
Если позднее роль находит проблему в предыдущем этапе:
1. Записать в 10-open-questions.md
2. Если критично (меняет scope) → СТОП, escalation gate
3. Если некритично → зафиксировать, продолжить
4. При возврате → каскадное обновление downstream документов

## Multi-person flow
Каждый stage может выполняться разным человеком. Передача через:
- `branch` mode: коммит в chg/CHG-XXXX → pull → /resume
- `pr` mode: PR с обязательным review перед передачей
