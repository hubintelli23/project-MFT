/* MFT 블루잉크 : 천년청묵 · js/bosses/zayeong.js · v1.0
   보스: 자영 — 운자 가주 · 환영과 거울의 무희 (자운곡)
   체험 요소: 거울 환영무(분신 4 — 붓으로 걷어내면 안전, 검 등으로 베면 역환산 폭발), 시차 환영 찌르기(가드 불가 → 스웨이),
             2페이즈 위상 역전(이동 방향 반대), 주작의 거울 룬(붓 공격으로만 파괴 · 침식도 강제 상승 · 거울 그림자 연우)
   수치는 data/enemies.js의 BOSSES.zayeong */
'use strict';
const ZYD=()=>BOSSES.zayeong;
BOSS_INIT.zayeong=function(b){b.illT=2.5;b.invT=ZYD().invertInterval;b.mirrorT=0;b.erodeT=4;b.barrierName='주작의 거울';
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('자영 — 환영 분신은 붓으로 걷어내세요. 검 · 동료 공격으로 베면 환영이 폭발합니다(역환산)',5);});};
const isBrushHit=()=>P.char==='yeonwoo'&&P.mode==='brush';
function zyIllusion(x,z){const D=ZYD();return spawnMinion(x,z,{hp:30,avatar:'illusion',col:0xb070ff,atkCol:0xb070ff,dmg:D.damage.shadow,speed:3.4,stagger:12,
  onHitE:(e)=>{if(isBrushHit()){e.silent=true;popNum(e.x,2.6,e.z,'먹물 — 환영 걷힘','info');burst(e.x,1.4,e.z,0x141414,14,5,0.4);killE(e,true);return false;}
    e.silent=true;popNum(e.x,2.8,e.z,'환영 폭파 — 역환산!','hurt');
    strike({owner:null,kind:'circle',x:e.x,z:e.z,r:2.4,tell:0.4,dmg:D.backlash,color:0xb070ff,onFire:o=>{ringFx(o.x,o.z,0.5,2.6,0xb070ff,0.5);burst(o.x,1,o.z,0xb070ff,16,6,0.4);}});
    killE(e,true);return false;}});}
function zyMirrorDance(b){const D=ZYD();b.illT=D.illusionInterval;showCut('거울 환영무');
  bAct(b,'dance',1.4,[[0.5,()=>{for(const[x,z]of ringPts(D.illusionCount,5,rand(0,TAU))){zyIllusion(clamp(P.x+x,-13,13),clamp(P.z+z,-13,13));}
    const a=rand(0,TAU);b.x=clamp(P.x+Math.cos(a)*6,-13,13);b.z=clamp(P.z+Math.sin(a)*6,-13,13);burst(b.x,1.4,b.z,0xb070ff,20,6,0.4);}]]);bossCall('거울 환영무 — 분신 '+D.illusionCount);}
function zyFan(b){const n=b.p2?2:1,ev=[];for(let i=0;i<n;i++)ev.push([i*0.7,()=>{faceP(b);strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:3.8,half:62*DEG,tell:0.5,dmg:ZYD().damage.fan,color:0x9a6ad0,
  onFire:o=>{arcTrail(o.x,o.z,o.ang,3.8,o.half,0xc8a0ff,1.2,0.8);burst(o.x+Math.sin(o.ang)*1.8,1,o.z+Math.cos(o.ang)*1.8,0xb070ff,8,5,0.35);}});}]);
  bAct(b,'fan',0.9+0.7*n,ev);bossCall('봉황천우 — 부채 베기');}
function zyFlame(b){bAct(b,'flame',1.6,[[0,()=>{for(let i=0;i<3;i++){const x=P.x+(i?rand(-2.5,2.5):0),z=P.z+(i?rand(-2.5,2.5):0);
  strike({owner:b,kind:'circle',x,z,r:1.7,tell:0.85+i*0.12,dmg:ZYD().damage.flame,color:0x9a5ad0,onHitP:()=>{if(P.char==='yeonwoo')P.baek=Math.min(100,P.baek+4);},
    onFire:o=>{burst(o.x,0.8,o.z,0xb070ff,14,6,0.45);ringFx(o.x,o.z,0.4,1.9,0xb070ff,0.4);}});}}]]);bossCall('보랏빛 불꽃 — 넋 흔들기');}
function zyBlink(b){bAct(b,'blink',1.3,[[0,()=>{burst(b.x,1.4,b.z,0xb070ff,16,6,0.4);const a=P.ang+PI+rand(-0.5,0.5);b.x=clamp(P.x+Math.sin(a)*2.2,-13,13);b.z=clamp(P.z+Math.cos(a)*2.2,-13,13);faceP(b);burst(b.x,1.4,b.z,0xb070ff,16,6,0.4);
  strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:3.2,half:40*DEG,tell:0.5,dmg:ZYD().damage.blink,type:'break',onFire:o=>{lineFx(o.x,o.z,o.ang,3.2,0.6,0xc8a0ff,0.4,0.4);}});}]]);bossCall('시차 환영 찌르기 — 가드 불가');}
