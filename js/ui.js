/* MFT 블루잉크 : 천년청묵 · js/ui.js · v0.4
   HUD · 대화창 · 입력(키보드·마우스·터치) */
'use strict';
/* ================= UI ================= */
const nums=[];const _p=new T.Vector3();
function popNum(x,y,z,text,cls){const el=document.createElement('div');el.className='num '+(cls||'');el.textContent=text;$('dmgLayer').appendChild(el);nums.push({el,x,y,z,t:0,life:cls==='info'?1.6:0.9});if(nums.length>45){nums.shift().el.remove();}}
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
function updateUI(dt){
  setS('hpFill','width',(P.hp/P.maxHp*100).toFixed(1)+'%');setS('shFill','width',(P.shield/P.maxHp*100).toFixed(1)+'%');setT('hpTxt',Math.ceil(P.hp)+(P.shield>0.5?' +'+Math.floor(P.shield):''));
  setS('bkFill','width',P.baek.toFixed(1)+'%');setT('bkStage',P.stage>=4&&P.hwagT<=0?'4 영로 화경 · 침식':STAGE_NAME[P.stage]);
  setS('swFill','width',P.sw.toFixed(1)+'%');setC('swFill','full',P.sw>=100);
  const brush=P.mode==='brush';setT('modeBadge',brush?'붓 모드':'검 모드');setC('modeBadge','sword',!brush);
  setT('lS1',brush?'만묵소진':'점묵개화');setT('lS2',brush?'묵향결쇄':'유묵섬참');
  setH('lSw',P.sw>=100?(brush?'진명<br>정화':'막묵<br>결계'):(brush?'전환<br>→검':'전환<br>→붓'));setC('bSw','ready',P.sw>=100);
  const cdSet=(id,v,max)=>setS(id,'height',(max>0?clamp(v/max,0,1)*100:0).toFixed(0)+'%');
  const q=document.querySelector.bind(document);
  cdSet2('bS1',P.cds[(brush?'b':'s')+'1'],CD[(brush?'b':'s')+'1']);cdSet2('bS2',P.cds[(brush?'b':'s')+'2'],CD[(brush?'b':'s')+'2']);cdSet2('bDodge',Math.max(0,P.dodgeCd),1.1);
  const f=Math.floor(P.ult)+'%';if(uiCache.ult!==f){uiCache.ult=f;$('bUlt').style.setProperty('--f',f);}setC('bUlt','ready',P.ult>=100);
  if(boss){setS('bhpFill','width',(Math.max(0,boss.hp)/boss.maxHp*100).toFixed(1)+'%');setS('bshFill','width',(boss.shield/boss.maxHp*100).toFixed(1)+'%');
    const pips=$('bpips').children;for(let i=0;i<5;i++)setC2(pips[i],i<boss.stacks);
    let s='';if(boss.dead)s='정화됨';else if(boss.stun>0)s=boss.broken>0?'기절 · 받는 피해 150%':'기절';else if(boss.stance>0)s='유수 반격 자세';else if(boss.runeActive)s='청룡의 정화 룬 · 피해 80% 감소 · 먹선 '+runes.filter(r=>r.linked).length+'/3';else if(boss.p2)s='2페이즈 · 청룡의 도류';setT('bstate',s);}
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
const input={mx:0,mz:0,mag:0,atkHeld:false,keys:{}};
const joy={id:null,ox:0,oy:0,x:0,y:0};
function press(q){if(!state.running||state.paused)return;if(dialogOpen){advanceDialog();return;}if(P.dead||state.win)return;if(!ready(q)){flashBtn(q);}P.queue=q;P.queueT=0.35;}
const BTN={atk:'bAtk',str:'bAtk',jump:'bJump',s1:'bS1',s2:'bS2',dodge:'bDodge',sw:'bSw',ult:'bUlt'};
function flashBtn(q){const el=$(BTN[q]);if(!el)return;el.classList.remove('no');void el.offsetWidth;el.classList.add('no');}
function bindBtn(id,q,hold){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();el.classList.add('down');if(hold)input.atkHeld=!dialogOpen;press(q);});
  const up=()=>{el.classList.remove('down');if(hold)input.atkHeld=false;};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up);el.addEventListener('contextmenu',e=>e.preventDefault());}
