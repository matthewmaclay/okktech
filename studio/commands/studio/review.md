---
name: studio-review
description: "Cross-reference аудит change package. Проверяет целостность документов."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX]"
---

# Studio Review

Запускает cross-reference аудит change package: проверяет целостность, полноту и согласованность документов.

## Input
Change package ID: $ARGUMENTS

## Validation
Проверь что `docs/changes/$ARGUMENTS/` существует.
Если нет — выведи список доступных CHG и предложи выбрать.

## Process

### Step 1: Загрузи агент
Прочитай определение:
1. `~/.claude/studio/agents/studio-review.md`
2. `studio/agents/studio-review.md`
3. `.claude/skills/review-chg/SKILL.md` (fallback)

### Step 2: Запусти агент
Передай CHG-ID. Агент выполняет полный аудит:

**Проверки целостности:**
- metadata.yaml заполнен корректно (status, domains, tags)
- Все обязательные файлы присутствуют для текущего статуса
- Frontmatter валиден во всех markdown файлах

**Проверки согласованности:**
- Термины в документах соответствуют ubiquitous-language.md затронутых доменов
- Acceptance criteria из change-draft.md покрыты в product-spec.md
- API из backend-proposal.md используются в frontend-proposal.md
- Test cases из test-plan.md покрывают acceptance criteria
- Открытые вопросы не заблокировали критичные решения

**Проверки domain impact:**
- Все затронутые домены перечислены в metadata.yaml
- Новые события описаны
- Инварианты не нарушены

### Step 3: Результат
Выведи отчёт:
- PASS / WARN / FAIL для каждой категории
- Список найденных расхождений
- Рекомендации по исправлению
