/* MFT 블루잉크 : 천년청묵 · js/ui.js · v1.1
   (v0.5: 지도 · 설정 · 새 조작 체계 추가)
   HUD · 대화창 · 입력(키보드·마우스·터치) */
'use strict';
/* ================= UI ================= */
const nums=[];const _p=new T.Vector3();
function popNum(x,y,z,text,cls){if(!SETTINGS.nums&&cls!=='info'&&cls!=='warn')return;const el=document.createElement('div');el.className='num '+(cls||'');el.textContent=text;$('dmgLayer').appendChild(el);nums.push({el,x,y,z,t:0,life:cls==='info'?1.6:cls==='warn'?1.3:0.9});if(nums.length>45){nums.shift().el.remove();}}
function updateNums(dt){for(let i=nums.length-1;i>=0;i--){const n=nums[i];n.t+=dt;if(n.t>=n.life){n.el.remove();nums.splice(i,1);continue;}_p.set(n.x,n.y,n.z).project(camera);
  const sx=(_p.x*0.5+0.5)*innerWidth,sy=(-_p.y*0.5+0.5)*innerHeight-n.t*40;n.el.style.transform=`translate(${sx}px,${sy}px) translate(-50%,-50%)`;n.el.style.opacity=Math.min(1,(n.life-n.t)/0.3);}}
