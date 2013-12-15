/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * loading interval
 * @type {Number}
 */
cc.LOADING_INTERVAL = 1 / 20;

/**
 * resource type
 * @constant
 * @type Object
 */
cc.RESOURCE_TYPE = {
    "IMAGE":["png", "jpg", "bmp"],
    "SOUND":["mp3", "ogg", "wav", "mp4", "m4a"],
    "XML":["plist", "xml", "fnt", "tmx", "tsx"],
    "BINARY":["ccbi"],
    "FONT":"FONT",
    "TEXT":["txt", "vsh", "fsh"],
    "UNKNOW":[]
};

/**
 * A class to pre-load resources before engine start game main loop.
 * @class
 * @extends cc.Scene
 */

cc.Loader = cc.Scene.extend(/** @lends cc.Loader# */{
    _logo:null,
    _logoTexture:null,
    _curNumber:0,
    _totalNumber:0,
    _loadedNumber:0,
    _resouces:null,
    _bgLayer:null,
    _label:null,
    _selector:null,
    _target:null,
    _isReplaceScene:false,
    _isAsync:false,
    _texture2d:null,


    /**
     * Constructor
     */
    ctor:function () {
        this._super();
        this._resouces = [];
        //this._logoTexture = cc.Loader._logoImage;
        this._logoTexture = new Image();
        var _this = this;
        this._logoTexture.addEventListener("load", function () {
            if(cc.renderContextType === cc.WEBGL)
                _this._addLogoToScene();
        });
        this._logoTexture.src = "res/Images/fondo.png";
        this._logoTexture.width = 570;
        this._logoTexture.height = 350;
    },

    /**
     * @param {Boolean} Var
     */
    setReplaceScene:function (Var) {
        this._isReplaceScene = Var;
    },

    /**
     * @param {Boolean} Var
     */
    setAsync:function (Var) {
        this._isAsync = Var;
    },

    _addLogoToScene:function(){
        this._texture2d = new cc.Texture2D();
        this._texture2d.initWithElement(this._logoTexture);
        this._texture2d.handleLoadedTexture();
        this._logo = cc.Sprite.createWithTexture(this._texture2d);
        var winSize = cc.Director.getInstance().getWinSize();
        this._logo.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        this._bgLayer.addChild(this._logo, 10);
        var logoAction = cc.Spawn.create(
            //cc.EaseBounce.create(cc.MoveBy.create(0.25, cc.p(0, 10))),
            cc.FadeIn.create(0.5));
        this._logo.runAction(logoAction);
        this._label.setPosition(cc.pAdd(this._logo.getPosition(), cc.p(0,0)));
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} selector
     * @param {Object} target
     */
    initWithResources:function (resources, selector, target) {
        cc.Assert(resources != null, "resources should not null");

        this.init();

        if (!this._isAsync) {
            // bg
            this._bgLayer = cc.LayerColor.create(cc.c4(255, 255, 255, 255));
            this._bgLayer.setPosition(cc.p(0, 0));
            this.addChild(this._bgLayer, 0);

            //logo
            var winSize = cc.Director.getInstance().getWinSize();
            var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
            var logoHeight = 200;

            if(cc.renderContextType === cc.CANVAS){
                this._logo = cc.Sprite.createWithTexture(this._logoTexture);
                this._logo.setPosition(centerPos);
                this._bgLayer.addChild(this._logo, 10);
            }else {
                if(this._texture2d){
                    this._logo = cc.Sprite.createWithTexture(this._texture2d);
                    this._logo.setPosition(centerPos);
                    this._bgLayer.addChild(this._logo, 10);
                    logoHeight = this._logo.getContentSize().height;
                }
            }

            //loading percent
            this._label = cc.LabelTTF.create("Loading... 0%", "Arial", 24);
            this._label.setColor(cc.c3(0, 0, 0));
            this._label.setOpacity(0);
            this._label.setPosition(cc.pAdd(centerPos, cc.p(0, 0)));
            this._bgLayer.addChild(this._label, 11);
        }

        if (selector) {
            this._selector = selector;
            this._target = target;
        }

        if ((resources != this._resouces) || (this._curNumber == 0)) {
            this._curNumber = 0;
            this._loadedNumber = 0;
            if (resources[0] instanceof Array) {
                for (var i = 0; i < resources.length; i++) {
                    var each = resources[i];
                    this._resouces = this._resouces.concat(each);
                }
            } else
                this._resouces = resources;
            this._totalNumber = this._resouces.length;
        }

        //load resources
        this.schedule(this._preload);
    },

    /**
     * Callback when a resource file load failed.
     * @example
     * //example
     * cc.Loader.getInstance().onResLoaded();
     */
    onResLoadingErr:function (name) {
        cc.log("cocos2d:Failed loading resource: " + name);
    },

    /**
     * Callback when a resource file loaded.
     * @example
     * //example
     * cc.Loader.getInstance().onResLoaded();
     */
    onResLoaded:function () {
        this._loadedNumber++;
    },

    /**
     * Get loading percentage
     * @return {Number}
     * @example
     * //example
     * cc.log(cc.Loader.getInstance().getProgressBar() + "%");
     */
    getProgressBar:function () {
        var per = this._loadedNumber / this._totalNumber;
        per = (0 | (per * 100));
        return per;
    },

    onEnter:function () {
        this._super();
        this._logoFadeIn();
    },

    _preload:function (dt) {
        this._updatePercent();
        if (dt >= cc.LOADING_INTERVAL) {
            cc.log("cocos2d: interval more than 50ms, skip frame.");
            return;
        }

        if (this._curNumber < this._totalNumber) {
            this._loadOneResource();
            this._curNumber++;
            //cc.log("cocos2d: interval less than 50ms, continue loading, idx = " + this._curNumber + ", total = " + this._totalNumber);
        }
    },

    _loadOneResource:function () {
        var sharedTextureCache = cc.TextureCache.getInstance();
        var sharedEngine = cc.AudioEngine.getInstance();
        var sharedParser = cc.SAXParser.getInstance();
        var sharedFileUtils = cc.FileUtils.getInstance();

        var resInfo = this._resouces[this._curNumber];
        var type = this._getResType(resInfo);
        switch (type) {
            case "IMAGE":
                sharedTextureCache.addImage(resInfo.src);
                break;
            case "SOUND":
                sharedEngine.preloadSound(resInfo.src);
                break;
            case "XML":
                sharedParser.preloadPlist(resInfo.src);
                break;
            case "BINARY":
                sharedFileUtils.preloadBinaryFileData(resInfo.src);
                break;
            case "TEXT" :
                sharedFileUtils.preloadTextFileData(resInfo.src);
                break;
            case "FONT":
                this._registerFaceFont(resInfo);
                break;
            default:
                throw "cocos2d:unknown filename extension: " + type;
                break;
        }
    },


    /**
     * release resources from a list
     * @param resources
     */
    releaseResources:function (resources) {
        if (resources && resources.length > 0) {
            var sharedTextureCache = cc.TextureCache.getInstance();
            var sharedEngine = cc.AudioEngine.getInstance();
            var sharedParser = cc.SAXParser.getInstance();
            var sharedFileUtils = cc.FileUtils.getInstance();

            var resInfo;
            for (var i = 0; i < resources.length; i++) {
                resInfo = resources[i];
                var type = this._getResType(resInfo);
                switch (type) {
                    case "IMAGE":
                        sharedTextureCache.removeTextureForKey(resInfo.src);
                        break;
                    case "SOUND":
                        sharedEngine.unloadEffect(resInfo.src);
                        break;
                    case "XML":
                        sharedParser.unloadPlist(resInfo.src);
                        break;
                    case "BINARY":
                        sharedFileUtils.unloadBinaryFileData(resInfo.src);
                        break;
                    case "TEXT":
                        sharedFileUtils.unloadTextFileData(resInfo.src);
                        break;
                    case "FONT":
                        this._unregisterFaceFont(resInfo);
                        break;
                    default:
                        throw "cocos2d:unknown filename extension: " + type;
                        break;
                }
            }
        }
    },

    _logoFadeIn:function () {
        if (!this._isAsync) {
            var logoAction = cc.Spawn.create(
                //cc.EaseBounce.create(cc.MoveBy.create(0.25, cc.p(0, 10))),
                cc.FadeIn.create(0.5));

            var labelAction = cc.Sequence.create(
                cc.DelayTime.create(0.15),
                logoAction.copy());
            if(this._logo)
                this._logo.runAction(logoAction);
            this._label.runAction(labelAction);
        }
    },

    _getResType:function (resInfo) {
        var isFont = resInfo.fontName;
        if (isFont != null) {
            return cc.RESOURCE_TYPE.FONT;
        } else {
            var src = resInfo.src;
            var ext = src.substring(src.lastIndexOf(".") + 1, src.length);
            for (var resType in cc.RESOURCE_TYPE) {
                if (cc.RESOURCE_TYPE[resType].indexOf(ext) != -1) {
                    return resType;
                }
            }
            return ext;
        }
    },

    _updatePercent:function () {
        var percent = 0;
        if (this._totalNumber == 0) {
            percent = 100;
        } else {
            percent = (0 | (this._loadedNumber * 100 / this._totalNumber));
        }

        //show percent
        if (!this._isAsync) {
            var tmpStr = "Loading... " + percent + "%";
            this._label.setString(tmpStr);
        }

        if (percent >= 100) {
            this.unschedule(this._preload);
            this.schedule(this._complete, 0.3);
        }
    },

    _complete:function (dt) {
        this.unschedule(this._complete);

        if (this._isReplaceScene) {
            this.removeFromParent(true);
        }

        if (this._target && (typeof(this._selector) == "string")) {
            this._target[this._selector](this);
        } else if (this._target && (typeof(this._selector) == "function")) {
            this._selector.call(this._target, this);
        } else {
            this._selector(this);
        }

        if (this._isAsync) {
            this.onExit();
        }

        this._curNumber = 0;
        this._loadedNumber = 0;
    },

    _registerFaceFont:function (fontRes) {
        var srcArr = fontRes.src;
        if (srcArr && srcArr.length > 0) {
            var fontStyle = document.createElement("style");
            fontStyle.type = "text/css";
            document.body.appendChild(fontStyle);

            var fontStr = "@font-face { font-family:" + fontRes.fontName + "; src:";
            for (var i = 0; i < srcArr.length; i++) {
                fontStr += "url('" + encodeURI(srcArr[i].src) + "') format('" + srcArr[i].type + "')";
                fontStr += (i == (srcArr.length - 1)) ? ";" : ",";
            }
            fontStyle.textContent += fontStr + "};";

            //preload
            //<div style="font-family: PressStart;">.</div>
            var preloadDiv = document.createElement("div");
            preloadDiv.style.fontFamily = fontRes.fontName;
            preloadDiv.innerHTML = ".";
            preloadDiv.style.position = "absolute";
            preloadDiv.style.left = "-100px";
            preloadDiv.style.top = "-100px";
            document.body.appendChild(preloadDiv);
        }
        cc.Loader.getInstance().onResLoaded();
    },

    _unregisterFaceFont:function (fontRes) {
        //todo remove style
    }
});

