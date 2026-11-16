/* MFT 블루잉크 : 천년청묵 · js/items.js · v0.5
   아이템 드롭 · 줍기(상호작용) — 수치는 data/items.js */
'use strict';
const items=[];
function spawnItem(type,x,z){const D=ITEMS[type];if(!D)return;const g=new T.Group();let m;
  if(type==='yeongyeop'){m=new T.Mesh(new T.ConeGeometry(0.24,0.62,4),lam(D.color,D.glow));m.rotation.z=PI/2;m.scale.set(1,1,0.35);}
  else{m=new T.Mesh(new T.SphereGeometry(0.22,14,12),lam(D.color,D.glow));m.scale.set(1,1.25,1);}
  g.add(m);const o=new T.Mesh(m.geometry,OL);o.scale.setScalar(1.12);m.add(o);
  const gl=new T.Sprite(new T.SpriteMaterial({map:dotTex,color:D.color,transparent:true,depthWrite:false,opacity:0.8}));gl.scale.set(1.3,1.3,1);g.add(gl);
  const ring=new T.Mesh(flatGeo(new T.RingGeometry(0.35,0.46,24)),MB(D.color,0.6));ring.position.y=-0.75;g.add(ring);
  clampArena({x,z},0.5);g.position.set(x,0.8,z);scene.add(g);items.push({type,x,z,g,t:D.life||25});burst(x,0.8,z,D.color,8,3,0.3);}
function nearestItem(){if(!P||P.dead)return null;let best=null,bd=CONFIG.interactRange;for(const it of items){const d=Math.hypot(P.x-it.x,P.z-it.z);if(d<bd){bd=d;best=it;}}return best;}
function interact(){const it=nearestItem();if(!it)return false;const D=ITEMS[it.type];
  if(D.maxHp)P.maxHp+=D.maxHp;if(D.heal)P.hp=Math.min(P.maxHp,P.hp+D.heal);if(D.shield)addShield(D.shield);if(D.baekDown)P.baek=Math.max(0,P.baek-D.baekDown);
  popNum(P.x,2.5,P.z,D.name+' — '+D.desc,'info');burst(P.x,1.2,P.z,D.color,14,4,0.35);ringFx(P.x,P.z,0.3,1.6,D.color,0.4);
  removeItem(items.indexOf(it));stats.items++;return true;}
function removeItem(i){if(i<0)return;const it=items[i];scene.remove(it.g);disposeObj(it.g,true);items.splice(i,1);}
function maybeDrop(e){for(const type in ITEMS){const D=ITEMS[type];if(D.dropFrom&&D.dropFrom.includes(e.type)&&Math.random()<D.dropChance){spawnItem(type,e.x,e.z);return;}}}
function updateItems(dt){for(let i=items.length-1;i>=0;i--){const it=items[i];it.t-=dt;it.g.rotation.y+=dt*2;it.g.position.y=0.8+Math.sin(state.time*3+it.x)*0.12;it.g.visible=it.t>5||Math.floor(it.t*6)%2===0;if(it.t<=0)removeItem(i);}}
function updateInteractUI(){const n=nearestItem();const want=n?ITEMS[n.type].name:'';if(uiCache.near===want)return;uiCache.near=want;$('interact').hidden=!n;$('bInt').hidden=!n;if(n)$('intTxt').textContent=ITEMS[n.type].name+' 줍기';}
function clearItems(){while(items.length)removeItem(items.length-1);}