let bannerT=0,sayT=0;
function banner(t,dur=2.5,cls=''){const el=$('banner');el.textContent=t;el.className='hud '+cls;el.style.opacity=1;bannerT=dur;}
function say(n,t,dur=3.5){$('sayN').textContent=n;$('sayN').style.color=DIALOG.nameColors[n]||'#b23a5a';$('sayT').textContent=t;$('say').style.opacity=1;sayT=dur;}
function skillName(n){const el=$('skill');el.textContent=n;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');}
function showCut(t){$('cutT').textContent=t;const el=$('cut');el.classList.remove('on');void el.offsetWidth;el.classList.add('on');}
function slashFx(){const el=$('slash');el.classList.remove('on');void el.offsetWidth;el.classList.add('on');}
function vig(){const v=$('vig');v.style.transition='none';v.style.opacity=1;void v.offsetWidth;v.style.transition='opacity .45s';v.style.opacity=0;}
const uiCache={};
function setS(id,prop,val){const key=id+prop;if(uiCache[key]===val)return;uiCache[key]=val;$(id).style[prop]=val;}
function setT(id,val){if(uiCache[id+'t']===val)return;uiCache[id+'t']=val;$(id).textContent=val;}
function setH(id,val){if(uiCache[id+'h']===val)return;uiCache[id+'h']=val;$(id).innerHTML=val;}
function setC(id,cls,on){const key=id+'c'+cls;if(uiCache[key]===on)return;uiCache[key]=on;$(id).classList.toggle(cls,on);}
const SKL={brush:['만묵소진','묵향결쇄'],sword:['점묵개화','유묵섬참'],yeonha:['적안<br>경고의 음','청안<br>균열 노출'],maehyang:['매화<br>혈맥진','생기<br>착근']};
const ULTL={yeonwoo:'천지<br>수묵',yeonha:'시공<br>정지',maehyang:'매령<br>회생진'};
const BADGE={brush:'붓 모드',sword:'검 모드',yeonha:'피리',maehyang:'침술'};
function updateUI(dt){updateInteractUI();updatePartyHud();
  setS('hpFill','width',(P.hp/P.maxHp*100).toFixed(1)+'%');setS('shFill','width',(P.shield/P.maxShield*100).toFixed(1)+'%');setT('shTxt',Math.floor(P.shield)+'/'+P.maxShield);setT('hpTxt',Math.ceil(P.hp)+'/'+P.maxHp);
  setS('clFill','width',P.clarity.toFixed(1)+'%');setC('clFill','hwag',!!P.hwag);setT('clTxt',Math.floor(P.clarity)+(P.hwag?' 영로화경':''));setS('yrFill','width',(P.yr/CONFIG.resource.yrMax*100).toFixed(1)+'%');setT('yrTxt',Math.floor(P.yr));
  setC('phud','guarding',!!P.guarding);setT('defTag',P.guardBroken>0?'가드 파쇄됨':P.parrySeal>0?'패링 봉인':P.swayCtr>0?'스웨이 반격 기회':P.guarding?(P.parryT>0?'패링!':'가드'):P.link&&P.link.t>0?'연계 준비':'');
  const nk=P.nokgi>0,bst=stageOf();setS('bkFill','width',(nk?P.nokgi/CONFIG.nokgi.duration*100:P.baek).toFixed(1)+'%');setC('bkFill','nokgi',nk);
  setT('bkStage',nk?'5 녹기현경 · 녹기 '+Math.ceil(P.nokgi)+'초':bst>=4?(P.hwagForced?'4 영로화경 · 폭주':'4 영로화경'):STAGE_NAME[bst]);
  setS('swFill','width',P.sw.toFixed(1)+'%');setC('swFill','full',P.sw>=100);
  const brush=P.mode==='brush',yw=P.char==='yeonwoo';setT('pName',CHARACTERS[P.char].name);setT('modeBadge',BADGE[P.mode]);setC('modeBadge','sword',P.mode==='sword');
  setH('lS1',SKL[P.mode][0]);setH('lS2',SKL[P.mode][1]);const nkReady=yw&&P.hwag&&P.nokgi<=0;setH('lUlt',nkReady?'녹기<br>현경':ULTL[P.char]);setC('swRow','off',!yw);
  setH('lSw',!yw?'전환<br>—':brush?'전환<br>→검':'전환<br>→붓');setC('bSw','ready',yw&&P.sw>=100);setC('bSw','dis',!yw);
  const cdSet=(id,v,max)=>setS(id,'height',(max>0?clamp(v/max,0,1)*100:0).toFixed(0)+'%');
  const q=document.querySelector.bind(document);
  cdSet2('bDash',P.cds.dash,CONFIG.player.dashCd);cdSet2('bS1',P.cds[skillId(1)],CD[skillId(1)]);cdSet2('bS2',P.cds[skillId(2)],CD[skillId(2)]);cdSet2('bDodge',Math.max(0,P.dodgeCd),1.1);
  const f=Math.floor(P.ult)+'%';if(uiCache.ult!==f){uiCache.ult=f;$('bUlt').style.setProperty('--f',f);}setC('bUlt','ready',P.ult>=100||nkReady);setC('bUlt','nokgi',nkReady);
  for(const [id,k] of [['bJ1','yeonha'],['bJ2','mae'],['bJ3','all']]){const ok=canJoint(k);if(uiCache[id+'j']!==ok){uiCache[id+'j']=ok;$(id).hidden=!ok;}}
  if(PARTY){setH('lJ1',P.mode==='sword'?'녹기<br>쌍룡':'쌍안<br>연화');}
  if(boss){setS('bstgFill','width',(boss.groggy>0?100:Math.max(0,boss.stg)/boss.stgMax*100).toFixed(1)+'%');setC('bstgFill','groggy',boss.groggy>0);setS('bhpFill','width',(Math.max(0,boss.hp)/boss.maxHp*100).toFixed(1)+'%');setS('bshFill','width',(boss.shield/boss.maxHp*100).toFixed(1)+'%');
    const pips=$('bpips').children;for(let i=0;i<5;i++)setC2(pips[i],i<boss.stacks);
    let s='';if(boss.dead)s='정화됨';else if(boss.groggy>0)s='무력화 · 받는 피해 '+CONFIG.combat.groggyDamageMul+'배';else if(boss.stun>0)s=boss.broken>0?'기절 · 받는 피해 150%':'기절';else if(boss.barrier)s=(boss.barrierName||'아크 방어막')+' — 무적 · 룬 '+enemies.filter(e=>isRune(e)&&!e.dead).length+'개';else if(BOSS_STATE[boss.id]&&BOSS_STATE[boss.id](boss))s=BOSS_STATE[boss.id](boss);else if(boss.armorT>0)s='강체 — 가드파쇄로 끊기';else if(boss.stance>0)s='유수 반격 자세';else if(boss.runeActive)s='청룡의 정화 룬 · 피해 80% 감소 · 먹선 '+runes.filter(r=>r.linked).length+'/3';
    else if(boss.id==='baekjin')s=(boss.guardDown>0?'방패 내려감 — 공격 기회':'정면 방패 가드')+' · 성기 '+Math.floor(boss.holy)+'%';else if(boss.p3)s='3페이즈 · 즉사기 주의';else if(boss.p2)s=boss.id==='cheonjehyeok'?'2페이즈 · 흑염 각성':boss.id==='cheongryu'?'2페이즈 · 청룡의 도류':'2페이즈';setT('bstate',s);}
  if(bannerT>0){bannerT-=dt;if(bannerT<=0)$('banner').style.opacity=0;}
  if(sayT>0){sayT-=dt;if(sayT<=0)$('say').style.opacity=0;}
  if(state.bcallT>0){state.bcallT-=dt;if(state.bcallT<=0)$('bcall').style.opacity=0;}}
function cdSet2(id,v,max){const el=$(id).firstElementChild;const val=(max>0?clamp(v/max,0,1)*100:0).toFixed(0)+'%';if(uiCache[id+'cd']===val)return;uiCache[id+'cd']=val;el.style.height=val;}
function setC2(el,on){if(el._on===on)return;el._on=on;el.classList.toggle('on',on);}

/* ================= 대화 ================= */
let dialogOpen=false,dlgQ=[],dlgEnd=null,dlgLast=0;
function dialog(lines,end){dlgQ=lines.slice();dlgEnd=end;dialogOpen=true;$('dialog').hidden=false;atkHold.down=false;showLine();}
function showLine(){const l=dlgQ.shift();$('dlgN').textContent=l.n;$('dlgN').style.color=DIALOG.nameColors[l.n]||'#1a1816';$('dlgT').textContent=l.t;dlgLast=performance.now();}
function advanceDialog(){if(performance.now()-dlgLast<220)return;if(dlgQ.length)showLine();else{dialogOpen=false;$('dialog').hidden=true;const f=dlgEnd;dlgEnd=null;if(f)f();}}
$('dialog').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();advanceDialog();});

