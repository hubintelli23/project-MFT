/* MFT 블루잉크 : 천년청묵 · js/bosses/cheonjehyeok.js · v1.0
   보스: 천제혁 — 마교 교주 · 역천의 패왕 (구해 마궁)
   체험 요소: 가드 불가(흑운 가르기 · 역천 잡기 → 스웨이), 가드 · 패링 가능(탁류 파쇄), 강체 대형 참격(구해 흑룡 참격 → 가드파쇄로 끊기),
             탁기 강제 침식(침식도 상승 · 청명도 감소 · 패링 봉인), 흑염 장판(매향 정화 · 검 패링 녹각공명으로 정화),
             흑염 파동(스웨이 불가 → 가드 · 점프), 3페이즈 영로화경 강제 폭주 + 즉사기(무적으로 버티기)
   수치는 data/enemies.js의 BOSSES.cheonjehyeok */
'use strict';
const CJD=()=>BOSSES.cheonjehyeok;
const cjRings=[];
BOSS_INIT.cheonjehyeok=function(b){b.p3=false;b.lethalT=8;
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('천제혁 — 보라색(가드 불가)은 회피로 스웨이, 빨간색은 가드 · 패링! 금빛 강체 공격은 가드파쇄로 끊을 수 있습니다',5);});};
function addFlame(x,z,r,t){if(puddles.length>40)return;const m=new T.Mesh(decalGeo,new T.MeshBasicMaterial({map:puddleTex,color:0xff5a2a,transparent:true,depthWrite:false,opacity:0.9}));m.rotation.x=-PI/2;m.position.set(x,0.07,z);m.scale.setScalar(r*2.1);scene.add(m);
  puddles.push({x,z,r,t,m,kind:'flame',dps:CJD().flameDps});if(Math.random()<0.5)burst(x,0.4,z,0xff5a2a,4,3,0.3,0.5);}
function cjOnErode(){const D=CJD();P.baek=Math.min(100,P.baek+D.erosion);P.clarity=Math.max(0,P.clarity-D.clarityLoss);P.parrySeal=D.parrySeal;popNum(P.x,2.9,P.z,'탁기 강제 침식 — 패링 봉인 '+D.parrySeal+'초','hurt');burst(P.x,1.4,P.z,0x141414,16,5,0.4);}
function cjCleave(b,dt0=0){return[dt0,()=>{faceP(b);strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:4.6,half:80*DEG,tell:0.55,dmg:CJD().damage.cleave,type:'break',
  onFire:o=>{arcTrail(o.x,o.z,o.ang,4.6,o.half,0x3a0508,1.2,1.0);burst(o.x+Math.sin(o.ang)*2,1,o.z+Math.cos(o.ang)*2,0xff5a2a,10,6,0.4);if(b.p2)addFlame(o.x+Math.sin(o.ang)*2.5,o.z+Math.cos(o.ang)*2.5,1.4,7);shake(0.3);}});}];}
function cjWave(b,dt0=0){return[dt0,()=>{faceP(b);strike({owner:b,kind:'line',x:b.x,z:b.z,ang:b.ang,len:12,w:2.4,tell:0.65,dmg:CJD().damage.wave,type:'normal',
  onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,2.4,0x141414,0.45,0.4);for(let k=1;k<5;k++){const x=o.x+Math.sin(o.ang)*k*2.6,z=o.z+Math.cos(o.ang)*k*2.6;burst(x,0.6,z,0x3a0508,4,4,0.35);if(b.p2&&k%2)addFlame(x,z,1.2,6);}}});}];}
