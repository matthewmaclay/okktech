---
type: change
domain: training-session
status: done
tags:
  - change/CHG-0000
  - domain/training-session
  - backend-proposal
created: 2026-04-08
---

# Backend proposal · CHG-0000

## Impacted modules

| Module | Impact | Description |
|---|---|---|
| `training-session` | Major | Новый sub-module `retrospective/` внутри training-session |
| `llm-service` | Minor | Новый промпт-темплейт для анализа сессии |
| `job-queue` | Minor | Новый тип задачи `retrospective-generation` |
| `auth` | None | Используется существующая авторизация (session.learnerId check) |

### Новые файлы

```
src/modules/training-session/retrospective/
  ├── retrospective.controller.ts    # API endpoints
  ├── retrospective.service.ts       # Бизнес-логика генерации
  ├── retrospective.repository.ts    # Доступ к БД
  ├── retrospective.entity.ts        # RetrospectiveResult entity
  ├── retrospective.job.ts           # Async job handler
  ├── retrospective.prompt.ts        # LLM prompt builder
  ├── retrospective.dto.ts           # Request/Response DTOs
  └── retrospective.module.ts        # NestJS module definition
```

## API implementation

### GET `/api/v1/sessions/:sessionId/retrospective`

```
Authorization: Bearer <token>

Response 200:
{
  "sessionId": "uuid",
  "status": "ready",
  "turnAnalyses": [
    {
      "turnNumber": 1,
      "analysis": "Хороший открывающий вопрос, сразу задал контекст...",
      "quality": "strong"
    }
  ],
  "recommendations": [
    "Попробуйте задавать больше уточняющих вопросов...",
    "Обратите внимание на структуру аргументации..."
  ],
  "generatedAt": "2026-04-08T12:30:00Z",
  "generationDurationMs": 15230
}
```

**Валидация:**
- `sessionId` — UUID format
- Session существует в БД
- `session.learnerId === currentUser.id` (авторизация)
- Session.status === `completed` (иначе 409)

### POST `/api/v1/sessions/:sessionId/retrospective/generate`

```
Authorization: Bearer <token>

Response 202:
{
  "jobId": "uuid",
  "status": "generating",
  "estimatedDurationMs": 20000
}
```

**Валидация:**
- Все проверки GET + дополнительно:
- Session имеет ≥1 Turn (иначе 422)
- Ретроспектива ещё не существует и не в процессе генерации (idempotent: если уже есть — возвращаем 200 с результатом)

**Idempotency:** INSERT с ON CONFLICT (session_id) DO NOTHING. Если запись уже есть — SELECT и вернуть текущий статус.

## Model changes

### New entity: RetrospectiveResult

```typescript
@Entity('retrospective_results')
export class RetrospectiveResult {
  @PrimaryColumn('uuid')
  sessionId: string;

  @Column({ type: 'varchar', length: 20, default: 'generating' })
  generationStatus: 'not_requested' | 'generating' | 'ready' | 'failed';

  @Column({ type: 'jsonb', nullable: true })
  turnAnalyses: TurnAnalysis[] | null;

  @Column({ type: 'jsonb', nullable: true })
  recommendations: string[] | null;

  @Column({ type: 'timestamptz', nullable: true })
  generatedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  generationDurationMs: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

interface TurnAnalysis {
  turnNumber: number;
  analysis: string;      // макс. 1000 символов
  quality: 'strong' | 'adequate' | 'needs_improvement';
}
```

### Value object: RetrospectiveResult (domain layer)

```typescript
export class RetrospectiveResultVO {
  static create(params: {
    sessionId: string;
    turnAnalyses: TurnAnalysis[];
    recommendations: string[];
    generationDurationMs: number;
  }): RetrospectiveResultVO {
    if (params.recommendations.length > 3) {
      throw new DomainError('Max 3 recommendations allowed');
    }
    if (params.recommendations.some(r => r.length > 280)) {
      throw new DomainError('Recommendation max length is 280 chars');
    }
    return new RetrospectiveResultVO(params);
  }
}
```

## Events emitted

| Event | Trigger | Payload |
|---|---|---|
| `RetrospectiveGenerated` | Успешная генерация ретроспективы | `{ sessionId, learnerId, turnCount, recommendationCount, generationDurationMs }` |

**Emitter:** `RetrospectiveService.completeGeneration()` после сохранения результата в БД.

**Гарантия:** at-least-once через transactional outbox (сохранение результата + запись события в одной транзакции).

## Migration plan

### Migration 001: Create retrospective_results table

```sql
-- Up
CREATE TABLE retrospective_results (
    session_id            UUID PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
    generation_status     VARCHAR(20) NOT NULL DEFAULT 'generating'
                          CHECK (generation_status IN ('not_requested', 'generating', 'ready', 'failed')),
    turn_analyses         JSONB,
    recommendations       JSONB,
    generated_at          TIMESTAMPTZ,
    generation_duration_ms INT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_retrospective_results_generating
    ON retrospective_results(generation_status)
    WHERE generation_status = 'generating';

-- Down
DROP TABLE IF EXISTS retrospective_results;
```

**Характеристики миграции:**
- Zero-downtime: CREATE TABLE не блокирует существующие таблицы
- Backward compatible: новая таблица, существующий код не знает о ней
- Rollback: DROP TABLE — безопасен, если фича ещё не в production

## Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| LLM промпт даёт некачественный анализ | Medium | Пользователи теряют доверие к фиче | A/B тестирование промптов перед раскаткой. Manual review первых 50 ретроспектив |
| Высокая стоимость LLM-вызовов | Medium | Перерасход бюджета | Мониторинг `retrospective.llm.tokens_used`. Alert при >$X/день. Cache — генерация один раз |
| Deadlock при concurrent generation | Low | Зависшие записи | PK constraint вместо pessimistic lock. Stale job cleanup |
| Рост размера БД | Low | Медленные запросы | JSONB с GIN индексом при необходимости. Архивация через 1 год |

## Fallback strategy

1. **Feature flag `retrospective.enabled = false`** — полностью скрывает UI и отключает API endpoints (возвращает 404)
2. **Feature flag `retrospective.generation.enabled = false`** — разрешает просмотр существующих ретроспектив, но блокирует новые генерации
3. **Rollback миграции:** DROP TABLE retrospective_results (если фича не дошла до production)
4. **LLM fallback:** при длительной недоступности LLM — показать сырые ходы без анализа, с сообщением «AI-анализ временно недоступен»

## OpenAPI spec

Отдельный openapi.yaml не генерируется — эндпоинты описаны в общей API-спецификации проекта.
