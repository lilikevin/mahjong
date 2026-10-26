(function(root){
'use strict';
const YAO=[0,8,9,17,18,26,27,28,29,30,31,32,33];
const GROUPS=[];
for(let t=0;t<34;t++) GROUPS.push([t,t,t]);
for(let t=0;t<27;t++) if(t%9<7) GROUPS.push([t,t+1,t+2]);
const count=a=>{const c=Array(34).fill(0);a.forEach(t=>c[t]++);return c;};
function meldTiles(m){return m.t==='chow'?[m.tile,m.tile+1,m.tile+2]:Array(m.t==='kong'?4:3).fill(m.tile);}
function options(m){
 const a=m.physical,f=a.filter(t=>t!==34),out=[];
 if(a.length!==(m.t==='kong'?4:3)) return out;
 if(m.t==='chow'){
  for(let t=0;t<27;t++) if(t%9<7&&new Set(f).size===f.length&&f.every(x=>x>=t&&x<=t+2)) out.push({t:m.t,tile:t,open:true});
 }else for(let t=0;t<34;t++) if(f.every(x=>x===t)) out.push({t:m.t,tile:t,open:m.open!==false});
 return m.tile==null?out:out.filter(o=>o.tile===m.tile);
}
function* targets(fixed,wilds,nsets,base,special){
 const need=count(fixed),seen=new Set(),total=nsets*3+2;
 if(fixed.length+wilds!==total)return;
 const valid=c=>c.every((v,i)=>v>=need[i]&&v+base[i]<=4);
 function* emit(c){if(!valid(c))return;const key=c.join(',');if(seen.has(key))return;seen.add(key);yield c;}
 function* fill(left,pair,c,start){
  if(!left){if(pair)yield* emit(c);else for(let p=0;p<34;p++)if(c[p]+base[p]<=2){const d=c.slice();d[p]+=2;yield* emit(d);}return;}
  for(let j=start;j<GROUPS.length;j++){const d=c.slice();let ok=true;for(const t of GROUPS[j])if(++d[t]+base[t]>4){ok=false;break;}if(ok)yield* fill(left-1,pair,d,j);}
 }
 function* cover(left,pair,c){
  let first=-1,deficit=0;
  for(let t=0;t<34;t++)if(need[t]>c[t]){if(first<0)first=t;deficit+=need[t]-c[t];}
  if(deficit>left*3+(pair?0:2))return;
  if(first<0){yield* fill(left,pair,c,0);return;}
  if(left)for(const g of GROUPS){if(!g.includes(first))continue;const d=c.slice();let ok=true;for(const t of g)if(++d[t]+base[t]>4){ok=false;break;}if(ok)yield* cover(left-1,pair,d);}
  if(!pair&&c[first]+base[first]<=2){const d=c.slice();d[first]+=2;yield* cover(left,true,d);}
 }
 yield* cover(nsets,false,Array(34).fill(0));
 if(!special||nsets!==5)return;
 for(let tr=0;tr<34;tr++){
  if(need[tr]>3)continue;const c=Array(34).fill(0);c[tr]=3;let pairs=0;
  for(let t=0;t<34;t++)if(t!==tr&&need[t]){c[t]=Math.ceil(need[t]/2)*2;pairs+=c[t]/2;}
  if(pairs>7)continue;
  function* choose(start,k){if(!k){yield* emit(c.slice());return;}for(let t=start;t<34;t++)if(t!==tr&&c[t]+base[t]<=2){c[t]+=2;yield* choose(t,k-1);c[t]-=2;}}
  yield* choose(0,7-pairs);
 }
 for(const p of YAO)for(const g of GROUPS){const c=Array(34).fill(0);YAO.forEach(t=>c[t]++);c[p]++;g.forEach(t=>c[t]++);yield* emit(c);}
 const gaps=[];for(let a=0;a<9;a++)for(let b=a+3;b<9;b++)for(let c=b+3;c<9;c++)gaps.push([a,b,c]);
 for(const a of gaps)for(const b of gaps)for(const d of gaps){
  const c=Array(34).fill(0);for(let t=27;t<34;t++)c[t]=1;a.forEach(t=>c[t]=1);b.forEach(t=>c[t+9]=1);d.forEach(t=>c[t+18]=1);
  if(c.some((v,i)=>need[i]>v+1||(!v&&need[i])))continue;
  for(let p=0;p<34;p++)if(c[p]){const e=c.slice();e[p]++;yield* emit(e);}
 }
}
function* meldChoices(groups){
 function* rec(i,chosen,base){
  if(i===groups.length){yield {melds:chosen,base};return;}
  for(const m of options(groups[i])){const b=base.slice();let ok=true;for(const t of meldTiles(m))if(++b[t]>4){ok=false;break;}if(ok)yield* rec(i+1,chosen.concat([m]),b);}
 }
 yield* rec(0,[],Array(34).fill(0));
}
const API={targets,options,count,meldTiles,meldChoices};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.MJW=API;
})(globalThis);
