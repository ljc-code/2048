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
        var BaseAnimate = (function () {
            function BaseAnimate() {
                this.runing = false; //开始标记,可以计算了
                this.completed = false; //结束标记,可以回收
                this.parent = null; //父节点
                this.afterFrame = 0; //所有动作完成后,延长多长时间再设置为complete状态
                this.delayFrame = 0; //延迟开始的时间设定
                this._frozen = false; //冻结,暂停标记,配合runing状态才可用
                //显示用数据
                this.scene = null; //目标场景
                this._resJsonId = null;
                this._resImgId = null;
                this._direction = null; //目标
                this._directionMirror = false; //是否要镜像
                this._speed = 20; //速度
                this.jsonData = null;
                this._loop = false; //是否循环播放材质
                this._actorDisplayIndex = 0; //显示计数
                this._actorDisplayCount = 0; //计数最大值
                this._actorTextureIndex = 0; //材质计数
                this._actorTextureCount = 0; //材质最大值
                this._imgDisplay = null; //显示对象
            }
            /**
             * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
             */
            BaseAnimate.prototype.onHeartBeat = function () {
                if (this.delayFrame > 0) {
                    this.delayFrame--;
                    //trace("BaseAnimate.onHeartBeat() offsetFrame=" + offsetFrame + ", runing=" + _runing)
                    return;
                }
                if (this.completed && this.afterFrame > 0) {
                    this.afterFrame--;
                    return;
                }
                if (this.runing && this.jsonData) {
                    this.onHBChangeTextTure();
                }
            };
            BaseAnimate.prototype.play = function () {
                this.runing = true;
                this.completed = false;
                if (this._imgDisplay == null) {
                    this._imgDisplay = new egret.Bitmap();
                }
                this.scene.addAnimate(this);
                if (this.jsonData == null) {
                    this.stop();
                    return;
                }
                if (this.jsonData.direction.length == 1) {
                    this._direction = this.jsonData.direction[0];
                }
                else {
                }
            };
            BaseAnimate.prototype.stop = function () {
                this.completed = true;
            };
            BaseAnimate.prototype.getDisplay = function () {
                return this._imgDisplay;
            };
            /**
             * 销毁数据
             */
            BaseAnimate.prototype.destroy = function () {
                if (this._imgDisplay && this._imgDisplay.parent)
                    this._imgDisplay.parent.removeChild(this._imgDisplay);
                this._resJsonId = null;
                this._resImgId = null;
                this.scene = null;
                this.completed = false;
                this.runing = false;
                this.parent = null;
                this.afterFrame = 0;
                this.delayFrame = 0;
                this._actorDisplayCount = 0;
                this._actorDisplayIndex = 0;
                this._actorTextureCount = 0;
                this._actorTextureIndex = 0;
                easy.ObjectPool.recycleClass(this); //回收对象
            };
            /**
             * 暂停,和frozen=true一样的效果
             * 前提条件是runing状态
             */
            BaseAnimate.prototype.pause = function () {
                if (this.runing) {
                    this.frozen = true;
                }
            };
            /**
             * 重新播放,和frozen=false一样的效果
             * 前提条件是runing状态
             */
            BaseAnimate.prototype.replay = function () {
                if (this.runing) {
                    this.frozen = false;
                }
            };
            /**
             * 材质变更计算
             */
            BaseAnimate.prototype.onHBChangeTextTure = function () {
                this.initActorTexture();
                this._actorDisplayIndex++;
                if (this._actorDisplayIndex > this._actorDisplayCount) {
                    this._actorDisplayIndex = 0;
                    this.changeCurrentFrameActorTexture();
                    this._actorTextureIndex++;
                    if (this._actorTextureIndex > this._actorTextureCount) {
                        if (!this._loop) {
                            this._actorTextureIndex = this._actorTextureCount - 1;
                            this.stop();
                            return;
                        }
                        this._actorTextureIndex = 0;
                    }
                }
            };
            /**
             * 根据状态,改变当前帧的材质情况
             */
            BaseAnimate.prototype.changeCurrentFrameActorTexture = function () {
                //console.log("changeCurrentFrameActorTexture key=" + key + ", data=" + jsongData)
                if (this.jsonData && this.jsonData.spritesheet) {
                    //获取到图像
                    //console.log("changeCurrentFrameActorTexture key=" + this._resJsonId + ", directionTexture=" + this._direction)
                    var jsonDirectionData = this.jsonData.texture["" + this._direction][this._actorTextureIndex];
                    //console.log("texture.key=" + (key + "_" + this.gameData._direction + "_" + this._actorTextureIndex))
                    var spriteSheet = this.jsonData.spritesheet;
                    var texture = spriteSheet.getTexture(this._resImgId + "_" + this._direction + "_" + this._actorTextureIndex);
                    if (texture) {
                        this._imgDisplay.texture = texture;
                        if (this._directionMirror) {
                            this._imgDisplay.scaleX = -1;
                        }
                        else {
                            this._imgDisplay.scaleX = 1;
                        }
                    }
                    //下一帧数据的改变
                    this._actorTextureIndex++;
                    this.initTextureRuntimeData();
                    this._actorTextureIndex--;
                }
            };
            /**
             * 材质初始化
             */
            BaseAnimate.prototype.initActorTexture = function () {
                //初始化材质
                //console.log("this.jsonData=" + this.jsonData + ", this.jsonData[spritesheet]=" + this.jsonData["spritesheet"])
                if (this.jsonData && !this.jsonData["spritesheet"]) {
                    var texture = RES.getRes(this._resImgId);
                    //console.log("initActorTexture texture.key=" + this._resImgId + ", direction=" + this.jsonData.direction)
                    if (texture) {
                        var spriteSheet = new egret.SpriteSheet(texture);
                        var spJsonData = null;
                        //生成方向材质
                        for (var i = 0; i < this.jsonData.direction.length; i++) {
                            spJsonData = this.jsonData.texture["" + this.jsonData.direction[i]];
                            //console.log("spJsonData[" + jsongData.direction[i] + "].len=" + spJsonData.length)
                            for (var j = 0; j < spJsonData.length; j++) {
                                //console.log("texture.key=" + (jsongData.id + "_" + spJsonData[j].img))
                                spriteSheet.createTexture(this._resImgId + "_" + this._direction + "_" + j, spJsonData[j].x, spJsonData[j].y, spJsonData[j].w, spJsonData[j].h);
                            }
                        }
                        this.jsonData["spritesheet"] = spriteSheet;
                    }
                    //设置图像变化的数据
                    this._actorTextureIndex = 0;
                    this.initTextureRuntimeData();
                }
            };
            /**
             * 初始化材质
             */
            BaseAnimate.prototype.initTextureRuntimeData = function () {
                if (this.jsonData) {
                    //console.log("this.gameData._direction="+ this.gameData._direction + ", data=" + jsongData.texture["" + this.directionTexture])
                    var jsonDirectionData = this.jsonData.texture["" + this._direction][this._actorTextureIndex];
                    if (this._actorTextureIndex + 1 >= this._actorTextureCount) {
                        jsonDirectionData = this.jsonData.texture["" + this._direction][0];
                    }
                    //if (jsonDirectionData["frame"]){
                    //    this._actorDisplayCount = jsonDirectionData.frame;
                    //} else {
                    this._actorDisplayCount = this.jsonData.frame;
                    //}
                    this._actorTextureCount = this.jsonData.texture["" + this._direction].length;
                }
            };
            Object.defineProperty(BaseAnimate.prototype, "frozen", {
                set: function (value) {
                    this._frozen = value;
                },
                enumerable: true,
                configurable: true
            });
            return BaseAnimate;
        }());
        rpg.BaseAnimate = BaseAnimate;
        __reflect(BaseAnimate.prototype, "easy.rpg.BaseAnimate", ["easy.rpg.IAnimate"]);
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
