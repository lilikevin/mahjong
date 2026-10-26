
const M1=require('./output/engine.js'), M3=M1.MJ3;
const P=s=>{const o=[];s.split(' ').forEach(g=>{const su={m:0,p:9,s:18,z:27}[g.slice(-1)];g.slice(0,-1).split('').forEach(c=>o.push(su+(+c)-1));});return o;};
const F=Array(8).fill(false);
const run=(M,n,hand,win,self,melds=[],flags={})=>{const r=M.analyze({hand:P(hand),melds,win:P(win)[0],flowers:F,selfDraw:self,flags});const R=M.buildRules();console.log(M.id,n,r.error||r.total,'|',(r.items||[]).map(i=>R[i.id].name+(i.n>1?'x'+i.n:'')+(i.closed&&R[i.id].fanC!=null?'(暗)':'')).join(','));};
for(const M of [M1,M3]){
 run(M,'平糊','123m 456m 789p 234s 567s 55p','3m',true);
 run(M,'兩色同順','123m 123p 456s 789m 55p','5p'.replace('5p','5p'),false);
 run(M,'全姊妹','123m 123p 123s 456m 456p 99s','9s',true);
 run(M,'字一色','111z 222z 333z 555z 666z 77z','7z',true);
 run(M,'外語通','111m 222p 333s 444z 555z 66z','6z',true);
}
run(M3,'十六不搭龍','1m 4m 7m 2p 5p 8p 3s 6s 9s 1z 2z 3z 4z 5z 6z 7z 1m','1m',true);
run(M3,'十六不搭逢','1m 4m 7m 1p 4p 7p 1s 4s 7s 1z 2z 3z 4z 5z 6z 7z 1m','1m',false);
run(M3,'刻刻糊','111m 222m 333p 444p 555s 99s','9s',false);
run(M3,'全步高','123m 234p 345s 456m 567p 99s','9s',true);
run(M3,'大於五','666m 777p 888s 999m 678p 66s','6s',true);
run(M3,'綠一色','222s 333s 444s 666s 888s 22s'.replace('22s','發發'.replace('發發','66z').replace('66z','22s')),'2s',true);
