
const handlers={};let html='';
global.window={scrollY:0,scrollTo(){},addEventListener(){}};
global.localStorage={getItem:()=>null,setItem(){}};global.navigator={};global.confirm=()=>true;
global.document={getElementById:()=>({set innerHTML(v){html=v},set textContent(v){},set className(v){}}),addEventListener:(t,f)=>handlers[t]=f,createElement:()=>({}),body:{appendChild(){}}};
window.MJ={buildRules:()=>new Proxy({}, {get:(o,k)=>({name:String(k),fan:1,fanC:null})}),FANS:[],INSTANT:[{id:'zhahu',name:'x',amt:50,mode:'one'}],FLOWERS:[],suitOf:()=>0,numOf:()=>1,tName:String,SUITS:[],basic:()=>[],analyze:()=>null,settle:()=>[0,0,0,0],transfers:()=>[]};
require('./output/app.js');
handlers.click({target:{closest:()=>({dataset:{act:'tab',v:'settings'}})}});
console.log(html.match(/版本:<b>[^<]+<\/b>/)[0], html.match(/更新時間:<b>[^<]+/)[0]);
