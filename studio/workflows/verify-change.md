# Workflow: Verify Change

## Input
CHG-XXXX

## Process
1. Read entire change package
2. Spawn studio-verifier agent with CHG context
3. Receive VERIFICATION.md
4. If verdict = GAPS → show gaps, ask user what to do
5. If verdict = PASS → "CHG-XXXX verified. Ready for PR."
6. If verdict = FAIL → show critical issues, recommend fixes
