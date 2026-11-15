/* MFT 인화순환록 · js/player.js · v0.3
   연우의 행동 · 스킬 · 전환 · 점프 · 궁극기 */
'use strict';
/* ================= 플레이어 수치 ================= */
function stageOf(){return P.baek>=100?4:Math.floor(P.baek/25);}
function atkSpd(){return(P.stage>=3?1.25:1)*(P.critBuff>0?1.15:1);}
function pdmg(base,critAdd=0){let m=1;if(P.stage>=4)m*=1.3;const cc=0.08+critAdd+(P.stage>=2?0.2:0)+(P.critBuff>0?0.35:0);const crit=Math.random()<cc;return{v:base*m*(crit?1.7:1)*rand(0.92,1.08),crit};}
function addShield(v){P.shield=Math.min(P.maxShield,P.shield+v);}
function addBaek(v){if(P.baek>=100)return;P.baek=Math.min(100,P.baek+v);if(P.baek>=100){P.hwagT=CONFIG.baekhwa.hwagyeongTime;banner('백묵화 4단계 — 영로 화경! 피해 +30% · '+CONFIG.baekhwa.hwagyeongTime+'초 후 체력 침식 · 궁극기로 초기화',3.8,'big');burst(P.x,1.2,P.z,0xffffff,24,7,0.5,0.8);ringFx(P.x,P.z,0.5,5,0xe8fff4,0.7);}}
function inPuddle(){if(P.taintImmune>0)return false;for(const p of puddles)if(Math.hypot(P.x-p.x,P.z-p.z)<p.r)return true;return false;}
function inZone(x,z){for(const zn of zones)if(Math.hypot(x-zn.x,z-zn.z)<zn.r)return true;return false;}

function mark(e,n){if(e.dead)return;if(e.type==='boss'&&e.runeActive){if(state.time-(e.washT||0)>1.5){e.washT=state.time;popNum(e.x,2.8,e.z,'낙인이 물에 씻겨나감','immune');}return;}
  e.stacks=Math.min(5,e.stacks+n);e.stackT=9;e.barDirty=true;burst(e.x,(e.y||0)+1,e.z,0x141414,3,3,0.3,0.4);
  if(e.stacks>=3&&!flags.t3&&P.mode==='brush'){flags.t3=1;banner('낙인 3중첩! 【전환】으로 검 모드 → 검으로 베어 개화시키세요',4);}}
function bloom(e,count,mult=1){if(count<=0||e.dead)return;count=Math.min(count,e.stacks);if(count<=0)return;e.stacks-=count;e.barDirty=true;
  let base=count*11*mult;if(inFog(e)){base*=0.5;if(!flags.fog){flags.fog=1;banner('묵식귀의 탁기 안개 — 안개 속 적은 정화 피해 50% 감소! 묵식귀부터 베세요',3.5);}}
  const r=pdmg(base);dealE(e,r.v,r.crit,'bloom');
  const ex=e.x,ey=(e.y||0)+1,ez=e.z;
  burst(ex,ey,ez,0x6fe0b8,6+count*3,6,0.45,0.6);burst(ex,ey,ez,0xf4c4d2,count*2,4,0.3,0.7);ringFx(ex,ez,0.4,1.2+count*0.5,0x3fae8c,0.45);
  purify(ex+rand(-0.5,0.5),ez+rand(-0.5,0.5),1+count*0.35);
  const yr=count*(count>=3?1.5:1);
  addBaek(yr*2.4);addShield(count*3);P.hp=Math.min(P.maxHp,P.hp+count*0.6);P.sw=Math.min(100,P.sw+count*3);
  stats.blooms++;popNum(ex,ey+0.9,ez,'개화 ×'+count,'bloomTxt');
  if(!flags.bloom){flags.bloom=1;banner('개화! 낙인을 터뜨리면 방어막·체력·백묵화 게이지가 찹니다',3.2);}}
function dealE(e,v,crit,src){if(e.dead)return false;
  if(e.type==='boss'){
    if(e.invulnT>0||e.intro){popNum(e.x,2.6,e.z,'무효','immune');return false;}
    if(e.stance>0&&src==='melee'){bossCounter(e);return false;}
    if(e.runeActive)v*=1-BOSS.runeDamageCut;if(e.broken>0)v*=BOSS.brokenDamageMul;
    if(e.shield>0){const a=Math.min(e.shield,v);e.shield-=a;v-=a;if(v<=0){if(state.time-(e.absT||0)>0.4){e.absT=state.time;popNum(e.x,2.6,e.z,'룬 방어막','immune');}return true;}}
  }
  v=Math.max(1,Math.round(v));e.hp-=v;e.flash=0.08;e.barDirty=true;stats.dmg+=v;P.ult=Math.min(100,P.ult+v*CONFIG.ult.gainPerDamage);
  popNum(e.x,(e.y||0)+1.6+rand(0,0.5),e.z,v,crit?'crit':'');
  if(e.hp<=0)killE(e);return true;}
