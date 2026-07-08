(function(){
'use strict';
const C=document.getElementById('C'),X=C.getContext('2d');X.imageSmoothingEnabled=false;
const $=i=>document.getElementById(i),O=$('O'),SB=$('startBtn');
const sS=$('sdS'),sC=$('sdC'),sL=$('sdL'),sE=$('sdE');
const T=16,CO=26,RO=26,W=416,H=416,PS=1.5,BS=3,U=0,R=1,D=2,L=3;
let G={};

function iS(){return{
  st:1,sc:0,lv:3,go:false,pa:false,ru:false,tl:20,sp:0,ki:0,
  stm:0,mx:4,pl:null,en:[],bu:[],ti:[],fx:[],fr:0,ke:{},ba:true,
}}

function rng(s){return function(){
  s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;
}}

function mkMp(s){
  let m=Array.from({length:RO},()=>Array(CO).fill(0));
  let r=rng(s*9999+42);
  for(let x=0;x<CO;x++){m[0][x]=2;if(x<11||x>14)m[RO-1][x]=2}
  for(let y=0;y<RO;y++){m[y][0]=2;m[y][CO-1]=2}
  m[RO-1][12]=3;m[RO-1][13]=3;m[RO-2][12]=3;m[RO-2][13]=3;
  for(let y=2;y<RO-3;y++)for(let x=1;x<CO-1;x++){
    if(y>=RO-4&&x>=11&&x<=14)continue;
    if(y<3&&(x<4||x>CO-5))continue;
    if(y>=RO-5&&(x<4||x>CO-5))continue;
    if(r()<.35)m[y][x]=1;
  }
  [[0,0],[0,CO-3],[RO-3,0],[RO-3,CO-3]].forEach(([sy,sx])=>{
    for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++)m[sy+dy][sx+dx]=0;
  });
  for(let dy=0;dy<3;dy++)for(let dx=0;dx<4;dx++)m[RO-4+dy][8+dx]=0;
  if(s>=3)for(let i=0;i<2+s;i++){
    let y=3+Math.floor(r()*(RO-8)),x=3+Math.floor(r()*(CO-6));
    m[y][x]=2;
  }
  return m;
}

// Tile types: 1=brick, 2=steel, 3=base
function drT(x,y,t){
  if(t===1){
    X.fillStyle='#b35e30';X.fillRect(x,y,T,T);
    X.fillStyle='#7a3e1e';X.fillRect(x+7,y,1,T);X.fillRect(x,y+7,T,1);
    X.fillStyle='#d4733e';X.fillRect(x+1,y+1,5,5);X.fillRect(x+9,y+1,5,5);
    X.fillRect(x+1,y+9,5,5);X.fillRect(x+9,y+9,5,5);
  }else if(t===2){
    X.fillStyle='#8a8a8a';X.fillRect(x,y,T,T);
    X.fillStyle='#555';X.fillRect(x+2,y+2,5,5);X.fillRect(x+9,y+2,5,5);
    X.fillRect(x+2,y+9,5,5);X.fillRect(x+9,y+9,5,5);
    X.fillStyle='#bbb';X.fillRect(x+4,y+4,2,2);X.fillRect(x+11,y+4,2,2);
    X.fillRect(x+4,y+11,2,2);X.fillRect(x+11,y+11,2,2);
    X.fillStyle='rgba(255,255,255,.2)';X.fillRect(x+3,y+3,10,10);
    X.fillStyle='#555';X.fillRect(x+7,y,1,T);X.fillRect(x,y+7,T,1);
  }else if(t===3){
    X.fillStyle='#444';X.fillRect(x+2,y+6,12,8);X.fillRect(x+4,y+4,8,2);
    X.fillStyle='#e74c3c';X.fillRect(x+5,y,6,5);
    X.fillStyle='#f1c40f';X.fillRect(x+6,y+1,4,3);
    X.fillStyle='#f39c12';X.fillRect(x+4,y+8,8,4);
    X.fillStyle='#fff';X.fillRect(x+4,y+7,2,2);X.fillRect(x+10,y+7,2,2);
    X.fillStyle='#222';X.fillRect(x+5,y+8,1,1);X.fillRect(x+11,y+8,1,1);
  }
}

function drPl(x,y,d,fl){
  if(fl&&(G.fr>>2)%2===0){X.fillStyle='rgba(255,255,255,.12)';X.fillRect(x,y,16,16)}
  X.fillStyle='#ffd700';X.fillRect(x+1,y+3,14,10);
  X.fillStyle='#a88800';X.fillRect(x,y+2,3,12);X.fillRect(x+13,y+2,3,12);
  X.fillStyle='#ffd700';
  for(let i=0;i<4;i++){X.fillRect(x,y+3+i*3,3,1);X.fillRect(x+13,y+3+i*3,3,1)}
  X.fillStyle='#a88800';
  if(d===U){X.fillRect(x+4,y,8,7);X.fillRect(x+6,y-3,4,4)}
  else if(d===R){X.fillRect(x+9,y+4,7,8);X.fillRect(x+15,y+6,4,4)}
  else if(d===D){X.fillRect(x+4,y+9,8,7);X.fillRect(x+6,y+15,4,4)}
  else{X.fillRect(x,y+4,7,8);X.fillRect(x-3,y+6,4,4)}
  X.fillStyle='#ffd700';
  if(d===U)X.fillRect(x+6,y-4,4,6);else if(d===R)X.fillRect(x+15,y+6,6,4);
  else if(d===D)X.fillRect(x+6,y+14,4,6);else X.fillRect(x-5,y+6,6,4);
  X.fillStyle='#fff';
  if(d===U)X.fillRect(x+7,y+3,2,2);else if(d===R)X.fillRect(x+10,y+7,2,2);
  else if(d===D)X.fillRect(x+7,y+11,2,2);else X.fillRect(x+4,y+7,2,2);
}

function drEn(x,y,d,tp,sf,hp,mh){
  if(sf>0){X.fillStyle=sf%8<4?'#fff':'#ffd700';X.fillRect(x,y,16,16);return}
  let cl=tp===2?'#7f8c8d':tp===1?'#e67e22':'#c0392b';
  let c2=tp===2?'#4a5555':tp===1?'#a8590a':'#7a1f1a';
  X.fillStyle=cl;X.fillRect(x+1,y+3,14,10);
  X.fillStyle=c2;X.fillRect(x,y+2,3,12);X.fillRect(x+13,y+2,3,12);
  X.fillStyle=cl;
  for(let i=0;i<4;i++){X.fillRect(x,y+3+i*3,3,1);X.fillRect(x+13,y+3+i*3,3,1)}
  X.fillStyle=c2;
  if(d===U){X.fillRect(x+5,y,6,7);X.fillRect(x+6,y-3,4,4)}
  else if(d===R){X.fillRect(x+9,y+5,7,6);X.fillRect(x+15,y+6,4,4)}
  else if(d===D){X.fillRect(x+5,y+9,6,7);X.fillRect(x+6,y+15,4,4)}
  else{X.fillRect(x,y+5,7,6);X.fillRect(x-3,y+6,4,4)}
  X.fillStyle=cl;
  if(d===U)X.fillRect(x+6,y-3,4,5);else if(d===R)X.fillRect(x+15,y+6,5,4);
  else if(d===D)X.fillRect(x+6,y+14,4,5);else X.fillRect(x-4,y+6,5,4);
  if(mh>1){X.fillStyle='#111';X.fillRect(x+2,y-3,12,3);X.fillStyle='#2ecc71';X.fillRect(x+3,y-2,(hp/mh)*10,1)}
  X.fillStyle='#fff';
  if(d===U)X.fillRect(x+7,y+3,2,2);else if(d===R)X.fillRect(x+10,y+7,2,2);
  else if(d===D)X.fillRect(x+7,y+11,2,2);else X.fillRect(x+4,y+7,2,2);
  X.fillStyle='#e74c3c';
  if(d===U)X.fillRect(x+8,y+3,1,1);else if(d===R)X.fillRect(x+11,y+7,1,1);
  else if(d===D)X.fillRect(x+8,y+11,1,1);else X.fillRect(x+5,y+7,1,1);
}

// Collision
function col(a,b){
  return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
}
function canM(nx,ny,self){
  if(nx<0||nx+16>W||ny<0||ny+16>H)return false;
  for(const t of G.ti)if(t.a&&nx<t.x+T&&nx+16>t.x&&ny<t.y+T&&ny+16>t.y)return false;
  for(const e of G.en)if(e!==self&&e.a)
    if(nx<e.x+16&&nx+16>e.x&&ny<e.y+16&&ny+16>e.y)return false;
  if(G.pl&&G.pl.a&&G.pl!==self)
    if(nx<G.pl.x+16&&nx+16>G.pl.x&&ny<G.pl.y+16&&ny+16>G.pl.y)return false;
  return true;
}

function mTank(t,dir){
  t.d=dir;let nx=t.x,ny=t.y;
  if(dir===U)ny-=t.sp;else if(dir===D)ny+=t.sp;
  else if(dir===L)nx-=t.sp;else nx+=t.sp;
  if(dir===U||dir===D)nx=Math.round(nx/2)*2;else ny=Math.round(ny/2)*2;
  if(!canM(nx,ny,t))return;
  if(dir===U||dir===D){let a=Math.abs(nx%16);if(a<3)nx=Math.floor(nx/16)*16;else if(a>13)nx=Math.ceil(nx/16)*16}
  else{let a=Math.abs(ny%16);if(a<3)ny=Math.floor(ny/16)*16;else if(a>13)ny=Math.ceil(ny/16)*16}
  if(canM(nx,ny,t)){t.x=nx;t.y=ny}
}

function fx(x,y,n,c1,c2){
  for(let i=0;i<n;i++){let a=Math.random()*6.28,s=.5+Math.random()*2.5;
    G.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,lt:15+30*Math.random(),ml:40,sz:2+Math.floor(Math.random()*4),cl:Math.random()>.5?c1:c2})}
  G.fx.push({x,y,r:n*1.8,lt:12,ml:12,bo:true})
}
function uFX(){
  for(let i=G.fx.length-1;i>=0;i--){let p=G.fx[i]
    if(p.bo){if(--p.lt<=0)G.fx.splice(i,1);continue}
    p.x+=p.vx;p.y+=p.vy;p.vy+=.03;if(--p.lt<=0)G.fx.splice(i,1)
  }
}
function dFX(){
  for(const p of G.fx){if(p.bo){let a=p.lt/p.ml
    X.globalAlpha=a*.35;X.fillStyle='#ffd700';X.beginPath();X.arc(p.x,p.y,p.r*(1-a*.5),0,6.28);X.fill()
    X.fillStyle='#fff';X.beginPath();X.arc(p.x,p.y,p.r*(1-a)*.3,0,6.28);X.fill();X.globalAlpha=1
  }else{X.globalAlpha=p.lt/p.ml;X.fillStyle=p.cl;X.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz)}}
  X.globalAlpha=1
}

