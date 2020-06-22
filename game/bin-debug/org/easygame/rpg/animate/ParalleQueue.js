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
    var rpg;
    (function (rpg) {
        /**
         * <p>并行效果</p>
         * @date  :Jun 18, 2012
         * @author:jinyi.lu
         */
        var ParalleQueue = (function (_super) {
            __extends(ParalleQueue, _super);
            function ParalleQueue() {
                var _this = _super.call(this) || this;
                _this.animateList = new Array(); //并行动画的列表
                return _this;
            }
            /**
             * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
             */
            ParalleQueue.prototype.onHeartBeat = function () {
                _super.prototype.onHeartBeat.call(this);
                if (this.runing) {
                    if (this.animateList.length > 0) {
                        for (var i = this.animateList.length - 1; i >= 0; i--) {
                            if (this.animateList[i].completed && this.animateList[i].afterFrame <= 0) {
                                this.removeAnimate(this.animateList[i]);
                            }
                        }
                        var item = null;
                        var length1 = this.animateList.length;
                        for (var i = 0; i < length1; i++) {
                            item = this.animateList[i];
                            item.onHeartBeat();
                            if (!item.runing && item.delayFrame <= 0)
                                item.play();
                        }
                    }
                    if (this.animateList.length == 0)
                        this.stop();
                }
            };
            /**
             * 添加一个并行动画
             */
            ParalleQueue.prototype.addAnimate = function (animate) {
                animate.parent = this;
                this.animateList.push(animate);
            };
            /**
             * 删除一个串行动画
             */
            ParalleQueue.prototype.removeAnimate = function (animate) {
                for (var i = 0; i < this.animateList.length; i++) {
                    if (this.animateList[i] == animate) {
                        this.animateList[i].stop();
                        this.animateList[i].destroy();
                        this.animateList.splice(i, 1);
                        break;
                    }
                }
            };
            /**
             * 销毁数据
             */
            ParalleQueue.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                for (var i = 0; i < this.animateList.length; i++) {
                    this.animateList[i].destroy();
                }
                this.animateList.length = 0;
            };
            Object.defineProperty(ParalleQueue.prototype, "frozen", {
                set: function (value) {
                    this._frozen = value;
                    for (var i = 0; i < this.animateList.length; i++) {
                        this.animateList[i].frozen = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            return ParalleQueue;
        }(easy.rpg.BaseAnimate));
        rpg.ParalleQueue = ParalleQueue;
        __reflect(ParalleQueue.prototype, "easy.rpg.ParalleQueue");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
