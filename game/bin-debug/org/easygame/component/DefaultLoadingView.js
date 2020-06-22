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
    var DefaultLoadingView = (function (_super) {
        __extends(DefaultLoadingView, _super);
        function DefaultLoadingView() {
            var _this = _super.call(this) || this;
            _this._gridWidth = 256;
            _this._gridHeight = 256;
            _this._bmpLogo = null; //logo
            return _this;
        }
        DefaultLoadingView.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.showBg = false;
            this.setSize(this._gridWidth, this._gridHeight);
            this._bmpLogo = new egret.Bitmap();
            this.addChild(this._bmpLogo);
            this._bmpLogo.texture = RES.getRes("loading_view");
            this._bmpLogo.anchorOffsetX = this._bmpLogo.width * 0.5;
            this._bmpLogo.anchorOffsetY = this._bmpLogo.height * 0.5;
            this._bmpLogo.x = this.cx;
            this._bmpLogo.y = this.cy;
        };
        /**
         * 根据waitview的ui数据,进行下载控制
         */
        DefaultLoadingView.prototype.enter = function () {
            _super.prototype.enter.call(this);
            this._bmpLogo.rotation = 0;
            this.alpha = 0;
            //显示loading图像
            easy.HeartBeat.addListener(this, this.onShowLoadingGraphics);
        };
        /**
         * 完成下载,回调加载view
         */
        DefaultLoadingView.prototype.outer = function () {
            _super.prototype.outer.call(this);
            //console.log("@@LoadingViewUI outer")
            easy.HeartBeat.removeListener(this, this.onShowLoadingGraphics);
        };
        /**
         * 显示下载进度的图形
         */
        DefaultLoadingView.prototype.onShowLoadingGraphics = function () {
            if (this.alpha < 1)
                this.alpha += 0.1;
            this._bmpLogo.rotation += 3;
        };
        return DefaultLoadingView;
    }(easy.LoadingBaseUI));
    easy.DefaultLoadingView = DefaultLoadingView;
    __reflect(DefaultLoadingView.prototype, "easy.DefaultLoadingView");
})(easy || (easy = {}));
