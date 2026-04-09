# Model profiles

Каждый agent может использовать разную модель в зависимости от сложности задачи.

## Profiles

| Profile | Description | Use case |
|---------|-------------|----------|
| quality | Всегда Opus 4.6 | Критические решения, архитектура |
| balanced | Opus для reasoning, Sonnet для execution | Стандартная работа |
| budget | Sonnet для reasoning, Haiku для execution | Высокий объём, низкая сложность |
| inherit | Модель текущей сессии | Sub-agents внутри сессии |

## Agent → model mapping (balanced profile)

| Agent | Model tier | Reasoning |
|-------|-----------|-----------|
| studio-pm | opus | Извлечение бизнес-требований — reasoning-heavy |
| studio-analyst | opus | DDD, инварианты — высокая сложность |
| studio-designer | sonnet | HTML/CSS генерация — execution-heavy |
| studio-backend | opus | Архитектурные решения |
| studio-frontend | sonnet | UI states — structured output |
| studio-qa | sonnet | Test cases — structured output |
| studio-verifier | opus | Goal-backward verification — reasoning-heavy |
| studio-reviewer | sonnet | Cross-reference — pattern matching |
| studio-codebase-mapper | sonnet | Code reading — high volume |
| studio-domain-extractor | opus | Domain modeling — reasoning-heavy |
| studio-conflict-resolver | opus | Conflict analysis — judgment |
