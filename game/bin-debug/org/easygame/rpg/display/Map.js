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
        var Map = (function (_super) {
            __extends(Map, _super);
            function Map(mapInfo) {
                var _this = _super.call(this) || this;
                _this._id = 0;
                _this._mapId = 0; //地图id
                _this._mapWidth = 0; //地图宽
                _this._mapHeight = 0; //地图高
                _this._sceneWidth = 0; //场景宽
                _this._sceneHeight1 = 0; //场景高
                _this._type = ".jpg"; //图片类型
                _this._row = 0;
                _this._column = 0;
                _this._hCircle = 0; //横向下载的圈数
                _this._vCircle = 0; //纵向下载的圈数
                _this._blockWidth = 0;
                _this._blockHeight = 0;
                _this._enterPoint = null;
                _this._info = null;
                _this._cameraRect = null;
                _this._gridShape = null;
                _this._cellSize = 20;
                _this._thumbReady = false; //缩略图是否准备完毕
                _this.offsetMap = null; //地图坐标偏移值,在冻结视图状态使用
                _this.astar = null;
                _this.grid = null;
                _this.cellSize = 25;
                _this._isDisplay = false; //处于显示状态
                _this._bitmapContainer = null; //显示对象容器
                _this._bitmap = null;
                _this.offsetMap = new egret.Point();
                _this._cameraRect = new egret.Rectangle();
                _this._bitmapContainer = new egret.DisplayObjectContainer();
                _this.addChild(_this._bitmapContainer);
                _this._bitmap = new egret.Bitmap();
                _this._bitmapContainer.addChild(_this._bitmap);
                _this._bitmapContainer.scrollRect = _this._cameraRect;
                _this._enterPoint = new egret.Point();
                //初始化数据
                _this.setMapInfo(mapInfo);
                _this.showBg = false;
                _this.touchEnabled = false;
                return _this;
            }
            /**
             * 设置地图的数据
             * @param mapInfo
             */
            Map.prototype.setMapInfo = function (mapInfo) {
                if (mapInfo) {
                    this._info = mapInfo;
                    this._id = mapInfo.id;
                    this._mapId = mapInfo.map;
                    this._mapWidth = parseInt(mapInfo.width);
                    this._mapHeight = parseInt(mapInfo.height);
                    this._sceneWidth = parseInt(mapInfo.scene_width);
                    //this._sceneHeight = parseInt(mapInfo.scene_height);
                    this._row = mapInfo.row;
                    this._column = mapInfo.column;
                    this._enterPoint.x = mapInfo.x;
                    this._enterPoint.y = mapInfo.y;
                    //this._cellSize = mapInfo.cell;
                    //this._blockWidth = mapInfo.blockWidth;
                    //this._blockHeight = mapInfo.blockHeight;
                    this._bitmapContainer.width = this._mapWidth;
                    this._bitmapContainer.height = this._mapHeight;
                    this._bitmap.texture = RES.getRes("map_img_" + this._mapId);
                    //设置寻路点信息
                    this.grid = easy.ObjectPool.getObject("map_grid_" + mapInfo.id, false);
                    //console.log("map grid=" + this.grid);
                    if (!this.grid) {
                        var gridDef = RES.getRes("map_grid_" + mapInfo.id);
                        if (gridDef) {
                            this.cellSize = gridDef.cell;
                            //console.log("map gridDef=" + gridDef + ", cell=" + this.cellSize);
                            this.grid = new rpg.Grid(gridDef.grid, this.cellSize);
                            this.grid.calculateLinks();
                            easy.ObjectPool.setObject("map_grid_" + mapInfo.id, this.grid);
                        }
                    }
                    if (this.astar == null)
                        this.astar = new easy.rpg.AStar();
                }
            };
            /**
             * 增量移动摄像头
             */
            Map.prototype.moveCameraStep = function (xValue, yValue) {
                //console.log("map moveCameraStep xValue=" + xValue + ", yValue=" + yValue);
                if (xValue != 0) {
                    this._cameraRect.x += xValue;
                    if (this._cameraRect.x < 0)
                        this._cameraRect.x = 0;
                    if (this._cameraRect.x + this._cameraRect.width > this._bitmapContainer.width)
                        this._cameraRect.x = this._bitmapContainer.width - this._cameraRect.width;
                }
                if (yValue != 0) {
                    this._cameraRect.y += yValue;
                    if (this._cameraRect.y < 0)
                        this._cameraRect.y = 0;
                    if (this._cameraRect.y + this._cameraRect.height > this._bitmapContainer.height)
                        this._cameraRect.y = this._bitmapContainer.height - this._cameraRect.height;
                }
                //console.log("map moveCameraStep con.x=" + this._bitmapContainer.x + ", con.y=" + this._bitmapContainer.y + ", rect.x=" + this._cameraRect.x + ", rect.y=" + this._cameraRect.y + ", rect.w=" + this._cameraRect.width + ", rect.h=" + this._cameraRect.height)
                //this.showCameraMap();
            };
            /**
             * 移动摄像头
             */
            Map.prototype.moveCamera = function (x, y) {
                if (x != 0) {
                    this._cameraRect.x = x;
                    if (this._cameraRect.x < 0)
                        this._cameraRect.x = 0;
                    if (this._cameraRect.x + this._cameraRect.width > this._bitmapContainer.width)
                        this._cameraRect.x = this._bitmapContainer.width - this._cameraRect.width;
                }
                if (y != 0) {
                    this._cameraRect.y = y;
                    if (this._cameraRect.y < 0)
                        this._cameraRect.y = 0;
                    if (this._cameraRect.y + this._cameraRect.height > this._bitmapContainer.height)
                        this._cameraRect.y = this._bitmapContainer.height - this._cameraRect.height;
                }
                //this.console.log("MapDisplay.moveCamera(" + this._cameraRect.x + ", " + this._cameraRect.x + ")");
            };
            /**
             * 设置摄像跟踪数据
             */
            Map.prototype.setCamera = function (w, h, point) {
                if (point === void 0) { point = null; }
                //if (!egret.NumberUtils.isNumber(w)) {
                //    //console.log("Map.setCamera widht is not a number!!!!");
                //}
                //if (!egret.NumberUtils.isNumber(h)) {
                //    console.log("Map.setCamera height is not a number!!!!");
                //}
                this._cameraRect.width = w;
                this._cameraRect.height = h;
                //console.log("Map.setCamera(" + this._cameraRect.width +", " + this._cameraRect.height + ")");
                if (point) {
                    this.enterPoint = point;
                }
                else {
                    this.enterPoint = this.enterPoint;
                }
                //this._hCircle = Math.ceil((this._cameraRect.height/2)/this._blockHeight) + 1;
                //this._vCircle = Math.ceil((this._cameraRect.width/2)/this._blockWidth) + 1;
            };
            Object.defineProperty(Map.prototype, "enterPoint", {
                get: function () {
                    return this._enterPoint;
                },
                /**
                 * 设置地图进入点
                 */
                set: function (enterValue) {
                    if (enterValue)
                        this._enterPoint = enterValue;
                    if (this._cameraRect.width == 0 || this._cameraRect.height == 0)
                        return;
                    var xPoint = this._enterPoint.x - this._cameraRect.width / 2;
                    var yPoint = this._enterPoint.y - this._cameraRect.height / 2;
                    if (xPoint < 0)
                        xPoint = 0;
                    if (yPoint < 0)
                        yPoint = 0;
                    if (xPoint > this._mapWidth - this._cameraRect.width)
                        xPoint = this._mapWidth - this._cameraRect.width;
                    if (yPoint > this._mapHeight - this._cameraRect.height)
                        yPoint = this._mapHeight - this._cameraRect.height;
                    this.moveCamera(xPoint, yPoint);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Map.prototype, "cameraRect", {
                /**
                 * 摄像头显示区域以及坐标
                 */
                get: function () {
                    return this._cameraRect;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Map.prototype, "mapHeight", {
                /**
                 * 地图总高度
                 */
                get: function () {
                    return this._mapHeight;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Map.prototype, "mapWidth", {
                /**
                 * 地图总宽度
                 */
                get: function () {
                    return this._mapWidth;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 把map坐标转换成屏幕坐标
             * @param point map坐标值
             */
            Map.prototype.toScreen = function (point, targetPoint) {
                targetPoint.x = point.x - this._cameraRect.x + this.offsetMap.x;
                targetPoint.y = point.y - this._cameraRect.y + this.offsetMap.y;
            };
            /**
             * 由屏幕左边转换成地图坐标
             * @param x 屏幕x坐标值
             * @param y 屏幕y坐标值
             */
            Map.prototype.toMap = function (x, y, targetPoint) {
                var xpos = this._cameraRect.x + x;
                var ypos = this._cameraRect.y + y;
                xpos = Math.min(xpos, this.mapWidth);
                ypos = Math.min(ypos, this.mapHeight);
                if (targetPoint != null) {
                    targetPoint.x = xpos;
                    targetPoint.y = ypos;
                    return targetPoint;
                }
                return new egret.Point(xpos, ypos);
            };
            /**
             * 显示格子号
             */
            Map.prototype.showGrid = function (grid) {
                if (this._gridShape == null) {
                    this._gridShape = new egret.Shape();
                    this._gridShape.x = 0;
                    this._gridShape.y = 0;
                }
                this._gridShape.graphics.clear();
                this._gridShape.graphics.lineStyle(1, 0x30ff60, 0.5);
                var gridRow = Math.round(this._mapHeight / this._cellSize);
                var gridColumn = Math.round(this._mapWidth / this._cellSize);
                var i = 0;
                var j = 0;
                for (i = 0; i < gridRow; i++) {
                    //划线
                    this._gridShape.graphics.moveTo(0, i * this._cellSize);
                    this._gridShape.graphics.lineTo(this._mapWidth, i * this._cellSize);
                }
                for (j = 0; j < gridColumn; j++) {
                    //划线
                    this._gridShape.graphics.moveTo(j * this._cellSize, 0);
                    this._gridShape.graphics.lineTo(j * this._cellSize, this._mapHeight);
                }
                for (i = 0; i < gridColumn; i++) {
                    for (j = 0; j < gridRow; j++) {
                        //写字
                        if (grid.getNode(i, j).walkable) {
                            if (grid.getNode(i, j).data == 1) {
                                this._gridShape.graphics.moveTo(i * this._cellSize + this._cellSize / 2, j * this._cellSize + this._cellSize / 2 - 1);
                                this._gridShape.graphics.lineTo(i * this._cellSize + this._cellSize / 2, j * this._cellSize + this._cellSize / 2 + 1);
                            }
                            else {
                                var textField = new egret.TextField();
                                textField.text = "" + grid.getNode(i, j).data;
                                textField.width = this._cellSize;
                                textField.height = this._cellSize;
                            }
                        }
                        else {
                            this._gridShape.graphics.beginFill(0x00f0f0, 0.3);
                            this._gridShape.graphics.drawRect(i * this._cellSize, j * this._cellSize, this._cellSize, this._cellSize);
                            this._gridShape.graphics.endFill();
                        }
                    }
                }
                this._gridShape.graphics.endFill();
                this._gridShape.width = this._mapWidth;
                this._gridShape.height = this._mapHeight;
                this._bitmapContainer.addChild(this._gridShape);
            };
            Object.defineProperty(Map.prototype, "mapId", {
                get: function () {
                    return this._mapId;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 进入场景
             */
            Map.prototype.enter = function () {
                this._isDisplay = true;
            };
            /**
             * 出场景
             */
            Map.prototype.outer = function () {
                this._isDisplay = false;
            };
            //测试路径时候通过
            Map.prototype.findPath = function (source, target) {
                if (source.x == target.x && source.y == target.y) {
                    return null;
                }
                var startNode = this.getNode(source);
                var endNode = this.getNode(target);
                var targetPoint = target;
                var srcPoint = source;
                if (!startNode.walkable) {
                    startNode = this.getNearShortNode(startNode);
                    if (startNode)
                        srcPoint = startNode.point;
                }
                if (!endNode.walkable) {
                    endNode = this.getNearShortNode(endNode, srcPoint);
                    if (endNode)
                        targetPoint = endNode.point;
                }
                if (endNode.walkable) {
                    this.grid.setStartNode(startNode.row, startNode.column);
                    this.grid.setEndNode(endNode.row, endNode.column);
                    if (this.astar.findPath(this.grid)) {
                        //平滑处理
                        return this.floydPath(srcPoint, targetPoint, this.astar.path);
                    }
                }
                return null;
            };
            /**
             * 查找最近的可行走的格子
             * srcNode 目标格子
             * testPoint 测量距离的point
             * @return
             */
            Map.prototype.getNearShortNode = function (srcNode, testPoint) {
                if (testPoint === void 0) { testPoint = null; }
                if (!srcNode.walkable) {
                    //计算最近的格子
                    var loopMax = 50; //最多循环100次
                    var loopIndex = 0;
                    var xOrg = srcNode.row;
                    var yOrg = srcNode.column;
                    var nodeFound = new Array();
                    var tempNode = null;
                    while (loopIndex < loopMax) {
                        loopIndex++;
                        if ((xOrg - loopIndex) >= 0) {
                            if ((yOrg - loopIndex) >= 0)
                                tempNode = this.grid.getNode(xOrg - loopIndex, yOrg - loopIndex);
                            if (srcNode.walkable)
                                nodeFound.push(tempNode);
                            tempNode = this.grid.getNode(xOrg - loopIndex, yOrg);
                            if (tempNode.walkable)
                                nodeFound.push(tempNode);
                            if ((yOrg + loopIndex) < this.grid.numRows)
                                tempNode = this.grid.getNode(xOrg - loopIndex, yOrg + loopIndex);
                            if (tempNode.walkable)
                                nodeFound.push(tempNode);
                        }
                        if ((yOrg + loopIndex) < this.grid.numRows)
                            tempNode = this.grid.getNode(xOrg, yOrg + loopIndex);
                        if (tempNode.walkable)
                            nodeFound.push(tempNode);
                        if ((xOrg + loopIndex) < this.grid.numCols) {
                            if ((yOrg - loopIndex) >= 0)
                                tempNode = this.grid.getNode(xOrg + loopIndex, yOrg - loopIndex);
                            if (tempNode.walkable)
                                nodeFound.push(tempNode);
                            tempNode = this.grid.getNode(xOrg + loopIndex, yOrg);
                            if (tempNode.walkable)
                                nodeFound.push(tempNode);
                            if ((yOrg + loopIndex) < this.grid.numRows)
                                tempNode = this.grid.getNode(xOrg + loopIndex, yOrg + loopIndex);
                            if (tempNode.walkable)
                                nodeFound.push(tempNode);
                        }
                        if ((yOrg - loopIndex) >= 0)
                            tempNode = this.grid.getNode(xOrg, yOrg - loopIndex);
                        if (tempNode.walkable)
                            nodeFound.push(tempNode);
                        if (nodeFound.length > 0)
                            break;
                    }
                    //测试找到的路点,测量和玩家的直线距离,最近的那个点就是要寻路行走的点
                    var distanceOld = 0;
                    var distanceNew = 0;
                    var targetPoint = testPoint;
                    tempNode = null;
                    if (testPoint == null)
                        targetPoint = srcNode.point;
                    for (var i = 0; i < nodeFound.length; i++) {
                        distanceNew = egret.Point.distance(targetPoint, new egret.Point(nodeFound[i].row, nodeFound[i].column));
                        if (distanceOld == 0) {
                            distanceOld = distanceNew;
                        }
                        if (distanceNew <= distanceOld)
                            tempNode = nodeFound[i];
                    }
                    return tempNode;
                }
                return srcNode;
            };
            Map.prototype.floydPath = function (source, target, nodes) {
                /** 弗洛伊德路径平滑处理 **/
                var floydPath = nodes.concat();
                var len = floydPath.length;
                var i = 0;
                if (len > 2) {
                    //遍历路径数组中全部路径节点，合并在同一直线上的路径节点
                    //假设有1,2,3,三点，若2与1的横、纵坐标差值分别与3与2的横、纵坐标差值相等则
                    //判断此三点共线，此时可以删除中间点2
                    var vector = new rpg.Node(0, 0, 1);
                    var tempVector = new rpg.Node(0, 0, 1);
                    this.floydVector(vector, floydPath[len - 1], floydPath[len - 2]);
                    for (i = len - 3; i >= 0; i--) {
                        this.floydVector(tempVector, floydPath[i + 1], floydPath[i]);
                        if (vector.row == tempVector.row && vector.column == tempVector.column) {
                            floydPath.splice(i + 1, 1);
                        }
                        else {
                            vector.row = tempVector.row;
                            vector.column = tempVector.column;
                        }
                    }
                }
                len = floydPath.length;
                //合并共线节点后进行第二步，消除拐点操作。算法流程如下：
                //使用两点之间的样本数值,不停的测试直线上的节点是不是可行走区域
                if (len > 2) {
                    for (i = len - 3; i >= 0; i--) {
                        if (!this.hasBarrier(floydPath[i + 2], floydPath[i])) {
                            floydPath.splice(i + 1, 1);
                        }
                    }
                }
                var result = new Array();
                result.push(source);
                for (i = 1; i < floydPath.length - 1; i++) {
                    result.push(floydPath[i].point);
                }
                result.push(target);
                floydPath.length = 0;
                return result;
            };
            /**
             * 判断两节点之间是否存在障碍物
             * @param node1
             * @param node2
             * @return
             */
            Map.prototype.hasBarrier = function (node1, node2) {
                var d = Math.abs(egret.Point.distance(node1.point, node2.point));
                var index = 1;
                var grid = this.cellSize / 2;
                var gridPoint = null;
                var gridNode = null;
                //取样点
                //while(index*grid<d){
                //    gridPoint = egret.Point.interpolate(node1.point, node2.point, index*grid/d);
                //    gridNode = this.getNode(gridPoint);
                //    if (!gridNode.walkable) return true;
                //    index ++;
                //}
                return false;
            };
            Map.prototype.floydVector = function (target, n1, n2) {
                target.row = n1.row - n2.row;
                target.column = n1.column - n2.column;
            };
            //路点格子
            Map.prototype.getNode = function (mapPoint) {
                var xpos = Math.floor(mapPoint.x / this.cellSize);
                var ypos = Math.floor(mapPoint.y / this.cellSize);
                xpos = Math.min(xpos, this.grid.numCols - 1);
                xpos = Math.max(xpos, 0);
                ypos = Math.min(ypos, this.grid.numRows - 1);
                ypos = Math.max(ypos, 0);
                return this.grid.getNode(xpos, ypos);
            };
            return Map;
        }(easy.Group));
        rpg.Map = Map;
        __reflect(Map.prototype, "easy.rpg.Map");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
