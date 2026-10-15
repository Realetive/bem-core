/**
 * @module i-bem-dom__dom
 * @description Minimal array-like DOM node collection (jQuery-free domElem)
 */

class DomCollection extends Array {
    constructor(nodes) {
        super()
        if(nodes) for(const node of nodes) this.push(node)
    }

    get(i) {
        return this[i]
    }

    each(fn) {
        this.forEach((node, i) => fn.call(node, i, node))
        return this
    }

    add(other) {
        const res = new DomCollection(this)
        for(const node of other) if(!res.includes(node)) res.push(node)
        return res
    }

    not(selector) {
        const out = new DomCollection(
            Array.prototype.filter.call(this,
                node =>
                    typeof selector === 'string'?
                        !(node.nodeType === 1 && node.matches(selector)) :
                        node !== selector))
        out._prevSet = this
        return out
    }

    toArray() {
        return [...this]
    }

    index(node) {
        return this.indexOf(node)
    }

    eq(i) {
        const res = new DomCollection(this[i] !== undefined? [this[i]] : [])
        res._prevSet = this
        return res
    }

    is(selector) {
        if(typeof selector !== 'string') {
            const others = selector && typeof selector.length === 'number'?
                selector :
                [selector]
            return this.some(node => [...others].includes(node))
        }
        return this.some(node => node.nodeType === 1 && node.matches(selector))
    }

    filter(selector) {
        const matcher = typeof selector === 'string'?
            node => node.nodeType === 1 && node.matches(selector) :
            node => node === selector || (Array.isArray(selector) && selector.includes(node))
        const res = new DomCollection(Array.prototype.filter.call(this, matcher))
        res._prevSet = this
        return res
    }

    find(selector) {
        const hasPseudo = selector.includes(':')
        const query = hasPseudo? stripPseudo(selector) : selector
        const out = new DomCollection()
        this.forEach(node => {
            if(node.querySelectorAll) out.push(...node.querySelectorAll(query))
        })
        if(hasPseudo) {
            const filtered = applyPseudo(out, selector)
            out.length = 0
            out.push(...filtered)
        }
        out._prevSet = this
        return out
    }

    closest(selector) {
        let cur = this[0]
        while(cur && cur.nodeType === 1) {
            if(cur.matches(selector)) return new DomCollection([cur])
            cur = cur.parentElement
        }
        return new DomCollection()
    }

    children(selector) {
        const res = []
        this.forEach(node => {
            if(node.children) res.push(...node.children)
        })
        const filtered = selector?
            res.filter(node => node.nodeType === 1 && node.matches(selector)) :
            res
        const out = new DomCollection(filtered)
        out._prevSet = this
        return out
    }

    parent(selector) {
        const res = []
        this.forEach(node => { node.parentElement && res.push(node.parentElement) })
        const filtered = selector?
            res.filter(node => node.nodeType === 1 && node.matches(selector)) :
            res
        const out = new DomCollection(filtered)
        out._prevSet = this
        return out
    }

    parents(selector) {
        const res = []
        this.forEach(node => {
            let cur = node.parentElement
            while(cur) {
                if(!res.includes(cur)) res.push(cur)
                cur = cur.parentElement
            }
        })
        const filtered = selector?
            res.filter(node => node.nodeType === 1 && node.matches(selector)) :
            res
        const out = new DomCollection(filtered)
        out._prevSet = this
        return out
    }

    addBack() {
        return (this._prevSet || new DomCollection()).add(this)
    }

    prev() {
        const res = []
        this.forEach(node => { node.previousElementSibling && res.push(node.previousElementSibling) })
        return new DomCollection(res)
    }

    next() {
        const res = []
        this.forEach(node => { node.nextElementSibling && res.push(node.nextElementSibling) })
        return new DomCollection(res)
    }

    addClass(cls) {
        this.forEach(node => { node.classList && node.classList.add(cls) })
        return this
    }

    remove() {
        this.forEach(node => { node.parentNode && node.parentNode.removeChild(node) })
        return this
    }

    empty() {
        this.forEach(node => { node.innerHTML = '' })
        return this
    }

    focus() {
        this.forEach(node => { node.focus && node.focus() })
        return this
    }

    html(content) {
        if(content === undefined) return this[0] && this[0].innerHTML
        this.forEach(node => { node.innerHTML = content })
        return this
    }

    append(content) {
        this.forEach(node => {
            for(const child of content) node.appendChild(child)
        })
        return this
    }

    prepend(content) {
        this.forEach(node => {
            for(const child of content) node.insertBefore(child, node.firstChild)
        })
        return this
    }

    appendTo(target) {
        resolveTarget(target).append(this)
        return this
    }

    prependTo(target) {
        resolveTarget(target).prepend(this)
        return this
    }

    insertBefore(target) {
        const ref = resolveTarget(target)[0]
        this.forEach(node => { ref.parentNode && ref.parentNode.insertBefore(node, ref) })
        return this
    }

    insertAfter(target) {
        const ref = resolveTarget(target)[0]
        this.forEach(node => { ref.parentNode && ref.parentNode.insertBefore(node, ref.nextSibling) })
        return this
    }

    before(target) {
        resolveTarget(target)
            .forEach(node => this.forEach(child => { node.parentNode && node.parentNode.insertBefore(child, node) }))
        return this
    }

    after(target) {
        resolveTarget(target)
            .forEach(node => this.forEach(child => { node.parentNode && node.parentNode.insertBefore(child, node.nextSibling) }))
        return this
    }
}

function stripPseudo(selector) {
    return selector.replace(/\s*:(eq\(\d+\)|first|last)\s*/g, '').trim()
}

function applyPseudo(nodes, selector) {
    const m = selector.match(/:(eq\((\d+)\)|first|last)/)
    if(!m) return nodes
    if(m[2] !== undefined) {
        const i = Number(m[2])
        return nodes[i] !== undefined? [nodes[i]] : []
    }
    if(m[1] === 'last') return nodes.length? [nodes[nodes.length - 1]] : []
    return nodes.length? [nodes[0]] : []
}

function resolveTarget(target) {
    if(typeof target === 'string') {
        return new DomCollection([document.querySelector(target)])
    }
    if(target instanceof DomCollection) return target
    if(target && target.jquery) return new DomCollection(target.toArray())
    if(target && target.nodeType) return new DomCollection([target])
    return new DomCollection()
}

export default DomCollection
