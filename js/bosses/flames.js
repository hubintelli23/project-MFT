/* MFT 블루잉크 : 천년청묵 · js/bosses/flames.js · v1.1
   백명신궁 중간 보스 — 화염의 존재 8 (설정: 화염 이름 · 색 · 고유현상 · 모습)
     백린 천소화(백염 · 용)        고유현상 천소 — 모든 공격이 방어막을 무시 → 가드 · 회피로 대응
     청휘 정명화(청염 · 사자)      고유현상 정화 — 주기적으로 낙인과 버프를 씻어냄 → 씻기기 전에 개화
     적섬 단연화(적염 · 표범)      고유현상 단절 — 맞으면 스킬 · 전환 · 궁극기 봉인 → 스웨이로 피하기
     녹령 회생화(녹염 · 선영)      고유현상 생명 회복 — 회생화 불꽃이 회복시킴 · 회생 시전은 가드파쇄로 끊기
     자요 왜곡화(자염 · 이형)      고유현상 공간 조작 — 위치 뒤바꾸기 · 균열 공격 · 공간 붕괴(끌어당김)
     황뢰 화령화(황염 · 치타)      고유현상 에너지 확장 — 공격할수록 빨라지고 가득 차면 확장 폭발 → 패링으로 초기화
     홍악 압염화(홍염 · 멧돼지)    고유현상 압축 · 증폭 — 강체 압축을 가드파쇄로 끊지 못하면 폭발 · 매번 증폭
     흑랑 잔영화(흑청염 · 늑대)    고유현상 잔상 — 모든 공격이 1초 뒤 같은 자리에 한 번 더
   수치는 data/enemies.js의 BOSSES.(baekrin · cheonghwi · …) */
'use strict';
const FLAME={};
function flameBoss(id,cfg){FLAME[id]=cfg;
  BOSS_INIT[id]=function(b){b.r=1.3;b.ft=0;b.ft2=0;if(cfg.init)cfg.init(b);later(1.0,()=>{if(!state.over&&b&&!b.dead)banner(BOSSES[id].name+' — '+cfg.tip,5);});};
  BOSS_AI[id]=function(b,dt){const D=BOSSES[id];if(cfg.always)cfg.always(b,dt);
    if(bossCommon(b,dt))return;
    if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){bPhase(b,cfg.p2name,cfg.col,cfg.p2msg);if(cfg.onP2)cfg.onP2(b);return;}
    if(cfg.update&&cfg.update(b,dt))return;
    if(b.action){runBossAction(b,dt);return;}
    const sp=(b.p2?D.walkSpeedP2:D.walkSpeed)*(cfg.speed?cfg.speed(b):1);const d=bossWalk(b,dt,sp,7,2.8);
    b.cd-=dt*(cfg.speed?cfg.speed(b):1);if(b.cd<=0&&!P.dead){const opts=cfg.opts(b,d);const pick=pickWeighted(b,opts.map(o=>[o[0],o[1]]));const f=opts.find(o=>o[0]===pick)[2];f(b,D);if(cfg.afterAtk)cfg.afterAtk(b);}};
  BOSS_ANIM[id]=function(b,dt){animBeast(b,dt);if(cfg.anim)cfg.anim(b,dt);};
  if(cfg.hit)BOSS_HIT[id]=cfg.hit;if(cfg.state)BOSS_STATE[id]=cfg.state;if(cfg.defeat)BOSS_DEFEAT[id]=cfg.defeat;}
const PIERCE={pierce:true};
/* ---- 백린 · 천소 ---- */
flameBoss('baekrin',{col:0xffffff,p2name:'천소 — 하늘을 태우는 백염',p2msg:'2페이즈 — 백염 브레스가 세 갈래로',tip:'천소화(백염)는 방어막을 무시합니다. 가드하거나 회피로 피하세요',
  opts:(b,d)=>[['claw',d<5?3:0.3,(b,D)=>bCone(b,{r:4.2,half:70,dmg:D.damage.claw,fx:0xffffff,opt:PIERCE,n:b.p2?2:1,name:'백린 할퀴기'})],
    ['breath',2,(b,D)=>bLine(b,{len:13,w:2.2,tell:0.85,dmg:D.damage.breath,type:'heavy',fx:0xffffff,col:0xd8e8ff,opt:PIERCE,n:b.p2?3:1,spread:0.5,name:'천소화 브레스 — 방어막 무시'})],
    ['pillar',d>4?2.5:1.2,(b,D)=>bRain(b,{n:5,r:1.6,dmg:D.damage.pillar,fx:0xffffff,col:0xd8e8ff,opt:PIERCE,name:'천소 — 백염 기둥'})]]});
