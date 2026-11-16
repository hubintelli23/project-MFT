/* MFT 블루잉크 : 천년청묵 · data/config.js · v0.6
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
  baekhwa:{                 // 백묵화
    hwagyeongTime:12,       // 4단계(영로 화경) 유지 시간 — 끝나면 체력 침식
    drainPerSec:3,          // 체력 침식량(초당)
  },
  ult:{                     // 궁극기 『천지수묵 : 만화정계』
    gainPerDamage:0.1,      // 준 피해 1당 궁극기 게이지 충전량 (게이지 100 = 사용 가능)
    damage:45,              // 궁극기 피해량
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
    dodge:['ShiftLeft','ShiftRight'],
    swap:['Digit1','Digit2','Digit3'],         // 교대: 1 연우 · 2 연하 · 3 매향
    jumpStrong:['ControlLeft','ControlRight'],  // 공중에서 이 키 + 좌클릭 = 점프 강공격
    interact:'KeyF',        // 아이템 줍기 · 상호작용
    map:'KeyM',             // 지도
    settings:'Escape',      // 설정(일시정지)
  },
  // 마우스: 좌클릭 = 공격 · 좌클릭 꾹 = 강공격 · 우클릭 = 대쉬 (고정)

};
// 백묵화 단계 이름 (HUD 표시)
const STAGE_NAME=['0단계','1 용의 비늘','2 용안 개안','3 사지 야수화','4 영로 화경'];
