# env

Environment capability module: user-agent-derived platform/browser detection, capability probes and live viewport state.

## Overview

The module is imported as `env` (e.g. `import env from 'bem:env'`). It is a getter-only object — nothing is read from the DOM at module evaluation, so importing in an SSR/no-window environment is safe and yields falsy/empty values.

### Getters

| Getter | Kind | Description |
| ------ | ---- | ----------- |
| `ua` | diagnostic | Raw `navigator.userAgent` string (`''` with no window). |
| `platform` | UA-derived | Mobile platform versions keyed by `ios` / `android` / `bada` / `wp`, or `{ other: true }` when no mobile platform matches. |
| `ios` | UA-derived | iOS version string, `undefined` when not iOS. |
| `android` | UA-derived | Android version string, `undefined` when not Android. |
| `browser` | UA-derived | Browser version strings keyed by `opera` / `chrome` (legacy keys, kept for the `ua` alias transition). |
| `screenSize` | capability probe | `'large'` / `'normal'` / `'small'` by `screen.width` (`''` with no window). |
| `svg` | capability probe | SVG support (createElementNS probe). |
| `width` | live probe | Viewport width (`0` with no window). |
| `height` | live probe | Viewport height (`0` with no window). |
| `landscape` | live probe | `width > height`. |

UA-derived getters are computed lazily and memoized per distinct observed `navigator.userAgent` string — detection runs once per real user agent in production, while tests may exercise fixture user agents. Live probes always read the current viewport.

## orientchange

The module registers one native `resize` listener on `window` and dispatches a native `CustomEvent('orientchange', { detail: { landscape, width, height } })` on `window`. The event fires only when the orientation AND the width both changed since the last dispatch (the guard against the Android software-keyboard page shrink):

```js
window.addEventListener('orientchange', e => {
    e.detail.landscape; // Boolean
    e.detail.width;     // Number
    e.detail.height;    // Number
});
```

## Deprecated ua alias

The former `ua` module is now a one-release alias of `env` (see the [ua](ua.en.md) block docs). Migrate property reads to the `env` getters.
