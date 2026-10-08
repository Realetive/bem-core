import dom from 'bem:dom'
import domFacade from 'bem:dom__facade'

const { parseHtml } = domFacade

function fixture(html) {
    const root = parseHtml(html)[0]
    document.body.appendChild(root)
    return root
}

describe('dom', function() {
    describe('contains', function() {
        let root
        beforeEach(function() {
            root = fixture(
                '<div>' +
                    '<div class="a"><div class="x"></div></div>' +
                    '<div class="a"><div class="x"></div><div class="y"></div></div>' +
                    '<div class="c"></div>' +
                '</div>')
        })

        afterEach(function() {
            root.remove()
        })

        it('should properly checks for nested dom elem', function() {
            dom.contains(root.querySelectorAll('.a')[0], root.querySelector('.x')).should.be.true
            dom.contains(root.querySelectorAll('.a')[1], root.querySelector('.y')).should.be.true
            dom.contains(root.querySelector('.c'), root.querySelector('.x')).should.be.false
        })

        it('should returns true for itself', function() {
            dom.contains(root.querySelector('.x'), root.querySelector('.x')).should.be.true
        })

        it('should returns false for missing DOM elem', function() {
            dom.contains(root.querySelector('.a'), null).should.be.false
        })
    })

    describe('getFocused', function() {
        it('should returns focused DOM elem', function() {
            const elem = document.createElement('input')
            document.body.appendChild(elem)
            elem.focus()
            dom.getFocused().should.be.eql(elem)
            elem.blur()
            dom.getFocused().should.not.be.eql(elem)
            elem.remove()
        })
    })

    describe('isFocusable', function() {
        function elem(tag, attrs) {
            const node = document.createElement(tag)
            for(const [name, value] of Object.entries(attrs || {})) node.setAttribute(name, value)
            return node
        }

        it('should returns true if given DOM elem is iframe, input, button, textarea or select', function() {
            dom.isFocusable(elem('iframe')).should.be.true
            dom.isFocusable(elem('input')).should.be.true
            dom.isFocusable(elem('button')).should.be.true
            dom.isFocusable(elem('textarea')).should.be.true
            dom.isFocusable(elem('select')).should.be.true
        })

        it('should returns false if given DOM elem is disabled', function() {
            dom.isFocusable(elem('input', { disabled : 'disabled' })).should.be.false
            dom.isFocusable(elem('button', { disabled : 'disabled' })).should.be.false
            dom.isFocusable(elem('textarea', { disabled : 'disabled' })).should.be.false
            dom.isFocusable(elem('select', { disabled : 'disabled' })).should.be.false
        })

        it('should returns true if given DOM elem is link with href', function() {
            dom.isFocusable(elem('a', { href : '/' })).should.be.true
            dom.isFocusable(elem('a')).should.be.false
        })

        it('should returns true if given DOM elem has tabindex', function() {
            dom.isFocusable(elem('span', { tabindex : '4' })).should.be.true
            dom.isFocusable(elem('a', { tabindex : '5' })).should.be.true
            dom.isFocusable(elem('span')).should.be.false
        })

        it('should returns false if given DOM elem is empty', function() {
            dom.isFocusable(null).should.be.false
        })
    })

    describe('containsFocus', function() {
        let root
        beforeEach(function() {
            root = fixture(
                '<div>' +
                    '<div class="a"><input class="x"></div>' +
                    '<div class="b"></div>' +
                '</div>')
            root.querySelector('.x').focus()
        })

        afterEach(function() {
            root.remove()
        })

        it('should returns true if context contains focused DOM elem', function() {
            dom.containsFocus(root.querySelector('.a')).should.be.true
        })

        it('should returns true if context self-focused', function() {
            dom.containsFocus(root.querySelector('.x')).should.be.true
        })

        it('should returns false if context not contains focused DOM elem', function() {
            dom.containsFocus(root.querySelector('.b')).should.be.false
        })

        it('should returns false if context is empty', function() {
            dom.containsFocus(null).should.be.false
        })
    })

    describe('isEditable', function() {
        function elem(tag, attrs) {
            const node = document.createElement(tag)
            for(const [name, value] of Object.entries(attrs || {})) node.setAttribute(name, value)
            return node
        }

        it('should returns true if given DOM elem is text or password input', function() {
            dom.isEditable(elem('input', { type : 'text' })).should.be.true
            dom.isEditable(elem('input', { type : 'password' })).should.be.true
            dom.isEditable(elem('textarea')).should.be.true
            dom.isEditable(elem('input', { type : 'radio' })).should.be.false
            dom.isEditable(elem('input', { type : 'checkbox' })).should.be.false
            dom.isEditable(elem('div')).should.be.false
        })

        it('should returns false if given input is readonly', function() {
            dom.isEditable(elem('input', { type : 'text', readonly : 'readonly' })).should.be.false
            dom.isEditable(elem('textarea', { readonly : 'readonly' })).should.be.false
        })

        it('should returns false if given input is disabled', function() {
            dom.isEditable(elem('input', { type : 'text', disabled : 'disabled' })).should.be.false
            dom.isEditable(elem('textarea', { disabled : 'disabled' })).should.be.false
        })

        it('should returns true for contenteditable DOM elems', function() {
            dom.isEditable(elem('div', { contenteditable : 'true' })).should.be.true
            dom.isEditable(elem('div', { contenteditable : 'false' })).should.be.false
            dom.isEditable(elem('div', { contenteditable : 'yet-another-val' })).should.be.false
        })

        it('should returns false if given DOM elem is empty', function() {
            dom.isEditable(null).should.be.false
        })
    })
})
