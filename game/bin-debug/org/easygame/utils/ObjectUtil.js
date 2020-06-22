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
    var ObjectUtil = (function () {
        function ObjectUtil() {
        }
        /**
         * 拷贝src的属性值->target的属性中
         * @param src 属性值来源
         * @param target 即将被赋值的对象
         */
        ObjectUtil.copyValueToTarget = function (src, target) {
            console.log("src=" + egret.getQualifiedClassName(src) + ", target=" + egret.getQualifiedClassName(target));
            if (src && target) {
                for (var key in src) {
                    //console.log("000key=" + key + ", value=" + src[key]);
                    if (target.hasOwnProperty(key)) {
                        target[key] = src[key];
                        console.log("1111key=" + key + ", value=" + src[key]);
                    }
                }
            }
        };
        ObjectUtil.functionExist = function (thisArg, functionName) {
            if (thisArg && typeof (thisArg[functionName]) == "function") {
                return true;
            }
            return false;
        };
        return ObjectUtil;
    }());
    easy.ObjectUtil = ObjectUtil;
    __reflect(ObjectUtil.prototype, "easy.ObjectUtil");
})(easy || (easy = {}));
