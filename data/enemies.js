/* MFT 블루잉크 : 천년청묵 · data/enemies.js · v0.4
   잡몹 · 보스 수치와 웨이브 구성. */
'use strict';
const ENEMIES={
  rusher:{        // 탁기 궤웅 — 돌진 자폭형
    hp:45, speed:4.1,
    fuseTime:0.6,         // 자폭 전 부풀어 오르는 시간
    explodeDamage:13, explodeRadius:2.1,
  },
  eater:{         // 묵식귀 — 원거리 침식형
    hp:55, speed:2.3,
    shootInterval:[2.4,3.2],   // 탁기 구체 발사 간격(초, 최소~최대)
    orbDamage:8, orbSpeed:7.5,
    fogRadius:3.2,             // 정화 차단 안개 반경 (안의 적은 개화 피해 50%)
  },
};
const BOSS={      // 청류 — 청류의 수호신
  hp:1600,
  walkSpeed:3.6, walkSpeedP2:4.3,
  phase2At:0.7,          // 체력 70%에서 2페이즈(청룡의 도류)
  runePhaseAt:0.5,       // 체력 50%에서 청룡의 정화 룬
  runeDamageCut:0.8,     // 룬 페이즈 받는 피해 감소 (0.8 = 80% 감소)
  runeShield:220, runeShieldRegen:16,
  brokenStun:6,          // 파회 성공 시 기절 시간
  brokenDamageMul:1.5,   // 파회 후 받는 피해 배율
  damage:{combo:13, step:15, wave:12, vortex:24, counter:22},  // 패턴별 피해
};
// 웨이브 구성 — type: rusher(탁기 궤웅) / eater(묵식귀), x·z: 등장 위치(전투 구역 반지름 15 안)
// 다음 웨이브는 남은 적이 1마리 이하가 되거나 16초가 지나면 등장합니다.
const WAVES=[
  [{type:'rusher',x:-6,z:-9},{type:'rusher',x:6,z:-9},{type:'eater',x:0,z:-12}],
  [{type:'rusher',x:-10,z:2},{type:'rusher',x:10,z:2},{type:'rusher',x:0,z:-12},{type:'eater',x:-8,z:-8}],
];
