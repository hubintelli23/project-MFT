/* MFT 블루잉크 : 천년청묵 · data/enemies.js · v1.1
   잡몹 · 보스 수치와 웨이브 구성. */
'use strict';
const ENEMIES={
  rusher:{        // 탁기 궤웅 — 돌진 자폭형
    hp:45, speed:4.1, stagger:25,
    fuseTime:0.6,         // 자폭 전 부풀어 오르는 시간
    explodeDamage:13, explodeRadius:2.1,
  },
  phantom:{       // 백진 아크 룬이 부르는 기사 환영 — 돌진해 베기
    hp:40, speed:4.6, fuseTime:0.5, explodeDamage:11, explodeRadius:2.0, stagger:20,
  },
  eater:{         // 묵식귀 — 원거리 침식형
    hp:55, speed:2.3, stagger:30,
    shootInterval:[2.4,3.2],   // 탁기 구체 발사 간격(초, 최소~최대)
    orbDamage:8, orbSpeed:7.5,
    fogRadius:3.2,             // 정화 차단 안개 반경 (안의 적은 개화 피해 50%)
  },
};
const BOSSES={
  cheongryu:{   // 청류 — 청매 가주 · 청류의 수호신 (청옥림)
    name:'청류', title:'청매 가주 · 청류의 수호신', stagger:320,      // 청류 — 청류의 수호신

    hp:1600,
  walkSpeed:3.6, walkSpeedP2:4.3,
  phase2At:0.7,          // 체력 70%에서 2페이즈(청룡의 도류)
  runePhaseAt:0.5,       // 체력 50%에서 청룡의 정화 룬
  runeDamageCut:0.8,     // 룬 페이즈 받는 피해 감소 (0.8 = 80% 감소)
  runeShield:220, runeShieldRegen:16,
  brokenStun:6,          // 파회 성공 시 기절 시간
  brokenDamageMul:1.5,   // 파회 후 받는 피해 배율
  damage:{combo:13, step:15, wave:12, vortex:24, counter:22},  // 패턴별 피해
},
  baekjin:{     // 백진 — 백련 가주 · 강철과 성벽의 아크 군주 (설백산)
    name:'백진', title:'백련 가주 · 강철과 성벽의 아크 군주',
    hp:2000, stagger:420, walkSpeed:2.6, walkSpeedP2:3.2,
    guardAngle:75,         // 정면 방패 가드 각도(도) — 이 각도 안의 공격은 가드파쇄가 아니면 막힘
    holyMax:100, holyPerBlock:12,   // 성기 게이지: 막을 때마다 충전, 가득 차면 성기 해방
    guardDownTime:3,       // 가드파쇄에 맞거나 성기 해방 후 방패가 내려가는 시간
    phase2At:0.6, runePhaseAt:0.35,
    runeHp:3,              // 아크 룬 하나를 부수는 데 필요한 가드파쇄 타격 수
    phantomInterval:5,     // 룬 페이즈 중 기사 환영 소환 간격(초)
    brokenStun:6, brokenDamageMul:1.5,
    damage:{bash:13, slash:15, charge:16, push:12, smite:30, knight:16},
  },
  cheonjehyeok:{ // 천제혁 — 마교 교주 (구해 마궁)
    name:'천제혁', title:'마교 교주 · 역천의 패왕',
    hp:2200, stagger:380, walkSpeed:3.4, walkSpeedP2:4.0,
    phase2At:0.6, phase3At:0.3,
    erosion:25,            // 구해 흑룡 참격에 맞으면 오르는 침식도
    clarityLoss:30,        // 구해 흑룡 참격에 맞으면 잃는 청명도
    parrySeal:3,           // 구해 흑룡 참격에 맞으면 패링 봉인 시간
    flameDps:5,            // 흑염 장판 초당 피해
    lethalInterval:18,     // 3페이즈 즉사기 간격(초)
    damage:{cleave:16, wave:13, grab:22, dragon:28, ring:12, lethal:9999},
  },
};
Object.assign(BOSSES,{
  zayeong:{     // 자영 — 운자 가주 · 환영과 거울의 무희 (자운곡)
    name:'자영', title:'운자 가주 · 환영과 거울의 무희',
    hp:1900, stagger:340, walkSpeed:3.8, walkSpeedP2:4.4,
    illusionCount:4,       // 거울 환영무 분신 수
    illusionInterval:16,   // 분신 재소환 간격(초)
    backlash:12,           // 붓이 아닌 공격으로 분신을 베면 터지는 역환산 폭발 피해
    phase2At:0.6, invertTime:5, invertInterval:13,   // 2페이즈 위상 역전(이동 반대) 시간 · 간격
    runePhaseAt:0.35, runeHp:3, mirrorErosion:8,     // 주작의 거울 룬: 붓 3타로 파괴, 4초마다 침식도 +8
    brokenStun:6, brokenDamageMul:1.5,
    damage:{fan:13, flame:12, blink:18, shadow:9},
  },
  igyeom:{      // 이겸 — 은리 가주 · 절대 판결의 대법관 (청회원)
    name:'이겸', title:'은리 가주 · 절대 판결의 대법관',
    hp:2100, stagger:400, walkSpeed:2.9, walkSpeedP2:3.4,
    ruleInterval:12, ruleTime:4,   // 금제 간격 · 지속 시간(초)
    rulePenalty:0.3,               // 금제 위반 시 최대 체력 대비 번개 피해
    pullRange:10,                  // 이 거리보다 멀어지면 경계 단죄(사슬로 끌어당김)
    phase2At:0.6, runePhaseAt:0.35, runeHp:2, boltInterval:2.6,   // 단죄 룬: 룬의 번개를 2번 패링하면 과부하 파괴
    brokenStun:6, brokenDamageMul:1.5,
    damage:{chain:14, smash:20, verdict:15, court:24, bolt:10},
  },
  sahyeon:{     // 사현 — 사미 가주 · 그림자 뱀의 암살자 (연분홍 늪)
    name:'사현', title:'사미 가주 · 그림자 뱀의 암살자',
    hp:1800, stagger:300, walkSpeed:4.4, walkSpeedP2:4.8,
    hideTime:2.6,          // 그림자 잠행 시간 — 이 동안 붓 공격만 그림자를 끌어냄
    poisonDps:3,           // 중독 초당 피해
    phase2At:0.6, swampDps:2,
    runePhaseAt:0.35, cloneCount:6, assassinateInterval:7,   // 현무의 음영 룬: 그림자 분신 6 — 붓으로 진짜를 찾기
    brokenStun:6, brokenDamageMul:1.5,
    damage:{fang:11, dagger:9, ambush:20, assassinate:26},
  },
  wollyeong:{   // 월령 — 월백 가주 · 월계 수장 · 거울과 인과의 감시자 (월계)
    name:'월령', title:'월백 가주 · 거울과 인과의 감시자',
    hp:2300, stagger:420, walkSpeed:3.6, walkSpeedP2:4.2,
    phase2At:0.6, reverseAt:0.3,   // 30%에서 『기억의 거울 : 인과역전』
    reverseChannel:8,      // 인과역전 시전 시간 — 이 안에 거울에 먹물(붓 3타)을 칠하지 못하면 체력이 10초 전으로 돌아감
    mirrorHp:3, brokenStun:6, brokenDamageMul:1.5,
    damage:{slash:14, refract:13, echo:15, fullmoon:14},
  },
});
// v1.1 — 심원회(드래곤 하트 파편 소유자) · 백명신궁(화염의 존재 8 · 구야 · 하야 · 백야)
Object.assign(BOSSES,{
  yunjae:{ name:'윤재', title:'심원회 · 드래곤 하트 — 에테르의 지배', hp:2000, stagger:380, walkSpeed:3.6, walkSpeedP2:4.2, phase2At:0.6,
    nodeShield:240, nodeRegen:30,   // 에테르 결절이 살아 있는 동안 방어막 재생
    sealTime:4, drain:12,           // 에테르 차단: 스킬 · 전환 · 궁극기 봉인 시간 / 맞으면 영로 감소
    brokenStun:5, brokenDamageMul:1.5, damage:{beam:14, orb:11, vortex:16, pulse:13} },
  seolryeong:{ name:'설령', title:'심원회 · 드래곤 하트 — 정화와 균형', hp:2000, stagger:380, walkSpeed:3.6, walkSpeedP2:4.2, phase2At:0.6,
    imbalanceMax:8,                 // 같은 붓/검 모드(또는 같은 동료)로 연속 타격하면 쌓이는 '치우침' — 가득 차면 균형 회복 반격
    cleanse:25,                     // 정화 공격에 맞으면 깎이는 침식도
    brokenStun:5, brokenDamageMul:1.5, damage:{slash:14, wave:13, balance:22, cleanse:10} },
  muha:{ name:'무하', title:'심원회 · 드래곤 하트 — 기억과 기록', hp:2000, stagger:380, walkSpeed:3.6, walkSpeedP2:4.2, phase2At:0.6,
    recordInterval:14,              // 기록 주기 — 그동안 가장 많이 쓴 방어(가드·패링 / 회피·스웨이)를 막는 공격으로 바꿈
    brokenStun:5, brokenDamageMul:1.5, damage:{slash:14, page:11, replay:12, seal:16} },
  yeonhwi:{ name:'연휘', title:'심원회 · 드래곤 하트 — 인과와 흐름', hp:2000, stagger:380, walkSpeed:3.6, walkSpeedP2:4.2, phase2At:0.6,
    linkTime:6, linkReturn:0.3,     // 인과 연결: 연결된 동안 준 피해의 30%가 끝날 때 되돌아옴 (패링 1회로 끊김)
    brokenStun:5, brokenDamageMul:1.5, damage:{slash:14, predict:15, thread:12, fate:20} },
  doyun:{ name:'도윤', title:'심원회 · 드래곤 하트 — 세계의 경계', hp:2200, stagger:420, walkSpeed:3.2, walkSpeedP2:3.8, phase2At:0.6,
    wardHp:4,                       // 경계 결계: 가드파쇄 4타로 깨짐 (결계 중에는 가까이(반경 4) 붙어야만 피해가 들어감)
    shrinkMin:7, borderDps:8,       // 경계 축소: 전장 반경이 7까지 줄어들고 바깥은 지속 피해
    brokenStun:5, brokenDamageMul:1.5, damage:{slash:15, wall:16, bash:14, seal:12} },
  baekrin:{ name:'백린', title:'백명신궁 · 화염의 존재 — 천소화(백염) · 용', hp:1400, stagger:260, walkSpeed:4.2, walkSpeedP2:5.0, phase2At:0.5, brokenStun:5, brokenDamageMul:1.5, damage:{claw:14, breath:18, pillar:13} },
  cheonghwi:{ name:'청휘', title:'백명신궁 · 화염의 존재 — 정명화(청염) · 사자', hp:1300, stagger:260, walkSpeed:4.2, walkSpeedP2:5.0, phase2At:0.5, brokenStun:5, brokenDamageMul:1.5, purifyInterval:8, damage:{claw:13, pounce:16, roar:14} },
  jeokseom:{ name:'적섬', title:'백명신궁 · 화염의 존재 — 단연화(적염) · 표범', hp:1200, stagger:260, walkSpeed:4.2, walkSpeedP2:5.0, phase2At:0.5, brokenStun:5, brokenDamageMul:1.5, sealTime:3, damage:{claw:11, pounce:15, rend:13} },
  noknyeong:{ name:'녹령', title:'백명신궁 · 화염의 존재 — 회생화(녹염) · 선영', hp:1300, stagger:260, walkSpeed:4.2, walkSpeedP2:5.0, phase2At:0.5, brokenStun:5, brokenDamageMul:1.5, healPerFlame:0.012, regenHeal:0.12, damage:{orb:11, vine:13, bloom:15} },
  jayo:{ name:'자요', title:'백명신궁 · 화염의 존재 — 왜곡화(자염) · 이형의 동물', hp:1300, stagger:260, walkSpeed:4.2, walkSpeedP2:5.0, phase2At:0.5, brokenStun:5, brokenDamageMul:1.5, damage:{claw:13, rift:14, collapse:16} },
  hwangroe:{ name:'황뢰', title:'백명신궁 · 화염의 존재 — 화령화(황염) · 치타', hp:1200, stagger:260, walkSpeed:4.2, walkSpeedP2:5.0, phase2At:0.5, brokenStun:5, brokenDamageMul:1.5, chargeMax:6, damage:{claw:11, dash:14, field:20} },
  hongak:{ name:'홍악', title:'백명신궁 · 화염의 존재 — 압염화(홍염) · 멧돼지', hp:1500, stagger:260, walkSpeed:4.2, walkSpeedP2:5.0, phase2At:0.5, brokenStun:5, brokenDamageMul:1.5, ampStep:0.25, damage:{charge:16, gore:14, burst:30} },
  heukrang:{ name:'흑랑', title:'백명신궁 · 화염의 존재 — 잔영화(흑청염) · 늑대', hp:1300, stagger:260, walkSpeed:4.2, walkSpeedP2:5.0, phase2At:0.5, brokenStun:5, brokenDamageMul:1.5, echoDelay:1.0, damage:{claw:11, pounce:14, howl:12} },
  guya:{ name:'구야', title:'백명신궁 · 적염의 삼족오 (구해의 까마귀 신선)', hp:2400, stagger:420, walkSpeed:3.4, walkSpeedP2:4.0, phase2At:0.55,
    witherTime:5, witherDps:3,      // 적염 — 육체를 고사시키는 파동: 맞으면 지속 피해
    crowBuff:0.15,                  // 기억 수집 까마귀가 살아 있을 때마다 구야 피해 +15%
    brokenStun:5, brokenDamageMul:1.5, damage:{dive:20, feather:11, wing:14, sun:18} },
  haya:{ name:'하야', title:'백명신궁 · 청염의 하얀 토끼 (월계의 토끼 신선)', hp:2400, stagger:420, walkSpeed:4.0, walkSpeedP2:4.6, phase2At:0.55,
    blankTime:6,                    // 청염의 백지화: 예고 범위 · HUD가 지워지고 방어막이 사라짐 (패링하면 바로 풀림)
    brokenStun:5, brokenDamageMul:1.5, damage:{crescent:13, halfmoon:16, fullmoon:15, blank:18} },
  baekya:{ name:'백야', title:'백명신궁 · 백룡 — 태초의 기록자', hp:4200, stagger:540, walkSpeed:2.6, walkSpeedP2:3.0, phase2At:0.6, phase3At:0.25,
    abyssInterval:22,               // 3페이즈 즉사기 간격
    brokenStun:8, brokenDamageMul:1.6, damage:{claw:16, breath:20, tail:16, gust:12, scale:14, abyss:9999} },
});
const BOSS=BOSSES.cheongryu;   // 예전 코드 호환용 (청류)
// 웨이브 구성 — type: rusher(탁기 궤웅) / eater(묵식귀), x·z: 등장 위치(전투 구역 반지름 15 안)
// 다음 웨이브는 남은 적이 1마리 이하가 되거나 16초가 지나면 등장합니다.
const WAVES=[
  [{type:'rusher',x:-6,z:-9},{type:'rusher',x:6,z:-9},{type:'eater',x:0,z:-12}],
  [{type:'rusher',x:-10,z:2},{type:'rusher',x:10,z:2},{type:'rusher',x:0,z:-12},{type:'eater',x:-8,z:-8}],
];

