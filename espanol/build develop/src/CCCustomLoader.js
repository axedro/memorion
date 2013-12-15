CustomLoader = cc.LoaderScene.extend({

    init:function(){
        cc.Scene.prototype.init.call(this);

        //logo
        var logoWidth = 570;
        var logoHeight = 350;
        var centerPos = cc.p(this._winSize.width / 2, this._winSize.height / 2);

        this._logoTexture = new Image();
        var _this = this;
        this._logoTexture.addEventListener("load", function () {
            _this._initStage(centerPos);
            this.removeEventListener('load', arguments.callee, false);
        });
        this._logoTexture.src = "res/Images/fondo.png";
        this._logoTexture.width = logoWidth;
        this._logoTexture.height = logoHeight;

        // bg
        this._bgLayer = cc.LayerColor.create(cc.c4(32, 32, 32, 255));
        this._bgLayer.setPosition(0, 0);
        this.addChild(this._bgLayer, 0);

        //loading percent
        this._label = cc.LabelTTF.create("Loading... 0%", "Arial", 34);
        this._label.setColor(cc.c3(0, 0, 0));
        this._label.setOpacity(0);
        this._label.setPosition(cc.pAdd(centerPos, cc.p(0, 0)));
        this._bgLayer.addChild(this._label, 11);
    },

    _logoFadeIn: function () {
        var logoAction = cc.Spawn.create(
            //cc.EaseBounce.create(cc.MoveBy.create(0.25, cc.p(0, 10))),
            cc.FadeIn.create(0.5));

        var labelAction = cc.Sequence.create(
            cc.DelayTime.create(0.15),
            logoAction.clone());

        this._logo.runAction(logoAction);
        this._label.runAction(labelAction);
    }



})

CustomLoader.preload = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new CustomLoader();
        this._instance.init();
    }

    this._instance.initWithResources(resources, selector, target);

    var director = cc.Director.getInstance();
    if (director.getRunningScene()) {
        director.replaceScene(this._instance);
    } else {
        director.runWithScene(this._instance);
    }

    return this._instance;
};