/* ================= 입력 ================= */
const input={mx:0,mz:0,mag:0,keys:{},guardHeld:false};
const joy={id:null,ox:0,oy:0,x:0,y:0};
function press(q){if(!state.running||state.paused||state.mapOpen)return;if(dialogOpen){advanceDialog();return;}if(P.dead||state.win)return;
  if(q==='interact'){if(!interact())flashBtn(q);return;}
  if(P.seal>0&&(q==='s1'||q==='s2'||q==='sw'||q==='ult')){flashBtn(q);popNum(P.x,2.6,P.z,'봉인 — '+(P.sealName||'단절'),'immune');return;}
  if(!ready(q)){flashBtn(q);if((q==='s1'||q==='s2')&&P.cds[skillId(q[1])]<=0&&P.yr<skillCost(skillId(q[1])))popNum(P.x,2.6,P.z,'영로 부족 ('+skillCost(skillId(q[1]))+' 필요)','info');}P.queue=q;P.queueT=0.35;}
const BTN={j1:'bJ1',j2:'bJ2',j3:'bJ3',atk:'bAtk',str:'bAtk',jump:'bJump',s1:'bS1',s2:'bS2',dodge:'bDodge',dash:'bDash',sw:'bSw',ult:'bUlt',interact:'bInt'};
function flashBtn(q){const el=$(BTN[q]);if(!el)return;el.classList.remove('no');void el.offsetWidth;el.classList.add('no');}
function bindBtn(id,q){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();el.classList.add('down');press(q);});
  const up=()=>el.classList.remove('down');el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up);el.addEventListener('contextmenu',e=>e.preventDefault());}
/* 공격 입력: 짧게 = 공격 · HOLD_T초 이상 = 강공격 · 공중 + 점프 강공격 키(Ctrl) = 점프 강공격 */
const HOLD_T=CONFIG.holdTime;const atkHold={down:false,t:0,fired:false,src:'mouse'};
const isAir=()=>P&&P.y>0.05;
const ctrlHeld=()=>CONFIG.keys.jumpStrong.some(k=>input.keys[k]);
function atkDown(src,ctrl){if(dialogOpen){advanceDialog();return;}if(!state.running||state.paused||state.mapOpen)return;atkHold.down=true;atkHold.t=0;atkHold.fired=false;atkHold.src=src;
  if(ctrl&&isAir()){atkHold.fired=true;press('str');}}
