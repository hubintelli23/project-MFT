/* MFT 블루잉크 : 천년청묵 · js/bosses/simwon.js · v1.1
   심원회 — 백야의 드래곤 하트 파편을 지닌 5인 (설정: 파편의 핵심 · 능력)
     윤재 에테르의 지배 — 에테르 결절이 방어막을 재생 · 에테르 차단(봉인) · 영로 흡수
     설령 정화와 균형 — 같은 방식으로만 치면 '치우침'이 쌓여 균형 회복 반격 · 침식도를 씻어내는 정화
     무하 기억과 기록 — 내가 자주 쓰는 방어(패링 / 스웨이)를 기록해 그걸 막는 공격으로 바꿈 · 기억 재연
     연휘 인과와 흐름 — 내 이동을 예측한 공격 · 인과 연결(준 피해 일부가 되돌아옴 → 패링으로 끊기)
     도윤 세계의 경계 — 경계 결계(가까이 붙어야 피해 · 가드파쇄로 붕괴) · 전장 축소
   전투 패턴 · 수치는 설정의 능력 설명을 바탕으로 체험판용으로 새로 만든 것 (data/enemies.js의 BOSSES.yunjae …) */
'use strict';
function simwonBoss(id,cfg){
  BOSS_INIT[id]=function(b){b.ft=0;if(cfg.init)cfg.init(b);later(1.0,()=>{if(!state.over&&b&&!b.dead)banner(BOSSES[id].name+' — '+cfg.tip,5);});};
  BOSS_AI[id]=function(b,dt){const D=BOSSES[id];if(cfg.always)cfg.always(b,dt);
    if(bossCommon(b,dt))return;
    if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){bPhase(b,cfg.p2name,cfg.col,cfg.p2msg);if(cfg.onP2)cfg.onP2(b);return;}
    if(cfg.update&&cfg.update(b,dt))return;
    if(b.action){runBossAction(b,dt);return;}
    const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,6,3);
    b.cd-=dt;if(b.cd<=0&&!P.dead){const opts=cfg.opts(b,d);const pick=pickWeighted(b,opts.map(o=>[o[0],o[1]]));const f=opts.find(o=>o[0]===pick)[2];f(b,D);if(pick!=='replay'){b.lastFn=b.lastFn||[];b.lastFn.push(f);if(b.lastFn.length>3)b.lastFn.shift();}}};
  BOSS_ANIM[id]=function(b,dt){animHumanBoss(b,dt);const u=b.mesh.userData;u.shard.rotation.y+=dt*3;u.flameAura.material.opacity=(b.p2?0.14:0.07)+(cfg.glow?cfg.glow(b):0);if(cfg.anim)cfg.anim(b,dt);};
  if(cfg.hit)BOSS_HIT[id]=cfg.hit;if(cfg.state)BOSS_STATE[id]=cfg.state;if(cfg.defeat)BOSS_DEFEAT[id]=cfg.defeat;}