// Enemy spawn
const SPW=[{x:16,y:16},{x:192,y:16},{x:368,y:16}];
function spE(){
  let pl=[...SPW].sort(()=>Math.random()-.5);
  for(const p of pl){
    let b=false;
    for(const e of G.en)if(e.a&&Math.abs(e.x-p.x)<24&&Math.abs(e.y-p.y)<24){b=true;break}
    if(G.pl&&G.pl.a&&Math.abs(G.pl.x-p.x)<24&&Math.abs(G.pl.y-p.y)<24)b=true;
    if(b)continue;
    let t=Math.random()<.15?2:Math.random()<.4?1:0;
    G.en.push({x:p.x,y:p.y,w:16,h:16,d:D,sp:t===1?.95:t===0?.6:.45,hp:t===2?3:1,mh:t===2?3:1,a:true,tp:t,cd:0,sf:45,dc:0,st:40+60*Math.random()});
    G.sp++;uH();return
  }
}

function uH(){sC.textContent=G.sc;sS.textContent=G.st;sL.textContent=G.lv;sE.textContent=Math.max(0,G.tl-G.ki)}

function eG(){
  G.go=true;G.ru=false;O.style.display='flex';
  O.innerHTML='<h1>GAME OVER</h1><p>得分: '+G.sc+'</p><p>关卡: '+G.st+'</p><button class="btn" id="rb">重新开始</button>';
  $('rb').onclick=()=>{O.style.display='none';sG()}
}
function nS(){
  G.st++;G.ru=false;O.style.display='flex';
  O.innerHTML='<h1>STAGE '+G.st+'</h1><p>准备下一关!</p><button class="btn" id="nb">继续</button>';
  $('nb').onclick=()=>{O.style.display='none';sSt(G.st)}
}

