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
    var MathUtil = (function () {
        function MathUtil() {
        }
        /**
         * 取连直线的相交点
         * @param targetPoint0
         * @param angle0
         * @param targetPoint1
         * @param angle1
         * @returns {*}
         */
        MathUtil.getCrossPoint = function (targetPoint0, angle0, targetPoint1, angle1) {
            var k0 = 0;
            var k1 = 0;
            var xValue = 0;
            var yValue = 0;
            var isExtra0 = angle0 % 180 == 0 ? 1 : angle0 % 90 == 0 ? -1 : 0;
            var isExtra1 = angle1 % 180 == 0 ? 1 : angle1 % 90 == 0 ? -1 : 0;
            (isExtra0 == 0) && (k0 = Math.tan(angle0 * Math.PI / 180));
            (isExtra1 == 0) && (k1 = Math.tan(angle1 * Math.PI / 180));
            var tmp_add = Math.abs(angle0) + Math.abs(angle1);
            if ((tmp_add == 180 && angle0 * angle1 < 0) || Math.floor(angle0) == Math.floor(angle1)) {
                return null;
            }
            if ((isExtra0 == 0) && (isExtra1 == 0)) {
                xValue = ((k0 * targetPoint0.x - targetPoint0.y) - (k1 * targetPoint1.x - targetPoint1.y)) / (k0 - k1);
                yValue = ((k0 * targetPoint1.y - targetPoint1.x * k0 * k1) - (k1 * targetPoint0.y - targetPoint0.x * k0 * k1)) / (k0 - k1);
            }
            else if ((isExtra0 == 0) && (isExtra1 == 1)) {
                yValue = targetPoint1.y;
                xValue = (yValue - targetPoint0.y) / k0 + targetPoint0.x;
            }
            else if ((isExtra0 == 0) && (isExtra1 == -1)) {
                xValue = targetPoint1.x;
                yValue = (xValue - targetPoint0.x) * k0 + targetPoint0.y;
            }
            else if ((isExtra0 == 1) && (isExtra1 == 0)) {
                yValue = targetPoint0.y;
                xValue = (yValue - targetPoint1.y) / k1 + targetPoint1.x;
            }
            else if ((isExtra0 == 1) && (isExtra1 == -1)) {
                yValue = targetPoint0.y;
                xValue = targetPoint1.x;
            }
            else if ((isExtra0 == -1) && (isExtra1 == 0)) {
                xValue = targetPoint0.x;
                yValue = (xValue - targetPoint1.x) * k1 + targetPoint1.y;
            }
            else if ((isExtra0 == -1) && (isExtra1 == 1)) {
                xValue = targetPoint0.x;
                yValue = targetPoint1.y;
            }
            else {
                return null;
            }
            //trace($angle0, $angle1);
            return new egret.Point((xValue * 100) / 1000, (yValue * 1000) / 1000);
        };
        /**
         * 直线的角度
         * @param point0
         * @param point1
         * @returns {number}
         */
        MathUtil.getAngle = function (point0, point1) {
            var tmp_x = point1.x - point0.x;
            var tmp_y = point1.y - point0.y;
            var tmp_angle = Math.atan2(tmp_y, tmp_x) * 180 / Math.PI;
            return tmp_angle;
        };
        MathUtil.getPos = function (point0, point1) {
            var tmp_x = point0.x - point1.x;
            var tmp_y = point0.y - point1.y;
            var tmp_s = Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
            return tmp_s;
        };
        /**
         * 直线公式，已知指定的两个点，确定一条直线
         * y = k * x + b，此函数即返回k = point.x和b = point.y
         * @param p1 一个点对象
         * @param p2 另外一个点对象
         * @return (Point) 返回直线公式的两个参数，组合成一个Point对象存储
         * */
        MathUtil.lineFunc = function (p1, p2) {
            if (p1.x != p2.x) {
                var k = (p1.y - p2.y) / (p1.x - p2.x);
                var b = p1.y - (p1.y - p2.y) / (p1.x - p2.x) * p1.x;
                return new egret.Point(k, b);
            }
            else {
                return null;
            }
        };
        /**
         * 产生一个 a 到 b 之间的随机数（默认是 a 不包括 b的整数）：
         * @param a
         * @param b
         * @param isInt 是否是整数
         */
        MathUtil.random = function (a, b, isInt) {
            if (isInt === void 0) { isInt = true; }
            if (isInt) {
                return Math.floor(a + (b - a) * Math.random());
            }
            else {
                return a + (b - a) * Math.random();
            }
        };
        return MathUtil;
    }());
    easy.MathUtil = MathUtil;
    __reflect(MathUtil.prototype, "easy.MathUtil");
})(easy || (easy = {}));
