/**
 * Root API barrel (platform-neutral, never auto-inits) — design doc,
 * "Interface → Root barrel" / D-7.
 *
 * Plain names = DOM flavor (the dominant authoring surface); vanilla-only
 * `i-bem` authoring stays a documented deep-import. v1 re-exports existing
 * modules only (env/ua join in S1; loader switched to the `bem:loader` root
 * module in S3).
 *
 * Built to `dist/index.mjs` by `build/vite.barrel.config.js`; the package root
 * export `.` points at that artifact.
 */

export { default as bemDom } from 'bem:i-bem-dom';
export { default as BemDomCollection } from 'bem:i-bem-dom__collection';
export { default as dom } from 'bem:dom';
import events from 'bem:events';
export const { Emitter, Event } = events;
export { default as channels } from 'bem:events__channels';
export { default as loader } from 'bem:loader';
export { default as env } from 'bem:env';
export { default as ua } from 'bem:ua';
