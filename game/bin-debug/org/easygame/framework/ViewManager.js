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
    /**
     * 这个类是作为view页面转换的主入口类
     * view类是比较大的开销,不同的view互相切换显示,复用率非常的高
     */
    var ViewManager = (function () {
        function ViewManager() {
        }
        /**
         * 重新进入之前的view
         */
        ViewManager.reverseView = function () {
            if (ViewManager.reverseClz) {
                ViewManager.show(ViewManager.reverseClz, ViewManager.reverseData);
            }
        };
        /**
         * 切换view显示
         * @param clz
         */
        ViewManager.show = function (clz, data, showLoading) {
            if (data === void 0) { data = null; }
            if (showLoading === void 0) { showLoading = true; }
            easy.PopupManager.removeAll();
            if (ViewManager.mainContainer == null) {
                ViewManager.mainContainer = easy.GlobalSetting.STAGE.getChildAt(0);
            }
            ViewManager._waitChangeView = easy.ObjectPool.getByClass(clz, "", false);
            var key = egret.getQualifiedClassName(clz);
            //easy.Debug.log = "view.show=" + key;
            //console.log("View change clz=" + key);
            if (ViewManager._waitChangeView == ViewManager.currentView) {
                ViewManager._waitChangeView = null;
                //console.log("相同的View change clz=" + key);
                return;
            }
            ViewManager.reverseClz = ViewManager._currentClz;
            ViewManager.reverseData = ViewManager._currentData;
            ViewManager._currentClz = clz;
            ViewManager._currentData = data;
            //检测素材资源是否准备完成,没完成则等待进入
            //console.log("ViewManager wait.view=" + ViewManager._waitChangeView);
            if (ViewManager._waitChangeView) {
                ViewManager._waitChangeView.alpha = 0;
                ViewManager._waitChangeView.data = data;
                ViewManager._waitChangeView.showLoading = showLoading;
                ViewManager.mainContainer.addChildAt(ViewManager._waitChangeView, 0);
            }
            if (ViewManager._waitChangeView && ViewManager._waitChangeView.checkResReady()) {
                //检测完成情况,未完成会自动启动loading,已经完成,直接enter
                ViewManager.waitViewDoEnter();
            }
        };
        /**
         * 等待进入的view已经准备完毕,开始enter
         */
        ViewManager.waitViewDoEnter = function () {
            //console.log("@@ViewManager waitViewDoEnter view=" + egret.getQualifiedClassName(ViewManager._waitChangeView));
            //var tempOuterView:View = null;
            if (ViewManager.currentView && ViewManager._waitChangeView && ViewManager._waitChangeView != ViewManager.currentView) {
                //console.log("@@ViewManager 000 waitViewDoEnter")
                //tempOuterView = ViewManager.currentView;
                ViewManager.currentView.outer();
                var key = egret.getQualifiedClassName(ViewManager.currentView);
            }
            if (ViewManager._waitChangeView) {
                //新的view
                if (!ViewManager._waitChangeView._uiResReady)
                    ViewManager._waitChangeView._uiResReady = true; //ui的res已经准备完成,下次不需要download了
                ViewManager._waitChangeView.removeFromParent();
                ViewManager.mainContainer.addChild(ViewManager._waitChangeView);
                ViewManager.currentView = ViewManager._waitChangeView;
                if (easy.GlobalSetting.DISPLAY_MODEL == easy.GlobalSetting.DISPLAY_VIEW_EASYGAME) {
                    ViewManager.currentView.setSize(easy.GlobalSetting.DISPLAY_WIDTH, easy.GlobalSetting.DISPLAY_HEIGHT);
                }
                ViewManager.currentView.alpha = 1;
                ViewManager.currentView.x = 0;
                ViewManager.currentView.y = 0;
                ViewManager.currentView.enter();
                ViewManager._waitChangeView = null;
            }
            //if (tempOuterView) {
            //    tempOuterView.outer();
            //}
        };
        /**
         * 把当前接收到的协议转发到当前显示的view,以便view做刷新
         * @param packet
         */
        ViewManager.receivePacket = function (packet) {
            //view层派发
            if (ViewManager.currentView)
                ViewManager.currentView.receivePacket(packet);
            //弹出窗口派发
            if (easy.PopupManager.currentWin)
                easy.PopupManager.currentWin.receivePacket(packet); //win界面派发
        };
        /**
         * 把当前接收到的event事件转发到当前显示的view,以便view做刷新
         * @param event
         */
        ViewManager.receiveEvent = function (event) {
            //view层派发
            if (ViewManager.currentView)
                ViewManager.currentView.receiveEvent(event);
            //弹出窗口派发
            if (easy.PopupManager.currentWin)
                easy.PopupManager.currentWin.receiveEvent(event); //win界面派发
        };
        return ViewManager;
    }());
    ViewManager.defaultLoadingClass = easy.DefaultLoadingView; //默认的view loading ui，可以替换成自己需要的loading
    ViewManager.mainContainer = null; //游戏画面容器
    ViewManager.currentView = null; //当前显示的view
    ViewManager._waitChangeView = null; //等待进入的view对象
    ViewManager._currentClz = null;
    ViewManager._currentData = null;
    //回溯窗口
    ViewManager.reverseClz = null;
    ViewManager.reverseData = null;
    easy.ViewManager = ViewManager;
    __reflect(ViewManager.prototype, "easy.ViewManager");
})(easy || (easy = {}));
