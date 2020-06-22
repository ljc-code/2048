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
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(drawDelay) {
            if (drawDelay === void 0) { drawDelay = false; }
            var _this = _super.call(this, drawDelay) || this;
            _this._imgDisplay = null;
            //序列帧播放间隔时长
            _this._fps = 0;
            _this._autoFps = true;
            _this._textures = null;
            //当前播放帧的下标
            _this._numFrameIndex = 0;
            //播放计数
            _this._numFrammeCount = 0;
            //是否在播放
            _this._isPlaying = false;
            //是否循环播放
            _this._loop = false;
            //声音播放
            _this._soundName = null;
            //使用animate data的情况
            _this._animateName = null;
            _this._animateDataDownload = false; //动画数据是否已经开始下载
            _this._animateData = null;
            //播放回调
            _this._callFuncDict = null;
            _this._autoDestory = false; //停止的时候,自动销毁
            _this._autoSize = true; //自动根据材质计算的最大宽高改变播放容器的宽高
            //自动播放
            _this._autoplay = false;
            return _this;
        }
        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        MovieClip.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this._imgDisplay = new egret.Bitmap();
            this.addChild(this._imgDisplay);
            this.showBg = false;
        };
        /**
         * 从指定帧开始播放
         * @param fps 帧间隔时间
         * @param frame  从第几帧开始播放
         */
        MovieClip.prototype.play = function (fps, frame) {
            if (fps === void 0) { fps = 0; }
            if (frame === void 0) { frame = 0; }
            if (!easy.StringUtil.isUsage(this._animateName) && !this._textures)
                return;
            if (fps > 0) {
                this._fps = fps;
                this._autoFps = false;
            }
            this._numFrameIndex = frame;
            if (this._isPlaying)
                return;
            if (easy.StringUtil.isUsage(this._animateName) || this._textures.length > 1) {
                this._numFrammeCount = this._fps; //触发第一次播放的必备条件
                this.onChangeTexture(); //先响应,防止延迟
                easy.HeartBeat.addListener(this, this.onChangeTexture, 1);
            }
            else {
                this._imgDisplay.texture = this._textures[0];
            }
            //this._numFrammeCount = 0;
            this._isPlaying = true;
            this.onPlaySound();
        };
        /**
         * 从指定帧开始播放
         * @param frame
         */
        MovieClip.prototype.gotoAndPlay = function (frame) {
            this.play(0, frame);
        };
        /**
         * 跳到指定帧,从0开始计数
         * @param frame
         */
        MovieClip.prototype.gotoAndStop = function (frame) {
            this._numFrameIndex = frame;
            this._numFrammeCount = this._fps;
            this.onChangeTexture(); //先响应,防止延迟
            this._isPlaying = false;
            easy.HeartBeat.removeListener(this, this.onChangeTexture);
        };
        /**
         * 暂停播放
         */
        MovieClip.prototype.pause = function () {
            this._isPlaying = false;
            easy.HeartBeat.removeListener(this, this.onChangeTexture);
            easy.Sound.stop(this._soundName);
        };
        /**
         *停止播放
         */
        MovieClip.prototype.stop = function () {
            this._isPlaying = false;
            this._numFrameIndex = 0;
            this._numFrammeCount = 0;
            easy.HeartBeat.removeListener(this, this.onChangeTexture);
            easy.Sound.stop(this._soundName);
            if (this._callFuncDict && this._callFuncDict["-1"])
                this._callFuncDict["-1"].func.call(this._callFuncDict["-1"].thisFunc, this, -1);
            if (this._autoDestory)
                this.destory();
            //console.log("movie.stop=" + this._animateName);
        };
        /**
         * 重新播放
         */
        MovieClip.prototype.replay = function () {
            if (!easy.StringUtil.isUsage(this._animateName) && !this._textures)
                return;
            this._isPlaying = true;
            if (easy.StringUtil.isUsage(this._animateName) || this._textures.length > 1) {
                easy.HeartBeat.addListener(this, this.onChangeTexture, 1);
            }
            else {
                this._imgDisplay.texture = this._textures[0];
            }
            easy.Sound.play(this._soundName, 0, this._loop ? 0 : 1);
        };
        /**
         * 销毁数据
         */
        MovieClip.prototype.destory = function () {
            this._isPlaying = false;
            this.resetData();
            this.verticalEnabled = false;
            this.horizontalEnabled = false;
            easy.HeartBeat.removeListener(this, this.onChangeTexture);
            this.removeFromParent();
        };
        /**
         * 重置数据
         */
        MovieClip.prototype.resetData = function () {
            easy.Sound.stop(this._soundName);
            this._autoFps = true;
            this._numFrameIndex = 0;
            this._numFrammeCount = 0;
            this._textures = null;
            this._animateData = null;
            this._animateName = null;
            this._callFuncDict = null;
            this._animateDataDownload = false;
            this.anchorX = 0;
            this.anchorY = 0;
            this.anchorEnabled = false;
            this.anchorOffsetX = 0;
            this.anchorOffsetY = 0;
            if (this._imgDisplay)
                this._imgDisplay.texture = null;
        };
        Object.defineProperty(MovieClip.prototype, "textures", {
            get: function () {
                return this._textures;
            },
            /**
             * 设置播放的材质集合
             * @param value
             */
            set: function (value) {
                this._textures = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "animateName", {
            /**
             * 通过设置animate动画数据的名称来设置数据
             * @param name
             */
            set: function (name) {
                this.resetData();
                this._animateName = name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "animateData", {
            get: function () {
                return this._animateData;
            },
            /**
             * 设置animate动画数据
             * @param item
             */
            set: function (item) {
                this._animateData = item;
                if (this._animateData) {
                    this._animateName = item.id;
                    this.setAnimateData();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "sound", {
            get: function () {
                return this._soundName;
            },
            /**
             * 设置播放的声音名称
             * @param value
             */
            set: function (value) {
                this._soundName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "fps", {
            get: function () {
                return this._fps;
            },
            /**
             * 设置播放的帧频间隔
             * @param value
             */
            set: function (value) {
                this._fps = value;
                if (this._fps != 0) {
                    this._autoFps = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "loop", {
            get: function () {
                return this._loop;
            },
            /**
             * 设置播放是否循环
             * @param value
             */
            set: function (value) {
                this._loop = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置stop结束回调
         * @param thisArg func对象
         * @param value func方法
         * @param frame 在第几帧触发,-1,表示结束的时候触发
         */
        MovieClip.prototype.setCallFunc = function (thisArg, value, frame) {
            if (frame === void 0) { frame = -1; }
            if (this._callFuncDict == null) {
                this._callFuncDict = {};
            }
            this._callFuncDict["" + frame] = { func: value, thisFunc: thisArg };
        };
        /**
         * 移除call back function的设置
         * @param frame
         */
        MovieClip.prototype.removeCallFunc = function (frame) {
            if (frame === void 0) { frame = -1; }
            if (this._callFuncDict && this._callFuncDict["" + frame]) {
                delete this._callFuncDict["" + frame];
            }
        };
        /**
         * 变更材质
         */
        MovieClip.prototype.onChangeTexture = function () {
            if (!this.parent) {
                this.stop();
                return;
            }
            if (!this._imgDisplay)
                return;
            this._numFrammeCount++;
            if (this._numFrammeCount >= this._fps) {
                this._numFrammeCount = 0;
                if (!this._animateDataDownload && this._animateData == null && easy.StringUtil.isUsage(this._animateName)) {
                    //easy.Debug.log = "@@@@MovieClip.animateName=" + this._animateName;
                    this.animateData = easy.AnimateManager.getAnimateData(this._animateName);
                    this._animateDataDownload = true;
                    if (this.animateData == null) {
                        //添加资源下载的监听
                        easy.EventManager.addEventListener(easy.EventType.RESOURCE_DOWNLOADED, this.onEventAnimateDataDownloaded, this);
                        return;
                    }
                }
                if (this._textures) {
                    if (this._fps == 0)
                        this._fps = 1;
                    if (this._numFrameIndex >= this._textures.length) {
                        if (!this._loop) {
                            this.stop();
                            return;
                        }
                        this._numFrameIndex = 0;
                    }
                }
                else {
                    if (this._animateData && this._numFrameIndex >= this._animateData.textures.length) {
                        if (!this._loop) {
                            this.stop();
                            return;
                        }
                        this._numFrameIndex = 0;
                    }
                }
                if (this._callFuncDict && this._callFuncDict["" + this._numFrameIndex])
                    this._callFuncDict["" + this._numFrameIndex].func.call(this._callFuncDict["" + this._numFrameIndex].thisFunc, this, this._numFrameIndex);
            }
            else {
                return;
            }
            if (this._textures) {
                this._imgDisplay.texture = this._textures[this._numFrameIndex];
                this._imgDisplay.x = this.cx - this._imgDisplay.width / 2;
                this._imgDisplay.y = this.cy - this._imgDisplay.height / 2;
                this._numFrameIndex++;
            }
            else {
                if (this._animateData && this._animateData.textures && this._imgDisplay) {
                    var animateTexture = this._animateData.getTexture(this._numFrameIndex);
                    //console.log("id=" + animateTexture.id)
                    if (this._autoFps)
                        this._fps = animateTexture.frame;
                    //this._imgDisplay.setSize(animateTexture.width, animateTexture.height);
                    if (this.animateData._merge && this._animateData.textures.length > 1) {
                        this._imgDisplay.x = this.cx + animateTexture.x;
                        this._imgDisplay.y = this.cy + animateTexture.y;
                    }
                    else {
                        this._imgDisplay.x = 0;
                        this._imgDisplay.y = 0;
                    }
                    this._imgDisplay.texture = animateTexture.texutre;
                    this._numFrameIndex++;
                    if (this._animateData.textures.length == 1) {
                        easy.HeartBeat.removeListener(this, this.onChangeTexture);
                    }
                }
            }
        };
        /**
         * animate data下载完成通知
         * @param myevent
         */
        MovieClip.prototype.onEventAnimateDataDownloaded = function (myevent) {
            if (myevent.getItem("name") == this._animateName) {
                easy.EventManager.removeEventListener(easy.EventType.RESOURCE_DOWNLOADED, this.onEventAnimateDataDownloaded, this);
                this.setAnimateData();
            }
        };
        /**
         * 设置animate data 数据,并初始化
         */
        MovieClip.prototype.setAnimateData = function () {
            this._animateData = easy.AnimateManager.getAnimateData(this._animateName);
            if (this.animateData && this._autoSize) {
                this.setSize(this.animateData.width, this.animateData.height);
            }
            //根据材质设定帧频
            if (this._fps == 0 && this.animateData && this._autoFps) {
                this._fps = this.animateData.frame;
            }
        };
        /**
         * 初始化声音对象,并播放声音
         */
        MovieClip.prototype.onPlaySound = function () {
            if (!easy.GlobalSetting.VOLUME_OPEN)
                return;
            if (easy.StringUtil.isUsage(this._soundName)) {
                easy.Sound.play(this._soundName, 0, this._loop ? 0 : 1);
            }
        };
        Object.defineProperty(MovieClip.prototype, "isPlaying", {
            /**
             * 查询当前时候在播放
             * @returns {boolean}
             */
            get: function () {
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "currentFrame", {
            /**
             * 当前播放的帧数
             * @returns {number}
             */
            get: function () {
                return this._numFrameIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "totalFrame", {
            /**
             * 总的帧数
             * @returns {number}
             */
            get: function () {
                if (this._textures) {
                    return this._textures.length;
                }
                else if (this._animateData) {
                    return this._animateData.textures.length;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "autoDestory", {
            get: function () {
                return this._autoDestory;
            },
            /**
             * 停止播放的时候,自动销毁
             * @param value
             */
            set: function (value) {
                this._autoDestory = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "autoSize", {
            get: function () {
                return this._autoSize;
            },
            /**
             * 自动根据材质计算的最大宽高改变播放容器的宽高
             * 容器的中点,是播放材质的x,y原点
             * @param value
             */
            set: function (value) {
                this._autoSize = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置是否下一帧计算相对位置
         * 不需要对子元素,进行布局,所以覆写,减少消耗
         */
        MovieClip.prototype.onInvalidatePosition = function () {
            if (!this._hasInvalidatePosition) {
                this._hasInvalidatePosition = true;
                this.addEventListener(egret.Event.ENTER_FRAME, this.resetPosition, this);
            }
        };
        Object.defineProperty(MovieClip.prototype, "autoplay", {
            get: function () {
                return this._autoplay;
            },
            /**
             * 自动播放
             * @param value
             */
            set: function (value) {
                if (this._autoplay != value) {
                    this._autoplay = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return MovieClip;
    }(easy.Group));
    easy.MovieClip = MovieClip;
    __reflect(MovieClip.prototype, "easy.MovieClip");
})(easy || (easy = {}));
