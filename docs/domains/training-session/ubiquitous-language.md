---
type: ubiquitous-language
domain: training-session
tags:
  - domain/training-session
  - language
---

# Ubiquitous language · Training Session

| Term | Definition | Forbidden synonyms | Conflicts with |
|---|---|---|---|
| Session | Единичная тренировка пользователя по конкретному сценарию. Имеет жизненный цикл и фиксированный результат. | Урок, занятие, диалог | — |
| Turn | Одна пара сообщений: ход пользователя + ответ AI. Атомарная единица взаимодействия внутри сессии. | Раунд, шаг, итерация | — |
| Facilitator | AI-роль, ведущая диалог с пользователем в рамках сессии. Поведение определяется сценарием. | Бот, тренер, ассистент, наставник | — |
| Session Outcome | Зафиксированный результат завершённой сессии: completed, abandoned, timed_out. | Оценка, результат, скор | Assessment domain: Score |
| Scenario (ref) | Ссылка на шаблон из домена Scenario Catalog. Внутри Session хранится только scenarioId. | Кейс, задание, упражнение | Scenario Catalog: Scenario (Aggregate root) |
| Learner (ref) | Ссылка на пользователя-ученика. Внутри Session хранится только learnerId. | Студент, юзер, участник | Learner Progress: Learner (Aggregate root) |