/* ---- 윤재 · 에테르의 지배 ---- */
function yjNodes(b){for(const[x,z]of ringPts(3,9,rand(0,TAU)))spawnBossRune(x,z,{hp:3,req:'any',label:'에테르 결절',avatar:'runestone',col:0x6fd0f0,onBreak:()=>{}});popNum(b.x,3.2,b.z,'에테르 결절 — 방어막 재생','info');}
const yjDrain=()=>{const D=BOSSES.yunjae;P.yr=Math.max(0,P.yr-D.drain);popNum(P.x,2.9,P.z,'영로 흡수 -'+D.drain,'hurt');};
simwonBoss('yunjae',{col:0x6fd0f0,p2name:'에테르 범람',p2msg:'2페이즈 — 결절이 다시 생기고 에테르 차단이 잦아집니다',tip:'에테르 결절이 살아 있으면 방어막이 계속 찹니다. 결절부터 부수세요 · 파란 파동에 맞으면 스킬이 봉인됩니다',
  init:b=>{b.ft=0.8;},onP2:b=>{later(1.8,()=>{if(!b.dead)yjNodes(b);});},
  always:(b,dt)=>{const D=BOSSES.yunjae;const n=enemies.filter(e=>isRune(e)&&!e.dead).length;if(n&&!b.dead){b.shield=Math.min(D.nodeShield,b.shield+D.nodeRegen*n*dt/3);}
    if(b.ft>0){b.ft-=dt;if(b.ft<=0)yjNodes(b);}},
  state:b=>{const n=enemies.filter(e=>isRune(e)&&!e.dead).length;return n?'에테르 결절 '+n+' · 방어막 '+Math.round(b.shield):'';},
  opts:(b,d)=>[['beam',2,(b,D)=>bLine(b,{n:3,spread:0.35,len:13,w:1.4,tell:0.8,dmg:D.damage.beam,type:'heavy',fx:0x9fe8ff,col:0x3a9ac0,onHitP:yjDrain,name:'에테르 광선'})],
    ['orb',d>5?2.5:1,(b,D)=>bRain(b,{n:4,r:1.6,dmg:D.damage.orb,fx:0x9fe8ff,col:0x3a9ac0,onHitP:yjDrain,name:'에테르 구체'})],
    ['slash',d<5?2.5:0.3,(b,D)=>bCone(b,{r:4,half:65,dmg:D.damage.pulse,fx:0x9fe8ff,n:2,onHitP:yjDrain,name:'에테르 검무'})],
    ['seal',b.p2?1.8:1,(b,D)=>bNova(b,{r:5,tell:1.0,dmg:D.damage.vortex,type:'unsway',fx:0x6fd0f0,col:0x3a9ac0,onHitP:()=>{P.seal=Math.max(P.seal||0,D.sealTime);P.sealName='에테르 차단 — 스킬 · 전환 · 궁극기';popNum(P.x,3,P.z,'에테르 차단 '+D.sealTime+'초','hurt');},name:'에테르 차단 — 스웨이 불가 (가드 · 점프)'})]]});
/* ---- 설령 · 정화와 균형 ---- */
function slKey(){return P.char==='yeonwoo'?P.mode:P.char;}
const SL_NAME={brush:'붓',sword:'검',yeonha:'연하',maehyang:'매향'};
simwonBoss('seolryeong',{col:0x7fd8c8,p2name:'균형의 저울',p2msg:'2페이즈 — 치우침이 더 빨리 쌓입니다',tip:'같은 방식(붓만 · 검만 · 한 동료만)으로 계속 치면 치우침이 쌓여 반격합니다. 번갈아 치세요',
  init:b=>{b.imb=0;b.lastKey='';},
  hit:(b,v,src)=>{const D=BOSSES.seolryeong;const k=slKey();if(k===b.lastKey)b.imb+=b.p2?1.5:1;else{b.imb=Math.max(0,b.imb-3);b.lastKey=k;}
    if(b.imb>=D.imbalanceMax&&!b.balancing){b.imb=0;b.balancing=true;cancelStrikes(b);b.action=null;b.stun=0;showCut('균형 회복');
      bNova(b,{r:5,tell:0.8,dmg:D.damage.balance,type:'heavy',fx:0x7fd8c8,col:0x3a9a8a,armor:1.2,act:'balance',onFire:()=>{b.hp=Math.min(b.maxHp,b.hp+b.maxHp*0.04);b.balancing=false;}});popNum(b.x,3.4,b.z,'치우침 — '+SL_NAME[k]+'만 사용','immune');}},
  state:b=>'치우침 '+Math.floor(b.imb)+'/'+BOSSES.seolryeong.imbalanceMax+' — 마지막: '+(SL_NAME[b.lastKey]||'—'),
  opts:(b,d)=>[['slash',d<5?3:0.5,(b,D)=>bCone(b,{r:4,half:65,dmg:D.damage.slash,fx:0xf4fffc,n:2,name:'정화의 검'})],
    ['wave',2,(b,D)=>bLine(b,{len:12,w:2.2,tell:0.7,dmg:D.damage.wave,fx:0x7fd8c8,name:'균형의 물결'})],
    ['cleanse',1.6,(b,D)=>bRain(b,{n:4,r:1.8,dmg:D.damage.cleanse,fx:0xbfffee,col:0x3a9a8a,onHitP:()=>{if(P.char==='yeonwoo'){P.baek=Math.max(0,P.baek-D.cleanse);if(P.hwag)exitHwag(false);popNum(P.x,3,P.z,'정화 — 침식도 -'+D.cleanse,'info');}},name:'정화의 비 — 침식도를 씻어냄'})]]});
