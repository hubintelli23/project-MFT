/* MFT 블루잉크 : 천년청묵 · data/config.js · v0.4
   기본 수치 · 조작 키. 숫자만 바꿔도 게임에 바로 반영됩니다. */
'use strict';
const CONFIG={
  arena:15,                 // 전투 구역 반지름
  holdTime:0.32,            // 공격 버튼을 몇 초 누르면 강공격이 되는지
  player:{
    hp:100,                 // 최대 체력
    startShield:20,         // 시작 방어막
    maxShield:60,           // 방어막 최대치
    speed:6.0,              // 이동 속도
    jumpPower:9.5,          // 점프 힘 (클수록 높이 뜀)
    gravity:26,             // 중력 (클수록 빨리 떨어짐)
    dodgeCd:0.42,           // 회피 쿨타임(초)
    dodgeCdPuddle:1.1,      // 탁기 웅덩이 위에서의 회피 쿨타임
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
  yeonha:{                  // 연하 — 생기 인화의 음률(위기 구출)
    heal:0.2,               // 최대 체력 대비 회복 비율
    invuln:3,               // 무적 시간(초)
    cooldown:90,            // 재사용 대기(초)
  },
  keys:{                    // 키보드 조작 (키 이름: https://keycode.info 의 event.code)
    attack:'KeyC',          // 공격 (마우스 좌클릭도 공격)
    skill1:'KeyQ',
    skill2:'KeyE',
    ult:'KeyR',
    switch:'KeyF',          // 붓/검 전환
    jump:'Space',
    dodge:['ShiftLeft','ShiftRight'],
  },
};
// 백묵화 단계 이름 (HUD 표시)
const STAGE_NAME=['0단계','1 용의 비늘','2 용안 개안','3 사지 야수화','4 영로 화경'];
