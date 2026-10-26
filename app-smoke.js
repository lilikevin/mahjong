
const fs=require('fs'),vm=require('vm'),assert=require('assert');
let src=fs.readFileSync('output/app.js','utf8');
src=src.replace('let tStart=null, lastTouchAct=0;',`globalThis.TEST={act,chg,analyze,getS:()=>S,getE:()=>E,collectCurrent,wildSignature,wildResult,getDone:()=>wildDone,setDone:r=>{wildDone=r;wildKey=wildSignature();},validateCur};let tStart=null, lastTouchAct=0;`);
const elements={};function el(id){return elements[id]||(elements[id]={style:{},innerHTML:'',textContent:'',setAttribute(){}});}
const engine={SUITS:['萬','筒','索'],tName:t=>t<27?(t%9+1)+['萬','筒','索'][Math.floor(t/9)]:'東南西北中發白'[t-27],numOf:t=>t%9+1,suitOf:t=>Math.floor(t/9),FANS:[{id:'zimo',name:'自摸',fan:2}],FLAGS:[],FLOWERS:['春','夏','秋','冬','梅','蘭','菊','竹'],INSTANT:[{id:'x',name:'x',amt:1,mode:'all'}],buildRules:o=>({zimo:{id:'zimo',name:'自摸',fan:2}}),valueOf:(r,it)=>2*(it.n||1),basic:()=>[],transfers:()=>[]};
let prompts=['4'],stored={};
const ctx={console,window:null,globalThis:null,document:{head:{appendChild(){}},body:{style:{}},documentElement:{style:{setProperty(){}}},getElementById:el,createElement:()=>el('style'),querySelector:()=>null,addEventListener(){},visibilityState:'visible'},navigator:{},localStorage:{getItem:k=>stored[k]||null,setItem:(k,v)=>stored[k]=v,removeItem:k=>delete stored[k]},setTimeout(){},clearTimeout(){},confirm:()=>true,prompt:()=>prompts.shift()??null,fetch(){throw Error('unexpected fetch')},Date,Blob:class{},URL,Worker:class{},location:{reload(){}}};
ctx.window=ctx;ctx.globalThis=ctx;ctx.MJ=engine;ctx.MJ2=engine;ctx.MJ3=engine;ctx.MJHK=engine;ctx.scrollTo=()=>{};ctx.addEventListener=()=>{};ctx.scrollY=0;
vm.createContext(ctx);vm.runInContext(src,ctx);const T=ctx.TEST;
T.act('game',{v:'wild'});assert.equal(T.getS().game,'wild');assert.equal(T.getS().cfg.wildLimit,4);
T.act('tab',{v:'calc'});
for(let i=0;i<5;i++)T.act('tile',{t:'34'});assert.equal(T.getE().all.length,4);
T.act('clearHand',{});
for(const t of [0,1,34])T.act('tile',{t:String(t)});
T.act('mode',{v:'meld'});for(const i of [0,1,2])T.act('wildPool',{i:String(i)});
prompts=['1m'];T.act('wildGroup',{v:'chow'});assert.equal(T.getE().wildGroups.length,1);assert.equal(T.getE().all.length,0);
T.act('wildRemoveGroup',{i:'0'});assert.equal(T.getE().all.length,3);
T.act('clearHand',{});for(const t of [0,1,2,3,4,5,9,10,11,18,19,20,27,27,27,33,34])T.act('tile',{t:String(t)});
T.act('mode',{v:'win'});T.act('wildPool',{i:'16'});assert.equal(T.getE().win,34);
T.setDone({items:[{id:'zimo',n:1}],replacements:[33],assigned:[],win:33,waits:2,total:2,complete:true});assert(T.validateCur());
T.act('self',{v:'0'});assert.equal(T.wildResult(),null);
T.act('preset',{v:'2'});assert.equal(T.getS().cfg.wildPreset,2);assert.equal(T.getS().cfg.preset,1);
T.act('game',{v:'tw'});assert.equal(T.getS().game,'tw');assert.equal(T.getS().cfg.preset,1);
console.log('App VM integration smoke checks passed: game selection, joker cap, meld add/remove, winning joker, stale results, independent presets, original mode.');
