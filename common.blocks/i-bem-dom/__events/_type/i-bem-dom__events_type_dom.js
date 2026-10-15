/**
 * @module i-bem-dom__events_type_dom
 */
import bemDomEvents from 'bem:i-bem-dom__events'
import inherit from 'bem:inherit'

const eventBuilder = function(e) {
        return e
    },
    /* focus/blur do not bubble — delegated listens to the mapped focusin/focusout */
    FOCUS_TYPE_MAP = { focus : 'focusin', blur : 'focusout' },

    /* Node -> Map<type, { listener, bindings }> — one native listener per scope node per type */
    anchors = new WeakMap()

function anchorEntry(node, type) {
    let perNode = anchors.get(node)
    if(!perNode) anchors.set(node, perNode = new Map())

    let entry = perNode.get(type)
    if(!entry) {
        entry = { listener : null, bindings : [] }
        entry.listener = function(nativeEvent) {
            const extra = extraArgsOf(nativeEvent)
            const snapshot = entry.bindings.slice()
            const path = pathWithin(nativeEvent, node)

            for(const el of path) {
                for(const binding of snapshot) {
                    if(binding.selector?
                        el.classList.contains(binding.cls) :
                        el === node) {
                        nativeEvent.data = binding.data
                        binding.handler.call(el, nativeEvent, ...extra)
                        if(nativeEvent.cancelBubble) return
                    }
                }
                if(nativeEvent.cancelBubble) return
            }
        }
        perNode.set(type, entry)
        node.addEventListener(type, entry.listener)
    }
    return entry
}

function releaseAnchor(node, type) {
    const perNode = anchors.get(node)
    const entry = perNode && perNode.get(type)
    if(entry && !entry.bindings.length) {
        node.removeEventListener(type, entry.listener)
        perNode.delete(type)
    }
}

/* Event path from target to the anchor node (inclusive — the delegated
   self-match fires by design, unlike the old jQuery compensation) */
function pathWithin(nativeEvent, anchorNode) {
    const composed = typeof nativeEvent.composedPath === 'function' && nativeEvent.composedPath()
    if(composed && composed.length) {
        const idx = composed.indexOf(anchorNode)
        return idx < 0? [] : composed.slice(0, idx + 1)
    }

    const res = []
    let el = nativeEvent.target
    while(el) {
        res.push(el)
        if(el === anchorNode) return res
        el = el.parentElement
    }
    return []
}

/* CustomEvent detail carries trigger-time extra handler args positionally;
   native detail scalars (e.g. MouseEvent click counts) are ignored */
function extraArgsOf(nativeEvent) {
    const detail = nativeEvent.detail
    if(detail !== null && typeof detail === 'object') {
        return Array.isArray(detail)? detail : [detail]
    }
    return []
}

function closestMatching(node, selector) {
    if(!selector) return null
    const cls = selector.slice(1)
    while(node) {
        if(node.classList && node.classList.contains(cls)) return node
        node = node.parentElement
    }
    return null
}

/**
 * @class EventManager
 * @augments i-bem-dom__events:EventManager
 */
const NativeEventManager = inherit(bemDomEvents.EventManager, /** @lends EventManager.prototype */{
    /** @override */
    _bindToDom(event, handler, params, data) {
        const type = FOCUS_TYPE_MAP[event] || event
        const selector = params.bindSelector || ''
        for(const node of params.bindNodes) {
            const entry = anchorEntry(node, type)
            entry.bindings.push({
                selector,
                cls : selector? selector.slice(1) : '',
                data,
                handler
            })
        }
    },

    /** @override */
    _unbindFromDom(event, handler) {
        const type = FOCUS_TYPE_MAP[event] || event
        for(const node of this._params.bindNodes) {
            const perNode = anchors.get(node)
            const entry = perNode && perNode.get(type)
            if(!entry) continue

            const idx = entry.bindings.findIndex(binding => binding.handler === handler)
            if(idx >= 0) entry.bindings.splice(idx, 1)

            releaseAnchor(node, type)
        }
    }
})

/**
 * @class EventManagerFactory
 * @augments i-bem-dom__events:EventManagerFactory
 * @exports i-bem-dom__events_type_dom:EventManagerFactory
 */
const EventManagerFactory = inherit(bemDomEvents.EventManagerFactory, /** @lends EventManagerFactory.prototype */{
    /**
     * @constructor
     * @param {Function} getEntityCls entity-name -> class resolver
     * @param {Function} lazyGetEntity (domNode, EntityCls) -> instance (lazily initializes)
     */
    __constructor(getEntityCls, lazyGetEntity) {
        this.__base(getEntityCls)
        this._lazyGetEntity = lazyGetEntity
        this._eventManagerCls = NativeEventManager
    },

    /** @override */
    _createEventManager : function(ctx, params, isInstance) {
        const lazyGetEntity = this._lazyGetEntity

        function wrapperFn(fn) {
            return function(e) {
                let instance

                if(isInstance) {
                    instance = ctx
                } else {
                    const entityDomNode = closestMatching(e.target, params.ctxSelector)
                    instance = entityDomNode && lazyGetEntity(entityDomNode, ctx)
                }

                if(instance) {
                    params.bindEntityCls && (e.bemTarget = lazyGetEntity(this, params.bindEntityCls))
                    fn.apply(instance, arguments)
                }
            }
        }

        return new this._eventManagerCls(params, wrapperFn, eventBuilder)
    }
})

export default {
    EventManagerFactory
}
