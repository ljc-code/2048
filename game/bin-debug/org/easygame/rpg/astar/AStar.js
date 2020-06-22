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
        var AStar = (function () {
            function AStar() {
                this._straightCost = 1.0;
                this._diagCost = Math.SQRT2;
                this.nowversion = 1;
                this.TwoOneTwoZero = 2 * Math.cos(Math.PI / 3);
                this.heuristic = this.euclidian2;
            }
            Object.defineProperty(AStar.prototype, "grid", {
                get: function () {
                    return this._grid;
                },
                enumerable: true,
                configurable: true
            });
            AStar.prototype.justMin = function (x, y) {
                return x.f < y.f;
            };
            AStar.prototype.findPath = function (grid) {
                this._grid = grid;
                this._endNode = this._grid.endNode;
                this.nowversion++;
                this._startNode = this._grid.startNode;
                //_open = [];
                this._open = new rpg.BinaryHeap(this.justMin);
                this._startNode.g = 0;
                return this.search();
            };
            AStar.prototype.search = function () {
                var node = this._startNode;
                node.version = this.nowversion;
                while (node != this._endNode) {
                    var len = node.links.length;
                    for (var i = 0; i < len; i++) {
                        var test = node.links[i].node;
                        var cost = node.links[i].cost;
                        var g = node.g + cost;
                        var h = this.heuristic(test);
                        var f = g + h;
                        if (test.version == this.nowversion) {
                            if (test.f > f) {
                                test.f = f;
                                test.g = g;
                                test.h = h;
                                test.parent = node;
                            }
                        }
                        else {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;
                            this._open.ins(test);
                            test.version = this.nowversion;
                        }
                    }
                    if (this._open.a.length == 1) {
                        return false;
                    }
                    node = (this._open.pop());
                }
                this.buildPath();
                return true;
            };
            AStar.prototype.buildPath = function () {
                this.path = new Array();
                var node = this._endNode;
                this.path.push(node);
                while (node != this._startNode) {
                    node = node.parent;
                    this.path.unshift(node);
                }
            };
            AStar.prototype.manhattan = function (node) {
                return Math.abs(node.row - this._endNode.row) + Math.abs(node.column - this._endNode.column);
            };
            AStar.prototype.manhattan2 = function (node) {
                var dx = Math.abs(node.row - this._endNode.row);
                var dy = Math.abs(node.column - this._endNode.column);
                return dx + dy + Math.abs(dx - dy) / 1000;
            };
            AStar.prototype.euclidian = function (node) {
                var dx = node.row - this._endNode.row;
                var dy = node.column - this._endNode.column;
                return Math.sqrt(dx * dx + dy * dy);
            };
            AStar.prototype.chineseCheckersEuclidian2 = function (node) {
                var y = node.column / this.TwoOneTwoZero;
                var x = node.row + node.column / 2;
                var dx = x - this._endNode.row - this._endNode.column / 2;
                var dy = y - this._endNode.column / this.TwoOneTwoZero;
                return this.sqrt(dx * dx + dy * dy);
            };
            AStar.prototype.sqrt = function (x) {
                return Math.sqrt(x);
            };
            AStar.prototype.euclidian2 = function (node) {
                var dx = node.row - this._endNode.row;
                var dy = node.column - this._endNode.column;
                return dx * dx + dy * dy;
            };
            AStar.prototype.diagonal = function (node) {
                var dx = Math.abs(node.row - this._endNode.row);
                var dy = Math.abs(node.column - this._endNode.column);
                var diag = Math.min(dx, dy);
                var straight = dx + dy;
                return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
            };
            return AStar;
        }());
        rpg.AStar = AStar;
        __reflect(AStar.prototype, "easy.rpg.AStar");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