function sG(){G=iS();sSt(1)}
function sSt(s){
  G.st=s;G.tl=20+(s-1)*5;G.sp=0;G.ki=0;G.ru=true;G.ba=true;
  G.en=[];G.bu=[];G.ti=[];G.fx=[];G.stm=0;
  let m=mkMp(s);
  for(let r=0;r<RO;r++)for(let c=0;c<CO;c++)if(m[r][c]>=1&&m[r][c]<=3)
    G.ti.push({x:c*T,y:r*T,w:T,h:T,tp:m[r][c],a:true});
  G.pl={x:8*T,y:(RO-3)*T,w:16,h:16,d:U,sp:PS,hp:1,a:true,cd:0,iv:120,rs:0};
  uH();O.style.display='none';
}

// Input
document.addEventListener('keydown',e=>{
  G.ke[e.key]=true;
  if(e.key==='p'||e.key==='P')G.pa=!G.pa;
  if(' ArrowUp ArrowDown ArrowLeft ArrowRight  '.includes(' '+e.key+' '))e.preventDefault();
});
document.addEventListener('keyup',e=>{
  G.ke[e.key]=false;
  if(' ArrowUp ArrowDown ArrowLeft ArrowRight  '.includes(' '+e.key+' '))e.preventDefault();
});

function up(){
  if(!G.ru||G.go||G.pa)return;
  G.fr++;

  // Player
  if(G.pl&&G.pl.a){
    if(G.pl.iv>0)G.pl.iv--;
    if(G.pl.cd>0)G.pl.cd--;
    if(G.ke['ArrowUp'])mTank(G.pl,U);
    else if(G.ke['ArrowDown'])mTank(G.pl,D);
    else if(G.ke['ArrowLeft'])mTank(G.pl,L);
    else if(G.ke['ArrowRight'])mTank(G.pl,R);
    if(G.ke[' ']||G.ke['Space']){
      if(G.pl.cd<=0){
        G.pl.cd=12;let bx=G.pl.x+6,by=G.pl.y+6;
        if(G.pl.d===U){bx=G.pl.x+6;by=G.pl.y-4}else if(G.pl.d===R){bx=G.pl.x+16;by=G.pl.y+6}
        else if(G.pl.d===D){bx=G.pl.x+6;by=G.pl.y+16}else{bx=G.pl.x-4;by=G.pl.y+6}
        G.bu.push({x:bx,y:by,w:4,h:4,d:G.pl.d,ok:true,a:true});
      }
    }
  }else if(G.pl&&!G.pl.a&&G.pl.rs>0){
    if(--G.pl.rs<=0&&G.lv>0){
      G.pl.x=8*T;G.pl.y=(RO-3)*T;G.pl.d=U;G.pl.a=true;G.pl.hp=1;G.pl.iv=120;G.pl.cd=0;
      fx(G.pl.x+8,G.pl.y+8,8,'#4ecdc4','#fff');
    }
  }

  // Spawn enemies
  if(G.sp<G.tl&&G.en.filter(e=>e.a).length<G.mx&&--G.stm<=0){spE();G.stm=90}

  // Enemy AI
  for(const e of G.en){
    if(e.sf>0){e.sf--;continue}
    if(!e.a)continue;
    if(e.cd>0)e.cd--;
    e.dc--;
    if(e.dc<=0){
      if(G.pl&&G.pl.a){
        let dx=G.pl.x-e.x,dy=G.pl.y-e.y;
        if(Math.random()<.35)e.d=Math.abs(dy)>Math.abs(dx)?(dy>0?D:U):(dx>0?R:L);
        else if(Math.random()<.5)e.d=Math.floor(Math.random()*4);
      }else e.d=Math.floor(Math.random()*4);
      e.dc=40+Math.floor(Math.random()*80);
    }
    mTank(e,e.d);
    e.st--;if(e.st<=0){e.st=60+Math.floor(Math.random()*90);
      if(e.cd<=0){
        e.cd=35;let bx=e.x+6,by=e.y+6;
        if(e.d===U){bx=e.x+6;by=e.y-4}else if(e.d===R){bx=e.x+16;by=e.y+6}
        else if(e.d===D){bx=e.x+6;by=e.y+16}else{bx=e.x-4;by=e.y+6}
        G.bu.push({x:bx,y:by,w:4,h:4,d:e.d,ok:false,a:true});
      }
    }
  }

  // Bullets
  for(const b of G.bu){
    if(!b.a)continue;
    if(b.d===R)b.x+=BS;else if(b.d===L)b.x-=BS;else if(b.d===U)b.y-=BS;else b.y+=BS;
    if(b.x<-4||b.x>W+4||b.y<-4||b.y>H+4){b.a=false;continue}
    let hit=false;
    for(const t of G.ti)if(t.a&&col(b,t)){
      if(t.tp<3){t.a=false;fx(t.x+8,t.y+8,6,t.tp===1?'#b35e30':'#888','#ffcc00')}
      else{t.a=false;G.ba=false;fx(t.x+8,t.y+8,20,'#e74c3c','#f1c40f')}
      b.a=false;hit=true;break
    }
    if(hit)continue;
    if(b.ok)for(const e of G.en)if(e.a&&col(b,e)){
      e.hp--;if(e.hp<=0){e.a=false;fx(e.x+8,e.y+8,12,'#ff8800','#ffdd00')}
      b.a=false;break
    }
    if(!b.ok&&G.pl&&G.pl.a&&col(b,G.pl)){
      if(G.pl.iv<=0){
        G.pl.a=false;G.lv--;uH();
        fx(G.pl.x+8,G.pl.y+8,15,'#ffd700','#fff');
        if(G.lv<=0)eG();else G.pl.rs=90;
      }
      b.a=false;
    }
  }
  G.bu=G.bu.filter(b=>b.a);

  // Count kills
  for(let i=G.en.length-1;i>=0;i--){let e=G.en[i];if(e.a||e.sf>0)continue;
    G.ki++;G.sc+=[100,200,300][e.tp]||100;G.en.splice(i,1);uH()
  }
  uFX();

  if(G.ki>=G.tl&&G.en.filter(e=>e.a).length===0){nS();return}
  if(!G.ba)eG();
}

