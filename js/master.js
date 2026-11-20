/* MFT 블루잉크 : 천년청묵 · js/master.js · v0.9
   마스터 모드(테스트 모드) — 단축키(기본: ` 백틱, data/config.js의 keys.master)로 켜고 끕니다.
   휴대폰은 설정(≡) 화면의 「마스터 모드」 버튼으로 켜고 끕니다.
   마스터 모드를 끄면 모든 치트가 즉시 꺼집니다. */
'use strict';
const MASTER={on:false,used:false,noCd:false,freeYr:false,supFull:false,god:false,ultFull:false,baekLock:false,baekVal:0,oneShot:false,speed:1};
const MASTER_TOGGLES=[
  ['noCd','쿨타임 없음','스킬 · 전환 · 회피 · 대쉬 · 교대 쿨타임 0'],
  ['freeYr','영로 무한','스킬 영로 소모 없음'],
  ['supFull','지원 게이지 가득','연하 · 매향 지원 게이지 100 (공동 오의)'],
  ['ultFull','궁극기 항상 가득','파티 전원 궁극기 게이지 100'],
  ['baekLock','백묵화 고정','아래 슬라이더 값으로 백묵화 게이지 고정'],
  ['god','무적','피해를 받지 않고 체력 유지'],
  ['oneShot','피해 10배','주는 피해 10배'],
];
function masterOn(k){return MASTER.on&&MASTER[k];}
function buildMasterPanel(){const p=$('masterPanel');
  p.innerHTML=`<div class="mh">MASTER MODE <small>테스트</small></div>
  <div class="msec">청명도 <b id="mClVal">0</b></div>
  <input type="range" id="mCl" min="0" max="100" step="1" value="30">
  <div class="msec">백묵화 침식도 <b id="mBkVal">0</b></div>
  <input type="range" id="mBk" min="0" max="100" step="1" value="0">
  <div class="mrow" id="mStages">${['0단계','1단계','2단계','3단계','4 영로화경','5 녹기현경'].map((t,i)=>`<button data-s="${i}">${t}</button>`).join('')}</div>
  <div class="msec">치트</div>
  ${MASTER_TOGGLES.map(([k,t,d])=>`<button class="mt" data-k="${k}" title="${d}"><span>${t}</span><i></i></button>`).join('')}
  <div class="msec">게임 속도 <b id="mSpVal">1.00×</b></div>
  <input type="range" id="mSp" min="0.25" max="2" step="0.25" value="1">
  <div class="msec">즉시 실행</div>
  <div class="mrow">
    <button data-a="sw">전환 게이지 가득</button><button data-a="heal">파티 회복·부활</button>
    <button data-a="shield">방어막 가득</button><button data-a="kill">잡몹 전부 처치</button>
    <button data-a="boss">보스전으로 이동</button><button data-a="b70">보스 HP 70%</button>
    <button data-a="b50">보스 HP 50%</button><button data-a="b10">보스 HP 30%</button>
    <button data-a="groggy">보스 무력화</button><button data-a="items">아이템 생성</button><button data-a="bkill">보스 처치</button>
  </div>
  <div class="mfoot">\` 키로 켜기/끄기 · 사용하면 결과 화면에 표시됩니다</div>`;
  $('mBk').addEventListener('input',e=>setMasterBaek(+e.target.value));
  $('mCl').addEventListener('input',e=>{if(P){P.clarity=+e.target.value;$('mClVal').textContent=Math.round(P.clarity);}});
  $('mSp').addEventListener('input',e=>{MASTER.speed=+e.target.value;$('mSpVal').textContent=MASTER.speed.toFixed(2)+'×';});
  p.querySelectorAll('#mStages button').forEach(b=>b.addEventListener('click',()=>{const s=+b.dataset.s;
    if(s>=4&&P.char!=='yeonwoo'){popNum(P.x,2.6,P.z,'연우로 교대한 뒤 사용하세요','info');return;}
    if(s===5){setMasterBaek(100);P.clarity=100;if(!P.hwag)enterHwag(false);P.act=null;doNokgi();}else if(s===4){setMasterBaek(100);P.clarity=100;if(!P.hwag)enterHwag(false);}else{setMasterBaek(s*25);if(P.hwag)exitHwag(false);}}));
  p.querySelectorAll('.mt').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.k;MASTER[k]=!MASTER[k];if(k==='baekLock')MASTER.baekVal=P.baek;syncMaster();}));
  p.querySelectorAll('[data-a]').forEach(b=>b.addEventListener('click',()=>masterAction(b.dataset.a)));
  p.addEventListener('pointerdown',e=>e.stopPropagation());}
