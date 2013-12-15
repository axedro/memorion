var sharedJuegoScene,sc;

var NADA = 20;
var FACIL = 1;
var DIFICIL = 2;



var juegoLayer = cc.Layer.extend({

    init:function () {

        sharedJuegoScene = this;
        this.paused=false;
        var fondo = cc.LayerColor.create(cc.c4b(2, 204, 41, 255));
        fondo.setAnchorPoint(cc.p(0, 0));
        fondo.setPosition(cc.p(0,0));
        fondo.setContentSize(size);
        this.addChild(fondo,0);

        var taco = cc.Sprite.createWithSpriteFrameName("cartasTaco.png");
        taco.setAnchorPoint(cc.p(0, 0));
        taco.setPosition(cc.p(455,105));
        this.addChild(taco,1);
        this.c = new cc.Node();

        

        this.fase0();

    }
});

juegoLayer.prototype.onCarta = function(e) {
    if ((!sharedJuegoScene.paused) && (!e.tocado)) {
        this.movimiento++;
        e.tocado=true;
        gAudioEngine.playEffect(e_Click);
    
        //console.log("Click en carta #" + e._tag + ", con carta " + e.carta);
        var rot = cc.Sequence.create(cc.RotateBy.create(.1,0,90),cc.CallFunc.create(function(node) {
                                sharedJuegoScene.girarAbrir(e);
                            }, this));
        e.runAction(rot);
        if (this.movimiento == 1) {
            // guardar la carta y esperar el segundo movimeiento

            sharedJuegoScene.primerNumCarta = e._tag;
            sharedJuegoScene.primeraCarta = e.carta;
        } else {
            this.movimiento=0;
            //Comprobar que la segunda carta es igual que la primera
            if (e.carta == sharedJuegoScene.primeraCarta) {
                //si es igual las descubro y compruebo si ya esta todo hecho -~> fin del juego
                //cc.log("es igual");
                this.acertados++;
                gAudioEngine.playEffect(e_OK);
                

            } else {
                //si no es igual vuelvo hacia atras
                //cc.log("no es igual")
                this.paused = true;
                gAudioEngine.playEffect(e_Fail);
                //hacer un sonido de fallo
                var acc = cc.Sequence.create(cc.DelayTime.create(1),cc.CallFunc.create(function(node) {
                                sharedJuegoScene.voltear2(e);
                            }, this));
                e.runAction(acc);
                
            }
        }
    }
};

juegoLayer.prototype.voltear2 = function(e) {
    sharedJuegoScene.cartas[this.primerNumCarta]._children[0].tocado=false;
    sharedJuegoScene.cartas[e._tag]._children[0].tocado=false;
    sharedJuegoScene.girarCerrar(sharedJuegoScene.cartas[this.primerNumCarta]);
    sharedJuegoScene.girarCerrar(sharedJuegoScene.cartas[e._tag]);
}

juegoLayer.prototype.girarCerrar = function(c) {
    var b = c._children[0];
    var d = c._children[1];
    var rotarBoton = cc.Sequence.create(cc.RotateBy.create(.1,0,90),cc.CallFunc.create(function(node) {
                            sharedJuegoScene.gCerrar2(b,d);
                        }, this));
    d.runAction(rotarBoton);
}

juegoLayer.prototype.gCerrar2 = function(b,d) {
    var rotar = cc.Sequence.create (cc.RotateBy.create(.1,0,90),cc.CallFunc.create(function(node) {
                            d._parent.removeChild(d);
                            sharedJuegoScene.paused=false;
                        }, this));
    b.runAction(rotar);
}

