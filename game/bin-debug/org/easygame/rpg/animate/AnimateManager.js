var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
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
        var AnimateManager = (function () {
            function AnimateManager() {
                this._isRun = false;
                this._isFrozen = false;
                this._animateList = [];
            }
            AnimateManager.getInstance = function () {
                if (AnimateManager._instance == null)
                    AnimateManager._instance = new easy.rpg.AnimateManager();
                return AnimateManager._instance;
            };
            /**
             * 动画控制开始
             */
            AnimateManager.prototype.start = function () {
                if (!this._isRun) {
                    //this._animateList.length = 0;
                    easy.HeartBeat.addListener(this, this.onHeartBeat);
                    this._isRun = true;
                    this._isFrozen = false;
                }
            };
            /**
             * 战斗控制结束
             */
            AnimateManager.prototype.stop = function () {
                //console.log("AnimateManager Stop")
                this._isRun = false;
                this._animateList.length = 0;
                easy.HeartBeat.removeListener(this, this.onHeartBeat);
            };
            /**
             * 添加动画
             */
            AnimateManager.prototype.addAnimate = function (animate) {
                this._animateList.push(animate);
                this.start();
            };
            /**
             * 删除动画
             */
            AnimateManager.prototype.removeAnimate = function (animate) {
                for (var i = 0; i < this._animateList.length; i++) {
                    if (this._animateList[i] == animate) {
                        this._animateList[i].stop();
                        this._animateList[i].destroy();
                        this._animateList.splice(i, 1);
                        break;
                    }
                }
                if (this._animateList.length == 0)
                    this.stop();
            };
            /**
             * 清空所有特效操作
             */
            AnimateManager.prototype.removeAllAnimate = function () {
                for (var i = 0; i < this._animateList.length; i++) {
                    this._animateList[i].destroy();
                }
                this._animateList.length = 0;
            };
            /**
             * 冻结
             * @param value
             */
            AnimateManager.prototype.frozen = function (value) {
                if (this._isRun) {
                    this._isFrozen = value;
                    for (var i = 0; i < this._animateList.length; i++) {
                        this._animateList[i].frozen = value;
                    }
                }
            };
            /**
             * 暂停播放
             */
            AnimateManager.prototype.pause = function () {
                this.frozen(true);
            };
            /**
             * 继续播放
             */
            AnimateManager.prototype.replay = function () {
                this.frozen(false);
            };
            /**
             * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
             */
            AnimateManager.prototype.onHeartBeat = function () {
                if (!this._isRun || this._isFrozen)
                    return;
                var length1 = this._animateList.length;
                //console.log("Animate onHeartBeat.len=" + length1);
                for (var i1 = 0; i1 < length1; i1++) {
                    var item = this._animateList[i1];
                    item.onHeartBeat();
                    //console.log("Animate onHeartBeat item.delay=" + item.delayFrame + ", completed=" + item.completed + ", after=" + item.afterFrame);
                    if (!item.runing && item.delayFrame <= 0)
                        item.play();
                }
                var i = 0;
                for (i = this._animateList.length - 1; i >= 0; i--) {
                    if (this._animateList[i].completed && this._animateList[i].afterFrame <= 0) {
                        this._animateList[i].destroy();
                        this._animateList.splice(i, 1);
                    }
                }
                //console.log("Animate 111 onHeartBeat.len=" + this._animateList.length);
                if (this._animateList.length == 0)
                    this.stop();
            };
            /**
             * 根据技能生成动画调度
             * @param jsonSkill
             */
            AnimateManager.prototype.genSkillAnimateQueue = function (jsonSkill) {
                //console.log("genSkillAnimateQueue");
                var effectAnimate = easy.ObjectPool.getByClass(rpg.EffectAnimate);
                effectAnimate.scene = easy.ViewManager.currentView.scene;
                effectAnimate.skillId = jsonSkill;
                effectAnimate.actorSrc = easy.ViewManager.currentView.scene.cameraFoucs;
                effectAnimate.actorDes = easy.ViewManager.currentView.scene.getActorById(10001).actor;
                this.addAnimate(effectAnimate);
            };
            return AnimateManager;
        }());
        AnimateManager._instance = null;
        rpg.AnimateManager = AnimateManager;
        __reflect(AnimateManager.prototype, "easy.rpg.AnimateManager");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
