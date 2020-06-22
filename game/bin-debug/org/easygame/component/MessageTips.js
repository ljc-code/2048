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
     * 一个文字提示显示
     */
    var MessageTips = (function (_super) {
        __extends(MessageTips, _super);
        function MessageTips() {
            var _this = _super.call(this) || this;
            _this._dulation = 15; //停留时间
            _this._mssageArr = []; //消息内容
            _this.speed = 5; //文字移动的速度
            _this._labelArr = []; //当前正在显示的label
            _this._showNext = false; //可以显示下一条
            return _this;
        }
        MessageTips.getInstance = function () {
            if (MessageTips._instance == null)
                MessageTips._instance = new MessageTips();
            return MessageTips._instance;
        };
        /**
         * 显示弹出的文字内容
         * @param msg
         */
        MessageTips.showMessage = function (msg, delay, color, x, y, speed) {
            if (delay === void 0) { delay = 0; }
            if (color === void 0) { color = 0xfff666; }
            if (x === void 0) { x = 65535; }
            if (y === void 0) { y = 65535; }
            if (speed === void 0) { speed = 5; }
            MessageTips.getInstance().showMsg(msg, delay, color, x, y, speed);
        };
        /**
         * 显示message提示信息
         * @param msg
         * @param color
         */
        MessageTips.prototype.showMsg = function (msg, delay, color, x, y, speed) {
            if (delay === void 0) { delay = 0; }
            if (color === void 0) { color = 0xfff666; }
            if (x === void 0) { x = 65535; }
            if (y === void 0) { y = 65535; }
            if (speed === void 0) { speed = 5; }
            easy.HeartBeat.addListener(this, this.onHeartBeat);
            if (this._labelArr.length == 0)
                this._showNext = true;
            this._mssageArr.push({ msg: msg, color: color, x: x, y: y, delay: delay, speed: speed });
        };
        /**
         * 呼吸计算位移
         */
        MessageTips.prototype.onHeartBeat = function () {
            if (this._labelArr.length == 0 && this._mssageArr.length == 0) {
                easy.HeartBeat.removeListener(this, this.onHeartBeat);
                return;
            }
            var label = null;
            if (this._showNext && this._mssageArr.length > 0) {
                var item = this._mssageArr.shift();
                label = easy.ObjectPool.getByClass(easy.Label, "msgtips"); //从缓存中拿一个label
                label.text = item["msg"];
                label.color = item["color"];
                label.bold = true;
                //label.stroke = 1;
                //label.strokeColor = 0x000000;
                label.alpha = 0;
                label.fontSize = 40;
                label.showBg = false;
                label.autoSize = true;
                if (item["delay"] > 0) {
                    label.setData(-item["delay"]); //计数停留时间帧
                }
                else {
                    label.setData(0); //计数停留时间帧
                }
                easy.GlobalSetting.STAGE.addChild(label);
                label.draw();
                if (item["x"] == 65535) {
                    label.x = easy.GlobalSetting.DISPLAY_WIDTH / 2 - label.cx;
                }
                else {
                    label.x = item["x"];
                }
                if (item["y"] == 65535) {
                    label.y = easy.GlobalSetting.DISPLAY_HEIGHT / 2;
                }
                else {
                    label.y = item["y"];
                }
                this._labelArr.push({ label: label, speed: item["speed"] });
            }
            for (var i = 0; i < this._labelArr.length; i++) {
                item = this._labelArr[i];
                label = item["label"];
                if (label.getData() < 0) {
                    label.setData(label.getData() + 1);
                    continue;
                }
                //if (label._y ==  ViewManager.currentView.cy/2 && label.getData() < this._dulation) {//停留
                //    label.setData(label.getData() + 1);
                //} else {
                if (label.getData() < this._dulation) {
                    label.y -= item["speed"];
                    label.alpha += 0.1;
                }
                else {
                    label.y -= (item["speed"] + 3);
                    label.alpha -= 0.1;
                }
                //}
                if (label.y < 0) {
                    this._labelArr.splice(i, 1);
                    label.removeFromParent();
                    easy.ObjectPool.recycleClass(label, "msgtips");
                }
                var sp = easy.ViewManager.currentView;
                if (sp == null)
                    sp = easy.GlobalSetting.STAGE;
                if (i == (this._labelArr.length - 1) && (sp.height / 2 - this._labelArr[i].y) > 5) {
                    this._showNext = true;
                }
            }
        };
        return MessageTips;
    }(easy.BaseGroup));
    MessageTips._instance = null; //
    easy.MessageTips = MessageTips;
    __reflect(MessageTips.prototype, "easy.MessageTips");
})(easy || (easy = {}));