function killE(e,self){e.dead=true;e.hp=0;stats.kills++;
  if(e.bar){scene.remove(e.bar.s);e.bar.tex.dispose();e.bar.s.material.dispose();e.bar=null;}
  if(e.rootM){scene.remove(e.rootM);}
  if(e.fog){scene.remove(e.fog);e.fog=null;}
  if(e.type==='rusher')addPuddle(e.x,e.z);
  if(e.type==='boss'){bossDefeated(e);return;}
  e.dying=0.4;
  if(!self){burst(e.x,(e.y||0)+0.8,e.z,0x141414,14,6,0.5);burst(e.x,(e.y||0)+0.8,e.z,0x6fe0b8,10,5,0.4);purify(e.x,e.z,1.8);}}

/* ================= 피격 ================= */
function hurtPlayer(dmg,opt={}){if(state.over||state.win||P.dead)return;
  if(P.parry>0&&P.mode==='sword'){ryeokrin();return;}
  if(P.iframe>0||P.invuln>0)return;
  let d=dmg;if(P.stage>=1)d*=0.9;if(inZone(P.x,P.z))d*=0.7;
  if(!opt.pierce){const a=Math.min(P.shield,d);P.shield-=a;d-=a;if(a>0)burst(P.x,1.2,P.z,0x9ff5d6,6,4,0.3);}
  popNum(P.x,2.3,P.z,Math.round(dmg),'hurt');
  if(d>0){P.hp-=d;stats.taken+=d;vig();shake(0.3);if(d>=6&&P.stage<1&&!opt.noStagger){P.stagger=0.28;if(P.act&&P.act.cancel!==false)P.act=null;}}
  if(P.hp<=P.maxHp*0.2&&P.hp>0&&P.yeonhaCd<=0)yeonhaRescue();
  if(P.hp<=0){P.hp=0;gameOver();}}
function yeonhaRescue(){P.hp=Math.min(P.maxHp,P.hp+P.maxHp*CONFIG.yeonha.heal);if(P.baek>50)P.baek=50;P.hwagT=0;P.invuln=CONFIG.yeonha.invuln;P.yeonhaCd=CONFIG.yeonha.cooldown;
  say(DIALOG.yeonhaRescue.n,DIALOG.yeonhaRescue.t,3.5);banner('연하 — 생기 인화의 음률 (체력 회복 · 백묵화 2단계로 차감 · 3초 무적)',3);
  ringFx(P.x,P.z,0.5,4,0xf4a6c0,0.7);burst(P.x,1.4,P.z,0xf4a6c0,20,5,0.45,0.8);}
function ryeokrin(){P.parry=0;P.iframe=0.45;stats.parries++;hitstop=0.14;shake(0.35);skillName('역린의 검무 : 녹각공명');
  for(const e of targetsInArc(P.x,P.z,P.ang,3.8,PI)){const r=pdmg(26);dealE(e,r.v,r.crit,'counter');if(e.dead)continue;if(e.type==='boss'){e.action=null;cancelStrikes(e);e.stun=Math.max(e.stun,0.9);}else{const a=Math.atan2(e.x-P.x,e.z-P.z);e.kx=Math.sin(a)*10;e.kz=Math.cos(a)*10;}}
  addShield(15);ringFx(P.x,P.z,0.5,3.8,0xd9fff0,0.4,1.0);burst(P.x,1.2,P.z,0x8ff0cc,22,8,0.45);
  if(boss&&boss.runeActive&&runes.length&&runes.every(r=>r.linked))breakRunes();}

/* ================= 플레이어 행동 ================= */
const DEG=PI/180;
function faceTarget(range){const t=autoTarget(range);if(t)P.ang=Math.atan2(t.x-P.x,t.z-P.z);else if(input.mag>0.2)P.ang=Math.atan2(input.mx,input.mz);return t;}
function startAttack(def,idx){const tgt=faceTarget(9);const sp=atkSpd();const dur=def.dur/sp,hitAt=def.hit/sp;
  if(def.n)skillName(def.n);
  P.act={name:'atk',def,idx,t:0,dur,hitAt,tgt,
    update(dt,a){if(a.t<a.hitAt&&def.lunge){if(!(a.tgt&&!a.tgt.dead&&dist2(P,a.tgt)<a.tgt.r+1.4)){const v=def.lunge/a.hitAt*dt;P.x+=Math.sin(P.ang)*v;P.z+=Math.cos(P.ang)*v;}}},
    events:(def.hits||[def.hit]).map(h=>({at:h/sp,fn:()=>performHit(def)})),end(){P.comboT=0.45;}};
  P.lastIdx=idx;}
