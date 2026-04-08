---
name: sync-linear
description: "Linear Sync. Синхронизирует change packages с Linear issues: создаёт, обновляет, линкует. Используй для синхронизации документации с Linear."
allowed-tools: "Read Edit Write Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Agent mcp__84c1f63d-4d4a-45fb-81fa-6a39c22814e9__save_issue mcp__84c1f63d-4d4a-45fb-81fa-6a39c22814e9__list_issues mcp__84c1f63d-4d4a-45fb-81fa-6a39c22814e9__get_issue mcp__84c1f63d-4d4a-45fb-81fa-6a39c22814e9__list_teams mcp__84c1f63d-4d4a-45fb-81fa-6a39c22814e9__list_issue_labels mcp__84c1f63d-4d4a-45fb-81fa-6a39c22814e9__list_issue_statuses mcp__84c1f63d-4d4a-45fb-81fa-6a39c22814e9__save_comment"
argument-hint: "[CHG-XXXX или 'all']"
---

# Linear Sync

Ты синхронизируешь change packages с Linear.

## Input
- `$ARGUMENTS` = `CHG-XXXX` → синхронизировать конкретный change
- `$ARGUMENTS` = `all` → сканировать все changes и синхронизировать

## Process

### Для одного CHG
1. Прочитай `docs/changes/$ARGUMENTS/metadata.yaml`
2. Прочитай `docs/changes/$ARGUMENTS/change-draft.md`
3. Найди существующий issue по title `CHG-XXXX` через list_issues
4. Если issue есть — обнови описание и статус
5. Если issue нет — создай:
   - Title: `CHG-XXXX · [title из metadata]`
   - Description: содержимое change-draft.md (первые 3 секции)
   - Status: маппинг из metadata status:
     - draft → Backlog
     - discovery/spec → In Progress
     - analysis → In Progress
     - in-progress → In Progress
     - done → Done
   - Labels: по доменам из metadata.domains

### Для all
1. `ls docs/changes/` — найди все CHG-*
2. Для каждого — выполни процесс выше
3. Покажи таблицу:
   ```
   | CHG | Title | Status | Linear |
   |-----|-------|--------|--------|
   ```

### Обнови metadata.yaml
Добавь ссылку на Linear issue в `pr_links` (если ещё нет).

## Маппинг статусов
```
docs status      → Linear status
draft            → Backlog
discovery        → Todo
spec             → In Progress
analysis         → In Progress
in-progress      → In Progress
done             → Done
```
