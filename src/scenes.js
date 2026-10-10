/* V2: lyric events, working mechanisms and a tangible receiving endpoint.
   Inserted inside film.js's closure by tools/runtime.mjs. Canvas 2D only. */
function back(color,dark=false){ctx.fillStyle=color;ctx.fillRect(0,0,W,H);grain(dark?whiteGrain:inkGrain,dark?.16:.4);}
function blueTicket(x,y,s,angle,t){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s,s);shadow(5,7);torn(0,0,168,115,C.blue,71);ctx.shadowColor='transparent';ctx.strokeStyle=C.bone;ctx.lineWidth=1.3;ctx.strokeRect(-73,-46,146,92);ellipse(-54,-28,8,8,C.paper);text('同行',10,-2,29,C.bone,'center');text('留给下一次相遇',0,34,9,C.bone,'center');ctx.restore();}
function gear(x,y,r,angle,color=C.ink,teeth=20,missing=false){ctx.save();ctx.translate(x,y);ctx.rotate(angle);const points=[];for(let i=0;i<teeth;i++)for(let j=0;j<4;j++){const a=(i+(j+.1)/4)/teeth*TAU,rad=missing&&i===0?r*.79:(j===1||j===2?r:r*.86);points.push([Math.cos(a)*rad,Math.sin(a)*rad]);}polygon(points,color);ellipse(0,0,r*.67,r*.67,C.paper);ellipse(0,0,r*.55,r*.55,color);ctx.fillStyle=C.paper;ctx.fillRect(-r*.11,-r*.18,r*.22,r*.36);ctx.save();ctx.rotate(-angle);for(let i=0;i<3;i++){const a=i/3*TAU;ellipse(Math.cos(a)*r*.37,Math.sin(a)*r*.37,r*.085,r*.085,C.paper);}ctx.restore();ctx.restore();}
function envelope(x,y,s,angle,t,opened=0,label='想念',tone=C.bone){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s,s);shadow(7,9);torn(0,0,232,148,tone,83);ctx.shadowColor='transparent';polygon([[-112,-70],[112,-70],[0,20-opened*132]],opened>.1?C.paper:'#d6cdbb');line([[-112,70],[0,-4],[112,70]],C.ink,1.8);line([[-112,-70],[0,20-opened*132],[112,-70]],C.ink,1.6);if(label)text(label,-22,29,30,C.ink,'center');ctx.fillStyle=C.red;ctx.fillRect(73,-58,27,33);halftone(76,-55,21,27,C.paper,5,1);ctx.restore();}
function radio(x,y,s,t,a,on=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);shadow(12,12);polygon([[-225,-125],[205,-125],[229,-106],[229,135],[-213,135],[-225,120]],C.ink);ctx.shadowColor='transparent';polygon([[205,-125],[229,-106],[229,135],[205,119]],'#0a1821');torn(-7,-1,408,213,C.yellow,31);ctx.fillStyle=C.ink;ctx.fillRect(-197,-84,191,170);halftone(-188,-77,174,154,C.paper,9,2);ctx.fillStyle=C.ink;ctx.fillRect(20,-83,160,51);text('FM  自由之声',100,-57,13,C.paper,'center');ctx.save();ctx.beginPath();ctx.rect(26,-82,148,50);ctx.clip();for(let i=0;i<10;i++)line([[31+i*15,-41],[31+i*15,-49-rng(i)*17]],C.paper,1);ctx.fillStyle=C.red;ctx.fillRect(33+fract(t*.025)*130,-78,3,40);ctx.restore();for(let i=0;i<2;i++){ellipse(56+i*100,21,28,28,C.ink);const r=rotate(0,-18,t*(i?.3:.45));line([[56+i*100,21],[56+i*100+r.x,21+r.y]],C.paper,3);}text(on?'正在为你歌唱':'等待接通',100,82,15,on?C.ink:C.rust,'center');line([[-158,-132],[-158,-170],[-59,-170],[-59,-132]],C.ink,9);line([[147,-128],[200,-291]],C.ink,5);ellipse(201,-295,7,7,C.red);if(on){const beat=(t-S.phase)/S.period;for(let i=0;i<3;i++){const age=fract(beat+i/3);arc(-102,1,43+age*40,-.85,.85,C.paper,2+2*a.air);}}ctx.restore();}
function bus(x,y,s,t,angle=0,door=0,gearWheels=false){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s,s);shadow(9,10);polygon([[-201,-100],[154,-100],[192,-62],[201,80],[-205,80],[-211,34]],C.yellow);ctx.shadowColor='transparent';polygon([[154,-100],[192,-62],[158,-62]],C.paper);ctx.fillStyle=C.ink;ctx.fillRect(-188,-82,326,80);polygon([[151,-77],[180,-52],[187,-9],[151,-9]],C.ink);for(let i=1;i<7;i++)line([[-189+i*45,-82],[-189+i*45,-3]],C.yellow,5);ctx.fillStyle=C.red;ctx.fillRect(-201,33,388,9);ctx.fillStyle=C.paper;ctx.fillRect(-184,53,177,10);text('环线  01',-111,16,15,C.ink,'center');ctx.fillStyle=C.ink;ctx.fillRect(96,8,44,62);ctx.fillStyle=C.yellow;ctx.fillRect(100+door*39,12,18*(1-door),53);ctx.fillRect(120,12,16*(1-door),53);ellipse(191,48,9,7,C.bone);for(const xx of [-135,119]){if(gearWheels)gear(xx,80,38,-t*1.8,C.ink,16);else{ellipse(xx,80,36,36,C.ink);ellipse(xx,80,16,16,C.paper);line([[xx-11,80],[xx+11,80]],C.ink,2);}}ctx.restore();}
function postBox(x,y,s,t,accept=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);polygon([[-65,-132],[49,-132],[68,-105],[68,90],[-65,90]],C.blue);polygon([[49,-132],[68,-105],[68,90],[49,82]],C.ink);ctx.fillStyle=C.ink;ctx.fillRect(-50,-78,83,11+accept*12);text('寄给明天',-7,-34,20,C.bone,'center');ctx.strokeStyle=C.bone;ctx.lineWidth=2;ctx.strokeRect(-44,1,70,62);line([[-47,91],[-47,126],[48,126],[48,91]],C.ink,6);ellipse(12,35,5,5,C.yellow);ctx.restore();}
function lightbox(t,start,returning,a){
 const u=t-start,glare=win(t,start,.6),burn=win(t,start+1.6,1.9),protect=returning?win(t,start+.5,1.7):0;
 back(C.paper);text('光',140,230,235,C.ink);text('亮',150,472,228,C.blue);
 ctx.save();ctx.translate(1280,305);ctx.rotate(-.2);shadow(12,17);torn(0,0,775,370,C.ink,37);ctx.shadowColor='transparent';ctx.fillStyle=C.bone;ctx.fillRect(-340,-135,670,244);for(let i=0;i<14;i++){ctx.fillStyle=i%2?C.yellow:C.paper;ctx.fillRect(-330+i*48,-125,32,224);}line([[-330,150],[-280,414],[274,414],[330,150]],C.ink,12);text('光亮 / 超量',-190,143,25,C.bone);ctx.restore();
 const px=830+Math.sin(u)*45,py=643;
 ctx.save();ctx.globalAlpha=.5*glare*(1-protect*.9);polygon([[958,180],[1628,320],[1090,890],[250,810]],C.yellow);ctx.restore();
 ticket(px,py,1.18,-.15,t,a,returning?.6:0);
 const scorch=[[-115,-65],[-101,-76],[-78,-63],[-83,-43],[-103,-24],[-94,-8],[-111,11],[-119,-10]];
 ctx.save();ctx.translate(px,py);ctx.rotate(-.15);ctx.scale(1.18,1.18);ctx.globalAlpha=burn;polygon(scorch,C.ink);for(let i=0;i<12;i++){const x=-115-rng(i)*42,y=-60+rng(i+16)*112;line([[x,y],[x-10-burn*20,y-15-rng(i+20)*38]],C.rust,2);}ctx.restore();
 for(let i=0;i<6;i++){const x=350+i*182,y=867;line([[x,y],[x,y-31]],C.ink,4);text(i%2?'亮':'灼',x,y+23,16,i%2?C.blue:C.red,'center');}
 if(returning){const x=mix(1930,1050,protect);ctx.save();ctx.translate(x,565);ctx.rotate(-.19);torn(0,0,445,344,C.blue,61);text('给光留一点余地',0,-9,31,C.bone,'center');line([[-188,45],[188,45]],C.mint,4);ctx.restore();envelope(640,744,.6,.13,t,0,'留下',C.mint);}
 else {ctx.save();ctx.globalAlpha=burn*.22;ellipse(px+120,py-23,200,130,C.bone);ctx.restore();}
}
function lostMap(t,start,returning,a){
 const u=t-start,solve=returning?win(t,start+.2,3.1):win(t,start+2,.9);back(C.paper);
 ctx.save();ctx.translate(950,493);ctx.rotate(-.045);shadow(14,20);torn(0,0,1560,610,C.bone,87);ctx.shadowColor='transparent';
 for(let i=0;i<9;i++){const x=-740+i*178;line([[x,-285],[x,280]],C.faint,2);}for(let j=0;j<4;j++)line([[-735,-252+j*168],[735,-252+j*168]],C.faint,2);
 const branches=[[-630,130],[-410,80],[-340,-137],[-142,-160],[-60,71],[90,99],[151,-109],[342,-72],[510,161],[720,123]];
 line(branches,C.blue,13);line(branches,C.bone,3);
 for(let i=1;i<9;i++){const [x,y]=branches[i];ellipse(x,y,19,19,C.yellow);line([[x,y],[x+(i%2?110:-130),y+(i%2?100:-114)]],C.ink,5);text(i%2?'明天':'昨天',x+(i%2?110:-130),y+(i%2?122:-135),17,C.ink,'center');}
 const route=clamp((u*.7)%1),index=Math.floor(route*8),r=fract(route*8),bp=branches[index],bq=branches[index+1];
 const pos=returning?{x:mix(-530,490,solve),y:mix(125,-74,solve)}:{x:mix(bp[0],bq[0],r),y:mix(bp[1],bq[1],r)};
 if(returning){const pts=[[-550,124],[-330,100],[-190,-100],[180,-88],[490,-74]];ctx.save();ctx.beginPath();ctx.rect(-740,-300,1480*solve,600);ctx.clip();line(pts,C.red,9);ctx.restore();}
 ticket(pos.x,pos.y,.55,Math.sin(u)*.18,t,a,returning?.7:0);
 ctx.restore();text('迷茫',163,153,100,C.ink);text(returning?'还有一条路能通向歌声':'路口很多，出口在哪里',171,850,29,C.blue);
 // A sharp loose paper corner is folded away instead of becoming a weapon image.
 const fold=win(t,start+1.9,.8);ctx.save();ctx.translate(1530,823);ctx.rotate(-.2);torn(0,0,280,95,C.ink,72);polygon([[-91,-42],[mix(40,-42,fold),mix(-205,-32,fold)],[72,-42]],C.red);text('收起尖角',0,6,20,C.bone,'center');ctx.restore();
 if(u>2.5){const p=win(t,start+2.5,.7);for(let i=0;i<4;i++){const y=700+i*16;line([[mix(720,1570,p),y],[1930,y-70]],C.blue,2);}}
}
function broadcastIntro(t,start,returning,a){
 const u=t-start,travel=win(t,start+.35,3);back(returning?C.ink:C.paper,returning);
 const tone=returning?C.bone:C.ink;
 for(let i=0;i<14;i++){const x=80+i*142,h=70+rng(i+331)*170;ctx.fillStyle=i%3===0?C.blue:tone;ctx.globalAlpha=returning?.38:.2;ctx.fillRect(x,803-h,92,h);ctx.globalAlpha=1;for(let j=0;j<4;j++){ctx.fillStyle=C.yellow;ctx.fillRect(x+15+(j%2)*38,803-h+24+Math.floor(j/2)*42,9,13);}}
 line([[0,805],[1920,805]],tone,4);radio(489,600,1.18,t,a,1);
 text('为你',1215,244,107,returning?C.mint:C.blue,'center');text('歌唱',1220,388,148,returning?C.paper:C.red,'center');
 const stripX=mix(796,1550,travel),stripY=648-Math.sin(travel*Math.PI)*145;
 ticket(stripX,stripY,.93,-.15+travel*.25,t,a,returning?.7:0);
 for(let i=0;i<7;i++){const p=fract(u*.43+i/7),x=mix(698,1870,p),y=500+Math.sin(p*TAU+i*.32)*74;ctx.save();ctx.globalAlpha=clamp(Math.sin(p*Math.PI));line([[x-80,y],[x-24,y-29],[x+12,y+18],[x+78,y]],returning?C.mint:C.blue,3+a.on);ctx.restore();}
 if(returning){gear(1520,768,115,0,C.paper,22,true);torn(1720,806,220,49,C.yellow,61);text('还差一个接点',1720,806,22,C.ink,'center');}
 else {const p=win(t,start+2.1,1.75);ctx.save();ctx.translate(1460,510);ctx.scale(p,p);ellipse(0,0,189,189,null,C.ink,22);ellipse(0,0,170,170,null,C.yellow,3);ctx.restore();}
}
function recollection(x,y,s,t,fade=0,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s,s);shadow(9,11);torn(0,0,568,399,C.paper,315);ctx.shadowColor='transparent';ctx.save();ctx.beginPath();ctx.rect(-255,-175,510,293);ctx.clip();ctx.fillStyle=C.blue;ctx.fillRect(-255,-175,510,293);ellipse(179,-109,34,34,C.yellow);line([[-270,80],[270,80]],C.bone,4);ctx.fillStyle=C.ink;ctx.fillRect(-245,-28,170,107);ctx.fillRect(102,-63,176,144);for(let i=0;i<6;i++){ctx.fillStyle=C.yellow;ctx.fillRect(-231+i*24,-12,8,13);}ticket(-99,35,.62,.11,t,band(t),.5);
 if(fade<1){ctx.save();ctx.globalAlpha=1-fade;blueTicket(99,33,.68,-.12,t);ctx.restore();}if(fade>0){ctx.save();ctx.globalAlpha=fade;torn(100,30,135,87,C.paper,171,-.13);line([[60,3],[139,59]],C.faint,2);ctx.restore();}
 ctx.restore();text(fade>.8?'回头，只留下空缺':'那时候，我们都在',0,163,24,C.ink,'center');ctx.restore();}