/* ---- 무하 · 기억과 기록 ---- */
simwonBoss('muha',{col:0xd8c8a0,p2name:'기억의 재연',p2msg:'2페이즈 — 마지막 공격 3개를 연달아 재연합니다',tip:'무하는 당신이 자주 쓰는 방어를 기록합니다. 패링만 하면 가드 불가, 스웨이만 하면 스웨이 불가로 바뀝니다',
  init:b=>{b.rec='';b.ft=BOSSES.muha.recordInterval;b.p0=stats.parries;b.s0=stats.sways;},
  always:(b,dt)=>{b.ft-=dt;if(b.ft<=0){const D=BOSSES.muha;b.ft=D.recordInterval;const dp=stats.parries-b.p0,ds=stats.sways-b.s0;b.p0=stats.parries;b.s0=stats.sways;
    b.rec=dp>ds?'parry':ds>dp?'sway':'';showCut('기록 — '+(b.rec==='parry'?'패링 습관':b.rec==='sway'?'스웨이 습관':'흔적 없음'));
    banner(b.rec==='parry'?'무하가 패링을 기록했다 — 이제 공격이 가드 불가(보라)로 바뀝니다. 회피로 대응!':b.rec==='sway'?'무하가 스웨이를 기록했다 — 이제 공격이 스웨이 불가(주황)로 바뀝니다. 가드 · 패링으로 대응!':'기록할 습관이 없다 — 공격이 기본으로 돌아옵니다',3.5);}},
  state:b=>'기록: '+(b.rec==='parry'?'패링 → 가드 불가':b.rec==='sway'?'스웨이 → 스웨이 불가':'없음')+' · 다음 기록 '+Math.max(0,b.ft).toFixed(0)+'초',
  opts:(b,d)=>{const ty=b.rec==='parry'?'break':b.rec==='sway'?'unsway':'normal';const o=[['slash',d<5?3:0.5,(b,D)=>bCone(b,{r:4,half:65,dmg:D.damage.slash,type:ty,fx:0xf2e8d0,n:2,name:'기록의 검'})],
    ['page',2,(b,D)=>bRain(b,{n:5,r:1.6,dmg:D.damage.page,type:ty,fx:0xffe8b0,col:0xa08a50,name:'흩날리는 기록'})],
    ['seal',1,(b,D)=>bNova(b,{r:4.5,dmg:D.damage.seal,type:'heavy',fx:0xd8c8a0,col:0xa08a50,onHitP:()=>{state.lockTagT=Math.max(state.lockTagT||0,4);popNum(P.x,3,P.z,'기억 봉인 — 교대 4초','hurt');},name:'기억 봉인'})]];
    if(b.p2&&b.lastFn&&b.lastFn.length>=3)o.push(['replay',1.4,(b,D)=>{const fs=b.lastFn.slice();showCut('기억의 재연');fs[0](b,D);for(let i=1;i<fs.length;i++)later(i*1.15,()=>{if(!b.dead&&b.stun<=0&&!state.win){b.action=null;fs[i](b,D);}});}]);return o;}});
