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
     * 动画数据
     */
    var AnimateManager = (function () {
        function AnimateManager() {
        }
        /**
         * 获取动画数据
         */
        AnimateManager.getAnimateData = function (name) {
            //easy.Debug.log = "getAnimateData=" + name;
            if (AnimateManager._animiateDataDict[name]) {
                return AnimateManager._animiateDataDict[name];
            }
            if (RES.isGroupLoaded(name + "_animate_group")) {
                AnimateManager._animiateDataDict[name] = new easy.AnimateData(name);
                return AnimateManager._animiateDataDict[name];
            }
            else {
                AnimateManager.loadAnimate(name);
            }
            return null;
        };
        /**
         * url加载json data数据到RES中
         */
        AnimateManager.loadAnimate = function (name) {
            if (!easy.StringUtil.isUsage(name))
                return;
            if (AnimateManager.names_down.indexOf(name) >= 0 || RES.isGroupLoaded(name + "_animate_group"))
                return;
            if (AnimateManager.waiting_groups.indexOf(name) < 0)
                AnimateManager.waiting_groups.push(name);
            if (AnimateManager.waiting_names.indexOf(name) < 0)
                AnimateManager.waiting_names.push(name);
            AnimateManager.names_down.push(name);
            easy.HeartBeat.addListener(AnimateManager, AnimateManager.onHeartBeatCheckLoadedFile, 60);
        };
        /**
         * 开始下载数据
         * @param name
         */
        AnimateManager.fireDownAnimate = function (name) {
            if (easy.GlobalSetting.isNative()) {
                easy.ResManager.loadConfig(RES.getVersionController().getVirtualUrl(easy.GlobalSetting.CDN_RES + "assets/animate/" + name + "_loader.json"), [name + "_animate_group"], AnimateManager.onLoadingGroupJosnFileComplete, AnimateManager);
            }
            else {
                easy.ResManager.loadConfig(easy.GlobalSetting.CDN_RES + "assets/animate/" + name + "_loader.json?r=" + Math.floor(Math.random() * 9999999999), [name + "_animate_group"], AnimateManager.onLoadingGroupJosnFileComplete, AnimateManager);
            }
        };
        /**
         * loading配置文件的Group加载完成
         * @param event
         */
        AnimateManager.onLoadingGroupJosnFileComplete = function (event) {
            //console.log("animate load complete!!!=" + event.groupName);
            if (event && easy.StringUtil.isUsage(event.groupName) && event.groupName.indexOf("_animate_group") >= 0) {
                var groupName = event.groupName.substring(0, event.groupName.indexOf("_animate_group"));
                if (AnimateManager.waiting_names.indexOf(groupName) >= 0)
                    AnimateManager.waiting_names.splice(AnimateManager.waiting_names.indexOf(groupName), 1);
                if (AnimateManager.waiting_groups.indexOf(groupName) >= 0)
                    AnimateManager.waiting_groups.splice(AnimateManager.waiting_groups.indexOf(groupName), 1);
                var myEvent = easy.MyEvent.getEvent(easy.EventType.RESOURCE_DOWNLOADED);
                myEvent.addItem("name", groupName);
                myEvent.send();
            }
            AnimateManager.onHeartBeatCheckLoadedFile();
        };
        /**
         * 检测是否有文件没有下载完成,重新加入下载列表中
         */
        AnimateManager.onHeartBeatCheckLoadedFile = function () {
            if (AnimateManager.waiting_groups.length == 0 && AnimateManager.waiting_names.length == 0) {
                easy.HeartBeat.removeListener(AnimateManager, AnimateManager.onHeartBeatCheckLoadedFile);
            }
            if (AnimateManager.waiting_groups.length > 0 && AnimateManager.waiting_names.length > 0) {
                var reloadArr = [];
                for (var i = AnimateManager.waiting_names.length - 1; i >= 0; i--) {
                    if (AnimateManager.waiting_groups.indexOf(AnimateManager.waiting_names[i]) >= 0) {
                        reloadArr.push(AnimateManager.waiting_names[i]);
                        AnimateManager.waiting_names.splice(i, 1);
                        AnimateManager.waiting_groups.splice(AnimateManager.waiting_groups.indexOf(AnimateManager.waiting_names[i]), 1);
                    }
                }
                var resName = null;
                while (reloadArr.length > 0) {
                    //easy.Debug.log = "onHeartBeatCheckLoadedFile 111111111111111";
                    AnimateManager.fireDownAnimate(reloadArr.pop());
                }
            }
        };
        return AnimateManager;
    }());
    AnimateManager._animiateDataDict = {};
    AnimateManager.waiting_groups = []; //等待下载的group列表
    AnimateManager.waiting_names = []; //等待下载的name列表
    AnimateManager.names_down = []; //已下载的那么集合
    easy.AnimateManager = AnimateManager;
    __reflect(AnimateManager.prototype, "easy.AnimateManager");
})(easy || (easy = {}));
