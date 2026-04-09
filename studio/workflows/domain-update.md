# Workflow: Domain Update

Обновление domain docs после merge change package.

## Trigger
After CHG status → done and PR merged.

## Process
1. Read 03-domain-impact.md — what should change
2. For each affected domain:
   - Read all 8 domain files
   - Apply changes described in domain-impact
   - Add wikilinks back to CHG
3. Verify: ubiquitous-language no conflicts, invariants consistent
4. Commit domain doc updates
