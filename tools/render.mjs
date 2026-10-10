import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
import {once} from 'node:events';
import {root,openCanvas,sharp,ffmpeg,ffprobe} from './runtime.mjs';
const out=path.join(root,'output'),work=path.join(root,'work');
const score=JSON.parse(fs.readFileSync(path.join(root,'assets/score.json'),'utf8'));
const width=1920,height=1080,fps=60,frames=Math.ceil(score.duration*fps),seconds=frames/fps;
const onlyFrames=process.argv.includes('--frames'),proof=process.argv.includes('--proof');
if(!onlyFrames&&!fs.existsSync(path.join(root,'assets/song.mp3')))throw Error('Full soundtrack export requires assets/song.mp3. See docs/TECHNICAL.md.');
const movie=path.join(proof?work:out,proof?'connected-proof.mp4':'拼接乌托邦-v2-1080p60.mp4');
const times=proof?[94.95,95.18,95.7,96.22,97,98.4,98.58,99.2,100.1,101.9,102.43,102.9,103.9,105.4,106.48,107.5,108.9,110.3,112.0,114.6]:[.8,2.2,4.2,5.5,6.7,8.3,9.5,10.8,12.4,13.5,15.8,18.3,22.8,25.5,27.2,28.8,30.8,34.8,36.7,39.2,41.9,44.6,47.3,49,50.9,52.8,54.7,56.8,60.4,63.5,66.3,70.7,74.8,78.2,80.6,84.5,86.8,88.5,90.8,92.6,94.7,95.8,97.3,99.3,101.4,102.7,104.4,105.7,106.8,108.3,109.7,111.1,112.8,114.6];
const {browser,page,errors}=await openCanvas(width,height);
try{
 const inputs=[],states=[];
 for(let i=0;i<times.length;i++){
  const info=await page.evaluate(t=>{const state=UtopiaFilm.render(t);return {state,b64:document.getElementById('film').toDataURL('image/png').split(',')[1]};},times[i]);
  const bytes=Buffer.from(info.b64,'base64');inputs.push(bytes);states.push(info.state);fs.writeFileSync(path.join(work,`${proof?'proof':'frame'}-${String(i).padStart(2,'0')}-${times[i].toFixed(2)}.png`),bytes);
 }
 const tw=480,th=270,cols=4,tiles=await Promise.all(inputs.map(input=>sharp(input).resize(tw,th).png().toBuffer()));
 await sharp({create:{width:tw*cols,height:Math.ceil(tiles.length/cols)*th,channels:3,background:'#182831'}}).composite(tiles.map((input,i)=>({input,left:i%cols*tw,top:Math.floor(i/cols)*th}))).png().toFile(path.join(out,proof?'关键动作序列.png':'全片画面总览.png'));
 fs.writeFileSync(path.join(work,proof?'proof-states.json':'states.json'),JSON.stringify(states,null,2));
 if(!proof)fs.writeFileSync(path.join(out,'封面.png'),inputs[50]);
 if(errors.length)throw Error(errors.join('\n'));console.log('Composition frames:',times.length);
 if(onlyFrames)process.exitCode=0;
 else {
  const startFrame=proof?Math.floor(94.9*fps):0,endFrame=proof?Math.ceil(111.6*fps):frames;
  const args=['-hide_banner','-loglevel','warning','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0',...(proof?['-ss',String(startFrame/fps)]:[]),'-i',path.join(root,'assets/song.mp3'),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','256k','-ar','48000','-frames:v',String(endFrame-startFrame),'-t',String((endFrame-startFrame)/fps),'-movflags','+faststart',movie];
  const proc=spawn(ffmpeg,args,{windowsHide:true,stdio:['pipe','ignore','pipe']});let logs='';proc.stderr.on('data',b=>logs+=b.toString());proc.stdin.on('error',()=>{});const done=once(proc,'close'),begin=Date.now(),batch=8;let lastLog=0;
  for(let start=startFrame;start<endFrame;start+=batch){
   const list=await page.evaluate(({start,batch,endFrame,fps})=>{const data=[];for(let f=start;f<Math.min(start+batch,endFrame);f++){UtopiaFilm.render(f/fps);data.push(document.getElementById('film').toDataURL('image/jpeg',.98).split(',')[1]);}return data;},{start,batch,endFrame,fps});
   for(const b64 of list)if(!proc.stdin.write(Buffer.from(b64,'base64')))await once(proc.stdin,'drain');
   if(Date.now()-lastLog>10000){console.log(`Rendered ${(start/fps).toFixed(1)} / ${(endFrame/fps).toFixed(1)}s; elapsed ${Math.round((Date.now()-begin)/1000)}s`);lastLog=Date.now();}
  }
  proc.stdin.end();const [code]=await done;if(code)throw Error(logs);
  const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',movie],{windowsHide:true,encoding:'utf8'}));
  fs.writeFileSync(path.join(work,proof?'proof-media.json':'media.json'),JSON.stringify({movie,width,height,fps,frames:endFrame-startFrame,seconds:(endFrame-startFrame)/fps,renderSeconds:(Date.now()-begin)/1000,errors,probe},null,2));
  console.log('Encoded:',movie);
 }
}finally{await browser.close();}
