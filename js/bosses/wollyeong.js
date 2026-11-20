/* MFT 블루잉크 : 천년청묵 · js/bosses/wollyeong.js · v1.0
   보스: 월령 — 월백 가주 · 월계 수장 · 거울과 인과의 감시자 (월계)
   체험 요소: 거울 굴절 투척(측후방에서 날아옴 → 몸을 돌려 가드하거나 회피), 월령의 잔영(3초 전 내 위치를 다시 공격 → 계속 움직이기),
             만월 파쇄(스웨이 불가 고리 → 가드 · 점프), 『기억의 거울 : 인과역전』(시전 중 거울에 먹물을 칠하지 못하면 체력이 10초 전으로 · 교대 봉인)
   수치는 data/enemies.js의 BOSSES.wollyeong */
'use strict';
const WLD=()=>BOSSES.wollyeong;
BOSS_INIT.wollyeong=function(b){b.hist=[];b.histT=0;b.hpHist=[];b.hpT=0;b.reverse=null;b.reverseDone=false;
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('월령 — 거울 굴절은 등 뒤에서 날아옵니다. 잔영은 3초 전 위치를 노리니 멈추지 마세요',5);});};
function wlPastPos(sec){const h=WLD&&boss&&boss.hist;if(!h||!h.length)return{x:P.x,z:P.z};const t=state.time-sec;let best=h[0];for(const p of h)if(Math.abs(p.t-t)<Math.abs(best.t-t))best=p;return best;}
function wlSlash(b){const n=b.p2?2:1,ev=[];for(let i=0;i<n;i++)ev.push([i*0.7,()=>{faceP(b);strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:4.3,half:65*DEG,tell:0.55,dmg:WLD().damage.slash,color:0x6a8ac0,
  onFire:o=>{arcTrail(o.x,o.z,o.ang,4.3,o.half,0xf4f8ff,1.3,0.9);}});}]);bAct(b,'slash',0.9+0.7*n,ev);bossCall('월광 사선 참');}
function wlRefract(b){bAct(b,'refract',1.5,[[0,()=>{faceP(b);const n=b.p2?2:1;for(let i=0;i<n;i++){const a=P.ang+PI+(i?0.9:rand(-0.5,0.5)),sx=P.x+Math.sin(a)*6,sz=P.z+Math.cos(a)*6,ang=Math.atan2(P.x-sx,P.z-sz);
  burst(sx,1.6,sz,0xcfe0ff,12,4,0.4);strike({owner:b,kind:'line',x:sx,z:sz,ang,len:11,w:1.7,tell:0.75+i*0.2,dmg:WLD().damage.refract,color:0x6a8ac0,opt:{src:{x:sx,z:sz}},
    onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,0.6,0xcfe0ff,0.4,0.5);}});}}]]);bossCall('거울 굴절 투척 — 측후방');
  if(!flags.wlRef){flags.wlRef=1;banner('굴절된 칼날은 등 뒤에서 옵니다 — 가드는 앞쪽만 막으니 몸을 돌리거나 회피!',3.5);}}
function wlEcho(b){bAct(b,'echo',1.8,[[0,()=>{for(let i=0;i<3;i++){const p=wlPastPos(3-i);
  strike({owner:b,kind:'circle',x:p.x,z:p.z,r:1.7,tell:0.7+i*0.25,dmg:WLD().damage.echo,color:0x6a8ac0,onFire:o=>{ringFx(o.x,o.z,0.4,1.9,0xcfe0ff,0.4);burst(o.x,1,o.z,0xcfe0ff,10,5,0.35);}});}}]]);
  bossCall('월령의 잔영 — 3초 전의 궤적');}
function wlFullMoon(b){b.armorT=1.2;bAct(b,'moon',1.8,[[0,()=>{strike({owner:b,kind:'circle',x:b.x,z:b.z,r:3,tell:0.9,dmg:WLD().damage.fullmoon,type:'heavy',color:0x6a8ac0,
  onFire:o=>{spawnRing(o.x,o.z,{dmg:WLD().damage.fullmoon,col:0xcfe0ff,sp:7});ringFx(o.x,o.z,0.5,3.4,0xf4f8ff,0.6);burst(o.x,2.5,o.z,0xf4f8ff,26,8,0.5);shake(0.4);}});}]]);bossCall('만월 파쇄 — 스웨이 불가 고리');}
