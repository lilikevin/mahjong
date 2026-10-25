
const handlers={};let html='';
global.window={scrollY:0,scrollTo(){},addEventListener(){}};
global.localStorage={getItem:()=>null,setItem(){}};global.navigator={};global.confirm=()=>true;
global.document={getElementById:()=>({set innerHTML(v){html=v},set textContent(v){},set className(v){}}),addEventListener:(t,f)=>handlers[t]=f,createElement:()=>({}),body:{appendChild(){}}};
window.MJ={buildRules:()=>new Proxy({}, {get:(o,k)=>({name:String(k),fan:1,fanC:null})}),FANS:[],INSTANT:[{id:'zhahu',name:'詐糊',amt:50,mode:'one'}],FLOWERS:['春','夏','秋','冬','梅','蘭','菊','竹'],suitOf:i=>i<27?(i/9|0):3,numOf:i=>i<27?i%9+1:0,tName:i=>String(i),SUITS:['萬','筒','索'],basic:()=>[],analyze:()=>null,settle:()=>[0,0,0,0],transfers:()=>[]};
require('./output/app.js');
const {applyHand}=window.MJ_LA;
let L=[];
let r=applyHand(L,[{w:0,l:1,amt:15}],true);L=r.ledger;console.log('h1',JSON.stringify(L));
r=applyHand(L,[{w:0,l:1,amt:10}],true);L=r.ledger;console.log('h2 拉二',JSON.stringify(L));
r=applyHand(L,[{w:0,l:2,amt:6}],true);L=r.ledger;console.log('h3 A食C 續記',JSON.stringify(L),r.cash);
const L3=L.map(x=>({...x}));
r=applyHand(L3,[{w:3,l:2,amt:5}],true);console.log('h4 D食C:全額結清',r.cash,JSON.stringify(r.ledger));
r=applyHand(L3,[{w:1,l:0,amt:8}],true);console.log('h4b B食A:B踢半',r.cash,JSON.stringify(r.ledger));
r=applyHand(L3,[{w:0,l:1,amt:7},{w:0,l:2,amt:7},{w:0,l:3,amt:7}],true);console.log('h4c A自摸',JSON.stringify(r.ledger));
r=applyHand(L3,[],false);console.log('流局',JSON.stringify(r.ledger));
