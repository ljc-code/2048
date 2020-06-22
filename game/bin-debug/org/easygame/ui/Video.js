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
     * 视频
     */
    var Video = (function (_super) {
        __extends(Video, _super);
        function Video(drawDelay) {
            if (drawDelay === void 0) { drawDelay = false; }
            var _this = _super.call(this, drawDelay) || this;
            //播放器
            _this._video = null;
            //播放源
            _this._source = null;
            //界面截图
            _this._poster = null;
            _this._imgPoster = null; //
            //声音0-100
            _this._valume = -1;
            //是否全屏
            _this._fullscreen = false;
            //当前状态
            _this._state = Video.STATE_STOP;
            //自动播放
            _this._autoplay = false;
            //显示播放按钮
            _this._showBtnPlay = true;
            //播放按钮图像
            _this._btnPlayTexture = null;
            _this._btnPlayTween = null;
            //播放按钮
            _this._btnPlay = null;
            //循环播放
            _this._loop = false;
            //io加载错误次数
            _this._ioerror = 0;
            return _this;
        }
        Video.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.bgColor = 0x000000;
            this.border = false;
            this.setSize(easy.Style.VIDEO_DEFAULT_WIDTH, easy.Style.VIDEO_DEFAULT_HEIGHT);
            this._video = new egret.Video();
            this.addChild(this._video);
            //this._video.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playOrStopVideo, this);
            this._video.addEventListener(egret.Event.COMPLETE, this.onEventComplete, this);
            this._video.addEventListener(egret.Event.ENDED, this.onEventEnd, this);
            this._video.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onEventError, this);
            if (this._source != null)
                this._video.src = this._source;
            if (this._valume != -1)
                this._video.volume = this._valume / 100;
            if (this._poster != null)
                this._video.poster = this._poster;
            this._video.fullscreen = this._fullscreen;
            if (this._autoplay)
                this.play();
        };
        Video.prototype.onEventComplete = function (event) {
            //console.log("video load complete!!");
            this._ioerror = 0;
        };
        Video.prototype.onEventEnd = function (event) {
            //console.log("video load end!!");
            this._ioerror = 0;
        };
        Video.prototype.onEventError = function (event) {
            //console.log("video io error!!=" + this.state);
            if (this._video && this.state == Video.STATE_PAUSE && this._ioerror < 3) {
                if (this._video.parent)
                    this._video.parent.removeChild(this._video);
                this._video = new egret.Video();
                this.addChildAt(this._video, 1);
                this._video.addEventListener(egret.Event.COMPLETE, this.onEventComplete, this);
                this._video.addEventListener(egret.Event.ENDED, this.onEventEnd, this);
                this._video.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onEventError, this);
                this._video.width = this.width;
                this._video.height = this.height;
                this._ioerror++;
                this._video.src = this._source;
                this._video.play(0, this._loop); //io错误,尝试重新播放
            }
        };
        /**
         * 显示播放按钮
         */
        Video.prototype.onShowBtnPlay = function () {
            if (!this._showBtnPlay)
                return;
            if (this._btnPlayTexture == null) {
                //绘制播放按钮
                var _radius1 = 58; //底部圆弧半径
                var _radius2 = 60; //顶部圆半径
                var _lineLength = 80; //三角形边长
                var _circle1X = 72; //底部圆心x坐标
                var _circle1Y = 73; //底部圆心y坐标
                var _circle2X = 70; //顶部圆心x坐标
                var _circle2Y = 70; //顶部圆心y坐标
                var shape = new egret.Shape();
                shape.graphics.beginFill(0x799cd6, 0.3);
                shape.graphics.lineStyle(2, 0xffffff, 0.4);
                shape.graphics.drawCircle(_circle1X, _circle1Y, _radius1 + 2);
                shape.graphics.endFill();
                shape.graphics.beginFill(0x799cd6);
                shape.graphics.lineStyle(1, 0x000000, 0.5);
                shape.graphics.drawCircle(_circle2X, _circle2Y, _radius2);
                shape.graphics.endFill();
                shape.graphics.beginFill(0x28405b);
                shape.graphics.lineStyle(1, 0x081f3e);
                shape.graphics.moveTo(_circle2X - Math.sqrt(3) / 6 * _lineLength, _circle2Y - _lineLength / 2);
                shape.graphics.lineTo(_circle2X + Math.sqrt(3) / 3 * _lineLength, _circle2Y);
                shape.graphics.lineTo(_circle2X - Math.sqrt(3) / 6 * _lineLength, _circle2Y + _lineLength / 2);
                shape.graphics.lineTo(_circle2X - Math.sqrt(3) / 6 * _lineLength, _circle2Y - _lineLength / 2);
                shape.graphics.endFill();
                var renderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(shape);
                this._btnPlayTexture = renderTexture;
            }
            if (this._btnPlay == null) {
                this._btnPlay = new easy.Button();
                this._btnPlay.statesLength = 1;
                this._btnPlay.texture = this._btnPlayTexture;
                this._btnPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapPlay, this);
            }
            this.addChild(this._btnPlay);
            this._btnPlay.width = this._btnPlayTexture.textureWidth;
            this._btnPlay.height = this._btnPlayTexture.textureHeight;
            this._btnPlay.x = this.cx - this._btnPlay.cx;
            this._btnPlay.y = this.cy - this._btnPlay.cy;
            if (this._btnPlayTween == null) {
                this._btnPlayTween = egret.Tween.get(this._btnPlay, { loop: true }).to({ alpha: 0.5 }, 3000).wait(1000).to({ alpha: 1 }, 3000).wait(1000);
            }
            this._btnPlayTween.setPaused(false);
            //显示视频截图
            if (this._imgPoster && this._imgPoster.parent) {
                this._imgPoster.visible = true;
            }
        };
        /**
         * 隐藏播放按钮
         */
        Video.prototype.onHiddenBtnPlay = function () {
            if (this._btnPlay) {
                this._btnPlay.removeFromParent();
                this._btnPlayTween.setPaused(true);
            }
        };
        /**
         * 视频播放完毕
         */
        Video.prototype.onVideoComplete = function (event) {
            if (this._video) {
                this._video.position = 0;
                easy.MyEvent.sendEvent(easy.EventType.VIDEO_END); //发送结束事件
                this._video.removeEventListener(egret.Event.ENDED, this.onVideoComplete, this);
            }
            this.onShowBtnPlay();
        };
        Video.prototype.onTouchTapPlay = function () {
            this.play();
        };
        /**
         * 点击触发是播放还是停止
         */
        Video.prototype.playOrStopVideo = function (event) {
            if (this._video) {
                if (this._state == Video.STATE_PLAYING) {
                    this.pause();
                }
                else {
                    this.play();
                }
            }
        };
        Object.defineProperty(Video.prototype, "state", {
            get: function () {
                return this._state;
            },
            /**
             * 播放状态state
             * @param value
             */
            set: function (value) {
                if (this._state != value) {
                    this._state = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "source", {
            get: function () {
                return this._source;
            },
            /**
             * 设置播放源
             * @param value
             */
            set: function (value) {
                if (this._source != value) {
                    this._source = value;
                    if (this._video)
                        this._video.src = this._source;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "poster", {
            get: function () {
                return this._poster;
            },
            /**
             * 画面截图
             * @param value
             */
            set: function (value) {
                if (this._poster != value) {
                    this._poster = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "valume", {
            get: function () {
                return this._valume;
            },
            /**
             * 设置播放音量0-100
             * @param value
             */
            set: function (value) {
                if (this._valume != value) {
                    this._valume = value;
                    if (this._video)
                        this._video.volume = this._valume / 100;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "fullscreen", {
            get: function () {
                return this._fullscreen;
            },
            /**
             * 设置播放音量0-100
             * @param value
             */
            set: function (value) {
                if (this._fullscreen != value) {
                    this._fullscreen = value;
                    if (this._video)
                        this._video.fullscreen = this._fullscreen;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "autoplay", {
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
        Object.defineProperty(Video.prototype, "loop", {
            get: function () {
                return this._loop;
            },
            /**
             * 设置循环播放
             * @param value
             */
            set: function (value) {
                if (this._loop != value) {
                    this._loop = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "showBtnPlay", {
            get: function () {
                return this._showBtnPlay;
            },
            /**
             * 显示播放按钮
             * @param value
             */
            set: function (value) {
                if (this._showBtnPlay != value) {
                    this._showBtnPlay = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Video.prototype, "btnPlayTexture", {
            get: function () {
                return this._btnPlayTexture;
            },
            /**
             * 设置播放按钮的材质
             * @param value
             */
            set: function (value) {
                if (this._btnPlayTexture != value) {
                    this._btnPlayTexture = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 播放
         * @param startTime
         * @param loop
         */
        Video.prototype.play = function (startTime) {
            if (startTime === void 0) { startTime = 0; }
            if (this._video && this._source) {
                this._state = Video.STATE_PLAYING;
                this.onHiddenBtnPlay();
                //this._video.load(this._source);
                if (startTime == 0)
                    startTime = this._video.position;
                this._video.addEventListener(egret.Event.ENDED, this.onVideoComplete, this);
                this._video.play(startTime, this._loop);
                if (this._imgPoster && this._imgPoster.parent) {
                    this._imgPoster.visible = false;
                }
            }
        };
        /**
         * 加载source的内容
         * @param url
         */
        Video.prototype.load = function (url) {
            this._source = url;
            if (this._video)
                this._video.load(this.source);
        };
        Video.prototype.close = function () {
            this._state = Video.STATE_STOP;
            if (this._video) {
                this._video.close();
                this.onShowBtnPlay();
            }
            if (this._imgPoster && this._imgPoster.parent) {
                this._imgPoster.visible = true;
            }
        };
        Video.prototype.pause = function () {
            this._state = Video.STATE_STOP;
            if (this._video) {
                this._state = Video.STATE_PAUSE;
                this._video.pause();
                this.onShowBtnPlay();
            }
        };
        Video.prototype.draw = function () {
            _super.prototype.draw.call(this);
            if (this._video == null)
                return;
            if (this._showBtnPlay && this._state != Video.STATE_PLAYING) {
                this.onShowBtnPlay();
            }
            if (easy.StringUtil.isUsage(this._poster)) {
                if (this._imgPoster == null) {
                    this._imgPoster = new egret.Bitmap();
                    this.addChildAt(this._imgPoster, this.getChildIndex(this._btnPlay));
                }
                if (easy.ResManager.getRes(this._poster)) {
                    this._imgPoster.texture = easy.ResManager.getRes(this._poster);
                    if (this._imgPoster.texture) {
                        this._imgPoster.x = this.cx - this._imgPoster.width / 2;
                        this._imgPoster.y = this.cy - this._imgPoster.height / 2;
                    }
                }
                else {
                    easy.EventManager.addEventListener(easy.EventType.RESOURCE_DOWNLOADED, this.onDownloadedPoster, this);
                }
            }
            this._video.width = this.width;
            this._video.height = this.height;
            if (this._btnPlay && this._btnPlay.texture != this._btnPlayTexture) {
                this._btnPlay.texture = this._btnPlayTexture;
            }
        };
        Video.prototype.onDownloadedPoster = function (myevent) {
            if (easy.ResManager.getRes(this._poster)) {
                easy.EventManager.removeEventListener(easy.EventType.RESOURCE_DOWNLOADED, this.onDownloadedPoster, this);
                this._imgPoster.texture = easy.ResManager.getRes(this._poster);
                if (this._imgPoster.texture) {
                    this._imgPoster.x = this.cx - this._imgPoster.width / 2;
                    this._imgPoster.y = this.cy - this._imgPoster.height / 2;
                }
            }
        };
        return Video;
    }(easy.Group));
    Video.STATE_PLAYING = "playing";
    Video.STATE_PAUSE = "pause";
    Video.STATE_STOP = "stop";
    easy.Video = Video;
    __reflect(Video.prototype, "easy.Video");
})(easy || (easy = {}));