function dr(){
  // Grass
  X.fillStyle='#3a5f0b';X.fillRect(0,0,W,H);
  X.fillStyle='rgba(0,0,0,.12)';
  for(let y=0;y<RO;y++)for(let x=y%2?1:0;x<CO;x+=2)X.fillRect(x*T,y*T,T,T);
  // Tiles
  for(const t of G.ti)if(t.a)drT(t.x,t.y,t.tp);
  // Player
  if(G.pl&&G.pl.a)drPl(G.pl.x,G.pl.y,G.pl.d,G.pl.iv>0);
  // Enemies
  for(const e of G.en)if(e.a||e.sf>0)drEn(e.x,e.y,e.d,e.tp,e.sf,e.hp,e.mh);
  // Bullets
  for(const b of G.bu)if(b.a){
    X.fillStyle=b.ok?'#ffe066':'#ff6b6b';X.fillRect(b.x,b.y,4,4);
    X.fillStyle='rgba(255,255,255,.8)';X.fillRect(b.x+1,b.y+1,2,2);
  }
  dFX();
  X.strokeStyle='rgba(255,200,0,.1)';X.lineWidth=2;X.strokeRect(0,0,W,H);
}

function loop(){up();dr();requestAnimationFrame(loop)}

SB.onclick=()=>{O.style.display='none';sG()};
loop();
})();
