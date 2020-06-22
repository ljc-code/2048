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
var game2048;
(function (game2048) {
    /**
     * <p>moveGame的逻辑类</p>
     * @date  :2019-01-15 20:13:24
     * @EasyGame.org Tools
     */
    var moveGameView = (function (_super) {
        __extends(moveGameView, _super);
        function moveGameView() {
            var _this = _super.call(this) || this;
            _this.allData = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            _this.allNum = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
            _this.changeColor = [0xE9967A, 0xFA8072, 0xFFA500, 0xFF8C00, 0xFF7F50, 0xF08080, 0xFF6347, 0xFF4500, 0xFF0000, 0xFF69B4, 0xFF1493];
            _this.merge = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            _this._grade = 0; //暂存分数
            _this._only = true;
            return _this;
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        moveGameView.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.ui = new game2048.moveGame();
        };
        Object.defineProperty(moveGameView.prototype, "ui", {
            /**
             * 获取ui对象
             * @returns
             */
            get: function () {
                return this._ui;
            },
            /**
             * 设置ui对象
             * @param
             */
            set: function (myui) {
                this.setUI(myui);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 初始化一些必要的逻辑数据
         * 这个方法是在第一次加入stage的时候,做调用
         */
        moveGameView.prototype.initData = function () {
            _super.prototype.initData.call(this);
            //TODO 添加协议弱响应的方法,一般是用来驱动刷新当前的ui
            //参数说明:第一个参数是协议的id号
            //        第二个参数是本类public的方法,方法唯一的参数就是对应的协议实例,如下方法全名为onPktLoginResult(pkt:MyProtocalCmd)
            //this.addHandlePacket(ID_PACKET, "onPktLoginResult")
            //TODO 添加事件的弱响应的方法,一般是用来驱动刷新当前的ui
            //注意:必须调用MessageControler.addEvent()注册事件名称,否者不会转发到这里
            //参数说明:第一个参数是事件名称
            //        第二个参数是本类public的方法,方法唯一的参数就是MyEvent实例,如下方法全名为onMyEventLoginResult(event:easy.MyEvent)
            //this.addHandleEvent("LOGIN_RESULT", "onMyEventLoginResult");
            //TODO UI层声明的组件,可能会用到,请自行启用
            //TODO View逻辑可在此继续添加
            for (var i = 1; i < 17; i++) {
                this.ui["label" + i].visible = false;
                easy.TweenEffect.setAnchorXY(this.ui["label" + i]);
                this.ui["label" + i].border = 0;
            }
            easy.TweenEffect.setAnchorXY(this.ui.btnAgain);
            this.ranShow();
            this.ui.groupSlide.touchEnabled = true;
            this.ui.groupSlide.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.start, this);
            this.ui.groupSlide.addEventListener(egret.TouchEvent.TOUCH_END, this.end, this);
            this.ui.btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.again, this);
            this.ui.labelGrade2.text = "" + 0;
            this.ui.group_Mask.visible = false;
            this.ui.group_Mask.alpha = 0;
            this.bgcolorFn();
        };
        moveGameView.prototype.again = function () {
            this.ui.group_Mask.visible = false;
            this.allData = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            this._grade = 0;
            this.ui.labelGrade2.text = "" + 0;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (this.allData[i][j] == 0) {
                        this.ui["label" + (i * 4 + j + 1)].visible = false;
                    }
                    else {
                        this.ui["label" + (i * 4 + j + 1)].visible = true;
                        this.ui["label" + (i * 4 + j + 1)].text = "" + this.allData[i][j];
                    }
                }
            }
            this.ranShow();
        };
        moveGameView.prototype.ranShow = function () {
            var _numShowCol = Math.floor(Math.random() * 4); //行
            var _numShowRow = Math.floor(Math.random() * 4); //列
            var twoAndFour = Math.floor(Math.random() * 2 + 1) * 2; //随机2或4
            if (this.allData[_numShowCol][_numShowRow] == 0) {
                this.allData[_numShowCol][_numShowRow] = twoAndFour;
                this.ui["label" + (_numShowCol * 4 + _numShowRow + 1)].visible = true;
                this.ui["label" + (_numShowCol * 4 + _numShowRow + 1)].scaleX = this.ui["label" + (_numShowCol * 4 + _numShowRow + 1)].scaleY = 0.3;
                egret.Tween.get(this.ui["label" + (_numShowCol * 4 + _numShowRow + 1)]).to({ scaleX: 1, scaleY: 1 }, 100);
                this.ui["label" + (_numShowCol * 4 + _numShowRow + 1)].text = this.allData[_numShowCol][_numShowRow];
            }
            else {
                this.ranShow();
            }
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (this.allData[i][j] == 2) {
                        this.ui["label" + (4 * i + j + 1)].bgColor = 0xE9967A;
                    }
                    else if (this.allData[i][j] == 4) {
                        this.ui["label" + (4 * i + j + 1)].bgColor = 0xFA8072;
                    }
                }
            }
        };
        moveGameView.prototype.leftmove = function (i, n, j, num4) {
            if (num4 == 1) {
                for (var x = n + 1; x < j; x++) {
                    if (this.allData[i][x] != 0) {
                        return false;
                    }
                }
                return true;
            }
            if (num4 == 2) {
                for (var x = n - 1; x > j; x--) {
                    if (this.allData[i][x] != 0) {
                        return false;
                    }
                }
                return true;
            }
            if (num4 == 3) {
                for (var x = n + 1; x < i; x++) {
                    if (this.allData[x][j] != 0) {
                        return false;
                    }
                }
                return true;
            }
            if (num4 == 4) {
                for (var x = n - 1; x > i; x--) {
                    if (this.allData[x][j] != 0) {
                        return false;
                    }
                }
                return true;
            }
        };
        moveGameView.prototype.bgcolorFn = function () {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    for (var x = 0; x < 11; x++) {
                        if (this.allData[i][j] == this.allNum[x]) {
                            this.ui["label" + (4 * i + j + 1)].bgColor = this.changeColor[x];
                        }
                    }
                }
            }
        };
        moveGameView.prototype.restore = function () {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var labelx = j * 155 + 67.5;
                    var labely = i * 155 + 67.5;
                    this.ui["label" + (i * 4 + j + 1)].x = labelx;
                    this.ui["label" + (i * 4 + j + 1)].y = labely;
                }
            }
            this.bgcolorFn();
        };
        moveGameView.prototype.gameOver = function () {
            this.ui.groupAll.touchEnabled = false;
            this.ui.group_Mask.visible = true;
            egret.Tween.get(this.ui.group_Mask).to({ alpha: 1 }, 1000);
        };
        moveGameView.prototype.canLeftSlide = function () {
            for (var i = 0; i < this.allData.length; i++) {
                for (var j = 1; j < this.allData[i].length; j++) {
                    if (this.allData[i][j] != 0) {
                        if (this.allData[i][j - 1] == 0 || this.allData[i][j] == this.allData[i][j - 1]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        moveGameView.prototype.canRightSlide = function () {
            for (var i = 0; i < this.allData.length; i++) {
                for (var j = 0; j < this.allData[i].length - 1; j++) {
                    if (this.allData[i][j] != 0) {
                        if (this.allData[i][j + 1] == 0 || this.allData[i][j] == this.allData[i][j + 1]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        moveGameView.prototype.canTopSlide = function () {
            for (var i = 1; i < this.allData.length; i++) {
                for (var j = 0; j < this.allData[i].length; j++) {
                    if (this.allData[i][j] != 0) {
                        if (this.allData[i - 1][j] == 0 || this.allData[i][j] == this.allData[i - 1][j]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        moveGameView.prototype.canBotSlide = function () {
            for (var i = 0; i < this.allData.length - 1; i++) {
                for (var j = 0; j < this.allData[i].length; j++) {
                    if (this.allData[i][j] != 0) {
                        if (this.allData[i + 1][j] == 0 || this.allData[i][j] == this.allData[i + 1][j]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        moveGameView.prototype._show = function () {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (this.allData[i][j] != 0) {
                        this.ui["label" + (i * 4 + j + 1)].text = "" + this.allData[i][j];
                        this.ui["label" + (i * 4 + j + 1)].visible = true;
                        this.ui["label" + (i * 4 + j + 1)].draw();
                    }
                }
            }
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (this.allData[i][j] == 0) {
                        this.ui["label" + (i * 4 + j + 1)].visible = false;
                    }
                }
            }
        };
        moveGameView.prototype.animate = function (i, n) {
            egret.setTimeout(function () {
                egret.Tween.get(this.ui["label" + (i * 4 + n + 1)]).to({ scaleX: 1.2, scaleY: 1.2 }, 100).to({ scaleX: 1, scaleY: 1 }, 100);
            }, this, 100);
        };
        moveGameView.prototype.slide = function (i, n, j, q) {
            if (this.allData[i][n] == 0 && this.leftmove(i, n, j, q)) {
                this.allData[i][n] = this.allData[i][j];
                this.allData[i][j] = 0;
                egret.Tween.get(this.ui["label" + (i * 4 + j + 1)]).to({ x: 155 * n + 67.5, y: 155 * i + 67.5 }, 100).call(this._show, this).call(this.restore, this);
            }
            else if (this.allData[i][n] == this.allData[i][j] && this.merge[i][n] == 0 && this.leftmove(i, n, j, q)) {
                this.allData[i][n] = this.allData[i][j] * 2;
                this.allData[i][j] = 0;
                egret.Tween.get(this.ui["label" + (i * 4 + j + 1)]).to({ x: 155 * n + 67.5, y: 155 * i + 67.5 }, 100).call(this._show, this).call(this.restore, this);
                this.animate(i, n);
                this.merge[i][n] = 1;
                this._grade += this.allData[i][n];
                this.ui.labelGrade2.text = "" + this._grade;
            }
        };
        moveGameView.prototype.slide2 = function (i, n, j, q) {
            if (this.allData[n][j] == 0 && this.leftmove(i, n, j, q)) {
                this.allData[n][j] = this.allData[i][j];
                this.allData[i][j] = 0;
                egret.Tween.get(this.ui["label" + (i * 4 + j + 1)]).to({ x: 155 * j + 67.5, y: 155 * n + 67.5 }, 100).call(this._show, this).call(this.restore, this);
            }
            else if (this.allData[n][j] == this.allData[i][j] && this.merge[n][j] == 0 && this.leftmove(i, n, j, q)) {
                this.allData[n][j] = this.allData[i][j] * 2;
                this.allData[i][j] = 0;
                egret.Tween.get(this.ui["label" + (i * 4 + j + 1)]).to({ x: 155 * j + 67.5, y: 155 * n + 67.5 }, 100).call(this._show, this).call(this.restore, this);
                this.animate(n, j);
                this.merge[n][j] = 1;
                this._grade += this.allData[n][j];
                this.ui.labelGrade2.text = "" + this._grade;
            }
        };
        moveGameView.prototype._move = function (_num) {
            this.merge = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; //用于标记是否已合并
            if (_num == 1) {
                for (var i = 0; i < 4; i++) {
                    for (var j = 1; j < 4; j++) {
                        if (this.allData[i][j] != 0) {
                            for (var n = 0; n < j; n++) {
                                this.slide(i, n, j, 1);
                            }
                        }
                    }
                }
            }
            if (_num == 2) {
                for (var i = 0; i < 4; i++) {
                    for (var j = 2; j >= 0; j--) {
                        if (this.allData[i][j] != 0) {
                            for (var n = 3; n > j; n--) {
                                this.slide(i, n, j, 2);
                            }
                        }
                    }
                }
            }
            if (_num == 3) {
                for (var i = 1; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if (this.allData[i][j] != 0) {
                            for (var n = 0; n < i; n++) {
                                this.slide2(i, n, j, 3);
                            }
                        }
                    }
                }
            }
            if (_num == 4) {
                for (var i = 2; i >= 0; i--) {
                    for (var j = 0; j < 4; j++) {
                        if (this.allData[i][j] != 0) {
                            for (var n = 3; n > i; n--) {
                                this.slide2(i, n, j, 4);
                            }
                        }
                    }
                }
            }
            egret.setTimeout(function () {
                this.ranShow();
            }, this, 300);
        };
        moveGameView.prototype.start = function (e) {
            this.startx = e.stageX;
            this.starty = e.stageY;
        };
        moveGameView.prototype.end = function (e) {
            this.endx = e.stageX;
            this.endy = e.stageY;
            var bigY = Math.abs(this.starty - this.endy); //取绝对值Math.abs()
            var bigX = Math.abs(this.startx - this.endx);
            if (bigY > bigX) {
                if (this.starty > this.endy) {
                    for (var i = 3; i >= 0; i--) {
                        for (var j = 3; j >= 0; j--) {
                            this.ui.groupAll.addChild(this.ui["label" + (4 * i + j + 1)]);
                        }
                    }
                    if (this.canTopSlide()) {
                        this._move(3);
                    }
                }
                else {
                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 4; j++) {
                            this.ui.groupAll.addChild(this.ui["label" + (4 * i + j + 1)]);
                        }
                    }
                    if (this.canBotSlide()) {
                        this._move(4);
                    }
                }
            }
            else if (this.startx > this.endx) {
                for (var i = 3; i >= 0; i--) {
                    for (var j = 3; j >= 0; j--) {
                        this.ui.groupAll.addChild(this.ui["label" + (4 * i + j + 1)]);
                    }
                }
                if (this.canLeftSlide()) {
                    this._move(1);
                }
            }
            else if (this.startx < this.endx) {
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        this.ui.groupAll.addChild(this.ui["label" + (4 * i + j + 1)]);
                    }
                }
                if (this.canRightSlide()) {
                    this._move(2);
                }
            }
            egret.setTimeout(function () {
                if (this.canLeftSlide() || this.canRightSlide() || this.canTopSlide() || this.canBotSlide()) {
                }
                else {
                    this.gameOver();
                }
            }, this, 500);
        };
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        moveGameView.prototype.enter = function () {
            _super.prototype.enter.call(this);
            //TODO 在这里写,进入时,初始数据的操作
        };
        /**
         * enter的过渡效果
         */
        moveGameView.prototype.enterTransition = function () {
            _super.prototype.enterTransition.call(this);
            //TODO 可以覆盖这里,写自己想要的enter效果
        };
        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        moveGameView.prototype.outer = function () {
            _super.prototype.outer.call(this);
            //TODO 在这里写,退出时,清理数据的操作
        };
        /**
         * outer的过渡效果
         */
        moveGameView.prototype.outerTransition = function () {
            _super.prototype.outerTransition.call(this);
            //TODO 可以覆盖这里,写自己想要的out效果
        };
        /**
         * 通过ResManager.getTexture(url)触发下载的url资源,会通知到当前显示的view中的onMyEventResDownloaded方法
         * 参数myevent携带两个数据
         *    url:完成加载的url
         *    data:完成加载的数据内容
         * 可以通过ResManager.getTexture(url),再次取到data数据
         * @param event
         */
        //public onMyEventResDownloaded(myevent:easy.MyEvent):void {
        //TODO 当前view动态加载的资源,请在这里添加刷新逻辑
        //}
        /**
         * View自身的材质,首次下载完成会调用加载一次,刷新UI皮肤显示
         * 使用了框架的UI机制,单ui的资源下载完成会调用改方法刷新
         * 若view中有逻辑使用到ui的素材,应该在这里做素材的赋值
         */
        moveGameView.prototype.validateNow = function () {
            _super.prototype.validateNow.call(this);
            //TODO 初始特殊的素材资源,需要调用可以写在这里
            //if (this.ui && this.ui.spriteSheet) {
            //
            //}
        };
        return moveGameView;
    }(easy.View));
    game2048.moveGameView = moveGameView;
    __reflect(moveGameView.prototype, "game2048.moveGameView");
})(game2048 || (game2048 = {}));
