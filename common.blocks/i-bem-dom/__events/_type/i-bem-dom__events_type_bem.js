/**
 * @module i-bem-dom__events_type_bem
 */
import bemDomEvents from 'bem:i-bem-dom__events';
import bemInternal from 'bem:i-bem__internal';
import inherit from 'bem:inherit';
import events from 'bem:events';

const EVENT_PREFIX = '__bem__',
    MOD_CHANGE_EVENT = 'modchange',

    /* eventName -> Array<binding> (insertion order) */
    registry = new Map(),

    /* injected by i-bem-dom: (entity) -> [entity, ...parent blocks] */
    containmentWalker = { fn : null },

    /* injected by i-bem-dom: (node, EntityCls) -> closest entity instance (lazy-inits) */
    instanceResolver = { fn : null };

function eventBuilder(e, params) {
    return EVENT_PREFIX + params.bindEntityCls.getEntityName() +
        (typeof e === 'object'?
            e instanceof events.Event?
                e.type :
                /* treat modVal: false as modVal: '' (modifier removal) — #1457 */
                bemInternal.buildModPostfix(e.modName, e.modVal === false? '' : e.modVal) :
            e);
}

/**
 * @class EventManager
 * @augments i-bem-dom__events:EventManager
 * Pure-registry seams (no jQuery transport)
 */
const RegistryEventManager = inherit(bemDomEvents.EventManager, {
    _bindToDom : function(event, handler, params, data, fnId) {
        let bindings = registry.get(event);
        if(!bindings) registry.set(event, bindings = []);

        bindings.push({
            owner : params.ownerEntity,
            params,
            fnId,
            handler,
            data
        });
    },

    _unbindFromDom : function(event, handler) {
        const bindings = registry.get(event);
        if(!bindings) return;

        const idx = bindings.findIndex(binding => binding.handler === handler);
        if(idx >= 0) bindings.splice(idx, 1);
        if(!bindings.length) registry.delete(event);
    }
});

/**
 * @class EventManagerFactory
 * @augments i-bem-dom__events:EventManagerFactory
 * @exports i-bem-dom__events_type_bem:EventManagerFactory
 */
const EventManagerFactory = inherit(bemDomEvents.EventManagerFactory, /** @lends EventManagerFactory.prototype */{
    __constructor : function(getEntityCls) {
        this.__base(getEntityCls);
        this._eventManagerCls = RegistryEventManager;
    },

    /** @override */
    _createEventManager : function(ctx, params, isInstance) {
        params.ownerEntity = ctx;
        params.ownerIsInstance = isInstance;

        function wrapperFn(fn, fnCtx) {
            return function(e, data) {
                fn.call(fnCtx || this, e, data);
            };
        }

        return new this._eventManagerCls(params, wrapperFn, eventBuilder);
    }
});

function entityDomNode(entity) {
    return entity.domElem[0];
}

function containsNode(ctxNode, node) {
    return Boolean(ctxNode && node && ctxNode.contains(node));
}

function targetMatches(binding, entity) {
    const params = binding.params;
    if(params.bindTargetInstance) return entity === params.bindTargetInstance;
    if(entity.__self !== params.bindEntityCls) return false;
    if(!params.bindSelector) return true;
    const cls = params.bindSelector.slice(1);
    return entityDomNode(entity).classList.contains(cls);
}

/**
 * Emits a BEM event, walking the containment chain and firing matching
 * registered bindings (pure registry — no DOM event objects, no $.event.special)
 * @param {BemDomEntity} ctx Emitting entity
 * @param {String|Object|events:Event} e Event name / mod description / Event
 * @param {Object} [data]
 */
function emit(ctx, e, data) {
    let originalEvent;
    if(typeof e === 'string') {
        originalEvent = new events.Event(e, ctx);
    } else if(e.modName) {
        originalEvent = new events.Event(MOD_CHANGE_EVENT, ctx);
    } else if(!e.target) {
        e.target = ctx;
        originalEvent = e;
    }

    const eventName = eventBuilder(e, { bindEntityCls : ctx.__self });
    const bindings = registry.get(eventName);
    if(!bindings || !bindings.length) return;

    const flags = { fns : new Set(), stoppedNode : null };
    const chain = containmentWalker.fn? containmentWalker.fn(ctx) : [ctx];
    const snapshot = bindings.slice();

    for(const entity of chain) {
        for(const binding of snapshot) {
            if(!targetMatches(binding, entity)) continue;
            if(flags.fns.has(binding.fnId)) continue;
            if(flags.stoppedNode && containsNode(entityDomNode(entity), flags.stoppedNode)) continue;

            originalEvent.data = binding.data;
            originalEvent.bemTarget = entity;
            flags.fns.add(binding.fnId);
            binding.handler.call(
                binding.params.ownerIsInstance?
                    binding.owner :
                    instanceResolver.fn(ctx.domElem[0], binding.owner),
                originalEvent,
                data);

            if(originalEvent.isPropagationStopped()) flags.stoppedNode = entityDomNode(entity);
        }
    }
}

export default {
    emit : emit,
    EventManagerFactory : EventManagerFactory,

    /**
     * Injects the containment-walk resolver (set by i-bem-dom to avoid a
     * circular import)
     * @param {Function} fn (entity) -> [entity, ...parent blocks]
     */
    setContainmentWalker : function(fn) {
        containmentWalker.fn = fn;
    },

    /**
     * Injects the class-level owner-instance resolver
     * @param {Function} fn (node, EntityCls) -> entity
     */
    setInstanceResolver : function(fn) {
        instanceResolver.fn = fn;
    }
};
