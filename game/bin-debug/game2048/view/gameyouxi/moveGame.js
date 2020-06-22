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
     * @date  :2020-04-03 16:05:11
     * @EasyGame.org Tools
     */
    var moveGame = (function (_super) {
        __extends(moveGame, _super);
        function moveGame() {
            var _this = _super.call(this, true) || this;
            _this.resSpriteSheet = "moveGame"; //合并材质资源名称
            _this.resTexture = []; //单材质资源名称
            _this.resGroup = ["gameyouxi_moveGame"]; //配置文件的Group
            _this.resFiles = ["gameyouxi/moveGame_loader_200403160511.json"]; //需要下载的资源group
            _this.spriteSheet = null; //ui对应的材质集,已经分割好,方便外部读取方便
            _this.group_big = null;
            _this.groupAll = null;
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
            _this.label1 = null;
            _this.label2 = null;
            _this.label3 = null;
            _this.label4 = null;
            _this.label5 = null;
            _this.label6 = null;
            _this.label7 = null;
            _this.label8 = null;
            _this.label9 = null;
            _this.label10 = null;
            _this.label11 = null;
            _this.label12 = null;
            _this.label13 = null;
            _this.label14 = null;
            _this.label15 = null;
            _this.label16 = null;
            _this.group_Mask = null;
            _this.group = null;
            _this.labelGameOver = null;
            _this.groupSlide = null;
            _this.btnAgain = null;
            _this.groupGrade = null;
            _this.labelGrade = null;
            _this.labelGrade2 = null;
            return _this;
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        moveGame.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.bgColor = 0xccccff;
            this.border = false;
            this.width = 640;
            this.height = 1136;
            //group_big 
            this.group_big = new easy.Group(true);
            this.group_big.name = "group_big";
            this.addChild(this.group_big);
            this.group_big.bgColor = 0x66ffff;
            this.group_big.border = false;
            this.group_big.y = 248;
            this.group_big.width = 640;
            this.group_big.height = 640;
            //groupAll 
            this.groupAll = new easy.Group(true);
            this.groupAll.name = "groupAll";
            this.addChild(this.groupAll);
            this.groupAll.showBg = false;
            this.groupAll.bgColor = 0x66ffff;
            this.groupAll.border = false;
            this.groupAll.x = 20;
            this.groupAll.y = 268;
            this.groupAll.width = 600;
            this.groupAll.height = 600;
            //group1 
            this.group1 = new easy.Group(true);
            this.group1.name = "group1";
            this.groupAll.addChild(this.group1);
            this.group1.border = false;
            this.group1.width = 135;
            this.group1.height = 135;
            //group2 
            this.group2 = new easy.Group(true);
            this.group2.name = "group2";
            this.groupAll.addChild(this.group2);
            this.group2.border = false;
            this.group2.x = 155;
            this.group2.width = 135;
            this.group2.height = 135;
            //group3 
            this.group3 = new easy.Group(true);
            this.group3.name = "group3";
            this.groupAll.addChild(this.group3);
            this.group3.border = false;
            this.group3.x = 310;
            this.group3.width = 135;
            this.group3.height = 135;
            //group4 
            this.group4 = new easy.Group(true);
            this.group4.name = "group4";
            this.groupAll.addChild(this.group4);
            this.group4.border = false;
            this.group4.x = 465;
            this.group4.width = 135;
            this.group4.height = 135;
            //group5 
            this.group5 = new easy.Group(true);
            this.group5.name = "group5";
            this.groupAll.addChild(this.group5);
            this.group5.border = false;
            this.group5.y = 155;
            this.group5.width = 135;
            this.group5.height = 135;
            //group6 
            this.group6 = new easy.Group(true);
            this.group6.name = "group6";
            this.groupAll.addChild(this.group6);
            this.group6.border = false;
            this.group6.x = 155;
            this.group6.y = 155;
            this.group6.width = 135;
            this.group6.height = 135;
            //group7 
            this.group7 = new easy.Group(true);
            this.group7.name = "group7";
            this.groupAll.addChild(this.group7);
            this.group7.border = false;
            this.group7.x = 310;
            this.group7.y = 155;
            this.group7.width = 135;
            this.group7.height = 135;
            //group8 
            this.group8 = new easy.Group(true);
            this.group8.name = "group8";
            this.groupAll.addChild(this.group8);
            this.group8.border = false;
            this.group8.x = 465;
            this.group8.y = 155;
            this.group8.width = 135;
            this.group8.height = 135;
            //group9 
            this.group9 = new easy.Group(true);
            this.group9.name = "group9";
            this.groupAll.addChild(this.group9);
            this.group9.border = false;
            this.group9.y = 310;
            this.group9.width = 135;
            this.group9.height = 135;
            //group10 
            this.group10 = new easy.Group(true);
            this.group10.name = "group10";
            this.groupAll.addChild(this.group10);
            this.group10.border = false;
            this.group10.x = 155;
            this.group10.y = 310;
            this.group10.width = 135;
            this.group10.height = 135;
            //group11 
            this.group11 = new easy.Group(true);
            this.group11.name = "group11";
            this.groupAll.addChild(this.group11);
            this.group11.border = false;
            this.group11.x = 310;
            this.group11.y = 310;
            this.group11.width = 135;
            this.group11.height = 135;
            //group12 
            this.group12 = new easy.Group(true);
            this.group12.name = "group12";
            this.groupAll.addChild(this.group12);
            this.group12.border = false;
            this.group12.x = 465;
            this.group12.y = 310;
            this.group12.width = 135;
            this.group12.height = 135;
            //group13 
            this.group13 = new easy.Group(true);
            this.group13.name = "group13";
            this.groupAll.addChild(this.group13);
            this.group13.border = false;
            this.group13.y = 465;
            this.group13.width = 135;
            this.group13.height = 135;
            //group14 
            this.group14 = new easy.Group(true);
            this.group14.name = "group14";
            this.groupAll.addChild(this.group14);
            this.group14.border = false;
            this.group14.x = 155;
            this.group14.y = 465;
            this.group14.width = 135;
            this.group14.height = 135;
            //group15 
            this.group15 = new easy.Group(true);
            this.group15.name = "group15";
            this.groupAll.addChild(this.group15);
            this.group15.border = false;
            this.group15.x = 310;
            this.group15.y = 465;
            this.group15.width = 135;
            this.group15.height = 135;
            //group16 
            this.group16 = new easy.Group(true);
            this.group16.name = "group16";
            this.groupAll.addChild(this.group16);
            this.group16.border = false;
            this.group16.x = 465;
            this.group16.y = 465;
            this.group16.width = 135;
            this.group16.height = 135;
            //label1 
            this.label1 = new easy.Label(true);
            this.label1.name = "label1";
            this.groupAll.addChild(this.label1);
            this.label1.text = "2";
            this.label1.fontSize = 50;
            this.label1.color = 0xffffff;
            this.label1.hAlign = "center";
            this.label1.autoSize = false;
            this.label1.width = 135;
            this.label1.height = 135;
            this.label1.bgColor = 0xcc9999;
            //label2 
            this.label2 = new easy.Label(true);
            this.label2.name = "label2";
            this.groupAll.addChild(this.label2);
            this.label2.text = "2";
            this.label2.fontSize = 50;
            this.label2.color = 0xffffff;
            this.label2.hAlign = "center";
            this.label2.autoSize = false;
            this.label2.width = 135;
            this.label2.height = 135;
            this.label2.x = 155;
            this.label2.bgColor = 0xcc9999;
            //label3 
            this.label3 = new easy.Label(true);
            this.label3.name = "label3";
            this.groupAll.addChild(this.label3);
            this.label3.text = "2";
            this.label3.fontSize = 50;
            this.label3.color = 0xffffff;
            this.label3.hAlign = "center";
            this.label3.autoSize = false;
            this.label3.width = 135;
            this.label3.height = 135;
            this.label3.x = 310;
            this.label3.bgColor = 0xcc9999;
            //label4 
            this.label4 = new easy.Label(true);
            this.label4.name = "label4";
            this.groupAll.addChild(this.label4);
            this.label4.text = "2";
            this.label4.fontSize = 50;
            this.label4.color = 0xffffff;
            this.label4.hAlign = "center";
            this.label4.autoSize = false;
            this.label4.width = 135;
            this.label4.height = 135;
            this.label4.x = 465;
            this.label4.bgColor = 0xcc9999;
            //label5 
            this.label5 = new easy.Label(true);
            this.label5.name = "label5";
            this.groupAll.addChild(this.label5);
            this.label5.text = "2";
            this.label5.fontSize = 50;
            this.label5.color = 0xffffff;
            this.label5.hAlign = "center";
            this.label5.autoSize = false;
            this.label5.width = 135;
            this.label5.height = 135;
            this.label5.y = 155;
            this.label5.bgColor = 0xcc9999;
            //label6 
            this.label6 = new easy.Label(true);
            this.label6.name = "label6";
            this.groupAll.addChild(this.label6);
            this.label6.text = "2";
            this.label6.fontSize = 50;
            this.label6.color = 0xffffff;
            this.label6.hAlign = "center";
            this.label6.autoSize = false;
            this.label6.width = 135;
            this.label6.height = 135;
            this.label6.x = 155;
            this.label6.y = 155;
            this.label6.bgColor = 0xcc9999;
            //label7 
            this.label7 = new easy.Label(true);
            this.label7.name = "label7";
            this.groupAll.addChild(this.label7);
            this.label7.text = "2";
            this.label7.fontSize = 50;
            this.label7.color = 0xffffff;
            this.label7.hAlign = "center";
            this.label7.autoSize = false;
            this.label7.width = 135;
            this.label7.height = 135;
            this.label7.x = 310;
            this.label7.y = 155;
            this.label7.bgColor = 0xcc9999;
            //label8 
            this.label8 = new easy.Label(true);
            this.label8.name = "label8";
            this.groupAll.addChild(this.label8);
            this.label8.text = "2";
            this.label8.fontSize = 50;
            this.label8.color = 0xffffff;
            this.label8.hAlign = "center";
            this.label8.autoSize = false;
            this.label8.width = 135;
            this.label8.height = 135;
            this.label8.x = 465;
            this.label8.y = 155;
            this.label8.bgColor = 0xcc9999;
            //label9 
            this.label9 = new easy.Label(true);
            this.label9.name = "label9";
            this.groupAll.addChild(this.label9);
            this.label9.text = "2";
            this.label9.fontSize = 50;
            this.label9.color = 0xffffff;
            this.label9.hAlign = "center";
            this.label9.autoSize = false;
            this.label9.width = 135;
            this.label9.height = 135;
            this.label9.y = 310;
            this.label9.bgColor = 0xcc9999;
            //label10 
            this.label10 = new easy.Label(true);
            this.label10.name = "label10";
            this.groupAll.addChild(this.label10);
            this.label10.text = "2";
            this.label10.fontSize = 50;
            this.label10.color = 0xffffff;
            this.label10.hAlign = "center";
            this.label10.autoSize = false;
            this.label10.width = 135;
            this.label10.height = 135;
            this.label10.x = 155;
            this.label10.y = 310;
            this.label10.bgColor = 0xcc9999;
            //label11 
            this.label11 = new easy.Label(true);
            this.label11.name = "label11";
            this.groupAll.addChild(this.label11);
            this.label11.text = "2";
            this.label11.fontSize = 50;
            this.label11.color = 0xffffff;
            this.label11.hAlign = "center";
            this.label11.autoSize = false;
            this.label11.width = 135;
            this.label11.height = 135;
            this.label11.x = 310;
            this.label11.y = 310;
            this.label11.bgColor = 0xcc9999;
            //label12 
            this.label12 = new easy.Label(true);
            this.label12.name = "label12";
            this.groupAll.addChild(this.label12);
            this.label12.text = "2";
            this.label12.fontSize = 50;
            this.label12.color = 0xffffff;
            this.label12.hAlign = "center";
            this.label12.autoSize = false;
            this.label12.width = 135;
            this.label12.height = 135;
            this.label12.x = 465;
            this.label12.y = 310;
            this.label12.bgColor = 0xcc9999;
            //label13 
            this.label13 = new easy.Label(true);
            this.label13.name = "label13";
            this.groupAll.addChild(this.label13);
            this.label13.text = "2";
            this.label13.fontSize = 50;
            this.label13.color = 0xffffff;
            this.label13.hAlign = "center";
            this.label13.autoSize = false;
            this.label13.width = 135;
            this.label13.height = 135;
            this.label13.y = 465;
            this.label13.bgColor = 0xcc9999;
            //label14 
            this.label14 = new easy.Label(true);
            this.label14.name = "label14";
            this.groupAll.addChild(this.label14);
            this.label14.text = "2";
            this.label14.fontSize = 50;
            this.label14.color = 0xffffff;
            this.label14.hAlign = "center";
            this.label14.autoSize = false;
            this.label14.width = 135;
            this.label14.height = 135;
            this.label14.x = 155;
            this.label14.y = 465;
            this.label14.bgColor = 0xcc9999;
            //label15 
            this.label15 = new easy.Label(true);
            this.label15.name = "label15";
            this.groupAll.addChild(this.label15);
            this.label15.text = "2";
            this.label15.fontSize = 50;
            this.label15.color = 0xffffff;
            this.label15.hAlign = "center";
            this.label15.autoSize = false;
            this.label15.width = 135;
            this.label15.height = 135;
            this.label15.x = 310;
            this.label15.y = 465;
            this.label15.bgColor = 0xcc9999;
            //label16 
            this.label16 = new easy.Label(true);
            this.label16.name = "label16";
            this.groupAll.addChild(this.label16);
            this.label16.text = "2";
            this.label16.fontSize = 50;
            this.label16.color = 0xffffff;
            this.label16.hAlign = "center";
            this.label16.autoSize = false;
            this.label16.width = 135;
            this.label16.height = 135;
            this.label16.x = 465;
            this.label16.y = 465;
            this.label16.bgColor = 0xcc9999;
            //group_Mask 
            this.group_Mask = new easy.Group(true);
            this.group_Mask.name = "group_Mask";
            this.addChild(this.group_Mask);
            this.group_Mask.showBg = false;
            this.group_Mask.border = false;
            this.group_Mask.width = 640;
            this.group_Mask.height = 1136;
            //group 
            this.group = new easy.Group(true);
            this.group.name = "group";
            this.group_Mask.addChild(this.group);
            this.group.bgColor = 0x0;
            this.group.border = false;
            this.group.width = 640;
            this.group.height = 1136;
            this.group.alpha = 0.296875;
            //labelGameOver 
            this.labelGameOver = new easy.Label(true);
            this.labelGameOver.name = "labelGameOver";
            this.group_Mask.addChild(this.labelGameOver);
            this.labelGameOver.text = "Game  Over";
            this.labelGameOver.fontSize = 100;
            this.labelGameOver.color = 0xff;
            this.labelGameOver.hAlign = "center";
            this.labelGameOver.autoSize = false;
            this.labelGameOver.width = 640;
            this.labelGameOver.height = 100;
            this.labelGameOver.y = 518;
            this.labelGameOver.showBg = false;
            //groupSlide 
            this.groupSlide = new easy.Group(true);
            this.groupSlide.name = "groupSlide";
            this.addChild(this.groupSlide);
            this.groupSlide.border = false;
            this.groupSlide.width = 640;
            this.groupSlide.height = 1136;
            this.groupSlide.alpha = 0;
            //btnAgain 
            this.btnAgain = new easy.Button(true);
            this.btnAgain.name = "btnAgain";
            this.addChild(this.btnAgain);
            this.btnAgain.width = 243;
            this.btnAgain.height = 63;
            this.btnAgain.x = 198.5;
            this.btnAgain.y = 973;
            //groupGrade 
            this.groupGrade = new easy.Group(true);
            this.groupGrade.name = "groupGrade";
            this.addChild(this.groupGrade);
            this.groupGrade.showBg = false;
            this.groupGrade.border = false;
            this.groupGrade.x = 195;
            this.groupGrade.y = 70;
            this.groupGrade.width = 350;
            //labelGrade 
            this.labelGrade = new easy.Label(true);
            this.labelGrade.name = "labelGrade";
            this.groupGrade.addChild(this.labelGrade);
            this.labelGrade.text = "分数：";
            this.labelGrade.fontSize = 50;
            this.labelGrade.color = 0xcc0000;
            this.labelGrade.hAlign = "center";
            this.labelGrade.autoSize = false;
            this.labelGrade.width = 150;
            this.labelGrade.height = 80;
            this.labelGrade.x = 40;
            this.labelGrade.showBg = false;
            //labelGrade2 
            this.labelGrade2 = new easy.Label(true);
            this.labelGrade2.name = "labelGrade2";
            this.groupGrade.addChild(this.labelGrade2);
            this.labelGrade2.text = "0";
            this.labelGrade2.fontSize = 50;
            this.labelGrade2.color = 0xcc0000;
            this.labelGrade2.autoSize = false;
            this.labelGrade2.width = 200;
            this.labelGrade2.height = 80;
            this.labelGrade2.x = 175;
            this.labelGrade2.y = 3;
            this.labelGrade2.showBg = false;
        };
        /**
         * 获取初始化逻辑,加入场景时,主动调用一次
         * 子类覆写该方法,添加业务逻辑
         */
        moveGame.prototype.initData = function () {
            _super.prototype.initData.call(this);
        };
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        moveGame.prototype.enter = function () {
        };
        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        moveGame.prototype.outer = function () {
        };
        /**
         * 刷新UI皮肤显示
         */
        moveGame.prototype.validateNow = function () {
            this.drawDelay = false;
            var jsonData = RES.getRes("moveGame_json");
            if (jsonData != null) {
                this.spriteSheet = new egret.SpriteSheet(RES.getRes("moveGame_img"));
                for (var key in jsonData.texture) {
                    this.spriteSheet.createTexture(key, jsonData.texture[key].x, jsonData.texture[key].y, jsonData.texture[key].w, jsonData.texture[key].h);
                }
            }
            this.group_big.drawDelay = false;
            this.groupAll.drawDelay = false;
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
            this.label1.drawDelay = false;
            this.label2.drawDelay = false;
            this.label3.drawDelay = false;
            this.label4.drawDelay = false;
            this.label5.drawDelay = false;
            this.label6.drawDelay = false;
            this.label7.drawDelay = false;
            this.label8.drawDelay = false;
            this.label9.drawDelay = false;
            this.label10.drawDelay = false;
            this.label11.drawDelay = false;
            this.label12.drawDelay = false;
            this.label13.drawDelay = false;
            this.label14.drawDelay = false;
            this.label15.drawDelay = false;
            this.label16.drawDelay = false;
            this.group_Mask.drawDelay = false;
            this.group.drawDelay = false;
            this.labelGameOver.drawDelay = false;
            this.groupSlide.drawDelay = false;
            if (this.spriteSheet)
                this.btnAgain.texture = this.spriteSheet.getTexture("btn_replay");
            this.btnAgain.drawDelay = false;
            this.groupGrade.drawDelay = false;
            this.labelGrade.drawDelay = false;
            this.labelGrade2.drawDelay = false;
        };
        return moveGame;
    }(easy.Group));
    game2048.moveGame = moveGame;
    __reflect(moveGame.prototype, "game2048.moveGame");
})(game2048 || (game2048 = {}));
