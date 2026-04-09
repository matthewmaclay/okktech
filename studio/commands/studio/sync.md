---
name: studio-sync
description: "Синхронизирует change packages с Linear issues."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[CHG-XXXX | all]"
---

# Studio Sync

Синхронизирует change packages с Linear issues: создаёт, обновляет, линкует.

## Input
CHG-ID или "all": $ARGUMENTS

## Process

### Step 1: Загрузи агент
Прочитай определение:
1. `~/.claude/studio/agents/studio-sync.md`
2. `studio/agents/studio-sync.md`
3. `.claude/skills/sync-linear/SKILL.md` (fallback)

### Step 2: Определи scope
- Если `$ARGUMENTS` = "all" — обработай все CHG в `docs/changes/`
- Если `$ARGUMENTS` = CHG-XXXX — обработай только указанный
- Если пусто — предложи выбрать

### Step 3: Запусти агент
Для каждого CHG агент выполняет:

**Если issue не существует (нет linear_issue_id в metadata.yaml):**
1. Создай Linear issue из change-draft.md (title, description)
2. Установи labels из metadata.yaml tags
3. Запиши linear_issue_id в metadata.yaml

**Если issue существует:**
1. Прочитай текущий статус issue из Linear
2. Сравни с metadata.yaml status
3. Обнови description если документы изменились
4. Синхронизируй статус (draft→backlog, in-progress→started, etc.)

### Step 4: Результат
Выведи для каждого CHG:
- CHG-ID → Linear issue ID
- Действие: created / updated / skipped
- Ссылка на issue