juegoLayer.prototype.girarAbrir = function(e) {
    //cc.log(tg);
    //cc.log(this,this.carta);
    var cTipo=e.carta
    
    var sp= cc.Sprite.createWithSpriteFrameName("c"+cTipo+".png");
    sp.setVisible(false);
    var k = e._parent.addChild(sp);
    var rot = cc.Sequence.create(cc.RotateTo.create(0,0,90),cc.CallFunc.create(function(node) {
                            e._parent._children[1].setVisible(true);
                        }, this),cc.RotateBy.create(.1,0,90),
                        cc.CallFunc.create(function(node) {
                            if (sharedJuegoScene.acertados == sharedJuegoScene.numCartas/2) {
                                //cc.log("Todas acertadas......");
                                gAudioEngine.playEffect(e_OKFinal);
                                sharedJuegoScene.scheduleOnce(sharedJuegoScene.fin,1.0);
                            }
                        }, this));
    e._parent._children[1].runAction(rot);

}

juegoLayer.prototype.fin = function() {

    //var action = cc.Sequence.create(cc.FadeOut.create(2.0),cc.CallFunc.create(function(node) {
    //                       node._parent.removeChild(node);
    //                    }, this));
    var nivel = cc.Sequence.create(cc.DelayTime.create(0.15*(this.numCartas-1)),
        cc.CallFunc.create(function(node) {
                sharedJuegoScene.fase0();
            },this));
    for (var i = 0; i < this.numCartas; i++) {
        var action = cc.Sequence.create(cc.DelayTime.create(0.15*i),
            cc.MoveTo.create(0.15,cc.p(498,176)));
        //cc.log(1/this.nivel);
        var action2 = cc.Sequence.create(cc.DelayTime.create(0.15*i),
            cc.ScaleTo.create(0.15,1),
            cc.CallFunc.create(function(node) {
                node._parent.removeChild(node)
            },this));
        sharedJuegoScene.cartas[i].runAction(action);
        sharedJuegoScene.cartas[i].runAction(action2);
        if (i==(this.numCartas-1)) {
            sharedJuegoScene.cartas[i].runAction(nivel);
        }

    } 
}


