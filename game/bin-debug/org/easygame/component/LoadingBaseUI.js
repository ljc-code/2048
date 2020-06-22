var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Copyright (c) 2014,www.easygame.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the easygame.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EASYEGRET.COM AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var easy;
(function (easy) {
    var LoadingBaseUI = (function (_super) {
        __extends(LoadingBaseUI, _super);
        function LoadingBaseUI(drawDelay) {
            if (drawDelay === void 0) { drawDelay = false; }
            var _this = _super.call(this, drawDelay) || this;
            /**
             * 对应的ui展现
             */
            _this._ui = null;
            /**
             * ui资源已准备好
             * @type {boolean}
             * @private
             */
            _this._uiResReady = false;
            //下载的资源是否完成
            _this._viewResDowloaded = false;
            _this.showLoading = true;
            /**********************  win view下载 设置***********************/
            _this._resUIFileArr = null; //
            _this._resUIGroup = null;
            _this._progressCalculate = null;
            return _this;
        }
        LoadingBaseUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.showBg = false;
        };
        /**
         * 初始化一些必要的逻辑数据
         * 这个方法是在第一次加入stage的时候,做调用
         */
        LoadingBaseUI.prototype.initData = function () {
            this.validateNow();
        };
        /**
         * 进度的展示
         * @param current
         * @param total
         */
        LoadingBaseUI.prototype.setProgress = function (current, total) {
            //this.textField.text = "加载中..." + current + "/" + total;
        };
        /**
         * 根据waitview的ui数据,进行下载控制
         * silent:静默下载,不显示loading图标
         */
        LoadingBaseUI.prototype.enter = function () {
            if (!this.parent) {
                if (easy.ViewManager.mainContainer) {
                    easy.ViewManager.mainContainer.addChild(this);
                }
                else {
                    easy.GlobalSetting.STAGE.addChild(this);
                }
            }
            this.visible = this.showLoading;
            this.enterTransition();
            this._viewResDowloaded = false;
            if (this._resUIFileArr)
                this._resUIFileArr.length = 0;
            if (this._resUIGroup)
                this._resUIGroup.length = 0;
            //居中显示
            if (this.parent) {
                this.x = easy.GlobalSetting.DISPLAY_WIDTH / 2 - this.cx;
                this.y = easy.GlobalSetting.DISPLAY_HEIGHT / 2 - this.cy;
            }
            //开始下载资源
            if (this._data) {
                //Debug.log = "LoadingBaseUI enter data=" + egret.getQualifiedClassName(this._data) + ", showLoading=" + this.showLoading;
                this.fireUIDownloading();
            }
            else {
            }
        };
        /**
         * enter的过渡效果
         */
        LoadingBaseUI.prototype.enterTransition = function () {
            this.alpha = 0;
            egret.Tween.get(this).to({ alpha: 1 }, 500).call(this.enterTransitionComplete, this);
        };
        /**
         * enter的过渡效果结束
         */
        LoadingBaseUI.prototype.enterTransitionComplete = function () {
        };
        /**
         * 完成下载,回调加载view
         */
        LoadingBaseUI.prototype.outer = function () {
            //console.log("@@LoadingBaseUI outer!")
            this.outerTransition();
        };
        /**
         * outer的过渡效果
         */
        LoadingBaseUI.prototype.outerTransition = function () {
            egret.Tween.get(this).to({ alpha: 0.5 }, 300).call(this.outerTransitionComplete, this).to({ alpha: 0 }, 200);
        };
        /**
         * outer的过渡效果结束
         */
        LoadingBaseUI.prototype.outerTransitionComplete = function () {
            if (this._data) {
                //Debug.log = "LoadingBaseUI hasCode=" + this.hashCode + ", outerTransitionComplete data=" + egret.getQualifiedClassName(this._data);
                if (this._data instanceof easy.View) {
                    easy.ViewManager.waitViewDoEnter();
                }
                else if (this._data instanceof easy.Win) {
                    easy.PopupManager.waitWinDoEnter();
                }
            }
            this._data = null;
            this.removeFromParent();
        };
        /**
         * 获取ui层的显示对象
         * @returns {egret.Sprite}
         */
        LoadingBaseUI.prototype.getUI = function () {
            return this._ui;
        };
        /**
         * 设置ui层的显示对象
         * @param myui
         */
        LoadingBaseUI.prototype.setUI = function (myui) {
            this._ui = myui;
            //console.log("!!!view set ui!! 000 this._ui=" + egret.getQualifiedClassName(this._ui));
            if (this._ui) {
                this.addChild(this._ui);
                this.setSize(this._ui.width, this._ui.height);
            }
            this.showBg = false;
        };
        /**
         * 首次材质下载完成会调用加载一次,刷新UI皮肤显示
         * 使用了框架的UI机制,单ui的资源下载完成会调用改方法刷新
         * 若view中有逻辑使用到ui的素材,应该在这里做素材的赋值
         */
        LoadingBaseUI.prototype.validateNow = function () {
            this.drawDelay = false;
            //console.log("clz=" + egret.getQualifiedClassName(this)  + ", validateNow!!")
            if (this._ui && this._ui["validateNow"])
                this._ui["validateNow"]();
            if (this._ui)
                this._ui.drawDelay = false;
            this.resetPosition();
            for (var i = 0; i < this.numChildren; i++) {
                if (this.getChildAt(i) instanceof easy.BaseGroup)
                    (this.getChildAt(i)).resetPosition();
            }
        };
        /**
         * 开始下载ui资源
         */
        LoadingBaseUI.prototype.fireUIDownloading = function () {
            //easy.Debug.log = "@UI fireUIDownloading 000 current.ui=" + egret.getQualifiedClassName(this._data._ui);
            if (this._data && this._data._ui && this._data._ui.hasOwnProperty("resSpriteSheet") && this._data._ui.hasOwnProperty("resFiles")) {
                //easy.Debug.log = "@UI fireUIDownloading 111 current.ui=" + egret.getQualifiedClassName(this._data._ui);
                //loader文件,个数下载
                this._resUIFileArr = [].concat(this._data._ui["resFiles"]);
                if (this._resUIFileArr && this._resUIFileArr.length > 0) {
                    //easy.Debug.log = "@UI fireUIDownloading 2222";
                    if (this._data._ui.hasOwnProperty("resGroup")) {
                        //easy.Debug.log = "@UI fireUIDownloading 333";
                        this._resUIGroup = [].concat(this._data._ui["resGroup"]);
                        var allLoaded = true;
                        for (var i = 0; i < this._resUIGroup.length; i++) {
                            if (!RES.isGroupLoaded(this._resUIGroup[i])) {
                                allLoaded = false;
                                //easy.Debug.log = "@UI fireUIDownloading 444";
                                break;
                            }
                        }
                        if (allLoaded) {
                            //easy.Debug.log = "@UI fireUIDownloading 555";
                            this._viewResDowloaded = true;
                            if (this._progressCalculate)
                                this._progressCalculate.reset();
                            easy.HeartBeat.addListener(this, this.onHbProgress, 2);
                            //easy.Debug.log = "_viewResDowloaded=" + this._viewResDowloaded;
                            return;
                        }
                    }
                    //初始化Resource资源加载库
                    //easy.Debug.log = "@UI fireUIDownloading loadConfig=" + this._resUIFileArr;
                    easy.ResManager.loadGroups(this._resUIGroup, this.onUIResourceLoadComplete, this, true);
                    for (var i = 0; i < this._resUIFileArr.length; i++) {
                        easy.ResManager.loadConfig(easy.GlobalSetting.CDN_RES + "assets/ui/" + this._resUIFileArr[i]);
                    }
                    //进度条模拟数据启动
                    if (this._progressCalculate)
                        this._progressCalculate.reset();
                    easy.HeartBeat.addListener(this, this.onHbProgress, 2);
                    //easy.Debug.log = "@UI fireUIDownloading 6666";
                    return false;
                }
            }
            else {
                this._viewResDowloaded = true;
                if (this._progressCalculate)
                    this._progressCalculate.reset();
                easy.HeartBeat.addListener(this, this.onHbProgress, 2);
            }
            //easy.Debug.log = "@UI.no ui file loading!!";
            return true;
        };
        /**
         * 资源组加载完成
         */
        LoadingBaseUI.prototype.onUIResourceLoadComplete = function (event) {
            //easy.Debug.log = "@UI.res.group.down 111";
            var allLoaded = true;
            for (var i = 0; i < this._resUIGroup.length; i++) {
                if (!RES.isGroupLoaded(this._resUIGroup[i])) {
                    allLoaded = false;
                    //easy.Debug.log = "@UI.res.group.down 222="+this._resUIGroup[i];
                    break;
                }
            }
            if (allLoaded) {
                this._resUIGroup.length = 0;
                this._resUIFileArr.length = 0;
                //try{
                //    if (this._data && this._data.hasOwnProperty("_uiResReady")) this._data["_uiResReady"] = true;
                //} catch (e){
                //}
                //全部下载完成
                this._viewResDowloaded = true;
            }
        };
        LoadingBaseUI.prototype.onHbProgress = function () {
            if (this._progressCalculate == null)
                this._progressCalculate = new easy.ProgressCalculate();
            if (this._viewResDowloaded)
                this._progressCalculate._progressSpeedUp = this._viewResDowloaded;
            var progress = this._progressCalculate.progress();
            //easy.Debug.log = "progress=" + progress + ", hasCode=" + this.hashCode + ", this._viewResDowloaded=" + this._viewResDowloaded + ", data=" + egret.getQualifiedClassName(this._data);
            this.setProgress(progress, 100);
            if (progress >= 100) {
                if (this._data && this._data["validateNow"])
                    this._data["validateNow"]();
                easy.HeartBeat.removeListener(this, this.onHbProgress);
                this.outer();
            }
        };
        return LoadingBaseUI;
    }(easy.Group));
    easy.LoadingBaseUI = LoadingBaseUI;
    __reflect(LoadingBaseUI.prototype, "easy.LoadingBaseUI");
})(easy || (easy = {}));
