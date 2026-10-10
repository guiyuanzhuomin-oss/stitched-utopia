(() => {
 const $=id=>document.getElementById(id);
 const canvas=$('film'),audio=$('song'),play=$('play'),seekBar=$('seek'),controls=$('controls'),cover=$('cover'),duration=UtopiaFilm.score.duration;
 let ready=false,position=0,started=performance.now(),paused=true,audioMode=audio.hasAttribute('src'),visibleUntil=0,blobURL;
 const fmt=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 const time=()=>Math.max(0,Math.min(duration,audioMode?audio.currentTime:position+(paused?0:(performance.now()-started)/1000)));
 function show(){visibleUntil=performance.now()+3000;controls.classList.remove('hidden');}
 function draw(){if(ready)UtopiaFilm.render(time());}
 function resize(){if(!ready)return;const w=Math.min(1920,Math.floor(innerWidth*Math.min(devicePixelRatio||1,1.5)));UtopiaFilm.init(canvas,w,Math.round(w*9/16));draw();}
 function pause(){position=time();paused=true;audio.pause();draw();show();}
 function seek(t){const next=Math.max(0,Math.min(duration,t));position=next;started=performance.now();if(audioMode)audio.currentTime=next;draw();show();}
 async function start(){if(time()>=duration-.025)seek(0);if(audioMode){try{await audio.play();paused=false;}catch{paused=true;$('status').textContent='配乐无法播放，请选择浏览器支持的同版音频。';}}else{position=time();started=performance.now();paused=false;}show();}
 async function toggle(){if(paused)await start();else pause();}
 function update(){
  const t=time();if(!paused&&t>=duration){position=duration;paused=true;audio.pause();}
  draw();seekBar.value=t;$('clock').textContent=fmt(t)+' / '+fmt(duration);play.textContent=t>=duration?'重播':paused?'播放':'暂停';
  $('mode').textContent=audioMode?'本地配乐':'静音演示';controls.classList.toggle('hidden',!paused&&performance.now()>visibleUntil);cover.classList.toggle('hidden',!paused||t>.1);requestAnimationFrame(update);
 }
 $('audio-file').addEventListener('change',event=>{
  const file=event.target.files[0];if(!file)return;pause();if(blobURL)URL.revokeObjectURL(blobURL);blobURL=URL.createObjectURL(file);audio.src=blobURL;audioMode=true;position=0;started=performance.now();audio.load();draw();$('status').textContent='已加载：'+file.name+'；播放时间以配乐为准。';show();
 });
 audio.addEventListener('ended',()=>{paused=true;show();});
 audio.addEventListener('loadedmetadata',draw);
 play.addEventListener('click',toggle);cover.addEventListener('click',toggle);canvas.addEventListener('click',toggle);
 seekBar.addEventListener('input',()=>seek(+seekBar.value));
 document.querySelectorAll('[data-time]').forEach(button=>button.addEventListener('click',()=>seek(+button.dataset.time)));
 $('full').addEventListener('click',()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen());
 addEventListener('pointermove',show);addEventListener('resize',resize);
 addEventListener('keydown',event=>{if(['INPUT','BUTTON'].includes(event.target.tagName))return;if(event.code==='Space'){event.preventDefault();toggle();}if(event.code==='ArrowRight'){event.preventDefault();seek(time()+5);}if(event.code==='ArrowLeft'){event.preventDefault();seek(time()-5);}if(event.key==='f')$('full').click();if(event.key==='m')audio.muted=!audio.muted;});
 document.fonts.ready.then(()=>{ready=true;seekBar.max=duration;resize();show();update();});
 window.UtopiaDemo={seek,pause,play:start,state:()=>({time:time(),paused,audioMode,audioTime:audio.currentTime,render:UtopiaFilm.state()})};
})();