function performHit(def){
  const brush=P.mode==='brush';const range=def.range*(brush&&P.rangeBuff>0?1.7:1);const half=def.half*DEG;
  const col=brush?0x1c1c1c:0xd9fff0,col2=brush?0x3fae8c:0x8ff0cc;
  if(def.cross){arcTrail(P.x,P.z,P.ang+0.5,range,0.7,col,1.1,0.5);arcTrail(P.x,P.z,P.ang-0.5,range,0.7,col2,1.0,0.5);}
  else{arcTrail(P.x,P.z,P.ang,range,half,col,def.vert?0.5:1.0,brush?0.9:0.5);if(brush)arcTrail(P.x,P.z,P.ang,range*0.85,half,col2,0.95,0.25);}
  if(def.half>=180){ringFx(P.x,P.z,1,range,0x1c1c1c,0.4);burst(P.x,0.6,P.z,0x3fae8c,16,7,0.4);burst(P.x,0.8,P.z,0xf4c4d2,8,5,0.3);}
  const hits=targetsInArc(P.x,P.z,P.ang,range,half);
  for(const e of hits){const r=pdmg(def.dmg,def.critAdd||0);if(!dealE(e,r.v,r.crit,'melee'))continue;if(e.dead)continue;
    burst(e.x,(e.y||0)+1,e.z,brush?0x141414:0xe8fff4,4,4,0.3,0.35);
    if(def.mark)mark(e,def.mark);
    if(e.type!=='boss'){
      if(def.root)e.root=Math.max(e.root,def.root);
      if(def.pull)e.pull={x:P.x+Math.sin(P.ang)*2.2,z:P.z+Math.cos(P.ang)*2.2,t:0.25};
      if(def.kb){const a=Math.atan2(e.x-P.x,e.z-P.z);e.kx=Math.sin(a)*def.kb*2;e.kz=Math.cos(a)*def.kb*2;}
      if(def.launch)e.lift=0.6;}
    if(def.bloom)bloom(e,Math.min(def.bloom,e.stacks),1);
    if(def.bloomAll){const n=e.stacks;if(n>0){bloom(e,n,def.bloomAll);if(def.shieldPer)addShield(n*def.shieldPer);}}}
  if(runes.length)for(const rn of runes)if(!rn.linked&&inArcPt(rn.x,rn.z,rn.r,P.x,P.z,P.ang,range,half))runeHint(rn);
  if(hits.length){P.sw=Math.min(100,P.sw+(brush?5:4)*hits.length);hitstop=Math.max(hitstop,def.strong?0.07:0.035);shake(def.strong?0.25:0.1);if(def.shield)addShield(def.shield);}}
function runeHint(rn){if(state.time-(flags.runeHint||0)<3)return;flags.runeHint=state.time;popNum(rn.x,2.6,rn.z,'룬은 붓 [묵향결쇄]의 먹선으로만 오염된다','info');}

function startPlunge(){const brush=P.mode==='brush';faceTarget(6);P.vy=-24;P.lastIdx=-1;skillName(brush?'비취묵파':'백아강하참');P.act={name:'plunge',t:0,dur:3,cancel:false,brush};P.iframe=Math.max(P.iframe,0.15);}
function land(){ringFx(P.x,P.z,0.3,1.4,0x8a857c,0.3);const a=P.act;if(a&&a.name==='plunge'){P.act={name:'cast',t:0,dur:0.28,cancel:false};plungeHit(a.brush);}}
function plungeHit(brush){
  if(brush){for(const e of enemies){if(e.dead||dist2(P,e)>4.2+e.r)continue;const r=pdmg(9);if(dealE(e,r.v,r.crit,'melee')&&!e.dead)mark(e,1);}
    addShield(10);ringFx(P.x,P.z,0.5,4.2,0x141414,0.45);ringFx(P.x,P.z,0.5,3.6,0x3fae8c,0.5,0.1);burst(P.x,0.4,P.z,0x141414,20,8,0.45);burst(P.x,0.4,P.z,0x6fe0b8,12,6,0.4);purify(P.x,P.z,2.2);shake(0.3);hitstop=0.06;}
  else{const half=50*DEG;arcTrail(P.x,P.z,P.ang,3.8,half,0xd9fff0,0.5,1.0,0.35);lineFx(P.x,P.z,P.ang,3.8,0.5,0xffffff,0.35,0.3);burst(P.x+Math.sin(P.ang)*2,0.4,P.z+Math.cos(P.ang)*2,0xe8fff4,16,8,0.4);
    for(const e of enemies){if(e.dead)continue;if(!(inArcPt(e.x,e.z,e.r,P.x,P.z,P.ang,3.8,half)||dist2(P,e)<e.r+1.4))continue;const r=pdmg(22);if(!dealE(e,r.v,r.crit,'melee')||e.dead)continue;
      if(e.stacks)bloom(e,e.stacks,1.3);if(!e.dead&&e.type!=='boss'){e.stun=0.8;const k=Math.atan2(e.x-P.x,e.z-P.z);e.kx=Math.sin(k)*6;e.kz=Math.cos(k)*6;}}
    shake(0.4);hitstop=0.08;}}
