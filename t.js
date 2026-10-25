
const M=require('./output/engine.js');
const P=(s)=>{const out=[];s.split(' ').forEach(g=>{const su={m:0,p:9,s:18,z:27}[g.slice(-1)];g.slice(0,-1).split('').forEach(c=>out.push(su+(+c)-1));});return out;};
const show=(name,inp)=>{const r=M.analyze(inp);console.log(name, r.error||r.total, r.items&&r.items.map(i=>i.id+(i.n>1?'x'+i.n:'')+(i.closed?'(暗)':'')).join(',')); };
const F=Array(8).fill(false);
// 平糊 自摸: 123m 456m 789p 234s 567s +55p  (17 tiles)
let h=P('123m 456m 789p 234s 567s 55p'); show('pinghu zimo',{hand:h,melds:[],win:P('3m')[0],flowers:F,selfDraw:true,flags:{}});
// 清一色 對對糊
h=P('111m 222m 333m 444m 555m 99m'); show('qing duidui',{hand:h,melds:[],win:0,flowers:F,selfDraw:false,flags:{}});
// 嚦咕
h=P('111m 22m 33m 44p 55p 66s 77s 11z 22z 5z 5z'); console.log(h.length);
h=[0,0,0,9+1,9+1,2,2,11,11,20,20,21,21,27,27,28,28]; console.log(h.length); show('lik',{hand:h,melds:[],win:0,flowers:F,selfDraw:true,flags:{}});
// 碰2組
h=P('123m 456m 789p 55s 33s'); console.log(h.length);
show('melds',{hand:P('123m 456m 55p'),melds:[{t:'pung',tile:27},{t:'pung',tile:28},{t:'kong',tile:31,open:false}],win:P('3m')[0],flowers:F,selfDraw:false,flags:{}});
console.log(M.settle([{p:1,self:true,total:50}],0,0,{fanValue:1,baseMult:5}));
