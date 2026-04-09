---
name: studio-new-domain
description: "Создаёт новый bounded context с 8 файлами из шаблона."
allowed-tools: "Read Write Edit Glob Grep Bash(ls *) Bash(find *) Bash(cat *) Bash(wc *) Bash(mkdir *) Bash(cp *) Bash(date *) Bash(grep *) Bash(sort *) Agent"
argument-hint: "[domain-name]"
---

# Studio New Domain

Создаёт новый bounded context с полным набором файлов из шаблона.

## Input
Имя домена: $ARGUMENTS

## Validation
- Имя должно быть в kebab-case (lowercase, дефисы)
- Проверь что `docs/domains/$ARGUMENTS/` ещё не существует
- Если существует — выведи ошибку

## Process

### Step 1: Загрузи агент
Прочитай определение:
1. `~/.claude/studio/agents/studio-new-domain.md`
2. `studio/agents/studio-new-domain.md`
3. `.claude/skills/new-domain/SKILL.md` (fallback)

### Step 2: Scaffold
Скопируй шаблон:
```
cp -r docs/domains/_template/ docs/domains/$ARGUMENTS/
```

Шаблон содержит 8 файлов:
- `README.md` — overview домена
- `ubiquitous-language.md` — термины и определения
- `aggregates.md` — агрегаты и их правила
- `events.md` — доменные события
- `invariants.md` — бизнес-инварианты
- `rules.md` — бизнес-правила
- `ownership.md` — владение и ответственности
- `queries.md` — основные запросы и read models

### Step 3: Заполни базовую информацию
Запусти Agent который:
1. Спросит у пользователя описание домена
2. Заполнит README.md (overview, назначение, границы)
3. Заполнит ownership.md (команда, stakeholders)
4. Обновит frontmatter во всех файлах (domain name, created date)
5. Обновит `docs/_meta/domain-map.md` — добавит новый домен

### Step 4: Результат
Выведи:
- Путь к созданному домену
- Список файлов
- Что заполнено, что требует доработки
- Рекомендацию: "Используй `/studio-analyst` для глубокой проработки"
