/* MFT 블루잉크 : 천년청묵 · js/bosses/baekjin.js · v1.0
   보스: 백진 — 백련 가주 · 강철과 성벽의 아크 군주 (설백산)
   체험 요소: 정면 방패 가드(가드파쇄 · 측후방 공격), 성기 게이지, 강체(금빛) → 가드파쇄로 깨기, 스태거 무력화,
             가드 불가 돌진(스웨이), 성기사 아크 룬(무적 방어막 — 가드파쇄로 룬 파괴 또는 녹기현경 · 녹기쌍룡 · 삼라만화로 즉시 파쇄)
   수치는 data/enemies.js의 BOSSES.baekjin */
'use strict';
const BJD=()=>BOSSES.baekjin;
BOSS_INIT.baekjin=function(b){b.guardFront=true;b.guardDown=0;b.holy=0;b.barrier=false;b.phantomT=0;b.runeCount=0;
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('백진 — 정면 방패는 일반 공격을 막습니다. 옆 · 뒤로 돌거나(대쉬) 가드파쇄(강공격 · 내려찍기 · 검 4타 · 점묵개화)로 깨세요',5);});};
/* 막힘 — 성기 게이지 충전 */
function bossBlocked(b){const D=BJD();b.holy=Math.min(D.holyMax,b.holy+D.holyPerBlock);
  if(state.time-(b.blkT||0)>0.35){b.blkT=state.time;popNum(b.x,2.9,b.z,'방패 — 막힘','immune');const a=b.ang;burst(b.x+Math.sin(a)*0.9,1.5,b.z+Math.cos(a)*0.9,0xf2d36b,8,5,0.3);}}
function bjAct(b,name,dur,ev){bAct(b,name,dur,ev);}
function bjBash(b){faceP(b);bjAct(b,'bash',1.1,[[0,()=>{strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:3.2,half:50*DEG,tell:0.5,dmg:BJD().damage.bash,type:'normal',
  onFire:o=>{burst(o.x+Math.sin(o.ang)*1.8,1,o.z+Math.cos(o.ang)*1.8,0xe8edf2,10,5,0.35);shake(0.2);}});}]]);bossCall('방패 강타');}
function bjSlash(b){const n=b.p2?2:1,ev=[];for(let i=0;i<n;i++)ev.push([i*0.75,()=>{faceP(b);strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:4.4,half:75*DEG,tell:0.6,dmg:BJD().damage.slash,type:'normal',
  onFire:o=>{arcTrail(o.x,o.z,o.ang,4.4,o.half,0xf4f8ff,1.3,0.9);}});}]);bjAct(b,'slash',0.9+0.75*n,ev);bossCall(n>1?'백호쇄악검 — 연속 횡베기':'백호쇄악검 — 횡베기');}
function bjCharge(b){faceP(b);const a=b.ang,L=9;b.armorT=0.8;
  bjAct(b,'charge',1.4,[[0,()=>{strike({owner:b,kind:'line',x:b.x,z:b.z,ang:a,len:L,w:2.4,tell:0.75,dmg:BJD().damage.charge,type:'break',
    onFire:o=>{b.dash={x:clamp(o.x+Math.sin(a)*(L-1),-13,13),z:clamp(o.z+Math.cos(a)*(L-1),-13,13),t:0.25};lineFx(o.x,o.z,a,L,2.4,0xe8edf2,0.4,0.5);shake(0.3);}});}]]);bossCall('방패 돌진 — 가드 불가');}
function bjHoly(b){const D=BJD();b.holy=0;b.armorT=2.1;faceP(b);showCut('성기 해방');
  bjAct(b,'holy',2.6,[[0,()=>{faceP(b);strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:3.6,half:60*DEG,tell:0.6,dmg:D.damage.push,type:'break',onFire:o=>{burst(o.x,1.2,o.z,0xf2d36b,14,6,0.4);}});}],
    [0.9,()=>{strike({owner:b,kind:'circle',x:b.x,z:b.z,r:5.2,tell:1.05,dmg:D.damage.smite,type:'heavy',onFire:o=>{ringFx(o.x,o.z,1,5.6,0xf2d36b,0.6,0.2,0.9);burst(o.x,1.5,o.z,0xfff4c8,30,9,0.5,0.9);shake(0.6);}});}],
    [2.2,()=>{b.guardDown=D.guardDownTime;banner('성기 해방 직후 — 방패가 내려갔다! 공격 기회',2.2);}]]);
  bossCall('성기 해방 — 방패 밀치기 → 성검 내리치기');}
function bjKnights(b){const ev=[];for(let i=0;i<3;i++)ev.push([i*0.45,()=>{const a=Math.atan2(P.x,P.z)+rand(-0.9,0.9)+PI,sx=Math.sin(a)*14,sz=Math.cos(a)*14,ang=Math.atan2(P.x-sx,P.z-sz);
    strike({owner:b,kind:'line',x:sx,z:sz,ang,len:26,w:2.2,tell:1.1,dmg:BJD().damage.knight,type:'heavy',onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,2.2,0xdfe8f2,0.45,0.8);for(let k=1;k<8;k++)burst(o.x+Math.sin(o.ang)*k*3,1,o.z+Math.cos(o.ang)*k*3,0xdfe8f2,3,4,0.3);}});}]);
  bjAct(b,'knights',2.4,ev);bossCall('아크 절멸 진형 — 기사 환영 돌격');}
