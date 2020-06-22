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
        var Camera = (function () {
            function Camera(scene) {
                /**
                 *
                 * ---------------------------------------
                 * |                                      |
                 * |   -------------------------------    |
                 * |   |                             |    |
                 * |   |   -----------------------   |    |
                 * |   |   |                     |   |    |
                 * |   |   |     ___________     |   |    |
                 * |   |   |    |           |    |   |    |
                 * |   |   |    | | focus | |    |   |    |
                 * |   |   |    | |___|___| |    |   |    |
                 * |   |   |    |___________|    |   |    |
                 * |   |   |      walk rect      |   |    |
                 * |   |   |_____________________|   |    |
                 * |   |                             |    |
                 * |   |          camera rect        |    |
                 * |   |_____________________________|    |
                 * |                                      |
                 * |            sence rect                |
                 * |______________________________________|
                 *
                 *
                 * 方向定义:
                 *
                 *        [0]
                 *     [7]    [1]
                 *   [6]        [2]
                 *     [5]    [3]
                 *        [4]
                 */
                //        private var _walkRect:Rectangle = new Rectangle();//主视图中焦点可自由走动的区域
                this._focusActor = null; //镜头焦点对象
                this._map = null; //地图对象
                this._scene = null;
                //        /**
                //         * 呼吸
                //         */
                //        public onHeartBeat():void {
                //            if (this.focusActor) {
                //                if (this.focusActor._ctrl.gameData._gameState == RpgSetting.ACTOR_STD) {
                //                    if (this.reachTargetTalking && this.reachTargetTalking.length > 0) this.checkTalking();
                //                }
                //            } else {
                //                //无关注对象,直接移动地图
                ////                this._map.moveCameraStep(_focusView.characterControl.characterData.speed.x, _focusView.characterControl.characterData.speed.y);
                //            }
                //            //运算其他人多屏幕坐标变换
                //            //this.calculateAllOtherScreenCharacterScreenXY();
                //        }
                this.reachTargetTalking = null;
                this._scene = scene;
            }
            Camera.prototype.setMap = function (map) {
                this._map = map;
                //this.calculateWalkRect();//计算行走区域
            };
            Camera.prototype.setSize = function (w, h) {
                console.log("Camera.setSize(" + w + ", " + h + ")");
                //if (this.focusActor)this.calculateCharacterScreenXY(this.focusActor._ctrl);
                if (this._map)
                    this._map.setCamera(w, h);
            };
            Object.defineProperty(Camera.prototype, "focusActor", {
                /**
                 * 镜头焦点
                 */
                get: function () {
                    return this._focusActor;
                },
                /**
                 * 设置摄像头跟随的对象
                 */
                set: function (value) {
                    if (this._focusActor) {
                        this._focusActor._ctrl.moveMapStepCallBackFunc = null;
                        this._focusActor._ctrl.moveMapStepCallBackThis = null;
                    }
                    this._focusActor = value;
                    if (this._focusActor) {
                        this._focusActor._ctrl.moveMapStepCallBackFunc = this.onMoveFocus;
                        this._focusActor._ctrl.moveMapStepCallBackThis = this;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Camera.prototype.checkTalking = function () {
                //if (this.reachTargetTalking && this.reachTargetTalking.length > 0){
                //    for (var i:number = 0; i < this.reachTargetTalking.length; i++) {
                //        var myEvent:MyEvent = EventManager.getEvent(EventType.SCENE_NPC_TALKING);
                //        myEvent.setItem("npc", this.reachTargetTalking[i]);
                //        myEvent.send();
                //    }
                //    this.reachTargetTalking.length = 0;
                //}
            };
            /**
             * 响应鼠标点击
             */
            Camera.prototype.onEventMouseClick = function (event) {
                //console.log("onEventMouseClick")
                if (this._focusActor) {
                    //显示鼠标点击位置
                    //this.reachTargetTalking = this._scene.getControlUnderPoint(event.stageX, event.stageY);
                    var targetPoint = this._map.toMap(event.localX, event.localY);
                    ////指向标
                    ////this._cursorGuide.swfControl.swfData.mapXY.x = targetPoint.x;
                    ////this._cursorGuide.swfControl.swfData.mapXY.y = targetPoint.y;
                    ////this._cursorGuide.swfControl.play();
                    ////如果有选中npc,直接走到改npc面前,朝前一个格子 +15
                    //var eventUser:MyEvent = MyEvent.getEvent(EventType.SCENE_USER_TALKING);
                    //var userTalked:boolean = false;
                    //var targetCtrl:BaseControl = null;
                    //if (this.reachTargetTalking && this.reachTargetTalking.length > 0){
                    //    for (var i:number = this.reachTargetTalking.length - 1; i >= 0; i--) {
                    //        targetCtrl = this._scene.getControlById(this.reachTargetTalking[i]);
                    //        if (targetCtrl instanceof CharacterControl) {
                    //            eventUser.addItem("id", this.reachTargetTalking[i]);
                    //            //trace("user talking id=" + this.reachTargetTalking[i]);
                    //            eventUser.send();
                    //            userTalked = true;
                    //            break;
                    //        }
                    //    }
                    //}
                    //if (!userTalked){
                    //    eventUser.addItem("id", null);
                    //    eventUser.send();
                    //}
                    var resultPath = this._scene.findPath(this._focusActor._ctrl.gameData._mapXY, targetPoint);
                    //console.log("result.path=" + resultPath.length)
                    //设置行走状态
                    if (resultPath && resultPath.length > 1) {
                        this._focusActor._ctrl.setPath(resultPath);
                    }
                    else {
                    }
                }
            };
            /**
             * 对关注对象进行移动计算
             *          n
             *      wn     ne
             *    w           e
             *      sw     es
             *          s
             *
             *        [1]
             *     [2]    [8]
             *   [3]        [7]
             *     [4]    [6]
             *        [5]
             */
            Camera.prototype.onMoveFocus = function (xValue, yValue) {
                if (this._focusActor == null)
                    return;
                var xStep = 0;
                var yStep = 0;
                //计算x轴
                if (xValue > 0) {
                    if ((this._map.cameraRect.x + this._map.cameraRect.width + xValue) > this._map.mapWidth) {
                        //计算裁剪部分
                        xStep = this._map.mapWidth - this._map.cameraRect.x - this._map.cameraRect.width;
                    }
                    else {
                        //计算人时候要运动到中心点
                        if (this._focusActor._ctrl.gameData._screenXY.x > this._map.cameraRect.width / 2) {
                            if (this._focusActor._ctrl.gameData._screenXY.x - this._map.cameraRect.width / 2 > xValue) {
                                xStep = xValue;
                            }
                            else {
                                xStep = this._focusActor._ctrl.gameData._screenXY.x - this._map.cameraRect.width / 2;
                            }
                        }
                        else if (this._focusActor._ctrl.gameData._screenXY.x < this._map.cameraRect.width / 2) {
                            if (this._map.cameraRect.width / 2 - this._focusActor._ctrl.gameData._screenXY.x > xValue) {
                                xStep = 0;
                            }
                            else {
                                xStep = this._map.cameraRect.width / 2 - this._focusActor._ctrl.gameData._screenXY.x;
                            }
                        }
                    }
                }
                else {
                    if ((this._map.cameraRect.x + xValue) < 0) {
                        //计算裁剪部分
                        xStep = 0 - this._map.cameraRect.x;
                    }
                    else {
                        //计算人时候要运动到中心点
                        if (this._focusActor._ctrl.gameData._screenXY.x > this._map.cameraRect.width / 2) {
                            if (this._focusActor._ctrl.gameData._screenXY.x - this._map.cameraRect.width / 2 > xValue) {
                                xStep = 0;
                            }
                            else {
                                xStep = this._focusActor._ctrl.gameData._screenXY.x - this._map.cameraRect.width / 2;
                            }
                        }
                        else if (this._focusActor._ctrl.gameData._screenXY.x < this._map.cameraRect.width / 2) {
                            if (this._map.cameraRect.width / 2 - this._focusActor._ctrl.gameData._screenXY.x > xValue) {
                                xStep = xValue;
                            }
                            else {
                                xStep = this._map.cameraRect.width / 2 - this._focusActor._ctrl.gameData._screenXY.x;
                            }
                        }
                    }
                }
                //计算Y轴
                if (yValue < 0) {
                    if (this._map.cameraRect.y + yValue < 0) {
                        yStep = 0 - this._map.cameraRect.y;
                    }
                    else {
                        //计算人时候要运动到中心点
                        if (this._focusActor._ctrl.gameData._screenXY.y > this._map.cameraRect.height / 2) {
                            if (this._map.cameraRect.height / 2 - this._focusActor._ctrl.gameData._screenXY.y < yValue) {
                                yStep = 0;
                            }
                            else {
                                yStep = this._map.cameraRect.height / 2 - this._focusActor._ctrl.gameData._screenXY.y;
                            }
                        }
                        else if (this._focusActor._ctrl.gameData._screenXY.y < this._map.cameraRect.height / 2) {
                            if (this._focusActor._ctrl.gameData._screenXY.y - this._map.cameraRect.height / 2 < yValue) {
                                yStep = yValue;
                            }
                            else {
                                yStep = this._focusActor._ctrl.gameData._screenXY.y - this._map.cameraRect.height / 2;
                            }
                        }
                    }
                }
                else {
                    if ((this._map.cameraRect.y + this._map.cameraRect.height + yValue) > this._map.mapHeight) {
                        yStep = this._map.mapHeight - this._map.cameraRect.y - this._map.cameraRect.height;
                    }
                    else {
                        //计算人时候要运动到中心点
                        if (this._focusActor._ctrl.gameData._screenXY.y > this._map.cameraRect.height / 2) {
                            if (this._focusActor._ctrl.gameData._screenXY.y - this._map.cameraRect.height / 2 > yValue) {
                                yStep = yValue;
                            }
                            else {
                                yStep = this._focusActor._ctrl.gameData._screenXY.y - this._map.cameraRect.height / 2;
                            }
                        }
                        else if (this._focusActor._ctrl.gameData._screenXY.y < this._map.cameraRect.height / 2) {
                            if (this._map.cameraRect.height / 2 - this._focusActor._ctrl.gameData._screenXY.y > yValue) {
                                yStep = 0;
                            }
                            else {
                                yStep = this._map.cameraRect.height / 2 - this._focusActor._ctrl.gameData._screenXY.y;
                            }
                        }
                    }
                }
                if (xStep != 0 || yStep != 0) {
                    this._map.moveCameraStep(Math.round(xStep * 100) / 100, Math.round(yStep * 100) / 100);
                }
            };
            //        private calculateAllOtherScreenCharacterScreenXY():void {
            //            for (var i:number = 0; i < this._scene.controls.length; i++) {
            ////                if (this._focusView == null || this._scene.controls[i] != this._focusView.control)
            //                    this.calculateCharacterScreenXY(this._scene.controls[i]);
            //            }
            //        }
            //        //计算,刷新Character的屏幕坐标,并保存,以便外部根据这个数据刷新显示
            //        private calculateCharacterScreenXY(control:ActorCtrl):void {
            //            if (this._map){
            //                this._map.toScreen(control.gameData.mapXY, control.gameData._screenXY);
            ////                trace("screenXY.x="+control.data.screenXY.x);
            ////                trace("screenXY.y="+control.data.screenXY.y);
            //            }
            //        }
            /**
             * 测试内嵌的物体x,y是否越界
             * @param embed 要测试的是否包含的group
             * @param container 容器的区域大小
             * @return 返回point,标识x,y的情况,0标识没有越界,1标识越界
             */
            Camera.prototype.checkRectEmbed = function (embed, container) {
                var result = new egret.Point(0, 0);
                if (embed.x < container.x || (embed.x + embed.width) > (container.x + container.width)) {
                    result.x = 1;
                }
                if (embed.y < container.y || (embed.y + embed.height) > (container.y + container.height)) {
                    result.y = 1;
                }
                return result;
            };
            Camera.prototype.checkPointEmbed = function (embed, container) {
                var result = new egret.Point(0, 0);
                if (embed.x < container.x || embed.x > (container.x + container.width)) {
                    result.x = 1;
                }
                if (embed.y < container.y || embed.y > (container.y + container.height)) {
                    result.y = 1;
                }
                return result;
            };
            Object.defineProperty(Camera.prototype, "direction", {
                set: function (value) {
                    if (this._focusActor)
                        this._focusActor._ctrl.direction = value;
                },
                enumerable: true,
                configurable: true
            });
            return Camera;
        }());
        //private _cursorGuide:SwfDisplay = null;
        /**
         * 是否需要重新裁剪
         */
        Camera.isCutout = false;
        rpg.Camera = Camera;
        __reflect(Camera.prototype, "easy.rpg.Camera");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
