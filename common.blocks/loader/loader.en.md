# loader

The `loader` block loads an ES module from a URL via dynamic `import()`.

## Overview

| Function | Returned value | Description |
| ----------- | --- | -------- |
| <a href="#methods-loader">loader</a>(`url {String}`, `[success {Function}]`, `[error {Function}]`) | `Promise` | Loads an ES module from the URL. |

### Public block technologies

The block is implemented in:

* `js`

## Description

<a name="methods"></a>

### Loading an ES module

<a name="methods-loader"></a>

The `loader(url, success, error)` function is a thin shim over dynamic
`import()`:

* `url {String}` — URL of the ES module to load. Required argument.
* [`success {Function}`] — called with the module namespace when the module
  has loaded.
* [`error {Function}`] — called with the load error when loading fails.

The function returns the `import()` promise which resolves to the module
namespace:

```js
import loader from 'bem:loader';

// promise form
loader('./chunks/extra.mjs')
    .then(module => { /* module.default, module.namedExport, … */ });

// callback form
loader('./chunks/extra.mjs',
    module => { /* loaded */ },
    error => { /* failed */ });
```

### Semantics

* **ES modules only.** The URL must be a valid ES module served with a
  JavaScript MIME type. Classic scripts that only define globals no longer
  load through this block.
* **CORS is enforced.** Dynamic `import()` applies the CORS rules to
  cross-origin targets: the target server must send the appropriate
  `Access-Control-Allow-Origin` headers. The previous script-injection
  implementation did not require this.
* **Native module-map caching.** Repeated calls with the same URL reuse the
  browser's module map: in-flight requests are deduplicated and loaded
  modules are served from cache.
* **No timeout.** Loading follows the browser's network behavior; no
  load timeout is imposed.
