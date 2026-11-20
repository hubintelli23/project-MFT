/* MFT 블루잉크 : 천년청묵 · js/bosses/sahyeon.js · v1.0
   보스: 사현 — 사미 가주 · 그림자 뱀의 암살자 (연분홍 늪)
   체험 요소: 그림자 잠행(붓 공격만 그림자를 끌어냄) → 등 뒤 기습(가드 불가 → 스웨이), 중독(지속 피해),
             2페이즈 칠흑 독 수렁(감속 · 중독), 현무의 음영 룬(그림자 분신 6 — 붓으로 진짜를 찾기 · 동시 암살 → 스웨이 · 무적)
   수치는 data/enemies.js의 BOSSES.sahyeon */
'use strict';
const SHD=()=>BOSSES.sahyeon;
BOSS_INIT.sahyeon=function(b){b.hideT=5;b.hidden=false;b.hideLeft=0;b.swampT=0;b.assT=0;b.barrierName='현무의 음영';b.r=0.9;
  const m=new T.Mesh(flatGeo(new T.CircleGeometry(1.1,24)),MB(0x141010,0.0));m.position.y=0.05;scene.add(m);b.shadowM=m;
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('사현 — 그림자로 숨으면 붓 공격으로만 끌어낼 수 있습니다. 등 뒤 기습(보라색)은 회피로 스웨이!',5);});};
function shPoison(n){P.poison=Math.min(8,(P.poison||0)+n);}
function shHide(b){const D=SHD();b.hidden=true;b.hideLeft=D.hideTime;b.mesh.visible=false;cancelStrikes(b);b.action=null;burst(b.x,1,b.z,0x141010,20,5,0.5);bossCall('은형 암살 — 그림자 잠행');
  if(!flags.shHide){flags.shHide=1;banner('그림자 잠행 — 바닥의 검은 그림자를 붓으로 치면 끌어낼 수 있습니다',3.5);}}
function shReveal(b,forced){b.hidden=false;b.mesh.visible=true;b.hideT=rand(7,10);burst(b.x,1.2,b.z,0x141010,20,6,0.45);
  if(forced){b.stun=Math.max(b.stun,1.8);b.vuln=Math.max(b.vuln||0,4);popNum(b.x,3,b.z,'먹선 — 그림자에서 끌려나옴!','info');showCut('그림자 봉인');}}
function shAmbush(b){const D=SHD();const a=P.ang+PI;b.x=clamp(P.x+Math.sin(a)*1.9,-13,13);b.z=clamp(P.z+Math.cos(a)*1.9,-13,13);shReveal(b,false);faceP(b);
  bAct(b,'ambush',1.1,[[0,()=>{strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:3,half:55*DEG,tell:0.45,dmg:D.damage.ambush,type:'break',onHitP:()=>shPoison(4),
    onFire:o=>{arcTrail(o.x,o.z,o.ang,3,o.half,0xf2a0b0,1.1,0.7);burst(o.x+Math.sin(o.ang)*1.4,1,o.z+Math.cos(o.ang)*1.4,0x7a1a24,12,6,0.4);}});}]]);bossCall('등 뒤 기습 — 가드 불가');}
BOSS_HIT.sahyeon=function(b,v,src){if(b.runeShadow){if(isBrushHit()&&src!=='counter'){shRuneBreak(b);return false;}if(state.time-(b.absT||0)>0.5){b.absT=state.time;popNum(b.x,2.8,b.z,'그림자 분신 — 붓으로 진짜를 찾으세요','immune');}return false;}
  if(b.hidden){if(isBrushHit()){shReveal(b,true);return v;}if(state.time-(b.absT||0)>0.5){b.absT=state.time;popNum(b.x,2.4,b.z,'그림자 — 닿지 않음','immune');}return false;}};
function shFang(b){const ev=[];for(let i=0;i<2;i++)ev.push([i*0.45,()=>{faceP(b);const d=dist2(P,b);if(d>2){const L=Math.min(d-1.5,3);b.dash={x:b.x+Math.sin(b.ang)*L,z:b.z+Math.cos(b.ang)*L,t:0.18};}
  strike({owner:b,kind:'cone',x:b.dash?b.dash.x:b.x,z:b.dash?b.dash.z:b.z,ang:b.ang,r:3,half:50*DEG,tell:0.42,dmg:SHD().damage.fang,onHitP:()=>shPoison(2),onFire:o=>{arcTrail(o.x,o.z,o.ang,3,o.half,0xf2c0c8,1,0.6);}});}]);
  bAct(b,'fang',1.5,ev);bossCall('뱀의 이빨 — 쌍단검');}
function shDagger(b){bAct(b,'dagger',1.3,[[0,()=>{faceP(b);for(const da of[-0.35,0,0.35])strike({owner:b,kind:'line',x:b.x,z:b.z,ang:b.ang+da,len:10,w:0.9,tell:0.6,dmg:SHD().damage.dagger,onHitP:()=>shPoison(2),
  onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,0.3,0x7a1a24,0.35,0.4);}});}]]);bossCall('독 암기 — 부채꼴 투척');}
function shSwamp(b){b.swampT=10;for(let i=0;i<5;i++){const x=rand(-11,11),z=rand(-11,11);const m=new T.Mesh(decalGeo,new T.MeshBasicMaterial({map:puddleTex,color:0x3a1a28,transparent:true,depthWrite:false,opacity:0.9}));m.rotation.x=-PI/2;m.position.set(x,0.06,z);m.scale.setScalar(5.6);scene.add(m);
  puddles.push({x,z,r:2.6,t:10,m,kind:'swamp',dps:SHD().swampDps});}}
