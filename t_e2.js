
const M=require('./output/engine2.js');
const P=s=>{const o=[];s.split(' ').forEach(g=>{const su={m:0,p:9,s:18,z:27}[g.slice(-1)];g.slice(0,-1).split('').forEach(c=>o.push(su+(+c)-1));});return o;};
const F=Array(8).fill(false);
const run=(n,hand,win,self,melds=[],flags={},fl=F,extra={})=>{const r=M.analyze(Object.assign({hand:P(hand),melds,win:P(win)[0],flowers:fl,selfDraw:self,flags,seatWind:0,roundWind:0},extra));const R=M.buildRules();console.log(n,r.error||r.total,'|',(r.items||[]).map(i=>R[i.id].name+(i.n>1?'x'+i.n:'')+(i.closed&&R[i.id].fanC!=null?'(暗)':'')).join(','));};
run('平糊自摸','123m 456m 789p 234s 567s 55p','3m',true);
run('字一色','111z 222z 333z 555z 666z 77z','7z',true);
run('對對糊暗刻ron','111m 222m 333m 444p 555p 99s','9s',false);
run('嚦咕','11m 22m 33m 44p 55p 66s 77s 88s 8s'.replace(' 8s','').replace('88s','888s'),'8s',true);