function wlPhase2(b){b.p2=true;b.invulnT=1.4;cancelStrikes(b);showCut('삭망');bAct(b,'p2',1.6,[[0.7,()=>{ringFx(b.x,b.z,1,10,0xcfe0ff,0.7,0.2,0.9);burst(b.x,2,b.z,0xf4f8ff,26,8,0.5);}]]);
  banner('2페이즈 — 연속 굴절 · 만월 파쇄(고리는 가드하거나 점프)',3);}
function wlReverse(b){const D=WLD();b.reverseDone=true;cancelStrikes(b);b.action=null;b.dash={x:0,z:-2,t:0.5};b.reverse={t:D.reverseChannel,hp:wlHpAgo(b,10)};b.armorT=D.reverseChannel;state.lockTagT=D.reverseChannel;
  showCut('기억의 거울 : 인과역전');later(0.6,()=>{if(!b.reverse)return;spawnBossRune(0,4,{hp:D.mirrorHp,req:'brush',label:'기억의 거울',avatar:'mirrorrune',col:0xcfe0ff,r:0.9,onBreak:wlMirrorBroken});});
  banner('인과역전 '+D.reverseChannel+'초 — 거울에 붓으로 먹물을 칠해(3타) 막으세요! 못 막으면 월령의 체력이 10초 전으로 돌아갑니다 · 교대 봉인',6,'big');
  if(PARTY.yeonha.hp>0){const L=DIALOG.bosses.wollyeong.ingame;later(1.0,()=>{if(!b.reverse)return;say(L.n,L.t,4);showCameo('yeonha',1.6);P.invuln=Math.max(P.invuln,2.5);P.critBuff=Math.max(P.critBuff||0,8);popNum(P.x,3,P.z,'연하 — 무적 · 공격 강화','info');});}}
function wlHpAgo(b,sec){const t=state.time-sec;let best=b.hp;for(const h of b.hpHist)if(h.t<=t)best=h.hp;return Math.max(b.hp,best);}
function wlMirrorBroken(r){const b=boss;if(!b||b.id!=='wollyeong'||!b.reverse)return;b.reverse=null;state.lockTagT=0;bossShatter(b,WLD().brokenStun,'파회 — 인과역전 무산','거울 파편 충격 — 월령 무방비! 받는 피해 '+WLD().brokenDamageMul+'배');}
function wlReverseDone(b){const R=b.reverse;b.reverse=null;state.lockTagT=0;b.armorT=0;for(const e of enemies)if(isRune(e)&&!e.dead){e.silent=true;killE(e,true);}
  const old=b.hp;b.hp=Math.min(b.maxHp,R.hp);b.barDirty=true;showCut('인과역전');ringFx(b.x,b.z,1,12,0xcfe0ff,0.8,0.2,1.0);banner('인과역전 — 월령의 체력이 10초 전으로 돌아갔다 (+'+Math.round(b.hp-old)+')',3.5,'big');}
BOSS_AI.wollyeong=function(b,dt){const D=WLD();
  b.histT-=dt;if(b.histT<=0){b.histT=0.1;b.hist.push({t:state.time,x:P.x,z:P.z});while(b.hist.length&&b.hist[0].t<state.time-4)b.hist.shift();}
  b.hpT-=dt;if(b.hpT<=0){b.hpT=0.5;b.hpHist.push({t:state.time,hp:b.hp});while(b.hpHist.length&&b.hpHist[0].t<state.time-12)b.hpHist.shift();}
  if(b.reverse){if(b.dash)bossCommon(b,dt);faceP(b);b.reverse.t-=dt;if(b.reverse.t<=0)wlReverseDone(b);return;}
  if(bossCommon(b,dt))return;
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){wlPhase2(b);return;}
  if(!b.action&&!b.reverseDone&&b.hp<=b.maxHp*D.reverseAt){wlReverse(b);return;}
  if(b.action){runBossAction(b,dt);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,6,3);
  b.cd-=dt;if(b.cd<=0&&!P.dead){const opts=d>6?[['refract',3],['echo',2]]:[['slash',3],['refract',2],['echo',2]];if(b.p2)opts.push(['moon',1.6]);
    const pick=pickWeighted(b,opts);({slash:wlSlash,refract:wlRefract,echo:wlEcho,moon:wlFullMoon})[pick](b);}};
BOSS_ANIM.wollyeong=function(b,dt){animHumanBoss(b,dt);const u=b.mesh.userData;u.mirror.rotation.z+=dt*(b.reverse?3:0.6);u.mirrorMat.emissive.setHex(b.reverse?0x6a8ac0:0x2a3a5a);};
BOSS_DEFEAT.wollyeong=function(b){b.reverse=null;state.lockTagT=0;};
