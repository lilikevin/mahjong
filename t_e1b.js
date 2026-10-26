
const M1=require('./output/engine.js'), M3=M1.MJ3;
const P=s=>{const o=[];s.split(' ').forEach(g=>{const su={m:0,p:9,s:18,z:27}[g.slice(-1)];g.slice(0,-1).split('').forEach(c=>o.push(su+(+c)-1));});return o;};
const F=Array(8).fill(false);
const run=(M,n,hand,win,self,melds=[],flags={})=>{const r=M.analyze({hand:P(hand),melds,win:P(win)[0],flowers:F,selfDraw:self,flags});const R=M.buildRules();console.log(M.id,n,r.error||r.total,'|',(r.items||[]).map(i=>R[i.id].name+(i.n>1?'x'+i.n:'')+(i.closed&&R[i.id].fanC!=null?'(暗)':'')).join(','));};
run(M1,'字一色','111z 222z 333z 555z 666z 77z','7z',true);
run(M1,'五暗刻','111m 222m 333p 444p 555s 99s','9s',true);
run(M3,'綠一色','234s 234s 666s 888s 33s 666z','6z',true);
run(M3,'藍一色','888p 111z 222z 333z 444z 55z'.replace('55z','77z').replace('888p','888p'),'7z',true);
run(M3,'十三么','1m 9m 1p 9p 1s 9s 1z 2z 3z 4z 5z 6z 7z 1m 234s','9m'.replace('9m','9m'),true);
run(M1,'有明牌',' 55p',"5p",false,[{t:'pung',tile:27},{t:'pung',tile:28},{t:'chow',tile:0,open:true},{t:'chow',tile:12},{t:'kong',tile:31,open:true}]);
console.log(M3.basic({flowers:F,selfDraw:true,flags:{huashang:true,ting:true}}), M3.valueOf(M3.buildRules(),{id:'huashang',n:3}));