function cjGrab(b,dt0=0){return[dt0,()=>{faceP(b);const d=dist2(P,b);if(d>2.2){const L=Math.min(d-1.6,6);b.dash={x:b.x+Math.sin(b.ang)*L,z:b.z+Math.cos(b.ang)*L,t:0.25};}
  const lx=b.dash?b.dash.x:b.x,lz=b.dash?b.dash.z:b.z;strike({owner:b,kind:'cone',x:lx,z:lz,ang:b.ang,r:2.8,half:55*DEG,tell:0.5,dmg:CJD().damage.grab,type:'grab',
    onHitP:()=>{P.stagger=1.0;P.baek=Math.min(100,P.baek+10);},onFire:o=>{burst(o.x+Math.sin(o.ang)*1.4,1.2,o.z+Math.cos(o.ang)*1.4,0x141414,12,5,0.4);}});}];}
function cjDragon(b,dt0=0){return[dt0,()=>{faceP(b);b.armorT=1.15;strike({owner:b,kind:'line',x:b.x,z:b.z,ang:b.ang,len:11,w:4.2,tell:1.05,dmg:CJD().damage.dragon,type:'heavy',onHitP:cjOnErode,
  onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,4.2,0x141414,0.6,1.2);for(let k=1;k<6;k++)burst(o.x+Math.sin(o.ang)*k*2,1.5,o.z+Math.cos(o.ang)*k*2,0x5a0a10,8,7,0.5);shake(0.6);if(b.p2)addFlame(o.x+Math.sin(o.ang)*6,o.z+Math.cos(o.ang)*6,2,8);}});}];}
/* 퍼지는 고리(스웨이 불가) — 다른 보스도 사용: spawnRing(x,z,{dmg,col,sp,max,onHitP}) */
function spawnRing(x,z,o={}){const m=new T.Mesh(flatGeo(new T.RingGeometry(0.88,1,64)),MB(o.col||0xff5a2a,0.8));m.position.set(x,0.12,z);scene.add(m);cjRings.push({x,z,R:0.6,m,hit:false,dmg:o.dmg,sp:o.sp||8,max:o.max||13,onHitP:o.onHitP});ringFx(x,z,0.5,2.5,o.col||0xd07a1a,0.4);}
function cjRing(b,dt0=0){return[dt0,()=>{spawnRing(b.x,b.z,{dmg:CJD().damage.ring});}];}
function cjSingle(b,kind){const f={cleave:cjCleave,wave:cjWave,grab:cjGrab,dragon:cjDragon,ring:cjRing}[kind];bAct(b,kind,kind==='dragon'?1.8:kind==='ring'?1.0:1.2,[f(b)]);
  bossCall({cleave:'흑운 가르기 — 가드 불가',wave:'탁류 파쇄',grab:'역천 잡기 — 가드 불가',dragon:'구해 흑룡 참격 — 강체',ring:'흑염 파동 — 스웨이 불가'}[kind]);if(kind==='ring'&&!flags.cjRing){flags.cjRing=1;banner('흑염 파동 — 회피 무적으로 못 피합니다. 가드하거나 점프로 넘으세요',3.5);}}
function cjCombo(b){bAct(b,'combo',4.6,[cjCleave(b,0),cjWave(b,0.95),cjGrab(b,1.9),cjDragon(b,2.8)]);bossCall('역천 4연격');}
function cjLethal(b){const D=CJD();b.lethalT=D.lethalInterval;b.armorT=3.1;b.dash={x:clamp(b.x*0.5,-6,6),z:clamp(b.z*0.5,-6,6),t:0.4};showCut('구해 흑룡 강림');
  bAct(b,'lethal',3.6,[[0.4,()=>{strike({owner:b,kind:'circle',x:b.x,z:b.z,r:9.5,tell:2.8,dmg:D.damage.lethal,type:'lethal',
    onFire:o=>{ringFx(o.x,o.z,1,10,0x141414,0.7,0.2,0.95);burst(o.x,2,o.z,0x5a0a10,40,12,0.6,1);shake(0.9);for(let i=0;i<6;i++)addFlame(o.x+rand(-6,6),o.z+rand(-6,6),1.4,6);}});}]]);
  banner('즉사기 『구해 흑룡 강림』 — 범위 밖으로 피하거나, 맞는 순간 회피 · 궁극기의 무적으로 버티세요',3.5,'big');}
