/* MFT 블루잉크 : 천년청묵 · js/boss.js · v0.6
   청류 보스 패턴 · 페이즈 · 인화 룬 */
'use strict';
/* ================= 보스 : 청류 ================= */
function bossCall(n){const el=$('bcall');el.textContent='「'+n+'」';el.style.opacity=1;state.bcallT=1.6;}
function bAct(b,name,dur,events){b.action={name,dur,t:0,events:events.map(e=>({at:e[0],fn:e[1]}))};b.lastAct=name;}
function runBossAction(b,dt){const A=b.action;A.t+=dt;for(const ev of A.events)if(!ev.done&&A.t>=ev.at){ev.done=true;ev.fn();if(b.action!==A)return;}if(b.action===A&&A.t>=A.dur){b.action=null;b.cd=rand(0.6,1.3)*(b.p2?0.75:1);}}
function faceP(b){b.ang=Math.atan2(P.x-b.x,P.z-b.z);}
function actCombo(b){const half=(b.p2?72:55)*DEG;const ev=[];
  for(let i=0;i<3;i++)ev.push([i*0.78,()=>{faceP(b);const d=dist2(P,b);let lx=b.x,lz=b.z;if(d>2.2){const L=Math.min(d-1.8,3.2);lx=b.x+Math.sin(b.ang)*L;lz=b.z+Math.cos(b.ang)*L;b.dash={x:lx,z:lz,t:0.25};}
    strike({owner:b,kind:'cone',x:lx,z:lz,ang:b.ang,r:4.2,half,tell:0.52,dmg:BOSS.damage.combo,onFire:o=>{arcTrail(o.x,o.z,o.ang,4.2,o.half,0x5ab8f0,1.2,0.8);burst(o.x+Math.sin(o.ang)*2,1,o.z+Math.cos(o.ang)*2,0x8fd3ff,8,5,0.35);}});}]);
  bAct(b,'combo',2.5,ev);bossCall(b.p2?'청룡 수류 3연격':'유수 도검 술법 — 수류 3연격');}
function actStep(b){bAct(b,'step',1.3,[[0,()=>{const a=rand(0,TAU);waterBurst(b.x,b.z);b.x=P.x+Math.sin(a)*2.6;b.z=P.z+Math.cos(a)*2.6;clampArena(b,1);waterBurst(b.x,b.z);faceP(b);
  strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:3.8,half:0.9,tell:0.5,dmg:BOSS.damage.step,onFire:o=>{arcTrail(o.x,o.z,o.ang,3.8,0.9,0x5ab8f0,1.2,0.8);}});}]]);bossCall('청류보');}
function actStance(b){b.stance=2.6;b.lastAct='stance';bossCall('유수 반격 자세');if(!flags.stance){flags.stance=1;banner('유수 반격 자세 — 지금 근접 공격하면 흘려보내고 반격합니다! 기다리면 빈틈이 생겨요',3.8);}}
function actWave(b){bAct(b,'wave',1.4,[[0,()=>{faceP(b);strike({owner:b,kind:'line',x:b.x,z:b.z,ang:b.ang,len:13,w:2.2,tell:0.7,dmg:BOSS.damage.wave,onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,2.2,0x5ab8f0,0.45,0.4);for(let i=1;i<6;i++)burst(o.x+Math.sin(o.ang)*i*2.4,0.6,o.z+Math.cos(o.ang)*i*2.4,0x8fd3ff,4,4,0.35);}});}]]);bossCall('수파 일섬');}
function actVortex(b){bAct(b,'vortex',3.0,[[0,()=>{strike({owner:b,kind:'circle',x:b.x,z:b.z,r:6.2,tell:2.3,dmg:BOSS.damage.vortex,onFire:o=>{ringFx(o.x,o.z,1,6.6,0x5ab8f0,0.5,0.3);burst(o.x,1,o.z,0x8fd3ff,24,9,0.5);arcTrail(o.x,o.z,0,6.2,PI,0x5ab8f0,1.0,1.4,0.4);shake(0.45);}});b.pulling=2.1;}]]);
  bossCall('청룡의 도류 — 수룡의 소용돌이');if(!flags.vortex){flags.vortex=1;banner('소용돌이에 끌려갑니다 — 범위 밖으로 달리거나 회피하세요',3);}}
