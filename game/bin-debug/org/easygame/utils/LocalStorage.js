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
    var LocalStorage = (function () {
        function LocalStorage() {
        }
        /**
         * 保存数据
         * @param key 数据的标示
         * @param value 要存储的数据
         */
        LocalStorage.set = function (key, value) {
            return egret.localStorage.setItem(LocalStorage.getStorageName() + key, value);
        };
        /**
         * 保存number数据
         * @param key 数据的标示
         * @param value 要存储的数据
         */
        LocalStorage.setNumber = function (key, value) {
            LocalStorage.set(key, "" + value);
        };
        /**
         * 保存boolean数据
         * @param key 数据的标示
         * @param value 要存储的数据
         */
        LocalStorage.setBoolean = function (key, value) {
            LocalStorage.set(key, value ? "1" : "0");
        };
        /**
         * 获取条数据
         * @param key 数据的标示
         */
        LocalStorage.get = function (key) {
            return egret.localStorage.getItem(LocalStorage.getStorageName() + key);
        };
        /**
         * 获取number数据
         * @param key 数据的标示
         */
        LocalStorage.getNumber = function (key) {
            var value = egret.localStorage.getItem(LocalStorage.getStorageName() + key);
            if (easy.StringUtil.isUsage(value)) {
                var num = parseFloat(value);
                if (!isNaN(num)) {
                    return num;
                }
            }
            return 0;
        };
        /**
         * 获取int数据
         * @param key 数据的标示
         */
        LocalStorage.getInt = function (key) {
            var value = egret.localStorage.getItem(LocalStorage.getStorageName() + key);
            if (easy.StringUtil.isUsage(value)) {
                var num = parseInt(value);
                if (!isNaN(num)) {
                    return num;
                }
            }
            return 0;
        };
        /**
         * 获取boolean数据
         * @param key 数据的标示
         */
        LocalStorage.getBoolean = function (key) {
            var value = egret.localStorage.getItem(LocalStorage.getStorageName() + key);
            if (easy.StringUtil.isUsage(value) && (value == "1" || value == "true")) {
                return true;
            }
            return false;
        };
        /**
         * 删除一条数据
         * @param moduleName 模块的名称
         * @param key 数据的标示
         */
        LocalStorage.remvoe = function (key) {
            egret.localStorage.removeItem(LocalStorage.getStorageName() + key);
        };
        /**
         * 获取存储名称
         * @returns {string}
         */
        LocalStorage.getStorageName = function () {
            if (LocalStorage._storageName == "") {
                LocalStorage._storageName = (easy.ResManager._projectName != "" ? easy.ResManager._projectName : easy.GlobalSetting.APP_NAME) + "_";
            }
            return LocalStorage._storageName;
        };
        return LocalStorage;
    }());
    LocalStorage._storageName = "";
    easy.LocalStorage = LocalStorage;
    __reflect(LocalStorage.prototype, "easy.LocalStorage");
})(easy || (easy = {}));
