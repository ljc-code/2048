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
    /**
     * 集中ui操作的一些常用方法
     */
    var SpriteUtils = (function () {
        function SpriteUtils() {
        }
        /**
         * 用target的图形,在src的图形上镂空/擦除,返回擦除后的材质
         * @param src
         * @param target
         */
        SpriteUtils.drawErase = function (src, target) {
            var container = new egret.DisplayObjectContainer();
            target.blendMode = egret.BlendMode.ERASE;
            container.addChild(src);
            container.addChild(target);
            //绘制成材质
            var texture2 = new egret.RenderTexture();
            texture2.drawToTexture(container);
            //回收对象
            container.removeChildren();
            //easy.ObjectPool.recycleClass(container);
            //easy.ObjectPool.recycleClass(targetImg, "earse");
            return texture2;
        };
        /**
         * 初始化擦除
         * @param object  擦除对象
         * @param limitCheck 擦除临界值
         * @param gapX 检测区域小格子宽度
         * @param gapY 检测区域小格子高度
         * @param lineWeight 涂抹宽度
         */
        SpriteUtils.erase = function (object, limitCheck, gapX, gapY, lineWeight) {
            if (limitCheck === void 0) { limitCheck = 0; }
            if (gapX === void 0) { gapX = 5; }
            if (gapY === void 0) { gapY = 5; }
            if (lineWeight === void 0) { lineWeight = 40; }
            this._eraseShape = new egret.Shape();
            this._sendEraseChangeArray = [95, 90, 85, 80, 70, 60, 50];
            this._hasComplete = false;
            this._eraseObject = object;
            this._eraseTexture = object.texture;
            this._eraseLineWeight = lineWeight;
            this._gapX = gapX;
            this._gapY = gapY;
            if (limitCheck)
                this._limitCheckNum = limitCheck;
            object.touchEnabled = true;
            object.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginDraw, this);
            object.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveDraw, this);
            object.addEventListener(egret.TouchEvent.TOUCH_END, this.onToucchEndDrawCircle, this);
            this.createAllRect();
        };
        /**
         * 创建检测区域
         */
        SpriteUtils.createAllRect = function () {
            this._allCheckRect = [];
            this._hasCheck = 0;
            var totalXNum = Math.floor(this._eraseObject.width / this._gapX);
            var totalYNum = Math.floor(this._eraseObject.height / this._gapY);
            this._totalXNum = totalXNum;
            this._totalYNum = totalYNum;
            this._totalRect = totalXNum * totalYNum;
            for (var i = 0; i < totalYNum; i++) {
                var array = [];
                for (var j = 0; j < totalXNum; j++) {
                    array.push(1);
                }
                this._allCheckRect.push(array);
            }
        };
        /**
         * 擦除开始
         * @param event
         */
        SpriteUtils.onTouchBeginDraw = function (event) {
            //console.log("onToucchBeginDrawCircle");
            if (!this._drawEnable) {
                this._drawEnable = true;
                this._drawPoint = [];
                this._drawPoint.push(new egret.Point(event.localX, event.localY));
            }
        };
        /**
         * 涂抹移动事件
         * @param event
         */
        SpriteUtils.onTouchMoveDraw = function (event) {
            //console.log("onToucchMoveDrawCircle");
            //console.log("movew: x="+event.localX +", y="+event.localY);
            if (this._drawEnable) {
                this._drawPoint.push(new egret.Point(event.localX, event.localY));
                this.onDrawLine();
            }
        };
        /**
         * 绘制擦除区域
         */
        SpriteUtils.onDrawLine = function () {
            if (this._drawEnable && this._drawPoint.length > 0) {
                var point = this._drawPoint[this._drawPoint.length - 1];
                var point0 = this._drawPoint[this._drawPoint.length - 2];
                this._eraseShape.graphics.beginFill(0x000000, 0);
                //this._shape.graphics.drawCircle(point.x, point.y, 1);
                //this._shapeCircle.graphics.drawCircle(point0.x, point0.y, 15);
                //this._shapeCircle.graphics.endFill();
                //this._shapeCircle.graphics.beginFill(0x00fff0);
                this._eraseShape.graphics.lineStyle(this._eraseLineWeight, 0x000000, 1, true);
                this._eraseShape.graphics.moveTo(point0.x, point0.y);
                this._eraseShape.graphics.lineTo(point.x, point.y);
                this._eraseShape.graphics.endFill();
                var minX = Math.min(point0.x, point.x);
                var maxX = Math.max(point.x, point0.x);
                var minY = Math.min(point.y - this._eraseLineWeight / 2, point0.y - this._eraseLineWeight / 2);
                var maxY = Math.max(point.y + this._eraseLineWeight / 2, point0.y + this._eraseLineWeight / 2);
                this.checkRect(minX, minY, maxX - minX, maxY - minY);
                easy.HeartBeat.addListener(this, this.onErase, 10);
            }
        };
        /**
         * 将擦除区域与原始材质合成，返回新材质
         */
        SpriteUtils.onErase = function () {
            var bitmap = new egret.Bitmap();
            bitmap.texture = this._eraseTexture;
            this._eraseObject.texture = this.drawErase(bitmap, this._eraseShape);
        };
        /**
         * 检测区域开始检测
         * @param x 待检测的矩形x坐标
         * @param y 待检测的矩形y坐标
         * @param width 待检测的矩形宽度
         * @param height 待检测的矩形高度
         */
        SpriteUtils.checkRect = function (x, y, width, height) {
            var checkIndex1 = Math.floor(y / this._gapY);
            var checkIndex2 = Math.floor(x / this._gapX);
            var checkIndex3 = Math.floor((x + width) / this._gapX);
            var checkIndex4 = Math.floor((y + height) / this._gapY);
            for (var i = checkIndex1; i <= checkIndex4; i++) {
                if (i >= this._totalYNum)
                    break;
                for (var j = checkIndex2; j <= checkIndex3; j++) {
                    if (j >= this._totalXNum)
                        continue;
                    if (this._allCheckRect[i][j]) {
                        this._allCheckRect[i][j] = 0;
                        this._hasCheck++;
                        this.sendCheckEvent();
                        console.log("hasCheck=" + this._hasCheck / this._totalRect);
                    }
                }
            }
        };
        /**
         * 擦除区域改变，派发事件
         */
        SpriteUtils.sendCheckEvent = function () {
            if (this._hasComplete)
                return;
            var checkNum = Math.ceil(this._hasCheck * 100 / this._totalRect);
            if (this._limitCheckNum && checkNum >= this._limitCheckNum) {
                easy.MyEvent.sendEvent(easy.EventType.ERASE_COMPLETE);
                this._hasComplete = true;
            }
            else {
                var length = this._sendEraseChangeArray.length;
                for (var i = 0; i < length; i++) {
                    //if(!this._sendEraseChangeArray[i])continue;
                    if (checkNum >= this._sendEraseChangeArray[i] && this._sendEraseChangeArray[i]) {
                        this._sendEraseChangeArray[i] = 0;
                        if (i == 0) {
                            easy.MyEvent.sendEvent(easy.EventType.ERASE_COMPLETE);
                            this._hasComplete = true;
                        }
                        var myEvent = new easy.MyEvent(easy.EventType.ERASE_CHANGE);
                        myEvent.addItem("hasCheck", checkNum);
                        myEvent.send();
                        break;
                    }
                }
            }
        };
        /**
         * 擦除结束
         */
        SpriteUtils.onToucchEndDrawCircle = function () {
            this._eraseShape.graphics.endFill();
            this._drawEnable = false;
            // this._allPoint = this._allPoint.concat(this._drawPoint);
        };
        return SpriteUtils;
    }());
    SpriteUtils._eraseShape = null; //绘制graphics的shape对象
    SpriteUtils._eraseObject = null; //被擦除的对象
    SpriteUtils._eraseTexture = null; //被擦除的图像原始材质
    SpriteUtils._drawEnable = false; //是否可以绘制
    SpriteUtils._drawPoint = []; //涂抹的点
    SpriteUtils._eraseLineWeight = 0; //涂抹的线宽
    SpriteUtils._allCheckRect = []; //待检测区域的全部格子
    SpriteUtils._hasCheck = 0; //已经涂抹的范围（0-1）
    SpriteUtils._gapX = 5; //检测区域小格子宽度
    SpriteUtils._gapY = 5; //检测区域小格子高度
    SpriteUtils._totalRect = 0; //全部检测区域的数量
    SpriteUtils._totalXNum = 0; //横向检测区域
    SpriteUtils._totalYNum = 0; //竖向检测区域
    SpriteUtils._limitCheckNum = 0; //检测已擦除区域临界值（0-100）
    SpriteUtils._hasComplete = false; //是否擦除完成
    SpriteUtils._sendEraseChangeArray = []; //发送事件间隔
    easy.SpriteUtils = SpriteUtils;
    __reflect(SpriteUtils.prototype, "easy.SpriteUtils");
})(easy || (easy = {}));
