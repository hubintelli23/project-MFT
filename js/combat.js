/* MFT 블루잉크 : 천년청묵 · js/combat.js · v1.1
   전투 판정 — 가드 · 패링(슈아 반격) · 스웨이 · 강체 · 무적 · 방어막 · 스태거(무력화) · 가드파쇄
   전투 자원 — 청명도 · 영로 · 영로화경 / 동료 지원 게이지 · 공동 오의(쌍안연화 · 녹기쌍룡 · 대지개화 · 삼라만화)
   수치는 data/config.js의 combat · resource · support · baekhwa */
'use strict';
const GB={gb:true};
const ATTACK_TYPES={
  normal:{name:'',col:0xb3242f},
  heavy:{name:'강공 — 가드해도 피해',col:0xc8432a},
  break:{name:'가드 불가',col:0x8a1f9a},
  grab:{name:'잡기 — 가드 불가',col:0x6a1f8a},
  unsway:{name:'스웨이 불가',col:0xd07a1a},
  lethal:{name:'즉사',col:0x101010},
};

/* ---------- 자원 ---------- */
function addClarity(v){if(!P)return;const before=P.clarity;P.clarity=clamp(P.clarity+v,0,100);
  if(before<100&&P.clarity>=100&&!P.hwag&&P.nokgi<=0&&P.baek<CONFIG.baekhwa.hwagNeedErosion&&!flags.clarityFull){flags.clarityFull=1;banner('청명도 가득 — 침식도가 3단계(75%) 이상이면 영로화경에 들어갑니다',3.5);}}
function addYr(v){if(P)P.yr=clamp(P.yr+v,0,CONFIG.resource.yrMax);}
function skillCost(id){return masterOn('freeYr')?0:(SKILL_COST[id]||0);}
function supGain(v){if(!PARTY||!PARTY.sup)return;for(const id of['yeonha','maehyang']){if(PARTY[id].hp<=0)continue;const b=PARTY.sup[id];PARTY.sup[id]=Math.min(100,b+v);
  if(b<100&&PARTY.sup[id]>=100&&!flags['sup_'+id]){flags['sup_'+id]=1;banner(id==='yeonha'?'연하 지원 게이지 가득 — Z: 공동 오의 (붓: 쌍안연화 / 검: 녹기쌍룡)':'매향 지원 게이지 가득 — X: 공동 오의 『만화정계 : 대지개화』',3.5);}}}

/* ---------- 영로화경 (백묵화 4단계) : 침식도 3단계 이상 + 청명도 가득 ---------- */
function enterHwag(forced){P.hwag=true;P.hwagForced=!!forced;
  banner(forced?'탁기 강제 주입 — 영로화경 폭주! 청명도가 빠르게 줄어듭니다':'영로화경 — 피해 +30% · 청명도가 다할 때까지 유지 · R로 『녹기현경』',3.8,'big');
  burst(P.x,1.2,P.z,0xffffff,24,7,0.5,0.8);ringFx(P.x,P.z,0.5,5,0xe8fff4,0.7);}
function exitHwag(penalty){if(!P.hwag)return;P.hwag=false;P.hwagForced=false;
  if(penalty&&P.drainImmune<=0){const cut=PARTY.maehyang.hp>0?1-CONFIG.party.maeDrainCut:1;const d=P.maxHp*CONFIG.baekhwa.hwagPenalty*cut;P.hp=Math.max(1,P.hp-d);P.baek=Math.max(0,P.baek-25);
    popNum(P.x,2.6,P.z,'영로화경 반동 -'+Math.round(d),'hurt');vig();banner('청명도 고갈 — 영로화경 종료 (체력 반동 · 침식도 -25)',2.8);
    if(P.hp<=P.maxHp*0.2&&P.yeonhaCd<=0&&PARTY.yeonha.hp>0)yeonhaRescue();}}
function updateHwag(dt){if(P.dead||P.char!=='yeonwoo')return;
  if(!P.hwag){if(P.nokgi<=0&&P.baek>=CONFIG.baekhwa.hwagNeedErosion&&P.clarity>=100)enterHwag(false);return;}
  if(P.drainImmune>0)return;P.clarity-=CONFIG.baekhwa.hwagDrain*(P.hwagForced?2.5:1)*dt;if(P.clarity<=0){P.clarity=0;exitHwag(true);}}

