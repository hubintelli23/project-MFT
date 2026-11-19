/* MFT 블루잉크 : 천년청묵 · js/main.js · v0.8
   진행(웨이브·보스) · 카메라 · 화면 전환 · 게임 루프 */
'use strict';
/* ================= 진행 ================= */
function updateDirector(dt){const S=state;S.dirT+=dt;
  if(S.stage==='wave'){
    if(S.wi<WAVES.length){const ok=S.wi===0?S.dirT>0.6:(S.dirT-S.lastSpawn>3&&(S.dirT-S.lastSpawn>16||alive().length<=1));
      if(ok){for(const s of WAVES[S.wi])(s.type==='eater'?spawnEater:spawnRusher)(s.x,s.z);S.wi++;S.lastSpawn=S.dirT;}}
    else if(alive().length===0){S.stage='preboss';S.dirT=0;banner(DIALOG.bossApproach,2.2,'big');}}
  else if(S.stage==='preboss'){if(S.dirT>2.2&&!boss){spawnBoss();boss.intro=true;P.act=null;dialog(DIALOG.intro,()=>{boss.intro=false;S.stage='boss';banner(DIALOG.bossStart,2.6,'big');});}}}

function update(dt){state.time+=dt;
  for(let i=timers.length-1;i>=0;i--){timers[i].t-=dt;if(timers[i].t<=0){const f=timers[i].fn;timers.splice(i,1);f();}}
  if(!state.over)updateDirector(dt);
  updatePlayer(dt);masterUpdate();
  for(const e of enemies)updateEnemy(e,dt);
  for(let i=enemies.length-1;i>=0;i--)if(enemies[i].removed)enemies.splice(i,1);
  updateRunes(dt);updateWaves(dt);updateStrikes(dt);updateProj(dt);updatePuddles(dt);updateClones(dt);updateZones(dt);
  separate();clampArena(P,0.4);
  updateItems(dt);updateFields(dt);updateFx(dt);updateDecals(dt);
  updateBackground(dt);
  if(!state.over&&!state.win)stats.time+=dt;}

/* ================= 카메라 ================= */
function shake(a){if(!SETTINGS.shake)return;shakeA=Math.max(shakeA,a);}
function updateCamera(dt){const portrait=camera.aspect<1;const oy=portrait?14:10,oz=portrait?12.5:9.5;let tx=P.x,tz=P.z;
  if(boss&&!boss.dead&&state.stage==='boss'){tx=P.x*0.8+boss.x*0.2;tz=P.z*0.8+boss.z*0.2;}
  const k=1-Math.exp(-6*dt);camX+=(tx-camX)*k;camZ+=(tz-camZ)*k;shakeA*=Math.exp(-8*dt);
  camera.position.set(camX+(Math.random()-0.5)*shakeA,oy+(Math.random()-0.5)*shakeA,camZ+oz);camera.lookAt(camX,0.8,camZ-1);}

/* ================= 화면 전환 ================= */
function togglePause(){if(!state.running||state.over||state.win||state.mapOpen)return;state.paused=!state.paused;$('pauseScr').hidden=!state.paused;}
$('pauseBtn').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();togglePause();});
$('resumeBtn').addEventListener('click',()=>togglePause());
$('restartBtn').addEventListener('click',()=>{$('pauseScr').hidden=true;resetGame();startGame();});
$('startBtn').addEventListener('click',()=>{$('title').hidden=true;startGame();});
$('retryBtn').addEventListener('click',()=>{$('result').hidden=true;resetGame();startGame();});
function gameOver(){if(state.over)return;state.over=true;PM.visible=true;P.dead=true;P.act=null;input.atkHeld=false;showCut('탁기에 잠식되었다');later(1.8,()=>showResult(false));}
function fmtT(s){const m=Math.floor(s/60),ss=Math.floor(s%60);return m+'분 '+(ss<10?'0':'')+ss+'초';}
function showResult(win){state.running=false;$('resTitle').textContent=win?'청옥림 정화 완료':'탁기에 잠식되었다';
  let g='—';if(win){const t=stats.time;g=t<150?'S':t<220?'A':t<320?'B':'C';if(stats.taken<40&&g!=='S')g=String.fromCharCode(g.charCodeAt(0)-1);}
  $('resGrade').textContent=win?g:'再';$('resGrade').style.color=win?'#3fae8c':'#8a2028';
  const rows=[['소요 시간',fmtT(stats.time)],['총 정화 피해',Math.round(stats.dmg).toLocaleString()],['개화 횟수',stats.blooms],['역린공명',stats.parries+'회'],['받은 피해',Math.round(stats.taken)],['정화한 땅',stats.purified+'곳'],['궁극기',stats.ults+'회'],['녹기현경',(stats.nokgi||0)+'회'],['파회법',stats.runeBreak?'성공':'—'],['주운 아이템',stats.items+'개'],['교대',stats.swaps+'회'],['마스터 모드',MASTER.used?'사용함 (테스트 기록)':'—']];
  $('resStats').innerHTML=rows.map(r=>`<span>${r[0]}</span><span>${r[1]}</span>`).join('');$('result').hidden=false;}
