/* MFT 블루잉크 : 천년청묵 · data/characters.js · v0.4
   캐릭터 색상 · 크기. 색은 16진수(0xRRGGBB)로 적습니다.
   robe=옷  acc=허리띠  accE=허리띠 발광  hair=머리카락  eye=눈 */
'use strict';
const CHARACTERS={
  yeonwoo:{   // 연우
    robe:0x253530, acc:0x3fae8c, accE:0x0f3a2c, hair:0x121212, eye:0x1f6b55,
    swordLength:1.25, swordColor:0xe2f6ec, swordGlow:0x2a6650,
  },
  cheongryu:{ // 청류 (청매 가주)
    robe:0x2b6b8a, acc:0xbfe6f2, accE:0x2a5566, hair:0xdfe8ee, eye:0x2a8fd0,
    scale:1.32,                 // 몸 크기 배율
    swordLength:1.7, swordColor:0x9fdcff, swordGlow:0x1f5a88,
    dragonColor:0x58b8ff,       // 2페이즈 청룡 환영 색
  },
};
// 백묵화 단계별 연우의 옷 색 (0~4단계)
const STAGE_COL=[0x253530,0x1e1a1c,0x2c1518,0x331014,0xeef6f1];
