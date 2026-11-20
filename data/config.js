/* MFT 블루잉크 : 천년청묵 · data/config.js · v0.9
   기본 수치 · 조작 키. 숫자만 바꿔도 게임에 바로 반영됩니다. */
'use strict';
const CONFIG={
  arena:15,                 // 전투 구역 반지름
  holdTime:0.5,             // 좌클릭(공격 버튼)을 몇 초 누르면 강공격이 되는지
  interactRange:1.8,        // F(상호작용)로 아이템을 주울 수 있는 거리
  player:{
    startShield:20,         // 시작 방어막
    maxShield:60,           // 방어막 최대치
    speed:6.0,              // 이동 속도
    jumpPower:9.5,          // 점프 힘 (클수록 높이 뜀)
    gravity:26,             // 중력 (클수록 빨리 떨어짐)
    dodgeCd:0.42,           // 회피 쿨타임(초)
    dodgeCdPuddle:1.1,      // 탁기 웅덩이 위에서의 회피 쿨타임
    dashDistance:4.5,       // 대쉬(마우스 우클릭) 거리 — 무적 없음, 회피보다 멀리
    dashTime:0.18,          // 대쉬에 걸리는 시간(초)
    dashCd:0.6,             // 대쉬 쿨타임(초)
    brushShieldRegen:1.2,   // 붓 모드일 때 초당 방어막 재생 (비취묵령결)
  },
  baekhwa:{                 // 백묵화 침식도 · 영로화경 (v0.9: 영로화경은 청명도로 진입)
    hwagNeedErosion:75,     // 영로화경(4단계)에 들어가려면 필요한 침식도 (75 = 3단계)
    hwagDrain:6,            // 영로화경 동안 초당 청명도 감소 — 청명도가 0이 되면 영로화경 종료
    hwagPenalty:0.15,       // 청명도가 바닥나 영로화경이 끝날 때 잃는 체력(최대 체력 비율)
  },
  resource:{                // v0.9 전투 자원 — 청명도 · 영로
    clarityStart:30,        // 청명도 시작값 (100이 되면 + 침식도 3단계 이상이면 영로화경 진입)
    clarityBloom:2.5,       // 개화한 낙인 1개당 청명도
    clarityParry:14, claritySway:9, clarityKill:3, clarityGroggy:10,
    clarityHitLoss:0.5,     // 받은 체력 피해 1당 잃는 청명도
    yrStart:50, yrMax:100,  // 영로(스킬에 쓰는 자원, 파티 공용)
    yrBloom:5,              // 개화한 낙인 1개당 영로
    yrHit:0.8, yrStrong:3, yrParry:12, yrSway:6, yrKill:4,
  },
  combat:{                  // v0.9 방어 · 반격 · 스태거 판정
    parryWindow:0.2,        // 가드를 누른 직후 이 시간(초) 안에 맞으면 패링
    swayWindow:0.22,        // 회피를 누른 직후 이 시간 안에 맞으면 스웨이
    swayCounter:1.5,        // 스웨이 성공 후 반격 기회 시간
    swayBonus:1.6,          // 반격 기회 동안 다음 공격 피해 배율
    guardCut:0.8,           // 가드로 줄이는 피해 (일반 공격)
    guardCutHeavy:0.5,      // 가드로 줄이는 피해 (강한 공격)
    guardMove:0.35,         // 가드 중 이동 속도 배율
    guardBreakStun:0.8,     // 가드파쇄당했을 때 경직(초)
    breakShieldMul:2,       // 가드파쇄 공격이 방어막에 주는 피해 배율
    staggerPerDmg:0.6,      // 준 피해 1당 적 스태거 감소
    gbStaggerMul:3, gbStaggerFlat:18,   // 가드파쇄 공격의 스태거 배율 · 추가량
    parryStagger:70,        // 패링 시 적 스태거 감소
    armorStaggerMul:0.25,   // 적이 강체일 때 받는 스태거 배율 (가드파쇄는 강체를 깨뜨림)
    groggyTime:4.5, mobGroggyTime:2.5, groggyDamageMul:1.3,   // 무력화 시간 · 무력화 중 받는 피해
  },
  support:{                 // v0.9 동료 지원 게이지 (연하 · 매향 각각)
    hit:1.2, strong:3, parry:12, sway:6, groggy:15, bloomPer:1.5,
  },
  ult:{                     // 궁극기 『천지수묵 : 만화정계』
    gainPerDamage:0.1,      // 준 피해 1당 궁극기 게이지 충전량 (게이지 100 = 사용 가능)
    damage:45,              // 궁극기 피해량
    baekCost:25,            // 천지수묵 사용 시 줄어드는 백묵화 침식도 (25 = 1단계) · 영로화경 중이면 벌칙 없이 종료
  },
  nokgi:{                   // 백묵화 5단계 『녹기현경 : 멸화정계』 — 영로화경 상태에서 R로 발동 (궁극기 게이지 불필요)
    duration:15,            // 오룡정계 유지 시간(초) — 이 동안 체력 침식 없음
    damage:40,              // 발동 시 백룡 낙하 피해
    damageMul:1.5,          // 유지 중 연우의 모든 피해 배율
    swordInterval:0.6,      // 허상의 검 4자루가 번갈아 날아가는 간격(초)
    swordRange:9,           // 허상의 검이 노리는 거리
    endBaek:25,             // 끝나면 백묵화 침식도가 이 값으로 돌아감 (25 = 1단계)
    speedMul:1.3,           // 녹기: 이동 · 공격 속도 배율
  },
  party:{                   // 교대 시스템 (캐릭터별 체력·속도는 data/characters.js)
    swapCd:1.0,             // 교대 쿨타임(초)
    swapIframe:0.4,         // 교대 직후 무적 시간
    offFieldUltRate:0.3,    // 대기 중인 동료가 받는 궁극기 게이지 비율 (조작 중인 캐릭터가 준 피해 기준)
    offBaekRate:0.5,        // 연하·매향이 개화시켰을 때 연우 백묵화가 차는 비율
    maeDrainCut:0.4,        // 매향 패시브 『매화 침술』: 백묵화 체력 침식 40% 감소
    maeInterveneCd:30,      // 매향 지원 개입 『매화혈맥진』 쿨타임 (조작 캐릭터가 경직될 때 자동)
    fieldHeal:4,            // 매화 진 위에서 초당 체력 회복
    maxFields:4,            // 동시에 깔 수 있는 매화 진 수
    fieldPassiveCd:5,       // 매향 패시브 『생기 착근』: 개화 시 매화 진 생성 간격(초)
  },
  yeonha:{                  // 연하 — 생기 인화의 음률(위기 구출)
    heal:0.2,               // 최대 체력 대비 회복 비율
    invuln:3,               // 무적 시간(초)
    cooldown:90,            // 재사용 대기(초)
  },
  keys:{                    // 키보드 조작 (키 이름은 event.code 기준: KeyQ, Space, Tab, ShiftLeft …)
    skill1:'KeyQ',
    skill2:'KeyE',
    ult:'KeyR',
    switch:'Tab',           // 붓/검 전환
    jump:'Space',
    dodge:['ShiftLeft','ShiftRight'],           // 회피 — 타이밍 맞추면 스웨이
    guard:'KeyC',           // 가드 (누르고 있기) — 맞기 직전에 누르면 패링
    jointYeonha:'KeyZ',     // 공동 오의: 연우 & 연하 (연하 지원 게이지 가득)
    jointMae:'KeyX',        // 공동 오의: 연우 & 매향 (매향 지원 게이지 가득)
    jointAll:'KeyV',        // 삼인 공동 오의 『삼라만화 : 개화』
    swap:['Digit1','Digit2','Digit3'],         // 교대: 1 연우 · 2 연하 · 3 매향
    jumpStrong:['ControlLeft','ControlRight'],  // 공중에서 이 키 + 좌클릭 = 점프 강공격
    interact:'KeyF',        // 아이템 줍기 · 상호작용
    map:'KeyM',             // 지도
    settings:'Escape',      // 설정(일시정지)
    master:'Backquote',     // 마스터 모드(테스트 모드) 켜기/끄기 — ` 키 (숫자 1 왼쪽)
  },
  // 마우스: 좌클릭 = 공격 · 좌클릭 꾹 = 강공격 · 우클릭 = 대쉬 (고정)

};
// 백묵화 단계 이름 (HUD 표시)
const STAGE_NAME=['0단계','1 용의 비늘','2 용안 개안','3 사지 야수화','4 영로 화경'];