/* ---- 청휘 · 정화 ---- */
flameBoss('cheonghwi',{col:0x5ab8ff,p2name:'정명화 — 정화의 포효',p2msg:'2페이즈 — 정화 주기가 빨라집니다',tip:'정명화(청염)가 주기적으로 낙인과 버프를 씻어냅니다. 씻기기 전에 개화하세요',
  init:b=>{b.ft=BOSSES.cheonghwi.purifyInterval;},
  always:(b,dt)=>{if(b.stun>0||b.groggy>0)return;b.ft-=dt;if(b.ft<=0){const D=BOSSES.cheonghwi;b.ft=D.purifyInterval*(b.p2?0.7:1);const n=b.stacks;b.stacks=0;b.barDirty=true;P.critBuff=0;P.maeBuff=Math.min(P.maeBuff||0,0);P.shield*=0.5;
    ringFx(b.x,b.z,0.5,6,0x5ab8ff,0.6);burst(b.x,1.8,b.z,0x9fd8ff,24,7,0.4);showCut('정명화 — 정화');popNum(b.x,3.4,b.z,'낙인 '+n+'중첩 씻김 · 버프 정화','immune');}},
  state:b=>'다음 정화까지 '+Math.max(0,b.ft).toFixed(0)+'초 — 그 전에 개화',
  opts:(b,d)=>[['claw',d<5?3:0.3,(b,D)=>bCone(b,{r:4,half:70,dmg:D.damage.claw,fx:0x9fd8ff,n:2,gap:0.6,name:'청휘 할퀴기'})],
    ['pounce',d>3?2.5:1,(b,D)=>bCone(b,{r:3.4,half:50,dmg:D.damage.pounce,type:'break',lunge:6,tell:0.6,fx:0x5ab8ff,name:'사자 덮치기 — 가드 불가'})],
    ['roar',1.6,(b,D)=>bNova(b,{r:4.2,dmg:D.damage.roar,type:'unsway',fx:0x5ab8ff,col:0x3a8ad0,ring:b.p2,name:'정화의 포효 — 스웨이 불가'})]]});
/* ---- 적섬 · 단절 ---- */
const jsSeal=()=>{const D=BOSSES.jeokseom;P.seal=Math.max(P.seal||0,D.sealTime);P.sealName='단절 — 스킬 · 전환 · 궁극기';popNum(P.x,3,P.z,'단절 '+D.sealTime+'초','hurt');burst(P.x,1.5,P.z,0xff4a2a,12,5,0.35);};
flameBoss('jeokseom',{col:0xff4a2a,p2name:'단연화 — 끊어내는 불꽃',p2msg:'2페이즈 — 더 빠른 연속 덮치기',tip:'단연화(적염)에 맞으면 스킬 · 전환 · 궁극기가 끊깁니다(단절). 회피 타이밍으로 스웨이!',
  opts:(b,d)=>[['claw',d<5?3:0.5,(b,D)=>bCone(b,{r:3.2,half:55,dmg:D.damage.claw,fx:0xff6a4a,n:b.p2?4:3,gap:0.38,lunge:2.5,tell:0.42,onHitP:jsSeal,name:'적섬 연속 할퀴기'})],
    ['pounce',d>3?3:1,(b,D)=>bLine(b,{len:10,w:2,tell:0.6,dmg:D.damage.pounce,type:'break',charge:true,fx:0xff4a2a,onHitP:jsSeal,name:'적섬 돌진 — 가드 불가'})],
    ['rend',1.4,(b,D)=>bCone(b,{r:4.4,half:85,dmg:D.damage.rend,type:'heavy',fx:0xff4a2a,armor:0.8,onHitP:jsSeal,name:'단연 찢기'})]]});
