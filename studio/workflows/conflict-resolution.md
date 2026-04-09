# Workflow: Conflict Resolution

## Trigger
Automatic when studio-stage-gate or studio-conflict-detect hook finds domain overlap.

## Process
1. Identify conflicting CHGs and shared domains
2. Spawn studio-conflict-resolver agent
3. Present recommendation to user
4. Update metadata.yaml of both CHGs based on decision
