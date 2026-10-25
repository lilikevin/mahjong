
const handlers={};let html='';const store={};
global.window={scrollY:0,scrollTo(){},addEventListener(){}};
global.localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v};global.navigator={};global.confirm=()=>true;
global.fetch=async()=>({ok:true,json:async()=>({version:'v1.1'})});
const bodyStyle={};
global.document={visibilityState:'visible',body:{style:bodyStyle,appendChild(){}},documentElement:{style:{}},querySelector:()=>null,getElementById:()=>({set innerHTML(v){html=v},set textContent(v){},set className(v){}}),addEventListener:(t,f)=>handlers[t]=f,createElement:()=>({})};
window.MJ={buildRules:()=>new Proxy({}, {get:(o,k)=>({name:String(k),fan:1,fanC:null})}),FANS:[],INSTANT:[{id:'zhahu',name:'x',amt:50,mode:'one'}],FLOWERS:[],suitOf:()=>0,numOf:()=>1,tName:String,SUITS:[],basic:()=>[],analyze:()=>null,settle:()=>[0,0,0,0],transfers:()=>[]};
require('./output/app.js');
const click=(act,ds={})=>handlers.click({target:{closest:()=>({dataset:Object.assign({act},ds)})}});
click('tab',{v:'calc'});console.log('風圈/門風提示:',/目前:<b>東風圈/.test(html), /門風:<b>東風/.test(html));
click('bg',{c:'#0f1f33'});console.log('bg:',bodyStyle.background);
click('tab',{v:'table'});click('streak',{d:'1'});click('draw');console.log('before new:', /連莊 2 次/.test(html));
click('newGame');console.log('after new:',/連莊 0 次/.test(html), /還原上一場牌局/.test(html));
click('restoreGame');console.log('restored:',/連莊 2 次/.test(html));
