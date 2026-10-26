
const M=require('./output/engine2.js');
const P=s=>{const o=[];s.split(' ').forEach(g=>{const su={m:0,p:9,s:18,z:27}[g.slice(-1)];g.slice(0,-1).split('').forEach(c=>o.push(su+(+c)-1));});return o;};
const F=Array(8).fill(false);
const run=(n,hand,win,self,melds=[],flags={},fl=F,extra={})=>{const r=M.analyze(Object.assign({hand:P(hand),melds,win:P(win)[0],flowers:fl,selfDraw:self,flags,seatWind:0,roundWind:0},extra));const R=M.buildRules();console.log(n,r.error||r.total,'|',(r.items||[]).map(i=>R[i.id].name+(i.n>1?'x'+i.n:'')+(i.closed&&R[i.id].fanC!=null?'(暗)':'')).join(','));};
// 十三么九: 13 yaochu + pair(1m) + meld 234s
run('十三么九','1m 1m 9m 1p 9p 1s 9s 1z 2z 3z 4z 5z 6z 7z 234s','9m',true);
// 十六不搭: 7 honors + m:1,4,9  p:2,5,9  s:3,6,... need diff>=3 : 3,6,9 ; plus dup
run('十六不搭','1m 4m 9m 2p 5p 9p 3s 6s 9s 1z 2z 3z 4z 5z 6z 7z 1m'.replace('1m 4m 9m','1m 4m 9m'),'1m',true);
// 一色三同順 暗 + 其他
run('一色三同順','123m 123m 123m 456p 789s 55m'.replace('55m','99p'),'9p',true);
// 三色同順 + 大雞? open hand
run('有碰有上','123p 456s'.replace('456s','456s'),'1p',false,[]);
