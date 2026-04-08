---
type: change
domain: training-session
status: done
tags:
  - change/CHG-0000
  - domain/training-session
  - release-notes
created: 2026-04-08
---

# Release notes · CHG-0000

## Summary

Добавлена система ретроспективы для завершённых тренировочных сессий. После тренировки ученик может просмотреть AI-анализ каждого хода и получить персональные рекомендации для улучшения навыков.

## What changed

- Новый API endpoint: GET `/api/v1/sessions/:id/retrospective` — получение ретроспективы
- Новый API endpoint: POST `/api/v1/sessions/:id/retrospective/generate` — запуск генерации
- Новая таблица `retrospective_results` в БД для хранения результатов анализа
- Новый async job `retrospective-generation` для обработки LLM-запросов
- Новое доменное событие `RetrospectiveGenerated` в домене training-session
- Новый UI-компонент `RetrospectivePanel` на странице результатов сессии
- Кнопка «Ретроспектива» на странице результатов завершённой сессии

## Breaking changes

Нет. Все изменения backward compatible:
- Новые API endpoints, существующие не изменены
- Новая таблица в БД, существующие не затронуты
- Новое событие, существующие consumers не затронуты

## Migration required

- DB migration: CREATE TABLE `retrospective_results` (forward-only, zero-downtime)
- Rollback: DROP TABLE `retrospective_results`

## Feature flags introduced

| Flag | Default | Description |
|---|---|---|
| `retrospective.enabled` | `false` | Глобальный kill switch для всего UI и API ретроспективы |
| `retrospective.generation.enabled` | `true` | Управляет возможностью генерации новых ретроспектив |
| `retrospective.show_quality_badge` | `true` | Показывает/скрывает badges качества (strong/adequate/needs_improvement) на ходах |

## Domain docs updated

- [[docs/domains/training-session/events|events.md]] — добавлено событие RetrospectiveGenerated
- [[docs/domains/training-session/ubiquitous-language|ubiquitous-language.md]] — добавлены термины Retrospective, Turn Analysis
- [[docs/domains/training-session/aggregates|aggregates.md]] — добавлен value object RetrospectiveResult в Session aggregate
- [[docs/domains/training-session/business-rules|business-rules.md]] — добавлены правила: Retrospective Availability, Retrospective Immutability, Retrospective Cache
