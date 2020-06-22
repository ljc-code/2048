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
    var HexUtil = (function () {
        function HexUtil() {
        }
        HexUtil.dump = function (bytes) {
            var pos = bytes.position;
            var s = "";
            var a = "";
            bytes.position = 0;
            for (var i = 0; i < bytes.length; i++) {
                if (i % 16 == 0)
                    s += ("0000" + i.toString(16)).substr(-4, 4) + " ";
                if (i % 8 == 0)
                    s += " ";
                var v = bytes.readByte();
                s += ("0" + v.toString(16)).substr(-2, 2) + " ";
                a += (v < 32 || v > 126) ? "." : String.fromCharCode(v);
                if ((((i + 1) % 16) == 0) || (i == (bytes.length - 1))) {
                    s += " |" + a + "|\r\n";
                    a = "";
                }
            }
            bytes.position = pos;
            return s;
        };
        return HexUtil;
    }());
    easy.HexUtil = HexUtil;
    __reflect(HexUtil.prototype, "easy.HexUtil");
})(easy || (easy = {}));
