#!/usr/bin/env node
/* t_sup_check.js — 檢查各番表的「不複合規則」(SUP / SUPPRESS) 有沒有打錯番種 id。
   用法:在網站根目錄執行  node t_sup_check.js   (或  node t_sup_check.js 路徑)
   檢查:1) 每個 key、每個被取消的 id 都存在於該番表(FANS)  2) 番表內沒有重複 id
        3) 取消規則不會取消自己  4) 取消規則的值必須是陣列
   結果:有錯 → 結束代碼 1;只有「已知失效引用」→ 顯示提示但通過。 */
const fs=require('fs'),path=require('path'),vm=require('vm');
const dir=path.resolve(process.argv[2]||'.');
const FILES=['mj-core.js','engine.js','engine2.js','engine4.js','engine_hk.js'];
const GLOBALS={MJ:'預設 #1(engine.js)',MJ3:'預設 #3(engine.js)',MJ2:'預設 #2(engine2.js)',MJ4:'預設 #4(engine4.js)',MJHK:'廣東牌(engine_hk.js)'};
/* 已知而且無害的失效引用:預設 #3 的番表沒有「平糊」「假獨」這兩行,引擎內 push() 會先檢查番表,所以不會產生這兩項;
   規則裡仍寫著它們只是沿用其他預設的寫法。若日後番表補上這兩行,請由這裡刪除。 */
const KNOWN_DEAD={MJ3:['jiadu','pinghu']};
const sb={console};sb.window=sb;sb.globalThis=sb;sb.self=sb;
vm.createContext(sb);
let loaded=0;
for(const f of FILES){
  const p=path.join(dir,f);
  if(!fs.existsSync(p)){ console.log('略過(找不到):'+f); continue; }
  try{ vm.runInContext(fs.readFileSync(p,'utf8'),sb,{filename:f}); loaded++; }
  catch(e){ console.log('載入失敗 '+f+':'+e.message); process.exitCode=1; }
}
if(!loaded){ console.log('沒有載入任何檔案,請確認路徑'); process.exit(1); }
let errors=0,warns=0,checked=0;
for(const g of Object.keys(GLOBALS)){
  const A=sb[g];
  if(!A){ console.log('- '+GLOBALS[g]+':未載入('+g+')'); continue; }
  const label=GLOBALS[g];
  const fans=A.FANS||[];
  const ids=new Set(), dup=[];
  fans.forEach(f=>{ if(ids.has(f.id)) dup.push(f.id); ids.add(f.id); });
  if(dup.length){ console.log('✗ '+label+':番表有重複 id → '+dup.join(', ')); errors++; }
  const S=A.SUPPRESS;
  if(!S){ console.log('- '+label+':沒有不複合規則,略過('+ids.size+' 個番種)'); continue; }
  checked++;
  const allowed=new Set(KNOWN_DEAD[g]||[]), used=new Set(), bad=[], notArr=[], selfRef=[];
  Object.keys(S).forEach(k=>{
    if(!ids.has(k)) bad.push('key「'+k+'」');
    if(!Array.isArray(S[k])){ notArr.push(k); return; }
    S[k].forEach(v=>{
      if(v===k) selfRef.push(k);
      if(!ids.has(v)){ if(allowed.has(v)) used.add(v); else bad.push('「'+k+'」→「'+v+'」'); }
    });
  });
  if(bad.length){ console.log('✗ '+label+':'+bad.length+' 個不存在的 id → '+bad.join(';')); errors++; }
  if(notArr.length){ console.log('✗ '+label+':值不是陣列 → '+notArr.join(', ')); errors++; }
  if(selfRef.length){ console.log('✗ '+label+':取消自己 → '+selfRef.join(', ')); errors++; }
  const stale=[...allowed].filter(x=>!used.has(x));
  if(stale.length){ console.log('! '+label+':KNOWN_DEAD 內的 '+stale.join(', ')+' 已不再使用,可以刪除'); warns++; }
  if(used.size) console.log('! '+label+':已知失效引用(無害)→ '+[...used].join(', '));
  if(!bad.length&&!notArr.length&&!selfRef.length&&!dup.length) console.log('✓ '+label+':'+Object.keys(S).length+' 條規則、'+ids.size+' 個番種,全部對得上');
}
console.log(errors?('\n未通過:'+errors+' 項錯誤'):('\n通過('+checked+' 套有不複合規則的番表'+(warns?','+warns+' 項提示':'')+')'));
process.exit(errors?1:0);
