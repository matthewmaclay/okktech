# Pipeline: Full Feature

Оркестрация полного цикла проработки фичи: PM → Analyst → Designer → Backend → Frontend → QA → Verify → **Merge**.

## Architecture
Каждая роль = отдельный Agent с fresh context. Orchestrator (эта сессия) остаётся lean — читает только metadata.yaml между стадиями.

## Change types
- **DMNCHG-XXXX** — single-domain change → хранится в `docs/domains/{domain}/changes/`
- **CHG-XXXX** — cross-domain change → хранится в `docs/changes/`
PM определяет тип на этапе intake: если затронут 1 домен → DMNCHG, >1 → CHG.

## Execution

### Stage 1: PM Intake
1. Прочитай `~/.claude/studio/agents/studio-pm.md` (или из studio package)
2. Запусти Agent:
   - Промпт: содержимое studio-pm.md + "Feature: $ARGUMENTS"
   - Tools: Read, Write, Glob, Grep, Bash
3. Дождись результата: {chg_id, title, open_questions}
4. Покажи пользователю: "CHG-XXXX создан. Open questions: N."
5. Спроси: "Продолжить к аналитику?"
6. Обнови .planning/STATE.md: current_chg, current_phase: draft

### Stage 2: Analyst
1. Прочитай studio-analyst.md
2. Запусти Agent: промпт + "CHG: $CHG_ID"
3. Результат: {domains_affected, invariants_violated, new_events, open_questions}
4. Если invariants_violated > 0 → ESCALATION GATE: показать, ждать решения
5. Покажи сводку. Спроси: "Продолжить к дизайнеру?"
6. STATE.md: current_phase: analysis

### Stage 3: Designer
1. Прочитай studio-designer.md
2. Запусти Agent: промпт + "CHG: $CHG_ID"
3. Результат: {mockups_created, surfaces}
4. Покажи: "Создано N мокапов для M поверхностей."
5. Спроси: "Продолжить к backend?"
6. STATE.md: current_phase: design

### Stage 4: Backend
1. Прочитай studio-backend.md
2. Запусти Agent: промпт + "CHG: $CHG_ID"
3. Результат: {endpoints_count, has_openapi, migration_required}
4. Покажи сводку. Спроси: "Продолжить к frontend?"
5. STATE.md: current_phase: in-progress

### Stage 5: Frontend
1. Прочитай studio-frontend.md
2. Запусти Agent: промпт + "CHG: $CHG_ID"
3. Результат: {surfaces_count, states_count, analytics_events}
4. Покажи. Спроси: "Продолжить к QA?"

### Stage 6: QA
1. Прочитай studio-qa.md
2. Запусти Agent: промпт + "CHG: $CHG_ID"
3. Результат: {test_cases_count, rollback_defined}
4. Покажи.

### Stage 7: Verify
1. Прочитай studio-verifier.md
2. Запусти Agent: промпт + "CHG: $CHG_ID"
3. Результат: {verified_count, gaps_count, verdict}
4. Покажи VERIFICATION.md summary
5. Если verdict ≠ PASS → СТОП, показать gaps

### Stage 8: Domain Merge
После verification PASS — переливаем ВСЕ знания в domain docs:
1. Прочитай studio-domain-merger.md
2. Запусти Agent: промпт + "CHG: $CHG_ID"
3. Agent извлекает из change docs: business rules, events, aggregates, API, DB schema, SLA, UL terms
4. Обновляет ВСЕ файлы затронутых доменов (12 файлов: 8 основных + api-contracts, data-model, operational-sla, changelog)
5. Результат: {domains_updated, files_updated, integrity_issues}
6. Если integrity_issues > 0 → показать, ждать
7. metadata.yaml → status: done

### Финал
```
DMNCHG-XXXX / CHG-XXXX · [title]
Documents: 15 files created
Mockups: N HTML files
OpenAPI: yes/no
Test cases: N
Verification: PASS/GAPS/FAIL
Domain merge: N domains updated, M files enriched
Open questions: N
```

## Autonomous mode
Если $ARGUMENTS содержит `--auto`:
- Не спрашивай между стадиями
- PM отвечает на вопросы сам (best practices)
- Escalation gates записываются в decisions-log вместо остановки
- Обновляй STATE.md после каждой стадии

## Iteration rules
Если agent возвращает {questions > 0} или finds issues in previous stage:
1. Показать пользователю (или записать в autonomous mode)
2. Если критично → вернуться к предыдущей стадии
3. Если нет → записать в 10-open-questions.md, продолжить
