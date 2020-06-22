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
     * Debug信息显示窗口
     */
    var DebugWin = (function (_super) {
        __extends(DebugWin, _super);
        /**
         * view成对应的ui展现
         * @type {null}
         * @private
         */
        function DebugWin() {
            var _this = _super.call(this) || this;
            //操作按钮容器
            _this._bottomContainer = null;
            //顶部信息容器
            _this._topContainer = null;
            _this._labelTitle = null;
            //内容显示
            _this._textInfo = null;
            //关闭按钮
            _this._btnClose = null;
            //清除
            _this._btnClean = null;
            //刷新按钮
            _this._btnRefresh = null;
            return _this;
        }
        /**
         * 初始化ui数据
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         */
        DebugWin.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.y = 80;
            //窗口宽高
            this.width = 400;
            this.height = easy.GlobalSetting.STAGE_HEIGHT - this.y;
            //顶部信息设置
            this._topContainer = new easy.Group();
            this.addChild(this._topContainer);
            this._topContainer.height = 35;
            this._topContainer.width = this.width;
            this._topContainer.y = 0;
            this._labelTitle = new easy.Label();
            this._topContainer.addChild(this._labelTitle);
            this._labelTitle.text = "Debug窗口";
            //底部按钮设置
            //按钮容器
            this._bottomContainer = new easy.Group();
            this.addChild(this._bottomContainer);
            this._bottomContainer.height = 42;
            this._bottomContainer.width = this.width;
            this._bottomContainer.y = this.height - this._bottomContainer.height;
            //刷新按钮
            this._btnRefresh = new easy.Button();
            this._bottomContainer.addChild(this._btnRefresh);
            this._btnRefresh.label = "刷新";
            this._btnRefresh.x = 2;
            this._btnRefresh.y = 2;
            this._btnRefresh.setSize(125, 40);
            this._btnRefresh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRegresh, this);
            //关闭按钮
            this._btnClose = new easy.Button();
            this._bottomContainer.addChild(this._btnClose);
            this._btnClose.x = this._btnRefresh.x + this._btnRefresh.width + 8;
            this._btnClose.y = 2;
            this._btnClose.label = "关闭";
            this._btnClose.setSize(125, 40);
            this._btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchClose, this);
            //清除按钮
            this._btnClean = new easy.Button();
            this._bottomContainer.addChild(this._btnClean);
            this._btnClean.x = this._btnClose.x + this._btnClose.width + 8;
            this._btnClean.y = 2;
            this._btnClean.label = "清除";
            this._btnClean.setSize(125, 40);
            this._btnClean.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchClean, this);
            //内容显示设置
            var textBg = new easy.Group();
            this.addChild(textBg);
            textBg.bgColor = 0xffffff;
            textBg.x = 0;
            textBg.y = this._topContainer.height + 1;
            textBg.width = this.width;
            textBg.height = this.height - this._topContainer.height - this._bottomContainer.height - 2;
            this._textInfo = new egret.TextField();
            this.addChild(this._textInfo);
            this._textInfo.multiline = true;
            this._textInfo.textColor = 0x000000;
            this._textInfo.size = 16;
            this._textInfo.lineSpacing = 6;
            this._textInfo.x = textBg.x + 1;
            this._textInfo.y = textBg.y;
            this._textInfo.width = textBg.width;
            this._textInfo.height = textBg.height;
            this.showBg = true;
        };
        /**
         * 刷新内容事件
         * @param event
         */
        DebugWin.prototype.onTouchRegresh = function (event) {
            this._textInfo.text = easy.Debug.log;
        };
        /**
         * 关闭窗口事件
         * @param event
         */
        DebugWin.prototype.onTouchClose = function (event) {
            DebugWin.hidden();
        };
        /**
         * 清除记录
         * @param event
         */
        DebugWin.prototype.onTouchClean = function (event) {
            easy.Debug.clean();
            this.onTouchRegresh(event);
        };
        /**
         * 显示
         */
        DebugWin.show = function () {
            if (DebugWin._instance == null) {
                DebugWin._instance = new DebugWin();
            }
            easy.GlobalSetting.STAGE.addChild(DebugWin._instance);
        };
        /**
         * view进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        DebugWin.prototype.initData = function () {
            _super.prototype.initData.call(this);
            this.onTouchRegresh(null);
        };
        DebugWin.refresh = function () {
            if (DebugWin._instance && DebugWin._instance.parent) {
                DebugWin._instance._textInfo.text = easy.Debug.log;
                DebugWin._instance._textInfo.height = DebugWin._instance._textInfo.textHeight;
                DebugWin._instance._textInfo.y = DebugWin._instance.height - DebugWin._instance._topContainer.height - DebugWin._instance._bottomContainer.height - DebugWin._instance._textInfo.textHeight;
            }
        };
        /**
         * 隐藏
         */
        DebugWin.hidden = function () {
            if (DebugWin._instance && DebugWin._instance.parent) {
                DebugWin._instance.parent.removeChild(this._instance);
            }
        };
        return DebugWin;
    }(easy.Win));
    //单例调用
    DebugWin._instance = null;
    easy.DebugWin = DebugWin;
    __reflect(DebugWin.prototype, "easy.DebugWin");
})(easy || (easy = {}));
