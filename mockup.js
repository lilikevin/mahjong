(function(){
'use strict';
if(!window.MJ){const a=document.getElementById('app');if(a)a.textContent='計番引擎未能載入，請確認 engine.js 已上傳。';return;}
const APP_VERSION='2.0.11';
const DEV_IG='kevinli999';
let M=window.MJ;
const KEY='mj_v2_full_merge_1';
const PREV_KEY='mj_v2_full_prev_1';
const A2HS_KEY='mj_a2hs_never';
const WIND='東南西北';
const CHI='上(吃)';
const DEFAULT_THEME={bg:'#0f2a1f',card:'#16382b',btn:'#1d4a38',acc:'#e6b422'};
const DEFAULT_FLAGS=[['ting','叮'],['qiangkong','搶槓'],['huashang','花上自摸'],['kongshang','槓上自摸'],['haidi','海底撈月'],['tianhu','天胡'],['dihu','地胡'],['renhu','人胡'],['tianting','天叮'],['shuangxiang','雙響'],['sanxiang','三響']];
const SCHEMES=[
 ['經典綠',{bg:'#0f2a1f',card:'#16382b',btn:'#1d4a38',acc:'#e6b422'}],
 ['夜藍',{bg:'#0f1f33',card:'#172b45',btn:'#1f3d63',acc:'#3dd6c6'}],
 ['酒紅金',{bg:'#2a0f14',card:'#3a1a20',btn:'#5a2530',acc:'#e6b422'}],
 ['黑金',{bg:'#0b0b0b',card:'#202020',btn:'#333b42',acc:'#e6b422'}],
 ['紫夜',{bg:'#1f1630',card:'#2c2142',btn:'#43336b',acc:'#ff7eb6'}],
 ['OLED純黑',{bg:'#000000',card:'#121212',btn:'#1e1e1e',acc:'#e6b422'}]
];
const THEME_LABEL={bg:'頁面背景',card:'格子 / 卡片',btn:'按鈕',acc:'強調色(選中、金額、標題)'};
const PRESET_NAME={1:'預設 #1 陶源麻雀王大賽番數表',2:'預設 #2 香港麻雀協會總例(2025-07-28 修訂)',3:'預設 #3 台牌百搭番數表',4:'預設 #4 港式台牌 app 預設(hoitoi.hk)'};
const HK_PRESETS={'8-64':{name:'8番64',cap:8,scale:1},'10-128':{name:'10番128(二五雞)',cap:10,scale:1},'10-256':{name:'10番256(五一)',cap:10,scale:2}};
const HK_BASE={1:2,2:4,3:8,4:16,5:24,6:32,7:48,8:64,9:96,10:128};
const PH_FANS=[
 ['guanshou','冚手糊'],['gsg','槓上槓摸'],['ggg','槓槓槓摸'],['hedi','河底撈魚'],['haidi1','海底撈月(一筒)'],
 ['wuhua','無花'],['wuzi','無字'],['dayu5','大於五'],['xiaoyu5','小於五'],['lanyise','藍一色'],['lvyise','綠一色'],
 ['quanyaojiu','全么九'],['xwaiyu','小外語通'],['dwaiyu','大外語通'],['jishi','即食'],['menting','門清聽牌'],
 ['daji40','大雞糊(純,無其他番)'],['daji60','大雞糊(另有番數,照計)'],['hunx30','混帶X(檔位一)'],['hunx20','混帶X(檔位二)'],['hunx10','混帶X(檔位三)'],
 ['budalong','不搭(龍)'],['budafeng','不搭(逢)'],['huashang_n','花上自摸(1×N+1)']
].map(a=>({id:a[0],name:a[1]}));
const HUAHU=[['huahu7','花糊(七搶一)',30],['huahu8','花糊(自摸兩台花)',40]];
const OPT_INST=[
 {id:'xue',name:'雪(罰)',mode:'payall'},{id:'fanxue',name:'反雪(罰)',mode:'payall'},{id:'bing',name:'冰(罰)',mode:'payall'},{id:'fanbing',name:'反冰(罰)',mode:'payall'},
 {id:'weidou',name:'圍骰(莊家收其餘三家)',mode:'all'},{id:'wenzhuang',name:'問莊圍三',mode:'all'},{id:'wangkai',name:'忘開暗槓(罰,付其餘三家)',mode:'payall'},
 {id:'zhuifan',name:'追番子(付其餘三家)',mode:'payall'},{id:'zhuikai',name:'追開章(付其餘三家)',mode:'payall'}
];
const defHK=()=>({preset:'10-128',minFan:3,bao12:true,baoSan:true,flowers:false,renzhuang:true,ratio:0.5,over:{}});
const PLAYER_EMOJIS=['🐉','🐯','🐼','🦊','🐱','🐶','🦁','🐸','🐰','🐨','🐵','🐧','🦉','🐢','🦋','🐙','🌸','🌻','🍀','⭐','🌙','🔥','🍉','🍊'];
const DEFAULT_AVATARS=PLAYER_EMOJIS.slice(0,4);
const defState=()=>({game:null,avatars:DEFAULT_AVATARS.slice(),playersReady:false,names:['玩家1','玩家2','玩家3','玩家4'],seat:[0,1,2,3],dealerSeat:0,streak:0,wind:0,history:[],ledger:[],cfg:{fanValue:1,baseMult:5,minFan:0,drawKeeps:true,preset:1,wildLimit:4,wildPreset:3,wildMeld:false,wildNoMult:true,wildMultN:3,kongKeep:{1:false,2:false,3:false,4:true},overs:{1:{},2:{},3:{},4:{},hk:{}},instAmts:{1:{},2:{},3:{},4:{},hk:{}},customTables:[],activeCustom:{},hk:defHK(),theme:Object.assign({},DEFAULT_THEME),useSegment:true,wizard:false,largeFont:false,useShortAnim:true}});
function norm(j){
  const d=defState(); const s=Object.assign(d,j,{cfg:Object.assign(d.cfg,j.cfg||{}),ledger:j.ledger||[]});
  const th=Object.assign({},DEFAULT_THEME,(j.cfg&&j.cfg.theme)||{});
  if(j.cfg&&j.cfg.bg&&!(j.cfg.theme&&j.cfg.theme.bg)) th.bg=j.cfg.bg;
  s.cfg.theme=th;
  const c=s.cfg;
  { const seen=new Set(); c.customTables=(Array.isArray(c.customTables)?c.customTables:[]).map(cleanTable).filter(Boolean).slice(0,40).map(t=>{ if(!t.id||seen.has(t.id)) t.id=newTableId(seen); seen.add(t.id); return t; });
    const ac={}; if(c.activeCustom&&typeof c.activeCustom==='object') Object.keys(c.activeCustom).forEach(k=>{ if(c.customTables.some(t=>t.id===c.activeCustom[k])) ac[k]=c.activeCustom[k]; }); c.activeCustom=ac; }
  if(!c.overs||typeof c.overs!=='object') c.overs={1:(j.cfg&&j.cfg.over)||{},2:{},3:{}};
  ['1','2','3','4','hk','wild1','wild2','wild3','wild4'].forEach(k=>{ if(!c.overs[k]) c.overs[k]={}; });
  if(!c.instAmts||typeof c.instAmts!=='object') c.instAmts={};
  ['1','2','3','4','hk','wild1','wild2','wild3','wild4'].forEach(k=>{ if(!c.instAmts[k]) c.instAmts[k]={}; });
  c.hk=Object.assign(defHK(),c.hk||{}); if(!c.hk.over) c.hk.over={};
  if(!HK_PRESETS[c.hk.preset]) c.hk.preset='10-128';
  if([1,2,3,4].indexOf(c.preset)<0) c.preset=1;
  c.wildLimit=(Number.isInteger(+c.wildLimit)&&+c.wildLimit>=1&&+c.wildLimit<=50)?+c.wildLimit:4;
  c.wildPreset=[1,2,3,4].includes(+c.wildPreset)?+c.wildPreset:3;
  c.wildMeld=!!c.wildMeld; c.wildNoMult=c.wildNoMult!==false;
  c.wildMultN=(Number.isFinite(+c.wildMultN)&&+c.wildMultN>=1&&+c.wildMultN<=100)?+c.wildMultN:3;
  c.kongKeep=Object.assign({1:false,2:false,3:false,4:true},c.kongKeep||{});
  c.useSegment=true; c.wizard=false; c.largeFont=!!c.largeFont; c.useShortAnim=c.useShortAnim!==false;
  if(s.game!=='tw'&&s.game!=='hk'&&s.game!=='wild') s.game=(s.history&&s.history.length)?'tw':null;
  s.names=[0,1,2,3].map(i=>String((s.names||[])[i]||('玩家'+(i+1))).slice(0,10));
  s.avatars=[0,1,2,3].map(i=>PLAYER_EMOJIS.includes((j.avatars||[])[i])?j.avatars[i]:DEFAULT_AVATARS[i]);
  s.playersReady=typeof j.playersReady==='boolean'?j.playersReady:!!(s.history&&s.history.length);
  return s;
}
function load(){
  try{ const j=JSON.parse(localStorage.getItem(KEY)); if(j&&j.names) return norm(j); }catch(e){}
  return defState();
}
function saveDraft(){
  try{
    if(draftCache&&!hasCurrentData()&&pending.length===0&&!hasEntryDraft())return;
    if(!hasCurrentData() && pending.length===0 && !hasEntryDraft()){ localStorage.removeItem(DRAFT_KEY); return; }
    const draft={
      E:JSON.parse(JSON.stringify(E)),
      pending:JSON.parse(JSON.stringify(pending)),
      entryStep,
      ui:uiCaptureResume(),
      ctx:{game:S.game, namesHash:S.names.join('|'), seat:S.seat.join(','), dealer:S.dealerSeat, wind:S.wind, histLen:S.history.length, streak:S.streak,historyStamp:S.history.map(r=>[r.id,r.edited||0,(r.revisions||[]).length].join(':')).join('|')},
      ts:Date.now()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }catch(e){}
}
let draftCache=null;
function peekDraft(){
  try{
    const j=JSON.parse(localStorage.getItem(DRAFT_KEY));
    if(!j||!j.E||!j.ts) return null;
    if(Date.now()-j.ts > 24*3600*1000){ clearDraft(); return null; }
    if(j.ctx){
      if(j.ctx.game!==S.game) return null;
      if(j.ctx.namesHash!==S.names.join('|')) return null;
      if(j.ctx.seat!==S.seat.join(',')) return null;
      if(j.ctx.histLen!==S.history.length) return null;
      if(j.ctx.historyStamp!=null&&j.ctx.historyStamp!==S.history.map(r=>[r.id,r.edited||0,(r.revisions||[]).length].join(':')).join('|'))return null;
      if(j.ctx.dealer!==S.dealerSeat) return null;
      if(j.ctx.wind!==S.wind) return null;
      if(j.ctx.streak!==S.streak) return null;
    }
    return j;
  }catch(e){ return null; }
}
function loadDraft(){
  const j=peekDraft();
  if(!j) return false;
  if(hasCurrentData() || pending.length>0) return false;
  // validate err
  try{
    const pendRon = (j.pending||[]).map(w=>w.ron).filter(Boolean);
    const err = checkRonSet(pendRon, {allowPartial:true}).filter(e=>!e.includes('牌數待確認')&&!e.includes('請先指定共同放炮牌'));
    if(err && err.length){ clearDraft(); return false; }
  }catch(e){ clearDraft(); return false; }
  draftCache=j;
  return true;
}
function applyDraft(){
  if(!draftCache) return false;
  try{
    E=Object.assign(newEntry(), draftCache.E);
    pending=draftCache.pending||[];
    if(draftCache.entryStep) entryStep=draftCache.entryStep;
    uiResume=uiValidResume(draftCache.ui)||uiCurrentLocation();
    draftCache=null;
    return true;
  }catch(e){ return false; }
}
function discardDraft(){
  draftCache=null;
  clearDraft();
}

function clearDraft(){ try{ localStorage.removeItem(DRAFT_KEY);}catch(e){} }
function getStorageSizeKB(){
  try{
    let total=0;
    for(let k in localStorage){ if(localStorage.hasOwnProperty(k)){ total+= (localStorage[k].length*2); } }
    return Math.round(total/1024);
  }catch(e){ return 0; }
}

let S=load();
const DRAFT_KEY='mj_v2_full_mj_draft_v1_5';
let lastUndo=null;
let undoTimer=null;
let historyShowAll=false;
const isHK=()=>S.game==='hk';
const isWild=()=>S.game==='wild';
const curPreset=()=>isWild()?S.cfg.wildPreset:S.cfg.preset;
const baseFan=()=>0;
const SETS=()=>isHK()?4:5;
function pickM(){
  if(S.game==='hk'&&window.MJHK){ M=window.MJHK; return; }
  const p=isWild()?S.cfg.wildPreset:S.cfg.preset;
  const b=(p===2&&window.MJ2)?window.MJ2:(p===3&&window.MJ3)?window.MJ3:(p===4&&window.MJ4)?window.MJ4:window.MJ;
  M=(p!==4&&window.MJRULES)?window.MJRULES.wrap(b):b;
}
pickM();
if(!window.MJ4){ try{ const sc=document.createElement('script'); sc.src='engine4.js'; sc.onload=()=>{ pickM(); render(); }; document.head.appendChild(sc); }catch(e){} }
let lastSaveWarn=0;
const save=(persistState=true)=>{ if(uiWizard||!persistState)return;finalizeFinancialSnapshots(); try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){ const t=Date.now(); if(t-lastSaveWarn>8000){ lastSaveWarn=t; toast('儲存失敗(記憶體可能已滿)。請到「設定」匯出備份'); } } try{ saveDraft(); }catch(e){} };
const newEntry=()=>({shapeDone:false,hkKongs:{},winner:null,self:true,disc:null,hkWin:null,all:[],wildGroups:[],jsel:{},adjust:0,pickRep:null,marks:Array(34).fill(0),kongOpen:{},melds:[],hand:[],win:null,partBad:false,mode:'pick',flowers:Array(8).fill(false),flags:{},excl:{},extra:[],bao:null});
let _savedTab=null; try{ _savedTab=localStorage.getItem('mj_v2_full_tab'); }catch(e){}
let E=newEntry(), pending=[], tab=(_savedTab && ['chooser','players','calc','table','history','settings'].includes(_savedTab) ? _savedTab : (S.game? 'table' : 'chooser')), wildPick=false;
let inst={id:null,mode:'one',payee:null,payer:null,mult:1};
let upd=null, updDismissed=false, checking=false, lastUpdateCheck=0, a2hsHidden=false, buildInfo=null, storyImg=null, ruleHelp=false, tblDraft='', fileInput=null;
const esc=s=>String(s).replace(/[&<>"'`]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c]));
const seatOf=p=>S.seat.indexOf(p);
const dealerPid=()=>S.seat[S.dealerSeat];
const windIdx=p=>(seatOf(p)-S.dealerSeat+4)%4;
const windOf=p=>WIND[windIdx(p)];
const nm=p=>esc(S.names[p]);
function tileName(t){if(t===34)return '百搭';if(t==null)return '未選';return M.tName(t)||'未知牌';}
const pkey=()=>isHK()?'hk':isWild()?'wild'+S.cfg.wildPreset:String(S.cfg.preset);
const OV=()=>S.cfg.overs[pkey()]||(S.cfg.overs[pkey()]={});
function phList(){ return (isHK()||curPreset()===4)?[]:PH_FANS.filter(p=>!M.FANS.some(f=>f.id===p.id)); }
function huahuList(){ return (isHK()||curPreset()===4)?[]:HUAHU.map(h=>({id:h[0],name:h[1]})); }
function huahuDef(id){ const d=HUAHU.find(x=>x[0]===id); return (curPreset()===2&&d)?d[2]:0; }
function fanList(){
  return diRow().concat(M.FANS).concat(phList().map(p=>({id:p.id,name:p.name,fan:0,fanC:null,manual:true})))
    .concat(huahuList().map(h=>({id:h.id,name:h.name,fan:huahuDef(h.id),fanC:null,manual:true})));
}
function RL(){
  const r=M.buildRules(OV());
  phList().forEach(p=>{ const o=OV()[p.id]; r[p.id]={id:p.id,name:p.name,fan:(o&&o.fan!=null&&!isNaN(o.fan))?+o.fan:0,fanC:null,manual:true}; });
  huahuList().forEach(h=>{ const o=OV()[h.id]; r[h.id]={id:h.id,name:h.name,fan:(o&&o.fan!=null&&!isNaN(o.fan))?+o.fan:huahuDef(h.id),fanC:null,manual:true}; });
  if(!isHK()&&!r.di){ const o=OV().di; r.di={id:'di',name:'底',fan:(o&&o.fan!=null&&!isNaN(o.fan))?+o.fan:S.cfg.baseMult,fanC:null,manual:false}; }
  return r;
}
function hkCap(){ return HK_PRESETS[S.cfg.hk.preset].cap; }
function hkRon(f){
  const h=S.cfg.hk, pr=HK_PRESETS[h.preset]; const ff=Math.max(1,Math.min(Math.floor(f),pr.cap));
  const o=h.over[ff]; return (o!=null&&!isNaN(o))?+o:HK_BASE[ff]*pr.scale;
}
function hkShare(f){ return Math.round(hkRon(f)*S.cfg.hk.ratio); }
function settleHK(ws){
  const d=[0,0,0,0];
  ws.forEach(w=>{
    const f=w.total, ron=hkRon(f), sh=hkShare(f);
    if(w.qiang&&!w.self){ d[w.disc]-=3*sh; d[w.p]+=3*sh; }
    else if(w.self){
      if(w.bao!=null&&w.bao!==w.p){ d[w.bao]-=3*sh; d[w.p]+=3*sh; }
      else [0,1,2,3].forEach(q=>{ if(q!==w.p){ d[q]-=sh; d[w.p]+=sh; } });
    } else { d[w.disc]-=ron; d[w.p]+=ron; }
  });
  return d;
}
function instList(){
  const base=M.INSTANT.map(x=>Object.assign({},x));
  if(isHK()) base.forEach(x=>{ if(x.amt==='cap') x.amt=hkRon(99); });
  else OPT_INST.forEach(o=>{ if(!base.some(x=>x.id===o.id)) base.push({id:o.id,name:o.name,amt:0,mode:o.mode}); });
  return base;
}
function instAmt(I){ const o=S.cfg.instAmts[pkey()]||{}; return o[I.id]!=null&&!isNaN(o[I.id])?+o[I.id]:I.amt; }
const money=n=>(n>0?'+':'')+n;
const copyL=l=>l.map(r=>({from:r.from,to:r.to,amt:r.amt,k:r.k}));
function balances(){ const b=[0,0,0,0]; S.history.forEach(r=>r.deltas.forEach((d,i)=>b[i]+=d)); return b; }
function pendingBal(){ const b=[0,0,0,0]; S.ledger.forEach(r=>{ b[r.to]+=r.amt; b[r.from]-=r.amt; }); return b; }
function toast(t){ const e=document.getElementById('toast'); e.textContent=t; e.className='show'; setTimeout(()=>{e.className='';},2200); }

function isApple(){
  try{ const ua=navigator.userAgent||''; return /iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1); }catch(e){ return false; }
}
function isStandalone(){
  try{ return navigator.standalone===true||(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches); }catch(e){ return false; }
}
if(isStandalone())document.documentElement.classList.add('ios-standalone');
function isSafariApple(){ try{ const ua=navigator.userAgent||''; return !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua); }catch(e){ return true; } }
function a2hsSteps(){
  return '<ol class="steps-list"><li>'+(isSafariApple()?'請保持在 <b>Safari</b> 開啟本頁。':'先在分享選單選擇「在 Safari 中打開」，再開啟本頁。')+'</li><li>點 Safari 工具列的<b>分享按鈕</b>（方框向上箭頭 ⬆︎；工具列可能在畫面底部或頂部）。</li><li>在分享選單向下滑，點<b>「加入主畫面」</b>；若沒看到，向下捲動選單或點「編輯動作」尋找。</li><li>確認名稱後點右上角<b>「加入」</b>，再從 iPhone 主畫面圖示開啟。</li></ol><div class="hint">主畫面 App 與 Safari 的資料彼此獨立。若 Safari 已有牌局紀錄，請先到「設定 → 複製備份」，再於主畫面 App 用「貼上匯入」還原。</div>';
}
function a2hsBanner(){
  if(!isApple()||isStandalone()||a2hsHidden) return '';
  try{ if(localStorage.getItem(A2HS_KEY)) return ''; }catch(e){}
  return '<div class="note"><b>將麻雀計番加入 iPhone／iPad 主畫面</b><div class="hint">在 Safari 點「分享」→「加入主畫面」，即可像 App 一樣全螢幕開啟。</div><div class="btnrow"><button class="primary" data-act="uiA2HSHowto">查看步驟</button><button data-act="a2hsLater">稍後</button><button data-act="a2hsNever">不再提示</button></div></div>';
}

function hex2rgb(h){ h=(h||'#000000').replace('#',''); if(h.length===3) h=h.split('').map(c=>c+c).join(''); const n=parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
function rgb2hex(a){ return '#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join(''); }
function mix(c,t,f){ const a=hex2rgb(c), b=hex2rgb(t); return rgb2hex(a.map((v,i)=>v+(b[i]-v)*f)); }
function lum(c){ const a=hex2rgb(c).map(v=>{ v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4); }); return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]; }
const STATIC_CSS=`
.editor-tools button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:5px 4px!important}.editor-compact-tools button{white-space:nowrap}
.editor-live{position:sticky;top:0;z-index:4;margin:4px 0 6px;padding:8px 12px;border-radius:10px;font-size:15px;line-height:1.3;text-align:center;background:var(--card);border:1px solid var(--bd);box-sizing:border-box;width:100%;max-width:680px;margin-left:auto;margin-right:auto}.editor-live.good{background:#14502d;border-color:#2f8f57;color:#eafff0}.editor-live.bad{background:#6a1d24;border-color:#d9534f;color:#ffecec}.editor-live.idle{opacity:.85}.editor-live b{font-size:20px}.editor-live small{opacity:.85;font-size:12px}
.overbox{outline:2px solid #ff5a5f!important;outline-offset:1px;animation:mjshake .15s linear 2}@keyframes mjshake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
.lockdim{opacity:.28!important;filter:grayscale(1)}.lockhi{outline:3px solid var(--acc)!important;outline-offset:1px;animation:mjpulse 1.2s ease-in-out infinite}@keyframes mjpulse{50%{box-shadow:0 0 0 6px rgba(230,180,34,.4)}}
@media (prefers-reduced-motion:reduce){.overbox,.lockhi{animation:none}}
.quickpanel .qrow{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 4px;border-bottom:1px solid var(--bd)}.quickpanel .qrow.on{background:rgba(230,180,34,.12);border-radius:8px}.quickpanel .qstep{display:flex;align-items:center;gap:8px}.quickpanel .qstep button{min-width:44px;min-height:44px;padding:0;font-size:20px}.quickpanel .qstep b{min-width:22px;text-align:center;font-size:18px}
.seat,.seat *{text-decoration:none!important;-webkit-text-decoration:none!important;text-decoration-line:none!important;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.seat{-webkit-tap-highlight-color:transparent}
.payrow{display:grid;gap:6px;margin:6px 0}.payrow>button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:8px 4px;min-width:0;text-align:center}.payrow .pl{display:flex;align-items:center;justify-content:center;gap:6px;min-width:0;max-width:100%}.payrow .em{font-size:1.5em;line-height:1;flex:0 0 auto}.payrow .nm{min-width:0;overflow-wrap:anywhere;word-break:break-word;line-height:1.2;text-align:left}.payrow small{opacity:.8}
.editbox{background:var(--bg);color:#eef5ef;border:1px solid var(--bd);border-radius:14px;padding:14px;text-align:left;max-height:88vh;overflow:auto}.editbox h3{margin:0 0 8px;color:#eef5ef}.editbox .card{margin:8px 0}.editbox .hint{color:#b9cbbd}.edl{display:block;margin:8px 0;font-size:14px;color:#eef5ef}.edl select,.edl input{margin-top:4px;color:#eef5ef;background:var(--card2)!important;border:1px solid var(--bd);border-radius:8px;padding:8px;font-size:16px}details summary{cursor:pointer;color:var(--acc);font-size:13px;min-height:0}
.zl{font-size:13px;color:#9db;margin:10px 0 4px}
.steps-list{margin:8px 0 8px 18px;padding:0;font-size:14px;line-height:1.6}
.swatches{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.swatches button{flex:1 0 28%;padding:10px 4px;border:2px solid rgba(255,255,255,.25)}
.colorrow{margin:14px 0 4px;font-weight:600;color:var(--acc)}
.pick{position:relative;display:flex!important;align-items:center;gap:10px;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:8px 10px;color:#eef5ef!important;font-size:14px!important}
.pick .chip{width:38px;height:38px;border-radius:8px;border:2px solid rgba(255,255,255,.55);flex:0 0 auto}
.pick .hexv{flex:1;font-family:ui-monospace,Menlo,monospace;font-size:14px}
.pick .pbtn{background:var(--btn2);border:1px solid var(--bd);border-radius:8px;padding:8px 12px;font-size:14px}
.pick input[type=color]{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;border:0;padding:0;cursor:pointer}
.presetbtns{display:flex;flex-direction:column;gap:6px;margin:8px 0}
.presetbtns button{text-align:left;padding:12px;line-height:1.35}
.presetbtns small{display:block;opacity:.8;font-size:12px;margin-top:2px}
.presetrow{display:flex;gap:6px;margin:8px 0}.presetrow button{flex:1;padding:12px 4px;line-height:1.3}
.chooser{max-width:480px;margin:0 auto;padding:40px 16px}
.chooser h2{text-align:center;color:var(--acc);margin:0 0 6px}.chooser .sub{text-align:center;color:#9db;margin-bottom:18px;font-size:13px}
.chooser button{width:100%;text-align:left;padding:18px 14px;margin-bottom:10px;font-size:17px;line-height:1.4}
.chooser button small{display:block;font-size:12px;opacity:.8;margin-top:4px;font-weight:normal}
.dev{margin-top:8px;font-size:13px;color:#b9d6c4}.dev a{color:var(--acc);font-weight:600}
.mt{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:32px;height:44px;padding:0!important;background:#f7f3e3!important;color:#222;border:1px solid #bbb!important;border-bottom:4px solid #2f8f57!important;border-radius:5px;line-height:1;font-weight:700;box-shadow:0 1px 3px #0007;font-family:inherit}
.mt b{font-size:19px;font-weight:700}.mt i{font-style:normal;font-size:12px;margin-top:2px}
.mt.s0{color:#a0201a}.mt.s1{color:#1c4fa0}.mt.s2{color:#1a7a3a}
.mt.hon b{font-size:24px}.mt.h4{color:#c0281f}.mt.h5{color:#1a7a3a}.mt.h0,.mt.h1,.mt.h2,.mt.h3{color:#222}
.mt.h6 b{width:18px;height:28px;border:2px solid #2a4a8a;border-radius:3px;color:transparent}
.mt.back{background:#1a7a3a!important;border-color:#0f5a2a!important;border-bottom-width:4px!important}
.mt.back b,.mt.back i{visibility:hidden}
.mt.big{width:38px;height:52px;outline:3px solid var(--acc);outline-offset:1px}
.mt.mark{outline:3px solid var(--acc);outline-offset:1px}
.mt.mk2{background:#cfe9d6!important;border-bottom-color:var(--acc)!important;transform:translateY(-4px)}
.mg{display:inline-flex;flex-direction:column;align-items:center;gap:3px;padding:5px 6px;background:var(--btn2);border-radius:8px;margin:2px;cursor:pointer}
.mg .row{display:flex;gap:1px}
.mg small{font-size:11px;opacity:.9;display:flex;gap:8px;align-items:center}
.mg .kt{text-decoration:underline;padding:2px 4px}
.tiles{display:flex;flex-wrap:wrap;gap:4px}
.zone.tap{cursor:pointer;min-height:70px}
.modebar{min-height:58px;display:flex;align-items:center;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:8px 10px;font-size:13px;line-height:1.45;color:#eef5ef;margin:6px 0}
.poolbox{min-height:60px}
.askcard{margin:10px 0}
.askcard .seg button{padding:14px 4px;font-size:16px;font-weight:600}
.stl .mt{width:22px;height:31px;border-bottom-width:3px!important}.stl .mt b{font-size:14px}.stl .mt i{font-size:9px;margin-top:1px}.stl .mt.hon b{font-size:17px}.stl .mt.h6 b{width:12px;height:18px;border-width:1.5px}
button.on::after{content:' ✓'}nav button.on::after{content:''}.mt.on::after{content:''}
.modal{position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.85);z-index:20;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}.mbox{max-width:420px;width:100%}
`;
const DYN_CSS=`
/* 1.5 UX: 44px touch targets, 8px gap, 16px input, short anim respecting reduced-motion */
button, .t, .mt, [data-act], select{ min-height:44px; min-width:44px; }
.t{ padding:8px 6px; margin:4px; }
[data-player-name], input[type=text], input[type=number], select{ font-size:16px !important; }
.modebar-fixed{ height:40px; line-height:40px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; background:var(--card); border:1px solid var(--bd); padding:0 10px; position:sticky; top:0; z-index:2; }
.sticky-footer{ position:sticky; bottom:0; background:var(--card); border-top:1px solid var(--bd); padding:8px; padding-bottom:calc(8px + env(safe-area-inset-bottom)); z-index:5; }
  nav{ padding-bottom:env(safe-area-inset-bottom); }
.chip{ display:inline-flex; align-items:center; gap:6px; background:var(--btn); border:1px solid var(--bd); border-radius:999px; padding:6px 10px; margin:4px; }
.chip .x{ cursor:pointer; font-weight:bold; }
.t.selected, .mt.selected{ transform:scale(1.08); transition: transform 150ms cubic-bezier(0.2,0,0,1); }
.no-anim .t.selected, .no-anim .mt.selected{ transform:none !important; transition:none !important; }
@media (prefers-reduced-motion: reduce){
  .t.selected, .mt.selected, .modebar-fixed, .sticky-footer{ transition:none !important; transform:none !important; animation:none !important; }
}
.large-font .bal{ font-size:1.6em !important; }
.large-font .pn{ font-size:1.3em !important; }
.large-font .tr, .large-font .total, .large-font .fan, .large-font .status{ font-size:1.2em !important; }
.large-font .mt{ width:36px !important; height:50px !important; }
.badge{ display:inline-block; background:var(--acc); color:var(--onacc); border-radius:999px; padding:2px 8px; font-size:12px; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:middle; }
.oled-contrast .mt{ border-bottom-color:#e6b422 !important; }
.oled-contrast .t{ border:1px solid #444 !important; }
.progress{ height:6px; background:var(--bd); border-radius:3px; overflow:hidden; }
.progress i{ display:block; height:100%; background:var(--acc); transition: width 200ms; }
/* One five-mode editor; three reserved rows at every tile count. */
.table-feedback{margin-top:10px}
.flower-host{container-type:inline-size;container-name:flowerbuttons;width:100%;max-width:100%}
.flower-host .flower-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;width:100%}
.flower-grid .fl{box-sizing:border-box;width:100%!important;min-width:0!important;min-height:44px;margin:0!important;flex:none!important;padding:7px 2px}
@container flowerbuttons (min-width:440px){.flower-host .flower-grid{grid-template-columns:repeat(8,minmax(0,1fr))}}
.pal{display:flex;flex-direction:column;gap:6px;margin:8px 0;max-width:100%}
.pal>.row{display:grid!important;grid-template-columns:repeat(9,minmax(0,1fr));gap:4px;width:100%}
.pal>.row>.t{width:100%!important;min-width:0!important;min-height:44px;margin:0!important;padding:6px 0!important;flex:none!important;font-size:15px;line-height:1.1;box-sizing:border-box}
.body .grid2{grid-template-columns:repeat(2,minmax(0,1fr))}.body .grid2>*{min-width:0}
.body .grid2 input:not([type=checkbox]),.body .grid2 select{box-sizing:border-box;max-width:100%;min-width:0;width:100%}
.body .btnrow{flex-wrap:wrap}.adjrow input{box-sizing:border-box;flex:1 1 100%!important;order:-1;min-width:0!important;text-align:center}.adjrow button{flex:1 1 44px;min-width:44px}
.editor-open{overflow:hidden!important;overscroll-behavior:none}
.editor-screen,.editor-screen *{box-sizing:border-box}
.editor-screen{position:fixed;left:0;right:0;top:0;width:100%;height:var(--editor-height,100vh);z-index:30;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:inherit;padding-bottom:env(safe-area-inset-bottom,0px)}
.editor-head{display:flex;align-items:center;justify-content:space-between;gap:8px;flex:none;min-height:44px;padding:4px 10px;border-bottom:1px solid var(--bd);font-size:15px}
.editor-head>div:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.editor-head button{min-height:36px;min-width:70px;flex:none;padding:6px 8px;font-size:14px}
.editor-head-actions{display:flex;gap:4px;align-items:center;flex:none}.editor-compact-tools{display:none}
.editor-main{display:flex;flex-direction:column;gap:6px;flex:1;min-height:0;padding:6px 12px;overflow:auto;overscroll-behavior:contain}
.editor-stats{flex:none;height:24px;line-height:24px;font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--acc)}
.editor-pile{box-sizing:border-box;display:flex;align-items:center;justify-content:center;flex:none;height:var(--pile-frame-h,192px);overflow:auto;overscroll-behavior:contain;padding:0 4px;max-width:680px;width:100%;margin:0 auto}
.editor-grid{display:grid!important;grid-template-columns:repeat(var(--pile-cols,6),var(--tile-w,44px));grid-auto-rows:var(--tile-h,58px);justify-content:center;align-content:center;gap:6px;width:100%;min-width:0;flex:none}
.editor-grid>.mt,.editor-grid>.tile-slot{position:relative;width:var(--tile-w,44px)!important;min-width:0!important;max-width:none!important;height:var(--tile-h,58px)!important;min-height:0!important;max-height:none!important;margin:0!important;padding:0!important;flex:none!important;transform:none!important;transition:none!important;animation:none!important;touch-action:manipulation}
.editor-grid>.mt b{font-size:var(--face-size,22px)}.editor-grid>.mt i{font-size:var(--suit-size,11px)}.editor-grid>.mt.hon b{font-size:calc(var(--face-size,22px) + 2px)}
.editor-grid>.mt.mk2{transform:none!important;background:#cfe9d6!important}.editor-grid>.mt.mark{outline-offset:-3px}.editor-grid>.mt:disabled{opacity:1}.editor-grid>.mt.unavailable:disabled{opacity:.4}
.tile-slot{border:1px dashed var(--bd);border-radius:5px;opacity:.24;background:transparent}
.tile-badge{position:absolute;top:-4px;right:-4px;z-index:2;font-style:normal;font-size:var(--badge-size,10px);line-height:1;background:var(--acc);color:var(--onacc);border-radius:9px;padding:3px 4px;pointer-events:none}
.editor-tools{flex:none;display:flex;gap:6px;height:34px;max-width:680px;width:100%;margin:0 auto}.editor-tools button{flex:1;min-height:34px;padding:5px 8px;font-size:14px}
.editor-panel{flex:1;min-height:192px;overflow:auto;overscroll-behavior:contain;display:flex;align-items:center;justify-content:center}
.editor-panel>.pal{width:100%;max-width:620px;margin:0 auto}
.editor-panel .pal>.row>.t{height:42px;min-height:42px!important;max-height:42px;font-size:14px;border-radius:6px}
.editor-panel .pal .s0{color:#a0201a}.editor-panel .pal .s1{color:#1c4fa0}.editor-panel .pal .s2{color:#1a7a3a}.editor-panel .pal .s3{color:#222}.editor-panel .pal .t{background:#f7f3e3!important}
.editor-group-tools{width:100%;max-width:650px;display:flex;flex-direction:column;gap:6px;font-size:14px}
.editor-meld-groups,.editor-hk-quads{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:6px}
.editor-meld-groups .mg,.editor-hk-quad{flex:0 0 auto;min-width:0;min-height:0;margin:0;padding:5px 6px;max-width:100%;border-radius:8px;background:var(--btn2)}
.editor-meld-groups .mg .row,.editor-hk-quad>.row{display:flex!important;flex-wrap:nowrap;gap:2px;justify-content:center}
.editor-meld-groups .mt,.editor-hk-quad .mt{flex:0 0 30px;width:30px!important;min-width:0!important;height:42px!important;min-height:0!important;padding:0!important;margin:0!important;transform:none!important;animation:none!important}
.editor-meld-groups .mt b,.editor-hk-quad .mt b{font-size:18px}.editor-meld-groups .mt i,.editor-hk-quad .mt i{font-size:10px}
.editor-meld-groups .mg small{font-size:11px;line-height:1.2;white-space:normal}
.editor-group-actions,.editor-menqing,.editor-kong-choices{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:5px}
.editor-group-tools button{min-height:34px;min-width:0;padding:5px;font-size:12px}
.editor-group-tools .editor-menqing{gap:10px;margin:14px 0}
.editor-group-tools .editor-menqing span{font-size:18px;font-weight:600}
.editor-group-tools .editor-menqing button{min-height:52px;min-width:110px;padding:10px 22px;font-size:20px;font-weight:700}
.editor-kong-choices button.on:after,.editor-menqing button.on:after{content:''}
.editor-flowers{width:100%;max-width:650px}.editor-panel-title{font-size:14px;color:var(--acc);margin-bottom:8px}
.editor-panel .editor-flags{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;width:100%;max-width:650px;margin:auto}
.editor-flags label{display:flex;align-items:center;gap:6px;min-height:44px;padding:6px;border-radius:8px;font-size:13px;background:var(--card)}
.editor-flags input{flex:none;min-width:0;min-height:0;width:20px;height:20px}
.editor-win-status{font-size:14px;line-height:1.5;text-align:center;padding:6px}
.editor-footer{flex:none;background:var(--card);border-top:1px solid var(--bd);padding:6px 8px 8px}
.editor-segments{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}
.editor-segments button{min-width:0!important;min-height:44px;padding:7px 0;font-size:13px;line-height:1.15;white-space:nowrap}.editor-segments button.on:after{content:''}
.editor-hint{height:32px;line-height:16px;padding:2px 0;font-size:12px;overflow:hidden}
.editor-finish{display:grid;grid-template-columns:1fr 2fr;gap:6px}.editor-finish button{min-width:0!important;min-height:44px;padding:7px 2px;font-size:14px}
.editor-reviewed{display:flex;align-items:center;justify-content:space-between;gap:8px}.editor-reviewed button{flex:none}
.editor-compact .editor-head{min-height:40px;padding:2px 8px}.editor-compact .editor-head button{min-width:0;min-height:34px;padding:4px 6px;font-size:12px}.editor-compact .editor-compact-tools{display:flex;gap:4px}
.editor-compact .editor-main{padding:4px 12px;gap:6px}.editor-compact .editor-stats{height:20px;line-height:20px;font-size:12px}.editor-compact .editor-tools{display:none}
.editor-compact .editor-panel{min-height:188px}.editor-compact .editor-panel .pal{gap:4px}.editor-compact .editor-panel .pal>.row>.t{height:44px;min-height:44px!important;max-height:44px}
.editor-compact .editor-hint{height:24px;line-height:12px;font-size:11px}
`+
`
body{background:var(--bg)!important}
.card,.status,.tr,.flags label,select,input[type=number]{background:var(--card)!important}
.card,select,input,button,.zone,.prev{border-color:var(--bd)!important}
.zone,.prev,.winzone{background:var(--card2)!important}
.zone{border-style:dashed}
.winzone{border-color:var(--acc)!important}
.zone.active{border-style:solid!important;border-color:var(--acc)!important}
button:not(.t):not(.mt):not(.on):not(.primary):not(.danger){background:var(--btn)!important}
nav button:not(.on){background:transparent!important}
button.on,button.primary,nav button.on{background:var(--acc)!important;border-color:var(--acc)!important;color:var(--onacc)!important}
.status,.sw,.total b,.fan span,.hint a,h3,.colorrow{color:var(--acc)!important}
.seat.dealer{border-color:var(--acc)!important;box-shadow:0 0 0 1px var(--acc)}
.t.win{outline-color:var(--acc)!important}
.meld,.note{background:var(--btn2)!important}
nav{background:var(--nav)!important;border-top-color:var(--bd)!important}
`;
function injectCss(){
  try{
    if(document.getElementById('mj-static')) return;
    const a=document.createElement('style'); a.id='mj-static'; a.textContent=STATIC_CSS; document.head.appendChild(a);
    const b=document.createElement('style'); b.id='mj-dyn'; b.textContent=DYN_CSS; document.head.appendChild(b);const c=document.createElement('link');c.rel='stylesheet';c.href='mockup.css?v=2.0.0-test.23';document.head.appendChild(c);
  }catch(e){}
}
function applyTheme(){
  const t=Object.assign({},DEFAULT_THEME,(S.cfg&&S.cfg.theme)||{});
  try{
    injectCss();
    const r=document.documentElement.style;
    r.setProperty('--bg',t.bg); r.setProperty('--card',t.card); r.setProperty('--card2',mix(t.card,'#000000',0.35));
    r.setProperty('--btn',t.btn); r.setProperty('--btn2',mix(t.btn,'#ffffff',0.12)); r.setProperty('--bd',mix(t.card,'#ffffff',0.22));
    r.setProperty('--acc',t.acc); r.setProperty('--onacc',lum(t.acc)>0.35?'#1a1a1a':'#ffffff'); r.setProperty('--nav',mix(t.bg,'#000000',0.4));
    document.body.style.background=t.bg; r.background=t.bg;
    const m=document.querySelector('meta[name=theme-color]'); if(m) m.setAttribute('content',t.bg);
  }catch(e){}
}

const NUMCH=['','1','2','3','4','5','6','7','8','9'];
function mt(t,o){
  if(t===34){o=o||{};const tag=o.tag||'span';return '<'+tag+' '+(o.attrs||'')+' class="mt '+(o.cls||'')+'" style="color:#8b2670"><b>百</b><i>搭</i></'+tag+'>';}
  o=o||{}; const tag=o.tag||'span';
  const at=(o.attrs||'')+' class="mt '+(t<27?'s'+M.suitOf(t):'hon h'+(t-27))+(o.back?' back':'')+(o.cls?' '+o.cls:'')+'"';
  const inner=(t<27?'<b>'+NUMCH[M.numOf(t)]+'</b><i>'+M.SUITS[M.suitOf(t)]+'</i>':'<b>'+tileName(t)+'</b>')+(o.badge?'<em class="tile-badge">'+esc(o.badge)+'</em>':'');
  return '<'+tag+' '+at+'>'+inner+'</'+tag+'>';
}
function meldGroup(m,i){
  let tiles, cap;
  if(m.t==='chow'){ tiles=[m.tile,m.tile+1,m.tile+2].map(x=>mt(x)).join(''); cap='上(順子)'; }
  else if(m.t==='pung'){ tiles=[0,1,2].map(()=>mt(m.tile)).join(''); cap='碰'; }
  else if(m.open===false){ tiles=mt(m.tile,{back:true})+mt(m.tile)+mt(m.tile)+mt(m.tile,{back:true}); cap='<span class="kt" data-act="kongToggle" data-t="'+m.tile+'">暗槓⇄</span>'; }
  else { tiles=[0,1,2,3].map(()=>mt(m.tile)).join(''); cap='<span class="kt" data-act="kongToggle" data-t="'+m.tile+'">明槓⇄</span>'; }
  return '<div class="mg" data-act="rmMeld" data-i="'+i+'"><div class="row">'+tiles+'</div><small>'+cap+' ✕</small></div>';
}

async function checkUpdate(manual){
  if(checking) return; checking=true; lastUpdateCheck=Date.now();
  try{
    const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});
    if(!r.ok) throw new Error('http');
    const j=await r.json();
    if(!j||typeof j.version!=='string'||!j.version) throw new Error('invalid version metadata');
    if(j&&j.version) buildInfo=j.updated||null;
    if(j&&j.version&&j.version!==APP_VERSION){ upd=j; updDismissed=false; if(manual) toast('發現新版本 '+j.version); }
    else { upd=null; if(manual) toast('目前已是最新版本'); }
  }catch(e){ if(manual) toast('無法檢查更新,請確認網絡'); }
  checking=false; render();
}
async function doUpgrade(){
  toast('正在更新…');
  try{
    if('serviceWorker' in navigator){ const rs=await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r=>r.unregister())); }
    if(window.caches){ const ks=await caches.keys(); await Promise.all(ks.map(k=>caches.delete(k))); }
    const refreshed=await fetch('version.json?refresh='+Date.now(),{cache:'reload'});
    if(!refreshed.ok) throw new Error('version refresh failed');
  }catch(e){ toast('更新準備失敗，請確認網絡後重試'); return; }
  location.reload();
}
function mkTxns(ws,dealer,streak){
  const bonus=1+2*streak, bf=baseFan(), fv=S.cfg.fanValue, tx=[];
  ws.forEach(w=>{
    const payers=w.self?[0,1,2,3].filter(i=>i!==w.p):[w.disc];
    payers.forEach(q=>{ const ap=(q===dealer||w.p===dealer); const fan=w.total+(ap?bonus:0); tx.push({w:w.p,l:q,amt:Math.round((bf+fan)*(w.mult||1)*fv),d:{bf:bf,pat:w.total,df:ap?1:0,sf:ap?2*streak:0,mult:w.mult||1,fv:fv}}); });
  });
  return tx;
}
function applyHand(ledger,txns,win){
  const L=copyL(ledger), cash=[0,0,0,0], ev=[], keep=[], handled={};
  const has=(w,l)=>txns.find(t=>t.w===w&&t.l===l);
  L.forEach(r=>{
    const dir=has(r.to,r.from), rev=has(r.from,r.to);
    if(dir){ const prev=r.amt, half=Math.ceil(prev*1.5); r.amt=half+dir.amt; r.k++; r.hit=true; keep.push(r); handled[r.from+'>'+r.to]=1; ev.push({t:'la',from:r.from,to:r.to,amt:r.amt,k:r.k,prev:prev,half:half,add:dir.amt,d:dir.d}); }
    else if(rev){ const pay=Math.floor(r.amt/2); cash[r.from]-=pay; cash[r.to]+=pay; ev.push({t:'ti',from:r.from,to:r.to,amt:r.amt,pay}); }
    else if(!win){ keep.push(r); }
    else if(txns.every(t=>t.w===r.to)){ keep.push(r); }
    else { cash[r.from]-=r.amt; cash[r.to]+=r.amt; ev.push({t:'settle',from:r.from,to:r.to,amt:r.amt}); }
  });
  txns.forEach(t=>{
    if(handled[t.l+'>'+t.w]) return;
    keep.push({from:t.l,to:t.w,amt:t.amt,k:1}); ev.push({t:'new',from:t.l,to:t.w,amt:t.amt,k:1,d:t.d});
  });
  return {ledger:keep,cash,ev};
}
window.MJ_LA={applyHand};
function instDeltas(ins,fv){
  const d=[0,0,0,0], amt=ins.amt*fv;
  if(ins.mode==='all'){ [0,1,2,3].forEach(i=>{ if(i!==ins.payee){ d[i]-=amt; d[ins.payee]+=amt; } }); }
  else if(ins.mode==='payall'){ [0,1,2,3].forEach(i=>{ if(i!==ins.payer){ d[ins.payer]-=amt; d[i]+=amt; } }); }
  else if(ins.mode==='burn'){ d[ins.payer]-=amt; }
  else { d[ins.payer]-=amt; d[ins.payee]+=amt; }
  return d;
}
function evText(e){
  const a=nm(e.from), b=nm(e.to);
  if(e.t==='new') return a+' 欠 '+b+' $'+e.amt+'(拉一口,暫不收付)';
  if(e.t==='la') return a+' 被 '+b+' 拉第'+e.k+'口,累計 $'+e.amt;
  if(e.t==='ti') return a+' 踢半:付 '+b+' $'+e.pay+'(原 $'+e.amt+' 的一半)';
  if(e.t==='settle') return a+' 付清 '+b+' $'+e.amt;
  if(e.t==='surrender') return a+' 投降,付清 '+b+' $'+e.amt;
  return '';
}
function need(){ return (SETS()-E.melds.length)*3+2; }
function tileCount(t){ let n=0; E.all.forEach(x=>{ if(x===t) n++; }); return n; }
function allCounts(){ const c=Array(35).fill(0); E.all.forEach(t=>c[t]++); return c; }
function meldCountsOf(melds){
  const c=Array(34).fill(0);
  melds.forEach(m=>{ if(m.t==='chow'){ c[m.tile]++; c[m.tile+1]++; c[m.tile+2]++; } else c[m.tile]+=(m.t==='kong'?4:3); });
  return c;
}
function partitions(cnt){
  const res=[];
  (function rec(c,cur){
    let i=0; while(i<34&&c[i]===0) i++;
    if(i===34){ res.push(cur.slice()); return; }
    if(cur.length>=SETS()) return;
    if(c[i]>=4){ c[i]-=4; cur.push({t:'kong',tile:i}); rec(c,cur); cur.pop(); c[i]+=4; }
    if(c[i]>=3){ c[i]-=3; cur.push({t:'pung',tile:i}); rec(c,cur); cur.pop(); c[i]+=3; }
    if(i<27&&M.numOf(i)<=7&&c[i+1]>0&&c[i+2]>0){ c[i]--; c[i+1]--; c[i+2]--; cur.push({t:'chow',tile:i}); rec(c,cur); cur.pop(); c[i]++; c[i+1]++; c[i+2]++; }
  })(cnt.slice(),[]);
  return res;
}
function toMelds(part){ return part.map(g=>({t:g.t,tile:g.tile,open:g.t==='kong'?(E.kongOpen[g.tile]!==false):true})); }
function partScore(melds){
  if(isWild()||E.win==null) return null;
  const ac=allCounts(), mc=meldCountsOf(melds);
  const hand=[]; let winTaken=false;
  for(let t=0;t<34;t++){ const n=ac[t]-mc[t]; if(n<0) return null; for(let i=0;i<n;i++){ if(!winTaken&&t===E.win){ winTaken=true; } else hand.push(t); } }
  if(!winTaken||hand.length!==(SETS()-melds.length)*3+1) return null;
  try{
    const r=M.analyze(Object.assign({hand:hand.concat([E.win]),melds:melds,win:E.win,flowers:E.flowers,selfDraw:E.self,flags:E.flags},ctxExtra()),OV());
    if(!r||r.error||!r.items) return null;
    const R=RL(); let tot=0; r.items.forEach(x=>{ tot+=M.valueOf(R,x); }); return tot;
  }catch(e){ return null; }
}
function base_bestMelds(){
  const c=E.marks;
  let any=false; for(let t=0;t<34;t++) if(c[t]>0){ any=true; break; }
  E.partBad=false;
  if(!any) return [];
  const parts=partitions(c);
  if(!parts.length){ E.partBad=true; return []; }
  E.partAmbig=parts.length>1;
  const chowCount=p=>p.filter(g=>g.t==='chow').length;
  parts.sort((a,b)=>chowCount(a)-chowCount(b));
  let best=null, bs=-1;
  if(E.win!=null){
    parts.forEach(p=>{ const s=partScore(toMelds(p)); if(s!=null&&s>bs){ bs=s; best=p; } });
  }
  return toMelds(best||parts[0]);
}
function derive(){
  const ac=allCounts();
  if(isHK()){
    if(!E.hkKongs||typeof E.hkKongs!=='object')E.hkKongs={};
    Object.keys(E.hkKongs).forEach(t=>{if(ac[+t]!==4)delete E.hkKongs[t];});
    const lock=pending.length&&pending[0].ron?pending[0].ron.winTile:null;
    if(lock!=null)E.hkWin=E.all.includes(lock)?lock:null;
    else if(E.hkWin!=null&&!E.all.includes(E.hkWin))E.hkWin=null;
    E.melds=[];E.hand=E.all.slice();return;
  }
  for(let t=0;t<34;t++){ if(E.marks[t]>ac[t]) E.marks[t]=ac[t]; if(E.marks[t]<0) E.marks[t]=0; }
  if(E.win!=null){ const unm=ac[E.win]-(E.marks[E.win]||0); if(unm<1) E.win=null; }
  E.melds=bestMelds();
  const mc=meldCountsOf(E.melds), hand=[]; let taken=false;
  for(let t=0;t<34;t++){ const n=ac[t]-mc[t]; for(let i=0;i<n;i++){ if(!taken&&E.win!=null&&t===E.win){ taken=true; } else hand.push(t); } }
  for(let i=0;i<(ac[34]||0);i++){ if(!taken&&E.win===34){ taken=true; } else hand.push(34); }
  if(isWild()){ Object.keys(E.jsel).forEach(k=>{ const free=ac[k]-(E.marks[k]||0); if(E.jsel[k]>free){ if(free>0) E.jsel[k]=free; else delete E.jsel[k]; } }); }
  E.hand=hand;
}
function ctxExtra(){ const x={useFlowers:isHK()?hkFlowerMode():true,kongKeep:isHK()?false:!!S.cfg.kongKeep[curPreset()]}; if(E.winner!=null){ x.roundWind=S.wind; x.seatWind=windIdx(E.winner); } return x; }
function combos(arr,k){ const res=[]; (function r(i,cur){ if(cur.length===k){ res.push(cur.slice()); return; } for(let j=i;j<arr.length;j++){ cur.push(arr[j]); r(j+1,cur); cur.pop(); } })(0,[]); return res; }
/* 廣東牌:只需選齊全部牌。槓由牌數推算;食糊牌自動取最高番;門前清由牌堆下方的問題回答 */
function analyzeHK(){
  const N=E.all.length;if(!N)return null;
  const k=N-14;
  if(k<0)return {error:'牌數不足：現有 '+N+' 張，廣東牌需14張，有槓每槓多1張'};
  if(k>4)return {error:'牌數過多：現有 '+N+' 張'};
  const ac=allCounts(),quad=[];for(let t=0;t<34;t++)if(ac[t]===4)quad.push(t);
  if(k>quad.length)return {error:'應有 '+k+' 個槓，但只有 '+quad.length+' 款牌有4張'};
  const chosen=E.hkKongs||{},forced=quad.filter(t=>chosen[t]==='open'||chosen[t]==='closed');
  if(forced.length>k)return {error:'已指定槓數超過牌數所需'};
  const choices=combos(quad.filter(t=>chosen[t]!=='none'),k).filter(cb=>forced.every(t=>cb.includes(t)));
  if(!choices.length)return {error:'槓組與牌數不符，請在「槓／門清」修正'};
  const fixWin=E.hkWin!=null?E.hkWin:null,R=RL();let best=null,cnt=0;
  const byWin=new Map();
  choices.forEach(cb=>{
    const melds=cb.map(t=>({t:'kong',tile:t,open:chosen[t]!=='closed'})),c=ac.slice();cb.forEach(t=>{c[t]-=4;});
    const hand=[];for(let t=0;t<34;t++)for(let i=0;i<c[t];i++)hand.push(t);
    const seen=new Set();
    hand.forEach(w=>{
      if(fixWin!=null&&w!==fixWin||seen.has(w))return;seen.add(w);
      let r=null;try{r=M.analyze(Object.assign({hand,melds,win:w,flowers:E.flowers,selfDraw:E.self,flags:E.flags,concealed:hkConcealed(ac)},ctxExtra()),OV());}catch(e){}
      cnt++;
      if(r&&!r.error&&r.items){
        let total=0;r.items.forEach(x=>{total+=M.valueOf(R,x);});
        const sig=r.items.map(x=>x.id+':'+(x.n==null?1:x.n)+':'+!!x.closed).sort().join('|');
        const prev=byWin.get(w);if(!prev||total>prev.total)byWin.set(w,{total,sig});
        if(!best||total>best.total)best={items:r.items,total,count:0,waits:r.waits,kongs:cb.slice(),selectedWin:w};
      }
    });
  });
  if(!best)return {error:fixWin!=null?'放炮／食糊牌必須在扣除槓後的手牌內，並能組成食糊牌形':'這副牌組不成食糊牌形'};
  best.count=cnt;best.needsSelect=fixWin==null&&new Set([...byWin.values()].map(x=>x.total+'|'+x.sig)).size>1;
  best.autoMq=E.flags.menqing===undefined&&N===14&&jiuziShape(ac);return best;
}
function analyze(){
  if(isWild()){
 if(jokerTotal()>0)return wildResult();if(E.win==null)return null;const inp=wildInput(),melds=inp.groups.map(g=>({t:g.t,tile:g.tile,open:g.t==='kong'?g.open!==false:true}));
 const r=M.analyze(Object.assign({},inp,{hand:inp.hand,melds,win:E.win}),OV());return r&&!r.error?Object.assign({},r,{complete:true,replacements:[],assigned:inp.hand.slice(),win:E.win}):r;
 }
  if(isHK()) return analyzeHK();
  if(E.win==null||E.hand.length!==need()-1) return null;
  return M.analyze(Object.assign({hand:E.hand.concat([E.win]),melds:E.melds,win:E.win,flowers:E.flowers,selfDraw:E.self,flags:E.flags},ctxExtra()),OV());
}

 function firstStepIssue() {
  const hk = isHK();
  const required = hk ? 14 : 17;

  const tiles = physicalEntries().map(x => x.t);
  const current = tiles.length;

  // 所有模式都先檢查最低張數。
  if (current < required) {
    return {
      title: '牌數不足',
      message:
        '此玩法至少需要' + required +
        '張，目前只有' + current +
        '張，還差' + (required - current) +
        '張。請補選牌後再繼續。'
    };
  }

  // 有百搭牌：不做牌型預檢，保留後續原有流程。
  if (isWild() && jokerTotal() > 0) return null;

  // 廣東牌沿用現有分析器。
  // 暫時忽略尚未完成或之前留下的槓／食糊牌選擇。
  if (hk) {
    const oldKongs = E.hkKongs;
    const oldWin = E.hkWin;

    let result;

    try {
      E.hkKongs = {};
      E.hkWin = null;
      result = analyzeHK();
    } catch (err) {
      return {
        title: '暫時無法檢查牌型',
        message:
          '牌型檢查發生錯誤，請稍後再試。' +
          (err?.message ? '（' + err.message + '）' : '')
      };
    } finally {
      E.hkKongs = oldKongs;
      E.hkWin = oldWin;
    }

    if (!result || result.error) {
      return {
        title: '請檢查選牌',
        message:
          (result?.error || '目前未能確認合法和牌牌型') +
          '。請檢查選牌後再繼續。'
      };
    }

    return null;
  }

  // 非廣東牌、沒有百搭：
  // 忽略目前的明牌標記，從全部實體牌檢查是否存在合法完成方式。
  const counts = Array(35).fill(0);

  for (const t of tiles) counts[t]++;

  for (let t = 0; t < 34; t++) {
    if (counts[t] > 4) {
      return {
        title: '同款牌數過多',
        message:
          tileName(t) + '目前有' + counts[t] +
          '張，同款牌不能超過4張。請檢查選牌。'
      };
    }
  }

  const kongCount = current - required;

  if (kongCount > 5) {
    return {
      title: '牌數過多',
      message:
        '目前輸入' + current +
        '張，已超出此17張玩法含五個槓的張數範圍。請檢查選牌。'
    };
  }

  const quadTiles = [];

  for (let t = 0; t < 34; t++) {
    if (counts[t] === 4) quadTiles.push(t);
  }

  if (kongCount > quadTiles.length) {
    return {
      title: '牌數與槓組不符',
      message:
        '目前輸入' + current +
        '張，需要' + kongCount +
        '個槓，但只有' + quadTiles.length +
        '款牌各有4張。請檢查是否多選或選錯牌。'
    };
  }

  const kongChoices =
    kongCount === 0 ? [[]] : combos(quadTiles, kongCount);

  let completedChecks = 0;
  let failedChecks = 0;

  // 百搭模式但實際沒有百搭牌時，
  // 保留該模式需要的 preset、limit 等輸入設定。
  const baseInput = isWild()
    ? wildInput()
    : Object.assign({
        flowers: E.flowers,
        selfDraw: E.self,
        flags: E.flags
      }, ctxExtra());

  const over = OV();

  for (const selected of kongChoices) {
    const left = counts.slice();

    const melds = selected.map(t => ({
      t: 'kong',
      tile: t,
      open: false
    }));

    const groups = selected.map(t => ({
      t: 'kong',
      tile: t,
      open: false,
      physical: [t, t, t, t]
    }));

    for (const t of selected) left[t] -= 4;

    const hand = [];

    for (let t = 0; t < 34; t++) {
      for (let n = 0; n < left[t]; n++) hand.push(t);
    }

    // 第一步未選食糊牌，逐款嘗試。
    // hand 保留完整牌數，與現有 analyze() 的輸入方式一致。
    for (const win of new Set(hand)) {
      try {
        const result = M.analyze(
          Object.assign({}, baseInput, {
            hand: hand.slice(),
            melds,
            groups,
            win
          }),
          over
        );

        completedChecks++;

        if (result && !result.error) return null;
      } catch (err) {
        failedChecks++;
      }
    }
  }

  // 分析器有拋錯，不能把未完成的檢查當成「確定無解」。
  if (failedChecks > 0) {
    return {
      title: '暫時無法完成牌型檢查',
      message:
        '部分牌型檢查發生錯誤，未能確認是否可以和牌。' +
        '請檢查計番引擎或稍後再試。'
    };
  }

  return {
    title: '目前選牌無法和牌',
    message:
      completedChecks > 0
        ? '目前選牌未能組成此玩法支援的和牌類型。' +
          '請檢查是否選錯、漏選或重複選牌，再按下一步。'
        : '目前牌數或槓組無法形成可檢查的完整牌型，請檢查選牌。'
  };
}
function curItems(res){
  const r=RL(); let it;
  if(E.quick&&isHK()){ it=Object.keys(E.quick).filter(id=>E.quick[id]>0&&id!=='zimo'&&r[id]).map(id=>({id,n:E.quick[id],closed:false})).filter(x=>!E.excl[x.id]); if(E.self&&r.zimo&&!E.excl.zimo) it.unshift({id:'zimo',n:1,closed:false}); }
  else if(res&&res.items) it=res.items.filter(x=>!E.excl[x.id]);
  else it=M.basic(Object.assign({flowers:E.flowers,selfDraw:E.self,flags:E.flags,concealed:!!E.flags.menqing},ctxExtra())).filter(x=>!E.excl[x.id]);
  if(!isHK()&&curPreset()!==4) HUAHU.forEach(h=>{ if(E.flags[h[0]]&&!E.excl[h[0]]) it.push({id:h[0],n:1,closed:false}); });
  it=it.concat(E.extra.map(x=>({id:x.id,n:(x.id==='weiwei'?Math.max(2,x.n):x.n),closed:false})));
  if(!isHK()&&!it.some(x=>x.id==='di')) it.unshift({id:'di',n:1,closed:false});
  it=hkFlowerAdjust(it,r);
  const mapped=it.map(x=>{
    const f=r[x.id]; if(!f) return {id:x.id,name:x.id==='di'?'底':x.id,n:x.n,unit:x.id==='di'?S.cfg.baseMult:0,total:x.id==='di'?S.cfg.baseMult:0};
    const c=x.closed&&f.fanC!=null; const total=M.valueOf(r,{id:x.id,n:x.n,closed:x.closed});
    return {id:x.id,name:f.name+(f.fanC!=null?(c?'(暗)':'(明)'):''),n:x.n,unit:(x.n?total/x.n:0),total};
  });
  if(E.adjust) mapped.push({id:'adjust',name:'手動調整番數(beta)',n:1,unit:E.adjust,total:E.adjust});
  return mapped;
}
function tileBtn(t){ const lk=(pending.length&&pending[0].ron)?pending[0].ron.winTile:null; return '<button class="t s'+M.suitOf(t)+(t===overTile?' overbox':'')+(lk!=null&&t===lk&&!E.all.includes(lk)?' lockhi':'')+'" data-act="tile" data-t="'+t+'">'+tileName(t)+'</button>'; }
function palette(){
  let h='<div class="pal">';
  for(let su=0;su<3;su++){ h+='<div class="row">'; for(let n=1;n<=9;n++) h+=tileBtn(su*9+n-1); h+='</div>'; }
  h+='<div class="row">'; for(let t=27;t<34;t++) h+=tileBtn(t); if(isWild()) h+='<button class="t" style="color:#8b2670" data-act="tile" data-t="34">百搭</button>'; h+='</div></div>';
  return h;
}
function payerRow(players,act,val){
  return '<div class="payrow" style="grid-template-columns:repeat('+Math.max(1,players.length)+',minmax(0,1fr))">'+players.map(p=>'<button class="'+(val===p?'on':'')+'" data-act="'+act+'" data-p="'+p+'"><span class="pl"><span class="em" aria-hidden="true">'+avatar(p)+'</span><span class="nm">'+nm(p)+'</span></span><small>'+windOf(p)+'</small></button>').join('')+'</div>';
}
function winnerBtns(key,val){
  const players=S.seat.filter(p=>key!=='disc'||(p!==E.winner&&!pending.some(w=>w.p===p)));
  if(key==='disc')return payerRow(players,'disc',val);
  return '<div class="seg">'+players.map(p=>'<button class="'+(val===p?'on':'')+'" data-act="'+key+'" data-p="'+p+'">'+playerLabel(p)+'<small>'+windOf(p)+'</small></button>').join('')+'</div>';
}
function ledgerHtml(withBtn){
  if(!S.ledger.length) return '<p class="hint">目前沒有未結算的拉</p>';
  return S.ledger.map((r,i)=>'<div class="tr">'+nm(r.from)+' 欠 '+nm(r.to)+' <b>$'+r.amt+'</b> <small>(拉'+r.k+'口)</small>'+(withBtn?' <button data-act="payoff" data-i="'+i+'">結清</button>':'')+'</div>').join('');
}
function updBanner(){
  if(!upd||updDismissed) return '';
  return '<div class="note"><b>發現新版本 '+esc(upd.version)+'</b>'+(upd.updated?'(更新時間 '+esc(upd.updated)+')':'')+'<br>目前版本 '+APP_VERSION+'。是否現在升級?升級不會影響你的紀錄。<div class="btnrow"><button class="primary" data-act="upgrade">立即升級</button><button data-act="dismissUpd">稍後</button></div></div>';
}
function hasPrev(){ try{ return !!localStorage.getItem(PREV_KEY); }catch(e){ return false; } }
function gameLabel(v){ return v==='wild'?'港式台牌（通用百搭）':v==='hk'?'廣東牌':'港式台牌（無百搭）'; }
function base_gameName(){ if(isWild()) return '港式台牌（通用百搭）· 加'+S.cfg.wildLimit+'張 · '+PRESET_NAME[S.cfg.wildPreset]; return isHK()?('廣東牌 · '+HK_PRESETS[S.cfg.hk.preset].name):('港式台牌（無百搭）· '+PRESET_NAME[S.cfg.preset]); }
function viewChooser(){
  let h='<div class="chooser"><h2>麻雀計番</h2><div class="sub">請選擇玩法</div>';
  h+='<button data-act="game" data-v="tw">港式台牌（無百搭）<small>16張；五組面子加一對眼，有拉、踢半、斬拉，四套番表預設</small></button>';
  h+='<button data-act="game" data-v="wild">港式台牌（通用百搭）<small>16張；開局選百搭數量，自動搜尋最高番</small></button>';
  if(wildPick){
    const c=S.cfg, onoff=k=>'<div class="seg"><button style="padding:12px 4px;margin:0;text-align:center" class="'+(!c[k]?'on':'')+'" data-act="wildOpt" data-k="'+k+'" data-v="0">關</button><button style="padding:12px 4px;margin:0;text-align:center" class="'+(c[k]?'on':'')+'" data-act="wildOpt" data-k="'+k+'" data-v="1">開</button></div>';
    h+='<div class="card askcard"><div class="zl" style="margin-top:0">百搭可用於明牌</div>'+onoff('wildMeld')
      +'<div class="zl">冇用百搭，全部番數加倍</div>'+onoff('wildNoMult')
      +'<label>倍數<input type="number" min="1" max="100" step="1" data-chg="wildMultN" value="'+c.wildMultN+'"></label>'
      +'<div class="zl">本場加入幾張百搭？</div><div class="seg">'+[2,4,6,8,16].map(n=>'<button style="text-align:center;padding:14px 2px;margin:0" class="'+(c.wildLimit===n?'on':'')+'" data-act="game" data-v="wild" data-n="'+n+'">'+n+'</button>').join('')+'</div>'
      +'<div class="grid2" style="margin-top:8px"><label>自訂數量(1至50)<input type="number" min="1" max="50" step="1" data-chg="wildN" value="'+c.wildLimit+'"></label><button class="primary" style="margin-top:18px;text-align:center" data-act="game" data-v="wild" data-n="'+c.wildLimit+'">用 '+c.wildLimit+' 張開始</button></div>'
      +'<div class="hint">百搭可用於明牌:預設關,百搭只可在自己手牌內當牌。倍數會乘全部番數(含底、莊家及連莊)。數量是整副牌加入的張數,不是你手持的張數;愈多搜尋愈慢。</div></div>';
  }
  h+='<button data-act="game" data-v="hk">廣東牌（13張）<small>四組面子加一對眼，三番起糊，10番封頂，二五雞・半辣上等計分表；可輸入花牌自動判斷</small></button>';
  if(!window.MJHK) h+='<div class="warn">未能載入廣東牌檔案(engine_hk.js),請確認已上傳。</div>';
  if(!window.MJCORE) h+='<div class="warn">未能載入共用檔案(mj-core.js),計番可能失敗,請確認已上傳並已加入 index.html。</div>';
  if(S.game) h+='<div class="btnrow"><button data-act="tab" data-v="table" style="text-align:center;font-size:15px">返回目前牌局(現為'+gameLabel(S.game)+')</button></div>';
  h+='<div class="dev" style="text-align:center">'+APP_VERSION+' · 開發者:Instagram <a href="https://www.instagram.com/'+DEV_IG+'/" target="_blank" rel="noopener">@'+DEV_IG+'</a></div></div>';
  return h;
}
let editRec=null;
let overTile=null,overTimer=null;
function flashOver(t){ overTile=t; if(overTimer)clearTimeout(overTimer); render(); overTimer=setTimeout(()=>{overTile=null;render();},900); }
let playerDraft=null,entryStep='pick',lastEntryMessage='';
const nameEdits=new Map();
function avatar(p){return esc((S.avatars||DEFAULT_AVATARS)[p]||DEFAULT_AVATARS[p]);}
function playerLabel(p){return avatar(p)+' '+nm(p);}
function hasEntryDraft(){return E.winner!=null||!!E.quick||hasCurrentData()||pending.length>0||E.flowers.some(Boolean)||E.extra.length>0||E.adjust!==0||Object.keys(E.flags).some(k=>E.flags[k]);}
function setTab(t){ tab=t; try{ localStorage.setItem('mj_v2_full_tab', t); }catch(e){} }
function openPlayerSetup(){
  nameEdits.clear();playerDraft={names:S.names.slice(),avatars:(S.avatars||DEFAULT_AVATARS).slice(),seat:S.seat.slice(),dealerSeat:S.dealerSeat};setTab('players');
}
function isNameField(el){return !!(el&&el.dataset&&el.dataset.playerName!=null&&playerDraft);}
function nameFieldFocus(el){
  if(!isNameField(el))return;
  const p=+el.dataset.playerName;if(!Number.isInteger(p)||p<0||p>3||nameEdits.has(p))return;
  const prior=String(el.value||playerDraft.names[p]||S.names[p]||('玩家'+(p+1))).trim();
  nameEdits.set(p,{prior});el.value='';el.placeholder='輸入玩家名稱…';
}
function settleNameField(el){
  if(!isNameField(el))return;
  const p=+el.dataset.playerName;if(!Number.isInteger(p)||p<0||p>3)return;
  const edit=nameEdits.get(p),typed=String(el.value||'').trim().slice(0,10);
  const value=typed||(edit?edit.prior:String(playerDraft.names[p]||S.names[p]||('玩家'+(p+1))).trim());
  playerDraft.names[p]=value;el.value=value;nameEdits.delete(p);
}
function readPlayerNames(){if(playerDraft)document.querySelectorAll('[data-player-name]').forEach(settleNameField);}
function viewPlayers(){
  if(!playerDraft)openPlayerSetup();const d=playerDraft;
  let h='<h3>四位玩家</h3><p class="hint">點入名稱會自動清空供修改；沒有輸入便還原原名。選擇 emoji 即可，不需要上傳頭像。</p>';
  for(let p=0;p<4;p++){
    h+='<div class="card"><div class="zl">玩家 '+(p+1)+'</div><label>名稱<input type="text" maxlength="10" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="輸入玩家名稱…" data-player-name="'+p+'" data-chg="playerName" data-p="'+p+'" value="'+esc(d.names[p])+'"></label>';
    h+='<label>Emoji<select data-chg="playerAvatar" data-p="'+p+'">'+PLAYER_EMOJIS.map(e=>'<option value="'+e+'"'+(d.avatars[p]===e?' selected':'')+'>'+e+'</option>').join('')+'</select></label></div>';
  }
  h+='<h3>座位安排</h3><div class="grid2">';
  for(let q=0;q<4;q++)h+='<label>'+WIND[q]+'位<select data-chg="playerSeat" data-s="'+q+'">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(d.seat[q]===p?' selected':'')+'>'+esc(d.avatars[p])+' '+esc(d.names[p])+'</option>').join('')+'</select></label>';
  h+='</div><label>莊家座位<select data-chg="playerDealer">'+Array.from(WIND).map((w,i)=>'<option value="'+i+'"'+(d.dealerSeat===i?' selected':'')+'>'+w+'</option>').join('')+'</select></label>';
  return h+'<div class="btnrow"><button class="primary" data-act="savePlayers">確認並返回牌桌</button>'+(S.playersReady?'<button data-act="cancelPlayers">取消修改</button>':'<button data-act="toChooser">返回玩法選擇</button>')+'</div>';
}
function savePlayerSetup(){readPlayerNames();const d=playerDraft;if(!d)return false;const names=d.names.map((n,p)=>String(n).trim().slice(0,10)||S.names[p]||('玩家'+(p+1)));if(new Set(names).size!==4){toast('請使用不同玩家名稱，以免記錯');return false;}if(new Set(d.seat).size!==4||d.seat.some(p=>!Number.isInteger(p)||p<0||p>3)){toast('四個座位必須分配不同玩家');return false;}S.names=names;S.avatars=d.avatars.map((e,p)=>PLAYER_EMOJIS.includes(e)?e:DEFAULT_AVATARS[p]);S.seat=d.seat.slice();S.dealerSeat=d.dealerSeat;if(S.history.length===0)S.startDealerPid=S.seat[S.dealerSeat];S.playersReady=true;playerDraft=null;nameEdits.clear();setTab('table');toast('玩家設定已儲存');return true;}
function recordLabel(r,idx){
  const no='#'+(idx+1);
  const name=p=>(S.names&&S.names[p])||('玩家'+(Number(p)+1));
  if(!r)return no;
  if(r.kind==='draw')return no+' 流局';
  if(r.kind==='win'){
    const ws=r.winners||[];
    if(ws.length===1){const w=ws[0];return no+' '+name(w.p)+(w.self?' 自摸':' 食 '+name(w.disc));}
    if(ws.length>1)return no+' '+ws.map(w=>name(w.p)).join('、')+' 同食 '+name(ws[0].disc);
  }
  return no+' '+(r.name||'紀錄');
}
function undoInfoForLast(){
  const idx=S.history.length-1;
  if(idx<0)return null;
  const r=S.history[idx];
  return {id:r.id,label:recordLabel(r,idx),kind:r.kind,beforeLen:idx+1};
}
function finishEntry(message, undoInfo){
  uiResume=null;
  E=newEntry();pending=[];entryStep='pick';setTab('table');lastEntryMessage=undoInfo&&undoInfo.label?message+' · '+undoInfo.label:message;
  wildStop();wildDone=null;wildKey='';clearDraft();
  if(undoInfo){ lastUndo=undoInfo; if(undoTimer) clearTimeout(undoTimer); undoTimer=setTimeout(()=>{ lastUndo=null; render(); }, 8000); }
  window.scrollTo(0,0);toast(message);
}
function beginWinner(p){
  if(!Number.isInteger(p)||!S.seat.includes(p)){toast('請選擇食糊者');return false;}
  if(pending.length>=3){toast('已加入三位，請確認本局');setTab('calc');entryStep='pick';return false;}
  if(pending.some(w=>w.p===p)){toast('這位玩家已加入本局');return false;}
  if(pending.length&&pending[0].disc===p){toast('出銃者不能同時食糊');return false;}
  const current=hasCurrentData()||E.flowers.some(Boolean)||E.extra.length>0||E.adjust!==0;
  if(current&&E.winner===p){setTab('calc');entryStep='hand';window.scrollTo(0,0);return true;}
  if(current&&!confirm('改選食糊者會清除目前這手輸入；已加入的食糊者會保留。繼續嗎？'))return false;
  wildStop();wildDone=null;wildKey='';E=newEntry();E.winner=p;setTab('calc');lastEntryMessage='';
  if(pending.length){E.self=false;E.disc=pending[0].disc;entryStep='hand';}else entryStep='method';
  window.scrollTo(0,0);return true;
}
function viewEntryFlow(){
  let h='<div class="status">'+esc(gameName())+' · '+WIND[S.wind]+'風圈 · 莊家 '+playerLabel(dealerPid())+'</div>';
  if(pending.length)h+='<div class="note">本局已加入：'+pending.map(w=>playerLabel(w.p)+' '+w.total+' 番').join('、')+'</div>';
  if(entryStep==='pick'){
    h+='<h3>'+(pending.length?'選擇另一位食糊者':'選擇本局食糊者')+'</h3><div class="grid2">';
    S.seat.forEach(p=>{const disabled=pending.some(w=>w.p===p)||pending.length>=3||(pending.length&&pending[0].disc===p);h+='<button data-act="startWinner" data-p="'+p+'"'+(disabled?' disabled':'')+'>'+playerLabel(p)+'<br><small>'+windOf(p)+'位</small></button>';});h+='</div>';
    if(pending.length)h+='<div class="btnrow"><button class="primary" data-act="confirm">確認本局（'+pending.length+' 位食糊者）</button></div>';
  }else if(entryStep==='method'){
    h+='<h3>'+playerLabel(E.winner)+' 食糊</h3><p class="hint">選擇食糊方式，下一步輸入牌型。</p><div class="seg two"><button data-act="chooseMethod" data-v="self">自摸</button><button data-act="chooseMethod" data-v="ron">別家出銃</button></div><div class="btnrow"><button data-act="entryPick">重新選擇贏家</button></div>';
  }else if(entryStep==='payer'){
    h+='<h3>'+playerLabel(E.winner)+' 別家出銃</h3><p class="hint">選擇出銃者（放炮者）</p>'+payerRow(S.seat.filter(p=>p!==E.winner),'choosePayer',null)+'<div class="btnrow"><button data-act="entryMethod">返回食糊方式</button></div>';
  }
  h+=viewInstantControls();
  return h+'<div class="btnrow"><button data-act="tab" data-v="table">返回牌桌（保留本局）</button>'+(hasEntryDraft()?'<button data-act="clearEntry">放棄本局輸入</button>':'')+'</div>';
}
function tableDisplayBalances(){return isHK()?balances():totals();}

