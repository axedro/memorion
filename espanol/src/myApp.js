var gAudioEngine, size;


var Inicio_Layer = cc.Layer.extend({

    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        //click.play();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        size = cc.Director.getInstance().getWinSize();
        gAudioEngine = cc.AudioEngine.getInstance();

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
            cartasF[i] = cc.Sprite.create(s_cartaAtras);
            cartasF[i].setAnchorPoint(cc.p(0.5, 0.5));
            cartasF[i].setPosition(cc.p(x,y));
            this.addChild(cartasF[i]);

        };

        var taco = cc.Sprite.create(s_cartaTaco);
        taco.setAnchorPoint(cc.p(0, 0));
        taco.setPosition(cc.p(455,105));
        this.addChild(taco,0);

        var dialogoInicio = cc.Sprite.create("res/Images/dialogoInicio.png");
        dialogoInicio.setAnchorPoint(cc.p(0.5, 0.5));
        dialogoInicio.setPosition(cc.p(285,175));
        this.addChild(dialogoInicio,1);

        var jB = cc.Scale9Sprite.create(s_jugarBtn);
        this.jugar = cc.ControlButton.create();
        this.jugar.setPosition(cc.p(285,158));
        this.jugar.setPreferredSize(cc.size(117,42));
        this.jugar.setBackgroundSpriteForState(jB,1);
        this.jugar.addTargetWithActionForControlEvents(this, this.onClick, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.jugar._tag=1;
        this.addChild(this.jugar,2);

        var iB = cc.Scale9Sprite.create(s_instBtn);
        this.inst = cc.ControlButton.create();
        this.inst.setPosition(cc.p(285,95));
        this.inst.setPreferredSize(cc.size(209,42));
        this.inst.setBackgroundSpriteForState(iB,1);
        this.inst.addTargetWithActionForControlEvents(this, this.onClick, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.inst._tag=2;
        this.addChild(this.inst,2);
    },
    onClick:function(e){
        gAudioEngine.playEffect(e_Click);
        if (e._tag==1) {
            var j = new Juego();
            cc.Director.getInstance().replaceScene(j);
        } else {
            var j = new Instrucciones();
            cc.Director.getInstance().replaceScene(j);
        }

    }
});

var Inicio = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Inicio_Layer();
        this.addChild(layer);
        layer.init();
    }
});
