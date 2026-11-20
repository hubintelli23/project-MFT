/* MFT 블루잉크 : 천년청묵 · data/characters.js · v1.1
   캐릭터 색상 · 크기. 색은 16진수(0xRRGGBB)로 적습니다.
   robe=옷  acc=허리띠  accE=허리띠 발광  hair=머리카락  eye=눈 */
'use strict';
const CHARACTERS={
  yeonwoo:{   // 연우 — 딜러 & 탱커 (붓/검)
    name:'연우', hp:100, speedMul:1.0, color:0x3fae8c, role:'붓·검',
    robe:0x253530, acc:0x3fae8c, accE:0x0f3a2c, hair:0x121212, eye:0x1f6b55,
    swordLength:1.25, swordColor:0xe2f6ec, swordGlow:0x2a6650,
  },
  yeonha:{    // 연하 — 버퍼 & 제어자 (피리 · 오드아이)
    name:'연하', hp:80, speedMul:1.06, color:0xb070e0, role:'피리',
    robe:0xe6e1ef, acc:0xb23a5a, accE:0x3a0a14, hair:0x2a2440,
    eyeL:0xe0303a, eyeR:0x3a7ae0,   // 오드아이: 적안 · 청안
    flute:0x9fd8c8,
  },
  maehyang:{  // 매향 — 힐러 & 필드 정화자 (침술 · 진법)
    name:'매향', hp:90, speedMul:1.0, color:0x6fe0b8, role:'침술',
    robe:0x6b5a45, acc:0x3fae8c, accE:0x0f3a2c, hair:0x16120f, eye:0x2a2016,
    flower:0xf8f4f0,                // 머리의 백매화
  },
  cheongryu:{ // 청류 (청매 가주)
    robe:0x2b6b8a, acc:0xbfe6f2, accE:0x2a5566, hair:0xdfe8ee, eye:0x2a8fd0,
    scale:1.32,                 // 몸 크기 배율
    swordLength:1.7, swordColor:0x9fdcff, swordGlow:0x1f5a88,
    dragonColor:0x58b8ff,       // 2페이즈 청룡 환영 색
  },
  baekjin:{   // 백진 (백련 가주) — 은빛 갑주 · 거대 방패 · 성검
    robe:0xcfd6dc, acc:0xe8c86a, accE:0x4a3a10, hair:0xf2f2f2, eye:0x2a3a4a,
    scale:1.45, swordLength:1.8, swordColor:0xf4f8ff, swordGlow:0x8a9ab0, shield:0xe8edf2, emblem:0xe8c86a,
  },
  cheonjehyeok:{ // 천제혁 (마교 교주) — 흑적색 · 칠흑 참마도
    robe:0x2a0f12, acc:0xa0141e, accE:0x3a0508, hair:0x120808, eye:0xe0202a,
    scale:1.42, bladeColor:0x18100f, bladeGlow:0x5a0a10,
  },
  phantom:{ color:0xdfe8f2 },   // 백진의 기사 환영
  // 심원회 — 드래곤 하트 파편 소유자 (설정에 외형 색이 없어 파편의 성질에 맞춰 임의로 정한 색)
  yunjae:{ robe:0x2a5a78, acc:0x6fd0f0, accE:0x0a3a4a, hair:0x141820, eye:0x6fd0f0, scale:1.3, swordColor:0xc8f0ff, swordGlow:0x1a5a7a, shard:0x9fe8ff, aura:0x6fd0f0 },  // 윤재 — 에테르의 지배
  seolryeong:{ robe:0xe8f2f2, acc:0x7fd8c8, accE:0x1a4a40, hair:0xdfe8e8, eye:0x3a9a8a, scale:1.28, swordColor:0xf4fffc, swordGlow:0x3a8a7a, shard:0xbfffee, aura:0x7fd8c8 },  // 설령 — 정화와 균형
  muha:{ robe:0x6a5a40, acc:0xd8c8a0, accE:0x3a2a10, hair:0x2a2018, eye:0xc8a060, scale:1.3, swordColor:0xf2e8d0, swordGlow:0x6a5020, shard:0xffe8b0, aura:0xd8c8a0 },  // 무하 — 기억과 기록
  yeonhwi:{ robe:0x4a3a78, acc:0xe8c86a, accE:0x4a3a10, hair:0x1a1428, eye:0xe8c86a, scale:1.3, swordColor:0xf0e0ff, swordGlow:0x5a3a9a, shard:0xffe08a, aura:0xa08ae0 },  // 연휘 — 인과와 흐름
  doyun:{ robe:0x4a5058, acc:0xe0a040, accE:0x4a2a00, hair:0x202428, eye:0xe0a040, scale:1.42, swordLength:1.6, swordColor:0xe8e8e0, swordGlow:0x5a4a30, shard:0xffd080, aura:0xe0a040 },  // 도윤 — 세계의 경계
  // 백명신궁 — 화염의 존재 8 (설정: 화염 이름 · 색 · 고유현상 · 모습)
  baekrin:{ kind:'dragon', size:1.0, color:0xf4f4f0, emissive:0x3a3a30, flame:0xffffff, horn:0xe8e0c8, spine:0xd8f0ff },      // 백린 — 천소화 · 백염 · 용
  cheonghwi:{ kind:'lion', size:1.1, color:0x2a4a6a, emissive:0x0a1a3a, flame:0x5ab8ff },                                     // 청휘 — 정명화 · 청염 · 사자
  jeokseom:{ kind:'leopard', size:1.0, color:0x8a2a1a, emissive:0x3a0a00, flame:0xff4a2a, dark:0x2a0a08 },                    // 적섬 — 단연화 · 적염 · 표범
  noknyeong:{ kind:'spirit', size:1.0, color:0x3a8a5a, emissive:0x0a3a1a, flame:0x6fe0a0 },                                    // 녹령 — 회생화 · 녹염 · 선영
  jayo:{ kind:'strange', size:1.05, color:0x5a2a7a, emissive:0x2a0a3a, flame:0xc060ff },                                      // 자요 — 왜곡화 · 자염 · 이형의 동물
  hwangroe:{ kind:'cheetah', size:1.0, color:0xc8a030, emissive:0x3a2a00, flame:0xffe040, dark:0x3a2a08 },                    // 황뢰 — 화령화 · 황염 · 치타
  hongak:{ kind:'boar', size:1.15, color:0x6a1a2a, emissive:0x3a0010, flame:0xff3a5a },                                       // 홍악 — 압염화 · 홍염 · 멧돼지
  heukrang:{ kind:'wolf', size:1.05, color:0x1a2028, emissive:0x0a1a2a, flame:0x3a8ab0 },                                     // 흑랑 — 잔영화 · 흑청염 · 늑대
  // 백명신궁 — 태초의 신수 계열
  guya:{ kind:'crow', size:1.2, color:0x1a1416, emissive:0x2a0505, flame:0xff3a2a },                                          // 구야 — 적염의 삼족오
  haya:{ robe:0xf4f8ff, acc:0x5ab8ff, accE:0x0a2a5a, hair:0xf8fbff, eye:0x3a7ae0, scale:1.25, flame:0x5ab8ff },              // 하야 — 청염의 하얀 토끼(옥토 신선)
  baekya:{ kind:'dragon', size:1.9, color:0xe8e4dc, emissive:0x3a0a0a, flame:0xc8202a, wing:0xd8d0c8, horn:0x2a1a1a, spine:0x8a1018 },  // 백야 — 백룡(침식기) → 흑룡
  zayeong:{   // 자영 (운자 가주) — 연보라 · 보랏빛 불꽃 환술사 · 부채검
    robe:0x8a6ab8, acc:0xe8c8f0, accE:0x3a1a4a, hair:0x2a1a3a, eye:0xc060f0,
    scale:1.3, swordLength:1.3, swordColor:0xe8d0ff, swordGlow:0x6a3a9a, flame:0xb070ff,
  },
  igyeom:{    // 이겸 (은리 가주) — 청회색 갑주 · 연노랑 · 법도와 쇠사슬
    robe:0x7d848c, acc:0xf0e08a, accE:0x4a4010, hair:0x2e2e30, eye:0xd8c060,
    scale:1.45, bladeColor:0xf0e8b0, bladeGlow:0x6a5a10, chain:0xc8c8c0,
  },
  sahyeon:{   // 사현 (사미 가주) — 진홍 · 그림자 뱀의 암살자 · 쌍단검
    robe:0x7a1a24, acc:0xf2a0b0, accE:0x3a0a10, hair:0x141010, eye:0xe04050,
    scale:1.28, swordLength:0.9, swordColor:0xf2c0c8, swordGlow:0x6a1020,
  },
  wollyeong:{ // 월령 (월백 가주 · 월계 수장) — 은백 · 기억의 거울 · 월백휘명검
    robe:0xdfe6f0, acc:0x9fc8ff, accE:0x1a3a6a, hair:0xf4f8ff, eye:0x6fa8ff,
    scale:1.38, swordLength:1.6, swordColor:0xf4f8ff, swordGlow:0x4a7ac0, mirror:0xcfe0ff,
  },
};
// 백묵화 단계별 연우의 옷 색 (0~4단계)
const STAGE_COL=[0x253530,0x1e1a1c,0x2c1518,0x331014,0xeef6f1];