function viewTable(){
  const b=tableDisplayBalances();
  const card=s=>{ const p=S.seat[s]; const name=nm(p); return '<div class="card seat '+(s===S.dealerSeat?'dealer':'')+'" data-act="startWinner" data-p="'+p+'" style="cursor:pointer;text-decoration:none!important;-webkit-text-decoration:none!important"><div class="sw">'+WIND[s]+'</div><div class="pn" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><span style="font-size:1.6em" aria-hidden="true">'+avatar(p)+'</span><br>'+esc(name)+'</div><div class="mini">門風 '+windOf(p)+(s===S.dealerSeat?' · 莊':'')+'</div><div class="bal '+(b[p]>=0?'pos':'neg')+'">'+money(b[p])+'</div></div>'; };
  let h='<div class="status '+(S.cfg.largeFont?'large-font':'')+'"><span class="badge">莊 '+nm(dealerPid())+'</span> '+WIND[S.wind]+'風圈 · 連莊 <span class="badge">'+S.streak+' 次</span>'+(isHK()?'':'(莊家加 '+(1+2*S.streak)+' 番)')+'<br><small>'+esc(gameName())+'</small></div>';
  let notices='';
  if(lastEntryMessage){
    let undoBtn='';
    if(lastUndo){
      undoBtn='<button class="danger" data-act="'+(lastUndo.kind==='instant'?'delInst':'undoRec')+'" data-id="'+esc(lastUndo.id)+'">撤銷 '+esc(lastUndo.label)+'</button>';
    } else {
      undoBtn='<button data-act="undoRec">撤銷上一筆</button>';
    }
    notices+='<div class="note">'+esc(lastEntryMessage)+' <button data-act="tab" data-v="history">查看記錄</button>'+undoBtn+'</div>';
  }
  if(draftCache){ notices+='<div class="note">找到未完成草稿（莊家 '+WIND[draftCache.ctx.wind]+'風圈 連莊 '+draftCache.ctx.streak+'）<button class="primary" data-act="applyDraft">繼續輸入</button><button data-act="discardDraft">放棄草稿</button></div>'; }
  if(hasEntryDraft())notices+='<div class="note">有未完成的本局輸入 <button class="primary" data-act="tab" data-v="calc">繼續輸入</button></div>';
  h+='<div class="cross"><div></div>'+card(3)+'<div></div>'+card(2)+'<div class="center">點選玩家<br><small>記錄食糊</small></div>'+card(0)+'<div></div>'+card(1)+'<div></div></div>';
  if(notices)h+='<div class="table-feedback">'+notices+'</div>';
  h+='<p class="hint">'+(isHK()?'格內金額為已收付淨額。':'格內大字為總淨額（已收付＋未收拉－未付拉）；拉數明細見下方。')+'</p>';
  if(!isHK())h+='<h3>未結算的拉</h3>'+(S.ledger.length?ledgerHtml(true):'<p class="hint">暫無未結算的拉</p>');
  h+=viewInstantControls();
  h+='<h3>座位安排</h3><div class="grid2">';
  for(let s=0;s<4;s++){ h+='<label>'+WIND[s]+'位<select data-chg="seat" data-s="'+s+'">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(S.seat[s]===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>'; }
  h+='</div><p class="hint">換位自動對調。名稱及 emoji 請在「玩家設定」修改。</p>';
  h+='<h3>開局設定 <small data-act="ruleHelp" style="cursor:pointer;padding:0 6px">❓</small></h3>'+(ruleHelp?'<div class="hint">'+(isHK()?'食糊莊家連莊(可在設定關閉),流局莊家輪替。':'連莊與換莊依食糊結果自動計算,流局不增加連莊數。')+'</div>':'')+'<div class="grid2">';
  h+='<label>莊家座位<select data-chg="dealerSeat">'+[0,1,2,3].map(s=>'<option value="'+s+'"'+(S.dealerSeat===s?' selected':'')+'>'+WIND[s]+'位 '+nm(S.seat[s])+'</option>').join('')+'</select></label>';
  h+='<label>風圈<select data-chg="wind">'+[0,1,2,3].map(s=>'<option value="'+s+'"'+(S.wind===s?' selected':'')+'>'+WIND[s]+'風圈</option>').join('')+'</select></label>';
  h+='<div class="stepper">連莊次數(自動,必要時手動修正)<button data-act="streak" data-d="-1">−</button><b>'+S.streak+'</b><button data-act="streak" data-d="1">＋</button></div></div>';
  h+='<div class="btnrow"><button class="primary" data-act="tab" data-v="calc">'+(hasEntryDraft()?'繼續本局':'記錄食糊')+'</button><button data-act="editPlayers">玩家設定</button><button data-act="draw">流局</button></div>';
  h+='<h3>牌局管理</h3><div class="btnrow"><button class="danger" data-act="newGame">開始全新局</button>'+(hasPrev()?'<button data-act="restoreGame">還原上一場牌局</button>':'')+'</div><p class="hint">清空紀錄、拉數、連莊。名稱設定保留,已自動備份上一場。</p>';
  return h;
}
function baoVisible(){
  if(!isHK()||!E.self) return false;
  const h=S.cfg.hk;
  return !!(h.bao12||h.baoSan);
}