/* ---- 연휘 · 인과와 흐름 ---- */
function yhPredict(sec){const b=boss;return{x:clamp(P.x+(b.vx||0)*sec,-13.5,13.5),z:clamp(P.z+(b.vz||0)*sec,-13.5,13.5)};}
simwonBoss('yeonhwi',{col:0xa08ae0,p2name:'인과의 매듭',p2msg:'2페이즈 — 인과 연결이 잦아집니다',tip:'연휘는 당신이 갈 곳을 노립니다. 방향을 바꾸거나 멈추세요 · 금빛 실(인과 연결)은 패링으로 끊습니다',
  init:b=>{b.ft=8;b.link=null;b.px=P.x;b.pz=P.z;b.onParry=()=>{if(b.link){b.link=null;popNum(P.x,3,P.z,'패링 — 인과 단절','info');showCut('인과 보정');}};
    const m=new T.Mesh(new T.CylinderGeometry(0.04,0.04,1,6),new T.MeshBasicMaterial({color:0xe8c86a}));m.visible=false;scene.add(m);b.thread=m;},
  always:(b,dt)=>{const D=BOSSES.yeonhwi;if(dt>0){b.vx=(P.x-b.px)/dt*0.3+(b.vx||0)*0.7;b.vz=(P.z-b.pz)/dt*0.3+(b.vz||0)*0.7;}b.px=P.x;b.pz=P.z;
    if(b.link){b.link.t-=dt;b.thread.visible=true;setBeam(b.thread,b.x,1.6,b.z,P.x,1.2,P.z);if(b.link.t<=0){const dmg=Math.round(b.link.stored*D.linkReturn);b.link=null;b.thread.visible=false;if(dmg>0){showCut('인과 회귀');hurtPlayer(dmg,{type:'unsway',pierce:true,noStagger:true});popNum(P.x,3.2,P.z,'준 피해가 되돌아옴 '+dmg,'hurt');}}}
    else b.thread.visible=false;
    if(!b.action&&b.stun<=0){b.ft-=dt;if(b.ft<=0){b.ft=b.p2?11:16;b.link={t:D.linkTime,stored:0};showCut('인과 연결');banner('인과 연결 '+D.linkTime+'초 — 이 동안 준 피해의 '+Math.round(D.linkReturn*100)+'%가 되돌아옵니다. 패링 한 번이면 끊깁니다',3.5);}}},
  hit:(b,v)=>{if(b.link)b.link.stored+=v;},
  state:b=>b.link?'인과 연결 '+b.link.t.toFixed(1)+'초 · 저장 '+Math.round(b.link.stored)+' (패링으로 끊기)':'',
  opts:(b,d)=>[['slash',d<5?3:0.5,(b,D)=>bCone(b,{r:4,half:60,dmg:D.damage.slash,fx:0xf0e0ff,n:2,lunge:2,name:'인과의 검'})],
    ['predict',2.5,(b,D)=>{bAct(b,'predict',1.8,[[0,()=>{for(let i=0;i<3;i++){const p=yhPredict(0.6+i*0.35);strike({owner:b,kind:'circle',x:p.x,z:p.z,r:1.7,tell:0.75+i*0.3,dmg:D.damage.predict,color:0x8a6ac0,onFire:o=>{ringFx(o.x,o.z,0.4,1.9,0xe8c86a,0.4);burst(o.x,1,o.z,0xa08ae0,10,5,0.35);}});}}]]);bossCall('인과 예측 — 갈 곳을 노림');}],
    ['thread',1.6,(b,D)=>bLine(b,{n:3,spread:0.4,len:12,w:1.2,tell:0.7,dmg:D.damage.thread,fx:0xe8c86a,col:0x8a6ac0,name:'인과의 실'})],
    ['fate',b.p2?1.4:0.6,(b,D)=>{const p=yhPredict(1.0);b.ang=Math.atan2(p.x-b.x,p.z-b.z);b.armorT=1;bAct(b,'fate',1.6,[[0,()=>{strike({owner:b,kind:'line',x:b.x,z:b.z,ang:b.ang,len:15,w:2.4,tell:0.9,dmg:D.damage.fate,type:'heavy',color:0x8a6ac0,onFire:o=>lineFx(o.x,o.z,o.ang,o.len,1.4,0xe8c86a,0.45,0.6)});}]]);bossCall('운명 가르기');}]],
  defeat:b=>{b.link=null;if(b.thread)scene.remove(b.thread);}});
