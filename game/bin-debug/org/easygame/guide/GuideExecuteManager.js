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
     * 新手执行管理器
     */
    var GuideExecuteManager = (function () {
        function GuideExecuteManager() {
            this._condition = "befor"; //befor after
            this._item = null;
            this._currentClz = null; //当前窗口类
            //剧情结束的时候,需要回调的无参数function
            this._completeCallFunc = null; //
            this._completeCallFuncThis = null; //
            easy.EventManager.addEventListener(easy.EventType.GUIDE_EVENT_END, this.onMyEventGuideExecuteEnd, this);
        }
        /**
         * 事件执行完毕
         * @param myEvent
         */
        GuideExecuteManager.prototype.onMyEventGuideExecuteEnd = function (myEvent) {
            if (this._item && this._item.id == myEvent.getItem("item_id")) {
                if (this._condition == "befor") {
                    easy.GuideManager.playItem(this._item, this._currentClz, this._completeCallFunc, this._completeCallFuncThis, false);
                }
                else {
                    easy.GuideManager.currentItem = this._item;
                    easy.GuideManager._completeCallFunc = this._completeCallFunc;
                    easy.GuideManager._completeCallFuncThis = this._completeCallFuncThis;
                    easy.GuideManager.currentClz = this._currentClz;
                    easy.GuideManager.playNextItem(false);
                }
                this._item = null;
                this._completeCallFunc = null;
                this._completeCallFuncThis = null;
                this._currentClz = null;
            }
        };
        /**
         * 节点前执行事件
         * @returns {boolean}
         */
        GuideExecuteManager.prototype.executeBefor = function (item, clz, completeCallFunc, thisFunc) {
            if (clz === void 0) { clz = null; }
            if (completeCallFunc === void 0) { completeCallFunc = null; }
            if (thisFunc === void 0) { thisFunc = null; }
            if (easy.StringUtil.isUsage(item.event_data)) {
                this._condition = "befor";
                this._item = item;
                this._completeCallFunc = completeCallFunc;
                this._completeCallFuncThis = thisFunc;
                this._currentClz = clz;
                var myEvent = easy.MyEvent.getEvent(easy.EventType.GUIDE_EVENT_EXE);
                myEvent.addItem("event_data", item.event_data);
                myEvent.addItem("item_id", item.id);
                myEvent.send();
            }
        };
        /**
         * 节点后执行事件
         * @returns {boolean}
         */
        GuideExecuteManager.prototype.executeAfter = function (item, clz, completeCallFunc, thisFunc) {
            if (clz === void 0) { clz = null; }
            if (completeCallFunc === void 0) { completeCallFunc = null; }
            if (thisFunc === void 0) { thisFunc = null; }
            if (easy.StringUtil.isUsage(item.event_data)) {
                this._condition = "after";
                this._item = item;
                this._completeCallFunc = completeCallFunc;
                this._completeCallFuncThis = thisFunc;
                this._currentClz = clz;
                var myEvent = easy.MyEvent.getEvent(easy.EventType.GUIDE_EVENT_EXE);
                myEvent.addItem("event_data", item.event_data);
                myEvent.addItem("item_id", item.id);
                myEvent.send();
            }
        };
        return GuideExecuteManager;
    }());
    easy.GuideExecuteManager = GuideExecuteManager;
    __reflect(GuideExecuteManager.prototype, "easy.GuideExecuteManager");
})(easy || (easy = {}));
