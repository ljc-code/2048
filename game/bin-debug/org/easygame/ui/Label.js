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
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(drawDelay) {
            if (drawDelay === void 0) { drawDelay = false; }
            var _this = _super.call(this, drawDelay) || this;
            _this._text = ""; //文本内容
            _this._textField = null;
            _this._initFlow = null;
            _this._htmlTextParser = null;
            _this._fontSize = easy.Style.fontSize; //字体大小
            _this._color = easy.Style.LABEL_TEXT; //字体颜色
            _this._fontName = easy.Style.fontName; //字体名称
            _this._hAlign = egret.HorizontalAlign.LEFT;
            _this._vAlign = egret.VerticalAlign.MIDDLE;
            _this._bold = false;
            _this._italic = false;
            _this._lineSpacing = 0; //行间距
            _this._multiline = false; //多行显示
            _this._stroke = 0;
            _this._strokeColor = 0x003350;
            _this._html = false;
            _this._autoSize = false; //根据文字自动调整Label的尺寸
            _this._link = null;
            return _this;
        }
        Label.prototype.initData = function () {
            _super.prototype.initData.call(this);
        };
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        Label.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            if (!this._autoSize)
                this.setSize(easy.Style.TEXTINPUT_WIDTH, easy.Style.TEXTINPUT_HEIGHT);
            this._textField = new egret.TextField();
            this._textField.addEventListener(egret.Event.CHANGE, this.onChangeHdl, this);
            this.addChild(this._textField);
            this.invalidate();
        };
        /**
         * Called when the text in the text field is manually changed.
         */
        Label.prototype.onChangeHdl = function (event) {
            this._text = this._textField.text;
        };
        Object.defineProperty(Label.prototype, "text", {
            /**
             * 文本内容
             */
            get: function () {
                return this._text;
            },
            set: function (value) {
                if (this._text != value) {
                    this._text = value;
                    if (this._html) {
                        if (this._text == null) {
                            this._text = "";
                            this._initFlow = [];
                        }
                        else {
                            if (this._htmlTextParser == null)
                                this._htmlTextParser = new egret.HtmlTextParser();
                            this._initFlow = this._htmlTextParser.parser(this._text);
                        }
                    }
                    else {
                        if (this._text == null) {
                            this._text = "";
                        }
                    }
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 文本内容显示对象
         */
        Label.prototype.getTextField = function () {
            return this._textField;
        };
        ///////////////////////////////////
        // public methods
        ///////////////////////////////////
        /**
         * Draws the visual ui of the component.
         */
        Label.prototype.draw = function () {
            _super.prototype.draw.call(this);
            if (this._textField == null)
                return;
            //console.log("@@label draw text=" + this._text);
            if (this._fontName != null) {
                this._textField.fontFamily = this.fontName;
            }
            if (this._color >= 0)
                this._textField.textColor = this._color;
            if (this._fontSize > 0)
                this._textField.size = this._fontSize;
            this._textField.bold = this._bold;
            this._textField.italic = this._italic;
            this._textField.multiline = this._multiline;
            this._textField.lineSpacing = this._lineSpacing;
            this._textField.stroke = this._stroke;
            this._textField.strokeColor = this._strokeColor;
            if (this._html) {
                if (this._initFlow)
                    this._textField.textFlow = this._initFlow;
                this._initFlow = null;
            }
            else {
                this._textField.text = this._text;
            }
            if (this._autoSize) {
                this.height = this._textField.measuredHeight;
                this.width = this._textField.measuredWidth;
            }
            else {
                this._textField.width = this.width;
                //this._textField.height = this.height;
                if (this._vAlign == egret.VerticalAlign.MIDDLE) {
                    this._textField.y = (this.height - this._textField.height) / 2;
                }
                else if (this._vAlign == egret.VerticalAlign.BOTTOM) {
                    this._textField.y = this.height - this._textField.height;
                }
                else {
                    this._textField.y = 0;
                }
            }
            this._textField.textAlign = this._hAlign;
            this._textField.verticalAlign = this._vAlign;
        };
        Object.defineProperty(Label.prototype, "italic", {
            get: function () {
                return this._italic;
            },
            /**
             * 设置文本是否斜体
             * @param value
             *
             */
            set: function (value) {
                if (this._italic != value) {
                    this._italic = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "bold", {
            get: function () {
                return this._bold;
            },
            /**
             * 设置文本是否粗体
             * @param value
             *
             */
            set: function (value) {
                if (this._bold != value) {
                    this._bold = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "fontName", {
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
        Object.defineProperty(Label.prototype, "fontSize", {
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
        Object.defineProperty(Label.prototype, "color", {
            get: function () {
                return this._color;
            },
            /**
             * 设置文本颜色
             * @param value
             *
             */
            set: function (value) {
                if (this._color != value) {
                    this._color = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "lineSpacing", {
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
        Object.defineProperty(Label.prototype, "multiline", {
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
        Object.defineProperty(Label.prototype, "stroke", {
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
        Object.defineProperty(Label.prototype, "strokeColor", {
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
        Object.defineProperty(Label.prototype, "autoSize", {
            /**
             * 是否自动计算文字的尺寸来设置label尺寸
             */
            get: function () {
                return this._autoSize;
            },
            set: function (value) {
                if (this._autoSize != value) {
                    this._autoSize = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "hAlign", {
            /**
     * 水平对齐设置
     * 默认egret.HorizontalAlign.LEFT;
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
        Object.defineProperty(Label.prototype, "vAlign", {
            /**
             * 竖直对齐设置
             * 默认egret.VerticalAlign.MIDDLE;
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
        Object.defineProperty(Label.prototype, "html", {
            get: function () {
                return this._html;
            },
            /**
             * html的文本
             * @param value
             */
            set: function (value) {
                if (this._html != value) {
                    this._html = value;
                    this.invalidate();
                }
            },
            enumerable: true,
            configurable: true
        });
        return Label;
    }(easy.Group));
    easy.Label = Label;
    __reflect(Label.prototype, "easy.Label");
})(easy || (easy = {}));
