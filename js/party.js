/* MFT 블루잉크 : 천년청묵 · js/party.js · v0.9
   교대 시스템 — 연우 · 연하 · 매향 (1·2·3 교대, 교대 진입 공격, 쓰러지면 자동 교대, 지원 개입)
   연하·매향의 전투 기술 · 매화 진. 수치는 data/skills.js · data/characters.js · data/config.js */
'use strict';
const PARTY_ORDER=['yeonwoo','yeonha','maehyang'];
let PARTY=null;
function newParty(){const p={critNext:false,sup:{yeonha:0,maehyang:0},samraUsed:false};for(const id of PARTY_ORDER){const C=CHARACTERS[id];p[id]={hp:C.hp,maxHp:C.hp,ult:0,mode:'brush'};}return p;}

const MESH={yeonwoo:pMesh,yeonha:AVATARS.yeonha(),maehyang:AVATARS.maehyang()};for(const k of['yeonha','maehyang']){MESH[k].visible=false;scene.add(MESH[k]);}
let PM=pMesh;

/* ---------- 지원 등장(카메오) : 대기 중인 동료가 잠깐 나타남 ---------- */
const cameos={};
function showCameo(id,dur){if(id===P.char)return;const a=P.ang+(id==='yeonha'?-2.2:2.2);cameos[id]={t:dur,x:P.x+Math.sin(a)*1.6,z:P.z+Math.cos(a)*1.6};const m=MESH[id];m.visible=true;m.rotation.set(0,P.ang,0);m.position.set(cameos[id].x,0,cameos[id].z);burst(cameos[id].x,1.2,cameos[id].z,CHARACTERS[id].color,14,4,0.4,0.6);}
function updateCameos(dt){for(const id in cameos){const c=cameos[id];c.t-=dt;if(id===P.char){delete cameos[id];continue;}const m=MESH[id];m.position.set(c.x,Math.sin(Math.min(1,c.t)*PI)*0.2,c.z);m.userData.piv.rotation.x=-PI*0.8;if(c.t<=0){m.visible=false;burst(c.x,1.2,c.z,CHARACTERS[id].color,8,3,0.35,0.5);delete cameos[id];}}}

/* ---------- 교대 ---------- */
function saveChar(){const m=PARTY[P.char];m.hp=P.hp;m.maxHp=P.maxHp;m.ult=P.ult;if(P.char==='yeonwoo')m.mode=P.mode;}
function loadChar(id){const m=PARTY[id];P.char=id;P.hp=m.hp;P.maxHp=m.maxHp;P.ult=m.ult;P.mode=id==='yeonwoo'?m.mode:id;
  for(const k of PARTY_ORDER){MESH[k].visible=k===id||!!cameos[k];if(k===id)delete cameos[k];}PM=MESH[id];PM.rotation.set(0,P.ang,0);
  if(id==='yeonwoo'){brushW.visible=P.mode==='brush';swordW.visible=P.mode==='sword';}}
function trySwap(idx){const id=PARTY_ORDER[idx];if(!id||!state.running||state.paused||state.mapOpen||dialogOpen||P.dead||state.win)return false;
  if(id===P.char||PARTY[id].hp<=0||P.cds.swap>0||(P.act&&P.act.name==='ult')){flashSwap(idx);return false;}
  doSwap(id,false);return true;}
function doSwap(id,forced){const ox=P.x,oz=P.z;saveChar();if(PARTY[P.char].hp>0&&!forced)burst(ox,1.1,oz,CHARACTERS[P.char].color,10,4,0.4,0.5);
  loadChar(id);P.cds.swap=CONFIG.party.swapCd;P.act=null;P.queue=null;P.stagger=0;P.lastIdx=-1;P.comboT=0;P.iframe=Math.max(P.iframe,CONFIG.party.swapIframe);if(forced)P.invuln=Math.max(P.invuln,1.5);
  stats.swaps++;tagIn(id);if(!forced)say(CHARACTERS[id].name,DIALOG.swapLines[id],1.6);}
