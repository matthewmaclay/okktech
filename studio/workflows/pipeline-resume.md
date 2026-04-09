# Pipeline: Resume

Возобновление работы с места остановки.

## Process
1. Прочитай `.planning/STATE.md` → определи current_chg, current_phase
2. Если нет STATE.md → "Нет активной работы. Запусти /studio-pm для начала."
3. Прочитай `docs/changes/$CHG/metadata.yaml` → определи status
4. Определи следующую стадию по stage-pipeline:
   draft → /studio-analyst
   discovery → /studio-analyst (continue)
   spec → /studio-analyst (domain impact)
   analysis → /studio-designer
   design → /studio-backend
   in-progress → определи что не заполнено (06? 07? 08?)
   done → "CHG завершён."

5. Покажи:
   "Текущая позиция: CHG-XXXX, стадия: [X]
    Следующий шаг: /studio-[role] CHG-XXXX"
6. Спроси: "Запустить?"