/* ---------- 강체 ---------- */
function hasArmor(){if(P.char==='yeonwoo'&&P.stage>=1)return true;const a=P.act;if(!a)return false;
  return a.name==='cast'||a.name==='ult'||a.name==='plunge'||(a.name==='atk'&&a.def&&a.def.strong);}

/* ---------- 가드 · 패링 ---------- */
function updateGuard(dt){P.parryT-=dt;P.parryCd-=dt;P.guardBroken-=dt;P.parrySeal-=dt;P.swayT-=dt;P.swayCtr-=dt;P.swayBoost-=dt;P.drainImmune-=dt;
  const blocked=P.act&&P.act.name!=='atk';
  const want=input.guardHeld&&!P.dead&&P.y<=0&&P.stagger<=0&&P.guardBroken<=0&&!blocked;
  if(want){if(!P.guarding){P.guarding=true;if(P.act&&P.act.name==='atk')P.act=null;P.queue=null;
      if(P.parryCd<=0&&P.parrySeal<=0){P.parryT=CONFIG.combat.parryWindow;P.parryCd=0.45;}
      if(!flags.guardTip){flags.guardTip=1;banner('가드 — 맞기 직전에 누르면 패링(슈아 반격) · 가드 불가(보라) 공격은 회피(스웨이)하세요',3.8);}}
    const t=autoTarget(10);if(t)P.ang=lerpAng(P.ang,Math.atan2(t.x-P.x,t.z-P.z),1-Math.exp(-15*dt));}
  else if(P.guarding)P.guarding=false;}
function srcFront(src){if(!src||src.x===undefined)return true;const a=Math.atan2(src.x-P.x,src.z-P.z);return Math.abs(angDiff(a,P.ang))<=100*DEG;}
function guardBreak(type){P.guarding=false;P.guardBroken=CONFIG.combat.guardBreakStun+0.4;popNum(P.x,2.7,P.z,type==='grab'?'잡기 — 가드 불가':'가드파쇄!','hurt');burst(P.x,1.3,P.z,0x8a1f9a,14,6,0.4);}
const COUNTER_NAME={brush:'묵막 패링 — 슈아 반격',sword:'역린의 검무 : 녹각공명',yeonha:'공명 패링 — 슈아 반격',maehyang:'침술 패링 — 슈아 반격'};
function parrySuccess(src,type){const C=CONFIG.combat;if(src&&src.onParry)src.onParry(src);P.parryT=0;P.parryCd=0;P.iframe=Math.max(P.iframe,0.3);stats.parries++;hitstop=0.14;shake(0.35);
  addClarity(CONFIG.resource.clarityParry);addYr(CONFIG.resource.yrParry);supGain(CONFIG.support.parry);skillName(COUNTER_NAME[P.mode]);
  const dmg=P.mode==='sword'?26:16;
  for(const e of targetsInArc(P.x,P.z,P.ang,3.8,PI)){const r=pdmg(dmg);if(!dealE(e,r.v,r.crit,'counter',{stg:C.parryStagger}))continue;if(e.dead)continue;
    if(P.mode==='brush')mark(e,2);if(P.mode==='yeonha')e.slow=Math.max(e.slow||0,3);
    if(e.type==='boss'){if(!(e.armorT>0)){e.action=null;cancelStrikes(e);e.stun=Math.max(e.stun,0.8);}}
    else{const a=Math.atan2(e.x-P.x,e.z-P.z);e.kx=Math.sin(a)*10;e.kz=Math.cos(a)*10;e.stun=Math.max(e.stun,1);}}
  if(P.mode==='maehyang')P.hp=Math.min(P.maxHp,P.hp+6);addShield(P.mode==='sword'?15:8);
  if(boss&&!boss.dead&&boss.id==='cheonjehyeok'&&P.mode==='sword'){addShield(15);let n=0;for(const p of puddles)if(p.kind==='flame'&&Math.hypot(p.x-P.x,p.z-P.z)<6){p.t=Math.min(p.t,0.3);n++;}popNum(P.x,2.9,P.z,'녹각공명 — 흑염 정화'+(n?' ×'+n:''),'info');}
  ringFx(P.x,P.z,0.5,3.8,0xd9fff0,0.4,1.0);burst(P.x,1.2,P.z,0x8ff0cc,22,8,0.45);
  if(boss&&boss.runeActive&&runes.length&&runes.every(r=>r.linked))breakRunes();
  if(!flags.parry){flags.parry=1;banner('패링 성공 — 슈아 반격! 적의 스태거를 크게 깎고 청명도 · 영로 · 지원 게이지가 찹니다',3.2);}}
