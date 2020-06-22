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
     * <p>game3的逻辑类</p>
     * @date  :2019-01-22 14:41:56
     * @EasyGame.org Tools
     */
    var game3View = (function (_super) {
        __extends(game3View, _super);
        function game3View() {
            var _this = _super.call(this) || this;
            _this.arr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            _this.labelObj = {};
            _this.merge = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            return _this;
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        game3View.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.ui = new game2048.game3();
        };
        Object.defineProperty(game3View.prototype, "ui", {
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
        game3View.prototype.initData = function () {
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
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.start, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.end, this);
            this.ranCreat();
        };
        game3View.prototype.ranCreat = function () {
            var _numShowCol = Math.floor(Math.random() * 4); //行
            var _numShowRow = Math.floor(Math.random() * 4); //列
            var twoAndFour = Math.floor(Math.random() * 2 + 1) * 2; //随机2或4
            if (this.arr[_numShowCol][_numShowRow] == 0) {
                this.arr[_numShowCol][_numShowRow] = twoAndFour;
                var label = new easy.Label();
                this.ui.group.addChild(label);
                label.fontSize = 50;
                label.color = 0xffffff;
                label.bgColor = 0x0;
                label.vAlign = "middle";
                label.hAlign = "center";
                label.autoSize = false;
                label.width = 135;
                label.height = 135;
                label.text = "" + twoAndFour;
                label.x = 155 * _numShowRow;
                label.y = 155 * _numShowCol;
                label.border = false;
                this.labelObj[_numShowCol + "_" + _numShowRow] = label;
            }
            else {
                this.ranCreat();
            }
            console.log(this.labelObj);
        };
        game3View.prototype.canLeftSlide = function () {
            for (var i = 0; i < this.arr.length; i++) {
                for (var j = 1; j < this.arr[i].length; j++) {
                    if (this.arr[i][j] != 0) {
                        if (this.arr[i][j - 1] == 0 || this.arr[i][j] == this.arr[i][j - 1]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        game3View.prototype.canRightSlide = function () {
            for (var i = 0; i < this.arr.length; i++) {
                for (var j = 0; j < this.arr[i].length - 1; j++) {
                    if (this.arr[i][j] != 0) {
                        if (this.arr[i][j + 1] == 0 || this.arr[i][j] == this.arr[i][j + 1]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        game3View.prototype.canTopSlide = function () {
            for (var i = 1; i < this.arr.length; i++) {
                for (var j = 0; j < this.arr[i].length; j++) {
                    if (this.arr[i][j] != 0) {
                        if (this.arr[i - 1][j] == 0 || this.arr[i][j] == this.arr[i - 1][j]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        game3View.prototype.canBotSlide = function () {
            for (var i = 0; i < this.arr.length - 1; i++) {
                for (var j = 0; j < this.arr[i].length; j++) {
                    if (this.arr[i][j] != 0) {
                        if (this.arr[i + 1][j] == 0 || this.arr[i][j] == this.arr[i + 1][j]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        game3View.prototype.leftmove = function (i, n, j, num4) {
            if (num4 == 1) {
                for (var x = n + 1; x < j; x++) {
                    if (this.arr[i][x] != 0) {
                        return false;
                    }
                }
                return true;
            }
            if (num4 == 2) {
                for (var x = n - 1; x > j; x--) {
                    if (this.arr[i][x] != 0) {
                        return false;
                    }
                }
                return true;
            }
            if (num4 == 3) {
                for (var x = n + 1; x < i; x++) {
                    if (this.arr[x][j] != 0) {
                        return false;
                    }
                }
                return true;
            }
            if (num4 == 4) {
                for (var x = n - 1; x > i; x--) {
                    if (this.arr[x][j] != 0) {
                        return false;
                    }
                }
                return true;
            }
        };
        game3View.prototype._move = function (_num) {
            this.merge = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; //用于标记是否已合并
            if (_num == 1) {
                for (var i = 0; i < 4; i++) {
                    for (var j = 1; j < 4; j++) {
                        if (this.arr[i][j] != 0) {
                            for (var n = 0; n < j; n++) {
                                if (this.arr[i][n] == 0 && this.leftmove(i, n, j, 1)) {
                                    this.arr[i][n] = this.arr[i][j];
                                    this.arr[i][j] = 0;
                                    console.log(i + "_" + j);
                                    egret.Tween.get(this.labelObj[i + "_" + j]).to({ x: 155 * n, y: 155 * i }, 100);
                                    this.labelObj[i + "_" + n] = this.labelObj[i + "_" + j];
                                    delete this.labelObj[i + "_" + j];
                                    console.log(this.labelObj);
                                    break;
                                }
                                else if (this.arr[i][n] == this.arr[i][j] && this.merge[i][n] == 0 && this.leftmove(i, n, j, 1)) {
                                    this.arr[i][n] = this.arr[i][j] * 2;
                                    this.arr[i][j] = 0;
                                    console.log(i + "_" + j);
                                    egret.Tween.get(this.labelObj[i + "_" + j]).to({ x: 155 * n, y: 155 * i }, 100);
                                    this.labelObj[i + "_" + n].text = "" + Number(this.labelObj[i + "_" + j].text) * 2;
                                    delete this.labelObj[i + "_" + j];
                                    console.log(this.labelObj);
                                    this.merge[i][n] = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
                console.log(this.arr);
                egret.setTimeout(function () {
                    this.ranCreat();
                }, this, 200);
            }
            if (_num == 2) {
                for (var i = 0; i < 4; i++) {
                    for (var j = 2; j >= 0; j--) {
                        if (this.arr[i][j] != 0) {
                            for (var n = 3; n > j; n--) {
                                if (this.arr[i][n] == 0 && this.leftmove(i, n, j, 2)) {
                                    this.arr[i][n] = this.arr[i][j];
                                    this.arr[i][j] = 0;
                                    console.log(i + "_" + j);
                                    egret.Tween.get(this.labelObj[i + "_" + j]).to({ x: 155 * n, y: 155 * i }, 100).wait(100);
                                    this.labelObj[i + "_" + n] = this.labelObj[i + "_" + j];
                                    delete this.labelObj[i + "_" + j];
                                    console.log(this.labelObj);
                                    break;
                                }
                                else if (this.arr[i][n] == this.arr[i][j] && this.merge[i][n] == 0 && this.leftmove(i, n, j, 2)) {
                                    this.arr[i][n] = this.arr[i][j] * 2;
                                    this.arr[i][j] = 0;
                                    egret.Tween.get(this.labelObj[i + "_" + j]).to({ x: 155 * n, y: 155 * i }, 100).wait(100);
                                    this.labelObj[i + "_" + n].text = "" + Number(this.labelObj[i + "_" + j].text) * 2;
                                    delete this.labelObj[i + "_" + j];
                                    console.log(this.labelObj);
                                    this.merge[i][n] = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
                console.log(this.arr);
                egret.setTimeout(function () {
                    this.ranCreat();
                }, this, 200);
            }
            if (_num == 3) {
                for (var i = 1; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if (this.arr[i][j] != 0) {
                            for (var n = 0; n < i; n++) {
                                if (this.arr[n][j] == 0 && this.leftmove(i, n, j, 3)) {
                                    this.arr[n][j] = this.arr[i][j];
                                    this.arr[i][j] = 0;
                                    console.log(i + "_" + j);
                                    egret.Tween.get(this.labelObj[i + "_" + j]).to({ x: 155 * j, y: 155 * n }, 100).wait(100);
                                    this.labelObj[n + "_" + j] = this.labelObj[i + "_" + j];
                                    delete this.labelObj[i + "_" + j];
                                    console.log(this.labelObj);
                                    break;
                                }
                                else if (this.arr[n][j] == this.arr[i][j] && this.merge[n][j] == 0 && this.leftmove(i, n, j, 3)) {
                                    this.arr[n][j] = this.arr[i][j] * 2;
                                    this.arr[i][j] = 0;
                                    egret.Tween.get(this.labelObj[i + "_" + j]).to({ x: 155 * j, y: 155 * n }, 100).wait(100);
                                    this.labelObj[n + "_" + j].text = "" + Number(this.labelObj[i + "_" + j].text) * 2;
                                    delete this.labelObj[i + "_" + j];
                                    console.log(this.labelObj);
                                    this.merge[n][j] = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
                console.log(this.arr);
                egret.setTimeout(function () {
                    this.ranCreat();
                }, this, 200);
            }
            if (_num == 4) {
                for (var i = 2; i >= 0; i--) {
                    for (var j = 0; j < 4; j++) {
                        if (this.arr[i][j] != 0) {
                            for (var n = 3; n > i; n--) {
                                if (this.arr[n][j] == 0 && this.leftmove(i, n, j, 4)) {
                                    this.arr[n][j] = this.arr[i][j];
                                    this.arr[i][j] = 0;
                                    console.log(i + "_" + j);
                                    egret.Tween.get(this.labelObj[i + "_" + j]).to({ x: 155 * j, y: 155 * n }, 100).wait(100);
                                    this.labelObj[n + "_" + j] = this.labelObj[i + "_" + j];
                                    delete this.labelObj[i + "_" + j];
                                    console.log(this.labelObj);
                                    break;
                                }
                                else if (this.arr[n][j] == this.arr[i][j] && this.merge[n][j] == 0 && this.leftmove(i, n, j, 4)) {
                                    this.arr[n][j] = this.arr[i][j] * 2;
                                    this.arr[i][j] = 0;
                                    egret.Tween.get(this.labelObj[i + "_" + j]).to({ x: 155 * j, y: 155 * n }, 100).wait(100);
                                    this.labelObj[n + "_" + j].text = "" + Number(this.labelObj[i + "_" + j].text) * 2;
                                    delete this.labelObj[i + "_" + j];
                                    console.log(this.labelObj);
                                    this.merge[n][j] = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
                console.log(this.arr);
                egret.setTimeout(function () {
                    this.ranCreat();
                }, this, 200);
            }
        };
        game3View.prototype.start = function (e) {
            this.startx = e.stageX;
            this.starty = e.stageY;
        };
        game3View.prototype.end = function (e) {
            this.endx = e.stageX;
            this.endy = e.stageY;
            var bigY = Math.abs(this.starty - this.endy); //取绝对值Math.abs()
            var bigX = Math.abs(this.startx - this.endx);
            if (bigY > bigX) {
                if (this.starty > this.endy) {
                    console.log("上滑");
                    if (this.canTopSlide()) {
                        this._move(3);
                    }
                }
                else {
                    console.log("下滑");
                    if (this.canBotSlide()) {
                        this._move(4);
                    }
                }
            }
            else if (this.startx > this.endx) {
                console.log("左滑");
                if (this.canLeftSlide()) {
                    this._move(1);
                }
            }
            else if (this.startx < this.endx) {
                console.log("右滑");
                if (this.canRightSlide()) {
                    this._move(2);
                }
            }
            //egret.setTimeout(function(){
            //    if(this.canLeftSlide() || this.canRightSlide() || this.canTopSlide() || this.canBotSlide()) {
            //
            //    }else{
            //        this.gameOver();
            //    }
            //},this,300);
        };
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        game3View.prototype.enter = function () {
            _super.prototype.enter.call(this);
            //TODO 在这里写,进入时,初始数据的操作
        };
        /**
         * enter的过渡效果
         */
        game3View.prototype.enterTransition = function () {
            _super.prototype.enterTransition.call(this);
            //TODO 可以覆盖这里,写自己想要的enter效果
        };
        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        game3View.prototype.outer = function () {
            _super.prototype.outer.call(this);
            //TODO 在这里写,退出时,清理数据的操作
        };
        /**
         * outer的过渡效果
         */
        game3View.prototype.outerTransition = function () {
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
        game3View.prototype.validateNow = function () {
            _super.prototype.validateNow.call(this);
            //TODO 初始特殊的素材资源,需要调用可以写在这里
            //if (this.ui && this.ui.spriteSheet) {
            //
            //}
        };
        return game3View;
    }(easy.View));
    game2048.game3View = game3View;
    __reflect(game3View.prototype, "game2048.game3View");
})(game2048 || (game2048 = {}));
