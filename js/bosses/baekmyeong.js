/* MFT 블루잉크 : 천년청묵 · js/bosses/baekmyeong.js · v1.1
   백명신궁 — 구야(적염의 삼족오) · 하야(청염의 하얀 토끼) · 백야(백룡 → 흑룡, 최종)
     구야: 하늘로 날아오르면 근접 공격이 닿지 않음(원거리 · 연하 음파 · 매향 침은 닿음) → 급강하(가드 불가) · 적염 고사 파동(지속 피해)
           기억 수집 까마귀가 살아 있으면 구야가 강해짐 · 연하의 적안이 반응하면 약점 노출
     하야: 설정의 4연격(초승달 베기 · 반달 공간 왜곡 · 보름달 청염 폭발 · 삭망 백지화 참격)
           청염의 백지화 — 예고 범위와 HUD가 지워지고 방어막이 사라짐 → 패링(역린공명)하면 바로 복원
     백야: 1페이즈 침식기 → 2페이즈 완전 재앙화(흑룡) · 칠흑 비늘 결계(녹기현경 · 녹기쌍룡 · 삼라만화로만 가름) → 3페이즈 즉사기
   수치는 data/enemies.js의 BOSSES.guya · haya · baekya */
'use strict';
/* ================= 구야 ================= */
const GYD=()=>BOSSES.guya;
const gyMul=()=>1+GYD().crowBuff*enemies.filter(e=>e.type==='minion'&&!e.dead).length;
function gyCrows(b){for(const[x,z]of ringPts(3,8,rand(0,TAU)))spawnMinion(x,z,{hp:40,avatar:'crowling',col:0xff3a2a,atkCol:0xc02020,dmg:8,speed:4,stagger:12});popNum(b.x,3.6,b.z,'기억 수집 까마귀 — 살아 있으면 구야 강화','info');}
const gyWither=()=>{const D=GYD();P.wither=D.witherTime;P.witherDps=D.witherDps;popNum(P.x,3,P.z,'적염 — 고사','hurt');};
BOSS_INIT.guya=function(b){b.r=1.3;b.fly=false;b.eyeT=10;later(0.8,()=>{if(!b.dead)gyCrows(b);});
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('구야 — 날아오르면 근접 공격이 닿지 않습니다(연하 · 매향의 원거리는 닿음). 급강하는 회피로 스웨이!',5);});};
BOSS_HIT.guya=function(b,v,src){if(b.fly&&src!=='ranged'&&src!=='skill'&&src!=='counter'){if(state.time-(b.absT||0)>0.5){b.absT=state.time;popNum(b.x,3.4,b.z,'하늘 — 근접 공격이 닿지 않음','immune');}return false;}};
function gyDive(b){const D=GYD();b.fly=true;b.armorT=0;bossCall('적염 급강하');
  bAct(b,'dive',3.6,[[0.2,()=>{b.dash={x:clamp(P.x+rand(-5,5),-12,12),z:clamp(P.z+rand(-5,5),-12,12),t:0.9};}],
    [1.2,()=>{bRainRaw(b,{n:5,r:1.5,dmg:D.damage.feather*gyMul(),fx:0xff6a4a,col:0xc02020});}],
    [2.4,()=>{faceP(b);const a=b.ang,L=Math.min(14,dist2(P,b)+2);strike({owner:b,kind:'line',x:b.x,z:b.z,ang:a,len:L,w:2.4,tell:0.7,dmg:D.damage.dive*gyMul(),type:'break',color:0xc02020,
      onFire:o=>{b.fly=false;b.dash={x:clamp(o.x+Math.sin(a)*(L-1),-13,13),z:clamp(o.z+Math.cos(a)*(L-1),-13,13),t:0.2};lineFx(o.x,o.z,a,L,2,0xff3a2a,0.45,0.6);shake(0.5);}});}],
    [3.4,()=>{b.fly=false;}]]);}
