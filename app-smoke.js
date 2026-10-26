
const fs=require('fs'),vm=require('vm'),assert=require('assert');
let src=fs.readFileSync('output/app.js','utf8');
src=src.replace('let tStart=null, lastTouchAct=0;','globalThis.TEST={act,viewCalc,viewChooser,getS:()=>S,getE:()=>E,payRows,mkTxns,applyHand,dealerPid};let tStart=null, lastTouchAct=0;');
const els={};const el=id=>els[id]||(els[id]={style:{},innerHTML:'',textContent:'',setAttribute(){}});
let lastInp=null;
const eng={SUITS:['萬','筒','索'],tName:t=>String(t),numOf:t=>t%9+1,suitOf:t=>Math.floor(t/9),FANS:[{id:'zimo',name:'自摸',fan:20},{id:'xiaohuahu',name:'小花糊',fan:3}],FLAGS:[],FLOWERS:['春','夏','秋','冬','梅','蘭','菊','竹'],INSTANT:[{id:'x',name:'x',amt:1,mode:'all'}],
 buildRules:()=>({zimo:{id:'zimo',name:'自摸',fan:20},xiaohuahu:{id:'xiaohuahu',name:'小花糊',fan:3}}),valueOf:(r,it)=>r[it.id]?r[it.id].fan:0,basic:()=>[{id:'zimo',n:1,closed:false}],transfers:()=>[],
 analyze:(inp)=>{lastInp=inp;return {items:[{id:'zimo',n:1,closed:false}],total:20,count:1,waits:1};}};
const stored={};
const ctx={console,document:{head:{appendChild(){}},body:{style:{}},documentElement:{style:{setProperty(){}}},getElementById:el,createElement:()=>el('s'),querySelector:()=>null,addEventListener(){},visibilityState:'visible'},navigator:{},localStorage:{getItem:k=>stored[k]||null,setItem:(k,v)=>stored[k]=v,removeItem:k=>delete stored[k]},setTimeout(){},confirm:()=>true,prompt:()=>null,fetch(){throw Error('fetch')},Date,Blob:class{},URL,Worker:class{},location:{reload(){}},scrollTo(){},scrollY:0};
ctx.window=ctx;ctx.globalThis=ctx;ctx.MJ=ctx.MJ2=ctx.MJ3=ctx.MJHK=eng;vm.createContext(ctx);vm.runInContext(src,ctx);const T=ctx.TEST,S=T.getS();
assert(src.includes("const APP_VERSION='v1.2 beta';"));
const count=(s,x)=>s.split(x).length-1;
for(const mode of ['tw','wild']){
 mode==='tw'?T.act('game',{v:'tw'}):T.act('game',{v:'wild',n:'4'});
 S.cfg.baseMult=5;S.cfg.fanValue=1;S.streak=2;const E=T.getE(),d=T.dealerPid(),o=(d+1)%4;
 E.self=true;E.winner=o;let out=T.viewCalc();
 assert(!out.includes('每家應付合計')&&!out.includes('<th>莊／連莊</th>'),'no second breakdown table');
 assert.strictEqual(count(out,'🔒 底'),1);assert.strictEqual(count(out,'🔒 莊家加番'),1);assert.strictEqual(count(out,'🔒 連莊加番'),1);
 assert(out.includes('付 <b>30</b> 番 = <b>$30</b>')&&out.includes('付 <b>25</b> 番 = <b>$25</b>'));
 const tx=T.mkTxns([{p:o,self:true,disc:null,total:20}],d,S.streak);assert.strictEqual(JSON.stringify(tx.map(x=>x.amt).sort()),'[25,25,30]');
 const rows=T.payRows(20);assert.strictEqual(JSON.stringify(rows.map(r=>[r.payer,r.amount]).sort()),JSON.stringify(tx.map(x=>[x.l,x.amt]).sort()));
 E.winner=d;out=T.viewCalc();assert(out.includes('每位付款人應付 <b>30</b> 番 = <b>$30</b>'));
 E.self=false;E.winner=o;E.disc=(d+2)%4;out=T.viewCalc();assert(out.includes('每位付款人應付 <b>25</b> 番 = <b>$25</b>')&&out.includes('本局不適用'));
}
T.act('game',{v:'hk'});T.act('tab',{v:'calc'});for(const t of [0,0,0,1,1,1,2,2,2,3,3,3,4,4])T.act('tile',{t:String(t)});
let o2=T.viewCalc();assert.strictEqual(count(o2,'data-act="flower"'),8);assert(lastInp.useFlowers===false);T.act('flower',{i:'0'});T.viewCalc();assert(lastInp.useFlowers===true);
console.log('台牌不重複加底/莊、廣東牌花牌檢查通過');
