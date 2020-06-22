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
     * <p></p>
     * @date  :2020-04-03 16:51:29
     * @EasyGame.org Tools
     */
    var diamond = (function (_super) {
        __extends(diamond, _super);
        function diamond() {
            var _this = _super.call(this, true) || this;
            _this.resSpriteSheet = ""; //合并材质资源名称
            _this.resTexture = []; //单材质资源名称
            _this.resGroup = []; //配置文件的Group
            _this.resFiles = []; //需要下载的资源group
            _this.spriteSheet = null; //ui对应的材质集,已经分割好,方便外部读取方便
            _this.groupProgress = null;
            _this.groupMask = null;
            _this.groupRightMask = null;
            _this.groupAll = null;
            _this.group = null;
            _this.groupMk = null;
            _this.labelGameOver = null;
            return _this;
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        diamond.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.border = false;
            this.width = 640;
            this.height = 1136;
            //groupProgress 
            this.groupProgress = new easy.Group(true);
            this.groupProgress.name = "groupProgress";
            this.addChild(this.groupProgress);
            this.groupProgress.bgColor = 0xff6633;
            this.groupProgress.border = false;
            this.groupProgress.x = 170;
            this.groupProgress.y = 111;
            this.groupProgress.width = 300;
            this.groupProgress.height = 20;
            //groupMask 
            this.groupMask = new easy.Group(true);
            this.groupMask.name = "groupMask";
            this.addChild(this.groupMask);
            this.groupMask.border = false;
            this.groupMask.x = 471;
            this.groupMask.y = 112;
            this.groupMask.width = 299;
            this.groupMask.height = 18;
            //groupRightMask 
            this.groupRightMask = new easy.Group(true);
            this.groupRightMask.name = "groupRightMask";
            this.addChild(this.groupRightMask);
            this.groupRightMask.bgColor = 0xff6633;
            this.groupRightMask.border = false;
            this.groupRightMask.x = 470;
            this.groupRightMask.y = 111;
            this.groupRightMask.width = 1;
            this.groupRightMask.height = 20;
            //groupAll 
            this.groupAll = new easy.Group(true);
            this.groupAll.name = "groupAll";
            this.addChild(this.groupAll);
            this.groupAll.bgColor = 0x3399ff;
            this.groupAll.clip = true;
            this.groupAll.border = false;
            this.groupAll.x = 0.5;
            this.groupAll.y = 243.5;
            this.groupAll.width = 639;
            this.groupAll.height = 649;
            //group 
            this.group = new easy.Group(true);
            this.group.name = "group";
            this.addChild(this.group);
            this.group.showBg = false;
            this.group.bgColor = 0x0;
            this.group.border = false;
            this.group.x = 0.5;
            this.group.y = 243.5;
            this.group.width = 639;
            this.group.height = 649;
            //groupMk 
            this.groupMk = new easy.Group(true);
            this.groupMk.name = "groupMk";
            this.group.addChild(this.groupMk);
            this.groupMk.bgColor = 0x0;
            this.groupMk.border = false;
            this.groupMk.width = 639;
            this.groupMk.height = 649;
            this.groupMk.alpha = 0.5;
            //labelGameOver 
            this.labelGameOver = new easy.Label(true);
            this.labelGameOver.name = "labelGameOver";
            this.group.addChild(this.labelGameOver);
            this.labelGameOver.text = "Game Over";
            this.labelGameOver.fontSize = 50;
            this.labelGameOver.color = 0x9900;
            this.labelGameOver.hAlign = "center";
            this.labelGameOver.autoSize = false;
            this.labelGameOver.width = 300;
            this.labelGameOver.height = 58;
            this.labelGameOver.x = 169.5;
            this.labelGameOver.y = 290.5;
            this.labelGameOver.showBg = false;
        };
        /**
         * 获取初始化逻辑,加入场景时,主动调用一次
         * 子类覆写该方法,添加业务逻辑
         */
        diamond.prototype.initData = function () {
            _super.prototype.initData.call(this);
        };
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        diamond.prototype.enter = function () {
        };
        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        diamond.prototype.outer = function () {
        };
        /**
         * 刷新UI皮肤显示
         */
        diamond.prototype.validateNow = function () {
            this.drawDelay = false;
            this.groupProgress.drawDelay = false;
            this.groupMask.drawDelay = false;
            this.groupRightMask.drawDelay = false;
            this.groupAll.drawDelay = false;
            this.group.drawDelay = false;
            this.groupMk.drawDelay = false;
            this.labelGameOver.drawDelay = false;
        };
        return diamond;
    }(easy.Group));
    game2048.diamond = diamond;
    __reflect(diamond.prototype, "game2048.diamond");
})(game2048 || (game2048 = {}));