function bRainRaw(b,o){for(let i=0;i<o.n;i++){const x=clamp(P.x+(i?rand(-4,4):0),-13.5,13.5),z=clamp(P.z+(i?rand(-4,4):0),-13.5,13.5);strike({owner:b,kind:'circle',x,z,r:o.r,tell:0.8+i*0.1,dmg:o.dmg,color:o.col,onFire:s=>{burst(s.x,1.2,s.z,o.fx,10,6,0.4);}});}}
BOSS_AI.guya=function(b,dt){const D=GYD();
  if(PARTY.yeonha.hp>0&&!b.dead){b.eyeT-=dt;if(b.eyeT<=0){b.eyeT=12;b.vuln=Math.max(b.vuln||0,4);popNum(b.x,3.6,b.z,'연하의 적안 — 약점 노출 (받는 피해 1.3배)','info');}}
  if(bossCommon(b,dt)){b.fly=false;return;}
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){bPhase(b,'태양의 적염',0xff3a2a,'2페이즈 — 까마귀가 다시 모이고 고사 파동이 퍼집니다');later(1.7,()=>{if(!b.dead)gyCrows(b);});return;}
  if(b.action){runBossAction(b,dt);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,6,3);
  b.cd-=dt;if(b.cd<=0&&!P.dead){const m=gyMul();const pick=pickWeighted(b,d>6?[['dive',3],['sun',1]]:[['wing',3],['dive',1.6],['sun',b.p2?2:1]]);
    if(pick==='dive')gyDive(b);
    else if(pick==='wing')bCone(b,{r:4.4,half:85,dmg:D.damage.wing*m,type:'heavy',fx:0xff6a4a,col:0xc02020,n:2,name:'적염 날개 휩쓸기'});
    else bNova(b,{r:4.8,tell:1.0,dmg:D.damage.sun*m,type:'unsway',fx:0xff3a2a,col:0xc02020,ring:b.p2,ringDmg:D.damage.sun*0.6,onHitP:gyWither,name:'적염 고사 파동 — 스웨이 불가'});}};
BOSS_ANIM.guya=function(b,dt){animBeast(b,dt);};
BOSS_STATE.guya=b=>{const n=enemies.filter(e=>e.type==='minion'&&!e.dead).length;return b.fly?'하늘 — 근접 공격이 닿지 않음':n?'까마귀 '+n+' — 구야 피해 +'+Math.round(n*GYD().crowBuff*100)+'%':'';};
BOSS_DEFEAT.guya=function(b){b.fly=false;P.wither=0;};
/* ================= 하야 ================= */
const HYD=()=>BOSSES.haya;
function hyBlank(){const D=HYD();state.blankT=D.blankTime;P.shield=0;showCut('청염의 백지화');banner('백지화 '+D.blankTime+'초 — 예고 범위와 HUD가 지워졌다! 패링(역린공명)하면 복원됩니다'+(PARTY.yeonha.hp>0?' · 연하의 청안이 반응한다':''),3.5);}
function hyCrescent(b,t0=0){return[t0,()=>{faceP(b);strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:3.9,half:70*DEG,tell:0.5,dmg:HYD().damage.crescent,color:0x3a7ae0,onFire:o=>arcTrail(o.x,o.z,o.ang,3.9,o.half,0x9fd8ff,1.2,0.8)});}];}
function hyHalfmoon(b,t0=0){return[t0,()=>{burst(b.x,1.4,b.z,0x5ab8ff,14,6,0.4);const a=P.ang+PI;b.x=clamp(P.x+Math.sin(a)*2.2,-13,13);b.z=clamp(P.z+Math.cos(a)*2.2,-13,13);faceP(b);burst(b.x,1.4,b.z,0xf4f8ff,16,6,0.4);
  strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:b.ang,r:3.4,half:55*DEG,tell:0.5,dmg:HYD().damage.halfmoon,type:'break',color:0x3a7ae0,onFire:o=>arcTrail(o.x,o.z,o.ang,3.4,o.half,0x5ab8ff,1.1,0.7)});}];}
function hyFullmoon(b,t0=0){return[t0,()=>{strike({owner:b,kind:'circle',x:b.x,z:b.z,r:3.8,tell:0.7,dmg:HYD().damage.fullmoon,type:'heavy',color:0x3a7ae0,onHitP:()=>{const a=Math.atan2(P.x-b.x,P.z-b.z);P.x=clamp(P.x+Math.sin(a)*3,-13.5,13.5);P.z=clamp(P.z+Math.cos(a)*3,-13.5,13.5);},
  onFire:o=>{ringFx(o.x,o.z,0.6,4.2,0x5ab8ff,0.6,0.3);burst(o.x,1.6,o.z,0x9fd8ff,30,8,0.5);shake(0.35);}});}];}
function hyBlankCut(b,t0=0){return[t0,()=>{faceP(b);strike({owner:b,kind:'line',x:b.x,z:b.z,ang:b.ang,len:16,w:1.5,tell:0.65,dmg:HYD().damage.blank,type:'unsway',color:0x1a1a1a,opt:{pierce:true},
  onHitP:()=>{if(!(state.blankT>0))hyBlank();},onFire:o=>{lineFx(o.x,o.z,o.ang,o.len,1.2,0x141414,0.5,1.2);if(b.p2&&!(state.blankT>0))hyBlank();}});}];}
