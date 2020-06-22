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
        var RpgSetting = (function () {
            function RpgSetting() {
            }
            return RpgSetting;
        }());
        RpgSetting.SHOW_OTHER_PLAYER = true; //显示其他玩家
        RpgSetting.ACTOR_TYPE_NPC = "npc";
        RpgSetting.ACTOR_TYPE_PLAYER = "player";
        RpgSetting.ACTOR_TYPE_BUILDING = "building";
        //public static ACTOR_TYPE_:string = "";
        RpgSetting.PLAYER_ID = 0; //ME ID
        RpgSetting.ACTOR_STD = "std"; //人物站立
        RpgSetting.ACTOR_MOV = "mov"; //人物行走
        RpgSetting.ACTOR_DIE = "die"; //人物死亡
        RpgSetting.ACTOR_ATK = "atk"; //人物攻击
        RpgSetting.ACTOR_BAK = "bak"; //人物被攻击
        RpgSetting.ACTOR_SKL = "skl"; //人物释放技能
        /**
         * 方向定义, valve,保持和动作序列的下标一致
         *          n
         *      wn     ne
         *    w           e
         *      sw     es
         *          s
         *
         *        [1]
         *     [2]    [8]
         *   [3]        [7]
         *     [4]    [6]
         *        [5]
         */
        RpgSetting.DIRECTION_8 = 8;
        RpgSetting.DIRECTION_7 = 7;
        RpgSetting.DIRECTION_6 = 6;
        RpgSetting.DIRECTION_5 = 5;
        RpgSetting.DIRECTION_4 = 4;
        RpgSetting.DIRECTION_3 = 3;
        RpgSetting.DIRECTION_2 = 2;
        RpgSetting.DIRECTION_1 = 1;
        RpgSetting.DIRECTION_0 = 0; //无此方向
        RpgSetting.DIRECT_NUMBER = RpgSetting.DIRECT_2; //角色状态的方向材质数量定义
        RpgSetting.DIRECT_2 = 2; //2方向,提供3的材质
        RpgSetting.DIRECT_4 = 4; //4方向,提供2,4的材质
        RpgSetting.DIRECT_6 = 6; //6,提供2,3,4的材质
        RpgSetting.DIRECT_8 = 8; //8方向1,2,3,4,5的材质
        RpgSetting.BUFF_CENTER_FRONT = "centre_F"; //中前
        RpgSetting.BUFF_CENTER_BACK = "centre_B"; //中后
        RpgSetting.BUFF_ABOVE = "above"; //上
        RpgSetting.BUFF_BELOW_BACK = "below_B"; //下后
        RpgSetting.BUFF_BELOW_FRONT = "below_F"; //下前
        RpgSetting.EFFECT_MISSILE = "missile"; //飞行
        //战斗命令类型
        /**
         * 移动命令
         */
        RpgSetting.FIGHT_ACTION_MOV = 0;
        /**
         * 攻击命令
         */
        RpgSetting.FIGHT_ACTION_SKILL = 1;
        /**
         * 血量变化命令
         */
        RpgSetting.FIGHT_ACTION_CHANGE_HP = 2;
        /**
         * 死亡命令
         */
        RpgSetting.FIGHT_ACTION_DIE = 3;
        /**
         * 战斗结果命令
         */
        RpgSetting.FIGHT_ACTION_TYPE_RESULT = 4;
        /**
         * 傀儡能量值刷新.
         */
        RpgSetting.FIGHT_ACTION_TYPE_ENEYGY = 5;
        /**
         * 战斗角色获得buff通知.
         */
        RpgSetting.FIGHT_ACTION_TYPE_BUFF = 6;
        //战斗伤害类型
        /**
         * 攻击伤害，普通
         */
        RpgSetting.FIGHT_DAMEGE_COMMON = 0;
        /**
         * 攻击伤害，闪避
         */
        RpgSetting.FIGHT_DAMEGE_DODGE = 1;
        /**
         * 攻击伤害，暴击
         */
        RpgSetting.FIGHT_DAMEGE_CRIT = 2;
        /**
         * 攻击伤害，效果
         */
        RpgSetting.FIGHT_DAMEGE_EFFECT = 3;
        /**
         * 攻击伤害，抵抗
         */
        RpgSetting.FIGHT_DAMEGE_RESISTANCE = 4;
        /**
         * 移动同步总帧时
         */
        RpgSetting.MOVE_SYNC_FRAME_COUNT = 5;
        //任务  任务内容类型 1:杀怪  2：对话
        RpgSetting.TASK_TYPE_DIALOGUE = 2;
        RpgSetting.TASK_TYPE_KILL = 1;
        /**
         * 技能类型:通用
         */
        RpgSetting.BATTLE_SKILL_TYPE_COM = 0;
        /**
         * 技能类型:受击
         */
        RpgSetting.BATTLE_SKILL_TYPE_BAK = 1;
        /** 角色的身处场景的状态要求 */
        RpgSetting.GAME_STATE_FIGHT = "fight"; //战斗状态
        RpgSetting.GAME_STATE_NORMAL = "normal"; //正常态
        RpgSetting.GAME_STATE_ALL = "all"; //全显示
        RpgSetting.GAME_STATE_NONE = "none"; //全都不显示
        rpg.RpgSetting = RpgSetting;
        __reflect(RpgSetting.prototype, "easy.rpg.RpgSetting");
    })(rpg = easy.rpg || (easy.rpg = {}));
})(easy || (easy = {}));