function nextStepText(){
  if(hasCurrentData()||pending.length>0){
    if(pending.length>0){
      const disc = S.names[pending[0].disc]||'';
      return '繼續 '+playerLabel(pending[0].p)+' 食 '+disc;
    }
    if(E.winner!=null){
      return '繼續 '+(S.names[E.winner]||'')+' 輸入';
    }
    return '繼續未完成輸入';
  }
  return '點選食糊玩家';
}
let editorError='',jumpToResults=false;
function editorActive(){return tab==='calc'&&entryStep==='hand'&&!E.shapeDone;}
function editorWin(){return isHK()?E.hkWin:E.win;}
function physicalEntries(){
  const entries=E.all.map(t=>({t,group:null}));
  if(isWild())E.wildGroups.forEach((g,i)=>g.physical.forEach(t=>entries.push({t,group:i})));
  return entries.sort((a,b)=>a.t-b.t||(a.group==null?-1:a.group)-(b.group==null?-1:b.group));
}
function editorCapacity(n){return n<=18?18:n<=21?21:24;}
function editorColumns(n){return n<=18?6:n<=21?7:8;}
function flowerButtonsHtml(){const defs={'春':[1,'#b32624'],'夏':[2,'#b32624'],'秋':[3,'#b32624'],'冬':[4,'#b32624'],'梅':[1,'#222222'],'蘭':[2,'#222222'],'菊':[3,'#222222'],'竹':[4,'#222222']};return '<style>.flower-host .flowers.flower-grid{display:grid!important;grid-template-columns:repeat(8,minmax(0,1fr))!important;gap:4px!important;width:100%;max-width:100%;margin:0!important}.flower-grid .fl.u-flower{display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:100%!important;min-width:0!important;min-height:44px!important;height:auto;margin:0!important;padding:4px 0!important;background:transparent!important;border:0!important;border-radius:5px;box-shadow:none!important}.flower-grid .u-flower .u-flower-face{position:relative;box-sizing:border-box;display:inline-flex;flex:none;width:100%!important;max-width:30px!important;height:auto!important;aspect-ratio:3/4;min-width:0!important;min-height:0!important;max-height:none!important;margin:0!important;padding:0!important;transform:none!important;background:#f7f3e3!important;border:1px solid #bbb!important;border-bottom:3px solid #2f8f57!important;border-radius:5px;color:var(--flower-ink)!important;pointer-events:none;container-type:inline-size}.flower-grid .u-flower .flower-num{position:absolute;top:2px;left:3px;margin:0;font-size:8px;line-height:1;font-style:normal;font-weight:700;color:var(--flower-ink)!important}.flower-grid .u-flower .flower-name{margin-top:6px;font-size:17px;font-size:clamp(10px,58cqw,17px);line-height:1;color:var(--flower-ink)!important}.flower-grid .u-flower.on{background:transparent!important;box-shadow:none!important}.flower-grid .u-flower.on .u-flower-face{background:#f7f3e3!important;outline:2px solid var(--acc,#e6b422);outline-offset:-2px}.flower-grid .u-flower::after{content:none!important}.flower-grid .u-flower .flower-check{position:absolute;top:2px;right:2px;font-size:8px;line-height:1;color:#765600!important}</style><div class="flower-host"><div class="flowers flower-grid">'+M.FLOWERS.map((f,i)=>{const name=(String(f).match(/[春夏秋冬梅蘭菊竹]/)||[])[0],d=defs[name];if(!d)return '<button class="fl'+(E.flowers[i]?' on':'')+'" data-act="flower" data-i="'+i+'">'+esc(f)+'</button>';return '<button class="fl u-flower'+(E.flowers[i]?' on':'')+'" style="--flower-ink:'+d[1]+'" data-act="flower" data-i="'+i+'" aria-label="'+d[0]+name+'" aria-pressed="'+!!E.flowers[i]+'"><span class="mt u-flower-face"><i class="flower-num">'+d[0]+'</i><b class="flower-name">'+name+'</b>'+(E.flowers[i]?'<span class="flower-check" aria-hidden="true">✓</span>':'')+'</span></button>';}).join('')+'</div></div>';} 
 function unmarkedQuads(){if(isHK())return [];const ac=allCounts(),q=[];for(let t=0;t<34;t++)if(ac[t]===4&&(E.marks[t]||0)<4)q.push(t);return q;}