BOSS_INIT.haya=function(b){b.onParry=()=>{if(state.blankT>0){state.blankT=0;popNum(P.x,3.2,P.z,'역린공명 — 백지 복원','info');showCut('복원');}};
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('하야 — 4연격 마지막 「삭망」에 맞으면 예고 범위와 HUD가 지워집니다(백지화). 패링하면 바로 복원!',5);});};
BOSS_AI.haya=function(b,dt){const D=HYD();
  if(bossCommon(b,dt))return;
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){bPhase(b,'삭망 — 청염의 시공',0x5ab8ff,'2페이즈 — 삭망 참격이 휘둘러지기만 해도 백지화됩니다');return;}
  if(b.action){runBossAction(b,dt);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,7,2.8);
  b.cd-=dt;if(b.cd<=0&&!P.dead){const pick=pickWeighted(b,d>6?[['halfmoon',3],['blankcut',1.5]]:[['combo',3],['crescent',2],['fullmoon',1.5],['halfmoon',1.5]]);
    if(pick==='combo'){bAct(b,'combo',3.6,[hyCrescent(b,0),hyHalfmoon(b,0.85),hyFullmoon(b,1.7),hyBlankCut(b,2.6)]);bossCall('옥토 4연격 — 초승달 · 반달 · 보름달 · 삭망');}
    else if(pick==='crescent'){bAct(b,'crescent',1.0,[hyCrescent(b)]);bossCall('초승달 베기');}
    else if(pick==='halfmoon'){bAct(b,'halfmoon',1.1,[hyHalfmoon(b)]);bossCall('반달 공간 왜곡 — 가드 불가');}
    else if(pick==='fullmoon'){bAct(b,'fullmoon',1.3,[hyFullmoon(b)]);bossCall('보름달 청염 폭발');}
    else{bAct(b,'blankcut',1.3,[hyBlankCut(b)]);bossCall('삭망 — 백지화 참격');}}};
BOSS_ANIM.haya=function(b,dt){animHumanBoss(b,dt);b.mesh.userData.flameAura.material.opacity=(b.p2?0.18:0.1)+0.05*Math.sin(state.time*6);};
BOSS_STATE.haya=b=>state.blankT>0?'백지화 '+state.blankT.toFixed(1)+'초 — 패링으로 복원':'';
BOSS_DEFEAT.haya=function(b){state.blankT=0;};
/* ================= 백야 ================= */
const BYD=()=>BOSSES.baekya;
BOSS_INIT.baekya=function(b){b.r=2.2;b.abyssT=10;b.barrierName='칠흑 비늘 결계';
  later(1.2,()=>{if(!state.over&&b&&!b.dead)banner('백야 — 거대한 몸집 · 꼬리는 뒤쪽을 휩씁니다. 브레스는 가드, 꼬리 · 발톱은 스웨이',5);});};
function byClaw(b){const D=BYD();bCone(b,{r:5.4,half:70,dmg:D.damage.claw,type:b.p2?'break':'normal',fx:b.p2?0x8a1018:0xf4f0e8,col:b.p2?0x5a0a10:undefined,n:2,gap:0.8,name:'백룡 발톱'});}
function byBreath(b){const D=BYD();bLine(b,{len:17,w:3.2,tell:1.0,dmg:D.damage.breath,type:'heavy',fx:b.p2?0x141414:0xffffff,col:b.p2?0x3a0508:0xb0b0b0,armor:1.2,n:b.p2?3:1,spread:0.4,name:b.p2?'칠흑 브레스':'백염 브레스'});}
function byTail(b){const D=BYD();b.armorT=0.8;bAct(b,'tail',1.4,[[0,()=>{const a=b.ang+PI;strike({owner:b,kind:'cone',x:b.x,z:b.z,ang:a,r:6,half:80*DEG,tell:0.65,dmg:D.damage.tail,type:'heavy',color:0x5a0a10,opt:{src:{x:b.x,z:b.z}},
  onFire:o=>{arcTrail(o.x,o.z,o.ang,6,o.half,0xc8202a,1.3,1);shake(0.35);}});}]]);bossCall('꼬리 휩쓸기 — 뒤쪽');}