function doDodge(){if(P.dodgeCd>0)return false;let a;if(input.mag>0.2)a=Math.atan2(input.mx,input.mz);else a=P.ang+PI;const inP=inPuddle();
  P.act={name:'dodge',t:0,dur:0.3,cancel:false,hitSet:new Set(),
    update(dt,A){const sp=14*(1-A.t/A.dur*0.6);P.x+=Math.sin(a)*sp*dt;P.z+=Math.cos(a)*sp*dt;afterimage();
      if(P.stage>=3)for(const e of enemies)if(!e.dead&&!A.hitSet.has(e)&&dist2(P,e)<e.r+1.1){A.hitSet.add(e);const r=pdmg(7);dealE(e,r.v,r.crit,'dash');burst(e.x,1,e.z,0xffffff,5,4,0.3);}}};
  P.iframe=0.3;P.parry=P.mode==='sword'?0.24:0;P.dodgeCd=inP?CONFIG.player.dodgeCdPuddle:CONFIG.player.dodgeCd;
  if(inP&&!flags.puddle){flags.puddle=1;banner('탁기 웅덩이 — 이동속도 40% 감소 · 회피 쿨타임 증가',2.8);}
  return true;}
function shootBigeom(){let best=null,bs=0;for(const e of enemies){if(e.dead)continue;const d=dist2(P,e);if(d>14)continue;const sc=e.stacks*10-d;if(!best||sc>bs){best=e;bs=sc;}}if(!best)return;
  const g=new T.Group();const b=new T.Mesh(new T.BoxGeometry(0.08,0.08,1.0),new T.MeshBasicMaterial({color:0xe8fff4}));g.add(b);const gl=new T.Sprite(new T.SpriteMaterial({map:dotTex,color:0x6fe0b8,transparent:true,depthWrite:false}));gl.scale.set(0.9,0.9,1);g.add(gl);
  g.position.set(P.x,1.3,P.z);scene.add(g);projs.push({m:g,x:P.x,y:1.3,z:P.z,tgt:best,speed:18,player:true,t:0});}
function spawnClone(x,z,ang){const g=new T.Group();const mt=MB(0x101010,0.55);const b=new T.Mesh(new T.CylinderGeometry(0.28,0.6,1.7,10),mt);b.position.y=0.85;g.add(b);const h=new T.Mesh(new T.SphereGeometry(0.24,10,8),mt);h.position.y=1.95;g.add(h);g.position.set(x,0,z);g.rotation.y=ang;scene.add(g);clones.push({x,z,t:1.1,g,mt});}
function chusa(){const tgt=faceTarget(10);let d=3.6;if(tgt)d=clamp(dist2(P,tgt)-tgt.r-0.8,0.5,6);const a=P.ang;P.iframe=0.3;spawnClone(P.x,P.z,a);skillName('추사 정화');
  P.act={name:'dash',t:0,dur:0.24,cancel:false,update(dt){P.x+=Math.sin(a)*d/0.24*dt;P.z+=Math.cos(a)*d/0.24*dt;afterimage();},
    end(){const hs=enemies.filter(e=>!e.dead&&dist2(P,e)<e.r+2.2);for(const e of hs){const r=pdmg(10);if(dealE(e,r.v,r.crit,'switch')&&!e.dead&&e.stacks)bloom(e,e.stacks,0.8);}addShield(5);arcTrail(P.x,P.z,a,2.4,0.5,0xd9fff0,1.1,0.4);burst(P.x,1.1,P.z,0x8ff0cc,10,6);if(hs.length){hitstop=0.05;shake(0.15);}}};}
function jinmyeong(){P.iframe=0.6;spawnClone(P.x,P.z,P.ang);skillName('진명 정화');
  P.act={name:'cast',t:0,dur:0.55,cancel:false,events:[{at:0.22,fn(){slashFx();for(const e of enemies){if(e.dead||dist2(P,e)>17)continue;const r=pdmg(15);if(dealE(e,r.v,r.crit,'switch')&&!e.dead&&e.stacks)bloom(e,e.stacks,1.5);}P.critBuff=8;P.drainPause=8;hitstop=0.16;shake(0.5);}}]};}