/* ---------- 스웨이 ---------- */
function swaySuccess(src,type){P.swayT=0;P.swayCtr=CONFIG.combat.swayCounter;stats.sways++;state.slowT=0.45;skillName('스웨이');
  addClarity(CONFIG.resource.claritySway);addYr(CONFIG.resource.yrSway);supGain(CONFIG.support.sway);
  popNum(P.x,2.6,P.z,'스웨이 — 반격 기회','info');burst(P.x,1.1,P.z,0xe8fff4,14,5,0.35);afterimage();
  if(!flags.sway){flags.sway=1;banner('스웨이 성공 — '+CONFIG.combat.swayCounter+'초 안에 공격하면 피해 '+CONFIG.combat.swayBonus+'배 · 스태거 2배',3);}}

/* ---------- 피격 판정 ---------- */
function hurtPlayer(dmg,opt={}){if(state.over||state.win||P.dead)return;
  const type=opt.type||'normal',src=opt.src||null,C=CONFIG.combat;
  if(masterOn('god')){popNum(P.x,2.3,P.z,'무적','immune');return;}
  if(P.invuln>0){if(type==='lethal')popNum(P.x,2.6,P.z,'무적 — 즉사 무효','info');return;}
  if(P.iframe>0&&type!=='unsway'){if(P.swayT>0)swaySuccess(src,type);else if(type==='lethal')popNum(P.x,2.6,P.z,'무적 — 즉사 회피','info');return;}
  let d=dmg,guarded=false;
  if(P.guarding&&srcFront(src)){
    if(type==='break'||type==='grab'||type==='lethal')guardBreak(type);
    else if(P.parryT>0){parrySuccess(src,type);return;}
    else{guarded=true;d*=1-(type==='heavy'||type==='unsway'?C.guardCutHeavy:C.guardCut);popNum(P.x,2.6,P.z,'가드','immune');burst(P.x+Math.sin(P.ang)*0.6,1.3,P.z+Math.cos(P.ang)*0.6,0xe8fff4,8,4,0.3);addYr(1);}}
  if(type==='lethal'){d=P.hp+P.shield+999;showCut('즉사');}
  if(P.char==='yeonwoo'&&P.stage>=1)d*=0.9;if(inZone(P.x,P.z))d*=0.7;
  const brk=type==='break'||type==='grab';
  if(!opt.pierce&&type!=='lethal'){const mul=brk?C.breakShieldMul:1;const a=Math.min(P.shield,d*mul);P.shield-=a;d-=a/mul;if(a>0)burst(P.x,1.2,P.z,0x9ff5d6,6,4,0.3);}
  popNum(P.x,2.3,P.z,Math.round(guarded?Math.max(0,d):dmg),'hurt');
  if(d>0){P.hp-=d;stats.taken+=d;vig();shake(guarded?0.1:0.3);if(P.char==='yeonwoo')addClarity(-d*CONFIG.resource.clarityHitLoss);
    const armor=hasArmor();
    if(brk||(!guarded&&d>=6&&!armor&&!opt.noStagger)){P.stagger=brk?C.guardBreakStun:0.28;if(P.act&&(P.act.cancel!==false||brk))P.act=null;P.guarding=false;maeIntervene();}
    else if(armor&&!guarded&&d>=6&&state.time-(flags.armorT||0)>1){flags.armorT=state.time;popNum(P.x,2.9,P.z,'강체','immune');}}
  if(opt.onHit)opt.onHit();
  if(P.hp<=P.maxHp*0.2&&P.hp>0&&P.yeonhaCd<=0&&PARTY.yeonha.hp>0)yeonhaRescue();
  if(P.hp<=0){P.hp=0;if(!koSwap())gameOver();}}
