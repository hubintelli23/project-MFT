/* MFT 블루잉크 : 천년청묵 · js/bosses/igyeom.js · v1.0
   보스: 이겸 — 은리 가주 · 절대 판결의 대법관 (청회원)
   체험 요소: 금제(공격 금지 · 이동 금지 · 전환/교대 금지 — 어기면 번개 체력 30%), 단죄의 사슬(잡기 · 가드 불가 → 스웨이),
             경계 단죄(멀어지면 끌어당김), 2페이즈 절대 법정(스웨이 불가 중참격 → 가드 · 패링), 단죄 룬(룬의 번개를 패링해야 파괴)
   수치는 data/enemies.js의 BOSSES.igyeom */
'use strict';
const IGD=()=>BOSSES.igyeom;
const RULE_NAME={atk:'공격 금지',move:'이동 금지',sw:'전환 · 교대 금지'};
BOSS_INIT.igyeom=function(b){b.ruleT=7;b.rule=null;b.barrierName='해태의 단죄 결계';b.boltT=2;
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('이겸 — 머리 위에 금제가 뜨면 그 행동을 멈추세요. 어기면 번개가 떨어집니다',5);});};
function igStartRule(b){const D=IGD();const ks=['atk','move','sw'].filter(k=>!(b.rule&&b.rule.k===k)&&!(k==='sw'&&P.char!=='yeonwoo'&&false));const k=ks[Math.floor(Math.random()*ks.length)];
  b.rule={k,t:D.ruleTime,x:P.x,z:P.z,sw:state.lastSwT||0};b.lastRule=k;b.ruleT=D.ruleInterval*(b.barrier?0.6:1);showCut('금제 — '+RULE_NAME[k]);
  banner('금제(禁制) 「'+RULE_NAME[k]+'」 '+D.ruleTime+'초 — 어기면 번개!',D.ruleTime,'big');ringFx(P.x,P.z,0.4,2.2,0xf0e08a,0.5);}
function igViolate(b){const D=IGD();const k=b.rule.k;b.rule=null;showCut('단죄');popNum(P.x,3,P.z,'금제 위반 — '+RULE_NAME[k],'hurt');
  for(let i=0;i<3;i++)burst(P.x,3-i,P.z,0xfff4a0,10,4,0.35);lineFx(P.x,P.z-0.01,0,0.02,0.5,0xfff4a0,0.3,0.3);shake(0.5);
  const g=P.guarding;P.guarding=false;hurtPlayer(P.maxHp*D.rulePenalty,{type:'unsway',pierce:true,noStagger:false});P.guarding=g&&input.guardHeld;}
function igRuleUpdate(b,dt){const R=b.rule;if(!R)return;R.t-=dt;
  if(R.k==='move'&&Math.hypot(P.x-R.x,P.z-R.z)>1.3){igViolate(b);return;}
  if(R.k==='sw'&&(state.lastSwT||0)!==R.sw){igViolate(b);return;}
  if(R.t<=0){b.rule=null;popNum(P.x,2.8,P.z,'금제 준수','info');addClarity(10);supGain(6);}}
BOSS_HIT.igyeom=function(b,v,src){if(b.rule&&b.rule.k==='atk'&&src!=='counter'){igViolate(b);return false;}};
function igChain(b,auto){faceP(b);bAct(b,'chain',1.2,[[0,()=>{faceP(b);strike({owner:b,kind:'line',x:b.x,z:b.z,ang:b.ang,len:auto?16:10,w:1.6,tell:auto?0.7:0.6,dmg:IGD().damage.chain,type:'grab',color:0xd8c860,
  onHitP:()=>{const a=b.ang;P.x=b.x+Math.sin(a)*1.6;P.z=b.z+Math.cos(a)*1.6;P.stagger=0.8;burst(P.x,1.2,P.z,0xc8c8c0,12,5,0.35);},
  onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,0.4,0xc8c8c0,0.5,0.4);}});}]]);bossCall(auto?'경계 단죄 — 사슬':'단죄의 사슬 — 잡기');}
function igSmash(b){bAct(b,'smash',1.5,[[0,()=>{b.armorT=0.9;strike({owner:b,kind:'circle',x:b.x,z:b.z,r:4.3,tell:0.85,dmg:IGD().damage.smash,type:'heavy',color:0xd8c860,
  onFire:o=>{ringFx(o.x,o.z,0.6,4.8,0xfff4a0,0.5,0.3);for(let i=0;i<8;i++)burst(o.x+Math.cos(i*0.8)*3,0.5,o.z+Math.sin(i*0.8)*3,0xfff4a0,4,5,0.3);shake(0.45);}});}]]);bossCall('법도 내리치기 — 뇌전 충격파');}
function igVerdict(b){bAct(b,'verdict',1.1,[[0,()=>{faceP(b);strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:4.2,half:70*DEG,tell:0.55,dmg:IGD().damage.verdict,
  onFire:o=>{arcTrail(o.x,o.z,o.ang,4.2,o.half,0xf0e8b0,1.2,0.9);}});}]]);bossCall('판결 베기');}
