
const M=require('./output/engine_hk.js');
const P=s=>{const o=[];s.split(' ').forEach(g=>{const su={m:0,p:9,s:18,z:27}[g.slice(-1)];g.slice(0,-1).split('').forEach(c=>o.push(su+(+c)-1));});return o;};
const F=Array(8).fill(false);
const run=(n,hand,win,self,melds=[],flags={},extra={})=>{const r=M.analyze(Object.assign({hand:P(hand),melds,win:P(win)[0],flowers:F,selfDraw:self,flags,seatWind:0,roundWind:0},extra));const R=M.buildRules();console.log(n,r.error||r.total,'|',(r.items||[]).map(i=>R[i.id].name+(i.n>1?'x'+i.n:'')).join(','));};
run('平糊自摸','123m 456m 789p 234s 55p','3m',true);
run('大三元','555z 666z 777z 123m 99p','9p',false);
run('小三元自摸','555z 666z 77z 123m 456p','1m',true);
run('清一色對對糊','111m 222m 333m 444m 99m','9m',true);
run('十三么','1m 9m 1p 9p 1s 9s 1z 2z 3z 4z 5z 6z 7z 7z','7z',false);
run('九子連環','1112345678999m 5m','5m',true);
run('九子連環出銃9扉','1112345678999m 5m','5m',false);
run('坎坎糊','111m 222p 333s 444z 99m','9m',false);
run('門風圈風','111z 123m 456p 789s 55p','5p',false);
run('槓上自摸+搶槓',"123m 456p 789s 55p",'5p',true,[{t:'kong',tile:27,open:true}],{kongshang:true});
run('十八羅漢','55m',"5m",false,[{t:'kong',tile:0,open:true},{t:'kong',tile:1,open:true},{t:'kong',tile:2,open:false},{t:'kong',tile:3,open:true}]);
const fl=[true,false,false,false,true,false,false,false];
const r=M.analyze({hand:P('123m 456p 789s 234m 55p'),melds:[],win:P('5p')[0],flowers:fl,selfDraw:false,flags:{},seatWind:0,roundWind:0,useFlowers:true});console.log('花牌規則',r.total,r.items.map(i=>i.id).join(','));