function burnPlayer(dps,dt){if(P.dead||P.invuln>0||P.taintImmune>0||masterOn('god'))return;P.burnT=(P.burnT||0)-dt;if(P.burnT>0)return;P.burnT=0.5;
  const d=dps*0.5;P.hp-=d;stats.taken+=d;popNum(P.x,2.2,P.z,Math.round(d)||1,'hurt');if(P.hp<=P.maxHp*0.2&&P.hp>0&&P.yeonhaCd<=0&&PARTY.yeonha.hp>0)yeonhaRescue();if(P.hp<=0){P.hp=0;if(!koSwap())gameOver();}}

/* ---------- 스태거 · 무력화 (적) ---------- */
function staggerHit(e,v,extra){if(e.dead||!e.stgMax||e.groggy>0)return;const C=CONFIG.combat;let s=extra&&extra.stg!==undefined?extra.stg:v*C.staggerPerDmg;
  if(extra&&extra.gb){s=s*C.gbStaggerMul+C.gbStaggerFlat;if(e.armorT>0){e.armorT=0;popNum(e.x,3,e.z,'강체 파괴!','info');burst(e.x,1.6,e.z,0xf2d36b,18,7,0.45);if(e.type==='boss'){e.action=null;cancelStrikes(e);e.stun=Math.max(e.stun,0.9);}}}
  else if(e.armorT>0)s*=C.armorStaggerMul;
  if(P.swayBoost>0)s*=2;
  e.stg-=s;e.barDirty=true;if(e.stg<=0){e.stg=0;groggy(e);}}
function groggy(e){const C=CONFIG.combat,isB=e.type==='boss';e.groggy=isB?C.groggyTime:C.mobGroggyTime;e.stun=Math.max(e.stun,e.groggy);stats.groggy++;
  if(isB){e.action=null;cancelStrikes(e);e.stance=0;e.pulling=0;e.armorT=0;banner('무력화! '+BOSSES[e.id].name+' — '+C.groggyTime+'초간 받는 피해 '+C.groggyDamageMul+'배',2.6,'big');hitstop=0.15;shake(0.4);}
  popNum(e.x,3,e.z,'무력화','info');burst(e.x,1.5,e.z,0xf2d36b,16,6,0.4);supGain(CONFIG.support.groggy);addClarity(CONFIG.resource.clarityGroggy);}
function updateEnemyCombat(e,dt){if(e.groggy>0){e.groggy-=dt;if(e.groggy<=0){e.stg=e.stgMax;e.barDirty=true;}}if(e.armorT>0)e.armorT-=dt;if(e.samra>0)e.samra-=dt;}
function breakBarrier(b){if(!b||b.dead)return false;if(b.runeActive&&runes.length){breakRunes();return true;}if(b.barrier){if(b.id==='baekjin')bjBreakBarrier(b);else if(BOSS_BREAK[b.id])BOSS_BREAK[b.id](b);else bossShatter(b,BOSSES[b.id].brokenStun||5,'결계 파쇄');return true;}return false;}

/* ---------- 공동 오의 ---------- */
function canJoint(k){if(!PARTY||!state.running||P.dead||P.char!=='yeonwoo')return false;const S=PARTY.sup;
  if(k==='yeonha')return PARTY.yeonha.hp>0&&S.yeonha>=100;
  if(k==='mae')return PARTY.maehyang.hp>0&&S.maehyang>=100;
  return !PARTY.samraUsed&&(P.baek>=75||P.hwag||P.nokgi>0)&&PARTY.yeonha.hp>0&&PARTY.maehyang.hp>0&&S.yeonha>=100&&S.maehyang>=100;}
