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
        var Scene = (function (_super) {
            __extends(Scene, _super);
            //地图之上,人物之下的一个层次
            //private _overMapContainer:DisplayObjectContainer = new DisplayObjectContainer();
            function Scene(mapInfo) {
                var _this = _super.call(this) || this;
                _this.controls = []; //在场景中的所有对象
                _this.displayControls = []; //需要显示渲染的列表
                _this.map = null; //地图显示
                _this.camera = null; //摄像视图
                _this._displayContainer = null; //显示渲染对象的层
                _this._effectContainer = null; //显示特效的层,和map一样大小
                //场景预设定的长宽
                _this.sceneWidth = 0;
                _this.sceneHeight = 0;
                /**************************************************
                 **********          显示渲染相关         **********
                 **************************************************/
                /**
                 * 呼吸
                 */
                _this._siftCount = 0;
                //深度排序
                _this.depthCount = 0;
                _this.setMapInfo(mapInfo);
                _this.touchEnabled = true;
                _this.showBg = true;
                _this.touchNonePixel = true;
                return _this;
            }
            Scene.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this._displayContainer = new easy.BaseGroup();
                this.addChild(this._displayContainer);
                this._displayContainer.x = 0;
                this._displayContainer.y = 0;
                this.touchEnabled = true;
            };
            //初始化地图信息
            Scene.prototype.setMapInfo = function (mapInfo) {
                console.log("Scene setMapInfo id=" + mapInfo.id);
                this.map = easy.ObjectPool.getObject("map_" + mapInfo.id, false);
                if (!this.map) {
                    this.map = new rpg.Map(mapInfo);
                    easy.ObjectPool.setObject("map_" + this.map._id, this.map);
                    //设置场景的可视范围
                    if (this.camera == null) {
                        this.camera = new easy.rpg.Camera(this);
                    }
                    this.camera.setMap(this.map);
                    //设置场景的大小
                    this.sceneWidth = mapInfo.scene_width;
                    this.sceneHeight = mapInfo.scene_height;
                }
                this.addChildAt(this.map, 0);
            };
            /**
             * 添加角色
             * @param actor
             */
            Scene.prototype.addActor = function (actor) {
                this.controls.push(actor._ctrl);
            };
            /**
             * 添加特效
             * 会添加到特效层
             * 驱动和消失,都由AnimateManager的动画对象来控制,这里只是负责显示
             */
            Scene.prototype.addAnimate = function (animate) {
                if (this._effectContainer == null) {
                    this._effectContainer = new easy.BaseGroup();
                    this.addChild(this._effectContainer);
                    this._effectContainer.setSize(this.width, this.height);
                }
                this._effectContainer.addChild(animate.getDisplay());
            };
            /**
             * 根据entity的id,取control对象
             */
            Scene.prototype.getActorById = function (id) {
                for (var i = 0; i < this.controls.length; i++) {
                    if (this.controls[i].id == id) {
                        return this.controls[i];
                    }
                }
                return null;
            };
            /**
             * 进入场景
             */
            Scene.prototype.enter = function () {
                easy.HeartBeat.addListener(this, this.onHeartBeat);
                if (this.map)
                    this.map.enter();
                this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventTouchTap, this, true);
                //console.log("addEventListener TOUCH_TAP");
            };
            /**
             * 出场景
             */
            Scene.prototype.outer = function () {
                if (this.map)
                    this.map.outer();
                //移除呼吸
                easy.HeartBeat.removeListener(this, this.onHeartBeat);
                this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventTouchTap, this, true);
                //console.log("1111111111111111removeEventListener TOUCH_TAP");
                //清除寻路信息
                //移除鼠标点击
                //this.removeEventListener(MouseEvent.CLICK, this.onEventMouseClick);
                //if (this.isGridPath) {
                //    //主城
                //    for (var i:number = this.controls.length - 1; i >= 0 ; i--) {
                //        if (this.controls[i] instanceof CharacterControl) {
                //            (<CharacterControl><any> (this.controls[i])).setPlayerStand();
                //            this.removeChild(this.controls[i].view);
                //        }
                //    }
                //} else {
                //    //战斗
                //    AnimateManager.clearAnimate();//清除所有特效
                //    //清除
                //    this.cleanAllMovieObject();
                //}
                //this.clean();
                //this.onChangeResDownloadToMix();
            };
            /**
             * 清除场景的人物
             */
            Scene.prototype.cleanAllMovieObject = function () {
                //trace("Scene.cleanAllMovieObject()");
                for (var i = this.displayControls.length - 1; i >= 0; i--) {
                    if (this.displayControls[i].actor)
                        this.displayControls[i].actor.removeFromParent();
                }
                this.controls.length = 0;
                this.displayControls.length = 0;
            };
            /**
             * 鼠标点击响应
             */
            Scene.prototype.onEventTouchTap = function (event) {
                //console.log("111111111onEventTouchTap target=" + egret.getQualifiedClassName(event.target) + ", curr.target=" + egret.getQualifiedClassName(event.currentTarget))
                this.camera.onEventMouseClick(event);
            };
            /**
             * 设置地图格子是否可行走
             * @param col 列号, 0开始
             * @param row 行号, 0开始
             * @param value true:可行走, false:不可行走
             *
             */
            Scene.prototype.setMapWalkable = function (col, row, value) {
                //if (this.grid) this.grid.setWalkable(col, row, value);
            };
            Object.defineProperty(Scene.prototype, "cameraFoucs", {
                get: function () {
                    if (this.camera)
                        return this.camera.focusActor;
                    return null;
                },
                /**
                 * 设置摄像头焦点
                 */
                set: function (actor) {
                    if (this.camera)
                        this.camera.focusActor = actor;
                },
                enumerable: true,
                configurable: true
            });
            Scene.prototype.onHeartBeat = function () {
                //console.log("Sence.HB ctrl.lenght=" + this.controls.length);
                var i = 0;
                this._siftCount++;
                if (this._siftCount > 30) {
                    this._siftCount = 0;
                    this.siftDisplayControl();
                }
                var item = null;
                for (i = 0; i < this.controls.length; i++) {
                    item = this.controls[i];
                    item.onHeartBeat();
                    this.map.toScreen(item.gameData._mapXY, item.gameData._screenXY);
                }
                //数值变化
                for (i = 0; i < this.displayControls.length; i++) {
                    item = this.displayControls[i];
                    //if (item.gameData.isInvalidate){
                    //    //console.log("isInvalidate=" + item.id)
                    //    this.onAlphaCheck();
                    //}
                    item.onHBChangeData();
                }
                //深度排序
                this.depthCount++;
                if (this.depthCount >= 30) {
                    this.depthCount = 0;
                    this.depthSortDisplay();
                }
                console.log("Sence.HB displayControls.lenght=" + this.displayControls.length);
            };
            Scene.prototype.depthSortDisplay = function () {
                this.displayControls.sort(this.sortOnPosition);
                var item = null;
                var len = this.displayControls.length;
                for (var i = 0; i < len; i++) {
                    item = this.displayControls[i];
                    if (null == item.actor.parent)
                        item.enter();
                    this._displayContainer.addChild(item.actor);
                }
            };
            //深度交换
            Scene.prototype.sortOnPosition = function (a, b) {
                if (a.gameData.mapXY.y > b.gameData.mapXY.y)
                    return 1;
                if (a.gameData.mapXY.y < b.gameData.mapXY.y)
                    return -1;
                return 0;
            };
            //检测遮挡透明
            Scene.prototype.onAlphaCheck = function () {
                var node = null;
                var length = this.displayControls.length;
                for (var i = 0; i < length; i++) {
                    var item = this.displayControls[i];
                    item.isDisplay = true;
                }
            };
            //筛选可视的显示对象
            Scene.prototype.siftDisplayControl = function () {
                var item = null;
                this.displayControls.length = 0;
                var selectedItem = null;
                //var globalPoint:egret.Point = new egret.Point(GlobalSetting.STAGE.mouseX, GlobalSetting.STAGE.mouseY);
                for (var i = 0; i < this.controls.length; i++) {
                    item = this.controls[i];
                    //item.selected = false;
                    //检测是否在显示区域内
                    if ((item.gameData._screenXY.x > 0 && item.gameData._screenXY.y > 0 && item.gameData._screenXY.x < this.width && item.gameData._screenXY.y < this.height)
                        || (item.gameData._screenXY.x + item.gameData._width / 2 > 0 && item.gameData._screenXY.y + item.gameData._height / 2 > 0 && item.gameData._screenXY.x + item.gameData._width / 2 < this.width && item.gameData._screenXY.y + item.gameData._height / 2 < this.height)) {
                        //console.log("11111")
                        if (rpg.RpgSetting.SHOW_OTHER_PLAYER && item.gameData.type == rpg.RpgSetting.ACTOR_TYPE_PLAYER) {
                            //console.log("22222")
                            this.displayControls.push(item);
                        }
                        else if (item.gameData.type == rpg.RpgSetting.ACTOR_TYPE_NPC) {
                            //console.log("33333")
                            this.displayControls.push(item);
                        }
                        else if (item.actor.parent) {
                            //console.log("44444")
                            //不显示玩家的情况下,玩家要移除
                            item.actor.removeFromParent();
                            item.outer();
                        }
                    }
                    else if (item.actor.parent) {
                        //console.log("55555")
                        item.actor.removeFromParent();
                        item.outer();
                    }
                }
                //if (this.isGridPath && selectedItem) {
                //	selectedItem.selected = true;
                //} else {
                //	Mouse.cursor = MouseCursor.AUTO;
                //}
            };
            /**
             * 获取点击位置的物品列表
             */
            Scene.prototype.getControlUnderPoint = function (xGlobal, yGlobal) {
                if (yGlobal === void 0) { yGlobal = 0; }
                var result = new Array();
                var i = 0;
                for (i = 0; i < this.displayControls.length; i++) {
                    if (this.displayControls[i].actor.hitTestPoint(xGlobal, yGlobal)) {
                        result.push(this.displayControls[i].id);
                    }
                }
                return result;
            };
            /**
             * <p>设置场景大小</p>
             * @param w 宽度
             * @param h 长度
             */
            Scene.prototype.setSize = function (w, h) {
                console.log("Scene.setSize(" + w + ", " + h + ")");
                _super.prototype.setSize.call(this, w, h);
                if (this.camera)
                    this.camera.setSize(w, h);
                this._displayContainer.setSize(w, h);
                if (this._effectContainer)
                    this._effectContainer.setSize(w, h);
            };
            /**
             * 设置地图位移坐标值
             * 在副本战斗中按固定尺寸冻结视图中使用
             * @param offset 地图偏移的坐标值
             */
            //        public setMapOffset(offset:Point):void {
            //            if (offset) {
            ////                trace("Scene.setMapOffset(offset) x=" + offset.x + ", y=" + offset.y);
            //                this.map.offsetMap = offset;
            //            } else {
            ////                trace("Scene.setMapOffset(offset) offset=null");
            //                this.map.offsetMap.x = 0 ;
            //                this.map.offsetMap.y = 0 ;
            //            }
            //        }
            //
            //        public get isGridPath():boolean {
            //            return this._isGridPath;
            //        }
            //
            //        public set isGridPath(value:boolean) {
            //            this._isGridPath = value;
            //        }
            /**
             * 显示地图格子
             */
            Scene.prototype.showGrid = function () {
                //if (this.grid && this.map)this.map.showGrid(this.grid);
            };
            //public getMapBitmapData():BitmapData {
            //    return this.map.getCurrentBitmapData();
            //}
            Scene.prototype.findPath = function (source, target) {
                //console.log("Scene findPath");
                return this.map.findPath(source, target);
            };
            return Scene;
        }(easy.ReceiveGroup));
        rpg.Scene = Scene;
        __reflect(Scene.prototype, "easy.rpg.Scene");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