function setMasterBaek(v){if(!P)return;P.baek=v;MASTER.baekVal=v;syncMaster();}
function syncMaster(){$('masterPanel').hidden=!MASTER.on;$('masterTag').hidden=!MASTER.on;$('masterTg').textContent=MASTER.on?'켜기':'끄기';$('masterTg').classList.toggle('on',MASTER.on);
  document.querySelectorAll('#masterPanel .mt').forEach(b=>b.classList.toggle('on',!!MASTER[b.dataset.k]));
  if(P){$('mBk').value=Math.round(P.baek);$('mBkVal').textContent=Math.round(P.baek)+'%';}}
function toggleMaster(){MASTER.on=!MASTER.on;if(MASTER.on)MASTER.used=true;syncMaster();if(state&&state.running)banner(MASTER.on?'마스터 모드 ON — 테스트 치트 사용 가능':'마스터 모드 OFF — 모든 치트 해제',1.8);}
function masterAction(a){if(!state||!state.running||!P)return;
  if(a==='sw')P.sw=100;
  else if(a==='heal'){P.hp=P.maxHp;for(const id of PARTY_ORDER){if(id!==P.char)PARTY[id].hp=PARTY[id].maxHp;}popNum(P.x,2.6,P.z,'파티 전원 회복','info');}
  else if(a==='shield')P.shield=P.maxShield;
  else if(a==='kill'){for(const e of enemies)if(!e.dead&&e.type!=='boss')killE(e);}
  else if(a==='boss'){if(state.stage==='wave'){state.wi=WAVES.length;for(const e of enemies)if(!e.dead&&e.type!=='boss')killE(e);}}
  else if(a==='items'){spawnItem('yeongyeop',P.x+1.2,P.z);spawnItem('yeongro',P.x-1.2,P.z);}
  else if(boss&&!boss.dead){if(a==='bkill'){boss.invulnT=0;boss.intro=false;dealE(boss,boss.hp+boss.shield+99999,false,'master');}
    else if(a==='groggy'){boss.stg=0;groggy(boss);}
    else{const f={b70:0.7,b50:0.5,b10:0.3}[a];boss.hp=Math.max(1,Math.floor(boss.maxHp*f)-1);boss.barDirty=true;}}
  else popNum(P.x,2.6,P.z,'보스가 아직 등장하지 않았습니다','info');}
function masterUpdate(){if(!MASTER.on||!P)return;
  if(MASTER.noCd){for(const k in P.cds)P.cds[k]=0;P.dodgeCd=0;}
  if(MASTER.ultFull){P.ult=100;if(PARTY)for(const id of PARTY_ORDER)PARTY[id].ult=100;}
  if(MASTER.baekLock&&P.nokgi<=0){P.baek=MASTER.baekVal;if(P.hwag)P.clarity=Math.max(P.clarity,50);}
  if(MASTER.supFull&&PARTY){PARTY.sup.yeonha=100;PARTY.sup.maehyang=100;PARTY.samraUsed=false;}
  if(MASTER.god){P.hp=P.maxHp;}
  const v=Math.round(P.baek);if(uiCache.mbk!==v){uiCache.mbk=v;$('mBk').value=v;$('mBkVal').textContent=v+'%';}
  const c=Math.round(P.clarity);if(uiCache.mcl!==c){uiCache.mcl=c;$('mCl').value=c;$('mClVal').textContent=c;}}
buildMasterPanel();
$('masterTg').addEventListener('click',()=>toggleMaster());