/**
 * Preload multi scene resources.
 * @param {Array} resources
 * @param {Function|String} selector
 * @param {Object} target
 * @param {cc.Node|Null} parent
 * @return {cc.Loader}
 * @example
 * //example
 * var g_mainmenu = [
 *    {src:"res/hello.png"},
 *    {src:"res/hello.plist"},
 *
 *    {src:"res/logo.png"},
 *    {src:"res/btn.png"},
 *
 *    {src:"res/boom.mp3"},
 * ]
 *
 * var g_level = [
 *    {src:"res/level01.png"},
 *    {src:"res/level02.png"},
 *    {src:"res/level03.png"}
 * ]
 *
 * //load a list of resources
 * cc.Loader.preload(g_mainmenu, this.startGame, this);
 *
 * //load multi lists of resources
 * cc.Loader.preload([g_mainmenu,g_level], this.startGame, this);
 *
 * //load resources without replacing scene
 * cc.Loader.preload([g_mainmenu,g_level], this.startGame, this, this._parentNode);
 */
cc.Loader.preload = function (resources, selector, target, parent) {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }

    this._instance.setReplaceScene(parent != null);
    this._instance.setAsync(false);
    this._instance.initWithResources(resources, selector, target);

    if (parent) {
        parent.addChild(this._instance, 99999999);
    } else {
        var director = cc.Director.getInstance();
        if (director.getRunningScene()) {
            director.replaceScene(this._instance);
        } else {
            director.runWithScene(this._instance);
        }
    }
    return this._instance;
};

/**
 * Loading the resources asynchronously
 * @param {Array} resources
 * @param {Function|String} selector
 * @param {Object} target
 * @return {cc.Loader}
 */
cc.Loader.preloadAsync = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    this._instance.setAsync(true);
    this._instance.initWithResources(resources, selector, target);
    this._instance.onEnter();
    return this._instance;
};

/**
 * Release the resources from a list
 * @param {Array} resources
 */
cc.Loader.purgeCachedData = function (resources) {
    if (this._instance) {
        this._instance.releaseResources(resources);
    }
};

/**
 * Returns a shared instance of the loader
 * @function
 * @return {cc.Loader}
 */
cc.Loader.getInstance = function () {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    return this._instance;
};

cc.Loader._instance = null;

