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
     * 抛物线计算公式
     */
    var ParabolaUtil = (function () {
        function ParabolaUtil() {
            this.startPt = null;
            this.endPt = null;
            this.vertexPt = null;
            this.a = 0;
            this.b = 0;
            this.c = 0;
        }
        ParabolaUtil.prototype.getInstance = function () {
            if (ParabolaUtil._instance == null)
                ParabolaUtil._instance = new easy.ParabolaUtil();
            return ParabolaUtil._instance;
        };
        /**
         * 给定两个点和定点高
         * @param start 开始点
         * @param end   结束点
         * @param waveHeight 定点高
         */
        ParabolaUtil.prototype.init = function (start, end, waveHeight) {
            if (waveHeight === void 0) { waveHeight = 240; }
            this.startPt = start;
            this.endPt = end;
            this.vertexPt = new egret.Point(this.startPt.x + (this.endPt.x - this.startPt.x) / 2, this.endPt.y - waveHeight);
            var x1 = this.startPt.x;
            var x2 = this.endPt.x;
            var x3 = this.vertexPt.x;
            var y1 = this.startPt.y;
            var y2 = this.endPt.y;
            var y3 = this.vertexPt.y;
            this.b = ((y1 - y3) * (x1 * x1 - x2 * x2) - (y1 - y2) * (x1 * x1 - x3 * x3)) / ((x1 - x3) * (x1 * x1 - x2 * x2) - (x1 - x2) * (x1 * x1 - x3 * x3));
            this.a = ((y1 - y2) - this.b * (x1 - x2)) / (x1 * x1 - x2 * x2);
            this.c = y1 - this.a * x1 * x1 - this.b * x1;
        };
        /**
         * 抛物线运动(必须要先初始化abc参数)
         * 给x轴值,得到Y轴值
         */
        ParabolaUtil.prototype.getY = function (posX) {
            return this.a * posX * posX + this.b * posX + this.c;
        };
        return ParabolaUtil;
    }());
    ParabolaUtil._instance = null;
    easy.ParabolaUtil = ParabolaUtil;
    __reflect(ParabolaUtil.prototype, "easy.ParabolaUtil");
})(easy || (easy = {}));
