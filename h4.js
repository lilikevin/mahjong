
const handlers={};let html='';
global.window={scrollY:0,scrollTo(){},addEventListener(){}};
global.localStorage={getItem:()=>null,setItem(){}};global.navigator={};
global.document={getElementById:()=>({set innerHTML(v){html=v},set textContent(v){},set className(v){}}),addEventListener:(t,f)=>handlers[t]=f,createElement:()=>({}),body:{appendChild(){}}};
window.MJ={buildRules:()=>new Proxy({}, {get:(o,k)=>({name:String(k),fan:1,fanC:null})}),FANS:[],INSTANT:[{id:'zhahu',name:'詐糊',amt:50,mode:'one'}],FLOWERS:['春','夏','秋','冬','梅','蘭','菊','竹'],suitOf:i=>i<27?(i/9|0):3,numOf:i=>i<27?i%9+1:0,tName:i=>String(i),SUITS:['萬','筒','索'],basic:()=>[],analyze:()=>({items:[],count:0,waits:0}),settle:()=>[0,0,0,0],transfers:()=>[]};
require('./output/app.js');
const click=(act,ds={})=>handlers.click({target:{closest:()=>({dataset:Object.assign({act},ds)})}});
click('tab',{v:'calc'});click('tile',{t:3});
const iPal=html.indexOf('class="pal"'), iBtn=html.indexOf('data-act="undoTile"'), iEnt=html.indexOf('已輸入的牌型');
console.log(iPal<iBtn, iBtn<iEnt);
