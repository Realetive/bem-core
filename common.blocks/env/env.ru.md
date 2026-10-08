# env

Capability-based environment detection module. Replaces the platform `ua` forks (desktop/touch).

## API

All properties are **read-only getters**. UA-derived getters are lazy-memoized per distinct `navigator.userAgent` string.

### UA-derived (memoized)
| Getter | Type | Description |
|---|---|---|
| `ua` | `string` | Raw `navigator.userAgent` (diagnostic) |
| `platform` | `object` | `{ ios, android, bada, wp, other }` version strings |
| `ios` | `string` | iOS version (e.g. `'17.1'`) or `''` |
| `android` | `string` | Android version or `''` |
| `browser` | `object` | `{ opera }` or `{ chrome }` version strings |
| `screenSize` | `string` | `'large'`, `'normal'`, or `'small'` |
| `svg` | `boolean` | SVG support probe |

### Live probes (not memoized)
| Getter | Type | Description |
|---|---|---|
| `width` | `number` | `window.innerWidth` |
| `height` | `number` | `window.innerHeight` |
| `landscape` | `boolean` | `width > height` |

### Events
| Event | Detail | Fires when |
|---|---|---|
| `orientchange` | `{ landscape, width, height }` | Both landscape AND width changed (Android shrink-guard preserved) |

## Usage

```js
import env from 'bem:env';

env.platform.android  // '14.0'
env.screenSize        // 'large'
env.landscape         // false
```

```js
window.addEventListener('orientchange', (e) => {
    e.detail.landscape; // true
});
```

## SSR

In `typeof window === 'undefined'` environments, `ua` is `''`, `platform` is `{ other: true }`, probes are falsy, live probes are `0`. No throws.

## Migration from `ua`

See MIGRATION.md → `### S1`.