function hwamuk(){const tgt=autoTarget(12);if(tgt)P.ang=Math.atan2(tgt.x-P.x,tgt.z-P.z);const a=P.ang+PI;const ox=P.x,oz=P.z;P.iframe=0.28;skillName('화묵이탈');
  shootBigeom();
  for(const e of enemies)if(!e.dead&&Math.hypot(e.x-ox,e.z-oz)<4+e.r){const r=pdmg(5);if(dealE(e,r.v,r.crit,'switch'))mark(e,1);}
  ringFx(ox,oz,0.5,4,0x1c1c1c,0.4);burst(ox,0.8,oz,0x141414,16,7,0.45);addShield(5);
  P.act={name:'dash',t:0,dur:0.28,cancel:false,update(dt){P.x+=Math.sin(a)*3.4/0.28*dt;P.z+=Math.cos(a)*3.4/0.28*dt;}};}
function makmuk(){P.iframe=0.5;shootBigeom();skillName('막묵 결계');
  P.act={name:'cast',t:0,dur:0.5,cancel:false,events:[{at:0.2,fn(){for(const e of enemies){if(e.dead||dist2(P,e)>7+e.r)continue;if(e.type!=='boss')e.root=Math.max(e.root,3);const r=pdmg(6);if(dealE(e,r.v,r.crit,'switch'))mark(e,5);}
    P.shield=P.maxShield;P.rangeBuff=8;ringFx(P.x,P.z,1,7,0x3fae8c,0.7,0.08,0.9);ringFx(P.x,P.z,1,6.5,0x141414,0.6);for(let i=0;i<6;i++)purify(P.x+rand(-4,4),P.z+rand(-4,4),1.6);hitstop=0.1;shake(0.3);}}]};}
function doSwitch(){if(P.cds.sw>0)return false;const full=P.sw>=100;
  if(P.mode==='brush'){P.mode='sword';full?jinmyeong():chusa();}else{P.mode='brush';full?makmuk():hwamuk();}
  if(full)P.sw=0;P.cds.sw=0.7;brushW.visible=P.mode==='brush';swordW.visible=P.mode==='sword';P.lastIdx=-1;P.comboT=0;stats.switches++;return true;}
function vortexFx(x,z,r){const g=new T.Group();for(let i=0;i<3;i++){const rr=r*(1-i*0.25);const m=new T.Mesh(sectorGeo(rr,1.2,rr-0.6),MB(i%2?0x3fae8c:0x141414,0.8));m.rotation.y=i*2.1;g.add(m);}g.position.set(x,0.3,z);
  addFx(g,0.7,(f,p,dt)=>{f.obj.rotation.y-=dt*9;f.obj.scale.setScalar(1-p*0.7);f.obj.children.forEach(m=>m.material.opacity=0.8*(1-p));},true);}
function manmuk(){faceTarget(10);const cx=P.x+Math.sin(P.ang)*3,cz=P.z+Math.cos(P.ang)*3;skillName('만묵소진');
  P.act={name:'cast',t:0,dur:0.5,cancel:false,events:[{at:0.15,fn(){vortexFx(cx,cz,6);for(const e of enemies){if(e.dead)continue;if(Math.hypot(e.x-cx,e.z-cz)>6+e.r)continue;if(e.type!=='boss')e.pull={x:cx,z:cz,t:0.6};const r=pdmg(6);if(dealE(e,r.v,r.crit,'skill'))mark(e,1);}addShield(12);shake(0.15);}}]};}
function mukhyang(){faceTarget(9);const a=P.ang,half=35*DEG;skillName('묵향결쇄');
  P.act={name:'cast',t:0,dur:0.45,cancel:false,events:[{at:0.18,fn(){
    const m=new T.Mesh(sectorGeo(7.5,half),MB(0x141414,0.55));m.position.set(P.x,0.06,P.z);m.rotation.y=a;addFx(m,0.6,(f,p)=>{f.obj.material.opacity=0.55*(1-p);},true);
    burst(P.x+Math.sin(a)*3,0.6,P.z+Math.cos(a)*3,0x141414,18,7,0.45);
    for(const e of targetsInArc(P.x,P.z,a,7.5,half)){if(e.type!=='boss')e.root=Math.max(e.root,2.2);const r=pdmg(6);if(dealE(e,r.v,r.crit,'skill'))mark(e,1);}
    for(const rn of runes)if(!rn.linked&&inArcPt(rn.x,rn.z,rn.r,P.x,P.z,a,7.5,half))linkRune(rn);}}]};}