function bossCounter(b){b.stance=0;stats.countered++;bossCall('유수 반격!');popNum(b.x,2.8,b.z,'흘려보냄','immune');
  bAct(b,'counter',1.2,[[0,()=>{waterBurst(b.x,b.z);b.x=P.x-Math.sin(P.ang)*1.7;b.z=P.z-Math.cos(P.ang)*1.7;clampArena(b,1);waterBurst(b.x,b.z);faceP(b);
    strike({owner:b,kind:'circle',x:b.x,z:b.z,r:2.6,tell:0.42,dmg:BOSS.damage.counter,onFire:o=>{ringFx(o.x,o.z,0.5,2.8,0x5ab8f0,0.35,0.6);arcTrail(o.x,o.z,0,2.6,PI,0x5ab8f0,1.1,0.9);}});}]]);}
function chooseBoss(b,d){const opts=[];
  if(d>7){opts.push(['wave',3],['step',3]);if(b.p2)opts.push(['vortex',1]);}
  else{opts.push(['combo',4],['step',2],['wave',1]);if(b.lastAct!=='stance'&&b.t>8)opts.push(['stance',1.6]);if(b.p2)opts.push(['vortex',2.2]);}
  const f=opts.filter(o=>o[0]!==b.lastAct),list=f.length?f:opts;let r=Math.random()*list.reduce((s,o)=>s+o[1],0),pick=list[0][0];for(const o of list){r-=o[1];if(r<=0){pick=o[0];break;}}
  ({combo:actCombo,step:actStep,wave:actWave,vortex:actVortex,stance:actStance})[pick](b);}
function enterP2(b){b.p2=true;b.invulnT=1.6;cancelStrikes(b);showCut('청룡의 도류');bAct(b,'p2',1.6,[[0.7,()=>{ringFx(b.x,b.z,1,9,0x5ab8f0,0.7,0.2,0.9);waterBurst(b.x,b.z);burst(b.x,2,b.z,0x8fd3ff,30,9,0.5,0.9);shake(0.5);}]]);
  banner('2페이즈 — 신수 청룡의 형상이 깃들어 공격 범위가 넓어집니다',3.2);}
function startRunePhase(b){b.runeActive=true;b.shield=BOSS.runeShield;b.invulnT=1.5;cancelStrikes(b);b.stacks=0;b.dash={x:0,z:0,t:0.6};
  bAct(b,'rune',2.0,[[0.7,()=>{spawnRunes();showCut('청룡의 정화 룬 (水)');}],[1.3,()=>{say(DIALOG.runePhase.n,DIALOG.runePhase.t,6);
    banner('파회법 — ① 붓 [묵향결쇄]로 룬 3개에 먹선 연결 → ② 검 [유묵섬참] 또는 [역린공명]으로 물길 폭파',7);}]]);}
function aiBoss(b,dt){
  b.invulnT-=dt;if(b.broken>0)b.broken-=dt;if(b.swingT>0)b.swingT-=dt;
  if(b.intro)return;
  if(b.runeActive)b.shield=Math.min(BOSS.runeShield,b.shield+BOSS.runeShieldRegen*dt);
  if(b.dash){const D=b.dash,rem=D.t;D.t-=dt;const k=rem>0?Math.min(1,dt/rem):1;b.x+=(D.x-b.x)*k;b.z+=(D.z-b.z)*k;if(D.t<=0)b.dash=null;}
  if(b.pulling>0){b.pulling-=dt;const dx=b.x-P.x,dz=b.z-P.z,d=Math.hypot(dx,dz);if(d>1.2&&P.iframe<=0&&!P.dead){P.x+=dx/d*2.7*dt;P.z+=dz/d*2.7*dt;}if(Math.random()<0.5)burst(b.x+rand(-5,5),0.3,b.z+rand(-5,5),0x8fd3ff,1,2,0.35,0.5);}
  if(b.stun>0){b.stun-=dt;b.action=null;b.stance=0;b.pulling=0;if(b.stun<=0)b.cd=0.5;return;}
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*BOSS.phase2At){enterP2(b);return;}
  if(!b.action&&!b.runeDone&&!b.runeActive&&b.hp<=b.maxHp*BOSS.runePhaseAt){startRunePhase(b);return;}
  if(b.stance>0){b.stance-=dt;if(b.stance<=0){b.stun=1.3;banner('빈틈! 지금 공격하세요',1.4);}return;}
  if(b.action){runBossAction(b,dt);return;}
  const dx=P.x-b.x,dz=P.z-b.z,d=Math.hypot(dx,dz)||1;b.ang=lerpAng(b.ang,Math.atan2(dx,dz),1-Math.exp(-6*dt));
  if(d>3.0){const sp=(b.p2?BOSS.walkSpeedP2:BOSS.walkSpeed)*slowMul(b);b.x+=dx/d*sp*dt;b.z+=dz/d*sp*dt;b.walk+=dt*9;}
  b.cd-=dt;if(b.cd<=0&&!P.dead)chooseBoss(b,d);}
