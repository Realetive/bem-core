/**
 * Auto initialization on DOM ready
 */

import init from 'bem:i-bem-dom__init'
import nextTick from 'bem:next-tick'

function autoInit() {
    nextTick(init)
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit)
} else {
    autoInit()
}
