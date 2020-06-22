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
     * <p>diamond的逻辑类</p>
     * @date  :2019-02-15 10:10:38
     * @EasyGame.org Tools
     */
    var diamondView = (function (_super) {
        __extends(diamondView, _super);
        function diamondView() {
            var _this = _super.call(this) || this;
            _this.arrData = []; //最终获得的label.text数据
            _this.arrLabel = []; //暂存label.text
            _this.labelObj = []; //储存label
            _this._group = [];
            _this._shuzu1 = []; //相同的Code
            _this._shuzu2 = []; //已判断过的Code
            _this.panduan = true;
            return _this;
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        diamondView.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.ui = new game2048.diamond();
        };
        Object.defineProperty(diamondView.prototype, "ui", {
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
        diamondView.prototype.initData = function () {
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
            this.ui.group.visible = false;
            this.ui.group.alpha = 0;
            egret.Tween.get(this.ui.groupMask, { loop: true }).to({ x: 171 }, 5000).to({ x: 475 }).call(this.create, this);
            this.create();
        };
        diamondView.prototype.create = function () {
            var row = new easy.Group();
            this.ui.groupAll.addChild(row);
            this._group.push(row);
            row.width = 639;
            row.height = 87;
            row.showBg = false;
            row.y = this.ui.groupAll.height;
            for (var i = 0; i < 7; i++) {
                var label = new easy.Label(); //列(label)
                row.addChild(label);
                label.width = 87;
                label.height = 87;
                label.bgColor = 0x99ffff;
                label.border = false;
                var random = Math.floor(Math.random() * 4 + 1); //1-9
                label.text = "" + random;
                label.fontSize = 50;
                label.color = 0xffffff;
                label.hAlign = "center";
                label.vAlign = "middle";
                label.name = "" + this.labelObj.length;
                //label.y = 92*6;
                if (i > 0) {
                    label.x = 92 * i;
                }
                else {
                    label.x = 87 * i;
                }
                var labTxt = parseInt(label.text);
                this.arrLabel.push(labTxt);
                this.labelObj.push(label);
                label.touchEnabled = true;
                label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.game, this);
            }
            this.arrData.push(this.arrLabel.slice(-7));
            for (var i = 0; i < this._group.length; i++) {
                egret.Tween.get(this._group[i]).to({ y: this._group[i].y - 92 }, 100);
            }
            egret.setTimeout(function () {
                for (var i = 0; i < this.arrData.length; i++) {
                    for (var j = 0; j < this.arrData[i].length; j++) {
                        if (this.labelObj[7 * i + j].name) {
                            var aa = Math.floor(this.labelObj[7 * i + j].name / 7);
                            for (var x = 0; x < this._group.length; x++) {
                                if (this._group[aa] && this._group[aa].y == 5) {
                                    egret.Tween.removeTweens(this.ui.groupMask);
                                    this.gameOver();
                                }
                            }
                        }
                    }
                }
            }, this, 100);
        };
        diamondView.prototype.gameOver = function () {
            this.panduan = false;
            this.ui.group.visible = true;
            egret.Tween.get(this.ui.group).to({ alpha: 1 }, 300);
        };
        diamondView.prototype.success = function () {
            for (var i = 0; i < this.arrData.length; i++) {
                for (var j = 0; j < this.arrData[i].length; j++) {
                    if (this.arrData[i][j] == 10) {
                        egret.Tween.removeTweens(this.ui.groupMask);
                        easy.HeartBeat.removeListener(this, this.create);
                        this.ui.labelGameOver.text = "你赢了";
                        this.gameOver();
                    }
                }
            }
        };
        diamondView.prototype.game = function (e) {
            if (this.panduan) {
                if (e.currentTarget.bgColor != 0xFF6A6A) {
                    this._shuzu1 = [];
                    this._shuzu2 = [];
                    var labelRow = Math.floor(e.currentTarget.name / 7); //label所在行
                    var labelCol = e.currentTarget.name - (Math.floor(e.currentTarget.name / 7)) * 7; //label所在列
                    this.show(labelRow, labelCol, e.currentTarget.name);
                }
                else {
                    var name = parseInt(e.currentTarget.name);
                    var aa = parseInt(this.labelObj[name].text) + 1;
                    if (this._shuzu1.indexOf(name) != -1) {
                        this._shuzu1.splice(this._shuzu1.indexOf(name), 1); //删除选中后所要点击的
                        this.labelObj[name].text = "" + aa;
                        this.labelObj[name].bgColor = 0x99ffff;
                        var labelRow2 = Math.floor(name / 7); //label所在行
                        var labelCol2 = name - (Math.floor(name / 7)) * 7; //label所在列
                        this.arrData[labelRow2][labelCol2] = aa;
                        if (this.arrData[labelRow2][labelCol2] == 10) {
                            this.success();
                        }
                        for (var i = 0; i < this._shuzu1.length; i++) {
                            var index = this.labelObj.indexOf(this.labelObj[this._shuzu1[i]]);
                            if (index != -1) {
                                var labelRow3 = Math.floor(index / 7); //label所在行
                                var labelCol3 = index - (Math.floor(index / 7)) * 7; //label所在列
                                this.arrData[labelRow3][labelCol3] = 0;
                                this.labelObj[index].removeFromParent();
                                this.labelObj[index] = "";
                            }
                        }
                        this.labelMove();
                    }
                }
            }
        };
        diamondView.prototype.labelMove = function () {
            this.panduan = false;
            for (var i = 0; i < this.arrData.length; i++) {
                for (var j = 0; j < this.arrData[i].length; j++) {
                    if (this.arrData[i][j] != 0) {
                        var shuliang = 0;
                        for (var n = i + 1; n < this.arrData.length; n++) {
                            if (this.arrData[n] && this.arrData[n][j] == 0) {
                                shuliang++;
                            }
                        }
                        egret.Tween.get(this.labelObj[7 * i + j]).to({ y: this.labelObj[7 * i + j].y + 92 * shuliang }, 300);
                    }
                }
            }
            egret.setTimeout(function () { this.panduan = true; this.labelMove2(); }, this, 305);
        };
        diamondView.prototype.labelMove2 = function () {
            for (var i = this.arrData.length - 1; i >= 0; i--) {
                for (var j = this.arrData[i].length - 1; j >= 0; j--) {
                    if (this.arrData[i][j] != 0) {
                        var shuliang = 0;
                        for (var n = i + 1; n < this.arrData.length; n++) {
                            if (this.arrData[n] && this.arrData[n][j] == 0) {
                                shuliang++;
                            }
                        }
                        if (this.arrData[i + shuliang][j] == 0) {
                            this.arrData[i + shuliang][j] = this.arrData[i][j];
                            this.labelObj[7 * i + j].name = 7 * i + j + 7 * shuliang;
                            this.labelObj[7 * i + j + 7 * shuliang] = this.labelObj[7 * i + j];
                            this.labelObj[7 * i + j] = "";
                            this.arrData[i][j] = 0;
                            this.labelMove2();
                        }
                    }
                }
            }
        };
        diamondView.prototype.show = function (x, y, name1) {
            var name = parseInt(name1);
            if (this._shuzu1.indexOf(name) == -1)
                this._shuzu1.push(name);
            this._shuzu2.push(name);
            if (this.labelObj[name - 1] && this.arrData[x][y] == this.arrData[x][y - 1] && this._shuzu1.indexOf(name - 1) == -1) {
                this._shuzu1.push(name - 1);
            }
            if (this.labelObj[name + 1] && this.arrData[x][y] == this.arrData[x][y + 1] && this._shuzu1.indexOf(name + 1) == -1) {
                this._shuzu1.push(name + 1);
            }
            if (this.labelObj[name - 7] && this.arrData[x][y] == this.arrData[x - 1][y] && this._shuzu1.indexOf(name - 7) == -1) {
                this._shuzu1.push(name - 7);
            }
            if (this.labelObj[name + 7] && this.arrData[x][y] == this.arrData[x + 1][y] && this._shuzu1.indexOf(name + 7) == -1) {
                this._shuzu1.push(name + 7);
            }
            for (var i = 0; i < this._shuzu1.length; i++) {
                if (this._shuzu2.indexOf(this._shuzu1[i]) == -1) {
                    var labelRow = Math.floor(this._shuzu1[i] / 7); //label所在行
                    var labelCol = this._shuzu1[i] - (Math.floor(this._shuzu1[i] / 7)) * 7; //label所在列
                    this.show(labelRow, labelCol, this._shuzu1[i]);
                    break;
                }
            }
            for (var n = 0; n < this.labelObj.length; n++) {
                this.labelObj[n].bgColor = 0x99ffff;
            }
            for (var i = 0; i < this._shuzu1.length; i++) {
                var index = this.labelObj.indexOf(this.labelObj[this._shuzu1[i]]);
                this.labelObj[index].bgColor = 0xFF6A6A;
                if (this._shuzu1.length == 1) {
                    this.labelObj[index].bgColor = 0x99ffff;
                }
            }
        };
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        diamondView.prototype.enter = function () {
            _super.prototype.enter.call(this);
            //TODO 在这里写,进入时,初始数据的操作
        };
        /**
         * enter的过渡效果
         */
        diamondView.prototype.enterTransition = function () {
            _super.prototype.enterTransition.call(this);
            //TODO 可以覆盖这里,写自己想要的enter效果
        };
        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        diamondView.prototype.outer = function () {
            _super.prototype.outer.call(this);
            //TODO 在这里写,退出时,清理数据的操作
        };
        /**
         * outer的过渡效果
         */
        diamondView.prototype.outerTransition = function () {
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
        diamondView.prototype.validateNow = function () {
            _super.prototype.validateNow.call(this);
            //TODO 初始特殊的素材资源,需要调用可以写在这里
            //if (this.ui && this.ui.spriteSheet) {
            //
            //}
        };
        return diamondView;
    }(easy.View));
    game2048.diamondView = diamondView;
    __reflect(diamondView.prototype, "game2048.diamondView");
})(game2048 || (game2048 = {}));
