# Workflow: Map Codebase

Параллельный анализ кодовой базы по зонам.

## Input
Путь к проекту.

## Process
1. Bootstrap: mkdir docs/_onboard/zones docs/_onboard/synthesis
2. Codebase map: stats, stack, directory structure → 00-codebase-map.md
3. Zone definition: split into zones → 01-zones.md
4. Parallel zone analysis: spawn studio-codebase-mapper agent per zone (up to 3 parallel)
5. Verify all zone files created and non-empty
6. Track progress in synthesis/progress.md

## Resume
If docs/_onboard/synthesis/progress.md exists → read it, skip completed zones.