function bjChoose(b,d){const opts=d>6?[['charge',3],['slash',1]]:[['bash',3],['slash',3],['charge',1.5]];if(b.p2)opts.push(['knights',1.6]);
  const pick=pickWeighted(b,opts);({bash:bjBash,slash:bjSlash,charge:bjCharge,knights:bjKnights})[pick](b);}
function bjPhase2(b){b.p2=true;b.invulnT=1.4;cancelStrikes(b);showCut('아크 절멸 진형');bjAct(b,'p2',1.6,[[0.7,()=>{ringFx(b.x,b.z,1,9,0xf2d36b,0.7,0.2,0.9);burst(b.x,2,b.z,0xfff4c8,26,8,0.5);shake(0.4);}]]);
  banner('2페이즈 — 기사 환영이 전장을 가로지릅니다',3);}
/* 성기사 아크 룬(鐵) — 무적 방어막 + 기사 환영 소환 */
function bjRunePhase(b){b.barrier=true;b.runeDone=false;cancelStrikes(b);b.action=null;b.dash={x:0,z:0,t:0.6};b.runeCount=4;b.phantomT=2;
  bjAct(b,'rune',2.0,[[0.7,()=>{for(let i=0;i<4;i++){const a=PI/4+i*PI/2;spawnArcRune(Math.cos(a)*9,Math.sin(a)*9);}showCut('성기사 아크 룬 (鐵)');}],
    [1.3,()=>banner('아크 방어막 — 백진 무적! 가드파쇄 공격으로 룬 4개를 부수거나 녹기현경 · 녹기쌍룡(Z, 검) · 삼라만화(V)로 즉시 파쇄',6,'big')]]);}
function bjRuneDestroyed(r){const b=boss;if(!b||b.id!=='baekjin'||b.dead)return;b.runeCount--;ringFx(r.x,r.z,0.5,3,0xf2d36b,0.5);burst(r.x,1.6,r.z,0xf2d36b,20,7,0.45);
  if(b.runeCount<=0&&b.barrier)bjBreakBarrier(b);else popNum(b.x,3.2,b.z,'아크 룬 남은 수 '+b.runeCount,'info');}
function bjBreakBarrier(b){const D=BJD();b.barrier=false;b.runeDone=true;for(const e of enemies)if(isRune(e)&&!e.dead){e.dead=true;e.dying=0.4;if(e.bar){scene.remove(e.bar.s);e.bar=null;}}
  b.stun=D.brokenStun;b.broken=D.brokenStun+1;b.action=null;cancelStrikes(b);b.guardDown=D.brokenStun;b.armorT=0;stats.runeBreak=1;
  showCut('파회 — 아크 방어막 붕괴');hitstop=0.25;shake(0.7);banner('백진 긴 기절! 받는 피해 '+D.brokenDamageMul+'배 · 방패 해제',4,'big');spawnItem('yeongro',b.x+1.8,b.z);}
BOSS_AI.baekjin=function(b,dt){const D=BJD();
  if(b.guardDown>0)b.guardDown-=dt;b.guardFront=true;
  if(bossCommon(b,dt))return;
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){bjPhase2(b);return;}
  if(!b.action&&!b.runeDone&&!b.barrier&&b.hp<=b.maxHp*D.runePhaseAt){bjRunePhase(b);return;}
  if(b.barrier){b.phantomT-=dt;if(b.phantomT<=0&&enemies.filter(e=>e.type==='phantom'&&!e.dead).length<4){b.phantomT=D.phantomInterval;const rs=enemies.filter(e=>isRune(e)&&!e.dead);
      const r=rs.length?rs[Math.floor(Math.random()*rs.length)]:{x:0,z:9};spawnPhantom(r.x*0.85,r.z*0.85);}}
  if(!b.action&&b.holy>=D.holyMax&&!b.barrier){bjHoly(b);return;}
  if(b.action){runBossAction(b,dt);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,2.2,2.8);
  b.cd-=dt;if(b.cd<=0&&!P.dead)bjChoose(b,d);};
BOSS_ANIM.baekjin=function(b,dt){animHumanBoss(b,dt);const u=b.mesh.userData;
  const down=b.guardDown>0||b.stun>0;u.shield.position.set(down?-0.55:-0.42,down?0.75:1.2,down?0.15:0.45);u.shield.rotation.z=down?0.6:0;
  u.barrierM.material.opacity=b.barrier?0.2+0.06*Math.sin(state.time*5):0;};
BOSS_DEFEAT.baekjin=function(b){b.barrier=false;b.mesh.userData.barrierM.material.opacity=0;};
