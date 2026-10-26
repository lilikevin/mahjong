/* Uses the existing local scoring engines; never calls an AI/cloud service. */
importScripts('engine_wild.js');
let ready;
async function loadEngines(){
 for(const file of ['engine.js','engine2.js']){
  const r=await fetch(file);if(!r.ok)throw Error('無法讀取 '+file);
  let src=await r.text();
  const anchor='base.getWaits=function(){';
  if(!src.includes(anchor))throw Error(file+' 結構不同，請提供最新版引擎以便整合');
  src=src.replace(anchor,anchor+' if(typeof globalThis.MJ_WILD_WAITS==="number") return globalThis.MJ_WILD_WAITS;');
  // Only the worker copy is adapted. Original engines on the page are unchanged.
  (0,eval)(src);
 }
}
function completed(c,n,special){
 if(ENGINE.decompose(c.slice(),n).length)return true;
 if(!special)return false;
 // Special shapes depend on the selected original engine, not just on a pattern.
 const hand=[];c.forEach((v,t)=>{for(let i=0;i<v;i++)hand.push(t);});
 const r=ENGINE.analyze({hand,melds:[],win:hand[0],selfDraw:true,flowers:[],flags:{}},{});
 return !!(r&&!r.error&&r.items);
}
let ENGINE;
function exists(fixed,k,n,base,special){
 for(const c of MJW.targets(fixed,k,n,base,special))if(completed(c,n,special))return true;
 return false;
}
function waitCount(inp,mc){
 const f=inp.hand.filter(t=>t!==34),w=inp.hand.filter(t=>t===34).length;
 let k=w;
 if(inp.win===34)k--;else f.splice(f.indexOf(inp.win),1);
 const physical=MJW.count(f.concat(inp.groups.flatMap(g=>g.physical.filter(t=>t!==34))));
 let n=0;
 for(let t=0;t<34;t++)if(physical[t]<4&&exists(f.concat([t]),k,5-inp.groups.length,mc.base,inp.groups.length===0))n++;
 const usedJokers=k+inp.groups.reduce((a,g)=>a+g.physical.filter(t=>t===34).length,0);
 if(usedJokers<inp.limit&&exists(f,k+1,5-inp.groups.length,mc.base,inp.groups.length===0))n++;
 return n;
}
onmessage=async e=>{
 try{
  if(!ready)ready=loadEngines();await ready;
  const {inp,over,excluded}=e.data;
  ENGINE=inp.preset===2?globalThis.MJ2:inp.preset===3?globalThis.MJ3:globalThis.MJ;
  if(!ENGINE)throw Error('未能載入所選番表');
  const raw=inp.hand.concat(inp.groups.flatMap(g=>g.physical));
  if(raw.some(t=>!Number.isInteger(t)||t<0||t>34))throw Error('無效牌');
  if(raw.filter(t=>t===34).length>inp.limit)throw Error('百搭數超過開局設定');
  if(MJW.count(raw.filter(t=>t<34)).some(v=>v>4))throw Error('同款真牌多於四張');
  const n=5-inp.groups.length;
  if(n<0||inp.hand.length!==3*n+2)throw Error('手牌連食糊牌應有 '+(3*n+2)+' 張');
  if(!inp.hand.includes(inp.win))throw Error('請指定手牌中的食糊牌');
  if(!inp.selfDraw&&inp.win===34)throw Error('百搭不可由他家打出食糊，請改選實際食糊牌或自摸');
  const fixed=inp.hand.filter(t=>t!==34),k=inp.hand.length-fixed.length,fc=MJW.count(fixed);
  const R=ENGINE.buildRules(over),excludedSet=new Set(excluded||[]);
  let best=null,count=0,last=Date.now();
  globalThis.MJ_WILD_WAITS=2;
  for(const mc of MJW.meldChoices(inp.groups)){
   globalThis.MJ_WILD_WAITS=2;
   const waits=waitCount(inp,mc);
   globalThis.MJ_WILD_WAITS=waits;
   for(const target of MJW.targets(fixed,k,n,mc.base,inp.groups.length===0)){
    const hand=[];target.forEach((v,t)=>{for(let i=0;i<v;i++)hand.push(t);});
    const wins=inp.win===34?target.map((v,t)=>v>fc[t]?t:-1).filter(t=>t>=0):[inp.win];
    for(const win of wins){
     const r=ENGINE.analyze({hand,melds:mc.melds,win,selfDraw:inp.selfDraw,flags:inp.flags,flowers:inp.flowers},over);
     count++;
     if(r&&!r.error&&r.items){
      const total=r.items.filter(x=>!excludedSet.has(x.id)).reduce((a,x)=>a+ENGINE.valueOf(R,x),0);
      if(!best||total>best.total){
       const replacements=[];target.forEach((v,t)=>{for(let j=fc[t];j<v;j++)replacements.push(t);});
       const assigned=mc.melds.map((m,i)=>{const c=MJW.count(MJW.meldTiles(m));inp.groups[i].physical.filter(t=>t!==34).forEach(t=>c[t]--);const out=[];c.forEach((v,t)=>{for(let j=0;j<v;j++)out.push(t);});return out;});
       best={items:r.items,total,replacements,assigned,win,waits,resolvedHand:hand,resolvedMelds:mc.melds};
      }
     }
     if(Date.now()-last>400){postMessage({progress:count,best:best?best.total:null});last=Date.now();}
    }
   }
  }
  postMessage({done:true,result:best?{...best,count,complete:true}:{error:'未能在目前限制下組成食糊牌形',count}});
 }catch(err){postMessage({done:true,result:{error:String(err.message||err)}});}
};