function jointWhyNot(k){if(P.char!=='yeonwoo')return '공동 오의는 연우를 조작할 때만 쓸 수 있습니다';
  if(k==='all'){if(PARTY.samraUsed)return '삼라만화는 전투당 1회';if(!(P.baek>=75||P.hwag||P.nokgi>0))return '침식도 3단계 이상 필요';return '연하 · 매향 지원 게이지 모두 가득 필요';}
  return (k==='yeonha'?'연하':'매향')+' 지원 게이지가 가득 차야 합니다';}
function tryJoint(k){if(!state.running||state.paused||state.mapOpen||dialogOpen||P.dead||state.win)return false;if(P.seal>0){popNum(P.x,2.6,P.z,'봉인 — '+(P.sealName||'단절'),'immune');return false;}
  if(P.act&&P.act.name==='ult'){return false;}
  if(!canJoint(k)){popNum(P.x,2.6,P.z,jointWhyNot(k),'info');flashBtn(k==='yeonha'?'j1':k==='mae'?'j2':'j3');return false;}
  P.act=null;P.queue=null;P.guarding=false;stats.joints++;
  if(k==='yeonha'){PARTY.sup.yeonha=0;showCameo('yeonha',2.2);P.mode==='sword'?jointNokgiSsangryong():jointSsangan();}
  else if(k==='mae'){PARTY.sup.maehyang=0;showCameo('maehyang',2.2);jointDaeji();}
  else{PARTY.sup.yeonha=0;PARTY.sup.maehyang=0;PARTY.samraUsed=true;showCameo('yeonha',3);showCameo('maehyang',3);jointSamra();}
  return true;}
/* 연우 & 연하 — 붓 오의 『쌍안연화 : 적청인과록』 */
function jointSsangan(){P.invuln=1.6;showCut('쌍안연화 : 적청인과록');const cx=P.x+Math.sin(P.ang)*3,cz=P.z+Math.cos(P.ang)*3;
  P.act={name:'ult',t:0,dur:1.3,cancel:false,events:[{at:0.3,fn(){ringFx(cx,cz,1,12,0xe0405a,0.9,0.1,0.9);ringFx(cx,cz,1,11,0x4a8fe0,1.0,0.15,0.9);vortexFx(cx,cz,8);}},
    {at:1.0,fn(){for(const e of enemies){if(e.dead||Math.hypot(e.x-cx,e.z-cz)>12)continue;const r=pdmg(24);if(!dealE(e,r.v,r.crit,'ult',GB)||e.dead)continue;
      if(e.type!=='boss'){e.pull={x:cx,z:cz,t:0.5};e.root=Math.max(e.root,3);}else e.slow=Math.max(e.slow||0,3);mark(e,5);e.vuln=Math.max(e.vuln||0,6);}
      PARTY.critNext=true;hitstop=0.2;shake(0.5);banner('적청인과록 — 낙인 5중첩 · 속성 저항 0 · 검 첫 참격 치명타 100%',3.5);}}]};}
/* 연우 & 연하 — 검 오의 『녹기쌍룡 : 연하정화참』 */
function jointNokgiSsangryong(){P.invuln=1.8;showCut('녹기쌍룡 : 연하정화참');const a=P.ang,cx=P.x,cz=P.z;
  P.act={name:'ult',t:0,dur:1.4,cancel:false,events:[{at:0.35,fn(){mandalaFx(cx,cz);}},
    {at:0.95,fn(){arcTrail(cx,cz,a+0.6,10,1.1,0xe0405a,1.2,1.2,0.6);arcTrail(cx,cz,a-0.6,10,1.1,0x4a8fe0,1.1,1.2,0.6);arcTrail(cx,cz,a,10,1.3,0x6fe0b8,1.0,0.8,0.6);
      for(const e of enemies){if(e.dead||dist2(P,e)>12)continue;if(e.type==='boss'){e.shield=0;breakBarrier(e);if(e.guardFront)e.guardDown=Math.max(e.guardDown||0,BOSSES.baekjin.guardDownTime);}
        const r=pdmg(55);if(dealE(e,r.v,r.crit,'ult',{gb:true,pierce:true})&&!e.dead&&e.stacks)bloom(e,e.stacks,1.3);}
      P.drainImmune=15;hitstop=0.25;shake(0.7);burst(cx,1.5,cz,0x6fe0b8,30,9,0.5,1);
      banner('연하정화참 — 보스 방어막 · 가드 파쇄 · 15초간 영로화경 청명도 감소 · 반동 면역',3.5);}}]};}
