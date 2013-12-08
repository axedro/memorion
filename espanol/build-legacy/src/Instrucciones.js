var instruccionesLayer = cc.Layer.extend({

    init:function () {
        cc.log('estoy en las instrucciones');



        this.fondo = cc.Sprite.create("res/Images/fondoInicio.png");
        this.fondo.setAnchorPoint(cc.p(0.5, 0.5));
        this.fondo.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(this.fondo, 0);

        this.instr = cc.Sprite.create("res/Images/fondoInstrucciones.png");
        this.instr.setAnchorPoint(cc.p(0.5, 0.5));
        this.instr.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(this.instr, 0);

        var jB = cc.Scale9Sprite.createWithSpriteFrameName('volverInstBtn.png');
        this.jugar = cc.ControlButton.create();
        this.jugar.setPosition(cc.p(309,96));
        this.jugar.setPreferredSize(cc.size(100,42));
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