function jeommuk(){faceTarget(9);const a=P.ang;P.iframe=0.2;skillName('점묵개화');
  P.act={name:'dash',t:0,dur:0.4,cancel:false,update(dt,A){if(A.t<0.15){P.x+=Math.sin(a)*12*dt;P.z+=Math.cos(a)*12*dt;}},events:[{at:0.15,fn(){
    const o={kind:'line',x:P.x-Math.sin(a)*1.5,z:P.z-Math.cos(a)*1.5,ang:a,len:6.2,w:1.8};lineFx(o.x,o.z,a,6.2,0.9,0xe8fff4,0.3,1.1);burst(P.x+Math.sin(a)*3,1.1,P.z+Math.cos(a)*3,0x8ff0cc,10,6);
    for(const e of enemies){if(e.dead||!inShape(o,e.x,e.z,e.r))continue;const r=pdmg(16);if(!dealE(e,r.v,r.crit,'melee')||e.dead)continue;const n=e.stacks;if(n>0){bloom(e,n,1.3);addShield(n*2);}}
    hitstop=0.06;shake(0.2);}}]};}
function yumuk(){P.iframe=1.0;skillName('유묵섬참');let cur=null;
  P.act={name:'dash',t:0,dur:0.95,cancel:false,
    update(dt,A){const seg=Math.floor(A.t/0.3);if(seg>2)return;
      if(!cur||cur.seg!==seg){const t=autoTarget(10);let a=P.ang;if(t)a=Math.atan2(t.x-P.x,t.z-P.z);P.ang=a;const L=t?clamp(dist2(P,t)+1.2,2,4.2):3.4;cur={a,L,seg,t:0,last:seg===2,hit:new Set()};lineFx(P.x,P.z,a,L,0.35,0xe8fff4,0.35,1.1);}
      cur.t+=dt;if(cur.t<=0.15){const v=cur.L/0.15*dt;P.x+=Math.sin(cur.a)*v;P.z+=Math.cos(cur.a)*v;afterimage();
        for(const e of enemies){if(e.dead||cur.hit.has(e))continue;if(dist2(P,e)<e.r+1.4){cur.hit.add(e);const r=pdmg(12);if(dealE(e,r.v,r.crit,'melee')&&!e.dead){burst(e.x,1.1,e.z,0xe8fff4,8,6,0.35);if(cur.last&&e.type!=='boss'){const k=Math.atan2(e.x-P.x,e.z-P.z);e.kx=Math.sin(k)*9;e.kz=Math.cos(k)*9;}hitstop=Math.max(hitstop,0.04);}}}}},
    events:[{at:0.01,fn(){if(boss&&boss.runeActive&&runes.length&&runes.every(r=>r.linked))breakRunes();}}]};}
function doSkill(k){const brush=P.mode==='brush';const id=(brush?'b':'s')+k;if(P.cds[id]>0)return false;
  if(brush&&k===1)manmuk();else if(brush)mukhyang();else if(k===1)jeommuk();else yumuk();
  P.cds[id]=CD[id];P.lastIdx=-1;return true;}
function mandalaFx(x,z){const g=new T.Group();for(const r of[3,5.5,8]){const m=new T.Mesh(flatGeo(new T.RingGeometry(r-0.15,r,64)),MB(0x3fae8c,0.0));g.add(m);}
  for(let i=0;i<8;i++){const geo=new T.PlaneGeometry(0.12,16);flatGeo(geo);const m=new T.Mesh(geo,MB(0x141414,0.0));m.rotation.y=i*PI/8;g.add(m);}
  g.position.set(x,0.1,z);addFx(g,2.4,(f,p,dt)=>{f.obj.rotation.y+=dt*0.8;const o=p<0.2?p/0.2:p>0.75?(1-p)/0.25:1;f.obj.children.forEach((m,i)=>m.material.opacity=(i<3?0.85:0.5)*o);},true);}
function dropSword(x,z){const m=makeSword(1.6,0xe8fff4,0x3fae8c);m.rotation.x=PI;m.position.set(x,12,z);
  addFx(m,0.55,(f,p)=>{const k=Math.min(1,p/0.45);f.obj.position.y=12-11.2*k*k;if(p>=0.45&&!f.hit){f.hit=1;burst(x,0.5,z,0x6fe0b8,8,6,0.4);ringFx(x,z,0.3,1.8,0x3fae8c,0.3);}},true);}
