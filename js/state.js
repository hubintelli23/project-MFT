/* MFT 블루잉크 : 천년청묵 · js/state.js · v0.9
   게임 상태 · 플레이어 초기값 */
'use strict';
/* ================= 상태 ================= */
let stats,flags,state,P,boss=null;
const enemies=[],strikes=[],projs=[],puddles=[],clones=[],runes=[],waves=[],zones=[],timers=[];
let hitstop=0,shakeA=0,camX=0,camZ=6;
function newPlayer(){return{x:0,z:6,ang:PI,char:'yeonwoo',hp:CHARACTERS.yeonwoo.hp,maxHp:CHARACTERS.yeonwoo.hp,shield:CONFIG.player.startShield,maxShield:CONFIG.player.maxShield,mode:'brush',baek:0,stage:0,sw:0,ult:0,act:null,lastIdx:-1,comboT:0,
  y:0,vy:0,airAtks:0,iframe:0,invuln:0,stagger:0,dodgeCd:0,cds:{b1:0,b2:0,s1:0,s2:0,sw:0,dash:0,h1:0,h2:0,m1:0,m2:0,swap:0},maeCd:0,fieldCd:0,maeBuff:0,nokgi:0,nokgiT:0,clarity:CONFIG.resource.clarityStart,yr:CONFIG.resource.yrStart,hwag:false,hwagForced:false,guarding:false,parryT:0,parryCd:0,guardBroken:0,parrySeal:0,swayT:0,swayCtr:0,swayBoost:0,drainImmune:0,link:null,burnT:0,critBuff:0,rangeBuff:0,taintImmune:0,hwagT:0,drainPause:0,yeonhaCd:0,
  queue:null,queueT:0,moving:false,dead:false};}
function later(t,fn){timers.push({t,fn});}
