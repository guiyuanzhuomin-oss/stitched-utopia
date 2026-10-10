import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {root,ffmpeg} from './runtime.mjs';
const args=process.argv.slice(2),arg=key=>args[args.indexOf(key)+1];
if(!args.length){console.log('Audio preparation is optional. Use: npm run prepare -- --audio "song.mp3" --lyrics "song.lrc"');process.exit(0);}
const song=args.includes('--audio')?arg('--audio'):null,lrc=args.includes('--lyrics')?arg('--lyrics'):path.join(root,'assets/original.lrc');
if(!song||!fs.existsSync(song)||!fs.existsSync(lrc))throw Error('Provide existing --audio and --lyrics files.');
execFileSync(ffmpeg,['-v','error','-y','-i',song,'-map','0:a:0','-c:a','libmp3lame','-q:a','0',path.join(root,'assets/song.mp3')],{windowsHide:true});
const text=fs.readFileSync(lrc,'utf8');fs.writeFileSync(path.join(root,'assets/original.lrc'),text);
const lyrics=text.split(/\r?\n/).flatMap(line=>{const m=line.match(/^\[(\d+):(\d+\.\d+)\](.+)$/);return m?[{start:+m[1]*60 + +m[2],text:m[3]}]:[];});
const repairs=[];for(let i=1;i<lyrics.length-1;i++)if(lyrics[i].start<=lyrics[i-1].start){const original=lyrics[i].start;lyrics[i].start=+((lyrics[i-1].start+lyrics[i+1].start)/2).toFixed(3);repairs.push({line:i,text:lyrics[i].text,original,corrected:lyrics[i].start,basis:'Midpoint of adjacent supplied line timestamps; provisional, not word alignment.'});}
fs.writeFileSync(path.join(root,'work/source.json'),JSON.stringify({lyrics,repairs},null,2));
console.log(JSON.stringify({audio:'assets/song.mp3',lyrics:lyrics.length,repairs}));
