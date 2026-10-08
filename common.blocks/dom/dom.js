/**
 * @module dom
 * @description some DOM utils
 */

import domFacade from 'bem:dom__facade'

const { contains } = domFacade

const EDITABLE_INPUT_TYPES = new Set([
    'datetime-local',
    'date',
    'month',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'time',
    'url',
    'week'
])

export default {
    /**
     * Checks whether a DOM node contains another node (inclusive)
     * @param {Node} ctx DOM node where check is being performed
     * @param {Node} node DOM node to check
     * @returns {Boolean}
     */
    contains,

    /**
     * Returns currently focused DOM node
     * @returns {Node}
     */
    getFocused() {
        return document.activeElement
    },

    /**
     * Checks whether a DOM node contains focus
     * @param {Node} domNode
     * @returns {Boolean}
     */
    containsFocus(domNode) {
        return this.contains(domNode, this.getFocused())
    },

    /**
     * Checks whether a browser currently can set focus on a DOM node
     * @param {Node} domNode
     * @returns {Boolean}
     */
    isFocusable(domNode) {
        if(!domNode) return false
        if(domNode.hasAttribute('tabindex')) return true

        switch(domNode.tagName.toLowerCase()) {
            case 'iframe':
                return true

            case 'input':
            case 'button':
            case 'textarea':
            case 'select':
                return !domNode.disabled

            case 'a':
                return !!domNode.href
        }

        return false
    },

    /**
     * Checks whether a DOM node is intended to edit text
     * @param {Node} domNode
     * @returns {Boolean}
     */
    isEditable(domNode) {
        if(!domNode) return false

        switch(domNode.tagName.toLowerCase()) {
            case 'input':
                return EDITABLE_INPUT_TYPES.has(domNode.type) && !domNode.disabled && !domNode.readOnly

            case 'textarea':
                return !domNode.disabled && !domNode.readOnly

            default:
                return domNode.contentEditable === 'true'
        }
    }
}
