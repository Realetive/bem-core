/**
 * @module loader
 * @description Load an ES module from a URL via dynamic import().
 */

/**
 * Loads an ES module from `url`.
 *
 * The URL must point to an ES module served with a JavaScript MIME type;
 * classic scripts that only define globals no longer execute through this
 * loader. Cross-origin targets must send CORS headers (dynamic import()
 * always enforces CORS, unlike the old script-injection loader). Repeated
 * calls with the same URL reuse the browser's module map: in-flight requests
 * are deduplicated and loaded modules are served from cache.
 *
 * @param {String} url resource link
 * @param {Function} [success] called with the module namespace when the
 * module loads
 * @param {Function} [error] called with the load error when it fails
 * @returns {Promise<Object>} the dynamic import() promise, resolving to
 * the module namespace (rejects on failure)
 */
export default (url, success, error) => {
    const load = import(url)

    success && load.then(module => success(module))
    error && load.catch(err => error(err))

    return load
}
