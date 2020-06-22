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
    var GuideItem = (function () {
        function GuideItem() {
            //ID编号
            this.id = null;
            //节点名称
            this.name = null;
            //描述
            this.desc = null;
            //节点类型
            this.type = null;
            //章节
            this.chapter = null;
            //目标
            this.target = null;
            //下一帧
            this.next_frame = null;
            //下一帧延迟
            this.next_delay = 0;
            //对话内容
            this.text = null;
            //点击次数
            this.click_num = 0;
            //任意点击
            this.click_stage = 1;
            //旁白
            this.aside = false;
            //水平对齐
            this.h_align = null;
            //水平偏移量
            this.h_pos = 0;
            //竖直对齐
            this.v_align = null;
            //竖直偏移量
            this.v_pos = 0;
            //肖像id
            this.icon = null;
            //icon偏移x
            this.oxIcon = 0;
            //icon偏移y
            this.oyIcon = 0;
            //win偏移x
            this.oxWin = 0;
            //win偏移y
            this.oyWin = 0;
            //肖像k=v数据
            this.data = null;
            //显示名称
            this.nick = null;
            //头像镜像
            this.mirror = 0;
            //显示方式
            this.txt_model = null;
            //显示速度
            this.txt_frame = 0;
            //遮罩方式
            this.mask = null;
            //选项
            this.opts = null;
            //事件数据
            this.event_data = null;
            //事件条件
            this.event_condition = null;
            //新手的句柄
            this.handle_type = null;
            this.handle_path = null;
            this.handle_data = null;
            //handle设定
            //新手的焦点
            this.focus_color = null;
            this.focus_stress = 0;
            this.focus_gap = 0;
            this.focus_x = 0;
            this.focus_y = 0;
            this.focus_data = null;
        }
        /**
         * 转义特殊的字符
         */
        GuideItem.prototype.escapeChars = function () {
            //name
            this.name = easy.StringUtil.replace(this.name, "{~D!}", ",");
            this.name = easy.StringUtil.replace(this.name, "{~N!}", "\n");
            //nick
            this.nick = easy.StringUtil.replace(this.nick, "{~D!}", ",");
            this.nick = easy.StringUtil.replace(this.nick, "{~N!}", "\n");
            //text
            this.text = easy.StringUtil.replace(this.text, "{~D!}", ",");
            this.text = easy.StringUtil.replace(this.text, "{~N!}", "\n");
            //focuse
            this.focus_color = easy.StringUtil.replace(this.focus_color, "{~D!}", ",");
        };
        return GuideItem;
    }());
    GuideItem.MASK_NONE = "none"; //无遮罩
    GuideItem.MASK_NORMAL = "guide"; //通用遮罩
    GuideItem.MASK_CROPPING = "cropping"; //遮幅
    easy.GuideItem = GuideItem;
    __reflect(GuideItem.prototype, "easy.GuideItem");
})(easy || (easy = {}));
