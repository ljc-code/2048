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
    var EventType = (function () {
        function EventType() {
        }
        return EventType;
    }());
    EventType.SOCKET_CONNECT = "SOCKET_CONNECT"; //socket连接完成
    EventType.SOCKET_DISCONNECT_ERROR = "SOCKET_DISCONNECT_ERROR"; //socket异常
    EventType.SOCKET_DISCONNECT = "SOCKET_DISCONNECT"; //socket连接断开
    EventType.SOCKET_SEND_SHOW = "SOCKET_SEND_SHOW"; //socket发送数据显示等待框
    EventType.SOCKET_SEND_HIDE = "SOCKET_SEND_HIDE"; //socket发送数据隐藏等待框
    EventType.SOCKET_SEND_TIMEOUT = "SOCKET_SEND_TIMEOUT"; //socket发送超时
    EventType.STAGE_RESIZE = "STAGE_RESIZE"; //屏幕尺寸变化
    EventType.UI_CONFIG_VOLUME = "UI_CONFIG_VOLUME"; //声音开关
    EventType.UI_CONFIG_FULLSCREEN = "UI_CONFIG_FULLSCREEN"; //全屏信号
    EventType.UI_LOADER_COMPLETED = "UI_LOADER_COMPLETED"; //loader下载完成事件
    //动画播放事件
    EventType.MOVIEWCLIP_PLAY = "MOVIEWCLIP_PLAY"; //动画播放事件
    EventType.MOVIEWCLIP_PLAY_END = "MOVIEWCLIP_PLAY_END"; //动画播放事件
    //debug模式事件
    EventType.UI_DEBUG_OPEN = "DEBUG_UI_OPEN"; //debug ui的开启
    EventType.UI_DEBUG_CLOSE = "DEBUG_UI_CLOSE"; //debug ui的关闭
    EventType.VOLUME_CHANGED = "VOLUME_CHANGED"; //音乐开关改变
    EventType.RESOURCE_DOWNLOADED = "RESOURCE_DOWNLOADED"; //资源下载完成{id:id, group:group}
    EventType.RESOURCE_PROGRESS = "RESOURCE_PROGRESS"; //资源下载进度通知
    EventType.PROJECT_RES_DOWNLOADED = "PROJECT_RES_DOWNLOADED"; //项目公用资源加载完成
    EventType.GUIDE_FREEDBACK = "GUIDE_FREEDBACK"; //通知新手导航管理器专用
    EventType.GUIDE_END = "GUIDE_END"; //新手导航向结束
    EventType.GUIDE_SIMULATE = "GUIDE_SIMULATE"; //新手导航模拟
    //view enter事件{data=class name}
    EventType.VIEW_ENTER = "VIEW_ENTER";
    //view outer事件{data=class name}
    EventType.VIEW_OUTER = "VIEW_OUTER";
    //win enter事件{data=class name}
    EventType.WIN_ENTER = "WIN_ENTER";
    //win outer事件{data=class name}
    EventType.WIN_OUTER = "WIN_OUTER";
    /**
     * 新手引导-{"type":0,可接受任务；1,可完成任务。}
     */
    EventType.GUIDE_TASK_TALKING_NOTIFY = "GUIDE_TASK_TALKING_NOTIFY"; //任务对话通知
    /**
     * 新手导航参数通知,参数为定制内容
     */
    EventType.GUIDE_PARAM_NOTIFY = "GUIDE_PARAM_NOTIFY"; //新手导航参数通知
    /**
     * 新手引导-对话面板关闭.
     */
    EventType.GUIDE_WIN_CLOSE_NOTIFY = "GUIDE_WIN_CLOSE_NOTIFY";
    EventType.GUIDE_TASK_CLOSE_NOTIFY = "GUIDE_TASK_CLOSE_NOTIFY";
    /**
     * 停止新手引导播放
     */
    EventType.GUIDE_STOP_ITEM = "GUIDE_STOP_ITEM";
    /**
     * 剧情模式 {"action":value}
     */
    EventType.STORY_TALKING = "STORY_TALKING";
    /**
     * 剧情结束.
     */
    EventType.STORY_END = "STORY_END";
    //guide产生的event执行事件通知
    EventType.GUIDE_EVENT_EXE = "GUIDE_EVENT_EXE";
    //guide 事件执行完毕
    EventType.GUIDE_EVENT_END = "GUIDE_EVENT_END";
    //剧情章节结束
    EventType.GUIDE_CHAPTER_END = "GUIDE_CHAPTER_END";
    //声音结束
    EventType.SOUND_COMPLETE = "SOUND_COMPLETE";
    EventType.SOUND_STOP = "SOUND_STOP";
    //视频结束
    EventType.VIDEO_END = "VIDEO_END";
    //擦除结束
    EventType.ERASE_COMPLETE = "erase_complete";
    //擦除信息有变化
    EventType.ERASE_CHANGE = "erase_change";
    easy.EventType = EventType;
    __reflect(EventType.prototype, "easy.EventType");
})(easy || (easy = {}));
