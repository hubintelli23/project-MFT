/* MFT 블루잉크 : 천년청묵 · data/skills.js · v0.9
   연우의 공격 수치.
   dur=동작 시간(초)  hit=타격 순간(초)  range=사거리  half=좌우 판정 각도(도, 180=전방위)
   dmg=피해  lunge=앞으로 미끄러지는 거리  mark=낙인 부여 수  bloom=개화시킬 낙인 수
   bloomAll=남은 낙인 전부 개화(숫자=배율)  kb=넉백  root=속박(초)  shield=방어막 획득
   n=화면에 표시할 기술 이름  swing=팔 휘두르는 방향(연출용) */
'use strict';
// 기본 공격 1~4타
const DEF={
  brush:[
    {dur:0.44,hit:0.17,range:3.7,half:70,dmg:7,lunge:0.5,mark:1,swing:[-1.6,1.4]},            // 1타 횡참
    {dur:0.44,hit:0.17,range:3.7,half:75,dmg:7,lunge:0.5,mark:1,swing:[1.5,-1.5]},            // 2타 역횡참
    {dur:0.52,hit:0.22,range:4.3,half:60,dmg:8,lunge:0.6,mark:1,pull:true,swing:[-0.5,0.5]},  // 3타 원형 참격 (끌어당김)
    {dur:0.7,hit:0.3,range:4.3,half:180,dmg:11,lunge:0.2,mark:1,kb:5,spin:true}],             // 4타 광역 묵화 개화참
  sword:[
    {dur:0.3,hit:0.1,range:2.9,half:55,dmg:10,lunge:0.7,bloom:1,swing:[1.2,-1.2]},            // 1타 사선 참격
    {dur:0.32,hit:0.11,range:2.9,half:62,dmg:11,lunge:0.7,bloom:1,critAdd:0.15,swing:[-1.4,1.4]}, // 2타 역참
    {dur:0.4,hit:0.15,range:2.9,half:45,dmg:13,lunge:0.8,bloom:1,launch:true,vert:true},      // 3타 종참 (띄우기)
    {dur:0.6,hit:0.26,range:3.3,half:70,dmg:18,lunge:0.9,bloomAll:1,kb:4,shield:8,cross:true}], // 4타 정화의 십자 참격
};
// 점프 공격 (공중에서 공격) — hits=여러 번 때리는 타이밍
const AIR={
  brush:{n:'비묵호선',dur:0.42,hit:0.15,range:3.4,half:70,dmg:8,lunge:0.3,mark:1,air:true,swing:[-1.5,1.5]},
  sword:{n:'비검무공',dur:0.46,hit:0.1,hits:[0.1,0.26],range:2.9,half:60,dmg:9,lunge:0.4,bloom:1,launch:true,air:true,swing:[1.3,-1.3]},
};
// 강공격 (공격 버튼 꾹)
const STRONG={
  brush:{n:'응묵결쇄',dur:0.66,hit:0.3,range:5.2,half:35,dmg:9,lunge:0,mark:2,root:1.6,vert:true,strong:true},
  sword:{n:'점묵폭화',dur:0.62,hit:0.3,range:3.1,half:45,dmg:20,lunge:1.0,bloomAll:1.5,shieldPer:3,vert:true,strong:true},
};
// 스킬 쿨타임(초) — b1 만묵소진 · b2 묵향결쇄 · s1 점묵개화 · s2 유묵섬참
const CD={b1:9,b2:6,s1:7,s2:10};

/* ===== 연하 (피리 · 음파) =====  proj = 투사체 {n:개수, spread:퍼지는 각도, speed:속도, range:사거리, color:색}
   slow = 둔화(초) */
DEF.yeonha=[
  {dur:0.36,hit:0.12,dmg:6,mark:1,proj:{n:1,speed:20,range:9,color:0xe0405a},swing:[-0.6,0.6]},            // 1타 적음
  {dur:0.36,hit:0.12,dmg:6,mark:1,proj:{n:1,speed:20,range:9,color:0x4a8fe0},swing:[0.6,-0.6]},             // 2타 청음
  {dur:0.42,hit:0.14,dmg:6,mark:1,proj:{n:2,spread:14,speed:20,range:9,color:0xe0405a},swing:[-0.6,0.6]},   // 3타 쌍음
  {dur:0.56,hit:0.22,dmg:7,mark:1,slow:2,proj:{n:5,spread:50,speed:18,range:8,color:0xb070e0},swing:[-1,1]}]; // 4타 적청 쌍파
AIR.yeonha={n:'공명 낙음',dur:0.4,hit:0.12,dmg:7,mark:1,air:true,proj:{n:3,spread:30,speed:20,range:8,color:0xb070e0},swing:[-0.6,0.6]};
STRONG.yeonha={n:'오드아이 응시',dur:0.6,hit:0.28,range:7,half:28,dmg:8,mark:2,slow:3,vert:true,strong:true};

/* ===== 매향 (은침 · 매화 진) =====  field = 발밑에 매화 진 설치 */
DEF.maehyang=[
  {dur:0.32,hit:0.1,dmg:6,bloom:1,proj:{n:1,speed:26,range:7.5,color:0xf2f2e8},swing:[-0.8,0.6]},          // 1타 은침
  {dur:0.32,hit:0.1,dmg:6,bloom:1,proj:{n:1,speed:26,range:7.5,color:0xf2f2e8},swing:[0.8,-0.6]},          // 2타 은침
  {dur:0.38,hit:0.12,dmg:6,bloom:1,proj:{n:3,spread:16,speed:26,range:7.5,color:0xf2f2e8},swing:[-0.8,0.8]},// 3타 삼침
  {dur:0.52,hit:0.2,dmg:7,bloomAll:1,proj:{n:5,spread:40,speed:24,range:7,color:0x6fe0b8},swing:[-1.2,1.2]}];// 4타 매화 산침
AIR.maehyang={n:'낙화침',dur:0.4,hit:0.12,dmg:6,bloom:1,air:true,proj:{n:4,spread:40,speed:24,range:7,color:0xf2f2e8},swing:[-0.8,0.8]};
STRONG.maehyang={n:'대지 침술',dur:0.6,hit:0.3,range:3,half:180,dmg:9,bloom:1,field:true,vert:true,strong:true};

// 쿨타임 — h1 적안·경고의 음 · h2 청안·균열 노출 · m1 매화혈맥진 · m2 생기 착근
CD.h1=12;CD.h2=10;CD.m1=14;CD.m2=8;

/* ===== v0.9 가드파쇄(gb) · 영로 소모 =====
   gb:true = 가드파쇄 공격 — 적의 가드 · 강체를 깨뜨리고 스태거를 크게 깎음 */
STRONG.brush.gb=true;STRONG.sword.gb=true;STRONG.yeonha.gb=true;STRONG.maehyang.gb=true;
DEF.sword[3].gb=true;   // 검 4타 정화의 십자 참격
// 스킬(Q · E)을 쓸 때 드는 영로
const SKILL_COST={b1:20,b2:15,s1:15,s2:25,h1:25,h2:15,m1:30,m2:15};
