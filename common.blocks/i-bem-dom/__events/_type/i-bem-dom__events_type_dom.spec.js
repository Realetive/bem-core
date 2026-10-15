import bem from 'bem:i-bem'
import bemDom from 'bem:i-bem-dom'
import objects from 'bem:objects'
import { expect } from 'chai'
import sinon from 'sinon'
import BEMHTML from '../../../../test/browser/bemhtml-shim.js'

var undef;

// native dispatch helper: trigger-time extra handler args ride CustomEvent
// detail and the engine spreads them back positionally
function trigger(target, type) {
    const node = target.jquery ? target[0] : target
    const extra = Array.prototype.slice.call(arguments, 2)
    node.dispatchEvent(new CustomEvent(type, {
        bubbles : true,
        cancelable : true,
        detail : extra.length ? extra : null
    }))
}

describe('DOM events', function() {
    var Block1, Block2, Block3, block1, spy1, spy2, spy3, spy4, spy5, spy6, spy7, spy8,
        wrapSpy = function(spy) {
            return function(e) {
                // NOTE: we need to pass bemTarget and data explicitly, as `e` is being
                // changed while event is propagating
                spy.call(this, e, e.bemTarget, e.data);
            };
        },
        data = { data : 'data' };

    beforeEach(function() {
        spy1 = sinon.spy();
        spy2 = sinon.spy();
        spy3 = sinon.spy();
        spy4 = sinon.spy();
        spy5 = sinon.spy();
        spy6 = sinon.spy();
        spy7 = sinon.spy();
        spy8 = sinon.spy();
    });

    afterEach(function() {
        bemDom.destruct(bemDom.scope, true);

        objects.each(bem.entities, function(_, entityName) {
            delete bem.entities[entityName];
        });
    });

    describe('on instance events', function() {
        describe('block domElem events', function() {
            beforeEach(function() {
                Block1 = bemDom.declBlock('block1', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents()
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3))
                                    .once('click', spy4);
                            }
                        }
                    }
                });

                Block2 = bemDom.declBlock('block2', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents()
                                    .on('click', spy5);
                            }
                        }
                    }
                });

                block1 = createDomNode({
                    block : 'block1',
                    mix : { block : 'block2', js : true }
                }).bem(Block1);
            });

            it('should properly bind handlers', function() {
trigger(block1.domElem, 'click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][1].should.be.instanceOf(Block1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should pass data to handler', function() {
                var data = { test : 'data' };
trigger(block1.domElem, 'click', data);

                spy1.args[0][1].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
trigger(block1.domElem, 'click');
                spy4.should.have.been.called;

trigger(block1.domElem, 'click');
                spy4.should.have.been.calledOnce;

                block1._domEvents().once('click', spy4);
trigger(block1.domElem, 'click');
                spy4.should.have.been.calledTwice;
            });

            it('should properly bind the same handler', function() {
                block1._domEvents()
                    .on('click', spy6)
                    .on('click', spy6);

trigger(block1.domElem, 'click');
                spy6.should.have.been.calledOnce;

                block1._domEvents().un('click', spy6);
trigger(block1.domElem, 'click');
                spy6.should.have.been.calledOnce;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents().un('click');
trigger(block1.domElem, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents().un('click', spy1);
trigger(block1.domElem, 'click');

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });

            it('should unbind only own handlers', function() {
                block1._domEvents().un('click');
trigger(block1.domElem, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                spy5.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents().un('click', spy4);
trigger(block1.domElem, 'click');
                spy4.should.not.have.been.called;
            });

            it('should unbind single event from multi-event subscription', function() {
                var multiSpy = sinon.spy();
                block1._domEvents().on('click keypress', multiSpy);

                block1._domEvents().un('click', multiSpy);
trigger(block1.domElem, 'click');
                multiSpy.should.not.have.been.called;

trigger(block1.domElem, 'keypress');
                multiSpy.should.have.been.calledOnce;
            });
        });

        describe('block elems events', function() {
            ['string', 'Class'].forEach(function(elemType) {
                var elem1, elem2;

                describe('elem as ' + elemType, function() {
                    var Elem1, Elem2;

                    beforeEach(function() {
                        elem1 = elemType === 'string'?
                            'e1' :
                            bemDom.declElem('block', 'e1');
                        Block1 = bemDom.declBlock('block', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                        this._domEvents(elem1)
                                            .on('click', spy1)
                                            .on('click', spy2)
                                            .on('click', data, wrapSpy(spy3));

                                        this._domEvents('e2').on('click', spy5);
                                        this._domEvents('e4').on('click', spy8);
                                    }
                                }
                            }
                        });

                        Elem1 = elemType === 'string'?
                            bemDom.declElem('block', 'e1') :
                            elem1;
                        Elem2 = bemDom.declElem('block', 'e2', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                        this._domEvents(elem1)
                                            .on('click', wrapSpy(spy6))
                                            .on('click', spy7);
                                    }
                                }
                            }
                        });

                        block1 = createDomNode({
                            block : 'block',
                            mix : { block : 'block', elem : 'e4' },
                            content : [
                                { elem : 'e1', content : { elem : 'e3' } },
                                { elem : 'e2', content : { elem : 'e1' } }
                            ]
                        }).bem(Block1);

                        elem2 = block1._elem('e2');
                    });

                    describe('block', function() {
                        it('should properly bind handlers', function() {
trigger(block1._elem('e3').domElem, 'click');

                            spy1.should.have.been.called;
                            spy1.should.have.been.calledOn(block1);

                            spy2.should.have.been.called;

                            spy3.should.have.been.called;
                            spy3.args[0][2].should.have.been.equal(data);
                            spy3.args[0][1].should.be.instanceOf(Elem1);
                            spy3.args[0][1].domElem[0]
                                .should.be.equal(block1._elem(elem1).domElem[0]);

                            spy5.should.not.have.been.called;
                        });

                        it('should properly bind handlers to mixed elem', function() {
trigger(block1._elem('e4').domElem, 'click');

                            spy8.should.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            block1._domEvents(elem1).un('click');
trigger(block1._elem(elem1).domElem, 'click');

                            spy1.should.not.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.not.have.been.called;

trigger(elem2.domElem, 'click');

                            spy5.should.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            block1._domEvents(elem1).un('click', spy2);
trigger(block1._elem(elem1).domElem, 'click');

                            spy1.should.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.have.been.called;
                        });

                        it('should properly unbind handlers from mixed elem', function() {
                            block1._domEvents('e4').un('click', spy8);
trigger(block1._elem('e4').domElem, 'click');

                            spy8.should.not.have.been.called;
                        });
                    });

                    describe('elem instance', function() {
                        it('should properly bind handlers', function() {
                            var e2elem1 = elem2.findChildElem('e1');
trigger(e2elem1.domElem, 'click');

                            spy6.should.have.been.called;
                            spy6.should.have.been.calledOn(elem2);
                            spy6.args[0][1].should.be.instanceOf(Elem1);
                            spy6.args[0][1].domElem[0]
                                .should.be.equal(e2elem1.domElem[0]);

                            spy7.should.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            elem2._domEvents(elem1).un('click');

                            var e2elem1 = elem2.findChildElem('e1');
trigger(e2elem1.domElem, 'click');

                            spy6.should.not.have.been.called;
                            spy7.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            elem2._domEvents(elem1).un('click', spy7);

                            var e2elem1 = elem2.findChildElem('e1');
trigger(e2elem1.domElem, 'click');

                            spy6.should.have.been.called;
                            spy7.should.not.have.been.called;
                        });
                    });
                });

                describe('elem as ' + elemType + ', modName, modVal', function() {
                    beforeEach(function() {
                        Block1 = bemDom.declBlock('block', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                        this._domEvents({ elem : elem1 })
                                            .on('click', spy1);
                                        this._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' })
                                            .on('click', spy2)
                                            .on('click', spy3);
                                    }
                                }
                            }
                        });

                        block1 = createDomNode({
                            block : 'block',
                            content : [
                                { elem : 'e1' },
                                { elem : 'e1', elemMods : { m1 : 'v1' } }
                            ]
                        }).bem(Block1);
                    });

                    it('should properly bind handlers', function() {
trigger(block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domElem, 'click');

                        spy1.should.have.been.called;
                        spy2.should.have.been.called;

trigger(block1._elem('e1').domElem, 'click');

                        spy1.should.have.been.calledTwice;
                        spy2.should.have.been.calledOnce;
                    });

                    it('should properly unbind all handlers', function() {
                        block1._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click');

trigger(block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domElem, 'click');

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                    });

                    it('should properly unbind specified handler', function() {
                        block1._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click', spy2);

trigger(block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domElem, 'click');

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.have.been.called;
                    });
                });
            });

            describe('elem as instance', function() {
                var elem1, elem2;

                beforeEach(function() {
                    Block1 = bemDom.declBlock('block', {
                        onSetMod : {
                            'js' : {
                                'inited' : function() {
                                    this._domEvents(this._elem('e1'))
                                        .on('click', spy1)
                                        .on('click', spy2)
                                        .on('click', data, wrapSpy(spy3));

                                    this._domEvents(this._elem('e2')).on('click', spy5);

                                    this._domEvents(this._elems('e1').get(1)).on('click', spy6);
                                }
                            }
                        }
                    });

                    block1 = createDomNode({
                        block : 'block',
                        content : [
                            { elem : 'e1', content : { elem : 'e3' } },
                            { elem : 'e2', content : { elem : 'e1' } }
                        ]
                    }).bem(Block1);

                    elem1 = block1._elem('e1');
                    elem2 = block1._elem('e2');
                });

                describe('block', function() {
                    it('should properly bind handlers', function() {
trigger(block1._elem('e3').domElem, 'click');

                        spy1.should.have.been.called;
                        spy1.should.have.been.calledOn(block1);

                        spy2.should.have.been.called;

                        spy3.should.have.been.called;
                        spy3.args[0][1].should.be.equal(elem1);
                        spy3.args[0][2].should.be.equal(data);

                        spy5.should.not.have.been.called;
                    });

                    it('should properly bind handlers on elem with the same name', function() {
trigger(block1._elem('e1').domElem, 'click');

                        spy1.should.have.been.called;
                        spy6.should.not.have.been.called;
                    });

                    it('should properly unbind all handlers', function() {
                        block1._domEvents(elem1).un('click');
trigger(elem1.domElem, 'click');

                        spy1.should.not.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.not.have.been.called;

trigger(elem2.domElem, 'click');

                        spy5.should.have.been.called;
                    });

                    it('should properly unbind specified handler', function() {
                        block1._domEvents(elem1).un('click', spy2);
trigger(elem1.domElem, 'click');

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.have.been.called;
                    });
                });
            });
        });

        describe('collection events', function() {
            var Elem1, collection;

            beforeEach(function() {
                Block1 = bemDom.declBlock('block1', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents(collection = this.findChildElems(Elem1))
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3))
                                    .once('click', spy4);
                            }
                        }
                    }
                });

                Elem1 = bemDom.declElem('block1', 'elem1');

                block1 = createDomNode({
                    block : 'block1',
                    content : { elem : 'elem1' }
                }).bem(Block1);
            });

            it('should properly bind handlers', function() {
trigger(block1._elem('elem1').domElem, 'click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][1].should.be.instanceOf(Elem1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
trigger(block1._elem('elem1').domElem, 'click');
                spy4.should.have.been.called;

trigger(block1._elem('elem1').domElem, 'click');
                spy4.should.have.been.calledOnce;

                block1._domEvents(collection).once('click', spy4);
trigger(block1._elem('elem1').domElem, 'click');
                spy4.should.have.been.calledTwice;
            });

            it('should properly bind the same handler', function() {
                block1._domEvents(collection)
                    .on('click', spy6)
                    .on('click', spy6);

trigger(block1._elem('elem1').domElem, 'click');
                spy6.should.have.been.calledOnce;

                block1._domEvents(collection).un('click', spy6);
trigger(block1._elem('elem1').domElem, 'click');
                spy6.should.have.been.calledOnce;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents(collection).un('click');
trigger(block1._elem('elem1').domElem, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents(collection).un('click', spy1);
trigger(block1._elem('elem1').domElem, 'click');

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents(collection).un('click', spy4);
trigger(block1._elem('elem1').domElem, 'click');
                spy4.should.not.have.been.called;
            });
        });

        describe('document events', function() {
            beforeEach(function() {
                Block1 = bemDom.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents(document)
                                    .on('click', spy1)
                                    .on('click', spy2);

                                this._domEvents(bemDom.doc)
                                    .on('click', data, wrapSpy(spy3))
                                    .once('click', spy4);
                            }
                        }
                    }
                });
                block1 = bemDom.init(BEMHTML.apply({ block : 'block' })).bem(Block1);
            });

            it('should properly bind handlers', function() {
trigger(bemDom.doc, 'click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
trigger(bemDom.doc, 'click');
                spy4.should.have.been.called;

trigger(bemDom.doc, 'click');
                spy4.should.have.been.calledOnce;

                block1._domEvents(bemDom.doc).once('click', spy4);
trigger(bemDom.doc, 'click');
                spy4.should.have.been.calledTwice;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents(document).un('click');
trigger(bemDom.doc, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents(document).un('click', spy1);
trigger(bemDom.doc, 'click');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents(document).un('click', spy4);
trigger(bemDom.doc, 'click');
                spy4.should.not.have.been.called;
            });

            it('should properly unbind all handlers on block destruct', function() {
                bemDom.destruct(block1.domElem);
trigger(bemDom.doc, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
                spy4.should.not.have.been.called;
            });
        });

        describe('window events', function() {
            beforeEach(function() {
                Block1 = bemDom.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents(window)
                                    .on('resize', spy1)
                                    .on('resize', spy2);

                                this._domEvents(window)
                                    .on('resize', data, wrapSpy(spy3))
                                    .once('resize', spy4);
                            }
                        }
                    }
                });
                block1 = createDomNode({ block : 'block' }).bem(Block1);
            });

            it('should properly bind handlers', function() {
trigger(bemDom.win, 'resize');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
trigger(bemDom.win, 'resize');
                spy4.should.have.been.called;

trigger(bemDom.win, 'resize');
                spy4.should.have.been.calledOnce;

                block1._domEvents(bemDom.win).once('click', spy4);
trigger(bemDom.win, 'click');
                spy4.should.have.been.calledTwice;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents(window).un('resize');
trigger(bemDom.win, 'resize');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents(window).un('resize', spy1);
trigger(bemDom.win, 'resize');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents(window).un('resize', spy4);
trigger(bemDom.win, 'resize');
                spy4.should.not.have.been.called;
            });

            it('should properly unbind all handlers on block destruct', function() {
                bemDom.destruct(block1.domElem);
trigger(bemDom.win, 'resize');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
                spy4.should.not.have.been.called;
            });
        });

        describe('arbitrary jQuery-chain or DOM-node events', function() {
            var rootNode;

            beforeEach(function() {
                Block1 = bemDom.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents(rootNode[0])
                                    .on('click', spy1)
                                    .on('click', spy2);

                                this._domEvents(rootNode.find('div').addBack())
                                    .on('dblclick', data, wrapSpy(spy3))
                                    .once('dblclick', spy4);
                            }
                        }
                    }
                });
                rootNode = createDomNode({
                    content : {
                        content : { block : 'block', tag : 'p' }
                    }
                });
                block1 = rootNode.find(Block1._buildSelector()).bem(Block1);
            });

            it('should properly bind handlers', function() {
trigger(rootNode, 'click');

                spy1.should.have.been.calledOnce;
                spy2.should.have.been.calledOnce;

trigger(rootNode.find('div'), 'dblclick');

                spy3.should.have.been.calledTwice;
                spy3.should.have.been.calledOn(block1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
trigger(rootNode, 'dblclick');
                spy4.should.have.been.called;

trigger(rootNode, 'dblclick');
                spy4.should.have.been.calledOnce;

                block1._domEvents(rootNode.find('div').addBack()).once('dblclick', spy4);
trigger(rootNode, 'dblclick');
                spy4.should.have.been.calledTwice;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents(rootNode[0]).un('click');
trigger(rootNode, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                block1._domEvents(rootNode.find('div').addBack()).un('dblclick');
trigger(rootNode.find('div'), 'dblclick');

                spy3.should.not.have.been.called;
                spy4.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents(rootNode[0]).un('click', spy1);
trigger(rootNode, 'click');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents(rootNode.find('div').addBack()).un('dblclick', spy4);
trigger(rootNode.find('div'), 'dblclick');
                spy4.should.not.have.been.called;
            });

            it('should properly unbind all handlers on block destruct', function() {
                bemDom.destruct(block1.domElem);
trigger(rootNode, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });
        });
    });

    describe('delegated events', function() {
        function initDom(bemjson) {
            return createDomNode(bemjson).appendTo(bemDom.scope);
        }

        describe('block domElem events', function() {
            beforeEach(function() {
                Block1 = bemDom.declBlock('block1', {}, {
                    onInit : function() {
                        this._domEvents()
                            .on('click', spy1)
                            .on('click', spy2)
                            .on('click', data, wrapSpy(spy3))
                            .once('click', spy4);
                    }
                });

                Block2 = bemDom.declBlock('block2', {}, {
                    onInit : function() {
                        this._domEvents()
                            .on('click', spy5);
                    }
                });

                Block3 = bemDom
                    .declBlock('block3')
                    .declMod({ modName : 'm1', modVal : 'v1' }, {}, {
                        onInit : function() {
                            this._domEvents({ modName : 'm1', modVal : 'v1' }).on('click', spy6);
                        }
                    });

                block1 = initDom({
                    block : 'block1',
                    mix : { block : 'block2', js : true },
                    content : [
                        { block : 'block3', js : true },
                        { block : 'block3', mods : { m1 : 'v1' }, js : true }
                    ]
                }).bem(Block1);
            });

            it('should properly bind handlers', function() {
trigger(block1.domElem, 'click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][1].should.be.instanceOf(Block1);
                spy3.args[0][0].data.should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
trigger(block1.domElem, 'click');
                spy4.should.have.been.called;

trigger(block1.domElem, 'click');
                spy4.should.have.been.calledOnce;

                block1._domEvents().once('click', spy4);
trigger(block1.domElem, 'click');
                spy4.should.have.been.calledTwice;
            });

            it('should properly unbind all handlers', function() {
                Block1._domEvents().un('click');
trigger(block1.domElem, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                Block1._domEvents().un('click', spy1);
trigger(block1.domElem, 'click');

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });

            it('should unbind only own handlers', function() {
                Block1._domEvents().un('click');
trigger(block1.domElem, 'click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                spy5.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                Block1._domEvents().un('click', spy4);
trigger(block1.domElem, 'click');
                spy4.should.not.have.been.called;
            });

            it('should properly bind to self with modifier', function() {
                var blocks = block1.findChildBlocks(Block3);

trigger(blocks.get(0).domElem, 'click');
                spy6.should.not.have.been.called;

trigger(blocks.get(1).domElem, 'click');
                spy6.should.have.been.called;
            });
        });

        describe('block elems events', function() {
            ['string', 'Class'].forEach(function(elemType) {
                var elem1, elem2;

                describe('elem as ' + elemType, function() {
                    var Elem1, Elem2;

                    beforeEach(function() {
                        elem1 = elemType === 'string'?
                            'e1' :
                            bemDom.declElem('block', 'e1');

                        Block1 = bemDom.declBlock('block', {}, {
                            onInit : function() {
                                this._domEvents(elem1)
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3));

                                this._domEvents('e2').on('click', spy5);
                            }
                        });

                        Elem1 = elemType === 'string'?
                            bemDom.declElem('block', 'e1') :
                            elem1;
                        Elem2 = bemDom.declElem('block', 'e2', {}, {
                            onInit : function() {
                                this._domEvents(elem1)
                                    .on('click', wrapSpy(spy6))
                                    .on('click', spy7);
                            }
                        });

                        block1 = initDom({
                            block : 'block',
                            content : [
                                { elem : 'e1', content : { elem : 'e3' } },
                                { elem : 'e2', content : { elem : 'e1' } }
                            ]
                        }).bem(Block1);

                        elem2 = block1._elem('e2');
                    });

                    describe('block', function() {
                        it('should properly bind handlers', function() {
trigger(block1._elem('e3').domElem, 'click');

                            spy1.should.have.been.called;
                            spy1.should.have.been.calledOn(block1);

                            spy2.should.have.been.called;

                            spy3.should.have.been.called;
                            spy3.args[0][0].data.should.have.been.equal(data);
                            spy3.args[0][1].should.be.instanceOf(Elem1);
                            spy3.args[0][1].domElem[0]
                                .should.be.equal(block1._elem(elem1).domElem[0]);

                            spy5.should.not.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            Block1._domEvents(elem1).un('click');
trigger(block1._elem(elem1).domElem, 'click');

                            spy1.should.not.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            Block1._domEvents(elem1).un('click', spy2);
trigger(block1._elem(elem1).domElem, 'click');

                            spy1.should.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.have.been.called;
                        });
                    });

                    describe('elem instance', function() {
                        it('should properly bind handlers', function() {
                            var e2elem1 = elem2.findChildElem('e1');
trigger(e2elem1.domElem, 'click');

                            spy6.should.have.been.called;
                            spy6.should.have.been.calledOn(elem2);
                            spy6.args[0][1].should.be.instanceOf(Elem1);
                            spy6.args[0][1].domElem[0]
                                .should.be.equal(e2elem1.domElem[0]);

                            spy7.should.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            Elem2._domEvents(elem1).un('click');

                            var e2elem1 = elem2.findChildElem('e1');
trigger(e2elem1.domElem, 'click');

                            spy6.should.not.have.been.called;
                            spy7.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            Elem2._domEvents(elem1).un('click', spy7);

                            var e2elem1 = elem2.findChildElem('e1');
trigger(e2elem1.domElem, 'click');

                            spy6.should.have.been.called;
                            spy7.should.not.have.been.called;
                        });
                    });
                });

                describe('elem as ' + elemType + ', modName, modVal', function() {
                    beforeEach(function() {
                        Block1 = bemDom.declBlock('block', {}, {
                            onInit : function() {
                                this._domEvents({ elem : elem1 })
                                    .on('click', spy1);
                                this._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' })
                                    .on('click', spy2)
                                    .on('click', spy3);
                            }
                        });

                        block1 = initDom({
                            block : 'block',
                            content : [
                                { elem : 'e1' },
                                { elem : 'e1', elemMods : { m1 : 'v1' } }
                            ]
                        }).bem(Block1);
                    });

                    it('should properly bind handlers', function() {
trigger(block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domElem, 'click');

                        spy1.should.have.been.called;
                        spy2.should.have.been.called;

trigger(block1._elem('e1').domElem, 'click');

                        spy1.should.have.been.calledTwice;
                        spy2.should.have.been.calledOnce;
                    });

                    it('should properly unbind all handlers', function() {
                        Block1._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click');

trigger(block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domElem, 'click');

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                    });

                    it('should properly unbind specified handler', function() {
                        Block1._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click', spy2);

trigger(block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domElem, 'click');

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.have.been.called;
                    });
                });
            });
        });
    });

    describe('focus/blur delegation (native focusin/focusout mapping)', function() {
        var rootNode, elemInput;

        beforeEach(function() {
            Block1 = bemDom.declBlock('block', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            this._domEvents('input')
                                .on('focus', spy1)
                                .on('blur', spy2);
                        }
                    }
                }
            });

            rootNode = createDomNode({
                block : 'block',
                content : { elem : 'input', tag : 'input' }
            });
            document.body.appendChild(rootNode[0]);
            block1 = rootNode.bem(Block1);
            elemInput = rootNode.find('input')[0];
        });

        afterEach(function() {
            rootNode.remove();
        });

        it('should delegate focus through focusin', function() {
            elemInput.focus();
            spy1.should.have.been.called;
            spy1.args[0][0].type.should.be.equal('focusin');
        });

        it('should delegate blur through focusout', function() {
            elemInput.focus();
            elemInput.blur();
            spy2.should.have.been.called;
            spy2.args[0][0].type.should.be.equal('focusout');
        });
    });

    describe('bem-type interop (mixed flow)', function() {
        it('should run dom and bem handlers on one entity in the same flow', function() {
            Block1 = bemDom.declBlock('block', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            this._domEvents().on('click', spy1);
                            this._events().on('go', spy2);
                        }
                    }
                }
            });

            block1 = createDomNode({ block : 'block' }).bem(Block1);

            trigger(block1.domElem, 'click');
            block1._emit('go');

            spy1.should.have.been.called;
            spy2.should.have.been.called;
        });
    });
});

function createDomNode(bemjson) {
    return bemDom.init(BEMHTML.apply(bemjson));
}
