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
    var rpg;
    (function (rpg) {
        /**
         * 存储角色运行时产生的内存数据
         * 角色本身自带的各种属性数据由data数据来承担
         */
        var GameData = (function () {
            function GameData() {
                this._control = null; //控制器
                this._data = null; //角色原始定义
                this._mapXY = null; //地图坐标
                this._speedXY = null; //地图坐标
                this._screenXY = null; //carmera屏幕可视区域坐标,这个坐标是沟通map和显示区域的桥梁
                this._height = 100; //图像高度
                this._width = 50; //图像宽度
                this._xOffset = 0; //x中心偏移
                this._yOffset = 0; //y中心偏移
                this._scaleX = 1; //X拉伸大小
                this._scaleY = 1; //y拉伸大小
                this._hp = 0; //血量
                this._atk = 0; //攻击力
                this._name = null; //名称
                this._id = 0; //角色id
                this.isInvalidate = false; //数据有变化
                this._direction = rpg.RpgSetting.DIRECTION_3; //当前方向
                this._directionMirror = false;
                this._directionNum = rpg.RpgSetting.DIRECT_2;
                this._speed = 20; //当前速度
                this._gameState = rpg.RpgSetting.ACTOR_STD; //这个状态是指战斗状态还是正常状态,决定了是否显示血量和方向指示器等
                //路径值
                this._path = []; //
                this._pathTargetPoint = null; //当前路径的目标点
                this.initData();
            }
            GameData.prototype.initData = function () {
                this._mapXY = new egret.Point();
                this._screenXY = new egret.Point();
                this._speedXY = new egret.Point();
            };
            Object.defineProperty(GameData.prototype, "actorData", {
                /**
                 * 原始角色数据
                 */
                get: function () {
                    return this._data;
                },
                /**
                 * 设置角色数据
                 * 子类可以覆写,设置更多的运行时数据
                 * @param def
                 */
                set: function (def) {
                    this._data = def;
                    //设置运行时数值
                    this.id = def.id; //角色id
                    this.name = def.name; //名称
                    this.hp = def.hp; //角色血量
                    this._speed = def.speed; //行走速度
                    //mov;//移动编号 (使用的时候会后缀自动加方向编号,格式:{编号}_{方向},例如:1000_1)
                    //std;//站立编号 (使用的时候会后缀自动加方向编号:{编号}_{方向}:2000_1)
                    //die;//死亡编号
                    //atk;//普通攻击的编号
                    //direciton:Array<number>;//方向
                    //skl:Array<string>;//技能标号组
                    //wing:number;//翅膀编号 (使用的时候会后缀自动加方向编号,格式::{编号}_{方向}, 例如:3000_1)
                    //mount:number;//坐骑编号 (使用的时候会后缀自动加方向编号,格式::{编号}_{方向}, 例如:4000_1)
                    //type;//数据类型
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "mapXY", {
                get: function () {
                    return this._mapXY;
                },
                set: function (value) {
                    this._mapXY = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 设置地图坐标
             * @param xValue
             * @param yValue
             */
            GameData.prototype.setMapXY = function (xValue, yValue) {
                this.mapXY.x = xValue;
                this.mapXY.y = yValue;
                this.isInvalidate = true;
            };
            /**
             * 增量变化地图坐标
             * @param xSetp
             * @param ySetp
             */
            GameData.prototype.moveMapStep = function (xSetp, ySetp) {
                this.mapXY.x += xSetp;
                this.mapXY.y += ySetp;
                this.isInvalidate = true;
            };
            /**
             * 清理数据
             */
            GameData.prototype.clean = function () {
            };
            /**
             * 销毁对象
             */
            GameData.prototype.destroy = function () {
            };
            Object.defineProperty(GameData.prototype, "height", {
                /**
                 * 图像高度
                 * @return
                 */
                get: function () {
                    return this._height - this._yOffset;
                },
                set: function (value) {
                    this._height = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "control", {
                get: function () {
                    return this._control;
                },
                /**
                 * 获得控制器
                 * @param value
                 */
                set: function (value) {
                    this._control = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "xOffset", {
                get: function () {
                    return this._xOffset;
                },
                /**
                 * 设置X方向偏移
                 * @param value
                 */
                set: function (value) {
                    this._xOffset = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "yOffset", {
                get: function () {
                    return this._yOffset;
                },
                /**
                 * 设置y方向偏移
                 * @param value
                 */
                set: function (value) {
                    this._yOffset = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "scaleX", {
                get: function () {
                    return this._scaleX;
                },
                /**
                 * 设置x缩放
                 * @param value
                 */
                set: function (value) {
                    this._scaleX = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "scaleY", {
                get: function () {
                    return this._scaleX;
                },
                /**
                 * 设置Y缩放
                 * @param value
                 */
                set: function (value) {
                    this._scaleY = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "id", {
                get: function () {
                    return this._id;
                },
                /**
                 * 设置id
                 * @param value
                 */
                set: function (value) {
                    this._id = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "hp", {
                get: function () {
                    return this._hp;
                },
                /**
                 * 设置hp
                 * @param value
                 */
                set: function (value) {
                    this._hp = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "atk", {
                get: function () {
                    return this._atk;
                },
                /**
                 * 设置atk
                 * @param value
                 */
                set: function (value) {
                    this._atk = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "name", {
                get: function () {
                    return this._name;
                },
                /**
                 * 设置name
                 * @param value
                 */
                set: function (value) {
                    this._name = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "gameState", {
                get: function () {
                    return this._gameState;
                },
                /**
                 * 这个状态是指战斗状态还是正常状态
                 * 决定了是否显示血量和方向指示器等
                 * fihgt:战斗状态会显示血量,不显示方向指示
                 * normal:正常态会显示方向指示,不显示血量
                 * all:血量和方向都显示
                 * none:血量和方向都不显示
                 * @param value
                 */
                set: function (value) {
                    this._gameState = value;
                    this.isInvalidate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "type", {
                /**
                 * 角色类型
                 * @returns {string}
                 */
                get: function () {
                    return this._data.type;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 对路径的下一个节点进行运算
             */
            GameData.prototype.pathNextPoint = function () {
                //console.log("pathNextPoint 00000");
                if (this._path.length > 0) {
                    //console.log("pathNextPoint 11111");
                    this._pathTargetPoint = this._path.shift();
                }
            };
            return GameData;
        }());
        rpg.GameData = GameData;
        __reflect(GameData.prototype, "easy.rpg.GameData");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
