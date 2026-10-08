/**
 * Bench harness B1–B5 (design doc "Bench project").
 * Runs on both v5-base (jquery era) and current code: only stable public
 * i-bem-dom APIs + native DOM. Results land in window.__benchResults.
 */

import bemDom from 'bem:i-bem-dom'
import $ from 'bem:jquery'

const ROUNDS = 9,
    TREE_SIZE = 1000,
    B2_SIZE = 500,
    B3_EMITS = 2000,
    B4_LOOKUPS = 2000,
    B5_SIZE = 500

let clickDelivered = 0,
    lastEmitBlock = null,
    lastParent = null

bemDom.declBlock('bench-b', {})

bemDom.declBlock('bench-click', {
    onSetMod : {
        js : {
            inited() {
                this._domEvents().on('click', () => clickDelivered++)
            }
        }
    }
})

bemDom.declBlock('bench-emit', {
    onSetMod : {
        js : {
            inited() {
                lastEmitBlock = this
                this._hits = 0
                this._events().on('ping', () => this._hits++)
            }
        }
    }
})

bemDom.declBlock('bench-parent', {
    onSetMod : {
        js : {
            inited() {
                lastParent = this
            }
        }
    }
})

const ChildBlock = bemDom.declBlock('bench-child', {})

function buildTree(blockName, count, withChildren) {
    const parts = []
    for(let i = 0; i < count; i++) {
        parts.push(
            '<div class="' + blockName + ' i-bem" data-bem=\'{"' + blockName + '":{}}\'' +
            (withChildren? '><div class="bench-child i-bem" data-bem=\'{"bench-child":{}}\'></div>' : '') +
            '></div>')
    }
    const root = document.createElement('div')
    root.innerHTML = parts.join('')
    document.body.appendChild(root)
    return root
}

function median(values) {
    const sorted = [...values].sort((a, b) => a - b)
    return sorted[Math.floor(sorted.length / 2)]
}

function timeRound(fn) {
    const start = performance.now()
    fn()
    return performance.now() - start
}

function scenario(rounds, measure, aggregate) {
    const samples = []
    for(let round = -1; round < rounds; round++) {
        const sample = measure()
        if(round >= 0) samples.push(sample)
    }
    return (aggregate || (values => Math.min(...values)))(samples)
}

function b1Init() {
    return scenario(ROUNDS, () => {
        const root = buildTree('bench-b', TREE_SIZE)
        const ms = timeRound(() => bemDom.init($(root)))
        root.remove()
        return ms
    })
}

function b2Dispatch() {
    return scenario(ROUNDS, () => {
        clickDelivered = 0
        const root = buildTree('bench-click', B2_SIZE)
        bemDom.init($(root))
        const nodes = root.querySelectorAll('.bench-click')
        const ms = timeRound(() => {
            nodes.forEach(node => node.dispatchEvent(
                new MouseEvent('click', { bubbles : true })))
        })
        if(clickDelivered !== B2_SIZE) throw new Error('B2: delivered ' + clickDelivered + '/' + B2_SIZE)
        root.remove()
        return ms
    })
}

function b3Emit() {
    return scenario(ROUNDS, () => {
        const root = buildTree('bench-emit', 1)
        bemDom.init($(root))
        const block = lastEmitBlock
        block._hits = 0
        const ms = timeRound(() => {
            for(let i = 0; i < B3_EMITS; i++) block._emit('ping')
        })
        if(block._hits !== B3_EMITS) throw new Error('B3: hits ' + block._hits + '/' + B3_EMITS)
        root.remove()
        return ms
    })
}

function b4LiveCollection() {
    return scenario(ROUNDS, () => {
        const root = buildTree('bench-parent', 1, true)
        bemDom.init($(root))
        const parent = lastParent
        const ms = timeRound(() => {
            for(let i = 0; i < B4_LOOKUPS; i++) parent.findChildBlocks(ChildBlock)
        })
        if(parent.findChildBlocks(ChildBlock).size() < 1) throw new Error('B4: empty collection')
        root.remove()
        return ms
    })
}

function b5DestructNoLeak() {
    return scenario(5, () => {
        gc()
        const before = performance.memory.usedJSHeapSize

        const root = buildTree('bench-b', B5_SIZE)
        bemDom.init($(root))
        bemDom.destruct($(root))
        root.remove()

        gc()
        return performance.memory.usedJSHeapSize - before
    }, median)
}

window.__benchResults = {
    b1InitMs : b1Init(),
    b2DispatchMs : b2Dispatch(),
    b3EmitMs : b3Emit(),
    b4CollectionMs : b4LiveCollection(),
    b5HeapDeltaBytes : b5DestructNoLeak(),
}
