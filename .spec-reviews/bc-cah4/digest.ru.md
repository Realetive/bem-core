# Дайджест: S1 env/ua — модуль env, алиас ua, слияние платформенных форков (arch-overhaul, срез 1)

- Срез: заменяем два несводимых платформенных форка `ua` (desktop-сниффинг
  браузеров и touch-модуль на jquery-биндингах) одним публичным модулем
  возможностей `env` плюс однорелизным алиасом `ua` (живой Proxy). `ua__dom`
  переезжает в common с touch-дельтой, проверка — через touch-эмулированный
  Playwright-проект со своим портом. Это убирает последнее jquery-ребро в
  семействе ua и закрывает сниффинг-долг публичным контрактом.
- Решения human-гейта:
  - Спека одобрена 2026-10-05 без правок — Realetive закрыл бусину-гейт
    bc-2lff сам (закрытие бусины = акт одобрения); решение записано в
    human-clarifications.md (Decision 1, verdict: approved).
  - Все 34 цитаты-доказательства проверены человеком; три обзорных ноги
    прошли (factual: fail→resolved после переанкеровки цитат, testability:
    pass, constitution: pass).
  - Позиции без блокировки оставлены как есть: `bada`/`wp` едут через
    `env.platform`; контракт алиаса — только чтение свойств (без
    деструктуризации/spread).
- Приёмка: 10 ACC, все машинные (exit 0): lint; node-сьют (api-pin +
  parity-пин); браузерный сьют на двух разрешениях; build + бюджет бандла;
  базайзен платформ 16 файлов; jquery-allowlist 8 записей; свежесть
  platform entries (git diff чист); doc-parity; семейство ua без
  `bem:jquery`; двуязычная секция `### S1` в MIGRATION.
- Чего НЕ делаем в срезе: RTL/pasive-listeners/input-modality (нет
  потребителей); переработка `winresize` (S2, его `ua.msie` молча no-op);
  удаление алиаса и смерть legacy-ключей `env.browser` (первый
  пост-сериальный релиз); WebKit/Gecko touch-харнесс (только Chromium);
  бенчмарки (S2).
- Дальше: первая задача конвоя — bc-4izq (срез S1, уже в работе): создаёт
  `common.blocks/env` и алиас `common.blocks/ua`, переносит `ua__dom` в
  common с touch-дельтой, удаляет оба старых форка ua, добавляет
  Playwright-проект `chromium-touch`, обновляет barrel/api-pin/platform
  entries/бюджет и двуязычную документацию (MIGRATION/CHANGELOG).