function flashSwap(idx){const el=document.querySelector('#party .ps[data-i="'+idx+'"]');if(!el)return;el.classList.remove('no');void el.offsetWidth;el.classList.add('no');}
/* 교대 진입 공격 */
function tagIn(id){const C=CHARACTERS[id];ringFx(P.x,P.z,0.4,3.6,C.color,0.45);burst(P.x,1.2,P.z,C.color,16,6,0.45,0.6);shake(0.2);
  if(id==='yeonwoo'){skillName('교대 · 묵선 강림');for(const e of enemies){if(e.dead||dist2(P,e)>3.2+e.r)continue;const r=pdmg(10);if(!dealE(e,r.v,r.crit,'tag')||e.dead)continue;if(P.mode==='brush')mark(e,1);else if(e.stacks)bloom(e,e.stacks,1);}}
  else if(id==='yeonha'){skillName('교대 · 피리 소리 진입');for(const e of enemies){if(e.dead||dist2(P,e)>4.5+e.r)continue;const r=pdmg(6);if(dealE(e,r.v,r.crit,'tag')&&!e.dead){mark(e,1);e.slow=Math.max(e.slow||0,3);}}ringFx(P.x,P.z,0.4,4.5,0xe0405a,0.5,0.1);}
  else{skillName('교대 · 매화 낙화');for(const e of enemies){if(e.dead||dist2(P,e)>3.5+e.r)continue;const r=pdmg(8);if(dealE(e,r.v,r.crit,'tag')&&!e.dead&&e.stacks)bloom(e,e.stacks,1);}P.hp=Math.min(P.maxHp,P.hp+6);burst(P.x,1.5,P.z,0xf8f4f0,12,4,0.3,0.7);}}
/* 쓰러지면 다음 동료로 자동 교대 — 모두 쓰러지면 패배 */
function koSwap(){PARTY[P.char].hp=0;const next=PARTY_ORDER.find(id=>id!==P.char&&PARTY[id].hp>0);if(!next)return false;
  const name=CHARACTERS[P.char].name;PM.visible=false;burst(P.x,1,P.z,0x141414,20,5,0.5,0.8);P.hp=0;doSwap(next,true);
  banner(name+' 전투 불능 — '+CHARACTERS[next].name+'(으)로 교대',3,'big');return true;}
/* 궁극기 게이지: 대기 중인 동료도 일부 충전 */
function partyUltGain(v){if(!PARTY)return;for(const id of PARTY_ORDER){if(id===P.char||PARTY[id].hp<=0)continue;PARTY[id].ult=Math.min(100,PARTY[id].ult+v*CONFIG.ult.gainPerDamage*CONFIG.party.offFieldUltRate);}}

/* ---------- 매향 지원 개입 『매화혈맥진』 : 조작 캐릭터가 경직되면 자동 ---------- */
function maeIntervene(){if(P.char==='maehyang'||P.maeCd>0||!PARTY||PARTY.maehyang.hp<=0||P.dead)return;P.maeCd=CONFIG.party.maeInterveneCd;
  showCameo('maehyang',1.5);say(DIALOG.maeIntervene.n,DIALOG.maeIntervene.t,2.4);skillName('지원 · 매화혈맥진');
  P.stagger=0;P.iframe=Math.max(P.iframe,0.5);const a=P.ang+PI;
  P.act={name:'dash',t:0,dur:0.26,cancel:false,update(dt){P.x+=Math.sin(a)*2.8/0.26*dt;P.z+=Math.cos(a)*2.8/0.26*dt;}};
  needleRing(P.x,P.z,5);for(const e of enemies){if(e.dead||dist2(P,e)>5+e.r)continue;e.slow=Math.max(e.slow||0,4);}}
function needleRing(x,z,r){for(let i=0;i<8;i++){const a=i/8*TAU;const nx=x+Math.cos(a)*r*0.7,nz=z+Math.sin(a)*r*0.7;const n=new T.Mesh(new T.CylinderGeometry(0.04,0.04,1.4,5),new T.MeshBasicMaterial({color:0xf2f2e8}));n.position.set(nx,4,nz);
  addFx(n,0.5,(f,p)=>{f.obj.position.y=4-3.4*Math.min(1,p*2.5);if(p>0.4&&!f.h){f.h=1;burst(nx,0.3,nz,0x6fe0b8,4,3,0.3);}},true);}ringFx(x,z,0.5,r,0x6fe0b8,0.5);ringFx(x,z,0.5,r*0.9,0xf8f4f0,0.6,0.1);}

