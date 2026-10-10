import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const require=createRequire(process.env.CUA_MODULES?path.join(process.env.CUA_MODULES,'_utopia_loader.cjs'):path.join(root,'package.json'));
export const {chromium}=require('playwright-core');
export const sharp=require('sharp');
const browserCandidates=[
 process.env.CHROME_PATH,
 ...(process.platform==='win32'?[
  path.join(process.env.PROGRAMFILES||'C:/Program Files','Google/Chrome/Application/chrome.exe'),
  path.join(process.env['PROGRAMFILES(X86)']||'C:/Program Files (x86)','Google/Chrome/Application/chrome.exe'),
  process.env.LOCALAPPDATA&&path.join(process.env.LOCALAPPDATA,'Google/Chrome/Application/chrome.exe')
 ]:process.platform==='darwin'?['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']:['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser']),
 chromium.executablePath()
].filter(Boolean);
export const chrome=browserCandidates.find(candidate=>fs.existsSync(candidate));
export const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
export const ffprobe=process.env.FFPROBE_PATH||(process.env.FFMPEG_PATH?ffmpeg.replace(/ffmpeg(\.exe)?$/i,'ffprobe$1'):'ffprobe');
for(const dir of ['work','output'])fs.mkdirSync(path.join(root,dir),{recursive:true});
export const script=()=>fs.readFileSync(path.join(root,'src/score.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'src/film.js'),'utf8').replace('/* REVISION_SCENES */',()=>fs.readFileSync(path.join(root,'src/scenes.js'),'utf8'));
export const fontCSS=()=>{
 const font=process.env.UTOPIA_FONT_PATH||path.join(root,'assets/type.woff2');
 return fs.existsSync(font)?`@font-face{font-family:Utopia;src:url(data:font/woff2;base64,${fs.readFileSync(font).toString('base64')}) format('woff2');font-weight:900;font-display:block}`:'';
};
export async function openCanvas(width=1920,height=1080){
 if(!chrome)throw Error('Install Chrome, set CHROME_PATH, or run: npx playwright-core install chromium');
 const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage({viewport:{width,height}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.setContent(`<style>${fontCSS()}body{margin:0}canvas{display:block}</style><canvas id="film"></canvas>`);
 await page.addScriptTag({content:script()});
 await page.evaluate(async({width,height})=>{await document.fonts.load('900 80px Utopia');await document.fonts.ready;UtopiaFilm.init(document.getElementById('film'),width,height);},{width,height});
 return {browser,page,errors};
}
