import json, subprocess, os
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
FF=os.environ.get('FFMPEG_PATH','ffmpeg')
song=ROOT/'assets/song.mp3'
raw=subprocess.run([FF,'-v','error','-i',str(song),'-f','f32le','-ac','1','-ar','22050','pipe:1'],capture_output=True,check=True).stdout
x=np.frombuffer(raw,dtype='<f4');rate=22050;hop=220;window=2048
fr=np.lib.stride_tricks.sliding_window_view(x,window)[::hop]
mag=np.abs(np.fft.rfft(fr*np.hanning(window),axis=1));freq=np.fft.rfftfreq(window,1/rate)
times=(np.arange(len(fr))*hop+window/2)/rate
flux=np.r_[0,np.maximum(np.diff(np.log1p(mag*8),axis=0),0).mean(axis=1)]
fps=rate/hop
d=flux-np.convolve(flux,np.ones(81)/81,'same');ft=np.fft.rfft(d,1<<(2*len(d)-1).bit_length());ac=np.fft.irfft(ft*np.conj(ft))[:len(d)]
candidates=[]
for lag in range(round(fps*60/190),round(fps*60/70)):
    if ac[lag]>ac[lag-1] and ac[lag]>=ac[lag+1]:candidates.append((float(ac[lag]),60*fps/lag))
candidates.sort(reverse=True)
if not candidates:raise RuntimeError('No tempo candidates')
bpm=candidates[0][1];period=60/bpm
periods=np.linspace(period*.98,period*1.02,240);best=(-1,None,None)
for per in periods:
    phases=np.arange(0,per,.004)
    for phase in phases:
        beats=np.arange(phase,times[-1],per)
        score=np.interp(beats,times,flux).mean()
        if score>best[0]:best=(float(score),float(per),float(phase))
_,period,phase=best
def norm(v):
    v=np.convolve(v,np.ones(5)/5,'same');return np.clip(v/(np.percentile(v,95)+1e-8),0,1.5)
bands=[norm(np.sqrt(np.mean(mag[:,(freq>=lo)&(freq<hi)]**2,axis=1))) for lo,hi in [(35,180),(180,1500),(1500,8000)]]
rms=norm(np.sqrt(np.mean(fr*fr,axis=1)))
on=norm(flux)
keep=np.arange(0,len(times),3)
source=json.loads((ROOT/'work/source.json').read_text(encoding='utf-8'))
duration=len(x)/rate
lines=source['lyrics']
for i,l in enumerate(lines):l['end']=lines[i+1]['start'] if i+1<len(lines) else min(duration,114.5)
out={'duration':duration,'bpm':60/period,'period':period,'phase':phase,'candidates':[{'bpm':b,'score':a} for a,b in candidates[:6]],'evidence':'Signal-derived tempo/phase and supplied line timestamps; no listening or verified word alignment.','lyrics':lines,'repairs':source['repairs'],'step':hop*3/rate,'offset':float(times[0]),'envelopes':{key:np.round(val[keep],3).tolist() for key,val in [('bass',bands[0]),('body',bands[1]),('air',bands[2]),('rms',rms),('onset',on)]}}
(ROOT/'assets/score.json').write_text(json.dumps(out,ensure_ascii=False),encoding='utf-8')
(ROOT/'src/score.js').write_text('window.UTOPIA_SCORE='+json.dumps(out,ensure_ascii=False)+';\n',encoding='utf-8')
print(json.dumps({k:out[k] for k in ['duration','bpm','phase','candidates','repairs']}))