function atkUp(){if(!atkHold.down)return;atkHold.down=false;if(!atkHold.fired)press('atk');}
function updateHold(dt){if(atkHold.down&&!atkHold.fired){atkHold.t+=dt;if(atkHold.t>=HOLD_T){atkHold.fired=true;
  if(isAir())press(atkHold.src==='touch'?'str':'atk');else press('str');}}}
{const el=$('bAtk');el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();el.classList.add('down');atkDown('touch',false);});const up=()=>{el.classList.remove('down');atkUp();};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up);el.addEventListener('contextmenu',e=>e.preventDefault());}
bindBtn('bJump','jump');bindBtn('bS1','s1');bindBtn('bS2','s2');bindBtn('bDodge','dodge');bindBtn('bDash','dash');bindBtn('bSw','sw');bindBtn('bUlt','ult');bindBtn('bInt','interact');
{const el=$('bGuard');el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();el.classList.add('down');if(dialogOpen){advanceDialog();return;}input.guardHeld=true;});const up=()=>{el.classList.remove('down');input.guardHeld=false;};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up);el.addEventListener('contextmenu',e=>e.preventDefault());}
for(const [id,k] of [['bJ1','yeonha'],['bJ2','mae'],['bJ3','all']]){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();tryJoint(k);});}
const KMAP={};{const K=CONFIG.keys;KMAP[K.skill1]='s1';KMAP[K.skill2]='s2';KMAP[K.ult]='ult';KMAP[K.switch]='sw';KMAP[K.jump]='jump';KMAP[K.interact]='interact';for(const k of K.dodge)KMAP[k]='dodge';}
addEventListener('keydown',e=>{const k=e.code,K=CONFIG.keys;
  if(k===K.master){e.preventDefault();if(!e.repeat)toggleMaster();return;}
  if(k===K.settings){e.preventDefault();if(state.mapOpen)toggleMap();else if(!dialogOpen)togglePause();return;}
  if(dialogOpen&&(k==='Space'||k==='Enter')){e.preventDefault();if(!e.repeat)advanceDialog();return;}
  input.keys[k]=true;
  if(KMAP[k]||k==='Tab'||k===K.guard||K.jumpStrong.includes(k)||K.swap.includes(k))e.preventDefault();
  if(e.repeat)return;
  if(k===K.map){toggleMap();return;}
  if(k===K.guard){input.guardHeld=true;return;}
  if(k===K.jointYeonha){tryJoint('yeonha');return;}if(k===K.jointMae){tryJoint('mae');return;}if(k===K.jointAll){tryJoint('all');return;}
  if(K.jumpStrong.includes(k)&&atkHold.down&&!atkHold.fired&&isAir()){atkHold.fired=true;press('str');return;}
  const si=K.swap.indexOf(k);if(si>=0){e.preventDefault();trySwap(si);return;}
  if(KMAP[k])press(KMAP[k]);});
addEventListener('keyup',e=>{input.keys[e.code]=false;if(e.code===CONFIG.keys.guard)input.guardHeld=false;});
addEventListener('blur',()=>{input.keys={};atkHold.down=false;input.guardHeld=false;});
renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;if(dialogOpen){advanceDialog();return;}
  if(e.button===0)atkDown('mouse',e.ctrlKey||ctrlHeld());else if(e.button===2)press('dash');});
addEventListener('pointerup',e=>{if(e.pointerType==='mouse'&&e.button===0)atkUp();});
renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
const zone=$('joyZone'),jb=$('joyBase'),jk=$('joyKnob');
zone.addEventListener('pointerdown',e=>{e.preventDefault();if(dialogOpen){advanceDialog();return;}if(joy.id!==null)return;joy.id=e.pointerId;joy.ox=e.clientX;joy.oy=e.clientY;joy.x=joy.y=0;try{zone.setPointerCapture(e.pointerId);}catch(_){}jb.style.left=e.clientX+'px';jb.style.top=e.clientY+'px';jb.style.display='block';jk.style.transform='';});
zone.addEventListener('pointermove',e=>{if(e.pointerId!==joy.id)return;let dx=e.clientX-joy.ox,dy=e.clientY-joy.oy;const m=Math.hypot(dx,dy),R=50;if(m>R){dx=dx/m*R;dy=dy/m*R;}joy.x=dx/R;joy.y=dy/R;jk.style.transform=`translate(${dx}px,${dy}px)`;});
const jend=e=>{if(e.pointerId!==joy.id)return;joy.id=null;joy.x=joy.y=0;jb.style.display='none';};
zone.addEventListener('pointerup',jend);zone.addEventListener('pointercancel',jend);
function readMove(){let mx=0,mz=0;if(joy.id!==null){mx=joy.x;mz=joy.y;}else{const K=input.keys;mx=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0);mz=(K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.ArrowUp?1:0);const m=Math.hypot(mx,mz);if(m>1){mx/=m;mz/=m;}}
  if(state&&state.invertT>0){mx=-mx;mz=-mz;}
  const m=Math.hypot(mx,mz);input.mx=m<0.15?0:mx;input.mz=m<0.15?0:mz;input.mag=m<0.15?0:Math.min(1,m);}