function zyPhase2(b){b.p2=true;b.invulnT=1.4;cancelStrikes(b);showCut('자수정 환각 진형');b.invT=2;
  bAct(b,'p2',1.6,[[0.7,()=>{ringFx(b.x,b.z,1,10,0xb070ff,0.7,0.2,0.9);burst(b.x,2,b.z,0xc8a0ff,26,8,0.5);}]]);banner('2페이즈 — 위상 역전: 보라 안개가 퍼지면 이동 방향이 반대가 됩니다',3.5);}
function zyInvert(b){const D=ZYD();b.invT=D.invertInterval;state.invertT=D.invertTime;showCut('위상 역전');ringFx(P.x,P.z,0.5,6,0xb070ff,0.6);
  banner('위상 역전 '+D.invertTime+'초 — 이동 방향이 반대!',2.5,'big');}
function zyRunePhase(b){const D=ZYD();b.barrier=true;cancelStrikes(b);b.action=null;b.dash={x:0,z:0,t:0.6};b.mirrorT=2.5;b.erodeT=4;
  for(const e of enemies)if(e.type==='minion'&&!e.dead){e.silent=true;killE(e,true);}
  bAct(b,'rune',2.0,[[0.7,()=>{for(const[x,z]of ringPts(4,9,PI/4))spawnBossRune(x,z,{hp:D.runeHp,req:'brush',label:'거울 룬',avatar:'mirrorrune',col:0xd8c8ff,onBreak:zyRuneBroken});showCut('주작의 거울 룬 (幻)');}],
    [1.3,()=>banner('파회법 — 붓 공격으로 거울 룬 4개에 먹물을 칠하세요(붓 3타). 거울이 남아 있는 동안 침식도가 계속 오릅니다',6,'big')]]);}
function zyRuneBroken(r){const b=boss;if(!b||b.id!=='zayeong'||!b.barrier)return;burst(r.x,1.6,r.z,0x141414,20,7,0.45);
  const left=enemies.filter(e=>isRune(e)&&!e.dead).length;if(left<=0)bossShatter(b,ZYD().brokenStun,'파회 — 거울 붕괴','자영의 본체가 드러났다! 긴 기절 · 받는 피해 '+ZYD().brokenDamageMul+'배');else popNum(b.x,3.2,b.z,'거울 룬 남은 수 '+left,'info');}
function zyRuneUpdate(b,dt){const D=ZYD();b.mirrorT-=dt;b.erodeT-=dt;
  if(b.mirrorT<=0){b.mirrorT=2.8;const rs=enemies.filter(e=>isRune(e)&&!e.dead);if(rs.length){const r=rs[Math.floor(Math.random()*rs.length)];burst(b.x,1.4,b.z,0xb070ff,12,6,0.4);b.x=r.x*0.8;b.z=r.z*0.8;burst(b.x,1.4,b.z,0xc8a0ff,16,7,0.4);
    strike({owner:b,kind:'circle',x:P.x,z:P.z,r:1.8,tell:0.9,dmg:D.damage.flame,color:0x9a5ad0,onFire:o=>{burst(o.x,0.8,o.z,0xb070ff,12,6,0.4);}});}}
  if(b.erodeT<=0){b.erodeT=4;if(P.char==='yeonwoo'){P.baek=Math.min(100,P.baek+D.mirrorErosion);popNum(P.x,2.8,P.z,'거울빛 — 침식도 +'+D.mirrorErosion,'hurt');}
    if(enemies.filter(e=>e.type==='minion'&&!e.dead).length<3){const rs=enemies.filter(e=>isRune(e)&&!e.dead);if(rs.length){const r=rs[Math.floor(Math.random()*rs.length)];
      spawnMinion(r.x*0.85,r.z*0.85,{hp:35,avatar:'shadowYeonwoo',col:0x7a4aa8,dmg:D.damage.shadow,speed:4,stagger:15});popNum(r.x,2.8,r.z,'거울에 비친 그림자','info');}}}}
BOSS_AI.zayeong=function(b,dt){const D=ZYD();
  if(bossCommon(b,dt))return;
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){zyPhase2(b);return;}
  if(!b.action&&!b.runeDone&&!b.barrier&&b.hp<=b.maxHp*D.runePhaseAt){zyRunePhase(b);return;}
  if(b.action){runBossAction(b,dt);return;}
  if(b.barrier){zyRuneUpdate(b,dt);faceP(b);return;}
  if(b.p2){b.invT-=dt;if(b.invT<=0){zyInvert(b);return;}}
  b.illT-=dt;if(b.illT<=0&&enemies.filter(e=>e.type==='minion'&&!e.dead).length===0){zyMirrorDance(b);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,6,3);
  b.cd-=dt;if(b.cd<=0&&!P.dead){const opts=d>6?[['flame',3],['blink',2]]:[['fan',3],['blink',2],['flame',1.5]];const pick=pickWeighted(b,opts);({fan:zyFan,flame:zyFlame,blink:zyBlink})[pick](b);}};
BOSS_ANIM.zayeong=function(b,dt){animHumanBoss(b,dt);const u=b.mesh.userData;u.flameAura.material.opacity=b.barrier?0.25+0.08*Math.sin(state.time*6):(b.p2?0.16:0.08);};
BOSS_DEFEAT.zayeong=function(b){state.invertT=0;};
