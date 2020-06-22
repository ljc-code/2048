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
     * win的基本类
     * 所有的ui组件都应该放置在ui层中
     * 在win中只处理view相关的逻辑,对ui成层的组件进行操作
     */
    var Win = (function (_super) {
        __extends(Win, _super);
        /**
         * win成对应的ui展现
         * @type {null}
         * @private
         */
        function Win() {
            var _this = _super.call(this) || this;
            /**
             * 进入的效果
             */
            _this._outerEffect = null;
            _this._loadingUIClz = easy.PopupManager.defaultLoadingClass;
            return _this;
        }
        Win.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
        };
        /**
         * enter的过渡效果
         */
        Win.prototype.enterTransition = function () {
            _super.prototype.enterTransition.call(this);
        };
        /**
         * enter的过渡效果结束
         */
        Win.prototype.enterTransitionComplete = function () {
            _super.prototype.enterTransitionComplete.call(this);
        };
        /**
         * win进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        Win.prototype.enter = function () {
            _super.prototype.enter.call(this);
            var key = egret.getQualifiedClassName(this);
            var myEvent = easy.MyEvent.getEvent(easy.EventType.WIN_ENTER);
            myEvent.addItem("data", key);
            myEvent.send();
            if (easy.GlobalSetting.STATS_WIN) {
                //统计代码
                var stateutils = egret.getDefinitionByName("StatsUtil");
                if (stateutils)
                    stateutils["trackPageview"](egret.getQualifiedClassName(this));
            }
        };
        /**
         * win退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        Win.prototype.outer = function () {
            _super.prototype.outer.call(this);
            var key = egret.getQualifiedClassName(this);
            var myEvent = easy.MyEvent.getEvent(easy.EventType.WIN_OUTER);
            myEvent.addItem("data", key);
            myEvent.send();
        };
        /**
         * 舞台尺寸变化
         */
        Win.prototype.onStageResize = function () {
            //super.onStageResize();
            this.x = easy.ViewManager.currentView.cx - this.cx;
            this.y = easy.ViewManager.currentView.cy - this.cy;
            //调整当前view的loading的位置
            var loading = easy.ObjectPool.getByClass(this._loadingUIClz, "loadingwin", false);
            if (loading && loading.parent) {
                loading.x = 0;
                loading.y = 0;
            }
        };
        /**
         * 关闭窗口类
         */
        Win.prototype.hiddent = function () {
            easy.PopupManager.hidden(this);
        };
        return Win;
    }(easy.ReceiveGroup));
    easy.Win = Win;
    __reflect(Win.prototype, "easy.Win");
})(easy || (easy = {}));