function animBoss(b,dt){const u=b.mesh.userData;let rx=-0.3+Math.sin(b.walk)*0.25,ry=0.2;const pending=strikes.some(s=>s.owner===b);
  if(b.swingT>0){const k=1-b.swingT/0.25;u.piv.rotation.x=-PI/2;u.piv.rotation.y=-1.6+3.2*k;}
  else{if(pending){rx=-2.7;ry=0;}else if(b.stance>0){rx=-1.2;ry=-0.8;}const k=Math.min(1,dt*18);u.piv.rotation.x+=(rx-u.piv.rotation.x)*k;u.piv.rotation.y+=(ry-u.piv.rotation.y)*k;}
  b.mesh.rotation.x=b.stun>0?0.25:0;u.stars.visible=b.stun>0;if(b.stun>0)u.stars.rotation.y+=dt*5;
  u.bubble.material.opacity=b.runeActive?0.16+0.05*Math.sin(state.time*4):0;
  u.stanceM.material.opacity=b.stance>0?0.28+0.1*Math.sin(state.time*12):0;
  u.dragon.visible=b.p2;if(b.p2)u.dragon.rotation.y+=dt*1.6;}
function bossDefeated(b){state.win=true;cancelStrikes(b);b.action=null;b.stance=0;b.pulling=0;
  b.mesh.rotation.x=0.5;b.mesh.position.y=-0.35;b.mesh.userData.dragon.visible=false;b.mesh.userData.bubble.material.opacity=0;b.mesh.userData.stanceM.material.opacity=0;b.mesh.userData.stars.visible=false;
  for(const r of runes){scene.remove(r.g);scene.remove(r.beam);}runes.length=0;
  hitstop=0.5;shake(0.8);showCut('정화 완료');waterBurst(b.x,b.z);burst(b.x,1.5,b.z,0x6fe0b8,40,9,0.6,1.2);
  for(let i=0;i<26;i++)later(i*0.07,()=>{const a=rand(0,TAU),r=Math.sqrt(Math.random())*14;purify(Math.cos(a)*r,Math.sin(a)*r,rand(1.8,3));});
  later(2.4,()=>dialog(DIALOG.outro,()=>showResult(true)));}

/* ================= 인화 룬 ================= */
const _v=new T.Vector3(),_up=new T.Vector3(0,1,0);
function setBeam(m,ax,ay,az,bx,by,bz){const dx=bx-ax,dy=by-ay,dz=bz-az,l=Math.hypot(dx,dy,dz)||0.01;m.position.set((ax+bx)/2,(ay+by)/2,(az+bz)/2);m.scale.set(1,l,1);_v.set(dx/l,dy/l,dz/l);m.quaternion.setFromUnitVectors(_up,_v);}
function spawnRunes(){for(let i=0;i<3;i++){const a=-PI/2+i*TAU/3;const x=Math.cos(a)*9,z=Math.sin(a)*9;const g=new T.Group();
  const ped=new T.Mesh(new T.CylinderGeometry(0.5,0.7,0.5,8),lam(0x3a4448));ped.position.y=0.25;g.add(ped);
  const mat=lam(0x7fd4ff,0x1f6fa8);const cr=new T.Mesh(new T.OctahedronGeometry(0.55,0),mat);cr.position.y=1.5;g.add(cr);const o=new T.Mesh(cr.geometry,OL);o.scale.setScalar(1.12);cr.add(o);
  const ring=new T.Mesh(flatGeo(new T.RingGeometry(0.9,1.05,32)),MB(0x7fd4ff,0.6));ring.position.y=0.05;g.add(ring);g.position.set(x,0,z);scene.add(g);
  const beam=new T.Mesh(new T.CylinderGeometry(0.06,0.06,1,6),new T.MeshBasicMaterial({color:0x121212}));beam.visible=false;scene.add(beam);
  runes.push({x,z,r:0.7,g,cr,mat,ring,beam,linked:false});ringFx(x,z,0.5,3,0x7fd4ff,0.6);burst(x,1.5,z,0x7fd4ff,14,5);}
  state.runeWaveT=4;}