function doUlt(){if(P.ult<100)return false;P.ult=0;P.invuln=2.0;stats.ults++;const cx=P.x,cz=P.z;mandalaFx(cx,cz);showCut('천지수묵 : 만화정계');
  const ev=[];for(let i=0;i<12;i++)ev.push({at:0.3+i*0.075,fn(){const al=alive();let x,z;if(al.length&&Math.random()<0.7){const e=al[Math.floor(Math.random()*al.length)];x=e.x+rand(-1,1);z=e.z+rand(-1,1);}else{const a=rand(0,TAU),r=rand(1,8);x=cx+Math.cos(a)*r;z=cz+Math.sin(a)*r;}dropSword(x,z);}});
  ev.push({at:1.35,fn(){for(const e of enemies){if(e.dead||dist2(P,e)>18)continue;const r=pdmg(CONFIG.ult.damage);dealE(e,r.v,r.crit,'ult');if(!e.dead&&e.stacks)bloom(e,e.stacks,1.5);}
    P.baek=0;P.hwagT=0;P.taintImmune=10;addZone(cx,cz,8,10);for(let i=0;i<14;i++){const a=rand(0,TAU),r=rand(0,8);purify(cx+Math.cos(a)*r,cz+Math.sin(a)*r,rand(1.5,2.6));}
    for(let i=puddles.length-1;i>=0;i--)if(Math.hypot(puddles[i].x-cx,puddles[i].z-cz)<8)puddles[i].t=Math.min(puddles[i].t,0.5);
    hitstop=0.25;shake(0.7);ringFx(cx,cz,1,14,0x6fe0b8,0.9,0.1,0.9);burst(cx,1.5,cz,0xf4c4d2,30,9,0.5,1);}});
  P.act={name:'ult',t:0,dur:1.7,cancel:false,events:ev};return true;}
function addZone(x,z,r,t){const m=new T.Mesh(flatGeo(new T.CircleGeometry(r,48)),MB(0x6fe0b8,0.15));m.position.set(x,0.07,z);scene.add(m);zones.push({x,z,r,t,max:t,m});}

/* ================= 입력 큐 ================= */
function ready(q){if(q==='dodge')return P.dodgeCd<=0&&P.y<=0;if(q==='jump')return P.y<=0&&P.vy<=0;if(q==='sw')return P.cds.sw<=0;if(q==='s1'||q==='s2'){const id=(P.mode==='brush'?'b':'s')+q[1];return P.cds[id]<=0;}if(q==='ult')return P.ult>=100;return true;}
function canDo(q){const a=P.act;if(P.stagger>0||P.dead)return false;if(!a)return true;if(a.name!=='atk')return false;if(q==='dodge'||q==='jump')return a.t>=a.hitAt*0.5;return a.t>=a.dur*0.62;}
function tryQueue(){const q=P.queue;if(!q||!ready(q)||!canDo(q))return;const cont=!!(P.act&&P.act.name==='atk');if(cont)P.act=null;P.queue=null;
  const air=P.y>0.05;
  switch(q){case'jump':P.vy=CONFIG.player.jumpPower;P.y=0.001;P.airAtks=0;burst(P.x,0.2,P.z,0x8a857c,6,3,0.35,0.4);break;
    case'atk':{if(air){if(P.airAtks<2){P.airAtks++;startAttack(AIR[P.mode],-1);}break;}const idx=(cont||P.comboT>0)&&P.lastIdx>=0?(P.lastIdx+1)%4:0;startAttack(DEF[P.mode][idx],idx);break;}
    case'str':if(air)startPlunge();else startAttack(STRONG[P.mode],-1);break;case'dodge':doDodge();break;case'sw':doSwitch();break;case's1':doSkill(1);break;case's2':doSkill(2);break;case'ult':doUlt();break;}}
function runAct(dt){const a=P.act;if(!a)return;a.t+=dt;if(a.update)a.update(dt,a);if(P.act!==a)return;if(a.events)for(const ev of a.events)if(!ev.done&&a.t>=ev.at){ev.done=true;ev.fn(a);if(P.act!==a)return;}if(P.act===a&&a.t>=a.dur){P.act=null;if(a.end)a.end(a);}}

