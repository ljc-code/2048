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
    /**
     * 简单的对DisplayObjectContainer进行扩展
     * 加入基础布局的算法
     */
    var BaseGroup = (function (_super) {
        __extends(BaseGroup, _super);
        function BaseGroup(drawDelay) {
            if (drawDelay === void 0) { drawDelay = false; }
            var _this = _super.call(this) || this;
            _this._isAddedToStage = false; //是否已加入过显示列表中,可用来判断各组件是否已经具备显示赋值的作用
            _this._top = 0;
            _this._topEnabled = false;
            _this._left = 0;
            _this._leftEnabled = false;
            _this._bottom = 0;
            _this._bottomEnabled = false;
            _this._right = 0;
            _this._rightEnabled = false;
            _this._horizontalEnabled = false;
            _this._horizontalCenter = 0;
            _this._verticalEnabled = false;
            _this._verticalCenter = 0;
            //原点/注册点剧中
            _this._registryPointEnabled = false;
            _this._registryOffsetX = 0;
            _this._registryOffsetY = 0;
            _this._data = null; //可携带的数据
            _this._enabled = true; //不可用状态
            //xy原点偏移比例
            _this._anchorEnabled = false;
            _this._anchorX = 0;
            _this._anchorY = 0;
            _this._hasInvalidatePosition = false; //是否已经标记重新计算位置布局
            /**
             * 延迟绘制,使用在easy ui生成的代码,等待到材质validation后,再进行绘制渲染
             */
            _this._drawDelay = false;
            _this._hasInvalidate = false; //是否下一帧重绘
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onFirstAddToStage, _this);
            _this._drawDelay = drawDelay;
            return _this;
            //console.log("this._drawDelay=" + this._drawDelay)
        }
        /**
         * 第一次加入场景的时候会运行该方法
         */
        BaseGroup.prototype.onFirstAddToStage = function (event) {
            this._isAddedToStage = true;
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onFirstAddToStage, this);
            this.createChildren(); //先创建
            this.initData();
            //console.log("222222this._drawDelay=" + this._drawDelay)
        };
        /**
         * 初始化一些必要的逻辑数据
         * 这个方法是在第一次加入stage的时候,做调用
         */
        BaseGroup.prototype.initData = function () {
        };
        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        BaseGroup.prototype.createChildren = function () {
            this.touchEnabled = false; //默认不接受事件
            if (this.width == 0)
                this.width = 100;
            if (this.height == 0)
                this.height = 100;
        };
        Object.defineProperty(BaseGroup.prototype, "width", {
            get: function () {
                return this.$getWidth();
            },
            /**
             * 覆写width方法,在width改变的时候,做逻辑运算
             * @param w
             */
            set: function (w) {
                if (w > 0) {
                    _super.prototype.$setWidth.call(this, w);
                    if (this._anchorX != 0)
                        this.anchorOffsetX = w * this._anchorX;
                    this.onInvalidatePosition();
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "height", {
            get: function () {
                return this.$getHeight();
            },
            /**
             * 覆写height方法,在height改变的时候,做逻辑运算
             * @param h
             */
            set: function (h) {
                if (h > 0) {
                    _super.prototype.$setHeight.call(this, h);
                    if (this._anchorY != 0)
                        this.anchorOffsetY = h * this._anchorY;
                    this.onInvalidatePosition();
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Moves the component to the specified position.
         * @param xpos the x position to move the component
         * @param ypos the y position to move the component
         */
        BaseGroup.prototype.move = function (xpos, ypos) {
            this.x = xpos;
            ;
            this.y = ypos;
            ;
        };
        /**
         * Sets the size of the component.
         * @param w The width of the component.
         * @param h The height of the component.
         */
        BaseGroup.prototype.setSize = function (w, h) {
            if (this.width != w || this.height != h) {
                this.width = w;
                this.height = h;
            }
        };
        Object.defineProperty(BaseGroup.prototype, "top", {
            ///////////////////////////////////
            // 组件相对布局设置
            ///////////////////////////////////
            get: function () {
                return this._top;
            },
            /**
             * 设置顶距
             */
            set: function (value) {
                if (this._top != value) {
                    this._top = value;
                    if (this._topEnabled)
                        this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "topEnabled", {
            get: function () {
                return this._topEnabled;
            },
            /**
             * 顶距可用设置
             */
            set: function (value) {
                this._topEnabled = value;
                this.onInvalidatePosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "left", {
            /**
             * 设置左距
             */
            get: function () {
                return this._left;
            },
            set: function (value) {
                if (this._left != value) {
                    this._left = value;
                    if (this._leftEnabled)
                        this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "leftEnabled", {
            get: function () {
                return this._leftEnabled;
            },
            /**
             * 设置左距可用
             */
            set: function (value) {
                this._leftEnabled = value;
                this.onInvalidatePosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "bottom", {
            get: function () {
                return this._bottom;
            },
            /**
             * 设置底距
             */
            set: function (value) {
                if (this._bottom != value) {
                    this._bottom = value;
                    if (this._bottomEnabled)
                        this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "bottomEnabled", {
            get: function () {
                return this._bottomEnabled;
            },
            /**
             * 设置底距可用
             */
            set: function (value) {
                this._bottomEnabled = value;
                this.onInvalidatePosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "right", {
            get: function () {
                return this._right;
            },
            /**
             * 设置右距
             */
            set: function (value) {
                if (this._right != value) {
                    this._right = value;
                    if (this._rightEnabled)
                        this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "rightEnabled", {
            get: function () {
                return this._rightEnabled;
            },
            /**
             * 设置右距可用
             */
            set: function (value) {
                this._rightEnabled = value;
                this.onInvalidatePosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "horizontalEnabled", {
            get: function () {
                return this._horizontalEnabled;
            },
            /**
             * 设置水平居中可用
             */
            set: function (value) {
                this._horizontalEnabled = value;
                this.onInvalidatePosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "horizontalCenter", {
            get: function () {
                return this._horizontalCenter;
            },
            /**
             * 设置水平居中相对位置
             */
            set: function (value) {
                if (this._horizontalCenter != value) {
                    this._horizontalCenter = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "verticalEnabled", {
            get: function () {
                return this._verticalEnabled;
            },
            /**
             * 设置竖直居中可用
             */
            set: function (value) {
                if (this._verticalEnabled != value) {
                    this._verticalEnabled = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "verticalCenter", {
            get: function () {
                return this._verticalCenter;
            },
            /**
             * 设置竖直居中相对位置
             */
            set: function (value) {
                if (this._verticalCenter != value) {
                    this._verticalCenter = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "registryPointEnabled", {
            get: function () {
                return this._registryPointEnabled;
            },
            /**
             * 设置注册点居中可用
             */
            set: function (value) {
                if (this._registryPointEnabled != value) {
                    this._registryPointEnabled = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置是否下一帧计算相对位置
         */
        BaseGroup.prototype.onInvalidatePosition = function () {
            //SystemHeartBeat.addEventListener(this.onHeartBeatInvalidate, 1, 1);
            //console.log("onInvalidatePosition000 name=" + this.name);
            //if (this._drawDelay) return;
            if (!this._hasInvalidatePosition) {
                //console.log("onInvalidatePosition111 name=" + this.name);
                this._hasInvalidatePosition = true;
                this.addEventListener(egret.Event.ENTER_FRAME, this.resetPosition, this);
                for (var i = 0; i < this.numChildren; i++) {
                    if (this.getChildAt(i) instanceof BaseGroup)
                        (this.getChildAt(i)).onInvalidatePosition();
                }
            }
        };
        /**
         * 容器相对位置刷新
         */
        BaseGroup.prototype.resetPosition = function () {
            //console.log("resetPosition name=" + this.name);
            var p = this.parent;
            if (p != null) {
                var parentWidth = p.width;
                var parentHeight = p.height;
                var thisWidth = this.width;
                var thisHeight = this.height;
                //为了保证得到的宽高是数值型,这里进行了严格的检测
                if (parentWidth == NaN || parentWidth == undefined) {
                    parentWidth = p.width;
                    if (parentWidth == NaN || parentWidth == undefined) {
                        parentWidth = p.measuredWidth;
                    }
                    if (parentWidth == NaN || parentWidth == undefined) {
                        parentWidth = 0;
                    }
                }
                if (parentHeight == NaN || parentHeight == undefined) {
                    parentHeight = p.height;
                    if (parentHeight == NaN || parentHeight == undefined) {
                        parentHeight = p.measuredHeight;
                    }
                    if (parentHeight == NaN || parentHeight == undefined) {
                        parentHeight = 0;
                    }
                }
                if (thisWidth == NaN || thisWidth == undefined) {
                    thisWidth = this.width;
                    if (thisWidth == NaN || thisWidth == undefined) {
                        thisWidth = this.measuredWidth;
                    }
                    if (thisWidth == NaN || thisWidth == undefined) {
                        thisWidth = 0;
                    }
                }
                if (thisHeight == NaN || thisHeight == undefined) {
                    thisHeight = this.height;
                    if (thisHeight == NaN || thisHeight == undefined) {
                        thisHeight = this.measuredHeight;
                    }
                    if (thisHeight == NaN || thisHeight == undefined) {
                        thisWidth = 0;
                    }
                }
                var heightChanged = false; //高度有改变
                var widthChanged = false; //宽度有改变
                if (this._topEnabled && !this._bottomEnabled) {
                    this.y = this._top;
                }
                else if (this._bottomEnabled && !this._topEnabled) {
                    this.y = parentHeight - this._bottom - thisHeight;
                }
                else if (this._topEnabled && this._bottomEnabled) {
                    this.y = this._top;
                    thisHeight = parentHeight - this._top - this._bottom;
                    if (this.height != thisHeight) {
                        this.height = thisHeight;
                        for (var i = 0; i < this.numChildren; i++) {
                            if (this.getChildAt(i) instanceof BaseGroup)
                                (this.getChildAt(i)).onInvalidatePosition();
                        }
                        heightChanged = true;
                    }
                }
                if (this._leftEnabled && !this._rightEnabled) {
                    this.x = this._left;
                }
                else if (this._rightEnabled && !this._leftEnabled) {
                    this.x = parentWidth - this._right - thisWidth;
                }
                else if (this._leftEnabled && this._rightEnabled) {
                    this.x = this._left;
                    thisWidth = parentWidth - this._left - this._right;
                    if (this.width != thisWidth) {
                        this.width = thisWidth;
                        for (var i = 0; i < this.numChildren; i++) {
                            if (this.getChildAt(i) instanceof BaseGroup)
                                (this.getChildAt(i)).onInvalidatePosition();
                        }
                        widthChanged = true;
                    }
                }
                if (this._horizontalEnabled && !widthChanged) {
                    this.x = (parentWidth - thisWidth) / 2 + this._horizontalCenter;
                }
                if (this._verticalEnabled && !heightChanged) {
                    this.y = (parentHeight - thisHeight) / 2 + this._verticalCenter;
                }
                if (this._registryPointEnabled) {
                    this.x = parentWidth / 2 + this._registryOffsetX;
                    this.y = parentHeight / 2 + this._registryOffsetY;
                }
                if (this._anchorEnabled) {
                    this.anchorOffsetX = this._anchorX * this.width;
                    this.anchorOffsetY = this._anchorY * this.height;
                }
            }
            this.removeEventListener(egret.Event.ENTER_FRAME, this.resetPosition, this);
            this._hasInvalidatePosition = false;
        };
        /**
         * 可设置的携带数据
         */
        BaseGroup.prototype.getData = function () {
            return this._data;
        };
        BaseGroup.prototype.setData = function (value) {
            this._data = value;
        };
        Object.defineProperty(BaseGroup.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 清理数据
         */
        BaseGroup.prototype.clean = function () {
        };
        Object.defineProperty(BaseGroup.prototype, "enabled", {
            /**
            * 设置enabled状态
            * @return
            */
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this._enabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "cx", {
            /**
             * 中心x位置
             * @returns {number}
             */
            get: function () {
                return this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "cy", {
            /**
             * 中心y位置
             * @returns {number}
             */
            get: function () {
                return this.height / 2;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 从场景中移除改对象
         */
        BaseGroup.prototype.removeFromParent = function () {
            if (this.parent)
                this.parent.removeChild(this);
        };
        /**
         * 返回全局x,y值
         * @returns {egret.Point}
         */
        BaseGroup.prototype.getGlobalXY = function () {
            var point = new egret.Point(0, 0);
            this.localToGlobal(point.x, point.y, point);
            return point;
        };
        Object.defineProperty(BaseGroup.prototype, "actualWidth", {
            /**
             * 返回实际宽度
             * @returns {number}
             */
            get: function () {
                return this.width * this.scaleX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "actualHeight", {
            /**
             * 返回实际高度
             * @returns {number}
             */
            get: function () {
                return this.height * this.scaleX;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取注册点相对的偏移像素值
         * 官方很奇葩,修改了注册点后,子组件竟然不是以改注册点的值作为起始xy的0值
         * 这里计算出实际的偏移值,供大家使用
         */
        BaseGroup.prototype.getRegPoint = function () {
            var regPoint = new egret.Point(0, 0);
            if (this.anchorOffsetX != 0) {
                regPoint.x = this.anchorOffsetX;
            }
            if (this.anchorOffsetX != 0) {
                regPoint.y = this.anchorOffsetY;
            }
            return regPoint;
        };
        BaseGroup.prototype.invalidate = function () {
            if (!this._hasInvalidate && !this._drawDelay) {
                //console.log("add invalidate draw")
                this.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                this._hasInvalidate = true;
            }
        };
        /**
         * 重绘通知
         */
        BaseGroup.prototype.onInvalidate = function (event) {
            this.draw();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
            this._hasInvalidate = false;
        };
        BaseGroup.prototype.draw = function () {
            //console.log("draw name=" + this.name);
        };
        /**
         * 设置延迟绘制的快关
         * true:这个期间的draw请求都会被屏蔽
         * @param delay
         * @private
         */
        BaseGroup.prototype._setDrawDelay = function (delay) {
            this._drawDelay = delay;
            if (this._drawDelay) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                this._hasInvalidate = false;
            }
            else {
                this.invalidate();
            }
        };
        Object.defineProperty(BaseGroup.prototype, "drawDelay", {
            get: function () {
                return this._drawDelay;
            },
            /**
             * 设置延迟draw
             * @param delay
             */
            set: function (delay) {
                //console.log("drawDelay=" + delay)
                this._drawDelay = delay;
                if (this._drawDelay) {
                    this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                    this._hasInvalidate = false;
                }
                else {
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "isAddedToStage", {
            /**
             * 判断曾经加入过显示列表中
             * 可以用来判断各属性是否已经准备好显示和使用
             * @returns {boolean}
             */
            get: function () {
                return this._isAddedToStage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "anchorX", {
            get: function () {
                return this._anchorX;
            },
            /**
             * 设置x原点偏移比例
             * @param value
             */
            set: function (value) {
                if (this._anchorX != value) {
                    this._anchorX = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "anchorY", {
            get: function () {
                return this._anchorY;
            },
            /**
             * 设置y原点偏移比例
             * @param value
             */
            set: function (value) {
                if (this._anchorY != value) {
                    this._anchorY = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "anchorEnabled", {
            get: function () {
                return this._anchorEnabled;
            },
            /**
             * 设置y原点偏移值
             * @param value
             */
            set: function (value) {
                if (this._anchorEnabled != value) {
                    this._anchorEnabled = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "registryOffsetX", {
            get: function () {
                return this._registryOffsetX;
            } /**
             * 设置注册点y偏移值
             * @param value
             */,
            /**
             * 设置注册点y偏移值
             * @param value
             */
            set: function (value) {
                if (this._registryOffsetX != value) {
                    this._registryOffsetX = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGroup.prototype, "registryOffsetY", {
            get: function () {
                return this._registryOffsetY;
            },
            set: function (value) {
                if (this._registryOffsetY != value) {
                    this._registryOffsetY = value;
                    this.onInvalidatePosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        return BaseGroup;
    }(egret.DisplayObjectContainer));
    easy.BaseGroup = BaseGroup;
    __reflect(BaseGroup.prototype, "easy.BaseGroup");
})(easy || (easy = {}));