function quadReminder(){
  const q=unmarkedQuads(),key=q.join(',');
  if(!q.length||E.quadAck===key)return true;
  const ok=confirm('提醒:'+q.map(x=>tileName(x)).join('、')+' 各有4張相同的牌,但未標示為明槓或暗槓。\n\n如果它們是槓,請返回第2步標示;如果只是手牌內剛好有4張(沒有開槓),請確認後繼續。\n\n按「確定」＝確認不是槓,繼續\n按「取消」＝返回第2步標示明牌');
  if(ok){E.quadAck=key;return true;}
  E.mode='meld';return false;
}
function specialFlagsHtml(){
  const R=RL(),fv=id=>{const f=R[id]&&Number(R[id].fan);return Number.isFinite(f)?f:Infinity;};
  const flags=(M.FLAGS||DEFAULT_FLAGS).filter(a=>!(isHK()&&a[0]==='menqing')).concat((isHK()||curPreset()===4)?[]:HUAHU.map(h=>[h[0],h[1]])).map((f,i)=>[f[0],f[1],i]);
  flags.sort((x,y)=>(fv(x[0])===fv(y[0])?0:fv(x[0])<fv(y[0])?-1:1)||x[2]-y[2]);
  return '<div class="flags editor-flags">'+flags.map(([id,name])=>'<label><input type="checkbox" data-chg="flag" data-k="'+id+'"'+(E.flags[id]?' checked':'')+'>'+esc(name)+(fv(id)!==Infinity?' <small>'+fv(id)+'</small>':'')+'</label>').join('')+'</div>';
}
function base_editorPoolHtml(){
  const entries=physicalEntries(),used=Array(35).fill(0),win=editorWin();let winTaken=false;
  const lock=pending.length&&pending[0].ron?pending[0].ron.winTile:null,readonly=E.mode==='flowers'||E.mode==='flags';
  const tiles=entries.map(({t,group})=>{
    const hkKind=(E.hkKongs||{})[t],isKong=isHK()&&(hkKind==='open'||hkKind==='closed');
    const index=group==null?used[t]++:0,isMeld=group!=null||isKong||(!isHK()&&group==null&&index<(E.marks[t]||0));
    let badge=isMeld?(isKong&&hkKind==='closed'?'暗':'明'):'',cls=isMeld?'mk2':'';
    if(!isMeld&&group==null&&index<(E.marks[t]||0)+(E.jsel[t]||0))cls='mark';
    else if(!isMeld&&t===win&&!winTaken){badge='食';cls='mark';winTaken=true;}
    const unavailable=E.mode==='win'&&(isMeld||(lock!=null&&t!==lock)||(t===34&&!E.self));
    const action=group==null?'poolTap':'wildRemoveGroup',target=group==null?'data-t="'+t+'"':'data-i="'+group+'"';
    return mt(t,{tag:'button',badge,cls:cls+(unavailable?' unavailable':'')+(t===overTile?' overbox':'')+(!isMeld&&lock!=null&&t===lock?' lockhi':'')+(!isMeld&&lock!=null&&t!==lock&&E.mode==='win'?' lockdim':''),attrs:'data-act="'+action+'" '+target+' aria-label="'+esc(tileName(t)+(badge?' '+badge:''))+'"'+(readonly||unavailable?' disabled':'')});
  }).join('');
  const empty=Array(Math.max(0,editorCapacity(entries.length)-entries.length)).fill('<span class="tile-slot" aria-hidden="true"></span>').join('');
  return '<div class="editor-pile"><div class="editor-grid">'+tiles+empty+'</div></div>';
}
function setHKKong(t,value){
  if(!isHK()||allCounts()[t]!==4){editorError='只有四張相同的牌可以指定為槓';return;}
  const lock=pending.length&&pending[0].ron?pending[0].ron.winTile:null;
  if(value!=='none'&&lock===t){editorError='共同放炮牌不能放入槓組';return;}
  const chosen=E.hkKongs||(E.hkKongs={}),k=Math.max(0,E.all.length-14);
  const others=Object.keys(chosen).filter(x=>+x!==t&&(chosen[x]==='open'||chosen[x]==='closed')).length;
  if(value!=='none'&&others>=k){editorError='這副牌的張數只容許 '+k+' 個槓';return;}
  chosen[t]=value;E.excl={};if(value!=='none'&&E.hkWin===t)E.hkWin=null;
}
function hkGroupTools(){
  const ac=allCounts(),quads=[];for(let t=0;t<34;t++)if(ac[t]===4)quads.push(t);
  const needK=Math.max(0,E.all.length-14),chosen=E.hkKongs||{};
  let h='<div class="editor-meld-head">'+(needK?'按張數需確認 '+needK+' 個槓':'沒有槓可以略過槓組')+'</div><div class="editor-hk-quads">';
  h+=quads.map(t=>{
    const value=chosen[t]||'none',open=value==='open',closed=value==='closed';
    return '<div class="editor-hk-quad"><div class="row">'+[0,1,2,3].map((_,i)=>mt(t,{back:closed&&(i===0||i===3)})).join('')+'</div><div class="editor-kong-choices">'+[['none','不作槓'],['open','明槓'],['closed','暗槓']].map(([v,name])=>'<button data-act="hkKong" data-t="'+t+'" data-v="'+v+'" class="'+(value===v?'on':'')+'">'+name+'</button>').join('')+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="editor-menqing"><span>門清狀態</span><button data-act="menqing" data-v="1" class="'+(E.flags.menqing===true?'on':'')+'">是</button><button data-act="menqing" data-v="0" class="'+(E.flags.menqing===false?'on':'')+'">否</button></div>';
  return h+'<button data-act="mode" data-v="win">食糊牌：'+esc(E.hkWin==null?'未指定（單人可選填）':tileName(E.hkWin))+'</button>';
}
function ordinaryGroupTools(){
  let h='<div class="editor-meld-groups">'+E.melds.map((m,i)=>meldGroup(m,i)).join('');
  h+=E.wildGroups.map((g,i)=>'<div class="mg" data-act="wildRemoveGroup" data-i="'+i+'"><div class="row">'+g.physical.map(t=>mt(t)).join('')+'</div><small>'+(g.t==='chow'?'上':g.t==='pung'?'碰':g.open===false?'暗槓':'明槓')+'（含百搭） ×</small></div>').join('');
  if(!E.melds.length&&!E.wildGroups.length)h+='<span class="hint">沒有明牌可略過。</span>';h+='</div>';
  if(isWild()&&S.cfg.wildMeld){
    h+='<div class="editor-group-actions"><button data-act="mode" data-v="jmeld" class="'+(E.mode==='jmeld'?'on':'')+'">選含百搭明牌</button>';
    if(E.mode==='jmeld')h+='<button data-act="wildGroup" data-v="chow">加入上牌</button><button data-act="wildGroup" data-v="pung">加入碰牌</button><button data-act="wildGroup" data-v="kong" data-open="1">加入明槓</button><button data-act="wildGroup" data-v="kong" data-open="0">加入暗槓</button><button data-act="wildCancelJ">取消選取</button>';
    h+='</div>';
  }
  if(E.pickRep){const pr=E.pickRep;h+='<div class="editor-group-actions"><span>這組代表：</span>'+pr.cands.map(t=>'<button data-act="repPick" data-t="'+t+'">'+esc(pr.grp.t==='chow'?(t%9+1)+''+(t%9+2)+(t%9+3)+M.SUITS[Math.floor(t/9)]:tileName(t))+'</button>').join('')+'<button data-act="repCancel">取消</button></div>';}
  return h;
}
function editorHint() {
  if (editorError) return editorError;

  if (E.mode === 'pick') {
    const requiredTiles = isHK() ? 14 : 17;
    const currentTiles = physicalEntries().length;

    return '至少需要' + requiredTiles +
      '張，現輸入' + currentTiles +
      '張；點牌盤加牌，點牌堆刪牌';
  }

  if (E.mode === 'jmeld') {
    return '選3或4張牌，再選上／碰／槓';
  }

  if (E.mode === 'meld') {
    return isHK()
      ? '確認槓組、明／暗槓及門清狀態'
      : '點牌堆標明牌；點明牌組可移除';
  }

  if (E.mode === 'flowers') {
    return '點花牌選取或取消；沒有可略過';
  }

  if (E.mode === 'flags') {
    return '勾選本局特殊情況；沒有可略過';
  }

  if (isHK()) {
    return pending.length
      ? '請選共同放炮牌，須與其他食糊者相同'
      : '食糊牌可選填；影響番種時須補選';
  }

  return '點牌堆選食糊牌；再點同款牌取消';
}

 function uiInvalidCalcHint(r, hasWild, busy) {
  const reasons = [];
  const add = text => {
    if (text && !reasons.includes(text)) reasons.push(text);
  };

  // 優先保留計番引擎提供的具體原因。
  const engineError =
    typeof r?.error === 'string' ? r.error.trim() : '';

  if (engineError) add(engineError);

  const noTiles =
    !E.all.length && !E.wildGroups.length;

  const unfinishedWildGroup =
    !!E.pickRep || Object.keys(E.jsel || {}).length > 0;

  if (noTiles) {
    add('第一步「選牌」：尚未輸入手牌，請先加入牌。');
  }

  if (unfinishedWildGroup) {
    add(
      '第二步「明牌」：含百搭明牌尚未完成，' +
      '請完成組牌、選定代表牌，或取消選取。'
    );
  }

  if (!isHK() && E.partBad) {
    add(
      '第二步「明牌」：目前標記的牌無法組成完整的上／碰／槓，' +
      '請檢查或移除未完成的明牌標記。'
    );
  }

  if (isHK()) {
    const extraTiles = E.all.length - 14;
    const kongCount = Object.values(E.hkKongs || {})
      .filter(v => v === 'open' || v === 'closed')
      .length;

    // 沿用 editorFinish 已有的槓數檢查條件。
    if (
      extraTiles >= 0 &&
      extraTiles <= 4 &&
      kongCount !== extraTiles
    ) {
      add(
        '第二步「槓／門清」：目前輸入' + E.all.length +
        '張牌，須確認' + extraTiles +
        '個槓；目前已標示' + kongCount + '個。'
      );
    }

    if (typeof E.flags.menqing !== 'boolean') {
      add('第二步「槓／門清」：尚未確認門清狀態。');
    }

    if (r?.needsSelect && E.hkWin == null) {
      add(
        '第三步「食糊」：不同食糊牌會影響番種，' +
        '請指定最後食入／自摸的牌。'
      );
    }

    if (!E.self && pending.length && E.hkWin == null) {
      add(
        '第三步「食糊」：一炮多響須指定共同放炮牌，' +
        '請選擇與其他食糊者相同的牌。'
      );
    }
  } else {
    if (!noTiles && E.win == null) {
      add('第三步「食糊」：尚未指定食糊牌，請點選最後食入／自摸的牌。');
    }

    if (!E.self && E.win === 34) {
      add('第三步「食糊」：百搭不能作為放炮牌，請重新選擇。');
    }
  }

  if (hasWild && busy) {
    add('百搭最高番搜尋仍在進行中，完成後才可確認記錄。');
  }

  // 沒有明確錯誤時，不假定是牌數或牌型有錯。
  if (!reasons.length) {
    add(
      hasWild
        ? '目前尚未取得可記錄的計番結果。請先按「搜尋最高番」；' +
          '若仍無法完成，再返回修改檢查選牌、明牌及食糊牌。'
        : '目前尚未取得可記錄的計番結果。請按「返回修改」，' +
          '檢查選牌數量、明牌組合及食糊牌後，再按確認番數。'
    );
  }

  const currentTiles = physicalEntries().length;

  return (
    '<div class="warn" role="alert" aria-live="polite">' +
      '<div style="font-weight:700;margin-bottom:6px">' +
        '暫時無法確認記錄' +
      '</div>' +

      '<ul style="margin:0;padding-left:20px;line-height:1.6">' +
        reasons.map(text =>
          '<li>' + esc(text) + '</li>'
        ).join('') +
      '</ul>' +

      '<div style="margin-top:8px;font-size:12px;opacity:.85">' +
        '目前輸入：' + currentTiles + '張。' +
        '可按下方「返回修改」處理上述項目。' +
      '</div>' +
    '</div>'
  );
}
 
function editorPanelHtml(){
  if(E.mode==='pick')return palette();
  if(E.mode==='meld'||E.mode==='jmeld')return '<div class="editor-group-tools">'+(isHK()?hkGroupTools():ordinaryGroupTools())+'</div>';
  if(E.mode==='flowers')return '<div class="editor-flowers"><div class="editor-panel-title">花牌 · 已選 '+E.flowers.filter(Boolean).length+' 張</div>'+flowerButtonsHtml()+'</div>';
  if(E.mode==='flags')return specialFlagsHtml();
  const win=editorWin();
  const lockT=(pending.length&&pending[0].ron)?pending[0].ron.winTile:null;
  if(lockT!=null){
    const have=E.all.includes(lockT);
    return '<div class="editor-win-status">雙響／三響 · 共同放炮牌:<b>'+esc(tileName(lockT))+'</b>'+(have?'':'<div class="warn">你的牌裡沒有這張,請先到「選牌」加入(已高亮)</div>')+'<div class="hint">其餘牌已置灰,只能選共同放炮牌。</div></div>';
  }
  return '<div class="editor-win-status">'+(win==null?(isHK()?'未指定食糊牌；單人可先繼續，影響番種時會要求補選。':'未選食糊牌'):('已選 '+esc(tileName(win))+(win===34?'（只限自摸）':'')))+'<div class="hint">可切換花牌／特殊，完成後查看結果。</div></div>';
}

function liveTotalHtml(){
  try{
    if(isWild())return '';
    derive();
    const who=E.winner!=null?nm(E.winner)+(E.self?' 自摸':' 食糊'):'本手';
    const res=analyze();
    if(!res){
      const n=physicalEntries().length;
      return '<div class="editor-live idle">'+who+' — 暫未成牌('+n+' 張'+(isHK()?'':',請選食糊牌')+')</div>';
    }
    if(res.error)return '<div class="editor-live bad">'+who+' — ✕ '+esc(res.error)+'</div>';
    const items=curItems(res),raw=Math.max(0,items.reduce((s,x)=>s+x.total,0));
    const total=isHK()?Math.min(raw,hkCap()):raw,minF=isHK()?S.cfg.hk.minFan:S.cfg.minFan;
    const eff=isHK()?total:total-diTotal(items);
    const low=minF>0&&eff<minF;
    let num;
    if(isHK())num='<b>'+total+'</b>'+(raw>total?'(封頂)':'');
    else{
      const dealer=dealerPid(),bonus=1+2*S.streak;
      const b=(E.winner===dealer||(!E.self&&E.disc===dealer))?bonus:0;
      num='<b>'+total+'</b> + <b>'+b+'</b>';
    }
    const note=isHK()?(typeof E.flags.menqing!=='boolean'?' <small>(門清未確認)</small>':''):(E.self&&E.winner!==dealerPid()?' <small>(莊家一份 +'+(1+2*S.streak)+')</small>':'');
    return '<div class="editor-live '+(low?'bad':'good')+'">'+who+' — '+(low?'✕ ':'✓ ')+num+' 番'+note+(low?' · 未達 '+minF+' 番起糊':'')+'</div>';
  }catch(e){return '';}
}
function base_editorHtml(){
  const mode=E.mode,marking=mode==='meld'||mode==='jmeld',n=physicalEntries().length,win=editorWin(),max=isHK()?18:22;
  const marked=isHK()?Object.values(E.hkKongs||{}).filter(v=>v==='open'||v==='closed').length*4:E.marks.reduce((n,x)=>n+(x||0),0);
  const lock=pending.length&&pending[0].ron?pending[0].ron.winTile:null;
  const steps=[['pick','選牌'],['meld',isHK()?'槓／門清':'明牌'],['win','食糊'],['flowers','花牌'],['flags','特殊']];
  let h='<div class="editor-screen" role="region" aria-label="五段式輸入"><header class="editor-head"><div>'+playerLabel(E.winner)+' <small>'+(E.self?'自摸':'食 '+nm(E.disc))+'</small></div><div class="editor-head-actions"><span class="editor-compact-tools"><button data-act="undoTile">退牌</button><button data-act="clearHand">清空</button>'+(isHK()&&!pending.length?'<button data-act="quickStart">快速</button>':'')+'</span><button data-act="editorBack">返回牌桌</button></div></header>';
  h+='<main class="editor-main"><div class="editor-stats">共'+n+'張'+(n>max?'（超出上限'+max+'）':'')+' · 明／槓'+marked+'張 · '+(win==null?'未選食糊牌':'食糊 '+esc(tileName(win)))+(lock!=null?' · 共同 '+esc(tileName(lock)):'')+'</div>';
  h+=liveTotalHtml()+editorPoolHtml()+'<div class="editor-tools"><button data-act="undoTile">退一張</button><button data-act="clearHand">全部清空</button>'+(isHK()&&!pending.length?'<button data-act="quickStart">快速記番</button>':'')+'</div><div class="editor-panel" aria-label="目前模式內容">'+editorPanelHtml()+'</div></main>';
  h+='<footer class="editor-footer"><div class="editor-segments" role="group" aria-label="輸入模式">'+steps.map(([v,label],i)=>'<button data-act="mode" data-v="'+v+'" aria-label="第'+(i+1)+'段：'+label+'" aria-pressed="'+(v==='meld'?marking:mode===v)+'" class="'+((v==='meld'?marking:mode===v)?'on':'')+'">'+label+'</button>').join('')+'</div><div class="editor-hint" aria-live="polite">'+esc(editorHint())+'</div><div class="editor-finish"><button data-act="editorBack">稍後繼續</button><button class="primary" data-act="editorFinish">完成輸入，查看結果</button></div></footer></div>';
  return h;
}
function base_fitEditor(){
  const box=document.querySelector('.editor-screen');if(!box)return;
  const vv=window.visualViewport,height=Math.floor(vv?vv.height:window.innerHeight),width=Math.floor(vv?vv.width:window.innerWidth);
  box.style.setProperty('--editor-height',height+'px');box.style.top=(vv?vv.offsetTop:0)+'px';
  const compact=height<620;box.classList.toggle('editor-compact',compact);
  const head=box.querySelector('.editor-head').getBoundingClientRect().height,foot=box.querySelector('.editor-footer').getBoundingClientRect().height;
  const safe=parseFloat(getComputedStyle(box).paddingBottom)||0,budget=height-head-foot-safe-(compact?228:280);
  const frameCell=Math.max(44,Math.min(86,Math.floor((budget-12)/3)));
  const usable=Math.min(660,width-32),baseW=Math.min(62,Math.floor((usable-30)/6),Math.floor(frameCell*.78));
  const baseH=Math.floor(baseW/.78),cols=editorColumns(physicalEntries().length),scale=6/cols;
  const tileW=Math.min(Math.floor(baseW*scale),Math.floor((usable-(cols-1)*6)/cols)),tileH=Math.floor(tileW/.78);
  box.style.setProperty('--pile-frame-h',(baseH*3+12)+'px');box.style.setProperty('--pile-cols',cols);
  box.style.setProperty('--tile-w',Math.max(24,tileW)+'px');box.style.setProperty('--tile-h',Math.max(31,tileH)+'px');
  box.style.setProperty('--face-size',Math.max(15,Math.floor(22*scale))+'px');box.style.setProperty('--suit-size',Math.max(9,Math.floor(11*scale))+'px');box.style.setProperty('--badge-size',Math.max(8,Math.floor(10*scale))+'px');
}

const QUICK_CONFLICTS=[['hunyise','qingyise','quanfanzi'],['xiaosanyuan','dasanyuan'],['xiaosixi','daxixi'],['pinghu','duidui'],['wuhua','zhenghua','dahuahu','xiaohuahu','yitaihua']];
function quickConflicts(){
  const q=E.quick||{},out=[],R=RL();
  QUICK_CONFLICTS.forEach(g=>{const on=g.filter(id=>q[id]>0);if(on.length>1)out.push(on.map(id=>R[id].name).join('、')+' 通常不會同時成立,請確認');});
  return out;
}
function quickSummaryHtml(){
  return '<div class="card editor-reviewed"><div><div class="zl">快速記番 · 不輸入牌型</div><small>直接選番種計番;系統不會檢查牌型是否真的成立</small></div><button data-act="quickStop">改用牌型輸入</button></div>';
}
function base_quickPanelHtml(){
  const R=RL(),ids=Object.keys(R).filter(id=>R[id]&&id!=='zimo').sort((a,b)=>(R[a].fan-R[b].fan));
  let h='<div class="card quickpanel"><div class="zl" style="margin-top:0">選擇番種'+(E.self?' <small>(自摸 1 番已自動計入)</small>':'')+'</div>',last=null;
  ids.forEach(id=>{
    const f=R[id];
    if(f.fan!==last){h+='<div class="zl">'+esc(f.fan)+' 番</div>';last=f.fan;}
    const n=(E.quick&&E.quick[id])||0;
    h+='<div class="qrow'+(n>0?' on':'')+'"><span>'+esc(f.name)+'</span><span class="qstep"><button data-act="quickN" data-id="'+id+'" data-d="-1"'+(n?'':' disabled')+'>−</button><b>'+n+'</b><button data-act="quickN" data-id="'+id+'" data-d="1">＋</button></span></div>';
  });
  const cf=quickConflicts();
  if(cf.length)h+=cf.map(x=>'<div class="warn">'+esc(x)+'</div>').join('');
  return h+'</div>';
}
function editorSummaryHtml(){
  const count=physicalEntries().length,win=editorWin();
  return '<div class="card editor-reviewed"><div><div class="zl">輸入已完成 · '+count+' 張 · 花牌'+E.flowers.filter(Boolean).length+'張</div><small>食糊牌：'+esc(win==null?'自動分析':tileName(win))+'</small></div><button data-act="editorEdit">修改輸入</button></div>';
}
function inputSection(){return editorSummaryHtml();}
function inputSectionHK(){return editorSummaryHtml();}


function resultHint(res){
  if(isWild()) return wildHint(res);
  if(isHK()){
    const hx=hkHintHtml();
    if(!E.all.length) return '<div class="hint">請先用牌盤選牌。</div>';
    if(res&&res.error) return hx+'<div class="warn">這副牌可能輸入有誤,或是詐糊。('+esc(res.error)+')</div>';
    if(!res) return '<div class="hint">請先用牌盤選牌。</div>';
    return hx+'<div class="ok">已自動分析(共 '+res.count+' 種讀法,取最高番)</div>';
  }
  if(E.win==null) return '<div class="hint">未指名食糊牌:請點「食糊牌」框的空白處,再點牌堆裡最後食糊的那張,即可自動算番。</div>';
  if(E.partBad) return '<div class="warn">明牌標記無法組成'+CHI+'、碰或槓(每組3張,槓4張),可能輸入有誤。</div>';
  if(res&&res.error) return '<div class="warn">這副牌可能輸入有誤,或是詐糊。('+esc(res.error)+')</div>';
  if(!res) return '<div class="warn">牌數與預期不符(手牌連食糊牌 '+(E.hand.length+1)+' 張,應為 '+need()+' 張),可能輸入有誤,或是詐糊。</div>';
  return '<div class="ok">已自動分析(共 '+res.count+' 種拆法,取最高番;聽 '+res.waits+' 張牌)</div>';
}
function viewCalc(){
  if(entryStep!=='hand')return viewEntryFlow();
  if(editorActive())return editorHtml();
  const res=analyze(); const items=curItems(res);
  const rawTotal=Math.max(0,items.reduce((a,x)=>a+x.total,0));
  const total=isHK()?Math.min(rawTotal,hkCap()):rawTotal;
  if(E.winner==null) E.winner=S.seat[0];
  let h='<div class="status">目前:<b>'+WIND[S.wind]+'風圈</b> · 莊家 '+nm(dealerPid())+' · 連莊 '+S.streak+' 次<br>食糊者(胡牌)'+nm(E.winner)+' 的門風:<b>'+windOf(E.winner)+'風</b>'+(E.winner===dealerPid()?'(莊家)':'')+'</div>';
  h+='<div class="hint">各家門風:'+S.seat.map(p=>nm(p)+' '+windOf(p)).join(' · ')+'<br>玩法:'+gameName()+'</div>';
  if(pending.length){ h+='<div class="note">已加入 '+pending.length+' 位食糊者:'+pending.map(w=>nm(w.p)+' '+w.total+'番').join('、')+'</div>';
    const pr=ronProblems(false); h+=pr.length?'<div class="warn">'+pr.map(esc).join('<br>')+'</div>':'<div class="hint">雙響／三響:放炮牌必須相同('+esc(tileName(pending[0].ron.winTile))+'),四家合共每款牌最多 4 張。</div>'; }
  h+='<h3>食糊者：'+playerLabel(E.winner)+'</h3><div class="btnrow"><button data-act="entryPick">改選贏家</button><button data-act="tab" data-v="table">返回牌桌（保留輸入）</button></div>';
  h+='<div class="seg two"><button class="'+(E.self?'on':'')+'" data-act="self" data-v="1">自摸</button><button class="'+(!E.self?'on':'')+'" data-act="self" data-v="0">別家出銃</button></div>';
  if(!E.self){ h+='<div class="lbl">出銃者(放槍)</div>'+winnerBtns('disc',E.disc); }
  h+=E.quick?quickSummaryHtml()+quickPanelHtml():editorSummaryHtml();
  if(isHK()&&res&&res.needsSelect&&E.hkWin==null)h+='<div class="warn">不同食糊牌影響番種，請修改輸入並補選食糊牌。</div>';
  h+='<h3 id="result-top">番數結果</h3>';
  h+=E.quick?'':resultHint(res);
  h+=shareCard(res,total,rawTotal);
  if(baoVisible()){
    h+='<h3>包牌(自摸時由供牌者包付三家)</h3><label>包牌者<select data-chg="bao"><option value="">無</option>'+S.seat.filter(p=>p!==E.winner).map(p=>'<option value="'+p+'"'+(E.bao===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label><p class="hint">十二章包:供給第四組明章(明坎、上、任何槓)的一家包付;第四組是暗槓則無人包。大三元包:供給第三組三元牌明章的一家包付。包後不包先,只計一家。</p>';
  }
  h+='<div class="fans">'+items.map(x=>'<div class="fan"><label>'+(x.id==='di'?'🔒 ':x.id==='adjust'?'✎ ':'<input type="checkbox" data-chg="excl" data-id="'+x.id+'" checked> ')+x.name+(x.n>1?' ×'+x.n:'')+'</label><span>'+x.total+'</span></div>').join('')+(isHK()?'':lockedFanRows())+'</div>';
  const exl=Object.keys(E.excl).filter(k=>E.excl[k]);
  if(exl.length){ const r=RL(); h+='<div class="hint">已取消:'+exl.map(k=>'<a data-act="unexcl" data-id="'+k+'">'+(r[k]?r[k].name:k)+'(恢復)</a>').join(' ')+'</div>'; }
  if(E.extra.length){ const r=RL(); h+='<div class="extras">'+E.extra.map((x,i)=>'<span class="meld">'+(r[x.id]?r[x.id].name:x.id)+' ×'+x.n+' <b data-act="extraN" data-i="'+i+'" data-d="1">＋</b> <b data-act="extraN" data-i="'+i+'" data-d="-1">−</b> <b data-act="rmExtra" data-i="'+i+'">✕</b></span>').join('')+'</div>'; }
  h+=adjustUI();
  h+='<div class="addfan"><select data-chg="addId"><option value="">＋ 手動加番種…</option>'+fanList().filter(f=>f.id!=='di').map(f=>'<option value="'+f.id+'">'+f.name+' ('+f.fan+(f.fanC!=null?'/'+f.fanC:'')+')</option>').join('')+'</select></div>';
  const minF=isHK()?S.cfg.hk.minFan:S.cfg.minFan;
  h+='<div class="total">'+(isHK()?'合計 <b>'+total+'</b> 番':finalTotals(total))+(isHK()&&rawTotal>hkCap()?' <span class="hint">(疊加 '+rawTotal+' 番,封頂 '+hkCap()+' 番)</span>':'')+(minF>0&&(total-diTotal(items))<minF?' <span class="neg">('+(isHK()?'不足 '+minF+' 番,記錄時當詐糊':'低於起糊 '+minF+' 番')+')</span>':'')+'</div>';
  if(isHK()){
    if(E.self||E.disc!=null){
      const w0={p:E.winner,self:E.self,disc:E.disc,total:total,qiang:!!E.flags.qiangkong&&!E.self,bao:E.bao};
      const d=settleHK(hasCurrentData()?pending.concat([w0]):pending);
      h+='<h3>本局計分預覽</h3><div class="prev">'+S.seat.map(p=>'<div><small>'+nm(p)+'</small><b class="'+(d[p]>=0?'pos':'neg')+'">'+money(d[p])+'</b></div>').join('')+'</div><p class="hint">'+HK_PRESETS[S.cfg.hk.preset].name+':'+total+' 番出銃 '+hkRon(total)+' 分,自摸每家 '+hkShare(total)+' 分。</p>';
    }
  } else if(E.self||E.disc!=null){
    const ws=pending.map(w=>({p:w.p,self:false,disc:w.disc,total:w.total,mult:w.mult})).concat(hasCurrentData()?[{p:E.winner,self:E.self,disc:E.disc,total,mult:wildMult()}]:[]);
    const out=applyHand(S.ledger,mkTxns(ws,dealerPid(),S.streak),true);
    h+='<h3>本局記帳預覽</h3><div class="prev">'+S.seat.map(p=>'<div><small>'+nm(p)+'</small><b class="'+(out.cash[p]>=0?'pos':'neg')+'">'+money(out.cash[p])+'</b></div>').join('')+'</div><p class="hint">上方為本局實際收付的現金;新的食糊金額先記入「拉」,不立即收付。</p>';
    h+=out.ev.map(e=>'<div class="hint">• '+evText(e)+'</div>').join('');
  }
  h+='<div class="btnrow"><button class="primary" data-act="confirm">確認記錄</button>'+(E.quick?'':'<button data-act="addWinner">再加一位食糊者(雙/三響)</button>')+'<button data-act="clearEntry">重設本局</button></div>';
  h+=viewInstantControls();
  return h;
}
function viewInstantControls(){
  let h='';
  h+='<h3>即時籌碼 / 罰則</h3>'+(lastUndo&&lastUndo.kind==='instant'?'<div class="note">'+esc(lastEntryMessage)+' <button class="danger" data-act="delInst" data-id="'+esc(lastUndo.id)+'">撤銷 '+esc(lastUndo.label)+'</button></div>':'')+'<p class="hint">這類籌碼即時收付'+(isHK()?'':',不受拉、踢半影響')+'。金額可直接修改,數字 0 的項目請自行填寫。</p>';
  const lst=instList(); let I=lst.find(x=>x.id===inst.id);
  if(!I){ I=lst[0]; inst.id=I.id; inst.mode=I.mode; }
  if(inst.payee==null) inst.payee=S.seat[0];
  if(inst.payer==null) inst.payer=S.seat[1];
  const baseAmt=S.cfg.fanValue*baseFan();
  h+='<div class="grid2"><label>項目<select data-chg="instId">'+lst.map(x=>'<option value="'+x.id+'"'+(x.id===inst.id?' selected':'')+'>'+x.name+'</option>').join('')+'</select></label>';
  h+='<label>金額(每份)<input type="number" step="any" data-chg="instAmt" value="'+instAmt(I)+'"></label>';
  h+='<label>模式<select data-chg="instMode"><option value="all"'+(inst.mode==='all'?' selected':'')+'>其餘三家付給收款人</option><option value="one"'+(inst.mode==='one'?' selected':'')+'>單一付款人付給單一收款人</option><option value="payall"'+(inst.mode==='payall'?' selected':'')+'>付款人付給其餘三家</option><option value="burn"'+(inst.mode==='burn'?' selected':'')+'>付款人扣分(不加給他家)</option></select></label>';
  h+='<label>倍數<select data-chg="instMult">'+[1,2,3,4,5].map(n=>'<option value="'+n+'"'+(inst.mult===n?' selected':'')+'>×'+n+'</option>').join('')+'</select></label>';
  if(inst.mode==='all'||inst.mode==='one') h+='<label>收款人<select data-chg="instPayee">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(inst.payee===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>';
  if(inst.mode!=='all') h+='<label>付款人<select data-chg="instPayer">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(inst.payer===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>';
  h+='</div>'+(I.plusBase?'<p class="hint">此項目另加底 $'+baseAmt+'。</p>':'')+'<div class="btnrow"><button data-act="instSave">記錄:'+esc(I.name)+(inst.mult>1?' ×'+inst.mult:'')+'</button></div>';
  return h;
}

function validLedgerSnapshot(rows){
  return Array.isArray(rows)&&rows.every(r=>r&&Number.isInteger(r.from)&&r.from>=0&&r.from<4&&Number.isInteger(r.to)&&r.to>=0&&r.to<4&&Number.isFinite(r.amt));
}
function ledgerFigures(rows){
  const incoming=[0,0,0,0],outgoing=[0,0,0,0];
  rows.forEach(r=>{incoming[r.to]+=r.amt;outgoing[r.from]+=r.amt;});
  return {incoming,outgoing,net:incoming.map((n,p)=>n-outgoing[p])};
}
function finalizeFinancialSnapshots(){
  // Seal only records created by this build, after the action has finished updating the ledger.
  S.history.forEach((r,i)=>{
    if(r.financePending!==true)return;
    const next=S.history[i+1];
    const after=next&&validLedgerSnapshot(next.ledgerBefore)?next.ledgerBefore:(i===S.history.length-1?S.ledger:null);
    if(!validLedgerSnapshot(after))return;
    r.ledgerAfter=copyL(after);r.financeSchema=1;delete r.financePending;
  });
}
function historyFinancials(index){
  const r=S.history[index];
  const cash=[0,1,2,3].map(p=>Number.isFinite((r.deltas||[])[p])?r.deltas[p]:0);
  const mode=r.financeMode||S.game;
  if(mode==='hk')return {complete:true,cash,total:cash.slice(),pending:[0,0,0,0],receivableChange:[0,0,0,0],payableChange:[0,0,0,0],mode};
  const before=r.ledgerBefore,next=S.history[index+1];
  let after=r.ledgerAfter;
  if(!validLedgerSnapshot(after)){
    if(next&&validLedgerSnapshot(next.ledgerBefore))after=next.ledgerBefore;
    else if(index===S.history.length-1&&validLedgerSnapshot(S.ledger))after=S.ledger;
  }
  if(!validLedgerSnapshot(before)||!validLedgerSnapshot(after))return {complete:false,cash,total:null,pending:null,mode};
  const a=ledgerFigures(before),b=ledgerFigures(after);
  const pending=b.net.map((n,p)=>n-a.net[p]);
  return {complete:true,cash,total:cash.map((n,p)=>n+pending[p]),pending,
    receivableChange:b.incoming.map((n,p)=>n-a.incoming[p]),payableChange:b.outgoing.map((n,p)=>n-a.outgoing[p]),mode};
}
function historyMoneyHtml(index){
  const f=historyFinancials(index);
  let h='<div class="hint">本局淨變動（完成後總額 − 開始前總額）</div><div class="prev">';
  h+=S.seat.map(p=>{
    const value=f.complete?f.total[p]:null;
    let cell='<div><small>'+playerLabel(p)+'</small><b'+(value==null?'':' class="'+(value>=0?'pos':'neg')+'"')+'>'+(value==null?'—':money(value))+'</b>';
    cell+='<small style="display:block">已收付 '+money(f.cash[p])+'</small>';
    if(f.complete&&f.mode!=='hk')cell+='<small style="display:block">未結算變動 '+money(f.pending[p])+'</small>';
    return cell+'</div>';
  }).join('');h+='</div>';
  if(!f.complete)h+='<div class="warn">舊紀錄缺少拉數快照，無法確認本局總淨變動；小字只顯示已收付，未假設未結算金額為 0。</div>';
  else if(f.mode!=='hk'){
    h+='<div class="hint">未結算變動為本筆記錄造成的拉數淨額變化，包含新增、結清、踢半等；不是目前累計拉數。</div>';
    const both=[0,1,2,3].filter(p=>f.receivableChange[p]!==0&&f.payableChange[p]!==0);
    if(both.length)h+='<div class="hint">'+both.map(p=>playerLabel(p)+'：未收拉變動 '+money(f.receivableChange[p])+'／未付拉變動 '+money(f.payableChange[p])).join('；')+'</div>';
  }
  return h;
}



function historyPlayerName(p){return esc((S.names&&S.names[p])||('玩家'+(Number(p)+1)));}
function historyPlayerLabel(p){
  const emoji=(S.avatars&&S.avatars[p])||(typeof DEFAULT_AVATARS!=='undefined'?DEFAULT_AVATARS[p]:'');
  return (emoji?esc(emoji)+' ':'')+historyPlayerName(p);
}
function historyAfterLedger(idx){
  const r=S.history[idx];
  if((r.financeMode||S.game)==='hk')return [];
  if(validLedgerSnapshot(r.ledgerAfter))return r.ledgerAfter;
  const next=S.history[idx+1];
  if(next&&validLedgerSnapshot(next.ledgerBefore))return next.ledgerBefore;
  if(idx===S.history.length-1&&validLedgerSnapshot(S.ledger))return S.ledger;
  return null;
}
function historyFanText(w){
  return (w.fans||[]).map(f=>esc(f.name||f.id)+((f.n||1)>1?'×'+esc(f.n):'')+' '+esc(f.total)).join(' · ');
}

function histBonus(r,w){
  if((r.financeMode||S.game)==='hk')return null;
  const st=Number(r.streak)||0;
  let scope='none';
  if(w.p===r.dealer)scope='all';else if(w.self)scope='dealer';else if(w.disc===r.dealer)scope='all';
  return {d:1,s:2*st,scope:scope,add:1+2*st};
}
function histWinLine(r,w){
  const b=histBonus(r,w),tot=Number(w.total)||0;
  let head='<b>'+esc(tot)+'番</b>',extra='';
  const bx=b&&b.scope!=='none'?' · 莊家 '+b.d+(b.s?' · 連莊 '+b.s:''):'';
  if(b&&b.scope==='all'){head='<b>'+esc(tot+b.add)+'番</b>';extra=bx;}
  else if(b&&b.scope==='dealer'){head='每家 <b>'+esc(tot)+'番</b>・莊家一份 <b>'+esc(tot+b.add)+'番</b>';extra=bx+'(只加莊家一份)';}
  if(w.mult>1)extra+=' · 全部 ×'+esc(w.mult);
  return {head:head,extra:extra};
}
function histPayText(d,amt){
  if(!d)return '';
  const parts=[];
  if(d.bf)parts.push('底 '+d.bf);
  parts.push('牌型 '+d.pat);
  if(d.df)parts.push('莊家 '+d.df);
  if(d.sf)parts.push('連莊 '+d.sf);
  let x='('+parts.join(' + ')+')';
  if(d.mult>1)x+=' × 倍率 '+d.mult;
  return x+' × 每番 $'+d.fv+' = $'+amt;
}
function ledgerDetailHtml(idx,row){
  for(let i=idx;i>=0;i--){
    const evs=(S.history[i].events||[]);
    const e=evs.find(x=>(x.t==='la'||x.t==='new')&&x.from===row.from&&x.to===row.to&&x.amt===row.amt);
    if(!e)continue;
    let h='<details><summary>計算方法</summary><div class="hint">';
    if(e.t==='new'){
      const pt=histPayText(e.d,e.amt);
      h+='第1口:'+(pt?esc(pt):'$'+esc(e.amt));
    }else if(e.prev!=null){
      h+='上口欠款 $'+esc(e.prev)+' × 1.5 = '+esc(e.prev*1.5)+',向上取整 $'+esc(e.half)+'<br>';
      const pt=histPayText(e.d,e.add);
      h+='+ 本局新增 '+(pt?esc(pt):'$'+esc(e.add))+'<br>';
      h+='= 第'+esc(e.k)+'口累計 $'+esc(e.amt);
    }else h+='舊紀錄沒有保存計算明細。';
    return h+'</div></details>';
  }
  return '';
}
function editFloor(){
  let c=0;
  for(let i=S.history.length-1;i>=0;i--){const k=S.history[i].kind;if(k==='win'||k==='draw'){c++;if(c===5)return i;}}
  return 0;
}
function canEditRec(idx){
  const r=S.history[idx];
  return !!r&&r.kind==='win'&&idx>=editFloor()&&!!r.before&&validLedgerSnapshot(r.ledgerBefore)&&(r.financeMode||S.game)===S.game;
}
function editWinners(){
  const r=S.history[editRec.idx],out=[],seen={};
  for(let i=0;i<editRec.winners.length;i++){
    const e=editRec.winners[i],o=r.winners[i];
    if(!S.seat.includes(e.p))return {err:'請選擇食糊者'};
    if(seen[e.p])return {err:'同一位玩家不能重複食糊'};
    seen[e.p]=1;
    if(!e.self&&(!S.seat.includes(e.disc)||e.disc===e.p))return {err:'出銃者不能是食糊者本人'};
    const w=JSON.parse(JSON.stringify(o));
    w.p=e.p;w.self=!!e.self;w.disc=e.self?null:e.disc;
    if(e.total!==o.total){
      w.fans=(w.fans||[]).filter(f=>f.id!=='manual');
      const sum=w.fans.reduce((a,f)=>a+(typeof f.total==='number'?f.total:0),0);
      if(e.total!==sum)w.fans.push({id:'manual',name:'手動修正',n:1,total:e.total-sum});
      w.total=e.total;w.raw=e.total;
    }
    out.push(w);
  }
  const discs=out.filter(w=>!w.self).map(w=>w.disc);
  if(out.some(w=>w.self)&&out.length>1)return {err:'自摸不可與其他食糊者同局'};
  if(discs.length&&discs.some(d=>d!==discs[0]))return {err:'同局多響必須是同一位出銃者'};
  return {ws:out};
}
function replayFrom(k,newW){
  const sv={ds:S.dealerSeat,st:S.streak,w:S.wind,l:S.ledger,cfg:S.cfg};
  try{
    const b0=S.history[k];
    S.dealerSeat=b0.before.dealerSeat;S.streak=b0.before.streak;S.wind=b0.before.wind;
    let ledger=copyL(b0.ledgerBefore);const recs=[];let warn=0;
    for(let i=k;i<S.history.length;i++){
      const o=S.history[i],r=JSON.parse(JSON.stringify(o)),dealer=dealerPid();S.cfg=o.rulesSnapshot?JSON.parse(JSON.stringify(o.rulesSnapshot)):sv.cfg;pickM();
      r.before=before();r.dealer=dealer;r.streak=S.streak;r.wind=S.wind;
      r.ledgerBefore=copyL(ledger);delete r.ledgerAfter;delete r.financeSchema;r.financePending=true;
      if(r.kind==='win'){
        const ws=i===k?newW:r.winners;
        r.winners=ws;
        if(isHK()){
          r.deltas=settleHK(ws);r.events=[];
          advance(ws.some(w=>w.p===dealer)&&S.cfg.hk.renzhuang,false);
        }else{
          const out=applyHand(ledger,mkTxns(ws,dealer,S.streak),true);
          let lg=out.ledger,cash=out.cash,ev=out.ev.slice();
          lg.slice().forEach(x=>{
            if(x.hit&&x.k>=3&&x.k%3===0&&(o.events||[]).some(e=>e.t==='surrender'&&e.from===x.from&&e.to===x.to)){
              cash[x.from]-=x.amt;cash[x.to]+=x.amt;ev.push({t:'surrender',from:x.from,to:x.to,amt:x.amt});lg=lg.filter(y=>y!==x);
            }
          });
          ledger=lg;r.deltas=cash;r.events=ev;
          advance(ws.some(w=>w.p===dealer),false);
        }
        if(i===k)r.edited=Date.now();
      }else if(r.kind==='draw'){
        if(isHK())advance(false);else advance(S.cfg.drawKeeps,true);
      }else if(r.kind==='settle'&&(r.events||[]).length){
        const del=[0,0,0,0];let evs=[];
        if(r.name==='結清全部拉數'){
          ledger.forEach(x=>{del[x.from]-=x.amt;del[x.to]+=x.amt;evs.push({t:'settle',from:x.from,to:x.to,amt:x.amt});});
          ledger=[];
        }else{
          r.events.forEach(e=>{
            const j=ledger.findIndex(x=>x.from===e.from&&x.to===e.to);
            let amt=e.amt;
            if(j>=0){amt=ledger[j].amt;ledger.splice(j,1);}else warn++;
            del[e.from]-=amt;del[e.to]+=amt;evs.push(Object.assign({},e,{amt:amt}));
          });
        }
        r.deltas=del;r.events=evs;
      }
      recs.push(r);
    }
    return {recs:recs,dealerSeat:S.dealerSeat,streak:S.streak,wind:S.wind,ledger:ledger,warn:warn};
  }finally{S.dealerSeat=sv.ds;S.streak=sv.st;S.wind=sv.w;S.ledger=sv.l;S.cfg=sv.cfg;pickM();}
}
function editModalHtml(){
  const sel=(opts,cur,attrs)=>'<select '+attrs+' style="width:100%">'+opts.map(o=>'<option value="'+o[0]+'"'+(String(o[0])===String(cur)?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>';
  let h='<div class="modal" data-act="editClose"><div class="mbox editbox" data-act="noop"><h3>修改 #'+(editRec.idx+1)+' 並重算</h3>';
  editRec.winners.forEach((e,i)=>{
    h+='<div class="card"><div class="zl">食糊者 '+(i+1)+'</div>';
    h+='<label class="edl">食糊者'+sel(S.seat.map(p=>[p,historyPlayerName(p)]),e.p,'data-chg="edW" data-f="p" data-w="'+i+'"')+'</label>';
    h+='<label class="edl">自摸／出銃'+sel([['self','自摸']].concat(S.seat.filter(p=>p!==e.p).map(p=>[p,historyPlayerName(p)+' 出銃'])),e.self?'self':e.disc,'data-chg="edW" data-f="mode" data-w="'+i+'"')+'</label>';
    h+='<label class="edl">牌型番數(不含莊家／連莊加番)<input type="number" min="0" step="1" style="width:100%" value="'+esc(e.total)+'" data-chg="edW" data-f="total" data-w="'+i+'"></label></div>';
  });
  const v=editWinners();let ok=false;
  if(v.err)h+='<div class="warn">'+esc(v.err)+'</div>';
  else{
    const rp=replayFrom(editRec.idx,v.ws);
    const k=editRec.idx,sumD=(arr)=>{const b=[0,0,0,0];arr.forEach(x=>x.deltas.forEach((d,i)=>b[i]+=d));return b;};
    const oldC=sumD(S.history.slice(k)),newC=sumD(rp.recs);
    const oldP=pendingBal(),newP=[0,0,0,0];rp.ledger.forEach(x=>{newP[x.to]+=x.amt;newP[x.from]-=x.amt;});
    h+='<div class="zl">重算由 #'+(k+1)+' 至 #'+S.history.length+'(共 '+rp.recs.length+' 筆)</div><div class="prev">';
    h+=S.seat.map(p=>{
      const o=oldC[p]+oldP[p],n=newC[p]+newP[p];
      return '<div><small>'+historyPlayerLabel(p)+'</small><b class="'+(n>=0?'pos':'neg')+'">'+esc(o)+' → '+esc(n)+'</b></div>';
    }).join('')+'</div><div class="hint">由 #'+(k+1)+' 起各筆淨變動合計(含未結拉數)的修改前後對照。</div>';
    h+='<div class="zl">重算後未結算的拉</div>'+(rp.ledger.length?rp.ledger.map(x=>'<div class="hint">'+historyPlayerName(x.from)+' 欠 '+historyPlayerName(x.to)+' $'+esc(x.amt)+' (拉'+esc(x.k)+'口)</div>').join(''):'<div class="hint">無</div>');
    if(rp.warn)h+='<div class="warn">有 '+rp.warn+' 筆結清在重算後找不到對應的拉數,已沿用原金額,請核對。</div>';
    h+='<div class="hint">已實際收付的款項不會自動改動;若金額改變,請按對照表補收／補付差額。</div>';
    ok=true;
  }
  h+='<div class="btnrow"><button data-act="editClose">取消</button>'+(ok?'<button class="primary" data-act="editApply">確認修改並重算</button>':'')+'</div></div></div>';
  return h;
}
function viewHistory(){
  finalizeFinancialSnapshots();
  const totalLen=S.history.length;
  if(!totalLen)return '<h3>歷史紀錄</h3><p class="hint">暫無紀錄</p>';
  const start=historyShowAll?0:Math.max(0,totalLen-10);
  let h='<h3>歷史紀錄</h3>';
  if(totalLen>10)h+='<div class="btnrow"><button data-act="toggleHistory">'+(historyShowAll?'只顯示最近10局':'展開全部 '+totalLen+' 局')+'</button></div>';
  for(let idx=totalLen-1;idx>=start;idx--){
    const r=S.history[idx],t=new Date(r.time);
    const time=Number.isNaN(t.getTime())?'—':t.getHours()+':'+String(t.getMinutes()).padStart(2,'0');
    const kind=r.kind==='win'?'食糊':r.kind==='draw'?'流局':r.kind==='settle'?(r.name||'結清'):('籌碼:'+(r.name||''));
    h+='<div class="card rec"><div class="rh"><b>#'+(idx+1)+'</b> '+esc(kind)+' <small>'+esc(WIND[r.wind]||'東')+'風圈 · 莊 '+historyPlayerName(r.dealer)+' 連莊'+esc(r.streak==null?0:r.streak)+' · '+time+(r.edited?' · 已修改':'')+'</small></div>';
    if(r.kind==='win'){
      (r.winners||[]).forEach(w=>{
        const who=historyPlayerName(w.p)+(w.self?' 自摸':' 食 '+historyPlayerName(w.disc)+' 出銃');
        const bao=((w.bao!=null&&w.bao!==w.p)?'(由 '+historyPlayerName(w.bao)+' 包)':'')+(w.quick?' <small>(快速記番)</small>':'');
        const raw=(w.raw!=null&&w.raw>w.total)?'<small>(疊加 '+esc(w.raw)+' 番,封頂)</small>':'';
        const fans=historyFanText(w),wl=histWinLine(r,w);
        h+='<div class="rw">'+who+bao+' — '+wl.head+raw+((fans||wl.extra)?'<div class="hint">'+fans+wl.extra+'</div>':'')+'</div>';
      });
    }
    const f=historyFinancials(idx);
    h+='<div class="zl">本局淨變動</div><div class="prev">';
    h+=S.seat.map(p=>{
      const v=f.complete?f.total[p]:null;
      return '<div><small>'+historyPlayerLabel(p)+'</small><b'+(v==null?'':' class="'+(v>=0?'pos':'neg')+'"')+'>'+(v==null?'—':money(v))+'</b></div>';
    }).join('')+'</div>';
    if(!f.complete)h+='<div class="hint">舊紀錄資料不足</div>';
    const showRemain=(r.financeMode||S.game)!=='hk'&&(r.kind==='win'||(r.kind==='settle'&&(r.events||[]).length>0));
    if(showRemain){
      h+='<div class="zl">截至本局剩餘尚未結算金額</div>';
      const after=historyAfterLedger(idx);
      if(after===null)h+='<div class="hint">資料不足</div>';
      else{
        const rows=after.filter(x=>x.amt!==0);
        h+=rows.length?rows.map(x=>'<div class="hint">'+historyPlayerName(x.from)+' 欠 '+historyPlayerName(x.to)+' $'+esc(x.amt)+' (拉'+esc(x.k==null?1:x.k)+'口)'+ledgerDetailHtml(idx,x)+'</div>').join(''):'<div class="hint">無</div>';
      }
    }
    if(r.kind==='instant')h+='<div class="btnrow"><button class="danger" data-act="delInst" data-id="'+esc(r.id)+'">撤銷此籌碼紀錄</button></div>';
    else if(r.kind==='settle'&&idx===totalLen-1)h+='<div class="btnrow"><button class="danger" data-act="undoRec" data-id="'+esc(r.id)+'">撤銷此筆</button></div>';
    if(canEditRec(idx))h+='<div class="btnrow"><button data-act="editOpen" data-i="'+idx+'">修改重算</button></div>';
    h+='</div>';
  }
  if(editRec)h+=editModalHtml();
  h+='<div class="btnrow"><button data-act="copySum">複製總結</button><button data-act="exportFile">匯出備份</button></div>';
  return h;
}

function totals(){ const c=balances(), p=pendingBal(); return [0,1,2,3].map(i=>c[i]+p[i]); }
function summaryText(){
  const c=balances(), p=pendingBal(), a=totals(); let t='麻雀結算(共 '+S.history.length+' 局)\n';
  S.seat.forEach(i=>{ t+=S.names[i]+':已結算 '+money(c[i])+(isHK()?'':',未結拉數 '+money(p[i]))+',合計 '+money(a[i])+'\n'; });
  const tr=M.transfers(a); if(tr.length){ t+='\n轉帳'+(isHK()?'':'(含未結拉數全額結清)')+':\n'; tr.forEach(x=>{ t+=S.names[x.from]+' → '+S.names[x.to]+' $'+x.amt+'\n'; }); }
  return t;
}
function viewSettle(){
  const c=balances(), p=pendingBal(), a=totals(); const tr=M.transfers(a);
  let h='<h3>累計輸贏</h3><table><tr><th>玩家</th><th>食糊局數</th><th>已結算</th>'+(isHK()?'':'<th>未結拉數</th>')+'<th>合計</th></tr>';
  S.seat.forEach(i=>{ const wins=S.history.filter(r=>r.kind==='win'&&r.winners.some(w=>w.p===i)).length; h+='<tr><td>'+nm(i)+'</td><td>'+wins+'</td><td>'+money(c[i])+'</td>'+(isHK()?'':'<td>'+money(p[i])+'</td>')+'<td class="'+(a[i]>=0?'pos':'neg')+'"><b>'+money(a[i])+'</b></td></tr>'; });
  h+='</table>';
  if(!isHK()) h+='<h3>未結算的拉</h3>'+ledgerHtml(false);
  h+='<h3>建議轉帳'+(isHK()?'':'(未結拉數按全額計)')+'</h3>';
  h+=tr.length?tr.map(x=>'<div class="tr">'+nm(x.from)+' → '+nm(x.to)+' <b>$'+x.amt+'</b></div>').join(''):'<p class="hint">目前無需轉帳</p>';
  h+='<div class="btnrow"><button class="primary" data-act="copySum">複製結算文字</button><button class="primary" data-act="shareStory">分享去 IG Story</button>'+((!isHK()&&S.ledger.length)?'<button data-act="payAll">結清全部拉數</button>':'')+'</div><div class="hint">分享圖含輸贏及二維碼,不支援時長按儲存。</div>';
  if(storyImg) h+='<div class="modal" data-act="closeStory"><div class="mbox" data-act="noop"><img src="'+storyImg+'" alt="結算圖" style="width:100%;border-radius:10px"><div class="hint" style="color:#fff;font-size:14px">長按圖片儲存,再到 Instagram 限動上傳。</div><div class="btnrow"><button class="primary" data-act="closeStory">關閉</button></div></div></div>';
  return h;
}
function colorPick(k){
  const cur=S.cfg.theme[k];
  return '<div class="colorrow">'+THEME_LABEL[k]+'</div><label class="pick"><span class="chip" style="background:'+cur+'"></span><span class="hexv">現時顏色 '+cur.toUpperCase()+'</span><span class="pbtn">選擇顏色</span><input type="color" data-chg="theme" data-k="'+k+'" value="'+cur+'"></label>';
}
function hkSettings(){
  const h0=S.cfg.hk, pr=HK_PRESETS[h0.preset];
  let h='<h3>廣東牌設定</h3><div class="presetrow">'+Object.keys(HK_PRESETS).map(k=>'<button class="'+(h0.preset===k?'on':'')+'" data-act="hkPreset" data-v="'+k+'">'+HK_PRESETS[k].name+'</button>').join('')+'</div>';
  h+='<p class="hint">'+pr.name+':'+pr.cap+' 番封頂,封頂出銃 '+(HK_BASE[pr.cap]*pr.scale)+' 分;自摸每家付出銃分數的 '+Math.round(h0.ratio*100)+'%。「二五雞・半辣上」是朋友間最常見的打法:三番起糊、十番封頂。番數對應分數可在下面修改。</p>';
  h+='<div class="grid2"><label>起糊番數(x番起糊,不足當詐糊)<input type="number" min="0" step="1" data-chg="hkn" data-k="minFan" value="'+h0.minFan+'"></label>';
  h+='<label>自摸每家付(出銃的倍數)<input type="number" step="any" data-chg="hkn" data-k="ratio" value="'+h0.ratio+'"></label>';
  h+='<label>十二章包(張張包)<select data-chg="hkb" data-k="bao12"><option value="1"'+(h0.bao12?' selected':'')+'>開</option><option value="0"'+(!h0.bao12?' selected':'')+'>關</option></select></label>';
  h+='<label>大三元包<select data-chg="hkb" data-k="baoSan"><option value="1"'+(h0.baoSan?' selected':'')+'>開</option><option value="0"'+(!h0.baoSan?' selected':'')+'>關</option></select></label>';
  h+='<label>花牌規則(144張)<select data-chg="hkb" data-k="flowers"><option value="0"'+(!h0.flowers?' selected':'')+'>自動(沒輸入花牌就計門前清;輸入花牌就按花牌規則)</option><option value="1"'+(h0.flowers?' selected':'')+'>一律按花牌規則(沒有花也計無花)</option></select></label>';
  h+='<label>食糊後連莊<select data-chg="hkb" data-k="renzhuang"><option value="1"'+(h0.renzhuang?' selected':'')+'>莊家連莊</option><option value="0"'+(!h0.renzhuang?' selected':'')+'>輪莊</option></select></label></div>';
  h+='<p class="hint">總例:完全複合原則(必然並存的番種全部相加),相加後超過封頂番數就按封頂計;同一手牌有多種讀法取最高番。流局莊家輪替。不足起糊番數而食糊,當詐糊:扣例牌(封頂)分數,其他家不加分,本局重來。</p>';
  h+='<h3>番數對應分數(出銃)</h3><div class="fanTable">';
  for(let f=1;f<=pr.cap;f++) h+='<div class="frow"><span>'+f+' 番'+(f===pr.cap?'(封頂)':'')+'</span><input type="number" data-chg="hkrow" data-f="'+f+'" value="'+hkRon(f)+'"><i></i></div>';
  h+='</div><div class="btnrow"><button data-act="hkResetTable">還原分數表</button></div>';
  return h;
}
function viewSettings(){
  const c=S.cfg;
  let h='<div class="btnrow"><button data-act="editPlayers">玩家名稱及 emoji</button></div><h3>版本資訊</h3><div class="card"><div>目前版本:<b>'+APP_VERSION+'</b></div>'+(buildInfo?'<div>更新時間:<b>'+esc(buildInfo)+'</b></div>':'')+''+(upd?'<div class="pos">最新版本:<b>'+esc(upd.version)+'</b>'+(upd.updated?'('+esc(upd.updated)+')':'')+'</div>':'')+'<div class="dev">開發者:Instagram <a href="https://www.instagram.com/'+DEV_IG+'/" target="_blank" rel="noopener">@'+DEV_IG+'</a></div><div class="btnrow">'+(upd?'<button class="primary" data-act="upgrade">立即升級</button>':'')+'<button data-act="checkUpd">'+(checking?'檢查中…':'檢查更新')+'</button></div><div class="hint">App 開啟時會自動檢查。升級只會更新程式,不會清除你的紀錄。</div></div>';
  h+='<h3>玩法</h3><div class="card"><div>目前玩法:<b>'+gameLabel(S.game)+'</b></div><div class="btnrow"><button data-act="toChooser">更換玩法</button></div></div>';
  if(isWild()) h+='<h3>百搭設定</h3><div class="card"><div class="note">本場加 '+S.cfg.wildLimit+' 張通用百搭;要改數量,請到「更換玩法」重新選擇。百搭可代34種非花牌,真白板仍是白板;代入後同款牌連明牌最多4張;不額外加百搭番。</div><div class="zl">百搭可用於明牌</div><div class="seg"><button class="'+(!S.cfg.wildMeld?'on':'')+'" data-act="wildOpt" data-k="wildMeld" data-v="0">關</button><button class="'+(S.cfg.wildMeld?'on':'')+'" data-act="wildOpt" data-k="wildMeld" data-v="1">開</button></div><div class="zl">冇用百搭,全部番數加倍</div><div class="seg"><button class="'+(!S.cfg.wildNoMult?'on':'')+'" data-act="wildOpt" data-k="wildNoMult" data-v="0">關</button><button class="'+(S.cfg.wildNoMult?'on':'')+'" data-act="wildOpt" data-k="wildNoMult" data-v="1">開</button></div><label>倍數<input type="number" min="1" max="100" step="1" data-chg="wildMultN" value="'+S.cfg.wildMultN+'"></label></div>';
  // P2 settings: 6,16,17,18,21
  h+='<h3>輸入體驗設定</h3><div class="card">'
    +'<label>牌桌字級放大<select data-chg="largeFont"><option value="0"'+(!S.cfg.largeFont?' selected':'')+'>關（預設）</option><option value="1"'+(S.cfg.largeFont?' selected':'')+'>開（大字）</option></select></label>'
    +'<label>短動畫（尊重減少動態）<select data-chg="useShortAnim"><option value="1"'+(S.cfg.useShortAnim?' selected':'')+'>開（預設150ms）</option><option value="0"'+(!S.cfg.useShortAnim?' selected':'')+'>關</option></select></label>'
    +'<div class="zl">儲存容量：約 <span id="storageSize">'+getStorageSizeKB()+' KB</span> <button data-act="calcStorage">重新計算</button></div>'
    +'</div>';
  if(isHK()) h+=hkSettings();
  else {
    h+='<h3>番表預設</h3><div class="presetbtns">'
      +'<button class="'+((isWild()?c.wildPreset:c.preset)===1?'on':'')+'" data-act="preset" data-v="1">預設 #1:陶源麻雀王大賽番數表</button>'
      +'<button class="'+((isWild()?c.wildPreset:c.preset)===2?'on':'')+'" data-act="preset" data-v="2">預設 #2:香港麻雀協會總例<small>《港式十六張新章麻雀總例》2025-07-28 修訂版番種詳述</small></button>'
      +'<button class="'+((isWild()?c.wildPreset:c.preset)===3?'on':'')+'" data-act="preset" data-v="3">預設 #3:台牌百搭番數表</button>'
      +'<button class="'+((isWild()?c.wildPreset:c.preset)===4?'on':'')+'" data-act="preset" data-v="4">預設 #4:港式台牌 app 預設<small>hoitoi.hk 番數表;底5番是番數表的一行</small></button></div>';
    h+='<h3>門清與槓</h3><div class="card"><label>明槓是否破門清<select data-chg="kongKeep"><option value="1"'+(S.cfg.kongKeep[curPreset()]?' selected':'')+'>不破:明槓、暗槓都仍算門清(明槓當暗刻)</option><option value="0"'+(!S.cfg.kongKeep[curPreset()]?' selected':'')+'>破:明槓破門清(傳統計法)</option></select></label><div class="hint">每個預設各自記住。預設 #4 預設「不破」,其他預設預設「破」。</div></div>';
    if(!window.MJ2) h+='<div class="warn">未能載入預設 #2 的番表檔(engine2.js)。請確認已上傳該檔案。</div>';
    if(!window.MJ3) h+='<div class="warn">未能載入預設 #3 的番表(engine.js 版本過舊)。請更新 engine.js。</div>';
    if(!window.MJ4) h+='<div class="warn">未能載入預設 #4 的番表檔(engine4.js)。請確認已上傳。</div>';
  }
  if(isApple()){
    h+='<h3>加入主畫面</h3><div class="card">'+(isStandalone()?'<div class="pos">目前已以主畫面 App 模式運行 ✓</div>':'<div>目前在瀏覽器中運行。加入主畫面後可全螢幕使用:</div>'+a2hsSteps()+'<div class="btnrow"><button data-act="a2hsReset">重新顯示開機提示</button></div>')+'</div>';
  }
  h+='<h3>顏色設定</h3><div class="colorrow">一鍵配色</div><div class="swatches">'+SCHEMES.map((s,i)=>'<button style="background:'+s[1].card+'!important;border-color:'+s[1].acc+'!important;color:'+s[1].acc+'" data-act="scheme" data-i="'+i+'">'+s[0]+'</button>').join('')+'</div>';
  ['bg','card','btn','acc'].forEach(k=>{ h+=colorPick(k); });
  h+='<p class="hint">點「選擇顏色」會打開手機的顏色庫。建議頁面背景與格子選深色,文字才清楚。</p><div class="btnrow"><button data-act="themeReset">還原預設顏色</button></div>';
  if(!isHK()){
    h+='<h3>金額設定</h3><div class="grid2">';
    h+='<label>每番金額<input type="number" step="any" data-chg="cfg" data-k="fanValue" value="'+c.fanValue+'"></label>';
    h+='<label>最低食糊番數(胡牌)<input type="number" data-chg="cfg" data-k="minFan" value="'+c.minFan+'"></label>';
    h+='<label>流局後<select data-chg="drawKeeps"><option value="1"'+(c.drawKeeps?' selected':'')+'>莊家繼續做莊</option><option value="0"'+(!c.drawKeeps?' selected':'')+'>輪莊</option></select></label></div>';
  }
  h+='<h3>備份與還原</h3><div class="btnrow"><button class="primary" data-act="exportFile">下載設定</button><button data-act="importFile">匯入設定檔</button></div><div class="btnrow"><button class="danger" data-act="resetAll">清除全部資料</button></div><div class="hint">設定檔(JSON)包含玩家、紀錄、設定和自訂番數表。匯入前會先把現有資料存為「上一場」。</div>';
  h+=tableCard();
  h+='<h3>番數表(可修改)</h3><p class="hint">目前:'+gameName()+'。修改後可在上面「另存為自訂番數表」。灰色底表示無法自動偵測,只能手動加番。'+(isHK()?'':'右邊欄為暗(門清)時的番數。')+'</p><div class="fanTable">';
  const R=RL();
  fanList().forEach(f=>{ h+='<div class="frow'+(f.manual?' man':'')+'"><span>'+f.name+'</span><input type="number" data-chg="rule" data-id="'+f.id+'" data-f="fan" value="'+R[f.id].fan+'">'+(f.fanC!=null?'<input type="number" data-chg="rule" data-id="'+f.id+'" data-f="fanC" value="'+R[f.id].fanC+'">':'<i></i>')+'</div>'; });
  h+='</div><div class="btnrow"><button data-act="resetRules">還原此玩法的番數</button></div>';
  return h;
}
function base_render(){
  try{ document.body.classList.toggle('large-font', !!S.cfg.largeFont); document.body.classList.toggle('no-anim', !S.cfg.useShortAnim); document.body.classList.toggle('oled-contrast', S.cfg.theme&&S.cfg.theme.bg==='#000000'); }catch(e){}

  if(tab==='players'&&isNameField(document.activeElement)&&nameEdits.has(+document.activeElement.dataset.playerName))return;
  if(wildJob&&(!isWild()||wildKey!==wildSignature())){wildStop();wildDone=null;wildKey='';}
  const y=window.scrollY;
  derive();
  applyTheme();
  const el=document.getElementById('app');
  const editing=editorActive();document.body.classList.toggle('editor-open',editing);
  if(editing){el.innerHTML=editorHtml();window.scrollTo(0,0);fitEditor();return;}
  if(!S.game||tab==='chooser'){ el.innerHTML='<div class="body">'+updBanner()+a2hsBanner()+viewChooser()+'</div>'; window.scrollTo(0,0); return; }
  if(!S.playersReady&&tab!=='players')openPlayerSetup();
  const views={players:viewPlayers,table:viewTable,calc:viewCalc,history:viewHistory,settle:viewSettle,settings:viewSettings};
  const tabs=[['table','牌桌'],['calc','算番'],['history','歷史'],['settle','結算'],['settings','設定']];
  el.innerHTML='<div class="body">'+updBanner()+a2hsBanner()+(views[tab]||viewTable)()+'</div><nav>'+(tab==='players'?'':tabs.map(t=>'<button class="'+(tab===t[0]?'on':'')+'" data-act="tab" data-v="'+t[0]+'">'+t[1]+'</button>').join(''))+'</nav>';
  window.scrollTo(0,y);
  if(jumpToResults){jumpToResults=false;const target=document.getElementById('result-top');if(target)target.scrollIntoView({block:'start'});}
}
function advance(keep,fromDraw){if(keep){if(!fromDraw)S.streak++;}else{S.streak=0;S.dealerSeat=(S.dealerSeat+1)%4;if(S.dealerSeat===0)S.wind=(S.wind+1)%4;}}
function before(){ return {dealerSeat:S.dealerSeat,streak:S.streak,wind:S.wind}; }
function pushRec(o){ S.history.push(Object.assign({id:Date.now(),time:Date.now(),dealer:dealerPid(),streak:S.streak,wind:S.wind,before:before(),ledgerBefore:copyL(S.ledger),financePending:true,financeMode:S.game,rulesSnapshot:JSON.parse(JSON.stringify(S.cfg))},o)); }
function collectCurrent(){
  derive();
  const res=analyze(); const items=curItems(res); const raw=Math.max(0,items.reduce((a,x)=>a+x.total,0));
  const total=isHK()?Math.min(raw,hkCap()):raw;
  return {ron:ronEntry(),wild:isWild()?{limit:S.cfg.wildLimit,preset:S.cfg.wildPreset,physical:E.all.slice(),groups:E.wildGroups,replacements:res.replacements,assigned:res.assigned,win:res.win}:null,mult:wildMult(),p:E.winner,self:E.self,disc:E.disc,total,raw,fans:wildMult()>1?items.concat([{id:'nojoker',name:'冇用百搭 全部番數',n:1,total:'×'+wildMult()}]):items,qiang:!!E.flags.qiangkong&&!E.self,bao:baoVisible()?E.bao:null,quick:!!E.quick};
}
function validateCur(){
  // 舊函數保留作兼容，實際驗證由新流程處理
  // 先檢查已加入者完整性
  const pendRon = pending.map(w=>w.ron).filter(Boolean);
  if(pending.length>0){
    if(pending.some(w=>!w.ron)){ toast('部分食糊者缺少牌型資料，請重新輸入'); return false; }
    let err = checkWinnerSet(pending);
    if(err.length){ toast(err[0]); return false; }
    err = checkRonSet(pendRon, {allowPartial:false});
    if(err.length){ toast(err[0]); return false; }
  }
  if(!hasCurrentData()){
    return pending.length===0 ? false : true;
  }
  if(!validateCurrentEntry()) return false;
  const pr = ronProblems(true);
  if(pr.length){ toast(pr[0]); return false; }
  return true;
}
function resetGameData(){try{localStorage.setItem(PREV_KEY,JSON.stringify(S));}catch(e){}S.history=[];S.ledger=[];S.streak=0;S.wind=0;S.dealerSeat=0;S.startDealerPid=null;S.playersReady=false;E=newEntry();pending=[];entryStep='pick';lastEntryMessage='';playerDraft=null;nameEdits.clear();}
const UI_ONLY_ACTIONS=new Set(['tab','editorBack','uiBack','uiClose','uiNav','uiMore','uiPage','uiRulePage','uiSourcePage','uiSourceList','uiHistory','uiDetail','uiReview','uiFlagPage','uiQuickPage','uiGroupPage','uiDebtPage','uiSetting','uiTheme','uiOpenSavedSources','uiKeyboardDone']);
 function act(a,d){
  d=d||{};if(uiAction(a,d)){save(!UI_ONLY_ACTIONS.has(a));render();return;}
  if(['mode','tile','poolTap','clearHand','clearWin','undoTile','editorEdit'].includes(a))editorError='';
  derive();
  if(E.pickRep&&a!=='repPick'&&a!=='repCancel') E.pickRep=null;
  if(isWild()&&wildAction(a,d)){save();render();return;}
  switch(a){
    case 'editorBack':setTab('table');window.scrollTo(0,0);break;
    case 'quickStart': {
      if(!isHK()){toast('快速記番暫只支援廣東牌');return;}
      if(pending.length){toast('快速記番只可用於單人食糊');return;}
      if(E.all.length&&!confirm('快速記番會忽略已輸入的牌,繼續嗎?'))return;
      E.all=[];E.hkKongs={};E.hkWin=null;E.excl={};E.quick={};E.shapeDone=true;setTab('calc');window.scrollTo(0,0);break; }
    case 'quickStop': E.quick=null;E.excl={};E.shapeDone=false;setTab('calc');window.scrollTo(0,0);break;
    case 'quickN': { if(!E.quick)E.quick={}; const id=d.id,n=Math.max(0,Math.min(9,(E.quick[id]||0)+(+d.d))); if(n)E.quick[id]=n; else delete E.quick[id]; E.excl={}; break; }
    case 'editorEdit':E.shapeDone=false;setTab('calc');window.scrollTo(0,0);break;
    case 'editorFinish':{
      if(!isHK()&&!quadReminder()){render();return;}
      if(E.pickRep||Object.keys(E.jsel).length){editorError='請先完成或取消含百搭明牌';E.mode='jmeld';render();return;}
      if(!E.all.length&&!E.wildGroups.length){editorError='請先輸入手牌';E.mode='pick';render();return;}
      if(isHK()){
        const k=E.all.length-14,n=Object.values(E.hkKongs||{}).filter(v=>v==='open'||v==='closed').length;
        if(k>=0&&k<=4&&n!==k){E.mode='meld';editorError='請確認 '+k+' 個槓及其明／暗狀態';render();return;}
        if(typeof E.flags.menqing!=='boolean'){E.mode='meld';editorError='請確認門清狀態';render();return;}
        const r=analyzeHK();
        if(r&&!r.error&&r.needsSelect&&E.hkWin==null){E.mode='win';editorError='不同食糊牌影響番種，請補選';render();return;}
        if(!E.self&&pending.length&&E.hkWin==null){E.mode='win';editorError='多響須指定同一張放炮牌';render();return;}
        if(r&&r.error){editorError=r.error;render();return;}
      }else if(E.win==null){E.mode='win';editorError='請先選食糊牌';render();return;}
      if(!E.self&&E.win===34){E.mode='win';editorError='百搭不能作為放炮牌';render();return;}
      editorError='';E.shapeDone=true;jumpToResults=true;setTab('calc');break;
    }
    case 'hkKong':setHKKong(+d.t,d.v);break;
    case 'hkKongToggle':{
      const t=+d.t;setHKKong(t,(E.hkKongs||{})[t]==='closed'?'open':'closed');break;
    }
   case 'startWinner':if(beginWinner(+d.p))uiModal=null;break;
   case 'editPlayers':
      if(hasEntryDraft()){toast('請先完成或放棄本局，才修改玩家及座位');return;}
      openPlayerSetup();window.scrollTo(0,0);break;
    case 'savePlayers':if(!savePlayerSetup())return;window.scrollTo(0,0);break;
    case 'cancelPlayers':playerDraft=null;nameEdits.clear();setTab('table');break;
    case 'entryPick':entryStep='pick';setTab('calc');window.scrollTo(0,0);break;
    case 'entryMethod':if(pending.length){toast('多響必須沿用同一位出銃者');return;}entryStep='method';break;
    case 'chooseMethod':
      if(E.winner==null){entryStep='pick';break;}
      if(pending.length&&d.v==='self'){toast('多響不能混入自摸');return;}
      E.self=d.v==='self';E.disc=null;E.bao=null;entryStep=E.self?'hand':'payer';window.scrollTo(0,0);break;
    case 'choosePayer':{
      const p=+d.p;
      if(!S.seat.includes(p)||p===E.winner||pending.some(w=>w.p===p)){toast('出銃者不能是食糊者');return;}
      E.self=false;E.disc=p;entryStep='hand';window.scrollTo(0,0);break;
    }
    case 'tab':if(tab==='players'&&playerDraft){toast('請先確認或取消玩家設定');return;}tab=d.v;window.scrollTo(0,0);break;
    case 'toChooser': setTab('chooser'); wildPick=false; break;
    case 'ruleHelp': ruleHelp=!ruleHelp; break;
    case 'menqing': E.flags.menqing=(d.v==='1'); E.excl={}; break;
    case 'game': {
      const v=d.v;
      if(v==='wild'&&d.n==null){ wildPick=true; setTab('chooser'); break; }
      let wl=S.cfg.wildLimit;
      if(v==='wild'){
        wl=Number(d.n);
        if(!Number.isInteger(wl)||wl<1||wl>50){ toast('百搭數量請輸入1至50'); return; }
        if(!window.MJ3){ toast('找不到台牌百搭番表,請先更新 engine.js'); return; }
        if(!window.Worker){ toast('此瀏覽器不支援背景計算'); return; }
      }
      if(v==='hk'&&!window.MJHK){ toast('找不到 engine_hk.js,請先上傳'); return; }
      if(S.game&&(S.game!==v||(v==='wild'&&wl!==S.cfg.wildLimit))&&(S.history.length||S.ledger.length)){
        if(!confirm('更換玩法或百搭數量會開始新牌局,目前的紀錄會先保存為「上一場」(可在座位頁還原)。要繼續嗎?')) return;
        resetGameData();
      }
      wildPick=false; S.game=v; S.cfg.wildLimit=wl; pickM(); E=newEntry(); pending=[];
      const l0=instList()[0]; inst.id=l0.id; inst.mode=l0.mode; inst.mult=1;
      entryStep='pick';lastEntryMessage='';openPlayerSetup();window.scrollTo(0,0);toast('已選擇:'+gameLabel(v)); break; }
    case 'wildOpt': {
      S.cfg[d.k]=(d.v==='1');
      if(d.k==='wildMeld'&&!S.cfg.wildMeld&&isWild()){
        E.wildGroups=E.wildGroups.filter(g=>{ if(g.physical.includes(34)){ E.all.push(...g.physical); return false; } return true; });
        E.jsel={}; if(E.mode==='jmeld') E.mode='pick';
      }
      break; }
    case 'adj': E.adjust=(d.d==='0')?0:Math.max(-999,Math.min(999,(E.adjust||0)+(+d.d))); break;
    case 'shareStory': shareStory(); return;
    case 'closeStory': storyImg=null; break;
    case 'noop': return;
    case 'hkPreset': S.cfg.hk.preset=d.v; break;
    case 'hkResetTable': S.cfg.hk.over={}; break;
    case 'upgrade': doUpgrade(); return;
    case 'dismissUpd': updDismissed=true; break;
    case 'checkUpd': checkUpdate(true); return;
    case 'preset': {
      const v=+d.v;
      if(v===2&&!window.MJ2){ toast('找不到 engine2.js,請先上傳'); return; }
      if(v===4&&!window.MJ4){ toast('找不到 engine4.js,請先上傳'); return; }
      if(v===3&&!window.MJ3){ toast('engine.js 版本過舊,請先更新'); return; }
      if(isWild()) S.cfg.wildPreset=v; else S.cfg.preset=v; pickM(); E.excl={}; E.extra=[]; E.flags={};
      const l0=instList()[0]; inst.id=l0.id; inst.mode=l0.mode; inst.mult=1;
      toast('已切換為'+PRESET_NAME[v]); break; }
    case 'a2hsLater': a2hsHidden=true; break;
    case 'a2hsNever': a2hsHidden=true; try{ localStorage.setItem(A2HS_KEY,'1'); }catch(e){} toast('之後不再自動提示,可在設定頁查看教學'); break;
    case 'a2hsReset': try{ localStorage.removeItem(A2HS_KEY); }catch(e){} a2hsHidden=false; toast('下次開啟會再次提示'); break;
    case 'editOpen': {
      if(hasEntryDraft()){toast('請先完成或放棄本局輸入,再修改歷史');return;}
      const i=+d.i; if(!canEditRec(i)){toast('只可修改最近5局的食糊紀錄');return;}
      editRec={idx:i,winners:S.history[i].winners.map(w=>({p:w.p,self:!!w.self,disc:w.self?null:w.disc,total:Number(w.total)||0}))}; break; }
    case 'editClose': editRec=null; break;
    case 'editApply': {
      if(!editRec||!canEditRec(editRec.idx)){editRec=null;break;}
      const v=editWinners(); if(v.err){toast(v.err);return;}
      const rp=replayFrom(editRec.idx,v.ws);
      if(!confirm('確定修改 #'+(editRec.idx+1)+' 並重算之後 '+(rp.recs.length-1)+' 筆紀錄?'))return;
      if(S.history.slice(editRec.idx).some(r=>!r.rulesSnapshot)&&!confirm('部分舊紀錄沒有規則快照，將用目前規則重算，繼續？'))return;const original=JSON.parse(JSON.stringify(S.history[editRec.idx]));delete original.revisions;(rp.recs[0].revisions||(rp.recs[0].revisions=[])).push({time:Date.now(),record:original});
      S.history.splice(editRec.idx,rp.recs.length,...rp.recs);
      S.dealerSeat=rp.dealerSeat;S.streak=rp.streak;S.wind=rp.wind;S.ledger=copyL(rp.ledger);
      editRec=null;lastUndo=null;toast('已修改並重算'); break; }
    case 'toggleHistory': { historyShowAll=!historyShowAll; break; }
    case 'applyDraft': { if(applyDraft()){ setTab('calc'); toast('已繼續草稿'); } break; }
    case 'discardDraft': { discardDraft(); toast('已放棄草稿'); break; }
    case 'calcStorage': { const sz=getStorageSizeKB(); toast('已用約 '+sz+' KB'); render(); break; }
    case 'scheme': S.cfg.theme=Object.assign({},DEFAULT_THEME,SCHEMES[+d.i][1]); break;
    case 'themeReset': S.cfg.theme=Object.assign({},DEFAULT_THEME); break;
    case 'newGame': {
      if(!confirm('開始全新局？\n\n將會清除：\n• 全部歷史紀錄\n• 未結算的拉數\n• 連莊與風圈\n\n保留：玩家名稱、座位、設定\n\n系統會先自動備份上一場到「上一場牌局」，可在牌桌頁「還原上一場」找回。\n\n確定要開始全新局？')) return;
      try{
        localStorage.setItem(PREV_KEY, JSON.stringify(S));
      }catch(e){
        toast('備份上一場失敗（儲存空間不足），請先到設定匯出備份再試');
        return;
      }
      resetGameData(); S.game=null; setTab('chooser'); playerDraft=null; clearDraft(); try{ localStorage.setItem('mj_v2_full_chooser_pending','1'); localStorage.removeItem('mj_v2_full_tab'); }catch(e){} save(); window.scrollTo(0,0);toast('已開始全新局，請先選玩法，上一場已備份'); break; }
    case 'restoreGame': {
      let p=null; try{ p=JSON.parse(localStorage.getItem(PREV_KEY)); }catch(e){}
      if(!p||!p.names){ toast('沒有可還原的牌局'); return; }
      if(!confirm('還原上一場牌局？\n\n將會：\n• 取代目前的紀錄、拉數、連莊、風圈\n• 目前的牌局會再備份一次，可再次還原\n\n確定還原？')) return;
      try{ localStorage.setItem(PREV_KEY,JSON.stringify(S)); }catch(e){}
      S=norm(p);pickM();wildStop();wildDone=null;wildKey='';E=newEntry();pending=[];entryStep='pick';playerDraft=null;nameEdits.clear();lastEntryMessage='';setTab('table');clearDraft();toast('已還原上一場'); break; }
    case 'rename': { const p=+d.p; const n=prompt('玩家名稱',S.names[p]); if(n&&n.trim()) S.names[p]=n.trim().slice(0,10); break; }
    case 'streak':if(hasEntryDraft()){toast('請先完成或放棄本局，再修改連莊次數');return;}S.streak=Math.max(0,S.streak+(+d.d)); break;
    case 'draw': {
      if(hasEntryDraft()){toast('請先完成或放棄本局輸入，再記錄流局');return;}
      const beforeTot=totals();
      const beforeLedger=copyL(S.ledger);
      const beforeState=before();
      const recId=Date.now();
      const beforeLen=S.history.length+1;
      pushRec({id:recId, kind:'draw',deltas:[0,0,0,0],events:[],before:beforeState,ledgerBefore:beforeLedger});
      if(isHK()) advance(false); else advance(S.cfg.drawKeeps,true);
      const afterTot=totals();
      const diffStr=afterTot.map((v,i)=>{ const d=v-beforeTot[i]; return d!==0?(S.names[i]+(d>0?'+':'')+d):''; }).filter(Boolean).join(' ');
      const label='#'+beforeLen+' 流局';
      lastUndo={id:recId, label:label, kind:'draw', beforeTot:beforeTot, afterTot:afterTot, beforeLen:beforeLen};
      if(undoTimer) clearTimeout(undoTimer); undoTimer=setTimeout(()=>{ lastUndo=null; render(); }, 8000);
      E=newEntry();pending=[];entryStep='pick';setTab('table');lastEntryMessage='已記錄流局'+(diffStr?' '+diffStr:'')+' · 撤銷 '+label;wildStop();wildDone=null;wildKey='';clearDraft();window.scrollTo(0,0);toast('已記錄流局'+(diffStr?' '+diffStr:'')+' · 可撤銷');
      break; }
    case 'winner':beginWinner(+d.p);break;
    case 'disc':if(pending.length&&+d.p!==pending[0].disc){toast('多響必須沿用同一位出銃者');return;}if(+d.p===E.winner||pending.some(w=>w.p===+d.p)){toast('出銃者不能是食糊者');return;}E.disc=+d.p;break;
    case 'self':if(pending.length&&d.v==='1'){toast('多響不能混入自摸');return;}E.self=d.v==='1';E.bao=null;if(E.self)E.disc=null;else if(E.disc==null)entryStep='payer';break;
    case 'flower': E.flowers[+d.i]=!E.flowers[+d.i]; break;
case 'mode': {
  const target = d.v;

  // 從第一步前往任何其他步驟，都必須先通過檢查。
  if (E.mode === 'pick' && target !== 'pick') {
    const issue = firstStepIssue();

    if (issue) {
      E.mode = 'pick';
      editorError = issue.message;

      uPopup(
        issue.title,
        '<p style="line-height:1.6">' +
          esc(issue.message) +
        '</p>',
        ub('繼續選牌', 'uiClose', '', 'primary')
      );

      break;
    }
  }

  // 保留原有槓牌提醒。
  if (
    !isHK() &&
    ['win', 'flowers', 'flags'].includes(target) &&
    ['pick', 'meld', 'jmeld'].includes(E.mode) &&
    !quadReminder()
  ) {
    break;
  }

  // 通過檢查後才允許切換。
  editorError = '';
  E.mode = target;

  break;
}
   case 'tile': {
      const t=+d.t;
      if(t===34){ if(jokerTotal()>=S.cfg.wildLimit){ toast('已達本場百搭上限'); return; } }
      else if(realTotal(t)>=4){ toast('這張牌已有4張'); flashOver(t); return; }
      E.all.push(t); E.mode='pick'; E.excl={};
      break; }
    case 'poolTap': {
      const t=+d.t, ac=allCounts();
      if(E.mode==='flowers'||E.mode==='flags')return;
      if(isHK()){
        if(E.mode==='pick'){const i=E.all.indexOf(t);if(i>=0)E.all.splice(i,1);}
        else if(E.mode==='meld'){
          const v=(E.hkKongs||{})[t];setHKKong(t,v==='open'?'closed':v==='closed'?'none':'open');
        }else if(E.mode==='win'){
          const lock=pending.length&&pending[0].ron?pending[0].ron.winTile:null;
          if(lock!=null&&t!==lock){editorError='須選共同放炮牌 '+tileName(lock);render();return;}
          if((E.hkKongs||{})[t]==='open'||(E.hkKongs||{})[t]==='closed'){editorError='食糊牌不能在槓組內';render();return;}
          E.hkWin=E.hkWin===t?null:t;
        }
        E.excl={};break;
      }
      if(E.mode==='win'){
        const lock=pending.length&&pending[0].ron?pending[0].ron.winTile:null;
        if(lock!=null&&t!==lock){editorError='須選共同放炮牌 '+tileName(lock);render();return;}
        if(t===34&&!E.self){editorError='百搭只限自摸';render();return;}
      }
      if(E.mode==='pick'){ const i=E.all.indexOf(t); if(i>=0) E.all.splice(i,1); E.excl={}; }
      else if(E.mode==='jmeld'){ const free=ac[t]-(E.marks[t]||0), cur=E.jsel[t]||0; if(cur<free) E.jsel[t]=cur+1; else delete E.jsel[t]; }
      else if(E.mode==='meld'){
        if(t===34){ toast('百搭不能用「選明牌」標記;請用「選含百搭的明牌」(需先在設定打開)'); return; }
        if(E.marks[t]<ac[t]) E.marks[t]++; else E.marks[t]=0;
        E.excl={};
      } else {
        if(E.win===t){ E.win=null; }
        else if(ac[t]-(E.marks[t]||0)<1){ toast('這張牌已標為明牌,不能當食糊牌;請先取消明牌標記'); return; }
        else E.win=t;
        E.excl={};
      }
      break; }
    case 'kongToggle': { const t=+d.t; E.kongOpen[t]=(E.kongOpen[t]===false); break; }
    case 'clearWin': E.win=null; E.mode='win'; E.excl={}; break;
    case 'undoTile': {
      for(let i=E.all.length-1;i>=0;i--){ const t=E.all[i]; if((E.marks[t]||0)<tileCount(t)){ E.all.splice(i,1); break; } }
      if(!E.all.length) E.mode='pick';
      E.excl={}; break; }
    case 'clearHand': E.wildGroups=[];E.jsel={};E.all=[];E.marks=Array(34).fill(0);E.kongOpen={};E.hkKongs={};E.hkWin=null;E.melds=[];E.win=null;E.mode='pick';E.excl={};break;
    case 'rmPending': { const idx=+d.i; if(Number.isInteger(idx)&&pending[idx]){ pending.splice(idx,1); toast('已移除'); } break; }
    case 'rmMeld': {
      const m=E.melds[+d.i];
      if(m){
        if(m.t==='chow'){ [0,1,2].forEach(k=>{ if(E.marks[m.tile+k]>0) E.marks[m.tile+k]--; }); }
        else E.marks[m.tile]=Math.max(0,E.marks[m.tile]-(m.t==='kong'?4:3));
      }
      E.mode='meld'; E.excl={}; break; }
    case 'unexcl': delete E.excl[d.id]; break;
    case 'extraN': { const x=E.extra[+d.i]; x.n+=+d.d; if(x.id==='weiwei'&&x.n<2) x.n=2; if(x.n<1) E.extra.splice(+d.i,1); break; }
    case 'rmExtra': E.extra.splice(+d.i,1); break;
    case 'hkWin': { if(!(pending.length&&pending[0].ron)) E.hkWin=(E.hkWin===+d.t)?null:+d.t; E.excl={}; break; }
    case 'clearEntry':if(hasEntryDraft()&&!confirm('放棄本局所有未記錄輸入（包括已加入的食糊者）？'))return;wildStop();wildDone=null;wildKey='';E=newEntry();pending=[];entryStep='pick';break;
    case 'addWinner': {
      if(isHK()&&!E.self&&E.hkWin==null){E.shapeDone=false;E.mode='win';editorError='加入另一位前，先指定共同放炮牌';setTab('calc');render();return;}
      // 1. 先檢查已加入者
      {
        const pendRon = pending.map(w=>w.ron).filter(Boolean);
        if(pending.length>0 && pending.some(w=>!w.ron)){ toast('部分食糊者缺少牌型資料，請重新輸入'); return; }
        let err = checkWinnerSet(pending);
        if(err.length){ toast(err[0]); return; }
        err = checkRonSet(pendRon, {allowPartial:false});
        if(err.length){ toast(err[0]); return; }
      }
      if(E.self){ toast('雙響/三響須為出銃'); return; }
      if(!hasCurrentData()){ toast('請先輸入牌'); return; }
      if(!validateCurrentEntry()) return;
      if(pending.some(w=>w.p===E.winner)){ toast('同一玩家不能重複加入'); return; }
      if(pending.length>=3){ toast('最多三位食糊者'); return; }
      if(pending.length>0 && pending[0].disc!==E.disc){ toast('所有食糊者必須來自同一位出銃者'); return; }

      const cur = collectCurrent();
      const ws = pending.concat([cur]);
      let err = checkWinnerSet(ws);
      if(err.length){ toast(err[0]); return; }
      err = checkFinalTiles(ws);
      if(err.length){ toast(err[0]); return; }

      pending.push(cur);
      const disc=E.disc; E=newEntry(); E.self=false; E.disc=disc;
      E.winner=null;entryStep='pick';window.scrollTo(0,0);toast(pending.length>=3?'已加入三位，請確認本局':'已加入，請選擇另一位食糊者或確認本局'); break; }
    case 'confirm': {
      if(editorActive()){editorError='完成五段輸入後，先查看結果再確認記錄';render();return;}
      // 1. 先檢查已加入者完整性
      {
        const pendRon = pending.map(w=>w.ron).filter(Boolean);
        if(pending.length>0 && pending.some(w=>!w.ron)){ toast('部分食糊者缺少牌型資料，請重新輸入'); return; }
        let err = checkWinnerSet(pending);
        if(err.length){ toast(err[0]); return; }
        err = checkRonSet(pendRon, {allowPartial:false});
        if(err.length){ toast(err[0]); return; }
      }

      const hasCur = hasCurrentData();
      let ws;
      let cur=null;

      if(hasCur){
        if(!validateCurrentEntry()) return;
        cur=collectCurrent();
        ws = pending.concat([cur]);
      } else {
        if(pending.length===0){ toast('請先輸入牌'); return; }
        ws = pending.slice(); // 只結算已加入的
      }

      // 2. 用同一份名單驗證玩家/出銃者/人數/自摸
      {
        let err = checkWinnerSet(ws);
        if(err.length){ toast(err[0]); return; }
        if(ws.some(w=>!w.ron)){ toast('部分食糊者缺少牌型資料，請重新輸入'); return; }
        err = checkFinalTiles(ws);
        if(err.length){ toast(err[0]); return; }
      }

      const minF=isHK()?S.cfg.hk.minFan:S.cfg.minFan,dealer=dealerPid();
      if(isHK()){
        const low=ws.filter(w=>minF>0&&w.total<minF);
        if(low.length){
          const pen=hkRon(99),del=[0,0,0,0];
          if(!confirm(low.map(w=>S.names[w.p]+' 只有 '+w.total+' 番,不足 '+minF+' 番起糊').join('\n')+'\n每位當詐糊扣 '+pen+' 分，其他玩家不加分，本局重來。確定記錄嗎？'))return;
          low.forEach(w=>{del[w.p]-=pen;});
          pushRec({kind:'settle',name:'詐糊(不足'+minF+'番):'+low.map(w=>S.names[w.p]).join('、'),deltas:del,events:[]});
          finishEntry('已記錄詐糊，本局重來',undoInfoForLast());break;
        }
      }else{
        for(const w of ws){const f=w.total-diTotal(w.fans);if(minF>0&&f<minF&&!confirm(S.names[w.p]+' 只有 '+f+' 番(不含底),低於起糊 '+minF+' 番,仍要記錄?'))return;}
      }
      for(const w of ws)if(w.total===0&&!confirm(S.names[w.p]+' 合計 0 番,仍要記錄?'))return;
      if(isHK()){
        pushRec({kind:'win',winners:ws.map(w=>({p:w.p,self:w.self,disc:w.disc,total:w.total,raw:w.raw,fans:w.fans,bao:w.bao,qiang:w.qiang,ron:w.ron,quick:!!w.quick})),deltas:settleHK(ws),events:[]});
        advance(ws.some(w=>w.p===dealer)&&S.cfg.hk.renzhuang,false);finishEntry('已記錄',undoInfoForLast());break;
      }
      const out=applyHand(S.ledger,mkTxns(ws,dealer,S.streak),true);
      let ledger=out.ledger, cash=out.cash, ev=out.ev.slice();
      ledger.slice().forEach(r=>{
        if(r.hit&&r.k>=3&&r.k%3===0){
          const msg=S.names[r.from]+' 已被 '+S.names[r.to]+' 拉了 '+r.k+' 口,累計 $'+r.amt+'。\n\n'+S.names[r.from]+' 要斬拉(投降,立即付清)嗎?\n按「確定」＝斬拉付清;按「取消」＝繼續拉。';
          if(confirm(msg)){ cash[r.from]-=r.amt; cash[r.to]+=r.amt; ev.push({t:'surrender',from:r.from,to:r.to,amt:r.amt}); ledger=ledger.filter(x=>x!==r); }
        }
      });
      const lb=copyL(S.ledger);
      S.history.push({id:Date.now(),time:Date.now(),kind:'win',dealer,streak:S.streak,wind:S.wind,winners:ws.map(w=>({p:w.p,self:w.self,disc:w.disc,total:w.total,mult:w.mult,fans:w.fans,wild:w.wild,raw:w.raw,bao:w.bao,qiang:w.qiang,ron:w.ron})),deltas:cash,events:ev,before:before(),ledgerBefore:lb,financePending:true,financeMode:S.game,rulesSnapshot:JSON.parse(JSON.stringify(S.cfg))});
      S.ledger=copyL(ledger);
      advance(ws.some(w=>w.p===dealer),false);
      finishEntry('已記錄',undoInfoForLast()); break; }
    case 'payoff': {
      const r=S.ledger[+d.i]; if(!r) return;
      if(!confirm(S.names[r.from]+' 付清 '+S.names[r.to]+' $'+r.amt+'?')) return;
      const del=[0,0,0,0]; del[r.from]-=r.amt; del[r.to]+=r.amt;
      pushRec({kind:'settle',name:'結清',deltas:del,events:[{t:'settle',from:r.from,to:r.to,amt:r.amt}]});
      S.ledger.splice(+d.i,1); toast('已結清'); break; }
    case 'payAll': {
      if(!S.ledger.length) return; if(!confirm('把所有未結算的拉按全額結清?')) return;
      const del=pendingBal(); const evs=S.ledger.map(r=>({t:'settle',from:r.from,to:r.to,amt:r.amt}));
      pushRec({kind:'settle',name:'結清全部拉數',deltas:del,events:evs});
      S.ledger=[]; toast('已全部結清'); break; }
    case 'instSave': {
      if(inst.mode==='one'&&inst.payer===inst.payee){ toast('付款人與收款人不能相同'); return; }
      const lst=instList(); const I=lst.find(x=>x.id===inst.id)||lst[0];
      let amt=instAmt(I)+(I.plusBase?S.cfg.fanValue*baseFan():0);
      amt=amt*(inst.mult||1);
      const deltas=instDeltas({amt:amt,mode:inst.mode,payee:inst.payee,payer:inst.payer},1);
      pushRec({kind:'instant',name:I.name+(inst.mult>1?' ×'+inst.mult:''),deltas,events:[]});
      lastUndo=undoInfoForLast(); if(undoTimer) clearTimeout(undoTimer); undoTimer=setTimeout(()=>{ lastUndo=null; render(); }, 8000);
      lastEntryMessage='已記錄 '+I.name+(inst.mult>1?' ×'+inst.mult:'');
      toast('已記錄 '+I.name+' · 可撤銷'); break; }
    case 'delInst': {
      const id=+d.id, idx=S.history.findIndex(r=>r.id===id);
      if(idx<0||S.history[idx].kind!=='instant'){ toast('找不到要撤銷的籌碼紀錄'); return; }
      const r=S.history[idx], quick=!!(lastUndo&&lastUndo.id===id);
      if(!quick&&!confirm('撤銷 #'+(idx+1)+' '+(r.name||'籌碼')+'?\n這筆收付會一併取消,之後的紀錄編號會改變。'))return;
      S.history.splice(idx,1);
      if(quick){ lastUndo=null; if(undoTimer) clearTimeout(undoTimer); }
      lastEntryMessage='已撤銷 #'+(idx+1)+' '+(r.name||'籌碼');
      toast(lastEntryMessage); break; }
    case 'undoRec': {
      if(!S.history.length) return;
      const targetId = d.id ? +d.id : (lastUndo ? lastUndo.id : null);
      const idx = targetId ? S.history.findIndex(r=>r.id===targetId) : S.history.length-1;
      if(idx<0){ toast('找不到要撤銷的紀錄'); return; }
      const r = S.history[idx];
      // 防重複：只允許撤銷最後一筆或指定的 lastUndo
      if(lastUndo && r.id!==lastUndo.id && idx!==S.history.length-1){
        toast('只能撤銷最近一筆，已有更新紀錄');
        return;
      }
      // 直接撤銷，不再彈確認（因為記錄時已可描述，且有8秒可撤銷期）
      const beforeTotUndo = totals();
      const beforeLedgerUndo = copyL(S.ledger);
      // 若撤銷非最後一筆，需要先回滾後續？簡化：只允許撤銷最後一筆
      if(idx!==S.history.length-1){ toast('只能撤銷最後一筆'); return; }
      S.history.splice(idx,1);
      if(r.before){ S.dealerSeat=r.before.dealerSeat; S.streak=r.before.streak; S.wind=r.before.wind; }
      S.ledger=copyL(r.ledgerBefore||[]);
      const afterTotUndo = totals();
      const diffUndo = afterTotUndo.map((v,i)=>{ const d=v-beforeTotUndo[i]; return d!==0?(S.names[i]+(d>0?'+':'')+d):''; }).filter(Boolean).join(' ');
      const undoLabel=(lastUndo&&lastUndo.id===r.id)?lastUndo.label:recordLabel(r,idx);
      lastEntryMessage='已撤銷 '+undoLabel+(diffUndo?' · '+diffUndo:'');
      lastUndo=null; clearDraft();
      toast(lastEntryMessage);
      break; }
    case 'copySum': copy(summaryText()); break;
    case 'exportFile': { downloadJSON({app:'mahjong-jisaan',kind:'backup',version:APP_VERSION,exported:new Date().toISOString(),data:S},'mahjong-backup-'+new Date().toISOString().slice(0,10)+'.json'); toast('已下載設定檔'); return; }
    case 'importFile': pickFile(txt=>{ importBackupText(txt); }); return;
    case 'tblSave': { if(S.cfg.customTables.length>=40){ toast('自訂番數表已達上限(40 個),請先刪除一些'); return; }
      const t=cleanTable({name:tblDraft||('自訂番數表 '+(S.cfg.customTables.length+1)),p:tblP(),over:curDiff()}); t.id=newTableId(); t.saved=Date.now();
      S.cfg.customTables.push(t); S.cfg.activeCustom[pkey()]=t.id; tblDraft=''; toast('已儲存「'+t.name+'」'); break; }
    case 'tblUpdate': { const t=S.cfg.customTables.find(x=>x.id===S.cfg.activeCustom[pkey()]); if(!t){ toast('找不到使用中的自訂番數表'); return; }
      t.over=curDiff(); t.saved=Date.now(); toast('已更新「'+t.name+'」'); break; }
    case 'tblApply': { const t=S.cfg.customTables.find(x=>x.id===d.id); if(!t) return;
      if(t.p!==tblP()){ toast('這張表屬於「'+tblPName(t.p)+'」,請先切換到該番表'); return; }
      S.cfg.overs[pkey()]=JSON.parse(JSON.stringify(t.over)); S.cfg.activeCustom[pkey()]=t.id; E.excl={}; toast('已套用「'+t.name+'」'); break; }
    case 'tblDel': { const t=S.cfg.customTables.find(x=>x.id===d.id); if(!t) return; if(!confirm('刪除自訂番數表「'+t.name+'」?')) return;
      S.cfg.customTables=S.cfg.customTables.filter(x=>x.id!==t.id); Object.keys(S.cfg.activeCustom).forEach(k=>{ if(S.cfg.activeCustom[k]===t.id) delete S.cfg.activeCustom[k]; }); toast('已刪除'); break; }
    case 'tblExport': { const t=S.cfg.customTables.find(x=>x.id===d.id); if(!t) return;
      downloadJSON({app:'mahjong-jisaan',kind:'fan-table',version:APP_VERSION,table:{name:t.name,p:t.p,over:t.over}},'fan-table-'+t.name.replace(/[\\\/:*?"<>|\s]+/g,'_').slice(0,20)+'.json'); toast('已下載番數表'); return; }
    case 'tblImport': pickFile(txt=>{ importTableText(txt); }); return;
    case 'resetAll': if(confirm('重置全部？\n\n將會清除：\n• 全部玩家名稱、紀錄、拉數、連莊、風圈、設定\n• 保留：自訂番數表\n\n此操作無法還原，請先到設定頁「匯出備份」。\n\n確定重置？')){ const keep=S.cfg.customTables; S=defState(); S.cfg.customTables=keep;pickM();wildStop();wildDone=null;wildKey='';E=newEntry();pending=[];entryStep='pick';playerDraft=null;nameEdits.clear();lastEntryMessage='';setTab('table');clearDraft(); } else return; break;
    case 'resetRules': S.cfg.overs[pkey()]={}; delete S.cfg.activeCustom[pkey()]; break;
  }
  save(!UI_ONLY_ACTIONS.has(a)); render();
}
function copy(t){
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(()=>toast('已複製'),()=>fallbackCopy(t)); else fallbackCopy(t);
}
function fallbackCopy(t){ const x=document.createElement('textarea'); x.value=t; document.body.appendChild(x); x.select(); try{document.execCommand('copy'); toast('已複製');}catch(e){ prompt('請手動複製',t); } x.remove(); }
function chg(k,el){
  if(uiChange(k,el)){save(k!=='uiTableQuery');render();return;}
  const d=el.dataset, v=el.type==='checkbox'?el.checked:el.value;
  if(k.startsWith('player')){
    if(!playerDraft)return;
    if(k==='playerName'){settleNameField(el);return;}
    readPlayerNames();
    switch(k){
      case 'playerAvatar':if(PLAYER_EMOJIS.includes(v))playerDraft.avatars[+d.p]=v;break;
      case 'playerSeat':{
        const q=+d.s,p=+v,old=playerDraft.seat[q],other=playerDraft.seat.indexOf(p);
        if(other<0)return;playerDraft.seat[other]=old;playerDraft.seat[q]=p;break;
      }
      case 'playerDealer':playerDraft.dealerSeat=+v;break;
    }
    render();return;
  }
  if((k==='seat'||k==='dealerSeat'||k==='wind')&&hasEntryDraft()){
    toast('請先完成或放棄本局，才修改座位或莊家');render();return;
  }
  switch(k){
    case 'seat': { const s=+d.s, p=+v, old=S.seat[s], ps=S.seat.indexOf(p); S.seat[ps]=old; S.seat[s]=p; break; }
    case 'dealerSeat': S.dealerSeat=+v; break;
    case 'wind': S.wind=+v; break;
    case 'theme': S.cfg.theme[d.k]=v; break;
    case 'flag': E.flags[d.k]=v; break;
    case 'excl': E.excl[d.id]=!v; break;
    case 'bao': E.bao=v===''?null:+v; break;
    case 'addId': if(v){ const f=E.extra.find(x=>x.id===v); if(f) f.n++; else E.extra.push({id:v,n:(v==='weiwei'?2:1)}); } break;
    case 'instId': { const I=instList().find(x=>x.id===v); inst.id=v; if(I) inst.mode=I.mode; inst.mult=1; break; }
    case 'instMode': inst.mode=v; break;
    case 'instMult': inst.mult=+v; break;
    case 'instAmt': { const I=instList().find(x=>x.id===inst.id); const n=parseFloat(v); (S.cfg.instAmts[pkey()]=S.cfg.instAmts[pkey()]||{})[I.id]=isNaN(n)?0:n; break; }
    case 'instPayee': inst.payee=+v; break;
    case 'edW': { if(!editRec)break; const w=editRec.winners[+d.w]; if(!w)break;
      if(d.f==='p'){ w.p=+v; if(w.disc===w.p){ w.disc=S.seat.find(q=>q!==w.p); } }
      else if(d.f==='mode'){ if(v==='self'){ w.self=true; w.disc=null; } else { w.self=false; w.disc=+v; } }
      else if(d.f==='total'){ const n=parseFloat(v); w.total=isNaN(n)?0:Math.max(0,Math.round(n)); }
      break; }
    case 'instPayer': inst.payer=+v; break;
    case 'cfg': { const n=parseFloat(v); S.cfg[d.k]=isNaN(n)?0:n; break; }
    case 'drawKeeps': S.cfg.drawKeeps=v==='1'; break;
    case 'hkn': { const n=parseFloat(v); S.cfg.hk[d.k]=isNaN(n)?0:n; break; }
    case 'hkb': S.cfg.hk[d.k]=v==='1'; break;
    case 'hkrow': { const n=parseFloat(v); if(!isNaN(n)) S.cfg.hk.over[d.f]=n; break; }
    case 'wildN': { const n=Math.floor(Number(v)); S.cfg.wildLimit=(n>=1&&n<=50)?n:S.cfg.wildLimit; break; }
    case 'wildMultN': { const n=Math.floor(Number(v)); S.cfg.wildMultN=(n>=1&&n<=100)?n:S.cfg.wildMultN; break; }
    case 'kongKeep': S.cfg.kongKeep[curPreset()]=(v==='1'); break;
    case 'useSegment': S.cfg.useSegment=true; break;
    case 'wizard': S.cfg.wizard=false; break;
    case 'largeFont': S.cfg.largeFont=v==='1'; break;
    case 'useShortAnim': S.cfg.useShortAnim=v==='1'; break;
    case 'adjv': { const n=Math.round(Number(v)); E.adjust=isNaN(n)?0:Math.max(-999,Math.min(999,n)); break; }
    case 'tblName': tblDraft=String(v).replace(/[\u0000-\u001f<>]/g,'').slice(0,24); break;
    case 'rule': { const o=OV(); const q=o[d.id]=o[d.id]||{}; q[d.f]=parseFloat(v); break; }
  }
  save(); render();
}

const SHARE_URL='https://lilikevin.github.io/mahjong/';
const QR_ROWS=["11111110110100111100001111111", "10000010010011101010001000001", "10111010110100100101101011101", "10111010000010110111001011101", "10111010001111101110001011101", "10000010111110001100001000001", "11111110101010101010101111111", "00000000010010111000100000000", "10100011001011111011000100101", "00011101011101111101101100011", "11100010000100011001010011101", "01001100111001011000011011000", "11111011101011001000101100001", "00111100010100011101101100011", "01111010101011110111001110001", "11110000111110111011110110000", "11100010001111101001101100001", "00011001111001111101111100111", "11101110110110011001101011001", "00110001001001010011101010000", "11010110111001001010111111010", "00000000111000011100100011101", "11111110101111111000101010001", "10000010000110100010100010000", "10111010010111101001111111001", "10111010001010111100110011101", "10111010111110010100010010011", "10000010000001100010101001000", "11111110110010111000101001001"];
const STORY_FONT='"PingFang HK",-apple-system,"Noto Sans TC","Microsoft JhengHei",sans-serif';
function drawQR(g,x,y,px){
  const n=QR_ROWS.length, q=4;
  g.fillStyle='#ffffff'; g.fillRect(x,y,(n+2*q)*px,(n+2*q)*px);
  g.fillStyle='#000000';
  for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(QR_ROWS[r].charAt(c)==='1') g.fillRect(x+(c+q)*px,y+(r+q)*px,px,px);
}
function storyCanvas(){
  const W=1080,H=1920,c=document.createElement('canvas'); c.width=W; c.height=H;
  const g=c.getContext('2d');
  const th=Object.assign({},DEFAULT_THEME,(S.cfg&&S.cfg.theme)||{});
  g.fillStyle=th.bg; g.fillRect(0,0,W,H);
  g.strokeStyle=th.acc; g.lineWidth=6; g.strokeRect(40,40,W-80,H-80);
  const fit=(txt,maxW,size,weight)=>{ let z=size; g.font=(weight?weight+' ':'')+z+'px '+STORY_FONT; while(g.measureText(txt).width>maxW&&z>24){ z-=2; g.font=(weight?weight+' ':'')+z+'px '+STORY_FONT; } };
  g.textAlign='center'; g.textBaseline='alphabetic';
  g.fillStyle=th.acc; g.font='bold 92px '+STORY_FONT; g.fillText('今晚雀局埋數',W/2,230);
  const wins=S.history.filter(r=>r.kind==='win').length;
  let date=''; try{ date=new Date().toLocaleDateString('zh-HK',{year:'numeric',month:'long',day:'numeric'}); }catch(e){ date=new Date().toISOString().slice(0,10); }
  g.fillStyle='#b9d6c4'; fit(date+' · '+gameLabel(S.game||'tw'),900,42,''); g.fillText(date+' · '+gameLabel(S.game||'tw'),W/2,310);
  g.font='38px '+STORY_FONT; g.fillText('食糊 '+wins+' 次',W/2,372);
  const tot=totals(), order=[0,1,2,3].sort((a,b)=>tot[b]-tot[a]);
  const rr=(x,y,w,h,r)=>{ g.beginPath(); g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.quadraticCurveTo(x+w,y,x+w,y+r); g.lineTo(x+w,y+h-r); g.quadraticCurveTo(x+w,y+h,x+w-r,y+h); g.lineTo(x+r,y+h); g.quadraticCurveTo(x,y+h,x,y+h-r); g.lineTo(x,y+r); g.quadraticCurveTo(x,y,x+r,y); g.closePath(); };
  let y=470;
  order.forEach((p,i)=>{
    g.fillStyle='rgba(255,255,255,0.09)'; rr(90,y,900,180,28); g.fill();
    g.textAlign='left'; g.fillStyle=th.acc; g.font='bold 64px '+STORY_FONT; g.fillText(String(i+1),130,y+112);
    g.fillStyle='#eef5ef'; fit(String(S.names[p]),400,60,'bold'); g.fillText(String(S.names[p]),215,y+112);
    const v=tot[p]; g.textAlign='right'; g.fillStyle=v>=0?'#7ee08f':'#ff8b8b'; g.font='bold 84px '+STORY_FONT; g.fillText((v>0?'+':'')+v,955,y+118);
    y+=210;
  });
  drawQR(g,110,1420,8);
  g.textAlign='left'; g.fillStyle='#eef5ef'; g.font='bold 46px '+STORY_FONT; g.fillText('掃描打開麻雀計番',470,1520);
  g.fillStyle='#9db'; fit('lilikevin.github.io/mahjong',520,34,''); g.fillText('lilikevin.github.io/mahjong',470,1580);
  g.font='28px '+STORY_FONT; g.fillText(APP_VERSION,470,1640);
  return c;
}
function dataUrlToFile(url,name){
  const b=atob(url.split(',')[1]), u=new Uint8Array(b.length);
  for(let i=0;i<b.length;i++) u[i]=b.charCodeAt(i);
  return new File([u],name,{type:'image/png'});
}
function shareStory(){
  let url;
  try{ url=storyCanvas().toDataURL('image/png'); }catch(e){ toast('無法產生圖片'); return; }
  let file=null;
  try{ if(typeof File==='function') file=dataUrlToFile(url,'mahjong-settle.png'); }catch(e){ file=null; }
  let can=false;
  try{ can=!!(file&&navigator.canShare&&navigator.canShare({files:[file]})); }catch(e){ can=false; }
  if(can){
    navigator.share({files:[file],title:'麻雀埋數',text:'今晚戰績 '+SHARE_URL}).catch(e=>{ if(!e||e.name!=='AbortError'){ storyImg=url; render(); } });
    return;
  }
  storyImg=url; render();
}
function repCandidates(kind,physical){
  const real=physical.filter(t=>t!==34), out=[];
  if(kind==='chow'){
    for(let s=0;s<27;s++){ if(s%9>6) continue; if(new Set(real).size===real.length&&real.every(x=>x>=s&&x<=s+2)) out.push(s); }
  } else if(!real.length){ for(let t=0;t<34;t++) out.push(t); }
  else if(real.every(x=>x===real[0])) out.push(real[0]);
  return out;
}
function finishGroup(grp,tile){
  grp.tile=tile; E.wildGroups.push(grp);
  grp.physical.forEach(t=>{ const i=E.all.indexOf(t); if(i>=0) E.all.splice(i,1); });
  E.jsel={}; E.mode='pick'; E.excl={}; E.pickRep=null;
}
function cardTile(t,o){
  o=o||{}; let h=mt(t);
  if(o.wild||o.win){
    h='<span style="position:relative;display:inline-block'+(o.win?';outline:2px solid #ffd54a;outline-offset:1px;border-radius:5px':'')+'">'+h+(o.wild?'<span style="position:absolute;top:-7px;right:-5px;font-size:9px;line-height:1;background:#8b2670;color:#fff;border-radius:6px;padding:1px 3px">百</span>':'')+(o.win?'<span style="position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);font-size:9px;line-height:1;background:#ffd54a;color:#222;border-radius:6px;padding:1px 3px;font-weight:700">食</span>':'')+'</span>';
  }
  return h;
}
function layoutTiles(tiles,nSets){
  const c=Array(34).fill(0); tiles.forEach(t=>{ if(t<34) c[t]++; });
  let ds=[]; try{ ds=M.decompose(c.slice(),nSets)||[]; }catch(e){ ds=[]; }
  if(!ds.length) return null;
  ds.sort((a,b)=>b.sets.filter(x=>x.t==='pung').length-a.sets.filter(x=>x.t==='pung').length);
  const D=ds[0];
  const gs=D.sets.map(x=>({k:x.t==='chow'?'順':'刻',tiles:x.t==='chow'?[x.tile,x.tile+1,x.tile+2]:[x.tile,x.tile,x.tile]}));
  gs.sort((a,b)=>a.tiles[0]-b.tiles[0]);
  gs.push({k:'眼',tiles:[D.pair,D.pair]});
  return gs;
}
function specialCardGroups(tiles,winTile,kind){
  const counts=Array(34).fill(0);
  tiles.forEach(t=>{if(t<34)counts[t]++;});
  const groups=[];
  const add=(label,tileList,cols)=>{
    const win=tileList.indexOf(winTile);
    groups.push({k:label,tiles:tileList.slice(),wild:tileList.map(()=>false),win,cols});
  };
  if(['shiliubuda','budafei','busanxf','budazalong'].includes(kind)){
    const pair=counts.findIndex(n=>n===2);
    const names=['萬子','筒子','索子','字牌'];
    for(let suit=0;suit<4;suit++){
      const start=suit===3?27:suit*9,end=suit===3?34:start+9;
      const tilesInGroup=[];
      for(let t=start;t<end;t++)for(let n=0;n<counts[t];n++)tilesInGroup.push(t);
      if(tilesInGroup.length)add(names[suit]+(tilesInGroup.includes(pair)?'·眼':''),tilesInGroup,suit===3?4:null);
    }
    return groups;
  }
  if(kind==='shisanyao'){
    const yao=[0,8,9,17,18,26,27,28,29,30,31,32,33];
    const isYaoPair=rest=>{
      let total=0,pairs=0;
      for(let t=0;t<34;t++){
        const n=rest[t];
        if(yao.includes(t)){
          if(n!==1&&n!==2)return false;
          if(n===2)pairs++;
          total+=n;
        }else if(n)return false;
      }
      return total===14&&pairs===1;
    };
    let extra=null,base=null;
    for(let t=0;t<34&&!extra;t++){
      if(counts[t]>=3){
        const rest=counts.slice();rest[t]-=3;
        if(isYaoPair(rest)){extra={k:'加坎·刻子',tiles:[t,t,t]};base=rest;}
      }
      if(t<27&&t%9<=6&&counts[t]&&counts[t+1]&&counts[t+2]){
        const rest=counts.slice();rest[t]--;rest[t+1]--;rest[t+2]--;
        if(isYaoPair(rest)){extra={k:'加坎·順子',tiles:[t,t+1,t+2]};base=rest;}
      }
    }
    if(base){
      const names=['一九萬','一九筒','一九索','字牌'];
      for(let suit=0;suit<4;suit++){
        const start=suit===3?27:suit*9,end=suit===3?34:start+9;
        const list=[];
        for(let t=start;t<end;t++)for(let n=0;n<base[t];n++)list.push(t);
        if(list.length)add(names[suit]+(list.some(t=>base[t]===2)?'·眼':''),list,suit===3?4:null);
      }
      const win=extra.tiles.indexOf(winTile);
      groups.push(Object.assign(extra,{wild:extra.tiles.map(()=>false),win}));
      return groups;
    }
  }
  return null;
}
function cardGroups(res){
  const out=[]; const mk=(k,tiles,wild)=>({k,tiles,wild:wild||tiles.map(()=>false),win:-1});
  const mtiles=m=>m.t==='chow'?[m.tile,m.tile+1,m.tile+2]:Array(m.t==='kong'?4:3).fill(m.tile);
  const special=res.items&&res.items.some(i=>['shisanyao','jiuzi','shiliubuda','budafei','busanxf','budazalong','likgu','lik8'].indexOf(i.id)>=0);
  if(isHK()){
    const ks=res.kongs||[]; const left=E.all.slice();
    ks.forEach(t=>{ for(let n=0;n<4;n++){ const i=left.indexOf(t); if(i>=0) left.splice(i,1); } out.push(mk('槓',[t,t,t,t])); });
    const gs=special?null:layoutTiles(left,4-ks.length);
    if(gs) gs.forEach(g=>out.push(mk(g.k,g.tiles))); else out.push(mk('牌型',left.slice().sort((a,b)=>a-b)));
    return out;
  }
  E.melds.forEach(m=>out.push(mk(m.t==='chow'?'上':m.t==='pung'?'碰':(m.open===false?'暗槓':'明槓'),mtiles(m))));
  const wb={}; let winTile=E.win, hand=E.hand.slice();
  if(isWild()){
    E.wildGroups.forEach(g=>{
      const tiles=g.t==='chow'?[g.tile,g.tile+1,g.tile+2]:Array(g.t==='kong'?4:3).fill(g.tile);
      const real={}; g.physical.filter(t=>t!==34).forEach(t=>{ real[t]=(real[t]||0)+1; });
      const wild=tiles.map(t=>{ if(real[t]>0){ real[t]--; return false; } return true; });
      out.push(mk(g.t==='chow'?'上(含百搭)':g.t==='pung'?'碰(含百搭)':(g.open?'明槓(含百搭)':'暗槓(含百搭)'),tiles,wild));
    });
    const rep=(res.replacements||[]).slice();
    if(E.win===34){ winTile=res.win; const i=rep.indexOf(winTile); if(i>=0) rep.splice(i,1); wb[winTile]=(wb[winTile]||0)+1; }
    hand=hand.map(t=>{ if(t!==34) return t; if(!rep.length) return t; const r=rep.shift(); wb[r]=(wb[r]||0)+1; return r; });
  }
  const conc=hand.concat(winTile==null?[]:[winTile]);
  const specialId=(res.items||[]).find(i=>['shisanyao','shiliubuda','budafei','busanxf','budazalong'].includes(i.id))?.id;
  if(specialId&&!E.melds.length&&!isWild()){
    const specialGroups=specialCardGroups(conc,winTile,specialId);
    if(specialGroups)return out.concat(specialGroups);
  }
  const nSets=5-E.melds.length-(isWild()?E.wildGroups.length:0);
  const gs=special?null:layoutTiles(conc,nSets);
  const cg=gs?gs:[mk('牌型',conc.slice().sort((a,b)=>a-b))];
  cg.forEach(g=>{ g.wild=g.tiles.map(t=>{ if(wb[t]>0){ wb[t]--; return true; } return false; }); g.win=-1; });
  let placed=false;
  if(isWild()&&E.win===34){ for(const g of cg){ const i=g.tiles.findIndex((t,j)=>t===winTile&&g.wild[j]); if(i>=0){ g.win=i; placed=true; break; } } }
  if(!placed&&winTile!=null){ for(const g of cg){ const i=g.tiles.indexOf(winTile); if(i>=0){ g.win=i; break; } } }
  return out.concat(cg);
}
 function shareTiles(g){const mk=(t,i)=>cardTile(t,{wild:g.wild[i],win:g.win===i}),n=g.tiles.length,cols=Math.min(n,g.cols||7);if(n<=cols)return g.tiles.map(mk).join('');const rows=Math.ceil(n/cols),per=Math.ceil(n/rows);let h='<div style="display:flex;flex-direction:column;gap:4px;align-items:center">';for(let r=0;r<rows;r++){const a=r*per;h+='<div style="display:flex;gap:1px">'+g.tiles.slice(a,a+per).map((t,i)=>mk(t,a+i)).join('')+'</div>';}return h+'</div>';}

 function shareCard(res, total, raw) {
  if (!res || res.error) return '';
  if (isWild() && !res.complete) return '';

  let gs;
  try {
    gs = cardGroups(res);
  } catch (e) {
    return '';
  }
  if (!gs || !gs.length) return '';

  const m = wildMult();
  const fl = E.flowers
    .map((f, i) => f ? M.FLOWERS[i] : '')
    .filter(Boolean);

  const meldCount =
    isHK()
      ? (res.kongs || []).length
      : E.melds.length + (isWild() ? E.wildGroups.length : 0);

  let groupsHtml;

  if (isHK()) {
    groupsHtml =
      '<div class="u-share-groups" style="display:grid;gap:4px;align-items:stretch;margin-top:4px">' +
      gs.map((g, i) =>
        '<div class="u-share-set" style="--group-cols:' + Math.max(1, g.cols || g.tiles.length) + ';min-width:0;container-type:inline-size;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:3px 1px 2px;border-radius:7px;background:rgba(255,255,255,.07)">' +
          '<div style="display:flex;justify-content:center;align-items:center;gap:1px;max-width:100%;padding:1px 0 3px">' +
            shareTiles(g) +
          '</div>' +
          '<small class="u-share-label" style="font-size:10px;line-height:1.2;opacity:.8;overflow-wrap:anywhere">' +
            (i < meldCount ? (isHK() ? '槓組·' : '明牌·') : '手牌·') + esc(g.k) +
          '</small>' +
        '</div>'
      ).join('') +
      '</div>';
  } else {
    const dense = Math.max(
      Math.ceil(gs.length / 3),
      ...gs.map(g => Math.ceil(g.tiles.length / 7))
    ) >= 3;

    const tileMax = dense ? 24 : 28;
    const faceMax = dense ? 14 : 16;

    const renderSet = (g, isMeld) => {
      const closed =
        isMeld && String(g.k).includes('暗槓');

      const count = g.tiles.length;
      const cols = g.cols || (count <= 7
        ? Math.max(1, count)
        : Math.ceil(count / Math.ceil(count / 7)));

      const tiles = closed
        ? g.tiles.map((t, i) =>
            i === 0 || i === count - 1
              ? mt(t, { back: true })
              : cardTile(t, {
                  wild: !!g.wild?.[i],
                  win: g.win === i
                })
          ).join('')
        : shareTiles(g);

      return (
        '<div class="u-share-set" style="' +
          '--group-cols:' + cols + ';' +
          'min-width:0;' +
          'container-type:inline-size;' +
          'display:flex;' +
          'flex-direction:column;' +
          'align-items:center;' +
          'justify-content:center;' +
          'gap:5px;' +
          'padding:7px 3px 5px;' +
          'border-radius:7px;' +
          'background:rgba(255,255,255,.07);' +
        '">' +
          '<div style="display:flex;justify-content:center;align-items:center;gap:1px;max-width:100%;padding:4px 0 8px">' +
            tiles +
          '</div>' +
          '<small class="u-share-label" style="font-size:10px;line-height:1.2;opacity:.8;overflow-wrap:anywhere">' +
            (isMeld ? '明牌·' : '手牌·') + esc(g.k) +
          '</small>' +
        '</div>'
      );
    };

    groupsHtml =
      '<style>' +
        '#shareCard .u-share-set .mt{' +
          'box-sizing:border-box;' +
          'width:min(' + tileMax + 'px,calc((100cqw - 6px)/var(--group-cols)))!important;' +
          'min-width:0!important;' +
          'height:auto!important;' +
          'min-height:0!important;' +
          'aspect-ratio:22/31;' +
        '}' +
        '#shareCard .u-share-set .mt b{' +
          'font-size:clamp(9px,18cqw,' + faceMax + 'px);' +
        '}' +
        '#shareCard .u-share-set .mt i{' +
          'font-size:8px;' +
        '}' +
        '#shareCard .u-share-set .mt.h6 b{' +
          'font-size:0;' +
          'width:10px;' +
          'height:16px;' +
        '}' +
      '</style>' +
      '<div class="u-share-groups" style="' +
        'display:grid;' +
        'gap:4px;' +
        'align-items:stretch;' +
        'margin-top:4px;' +
      '">' +
        gs.map((g, i) => renderSet(g, i < meldCount)).join('') +
      '</div>';
  }

  let totalHtml;

  if (isHK()) {
    const cap = hkCap();

    totalHtml =
      '<div style="font-size:36px;font-weight:700;color:var(--acc);line-height:1.1">' +
        total + ' 番' +
      '</div>' +
      (raw > cap
        ? '<div style="font-size:12px;opacity:.8">(疊加 ' +
            raw + ' 番，封頂 ' + cap + ' 番)</div>'
        : '');
  } else {
    totalHtml =
      '<div style="font-size:36px;font-weight:700;color:var(--acc);line-height:1.1">' +
        (total * m) + ' 番' +
      '</div>' +
      (m > 1
        ? '<div style="font-size:12px;opacity:.8">' +
            total + ' 番 × ' + m + '（冇用百搭）</div>'
        : '') +
      '<div style="font-size:11px;opacity:.7">' +
        '牌型番數（已含底），未計莊家及連莊加番' +
      '</div>';
  }

  let who = '';

  if (E.winner != null) {
    who =
      nm(E.winner) + ' ' +
      (
        E.self
          ? '自摸'
          : '出銃' + (E.disc != null ? '(' + nm(E.disc) + ')' : '')
      );
  }

  const fanNames = [
    ...new Set(
      curItems(res)
        .filter(f => f.id !== 'adjust')
        .map(f => f.id === 'di' ? '底' : f.name)
        .filter(Boolean)
    )
  ];

  const fanNamesHtml = fanNames.length
    ? '<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:3px 10px;margin:7px auto 0;max-width:100%;font-size:clamp(10px,2.7vw,13px);line-height:1.4">' +
        fanNames.map(name =>
          '<span style="max-width:100%;overflow-wrap:anywhere;color:#eef5ef">' +
            esc(name) +
          '</span>'
        ).join('') +
      '</div>'
    : '';

  return (
    '<div id="shareCard" class="stl" style="background:linear-gradient(160deg,#173f2f,#0f2a1f);border:2px solid var(--acc);border-radius:16px;padding:14px 10px 12px;margin:12px 0;text-align:center">' +
      '<div style="font-size:13px;opacity:.85;margin-bottom:8px">' +
        '麻雀計番 · ' + esc(gameName()) +
        (who ? '<br>' + who : '') +
      '</div>' +
      groupsHtml +
      (fl.length
        ? '<div style="font-size:12px;opacity:.85;margin-top:4px">' +
            '花牌：' + fl.map(f => esc(f)).join(' ') +
          '</div>'
        : '') +
      '<div style="margin-top:8px;font-size:13px;opacity:.9">' +
        '總番數' +
      '</div>' +
      totalHtml +
      fanNamesHtml +
      '<div style="font-size:10px;opacity:.55;margin-top:6px">' +
        '麻雀計番 ' + esc(APP_VERSION) +
      '</div>' +
    '</div>' +
    '<div class="hint">' +
      '上面的圖形可直接截圖分享，已包含番種名稱。牌型分組為示意。' +
    '</div>'
  );
}
 function jiuziShape(c){
  for(let su=0;su<3;su++){
    const base=[3,1,1,1,1,1,1,1,3]; let ok=true,extra=0,tot=0;
    for(let n=0;n<9;n++){ const x=c[su*9+n]; tot+=x; if(x<base[n]) ok=false; else extra+=x-base[n]; }
    if(ok&&extra===1&&tot===14) return true;
  }
  return false;
}
function hkConcealed(ac){ return (E.flags.menqing===undefined&&E.all.length===14&&jiuziShape(ac))?true:!!E.flags.menqing; }
function hkHintHtml(){
  const N=E.all.length; if(!N) return '';
  const ac=allCounts(), out=[];
  if(N>14){
    const k=N-14, quad=[]; for(let t=0;t<34;t++) if(ac[t]===4) quad.push(tileName(t));
    out.push('共 '+N+' 張牌,系統視為有 '+k+' 個槓'+(quad.length?'(四張相同:'+quad.join('、')+')':'')+'。');
    if(N===15){ const opts=[]; for(let t=0;t<34;t++){ if(!ac[t]) continue; const c=ac.slice(); c[t]--; if(jiuziShape(c)) opts.push(tileName(t)); } if(opts.length) out.push('若你其實是14張的九子連環,請刪走多出的一張('+opts.join('或')+'任一張):現在多了一張,系統因此當作有槓,而九子連環不能有槓。'); }
  }
  if(N===14&&jiuziShape(ac)){
    if(E.flags.menqing===false) out.push('牌形符合九子連環,但你選了「否(有上、碰、槓過)」。九子連環必須門前清,請改選「是」。');
    else if(E.flags.menqing===undefined) out.push('牌形符合九子連環:已自動按門前清計算。如有上、碰過牌,請選「否」。');
  }
  return out.length?'<div class="note">'+out.map(esc).join('<br>')+'</div>':'';
}
function diRow(){ return (isHK()||M.FANS.some(f=>f.id==='di'))?[]:[{id:'di',name:'底',fan:S.cfg.baseMult,fanC:null,manual:false}]; }
function diTotal(items){ const d=(items||[]).find(x=>x.id==='di'); return (!isHK()&&d&&typeof d.total==='number')?d.total:0; }
function adjustUI(){
  const v=E.adjust||0;
  return '<div class="card"><div class="zl" style="margin-top:0">手動調整番數(beta:在計算結果上增減,令番數符合你的理解)</div><div class="btnrow adjrow" style="margin:6px 0">'+[-10,-5,-1].map(n=>'<button data-act="adj" data-d="'+n+'">'+n+'</button>').join('')+'<input type="number" step="1" data-chg="adjv" value="'+v+'" style="flex:1;min-width:70px;text-align:center">'+[1,5,10].map(n=>'<button data-act="adj" data-d="'+n+'">+'+n+'</button>').join('')+'<button data-act="adj" data-d="0">歸零</button></div><div class="hint">調整值直接加進番數(可以是負數),也會乘上「冇用百搭」倍數,並一併記入歷史。總番數不會低於 0。</div></div>';
}
function hkFlowerMode(){ return !!S.cfg.hk.flowers||E.flowers.some(Boolean); }
function hkFlowerInput(){
  const fl=E.flowers,n=fl.filter(Boolean).length;
  let h='<div class="zl">花牌 <small>(點選輸入,自動判斷;已輸入 '+n+' 張)</small></div><div class="flowers">'+M.FLOWERS.map((f,i)=>'<button class="fl '+(fl[i]?'on':'')+'" data-act="flower" data-i="'+i+'">'+f+'</button>').join('')+'</div>';
  h+='<div class="hint">'+hkFlowerSummary()+'</div>';
  return h;
}
function hkFlowerSummary(){
  const fl=E.flowers,n=fl.filter(Boolean).length;
  if(!hkFlowerMode()) return '未輸入花牌:按無花規則,計門前清。輸入任何花牌後,會自動改按花牌規則(不計門前清,改計花牌番)。';
  const si=E.winner!=null?windIdx(E.winner):-1, parts=[n?('共 '+n+' 張'):'無花'];
  if(si>=0){ const z=(fl[si]?1:0)+(fl[si+4]?1:0); if(z) parts.push('正花 '+z+' 張(食糊者'+windOf(E.winner)+'位:'+M.FLOWERS[si]+'、'+M.FLOWERS[si+4]+')'); }
  if(fl.slice(0,4).every(Boolean)) parts.push('一台花(春夏秋冬)');
  if(fl.slice(4).every(Boolean)) parts.push('一台花(梅蘭菊竹)');
  if(n===7) parts.push('七張花:自動計小花糊,不加自摸');
  if(n===8) parts.push('八張花:自動計大花糊');
  return '自動判斷:'+parts.join(';')+'。';
}
function hkFlowerAdjust(it,r){
  if(!isHK()||!hkFlowerMode()||!r.xiaohuahu) return it;
  if(E.flowers.filter(Boolean).length!==7||E.excl.xiaohuahu) return it;
  it=it.filter(x=>x.id!=='zimo');
  if(!it.some(x=>x.id==='xiaohuahu')) it=it.concat([{id:'xiaohuahu',n:1,closed:false}]);
  return it;
}
function jokerTotal(){ return E.all.filter(x=>x===34).length+E.wildGroups.reduce((a,g)=>a+g.physical.filter(x=>x===34).length,0); }
function realTotal(t){ return E.all.filter(x=>x===t).length+E.wildGroups.reduce((a,g)=>a+g.physical.filter(x=>x===t).length,0); }
function noJoker(){ return jokerTotal()===0; }
function wildMult(){ return (isWild()&&S.cfg.wildNoMult&&S.cfg.wildMultN>1&&noJoker())?S.cfg.wildMultN:1; }
function payRows(total){
  if(!E.self&&E.disc==null) return [];
  const dealer=dealerPid(),bonus=1+2*S.streak,fv=S.cfg.fanValue,m=wildMult();
  const payers=E.self?[0,1,2,3].filter(p=>p!==E.winner):[E.disc];
  return payers.map(q=>{
    const extra=(q===dealer||E.winner===dealer)?bonus:0,fan=(total+extra)*m;
    return {payer:q,pattern:total,dealerFan:extra?1:0,streakFan:extra?2*S.streak:0,mult:m,fan:fan,amount:Math.round(fan*fv)};
  });
}
function lockedFanRows(){
  const dealer=dealerPid(),streak=S.streak,m=wildMult();
  const row=(name,fan,note)=>'<div class="fan" style="opacity:.92"><label>🔒 '+name+(note?' <small>'+note+'</small>':'')+'</label><span>'+fan+'</span></div>';
  let scope;
  if(E.winner===dealer) scope='莊家食糊:每位付款人都加';
  else if(E.self) scope='閒家自摸:只加在莊家的一份';
  else if(E.disc==null) scope='出銃時:莊家食糊或莊家出銃才加';
  else scope=E.disc===dealer?'莊家出銃:適用':'本局不適用';
  const applies=E.self||E.disc!=null?(E.winner===dealer||E.self||E.disc===dealer):true;
  let h=row('莊家加番(固定)','+'+(applies?1:0),scope)+row('連莊加番 2 × '+streak+'(固定)','+'+(applies?2*streak:0),scope);
  if(m>1) h+=row('冇用百搭,全部番數 ×'+m+'(固定)','×'+m,'每位付款人的合計番數都乘 '+m);
  h+='<div class="hint">底已經是上面番數表的一行(🔒),只計一次;莊家及連莊加番在這裡計一次,下方合計與記帳預覽不會再重複加。</div>';
  return h;
}
function finalTotals(total){
  const rows=payRows(total);
  if(!rows.length) return '合計 <b>'+total+'</b> 番(選自摸或出銃者後,會顯示含莊家的應付合計)';
  const groups=[];
  rows.forEach(r=>{let g=groups.find(x=>x.fan===r.fan);if(!g){g={fan:r.fan,amount:r.amount,names:[]};groups.push(g);}g.names.push(nm(r.payer));});
  const mt2=rows[0].mult>1?'(已乘 ×'+rows[0].mult+')':'';
  if(groups.length===1) return '每位付款人應付 <b>'+groups[0].fan+'</b> 番 = <b>$'+groups[0].amount+'</b>'+mt2;
  return groups.map(g=>g.names.join('、')+' 付 <b>'+g.fan+'</b> 番 = <b>$'+g.amount+'</b>').join('<br>')+mt2;
}
let wildJob=null,wildKey='',wildDone=null,wildBusy=false,wildProgress=0;
function wildInput(){
  const groups=E.melds.map(m=>({t:m.t,physical:m.t==='chow'?[m.tile,m.tile+1,m.tile+2]:Array(m.t==='kong'?4:3).fill(m.tile),tile:m.tile,open:m.t==='kong'?m.open!==false:true})).concat(JSON.parse(JSON.stringify(E.wildGroups)));
  const hand=E.win==null?E.hand.slice():E.hand.concat([E.win]);
  return {hand,groups,win:E.win,selfDraw:E.self,flags:E.flags,flowers:E.flowers,limit:S.cfg.wildLimit,preset:S.cfg.wildPreset,wildMeld:S.cfg.wildMeld,...ctxExtra()};
}
function wildSignature(){return JSON.stringify([wildInput(),OV(),E.excl]);}
function wildStop(){if(wildJob)wildJob.terminate();wildJob=null;wildBusy=false;}
function wildResult(){
 if(wildKey!==wildSignature()){wildStop();wildDone=null;wildKey='';}
 return wildDone;
}
function wildStart(){
 wildStop();wildDone=null;wildProgress=0;
 if(Object.keys(E.jsel).length){toast('請先加入或取消正在選取的含百搭明牌');return;}
 if(E.win==null){toast('請先選食糊牌');return;}
 if(!E.self&&E.win===34){toast('他家打出的百搭不可食糊');return;}
 const inp=wildInput();wildKey=wildSignature();wildBusy=true;
 try{
  const job=wildJob=new Worker('wild-worker.js');
  job.onmessage=e=>{if(wildJob!==job)return;const d=e.data;if(d.progress!=null){wildProgress=d.progress;const el=document.getElementById('wild-progress');if(el)el.textContent='已評估 '+wildProgress+' 種代入及食糊牌組合'+(d.best!=null?',目前最高 '+d.best+' 番':'');return;}
   if(d.done){wildDone=d.result;wildBusy=false;job.terminate();wildJob=null;render();}};
  job.onerror=e=>{if(wildJob!==job)return;wildDone={error:e.message||'無法載入背景計番,請檢查已上傳 wild-worker.js、engine_wild.js、engine4.js'};wildStop();render();};
  job.postMessage({inp,over:OV(),excluded:Object.keys(E.excl).filter(k=>E.excl[k])});
 }catch(e){wildBusy=false;wildDone={error:String(e)};}
}
function wildAction(a,d){
 if(a==='wildRun'){wildStart();return true;}
 if(a==='wildStop'){wildStop();wildDone=null;return true;}
 if(a==='wildCancelJ'){E.jsel={};return true;}
 if(a==='repCancel'){E.pickRep=null;return true;}
 if(a==='repPick'){ if(E.pickRep) finishGroup(E.pickRep.grp,+d.t); return true; }
 if(a==='wildGroup'){
  if(E.melds.length+E.wildGroups.length>=5){toast('最多五組明牌');return true;}
  const physical=[]; Object.keys(E.jsel).forEach(k=>{ for(let i=0;i<E.jsel[k];i++) physical.push(+k); });
  const kind=d.v,sz=kind==='kong'?4:3;
  if(physical.length!==sz){toast('請在牌堆選'+sz+'張牌');return true;}
  if(physical.includes(34)&&!S.cfg.wildMeld){toast('目前規則:百搭不能用於上、碰、槓(可在設定打開)');return true;}
  const cands=repCandidates(kind,physical);
  if(!cands.length){toast('這幾張牌不能組成'+(kind==='chow'?'上':kind==='pung'?'碰':'槓'));return true;}
  const grp={t:kind,physical,open:d.open!=='0'};
  if(cands.length===1){ finishGroup(grp,cands[0]); return true; }
  E.pickRep={grp,cands}; return true;
 }
 if(a==='wildRemoveGroup'){const g=E.wildGroups.splice(+d.i,1)[0];if(g)E.all.push(...g.physical);E.jsel={};E.excl={};return true;}
 return false;
}
function wildHint(r){
  let h='<div class="warn">通用百搭版為測試版,正式記帳前請人工核對。只含通用百搭,不含越南分類百搭。百搭不能代花牌;代入後同款牌連明牌最多4張。'+(S.cfg.wildMeld?'':'目前規則:百搭不能用於上、碰、槓。')+'</div>';
  h+='<div class="btnrow"><button class="primary" data-act="wildRun">搜尋最高番</button>'+(wildBusy?'<button data-act="wildStop">取消搜尋</button>':'')+'</div><div id="wild-progress" class="hint">'+(wildBusy?'正在完整搜尋,已評估 '+wildProgress+' 種;未完成前不能記錄。':'變更牌、明牌、食糊牌、花牌、番表或特殊情況後,請重新搜尋。')+'</div>';
  if(wildBusy) return h+'<div class="note">最高番搜尋中;可取消,不會把中途結果當成最優解。</div>';
  if(!r) return h+'<div class="hint">輸入完成後按「搜尋最高番」。</div>';
  if(r.error) return h+'<div class="warn">'+esc(r.error)+'</div>';
  return h+'<div class="ok">完整搜尋完成:'+r.count+' 種代入及食糊牌組合;牌型最高 '+r.total+' 番。<br>手牌百搭代入:'+(r.replacements.map(t=>tileName(t)).join('、')||'無')+(E.win===34?'<br>自摸百搭當作:'+tileName(r.win):'')+'<br>聽牌種類(含可摸百搭):'+r.waits+'</div>';
}


/* ===== 自訂番數表、設定檔下載與匯入 ===== */
function newTableId(seen){
  const used=seen||new Set(S&&S.cfg&&S.cfg.customTables?S.cfg.customTables.map(t=>t.id):[]);
  let id; do{ id='ct'+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36); }while(used.has(id));
  return id;
}
function cleanTable(t){
  if(!t||typeof t!=='object') return null;
  const p=String(t.p); if(['1','2','3','4','hk'].indexOf(p)<0) return null;
  let name=String(t.name==null?'':t.name).replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,24); if(!name) name='自訂番數表';
  const over={}, src=(t.over&&typeof t.over==='object')?t.over:{}; let n=0;
  for(const id of Object.keys(src)){
    if(n>=400) break;
    if(!/^[A-Za-z0-9_]{1,40}$/.test(id)||id==='__proto__'||id==='constructor'||id==='prototype') continue;
    const o=src[id]; if(!o||typeof o!=='object') continue;
    const q={}; ['fan','fanC'].forEach(k=>{ if(o[k]!=null&&o[k]!==''){ const v=Number(o[k]); if(isFinite(v)&&Math.abs(v)<=100000) q[k]=v; } });
    if(Object.keys(q).length){ over[id]=q; n++; }
  }
  const id=(typeof t.id==='string'&&/^ct[a-z0-9]{3,24}$/.test(t.id))?t.id:null;
  return {id,name,p,over,saved:Number(t.saved)||0};
}
const tblP=()=>isHK()?'hk':String(curPreset());
const tblPName=p=>p==='hk'?'廣東牌':'預設 #'+p;
function curDiff(){
  const R=RL(), out={};
  fanList().forEach(f=>{
    const r=R[f.id]; if(!r) return; const o={};
    if(typeof r.fan==='number'&&!isNaN(r.fan)&&r.fan!==f.fan) o.fan=r.fan;
    if(f.fanC!=null&&typeof r.fanC==='number'&&!isNaN(r.fanC)&&r.fanC!==f.fanC) o.fanC=r.fanC;
    if(Object.keys(o).length) out[f.id]=o;
  });
  return out;
}
const canon=o=>JSON.stringify(Object.keys(o).sort().map(k=>[k,o[k].fan==null?null:o[k].fan,o[k].fanC==null?null:o[k].fanC]));
function tblStatus(){
  const t=S.cfg.customTables.find(x=>x.id===S.cfg.activeCustom[pkey()])||null;
  const diff=curDiff();
  return {t,mod:t?canon(diff)!==canon(t.over):Object.keys(diff).length>0,n:Object.keys(diff).length};
}
function tableCard(){
  const p=tblP(), st=tblStatus();
  const list=S.cfg.customTables.filter(t=>t.p===p), others=S.cfg.customTables.filter(t=>t.p!==p);
  let h='<h3>自訂番數表</h3><div class="card">';
  h+='<div class="hint" style="margin-top:0">'+esc(gameName())+' · 目前使用:'+(st.t?'<b>'+esc(st.t.name)+'</b>'+(st.mod?'(已修改,未儲存)':''):(st.mod?'預設番數表(已修改 '+st.n+' 項,未儲存)':'預設番數表'))+'</div>';
  h+='<label>表名<input type="text" maxlength="24" data-chg="tblName" value="'+esc(tblDraft)+'" placeholder="例如:朋友枱價"></label>';
  h+='<div class="btnrow"><button class="primary" data-act="tblSave">另存為自訂番數表</button>'+(st.t&&st.mod?'<button data-act="tblUpdate">更新「'+esc(st.t.name)+'」</button>':'')+'</div>';
  h+=list.length?list.map(t=>{
    const on=st.t&&st.t.id===t.id;
    return '<div class="tr"><b>'+esc(t.name)+'</b>'+(on?' <span class="pos">使用中</span>':'')+' <small>'+Object.keys(t.over).length+' 項與預設不同</small><div class="btnrow" style="margin:6px 0 0"><button data-act="tblApply" data-id="'+esc(t.id)+'">套用</button><button data-act="tblExport" data-id="'+esc(t.id)+'">下載</button><button class="danger" data-act="tblDel" data-id="'+esc(t.id)+'">刪除</button></div></div>';
  }).join(''):'<div class="hint">'+tblPName(p)+'還沒有自訂番數表。改好下面的番數後,輸入表名再按「另存」。</div>';
  if(others.length) h+='<div class="hint">另有 '+others.length+' 張屬於其他番表('+Array.from(new Set(others.map(t=>tblPName(t.p)))).join('、')+'),切換到該番表才會顯示。</div>';
  h+='<div class="btnrow"><button data-act="tblImport">匯入番數表檔</button></div>';
  h+='<div class="hint">自訂番數表只記錄與預設不同的番數,隨設定檔一併備份;「下載」可把單張表分享給朋友。</div></div>';
  return h;
}
function downloadJSON(obj,name){
  const blob=new Blob([JSON.stringify(obj)],{type:'application/json'}); const u=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000);
}
function pickFile(cb){
  try{
    if(!fileInput){ fileInput=document.createElement('input'); fileInput.type='file'; fileInput.accept='.json,application/json'; fileInput.style.display='none'; document.body.appendChild(fileInput); }
    fileInput.value='';
    fileInput.onchange=()=>{
      const f=fileInput.files&&fileInput.files[0]; if(!f) return;
      if(f.size>5*1024*1024){ toast('檔案太大(上限 5 MB)'); return; }
      const r=new FileReader(); r.onload=()=>cb(String(r.result||''),f.name); r.onerror=()=>toast('讀取檔案失敗'); r.readAsText(f);
    };
    fileInput.click();
  }catch(e){ toast('這個瀏覽器無法選擇檔案'); }
}
function importBackupText(text){
  let j; try{ j=JSON.parse(text); }catch(e){ toast('不是有效的 JSON 檔'); return; }
  if(j&&j.kind==='fan-table'){ toast('這是番數表檔,請在「自訂番數表」匯入'); return; }
  const data=(j&&j.kind==='backup'&&j.data)?j.data:j;
  if(!data||typeof data!=='object'||!Array.isArray(data.names)||!Array.isArray(data.history)){ toast('格式不符,不是本 App 的設定檔'); return; }
  const okRec=data.history.every(r=>r&&typeof r==='object'&&Array.isArray(r.deltas)&&r.deltas.length===4&&r.deltas.every(x=>Number.isFinite(x)));
  const okLed=(data.ledger==null)||(Array.isArray(data.ledger)&&data.ledger.every(r=>r&&[0,1,2,3].indexOf(r.from)>=0&&[0,1,2,3].indexOf(r.to)>=0&&Number.isFinite(r.amt)));
  if(!okRec||!okLed){ toast('檔案內的紀錄格式不符,已取消匯入'); return; }
  if(!confirm('匯入會覆蓋目前的玩家、紀錄與設定(現有的自訂番數表會保留)。現有資料會先存為「上一場」。要繼續嗎?')) return;
  const keep=S.cfg.customTables;
  try{ localStorage.setItem(PREV_KEY,JSON.stringify(S)); }catch(e){}
  const d=JSON.parse(JSON.stringify(data));
  d.names=[0,1,2,3].map(i=>String(d.names[i]==null?('玩家'+(i+1)):d.names[i]).slice(0,10));
  if(!Array.isArray(d.seat)||d.seat.length!==4||[0,1,2,3].some(x=>d.seat.indexOf(x)<0)) d.seat=[0,1,2,3];
  ['dealerSeat','wind'].forEach(k=>{ if(!(d[k]>=0&&d[k]<=3)) d[k]=0; });
  if(!(d.streak>=0)) d.streak=0;
  S=norm(d);
  const have=new Set(S.cfg.customTables.map(t=>t.id));
  keep.forEach(t=>{ if(!have.has(t.id)&&S.cfg.customTables.length<40) S.cfg.customTables.push(t); });
  pickM();wildStop();wildDone=null;wildKey='';E=newEntry();pending=[];entryStep='pick';playerDraft=null;nameEdits.clear();lastEntryMessage='';setTab('table');wildPick=false;storyImg=null; save(); render();
  toast('已匯入設定檔(原有資料已存為上一場,可在座位頁還原)');
}
function importTableText(text){
  let j; try{ j=JSON.parse(text); }catch(e){ toast('不是有效的 JSON 檔'); return; }
  if(j&&j.kind==='backup'){ toast('這是設定檔,請用「匯入設定檔」'); return; }
  const t=cleanTable(j&&j.kind==='fan-table'?j.table:j);
  if(!t){ toast('格式不符,不是本 App 的番數表檔'); return; }
  if(S.cfg.customTables.length>=40){ toast('自訂番數表已達上限(40 個)'); return; }
  t.id=newTableId(); t.saved=Date.now(); S.cfg.customTables.push(t); save(); render();
  toast('已匯入「'+t.name+'」'+(t.p!==tblP()?'。它屬於「'+tblPName(t.p)+'」,切換到該番表後才可套用':''));
}


/* ===== 雙響／三響:跨手牌檢查 — 2026-10-28 重構版 ===== */
const curWinTile=()=>isHK()?(E.self?null:E.hkWin):E.win;
function physCounts(win){
  const c=Array(35).fill(0);
  E.all.forEach(t=>{ c[t]++; });
  E.wildGroups.forEach(g=>g.physical.forEach(t=>{ c[t]++; }));
  if(win!=null&&win<34&&c[win]>0) c[win]--;
  return c;
}
function ronEntry(){
  const w=curWinTile();
  return {winTile:w==null?null:w,phys:physCounts(w),flowers:E.flowers.map((f,i)=>f?i:-1).filter(i=>i>=0),has:E.all.length>0||E.wildGroups.length>0||w!=null,all:E.all.slice()};
}
function hasCurrentData(){
  return E.all.length>0 || E.wildGroups.length>0 || curWinTile()!=null || !!E.quick;
}
function getLockedCommon(ws){
  const def = ws.map(v=>v.winTile).filter(x=>x!=null);
  if(def.length===0) return null;
  if(new Set(def).size===1) return def[0];
  return null;
}
function checkWinnerSet(ws){
  const out=[];
  if(ws.length>3) out.push('最多三位食糊者');
  if(new Set(ws.map(w=>w.p)).size!==ws.length) out.push('同一玩家不能重複加入');
  if(ws.length>1 && ws.some(w=>w.self)) out.push('已有出銃記錄時不能混入自摸');
  if(ws.some(w=>!w.self && w.disc==null)) out.push('請指定出銃者');
  if(ws.some(w=>!w.self && w.disc===w.p)) out.push('出銃者不能是食糊者');
  if(ws.length>1 && new Set(ws.map(w=>w.disc)).size!==1) out.push('所有食糊者必須來自同一位出銃者');
  if(ws.length>1 && ws.some(w=>!w.ron)) out.push('部分食糊者缺少牌型資料，請重新輸入');
  return [...new Set(out)];
}
function checkRonSet(ws,{allowPartial=false}={}){
  if(!ws.length)return [];
  const out=[],def=[...new Set(ws.map(w=>w.winTile).filter(t=>t!=null))];
  const unknown=ws.filter(w=>w.winTile==null),common=getLockedCommon(ws),tot=Array(35).fill(0);
  ws.forEach(w=>w.phys.forEach((n,t)=>{tot[t]+=n;}));
  if(def.length>1)out.push('放炮牌必須相同,但目前有 '+def.map(t=>tileName(t)).join('、'));
  if(def.includes(34))out.push('百搭不能作為放炮牌');
  if(!allowPartial&&unknown.length)out.push('雙響／三響:每位食糊者都要指定同一張放炮牌');
  if(common!=null&&common<34){
    const c=tot.slice();let missing=false;
    unknown.forEach(w=>{if((w.phys[common]||0)>0)c[common]--;else missing=true;});c[common]++;
    for(let t=0;t<34;t++)if(c[t]>4)out.push(tileName(t)+' 合計'+(t===common?'至少 ':' ')+c[t]+' 張'+(t===common?'（已計共同放炮牌）':''));
    if(missing)out.push('尚未輸入共同放炮牌「'+tileName(common)+'」／牌數待確認');
    else if(allowPartial&&unknown.length)out.push('牌數待確認：請指定共同放炮牌「'+tileName(common)+'」');
  }else if(def.length===0){
    let possible=false;
    for(let t=0;t<34;t++){
      const c=tot.slice();unknown.forEach(w=>{if((w.phys[t]||0)>0)c[t]--;});c[t]++;
      if(c.slice(0,34).every(n=>n<=4))possible=true;
    }
    if(!possible)out.push('牌數確定超額：沒有任何共同放炮牌能使各款牌均不超過 4 張');
    if(allowPartial)out.push('牌數待確認：請先指定共同放炮牌');
  }
  if(isWild()&&tot[34]>S.cfg.wildLimit)out.push('百搭合計 '+tot[34]+' 張,超過本場的 '+S.cfg.wildLimit+' 張');
  const seen=new Set();ws.forEach(w=>w.flowers.forEach(i=>{if(seen.has(i))out.push('花牌「'+M.FLOWERS[i]+'」不能由兩位同時持有');seen.add(i);}));
  return [...new Set(out)];
}
function checkFinalTiles(ws){
  if(ws.length===1&&(ws[0].self||(isHK()&&ws[0].ron&&ws[0].ron.winTile==null))){
    const r=ws[0].ron;if(!r)return ['缺少牌型資料，請重新輸入'];
    const c=r.phys.slice(),out=[];if(r.winTile!=null&&r.winTile<34)c[r.winTile]++;
    for(let t=0;t<34;t++)if(c[t]>4)out.push(tileName(t)+' 合計 '+c[t]+' 張');
    if(isWild()&&c[34]>S.cfg.wildLimit)out.push('百搭超過本場上限');return out;
  }
  return checkRonSet(ws.map(w=>w.ron),{allowPartial:false});
}

function allRonEntries(includeCur){
  const list = pending.map(w=>w.ron).filter(Boolean);
  if(includeCur && hasCurrentData()){
    const cur = ronEntry();
    if(cur.has || cur.winTile!=null) list.push(cur);
  }
  return list;
}
function ronProblems(strict){
  // strict=false 預覽：永遠檢查 pending，正在輸入嘅第三手有牌就一齊檢查，未指名時隱藏「未指定放炮牌」但保留超額
  if(!strict){
    const base = pending.map(w=>w.ron).filter(Boolean);
    if(base.length===0) return [];
    const withCur = allRonEntries(true);
    const ws = withCur.length>=2 ? withCur : base;
    // 預覽容許未完整
    return checkRonSet(ws, {allowPartial:true}).filter(e=>{
      // 預覽時，缺放炮牌提示轉為待確認，不擋其他確定錯
      if(e.includes('每位食糊者都要指定同一張')) return false;
      return true;
    });
  } else {
    const ws = allRonEntries(true);
    if(ws.length<2) return [];
    return checkRonSet(ws, {allowPartial:false});
  }
}
function validateCurrentEntry(){
  if(!Number.isInteger(E.winner)||!S.seat.includes(E.winner)){toast('請選擇食糊者');return false;}
  if(E.quick&&isHK()){
    if(pending.length){toast('快速記番只可用於單人食糊');return false;}
    if(!curItems(null).some(x=>x.id!=='adjust'&&x.id!=='zimo')&&!E.adjust){toast('請先選擇番種');return false;}
    if(!E.self){
      if(E.disc==null){toast('請選擇出銃者(放槍)');return false;}
      if(E.disc===E.winner){toast('出銃者不能是食糊者');return false;}
    }
    return true;
  }
  if(isWild()&&Object.keys(E.jsel).length){toast('請先完成或取消正在選取的含百搭明牌');return false;}
  const r=analyze();
  if(!r||r.error||!r.items||(isWild()&&!r.complete)){
    toast(r&&r.error?r.error:(isWild()?'請先完成百搭最高番搜尋':'請先完成有效的食糊牌型'));return false;
  }
  if(isHK()&&(typeof E.flags.menqing!=='boolean'||Object.values(E.hkKongs||{}).filter(v=>v==='open'||v==='closed').length!==E.all.length-14)){toast('請修改輸入，確認槓組及門清狀態');return false;}
  if(isHK()&&r.needsSelect&&E.hkWin==null){toast('不同食糊牌影響番種，請修改輸入並補選食糊牌');return false;}
  if(!E.self){
    if(E.disc==null){toast('請選擇出銃者(放槍)');return false;}
    if(E.disc===E.winner){toast('出銃者不能是食糊者');return false;}
    if(curWinTile()==null&&(!isHK()||pending.length)){toast(isHK()?'多響須先指定共同放炮牌':'請先指定食糊牌(即放炮牌)');return false;}
    if(curWinTile()===34){toast('百搭不能作為放炮牌');return false;}
  }
  return true;
}

function hkWinPicker(){
  if(!isHK()||E.self) return '';
  const lock=(pending.length&&pending[0].ron)?pending[0].ron.winTile:null;
  const uniq=Array.from(new Set(E.all)).sort((a,b)=>a-b);
  let h='<div class="card askcard"><div class="zl" style="margin-top:0">放炮牌 <small>'+(lock!=null?'(雙響／三響:須與上一位相同)':'(選填;雙響／三響必須指定)')+'</small></div>';
  if(lock!=null) h+=E.all.includes(lock)?'<div class="tiles">'+mt(lock)+'</div>':'<div class="warn">你的牌裡沒有 '+esc(tileName(lock))+',不能同時食這張放炮牌</div>';
  else h+='<div class="tiles">'+(uniq.length?uniq.map(t=>mt(t,{tag:'button',cls:E.hkWin===t?'mark':'',attrs:'data-act="hkWin" data-t="'+t+'"'})).join(''):'<span class="hint">先輸入牌</span>')+'</div>';
  return h+'</div>';
}

let tStart=null, lastTouchAct=0;
document.addEventListener('touchstart',e=>{ if(e.touches.length>1){ tStart=null; return; } const t=e.touches[0]; tStart={x:t.clientX,y:t.clientY}; },{passive:true});
document.addEventListener('touchend',e=>{
  if(!tStart) return; const t=e.changedTouches[0];
  const moved=Math.abs(t.clientX-tStart.x)+Math.abs(t.clientY-tStart.y); tStart=null;
  const el=e.target.closest&&e.target.closest('[data-act]');
  if(el&&moved<10){ e.preventDefault(); lastTouchAct=Date.now(); act(el.dataset.act,el.dataset); }
},{passive:false});
document.addEventListener('click',e=>{
  if(Date.now()-lastTouchAct<700) return;
  const el=e.target.closest('[data-act]'); if(el) act(el.dataset.act,el.dataset);
});
window.addEventListener('resize',fitEditor);
if(window.visualViewport){window.visualViewport.addEventListener('resize',fitEditor);window.visualViewport.addEventListener('scroll',fitEditor);}
document.addEventListener('focusin',e=>{if(isNameField(e.target))nameFieldFocus(e.target);if(e.target.matches?.('.u-table-screen input'))document.body.classList.add('table-keyboard-open');});
document.addEventListener('focusout',e=>{if(isNameField(e.target))settleNameField(e.target);if(e.target.matches?.('.u-table-screen input'))setTimeout(()=>{if(!document.activeElement?.matches?.('.u-table-screen input'))document.body.classList.remove('table-keyboard-open');},0);});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.matches?.('.u-table-screen input')){e.preventDefault();e.target.blur();return;}
  const el=e.target.closest&&e.target.closest('[role="button"][data-act="startWinner"]');
  if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();act('startWinner',el.dataset);}
});
document.addEventListener('change',e=>{ const el=e.target.closest('[data-chg]'); if(el) chg(el.dataset.chg,el); });
['dblclick'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault()));
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden'){save();} });
if(navigator.storage&&navigator.storage.persist) navigator.storage.persist();


/* 2.0-test.4: fixed header/content/footer and explicit resumable input workflow. */
let uiWizard=null,uiBackup=null,uiModal=null,uiResume=null,uiPage=0,uiHistory=-1,uiDetail='fans',uiReview='fans',uiSetting='menu',uiFlagPage=0,uiQuickPage=0,uiGroupPage=0,uiGroupTile=null,uiGroups=[],uiDebtPage=0,uiTableQuery='';
const uc=x=>JSON.parse(JSON.stringify(x));
const ub=(n,a,attrs='',cls='')=>'<button type="button" data-act="'+a+'" class="'+cls+'" '+attrs+'>'+n+'</button>';
function up(p,n,a='uiPage'){n=Math.max(1,n);return n<=1?'':'<div class="u-pager">'+ub('‹',a,'data-d="-1"'+(p<=0?' disabled':''))+'<small>'+(p+1)+' / '+n+'</small>'+ub('›',a,'data-d="1"'+(p>=n-1?' disabled':''))+'</div>';}
function uPagerSlot(p,n,a){return '<div class="u-pager-slot'+(n<=1?' empty':'')+'">'+(n<=1?'<span>1 / 1</span>':up(p,n,a))+'</div>';}
function uBalance(a){return '<div class="prev">'+S.seat.map(p=>'<div><small>'+playerLabel(p)+'</small><b class="'+(a&&a[p]<0?'neg':'pos')+'">'+(a?money(a[p]):'—')+'</b></div>').join('')+'</div>';}
function uiValidResume(x){if(!x||!['pick','method','payer','hand'].includes(x.entryStep))return null;return {entryStep:x.entryStep,mode:['pick','meld','jmeld','win','flowers','flags'].includes(x.mode)?x.mode:'pick',shapeDone:!!x.shapeDone,review:['fans','pay','adjust','image','quick'].includes(x.review)?x.review:'fans',page:Number.isInteger(x.page)&&x.page>=0?x.page:0,flagPage:Number.isInteger(x.flagPage)&&x.flagPage>=0?x.flagPage:0,quickPage:Number.isInteger(x.quickPage)&&x.quickPage>=0?x.quickPage:0};}
function uiCurrentLocation(){return {entryStep,mode:E.mode,shapeDone:!!E.shapeDone,review:uiReview,page:uiPage,flagPage:uiFlagPage,quickPage:uiQuickPage};}
function uiCaptureResume(){if(tab==='calc')uiResume=uiCurrentLocation();return uiResume||uiCurrentLocation();}
function uiCanResume(){return hasEntryDraft()||!!draftCache;}
function uiContinue(){if(draftCache&&!applyDraft()){toast('無法還原草稿，未清除原資料');return;}const at=uiValidResume(uiResume)||uiCurrentLocation();entryStep=at.entryStep;E.mode=at.mode;E.shapeDone=at.shapeDone;uiReview=at.review;uiPage=at.page;uiFlagPage=at.flagPage;uiQuickPage=at.quickPage;uiModal=null;setTab('calc');}
function uPopup(title,body,footer=''){uiModal={title,body,footer};}
function uDialog(){return uiModal?'<div class="u-backdrop"><section class="u-dialog" role="dialog" aria-modal="true"><header><h3>'+esc(uiModal.title)+'</h3>'+ub('×','uiClose','aria-label="關閉"')+'</header><div class="u-dialog-body">'+uiModal.body+'</div><footer>'+uiModal.footer+'</footer></section></div>':'';}
function uDeveloperInfo(){return '<div class="u-dev-info" style="flex:none;text-align:center;padding:8px 4px;font-size:12px;line-height:1.6;color:#adc4b5"><div>麻雀計番 · '+esc(APP_VERSION)+'</div><div>開發者：<a href="https://www.instagram.com/'+encodeURIComponent(DEV_IG)+'/" target="_blank" rel="noopener noreferrer" style="color:var(--acc,#e6b422);text-decoration:none">@'+esc(DEV_IG)+'</a></div></div>';}
function uFrame(title,body,footer=''){
 const isTable=body.includes('class="u-board"'),isStart=['選擇遊戲','選擇玩法','開始新牌局','新牌局'].includes(title),canBack=!isTable&&!isStart&&S.playersReady===true&&S.game!=null,showDev=['選擇遊戲','選擇玩法','高級設置','高級設定'].includes(title),dev=showDev?uDeveloperInfo():'';
 const showNav=!isStart&&!uiWizard&&S.playersReady&&['table','calc','history','settle','settings','players'].includes(tab);
 const nav=showNav?'<nav class="u-main-nav" aria-label="主要導覽">'+[['table','牌桌'],['history','歷史／結算'],['settings','設定']].map(([v,n])=>ub(n,'tab','data-v="'+v+'" aria-current="'+(tab===v||(['history','settle'].includes(tab)&&v==='history')?'page':'false')+'"',tab===v||(['history','settle'].includes(tab)&&v==='history')?'on':'')).join('')+'</nav>':'';
 const prompts=updBanner()+(isStart?a2hsBanner():'');
 return '<div class="u-shell'+(showNav?' has-nav':'')+'"><header class="u-header">'+(canBack?ub('‹','uiBack','aria-label="返回"'):'')+'<h3>'+esc(title)+'</h3>'+ub('⋯','uiMore','aria-label="更多牌局操作"')+'</header><main class="u-content">'+prompts+body+'</main><footer class="u-footer">'+footer+dev+'</footer>'+nav+'</div>';
}
function uOrigin(){return (S.cfg.tableOrigins||{})[pkey()]||{kind:'preset',name:isHK()?'廣東牌預設番表':PRESET_NAME[curPreset()]};}
function uSetOrigin(kind,name){(S.cfg.tableOrigins||(S.cfg.tableOrigins={}))[pkey()]={kind,name};}
function gameName(){const o=uOrigin();return ['blank','import','saved','edited'].includes(o.kind)?gameLabel(S.game)+' · '+o.name+(o.kind==='edited'?'（已自訂）':''):base_gameName();}
function uToggle(n,k,hk=false){return '<label class="u-check">'+n+'<input type="checkbox" data-chg="uiBool" data-k="'+k+'" data-hk="'+hk+'"'+((hk?S.cfg.hk:S.cfg)[k]?' checked':'')+'></label>';}
function uThemes(){return '<div class="grid2">'+SCHEMES.map(([n,c],i)=>ub(esc(n),'scheme','data-i="'+i+'" style="border-color:'+c.acc+'"')).join('')+'</div>'+uToggle('大字體','largeFont');}
function uBasic(){return '<div class="grid2">'+(isHK()?'<label>計分方案<select data-chg="uiHK">'+Object.keys(HK_PRESETS).map(k=>'<option value="'+k+'"'+(k===S.cfg.hk.preset?' selected':'')+'>'+HK_PRESETS[k].name+'</option>').join('')+'</select></label><label>自摸付款比例<input type="number" min="0" step="any" data-chg="hkn" data-k="ratio" value="'+S.cfg.hk.ratio+'"></label>':'<label>每番金額<input type="number" min="0" step="any" data-chg="cfg" data-k="fanValue" value="'+S.cfg.fanValue+'"></label>')+'<label>最低食糊番數<input type="number" min="0" data-chg="'+(isHK()?'hkn':'cfg')+'" data-k="minFan" value="'+(isHK()?S.cfg.hk.minFan:S.cfg.minFan)+'"></label>'+(isWild()?'<label>百搭數量<input type="number" min="1" max="50" data-chg="wildN" value="'+S.cfg.wildLimit+'"></label>':'')+'</div>';}
function uAdvanced(){return '<div class="u-stack">'+(isHK()?uToggle('使用花牌規則','flowers',true)+uToggle('莊家食糊連莊','renzhuang',true)+uToggle('十二章包牌','bao12',true)+uToggle('大三元包牌','baoSan',true):uToggle('流局繼續做莊','drawKeeps')+(isWild()?uToggle('百搭可用於明牌','wildMeld')+uToggle('冇用百搭加倍','wildNoMult')+'<label>倍數<input type="number" min="1" max="100" data-chg="wildMultN" value="'+S.cfg.wildMultN+'"></label>':''))+ub('顏色與字體','uiTheme')+'</div>';}
function uChooser(){return '<div class="u-center"><h2>選擇玩法</h2>'+[['tw','港式台牌・無百搭'],['wild','港式台牌・通用百搭'],['hk','廣東牌']].map(([v,n])=>ub(n,'uiChoose','data-v="'+v+'"')).join('')+(S.game?ub('繼續本場','tab','data-v="table"'):'')+'</div>';}
function uBlankValues(){const o={};fanList().forEach(f=>{o[f.id]={fan:0};if(f.fanC!=null)o[f.id].fanC=0;});if(!isHK())o.di={fan:0};return o;}
function uSourceButtons(){return '<div class="btnrow">'+ub(isHK()?'選擇廣東牌番數設定':'選擇預設1–4','uiSourceList','data-v="preset"')+ub('選擇已儲存番表','uiOpenSavedSources')+'</div>';}
 function uApplySource(kind,value){if(uiWizard?.touched&&!confirm('更換來源會取代目前番表草稿，繼續？'))return false;
 if(kind==='preset'){if(!isHK()){if(isWild())S.cfg.wildPreset=+value;else S.cfg.preset=+value;}pickM();S.cfg.overs[pkey()]={};delete S.cfg.activeCustom[pkey()];uSetOrigin('preset',isHK()?'廣東牌預設番表':PRESET_NAME[+value]);}
 if(kind==='blank'){S.cfg.overs[pkey()]=uBlankValues();delete S.cfg.activeCustom[pkey()];uSetOrigin('blank','自訂番表');}             
 if(kind==='saved'){const x=S.cfg.customTables.find(x=>x.id===value);if(!x)throw Error('找不到番表');if((x.p==='hk')!==isHK())throw Error('番表玩法不相容');if(!isHK()){if(isWild())S.cfg.wildPreset=+x.p;else S.cfg.preset=+x.p;}pickM();S.cfg.overs[pkey()]=uc(x.over);S.cfg.activeCustom[pkey()]=x.id;uSetOrigin('saved',x.name);}
 if(uiWizard){uiWizard.stage='table';uiWizard.touched=false;}uiPage=0;uiTableQuery='';return true;
}
function uTableLayout(height,width){const columns=width>=520?3:2,rows=Math.max(2,Math.min(6,Math.floor((height-120)/80)));return {columns,rows,size:columns*rows};}
function uTableView(){
 const R=RL(),all=fanList(),q=uiTableQuery.trim().toLowerCase(),list=all.filter(f=>!q||f.name.toLowerCase().includes(q)||f.id.toLowerCase().includes(q)),viewport=window.visualViewport?.height||innerHeight,header=document.querySelector('.u-header')?.getBoundingClientRect().height||52,h=Math.max(120,Math.min(document.querySelector('.u-content')?.clientHeight||Infinity,viewport-header-114)-56),layout=uTableLayout(h,innerWidth),n=Math.max(1,Math.ceil(list.length/layout.size));
 uiPage=Math.max(0,Math.min(uiPage,n-1));
 const page=list.slice(uiPage*layout.size,uiPage*layout.size+layout.size);
 let html='<section class="u-table-screen"><div class="u-table-toolbar"><label>番表名稱<input class="u-table-name" maxlength="24" enterkeyhint="done" data-chg="uiTableName" value="'+esc(uOrigin().name||'自訂番表')+'"></label><label>搜尋番種<input class="u-table-search" type="search" enterkeyhint="search" data-chg="uiTableQuery" value="'+esc(uiTableQuery)+'" placeholder="名稱／代碼"></label></div><div class="u-table-keyboard-tools">'+ub('完成輸入','uiKeyboardDone')+'</div><div class="u-table-actions" style="flex:none">'+ub(isHK()?'選擇廣東牌番數設定':'選擇預設1–4','uiSourceList','data-v="preset"')+ub('選擇已儲存番表','uiOpenSavedSources')+'</div><div class="u-table-fields" style="grid-template-columns:repeat('+layout.columns+',minmax(0,1fr))">';
 html+=page.map(f=>'<div class="u-rule"><span style="min-height:28px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden" title="'+esc(f.name)+'">'+esc(f.name)+'</span><div class="'+(f.fanC!=null?'grid2':'')+'"><label>'+(f.fanC!=null?'明':'')+'<input type="number" inputmode="decimal" enterkeyhint="done" min="0" max="100000" step="any" data-chg="uiRule" data-id="'+f.id+'" data-f="fan" value="'+(R[f.id]?.fan||0)+'"></label>'+(f.fanC!=null?'<label>暗<input type="number" inputmode="decimal" enterkeyhint="done" min="0" max="100000" step="any" data-chg="uiRule" data-id="'+f.id+'" data-f="fanC" value="'+(R[f.id]?.fanC??R[f.id]?.fan??0)+'"></label>':'')+'</div></div>').join('');
 if(page.length)html+=Array(layout.size-page.length).fill('<div class="u-rule-empty"></div>').join('');
 html+='</div>'+(!list.length?'<p class="u-empty-message">沒有符合的番種。</p>':'')+'<div class="u-table-actions">'+ub('另存番表','uiSaveTable')+ub('匯出番表','uiExportTable')+'</div></section>';
 return {html,pager:uPagerSlot(uiPage,n,'uiRulePage')};
}
 function uSource(){return '<p>選擇番表來源</p><div class="u-stack">'+ub('使用預設番表','uiSourceList','data-v="preset"')+ub('使用已儲存番表','uiSourceList','data-v="saved"')+ub('我想從頭設定','uiSource','data-kind="blank"')+ub('導入番表','uiImportTable')+'</div>';}
function uImportPayload(text){const j=JSON.parse(text);if(j?.kind==='backup')throw Error('這是牌局備份，請選番表檔案');const raw=j?.kind==='fan-table'?j.table:j;if(!raw?.over||typeof raw.over!=='object')throw Error('番表格式不符');for(const [id,v] of Object.entries(raw.over)){if(!/^[A-Za-z0-9_]{1,40}$/.test(id)||['constructor','prototype','__proto__'].includes(id))throw Error('番種代碼無效');for(const k of ['fan','fanC'])if(v?.[k]!=null&&(!Number.isFinite(Number(v[k]))||Number(v[k])<0||Number(v[k])>100000))throw Error('番數必須為0至100000');}const x=cleanTable(raw);if(!x||!Object.keys(x.over).length)throw Error('番表內容為空');if((x.p==='hk')!==isHK())throw Error('番表玩法不相容');return x;}
function uImportTable(){pickFile(text=>{const old=S.cfg;try{const x=uImportPayload(text);S.cfg=uc(S.cfg);if(x.p!=='hk'){if(isWild())S.cfg.wildPreset=+x.p;else S.cfg.preset=+x.p;}pickM();const allowed=new Set(fanList().map(f=>f.id));if(Object.keys(x.over).some(id=>!allowed.has(id)))throw Error('番表含未支援的番種');if(uiWizard?.touched&&!confirm('導入將取代目前番表草稿，繼續？')){S.cfg=old;pickM();return;}S.cfg.overs[pkey()]=uc(x.over);delete S.cfg.activeCustom[pkey()];uSetOrigin('import',x.name);if(uiWizard){uiWizard.stage='table';uiWizard.touched=false;}else uiSetting='tables';uiModal=null;uiPage=0;uiTableQuery='';save();render();toast('已導入，請預覽後確認');}catch(e){S.cfg=old;pickM();toast(e.message||'導入失敗');}});}
function uWizardView(){const stage=uiWizard.stage;let title='開局設定',body='',pager='',back='ask',next='';
 if(stage==='ask'){body='<h2>需要自訂設置嗎？</h2><p>'+esc(gameLabel(S.game))+'</p>'+ub('顏色與字體','uiTheme')+ub('使用預設，先預覽番表','uiDefault','','primary')+ub('自訂設置','uiStage','data-stage="basic"');back='cancel';}
 if(stage==='basic'){title='自訂設置 · 1 / 2';body=uBasic();next='source';}
 if(stage==='source'){title='選擇番表';body=uSource();back='basic';}
 if(stage==='table'){title='預覽及修改番表';const v=uTableView();body=v.html;pager=v.pager;back='source';next=uiWizard.custom?'advanced':'players';}
 if(stage==='advanced'){title='自訂設置 · 2 / 2';body=uAdvanced();back='table';next='players';}
if(stage==='players'){title='確認本場玩家';body='<div class="u-stack">'+S.seat.map((p,i)=>'<div class="u-player">'+WIND[i]+' '+playerLabel(p)+ub('編輯','uiEditPlayer','data-p="'+p+'"')+'</div>').join('')+'</div><label>起莊者<select data-chg="dealerSeat">'+[0,1,2,3].map(i=>'<option value="'+i+'"'+(S.dealerSeat===i?' selected':'')+'>'+WIND[i]+' '+nm(S.seat[i])+'</option>').join('')+'</select></label>';back=uiWizard.custom?'advanced':'table';next='summary';} 
 if(stage==='summary'){title='開局摘要';body='<div class="card"><h3>'+esc(gameName())+'</h3><p>'+(isHK()?'起糊 '+S.cfg.hk.minFan+' 番':'每番 $'+S.cfg.fanValue+' · 起糊 '+S.cfg.minFan+' 番')+'</p><p>莊 '+playerLabel(dealerPid())+'</p></div><div class="grid2">'+S.seat.map((p,i)=>'<div class="card">'+WIND[i]+' '+playerLabel(p)+'</div>').join('')+'</div>';back='players';next='start';}
 return uFrame(title,body,pager+'<div class="btnrow">'+ub(stage==='ask'?'取消':'返回','uiStage','data-stage="'+back+'"')+(next?ub(stage==='summary'?'確認開局':stage==='table'?'確認番表，下一步':'下一步','uiStage','data-stage="'+next+'"','primary'):'')+'</div>');}
function uTable(){const a=tableDisplayBalances(),card=i=>{const p=S.seat[i],dealer=p===dealerPid(),starter=Number.isInteger(S.startDealerPid)&&p===S.startDealerPid;return '<button class="u-seat '+(dealer?'dealer':'')+'" style="position:relative;'+(dealer?'border:2px solid var(--acc,#e6b422);box-shadow:0 0 0 1px var(--acc,#e6b422);':'')+'" data-act="uiPlayer" data-p="'+p+'"><small>'+windOf(p)+'</small>'+(dealer?'<span style="position:absolute;top:4px;right:4px;display:inline-flex;align-items:center;justify-content:center;width:25px;height:31px;border-radius:5px;background:#e6b422;color:#201b0a;font-size:17px;font-weight:700;border-bottom:3px solid #a67d12">莊</span>':'')+'<span class="u-avatar">'+avatar(p)+'</span><span>'+nm(p)+'</span>'+(starter?'<small style="color:var(--acc,#e6b422)">起莊</small>':'')+'<b class="'+(a[p]<0?'neg':'pos')+'">'+money(a[p])+'</b>'+(dealer&&S.streak>0?'<small style="color:var(--acc,#e6b422)">連莊 ×'+S.streak+'</small>':'')+'</button>';};return '<p class="u-caption">'+esc(gameLabel(S.game))+'</p><div class="u-board"><div></div>'+card(2)+'<div></div>'+card(3)+'<div class="u-middle"><span class="mt hon" style="width:40px;height:54px;min-width:40px;min-height:54px"><b>'+WIND[S.wind]+'</b></span><span style="font-weight:700;color:var(--acc,#e6b422)">'+WIND[S.wind]+'圈</span>'+ub('流局','draw')+'</div>'+card(1)+'<div></div>'+card(0)+'<div></div></div><div class="btnrow">'+(!isHK()?ub('未結拉數 '+S.ledger.length+' 筆','uiLedger'):'')+'</div>';}function uTableFooter(){return '<div class="btnrow">'+ub('記錄賞罰','uiInstant')+(uiCanResume()?ub('繼續輸入','uiContinue','','primary'):ub('記錄食糊','uiWinner','','primary'))+'</div>';}
function uEntry(){let h='<section class="u-flow"><p class="u-caption">'+WIND[S.wind]+'風圈 · 莊 '+playerLabel(dealerPid())+'</p>';if(pending.length)h+='<p>本局已加入 '+pending.length+' 位</p>';
 if(entryStep==='pick')h+='<h3>誰食糊？</h3><div class="u-winners">'+S.seat.map(p=>ub('<span class="u-avatar">'+avatar(p)+'</span>'+nm(p),'startWinner','data-p="'+p+'"'+(pending.some(w=>w.p===p)||(pending.length&&pending[0].disc===p)||pending.length>=3?' disabled':''))).join('')+'</div>'+(pending.length?ub('確認本局','confirm','','primary'):'');
 else if(entryStep==='method')h+='<h3>'+playerLabel(E.winner)+' 食糊</h3><div class="seg two">'+ub('自摸','chooseMethod','data-v="self"')+ub('別家出銃','chooseMethod','data-v="ron"')+'</div>'+ub('改選食糊者','entryPick');
 else h+='<h3>'+playerLabel(E.winner)+' 食糊</h3><p>誰出銃？</p>'+payerRow(S.seat.filter(p=>p!==E.winner&&!pending.some(w=>w.p===p)),'choosePayer',E.disc)+ub('返回食糊方式','entryMethod');return h+'</section>';}
function bestMelds(){if(!E.uGroups?.length)return base_bestMelds();const c=E.marks.slice(),kept=[];for(const g of E.uGroups){const ts=g.t==='chow'?[g.tile,g.tile+1,g.tile+2]:Array(g.t==='kong'?4:3).fill(g.tile),need=Array(34).fill(0);ts.forEach(t=>need[t]++);if(need.every((n,t)=>c[t]>=n)){ts.forEach(t=>c[t]--);kept.push(g);}}E.uGroups=kept;const rest=partitions(c);E.partBad=!rest.length;return rest.length?kept.map(g=>({t:g.t,tile:g.tile,open:g.t==='kong'?E.kongOpen[g.tile]!==false:true})).concat(toMelds(rest[0])):[];}
function editorPoolHtml(){const entries=physicalEntries(),used={},labels={};let eaten=false;const win=editorWin(),lock=pending[0]?.ron?.winTile,readonly=['flowers','flags'].includes(E.mode);E.melds.forEach((g,i)=>(g.t==='chow'?[g.tile,g.tile+1,g.tile+2]:Array(g.t==='kong'?4:3).fill(g.tile)).forEach(t=>(labels[t]||(labels[t]=[])).push({i,n:g.t==='chow'?'上':g.t==='pung'?'碰':g.open===false?'暗槓':'明槓'})));
 const html=entries.map(({t,group})=>{const j=used[t]||0;used[t]=j+1;let m=group==null?(labels[t]||[])[j]:{i:group,n:E.wildGroups[group].t==='chow'?'上':E.wildGroups[group].t==='pung'?'碰':E.wildGroups[group].open===false?'暗槓':'明槓'};if(isHK()&&['open','closed'].includes(E.hkKongs[t]))m={i:t,n:E.hkKongs[t]==='closed'?'暗槓':'明槓'};const selected=!m&&!eaten&&t===win;if(selected)eaten=true;const disabled=readonly||(E.mode==='win'&&(!!m||(lock!=null&&t!==lock)||(t===34&&!E.self))),a=E.mode==='meld'&&m?(group!=null?'wildRemoveGroup':isHK()?'uiHKKong':'rmMeld'):group!=null?'wildRemoveGroup':'poolTap';return mt(t,{tag:'button',badge:m?m.n:selected?'食':'',cls:(m?'mk2 ':'')+(selected?'mark ':'')+(t===overTile?'overbox ':'')+(lock!=null&&t===lock&&!m?'lockhi':''),attrs:'data-act="'+a+'" data-t="'+t+'" data-i="'+(m?.i||group||0)+'"'+(disabled?' disabled':'')});}).join('');return '<div class="editor-pile"><div class="editor-grid">'+html+Array(Math.max(0,editorCapacity(entries.length)-entries.length)).fill('<span class="tile-slot"></span>').join('')+'</div></div>';}
function editorHtml() {
  const requiredTiles = isHK() ? 14 : 17;
  const currentTiles = physicalEntries().length;

  const i = Math.max(
    0,
    ['pick', 'meld', 'win', 'flowers', 'flags'].indexOf(
      E.mode === 'jmeld' ? 'meld' : E.mode
    )
  );

  const steps = [
    ['pick', '選牌'],
    ['meld', isHK() ? '槓／門清' : '明牌'],
    ['win', '食糊'],
    ['flowers', '花牌'],
    ['flags', '特殊']
  ];

  let content = editorPanelHtml();

  if (i === 4) {
    const R = RL();

    const list = (M.FLAGS || DEFAULT_FLAGS)
      .filter(x => !(isHK() && x[0] === 'menqing'))
      .concat(
        isHK() || curPreset() === 4
          ? []
          : HUAHU.map(h => [h[0], h[1]])
      )
      .sort(
        (a, b) =>
          (R[a[0]]?.fan || 0) - (R[b[0]]?.fan || 0)
      );

    const height=window.visualViewport?.height||innerHeight;
    const pageSize=Math.max(4,Math.min(12,Math.floor((height-220)/56)*2));
    const n = Math.max(1, Math.ceil(list.length / pageSize));

    uiFlagPage = Math.min(uiFlagPage, n - 1);

    content =
      '<div class="u-flags-count">特殊情況 · 已選 ' +
        list.filter(([id])=>E.flags[id]).length + ' 項</div>' +
      '<div class="grid2 u-flags" style="--flag-rows:'+Math.ceil(pageSize/2)+'">' +
        list
          .slice(uiFlagPage * pageSize, uiFlagPage * pageSize + pageSize)
          .map(([id, name]) =>
            '<label>' +
              '<input type="checkbox" data-chg="flag" data-k="' +
                id + '"' +
                (E.flags[id] ? ' checked' : '') +
              '>' +
              esc(name) +
              ' <small>' + (R[id]?.fan || 0) + '</small>' +
            '</label>'
          )
          .join('') +
      '</div>' +
      uPagerSlot(uiFlagPage, n, 'uiFlagPage');
  }

  const statsHtml =
    '<div class="editor-stats">' +
      (
        i === 0
          ? '至少需要' + requiredTiles +
            '張，現輸入' + currentTiles + '張'
          : '共' + currentTiles + '張'
      ) +
    '</div>';

  return (
    '<div class="editor-screen u-editor' + (i===4?' editor-special':'') + '">' +
      '<header class="editor-head">' +
        ub('‹', 'editorBack') +
        '<span>' +
          playerLabel(E.winner) + ' ' +
          (E.self ? '自摸' : '食 ' + nm(E.disc)) +
        '</span>' +
        ub('⋯', 'uiMore', 'aria-label="更多牌局操作"') +
      '</header>' +

      '<div class="u-steps">' +
        steps.map(([v, name], j) =>
          ub(
            (j < i ? '✓ ' : j + 1 + ' ') + name,
            'mode',
            'data-v="' + v + '"',
            j === i ? 'current' : ''
          )
        ).join('') +
      '</div>' +

      '<div class="u-instruction">' +
        '第' + (i + 1) + '步 · ' + esc(editorHint()) +
      '</div>' +

      '<main class="editor-main">' +
        statsHtml +

        (
          editorWin() == null && i < 2
            ? '<div class="editor-live idle">待選食糊牌後計番</div>'
            : liveTotalHtml()
        ) +

        editorPoolHtml() +

        (
          i === 0
            ? '<div class="editor-tools">' +
                ub('退一張', 'undoTile') +
                ub('清空', 'clearHand') +
                (
                  isHK() && !pending.length
                    ? ub('快速記番', 'quickStart')
                    : ''
                ) +
              '</div>'
            : ''
        ) +

        '<div class="editor-panel">' +
          content +
        '</div>' +
      '</main>' +

      '<footer class="editor-footer">' +
        '<div class="editor-finish">' +
          ub(i ? '上一步' : '返回', 'uiPrev') +
          ub(
            i === 4 ? '確認番數' : '下一步',
            'uiNext',
            '',
            'primary'
          ) +
        '</div>' +
      '</footer>' +
    '</div>'
  );
}
 function fitEditor(){const b=document.querySelector('.editor-screen');if(!b)return;const vv=window.visualViewport,h=vv?.height||innerHeight,w=vv?.width||innerWidth,compact=h<720,cols=editorColumns(physicalEntries().length);b.style.setProperty('--editor-height',h+'px');b.style.top=(vv?.offsetTop||0)+'px';b.classList.toggle('editor-compact',compact);const measure=k=>b.querySelector(k)?.getBoundingClientRect().height||0,fixed=measure('.editor-head')+measure('.u-steps')+measure('.u-instruction')+measure('.editor-footer'),reserve=E.mode==='pick'?(compact?320:340):(compact?220:240),cell=Math.floor((Math.max(102,h-fixed-reserve)-12)/3),tw=Math.max(24,Math.min(56,Math.floor((Math.min(650,w-32)-(cols-1)*6)/cols),Math.floor(cell*.74))),th=Math.round(tw/.74);b.style.setProperty('--pile-frame-h',(th*3+12)+'px');b.style.setProperty('--pile-cols',cols);b.style.setProperty('--tile-w',tw+'px');b.style.setProperty('--tile-h',th+'px');b.style.setProperty('--face-size',Math.max(16,Math.min(26,tw*.48))+'px');b.style.setProperty('--suit-size',Math.max(10,tw*.23)+'px');}
function uShowGroups(t){uiGroupTile=t;uiGroups=[];if(isHK()){if(allCounts()[t]!==4){toast('這款牌不足四張，不需標示槓；請確認門清狀態後繼續。');return;}for(const open of [true,false])uiGroups.push({t:'kong',tile:t,open,physical:Array(4).fill(t)});}else{const c=allCounts().map((n,tile)=>n-(E.marks[tile]||0));if(t<27)for(let n=Math.max(0,t%9-2);n<=Math.min(6,t%9);n++){const a=Math.floor(t/9)*9+n;if([a,a+1,a+2].every(tile=>c[tile]>0))uiGroups.push({t:'chow',tile:a,open:true,physical:[a,a+1,a+2]});}if(c[t]>=3)uiGroups.push({t:'pung',tile:t,open:true,physical:Array(3).fill(t)});if(c[t]>=4)for(const open of [true,false])uiGroups.push({t:'kong',tile:t,open,physical:Array(4).fill(t)});}const n=Math.max(1,Math.ceil(uiGroups.length/4));uiGroupPage=Math.max(0,Math.min(uiGroupPage,n-1));const groupsHtml=uiGroups.slice(uiGroupPage*4,uiGroupPage*4+4).map((g,i)=>{const label=g.t==='chow'?'上':g.t==='pung'?'碰':g.open?'明槓':'暗槓';const tilesHtml=g.physical.map((tile,j)=>mt(tile,{back:g.open===false&&(j===0||j===3)})).join('');return ub('<span>'+label+'</span><div class="u-minirow">'+tilesHtml+'</div>','uiGroup','data-i="'+(uiGroupPage*4+i)+'"','u-group');}).join('');const emptyHtml=!uiGroups.length?'<p>這張牌目前沒有可標示的明牌組合；沒有明牌可直接下一步。</p>':'';uPopup(isHK()?'選擇槓的類型':'選擇明牌組合','<div class="grid2">'+groupsHtml+'</div>'+emptyHtml,up(uiGroupPage,n,'uiGroupPage')+ub('取消','uiClose'));}
 function uResult(){if(entryStep!=='hand')return {body:uEntry(),footer:ub('返回牌桌（保留輸入）','tab','data-v="table"')};const r=analyze(),quick=isHK()&&!!E.quick,hasWild=isWild()&&jokerTotal()>0;let body='<p class="u-caption">'+playerLabel(E.winner)+' '+(E.self?'自摸':'食 '+nm(E.disc))+'</p>';
 const valid=quick||!!(r&&!r.error&&(!hasWild||r.complete));
 const actions='<div class="btnrow">'+ub('返回修改','editorEdit')+ub('一炮多響','addWinner',(!valid||quick||E.self)?' disabled':'')+ub('確認記錄','confirm',!valid?' disabled':'','primary')+'</div>';
 if(quick&&uiReview==='quick'){const n=Math.max(1,Math.ceil(Object.keys(RL()).filter(id=>id!=='zimo').length/6));return {body:body+quickPanelHtml(),footer:uPagerSlot(uiQuickPage,n,'uiQuickPage')+'<div class="btnrow">'+ub('返回','uiReview','data-v="fans"')+ub('確認番數','uiReview','data-v="fans"','primary')+'</div>'};}
if (!valid) {
  const hintHtml = uiInvalidCalcHint(r, hasWild, wildBusy);

  const searchHtml = hasWild
    ? ub(
        wildBusy ? '取消搜尋' : '搜尋最高番',
        wildBusy ? 'wildStop' : 'wildRun',
        '',
        'primary'
      ) +
      '<p id="wild-progress" aria-live="polite">' +
        (wildBusy ? '搜尋中，完成後才可記錄。' : '') +
      '</p>'
    : '';

  return {
    body: body + hintHtml + searchHtml,
    footer: uPagerSlot(0, 1) + actions
  };
}
                    
                    const items=curItems(r),raw=Math.max(0,items.reduce((n,x)=>n+x.total,0)),total=isHK()?Math.min(raw,hkCap()):raw,h=document.querySelector('.u-content')?.clientHeight||Math.max(300,(window.visualViewport?.height||innerHeight)-165),w=document.querySelector('.u-content')?.clientWidth||innerWidth,columns=w>=520?3:2,rows=Math.max(2,Math.min(6,Math.floor((h-155)/58))),pageSize=rows*columns,n=Math.max(1,Math.ceil(items.length/pageSize));if(uiReview==='fans')uiPage=Math.max(0,Math.min(uiPage,n-1));let summary;
                    if(isHK())summary='合計 <b>'+total+'</b> 番';else{const groups=[];payRows(total).forEach(x=>{let g=groups.find(g=>g.fan===x.fan);if(!g){g={fan:x.fan,amount:x.amount,names:[]};groups.push(g);}g.names.push(nm(x.payer));});summary=groups.length?groups.map(g=>'<span>'+(E.self&&groups.length===1?'每家':g.names.join('、'))+'應付 <b>'+g.fan+'</b> 番 · <b>$'+g.amount+'</b></span>').join('<br>'):'合計 <b>'+total+'</b> 番';if(wildMult()>1)summary+='<small>已按本場規則乘 ×'+wildMult()+'</small>';}
 body+='<div class="u-total">'+summary+'</div><div class="u-review-tabs">'+[['fans','番種'],['pay','收付預覽'],['adjust','特別改動'],['image','牌型圖']].map(([v,n])=>ub(n,'uiReview','data-v="'+v+'"',uiReview===v?'on':'')).join('')+'</div>';
 if(uiReview==='fans')body+='<div class="u-payment-prompt"><span>記錄前核對各玩家收付與未結拉數變化</span>'+ub('查看收付預覽','uiReview','data-v="pay"','primary')+'</div>';
if(uiReview==='fans'){const page=items.slice(uiPage*pageSize,uiPage*pageSize+pageSize);body+='<div class="u-result-fans" style="display:grid;grid-template-columns:repeat('+columns+',minmax(0,1fr));grid-template-rows:repeat('+rows+',minmax(0,1fr));gap:6px;flex:1;min-height:0;overflow:auto;align-content:start">'+page.map(f=>'<div class="fan" style="min-width:0;min-height:52px;margin:0;padding:6px;border:1px solid var(--bd);border-radius:9px;background:var(--card);gap:5px"><label style="flex:1;min-width:0;font-size:13px;line-height:1.3;white-space:normal;overflow-wrap:anywhere">'+(f.id==='di'?'🔒 ':f.id==='adjust'?'✎ ':'<input type="checkbox" data-chg="excl" data-id="'+f.id+'" checked>')+esc(f.id==='di'?'底':f.name)+(f.n>1?' ×'+f.n:'')+'</label><b style="flex:none;font-size:15px">'+f.total+'</b></div>').join('')+Array(pageSize-page.length).fill('<div aria-hidden="true"></div>').join('')+'</div>';}
                    if(uiReview==='pay'){const ws=pending.concat(hasCurrentData()?[collectCurrent()]:[]);if(isHK())body+=uBalance(settleHK(ws))+'<p>本局已收付預覽</p>';else{const out=applyHand(S.ledger,mkTxns(ws,dealerPid(),S.streak),true),b=ledgerFigures(S.ledger).net,a=ledgerFigures(out.ledger).net;body+=uBalance(out.cash.map((v,p)=>v+a[p]-b[p]))+'<p>本局淨變動（含未結拉數）</p>';}}
 if(uiReview==='adjust')body+='<div class="grid2">'+ub('手動調整','uiAdjust')+ub('補加番種','uiExtra')+ub('恢復番種','uiExcluded')+(baoVisible()?ub('包牌','uiBao'):'')+(quick?ub('選番種','uiReview','data-v="quick"'):'')+'</div>';
 if(uiReview==='image')body+='<div class="u-image-review">'+(shareCard(r,total,raw)||'<p>快速記番沒有牌型圖。</p>')+'</div>';
 if(hasWild)body+=ub(wildBusy?'取消搜尋':'重新搜尋最高番',wildBusy?'wildStop':'wildRun');
 return {body,footer:uPagerSlot(uiReview==='fans'?uiPage:0,uiReview==='fans'?n:1)+actions};}
function uHistory(){finalizeFinancialSnapshots();if(!S.history.length)return {body:'<p>暫無紀錄。</p>',footer:''};uiHistory=Math.max(0,Math.min(uiHistory<0?S.history.length-1:uiHistory,S.history.length-1));const r=S.history[uiHistory],f=historyFinancials(uiHistory),ws=r.winners||[],fans=ws.flatMap(w=>(w.fans||[]).map(x=>({...x,name:(ws.length>1?S.names[w.p]+' ':'')+(x.id==='di'?'底':x.name)})));let body='<h3>'+esc(recordLabel(r,uiHistory))+'</h3><small>'+WIND[r.wind||0]+'風圈 · 莊 '+historyPlayerName(r.dealer)+'</small><p>本局淨變動</p>'+uBalance(f.complete?f.total:null)+(!f.complete?'<p class="warn">缺少當時拉數快照。</p>':'')+ws.map(w=>'<p>'+historyPlayerName(w.p)+' — '+histWinLine(r,w).head+histWinLine(r,w).extra+'</p>').join('')+'<div class="btnrow">'+ub('番種','uiDetail','data-v="fans"')+ub('已收付','uiDetail','data-v="cash"')+(!isHK()?ub('拉數','uiDetail','data-v="ledger"'):'')+'</div>',n=1;
 if(uiDetail==='fans'){n=Math.max(1,Math.ceil(fans.length/6));uiPage=Math.min(uiPage,n-1);body+='<div class="grid2">'+fans.slice(uiPage*6,uiPage*6+6).map(x=>'<div class="card u-money"><span>'+esc(x.name)+'</span><b>'+esc(x.total)+'</b></div>').join('')+'</div>';}
 if(uiDetail==='cash')body+=uBalance(f.cash)+'<small>只顯示當筆已收付。</small>';
 if(uiDetail==='ledger'){const a=historyAfterLedger(uiHistory);if(a){n=Math.max(1,Math.ceil(a.length/2));uiPage=Math.min(uiPage,n-1);body+=a.slice(uiPage*2,uiPage*2+2).map(x=>'<div class="card">'+historyPlayerName(x.from)+' 欠 '+historyPlayerName(x.to)+' $'+x.amt+'（拉'+x.k+'口）'+ledgerDetailHtml(uiHistory,x)+'</div>').join('')+(!a.length?'<p>無未結拉數。</p>':'');}else body+='<p>資料不足。</p>';}
 const actions='<div class="btnrow">'+ub('修改重算','editOpen','data-i="'+uiHistory+'"'+(canEditRec(uiHistory)?'':' disabled'))+(r.kind==='instant'?ub('撤銷賞罰','delInst','data-id="'+r.id+'"'):ub('撤銷此筆','undoRec','data-id="'+r.id+'"'+(uiHistory===S.history.length-1?'':' disabled')))+'</div>';
 return {body,footer:uPagerSlot(uiPage,n)+actions+'<div class="u-record-pager"><small>紀錄</small>'+up(uiHistory,S.history.length,'uiHistory')+'</div>'};}
function uSettle(){const a=totals(),tr=M.transfers(a),n=Math.max(1,Math.ceil(tr.length/4));uiPage=Math.min(uiPage,n-1);return {body:'<p>累計淨額（含未結拉數）</p>'+uBalance(a)+tr.slice(uiPage*4,uiPage*4+4).map(x=>'<div class="card u-money"><span>'+nm(x.from)+' → '+nm(x.to)+'</span><b>$'+x.amt+'</b></div>').join('')+(!tr.length?'<p>目前無需轉帳。</p>':''),footer:uPagerSlot(uiPage,n)+'<div class="btnrow">'+ub('查看拉數','uiLedger')+ub('分享結算','shareStory')+ub('確認結清','payAll',S.ledger.length?'':' disabled')+'</div>'};}
function uSettings(){if(uiSetting==='menu')return {body:'<div class="grid2 u-menu">'+[['rules','本場規則'],['tables','番數表'],['custom','自訂番表'],['backup','備份還原'],['players','玩家座位'],['theme','顏色字體']].map(([v,n])=>ub(n,'uiSetting','data-v="'+v+'"')).join('')+'</div>',footer:''};if(uiSetting==='tables'){const v=uTableView();return {body:v.html,footer:v.pager+ub('返回分類','uiSetting','data-v="menu"')};}if(uiSetting==='rules')return {body:uBasic()+ub('進階規則','uiSetting','data-v="advanced"'),footer:ub('返回分類','uiSetting','data-v="menu"')};if(uiSetting==='advanced')return {body:uAdvanced(),footer:ub('返回分類','uiSetting','data-v="menu"')};if(uiSetting==='theme')return {body:uThemes(),footer:ub('返回分類','uiSetting','data-v="menu"')};if(uiSetting==='players')return {body:'<div class="u-stack">'+S.seat.map(p=>ub(playerLabel(p),'uiEditPlayer','data-p="'+p+'"')).join('')+'</div>'+ub('調整座位','uiSeats'),footer:''};if(uiSetting==='backup')return {body:'<div class="u-stack">'+ub('匯出完整備份','exportFile')+ub('匯入備份','importFile')+ub('還原上一場','restoreGame')+'</div>',footer:''};const n=Math.max(1,Math.ceil(S.cfg.customTables.length/3));uiPage=Math.min(uiPage,n-1);return {body:'<div class="btnrow">'+ub('從頭設定','uiSource','data-kind="blank"')+ub('導入番表','uiImportTable')+'</div>'+S.cfg.customTables.slice(uiPage*3,uiPage*3+3).map(x=>'<div class="card"><p>'+esc(x.name)+'</p><div class="btnrow">'+ub('預覽／套用','uiSource','data-kind="saved" data-id="'+x.id+'"')+ub('匯出','tblExport','data-id="'+x.id+'"')+ub('刪除','tblDel','data-id="'+x.id+'"')+'</div></div>').join(''),footer:uPagerSlot(uiPage,n)};}
function uLedger(){const n=Math.max(1,Math.ceil(S.ledger.length/3));uiDebtPage=Math.min(uiDebtPage,n-1);uPopup('未結拉數',S.ledger.slice(uiDebtPage*3,uiDebtPage*3+3).map((x,i)=>'<div class="card"><p>'+nm(x.from)+' 欠 '+nm(x.to)+' $'+x.amt+'（拉'+x.k+'口）</p>'+ub('結清','payoff','data-i="'+(uiDebtPage*3+i)+'"')+'</div>').join('')||'<p>無未結拉數。</p>',up(uiDebtPage,n,'uiDebtPage'));}
function render(){if(window.__UI_TEST__)return;derive();applyTheme();document.body.classList.toggle('editor-open',!uiWizard&&editorActive());let html;
 if(uiWizard)html=uWizardView();else if(!S.game||tab==='chooser')html=uFrame('開始新牌局',uChooser());else if(editorActive())html=editorHtml();else{let title='牌桌',v;if(tab==='calc'){title='記錄食糊';v=uResult();}else if(['history','settle'].includes(tab)){title='歷史與結算';v=tab==='history'?uHistory():uSettle();v.body='<div class="btnrow">'+ub('歷史','tab','data-v="history"',tab==='history'?'on':'')+ub('結算','tab','data-v="settle"',tab==='settle'?'on':'')+'</div>'+v.body;}else if(['settings','players'].includes(tab)){title='高級設置';v=uSettings();}else v={body:uTable(),footer:uTableFooter()};html=uFrame(title,v.body,v.footer);}
 if(uiModal?.title==='即時籌碼／罰則')uiModal.body=viewInstantControls();document.getElementById('app').innerHTML=html+uDialog()+(editRec?editModalHtml():'')+(storyImg?'<div class="u-backdrop"><div class="u-dialog"><img style="max-width:100%;max-height:75dvh;object-fit:contain" src="'+storyImg+'">'+ub('關閉','closeStory')+'</div></div>':'');if(editorActive()&&!uiWizard)fitEditor();}

function uiAction(a,d){
 if(a==='close-panel'||a==='close')a='uiClose';
 if(tab==='calc'&&((a==='tab'&&d.v!=='calc')||['editorBack','uiBack','toChooser','newGame'].includes(a)))uiResume=uiCurrentLocation();
 if(a==='upgrade'){doUpgrade();return true;}
 if(a==='checkUpd'){checkUpdate(true);return true;}
 if(a==='toChooser'||a==='newGame'){uiModal=null;setTab('chooser');return true;}
 if(a==='startWinner'&&(E.winner!=null||draftCache)){if(E.winner===+d.p){uiContinue();return true;}uPopup('有未完成輸入','<p>請先繼續或放棄目前輸入，再記錄另一手。</p>',ub('繼續輸入','uiContinue','','primary')+ub('放棄目前輸入','uiDiscard')+ub('取消','uiClose'));return true;}
if (a === 'poolTap' && E.mode === 'meld' && +d.t !== 34) {
  const t = +d.t;

  if (!isHK()) {
    const free = allCounts().map(
      (n, tile) => n - (E.marks[tile] || 0)
    );

    let canAdd = free[t] >= 3;

    if (!canAdd && t < 27) {
      const suitStart = Math.floor(t / 9) * 9;

      for (
        let n = Math.max(0, t % 9 - 2);
        n <= Math.min(6, t % 9);
        n++
      ) {
        const start = suitStart + n;

        if (
          free[start] > 0 &&
          free[start + 1] > 0 &&
          free[start + 2] > 0
        ) {
          canAdd = true;
          break;
        }
      }
    }

    if (!canAdd && (E.marks[t] || 0) > 0) {
      uPopup('已標示明牌', ordinaryGroupTools());
      return true;
    }
  }

  uiGroupPage = 0;
  uShowGroups(t);
  return true;
}
 if(a==='tab'){uiModal=null;if(d.v!=='calc')uiPage=0;if(d.v==='history')uiHistory=-1;}
 if(['choosePayer','chooseMethod','instSave','rmMeld','wildRemoveGroup','kongToggle','editOpen','payAll','payoff'].includes(a))uiModal=null;
 if(a==='quickStart')uiReview='quick';if(a==='editorFinish'){uiReview='fans';uiPage=0;}if(a==='confirm')uiHistory=-1;
 if(a==='discardDraft'||a==='clearEntry')uiResume=null;
 if(!a.startsWith('ui'))return false;
 switch(a){
   case 'uiRestoreDraft':if(applyDraft()){uiModal=null;setTab('calc');toast('已恢復未完成的輸入');}else{toast('未能恢復草稿，請返回牌桌後重試');}break;
 case 'uiKeyboardDone':document.activeElement?.blur();document.body.classList.remove('table-keyboard-open');break;
 case 'uiClose':uiModal=null;break;
 case 'uiA2HSHowto':uPopup('加入 iPhone／iPad 主畫面',a2hsSteps(),ub('完成','uiClose'));break;
 case 'uiContinue':uiContinue();break;
 case 'uiDiscard':if(confirm('放棄目前未完成輸入？')){E=newEntry();pending=[];entryStep='pick';uiResume=null;draftCache=null;clearDraft();uiModal=null;setTab('table');}break;
case 'uiNav':case 'uiMore':uPopup('更多牌局操作','<div class="grid2">'+ub('新牌局','toChooser')+ub('本場規則','uiSetting','data-v="rules"')+ub('匯出備份','exportFile')+ub('還原上一場','restoreGame')+ub('撤銷上一筆','undoRec')+ub('分享結算','shareStory')+(uiCanResume()?ub('放棄未完成輸入','uiDiscard'):'')+'</div>');break;
  case 'uiChoose':if(uiCanResume()&&!confirm('目前有未完成輸入，仍進入新牌局設定？'))break;uiModal=null;uiBackup={S:uc(S),E:uc(E),pending:uc(pending),tab,resume:uiResume};uiWizard={stage:'ask',custom:false,touched:false};S=norm(uc(S));S.game=d.v;pickM();uiPage=0;break;
case 'uiDefault':uiWizard.custom=false;uiPage=0;act('uiSourceList',{v:'preset'});return true;
  case 'uiStage':if(d.stage==='cancel'){S=uiBackup.S;E=uiBackup.E;pending=uiBackup.pending;tab=uiBackup.tab;uiResume=uiBackup.resume;uiBackup=null;uiWizard=null;uiModal=null;pickM();break;}
  if(d.stage==='start'){try{if(uiBackup.S.game)localStorage.setItem(PREV_KEY,JSON.stringify(uiBackup.S));}catch(e){toast('無法備份舊牌局，未開始新場');break;}S.history=[];S.ledger=[];S.streak=0;S.wind=0;S.playersReady=true;S.startDealerPid=S.seat[S.dealerSeat];;E=newEntry();pending=[];entryStep='pick';uiResume=null;const I=instList()[0];inst={id:I.id,mode:I.mode,payee:S.seat[0],payer:S.seat[1],mult:1};uiWizard=null;uiBackup=null;uiModal=null;draftCache=null;clearDraft();setTab('table');break;}
  if(d.stage==='basic')uiWizard.custom=true;uiWizard.stage=d.stage;uiPage=0;break;
case 'uiOpenSavedSources':uiPage=0;act('uiSourceList',{v:'saved'});return true;
  case 'uiSourceList':if(d.v==='preset')uPopup(isHK()?'選擇廣東牌番數設定':'選擇預設番表','<div class="u-stack">'+(isHK()?Object.keys(HK_PRESETS).map(k=>ub(esc(HK_PRESETS[k].name),'uiHKSource','data-v="'+k+'"')).join(''):[1,2,3,4].map(n=>ub(esc(PRESET_NAME[n]),'uiSource','data-kind="preset" data-v="'+n+'"')).join(''))+'</div>');else{const list=S.cfg.customTables.filter(x=>(x.p==='hk')===isHK());uPopup('已儲存番表','<div class="u-stack">'+list.slice(uiPage*3,uiPage*3+3).map(x=>ub(esc(x.name),'uiSource','data-kind="saved" data-id="'+x.id+'"')).join('')+'</div>'+(!list.length?'<p>未有已儲存番表。</p>':''),up(uiPage,Math.ceil(list.length/3),'uiSourcePage'));}break;
  case 'uiSourcePage':uiPage=Math.max(0,uiPage+(+d.d));act('uiSourceList',{v:'saved'});return true;
   case 'uiHKSource':if(!isHK()||!HK_PRESETS[d.v]){toast('無效的廣東牌設定');break;}try{if(uApplySource('preset',1)){S.cfg.hk.preset=d.v;uSetOrigin('preset','廣東牌 '+HK_PRESETS[d.v].name);uiModal=null;if(!uiWizard){uiSetting='tables';setTab('settings');}}}catch(e){toast(e.message);}break;
 case 'uiSource':try{if(uApplySource(d.kind,d.id||d.v)){uiModal=null;if(!uiWizard){uiSetting='tables';setTab('settings');}}}catch(e){toast(e.message);}break;
 case 'uiImportTable':uImportTable();break;
 case 'uiSaveTable':{const over={};for(const [id,f] of Object.entries(RL()))over[id]={fan:f.fan,...(f.fanC!=null?{fanC:f.fanC}:{})};const x=S.cfg.customTables.find(x=>x.id===S.cfg.activeCustom[pkey()]);if(x&&confirm('更新「'+x.name+'」？')){x.name=uOrigin().name;x.over=over;x.saved=Date.now();}else{if(S.cfg.customTables.length>=40){toast('自訂番表已達40張');break;}const x={id:newTableId(),name:uOrigin().name||'自訂番表',p:tblP(),over,saved:Date.now()};S.cfg.customTables.push(x);S.cfg.activeCustom[pkey()]=x.id;}toast(uiWizard?'番表已加入開局草稿':'已儲存番表');break;}
 case 'uiExportTable':{const over={};for(const [id,f] of Object.entries(RL()))over[id]={fan:f.fan,...(f.fanC!=null?{fanC:f.fanC}:{})};downloadJSON({app:'mahjong-jisaan',kind:'fan-table',version:APP_VERSION,table:{name:uOrigin().name,p:tblP(),over}},'mahjong-fan-table.json');break;}
 case 'uiPage':case 'uiRulePage':uiPage=Math.max(0,uiPage+(+d.d));break;
 case 'uiTheme':uPopup('顏色與字體',uThemes(),ub('完成','uiClose'));break;
 case 'uiBack':if(uiWizard){act('uiStage',{stage:'cancel'});return true;}if(tab==='calc')uiResume=uiCurrentLocation();if(tab==='settings'&&uiSetting!=='menu'){uiSetting='menu';uiPage=0;}else setTab('table');uiModal=null;break;
case 'uiPlayer':uPopup(S.names[+d.p],'<div class="u-stack">'+(uiCanResume()?ub('繼續輸入','uiContinue','','primary'):ub('食糊／自摸','startWinner','data-p="'+d.p+'"','primary'))+ub('記錄賞罰','uiInstant','data-p="'+d.p+'"')+ub('編輯玩家','uiEditPlayer','data-p="'+d.p+'"')+ub('換位','uiSeats')+'</div>');break; 
  case 'uiEditPlayer':if(hasEntryDraft()&&!uiWizard){toast('請先完成或放棄目前輸入再改玩家');break;}uPopup('編輯玩家','<label>名稱<input maxlength="10" data-chg="uiName" data-p="'+d.p+'" value="'+esc(S.names[+d.p])+'"></label><label>Emoji<select data-chg="uiAvatar" data-p="'+d.p+'">'+PLAYER_EMOJIS.map(e=>'<option'+(e===S.avatars[+d.p]?' selected':'')+'>'+e+'</option>').join('')+'</select></label>',ub('完成','uiClose'));break;
 case 'uiSeats':uPopup('調整座位','<div class="grid2">'+S.seat.map((p,i)=>'<label>'+WIND[i]+'位<select data-chg="seat" data-s="'+i+'">'+S.seat.map(q=>'<option value="'+q+'"'+(q===p?' selected':'')+'>'+nm(q)+'</option>').join('')+'</select></label>').join('')+'</div>',ub('完成','uiClose'));break;
 case 'uiWinner':if(uiCanResume())uiContinue();else{uiModal=null;entryStep='pick';setTab('calc');}break;
 case 'uiInstant':if(d.p!=null)inst.payer=inst.payee=+d.p;uPopup('即時籌碼／罰則',viewInstantControls(),ub('取消','uiClose'));break;
 case 'uiLedger':uiDebtPage=0;uLedger();break;
 case 'uiDebtPage':uiDebtPage=Math.max(0,uiDebtPage+(+d.d));uLedger();break;
 case 'uiSetting':if(tab==='calc')uiResume=uiCurrentLocation();uiModal=null;uiSetting=d.v;uiPage=0;setTab('settings');break;
 case 'uiHistory':uiHistory=Math.max(0,Math.min(S.history.length-1,uiHistory+(+d.d)));uiPage=0;break;
 case 'uiDetail':uiDetail=d.v;uiPage=0;break;
 case 'uiReview':uiReview=d.v;uiPage=0;break;
 case 'uiFlagPage':uiFlagPage=Math.max(0,uiFlagPage+(+d.d));break;
 case 'uiQuickPage':uiQuickPage=Math.max(0,uiQuickPage+(+d.d));break;
 case 'uiGroupPage':uiGroupPage=Math.max(0,uiGroupPage+(+d.d));uShowGroups(uiGroupTile);break;
 case 'uiHKKong':uPopup('槓組',ub('取消槓','hkKong','data-t="'+d.t+'" data-v="none"')+ub('切換明／暗槓','hkKong','data-t="'+d.t+'" data-v="'+(E.hkKongs[d.t]==='open'?'closed':'open')+'"'),ub('完成','uiClose'));break;
 case 'uiGroup':{const g=uiGroups[+d.i];if(!g)break;if(isHK()){setHKKong(g.tile,g.open?'open':'closed');uiModal=null;break;}if(E.melds.length+E.wildGroups.length>=5){toast('最多五組明牌');break;}const c=allCounts(),marks=E.marks.slice();for(const t of g.physical){marks[t]++;if(marks[t]>c[t]){toast('未標記牌不足');return true;}}const lock=pending[0]?.ron?.winTile;if(lock!=null&&marks[lock]>=c[lock]){toast('共同放炮牌須留在手牌內');break;}E.marks=marks;if(g.t==='kong')E.kongOpen[g.tile]=g.open;(E.uGroups||(E.uGroups=[])).push({t:g.t,tile:g.tile,open:g.open});E.excl={};derive();uiModal=null;break;}
 case 'uiPrev':{const i=Math.max(0,['pick','meld','win','flowers','flags'].indexOf(E.mode==='jmeld'?'meld':E.mode));if(i)E.mode=['pick','meld','win','flowers','flags'][i-1];else entryStep='method';break;}

 case 'uiNext': {
  const modes = ['pick', 'meld', 'win', 'flowers', 'flags'];

  const i = Math.max(
    0,
    modes.indexOf(E.mode === 'jmeld' ? 'meld' : E.mode)
  );

  // 第一步：不通過就立即停止，不進入第二步。
  if (i === 0) {
    const issue = firstStepIssue();

    if (issue) {
      E.mode = 'pick';
      editorError = issue.message;

      uPopup(
        issue.title,
        '<p style="line-height:1.6">' +
          esc(issue.message) +
        '</p>',
        ub('繼續選牌', 'uiClose', '', 'primary')
      );

      return true;
    }
  }

  // 第二步：保留原有檢查。
  if (i === 1) {
    if (
      isHK() &&
      typeof E.flags.menqing !== 'boolean'
    ) {
      editorError = '請確認門清狀態';
      toast(editorError);
      return true;
    }

    if (!isHK() && !quadReminder()) {
      return true;
    }
  }

  // 第三步：保留原有食糊牌檢查。
  if (
    i === 2 &&
    editorWin() == null &&
    (!isHK() || pending.length)
  ) {
    editorError = '請指定食糊牌';
    toast(editorError);
    return true;
  }

  // 第五步：交給原有完成輸入流程。
  if (i === 4) {
    act('editorFinish', {});
    return true;
  }

  // 所有檢查通過後，才切換下一步。
  editorError = '';
  E.mode = modes[i + 1];

  break;
} 
  case 'uiAdjust':uPopup('手動調整',adjustUI(),ub('完成','uiClose'));break;
 case 'uiExtra':uPopup('補加番種','<select data-chg="addId"><option value="">選擇番種</option>'+fanList().filter(x=>x.id!=='di').map(x=>'<option value="'+x.id+'">'+esc(x.name)+'</option>').join('')+'</select>',ub('完成','uiClose'));break;
 case 'uiExcluded':uPopup('恢復番種',Object.keys(E.excl).filter(k=>E.excl[k]).map(k=>ub(esc(RL()[k]?.name||k),'unexcl','data-id="'+k+'"')).join('')||'<p>沒有取消的番種。</p>',ub('完成','uiClose'));break;
 case 'uiBao':uPopup('包牌','<label>包牌者<select data-chg="bao"><option value="">無</option>'+S.seat.filter(p=>p!==E.winner).map(p=>'<option value="'+p+'"'+(E.bao===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>',ub('完成','uiClose'));break;
 }
 return true;
}
function uiChange(k,el){const d=el.dataset,v=el.value;if(k==='uiName'){if(v.trim())S.names[+d.p]=v.trim().slice(0,10);return true;}if(k==='uiAvatar'){if(PLAYER_EMOJIS.includes(v))S.avatars[+d.p]=v;return true;}if(k==='uiBool'){(d.hk==='true'?S.cfg.hk:S.cfg)[d.k]=el.checked;return true;}if(k==='uiHK'){if(HK_PRESETS[v])S.cfg.hk.preset=v;return true;}if(k==='uiTableName'){const name=v.trim().replace(/[<>]/g,'').slice(0,24);if(name)uSetOrigin(uOrigin().kind,name);return true;}if(k==='uiTableQuery'){uiTableQuery=v.slice(0,80);uiPage=0;return true;}if(k==='uiRule'){const n=Number(v);if(!Number.isFinite(n)||n<0||n>100000){toast('請輸入0至100000的番數');return true;}const o=OV();(o[d.id]||(o[d.id]={}))[d.f]=n;if(uiWizard)uiWizard.touched=true;if(uOrigin().kind==='preset')uSetOrigin('edited',uOrigin().name);return true;}return false;}

let _hasDraft = loadDraft();
if(window.__UI_TEST__){window.__UI_CORE__={get:()=>S,set:x=>{S=norm(x);pickM();},entry:()=>E,setEntry:x=>{E=Object.assign(newEntry(),x);derive();},act,change:uiChange,mkTxns,applyHand,analyze,curItems,historyFinancials,validateCurrentEntry,finalizeFinancialSnapshots,uBlankValues,uApplySource,uOrigin,uImportPayload,uEntry,uResult,uWizardView,editorHtml,uTableLayout,uTableView,uTableFooter,modal:()=>uiModal,wizard:()=>uiWizard,resume:()=>uiResume,clearResume:()=>uiResume=null,location:()=>({tab,...uiCurrentLocation()}),capture:uiCaptureResume,canResume:uiCanResume,saveDraft,loadDraft,applyDraft};}else{if(_hasDraft){setTab('table');const who=Number.isInteger(draftCache.E.winner)?esc(S.names[draftCache.E.winner]):'未選擇玩家';const steps={pick:'輸入手牌',meld:'確認槓／明牌',jmeld:'確認百搭明牌',win:'確認食糊牌',flowers:'花牌',flags:'特殊情況'};uPopup('找到未完成的輸入','<div class="u-stack"><p>玩家：'+who+'</p><p>輸入進度：'+esc(steps[draftCache.E.mode]||'未完成輸入')+'</p><p>是否繼續剛才的輸入？返回牌桌仍會保留草稿。</p>'+ub('繼續輸入','uiRestoreDraft','','primary')+ub('返回牌桌，保留草稿','uiClose')+'</div>');}render();}
if(!window.__UI_TEST__){
  setTimeout(()=>checkUpdate(false),800);
}

window.addEventListener('pagehide',()=>saveDraft());
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden')saveDraft();
  else if(!window.__UI_TEST__&&Date.now()-lastUpdateCheck>15*60*1000)checkUpdate(false);
});

})();
