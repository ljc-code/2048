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
    /**
     * view和win的基本类
     * 定义了接收协议packet和event的能力,方便在已经展示的时候,通过packet和event的事件进行驱动刷新显示
     */
    var ReceiveGroup = (function (_super) {
        __extends(ReceiveGroup, _super);
        function ReceiveGroup() {
            var _this = _super.call(this, true) || this;
            /**
             * 消息和方法的映射关系表
             */
            _this.METHOD_DEF = {};
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
            _this._isValidateNow = false;
            _this.showLoading = true;
            /**
             * 强制刷新
             * @type {boolean}
             * @private
             */
            _this._forceValidateNow = false;
            /**
             * loding的class对象
             * view是LoadingViewUI类
             * win是LoadingWinUI类
             * 这两个值分别在view和win子类中默认赋值
             */
            _this._loadingUIClz = null;
            _this._currentLoading = null;
            _this.enterCompleted = false; //进入状态是否完成
            /**
             * 进入的效果
             */
            _this._enterEffect = null;
            /**********************  闲时下载 设置***********************/
            //闲时下载的数量记录
            _this._idleLoadedGroupCount = 0;
            //已经进行闲时下载
            _this._isIdleDownload = false;
            _this.initWeekListener();
            return _this;
        }
        /**
         * 第一次加入场景的时候会运行该方法
         */
        ReceiveGroup.prototype.onFirstAddToStage = function (event) {
            _super.prototype.onFirstAddToStage.call(this, event);
            this.drawDelay = true;
        };
        /**
         * 初始化弱监听方法,以便分发协议数据包用
         * 不在监听列表的数据包,将被自动过滤掉
         */
        ReceiveGroup.prototype.initWeekListener = function () {
        };
        /**
         * 添加事件的处理
         * 注意:必须调用MessageControler.addEvent()注册事件名称,否者不会转发到这里
         * 如果没有对应的的类型在此出现,则改Handle对Event事件到此为止,不再派发,防止造成事件死循环
         * @param type MyEvent事件的类型
         * @param func  对应的call back function,不包含onEvent前缀
         */
        ReceiveGroup.prototype.addHandleEvent = function (eventType, funcName) {
            //console.log("ReceiveGroup this=" + egret.getQualifiedClassName(this) + ", addHandleEvent=" + type + ", funcName=" + funcName);
            easy.MessageControler.addEvent(eventType);
            this.METHOD_DEF[eventType] = funcName;
        };
        /**
         * 添加协议处理的Handle,注意,functName的名称,前缀onPacket不包含
         * @param msgId packet协议号
         * @param func  对应的call back function,不包含onPacket前缀
         */
        ReceiveGroup.prototype.addHandlePacket = function (msgId, funcName) {
            this.METHOD_DEF["" + msgId] = funcName;
        };
        /**
         * 收到弱协议通知
         * @param packet
         */
        ReceiveGroup.prototype.receivePacket = function (packet) {
            if (this._ui) {
                //检测模板的receivePacket
                for (var prop in this._ui) {
                    if (prop.indexOf("$") == 0 || prop == "__class__" || prop == "hashCode" || prop == "__types__" || prop == "__proto__" || this._ui[prop] instanceof Function)
                        continue;
                    if (this._ui[prop] instanceof easy.Template && this._ui[prop] != this && this._ui[prop].parent) {
                        this._ui[prop].receivePacket(packet);
                    }
                }
            }
            if (this.METHOD_DEF["" + packet.header.messageId] && this[this.METHOD_DEF[packet.header.messageId]])
                this[this.METHOD_DEF["" + packet.header.messageId]].call(this, packet);
        };
        /**
         * 收到界面弱事件通知
         * @param event
         */
        ReceiveGroup.prototype.receiveEvent = function (event) {
            //console.log("ReceiveGroup this=" + egret.getQualifiedClassName(this) + ", receiveEvent=" + event.type + ", isHas=" + this.METHOD_DEF[event.type]);
            if (this._ui) {
                //检测模板的receiveEvent
                for (var prop in this._ui) {
                    if (prop.indexOf("$") == 0 || prop == "__class__" || prop == "hashCode" || prop == "__types__" || prop == "__proto__" || this._ui[prop] instanceof Function)
                        continue;
                    if ((this._ui[prop] instanceof easy.Template || this._ui[prop] instanceof easy.List || this._ui[prop] instanceof easy.ListAd) && this._ui[prop] != this && this._ui[prop].parent) {
                        this._ui[prop].receiveEvent(event);
                    }
                }
            }
            if (this.METHOD_DEF[event.type] && this[this.METHOD_DEF[event.type]])
                this[this.METHOD_DEF[event.type]].call(this, event);
        };
        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        ReceiveGroup.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.drawDelay = true;
            this.touchEnabled = true; //默认不接受事件
            this.showBg = false;
            this.addHandleEvent(easy.EventType.RESOURCE_DOWNLOADED, "onMyEventResDownloaded");
            if (this._uiResReady && !this._isValidateNow)
                this.validateNow();
        };
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        ReceiveGroup.prototype.enter = function () {
            if (this._currentLoading) {
            }
            if (this._uiResReady && !this._isValidateNow)
                this.validateNow();
            //console.log("@@enter=" + egret.getQualifiedClassName(this))
            if (this._ui) {
                if (this._ui["enter"])
                    this._ui["enter"]();
                //检测模板的enter
                for (var prop in this._ui) {
                    if (this._ui[prop] instanceof easy.Template && this._ui[prop] != this && this._ui[prop].parent) {
                        this._ui[prop].enter();
                    }
                }
            }
            this.enterTransition();
        };
        /**
         * enter的过渡效果
         */
        ReceiveGroup.prototype.enterTransition = function () {
            //console.log("@@enterTransition=" + egret.getQualifiedClassName(this))
            this.enterCompleted = false;
            if (this._enterEffect) {
                this._enterEffect.play();
            }
            else {
                this.enterTransitionComplete();
            }
        };
        /**
         * enter的过渡效果结束
         */
        ReceiveGroup.prototype.enterTransitionComplete = function () {
            //console.log("@@enterTransitionComplete=" + egret.getQualifiedClassName(this))
        };
        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        ReceiveGroup.prototype.outer = function () {
            //console.log("@@outer=" + egret.getQualifiedClassName(this))
            if (this._ui) {
                if (this._ui["outer"])
                    this._ui["outer"]();
                //检测模板的enter
                for (var prop in this._ui) {
                    if (this._ui[prop] instanceof easy.Template && this._ui[prop] != this) {
                        this._ui[prop].outer();
                    }
                }
            }
            this.outerTransition();
        };
        /**
         * outer的过渡效果
         */
        ReceiveGroup.prototype.outerTransition = function () {
            //console.log("@@outerTransition=" + egret.getQualifiedClassName(this))
            this.outerTransitionComplete();
        };
        /**
         * outer的过渡效果结束
         */
        ReceiveGroup.prototype.outerTransitionComplete = function () {
            //console.log("@@outerTransitionComplete=" + egret.getQualifiedClassName(this))
            this.removeFromParent();
        };
        /**
         * 获取ui层的显示对象
         * @returns {egret.Sprite}
         */
        ReceiveGroup.prototype.getUI = function () {
            return this._ui;
        };
        /**
         * 设置ui层的显示对象
         * @param myui
         */
        ReceiveGroup.prototype.setUI = function (myui) {
            this._ui = myui;
            //console.log("!!!view set ui!! 000 this._ui=" + egret.getQualifiedClassName(this._ui));
            if (this._ui) {
                this.addChild(this._ui);
                this.setSize(this._ui.width, this._ui.height);
            }
            this.showBg = false;
        };
        /**
         * 做ui的销毁
         * 一般情况下,需要手动调用销毁
         */
        ReceiveGroup.prototype.destroy = function () {
            if (this._ui) {
                //if (this._ui.hasOwnProperty("destroy"))this._ui.destroy();
                this._ui = null;
            }
        };
        /**
         * 检测资源是否完成
         * @returns {boolean}
         */
        ReceiveGroup.prototype.checkResReady = function () {
            //检测ui的情况,自动启动loading加载
            //console.log("checkResReady 000 this._ui=" + this._ui + ", resSpriteSheet=" + this._ui.hasOwnProperty("resSpriteSheet") + ", resFiles=" + this._ui.hasOwnProperty("resFiles"))
            //console.log("checkResReady 000 this._ui=" + this._ui)
            if (!this._uiResReady && this._ui && this._ui["resFiles"]) {
                //console.log("checkResReady 1111")
                //easy.Debug.log ="checkResReady 1111";
                if (this._ui["resSpriteSheet"] == "" && this._ui["resFiles"].length == 0) {
                    //easy.Debug.log ="checkResReady 2222";
                    this.validateNow();
                    return true;
                }
                else {
                    if (this._loadingUIClz) {
                        //console.log("checkResReady 2222")
                        //easy.Debug.log ="checkResReady 3333";
                        this._currentLoading = easy.ObjectPool.getByClass(this._loadingUIClz, "loading");
                        this._currentLoading._data = this;
                        this._currentLoading.showLoading = this.showLoading;
                        //启动加载
                        this._currentLoading.enter();
                    }
                    else {
                        //easy.Debug.log ="checkResReady 66666";
                        return true;
                    }
                }
                //easy.Debug.log ="checkResReady 4444";
                //console.log("checkResReady 4444")
                return false;
            }
            else {
                //easy.Debug.log ="checkResReady 5555";
                if (this._forceValidateNow)
                    this.validateNow();
            }
            return true;
        };
        /**
         * 首次材质下载完成会调用加载一次,刷新UI皮肤显示
         * 使用了框架的UI机制,单ui的资源下载完成会调用改方法刷新
         * 若view中有逻辑使用到ui的素材,应该在这里做素材的赋值
         */
        ReceiveGroup.prototype.validateNow = function () {
            this.drawDelay = false;
            this._isValidateNow = true;
            //console.log("clz=" + egret.getQualifiedClassName(this)  + ", validateNow!!")
            if (this._ui && this._ui["validateNow"])
                this._ui["validateNow"]();
            if (this._ui)
                this._ui.drawDelay = false;
        };
        ReceiveGroup.prototype.idleDownload = function () {
            if (this._isIdleDownload)
                return;
            if (!this._uiResReady && this._ui && this._ui.hasOwnProperty("resFiles") && this._ui["resFiles"].length > 0) {
                this._idleLoadedGroupCount = 0;
                this._isIdleDownload = true;
                var resArr = this._ui["resFiles"];
                for (var i = 0; i < resArr.length; i++) {
                    easy.ResManager.loadConfig(easy.GlobalSetting.CDN_RES + "assets/ui/" + resArr[i]);
                }
                if (this._ui.hasOwnProperty("resGroup") && this._ui["resGroup"].length > 0) {
                    resArr = [].concat(this._ui["resGroup"]);
                    easy.ResManager.loadGroups(resArr, this.onLoadingResourceGroupComplete, this);
                }
            }
            else {
                this._uiResReady = true;
            }
        };
        /**
         * loading配置文件的加载完成
         * @param event
         */
        ReceiveGroup.prototype.onLoadingResourceGroupComplete = function (event) {
            if (!this._uiResReady && this._ui && this._ui.hasOwnProperty("resGroup") && this._ui["resGroup"].length > 0) {
                var allLoaded = true;
                for (var i = 0; i < this._ui["resGroup"].length; i++) {
                    if (!RES.isGroupLoaded(this._ui["resGroup"][i])) {
                        allLoaded = false;
                        break;
                    }
                }
                if (allLoaded) {
                    //完成下载,标记
                    this._uiResReady = true;
                    this._forceValidateNow = true;
                }
            }
        };
        /**
         * 舞台尺寸变化
         */
        ReceiveGroup.prototype.onStageResize = function () {
            if (this._ui) {
                //检测模板的onStageResize
                this.onInvalidatePosition();
                for (var prop in this._ui) {
                    if (this._ui[prop] instanceof easy.Template && this._ui[prop] != this) {
                        this._ui[prop].onStageResize();
                    }
                }
            }
        };
        return ReceiveGroup;
    }(easy.Group));
    easy.ReceiveGroup = ReceiveGroup;
    __reflect(ReceiveGroup.prototype, "easy.ReceiveGroup");
})(easy || (easy = {}));
