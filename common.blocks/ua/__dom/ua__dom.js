/**
 * @module ua__dom
 * @description Common base for ua block — reads mods from env getters
 */

import env from 'bem:env';
import bemDom from 'bem:i-bem-dom';

export default bemDom.declBlock('ua', {
    onSetMod : {
        js : {
            inited() {
                const platform = env.platform;
                const browser = env.browser;
                const iosMatch = platform.ios ? platform.ios.match(/(\d+)\.(\d+)/) : null;
                const androidMatch = platform.android ? platform.android.match(/(\d+)/) : null;

                this.setMod('platform',
                    platform.ios ? 'ios' :
                    platform.android ? 'android' :
                    platform.bada ? 'bada' :
                    platform.wp ? 'wp' :
                    browser.opera ? 'opera' : 'other');

                this.setMod('browser',
                    browser.opera ? 'opera' :
                    browser.chrome ? 'chrome' : '');

                if(iosMatch) {
                    this.setMod('ios', iosMatch[1]);
                    const sub = platform.ios.match(/(\d\.\d)/);
                    if(sub) this.setMod('ios-subversion', sub[1].replace('.', ''));
                }

                if(androidMatch) this.setMod('android', androidMatch[1]);

                this.setMod('screen-size', env.screenSize);
                this.setMod('svg', env.svg ? 'yes' : 'no');
            }
        }
    }
});
