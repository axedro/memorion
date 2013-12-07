var sharedJuegoScene,sc;

var NADA = 10;


var juegoLayer = cc.Layer.extend({

    init:function () {

        sharedJuegoScene = this;
        var fondo = cc.LayerColor.create(cc.c4b(2, 204, 41, 255));
        fondo.setAnchorPoint(cc.p(0, 0));
        fondo.setPosition(cc.p(0,0));
        fondo.setContentSize(size);
        this.addChild(fondo,0);

        var taco = cc.Sprite.create(s_cartaTaco);
        taco.setAnchorPoint(cc.p(0, 0));
        taco.setPosition(cc.p(455,105));
        this.addChild(taco,1);

        this.cartas = new Array();
        for (var i = 0; i < 8; i++) {
            this.cartas[i] = cc.ControlButton.create(); //Sprite.create(s_cartaAtras);
            this.cartas[i].setAnchorPoint(cc.p(0.5, 0.5));
            this.cartas[i].setPosition(cc.p(498,176));
            this.cartas[i].setPreferredSize(cc.size(85,128));
            this.cartas[i].setBackgroundSpriteForState(cc.Scale9Sprite.create(s_cartaAtras),1);
            this.cartas[i].addTargetWithActionForControlEvents(this, this.onCarta, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            this.cartas[i]._tag=i;
            this.addChild(this.cartas[i],2);
        };

        this.fase0();

  
    }
});

juegoLayer.prototype.onCarta = function(e) {
    console.log("Click en carta " + e._tag);
};


juegoLayer.prototype.barajar = function() 
{
    for (var i = 0; i < 8; i++) {
        var indexX=i%4;
        var indexY=Math.floor(i/4);
        var x=93+indexX*100;
        var y=104+indexY*140;
        //console.log(indexX,indexY);

        var action = cc.Sequence.create(cc.DelayTime.create(0.15*i),
            cc.MoveTo.create(0.15,cc.p(x,y)));
        sharedJuegoScene.cartas[i].runAction(action);
        

    }
}

juegoLayer.prototype.fase0 = function()
{
    this.barajar();

    
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
