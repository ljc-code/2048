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
     * <p>EasyGame管理类</p>
     * @date  :2015-08-10 11:39:50
     * @author:EasyUI Tools
     */
    var EasyGame = (function () {
        function EasyGame() {
        }
        /**
         * 初始化 Easy Gaame
         */
        EasyGame.init = function () {
            easy.GlobalSetting.STAGE.frameRate = easy.GlobalSetting.FRAME_RATE;
            //计算正常帧时
            easy.HeartBeat._eplasedTime = 1000 / easy.GlobalSetting.FRAME_RATE;
            var config = RES.getRes("easygame_config");
            //console.log("EasyGameManager init00");
            if (config) {
                //console.log("EasyGameManager init111");
                //基础参数
                if (config["name"])
                    easy.GlobalSetting.APP_NAME = config["name"];
                if (config["product"])
                    easy.GlobalSetting.APP_PRODUCT = config["product"];
                if (config["version"])
                    easy.GlobalSetting.APP_VERSION = config["version"];
                //报表 渠道
                if (config["report"]) {
                    var jsonReport = config["report"];
                    if (jsonReport["url"])
                        easy.GlobalSetting.REPORT_URL = jsonReport["url"];
                    if (jsonReport["provide"])
                        easy.GlobalSetting.APP_PROVIDE = jsonReport["provide"];
                    if (jsonReport["channel"]) {
                        for (var i = 0; i < jsonReport.channel.length; i++) {
                            if (easy.GlobalSetting.APP_PROVIDE == jsonReport.channel[i].id) {
                                easy.GlobalSetting.APP_CHANNEL = jsonReport.channel[i].name;
                                easy.GlobalSetting.APP_RATE = jsonReport.channel[i].rate; //汇率
                                easy.GlobalSetting.APP_RATE_NAME = jsonReport.channel[i].unit; //汇率的单位
                                easy.GlobalSetting.REPORT = jsonReport.channel[i].report;
                                easy.GlobalSetting.APP_STORAGE = jsonReport.channel[i].storage;
                                break;
                            }
                        }
                    }
                }
                if (config["statistics"]) {
                    if (config["statistics"]["view"])
                        easy.GlobalSetting.STATS_VIEW = config.statistics.view;
                    if (config["statistics"]["win"])
                        easy.GlobalSetting.STATS_WIN = config.statistics.win;
                    if (config["statistics"]["btn"])
                        easy.GlobalSetting.STATS_BTN = config.statistics.btn;
                    if (config["statistics"]["mc"])
                        easy.GlobalSetting.STATS_MC = config.statistics.mc;
                    if (config["statistics"]["list"])
                        easy.GlobalSetting.STATS_LIST = config.statistics.list;
                }
                if (config["dev"]) {
                    if (config["dev"]["scale_mode"])
                        easy.GlobalSetting.DISPLAY_MODEL = config["dev"]["scale_mode"];
                    if (config["dev"]["loading_max"])
                        easy.GlobalSetting.LOADING_THREAD_MAX = config["dev"]["loading_max"];
                    if (config["dev"]["debug"])
                        easy.GlobalSetting.DEV_MODEL = (config["dev"]["debug"] == "true");
                    if (easy.GlobalSetting.DEV_MODEL) {
                        //打开性能控制面板
                        EasyGame.showDebugInfo();
                    }
                    RES.setMaxLoadingThread(easy.GlobalSetting.LOADING_THREAD_MAX); //设置5个线程下载
                }
            }
            //监听resize事件
            easy.GlobalSetting.STAGE.addEventListener(egret.Event.RESIZE, EasyGame.onStageResize, EasyGame);
        };
        /**
         * Stage 舞台尺寸变化
         */
        EasyGame.onStageResize = function (event) {
            easy.GlobalSetting.initInfoSize();
            //通知view和win
            if (easy.ViewManager.currentView)
                easy.ViewManager.currentView.onStageResize();
            if (easy.PopupManager.currentWin)
                easy.PopupManager.currentWin.onStageResize();
        };
        EasyGame.showDebugInfo = function () {
            if (easy.GlobalSetting.DEV_MODEL) {
                //性能控制面板
                //egret.Profiler.getInstance().run();
                if (this._tfInfo == null) {
                    this._tfInfo = new egret.TextField();
                }
                easy.GlobalSetting.STAGE.addChild(this._tfInfo);
                //this._tfInfo.y = 300;
                this._tfInfo.x = 300;
                this._tfInfo.width = 300;
                this._tfInfo.height = 40;
                //this._tfInfo.text = "w=" + GlobalSetting.STAGE.stageWidth + " ,h=" + GlobalSetting.STAGE.stageHeight;
                easy.HeartBeat.addListener(this, this.onShowHearBeatInfo);
                var btnDebugWin = new easy.Button();
                easy.GlobalSetting.STAGE.addChild(btnDebugWin);
                btnDebugWin.label = "DEBUG";
                btnDebugWin.fontSize = 16;
                btnDebugWin.labelColor = 0xff00ff;
                btnDebugWin.setSize(80, 35);
                btnDebugWin.y = 2;
                btnDebugWin.x = 150;
                btnDebugWin.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    easy.DebugWin.show();
                }, this);
            }
        };
        /**
         * 显示帧频呼吸的情况
         */
        EasyGame.onShowHearBeatInfo = function () {
            EasyGame._tfInfo.text = "HB:" + easy.HeartBeat.getHearBeatLenght();
            if (easy.DebugWin._instance && easy.DebugWin._instance.parent) {
                easy.DebugWin.refresh();
            }
        };
        return EasyGame;
    }());
    /**
     * 显示debug信息
     */
    EasyGame._tfInfo = null;
    easy.EasyGame = EasyGame;
    __reflect(EasyGame.prototype, "easy.EasyGame");
    /**
     * EasyGame的全屏适配模式
     */
    var EasyGameFullScreen = (function (_super) {
        __extends(EasyGameFullScreen, _super);
        function EasyGameFullScreen() {
            return _super.call(this) || this;
        }
        /**
         * @private
         * 计算舞台显示尺寸
         * @param scaleMode 当前的缩放模式
         * @param screenWidth 播放器视口宽度
         * @param screenHeight 播放器视口高度
         * @param contentWidth 初始化内容宽度
         * @param contentHeight 初始化内容高度
         */
        EasyGameFullScreen.prototype.calculateStageSize = function (scaleMode, screenWidth, screenHeight, contentWidth, contentHeight) {
            var displayWidth = screenWidth;
            var displayHeight = screenHeight;
            var stageWidth = contentWidth;
            var stageHeight = contentHeight;
            var scaleX = (displayWidth / stageWidth) || 0;
            var scaleY = (displayHeight / stageHeight) || 0;
            //var scaleX:number = displayWidth / designedResolutionWidth;
            //var scaleY:number = displayHeight / designedResolutionHeight;
            if (scaleX > scaleY) {
                stageWidth = Math.round(displayWidth / scaleY);
            }
            else {
                stageHeight = Math.round(displayHeight / scaleX);
            }
            return {
                stageWidth: stageWidth,
                stageHeight: stageHeight,
                displayWidth: displayWidth,
                displayHeight: displayHeight
            };
        };
        return EasyGameFullScreen;
    }(egret.sys.DefaultScreenAdapter));
    easy.EasyGameFullScreen = EasyGameFullScreen;
    __reflect(EasyGameFullScreen.prototype, "easy.EasyGameFullScreen");
})(easy || (easy = {}));
