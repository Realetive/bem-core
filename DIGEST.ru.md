# DIGEST — сводка по срезам

## 2026-10-05 — bc-cah4: S1 env/ua — модуль env, алиас ua, слияние платформенных форков

- Два платформенных форка `ua` (desktop-сниффинг + touch на jquery)
  заменяются одним публичным модулем `env` и однорелизным алиасом `ua`
  (живой Proxy); `ua__dom` — в common с touch-дельтой. Последнее
  jquery-ребро семейства ua уходит.
- Ориентация: нативный `orientchange` (CustomEvent на window) с
  сохранённым Android shrink-guard; MIGRATION документирует смену
  транспорта с jquery-триггера.
- Спека: 11 REQ / 10 ACC; одобрена 2026-10-05 (Realetive закрыл гейт
  бусину bc-2lff, без правок); 34 цитаты проверены, три обзорные ноги
  прошли.
- Приёмка полностью машинная: lint, node-сьют, браузерный сьют на двух
  разрешениях (новый Playwright-проект `chromium-touch`, порт 5175),
  build + бюджет, базайзен 16 файлов, allowlist 8 записей, doc-parity.
- Non-goals: winresize (S2), удаление алиаса (пост-серия), RTL,
  бенчмарки (S2).
- Реализация среза — bc-4izq (в работе): env + алиас + перенос
  ua__dom, удаление старых форков, barrel/api-pin/platform entries,
  двуязычные MIGRATION/CHANGELOG.
