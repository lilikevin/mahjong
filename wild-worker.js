/* Exact candidate enumeration; cancellation terminates the worker. */
'use strict';
importScripts('mj-core.js','engine.js','engine2.js','engine4.js','engine_wild.js');
onmessage=function(event){
 try{
 const {inp,over={},excluded=[]}=event.data||{};
 if(!inp||!Array.isArray(inp.hand)||!Array.isArray(inp.groups))throw Error('百搭輸入資料不完整');
 const engines={1:self.MJ,2:self.MJ2,3:self.MJ3,4:self.MJ4},base=engines[inp.preset||3];if(!base)throw Error('番表未載入');
 const M=inp.preset!==4&&self.MJRULES?self.MJRULES.wrap(base):base,R=M.buildRules(over),excludedSet=new Set(excluded);
 const all=inp.hand.concat(...inp.groups.map(g=>g.physical));
 if(all.some(t=>!Number.isInteger(t)||t<0||t>34))throw Error('牌張編號無效');
 if(all.filter(t=>t===34).length>inp.limit)throw Error('百搭超過本場上限');
 if(!inp.wildMeld&&inp.groups.some(g=>g.physical.includes(34)))throw Error('本場不允許百搭用於明牌');
 if(inp.win===34&&!inp.selfDraw)throw Error('百搭不能作為出銃牌');
 if(inp.win==null)throw Error('請選食糊牌');
 const fixed=inp.hand.filter(t=>t!==34),wilds=inp.hand.length-fixed.length,fixedCounts=Array(34).fill(0);fixed.forEach(t=>fixedCounts[t]++);
 let best=null,count=0,groupCount=0;
 for(const choice of self.MJW.meldChoices(inp.groups)){
  groupCount++;
  for(const counts of self.MJW.targets(fixed,wilds,5-choice.melds.length,choice.base,true)){
   const hand=[],replacements=[];for(let t=0;t<34;t++)for(let n=0;n<counts[t];n++){hand.push(t);if(n>=fixedCounts[t])replacements.push(t);}
   const wins=inp.win===34?Array.from(new Set(replacements)):[inp.win];
   for(const win of wins){if(!hand.includes(win))continue;const context={...inp,hand,melds:choice.melds,win};const r=M.analyze(context,over);count++;
    if(r&&!r.error&&r.items){const items=r.items.filter(x=>!excludedSet.has(x.id)),total=items.reduce((n,x)=>n+M.valueOf(R,x),0);if(!best||total>best.total)best={...r,items,total,count,win,replacements:replacements.slice(),assigned:hand.slice(),complete:true};}
    if(count%100===0)postMessage({progress:count,best:best?best.total:null});
   }
  }
 }
 if(!groupCount)throw Error('明牌未能組成合法組合');
 if(!best)throw Error('百搭未能組成食糊牌型');best.count=count;
 postMessage({done:true,result:best});
 }catch(e){postMessage({done:true,result:{error:e.message||String(e),complete:false}});}
};