juegoLayer.prototype.barajar = function() 
{

    this.cartas = new Array();
    this.movimiento = 0;
    this.primerNumCarta = NADA;
    this.primeraCarta = NADA;
    this.acertados=0;
    for (var i = 0; i < this.numCartas; i++) {

        this.cartas[i] = new cc.Node();
        var c = cc.ControlButton.create();

        //this.cartas[i] = cc.ControlButton.create(); //Sprite.create(s_cartaAtras);
        
        c.setPreferredSize(cc.size(85,128));
        c.setBackgroundSpriteForState(cc.Scale9Sprite.createWithSpriteFrameName("cartaAtras.png"),1);
        c.addTargetWithActionForControlEvents(this, this.onCarta, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        c._tag=i;
        c.carta=200;
        c.tocado=false;
        this.cartas[i].setAnchorPoint(cc.p(0.5, 0.5));
        this.cartas[i].setPosition(cc.p(498,176));
        this.cartas[i].addChild(c);        
        this.addChild(this.cartas[i],2);
    };
    if (this.nivel == DIFICIL) {
        var scalar = 0.7;
    } else {
        var scalar=1;
    }
    var despl = 25;
    for (var i = 0; i < this.numCartas; i++) {
        var indexX=i%(4 + (this.nivel-1)*2);
        var indexY=Math.floor(i/(4 + (this.nivel-1)*2));
        var x=93 + (1-this.nivel)*(despl+20)+indexX*100/(this.nivel*scalar);
        var y=104  + (1-this.nivel)*despl+indexY*140/(this.nivel*scalar);
        //console.log(indexX,indexY);
        var action = cc.Sequence.create(cc.DelayTime.create(0.15*i),
            cc.MoveTo.create(0.15,cc.p(x,y)));
        //cc.log(1/this.nivel);
        var action2 = cc.Sequence.create(cc.DelayTime.create(0.15*i),
            cc.ScaleTo.create(0.15,1/(this.nivel*scalar)));
        sharedJuegoScene.cartas[i].runAction(action);
        sharedJuegoScene.cartas[i].runAction(action2);
    }
    this.elegidas = new Array();
    for (var i = 0; i <this.numCartas/2; i++) {
        do {
            var a = Math.floor(Math.random()*14);
            var igual=false;
            for (var j=0; j<i*2; j++) {
                if (this.elegidas[j]==a) igual=true;
            };

        } while (igual)
        this.elegidas.push(a);
        this.elegidas.push(a);

    };
    //cc.log(this.elegidas);
    //this.elegidas=this.ele.sort(sortNumber);
    for (var i = 0; i<this.numCartas; i++) {
        var a = Math.floor(Math.random()*(this.elegidas.length));
        this.cartas[i]._children[0].carta=this.elegidas[a];
        this.elegidas.splice(a,1);
    }

}

juegoLayer.prototype.fase0 = function()
{
    cc.log("fase0");
    sharedJuegoScene.niveles();
    

    
}
juegoLayer.prototype.fase1 = function() {
    //this.nivel = FACIL;
    if (this.nivel == FACIL) {
        this.numCartas=8;
    } else {
        this.numCartas=18;
    };
    this.barajar();
}

juegoLayer.prototype.niveles = function() {

    sharedJuegoScene.fondo = cc.Layer.create();
    sharedJuegoScene.fondo.setAnchorPoint(cc.p(0.5, 0.5));
    sharedJuegoScene.fondo.setPosition(cc.p(570/2,350/2));


    var fondoNivel=cc.Sprite.create(s_fondoNivel);
    fondoNivel.setAnchorPoint(cc.p(0.5, 0.5));

    var jF = cc.Scale9Sprite.createWithSpriteFrameName(s_facilBtn);
    var facilB = cc.ControlButton.create();
    facilB.setPosition(cc.p(375/2,258*0.65));
    facilB.setPreferredSize(cc.size(117,42));
    facilB.setBackgroundSpriteForState(jF,1);
    facilB.addTargetWithActionForControlEvents(this, this.onClick, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    facilB._tag=1;
    facilB.setOpacity(0);
    fondoNivel.addChild(facilB,2);

    var jD = cc.Scale9Sprite.createWithSpriteFrameName(s_dificilBtn);
    var dificilB = cc.ControlButton.create();
    dificilB.setPosition(cc.p(375/2,258*0.35));
    dificilB.setPreferredSize(cc.size(117,42));
    dificilB.setBackgroundSpriteForState(jD,1);
    dificilB.addTargetWithActionForControlEvents(this, this.onClick, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    dificilB._tag=2;
    dificilB.setOpacity(0);
    fondoNivel.addChild(dificilB,2);

    sharedJuegoScene.fondo.addChild(fondoNivel,0);
    sharedJuegoScene.addChild(sharedJuegoScene.fondo,100);
    fondoNivel.runAction(cc.FadeIn.create(1.0));
    facilB.runAction(cc.FadeIn.create(1.0));
    dificilB.runAction(cc.FadeIn.create(1.0));
}

juegoLayer.prototype.onClick = function(e) {
    cc.log(e._tag);
    if (e._tag==1) {
        sharedJuegoScene.nivel=FACIL;
    } else {
        sharedJuegoScene.nivel=DIFICIL;
    }
    e._parent._children[0].runAction(cc.FadeOut.create(0.6));
    e._parent._children[1].runAction(cc.FadeOut.create(0.6));
    var action = cc.Sequence.create(cc.FadeOut.create(0.6),cc.CallFunc.create(function(node) {
                            sharedJuegoScene.fondo._parent.removeChild(sharedJuegoScene.fondo)
                            sharedJuegoScene.fase1();
                        }, this));
    e._parent.runAction(action);

}


var Juego = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new juegoLayer();
        this.addChild(layer);
        layer.init();
    }
});

function sortNumber(a,b)
{
    return a - b;
};
