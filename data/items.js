/* MFT 블루잉크 : 천년청묵 · data/items.js · v0.5
   아이템. F(상호작용)로 줍습니다.
   heal=체력 회복  shield=방어막  maxHp=최대 체력 증가  baekDown=백묵화 게이지 감소
   dropFrom=떨어뜨리는 적  dropChance=드롭 확률(0~1)  life=바닥에 남아 있는 시간(초)  color=색 */
'use strict';
const ITEMS={
  yeongyeop:{ // 영엽(靈葉) — 세계수의 잎. 잡몹이 떨어뜨림
    name:'영엽(靈葉)', desc:'체력 +12 · 방어막 +10',
    heal:12, shield:10,
    dropFrom:['rusher','eater'], dropChance:0.45, life:25,
    color:0x6fe0b8, glow:0x1d6a50,
  },
  yeongro:{   // 영로(靈露) — 세계수 이슬. 청류의 정화 룬을 파회하면 떨어짐
    name:'영로(靈露)', desc:'최대 체력 +10 · 체력 +30 · 백묵화 -25',
    maxHp:10, heal:30, baekDown:25,
    life:40,
    color:0xbfeaff, glow:0x3a8ab0,
  },
};
