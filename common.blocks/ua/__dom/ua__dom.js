/**
 * @module ua__dom
 * @description Sets `ua` block modifiers from the `env` module getters:
 * `platform` (`ios`|`android`|`bada`|`wp`|`opera`|`other`), `browser`
 * (`opera`|`chrome`|`''`), `ios`/`android` (major digit), `ios-subversion`
 * (`\d\.\d` with the dot stripped), `screen-size`, `svg` (`yes`|`no`).
 * Common base since S1 — the former platform forks are collapsed; the touch
 * level adds its `orient` delta on top of this base.
 */

import bemDom from 'bem:i-bem-dom';
import env from 'bem:env';

export default bemDom.declBlock('ua',
    {
        onSetMod : {
            'js' : {
                'inited' : function() {
                    const platform = env.platform,
                        browser = env.browser;

                    this
                        .setMod('platform',
                            platform.ios? 'ios' :
                                platform.android? 'android' :
                                    platform.bada? 'bada' :
                                        platform.wp? 'wp' :
                                            browser.opera? 'opera' :
                                                'other')
                        .setMod('browser',
                            browser.opera? 'opera' :
                                browser.chrome? 'chrome' :
                                    '')
                        .setMod('ios', platform.ios? platform.ios.charAt(0) : '')
                        .setMod('android', platform.android? platform.android.charAt(0) : '')
                        .setMod('ios-subversion',
                            platform.ios? platform.ios.match(/(\d\.\d)/)[1].replace('.', '') : '')
                        .setMod('screen-size', env.screenSize)
                        .setMod('svg', env.svg? 'yes' : 'no');
                }
            }
        }
    });
