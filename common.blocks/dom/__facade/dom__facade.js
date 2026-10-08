/**
 * @module dom__facade
 * @description Internal DOM facade — node helpers + scripts-inert parseHtml
 */

/**
 * Parses an HTML string into an array of top-level nodes.
 * Scripts-inert by design (D-11): template parsing never executes script
 * elements, and nodes it produces stay inert after insertion.
 * @param {String} html
 * @returns {Node[]}
 */
function parseHtml(html) {
    const template = document.createElement('template')
    template.innerHTML = html
    return Array.from(template.content.childNodes)
}

/**
 * Checks whether ctxNode contains node (inclusive: a node contains itself)
 * @param {Node} ctxNode
 * @param {Node} node
 * @returns {Boolean}
 */
function contains(ctxNode, node) {
    return Boolean(ctxNode && node && ctxNode.contains(node))
}

export default {
    parseHtml,
    contains
}
