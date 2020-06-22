var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GlobalSetting = easy.GlobalSetting;
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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.groupProgress = null;
        _this.imgTiaoBg = null;
        _this.imgTiao = null;
        _this.imgTxt = null;
        _this.imgLogo = null;
        _this.groupMask = null;
        return _this;
    }
    /**
     * 初始化主场景的组件
     * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
     * 子类覆写该方法,添加UI逻辑
     */
    LoadingUI.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.setSize(easy.GlobalSetting.STAGE_WIDTH, easy.GlobalSetting.STAGE_HEIGHT);
        //groupProgress
        this.groupProgress = new easy.BaseGroup(true);
        this.groupProgress.name = "groupProgress";
        this.addChild(this.groupProgress);
        this.groupProgress.width = 500;
        this.groupProgress.height = 500;
        this.groupProgress.x = easy.GlobalSetting.DISPLAY_WIDTH / 2 - this.groupProgress.cx;
        this.groupProgress.y = easy.GlobalSetting.DISPLAY_HEIGHT / 2 - this.groupProgress.cy;
        //imgTiaoBg
        this.imgTiaoBg = new easy.Image(true);
        this.imgTiaoBg.name = "imgTiaoBg";
        this.groupProgress.addChild(this.imgTiaoBg);
        this.imgTiaoBg.x = -45.5;
        this.imgTiaoBg.y = 324.5;
        this.imgTiaoBg.width = 591;
        this.imgTiaoBg.height = 33;
        //imgTxt
        this.imgTxt = new easy.Image(true);
        this.imgTxt.name = "imgTxt";
        this.groupProgress.addChild(this.imgTxt);
        this.imgTxt.x = 193;
        this.imgTxt.y = 384.5;
        this.imgTxt.width = 114;
        this.imgTxt.height = 31;
        //imgLogo
        this.imgLogo = new easy.Image(true);
        this.imgLogo.name = "imgLogo";
        this.groupProgress.addChild(this.imgLogo);
        this.imgLogo.x = 125;
        this.imgLogo.width = 250;
        this.imgLogo.height = 250;
        //groupMask
        this.groupMask = new easy.Group(true);
        this.groupMask.name = "groupMask";
        this.groupProgress.addChild(this.groupMask);
        this.groupMask.x = -43.5;
        this.groupMask.y = 327;
        this.groupMask.width = 587;
        this.groupMask.height = 28;
        this.groupMask.showBg = false;
        this.groupMask.width = 1;
        this.groupMask.clip = true;
        //imgTiao
        this.imgTiao = new easy.Image(true);
        this.imgTiao.name = "imgTiao";
        this.groupMask.addChild(this.imgTiao);
        this.imgTiao.width = 587;
        this.imgTiao.height = 28;
        //设置材质
        this.groupProgress.drawDelay = false;
        this.imgTiaoBg.texture = RES.getRes("loading_bg");
        this.imgTiaoBg.drawDelay = false;
        this.imgTiao.texture = RES.getRes("loading_tiao");
        this.imgTiao.drawDelay = false;
        this.imgTxt.texture = RES.getRes("loading_txt");
        this.imgTxt.drawDelay = false;
        this.imgLogo.texture = RES.getRes("logo");
        this.imgLogo.drawDelay = false;
        this.groupMask.drawDelay = false;
    };
    /**
     * 进度的展示
     * @param current
     * @param total
     */
    LoadingUI.prototype.setProgress = function (current, total) {
        this.groupMask.width = this.imgTiao.width * (current / total);
    };
    /**
     * loading enter
     */
    LoadingUI.prototype.enter = function () {
    };
    /**
     * loading outer
     */
    LoadingUI.prototype.outer = function () {
        this.removeFromParent();
    };
    return LoadingUI;
}(easy.BaseGroup));
__reflect(LoadingUI.prototype, "LoadingUI");