function igCourt(b){b.armorT=1.4;bAct(b,'court',2.0,[[0,()=>{faceP(b);strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:6.5,half:95*DEG,tell:1.0,dmg:IGD().damage.court,type:'unsway',
  onFire:o=>{arcTrail(o.x,o.z,o.ang,6.5,o.half,0xfff4a0,1.4,1.2);shake(0.5);}});
  for(let i=0;i<4;i++){const x=clamp(P.x+rand(-6,6),-13,13),z=clamp(P.z+rand(-6,6),-13,13);strike({owner:b,kind:'circle',x,z,r:1.5,tell:1.2+i*0.15,dmg:IGD().damage.bolt,color:0xd8c860,onFire:o=>{burst(o.x,2,o.z,0xfff4a0,10,6,0.35);}});}}]]);
  bossCall('절대 법정 — 회피 불가 중참격');if(!flags.igCourt){flags.igCourt=1;banner('절대 법정 — 주황 범위는 회피 무적으로 못 피합니다. 가드 · 패링!',3.5);}}
function igPhase2(b){b.p2=true;b.invulnT=1.4;cancelStrikes(b);showCut('절대 법정');bAct(b,'p2',1.6,[[0.7,()=>{ringFx(b.x,b.z,1,10,0xfff4a0,0.7,0.2,0.9);burst(b.x,2,b.z,0xfff4a0,26,8,0.5);}]]);
  banner('2페이즈 — 은빛 뇌전 결계 · 회피 불가 중참격',3);}
function igRunePhase(b){const D=IGD();b.barrier=true;cancelStrikes(b);b.action=null;b.dash={x:0,z:0,t:0.6};b.boltT=2.5;b.ruleT=3;
  bAct(b,'rune',2.0,[[0.7,()=>{for(const[x,z]of ringPts(2,9,0)){const r=spawnBossRune(x,z,{hp:D.runeHp,req:'parry',label:'단죄 룬',avatar:'runestone',col:0xf0e08a,onBreak:igRuneBroken});r.onParry=igBoltParried;}showCut('해태의 단죄 룬 (雷)');}],
    [1.3,()=>banner('파회법 — 단죄 룬이 쏘는 번개를 룬 쪽을 보고 패링(C)하세요. 룬마다 2번 패링하면 과부하로 부서집니다',6,'big')]]);}
function igBoltParried(r){if(!r.dead){popNum(r.x,3,r.z,'번개 반사 — 과부하','info');lineFx(P.x,P.z,Math.atan2(r.x-P.x,r.z-P.z),Math.hypot(r.x-P.x,r.z-P.z),0.4,0xfff4a0,0.4,0.6);runeHit(r,'parry');}}
function igRuneBroken(r){const b=boss;if(!b||b.id!=='igyeom'||!b.barrier)return;ringFx(r.x,r.z,0.5,3,0xfff4a0,0.5);burst(r.x,1.6,r.z,0xfff4a0,20,7,0.45);
  const left=enemies.filter(e=>isRune(e)&&!e.dead).length;if(left<=0){b.rule=null;bossShatter(b,IGD().brokenStun,'파회 — 단죄 룬 과부하');}else popNum(b.x,3.2,b.z,'단죄 룬 남은 수 '+left,'info');}
function igBolts(b,dt){b.boltT-=dt;if(b.boltT>0)return;b.boltT=IGD().boltInterval;const rs=enemies.filter(e=>isRune(e)&&!e.dead);if(!rs.length)return;const r=rs[Math.floor(Math.random()*rs.length)];
  lineFx(r.x,r.z,Math.atan2(P.x-r.x,P.z-r.z),Math.hypot(P.x-r.x,P.z-r.z),0.15,0xfff4a0,0.25,0.75);
  strike({owner:r,kind:'circle',x:P.x,z:P.z,r:1.4,tell:0.8,dmg:IGD().damage.bolt,color:0xd8c860,onFire:o=>{burst(o.x,2,o.z,0xfff4a0,12,6,0.35);}});}
BOSS_AI.igyeom=function(b,dt){const D=IGD();
  igRuleUpdate(b,dt);
  if(bossCommon(b,dt))return;
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){igPhase2(b);return;}
  if(!b.action&&!b.runeDone&&!b.barrier&&b.hp<=b.maxHp*D.runePhaseAt){igRunePhase(b);return;}
  if(b.barrier)igBolts(b,dt);
  if(!b.rule){b.ruleT-=dt;if(b.ruleT<=0&&!b.action){igStartRule(b);}}
  if(b.action){runBossAction(b,dt);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,4,3);
  if(d>D.pullRange&&!b.barrier){b.cd=1;igChain(b,true);return;}
  b.cd-=dt*(b.rule?0.6:1);if(b.cd<=0&&!P.dead){const opts=d>6?[['chain',3],['smash',0.5]]:[['verdict',3],['smash',2],['chain',1.5]];if(b.p2)opts.push(['court',1.8]);
    const pick=pickWeighted(b,opts);({verdict:igVerdict,smash:igSmash,chain:b=>igChain(b,false),court:igCourt})[pick](b);}};
BOSS_ANIM.igyeom=function(b,dt){animHumanBoss(b,dt);const u=b.mesh.userData;u.ruleM.material.opacity=b.rule?0.55+0.2*Math.sin(state.time*10):0;};
BOSS_DEFEAT.igyeom=function(b){b.rule=null;};
