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
     * @date  :2020-04-03 16:05:09
     * @EasyGame.org Tools
     */
    var game3 = (function (_super) {
        __extends(game3, _super);
        function game3() {
            var _this = _super.call(this, true) || this;
            _this.resSpriteSheet = ""; //合并材质资源名称
            _this.resTexture = []; //单材质资源名称
            _this.resGroup = []; //配置文件的Group
            _this.resFiles = []; //需要下载的资源group
            _this.spriteSheet = null; //ui对应的材质集,已经分割好,方便外部读取方便
            _this.groupBig = null;
            _this.group = null;
            _this.group1 = null;
            _this.group2 = null;
            _this.group3 = null;
            _this.group4 = null;
            _this.group5 = null;
            _this.group6 = null;
            _this.group7 = null;
            _this.group8 = null;
            _this.group9 = null;
            _this.group10 = null;
            _this.group11 = null;
            _this.group12 = null;
            _this.group13 = null;
            _this.group14 = null;
            _this.group15 = null;
            _this.group16 = null;
            return _this;
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        game3.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.border = false;
            this.width = 640;
            this.height = 1136;
            //groupBig 
            this.groupBig = new easy.Group(true);
            this.groupBig.name = "groupBig";
            this.addChild(this.groupBig);
            this.groupBig.bgColor = 0x99ffff;
            this.groupBig.border = false;
            this.groupBig.y = 248;
            this.groupBig.width = 640;
            this.groupBig.height = 640;
            //group 
            this.group = new easy.Group(true);
            this.group.name = "group";
            this.groupBig.addChild(this.group);
            this.group.showBg = false;
            this.group.border = false;
            this.group.x = 20;
            this.group.y = 20;
            this.group.width = 600;
            this.group.height = 600;
            //group1 
            this.group1 = new easy.Group(true);
            this.group1.name = "group1";
            this.group.addChild(this.group1);
            this.group1.border = false;
            this.group1.width = 135;
            this.group1.height = 135;
            //group2 
            this.group2 = new easy.Group(true);
            this.group2.name = "group2";
            this.group.addChild(this.group2);
            this.group2.border = false;
            this.group2.x = 155;
            this.group2.width = 135;
            this.group2.height = 135;
            //group3 
            this.group3 = new easy.Group(true);
            this.group3.name = "group3";
            this.group.addChild(this.group3);
            this.group3.border = false;
            this.group3.x = 310;
            this.group3.width = 135;
            this.group3.height = 135;
            //group4 
            this.group4 = new easy.Group(true);
            this.group4.name = "group4";
            this.group.addChild(this.group4);
            this.group4.border = false;
            this.group4.x = 465;
            this.group4.width = 135;
            this.group4.height = 135;
            //group5 
            this.group5 = new easy.Group(true);
            this.group5.name = "group5";
            this.group.addChild(this.group5);
            this.group5.border = false;
            this.group5.y = 155;
            this.group5.width = 135;
            this.group5.height = 135;
            //group6 
            this.group6 = new easy.Group(true);
            this.group6.name = "group6";
            this.group.addChild(this.group6);
            this.group6.border = false;
            this.group6.x = 155;
            this.group6.y = 155;
            this.group6.width = 135;
            this.group6.height = 135;
            //group7 
            this.group7 = new easy.Group(true);
            this.group7.name = "group7";
            this.group.addChild(this.group7);
            this.group7.border = false;
            this.group7.x = 310;
            this.group7.y = 155;
            this.group7.width = 135;
            this.group7.height = 135;
            //group8 
            this.group8 = new easy.Group(true);
            this.group8.name = "group8";
            this.group.addChild(this.group8);
            this.group8.border = false;
            this.group8.x = 465;
            this.group8.y = 155;
            this.group8.width = 135;
            this.group8.height = 135;
            //group9 
            this.group9 = new easy.Group(true);
            this.group9.name = "group9";
            this.group.addChild(this.group9);
            this.group9.border = false;
            this.group9.y = 310;
            this.group9.width = 135;
            this.group9.height = 135;
            //group10 
            this.group10 = new easy.Group(true);
            this.group10.name = "group10";
            this.group.addChild(this.group10);
            this.group10.border = false;
            this.group10.x = 155;
            this.group10.y = 310;
            this.group10.width = 135;
            this.group10.height = 135;
            //group11 
            this.group11 = new easy.Group(true);
            this.group11.name = "group11";
            this.group.addChild(this.group11);
            this.group11.border = false;
            this.group11.x = 310;
            this.group11.y = 310;
            this.group11.width = 135;
            this.group11.height = 135;
            //group12 
            this.group12 = new easy.Group(true);
            this.group12.name = "group12";
            this.group.addChild(this.group12);
            this.group12.border = false;
            this.group12.x = 465;
            this.group12.y = 310;
            this.group12.width = 135;
            this.group12.height = 135;
            //group13 
            this.group13 = new easy.Group(true);
            this.group13.name = "group13";
            this.group.addChild(this.group13);
            this.group13.border = false;
            this.group13.y = 465;
            this.group13.width = 135;
            this.group13.height = 135;
            //group14 
            this.group14 = new easy.Group(true);
            this.group14.name = "group14";
            this.group.addChild(this.group14);
            this.group14.border = false;
            this.group14.x = 155;
            this.group14.y = 465;
            this.group14.width = 135;
            this.group14.height = 135;
            //group15 
            this.group15 = new easy.Group(true);
            this.group15.name = "group15";
            this.group.addChild(this.group15);
            this.group15.border = false;
            this.group15.x = 310;
            this.group15.y = 465;
            this.group15.width = 135;
            this.group15.height = 135;
            //group16 
            this.group16 = new easy.Group(true);
            this.group16.name = "group16";
            this.group.addChild(this.group16);
            this.group16.border = false;
            this.group16.x = 465;
            this.group16.y = 465;
            this.group16.width = 135;
            this.group16.height = 135;
        };
        /**
         * 获取初始化逻辑,加入场景时,主动调用一次
         * 子类覆写该方法,添加业务逻辑
         */
        game3.prototype.initData = function () {
            _super.prototype.initData.call(this);
        };
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        game3.prototype.enter = function () {
        };
        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        game3.prototype.outer = function () {
        };
        /**
         * 刷新UI皮肤显示
         */
        game3.prototype.validateNow = function () {
            this.drawDelay = false;
            this.groupBig.drawDelay = false;
            this.group.drawDelay = false;
            this.group1.drawDelay = false;
            this.group2.drawDelay = false;
            this.group3.drawDelay = false;
            this.group4.drawDelay = false;
            this.group5.drawDelay = false;
            this.group6.drawDelay = false;
            this.group7.drawDelay = false;
            this.group8.drawDelay = false;
            this.group9.drawDelay = false;
            this.group10.drawDelay = false;
            this.group11.drawDelay = false;
            this.group12.drawDelay = false;
            this.group13.drawDelay = false;
            this.group14.drawDelay = false;
            this.group15.drawDelay = false;
            this.group16.drawDelay = false;
        };
        return game3;
    }(easy.Group));
    game2048.game3 = game3;
    __reflect(game3.prototype, "game2048.game3");
})(game2048 || (game2048 = {}));
