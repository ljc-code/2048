var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
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
    var GuideManager = (function () {
        function GuideManager() {
        }
        /**
         * 播放对话节点
         * @param id 节点id
         * @param clz 所使用的窗口类对象
         */
        GuideManager.play = function (id, clz, completeCallFunc, thisFunc, event) {
            if (clz === void 0) { clz = null; }
            if (completeCallFunc === void 0) { completeCallFunc = null; }
            if (thisFunc === void 0) { thisFunc = null; }
            if (event === void 0) { event = true; }
            if (GuideManager.guide_item_dict[id]) {
                GuideManager.playItem(GuideManager.guide_item_dict[id], clz, completeCallFunc, thisFunc, event);
            }
        };
        /**
         * 播放对话节点
         * @param item 节点对象
         * @param clz 所使用的窗口类对象
         */
        GuideManager.playItem = function (item, clz, completeCallFunc, thisFunc, event) {
            if (clz === void 0) { clz = null; }
            if (completeCallFunc === void 0) { completeCallFunc = null; }
            if (thisFunc === void 0) { thisFunc = null; }
            if (event === void 0) { event = true; }
            if (!item)
                return;
            if (!GuideManager._guideExecuteManager)
                GuideManager._guideExecuteManager = new easy.GuideExecuteManager();
            GuideManager._completeCallFunc = completeCallFunc;
            GuideManager._completeCallFuncThis = thisFunc;
            if (event && easy.StringUtil.isUsage(item.event_data) && item.event_condition != "after") {
                GuideManager._guideExecuteManager.executeBefor(item, clz, completeCallFunc, thisFunc);
                return;
            }
            //窗口显示
            var guideView = easy.DefaultGuideWin;
            if (GuideManager.currentClz)
                guideView = GuideManager.currentClz;
            if (clz)
                guideView = clz;
            //检测显示条件是否满足
            if (!GuideManager.checkReadyShow(item)) {
                //保存数据
                GuideManager.currentItem = item;
                //添加监听
                easy.HeartBeat.addListener(GuideManager, GuideManager.onHbCheckItemUIReady, 5);
                return;
            }
            //保存数据
            GuideManager.currentItem = item;
            GuideManager.currentClz = guideView;
            //判断遮幅显示
            if (item.mask == easy.GuideItem.MASK_NORMAL) {
                GuideManager._targetFoucsUI.addEventListener(egret.TouchEvent.TOUCH_BEGIN, GuideManager.onTouchCanvasTap, GuideManager);
                GuideManager.setFoucsMaskSize();
                GuideManager.showMaskFocus();
            }
            else {
                GuideManager.showMaskCropping();
                //禁用view的点击
                easy.ViewManager.currentView.touchEnabled = false;
                easy.ViewManager.currentView.touchChildren = false;
                easy.GlobalSetting.STAGE.addEventListener(egret.TouchEvent.TOUCH_BEGIN, GuideManager.onTouchStage, GuideManager);
            }
            var doEnter = easy.PopupManager.isShow(guideView);
            var instView = easy.PopupManager.show(guideView, item, false); //显示窗口
            if (doEnter && instView && GuideManager.currentItem) {
                instView.data = item;
                instView.enter();
            }
        };
        /**
         * 点击画布
         * @param event
         */
        GuideManager.onTouchCanvasTap = function (event) {
            GuideManager._targetFoucsUI.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, GuideManager.onTouchCanvasTap, GuideManager);
            GuideManager.checkPlayNextItem();
        };
        /**
         * 点击舞台动作,播放下一个节点
         * @param event
         */
        GuideManager.onTouchStage = function (event) {
            if (event.currentTarget != easy.GlobalSetting.STAGE)
                return;
            easy.GlobalSetting.STAGE.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, GuideManager.onTouchStage, GuideManager);
            GuideManager.checkPlayNextItem();
        };
        GuideManager.checkPlayNextItem = function () {
            if (!GuideManager.playNextItem()) {
                easy.PopupManager.hidden(easy.PopupManager.currentWin);
            }
        };
        /**
         * 持续检测item的ui条件是否满足
         */
        GuideManager.onHbCheckItemUIReady = function () {
            GuideManager.playItem(GuideManager.currentItem, GuideManager.currentClz, GuideManager._completeCallFunc, GuideManager._completeCallFuncThis);
        };
        /**
         * 检测当前条件是否满足显示的条件
         */
        GuideManager.checkReadyShow = function (item) {
            if (item && easy.StringUtil.isUsage(item.handle_path)) {
                var paths = easy.StringUtil.spliteStrArr(item.handle_data, ".");
                //设置焦点
                var uiItem = null;
                if (item.handle_type == "view") {
                    uiItem = easy.ViewManager.currentView;
                }
                else if (item.handle_type == "win") {
                    uiItem = easy.PopupManager.currentWin;
                }
                if (!uiItem || egret.getQualifiedClassName(uiItem) != item.handle_path)
                    return false; //父容器已经不对了,直接返回
                for (var i = 0; i < paths.length; i++) {
                    uiItem = uiItem[paths[i]];
                    if (uiItem == null)
                        return false;
                }
                GuideManager._targetFoucsUI = uiItem;
                easy.HeartBeat.removeListener(GuideManager, GuideManager.onHbCheckItemUIReady);
                //if (uiItem){
                //    GuideManager._circleR = uiItem.width;
                //    if (uiItem.height > GuideManager._circleR) GuideManager._circleR = uiItem.height;
                //    GuideManager._circleR = GuideManager._circleR/2;
                //    var pointXY:egret.Point = uiItem.parent.localToGlobal(uiItem.x, uiItem.y);
                //    GuideManager._circleX = pointXY.x + uiItem.width/2 + item.focus_x;
                //    GuideManager._circleY = pointXY.y + uiItem.height/2 + item.focus_y;
                //}
                if (item.focus_gap > 0)
                    GuideManager._circleRunGap = item.focus_gap;
                if (item.focus_stress > 0)
                    GuideManager._circleRunThickness = item.focus_stress;
                if (easy.StringUtil.isUsage(item.focus_color)) {
                    var colors = easy.StringUtil.spliteStrArr(item.focus_color, ",");
                    if (colors.length > 0)
                        this._circleColor = parseInt(colors[0], 16);
                    if (colors.length > 1)
                        this._circleRunColor = parseInt(colors[1], 16);
                }
            }
            return true;
        };
        /**
         * 根据当前节点,继续播放下一节点
         */
        GuideManager.playNextItem = function (event) {
            if (event === void 0) { event = true; }
            GuideManager._targetFoucsUI = null;
            if (event && GuideManager.currentItem && easy.StringUtil.isUsage(GuideManager.currentItem.event_data) && GuideManager.currentItem.event_condition == "after") {
                GuideManager._guideExecuteManager.executeAfter(GuideManager.currentItem, GuideManager.currentClz, GuideManager._completeCallFunc, GuideManager._completeCallFuncThis);
                GuideManager.currentItem = null;
                return;
            }
            if (GuideManager.currentItem && easy.StringUtil.isUsage(GuideManager.currentItem.next_frame)) {
                var nextItem = GuideManager.guide_item_dict[GuideManager.currentItem.next_frame];
                if (nextItem) {
                    GuideManager.playItem(nextItem, GuideManager.currentClz, GuideManager._completeCallFunc, GuideManager._completeCallFuncThis);
                    return true;
                }
            }
            GuideManager.stop();
            return false;
        };
        /**
         * 停止播放剧情
         */
        GuideManager.stop = function () {
            if (GuideManager._completeCallFunc)
                GuideManager._completeCallFunc.call(GuideManager._completeCallFuncThis);
            easy.MyEvent.sendEvent(easy.EventType.GUIDE_CHAPTER_END);
            //恢复view的点击
            easy.ViewManager.currentView.touchEnabled = true;
            easy.ViewManager.currentView.touchChildren = true;
            GuideManager.currentItem = null;
            GuideManager.removeMaskCropping();
            GuideManager.removeMaskFocus();
            GuideManager._completeCallFunc = null;
            GuideManager._completeCallFuncThis = null;
        };
        /**
         * 显示焦点遮罩
         *     m1
         * -----------
         * m2 | m0 | m3
         * -----------
         *    m4
         */
        GuideManager.showMaskFocus = function () {
            GuideManager.removeMaskFocus();
            if (GuideManager._groupMask == null) {
                GuideManager._groupMask = new easy.BaseGroup();
                GuideManager._groupMask.touchEnabled = false;
                GuideManager._groupMask.touchChildren = false;
            }
            if (GuideManager._mask0 == null) {
                GuideManager._mask0 = new egret.Bitmap();
                GuideManager._mask0.touchEnabled = false;
            }
            if (GuideManager._maskCircle == null) {
                GuideManager._maskCircle = new egret.Shape();
                GuideManager._maskCircle.touchEnabled = false;
            }
            GuideManager._groupMask.x = 0;
            GuideManager._groupMask.y = 0;
            var hv = 0;
            var wv = 0;
            var xv = 0;
            var yv = 0;
            //m1
            xv = 0;
            yv = 0;
            hv = GuideManager._circleY - GuideManager._circleR;
            wv = easy.GlobalSetting.DISPLAY_WIDTH;
            GuideManager._mask1 = easy.ObjectPool.getByClass(egret.Shape);
            GuideManager._mask1.touchEnabled = true;
            GuideManager._mask1.graphics.clear();
            GuideManager._mask1.graphics.beginFill(GuideManager._maskColor, this._maskAlpha);
            GuideManager._mask1.graphics.drawRect(0, 0, wv, hv);
            GuideManager._mask1.graphics.endFill();
            GuideManager._mask1.width = wv;
            GuideManager._mask1.height = hv;
            GuideManager._mask1.x = xv;
            GuideManager._mask1.y = yv;
            if (!GuideManager._mask1.parent)
                easy.GlobalSetting.STAGE.addChild(GuideManager._mask1);
            //m2
            xv = 0;
            yv = GuideManager._circleY - GuideManager._circleR;
            wv = GuideManager._circleX - GuideManager._circleR;
            hv = 2 * GuideManager._circleR;
            GuideManager._mask2 = easy.ObjectPool.getByClass(egret.Shape);
            GuideManager._mask2.touchEnabled = true;
            GuideManager._mask2.graphics.clear();
            GuideManager._mask2.graphics.beginFill(GuideManager._maskColor, GuideManager._maskAlpha);
            GuideManager._mask2.graphics.drawRect(0, 0, wv, hv);
            GuideManager._mask2.graphics.endFill();
            GuideManager._mask2.width = wv;
            GuideManager._mask2.height = hv;
            GuideManager._mask2.x = xv;
            GuideManager._mask2.y = yv;
            easy.GlobalSetting.STAGE.addChild(GuideManager._mask2);
            //m3
            xv = GuideManager._circleX + GuideManager._circleR;
            yv = GuideManager._circleY - GuideManager._circleR;
            wv = easy.GlobalSetting.DISPLAY_WIDTH - GuideManager._circleX - GuideManager._circleR;
            hv = 2 * GuideManager._circleR;
            GuideManager._mask3 = easy.ObjectPool.getByClass(egret.Shape);
            GuideManager._mask3.touchEnabled = true;
            GuideManager._mask3.graphics.clear();
            GuideManager._mask3.graphics.beginFill(GuideManager._maskColor, GuideManager._maskAlpha);
            GuideManager._mask3.graphics.drawRect(0, 0, wv, hv);
            GuideManager._mask3.graphics.endFill();
            GuideManager._mask3.width = wv;
            GuideManager._mask3.height = hv;
            GuideManager._mask3.x = xv;
            GuideManager._mask3.y = yv;
            easy.GlobalSetting.STAGE.addChild(GuideManager._mask3);
            //m4
            xv = 0;
            yv = GuideManager._circleY + GuideManager._circleR;
            wv = easy.GlobalSetting.DISPLAY_WIDTH;
            hv = easy.GlobalSetting.DISPLAY_HEIGHT - GuideManager._circleY - GuideManager._circleR;
            GuideManager._mask4 = easy.ObjectPool.getByClass(egret.Shape);
            GuideManager._mask4.touchEnabled = true;
            GuideManager._mask4.graphics.clear();
            GuideManager._mask4.graphics.beginFill(GuideManager._maskColor, GuideManager._maskAlpha);
            GuideManager._mask4.graphics.drawRect(0, 0, wv, hv);
            GuideManager._mask4.graphics.endFill();
            GuideManager._mask4.width = wv;
            GuideManager._mask4.height = hv;
            GuideManager._mask4.x = xv;
            GuideManager._mask4.y = yv;
            easy.GlobalSetting.STAGE.addChild(GuideManager._mask4);
            //m0
            xv = this._circleX - this._circleR;
            yv = this._circleY - this._circleR;
            wv = 2 * GuideManager._circleR;
            hv = 2 * GuideManager._circleR;
            var m01 = easy.ObjectPool.getByClass(egret.Shape);
            m01.graphics.clear();
            m01.graphics.beginFill(GuideManager._maskColor, GuideManager._maskAlpha);
            m01.graphics.drawRect(0, 0, wv, hv);
            m01.graphics.endFill();
            var m02 = easy.ObjectPool.getByClass(egret.Shape);
            m02.graphics.clear();
            m02.graphics.beginFill(GuideManager._maskColor, GuideManager._maskAlpha);
            m02.graphics.drawCircle(GuideManager._circleR, GuideManager._circleR, GuideManager._circleR);
            m02.graphics.endFill();
            //this._bitmapMask.width = wv;
            //this._bitmapMask.height = hv;
            GuideManager._mask0.x = xv;
            GuideManager._mask0.y = yv;
            //GuideManager._mask0.texture = easy.SpriteUtils.earse(m01, m02);
            GuideManager._groupMask.addChild(GuideManager._mask0);
            GuideManager._groupMask.addChild(GuideManager._maskCircle);
            easy.GlobalSetting.STAGE.addChild(GuideManager._groupMask);
            easy.ObjectPool.recycleClass(m01);
            easy.ObjectPool.recycleClass(m02);
            //动画圈
            easy.HeartBeat.addListener(GuideManager, GuideManager.onHbCircleRun, 1);
            GuideManager._circleRunR = GuideManager._circleR + GuideManager._circleRunGap * GuideManager._circleRunGapNum;
            GuideManager._circleRunAlpha = 0.1;
            //当前窗口重置在最前
            if (GuideManager.currentClz) {
                var instWin = easy.PopupManager.getWinInstance(GuideManager.currentClz);
                if (instWin) {
                    easy.GlobalSetting.STAGE.addChild(instWin);
                }
            }
        };
        /**
         * 设置焦点遮罩的尺寸
         */
        GuideManager.setFoucsMaskSize = function () {
            //计算数值数据
            var change = false;
            if (GuideManager._targetFoucsUI && GuideManager.currentItem) {
                var foucsData = easy.StringUtil.parserStrToObj(GuideManager.currentItem.focus_data);
                var rv = GuideManager._targetFoucsUI.width;
                if (GuideManager._targetFoucsUI.height > rv) {
                    rv = GuideManager._targetFoucsUI.height;
                }
                rv = rv / 2;
                if (foucsData["gap_r"]) {
                    rv += parseFloat(foucsData["gap_r"]);
                }
                if (GuideManager._circleR != rv) {
                    GuideManager._circleR = rv;
                    change = true;
                }
                var pointXY = GuideManager._targetFoucsUI.parent.localToGlobal(GuideManager._targetFoucsUI.x, GuideManager._targetFoucsUI.y);
                var xv = pointXY.x + GuideManager._targetFoucsUI.width / 2 + GuideManager.currentItem.focus_x;
                var yv = pointXY.y + GuideManager._targetFoucsUI.height / 2 + GuideManager.currentItem.focus_y;
                if (GuideManager._circleX != xv) {
                    GuideManager._circleX = xv;
                    change = true;
                }
                if (GuideManager._circleY != yv) {
                    GuideManager._circleY = yv;
                    change = true;
                }
            }
            return change;
        };
        /**
         * 动态圈
         */
        GuideManager.onHbCircleRun = function () {
            if (GuideManager._circleRunGapPause < GuideManager._circleRunGapPauseMax) {
                GuideManager._circleRunGapPause++;
                return;
            }
            if (GuideManager.setFoucsMaskSize()) {
                this.showMaskFocus();
            }
            //先画一个固定圆
            GuideManager._maskCircle.graphics.clear();
            GuideManager._maskCircle.graphics.lineStyle(GuideManager._circleRunThickness, GuideManager._circleColor);
            GuideManager._maskCircle.graphics.drawCircle(GuideManager._circleX, GuideManager._circleY, GuideManager._circleR + GuideManager._circleRunThickness / 2);
            GuideManager._maskCircle.graphics.endFill();
            //动态圆
            GuideManager._maskCircle.graphics.lineStyle(GuideManager._circleRunThickness2, GuideManager._circleRunColor, GuideManager._circleRunAlpha);
            GuideManager._maskCircle.graphics.drawCircle(GuideManager._circleX, GuideManager._circleY, GuideManager._circleRunR);
            GuideManager._maskCircle.graphics.endFill();
            GuideManager._circleRunR -= GuideManager._circleRunGap;
            GuideManager._circleRunAlpha += 1 / GuideManager._circleRunGapNum;
            if (GuideManager._circleRunR <= GuideManager._circleR + GuideManager._circleRunThickness) {
                GuideManager._circleRunGapPause = 0;
                GuideManager._circleRunR = GuideManager._circleR + GuideManager._circleRunGap * GuideManager._circleRunGapNum;
                GuideManager._circleRunAlpha = 0.1;
            }
        };
        /**
         * 移除焦点遮罩
         */
        GuideManager.removeMaskFocus = function () {
            easy.HeartBeat.removeListener(this, this.onHbCircleRun);
            if (GuideManager._mask1 && GuideManager._mask1.parent) {
                GuideManager._mask1.parent.removeChild(GuideManager._mask1);
                easy.ObjectPool.recycleClass(GuideManager._mask1);
                GuideManager._mask1 = null;
            }
            if (GuideManager._mask2 && GuideManager._mask2.parent) {
                GuideManager._mask2.parent.removeChild(GuideManager._mask2);
                easy.ObjectPool.recycleClass(GuideManager._mask2);
                GuideManager._mask2 = null;
            }
            if (GuideManager._mask3 && GuideManager._mask3.parent) {
                GuideManager._mask3.parent.removeChild(GuideManager._mask3);
                easy.ObjectPool.recycleClass(GuideManager._mask3);
                GuideManager._mask3 = null;
            }
            if (GuideManager._mask4 && GuideManager._mask4.parent) {
                GuideManager._mask4.parent.removeChild(GuideManager._mask4);
                easy.ObjectPool.recycleClass(GuideManager._mask4);
                GuideManager._mask4 = null;
            }
            if (GuideManager._groupMask)
                GuideManager._groupMask.removeFromParent();
        };
        /**
         * 显示遮幅
         * @param textureName 自定义遮幅材质
         */
        GuideManager.showMaskCropping = function (textureName) {
            if (textureName === void 0) { textureName = null; }
            //初始化遮幅显示对象
            if (!GuideManager.croppingTop)
                GuideManager.croppingTop = new easy.Group();
            if (!GuideManager.croppingBottom)
                GuideManager.croppingBottom = new easy.Group();
            if (!GuideManager.croppingTop.parent) {
                easy.GlobalSetting.STAGE.addChild(GuideManager.croppingTop);
                easy.GlobalSetting.STAGE.addChild(GuideManager.croppingBottom);
                GuideManager.initCropping(textureName);
                GuideManager.croppingTop.y = -GuideManager.croppingTop.height;
                GuideManager.croppingBottom.y = easy.GlobalSetting.STAGE.stageHeight;
                //首次显示,做缓动
                egret.Tween.get(GuideManager.croppingTop).to({ y: 0 }, 500);
                egret.Tween.get(GuideManager.croppingBottom).to({ y: easy.GlobalSetting.STAGE.stageHeight - GuideManager.croppingBottom.height }, 500);
            }
            else {
                //再添加一次,把次序调到最后面,主要是保证遮幅是放置在最前面的
                easy.GlobalSetting.STAGE.addChild(GuideManager.croppingTop);
                easy.GlobalSetting.STAGE.addChild(GuideManager.croppingBottom);
                GuideManager.initCropping(textureName);
            }
        };
        /**
         * 关闭遮幅
         */
        GuideManager.removeMaskCropping = function () {
            if (GuideManager.croppingTop && GuideManager.croppingTop.parent) {
                egret.Tween.get(GuideManager.croppingTop).to({ y: -GuideManager.croppingTop.height }, 500).call(GuideManager.onCompleteOutCropping, GuideManager);
                egret.Tween.get(GuideManager.croppingBottom).to({ y: easy.GlobalSetting.STAGE.height }, 500);
            }
        };
        /**
         * 遮幅退出动画完成
         */
        GuideManager.onCompleteOutCropping = function () {
            GuideManager.croppingTop.removeFromParent();
            GuideManager.croppingBottom.removeFromParent();
        };
        /**
         * 初始化遮幅显示数据
         * @param textureName
         */
        GuideManager.initCropping = function (textureName) {
            if (textureName === void 0) { textureName = null; }
            if (!GuideManager._initCropping) {
                GuideManager._initCropping = true;
                //设置宽
                GuideManager.croppingTop.width = easy.GlobalSetting.STAGE.stageWidth;
                GuideManager.croppingTop.border = false;
                GuideManager.croppingBottom.width = easy.GlobalSetting.STAGE.stageWidth;
                GuideManager.croppingBottom.border = false;
                //设置默认高
                GuideManager.croppingTop.height = 100;
                GuideManager.croppingTop.bgColor = 0x000000;
                GuideManager.croppingTop.alpha = 0.6;
                GuideManager.croppingBottom.height = 100;
                GuideManager.croppingBottom.bgColor = 0x000000;
                GuideManager.croppingBottom.alpha = 0.6;
            }
            //设置材质
            if (textureName) {
                GuideManager.croppingTop.bgTexture = RES.getRes(textureName);
                GuideManager.croppingTop.alpha = 1;
                GuideManager.croppingBottom.bgTexture = RES.getRes(textureName);
                GuideManager.croppingBottom.alpha = 1;
                if (GuideManager.croppingTop.bgTexture) {
                    GuideManager.croppingTop.height = GuideManager.croppingTop.bgTexture.textureHeight;
                    GuideManager.croppingBottom.height = GuideManager.croppingBottom.bgTexture.textureHeight;
                }
            }
        };
        /**
         * 根据id获取GuideItem
         * @param id
         * @returns {any}
         */
        GuideManager.getGuideItem = function (id) {
            if (easy.StringUtil.isUsage(id) && GuideManager.guide_item_dict[id]) {
                return GuideManager.guide_item_dict[id];
            }
            return null;
        };
        /**
         * 根据id获取GuideChapter
         * @param id
         * @returns {any}
         */
        GuideManager.getGuideChapter = function (id) {
            if (easy.StringUtil.isUsage(id) && GuideManager.guide_chapter_dict[id]) {
                return GuideManager.guide_chapter_dict[id];
            }
            return null;
        };
        /**
         * 添加guide item
         * @param item
         */
        GuideManager.addGuideItem = function (item) {
            easy.GuideManager.guide_item_dict["" + item.id] = item;
            easy.GuideManager.guide_item_arr.push(item);
        };
        /**
         * 添加guide chapter
         * @param item
         */
        GuideManager.addGuideChapter = function (item) {
            easy.GuideManager.guide_chapter_dict["" + item.id] = item;
            easy.GuideManager.guide_chapter_arr.push(item);
        };
        return GuideManager;
    }());
    GuideManager._init_data = false; //是否已经初始化节点数据
    //GuideChapter 存储定义
    GuideManager.guide_chapter_dict = {};
    GuideManager.guide_chapter_arr = [];
    //GuideItem 存储定义
    GuideManager.guide_item_dict = {};
    GuideManager.guide_item_arr = [];
    GuideManager.currentItem = null; //当前播放的节点
    GuideManager.currentView = null; //当前窗口
    GuideManager.currentClz = null; //当前窗口类
    //上遮幅显示对象
    GuideManager.croppingTop = null;
    //下遮幅显示对象
    GuideManager.croppingBottom = null;
    //遮幅对象是否已初始化
    GuideManager._initCropping = false;
    //剧情结束的时候,需要回调的无参数function
    GuideManager._completeCallFunc = null; //
    GuideManager._completeCallFuncThis = null; //
    //事件执行管理器
    GuideManager._guideExecuteManager = null;
    //焦点遮罩参数
    GuideManager._groupMask = null;
    GuideManager._mask0 = null;
    GuideManager._maskCircle = null;
    GuideManager._mask1 = null;
    GuideManager._mask2 = null;
    GuideManager._mask3 = null;
    GuideManager._mask4 = null;
    //基础参数
    GuideManager._circleX = 350;
    GuideManager._circleY = 800;
    GuideManager._circleR = 50;
    GuideManager._circleColor = 0xffea00;
    GuideManager._circleRunColor = 0x8c79ff;
    GuideManager._maskColor = 0x000000;
    GuideManager._maskAlpha = 0.8;
    //动态圆的参数
    GuideManager._circleRunR = 0; //动态圆的直径
    GuideManager._circleRunThickness = 13; //动态圆的边缘厚度
    GuideManager._circleRunThickness2 = 8; //动态圆的边缘厚度
    GuideManager._circleRunGap = 8; //每次间隔的距离
    GuideManager._circleRunGapNum = 30; //每次间隔的距离
    GuideManager._circleRunGapPause = 60; //每次停顿计数
    GuideManager._circleRunGapPauseMax = 60; //每次停顿时间
    GuideManager._circleRunAlpha = 8; //每次间隔的距离
    GuideManager._targetFoucsUI = null;
    easy.GuideManager = GuideManager;
    __reflect(GuideManager.prototype, "easy.GuideManager");
})(easy || (easy = {}));