function albumV2(t,start,returning,a){
 const u=t-start,open=win(t,start,.5),turn=fract((u+.1)/1.95),page=turn<.48?1:Math.max(.03,Math.abs(Math.cos((turn-.48)/.52*Math.PI)));
 ctx.save();ctx.translate(1030,475);ctx.rotate(-.05);ctx.scale(open*.94,open*.94);
 shadow(10,18);torn(0,0,618,445,C.red,101);ctx.shadowColor='transparent';
 recollection(0,0,.94,t,returning?win(t,start+2.4,1.7):0,0);
 if(turn>.48){ctx.save();ctx.translate(-272,-8);ctx.scale(page,1);torn(272,0,555,403,C.bone,141);recollection(276,0,.93,t,returning?1:0,0);ctx.restore();}
 ctx.restore();
 if(u>1.5){const blossoms=win(t,start+1.5,2.2)*(1-win(t,start+4.3,.9));for(let i=0;i<8;i++){const aa=i/8*TAU,rr=blossoms*325;flower(1020+Math.cos(aa)*rr,520+Math.sin(aa)*rr*.66,.34+blossoms*.15,t,blossoms,i,false);}}
}
function cornerShop(x,y,s,id,t,warm=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=id%2?C.blue:'#29424a';ctx.fillRect(-120,-194,240,190);polygon([[-128,-135],[128,-135],[143,-96],[-144,-96]],id%2?C.red:C.yellow);for(let i=0;i<9;i++){ctx.fillStyle=i%2?C.bone:C.ink;ctx.globalAlpha=.38;ctx.fillRect(-133+i*31,-129,18,25);}ctx.globalAlpha=1;ctx.fillStyle=C.ink;ctx.fillRect(-100,-87,127,83);ctx.fillRect(48,-83,51,83);for(let i=0;i<4;i++){ctx.fillStyle=warm>.1?C.yellow:C.faint;ctx.fillRect(-86+i*28,-67,18,47);}torn(0,-166,181,29,C.paper,124+id);text(['唱片店','明天见','零件铺','夜邮局'][id%4],0,-165,22,C.ink,'center');line([[-121,0],[123,0]],C.paper,3);ctx.restore();}
function nightStreet(t,a,u,lit=0){
 const vx=960+Math.sin(u*.13)*125,vy=372,speed=u*1.05;
 back(C.ink,true);ellipse(vx,190,79,79,C.paper);halftone(vx-90,101,180,180,C.ink,10,2.6);
 polygon([[vx-33,vy],[vx+33,vy],[1710,H],[270,H]],'#263b42');
 line([[vx-36,vy],[266,H]],C.yellow,2);line([[vx+36,vy],[1718,H]],C.yellow,2);
 const projected=[];for(let i=0;i<19;i++){const z=1+fract(i/19-speed*.024)*24,k=1.4/z;projected.push({z,k,i});}projected.sort((p,q)=>q.z-p.z);
 for(const {z,k,i} of projected){const ground=vy+470*k;
  for(const side of [-1,1]){
   const xx=vx+side*(90+650*k),width=200*k,h=420*k*(.65+rng(i+side+30)*.6);
   ctx.fillStyle=(i+side)%3===0?'#244246':'#132029';ctx.fillRect(side<0?xx-width:xx,ground-h,width,h);
   if(k>.14){for(let row=0;row<6;row++)for(let col=0;col<3;col++)if(rng(i*30+row*3+col+11)>.51){ctx.fillStyle=(lit>i/22||rng(i+col+row)>.65)?C.yellow:'#667f7d';ctx.fillRect(xx+side*(13+col*44)*k,ground-h+row*55*k+14*k,12*k,19*k);}}
   if(k>.15&&i%3===0)cornerShop(xx,ground,.9*k,i+(side===1?2:0),t,lit);
   const polex=vx+side*(45+340*k),height=240*k;line([[polex,ground],[polex,ground-height],[polex-side*72*k,ground-height-17*k]],C.paper,Math.max(1,5*k));
   const lx=polex-side*70*k,ly=ground-height-16*k;ellipse(lx,ly,23*k,8*k,C.yellow);
   if(k>.1){ctx.save();ctx.globalAlpha=(.08+a.air*.07+lit*.05)*clamp(k);polygon([[lx-16*k,ly],[lx+16*k,ly],[lx+140*k,ground],[lx-140*k,ground]],C.yellow);ctx.restore();}
   if(i%5===0&&k>.18){ctx.save();ctx.translate(vx+side*(120+405*k),ground);ctx.scale(k,k);line([[-80,-35],[80,-35]],C.paper,10);line([[-76,-70],[76,-70]],C.paper,7);line([[-59,-33],[-59,3],[59,3],[59,-33]],C.paper,4);ctx.restore();}
  }
  if(i%3===0){for(let j=-2;j<=2;j++){ctx.fillStyle='#d6ccbbaa';ctx.fillRect(vx+j*43*k-14*k,ground,28*k,5*k);}}
  line([[vx-5*k,ground],[vx+5*k,ground]],C.paper,Math.max(2,15*k));
 }
 // Foreground fixtures keep the town legible while the camera advances.
 postBox(267,808,.92,t);cornerShop(1640,785,1.03,2,t,lit);
 line([[77,634],[77,848],[384,848],[384,634]],C.paper,7);line([[65,630],[400,630]],C.yellow,12);text('终点',236,668,21,C.paper,'center');line([[136,760],[325,760]],C.paper,8);
 ctx.save();ctx.globalAlpha=.45;ctx.beginPath();ctx.moveTo(0,299);ctx.bezierCurveTo(330,351,479,320,vx,vy-65);ctx.bezierCurveTo(1460,327,1790,316,1920,305);ctx.strokeStyle=C.paper;ctx.lineWidth=2;ctx.stroke();ctx.restore();
 for(let i=0;i<12;i++){const p=fract(u*.17+i/12),x=mix(-120,2000,p),y=570+Math.sin(p*TAU+i)*74;ctx.save();ctx.globalAlpha=.5;line([[x-84,y],[x,y-11],[x+57,y]],C.mint,1.7);ctx.restore();}
 return {vx,vy};
}
function streetV2(t,a){
 const u=t-48.39;nightStreet(t,a,u,0);
 const wind=win(t,48.39,1.7);for(let i=0;i<5;i++){const p=fract(u*.105+i*.2),x=mix(1300,-220,p),y=mix(660,340,p)+Math.sin(p*TAU)*80;envelope(x,y,.28+.22*p,-p*.8,t,.2,'',i%2?C.bone:C.mint);}
 const letter=win(t,50.3,.9)*(1-win(t,53.2,1.1));if(letter>0){ctx.save();ctx.translate(1190,611);ctx.scale(letter,letter);envelope(0,0,1.25,-.08,t,win(t,51.2,.8),'想念');ctx.restore();}
 const memory=win(t,52.32,.75)*(1-win(t,57.5,1.1));if(memory>0){ctx.save();ctx.globalAlpha=memory;recollection(1260,481,.95,t,win(t,54.3,.9),-.06);ctx.restore();}
 if(t>56.28&&t<60.7){const p=win(t,56.28,.7)*(1-win(t,60.0,.7));ctx.save();ctx.globalAlpha=p;for(let i=0;i<3;i++){const y=286+i*91;torn(476,y,220,73,C.bone,331+i,-.025);text(['昨天','今天','还是从前'][i],476,y,28,C.ink,'center');line([[606,y],[720,y+16]],C.red,3);}ctx.restore();}
 const scar=win(t,60.15,.8);if(scar>0){ctx.save();ctx.globalAlpha=scar*.26;polygon([[1275,219],[1306,219],[1480,870],[769,870]],C.yellow);ctx.restore();recollection(1240,618,.55,t,1,-.15);}
 ticket(951+Math.sin(u*.8)*59,720+Math.sin(u*.6)*22,.86,Math.sin(u)*.1,t,a,.6);
 if(u>12){const p=win(t,60.1,4.4);ctx.save();ctx.translate(960,580);ctx.scale(p,p*.63);ellipse(0,0,420,420,null,C.paper,36);ellipse(0,0,389,389,null,C.yellow,4);ctx.restore();}
}
function workshop(t,a){
 const u=t-95.18,seat=win(t,95.45,.76),drive=win(t,96.22,.5),turn=Math.max(0,t-96.22)*1.7;
 back(C.paper);
 ctx.save();ctx.globalAlpha=.1;text('备用件',116,246,180,C.ink);ctx.restore();
 // Pegboard, tools and trays belong to the workbench rather than floating detail.
 torn(1360,370,830,600,'#d9cfb9',218);for(let i=0;i<12;i++)for(let j=0;j<7;j++)ellipse(993+i*63,106+j*58,2.8,2.8,C.ink);
 for(let i=0;i<4;i++){const x=1130+i*173;line([[x,133],[x,248]],C.ink,13);if(i%2){line([[x-25,138],[x,168],[x+25,138]],C.ink,14);}else{ellipse(x,147,19,26,null,C.ink,11);}line([[x,257],[x+6,273]],C.red,5);}
 line([[68,871],[1865,871]],C.ink,19);line([[181,878],[155,1080],[281,878]],C.ink,17);line([[1625,878],[1710,1080],[1745,878]],C.ink,17);
 ctx.fillStyle=C.blue;ctx.fillRect(49,806,1830,61);for(let i=0;i<23;i++){const x=69+i*81;ellipse(x,836,22,22,C.ink);line([[x-14,836],[x+14,836]],C.paper,2);}
 // The ticket enters the missing tooth; rotation starts only after contact.
 gear(462,541,236,turn,C.ink,32);gear(809,561,119,-turn*1.98,C.blue,20,seat<1);gear(1026,640,118,turn*2,C.red,20);
 line([[267,755],[573,755]],C.ink,9);line([[641,731],[930,731]],C.ink,9);line([[1015,765],[1112,765]],C.ink,9);
 const keyAngle=-turn*1.98,tx=mix(1210,809+Math.cos(keyAngle)*114,seat),ty=mix(415,561+Math.sin(keyAngle)*114,seat),ts=mix(1,.22,seat);ticket(tx,ty,ts,mix(-.14,keyAngle,seat),t,a,.8);
 if(seat>.95){ctx.save();ctx.translate(809,561);ctx.rotate(-turn*1.98);polygon([[91,-26],[127,-18],[127,18],[91,26]],C.red);ctx.restore();}
 // A press prints the refrain on a strip which will feed the next mechanism.
 const punch=Math.exp(-Math.max(0,u)*9)+hit(t)*.25;
 line([[1345,309],[1345,557]],C.ink,18);torn(1345,329,336,99,C.blue,121);text('活下去',1345,330,58,C.bone,'center');
 torn(1345,586+26*punch,385,63,C.ink,148);line([[1163,670],[1527,670]],C.ink,17);torn(1345,647,312,63,C.bone,231);text(u>.35?'活下去':'',1345,645,46,C.red,'center');
 ctx.save();ctx.globalAlpha=drive;line([[1080,650],[1177,650]],C.yellow,12);ctx.restore();
 torn(1528,761,395,71,C.bone,18,-.03);text('没用的零件',1528,760,39,C.ink,'center');
 if(drive>0){line([[1330,790],[1735,717]],C.red,7*drive);text('正在工作',1688,687,31,C.blue,'center',-.1);}
 for(let i=0;i<8;i++){const x=116+i*163;ctx.fillStyle=i%2?C.red:C.ink;ctx.fillRect(x,919,100,35);text(['旧齿轮','票根','断轨','螺帽'][i%4],x+50,936,15,C.bone,'center');}
 if(drive>.05){for(let i=0;i<4;i++){const p=fract(turn*.42+i/4);torn(1200+p*600,645,82,33,i%2?C.bone:C.mint,22+i);text(i%2?'下去':'活',1200+p*600,645,17,C.ink,'center');}}
}
function soundDelivery(t,a){
 const u=t-98.58,send=win(t,99.55,2.14),ink=win(t,98.58,.5);
 back(C.blue,true);
 // Urban receiver locations and overhead cables have spatial destinations.
 for(let i=0;i<18;i++){const x=10+i*117,h=80+rng(i+931)*200;ctx.fillStyle=i%3?C.ink:'#1a3a78';ctx.fillRect(x,890-h,88,h);for(let j=0;j<4;j++){ctx.fillStyle=u>i*.12?C.yellow:C.paper;ctx.fillRect(x+12+(j%2)*34,910-h+Math.floor(j/2)*47,10,17);}}
 line([[0,887],[1920,887]],C.bone,3);
 radio(487,638,1.23,t,a,1);gear(836,811,99,u*1.8,C.yellow,24);
 ctx.beginPath();ctx.moveTo(646,323);ctx.bezierCurveTo(930,452,1200,132,1640,345);ctx.strokeStyle=C.mint;ctx.lineWidth=5;ctx.stroke();
 for(let i=0;i<9;i++){const x=734+i*116,y=350-Math.sin(i*.36)*50;ctx.fillStyle=C.paper;ctx.fillRect(x,297,3,65);ellipse(x,y,11,11,u>i*.17?C.yellow:C.ink);}
 // Paper tape physically leaves the radio and becomes the message route.
 const tapeY=638;torn(1212,tapeY,820,97,C.bone,213,-.035);line([[801,684],[1634,656]],C.red,3);
 ctx.save();ctx.beginPath();ctx.rect(820,580,815,130);ctx.clip();const run=fract(u*.48)*258;for(let i=-1;i<4;i++)text('活下去',902+i*258+run,tapeY-i*9,53,C.red,'center',-.035);ctx.restore();
 postBox(1660,638,1.24,t,send);
 const ex=mix(900,1641,send),ey=mix(470,540,send)-Math.sin(send*Math.PI)*181;
 if(send<.995){ctx.save();ctx.translate(ex,ey);ctx.scale(1,1-win(t,101.34,.35)*.66);envelope(0,0,.76*(1-send*.55),mix(-.17,0,send),t,0,'歌声',C.mint);ctx.restore();ticket(ex-13,ey-95,.31,.12,t,a,1);}
 else {text('收到',1650,873,35,C.mint,'center');ellipse(1691,563,9,9,C.yellow);}
 text('把歌声送出去',1103,141,83,C.bone,'center');text('总有一个地方，会接得住',1105,239,28,C.mint,'center');
 // Far from a universal pulse: the treble drives the ink marks along the route.
 for(let i=0;i<8;i++){const p=fract(u*.32+i/8),xx=730+p*904,yy=328-Math.sin(p*Math.PI)*60;line([[xx-10,yy-13],[xx,yy+12],[xx+10,yy-13]],C.yellow,1.5+a.air*1.4);}
}
function bridgePassage(t,a){
 const u=t-102.43,lay=win(t,102.43,1.2),cross=win(t,103.53,2.55);back(C.paper);
 // The ruined ring has been opened into a usable, supported line.
 ctx.save();ctx.translate(1548,260);ctx.scale(.35,.35);ellipse(0,0,350,350,C.ink);ellipse(0,0,295,295,null,C.yellow,9);skyline(t,360,.28,true,a);ctx.restore();
 for(let i=0;i<15;i++){const x=65+i*126,h=56+rng(i+191)*170;ctx.fillStyle=i%4===0?C.blue:C.ink;ctx.fillRect(x,487-h,87,h);for(let j=0;j<5;j++){ctx.fillStyle=C.paper;ctx.fillRect(x+12+j%2*35,487-h+18+Math.floor(j/2)*32,11,11);}}
 ctx.fillStyle='#92bdb4';ctx.fillRect(0,743,1920,337);for(let i=0;i<17;i++){const yy=776+i*16;for(let j=0;j<9;j++){const xx=j*247+Math.sin(u*.8+i*.3)*32;line([[xx,yy],[xx+117,yy-5],[xx+161,yy]],'#557977',1.5);}}
 const left=75,base=611;
 for(let i=0;i<10;i++){
  const f=i<2?1:win(t,102.43+(i-2)*.095,.42),xx=left+i*182,yy=mix(1020,base+22,f);
  ctx.save();ctx.translate(xx+84,yy);ctx.rotate((1-f)*(i%2?.7:-.6));torn(0,0,184,45,i%4===0?C.red:C.ink,61+i);
  line([[-83,-3],[82,-3]],C.yellow,3);polygon([[-42,25],[-22,249],[21,249],[39,25]],C.blue);line([[-42,36],[39,187],[-37,232]],C.paper,3);ctx.restore();
 }
 const bx=mix(78,1580,cross),by=511-Math.sin(cross*Math.PI)*7;bus(bx,by,.85,t,0,0,true);ticket(bx+96,by-18,.28,.08,t,a,1);
 for(let i=0;i<8;i++){const xx=220+i*210;line([[xx,583],[xx,539]],C.ink,3);ellipse(xx,533,5,5,C.red);}
 if(u<1.4){for(let i=0;i<6;i++){const p=win(t,102.43+i*.07,1.2);gear(230+i*260,mix(869,625,p),28, t*.7,C.yellow,12);}}
 text('下一班',132,167,96,C.ink);text('从这块零件开始',137,257,46,C.blue);
 // Counter-vocal is written on a scrap; it is left behind by the moving bus.
 const scrap=win(t,104.93,.35);if(scrap>0){torn(592,775,431,83,C.bone,441,-.06);text('我想活成没用的零件',592,775,29,C.ink,'center',-.06);line([[398,799],[780,744]],C.red,4);}
}
function arrival(t,a){
 const u=t-106.48,arrive=win(t,106.48,1.9),heard=win(t,108.81,1.6),leave=win(t,109.37,1.25);
 nightStreet(t,a,2.4+u*.12,heard);
 const bx=mix(2220,1195,arrive),by=722;bus(bx,by,1.17,t,0,leave,false);
 const tx=mix(bx+117,546,leave),ty=mix(by-9,740,leave);ticket(tx,ty,.53,Math.sin(u*.3)*.05,t,a,1);
 if(heard>0){blueTicket(mix(278,664,heard),mix(715,742,heard),.62,-.09,t);radio(885,862,.34,t,a,1);}
 // The original streetlamp now illuminates a concrete reunion at a bus stop.
 line([[582,855],[582,474],[473,453]],C.bone,8);ellipse(471,453,29,11,C.yellow);
 ctx.save();ctx.globalAlpha=.09+heard*.16;polygon([[447,453],[494,453],[812,862],[217,862]],C.yellow);ctx.restore();
 torn(228,641,355,53,C.bone,335);text(arrive>.94?'下一班：到站':'下一班：正在驶来',228,641,25,C.ink,'center');
 if(heard>.2){text('我听得见',391,386,50,C.mint,'center');flower(352,785,.43,t,heard,3,false);}
 if(t>=112.53){const p=win(t,112.53,.5);ctx.save();ctx.translate(1512,186);ctx.scale(p,p);shadow(8,13);torn(0,0,591,182,C.paper,173,-.035);ctx.shadowColor='transparent';text('拼接乌托邦',0,-19,64,C.ink,'center',-.035);text('在这反乌托邦里，也能听见你。',0,50,20,C.blue,'center',-.035);line([[-220,94],[-220,213],[218,213],[218,94]],C.paper,5);ctx.restore();}
}