function cjPhase2(b){b.p2=true;b.invulnT=1.4;cancelStrikes(b);showCut('흑염 각성');bAct(b,'p2',1.6,[[0.7,()=>{ringFx(b.x,b.z,1,9,0xff5a2a,0.7,0.2,0.9);for(let i=0;i<5;i++)addFlame(rand(-10,10),rand(-10,10),1.5,10);shake(0.4);}]]);
  banner('2페이즈 — 공격마다 흑염 장판이 남습니다 (매향의 매화 진 · 검 모드 패링으로 정화)',3.5);}
function cjPhase3(b){b.p3=true;b.invulnT=1.6;cancelStrikes(b);b.lethalT=10;showCut('탁기 룬 강제 주입');
  bAct(b,'p3',1.8,[[0.8,()=>{burst(P.x,1.5,P.z,0x141414,30,8,0.5);P.baek=100;P.clarity=100;if(P.char==='yeonwoo'&&!P.hwag&&P.nokgi<=0)enterHwag(true);else{P.hwag=true;P.hwagForced=true;}}]]);
  later(4.5,()=>{if(b.dead||state.over)return;if(PARTY.maehyang.hp>0){const L=DIALOG.bosses.cheonjehyeok.overheat;say(L.n,L.t,5);showCameo('maehyang',2);needleRing(P.x,P.z,4);P.hwagForced=false;P.clarity=Math.min(100,P.clarity+40);
    banner('매향의 대지 은침 — 폭주 진정 (청명도 회복 · 감소 속도 정상)',3);}});}
function cjChoose(b,d){const opts=d>6?[['wave',2],['grab',1.6],['dragon',1.2]]:[['cleave',3],['grab',2],['dragon',1.4],['combo',1.6],['wave',1]];if(b.p2)opts.push(['ring',1.5]);
  const pick=pickWeighted(b,opts);if(pick==='combo')cjCombo(b);else cjSingle(b,pick);}
function updateCjRings(dt){for(let i=cjRings.length-1;i>=0;i--){const w=cjRings[i];w.R+=w.sp*dt;w.m.scale.setScalar(w.R);w.m.material.opacity=0.8*(1-w.R/w.max);
  if(!w.hit&&Math.abs(Math.hypot(P.x-w.x,P.z-w.z)-w.R)<0.6&&P.y<0.8&&!P.dead){w.hit=true;hurtPlayer(w.dmg||CJD().damage.ring,{type:'unsway',src:{x:w.x,z:w.z},onHit:w.onHitP});}
  if(w.R>w.max){scene.remove(w.m);w.m.material.dispose();cjRings.splice(i,1);}}}
function clearCjRings(){for(const w of cjRings){scene.remove(w.m);w.m.material.dispose();}cjRings.length=0;}
BOSS_AI.cheonjehyeok=function(b,dt){const D=CJD();
  if(bossCommon(b,dt))return;
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){cjPhase2(b);return;}
  if(!b.action&&!b.p3&&b.hp<=b.maxHp*D.phase3At){cjPhase3(b);return;}
  if(b.p3&&!b.action){b.lethalT-=dt;if(b.lethalT<=0){cjLethal(b);return;}}
  if(b.action){runBossAction(b,dt);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,5,2.6);
  b.cd-=dt;if(b.cd<=0&&!P.dead)cjChoose(b,d);};
BOSS_ANIM.cheonjehyeok=function(b,dt){animHumanBoss(b,dt);const u=b.mesh.userData;u.flameAura.material.opacity=b.p2?0.18+0.08*Math.sin(state.time*9):0.08;};
BOSS_DEFEAT.cheonjehyeok=function(b){clearCjRings();for(const p of puddles)if(p.kind==='flame')p.t=Math.min(p.t,0.5);if(P.hwagForced){P.hwagForced=false;}};
