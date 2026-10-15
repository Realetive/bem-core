import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage()
page.on('pageerror', e => console.log('[pageerror]', e.message))
await page.goto('http://localhost:5174/test/browser/index.html')
const res = await page.evaluate(() => new Promise(resolve => {
    window.modules.require(['i-bem-dom', 'BEMHTML', 'sinon'], (bemDom, BEMHTML, sinon) => {
        const log = []
        const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy(), spy5 = sinon.spy(), spy6 = sinon.spy(), spy7 = sinon.spy()
        const wrapSpy = (spy) => function(e) { spy.call(this, e, e.bemTarget, e.data) }
        const data = { data : 'data' }
        const Elem1 = bemDom.declElem('block', 'e1')
        const Block1 = bemDom.declBlock('block', {}, {
            onInit() {
                this._events('e1').on('click', spy1).on('click', spy2).on('click', data, wrapSpy(spy3))
                this._events('e2').on('click', spy5)
            }
        })
        const Elem2 = bemDom.declElem('block', 'e2', {}, {
            onInit() { this._events('e1').on('click', wrapSpy(spy6)).on('click', spy7) }
        })
        const root = bemDom.init(BEMHTML.apply({ block : 'block', content : [
            { elem : 'e1', content : { elem : 'e3' } },
            { elem : 'e2', content : { elem : 'e1' } }
        ] }))
        root.appendTo(bemDom.scope)
        const block1 = root.bem(Block1)
        block1._elem('e1')._emit('click')
        log.push('spy3.called=' + spy3.called + ' args0len=' + (spy3.args[0] ? spy3.args[0].length : 'none'))
        log.push('spy3.args[0][0].data=' + (spy3.args[0] && JSON.stringify(spy3.args[0][0].data)))
        log.push('spy3.args[0][1] type=' + typeof (spy3.args[0] && spy3.args[0][1]))
        log.push('spy1.calledOnBlock1=' + spy1.calledOn(block1))
        log.push('spy6.called=' + spy6.called + ' spy6.bemTargetIsElem1=' + (spy6.args[0] && spy6.args[0][1] instanceof Elem1))
        resolve(log)
    })
}))
console.log(res.join('\n'))
await browser.close()
