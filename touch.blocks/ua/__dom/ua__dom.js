/**
 * @module ua__dom
 * @description Touch delta — adds orient tracking via native orientchange
 */

import env from 'bem:env';
import bemDom from 'bem:i-bem-dom';

export default function(_prev) {
    return bemDom.declBlock('ua', {
        onSetMod : {
            js : {
                inited() {
                    this.__base.apply(this, arguments);

                    this.setMod('orient', env.landscape ? 'landscape' : 'portrait');

                    this._domEvents(bemDom.win).on('orientchange', (e) => {
                        this.setMod('orient', e.detail.landscape ? 'landscape' : 'portrait');
                    });
                }
            }
        }
    });
};