// 스테이지(보스 선택) — waves:true면 잡몹 웨이브 후 보스 등장
const STAGES=[
  {id:'cheongok', group:'5대 가문', boss:'cheongryu', name:'청옥림', sub:'청류 · 물의 흐름과 반격', waves:true, theme:'cheongok', tip:'유수 반격 자세 · 정화 룬 파회법'},
  {id:'seolbaek', group:'5대 가문', boss:'baekjin', name:'설백산', sub:'백진 · 방패와 가드파쇄', waves:false, theme:'seolbaek', tip:'정면 가드 · 강체 · 가드파쇄 · 스태거'},
  {id:'zaun', group:'5대 가문', boss:'zayeong', name:'자운곡', sub:'자영 · 환영 분신과 거울', waves:false, theme:'zaun', tip:'분신은 붓으로 걷어내기 · 위상 역전 · 거울 룬'},
  {id:'cheonghoe', group:'5대 가문', boss:'igyeom', name:'청회원', sub:'이겸 · 금제와 패링', waves:false, theme:'cheonghoe', tip:'금제(공격 · 이동 · 전환 금지) · 사슬 · 룬 번개 패링'},
  {id:'swamp', group:'5대 가문', boss:'sahyeon', name:'연분홍 늪', sub:'사현 · 그림자와 스웨이', waves:false, theme:'swamp', tip:'그림자 잠행 · 등 뒤 기습 · 중독 · 붓으로 진짜 찾기'},
  {id:'magung', group:'마교', boss:'cheonjehyeok', name:'구해 마궁', sub:'천제혁 · 가드 · 패링 · 스웨이', waves:false, theme:'magung', tip:'가드 불가 · 잡기 · 즉사기 · 침식'},
  {id:'ether', group:'심원회 (드래곤 하트)', boss:'yunjae', name:'심원의 에테르로', sub:'윤재 · 에테르의 흐름', waves:false, theme:'simwon', tip:'결절 파괴 · 에테르 차단(봉인) · 영로 흡수'},
  {id:'balance', group:'심원회 (드래곤 하트)', boss:'seolryeong', name:'균형의 정원', sub:'설령 · 정화와 균형', waves:false, theme:'simwon', tip:'붓/검 번갈아 치기 · 균형 회복 반격 · 침식도 정화'},
  {id:'archive', group:'심원회 (드래곤 하트)', boss:'muha', name:'기억의 서고', sub:'무하 · 기억과 기록', waves:false, theme:'simwon', tip:'방어 습관 기록 → 가드 불가/스웨이 불가로 바뀜 · 재연'},
  {id:'causal', group:'심원회 (드래곤 하트)', boss:'yeonhwi', name:'인과의 실타래', sub:'연휘 · 인과와 흐름', waves:false, theme:'simwon', tip:'미래 위치 예측 공격 · 인과 연결(패링으로 끊기)'},
  {id:'border', group:'심원회 (드래곤 하트)', boss:'doyun', name:'세계의 경계', sub:'도윤 · 경계와 수호', waves:false, theme:'simwon', tip:'경계 결계(가까이 · 가드파쇄) · 전장 축소'},
  {id:'wolgye', group:'월백 가문 (월계)', boss:'wollyeong', name:'월계', sub:'월령 · 거울과 인과역전', waves:false, theme:'wolgye', tip:'측후방 굴절 · 잔영 · 만월 고리 · 인과역전 저지'},
  {id:'fl_baekrin', group:'백명신궁 — 화염의 존재', boss:'baekrin', name:'화염의 회랑 · 백린', sub:'백린 · 중간 보스', waves:false, theme:'baekmyeong', tip:'천소 — 방어막을 태우는 백염'},
  {id:'fl_cheonghwi', group:'백명신궁 — 화염의 존재', boss:'cheonghwi', name:'화염의 회랑 · 청휘', sub:'청휘 · 중간 보스', waves:false, theme:'baekmyeong', tip:'정화 — 낙인을 씻어내는 청염'},
  {id:'fl_jeokseom', group:'백명신궁 — 화염의 존재', boss:'jeokseom', name:'화염의 회랑 · 적섬', sub:'적섬 · 중간 보스', waves:false, theme:'baekmyeong', tip:'단절 — 기술을 끊는 적염'},
  {id:'fl_noknyeong', group:'백명신궁 — 화염의 존재', boss:'noknyeong', name:'화염의 회랑 · 녹령', sub:'녹령 · 중간 보스', waves:false, theme:'baekmyeong', tip:'생명 회복 — 회생화 끄기'},
  {id:'fl_jayo', group:'백명신궁 — 화염의 존재', boss:'jayo', name:'화염의 회랑 · 자요', sub:'자요 · 중간 보스', waves:false, theme:'baekmyeong', tip:'공간 조작 — 위치 뒤바꾸기'},
  {id:'fl_hwangroe', group:'백명신궁 — 화염의 존재', boss:'hwangroe', name:'화염의 회랑 · 황뢰', sub:'황뢰 · 중간 보스', waves:false, theme:'baekmyeong', tip:'에너지 확장 — 패링으로 가속 끊기'},
  {id:'fl_hongak', group:'백명신궁 — 화염의 존재', boss:'hongak', name:'화염의 회랑 · 홍악', sub:'홍악 · 중간 보스', waves:false, theme:'baekmyeong', tip:'압축 · 증폭 — 가드파쇄로 끊기'},
  {id:'fl_heukrang', group:'백명신궁 — 화염의 존재', boss:'heukrang', name:'화염의 회랑 · 흑랑', sub:'흑랑 · 중간 보스', waves:false, theme:'baekmyeong', tip:'잔상 — 같은 공격이 한 번 더'},
  {id:'guya', group:'백명신궁', boss:'guya', name:'적염의 하늘', sub:'구야 · 적염의 삼족오', waves:false, theme:'guya', tip:'하늘로 날아올라 급강하 · 고사 파동 · 기억 수집 까마귀'},
  {id:'haya', group:'백명신궁', boss:'haya', name:'청염의 달', sub:'하야 · 청염의 하얀 토끼', waves:false, theme:'haya', tip:'4연격 · 반달 공간 왜곡 · 청염의 백지화(예고 · HUD 지워짐)'},
  {id:'baekmyeong', group:'백명신궁', boss:'baekya', name:'백명 — 0계', sub:'백야 · 백룡 → 흑룡 (최종)', waves:false, theme:'baekya', tip:'칠흑 비늘 결계(녹기현경 · 삼라만화) · 흑백 폭풍 · 즉사기'},
];
