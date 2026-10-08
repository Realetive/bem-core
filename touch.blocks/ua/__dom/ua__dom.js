/**
 * @module ua__dom
 * @description Touch delta — adds orient tracking via native orientchange
 */

import env from 'bem:env';
import bemDom from 'bem:i-bem-dom';

export default function(prev) {
    const baseInited = prev.onSetMod.js.inited;

    prev.onSetMod.js.inited = function() {
        baseInited.call(this);

        this.setMod('orient', env.landscape ? 'landscape' : 'portrait');

        this._domEvents(bemDom.win).on('orientchange', (e) => {
            this.setMod('orient', e.detail.landscape ? 'landscape' : 'portrait');
        });
    };

    return prev;
};
