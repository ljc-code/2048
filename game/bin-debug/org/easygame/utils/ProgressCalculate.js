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
    var ProgressCalculate = (function () {
        function ProgressCalculate(totalTime, heartBeat, arrayNode) {
            if (totalTime === void 0) { totalTime = 5; }
            if (heartBeat === void 0) { heartBeat = 2; }
            if (arrayNode === void 0) { arrayNode = [45, 75, 90, 95]; }
            this._totalTime = 10;
            this._heartBeat = 1;
            this._phaseCount = 4;
            this._arrayLimitNode = [50, 65, 80, 95]; //递减节点
            this._arrayLimitTime = [];
            this._frameNumber = easy.GlobalSetting.FRAME_RATE;
            this._increment = 0; //每次的增量
            this._decreaseFactor = 1.5; //递减因子
            this._firstRefresh = false; //第一次刷新数据
            this._arrayIndex = 0;
            this._timeCount = 0;
            this._totalCurrentLoad = 0;
            this._currentLoad = 0; //当前的load值
            this._unitTime = 0; //单位时间
            this._progressSpeedUp = false; //开启加速
            this._speedDataRefresh = false; //已开启加速
            this._openSpeedDown = false; //开启第二阶段减速
            this._totalTime = totalTime;
            this._heartBeat = heartBeat;
            this._arrayLimitNode = arrayNode;
            this._phaseCount = arrayNode.length;
            this.reset();
        }
        ProgressCalculate.prototype.progress = function () {
            if (this._progressSpeedUp && !this._speedDataRefresh) {
                this.speedUp();
                this._speedDataRefresh = true;
            }
            this._timeCount++;
            if (this._timeCount > this._arrayLimitTime[this._arrayIndex]) {
                this._arrayIndex++;
                this._timeCount = 0;
            }
            if (this._arrayIndex >= this._arrayLimitTime.length) {
                if (this._progressSpeedUp) {
                    return 100;
                }
                else {
                    return 99;
                }
            }
            if (this._arrayIndex > 0) {
                this._increment = (this._arrayLimitNode[this._arrayIndex] - this._arrayLimitNode[this._arrayIndex - 1]) * (Math.sin(Math.PI / 2 * (this._timeCount / this._arrayLimitTime[this._arrayIndex])) -
                    Math.sin(Math.PI / 2 * ((this._timeCount - 1) / this._arrayLimitTime[this._arrayIndex])));
            }
            else {
                this._increment = this._arrayLimitNode[this._arrayIndex] * (Math.sin(Math.PI / 2 * (this._timeCount / this._arrayLimitTime[this._arrayIndex])) -
                    Math.sin(Math.PI / 2 * ((this._timeCount - 1) / this._arrayLimitTime[this._arrayIndex])));
            }
            this._totalCurrentLoad += this._increment;
            this._currentLoad = Math.floor(this._totalCurrentLoad);
            //console.log("current=" + this._currentLoad);
            if (this._currentLoad >= 95 && !this._openSpeedDown && !this._progressSpeedUp) {
                this.speedDown();
                this._openSpeedDown = true;
            }
            if (this._currentLoad >= 100) {
                this._currentLoad = 100;
            }
            return this._currentLoad;
        };
        ProgressCalculate.prototype.speedUp = function () {
            //Debug.log = "progressCaculte.speedUp()";
            this._timeCount = 0;
            this._arrayIndex = this._arrayLimitNode.length - 1;
            this._arrayLimitNode[this._arrayIndex - 1] = this._currentLoad;
            if (!this._openSpeedDown) {
                this._arrayLimitTime[this._arrayIndex] = 2; //easy.GlobalSetting.FRAME_RATE / this._heartBeat;
            }
            else {
                this._arrayLimitTime[this._arrayIndex] = 2; //this._heartBeat;
            }
        };
        ProgressCalculate.prototype.speedDown = function () {
            //Debug.log = "progressCaculte.speedDown()";
            this._timeCount = 0;
            this._arrayIndex = this._arrayLimitNode.length - 1;
            this._arrayLimitNode[this._arrayIndex - 1] = this._currentLoad;
            this._arrayLimitNode[this._arrayIndex] = 99;
            this._arrayLimitTime[this._arrayIndex] = 8 * easy.GlobalSetting.FRAME_RATE / this._heartBeat;
        };
        ProgressCalculate.prototype.reset = function () {
            //Debug.log = "progressCaculte.reset";
            this._progressSpeedUp = false;
            this._openSpeedDown = false;
            this._speedDataRefresh = false;
            this._firstRefresh = true;
            this._timeCount = 0;
            this._totalCurrentLoad = 0;
            this._currentLoad = 0;
            this._increment = 0;
            this._unitTime = 0;
            this._arrayIndex = 0;
            var decrease = 0;
            var totalTime = 0;
            this._arrayLimitTime = [];
            for (var i = 0; i < this._phaseCount; i++) {
                decrease += Math.pow(this._decreaseFactor, i);
            }
            this._unitTime = Math.floor(this._totalTime * this._frameNumber / decrease / this._heartBeat);
            for (var j = 1; j < this._phaseCount; j++) {
                var stageTime = this._unitTime * j;
                totalTime += stageTime;
                this._arrayLimitTime.push(stageTime);
            }
            var remainingTime = (this._totalTime * this._frameNumber - totalTime) / this._heartBeat;
            this._arrayLimitTime.push(remainingTime);
        };
        return ProgressCalculate;
    }());
    easy.ProgressCalculate = ProgressCalculate;
    __reflect(ProgressCalculate.prototype, "easy.ProgressCalculate");
})(easy || (easy = {}));
