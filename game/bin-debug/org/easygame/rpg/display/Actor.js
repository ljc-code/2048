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
    var rpg;
    (function (rpg) {
        var Actor = (function (_super) {
            __extends(Actor, _super);
            /**
             * 构造角色
             * @param data 角色的原始数据,这个必须是要设置的,否者没法显示
             * @param control 角色的控制器,不给的话,就用默认的内置控制器
             */
            function Actor(data, control) {
                var _this = _super.call(this) || this;
                _this.hitRect = null; //战斗攻击碰撞使用的矩形
                _this.backGroup = null; //后置效果容器
                _this.frontGroup = null; //前置效果容器
                _this._bitmapActor = null; //角色的显示
                _this._ctrl = null;
                _this._dotShape = null;
                _this._hitShape = null;
                _this._ctrl = control;
                if (_this._ctrl == null) {
                    _this._ctrl = new easy.rpg.ActorCtrl(_this, data);
                }
                return _this;
            }
            /**
             * 初始化主场景的组件
             * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
             * 子类覆写该方法,添加UI逻辑
             */
            Actor.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.hitRect = new egret.Rectangle();
                this.backGroup = new easy.BaseGroup();
                this.frontGroup = new easy.BaseGroup();
                this._bitmapActor = new egret.Bitmap();
                //this._bitmapActor.anchorX = 0.5;
                //this._bitmapActor.anchorY = 0.5;
                //this.addChild(this.backGroup);
                this.addChild(this._bitmapActor);
                //this.addChild(this.frontGroup);
                this.anchorX = 0.5;
                this.anchorY = 1;
                //this.touchEnabled = true;
                this._hitShape = new egret.Shape();
                this._dotShape = new egret.Shape();
                //this.addChild(this._hitShape);
                //this.addChild(this._dotShape);
                this.showBg = false;
                this.hitRect.width = 20;
                this.hitRect.height = 80;
                this.setSize(100, 100);
            };
            Actor.prototype.draw = function () {
                _super.prototype.draw.call(this);
                var regPoint = this.getRegPoint();
                this.hitRect.x = regPoint.x - this.hitRect.width / 2;
                this.hitRect.y = regPoint.y - this.hitRect.height;
                this._hitShape.graphics.clear();
                this._hitShape.graphics.beginFill(0xfff666);
                this._hitShape.graphics.drawRect(this.hitRect.x, this.hitRect.y, this.hitRect.width, this.hitRect.height);
                this._hitShape.graphics.endFill();
                this._hitShape.graphics.lineStyle(1, 0x444333);
                this._hitShape.graphics.drawRect(this.hitRect.x, this.hitRect.y, this.hitRect.width, this.hitRect.height);
                this._dotShape.x = this.globalToLocal(this.getGlobalXY().x, this.getGlobalXY().y).x;
                this._dotShape.y = this.globalToLocal(this.getGlobalXY().x, this.getGlobalXY().y).y;
                this._dotShape.graphics.clear();
                this._dotShape.graphics.beginFill(0xff0000);
                this._dotShape.graphics.drawRect(0, 0, 4, 4);
                this._dotShape.graphics.endFill();
                this._dotShape.x = regPoint.x - 2;
                this._dotShape.y = regPoint.y - 2;
            };
            Actor.prototype.getBounds = function () {
                return this.hitRect;
            };
            return Actor;
        }(easy.Group));
        rpg.Actor = Actor;
        __reflect(Actor.prototype, "easy.rpg.Actor");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
