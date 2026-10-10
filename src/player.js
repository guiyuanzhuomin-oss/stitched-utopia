(() => {
 const canvas=document.getElementById('film'),audio=document.getElementById('song'),play=document.getElementById('play'),seek=document.getElementById('seek'),clock=document.getElementById('clock'),controls=document.getElementById('controls'),cover=document.getElementById('cover');
 const fmt=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 let visibleUntil=0,ready=false;
 function show(){visibleUntil=performance.now()+2500;controls.classList.remove('hidden');}
 function resize(){if(!ready)return;const s=Math.min(devicePixelRatio||1,1.5),w=Math.min(1920,Math.floor(innerWidth*s));UtopiaFilm.init(canvas,w,Math.round(w*9/16));UtopiaFilm.render(audio.currentTime);}
 function update(){if(ready){UtopiaFilm.render(audio.currentTime);seek.value=audio.currentTime;clock.textContent=fmt(audio.currentTime)+' / '+fmt(UtopiaFilm.score.duration);}play.textContent=audio.ended?'重播':audio.paused?'播放':'暂停';controls.classList.toggle('hidden',!audio.paused&&performance.now()>visibleUntil);cover.classList.toggle('hidden',audio.currentTime>.1||!audio.paused);requestAnimationFrame(update);}
 async function toggle(){show();if(audio.paused){if(audio.ended)audio.currentTime=0;try{await audio.play();}catch(e){clock.textContent='点击播放以启用音频';}}else audio.pause();}
 play.addEventListener('click',toggle);cover.addEventListener('click',toggle);canvas.addEventListener('click',toggle);
 seek.addEventListener('input',()=>{audio.currentTime=+seek.value;show();});
 document.getElementById('full').addEventListener('click',()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen());
 addEventListener('pointermove',show);addEventListener('resize',resize);
 addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();toggle();}if(e.code==='ArrowRight'){e.preventDefault();audio.currentTime=Math.min(UtopiaFilm.score.duration,audio.currentTime+5);show();}if(e.code==='ArrowLeft'){e.preventDefault();audio.currentTime=Math.max(0,audio.currentTime-5);show();}if(e.key==='f')document.getElementById('full').click();if(e.key==='m')audio.muted=!audio.muted;});
 document.fonts.load('900 80px Utopia').then(()=>{seek.max=UtopiaFilm.score.duration;ready=true;resize();show();update();});
 window.UtopiaPlayer={audio,canvas,state:()=>({time:audio.currentTime,paused:audio.paused,duration:audio.duration,muted:audio.muted,render:UtopiaFilm.state()})};
})();
