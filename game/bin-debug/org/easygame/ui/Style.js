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
    var Style = (function () {
        function Style() {
        }
        /**
         * Applies a preset style as a list of color values. Should be called before creating any components.
         */
        Style.setStyle = function (style) {
            switch (style) {
                case Style.DARK:
                    Style.BACKGROUND = 0x444444;
                    Style.BUTTON_FACE = 0x666666;
                    Style.BUTTON_DOWN = 0x222222;
                    Style.INPUT_TEXT = 0xBBBBBB;
                    Style.LABEL_TEXT = 0xCCCCCC;
                    Style.PANEL = 0x666666;
                    Style.PROGRESS_BAR = 0x666666;
                    Style.TEXT_BACKGROUND = 0x555555;
                    Style.LIST_DEFAULT = 0x444444;
                    Style.LIST_ALTERNATE = 0x393939;
                    Style.LIST_SELECTED = 0x666666;
                    Style.LIST_ROLLOVER = 0x777777;
                    break;
                case Style.LIGHT:
                default:
                    Style.BACKGROUND = 0xCCCCCC;
                    Style.BUTTON_FACE = 0xFFFFFF;
                    Style.BUTTON_DOWN = 0xEEEEEE;
                    Style.INPUT_TEXT = 0x333333;
                    Style.LABEL_TEXT = 0x666666;
                    Style.PANEL = 0xF3F3F3;
                    Style.PROGRESS_BAR = 0xFFFFFF;
                    Style.TEXT_BACKGROUND = 0xFFFFFF;
                    Style.LIST_DEFAULT = 0xFFFFFF;
                    Style.LIST_ALTERNATE = 0xF3F3F3;
                    Style.LIST_SELECTED = 0xCCCCCC;
                    Style.LIST_ROLLOVER = 0xDDDDDD;
                    break;
            }
        };
        return Style;
    }());
    Style.TEXT_BACKGROUND = 0xFFFFFF;
    Style.BACKGROUND = 0xCCCCCC;
    Style.BUTTON_FACE = 0xFFFFFF;
    Style.BUTTON_DOWN = 0xEEEEEE;
    Style.INPUT_TEXT = 0x333333;
    Style.LABEL_TEXT = 0x000000;
    Style.BUTTON_TEXT = 0x666666;
    Style.DROPSHADOW = 0x000000;
    Style.PANEL = 0xF3F3F3;
    Style.PROGRESS_BAR = 0xFFFFFF;
    Style.LIST_DEFAULT = 0xFFFFFF;
    Style.LIST_ALTERNATE = 0xF3F3F3;
    Style.LIST_SELECTED = 0xCCCCCC;
    Style.LIST_ROLLOVER = 0XDDDDDD;
    Style.BUTTON_DEFAULT_WIDTH = 100;
    Style.BUTTON_DEFAULT_HEIGHT = 32;
    Style.VIDEO_DEFAULT_WIDTH = 320;
    Style.VIDEO_DEFAULT_HEIGHT = 250;
    Style.embedFonts = false;
    Style.fontName = null;
    Style.fontSize = 16;
    /**
     * 是否允许文本加载默认滤镜.
     */
    Style.allowDefaultLabelFilter = true;
    Style.DARK = "dark";
    Style.LIGHT = "light";
    /**
     * 是否允许按钮禁用态时的颜色矩阵.
     */
    Style.allowColorFilterButtonEnabled = false;
    /**
     * 是否允许默认按钮点击自动冷却.(在按钮本身设置无冷却的情况下生效.)
     */
    Style.allowButtonDefaultCoolDown = false;
    /**
     * allowButtonDefaultCoolDown == true 情况下生效.
     */
    Style.defaultCoolDownFrames = 2;
    Style.TEXTINPUT_HEIGHT = 25;
    Style.TEXTINPUT_WIDTH = 100;
    Style.TEXTINPUT_COLOR = 0xffffff;
    Style.HORIZONTAL = "horizontal";
    Style.VERTICAL = "vertical";
    Style.SLIDER_WIDTH = 300;
    Style.SLIDER_HEIGHT = 17;
    Style.SCROLLBAR_WIDTH = 300;
    Style.SCROLLBAR_HEIGHT = 17;
    easy.Style = Style;
    __reflect(Style.prototype, "easy.Style");
})(easy || (easy = {}));