function shPhase2(b){b.p2=true;b.swampT=10;b.invulnT=1.4;cancelStrikes(b);if(b.hidden)shReveal(b,false);showCut('구렁이의 수렁');bAct(b,'p2',1.6,[[0.7,()=>{ringFx(b.x,b.z,1,10,0x7a1a24,0.7,0.2,0.9);shSwamp(b);}]]);
  banner('2페이즈 — 칠흑 독 수렁: 밟으면 느려지고 중독됩니다 (매향의 매화 진 · 개화로 정화)',3.5);}
function shRunePhase(b){const D=SHD();b.barrier=false;b.runeShadow=true;if(b.hidden)shReveal(b,false);cancelStrikes(b);b.action=null;b.assT=4;
  bAct(b,'rune',2.0,[[0.7,()=>{const pts=ringPts(D.cloneCount,7,rand(0,TAU)),ri=Math.floor(Math.random()*pts.length);
    pts.forEach(([x,z],i)=>{if(i===ri){b.x=x;b.z=z;return;}spawnMinion(x,z,{hp:20,avatar:'shadowclone',col:0x7a1a24,stagger:10,ai:shCloneAi,
      onHitE:e=>{if(isBrushHit()){e.silent=true;popNum(e.x,2.6,e.z,'가짜 — 그림자 흩어짐','info');burst(e.x,1.2,e.z,0x141010,14,5,0.4);killE(e,true);return false;}popNum(e.x,2.4,e.z,'그림자 — 닿지 않음','immune');return false;}});});
    showCut('현무의 음영 룬 (毒)');burst(b.x,1.2,b.z,0x141010,20,6,0.4);}],
    [1.3,()=>banner('파회법 — 분신 6 중 진짜 사현을 붓으로 치세요 (가짜는 붓에 흩어짐). 붉게 빛나면 동시 암살 — 회피로 스웨이!',6,'big')]]);}
function shCloneAi(e,dt){e.ang=Math.atan2(P.x-e.x,P.z-e.z);const a=Math.atan2(e.x-P.x,e.z-P.z)+dt*0.35,r=Math.max(4.5,Math.hypot(e.x-P.x,e.z-P.z)-dt*0.4);e.x=clamp(P.x+Math.sin(a)*r,-13.5,13.5);e.z=clamp(P.z+Math.cos(a)*r,-13.5,13.5);}
function shAssassinate(b){const D=SHD();b.assT=D.assassinateInterval;const all=[b,...enemies.filter(e=>e.type==='minion'&&!e.dead)];bossCall('현무 음영 — 동시 암살');
  for(const e of all){const ang=Math.atan2(P.x-e.x,P.z-e.z),len=Math.hypot(P.x-e.x,P.z-e.z)+1.5;strike({owner:e===b?b:e,kind:'line',x:e.x,z:e.z,ang,len,w:1.3,tell:0.95,dmg:D.damage.assassinate,type:'break',onHitP:()=>shPoison(3),
    onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,0.5,0x7a1a24,0.4,0.6);}});}}
function shRuneBreak(b){b.runeShadow=false;bossShatter(b,SHD().brokenStun,'파회 — 진짜 사현','먹선이 진짜 사현을 붙잡았다! 긴 기절 · 받는 피해 '+SHD().brokenDamageMul+'배');P.poison=0;}
BOSS_AI.sahyeon=function(b,dt){const D=SHD();
  if(P.poison>0&&!state.win){P.poison-=dt;burnPlayer(D.poisonDps,dt);}
  if(b.runeShadow&&!P.dead){P.poison=Math.max(P.poison||0,0.6);}
  b.shadowM.position.set(b.x,0.05,b.z);b.shadowM.material.opacity=b.hidden?0.75:0;
  if(b.p2){b.swampT-=dt;if(b.swampT<=0)shSwamp(b);}
  if(bossCommon(b,dt)){if(b.hidden)shReveal(b,false);return;}
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){shPhase2(b);return;}
  if(!b.action&&!b.runeDone&&!b.runeShadow&&b.hp<=b.maxHp*D.runePhaseAt){shRunePhase(b);return;}
  if(b.action){runBossAction(b,dt);return;}
  if(b.runeShadow){shCloneAi(b,dt);b.assT-=dt;if(b.assT<=0)shAssassinate(b);return;}
  if(b.hidden){b.hideLeft-=dt;const dx=P.x-b.x,dz=P.z-b.z,d=Math.hypot(dx,dz)||1;if(d>2){b.x+=dx/d*6.5*dt;b.z+=dz/d*6.5*dt;}if(b.hideLeft<=0)shAmbush(b);return;}
  b.hideT-=dt;if(b.hideT<=0){shHide(b);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,8,2.6);
  b.cd-=dt;if(b.cd<=0&&!P.dead){const opts=d>5?[['dagger',3],['fang',1]]:[['fang',3],['dagger',1.2]];const pick=pickWeighted(b,opts);({fang:shFang,dagger:shDagger})[pick](b);}};
BOSS_ANIM.sahyeon=function(b,dt){animHumanBoss(b,dt);const u=b.mesh.userData;u.veil.material.opacity=b.runeShadow?0.12:0;
  if(b.runeShadow&&b.assT<1.2){u.robe.emissive.setHex(0x6a0010);}};
BOSS_DEFEAT.sahyeon=function(b){b.runeShadow=false;b.hidden=false;b.mesh.visible=true;P.poison=0;if(b.shadowM){scene.remove(b.shadowM);}for(const p of puddles)if(p.kind==='swamp')p.t=Math.min(p.t,0.5);};
