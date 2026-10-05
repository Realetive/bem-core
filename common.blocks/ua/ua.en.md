# ua

Use this block to collect data about the user's browser.

> **Deprecated since 6.0.0**: the `ua` JS module is now a one-release alias of the new [`env`](../env/env.en.md) module and is removed in the next release — migrate to `env`.

## The ua module alias

`bem:ua` live-forwards property reads to the `env` module: `ua`, `platform`, `ios`, `android`, `bada`, `wp`, `other`, `browser`, `opera`, `chrome`, `screenSize`, `svg`, `width`, `height`, `landscape`. Notes:

- **Removed fields** — `msie`, `webkit`, `safari`, `mozilla`, `version`, `iphone`, `ipad`, `dpr`, `flash`, `connection`, `video` — warn once per field (via `console.warn`) and return `undefined`; any other non-forwarded field behaves the same.
- **Assignments** warn once and are ignored.
- **Property-read contract only**: destructuring and spread snapshots are unsupported by design — the values are live.

```js
// before
import ua from 'bem:ua';
if(ua.msie) { /* ... */ }
// after
import env from 'bem:env';
if(env.platform.ios) { /* ... */ }
```

## Overview

### Elements of the block

| Element | Usage | Description |
| ------- | --------------------- | -------- |
| <a href="#elems-svg">svg</a> | `deps` | Checks whether the browser supports SVG format. |

### Public block technologies

The block is implemented in:

* `bh.js`
* `bemhtml`

## Description

The block enables an inline script that adds `CSS` classes to the `<html>` tag to specify whether JavaScript is enabled – `ua_js_no` or `ua_js_yes`.

It doesn't have a visual representation on the page.

Used inside the [page](https://github.com/bem/bem-core/blob/v2/common.blocks/page/page.en.md) block. You normally don't need to connect it to the page yourself.

<a name="elems"></a>

### Elements of the block

<a name="elems-svg"></a>

#### `svg` element

This element enables an inline script that adds `CSS` classes to the `<html>` tag to specify whether SVG is supported – `ua_svg_no` or `ua_svg_yes`.

It doesn't have a visual representation on the page.

To use it, add the element to the `deps.js` dependencies file for the block that needs information about SVG support:

```js
({ shouldDeps : { block : 'ua', elem : 'svg' } })
```