function resetGame(){
  for(const e of enemies){scene.remove(e.mesh);if(e.bar)scene.remove(e.bar.s);if(e.rootM)scene.remove(e.rootM);if(e.fog)scene.remove(e.fog);}enemies.length=0;
  while(strikes.length)removeStrike(strikes.length-1);while(projs.length)removeProj(projs.length-1);
  for(const p of puddles)scene.remove(p.m);puddles.length=0;for(const c of clones)scene.remove(c.g);clones.length=0;
  for(const r of runes){scene.remove(r.g);scene.remove(r.beam);}runes.length=0;for(const w of waves)scene.remove(w.m);waves.length=0;for(const z of zones)scene.remove(z.m);zones.length=0;
  for(const d of decals)scene.remove(d.m);decals.length=0;timers.length=0;clearFx();clearItems();clearParty();if(state&&state.mapOpen){$('mapScr').hidden=true;}
  for(const n of nums)n.el.remove();nums.length=0;boss=null;$('bhud').hidden=true;init();}
function init(){MASTER.used=MASTER.on;$('verTxt').textContent=GAME_VERSION;$('verList').textContent=Object.entries(FILE_VERSIONS).map(([f,v])=>f+' '+v).join(' · ');stats={time:0,dmg:0,kills:0,blooms:0,parries:0,ults:0,purified:0,taken:0,switches:0,countered:0,runeBreak:0,items:0,swaps:0};flags={};
  state={time:0,running:false,paused:false,mapOpen:false,over:false,win:false,stage:'wave',dirT:0,wi:0,lastSpawn:0,runeWaveT:4,bcallT:0};
  P=newPlayer();PARTY=newParty();clearParty();brushW.visible=true;swordW.visible=false;pMesh.rotation.x=0;camX=P.x;camZ=P.z;hitstop=0;
  for(const k in uiCache)delete uiCache[k];$('banner').style.opacity=0;$('say').style.opacity=0;}
function startGame(){state.running=true;later(9,()=>banner('교대: 1 연우 · 2 연하 · 3 매향 (왼쪽 파티 칸을 눌러도 교대) — 교대하면 진입 공격이 나갑니다',4.5));banner('【붓 모드】 공격으로 먹선 낙인을 새기세요 · 최대 5중첩',4.5);}
init();

/* ================= 루프 ================= */
let last=performance.now();
function frame(now){requestAnimationFrame(frame);let dt=Math.min(0.05,(now-last)/1000);last=now;if(!(dt>0))dt=0.016;
  readMove();
  if(state.running&&!state.paused&&!state.mapOpen&&!dialogOpen){updateHold(dt);let g=dt*(MASTER.on?MASTER.speed:1);if(hitstop>0){hitstop-=dt;g=dt*0.08;}update(g);}
  animatePlayer(dt);updateCamera(dt);updateNums(dt);updateUI(dt);
  renderer.render(scene,camera);}
requestAnimationFrame(frame);
window.__mft={atkHold,get P(){return P;},get state(){return state;},enemies,get boss(){return boss;},press,input,runes,get stats(){return stats;}};
