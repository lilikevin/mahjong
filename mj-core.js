/* mj-core.js — 四個計番引擎共用的基礎函數。須在 engine*.js 之前載入。
   decompose(cnt,nSets): 把 34 種牌的張數陣列拆成「nSets 組面子 + 一對眼」,回傳所有拆法。
   cnt 會被暫時修改但返回時已還原。 */
(function(root){
'use strict';
function decompose(cnt,nSets){
  const res=[];
  for(let p=0;p<34;p++){
    if(cnt[p]<2) continue;
    cnt[p]-=2;
    const sets=[];
    (function rec(){
      let i=0; while(i<34&&cnt[i]===0) i++;
      if(i===34){ if(sets.length===nSets) res.push({pair:p,sets:sets.map(s=>({t:s.t,tile:s.tile}))}); return; }
      if(sets.length>=nSets) return;
      if(cnt[i]>=3){ cnt[i]-=3; sets.push({t:'pung',tile:i}); rec(); sets.pop(); cnt[i]+=3; }
      if(i<27&&(i%9)<=6&&cnt[i+1]>0&&cnt[i+2]>0){ cnt[i]--;cnt[i+1]--;cnt[i+2]--; sets.push({t:'chow',tile:i}); rec(); sets.pop(); cnt[i]++;cnt[i+1]++;cnt[i+2]++; }
    })();
    cnt[p]+=2;
  }
  return res;
}
const API={decompose};
if(typeof module!=='undefined'&&module.exports) module.exports=API; else root.MJCORE=API;
})(typeof window!=='undefined'?window:globalThis);
