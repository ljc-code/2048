/**
 * @copyright www.egret.com
 * @author
 * @desc 需要在移动设备中预览，两个手指可控制DisplayObject缩放和旋转
 *      。
 */
module easy{
    class MoreTouch {
        private static _touchPoints:Object = {names:[]};
        private static _distance:number = 0;//距离
        private static _angle:number = 0;//角度
        private static _touchCount:number = 0;//点击次数
        private static _currentRotation:number = 0;//当前角度
        private static _moveObject:easy.BaseGroup = null;//要变化的对象
        private static _isMiddle:boolean = true;//是否按照中心点改变
        private static _minScale:number = 0;//最小放大系数
        private static _maxScale:number = 0;//最大放大系数
        private static _oldX:number = 0;//初始x间距
        private static _oldY:number = 0;//初始y间距
        private static _firstTouchId:number = 0;//第一次点击的id
        /**
         * 开启手势识别
         * @param object 要旋转缩放移动的对象
         * @param isControlGlobal 是否在整个舞台上控制对象
         * @param minScale 对象最小放大系数
         * @param maxScale 对象最大放大系数
         * @param isMiddle 是否按照中心点放大
         */
        public static start(object:easy.BaseGroup,isControlGlobal:boolean = true,minScale:number = 0,maxScale:number = 9999,isMiddle:boolean = true):void{
            if(isControlGlobal){
                var stage =  egret.MainContext.instance.stage;
                stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
                stage.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
                stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            }else{
                this._moveObject.touchEnabled = true;
                this._moveObject.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
                this._moveObject.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
                this._moveObject.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            }
            this._moveObject = object;
            if(isMiddle){
                easy.TweenEffect.setAnchorXY(this._moveObject);
            }
            this._minScale = minScale * this._moveObject.width;
            this._maxScale = maxScale * this._moveObject.width;
            if(this._moveObject instanceof easy.Image){//若对象是图片类型，设置自动拉伸
                this._moveObject["autoSize"] = true;
            }
        }
        /**
         * 开始触摸
         * @param e
         */
        private static mouseDown(e:egret.TouchEvent):void{
            if(this._touchPoints[e.touchPointID] == null){
                this._touchPoints[e.touchPointID] = new egret.Point(e.stageX,e.stageY);
                this._touchPoints["names"].push(e.touchPointID);
            }
            this._touchCount ++;
            if(this._touchCount == 1){
                var names = this._touchPoints["names"];
                this._oldX = this._touchPoints[names[0]].x - this._moveObject.x;
                this._oldY = this._touchPoints[names[0]].y - this._moveObject.y;
                this._firstTouchId = e.touchPointID;
            }
            if(this._touchCount == 2){
                this._distance = this.getTouchDistance();
                this._angle = this.getTouchAngle();
            }
        }
        /**
         * 触摸移动
         */
        private static mouseMove(e:egret.TouchEvent):void{
            this._touchPoints[e.touchPointID].x = e.stageX;
            this._touchPoints[e.touchPointID].y = e.stageY;
            if(e.touchPointID == this._firstTouchId){
                this._moveObject.x = e.stageX - this._oldX;
                this._moveObject.y = e.stageY - this._oldY;
            }
            if(this._touchCount == 2){
                var newDistance:number = this.getTouchDistance();
                var scale = newDistance / this._distance;
                if(scale * this._moveObject.width < this._minScale)scale = this._minScale / this._moveObject.width;
                if(scale * this._moveObject.width > this._maxScale)scale = this._maxScale / this._moveObject.width;
                this._moveObject.scaleX = scale;
                this._moveObject.scaleY = scale;

                var newAngle:number = this.getTouchAngle();
                this._moveObject.rotation = newAngle - this._angle + this._currentRotation;
            }
        }
        /**
         * 结束触摸
         * @param e
         */
        private static mouseUp(e:egret.TouchEvent):void{
            delete this._touchPoints[e.touchPointID];
            var index:number = this._touchPoints["names"].indexOf(e.touchPointID);
            if(index != - 1){
                this._touchPoints["names"].splice(index,1);
            }
            this._touchCount --;
            this._moveObject.width *= this._moveObject.scaleX;
            this._moveObject.height *= this._moveObject.scaleY;
            this._moveObject.scaleX = 1;
            this._moveObject.scaleY = 1;
            if(this._isMiddle){
                this._moveObject.anchorOffsetX = this._moveObject.width / 2;
                this._moveObject.anchorOffsetY = this._moveObject.height / 2;
            }
            this._moveObject.draw();
            this._currentRotation = this._moveObject.rotation;
        }
        /**
         * 获取两个手指的距离
         */
        private static getTouchDistance():number{
            var names = this._touchPoints["names"];
            var distance:number = 0;
            return distance = egret.Point.distance(this._touchPoints[names[names.length - 1]],this._touchPoints[names[names.length - 2]]);
        }
        /**
         * 或者两个手指间的角度
         */
        private static getTouchAngle():number{
            var angle:number = 0;
            var names:Array<any> = this._touchPoints["names"];
            var p1:egret.Point = this._touchPoints[names[names.length - 1]];//第一根手指所处位置
            var p2:egret.Point = this._touchPoints[names[names.length - 2]];//第二根手指所处位置
            return angle = Math.atan2(p1.y - p2.y,p1.x - p2.x) * 180 / Math.PI;
        }

    }
}



