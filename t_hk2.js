
const M=require('./output/engine_hk.js');
const P=s=>{const o=[];s.split(' ').forEach(g=>{const su={m:0,p:9,s:18,z:27}[g.slice(-1)];g.slice(0,-1).split('').forEach(c=>o.push(su+(+c)-1));});return o;};
const F=Array(8).fill(false);
const run=(n,hand,win,self,concealed,melds=[])=>{const r=M.analyze({hand:P(hand),melds,win:P(win)[0],flowers:F,selfDraw:self,flags:{},seatWind:0,roundWind:0,concealed});const R=M.buildRules();console.log(n,r.error||r.total,'|',(r.items||[]).map(i=>R[i.id].name).join(','));};
run('平糊自摸 門清=是','123m 456m 789p 234s 55p','3m',true,true);
run('平糊自摸 門清=否','123m 456m 789p 234s 55p','3m',true,false);
run('坎坎糊 單吊出銃 門清','111m 222p 333s 444z 99m','9m',false,true);
run('坎坎糊 對碰出銃 門清','111m 222p 333s 444z 99m','1m',false,true);
run('坎坎糊 未勾門清','111m 222p 333s 444z 99m','9m',false,false);
run('九子連環 自摸 門清','1112345678999m 5m','5m',true,true);
run('九子連環 自摸 未勾門清','1112345678999m 5m','5m',true,false);
const b=M.basic({flowers:F,selfDraw:true,flags:{},concealed:true});console.log('basic 門清:',b.map(i=>i.id).join(','));
