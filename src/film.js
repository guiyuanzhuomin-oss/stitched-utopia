/* All marks, torn surfaces, projected streets, lettering and motion are drawn
   with Canvas 2D. Pure absolute-time state supports seeking and frame export. */
(() => {
'use strict';
const S=window.UTOPIA_SCORE, TAU=Math.PI*2;
const C={paper:'#eee7d4',ink:'#182831',red:'#df533b',blue:'#2453b1',mint:'#a5d8c3',yellow:'#e5b94f',bone:'#f8f2df',faint:'#c7bdac',rust:'#a94b39'};
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const mix=(a,b,x)=>a+(b-a)*x;
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const win=(t,a,b)=>ease((t-a)/b);
const rng=i=>{const n=Math.sin(i*127.1+311.7)*43758.5453;return n-Math.floor(n);};
const fract=x=>x-Math.floor(x);
const rotate=(x,y,a)=>({x:x*Math.cos(a)-y*Math.sin(a),y:x*Math.sin(a)+y*Math.cos(a)});
let canvas,ctx,paper,inkGrain,whiteGrain,W=1920,H=1080,lastState;
const font='"Utopia", "Microsoft YaHei", sans-serif';
function sample(k,t){const arr=S.envelopes[k],x=clamp((t-S.offset)/S.step,0,arr.length-1),i=Math.floor(x);return mix(arr[i],arr[Math.min(i+1,arr.length-1)],x-i);}
function hit(t){return Math.exp(-fract((t-S.phase)/S.period)*6);}
function band(t){return {bass:sample('bass',t),body:sample('body',t),air:sample('air',t),rms:sample('rms',t),on:sample('onset',t),hit:hit(t)};}
function line(points,color=C.ink,width=2,closed=false){ctx.beginPath();for(let i=0;i<points.length;i++)i?ctx.lineTo(points[i][0],points[i][1]):ctx.moveTo(points[i][0],points[i][1]);if(closed)ctx.closePath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function polygon(points,color){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=color;ctx.fill();}
function ellipse(x,y,rx,ry,color,stroke=null,width=2){ctx.beginPath();ctx.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);if(color){ctx.fillStyle=color;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function text(s,x,y,size,color=C.ink,align='left',angle=0,tracking=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=color;ctx.font=`900 ${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='middle';if(!tracking){ctx.fillText(s,0,0);}else{const chars=[...s];let total=chars.reduce((n,c)=>n+ctx.measureText(c).width+tracking,0)-tracking;let left=align==='center'?-total/2:align==='right'?-total:0;for(const c of chars){ctx.fillText(c,left,0);left+=ctx.measureText(c).width+tracking;}}ctx.restore();}
function arc(x,y,r,start,end,color,width=2){ctx.beginPath();ctx.arc(x,y,r,start,end);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function torn(x,y,w,h,color,seed=1,rotation=0){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);const p=[];const n=Math.max(5,Math.ceil(w/22));for(let i=0;i<=n;i++)p.push([-w/2+w*i/n,-h/2+(rng(seed+i)-.5)*7]);p.push([w/2+3,h/2-3]);for(let i=n;i>=0;i--)p.push([-w/2+w*i/n,h/2+(rng(seed+100+i)-.5)*9]);p.push([-w/2-2,-h/2+2]);polygon(p,color);ctx.restore();}
function shadow(dx=7,dy=9){ctx.shadowOffsetX=dx;ctx.shadowOffsetY=dy;ctx.shadowBlur=0;ctx.shadowColor='#18283138';}
function pattern(col,n=2400){const p=document.createElement('canvas');p.width=p.height=512;const c=p.getContext('2d');for(let i=0;i<n;i++){c.fillStyle=col;c.globalAlpha=.2+.7*rng(i+15);const x=rng(i+1)*512,y=rng(i+10001)*512;c.fillRect(x,y,.5+1.8*rng(i+100),.6+1.1*rng(i+200));}return ctx.createPattern(p,'repeat');}
function grain(p,alpha=.4){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=p;ctx.fillRect(-W,-H,W*3,H*3);ctx.restore();}
function halftone(x,y,w,h,color,space=15,radius=2){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle=color;ctx.beginPath();for(let ix=x;ix<x+w;ix+=space)for(let iy=y;iy<y+h;iy+=space){ctx.moveTo(ix+radius,iy);ctx.arc(ix,iy,radius,0,TAU);}ctx.fill();ctx.restore();}
function stitches(points,t,color=C.mint,width=4,density=24){
 ctx.save();ctx.lineCap='round';line(points,color,width/2);
 for(let s=0;s<points.length-1;s++){const p=points[s],q=points[s+1],dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy),n=Math.ceil(d/density);for(let i=0;i<n;i++){const u=(i+.5)/n,x=mix(p[0],q[0],u),y=mix(p[1],q[1],u),nx=-dy/d*7,ny=dx/d*7;line([[x-nx,y-ny],[x+nx,y+ny]],color,width);}}ctx.restore();
}
function ripple(x,y,t,start,color=C.blue,size=1){const d=t-start;if(d<0||d>2.6)return;ctx.save();for(let i=0;i<4;i++){const age=d-i*.19;if(age<0)continue;ctx.globalAlpha=clamp(1-age/2.1)*.65;ellipse(x,y,(30+age*210)*size,(12+age*86)*size,null,color,3);}ctx.restore();}
function marks(x,y,r,t,color=C.red,n=14){ctx.save();ctx.translate(x,y);ctx.rotate(t*.09);for(let i=0;i<n;i++){const a=i/n*TAU;line([[Math.cos(a)*(r+12),Math.sin(a)*(r+12)],[Math.cos(a)*(r+35+7*rng(i)),Math.sin(a)*(r+35+7*rng(i))]],color,2);}ctx.restore();}
function ticket(x,y,size,angle,t,a,repair=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(size,size);
 const squish=1+a.bass*.018+a.hit*.035;ctx.scale(squish,1/squish);
 shadow(8,10);const p=[[-101,-75],[-61,-77],[-48,-70],[-26,-76],[75,-75],[109,-37],[104,68],[70,75],[-105,73],[-96,29],[-110,9]];polygon(p,C.red);ctx.shadowColor='transparent';
 polygon([[69,-75],[109,-37],[68,-38]],C.rust);
 ctx.save();ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(...q):ctx.moveTo(...q));ctx.closePath();ctx.clip();grain(whiteGrain,.75);halftone(-115,-77,30,160,C.rust,7,1.6);ctx.restore();
 ellipse(-70,-41,10,10,C.paper);ellipse(-70,-41,11.5,11.5,null,C.ink,1.4);
 line([[-40,-66],[-45,-40],[-28,-23],[-40,-2],[-20,14],[-31,45],[-21,74]],C.paper,4);
 text('自由',18,-7,40,C.bone,'center');
 text('单程',15,47,11,C.bone,'center');
 ctx.lineWidth=1;ctx.strokeStyle=C.bone;ctx.strokeRect(-83,-58,171,119);
 for(let i=0;i<17;i++)ctx.fillRect(-76+i*7,61,rng(i+12)> .6?3:1,7);
 if(repair>0){ctx.save();ctx.globalAlpha=clamp(repair);torn(-33,-3,47,40,C.bone,91,-.13);stitches([[-38,-48],[-24,53]],t,C.mint,3,15);ctx.restore();}
 ctx.restore();
}
function moth(x,y,s,t,color=C.blue){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*2)*.15);const flap=.2+.8*Math.abs(Math.sin(t*5));polygon([[0,0],[-s*flap,-s*.7],[-s*.8,-s*.2],[0,s*.14]],color);polygon([[0,0],[s*flap,-s*.7],[s*.8,-s*.2],[0,s*.14]],C.red);line([[0,-s*.4],[0,s*.2]],C.ink,2);ctx.restore();}
function flower(x,y,s,t,opening,seed=0,ink=false){
 ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*.7+seed)*.035);ctx.scale(s,s);
 const o=ease(opening),n=7;
 line([[0,19],[3,75],[-7,143]],ink?C.mint:C.ink,5);
 polygon([[0,72],[-40,38],[-39,77],[2,96]],ink?C.mint:C.blue);
 polygon([[1,100],[35,72],[32,115],[-3,125]],ink?C.yellow:C.red);
 for(let i=0;i<n;i++){
  const a=i/n*TAU+seed*.1+Math.sin(t*.3)*.02;ctx.save();ctx.rotate(a);const reach=20+o*57,spread=8+o*24;shadow(3,3);polygon([[0,2],[-spread,-reach*.48],[-spread*.7,-reach],[0,-reach-9],[spread*.9,-reach*.82],[spread,-reach*.42]],i%3===0?C.red:i%3===1?C.yellow:ink?C.mint:C.bone);ctx.shadowColor='transparent';
  line([[0,1],[0,-reach-5]],C.ink,1.8);line([[-spread*.6,-reach*.7],[spread*.6,-reach*.7]],C.ink,1);ctx.restore();
 }
 ellipse(0,0,18,18,ink?C.bone:C.ink);ellipse(0,0,9,9,ink?C.red:C.yellow);ctx.restore();
}
function skyline(t,radius,damage,stitched,a,seed=0){
 for(let i=0;i<62;i++){
  const angle=i/62*TAU;ctx.save();ctx.rotate(angle);
  const h=50+rng(i+31)*139,w=22+rng(i+28)*30,j=(damage>0&&i%9===0)?damage:0;
  const fall=j*(.2+.8*rng(i+4));ctx.translate(0,-radius-fall*80);ctx.rotate((rng(i+5)-.5)*fall*.8);
  ctx.fillStyle=i%5===0?C.blue:i%7===0?C.red:C.ink;ctx.fillRect(-w/2,-h,w,h);
  if(i%3===0)polygon([[-w/2,-h],[0,-h-13],[w/2,-h]],C.ink);
  if(i%5===1){ctx.fillStyle=C.bone;ctx.fillRect(-w/2+2,-h+9,w-4,18);}
  const columns=Math.floor(w/9);for(let k=0;k<Math.min(8,h/17);k++)for(let c=0;c<columns;c++){
   ctx.fillStyle=((c+k+i)%4===0)?C.yellow:C.paper;ctx.globalAlpha=.55+.3*rng(k*13+c+i);ctx.fillRect(-w/2+5+c*9,-h+22+k*15,3,6);
  }ctx.globalAlpha=1;
  if(i%7===0){line([[w*.3,-h],[w*.3,-h-40]],C.ink,3);ellipse(w*.3,-h-41,5,5,C.red);}
  if(stitched&&i%4===0){line([[-w/2,4],[w/2,-h]],C.mint,3);}
  ctx.restore();
 }
}
function station(t,x,y,s,a,healed=false){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(Math.sin(t*.2)*.025);
 torn(0,0,246,82,healed?C.mint:C.bone,34);ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.strokeRect(-118,-35,236,70);text(healed?'下一班：现在':'终点站',0,-7,healed?23:33,C.ink,'center');text(healed?'可以一起出发':'下一班  — — : — —',0,23,12,C.ink,'center');
 line([[-92,42],[-92,115],[92,115],[92,42]],C.ink,6);line([[-144,115],[144,115]],C.ink,3);ctx.restore();}
function ringCity(t,start,returning,a){
 const u=t-start,fold=returning?win(t,76.4,3):0;
 const r=340,rot=-u*.115+(returning?.65:0),zoom=mix(.82,1.24,win(t,start+1,12))*(1-fold*.28);
 const cx=mix(1110,1020,win(t,start,6)),cy=535+Math.sin(u*.4)*22;
 ctx.save();ctx.translate(cx,cy);ctx.scale(zoom,zoom);ctx.rotate(rot);
 ellipse(0,0,r+25,r+25,C.bone);ellipse(0,0,r-30,r-30,C.ink);
 for(let k=0;k<3;k++)ellipse(0,0,r-70-k*34,r-70-k*34,null,k===1?C.yellow:C.paper,k===1?7:1.5);
 for(let i=0;i<90;i++){const aa=i/90*TAU;line([[Math.cos(aa)*(r-20),Math.sin(aa)*(r-20)],[Math.cos(aa)*(r+14),Math.sin(aa)*(r+14)]],C.ink,2);}
 ctx.save();ctx.rotate(-.02*Math.sin(u)*a.bass);skyline(t,r+15,returning?win(t,70,6):0,returning,a);ctx.restore();
 ctx.save();ctx.rotate(-rot);text('转啊转',0,-33,83,C.bone,'center');text(returning?'回程 / 裂缝仍在':'环线 / 无人抵达',0,48,18,C.paper,'center');
 ellipse(0,115,62,9,C.yellow);line([[-105,115],[105,115]],C.paper,1);ctx.restore();
 // Empty transit car stays on the inherited circular track.
 const carAngle=u*.27-1.3;ctx.save();ctx.rotate(carAngle);ctx.translate(0,-r+52);torn(0,0,96,39,returning?C.red:C.yellow,23);ctx.fillStyle=C.ink;for(let i=0;i<5;i++)ctx.fillRect(-38+i*16,-12,11,15);ellipse(-27,19,7,7,C.ink);ellipse(27,19,7,7,C.ink);ctx.restore();
 if(returning){for(let i=0;i<6;i++){const angle=i/6*TAU+.3;ctx.save();ctx.rotate(angle);stitches([[-20,-r-48],[3,-r+34]],t,C.mint,4,19);ctx.restore();}}
 ctx.restore();
 station(t,390,719,.95,a,false);
 const ta=-1.85+u*.37,px=cx+Math.cos(ta)*(r-100)*zoom,py=cy+Math.sin(ta)*(r-100)*zoom;
 const fy=returning?mix(py,521,fold):py;ticket(px,fy,.68,ta+.7,t,a,returning?.6:0);
 ctx.save();ctx.globalAlpha=.9;const n=returning?9:6;for(let i=0;i<n;i++){const age=u-8.7-i*.28;if(age<0)continue;const travel=clamp(age/6),x=mix(580,1450,travel),y=610-Math.sin(travel*Math.PI)*480+i*7,ang=mix(-.7,.4,travel);photo(x,y,.38+.2*rng(i+10),ang,t,i,travel,returning); }ctx.restore();
 // Ring unspools into six strings before the next passage.
 if(!returning&&u>13){const p=win(t,30,3.6);for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(cx+(k-3)*18,cy-r*zoom);ctx.bezierCurveTo(1300,20,1550,130,1920,160+k*22+p*330);ctx.strokeStyle=k%2?C.red:C.ink;ctx.lineWidth=2;ctx.stroke();}}
 if(returning&&fold>0){for(let i=0;i<38;i++){const aa=i/38*TAU+.7,x=cx+Math.cos(aa)*350*(1-fold),y=cy+Math.sin(aa)*300*(1-fold);torn(x,y,30+rng(i)*40,20,C.ink,i,t+i);}}
}
function photo(x,y,s,angle,t,id,travel=0,changed=false){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s,s);shadow(8,10);torn(0,0,320,246,C.bone,100+id);ctx.shadowColor='transparent';ctx.save();ctx.beginPath();ctx.rect(-142,-106,284,175);ctx.clip();ctx.fillStyle=id%2?C.blue:C.ink;ctx.fillRect(-142,-106,284,175);
 const local=(t+id*.7)*.3;ellipse(83,-68,27,27,C.yellow);polygon([[-152,70],[-72,-20],[-12,20],[52,-38],[150,45],[160,75]],C.paper);line([[-152,50],[142,30]],C.mint,2);
 for(let i=0;i<7;i++){ctx.fillStyle=C.ink;ctx.fillRect(-142+i*46,-60+rng(i+id)*20,20,130);}
 if(changed||id%3===0){torn(23,-17,71,119,C.paper,81,.3);line([[3,-67],[43,34]],C.ink,2);}else flower(4,34,.48,t,1,id,true);
 grain(whiteGrain,.45);ctx.restore();text(id%2?'那一天 · 没有下一班':'记忆里也有光',0,98,17,C.ink,'center');ctx.restore();}
function net(t,start,returning,a){
 const u=t-start,release=returning?win(t,91.5,4.7):win(t,13,3.6),pull=.6+.4*a.bass;
 const camera=returning?mix(1.27,1,win(t,start,3.4)):mix(1.6,1,win(t,.25,3.1));
 ctx.save();ctx.translate(960,490);ctx.scale(camera,camera);ctx.translate(-960,-490);
 const px=960+Math.sin(u*2.1)*52,py=471+Math.sin(u*1.7)*27;
 ctx.save();ctx.translate(960,490);ctx.rotate((returning?-.05:.07)+Math.sin(u*.31)*.04);
 const tight=1-release*.52,gap=66+release*12;
 for(let direction=0;direction<2;direction++)for(let i=-19;i<=19;i++){
  const x=i*gap;ctx.beginPath();const nx=direction?0:1,ny=direction?1:0;
  for(let k=-18;k<=18;k++){let xx=direction?x:k*gap,yy=direction?k*gap:x;const rr=Math.hypot(xx,yy),compression=Math.exp(-rr/255)*35*pull*tight;xx+=Math.sign(xx||.1)*compression;yy+=Math.sign(yy||.1)*compression;yy+=Math.sin(xx*.008+u*2)*5*a.body;
   if(release>0){xx+=Math.sin(k*.29+i)*release*37;yy+=Math.cos(i*.37+k*.2)*release*43;}
   const q=rotate(xx,yy,Math.PI/4);if(k===-18)ctx.moveTo(q.x,q.y);else ctx.lineTo(q.x,q.y);
  }ctx.strokeStyle=returning&&i%4===0?C.mint:C.ink;ctx.lineWidth=direction?2.4:4;ctx.stroke();
 }
 ctx.restore();
 const breathe=1+.04*a.hit;ticket(px,py,1.19*breathe,Math.sin(u*.6)*.16,t,a,returning?win(t,81,7):0);
 for(let i=0;i<6;i++){const ang=i/6*TAU+.15,x=px+Math.cos(ang)*138,y=py+Math.sin(ang)*109;line([[x,y],[x+Math.cos(ang)*110*pull,y+Math.sin(ang)*110*pull]],returning?C.mint:C.red,4);ellipse(x,y,5,5,C.red);}
 // Engraved text pushes against the same lattice rather than replacing it.
 if(u<8.2){ctx.save();ctx.globalAlpha=clamp((u-.7)*2)*clamp((8.8-u));text('渴望',125,187,154,C.blue,'left',-.07);text('自由',1460,733,176,C.red,'center',.07);ctx.restore();}
 const glare=win(t,start+5.13,1)*(1-win(t,start+9,1.5));
 if(glare>0){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.28*glare;for(let i=0;i<4;i++)polygon([[1450+i*120,-100],[1510+i*120,-100],[300+i*210,1080],[120+i*210,1080]],C.yellow);ctx.restore();}
 if(u>10){const vocal=Math.floor((u-10)/S.period)*S.period+start+10;ripple(px-76,py-48,t,vocal,returning?C.mint:C.blue,1.25);}
 if(u>12.3&&u<16.8){ctx.save();ctx.globalAlpha=win(t,start+12.3,.4)*(1-win(t,start+15.6,1));text('为你歌唱',1460,268,75,returning?C.mint:C.blue,'center',-.05);ctx.restore();}
 if(returning){
  for(let i=0;i<7;i++){const aa=i/7*TAU,progress=win(t,88+i*.37,3);if(progress<=0)continue;const xx=960+Math.cos(aa)*370,yy=490+Math.sin(aa)*280;ellipse(xx,yy,11,11,C.mint);stitches([[px,py],[mix(px,xx,progress),mix(py,yy,progress)]],t,C.mint,3);flower(xx,yy,.38,t,progress,i,true);}
 }
 if(release>.1){ctx.save();ctx.globalAlpha=release*.7;for(let i=0;i<15;i++){const ang=i/15*TAU+u*.1,rr=210+(u%4)*45;line([[px+Math.cos(ang)*rr,py+Math.sin(ang)*rr],[px+Math.cos(ang)*(rr+44),py+Math.sin(ang)*(rr+44)]],returning?C.mint:C.blue,3);}ctx.restore();}
 ctx.restore();
}
function guitar(t,a){
 const u=t-32.63,unwind=win(t,36.03,4.5),sx=mix(970,1120,win(t,33,5)),sy=500;
 ctx.save();ctx.translate(sx,sy);ctx.rotate(-.4+unwind*.7);ctx.scale(.98,.98);
 ctx.save();ctx.scale(1,1-unwind*.5);shadow(12,15);
 ctx.beginPath();ctx.moveTo(-70,-72);ctx.bezierCurveTo(-232,-150,-310,-18,-276,94);ctx.bezierCurveTo(-359,269,-116,358,27,196);ctx.bezierCurveTo(233,244,260,63,92,-4);ctx.bezierCurveTo(101,-74,19,-117,-70,-72);ctx.fillStyle=C.red;ctx.fill();ctx.shadowColor='transparent';
 ellipse(-84,75,58,58,C.ink);ellipse(-84,75,70,70,null,C.paper,3);torn(23,190,147,32,C.ink,22,-.05);ctx.restore();
 const neck=-415-unwind*270;polygon([[-61,-62],[-39,neck],[34,neck],[12,-63]],C.blue);torn(-4,neck-34,102,113,C.ink,94);
 for(let k=0;k<6;k++){const x=-29+k*9,shift=unwind*(k-2.5)*29;ctx.beginPath();ctx.moveTo(x,200);ctx.bezierCurveTo(x+shift,110,x+shift*2,neck,x+shift*3,neck-67);ctx.strokeStyle=k%2?C.paper:C.yellow;ctx.lineWidth=2;ctx.stroke();}
 for(let i=0;i<13;i++){const y=-93-i*24;line([[-49,y],[27,y]],C.paper,1);}
 if(unwind>.05)for(let i=0;i<14;i++){const d=unwind*unwind,p=(i%2?1:-1);torn(p*d*(200+i*17),30+i*23-d*300,110,23,i%3?C.red:C.blue,55+i,p*d*.7);}
 grain(whiteGrain,.12);ctx.restore();
 // Staves propagate to the pen, crossing the score boundary with their momentum.
 for(let i=0;i<6;i++){const y=170+i*29;ctx.beginPath();ctx.moveTo(-20,y);ctx.bezierCurveTo(480,y+Math.sin(u*2+i)*60*a.body,900,y+unwind*450,1930,y+unwind*550);ctx.strokeStyle=i%2?C.blue:C.ink;ctx.lineWidth=2;ctx.stroke();}
 const p=win(t,32.63,.8);ctx.save();ctx.globalAlpha=p*(1-win(t,39.3,1));text('都带走吧',122,850,115,C.ink,'left',-.04);ctx.restore();
 ticket(420+unwind*520,453-unwind*320,.86,.25+unwind*2.3,t,a,0);
 for(let i=0;i<22;i++){const d=u-i*.2;if(d<0)continue;const prog=clamp(d/6);torn(mix(1090,170+rng(i)*1640,prog),mix(370,-120+rng(i+31)*760,prog),22+rng(i+2)*56,12,C.ink,i,d*.45);}
}
function blueprint(t,a){
 const u=t-40.1,draw=win(t,40.1,2.7),day=win(t,44.03,3.3);
 ctx.fillStyle=C.blue;ctx.fillRect(0,0,W,H);grain(whiteGrain,.4);
 ctx.save();ctx.globalAlpha=.2;for(let i=0;i<40;i++)line([[i*60,0],[i*60,H]],C.bone,1);for(let i=0;i<22;i++)line([[0,i*60],[W,i*60]],C.bone,1);ctx.restore();
 const x0=250,y0=670;ctx.save();ctx.beginPath();ctx.rect(x0-40,60,1450*draw+50,760);ctx.clip();
 for(let i=0;i<18;i++){
  const x=x0+i*75,h=65+rng(i+61)*230;line([[x,y0],[x,y0-h],[x+49,y0-h-30],[x+73,y0-h],[x+73,y0]],C.bone,2.5);line([[x,y0-h],[x+73,y0-h]],C.bone,1);for(let j=0;j<5;j++)line([[x+9,y0-h+17+j*28],[x+36,y0-h+17+j*28]],C.mint,1);
 }line([[190,685],[1700,685]],C.bone,4);
 ctx.beginPath();ctx.moveTo(250,735);ctx.bezierCurveTo(710,750,990,520,1640,670);ctx.strokeStyle=C.yellow;ctx.lineWidth=4;ctx.stroke();ctx.restore();
 // Signature pen lays down the same line, while the paper folds under it.
 const penx=x0+draw*1380,peny=670-Math.sin(draw*TAU)*72;
 ctx.save();ctx.translate(penx,peny);ctx.rotate(.65);polygon([[0,0],[-16,-37],[-12,-280],[14,-280],[17,-37]],C.ink);polygon([[0,0],[-16,-37],[17,-37]],C.yellow);line([[0,-55],[0,-260]],C.bone,2);ctx.restore();
 text('看不见的地方',172,143,77,C.bone);text('也能画出乌托邦',172,242,71,C.mint);
 if(day>0){
  const labels=['清醒','做梦','种朵花'];for(let i=0;i<3;i++){const arrival=win(t,44.03+i*.65,.8),x=450+i*500,y=480;ctx.save();ctx.globalAlpha=arrival;ctx.translate(x,y);const wheel=rotaryClock(0,0,t,i,arrival,a);text('8',0,2,102,C.bone,'center');text('小时',0,81,22,C.bone,'center');text(labels[i],0,195,32,i===2?C.mint:C.bone,'center');ctx.restore();}
  for(let i=0;i<7;i++){const born=win(t,46.2+i*.16,1.4);flower(1020+i*85,788-Math.sin(i*.7)*44,.4+born*.25,t,born,i,true);}
 }
 ticket(260+draw*70,760-day*43,.62,-.12,t,a,.4);
 if(u>6){const p=win(t,46.5,2);ctx.save();ctx.globalAlpha=p;line([[1550,653],[1690,480],[1900,380]],C.yellow,6);ellipse(1690,480,46,19,C.yellow);ctx.restore();}
}
function rotaryClock(x,y,t,id,arrival,a){ctx.save();ctx.translate(x,y);ellipse(0,0,134,134,null,C.bone,3);for(let i=0;i<24;i++){const ang=i/24*TAU;const len=i%8===0?27:11;line([[Math.cos(ang)*123,Math.sin(ang)*123],[Math.cos(ang)*(123-len),Math.sin(ang)*(123-len)]],i%8===0?C.yellow:C.bone,i%8===0?5:2);}arc(0,0,144,-Math.PI/2,-Math.PI/2+arrival*TAU*(.31+id*.02),id===2?C.mint:C.yellow,13);const ang=t*.5+id*TAU/3;line([[0,0],[Math.cos(ang)*96,Math.sin(ang)*96]],C.yellow,5);ellipse(0,0,5,5,C.red);ctx.restore();}
/* REVISION_SCENES */
function lyric(t,a,dark){
 const l=S.lyrics.find(q=>t>=q.start&&t<q.end);if(!l)return;
 const age=t-l.start,enter=ease(age/.14),out=ease((l.end-t)/.12),alpha=enter*out;
 ctx.save();ctx.globalAlpha=alpha;ctx.font=`900 31px ${font}`;const width=ctx.measureText(l.text).width;
 const y=1006,x=960,tone=dark?C.bone:C.ink;
 torn(x,y,width+68,66,dark?'#182831e8':'#eee7d4e8',981,-.003);
 text(l.text,x,y,31,tone,'center');line([[x-width/2,y+22],[x-width/2+width*clamp(age/(l.end-l.start)),y+22]],dark?C.mint:C.red,2);
 ctx.restore();
}
function stageName(t){
 if(t<5.13)return 'net';if(t<9)return 'lightbox';if(t<12.93)return 'map';if(t<16.9)return 'radio';
 if(t<32.63)return t>=26.65?'city-album':'city';if(t<40.1)return 'guitar';if(t<48.39)return 'blueprint';if(t<64.11)return 'street';
 if(t<79.23)return t>=73.85?'city-album-return':'city-return';if(t<83.78)return 'net-return';if(t<87.73)return 'lightbox-return';if(t<91.6)return 'map-return';if(t<95.18)return 'radio-return';
 if(t<98.58)return 'workshop';if(t<102.43)return 'sound-delivery';if(t<106.48)return 'bridge';return 'arrival';
}
function render(t){
 t=clamp(t,0,S.duration);const a=band(t),name=stageName(t);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.shadowColor='transparent';ctx.lineJoin='round';ctx.lineCap='butt';back(C.paper);
 // Mechanical contact, folds and graphic matches drive cuts and transitions.
 switch(name){
  case 'net': net(t,0,false,a);break;
  case 'lightbox': lightbox(t,5.13,false,a);break;
  case 'map': lostMap(t,9,false,a);break;
  case 'radio': broadcastIntro(t,12.93,false,a);break;
  case 'city': ringCity(t,16.9,false,a);break;
  case 'city-album': ringCity(t,16.9,false,a);albumV2(t,26.65,false,a);break;
  case 'guitar': guitar(t,a);for(let i=0;i<3;i++){const p=win(t,33.8+i*.28,4.4),x=mix(190+i*90,1080+i*120,p),y=mix(710+i*62,200+i*80,p);torn(x,y,164,49,C.bone,351+i,-.06+p*.15);text(['我的歌','我的理想','我的人生'][i],x,y,24,C.blue,'center',-.06+p*.15);}break;
  case 'blueprint': blueprint(t,a);break;
  case 'street': streetV2(t,a);break;
  case 'city-return': ringCity(t,64.11,true,a);break;
  case 'city-album-return': ringCity(t,64.11,true,a);albumV2(t,73.85,true,a);break;
  case 'net-return': net(t,79.23,true,a);break;
  case 'lightbox-return': lightbox(t,83.78,true,a);break;
  case 'map-return': lostMap(t,87.73,true,a);break;
  case 'radio-return': broadcastIntro(t,91.6,true,a);break;
  case 'workshop': workshop(t,a);break;
  case 'sound-delivery': soundDelivery(t,a);break;
  case 'bridge': bridgePassage(t,a);break;
  case 'arrival': arrival(t,a);break;
 }
 const dark=['street','blueprint','radio-return','sound-delivery','arrival'].includes(name);lyric(t,a,dark);
 if(t<3.5){ctx.save();ctx.globalAlpha=(1-win(t,2.7,.8))*.8;text('拼接乌托邦',72,60,26,C.ink);text('Ciyo · 见过夏天P · 乌托邦P',72,99,13,C.ink);ctx.restore();}
 ctx.save();ctx.strokeStyle=dark?'#eee7d420':'#18283120';ctx.lineWidth=1;ctx.strokeRect(26,26,1868,1028);ctx.restore();
 lastState={time:t,stage:name,lyric:S.lyrics.find(l=>t>=l.start&&t<l.end)?.text||null,bpm:S.bpm,bass:a.bass,revision:2};return lastState;
}
function init(el,w=1920,h=1080){canvas=el;canvas.width=w;canvas.height=h;ctx=canvas.getContext('2d',{alpha:false});paper=pattern('#182831',2200);inkGrain=paper;whiteGrain=pattern('#f8f2df',2400);render(0);}
window.UtopiaFilm={init,render,score:S,state:()=>lastState};
})();