/* 연우 & 매향 — 『만화정계 : 대지개화』 */
function jointDaeji(){P.invuln=1.6;showCut('만화정계 : 대지개화');
  P.act={name:'ult',t:0,dur:1.4,cancel:false,events:[{at:0.3,fn(){needleRing(P.x,P.z,8);}},{at:1.0,fn(){
    for(const p of puddles)p.t=Math.min(p.t,0.3);for(let i=0;i<3;i++){const a=P.ang+i*TAU/3;spawnField(P.x+Math.sin(a)*3,P.z+Math.cos(a)*3,2.4,12);}
    P.maeBuff=10;P.hp=Math.min(P.maxHp,P.hp+P.maxHp*0.2);
    for(const e of enemies){if(e.dead||dist2(P,e)>10)continue;const r=pdmg(20);if(dealE(e,r.v,r.crit,'ult',GB)&&!e.dead&&e.stacks)bloom(e,e.stacks,1.5);}
    ringFx(P.x,P.z,1,12,0x6fe0b8,0.9,0.1,0.9);burst(P.x,1.5,P.z,0xf4c4d2,30,8,0.5,1);hitstop=0.2;shake(0.5);
    banner('대지개화 — 10초간 모든 공격 최대 개화 · 치명타 100% · 탁기/흑염 장판 소멸',3.5);}}]};}
/* 삼인 공동 오의 — 『삼라만화 : 개화』 */
function jointSamra(){P.invuln=3.2;showCut('삼라만화 : 개화');const cx=P.x+Math.sin(P.ang)*3,cz=P.z+Math.cos(P.ang)*3;
  P.act={name:'ult',t:0,dur:3.0,cancel:false,events:[
    {at:0.1,fn(){skillName('연하 — 관측과 차원 둔화');for(const e of enemies){if(e.dead)continue;e.stun=Math.max(e.stun,3.2);if(e.type==='boss'){e.action=null;cancelStrikes(e);}}
      while(strikes.length)removeStrike(strikes.length-1);ringFx(P.x,P.z,1,16,0x4a8fe0,0.8,0.2,0.8);state.slowT=0.6;}},
    {at:1.0,fn(){skillName('매향 — 대지 침술과 생기 구속');needleRing(cx,cz,7);for(const e of enemies){if(e.dead||e.type==='boss'||isRune(e))continue;e.pull={x:cx,z:cz,t:0.6};}
      for(const p of puddles)p.t=Math.min(p.t,0.2);waves.forEach(w=>{scene.remove(w.m);});waves.length=0;if(typeof clearCjRings==='function')clearCjRings();}},
    {at:2.0,fn(){skillName('연우 — 만묵형상 멸쇄 참격');mandalaFx(cx,cz);}},
    {at:2.6,fn(){for(const e of enemies){if(e.dead)continue;if(e.type==='boss'){e.shield=0;breakBarrier(e);}
        const r=pdmg(90);if(dealE(e,r.v,r.crit,'ult',{gb:true,pierce:true})&&!e.dead){if(e.stacks)bloom(e,e.stacks,1.5);e.samra=15;}}
      P.taintImmune=20;P.drainImmune=20;P.stagger=0;
      for(let i=0;i<20;i++){const a=rand(0,TAU),rr=rand(0,12);purify(cx+Math.cos(a)*rr,cz+Math.sin(a)*rr,rand(1.8,3));}
      ringFx(cx,cz,1,18,0x6fe0b8,1.0,0.1,0.95);burst(cx,2,cz,0xf4c4d2,40,10,0.6,1.2);hitstop=0.35;shake(0.9);
      banner('삼라만화 : 개화 — 보스 방어 관통 · 15초간 적 받는 피해 1.5배 · 20초간 상태 이상 면역',4,'big');}}]};}