const HOLD_T=CONFIG.holdTime;const atkHold={down:false,t:0,fired:false};
function atkDown(){if(dialogOpen){advanceDialog();return;}if(!state.running||state.paused)return;atkHold.down=true;atkHold.t=0;atkHold.fired=false;}
function atkUp(){if(!atkHold.down)return;atkHold.down=false;if(!atkHold.fired)press('atk');}
function updateHold(dt){if(atkHold.down&&!atkHold.fired){atkHold.t+=dt;if(atkHold.t>=HOLD_T){atkHold.fired=true;press('str');}}}
{const el=$('bAtk');el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();el.classList.add('down');atkDown();});const up=()=>{el.classList.remove('down');atkUp();};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up);el.addEventListener('contextmenu',e=>e.preventDefault());}
bindBtn('bJump','jump');bindBtn('bS1','s1');bindBtn('bS2','s2');bindBtn('bDodge','dodge');bindBtn('bSw','sw');bindBtn('bUlt','ult');
const KMAP={};{const K=CONFIG.keys;KMAP[K.skill1]='s1';KMAP[K.skill2]='s2';KMAP[K.ult]='ult';KMAP[K.switch]='sw';KMAP[K.jump]='jump';for(const k of K.dodge)KMAP[k]='dodge';}
const ATK_KEY=CONFIG.keys.attack;
addEventListener('keydown',e=>{const k=e.code;if(dialogOpen&&(k==='Space'||k==='Enter'||k===ATK_KEY)){e.preventDefault();if(!e.repeat)advanceDialog();return;}
  input.keys[k]=true;if(k==='Escape'||k==='KeyP'){togglePause();return;}if(KMAP[k]||k===ATK_KEY)e.preventDefault();if(e.repeat)return;if(k===ATK_KEY)atkDown();if(KMAP[k]){e.preventDefault();press(KMAP[k]);}});
addEventListener('keyup',e=>{input.keys[e.code]=false;if(e.code===ATK_KEY)atkUp();});
addEventListener('blur',()=>{input.keys={};atkHold.down=false;});
renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;if(dialogOpen){advanceDialog();return;}if(e.button===0)atkDown();});
addEventListener('pointerup',e=>{if(e.pointerType==='mouse'&&e.button===0)atkUp();});
renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
const zone=$('joyZone'),jb=$('joyBase'),jk=$('joyKnob');
zone.addEventListener('pointerdown',e=>{e.preventDefault();if(dialogOpen){advanceDialog();return;}if(joy.id!==null)return;joy.id=e.pointerId;joy.ox=e.clientX;joy.oy=e.clientY;joy.x=joy.y=0;try{zone.setPointerCapture(e.pointerId);}catch(_){}jb.style.left=e.clientX+'px';jb.style.top=e.clientY+'px';jb.style.display='block';jk.style.transform='';});
zone.addEventListener('pointermove',e=>{if(e.pointerId!==joy.id)return;let dx=e.clientX-joy.ox,dy=e.clientY-joy.oy;const m=Math.hypot(dx,dy),R=50;if(m>R){dx=dx/m*R;dy=dy/m*R;}joy.x=dx/R;joy.y=dy/R;jk.style.transform=`translate(${dx}px,${dy}px)`;});
const jend=e=>{if(e.pointerId!==joy.id)return;joy.id=null;joy.x=joy.y=0;jb.style.display='none';};
zone.addEventListener('pointerup',jend);zone.addEventListener('pointercancel',jend);
function readMove(){let mx=0,mz=0;if(joy.id!==null){mx=joy.x;mz=joy.y;}else{const K=input.keys;mx=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0);mz=(K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.ArrowUp?1:0);const m=Math.hypot(mx,mz);if(m>1){mx/=m;mz/=m;}}
  const m=Math.hypot(mx,mz);input.mx=m<0.15?0:mx;input.mz=m<0.15?0:mz;input.mag=m<0.15?0:Math.min(1,m);}
