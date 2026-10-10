import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {root,chromium,chrome} from './runtime.mjs';
if(!chrome)throw Error('Install Chrome or run: npx playwright-core install chromium');
const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-gpu']});
const report={evidence:'Public silent/local-audio player functional checks. This does not establish perceptual music review or word alignment.',errors:[],seek:[],reproducibility:[]};
try{
 const page=await browser.newPage({viewport:{width:1280,height:720}});page.on('pageerror',error=>report.errors.push(error.message));
 await page.goto(pathToFileURL(path.join(root,'index.html')).href);await page.waitForFunction(()=>!!window.UtopiaDemo&&!!UtopiaFilm.state());
 await page.click('#cover');await page.waitForTimeout(300);report.play=await page.evaluate(()=>UtopiaDemo.state());if(report.play.paused||report.play.time<.1)throw Error('Silent playback did not advance');
 await page.evaluate(()=>UtopiaDemo.pause());const before=await page.evaluate(()=>UtopiaDemo.state().time);await page.waitForTimeout(160);const after=await page.evaluate(()=>UtopiaDemo.state().time);if(Math.abs(after-before)>.02)throw Error('Pause time changed');
 for(const [t,stage] of [[18.8,'city'],[45.2,'blueprint'],[55.7,'street'],[96.9,'workshop'],[101.8,'sound-delivery'],[104.7,'bridge'],[110.5,'arrival']]){
  const state=await page.evaluate(t=>{UtopiaDemo.seek(t);return UtopiaDemo.state();},t);if(state.render.stage!==stage||Math.abs(state.render.time-t)>.01)throw Error('Seeking stage mismatch');report.seek.push(state);
 }
 for(const t of [7.2,96.9,110.5]){
  const capture=async()=>page.evaluate(t=>{UtopiaDemo.seek(t);return document.getElementById('film').toDataURL();},t);
  const a=await capture();await page.evaluate(()=>UtopiaDemo.seek(33));const b=await capture();if(a!==b)throw Error('Rendering depends on previous seek');report.reproducibility.push({time:t,sha256:crypto.createHash('sha256').update(a).digest('hex')});
 }
 // A short silent PCM fixture verifies media-clock authority without redistributing a song.
 const rate=22050,samples=rate*2,wav=Buffer.alloc(44+samples*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
 await page.setInputFiles('#audio-file',{name:'clock-fixture.wav',mimeType:'audio/wav',buffer:wav});await page.waitForFunction(()=>document.getElementById('song').readyState>=2);await page.evaluate(()=>UtopiaDemo.seek(.5));await page.click('#play');await page.waitForTimeout(200);report.localAudio=await page.evaluate(()=>UtopiaDemo.state());
 if(!report.localAudio.audioMode||report.localAudio.paused||report.localAudio.audioTime<.6||Math.abs(report.localAudio.time-report.localAudio.audioTime)>.001||Math.abs(report.localAudio.render.time-report.localAudio.audioTime)>.1)throw Error('Local audio clock check failed');
 await page.evaluate(()=>UtopiaDemo.pause());await page.screenshot({path:path.join(root,'work/public-player-check.png')});
 if(report.errors.length)throw Error(report.errors.join('\n'));
}finally{await browser.close();}
fs.writeFileSync(path.join(root,'docs/evidence/public-player-validation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({silentPlayback:'pass',pause:'pass',seek:'pass',localAudioClock:'pass',deterministicSeeking:'pass',errors:report.errors.length}));
