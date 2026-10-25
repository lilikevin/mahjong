
const handlers={};let html='';
global.window={scrollY:0,scrollTo(){},addEventListener(){},caches:undefined};
global.localStorage={getItem:()=>null,setItem(){}};global.navigator={};global.confirm=()=>true;
let remote={version:'v1.1',updated:'2026-11-01 10:00'};
global.fetch=async()=>({ok:true,json:async()=>remote});
global.document={visibilityState:'visible',getElementById:()=>({set innerHTML(v){html=v},set textContent(v){},set className(v){}}),addEventListener:(t,f)=>handlers[t]=f,createElement:()=>({}),body:{appendChild(){}}};
window.MJ={buildRules:()=>new Proxy({}, {get:(o,k)=>({name:String(k),fan:1,fanC:null})}),FANS:[],INSTANT:[{id:'zhahu',name:'x',amt:50,mode:'one'}],FLOWERS:[],suitOf:()=>0,numOf:()=>1,tName:String,SUITS:[],basic:()=>[],analyze:()=>null,settle:()=>[0,0,0,0],transfers:()=>[]};
require('./output/app.js');
(async()=>{
 await new Promise(r=>setTimeout(r,1500));
 console.log('banner when diff:',html.includes('發現新版本 v1.1'));
 handlers.click({target:{closest:()=>({dataset:{act:'dismissUpd'}})}});
 console.log('after dismiss:',html.includes('發現新版本'));
 remote={version:'v1.0',updated:'x'};
 handlers.click({target:{closest:()=>({dataset:{act:'checkUpd'}})}});
 await new Promise(r=>setTimeout(r,100));
 console.log('same version -> no banner:',!html.includes('發現新版本'));
 process.exit(0);
})();