/* ---- 도윤 · 세계의 경계 ---- */
function dyWardUp(b){const D=BOSSES.doyun;b.ward=D.wardHp;b.R=14.5;ringFx(b.x,b.z,0.5,4.5,0xe0a040,0.7);showCut('경계 결계');}
simwonBoss('doyun',{col:0xe0a040,p2name:'경계 재구축',p2msg:'2페이즈 — 경계 결계가 다시 세워지고 전장이 더 빨리 좁아집니다',tip:'경계 결계 중에는 가까이(금빛 원 안) 붙어야 피해가 들어갑니다. 가드파쇄 4번이면 결계가 깨집니다 · 전장이 좁아집니다',
  init:b=>{dyWardUp(b);const m=new T.Mesh(flatGeo(new T.RingGeometry(0.97,1,96)),MB(0xe0a040,0.8));m.position.y=0.1;scene.add(m);b.borderM=m;
    const w=new T.Mesh(flatGeo(new T.RingGeometry(4.3,4.5,48)),MB(0xe0a040,0.5));w.position.y=0.08;scene.add(w);b.wardM=w;},
  onP2:b=>{later(1.7,()=>{if(!b.dead)dyWardUp(b);});},
  always:(b,dt)=>{const D=BOSSES.doyun;if(b.ward>0&&b.stun<=0)b.R=Math.max(D.shrinkMin,b.R-dt*(b.p2?0.28:0.18));b.borderM.scale.setScalar(b.R);b.wardM.position.set(b.x,0.08,b.z);b.wardM.visible=b.ward>0;
    if(Math.hypot(P.x,P.z)>b.R&&!state.win)burnPlayer(D.borderDps,dt);},
  hit:(b,v,src,extra)=>{if(!(b.ward>0))return;const gb=extra&&(extra.gb||extra.pierce);
    if(dist2(P,b)>4.6&&!gb){if(state.time-(b.absT||0)>0.5){b.absT=state.time;popNum(b.x,2.8,b.z,'경계 밖 — 금빛 원 안으로 붙으세요','immune');}return false;}
    if(gb){b.ward--;burst(b.x,1.6,b.z,0xe0a040,14,6,0.4);popNum(b.x,3.2,b.z,'경계 균열 '+(BOSSES.doyun.wardHp-b.ward)+'/'+BOSSES.doyun.wardHp,'info');
      if(b.ward<=0){b.R=14.5;b.stun=BOSSES.doyun.brokenStun;b.broken=b.stun+1;cancelStrikes(b);b.action=null;showCut('경계 붕괴');banner('경계 결계 붕괴 — 도윤 기절 · 전장 복구',3,'big');}}},
  state:b=>b.ward>0?'경계 결계 '+b.ward+'/'+BOSSES.doyun.wardHp+' (가까이 · 가드파쇄) · 전장 반경 '+b.R.toFixed(1):'결계 없음 · 전장 반경 '+b.R.toFixed(1),
  opts:(b,d)=>[['slash',d<5?3:0.5,(b,D)=>bCone(b,{r:4.4,half:70,dmg:D.damage.slash,fx:0xe8e8e0,n:2,name:'경계의 검'})],
    ['bash',d<6?1.6:0.4,(b,D)=>bCone(b,{r:3.4,half:50,dmg:D.damage.bash,type:'break',lunge:4,armor:0.8,fx:0xe0a040,name:'수호의 돌진 — 가드 불가'})],
    ['wall',2,(b,D)=>{bAct(b,'wall',1.8,[[0,()=>{const a=rand(0,PI);for(const off of[-3.2,0,3.2]){const cx=P.x+Math.cos(a)*off,cz=P.z-Math.sin(a)*off,sx=cx-Math.sin(a)*14,sz=cz-Math.cos(a)*14;
      strike({owner:b,kind:'line',x:sx,z:sz,ang:a,len:28,w:1.3,tell:0.9+Math.abs(off)*0.06,dmg:D.damage.wall,type:'heavy',color:0xc08020,opt:{src:{x:sx,z:sz}},onFire:o=>lineFx(o.x,o.z,o.ang,o.len,0.8,0xe0a040,0.4,0.6)});}}]]);bossCall('경계 분할');}]],
  defeat:b=>{if(b.borderM)scene.remove(b.borderM);if(b.wardM)scene.remove(b.wardM);}});
