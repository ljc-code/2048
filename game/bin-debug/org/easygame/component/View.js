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
     * view的基本类
     * 所有的ui组件都应该放置在ui层中
     * 在view中只处理view相关的逻辑,对ui成层的组件进行操作
     */
    var View = (function (_super) {
        __extends(View, _super);
        function View() {
            var _this = _super.call(this) || this;
            _this._scene = null;
            _this._loadingUIClz = easy.ViewManager.defaultLoadingClass;
            return _this;
        }
        /**
         * view进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        View.prototype.enter = function () {
            _super.prototype.enter.call(this);
            var key = egret.getQualifiedClassName(this);
            var myEvent = easy.MyEvent.getEvent(easy.EventType.VIEW_ENTER);
            myEvent.addItem("data", key);
            myEvent.send();
            if (this._scene) {
                this._scene.enter();
            }
            //检测尺寸
            this.checkViewSize();
            if (easy.GlobalSetting.STATS_VIEW) {
                //统计代码
                var stateutils = egret.getDefinitionByName("StatsUtil");
                if (stateutils)
                    stateutils["trackPageview"](egret.getQualifiedClassName(this));
            }
        };
        /**
         * view退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        View.prototype.outer = function () {
            _super.prototype.outer.call(this);
            var key = egret.getQualifiedClassName(this);
            var myEvent = easy.MyEvent.getEvent(easy.EventType.VIEW_OUTER);
            myEvent.addItem("data", key);
            myEvent.send();
        };
        /**
         * 设置ui层的显示对象
         * @param myui
         */
        View.prototype.setUI = function (myui) {
            _super.prototype.setUI.call(this, myui);
            this._ui = myui;
            if (this._ui) {
                this.addChild(this._ui);
            }
        };
        /**
         * 检测view的尺寸要求是否达到设定
         */
        View.prototype.checkViewSize = function () {
            if (easy.GlobalSetting.DISPLAY_MODEL == easy.GlobalSetting.DISPLAY_VIEW_EASYGAME) {
                var w = this.width;
                var h = this.height;
                if (this._scene) {
                    //console.log("check size has sence")
                    //有场景的,需要自适应窗口大小
                    if (this.scene.sceneWidth <= 0) {
                        w = easy.GlobalSetting.STAGE_WIDTH;
                    }
                    else if (easy.GlobalSetting.STAGE_WIDTH < w) {
                        if (easy.GlobalSetting.STAGE_WIDTH >= easy.GlobalSetting.VIEW_MINI_WIDTH) {
                            w = easy.GlobalSetting.STAGE_WIDTH;
                        }
                        else {
                            w = easy.GlobalSetting.VIEW_MINI_WIDTH;
                        }
                    }
                    else if (easy.GlobalSetting.STAGE_WIDTH > this.scene.sceneWidth) {
                        w = this.scene.sceneWidth;
                    }
                    else {
                        w = easy.GlobalSetting.STAGE_WIDTH;
                    }
                    if (this.scene.sceneHeight <= 0) {
                        h = easy.GlobalSetting.STAGE_HEIGHT;
                        if (!egret.NumberUtils.isNumber(h)) {
                        }
                    }
                    else if (easy.GlobalSetting.STAGE_HEIGHT < h) {
                        if (easy.GlobalSetting.STAGE_HEIGHT >= easy.GlobalSetting.VIEW_MINI_HEIGHT) {
                            h = easy.GlobalSetting.STAGE_HEIGHT;
                        }
                        else {
                            h = easy.GlobalSetting.VIEW_MINI_HEIGHT;
                        }
                    }
                    else if (easy.GlobalSetting.STAGE_HEIGHT > this.scene.sceneHeight) {
                        h = this.scene.sceneHeight;
                    }
                    else {
                        h = easy.GlobalSetting.STAGE_HEIGHT;
                    }
                }
                else {
                    //console.log("check size no sence")
                    if (easy.GlobalSetting.STAGE_WIDTH > w) {
                        if (easy.GlobalSetting.STAGE_WIDTH >= easy.GlobalSetting.VIEW_MINI_WIDTH) {
                            w = easy.GlobalSetting.STAGE_WIDTH;
                        }
                        else {
                            w = easy.GlobalSetting.VIEW_MINI_WIDTH;
                        }
                    }
                    else if (easy.GlobalSetting.VIEW_MINI_WIDTH > w) {
                        w = easy.GlobalSetting.STAGE_WIDTH;
                    }
                    if (easy.GlobalSetting.STAGE_HEIGHT > h) {
                        if (easy.GlobalSetting.STAGE_HEIGHT >= easy.GlobalSetting.VIEW_MINI_HEIGHT) {
                            h = easy.GlobalSetting.STAGE_HEIGHT;
                        }
                        else {
                            h = easy.GlobalSetting.VIEW_MINI_HEIGHT;
                        }
                    }
                    else if (easy.GlobalSetting.VIEW_MINI_HEIGHT > h) {
                        h = easy.GlobalSetting.STAGE_HEIGHT;
                    }
                }
                w = parseInt("" + w);
                h = parseInt("" + h);
                this.setSize(w, h);
                var ui = this.getUI();
                if (ui) {
                    ui.setSize(w, h);
                }
                if (this._scene)
                    this._scene.setSize(w, h);
            }
        };
        /**
         * enter的过渡效果
         */
        View.prototype.enterTransition = function () {
            if (easy.ViewManager.currentView && easy.ViewManager.currentView != this)
                easy.ViewManager.currentView.outer();
            _super.prototype.enterTransition.call(this);
        };
        /**
         * enter的过渡效果结束
         */
        View.prototype.enterTransitionComplete = function () {
            if (easy.ViewManager.currentView && easy.ViewManager.currentView != this)
                easy.ViewManager.currentView.outerTransitionComplete();
            _super.prototype.enterTransitionComplete.call(this);
            easy.ViewManager.currentView = this;
        };
        Object.defineProperty(View.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            /**
             * 设置场景
             * @param scene
             */
            set: function (scene) {
                if (this._scene) {
                    this._scene.removeFromParent();
                }
                this._scene = scene;
                if (this._scene) {
                    this.addChildAt(this._scene, 0);
                }
                this.checkViewSize();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 舞台尺寸变化
         */
        View.prototype.onStageResize = function () {
            if (easy.GlobalSetting.DISPLAY_MODEL == easy.GlobalSetting.DISPLAY_VIEW_EASYGAME) {
                this.setSize(easy.GlobalSetting.DISPLAY_WIDTH, easy.GlobalSetting.DISPLAY_HEIGHT);
                _super.prototype.onStageResize.call(this);
                this.checkViewSize();
                //调整当前view的loading的位置
                var loading = easy.ObjectPool.getByClass(this._loadingUIClz, "loading", false);
                if (loading && loading.parent) {
                    loading.x = 0;
                    loading.y = 0;
                }
            }
        };
        return View;
    }(easy.ReceiveGroup));
    easy.View = View;
    __reflect(View.prototype, "easy.View");
})(easy || (easy = {}));