/* ================= 지도 (M) ================= */
function toggleMap(){if(!state.running||state.over||state.win||state.paused||dialogOpen)return;state.mapOpen=!state.mapOpen;$('mapScr').hidden=!state.mapOpen;if(state.mapOpen)drawMap();}
function drawMap(){const cv=$('mapCv'),g=cv.getContext('2d'),W=cv.width,c=W/2,s=(W/2-16)/(ARENA+1);const X=x=>c+x*s,Y=z=>c+z*s;
  g.clearRect(0,0,W,W);g.fillStyle='#e9e3d5';g.beginPath();g.arc(c,c,(ARENA+1)*s,0,TAU);g.fill();
  g.strokeStyle='#1a1816';g.lineWidth=6;g.beginPath();g.arc(c,c,(ARENA+0.6)*s,0,TAU);g.stroke();
  for(const d of decals){g.fillStyle='rgba(63,174,140,.25)';g.beginPath();g.arc(X(d.m.position.x),Y(d.m.position.z),d.r*s*0.8,0,TAU);g.fill();}
  for(const p of puddles){g.fillStyle='rgba(90,14,22,.55)';g.beginPath();g.arc(X(p.x),Y(p.z),p.r*s,0,TAU);g.fill();}
  for(const it of items){const D=ITEMS[it.type];g.fillStyle='#'+D.color.toString(16).padStart(6,'0');g.strokeStyle='#1a1816';g.lineWidth=2;g.beginPath();g.arc(X(it.x),Y(it.z),7,0,TAU);g.fill();g.stroke();}
  for(const r of runes){g.fillStyle=r.linked?'#1a1816':'#7fd4ff';g.save();g.translate(X(r.x),Y(r.z));g.rotate(PI/4);g.fillRect(-8,-8,16,16);g.restore();}
  for(const e of enemies){if(e.dead)continue;const boss_=e.type==='boss';g.fillStyle=boss_?'#2b6b8a':'#b3242f';g.beginPath();g.arc(X(e.x),Y(e.z),boss_?14:8,0,TAU);g.fill();if(boss_){g.fillStyle='#fff';g.font='bold 14px sans-serif';g.textAlign='center';g.fillText('청류',X(e.x),Y(e.z)-20);}}
  g.save();g.translate(X(P.x),Y(P.z));g.rotate(-P.ang+PI);g.fillStyle='#3fae8c';g.strokeStyle='#141414';g.lineWidth=3;g.beginPath();g.moveTo(0,-16);g.lineTo(11,11);g.lineTo(-11,11);g.closePath();g.fill();g.stroke();g.restore();
  g.fillStyle='#1a1816';g.font='bold 16px sans-serif';g.textAlign='center';g.fillText('청옥림',c,26);}
$('mapScr').addEventListener('pointerdown',e=>{e.preventDefault();toggleMap();});
$('mapBtn').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();toggleMap();});

/* ================= 설정 (Esc) ================= */
const SETTINGS={shake:true,nums:true,hq:true};
try{Object.assign(SETTINGS,JSON.parse(localStorage.getItem('blueink-settings')||'{}'));}catch(_){}
function applySettings(){renderer.setPixelRatio(SETTINGS.hq?Math.min(window.devicePixelRatio||1,isTouch?1.5:2):1);renderer.setSize(innerWidth,innerHeight);
  document.querySelectorAll('.tg').forEach(b=>{const on=SETTINGS[b.dataset.k];b.textContent=b.dataset.k==='hq'?(on?'높음':'낮음'):(on?'켜기':'끄기');b.classList.toggle('on',on);});
  try{localStorage.setItem('blueink-settings',JSON.stringify(SETTINGS));}catch(_){}}
document.querySelectorAll('.tg').forEach(b=>b.addEventListener('click',()=>{SETTINGS[b.dataset.k]=!SETTINGS[b.dataset.k];applySettings();}));
applySettings();