/* ---------- 매화 진 ---------- */
const fields=[];
function spawnField(x,z,r,t){if(fields.length>=CONFIG.party.maxFields)removeField(0);const g=new T.Group();
  g.add(new T.Mesh(flatGeo(new T.CircleGeometry(r,40)),MB(0x6fe0b8,0.16)));g.add(new T.Mesh(flatGeo(new T.RingGeometry(r-0.12,r,48)),MB(0x3fae8c,0.7)));
  const pm=new T.MeshBasicMaterial({color:0xf4c4d2});for(let i=0;i<10;i++){const a=rand(0,TAU),rr=rand(0.3,r*0.9);const pe=new T.Mesh(new T.SphereGeometry(0.07,5,4),pm);pe.scale.y=0.3;pe.position.set(Math.cos(a)*rr,0.03,Math.sin(a)*rr);g.add(pe);}
  for(let i=0;i<8;i++){const a=i/8*TAU;const n=new T.Mesh(new T.CylinderGeometry(0.025,0.025,0.6,4),new T.MeshBasicMaterial({color:0xf2f2e8}));n.position.set(Math.cos(a)*r*0.85,0.3,Math.sin(a)*r*0.85);g.add(n);}
  g.position.set(x,0.05,z);scene.add(g);fields.push({x,z,r,t,g});purify(x,z,r*0.7);burst(x,0.5,z,0x6fe0b8,10,4,0.35);}
function removeField(i){const f=fields[i];scene.remove(f.g);disposeObj(f.g,true);fields.splice(i,1);}
function maePassiveField(x,z){if(!PARTY||PARTY.maehyang.hp<=0||P.fieldCd>0)return;P.fieldCd=CONFIG.party.fieldPassiveCd;spawnField(x,z,1.8,6);}
function updateFields(dt){for(let i=fields.length-1;i>=0;i--){const f=fields[i];f.t-=dt;f.g.rotation.y+=dt*0.3;if(f.t<1)f.g.children.forEach(m=>{if(m.material.transparent)m.material.opacity*=0.95;});
  if(!P.dead&&Math.hypot(P.x-f.x,P.z-f.z)<f.r)P.hp=Math.min(P.maxHp,P.hp+CONFIG.party.fieldHeal*dt);
  for(const p of puddles)if(Math.hypot(p.x-f.x,p.z-f.z)<f.r+0.5)p.t=Math.min(p.t,0.6);
  if(f.t<=0)removeField(i);}}
function clearParty(){while(fields.length)removeField(fields.length-1);for(const id in cameos)delete cameos[id];for(const k of PARTY_ORDER){MESH[k].visible=k==='yeonwoo';MESH[k].rotation.set(0,0,0);}PM=pMesh;}

/* ---------- 연하 · 매향 스킬 (Q · E) ---------- */
function partySkill(k){const id=skillId(k);if(P.cds[id]>0||P.yr<skillCost(id))return false;P.yr-=skillCost(id);if(P.swayCtr>0){P.swayCtr=0;P.swayBoost=0.9;}
  ({h1:hJeogan,h2:hCheongan,m1:mHyeolmaek,m2:mChakgeun})[id]();P.cds[id]=CD[id];P.lastIdx=-1;return true;}
/* 연하 Q 『적안 · 경고의 음』 — 주변 적 기절 */
function hJeogan(){skillName('적안 · 경고의 음');P.act={name:'cast',t:0,dur:0.45,cancel:false,events:[{at:0.2,fn(){
  ringFx(P.x,P.z,0.5,6.5,0xe0405a,0.5);ringFx(P.x,P.z,0.5,6,0x141414,0.6,0.1);burst(P.x,1.6,P.z,0xe0405a,20,6,0.4);hitstop=0.15;
  for(const e of enemies){if(e.dead||dist2(P,e)>6.5+e.r)continue;const r=pdmg(6);if(!dealE(e,r.v,r.crit,'skill')||e.dead)continue;
    if(e.type==='boss'){if(e.runeActive)e.slow=Math.max(e.slow||0,3);else{e.action=null;cancelStrikes(e);e.stance=0;e.stun=Math.max(e.stun,1.0);}}else e.stun=Math.max(e.stun,2.2);}}}]};}
