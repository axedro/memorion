var instruccionesLayer = cc.Layer.extend({

    init:function () {
        cc.log('estoy en las instrucciones');



        var fondo = cc.LayerColor.create(cc.c4b(2, 204, 41, 255));
        fondo.setAnchorPoint(cc.p(0, 0));
        fondo.setPosition(cc.p(0,0));
        fondo.setContentSize(size);
        this.addChild(fondo,0);

        var cartasF = new Array();
        for (var i = 0; i < 8; i++) {
            var indexX=i%4;
            var indexY=Math.floor(i/4);
            var x=93+indexX*100;
            var y=104+indexY*140;
            cartasF[i] = cc.Sprite.createWithSpriteFrameName("cartaAtras.png");
            cartasF[i].setAnchorPoint(cc.p(0.5, 0.5));
            cartasF[i].setPosition(cc.p(x,y));
            this.addChild(cartasF[i]);

        };

        var taco = cc.Sprite.createWithSpriteFrameName("cartasTaco.png");
        taco.setAnchorPoint(cc.p(0, 0));
        taco.setPosition(cc.p(455,105));
        this.addChild(taco,0);

        var dialogoInicio = cc.Sprite.create("res/Images/fondoInstrucciones.png");
        dialogoInicio.setAnchorPoint(cc.p(0.5, 0.5));
        dialogoInicio.setPosition(cc.p(285,175));
        this.addChild(dialogoInicio,1);

        var jB = cc.Scale9Sprite.createWithSpriteFrameName('volverInstrucciones.png');
        this.jugar = cc.ControlButton.create();
        this.jugar.setPosition(cc.p(280,96));
        this.jugar.setPreferredSize(cc.size(116,42));
        this.jugar.setBackgroundSpriteForState(jB,1);
        this.jugar.addTargetWithActionForControlEvents(this, this.onClick, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.jugar._tag=1;
        this.addChild(this.jugar,2);


    },
    onClick:function(e){
        gAudioEngine.playEffect(e_Click);
        var j = new Inicio();
        cc.Director.getInstance().replaceScene(j);
    }

});


var Instrucciones = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new instruccionesLayer();
        this.addChild(layer);
        layer.init();
    }
});
