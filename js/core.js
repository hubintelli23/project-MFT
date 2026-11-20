/* MFT 블루잉크 : 천년청묵 · js/core.js · v0.8
   기본 도구 · 렌더러 · 카메라 · 공용 재질/도형 헬퍼 (배경·이펙트·모델·무기는 js/assets/ 폴더) */
'use strict';
const $=id=>document.getElementById(id);
if(!window.THREE){$('loadErr').hidden=false;throw new Error('THREE not loaded');}
const T=THREE,PI=Math.PI,TAU=PI*2;
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const dist2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const easeOut=k=>1-(1-k)*(1-k);
function angDiff(a,b){let d=a-b;while(d>PI)d-=TAU;while(d<-PI)d+=TAU;return d;}
function lerpAng(a,b,t){return a+angDiff(b,a)*t;}
const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches;
document.body.classList.toggle('touch',isTouch);

/* ================= 렌더러 ================= */
const renderer=new T.WebGLRenderer({antialias:!isTouch});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isTouch?1.5:2));
renderer.setSize(innerWidth,innerHeight);
$('game').appendChild(renderer.domElement);
const scene=new T.Scene();
const camera=new T.PerspectiveCamera(50,innerWidth/innerHeight,0.1,140);
function onResize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.fov=camera.aspect<1?64:50;camera.updateProjectionMatrix();}
addEventListener('resize',onResize);onResize();

/* ================= 공용 헬퍼 ================= */
function ctex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return new T.CanvasTexture(c);}
function blot(g,x,y,r,col,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${col},${a})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
const ARENA=CONFIG.arena;
const MB=(color,op=1)=>new T.MeshBasicMaterial({color,transparent:op<1,opacity:op,depthWrite:!(op<1),side:T.DoubleSide});
function flatGeo(geo){geo.rotateX(-PI/2);return geo;}
function sectorGeo(r,half,inner=0){return flatGeo(inner>0?new T.RingGeometry(inner,r,32,1,-PI/2-half,half*2):new T.CircleGeometry(r,32,-PI/2-half,half*2));}
const OL=new T.MeshBasicMaterial({color:0x121110,side:T.BackSide});
function lam(c,e=0){return new T.MeshLambertMaterial({color:c,emissive:e});}
function disposeObj(o,dg){o.traverse(c=>{if(c.material&&c.material.dispose)c.material.dispose();if(dg&&c.geometry)c.geometry.dispose();});}