/* 연하 E 『청안 · 균열 노출』 — 대상 받는 피해 +30% · 낙인 2 · 룬 방어막 절반 파쇄 */
function hCheongan(){const t=faceTarget(12);skillName('청안 · 균열 노출');P.act={name:'cast',t:0,dur:0.4,cancel:false,events:[{at:0.18,fn(){
  if(!t||t.dead){popNum(P.x,2.4,P.z,'대상 없음','info');return;}lineFx(P.x,P.z,Math.atan2(t.x-P.x,t.z-P.z),dist2(P,t),0.25,0x4a8fe0,0.4,1.4);
  t.vuln=8;if(!t.vulnM){t.vulnM=new T.Mesh(new T.TorusGeometry(0.28,0.06,6,16),new T.MeshBasicMaterial({color:0x4a8fe0}));scene.add(t.vulnM);}mark(t,2);
  if(t.type==='boss'&&t.runeActive&&t.shield>0){t.shield*=0.5;popNum(t.x,3,t.z,'청안 — 룬 방어막 균열','info');}
  burst(t.x,2,t.z,0x4a8fe0,14,5,0.4);popNum(t.x,2.8,t.z,'균열 노출 · 받는 피해 +30%','info');}}]};}
/* 매향 Q 『매화혈맥진』 — 8침 결계 · 아군 전원 회복 · 적 둔화 */
function mHyeolmaek(){skillName('매화혈맥진');P.act={name:'cast',t:0,dur:0.5,cancel:false,events:[{at:0.2,fn(){
  needleRing(P.x,P.z,5);for(const e of enemies){if(e.dead||dist2(P,e)>5+e.r)continue;const r=pdmg(8);if(dealE(e,r.v,r.crit,'skill')&&!e.dead)e.slow=Math.max(e.slow||0,4);}
  P.hp=Math.min(P.maxHp,P.hp+P.maxHp*0.15);for(const id of PARTY_ORDER){if(id===P.char||PARTY[id].hp<=0)continue;PARTY[id].hp=Math.min(PARTY[id].maxHp,PARTY[id].hp+PARTY[id].maxHp*0.15);}
  spawnField(P.x,P.z,2.6,10);popNum(P.x,2.6,P.z,'아군 전원 체력 +15%','info');}}]};}
/* 매향 E 『생기 착근』 — 전방 개화 + 매화 진 */
function mChakgeun(){faceTarget(8);const a=P.ang,half=45*DEG;skillName('생기 착근');P.act={name:'cast',t:0,dur:0.5,cancel:false,events:[{at:0.22,fn(){
  arcTrail(P.x,P.z,a,6,half,0x6fe0b8,0.4,1.2,0.4);const cx=P.x+Math.sin(a)*3.5,cz=P.z+Math.cos(a)*3.5;
  for(const e of targetsInArc(P.x,P.z,a,6,half)){const r=pdmg(10);if(dealE(e,r.v,r.crit,'skill')&&!e.dead&&e.stacks)bloom(e,e.stacks,1.2);}
  spawnField(cx,cz,2.2,8);shake(0.2);}}]};}

