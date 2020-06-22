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
        /**
         * 对角色的数据进行更新和控制显示
         */
        var ActorCtrl = (function () {
            /**
             * 角色控制器
             * @param act  角色显示对象
             * @param data 角色原始数据
             */
            function ActorCtrl(act, data) {
                /**
                 * 角色显示对象
                 */
                this._actor = null;
                /**
                 * 角色运行时数据
                 */
                this._gameData = null;
                /**
                 * 标识是否显示区域内
                 * 不在显示区域内,只做xy数值的计算,不做图像材质的变更计算
                 * @type {boolean}
                 */
                this.isDisplay = false;
                this.moveMapStepCallBackFunc = null;
                this.moveMapStepCallBackThis = null;
                this._textureJsonData = {}; //每个状态的材质数据:key=gamestate,value=json
                this.tweenMove = null;
                //计算材质变化
                this._actorDisplayIndex = 0; //显示计数
                this._actorDisplayCount = 0; //计数最大值
                this._actorTextureIndex = 0; //材质计数
                this._actorTextureCount = 0; //材质最大值
                this._actor = act;
                this._gameData = new easy.rpg.GameData();
                this._gameData.actorData = data;
            }
            Object.defineProperty(ActorCtrl.prototype, "actor", {
                /**
                 * 获取角色显示对象
                 * @returns {Actor}
                 */
                get: function () {
                    return this._actor;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActorCtrl.prototype, "actorData", {
                get: function () {
                    if (this._gameData) {
                        return this._gameData.actorData;
                    }
                    return null;
                },
                /**
                 * 设置角色原始数据
                 * @param value
                 */
                set: function (value) {
                    this._gameData.actorData = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
             * 所有的数据变化,都是在这个方法更新到显示层
             *
             * 数据isInvalidate指的是x,y,hp
             * 模型的材质,另外计算时间
             */
            ActorCtrl.prototype.onHeartBeat = function () {
                if (this._gameData._gameState == rpg.RpgSetting.ACTOR_MOV) {
                    this.onMoveByPath();
                }
                if (this.isDisplay) {
                    this.onHBChangeTextTure();
                }
                //console.log("Actor.HB ctrl id=" + this._gameData.id + ", this.isDisplay=" + this.isDisplay);
            };
            ActorCtrl.prototype.onHBChangeTextTure = function () {
                this.initActorTexture();
                this._actorDisplayIndex++;
                if (this._actorDisplayIndex > this._actorDisplayCount) {
                    this._actorDisplayIndex = 0;
                    this.changeCurrentFrameActorTexture();
                    this._actorTextureIndex++;
                    if (this._actorTextureIndex > this._actorTextureCount) {
                        this._actorTextureIndex = 0;
                    }
                }
            };
            /**
             * 根据状态,改变当前帧的材质情况
             */
            ActorCtrl.prototype.changeCurrentFrameActorTexture = function () {
                var key = this.gameData.id + "_" + this.gameData.gameState;
                var jsongData = this._textureJsonData[key];
                //console.log("changeCurrentFrameActorTexture key=" + key + ", data=" + jsongData)
                if (jsongData) {
                    //获取到图像
                    //console.log("changeCurrentFrameActorTexture key=" + key + ", directionTexture=" + this.directionTexture)
                    var jsonDirectionData = jsongData.texture["" + this.directionTexture][this._actorTextureIndex];
                    //console.log("texture.key=" + (key + "_" + this.gameData._direction + "_" + this._actorTextureIndex))
                    var spriteSheet = jsongData.spritesheet;
                    var texture = spriteSheet.getTexture(key + "_" + this.directionTexture + "_" + this._actorTextureIndex);
                    if (texture && this._actor._bitmapActor) {
                        this._actor._bitmapActor.texture = texture;
                        //this._actor._bitmapActor.x = jsonDirectionData.x + jsonDirectionData.offsetx;
                        //this._actor._bitmapActor.y = jsonDirectionData.offsety;
                        if (this.gameData._directionMirror) {
                            this._actor._bitmapActor.scaleX = -1;
                            this._actor._bitmapActor.x = -jsonDirectionData.offsetx;
                        }
                        else {
                            this._actor._bitmapActor.scaleX = 1;
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
            ActorCtrl.prototype.initActorTexture = function () {
                //初始化材质
                if (!this._textureJsonData.hasOwnProperty(this.gameData.id + "_" + this.gameData.gameState)) {
                    var key = "actor_json_" + this.gameData.gameState + "_" + this.gameData.id;
                    var jsongData = RES.getRes(key);
                    //console.log("initActorTexture key=" + key + ", data=" + jsongData)
                    if (jsongData) {
                        this._textureJsonData[this.gameData.id + "_" + this.gameData.gameState] = jsongData;
                        this.gameData._directionNum = jsongData.direction.length;
                        key = "actor_img_" + this.gameData.gameState + "_" + this.gameData.id;
                        var texture = RES.getRes(key);
                        //console.log("initActorTexture texture.key=" + key + ", texture=" + texture + ", direction=" + jsongData.direction)
                        if (texture) {
                            var spriteSheet = new egret.SpriteSheet(texture);
                            var spJsonData = null;
                            //生成方向材质
                            for (var i = 0; i < jsongData.direction.length; i++) {
                                spJsonData = jsongData.texture["" + jsongData.direction[i]];
                                //console.log("spJsonData[" + jsongData.direction[i] + "].len=" + spJsonData.length)
                                for (var j = 0; j < spJsonData.length; j++) {
                                    //console.log("texture.key=" + (jsongData.id + "_" + spJsonData[j].img))
                                    spriteSheet.createTexture(jsongData.id + "_" + spJsonData[j].img, spJsonData[j].x, spJsonData[j].y, spJsonData[j].w, spJsonData[j].h);
                                }
                            }
                            jsongData["spritesheet"] = spriteSheet;
                        }
                        //设置图像变化的数据
                        this._actorTextureIndex = 0;
                        this.initTextureRuntimeData();
                    }
                }
            };
            ActorCtrl.prototype.initTextureRuntimeData = function () {
                var jsongData = this._textureJsonData[this.gameData.id + "_" + this.gameData.gameState];
                if (jsongData) {
                    //console.log("this.gameData._direction="+ this.gameData._direction + ", data=" + jsongData.texture["" + this.directionTexture])
                    var jsonDirectionData = jsongData.texture["" + this.directionTexture][this._actorTextureIndex];
                    if (this._actorTextureIndex + 1 >= this._actorTextureCount) {
                        jsonDirectionData = jsongData.texture["" + this.directionTexture][0];
                    }
                    //if (jsonDirectionData["frame"]){
                    //    this._actorDisplayCount = jsonDirectionData.frame;
                    //} else {
                    this._actorDisplayCount = jsongData.frame;
                    //}
                    this._actorTextureCount = jsongData.texture["" + this.directionTexture].length;
                }
            };
            //计算数据变化
            ActorCtrl.prototype.onHBChangeData = function () {
                if (this._gameData.isInvalidate) {
                    this._gameData.isInvalidate = false;
                }
                this._actor.x = this._gameData._screenXY.x;
                this._actor.y = this._gameData._screenXY.y;
            };
            Object.defineProperty(ActorCtrl.prototype, "id", {
                /**
                 * 获取角色id
                 * @returns {number}
                 */
                get: function () {
                    return this._gameData.id;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 在场景的显示区域出现的时候调用
             */
            ActorCtrl.prototype.enter = function () {
                this.isDisplay = true;
            };
            /**
             * 不在场景的显示区域的时候调用
             */
            ActorCtrl.prototype.outer = function () {
                this.isDisplay = false;
            };
            Object.defineProperty(ActorCtrl.prototype, "gameData", {
                /**
                 * 获取游戏运行时数据
                 * @returns {GameData}
                 */
                get: function () {
                    return this._gameData;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 设置自由移动的起始和结束坐标
             * 适合在没有格子的底图上移动,比如大地图点对点移动
             */
            ActorCtrl.prototype.setFreePath = function (src, target, calculateDirection) {
                var pathDatas = new Array();
                pathDatas.push(src);
                pathDatas.push(target);
                //            Debug.log("自由移动,方向计算 userid=" + this.data.data.id + ",src.x=" + src.x +  ",c.x=" + this.data.mapXY.x + ",src.y=" + src.y + ",c.y=" + this.data.mapXY.y + ",target.x=" + target.x + ",target.y=" + target.y);
                this.gameData.mapXY.x = src.x;
                this.gameData.mapXY.y = src.y;
                if (calculateDirection)
                    this.direction = rpg.DirectionUtil.direction(src, target, rpg.RpgSetting.DIRECT_NUMBER);
                //分解x,y速度
                //计算心跳次数
                var speedPoint = rpg.DirectionUtil.speedXY(src, target, this.gameData._speed);
                //Debug.log("setFreePath speed=" + this.characterData.walkSpeed + ", x=" + speedPoint.x + ", y=" + speedPoint.y);
                this.gameData._speedXY.x = speedPoint.x;
                this.gameData._speedXY.y = speedPoint.y;
                this.setPath(pathDatas, false);
            };
            ActorCtrl.prototype.setPath = function (path, caculateDirection) {
                if (caculateDirection === void 0) { caculateDirection = true; }
                this.cleanPath();
                if (!path) {
                    this.gameData.gameState = rpg.RpgSetting.ACTOR_STD; //站立
                    return;
                }
                if (caculateDirection && path.length >= 2) {
                    this.direction = rpg.DirectionUtil.direction(path[0], path[1], rpg.RpgSetting.DIRECT_NUMBER);
                }
                this._gameData.gameState = rpg.RpgSetting.ACTOR_MOV; //运动
                if (this.gameData._path) {
                    this.gameData._path.length = 0;
                }
                this.gameData._path = path;
                this.gameData.pathNextPoint();
            };
            /**
             * 按格子号进行移动运算
             */
            ActorCtrl.prototype.onMoveByPath = function () {
                //console.log("onMoveByPath 00000");
                if (this.gameData._pathTargetPoint) {
                    //console.log("onMoveByPath 111111 path.length=" + this.gameData._path.length + ",TargetPoint.x=" + this.gameData._pathTargetPoint.x + ", TargetPoint.y" + this.gameData._pathTargetPoint.y + ", map.x=" + this.gameData.mapXY.x + ", map.y=" + this.gameData.mapXY.y);
                    if (this.isReachTarget(this.gameData.mapXY, this.gameData._pathTargetPoint, this.gameData._direction)) {
                        //console.log("onMoveByPath 22222");
                        if (this.gameData._path == null || this.gameData._path.length == 0) {
                            //console.log("onMoveByPath 33333 终点");
                            this.cleanPath();
                            return;
                        }
                        else {
                            this.gameData.pathNextPoint(); //下一个节点继续
                            this.direction = rpg.DirectionUtil.direction(this.gameData.mapXY, this.gameData._pathTargetPoint, rpg.RpgSetting.DIRECT_NUMBER);
                            //计算移动的xy速度
                            var speedPoint = rpg.DirectionUtil.speedXY(this.gameData.mapXY, this.gameData._pathTargetPoint, this.gameData._speed);
                            this.gameData._speedXY.x = speedPoint.x;
                            this.gameData._speedXY.y = speedPoint.y;
                        }
                    }
                    //console.log("onMoveByPath 5555 speed.x=" + this.gameData._speedXY.x + ", y=" + this.gameData._speedXY.y);
                    //继续移动
                    this.moveMapStep(this.gameData._speedXY.x, this.gameData._speedXY.y);
                }
                else {
                    this.cleanPath();
                }
            };
            //测试某点是否已经到达指定目标位置
            ActorCtrl.prototype.isReachTarget = function (srcPoint, targetPoint, direction) {
                if (Math.abs(egret.Point.distance(srcPoint, targetPoint)) <= 0.8)
                    return true;
                return false;
            };
            /**
             * 在map上的坐标位置,增量修改
             */
            ActorCtrl.prototype.moveMapStep = function (xStep, yStep) {
                this.gameData.moveMapStep(xStep, yStep);
                if (this.moveMapStepCallBackFunc != null)
                    this.moveMapStepCallBackFunc.call(this.moveMapStepCallBackThis, xStep, yStep);
            };
            /**
             * 清除路径数据
             */
            ActorCtrl.prototype.cleanPath = function () {
                this.gameState = rpg.RpgSetting.ACTOR_STD;
                this._gameData.isInvalidate = false;
                this._gameData._path.length = 0;
                this._gameData._pathTargetPoint = null;
            };
            Object.defineProperty(ActorCtrl.prototype, "direction", {
                get: function () {
                    return this.gameData._direction;
                },
                /**
                 * 转换成正确的材质方向,并且标记时候需要镜像
                 * @param direction
                 */
                set: function (direction) {
                    this.gameData._direction = direction;
                    //重新计算材质的数据局
                    this._actorTextureIndex = 0;
                    this.initTextureRuntimeData();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActorCtrl.prototype, "directionTexture", {
                /**
                 * 获得材质的方向
                 * 原生材质的图为 2,3,4
                 * @returns {number}
                 */
                get: function () {
                    //var jsongData = RES.getRes("actor_json_" + this.gameData.id);
                    //console.log("directionTexture key=" + ("actor_json_" + this.gameData.id) + ", data=" + jsongData)
                    //if (jsongData){
                    //
                    //}
                    this.gameData._directionMirror = false;
                    var result = this.gameData._direction;
                    if (result == 8) {
                        result = 2;
                        this.gameData._directionMirror = true;
                    }
                    else if (result == 6) {
                        result = 4;
                        this.gameData._directionMirror = true;
                    }
                    else if (result == 7) {
                        result = 3;
                        this.gameData._directionMirror = true;
                    }
                    else if (result == 1 || result == 5) {
                        result = 3;
                        this.gameData._directionMirror = true;
                    }
                    return result;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActorCtrl.prototype, "gameState", {
                get: function () {
                    return this._gameData._gameState;
                },
                set: function (state) {
                    //console.log("ctrl.gameState111" + state)
                    if (this._gameData._gameState != state) {
                        //console.log("ctrl.gameState2222" + state)
                        this._gameData._gameState = state;
                        this._actorTextureIndex = 0;
                        this.initTextureRuntimeData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            return ActorCtrl;
        }());
        rpg.ActorCtrl = ActorCtrl;
        __reflect(ActorCtrl.prototype, "easy.rpg.ActorCtrl");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
