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
    var TextInput = (function (_super) {
        __extends(TextInput, _super);
        function TextInput(drawDelay) {
            if (drawDelay === void 0) { drawDelay = false; }
            var _this = _super.call(this, drawDelay) || this;
            _this._textField = null;
            _this._text = "";
            _this._password = false;
            _this._fontName = easy.Style.fontName; //字体
            _this._fontSize = easy.Style.fontSize; //字体大小
            _this._fontColor = easy.Style.TEXTINPUT_COLOR; //字体颜色
            _this._hAlign = egret.HorizontalAlign.LEFT;
            _this._vAlign = egret.VerticalAlign.MIDDLE;
            _this._bold = false;
            _this._italic = false;
            _this._lineSpacing = 0; //行间距
            _this._multiline = false; //多行显示
            _this._stroke = 0;
            _this._strokeColor = 0;
            _this._wordWrap = true; //自动换行
            _this._maxChars = 0; //输入最大字符
            _this._restrict = null; //限制输入
            _this._inputType = null; //键盘输入类型
            return _this;
        }
        TextInput.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.setSize(easy.Style.TEXTINPUT_WIDTH, easy.Style.TEXTINPUT_HEIGHT);
            this.bgColor = easy.Style.INPUT_TEXT;
            this.clip = false;
            this.touchEnabled = true;
            this._textField = new egret.TextField();
            this._textField.height = this.height;
            this._textField.width = this.width;
            this._textField.displayAsPassword = false;
            this._textField.type = egret.TextFieldType.INPUT;
            this._textField.addEventListener(egret.Event.CHANGE, this.onChangeHdl, this);
            this._textField.touchEnabled = true;
            this.addChild(this._textField);
        };
        /**
         * 文字输入变化处理
         */
        TextInput.prototype.onChangeHdl = function (event) {
            this._text = this._textField.text;
            //console.log("TextInput Change text=" + this._text);
            this.invalidate();
        };
        /**
         * 返回文字输入对象
         */
        TextInput.prototype.getTextField = function () {
            return this._textField;
        };
        /**
         * 绘制组件内容
         */
        TextInput.prototype.draw = function () {
            _super.prototype.draw.call(this);
            //console.log("TextInput draw=" + this._textField + ", text=" + this._textField.type);
            if (!this._textField)
                return;
            if (this._fontName != null) {
                this._textField.fontFamily = this._fontName;
            }
            if (this._fontColor >= 0)
                this._textField.textColor = this._fontColor;
            if (this._fontSize > 0)
                this._textField.size = this._fontSize;
            this._textField.textAlign = this._hAlign;
            this._textField.verticalAlign = this._vAlign;
            this._textField.bold = this._bold;
            this._textField.italic = this._italic;
            this._textField.multiline = this._multiline;
            this._textField.lineSpacing = this._lineSpacing;
            this._textField.stroke = this._stroke;
            this._textField.strokeColor = this._strokeColor;
            this._textField.width = this.width;
            this._textField.height = this.height;
            this._textField.displayAsPassword = this._password;
            this._textField.text = this._text;
            this._textField.wordWrap = this._wordWrap;
            this._textField.maxChars = this._maxChars;
            if (easy.StringUtil.isUsage(this._restrict))
                this._textField.restrict = this._restrict;
            if (easy.StringUtil.isUsage(this._inputType))
                this._textField.inputType = this._inputType;
        };
        Object.defineProperty(TextInput.prototype, "fontName", {
            get: function () {
                return this._fontName;
            },
            /**
             * 设置文本字体
             * @param value
             *
             */
            set: function (value) {
                if (this._fontName != value) {
                    this._fontName = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "password", {
            get: function () {
                return this._password;
            },
            /**
             * 设置文本输入为密码输入,采用掩码显示输入的内容
             * @param value
             *
             */
            set: function (value) {
                if (this._password != value) {
                    this._password = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "fontSize", {
            get: function () {
                return this._fontSize;
            },
            /**
             * 设置文本字体大小
             * @param value
             *
             */
            set: function (value) {
                if (this._fontSize != value) {
                    this._fontSize = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "fontColor", {
            get: function () {
                return this._fontColor;
            },
            /**
             * 设置文本颜色
             * @param value
             *
             */
            set: function (value) {
                if (this._fontColor != value) {
                    this._fontColor = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "text", {
            get: function () {
                return this._text;
            },
            /**
             * 显示和设置文字
             */
            set: function (t) {
                if (this._text != t) {
                    this._text = t;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "lineSpacing", {
            /**
             * 设置多行间距，外部设置一般为正数
             */
            get: function () {
                return this._lineSpacing;
            },
            set: function (value) {
                if (this._lineSpacing != value) {
                    this._lineSpacing = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "multiline", {
            /**
             * 设置多行间距，外部设置一般为正数
             */
            get: function () {
                return this._multiline;
            },
            set: function (value) {
                if (this._multiline != value) {
                    this._multiline = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "wordWrap", {
            /**
             * 设置自动换行
             */
            get: function () {
                return this._wordWrap;
            },
            set: function (value) {
                if (this._wordWrap != value) {
                    this._wordWrap = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "stroke", {
            /**
             * 文字描边
             */
            get: function () {
                return this._stroke;
            },
            set: function (value) {
                if (this._stroke != value) {
                    this._stroke = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "strokeColor", {
            /**
             * 文字描边颜色
             */
            get: function () {
                return this._strokeColor;
            },
            set: function (value) {
                if (this._strokeColor != value) {
                    this._strokeColor = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "hAlign", {
            /**
             * 文字水平对齐方式
             */
            get: function () {
                return this._hAlign;
            },
            set: function (value) {
                if (this._hAlign != value) {
                    this._hAlign = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "vAlign", {
            /**
             * 文字竖直对齐方式
             */
            get: function () {
                return this._vAlign;
            },
            set: function (value) {
                if (this._vAlign != value) {
                    this._vAlign = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        TextInput.prototype.setFocus = function () {
            if (this._textField) {
                this._textField.setFocus();
            }
        };
        Object.defineProperty(TextInput.prototype, "maxChars", {
            get: function () {
                return this._maxChars;
            },
            /**
             * 最大输入字符
             * @param value
             */
            set: function (value) {
                if (this._maxChars != value) {
                    this._maxChars = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "restrict", {
            get: function () {
                return this._restrict;
            },
            /**
             * 正则表达式,限制输入
             * @param value
             */
            set: function (value) {
                if (this._restrict != value) {
                    this._restrict = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "inputType", {
            get: function () {
                return this._inputType;
            },
            /**
             * 键盘类型
             * @param value
             */
            set: function (value) {
                if (this._inputType != value) {
                    this._inputType = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        return TextInput;
    }(easy.Group));
    easy.TextInput = TextInput;
    __reflect(TextInput.prototype, "easy.TextInput");
})(easy || (easy = {}));