/* ---- 녹령 · 생명 회복 ---- */
function nkFlames(b){for(const[x,z]of ringPts(3,8,rand(0,TAU)))spawnBossRune(x,z,{hp:3,req:'any',label:'회생화',avatar:'runestone',col:0x6fe0a0,r:0.7,onBreak:()=>{}});popNum(b.x,3.4,b.z,'회생화 3 — 끄지 않으면 회복','info');}
flameBoss('noknyeong',{col:0x6fe0a0,p2name:'회생화 — 생명의 순환',p2msg:'2페이즈 — 금빛 강체로 크게 회복하는 회생 시전 (가드파쇄로 끊기)',tip:'회생화 불꽃이 살아 있는 동안 녹령이 회복합니다. 불꽃부터 끄세요',
  init:b=>{b.ft=1.5;b.baseY=0.4;},
  always:(b,dt)=>{const fl=enemies.filter(e=>isRune(e)&&!e.dead);if(fl.length&&!b.dead){b.hp=Math.min(b.maxHp,b.hp+b.maxHp*BOSSES.noknyeong.healPerFlame*fl.length*dt);b.barDirty=true;if(Math.random()<dt*3)for(const f of fl)lineFx(f.x,f.z,Math.atan2(b.x-f.x,b.z-f.z),Math.hypot(b.x-f.x,b.z-f.z),0.15,0x6fe0a0,0.25,0.3);}
    b.ft-=dt;if(b.ft<=0&&!fl.length&&!b.action){b.ft=15;nkFlames(b);}},
  state:b=>{const n=enemies.filter(e=>isRune(e)&&!e.dead).length;return n?'회생화 '+n+'개 — 회복 중':'';},
  opts:(b,d)=>{const o=[['orb',2,(b,D)=>bRain(b,{n:4,r:1.6,dmg:D.damage.orb,fx:0x6fe0a0,col:0x3aa060,name:'녹염 구슬'})],
    ['vine',2,(b,D)=>bLine(b,{n:3,spread:0.45,len:11,w:1.3,tell:0.7,dmg:D.damage.vine,fx:0x6fe0a0,col:0x3aa060,name:'생명 덩굴'})],
    ['bloom',d<5?2:0.5,(b,D)=>bNova(b,{r:3.6,dmg:D.damage.bloom,type:'heavy',fx:0x6fe0a0,col:0x3aa060,name:'녹염 개화'})]];
    if(b.p2)o.push(['regen',1.3,(b,D)=>{b.armorT=3;bAct(b,'regen',3.2,[[3.0,()=>{if(b.armorT>0){const h=b.maxHp*D.regenHeal;b.hp=Math.min(b.maxHp,b.hp+h);b.barDirty=true;ringFx(b.x,b.z,0.5,5,0x6fe0a0,0.6);popNum(b.x,3.4,b.z,'회생 +'+Math.round(h),'info');}}]]);bossCall('회생 시전 — 가드파쇄로 끊기');}]);return o;},
  defeat:b=>{for(const e of enemies)if(isRune(e)&&!e.dead){e.silent=true;killE(e,true);}}});
/* ---- 자요 · 공간 조작 ---- */
function jyRift(b,D){bAct(b,'rift',1.6,[[0,()=>{for(let i=0;i<(b.p2?3:2);i++){const a=P.ang+PI+rand(-1.2,1.2),sx=clamp(P.x+Math.sin(a)*6,-13.5,13.5),sz=clamp(P.z+Math.cos(a)*6,-13.5,13.5),ang=Math.atan2(P.x-sx,P.z-sz);
  ringFx(sx,sz,0.3,1.4,0xc060ff,0.6);strike({owner:b,kind:'line',x:sx,z:sz,ang,len:11,w:1.5,tell:0.75+i*0.2,dmg:D.damage.rift,color:0x8a40c0,opt:{src:{x:sx,z:sz}},onFire:o=>lineFx(o.x,o.z,o.ang,o.len,0.6,0xc060ff,0.4,0.5)});}}]]);bossCall('왜곡 균열 — 측후방');}
