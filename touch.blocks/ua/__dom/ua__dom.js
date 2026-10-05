/**
 * @module ua__dom
 * @description Touch delta of the common `ua__dom` base (transformer form
 * `export default function(prev)` per the plugin chain rule): additionally
 * sets the `orient` modifier from `env.landscape` and updates it from the
 * native `orientchange` CustomEvent dispatched by the `env` module on
 * `window` (payload at `e.detail`).
 */

import bemDom from 'bem:i-bem-dom';
import env from 'bem:env';

export default function(base) {
    bemDom.declBlock('ua',
        {
            onSetMod : {
                'js' : {
                    'inited' : function() {
                        this.__base.apply(this, arguments);

                        this
                            .setMod('orient', env.landscape? 'landscape' : 'portrait')
                            ._domEvents(bemDom.win).on(
                                'orientchange',
                                function(e) {
                                    this.setMod('orient', e.detail.landscape? 'landscape' : 'portrait');
                                });
                    }
                }
            }
        });

    return base;
};