/* ---------- 연하 · 매향 궁극기 (R) — v0.9: 공동 오의(Z · X · V)와 구분되는 개인 궁극기 ---------- */
function partyUlt(){P.invuln=1.6;if(P.char==='yeonha'){
  /* 연하 『쌍안 · 시공 정지』 — 오드아이 개안, 주변 적의 시간을 멈춤 */
  showCut('쌍안 · 시공 정지');
  P.act={name:'ult',t:0,dur:1.2,cancel:false,events:[{at:0.3,fn(){ringFx(P.x,P.z,1,11,0xe0405a,0.8,0.1,0.9);ringFx(P.x,P.z,1,10,0x4a8fe0,0.9,0.15,0.9);}},
    {at:0.8,fn(){state.slowT=0.5;for(const e of enemies){if(e.dead||dist2(P,e)>11)continue;const r=pdmg(18);if(!dealE(e,r.v,r.crit,'ult',GB)||e.dead)continue;e.vuln=Math.max(e.vuln||0,6);
      if(e.type==='boss'){if(e.barrier||e.runeActive)e.slow=Math.max(e.slow||0,4);else{e.action=null;cancelStrikes(e);e.stun=Math.max(e.stun,1.8);}}else e.stun=Math.max(e.stun,3.5);}
      hitstop=0.2;shake(0.4);banner('시공 정지 — 주변 적 정지 · 6초간 받는 피해 +30%',3);}}]};}
  else{
  /* 매향 『매령 회생진』 — 생명의 순환: 쓰러진 동료 부활 · 파티 회복 */
  showCut('매령 회생진');
  P.act={name:'ult',t:0,dur:1.4,cancel:false,events:[{at:0.3,fn(){needleRing(P.x,P.z,6);}},{at:1.0,fn(){let rev=0;
    for(const id of PARTY_ORDER){if(id===P.char)continue;const m=PARTY[id];if(m.hp<=0){m.hp=m.maxHp*0.5;rev++;}else m.hp=Math.min(m.maxHp,m.hp+m.maxHp*0.35);}
    P.hp=Math.min(P.maxHp,P.hp+P.maxHp*0.35);addShield(20);for(const p of puddles)p.t=Math.min(p.t,0.3);for(let i=0;i<2;i++){const a=P.ang+i*PI;spawnField(P.x+Math.sin(a)*2.5,P.z+Math.cos(a)*2.5,2.4,12);}
    ringFx(P.x,P.z,1,10,0x6fe0b8,0.9,0.1,0.9);burst(P.x,1.5,P.z,0xf8f4f0,30,7,0.5,1);hitstop=0.15;
    banner('매령 회생진 — 파티 체력 +35%'+(rev?' · 쓰러진 동료 '+rev+'명 부활':'')+' · 장판 정화',3.5);}}]};}
  return true;}

/* ---------- 파티 HUD ---------- */
(function buildPartyHud(){const box=$('party');box.innerHTML=PARTY_ORDER.map((id,i)=>{const C=CHARACTERS[id];
  return `<div class="ps" data-i="${i}" style="--c:#${C.color.toString(16).padStart(6,'0')}"><b>${i+1}</b><span class="pn">${C.name}<small>${C.role}</small></span><div class="pb"><div></div></div>${id==='yeonwoo'?'':'<div class="sb"><div></div></div>'}<i class="pu"></i>${id==='yeonha'?'<em class="jk">Z</em>':id==='maehyang'?'<em class="jk">X</em>':''}</div>`;}).join('');
  box.querySelectorAll('.ps').forEach(el=>el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();trySwap(+el.dataset.i);}));})();
function updatePartyHud(){if(!PARTY)return;const els=$('party').children;PARTY_ORDER.forEach((id,i)=>{const el=els[i],m=id===P.char?{hp:P.hp,maxHp:P.maxHp,ult:P.ult}:PARTY[id];
  setC2x(el,'on',id===P.char);setC2x(el,'ko',m.hp<=0);setC2x(el,'ult',m.ult>=100);setC2x(el,'cd',id!==P.char&&P.cds.swap>0);
  const w=(Math.max(0,m.hp)/m.maxHp*100).toFixed(0)+'%';const bar=el.querySelector('.pb>div');if(bar._w!==w){bar._w=w;bar.style.width=w;}
  if(id!=='yeonwoo'){const sv=PARTY.sup[id],sw=sv.toFixed(0)+'%',sb=el.querySelector('.sb>div');if(sb._w!==sw){sb._w=sw;sb.style.width=sw;}setC2x(el,'sup',sv>=100);}});}
function setC2x(el,c,on){const k='_'+c;if(el[k]===on)return;el[k]=on;el.classList.toggle(c,on);}