function jySwap(b,D){bAct(b,'swap',1.4,[[0.3,()=>{const px=P.x,pz=P.z;burst(px,1,pz,0xc060ff,16,6,0.4);burst(b.x,1,b.z,0xc060ff,16,6,0.4);P.x=b.x;P.z=b.z;b.x=px;b.z=pz;showCut('공간 뒤바꾸기');faceP(b);
  strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:4,half:60*DEG,tell:0.55,dmg:D.damage.claw,type:'break',color:0x8a40c0,onFire:o=>arcTrail(o.x,o.z,o.ang,4,o.half,0xc060ff,1.2,0.8)});}]]);bossCall('공간 조작 — 위치 뒤바꾸기');}
function jyCollapse(b,D){b.armorT=1.8;bAct(b,'collapse',2.2,[[0,()=>{b.pullT=1.4;}],[0.3,()=>{strike({owner:b,kind:'circle',x:b.x,z:b.z,r:4.5,tell:1.2,dmg:D.damage.collapse,type:'heavy',color:0x8a40c0,onFire:o=>{ringFx(o.x,o.z,0.6,5,0xc060ff,0.6);burst(o.x,1.5,o.z,0xc060ff,26,8,0.5);shake(0.4);}});}]]);bossCall('공간 붕괴 — 끌어당김');}
flameBoss('jayo',{col:0xc060ff,p2name:'왜곡화 — 뒤틀린 공간',p2msg:'2페이즈 — 균열이 늘어납니다',tip:'왜곡화(자염)는 위치를 뒤바꾸고 등 뒤 균열에서 공격합니다. 주변을 계속 살피세요',
  always:(b,dt)=>{if(b.pullT>0){b.pullT-=dt;const dx=b.x-P.x,dz=b.z-P.z,d=Math.hypot(dx,dz);if(d>1.5&&P.iframe<=0&&!P.dead){P.x+=dx/d*3*dt;P.z+=dz/d*3*dt;}}},
  opts:(b,d)=>[['claw',d<5?3:0.4,(b,D)=>bCone(b,{r:4,half:65,dmg:D.damage.claw,fx:0xc060ff,col:0x8a40c0,n:2,name:'자요 할퀴기'})],['rift',2,jyRift],['swap',1.3,jySwap],['collapse',1.2,jyCollapse]]});
/* ---- 황뢰 · 에너지 확장 ---- */
flameBoss('hwangroe',{col:0xffe040,p2name:'화령화 — 끝없는 가속',p2msg:'2페이즈 — 에너지가 더 빨리 찹니다',tip:'화령화(황염)는 공격할수록 빨라집니다. 패링하면 쌓인 에너지가 흩어집니다',
  init:b=>{b.charge=0;b.onParry=()=>{if(b.charge>0){b.charge=0;popNum(b.x,3.2,b.z,'패링 — 에너지 흩어짐','info');}};},
  speed:b=>1+b.charge*0.12,afterAtk:b=>{b.charge=Math.min(BOSSES.hwangroe.chargeMax,b.charge+(b.p2?1.5:1));},
  state:b=>'에너지 '+Math.floor(b.charge)+'/'+BOSSES.hwangroe.chargeMax+(b.charge>=BOSSES.hwangroe.chargeMax?' — 확장 폭발!':' (패링으로 초기화)'),
  opts:(b,d)=>{const D=BOSSES.hwangroe;if(b.charge>=D.chargeMax)return[['field',1,(b,D)=>{b.charge=0;bNova(b,{r:6.5,tell:1.1,dmg:D.damage.field,type:'unsway',fx:0xffe040,col:0xc8a020,armor:1.2,ring:true,name:'화령화 — 에너지 확장 폭발'});}]];
    return[['claw',d<5?3:0.5,(b,D)=>bCone(b,{r:3.4,half:55,dmg:D.damage.claw,fx:0xffe040,lunge:3,n:2,gap:0.45,tell:0.45,name:'황뢰 할퀴기'})],['dash',d>3?3:1,(b,D)=>bLine(b,{len:12,w:1.8,tell:0.55,dmg:D.damage.dash,charge:true,fx:0xffe040,name:'뇌광 질주'})]];},
  anim:(b)=>{b.mesh.userData.aura.material.opacity=0.1+b.charge*0.05;}});