/* ================= 플레이어 업데이트 ================= */
const _c=new T.Color();
function updatePlayer(dt){
  for(const k in P.cds)P.cds[k]=Math.max(0,P.cds[k]-dt);
  P.iframe-=dt;P.parry-=dt;P.invuln-=dt;P.stagger-=dt;P.dodgeCd-=dt;P.critBuff-=dt;P.rangeBuff-=dt;P.taintImmune-=dt;P.drainPause-=dt;P.yeonhaCd-=dt;P.comboT-=dt;afterT-=dt;
  if(P.queue){P.queueT-=dt;if(P.queueT<=0)P.queue=null;}
  if(P.y>0||P.vy>0){P.vy-=CONFIG.player.gravity*dt;if(P.act&&P.act.def&&P.act.def.air&&P.vy<0)P.vy=Math.max(P.vy,-1.5);P.y+=P.vy*dt;if(P.y<=0){P.y=0;P.vy=0;land();}}
  if(P.dead)return;
  if(P.mode==='brush')addShield(CONFIG.player.brushShieldRegen*dt);
  const st=stageOf();
  if(st>P.stage&&st<4)banner(['','백묵화 1단계 — 용의 비늘 (받는 피해 -10% · 경직 저항)','백묵화 2단계 — 용안 개안 (치명타 +20%)','백묵화 3단계 — 사지 야수화 (속도 ↑ · 회피 시 잔상 공격)'][st],2.6);
  P.stage=st;
  if(P.baek>=100){if(P.hwagT>0)P.hwagT-=dt;else if(P.drainPause<=0&&P.invuln<=0){P.hp=Math.max(1,P.hp-CONFIG.baekhwa.drainPerSec*dt);if(P.hp<=P.maxHp*0.2&&P.yeonhaCd<=0)yeonhaRescue();}}
  if(P.sw>=100&&!flags.sw){flags.sw=1;banner('전환 게이지 FULL — 다음 전환은 강화 전환 (붓→검: 진명 정화 / 검→붓: 막묵 결계)',3.8);}
  if(P.ult>=100&&!flags.ult){flags.ult=1;banner('궁극기 준비 — 『천지수묵 : 만화정계』 (백묵화 초기화)',3.2);}
  const inP=inPuddle();
  P.moving=false;
  if(!P.act&&P.stagger<=0&&input.mag>0.1){const spd=CONFIG.player.speed*(st>=3?1.25:1)*(inP?0.6:1)*Math.min(1,input.mag);const a=Math.atan2(input.mx,input.mz);P.x+=Math.sin(a)*spd*dt;P.z+=Math.cos(a)*spd*dt;P.ang=lerpAng(P.ang,a,1-Math.exp(-18*dt));P.moving=true;}
  runAct(dt);
  tryQueue();
  clampArena(P,0.4);
}
function animatePlayer(dt){const p=pMesh.userData,piv=p.piv,a=P.act;let rx=-0.2,ry=0.15,lean=0,spin=0,bob=0,snap=false;
  if(P.dead){pMesh.rotation.x+=(1.3-pMesh.rotation.x)*Math.min(1,dt*6);pMesh.position.set(P.x,0,P.z);return;}
  if(a&&a.name==='atk'){const def=a.def,k=easeOut(clamp(a.t/a.hitAt,0,1));snap=true;lean=0.15;
    if(def.vert||def.cross){rx=-PI*0.95+PI*0.85*k;ry=def.cross?(a.t>a.hitAt?-0.6:0.6):0;}
    else if(def.spin){spin=k*TAU;rx=-PI/2;ry=0.9;}
    else{const sw=def.swing;rx=-PI/2+0.1;ry=sw[0]+(sw[1]-sw[0])*k;}}
  else if(a&&a.name==='plunge'){lean=0.3;rx=-PI*0.95;ry=0;snap=true;}
  else if(a&&a.name==='dodge'){lean=0.4;rx=-0.6;}
  else if(!a&&P.y>0.05){rx=-1.0;lean=0.1;}
  else if(a&&a.name==='dash'){lean=0.35;rx=-PI/2;ry=0;snap=true;}
  else if(a&&(a.name==='cast'||a.name==='ult')){rx=-PI*0.9;ry=0;}
  else if(P.moving){bob=Math.abs(Math.sin(state.time*12))*0.08;rx=-0.2+Math.sin(state.time*12)*0.35;lean=0.12;}
  else if(P.stagger>0){lean=-0.25;}
  const k=snap?1:1-Math.exp(-20*dt);piv.rotation.x+=(rx-piv.rotation.x)*k;piv.rotation.y+=(ry-piv.rotation.y)*k;
  pMesh.position.set(P.x,P.y+bob,P.z);pMesh.rotation.y=P.ang+spin;pMesh.rotation.x+=(lean-pMesh.rotation.x)*Math.min(1,dt*14);
  pRing.position.set(P.x,0.03,P.z);if(atkHold.down&&!atkHold.fired&&atkHold.t>0.1){pRing.scale.setScalar(1+Math.min(1,atkHold.t/HOLD_T)*0.9);pRing.material.color.setHex(0xffffff);}else{pRing.scale.setScalar(1);pRing.material.color.setHex(P.mode==='brush'?0x3fae8c:0xe8fff4);}
  const st=P.stage;p.robe.color.lerp(_c.setHex(STAGE_COL[st]),1-Math.exp(-6*dt));p.robe.emissive.setHex(st>=4?0x2f7a62:0);
  horns.visible=st>=4;
  if(P.invuln>0){aura.material.color.setHex(0xf4a6c0);aura.material.opacity=0.22+0.08*Math.sin(state.time*14);}
  else if(st>=4){aura.material.color.setHex(0x7fe8c2);aura.material.opacity=0.16+0.06*Math.sin(state.time*8);}
  else if(P.critBuff>0){aura.material.color.setHex(0xffffff);aura.material.opacity=0.1;}
  else aura.material.opacity=0;}
