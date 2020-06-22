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
module easy {
    /**
     * 集中ui操作的一些常用方法
     */
    export class SpriteUtils {
        /**
         * 用target的图形,在src的图形上镂空/擦除,返回擦除后的材质
         * @param src
         * @param target
         */
        private static drawErase(src:egret.DisplayObject, target:egret.DisplayObject):egret.Texture{
            var container:egret.DisplayObjectContainer = new  egret.DisplayObjectContainer();
            target.blendMode = egret.BlendMode.ERASE;

            container.addChild(src);
            container.addChild(target);

            //绘制成材质
            var texture2:egret.RenderTexture = new egret.RenderTexture();
            texture2.drawToTexture(container);

            //回收对象
            container.removeChildren();
            //easy.ObjectPool.recycleClass(container);

            //easy.ObjectPool.recycleClass(targetImg, "earse");

            return texture2;
        }
        private static _eraseShape:egret.Shape = null;//绘制graphics的shape对象
        private static _eraseObject:easy.Image = null;//被擦除的对象
        private static _eraseTexture:egret.Texture = null;//被擦除的图像原始材质
        private static _drawEnable:boolean = false;//是否可以绘制
        private static _drawPoint:Array<any> = [];//涂抹的点
        private static _eraseLineWeight:number = 0;//涂抹的线宽
        private static _allCheckRect:Array<any> = [];//待检测区域的全部格子
        private static _hasCheck:number = 0;//已经涂抹的范围（0-1）
        private static _gapX:number = 5;//检测区域小格子宽度
        private static _gapY:number = 5;//检测区域小格子高度
        private static _totalRect:number = 0;//全部检测区域的数量
        private static _totalXNum:number = 0;//横向检测区域
        private static _totalYNum:number = 0;//竖向检测区域
        private static _limitCheckNum:number = 0;//检测已擦除区域临界值（0-100）
        private static _hasComplete:boolean = false;//是否擦除完成
        private static _sendEraseChangeArray:Array<any> = [];//发送事件间隔
        /**
         * 初始化擦除
         * @param object  擦除对象
         * @param limitCheck 擦除临界值
         * @param gapX 检测区域小格子宽度
         * @param gapY 检测区域小格子高度
         * @param lineWeight 涂抹宽度
         */
        public static erase(object:easy.Image,limitCheck:number = 0,gapX:number = 5,gapY:number = 5,lineWeight:number = 40):void{
            this._eraseShape = new egret.Shape();
            this._sendEraseChangeArray  = [95,90,85,80,70,60,50];
            this._hasComplete = false;
            this._eraseObject  = object;
            this._eraseTexture = object.texture;
            this._eraseLineWeight = lineWeight;
            this._gapX = gapX;
            this._gapY = gapY;
            if(limitCheck)this._limitCheckNum = limitCheck;
            object.touchEnabled = true;
            object.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginDraw, this);
            object.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveDraw, this);
            object.addEventListener(egret.TouchEvent.TOUCH_END, this.onToucchEndDrawCircle, this);
            this.createAllRect();
        }
        /**
         * 创建检测区域
         */
        private static createAllRect():void{
            this._allCheckRect = [];
            this._hasCheck = 0;
            var totalXNum = Math.floor(this._eraseObject.width / this._gapX);
            var totalYNum = Math.floor(this._eraseObject.height / this._gapY);
            this._totalXNum = totalXNum;
            this._totalYNum = totalYNum;
            this._totalRect = totalXNum * totalYNum;
            for(var i:number = 0;i < totalYNum;i ++){
                var array:Array<any> = [];
                for(var j:number = 0;j < totalXNum;j ++){
                    array.push(1);
                }
                this._allCheckRect.push(array);
            }
        }
        /**
         * 擦除开始
         * @param event
         */
        private static onTouchBeginDraw(event:egret.TouchEvent):void {
            //console.log("onToucchBeginDrawCircle");
            if (!this._drawEnable) {
                this._drawEnable = true;
                this._drawPoint = [];
                this._drawPoint.push(new egret.Point(event.localX, event.localY));
            }
        }
        /**
         * 涂抹移动事件
         * @param event
         */
        private static  onTouchMoveDraw(event:egret.TouchEvent):void {
            //console.log("onToucchMoveDrawCircle");
            //console.log("movew: x="+event.localX +", y="+event.localY);
            if (this._drawEnable) {
                this._drawPoint.push(new egret.Point(event.localX, event.localY));
                this.onDrawLine();
            }
        }
        /**
         * 绘制擦除区域
         */
        private static onDrawLine():void{
            if (this._drawEnable && this._drawPoint.length > 0 ) {
                var point:egret.Point = this._drawPoint[this._drawPoint.length -1];
                var point0:egret.Point = this._drawPoint[this._drawPoint.length - 2];
                this._eraseShape.graphics.beginFill(0x000000,0);
                //this._shape.graphics.drawCircle(point.x, point.y, 1);
                //this._shapeCircle.graphics.drawCircle(point0.x, point0.y, 15);
                //this._shapeCircle.graphics.endFill();
                //this._shapeCircle.graphics.beginFill(0x00fff0);
                this._eraseShape.graphics.lineStyle(this._eraseLineWeight, 0x000000, 1, true);
                this._eraseShape.graphics.moveTo(point0.x, point0.y);
                this._eraseShape.graphics.lineTo(point.x, point.y);
                this._eraseShape.graphics.endFill();
                var minX:number = Math.min(point0.x,point.x);
                var maxX:number = Math.max(point.x,point0.x);
                var minY:number = Math.min(point.y - this._eraseLineWeight / 2,point0.y - this._eraseLineWeight / 2);
                var maxY:number = Math.max(point.y + this._eraseLineWeight / 2,point0.y + this._eraseLineWeight / 2);
                this.checkRect(minX,minY,maxX - minX,maxY - minY);
                easy.HeartBeat.addListener(this,this.onErase,10);
            }
        }
        /**
         * 将擦除区域与原始材质合成，返回新材质
         */
        private static onErase():void{
            var bitmap:egret.Bitmap = new egret.Bitmap();
            bitmap.texture = this._eraseTexture;
            this._eraseObject.texture =  this.drawErase(bitmap,this._eraseShape)
        }
        /**
         * 检测区域开始检测
         * @param x 待检测的矩形x坐标
         * @param y 待检测的矩形y坐标
         * @param width 待检测的矩形宽度
         * @param height 待检测的矩形高度
         */
        private static checkRect(x:number,y:number,width:number,height:number):void{
            var checkIndex1:number = Math.floor(y / this._gapY);
            var checkIndex2:number = Math.floor(x / this._gapX);
            var checkIndex3:number = Math.floor((x + width) / this._gapX);
            var checkIndex4:number = Math.floor((y + height) / this._gapY);
            for(var i:number = checkIndex1;i <= checkIndex4;i ++){
                if(i >= this._totalYNum)break;
                for(var j:number = checkIndex2;j <= checkIndex3;j ++){
                    if(j >= this._totalXNum)continue;
                    if(this._allCheckRect[i][j]){//检测区域小格子未被擦除过，标记擦除
                        this._allCheckRect[i][j] = 0;
                        this._hasCheck ++;
                        this.sendCheckEvent();
                        console.log("hasCheck=" + this._hasCheck / this._totalRect);
                    }
                }
            }
        }
        /**
         * 擦除区域改变，派发事件
         */
        private static sendCheckEvent():void{
            if(this._hasComplete)return;
            var checkNum:number = Math.ceil(this._hasCheck * 100 / this._totalRect);
            if(this._limitCheckNum && checkNum >= this._limitCheckNum){
                easy.MyEvent.sendEvent(easy.EventType.ERASE_COMPLETE);
                this._hasComplete = true;
            }else{
                var length:number = this._sendEraseChangeArray.length;
                for(var i:number = 0;i < length;i ++){
                    //if(!this._sendEraseChangeArray[i])continue;
                    if(checkNum >= this._sendEraseChangeArray[i] && this._sendEraseChangeArray[i]){
                        this._sendEraseChangeArray[i] = 0;
                        if(i == 0 ){
                            easy.MyEvent.sendEvent(easy.EventType.ERASE_COMPLETE);
                            this._hasComplete = true;
                        }
                        var myEvent:easy.MyEvent = new easy.MyEvent(easy.EventType.ERASE_CHANGE);
                        myEvent.addItem("hasCheck",checkNum);
                        myEvent.send();
                        break;
                    }
                }
            }
        }
        /**
         * 擦除结束
         */
        private static onToucchEndDrawCircle():void{
            this._eraseShape.graphics.endFill();
            this._drawEnable = false;
           // this._allPoint = this._allPoint.concat(this._drawPoint);
        }

    }
}