/* ---- 홍악 · 압축과 증폭 ---- */
flameBoss('hongak',{col:0xff3a5a,p2name:'압염화 — 증폭',p2msg:'2페이즈 — 압축 주기가 짧아집니다',tip:'압염화(홍염)를 압축하는 동안 금빛 강체 — 가드파쇄로 끊지 못하면 폭발하고 다음엔 더 강해집니다',
  init:b=>{b.amp=0;b.ft=7;},
  update:(b,dt)=>{if(b.action)return false;b.ft-=dt;if(b.ft>0)return false;const D=BOSSES.hongak;b.ft=b.p2?8:11;b.armorT=2.6;
    bAct(b,'compress',3.2,[[0,()=>{ringFx(b.x,b.z,4,0.5,0xff3a5a,0.6,0.6,1.0);}],[2.6,()=>{if(b.armorT<=0)return;const dm=D.damage.burst*(1+b.amp);b.amp+=D.ampStep;
      strike({owner:b,kind:'circle',x:b.x,z:b.z,r:6,tell:0.35,dmg:dm,type:'heavy',color:0xc0203a,onFire:o=>{ringFx(o.x,o.z,0.6,6.4,0xff3a5a,0.7,0.3);burst(o.x,1.6,o.z,0xff3a5a,40,10,0.6);shake(0.7);}});popNum(b.x,3.4,b.z,'증폭 '+Math.round((1+b.amp)*100)+'%','hurt');}]]);
    bossCall('압염 압축 — 가드파쇄로 끊기!');return true;},
  state:b=>b.action&&b.action.name==='compress'?'압축 중 — 가드파쇄로 끊기':'증폭 '+Math.round((1+b.amp)*100)+'%',
  opts:(b,d)=>[['charge',d>3?3:1,(b,D)=>bLine(b,{len:12,w:2.6,tell:0.75,dmg:D.damage.charge,type:'break',charge:true,armor:0.9,fx:0xff3a5a,name:'홍악 돌진 — 가드 불가 · 강체'})],
    ['gore',d<5?3:0.5,(b,D)=>bCone(b,{r:3.8,half:60,dmg:D.damage.gore,type:'heavy',fx:0xff3a5a,n:2,gap:0.7,name:'엄니 들이받기'})]]});
/* ---- 흑랑 · 잔상 ---- */
flameBoss('heukrang',{col:0x3a8ab0,p2name:'잔영화 — 겹쳐지는 그림자',p2msg:'2페이즈 — 잔상이 더 빨리 따라옵니다 · 늑대 무리',tip:'잔영화(흑청염)의 모든 공격은 1초 뒤 같은 자리에 한 번 더 옵니다(잔상)',
  init:b=>{b.echoStrikes=true;b.echoDelay=BOSSES.heukrang.echoDelay;},onP2:b=>{b.echoDelay=0.75;},
  opts:(b,d)=>[['claw',d<5?3:0.4,(b,D)=>bCone(b,{r:3.6,half:60,dmg:D.damage.claw,fx:0x3a8ab0,col:0x2a5a80,n:2,gap:0.55,lunge:2.5,name:'흑랑 할퀴기'})],
    ['pounce',d>3?2.5:1,(b,D)=>bLine(b,{len:11,w:1.8,tell:0.6,dmg:D.damage.pounce,type:'break',charge:true,fx:0x3a8ab0,name:'잔영 덮치기 — 가드 불가'})],
    ['howl',b.p2?1.4:0.6,(b,D)=>{bNova(b,{r:3.5,dmg:D.damage.howl,fx:0x3a8ab0,col:0x2a5a80,name:'잔영의 하울링'});if(enemies.filter(e=>e.type==='minion'&&!e.dead).length<2)for(let i=0;i<2;i++){const a=rand(0,TAU);spawnMinion(clamp(b.x+Math.sin(a)*4,-13,13),clamp(b.z+Math.cos(a)*4,-13,13),{hp:35,avatar:'wolfling',col:0x3a8ab0,atkCol:0x2a5a80,dmg:8,speed:4.4,stagger:12});}}]]});
