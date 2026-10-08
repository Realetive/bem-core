import domFacade from 'bem:dom__facade'

const { parseHtml, contains } = domFacade

describe('dom__facade', function() {

    describe('parseHtml', function() {

        it('returns top-level nodes', function() {
            const nodes = parseHtml('<div class="a"></div><span class="b"></span>')
            nodes.should.have.lengthOf(2)
            nodes[0].className.should.be.equal('a')
            nodes[1].tagName.should.be.equal('SPAN')
        })

        it('D-11 policy: parsed script elements never execute, before or after insertion', function() {
            const marker = '__parseHtmlScriptExecuted'
            window[marker] = undefined

            const nodes = parseHtml('<div><script>window.' + marker + ' = true</script></div>')
            document.body.append(...nodes)

            try {
                (window[marker] === undefined).should.be.true
            } finally {
                nodes.forEach(node => node.remove())
                delete window[marker]
            }
        })
    })

    describe('contains', function() {

        it('checks descendant and self containment', function() {
            const nodes = parseHtml('<div class="outer"><div class="inner"></div></div>')
            const outer = nodes[0],
                inner = outer.firstChild

            contains(outer, inner).should.be.true
            contains(outer, outer).should.be.true
            contains(inner, outer).should.be.false
        })

        it('returns false for missing nodes', function() {
            contains(null, null).should.be.false
        })
    })
})