function linkRune(rn){rn.linked=true;rn.mat.color.setHex(0x1a1a1a);rn.mat.emissive.setHex(0x3a0a12);rn.ring.material.color.setHex(0x1a1a1a);rn.beam.visible=true;burst(rn.x,1.5,rn.z,0x141414,16,6,0.45);
  const n=runes.filter(r=>r.linked).length;popNum(rn.x,2.6,rn.z,'먹선 연결 '+n+'/3','info');
  if(n===runes.length){banner(P.mode==='brush'?'룬 3개 모두 연결! 【전환】으로 검 모드 → [유묵섬참] 또는 [역린공명]으로 폭파!':'룬 3개 모두 연결! [유묵섬참] 또는 [역린공명]으로 폭파!',4.5,'big');}}
function breakRunes(){const b=boss;for(const r of runes){ringFx(r.x,r.z,0.5,4,0x141414,0.5);burst(r.x,1.5,r.z,0x141414,20,8,0.5);burst(r.x,1.5,r.z,0x7fd4ff,14,7,0.4);scene.remove(r.g);scene.remove(r.beam);lineFx(r.x,r.z,Math.atan2(b.x-r.x,b.z-r.z),Math.hypot(b.x-r.x,b.z-r.z),0.5,0x141414,0.5,1.4);}
  runes.length=0;waves.forEach(w=>{scene.remove(w.m);w.m.material.dispose();});waves.length=0;
  b.runeActive=false;b.runeDone=true;b.shield=0;b.stun=BOSS.brokenStun;b.broken=BOSS.brokenStun+1;b.action=null;b.stance=0;b.pulling=0;cancelStrikes(b);
  showCut('파회 — 물길 붕괴');hitstop=0.25;shake(0.7);waterBurst(b.x,b.z);banner('청류 긴 기절! 받는 피해 150% — 지금 몰아치세요',4,'big');stats.runeBreak=1;spawnItem('yeongro',b.x+Math.sin(b.ang)*1.8,b.z+Math.cos(b.ang)*1.8);}
function updateRunes(dt){if(!runes.length)return;for(const r of runes){r.cr.rotation.y+=dt*(r.linked?0.4:1.6);r.cr.position.y=1.5+Math.sin(state.time*2+r.x)*0.12;if(r.linked&&boss)setBeam(r.beam,r.x,1.5,r.z,boss.x,1.6,boss.z);}
  if(boss&&boss.runeActive&&!boss.dead){state.runeWaveT-=dt;if(state.runeWaveT<=0){state.runeWaveT=6;for(const r of runes)if(!r.linked){const m=new T.Mesh(flatGeo(new T.RingGeometry(0.88,1,64)),MB(0x7fd4ff,0.75));m.position.set(r.x,0.12,r.z);scene.add(m);waves.push({x:r.x,z:r.z,R:0.5,m,hit:false});}}}}
function updateWaves(dt){for(let i=waves.length-1;i>=0;i--){if(i>=waves.length)continue;const w=waves[i];w.R+=7*dt;w.m.scale.setScalar(w.R);w.m.material.opacity=0.75*(1-w.R/12);
  if(!w.hit&&Math.abs(Math.hypot(P.x-w.x,P.z-w.z)-w.R)<0.55&&P.iframe<=0&&P.invuln<=0&&P.taintImmune<=0&&!P.dead&&P.y<0.8){w.hit=true;if(P.parry>0&&P.mode==='sword'){ryeokrin();}else{const had=P.shield>0;P.shield=0;hurtPlayer(6,{noStagger:true});if(had)popNum(P.x,2.8,P.z,'물결이 먹선 방어막을 씻어냄','info');}}
  if(w.R>12){scene.remove(w.m);w.m.material.dispose();waves.splice(i,1);}}}