function byGust(b){const D=BYD();bNova(b,{r:5.5,dmg:D.damage.gust,type:'unsway',fx:0xf4f0e8,col:0x8a8a8a,ring:true,ringDmg:D.damage.gust,name:'날갯짓 — 흑백 폭풍 (스웨이 불가)'});}
function byScales(b){const D=BYD();bRain(b,{n:7,spread:6,r:1.6,dmg:D.damage.scale,fx:0x141414,col:0x3a0508,name:'흑린 낙하'});}
function byPhase2(b){const D=BYD();b.p2=true;b.barrier=true;b.invulnT=1.6;cancelStrikes(b);b.action=null;showCut('완전 재앙화 — 흑룡');const u=b.mesh.userData;u.robe.color.setHex(0x141414);u.robe.emissive.setHex(0x3a0508);
  ringFx(b.x,b.z,1,12,0x141414,0.8,0.2,1.0);burst(b.x,2.5,b.z,0x5a0a10,40,10,0.6,1.2);shake(0.6);
  const L=DIALOG.bosses.baekya.climax;later(1.6,()=>{if(b.dead||state.over)return;dialog(L,()=>{PARTY.sup.yeonha=100;PARTY.sup.maehyang=100;PARTY.samraUsed=false;P.baek=Math.max(P.baek,80);P.clarity=100;
    banner('칠흑 비늘 결계 — 녹기현경(침식도 3단계 + 청명도 가득 → R) · 녹기쌍룡(검 모드 Z) · 삼라만화(V)로만 가를 수 있습니다'+(P.char!=='yeonwoo'?' — 1번으로 연우 교대!':''),7,'big');});});}
BOSS_BREAK.baekya=function(b){bossShatter(b,BYD().brokenStun,'칠흑 비늘 결계 — 파쇄','비늘 결계가 갈라졌다! 백야 긴 기절 · 받는 피해 '+BYD().brokenDamageMul+'배');};
function byAbyss(b){const D=BYD();b.abyssT=D.abyssInterval;b.armorT=3.2;b.dash={x:0,z:0,t:0.5};showCut('백명 — 공백의 심연');
  bAct(b,'abyss',3.8,[[0.5,()=>{strike({owner:b,kind:'circle',x:0,z:0,r:10.5,tell:2.9,dmg:D.damage.abyss,type:'lethal',onFire:o=>{ringFx(0,0,1,11.5,0x141414,0.8,0.2,1.0);burst(0,2.5,0,0x141414,50,12,0.6,1.2);shake(0.9);}});}]]);
  banner('즉사기 『공백의 심연』 — 가장자리로 피하거나 회피 · 교대 · 궁극기의 무적으로 버티세요',3.5,'big');}
BOSS_AI.baekya=function(b,dt){const D=BYD();
  if(bossCommon(b,dt))return;
  if(!b.action&&!b.p2&&b.hp<=b.maxHp*D.phase2At){byPhase2(b);return;}
  if(!b.action&&!b.p3&&b.p2&&!b.barrier&&b.hp<=b.maxHp*D.phase3At){b.p3=true;b.abyssT=6;showCut('흑룡의 마지막 포효');banner('3페이즈 — 공백의 심연(즉사기)이 주기적으로 펼쳐집니다',3.5);}
  if(b.p3&&!b.action){b.abyssT-=dt;if(b.abyssT<=0){byAbyss(b);return;}}
  if(b.action){runBossAction(b,dt);return;}
  const d=bossWalk(b,dt,b.p2?D.walkSpeedP2:D.walkSpeed,2.4,4);
  b.cd-=dt;if(b.cd<=0&&!P.dead){const behind=!bossFacingP(b,90);const opts=behind?[['tail',4],['gust',1]]:d>7?[['breath',3],['scales',b.p2?2:0.8]]:[['claw',3],['breath',1.5],['gust',1.2]];if(b.p2&&!behind)opts.push(['scales',1.2]);
    const pick=pickWeighted(b,opts);({claw:byClaw,breath:byBreath,tail:byTail,gust:byGust,scales:byScales})[pick](b);}};
BOSS_ANIM.baekya=function(b,dt){animBeast(b,dt);const u=b.mesh.userData;u.aura.material.color.setHex(b.barrier?0x141414:b.p2?0x8a1018:0xffffff);u.aura.material.opacity=b.barrier?0.3+0.08*Math.sin(state.time*5):u.aura.material.opacity;};
BOSS_STATE.baekya=b=>b.barrier?'칠흑 비늘 결계 — 녹기현경 · 녹기쌍룡 · 삼라만화로만 가름':b.p3?'3페이즈 · 다음 공백의 심연 '+Math.max(0,b.abyssT).toFixed(0)+'초':'';
BOSS_DEFEAT.baekya=function(b){const u=b.mesh.userData;u.robe.color.setHex(0xf8f6f0);u.robe.emissive.setHex(0x1d5a48);u.aura.material.color.setHex(0x6fe0b8);};
