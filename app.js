(function(){
'use strict';
const APP_VERSION='v1.3';
const APP_UPDATED='2026-10-26 16:57 (香港時間)';
const DEV_IG='kevinli999';
let M=window.MJ;
const KEY='mj_hk_tw_v1';
const PREV_KEY='mj_hk_tw_prev_game';
const A2HS_KEY='mj_a2hs_never';
const WIND='東南西北';
const CHI='上(吃)';
const WARN_DELAY=5000;
const DEFAULT_THEME={bg:'#0f2a1f',card:'#16382b',btn:'#1d4a38',acc:'#e6b422'};
const DEFAULT_FLAGS=[['ting','叮'],['qiangkong','搶槓'],['huashang','花上自摸'],['kongshang','槓上自摸'],['haidi','海底撈月'],['tianhu','天胡'],['dihu','地胡'],['renhu','人胡'],['tianting','天叮'],['shuangxiang','雙響'],['sanxiang','三響']];
const SCHEMES=[
 ['經典綠',{bg:'#0f2a1f',card:'#16382b',btn:'#1d4a38',acc:'#e6b422'}],
 ['夜藍',{bg:'#0f1f33',card:'#172b45',btn:'#1f3d63',acc:'#3dd6c6'}],
 ['酒紅金',{bg:'#2a0f14',card:'#3a1a20',btn:'#5a2530',acc:'#e6b422'}],
 ['黑金',{bg:'#0b0b0b',card:'#202020',btn:'#333b42',acc:'#e6b422'}],
 ['紫夜',{bg:'#1f1630',card:'#2c2142',btn:'#43336b',acc:'#ff7eb6'}]
];
const THEME_LABEL={bg:'頁面背景',card:'格子 / 卡片',btn:'按鈕',acc:'強調色(選中、金額、標題)'};
const PRESET_NAME={1:'預設 #1 陶源麻雀王大賽番數表',2:'預設 #2 香港麻雀協會總例(2025-07-28 修訂)',3:'預設 #3 台牌百搭番數表'};
const HK_PRESETS={'8-64':{name:'8番64',cap:8,scale:1},'10-128':{name:'10番128(二五雞)',cap:10,scale:1},'10-256':{name:'10番256(五一)',cap:10,scale:2}};
const HK_BASE={1:2,2:4,3:8,4:16,5:24,6:32,7:48,8:64,9:96,10:128};
const PH_FANS=[
 ['guanshou','冚手糊'],['gsg','槓上槓摸'],['ggg','槓槓槓摸'],['hedi','河底撈魚'],['haidi1','海底撈月(一筒)'],
 ['wuhua','無花'],['wuzi','無字'],['dayu5','大於五'],['xiaoyu5','小於五'],['lanyise','藍一色'],['lvyise','綠一色'],
 ['quanyaojiu','全么九'],['xwaiyu','小外語通'],['dwaiyu','大外語通'],['jishi','即食'],['menting','門清聽牌'],
 ['daji40','大雞糊(純,無其他番)'],['daji60','大雞糊(另有番數,照計)'],['hunx30','混帶X(檔位一)'],['hunx20','混帶X(檔位二)'],['hunx10','混帶X(檔位三)'],
 ['budalong','不搭(龍)'],['budafeng','不搭(逢)'],['huashang_n','花上自摸(1×N+1)']
].map(a=>({id:a[0],name:a[1]}));
const OPT_INST=[
 {id:'xue',name:'雪(罰)',mode:'payall'},{id:'fanxue',name:'反雪(罰)',mode:'payall'},{id:'bing',name:'冰(罰)',mode:'payall'},{id:'fanbing',name:'反冰(罰)',mode:'payall'},
 {id:'weidou',name:'圍骰(莊家收其餘三家)',mode:'all'},{id:'wenzhuang',name:'問莊圍三',mode:'all'},{id:'wangkai',name:'忘開暗槓(罰,付其餘三家)',mode:'payall'},
 {id:'zhuifan',name:'追番子(付其餘三家)',mode:'payall'},{id:'zhuikai',name:'追開章(付其餘三家)',mode:'payall'}
];
const defHK=()=>({preset:'10-128',minFan:3,bao12:true,baoSan:true,flowers:false,renzhuang:true,ratio:0.5,over:{}});
const defState=()=>({game:null,names:['玩家1','玩家2','玩家3','玩家4'],seat:[0,1,2,3],dealerSeat:0,streak:0,wind:0,history:[],ledger:[],cfg:{fanValue:1,baseMult:5,minFan:0,drawKeeps:true,preset:1,overs:{1:{},2:{},3:{},hk:{}},instAmts:{1:{},2:{},3:{},hk:{}},hk:defHK(),theme:Object.assign({},DEFAULT_THEME)}});
function norm(j){
  const d=defState(); const s=Object.assign(d,j,{cfg:Object.assign(d.cfg,j.cfg||{}),ledger:j.ledger||[]});
  const th=Object.assign({},DEFAULT_THEME,(j.cfg&&j.cfg.theme)||{});
  if(j.cfg&&j.cfg.bg&&!(j.cfg.theme&&j.cfg.theme.bg)) th.bg=j.cfg.bg;
  s.cfg.theme=th;
  const c=s.cfg;
  if(!c.overs||typeof c.overs!=='object') c.overs={1:(j.cfg&&j.cfg.over)||{},2:{},3:{}};
  ['1','2','3','hk'].forEach(k=>{ if(!c.overs[k]) c.overs[k]={}; });
  if(!c.instAmts||typeof c.instAmts!=='object') c.instAmts={};
  ['1','2','3','hk'].forEach(k=>{ if(!c.instAmts[k]) c.instAmts[k]={}; });
  c.hk=Object.assign(defHK(),c.hk||{}); if(!c.hk.over) c.hk.over={};
  if(!HK_PRESETS[c.hk.preset]) c.hk.preset='10-128';
  if([1,2,3].indexOf(c.preset)<0) c.preset=1;
  if(s.game!=='tw'&&s.game!=='hk') s.game=(s.history&&s.history.length)?'tw':null;
  return s;
}
function load(){
  try{ const j=JSON.parse(localStorage.getItem(KEY)); if(j&&j.names) return norm(j); }catch(e){}
  return defState();
}
let S=load();
const isHK=()=>S.game==='hk';
const SETS=()=>isHK()?4:5;
function pickM(){
  if(S.game==='hk'&&window.MJHK){ M=window.MJHK; return; }
  const p=S.cfg.preset;
  M=(p===2&&window.MJ2)?window.MJ2:(p===3&&window.MJ3)?window.MJ3:window.MJ;
}
pickM();
const save=()=>{ try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} };
const newEntry=()=>({winner:null,self:true,disc:null,all:[],marks:Array(34).fill(0),kongOpen:{},melds:[],hand:[],win:null,partBad:false,step:1,flowers:Array(8).fill(false),flags:{},excl:{},extra:[],bao:null});
let E=newEntry(), pending=[], tab='table';
let inst={id:null,mode:'one',payee:null,payer:null,mult:1};
let upd=null, updDismissed=false, checking=false, a2hsHidden=false;
let lastEdit=0, warnTimer=null;
const touchEdit=()=>{ lastEdit=Date.now(); };
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const seatOf=p=>S.seat.indexOf(p);
const dealerPid=()=>S.seat[S.dealerSeat];
const windIdx=p=>(seatOf(p)-S.dealerSeat+4)%4;
const windOf=p=>WIND[windIdx(p)];
const nm=p=>esc(S.names[p]);
const pkey=()=>isHK()?'hk':String(S.cfg.preset);
const OV=()=>S.cfg.overs[pkey()]||(S.cfg.overs[pkey()]={});
function phList(){ return isHK()?[]:PH_FANS.filter(p=>!M.FANS.some(f=>f.id===p.id)); }
function fanList(){ return M.FANS.concat(phList().map(p=>({id:p.id,name:p.name,fan:0,fanC:null,manual:true}))); }
function RL(){
  const r=M.buildRules(OV());
  phList().forEach(p=>{ const o=OV()[p.id]; r[p.id]={id:p.id,name:p.name,fan:(o&&o.fan!=null&&!isNaN(o.fan))?+o.fan:0,fanC:null,manual:true}; });
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
function isSafariApple(){ try{ const ua=navigator.userAgent||''; return !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua); }catch(e){ return true; } }
function a2hsSteps(){
  return '<ol class="steps-list"><li>'+(isSafariApple()?'用 <b>Safari</b> 打開本頁。':'建議改用 <b>Safari</b> 打開本頁(其他瀏覽器的選單位置可能不同)。')+'</li><li>點瀏覽器的<b>分享按鈕</b>(方框加向上箭頭 ⬆︎,在畫面底部或右上角)。</li><li>在選單中往下找,點<b>「加入主畫面」</b>。</li><li>按右上角<b>「加入」</b>,之後從主畫面圖示開啟即可。</li></ol><div class="hint">注意:主畫面 App 的資料與 Safari 是分開存放的。如果你已在 Safari 記錄過資料,請先到「設定 → 複製備份」,打開主畫面 App 後再用「貼上匯入」。</div>';
}
function a2hsBanner(){
  if(!isApple()||isStandalone()||a2hsHidden) return '';
  try{ if(localStorage.getItem(A2HS_KEY)) return ''; }catch(e){}
  return '<div class="note"><b>建議加入主畫面</b><br>加入主畫面後會像一般 App 全螢幕運行,沒有網址列,也更穩定。'+a2hsSteps()+'<div class="btnrow"><button class="primary" data-act="a2hsLater">我知道了</button><button data-act="a2hsNever">不再提示</button></div></div>';
}

function hex2rgb(h){ h=(h||'#000000').replace('#',''); if(h.length===3) h=h.split('').map(c=>c+c).join(''); const n=parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
function rgb2hex(a){ return '#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join(''); }
function mix(c,t,f){ const a=hex2rgb(c), b=hex2rgb(t); return rgb2hex(a.map((v,i)=>v+(b[i]-v)*f)); }
function lum(c){ const a=hex2rgb(c).map(v=>{ v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4); }); return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]; }
const STATIC_CSS=`
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
.zone.tap{cursor:pointer}
`;
const DYN_CSS=`
body{background:var(--bg)!important}
.card,.status,.tr,.flags label,select,input[type=number]{background:var(--card)!important}
.card,select,input,button,.zone,.prev{border-color:var(--bd)!important}
.zone,.prev,.winzone{background:var(--card2)!important}
.zone{border-style:dashed}
.winzone{border-color:var(--acc)!important}
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
    const b=document.createElement('style'); b.id='mj-dyn'; b.textContent=DYN_CSS; document.head.appendChild(b);
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
  o=o||{}; const tag=o.tag||'span';
  const at=(o.attrs||'')+' class="mt '+(t<27?'s'+M.suitOf(t):'hon h'+(t-27))+(o.back?' back':'')+(o.cls?' '+o.cls:'')+'"';
  const inner=t<27?'<b>'+NUMCH[M.numOf(t)]+'</b><i>'+M.SUITS[M.suitOf(t)]+'</i>':'<b>'+M.tName(t)+'</b>';
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
  if(checking) return; checking=true;
  try{
    const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});
    if(!r.ok) throw new Error('http');
    const j=await r.json();
    if(j&&j.version&&(j.version!==APP_VERSION||(j.updated&&j.updated!==APP_UPDATED))){ upd=j; updDismissed=false; if(manual) toast('發現新版本 '+j.version); }
    else { upd=null; if(manual) toast('目前已是最新版本'); }
  }catch(e){ if(manual) toast('無法檢查更新,請確認網絡'); }
  checking=false; render();
}
async function doUpgrade(){
  toast('正在更新…');
  try{
    if('serviceWorker' in navigator){ const rs=await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r=>r.unregister())); }
    if(window.caches){ const ks=await caches.keys(); await Promise.all(ks.map(k=>caches.delete(k))); }
    await Promise.all(['./','index.html','app.js','engine.js','engine2.js','engine_hk.js','manifest.json','sw.js','version.json','icon-192.png','icon-512.png'].map(f=>fetch(f,{cache:'reload'}).catch(()=>{})));
  }catch(e){}
  location.reload();
}
function mkTxns(ws,dealer,streak){
  const bonus=1+2*streak, base=S.cfg.fanValue*S.cfg.baseMult, fv=S.cfg.fanValue, tx=[];
  ws.forEach(w=>{
    const payers=w.self?[0,1,2,3].filter(i=>i!==w.p):[w.disc];
    payers.forEach(q=>{ const fan=w.total+((q===dealer||w.p===dealer)?bonus:0); tx.push({w:w.p,l:q,amt:Math.round(base+fan*fv)}); });
  });
  return tx;
}
function applyHand(ledger,txns,win){
  const L=copyL(ledger), cash=[0,0,0,0], ev=[], keep=[], handled={};
  const has=(w,l)=>txns.find(t=>t.w===w&&t.l===l);
  L.forEach(r=>{
    const dir=has(r.to,r.from), rev=has(r.from,r.to);
    if(dir){ r.amt=Math.ceil(r.amt*1.5)+dir.amt; r.k++; r.hit=true; keep.push(r); handled[r.from+'>'+r.to]=1; ev.push({t:'la',from:r.from,to:r.to,amt:r.amt,k:r.k}); }
    else if(rev){ const pay=Math.floor(r.amt/2); cash[r.from]-=pay; cash[r.to]+=pay; ev.push({t:'ti',from:r.from,to:r.to,amt:r.amt,pay}); }
    else if(!win){ keep.push(r); }
    else if(txns.every(t=>t.w===r.to)){ keep.push(r); }
    else { cash[r.from]-=r.amt; cash[r.to]+=r.amt; ev.push({t:'settle',from:r.from,to:r.to,amt:r.amt}); }
  });
  txns.forEach(t=>{
    if(handled[t.l+'>'+t.w]) return;
    keep.push({from:t.l,to:t.w,amt:t.amt,k:1}); ev.push({t:'new',from:t.l,to:t.w,amt:t.amt,k:1});
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
function baseAll(){ return SETS()*3+2; }
function maxAll(){ return baseAll()+4; }
function need(){ return (SETS()-E.melds.length)*3+2; }
function tileCount(t){ let n=0; E.all.forEach(x=>{ if(x===t) n++; }); return n; }
function allCounts(){ const c=Array(34).fill(0); E.all.forEach(t=>c[t]++); return c; }
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
  if(E.win==null) return null;
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
function bestMelds(){
  const c=E.marks;
  let any=false; for(let t=0;t<34;t++) if(c[t]>0){ any=true; break; }
  E.partBad=false;
  if(!any) return [];
  const parts=partitions(c);
  if(!parts.length){ E.partBad=true; return []; }
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
  for(let t=0;t<34;t++){ if(E.marks[t]>ac[t]) E.marks[t]=ac[t]; if(E.marks[t]<0) E.marks[t]=0; }
  if(E.win!=null){ const unm=ac[E.win]-E.marks[E.win]; if(unm<1) E.win=null; }
  E.melds=bestMelds();
  const mc=meldCountsOf(E.melds), hand=[]; let taken=false;
  for(let t=0;t<34;t++){ const n=ac[t]-mc[t]; for(let i=0;i<n;i++){ if(!taken&&E.win!=null&&t===E.win){ taken=true; } else hand.push(t); } }
  E.hand=hand;
}
function warnVisible(){ return E.partBad&&(Date.now()-lastEdit>=WARN_DELAY); }
function scheduleWarn(){
  if(warnTimer){ clearTimeout(warnTimer); warnTimer=null; }
  if(E.partBad&&tab==='calc'){
    const left=WARN_DELAY-(Date.now()-lastEdit);
    if(left>0) warnTimer=setTimeout(()=>{ warnTimer=null; render(); },left+60);
  }
}
function ctxExtra(){ const x={useFlowers:isHK()?!!S.cfg.hk.flowers:true}; if(E.winner!=null){ x.roundWind=S.wind; x.seatWind=windIdx(E.winner); } return x; }
function analyze(){
  if(E.win==null||E.hand.length!==need()-1) return null;
  return M.analyze(Object.assign({hand:E.hand.concat([E.win]),melds:E.melds,win:E.win,flowers:E.flowers,selfDraw:E.self,flags:E.flags},ctxExtra()),OV());
}
function curItems(res){
  const r=RL(); let it;
  if(res&&res.items) it=res.items.filter(x=>!E.excl[x.id]);
  else it=M.basic(Object.assign({flowers:E.flowers,selfDraw:E.self,flags:E.flags},ctxExtra())).filter(x=>!E.excl[x.id]);
  it=it.concat(E.extra.map(x=>({id:x.id,n:x.n,closed:false})));
  return it.map(x=>{
    const f=r[x.id]; if(!f) return {id:x.id,name:x.id,n:x.n,unit:0,total:0};
    const c=x.closed&&f.fanC!=null; const total=M.valueOf(r,{id:x.id,n:x.n,closed:x.closed});
    return {id:x.id,name:f.name+(f.fanC!=null?(c?'(暗)':'(明)'):''),n:x.n,unit:(x.n?total/x.n:0),total};
  });
}
function tileBtn(t){ return '<button class="t s'+M.suitOf(t)+'" data-act="tile" data-t="'+t+'">'+M.tName(t)+'</button>'; }
function palette(){
  let h='<div class="pal">';
  for(let su=0;su<3;su++){ h+='<div class="row">'; for(let n=1;n<=9;n++) h+=tileBtn(su*9+n-1); h+='</div>'; }
  h+='<div class="row">'; for(let t=27;t<34;t++) h+=tileBtn(t); h+='</div></div>';
  return h;
}
function winnerBtns(key,val){
  let h='<div class="seg">';
  S.seat.forEach(p=>{ h+='<button class="'+(val===p?'on':'')+'" data-act="'+key+'" data-p="'+p+'">'+nm(p)+'<small>'+windOf(p)+'</small></button>'; });
  return h+'</div>';
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
function gameName(){ return isHK()?('廣東牌 · '+HK_PRESETS[S.cfg.hk.preset].name):('港式台牌 · '+PRESET_NAME[S.cfg.preset]); }
function viewChooser(){
  let h='<div class="chooser"><h2>麻雀計番</h2><div class="sub">請選擇玩法</div>';
  h+='<button data-act="game" data-v="tw">港式台牌(16張)<small>五組面子加一對眼,有拉、踢半、斬拉,三套番表預設</small></button>';
  h+='<button data-act="game" data-v="hk">廣東牌(13張)<small>四組面子加一對眼,三番起糊,10番封頂,二五雞・半辣上等計分表</small></button>';
  if(!window.MJHK) h+='<div class="warn">未能載入廣東牌檔案(engine_hk.js),請確認已上傳。</div>';
  if(S.game) h+='<div class="btnrow"><button data-act="tab" data-v="table" style="text-align:center;font-size:15px">返回目前牌局(現為'+(isHK()?'廣東牌':'港式台牌')+')</button></div>';
  h+='<div class="dev" style="text-align:center">'+APP_VERSION+' · 開發者:Instagram <a href="https://www.instagram.com/'+DEV_IG+'/" target="_blank" rel="noopener">@'+DEV_IG+'</a></div></div>';
  return h;
}
function viewTable(){
  const b=balances();
  const card=s=>{ const p=S.seat[s]; return '<div class="card seat '+(s===S.dealerSeat?'dealer':'')+'"><div class="sw">'+WIND[s]+'</div><div class="pn" data-act="rename" data-p="'+p+'">'+nm(p)+'</div><div class="mini">門風 '+windOf(p)+(s===S.dealerSeat?' · 莊':'')+'</div><div class="bal '+(b[p]>=0?'pos':'neg')+'">'+money(b[p])+'</div></div>'; };
  let h='<div class="status">'+WIND[S.wind]+'風圈 · 莊家 '+nm(dealerPid())+' · 連莊 '+S.streak+' 次'+(isHK()?'':'(莊家加 '+(1+2*S.streak)+' 番)')+'</div>';
  h+='<div class="cross"><div></div>'+card(3)+'<div></div>'+card(2)+'<div class="center">座位<br><small>(實際位置)</small></div>'+card(0)+'<div></div>'+card(1)+'<div></div></div>';
  h+='<p class="hint">格內金額為已收付的現金淨額。'+(isHK()?'食糊莊家連莊(可在設定關閉),流局莊家輪替。':'連莊與換莊會依食糊結果自動計算,流局不增加連莊數。')+'目前玩法:'+gameName()+'</p>';
  if(!isHK()) h+='<h3>未結算的拉</h3>'+ledgerHtml(true);
  h+='<h3>座位安排</h3><div class="grid2">';
  for(let s=0;s<4;s++){ h+='<label>'+WIND[s]+'位<select data-chg="seat" data-s="'+s+'">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(S.seat[s]===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>'; }
  h+='</div><p class="hint">點玩家名稱可改名。換座位時會自動與原本坐該位置的人對調。</p>';
  h+='<h3>開局設定</h3><div class="grid2">';
  h+='<label>莊家座位<select data-chg="dealerSeat">'+[0,1,2,3].map(s=>'<option value="'+s+'"'+(S.dealerSeat===s?' selected':'')+'>'+WIND[s]+'位 '+nm(S.seat[s])+'</option>').join('')+'</select></label>';
  h+='<label>風圈<select data-chg="wind">'+[0,1,2,3].map(s=>'<option value="'+s+'"'+(S.wind===s?' selected':'')+'>'+WIND[s]+'風圈</option>').join('')+'</select></label>';
  h+='<div class="stepper">連莊次數(自動,必要時手動修正)<button data-act="streak" data-d="-1">−</button><b>'+S.streak+'</b><button data-act="streak" data-d="1">＋</button></div></div>';
  h+='<div class="btnrow"><button class="primary" data-act="tab" data-v="calc">開始算番</button><button data-act="draw">流局</button></div>';
  h+='<h3>牌局管理</h3><div class="btnrow"><button class="danger" data-act="newGame">開始全新局</button>'+(hasPrev()?'<button data-act="restoreGame">還原上一場牌局</button>':'')+'</div><p class="hint">全新局會清空所有紀錄、未結算的拉、連莊與風圈,並由東風圈、東位坐莊重新開始。玩家名稱、座位與設定會保留。清空前會自動保存上一場,可用「還原上一場牌局」找回。</p>';
  return h;
}
function dragonExposed(){ return E.melds.filter(m=>m.tile>=31&&m.t!=='chow').length; }
function baoVisible(){
  if(!isHK()||!E.self) return false;
  const h=S.cfg.hk;
  return (h.bao12&&E.melds.length>=4)||(h.baoSan&&dragonExposed()>=3);
}
function inputSection(){
  const st=E.step, need0=need();
  let h='<h3>輸入牌</h3>';
  h+='<div class="steps">'+[[1,'① 選齊所有牌','手牌、明牌、食糊牌'],[2,'② 點選明牌','系統判斷上/碰/槓'],[3,'③ 指名食糊牌','點那一張']].map(a=>'<button class="'+(st===a[0]?'on':'')+'" data-act="step" data-v="'+a[0]+'">'+a[1]+'<small>'+a[2]+'</small></button>').join('')+'</div>';
  if(st===1){
    h+='<p class="hint">先把手上所有的牌選齊(包括已經'+CHI+'、碰、槓的牌,以及食糊那一張)。選到 '+baseAll()+' 張會自動進入②;有槓的話每組多一張,可在②按「＋補牌」。選錯可以點下面的牌刪除。</p>';
    h+=palette();
  } else if(st===2){
    h+='<p class="hint">只需要逐張點選已經'+CHI+'、碰、槓出來的牌(點中的牌會升起並變色,再點可取消)。系統會自動判斷是'+CHI+'、碰還是槓,並取番數最高的組合;四張相同的牌當作槓,可在明牌區點「明槓⇄」切換明槓或暗槓。沒有明牌可直接進入③。</p>';
    h+='<div class="btnrow"><button data-act="step" data-v="1">＋補牌(有槓時)</button><button class="primary" data-act="step" data-v="3">沒有更多明牌 → ③ 指名食糊牌</button></div>';
  } else {
    h+='<p class="hint">點下面牌堆裡最後食糊(胡牌)的那一張。再點一次可取消;已標為明牌的牌不能當食糊牌。</p>';
  }
  h+='<h3>牌堆 <small>共 '+E.all.length+' 張</small></h3>';
  let markedWin=false;
  const used=Array(34).fill(0);
  h+='<div class="zone"><div class="tiles">'+(E.all.length?E.all.slice().sort((a,b)=>a-b).map(t=>{
    const idx=used[t]++; const isMk=idx<E.marks[t];
    let cls=isMk?'mk2':'';
    if(!isMk&&E.win===t&&!markedWin){ markedWin=true; cls='mark'; }
    return mt(t,{tag:'button',cls:cls,attrs:'data-act="poolTap" data-t="'+t+'"'});
  }).join(''):'<span class="hint">未有牌,請先在①選牌</span>')+'</div></div>';
  h+='<div class="btnrow"><button data-act="undoTile">退一張</button><button data-act="clearHand">全部清空</button></div>';
  h+='<h3>牌型確認</h3><div class="card entered">';
  h+='<div class="zl">明牌 <small>'+E.melds.length+' 組'+(E.melds.length?',點牌可取消':',點下方空白處開始點選明牌')+'</small></div>';
  h+='<div class="zone tap" data-act="step" data-v="2">'+(E.melds.length?E.melds.map((m,i)=>meldGroup(m,i)).join(''):'<span class="hint">無(點此進入②選明牌)</span>')+'</div>';
  if(warnVisible()) h+='<div class="warn" style="margin-top:6px">點選的牌無法組成'+CHI+'、碰或槓(每組需要3張,槓需要4張),請調整。</div>';
  h+='<div class="zl">手牌 <small>'+E.hand.length+' / '+(need0-1)+' 張(不含食糊牌)</small></div>';
  h+='<div class="zone"><div class="tiles">'+(E.hand.length?E.hand.map(t=>mt(t)).join(''):'<span class="hint">未有手牌</span>')+'</div></div>';
  h+='<div class="zl">食糊牌(胡牌) <small>'+(E.win!=null?'點牌可取消':'點空白處指名')+'</small></div>';
  h+='<div class="zone winzone tap" data-act="'+(E.win!=null?'clearWin':'step')+'" data-v="3">'+(E.win!=null?mt(E.win,{cls:'big'}):'<span class="hint">未指名(點此進入③指名食糊牌)</span>')+'</div>';
  h+='</div>';
  return h;
}
function viewCalc(){
  const res=analyze(); const items=curItems(res); const total=items.reduce((a,x)=>a+x.total,0);
  if(E.winner==null) E.winner=S.seat[0];
  let h='<div class="status">目前:<b>'+WIND[S.wind]+'風圈</b> · 莊家 '+nm(dealerPid())+' · 連莊 '+S.streak+' 次<br>食糊者(胡牌)'+nm(E.winner)+' 的門風:<b>'+windOf(E.winner)+'風</b>'+(E.winner===dealerPid()?'(莊家)':'')+'</div>';
  h+='<div class="hint">各家門風:'+S.seat.map(p=>nm(p)+' '+windOf(p)).join(' · ')+'<br>玩法:'+gameName()+'</div>';
  if(pending.length) h+='<div class="note">已加入 '+pending.length+' 位食糊者:'+pending.map(w=>nm(w.p)+' '+w.total+'番').join('、')+'</div>';
  h+='<h3>食糊者(胡牌)</h3>'+winnerBtns('winner',E.winner);
  h+='<div class="seg two"><button class="'+(E.self?'on':'')+'" data-act="self" data-v="1">自摸</button><button class="'+(!E.self?'on':'')+'" data-act="self" data-v="0">出銃(放槍)</button></div>';
  if(!E.self){ h+='<div class="lbl">出銃者(放槍)</div>'+winnerBtns('disc',E.disc); }
  if(!isHK()||S.cfg.hk.flowers) h+='<h3>花牌</h3><div class="flowers">'+M.FLOWERS.map((f,i)=>'<button class="fl '+(E.flowers[i]?'on':'')+'" data-act="flower" data-i="'+i+'">'+f+'</button>').join('')+'</div>';
  h+='<h3>特殊情況</h3><div class="flags">'+(M.FLAGS||DEFAULT_FLAGS).map(a=>'<label><input type="checkbox" data-chg="flag" data-k="'+a[0]+'"'+(E.flags[a[0]]?' checked':'')+'>'+a[1]+'</label>').join('')+'</div>';
  if(baoVisible()){
    h+='<h3>包牌(自摸時由供牌者包付三家)</h3><label>包牌者<select data-chg="bao"><option value="">無</option>'+S.seat.filter(p=>p!==E.winner).map(p=>'<option value="'+p+'"'+(E.bao===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label><p class="hint">十二章包:供給第四組明章(明坎、上、任何槓)的一家包付;第四組是暗槓則無人包。大三元包:供給第三組三元牌明章的一家包付。包後不包先,只計一家。</p>';
  }
  h+=inputSection();
  h+='<h3>番數結果</h3>';
  if(res&&res.error) h+='<div class="warn">'+esc(res.error)+'</div>';
  else if(!res) h+='<div class="hint">牌未輸入完整(需要指名食糊牌,且牌數正確),暫以手動番種計算</div>';
  else h+='<div class="ok">已自動分析(共 '+res.count+' 種拆法,取最高番;聽 '+res.waits+' 張牌)</div>';
  h+='<div class="fans">'+items.map(x=>'<div class="fan"><label><input type="checkbox" data-chg="excl" data-id="'+x.id+'" checked> '+x.name+(x.n>1?' ×'+x.n:'')+'</label><span>'+x.total+'</span></div>').join('')+'</div>';
  const exl=Object.keys(E.excl).filter(k=>E.excl[k]);
  if(exl.length){ const r=RL(); h+='<div class="hint">已取消:'+exl.map(k=>'<a data-act="unexcl" data-id="'+k+'">'+(r[k]?r[k].name:k)+'(恢復)</a>').join(' ')+'</div>'; }
  if(E.extra.length){ const r=RL(); h+='<div class="extras">'+E.extra.map((x,i)=>'<span class="meld">'+(r[x.id]?r[x.id].name:x.id)+' ×'+x.n+' <b data-act="extraN" data-i="'+i+'" data-d="1">＋</b> <b data-act="extraN" data-i="'+i+'" data-d="-1">−</b> <b data-act="rmExtra" data-i="'+i+'">✕</b></span>').join('')+'</div>'; }
  h+='<div class="addfan"><select data-chg="addId"><option value="">＋ 手動加番種…</option>'+fanList().map(f=>'<option value="'+f.id+'">'+f.name+' ('+f.fan+(f.fanC!=null?'/'+f.fanC:'')+')</option>').join('')+'</select></div>';
  const minF=isHK()?S.cfg.hk.minFan:S.cfg.minFan;
  h+='<div class="total">合計 <b>'+total+'</b> 番'+(isHK()&&total>hkCap()?' <span class="hint">(封頂 '+hkCap()+' 番)</span>':'')+(minF>0&&total<minF?' <span class="neg">('+(isHK()?'不足 '+minF+' 番,記錄時當詐糊':'低於起糊 '+minF+' 番')+')</span>':'')+'</div>';
  if(isHK()){
    if(E.self||E.disc!=null){
      const w0={p:E.winner,self:E.self,disc:E.disc,total:total,qiang:!!E.flags.qiangkong&&!E.self,bao:E.bao};
      const d=settleHK(pending.concat([w0]));
      h+='<h3>本局計分預覽</h3><div class="prev">'+S.seat.map(p=>'<div><small>'+nm(p)+'</small><b class="'+(d[p]>=0?'pos':'neg')+'">'+money(d[p])+'</b></div>').join('')+'</div><p class="hint">'+HK_PRESETS[S.cfg.hk.preset].name+':'+Math.min(total,hkCap())+' 番出銃 '+hkRon(total)+' 分,自摸每家 '+hkShare(total)+' 分。</p>';
    }
  } else if(E.self||E.disc!=null){
    const ws=pending.map(w=>({p:w.p,self:false,disc:w.disc,total:w.total})).concat([{p:E.winner,self:E.self,disc:E.disc,total}]);
    const out=applyHand(S.ledger,mkTxns(ws,dealerPid(),S.streak),true);
    h+='<h3>本局記帳預覽</h3><div class="prev">'+S.seat.map(p=>'<div><small>'+nm(p)+'</small><b class="'+(out.cash[p]>=0?'pos':'neg')+'">'+money(out.cash[p])+'</b></div>').join('')+'</div><p class="hint">上方為本局實際收付的現金;新的食糊金額先記入「拉」,不立即收付。</p>';
    h+=out.ev.map(e=>'<div class="hint">• '+evText(e)+'</div>').join('');
  }
  h+='<div class="btnrow"><button class="primary" data-act="confirm">確認記錄</button><button data-act="addWinner">再加一位食糊者(雙/三響)</button><button data-act="clearEntry">重設本局</button></div>';
  h+='<h3>即時籌碼 / 罰則</h3><p class="hint">這類籌碼即時收付'+(isHK()?'':',不受拉、踢半影響')+'。金額可直接修改,數字 0 的項目請自行填寫。</p>';
  const lst=instList(); let I=lst.find(x=>x.id===inst.id);
  if(!I){ I=lst[0]; inst.id=I.id; inst.mode=I.mode; }
  if(inst.payee==null) inst.payee=S.seat[0];
  if(inst.payer==null) inst.payer=S.seat[1];
  const baseAmt=S.cfg.fanValue*S.cfg.baseMult;
  h+='<div class="grid2"><label>項目<select data-chg="instId">'+lst.map(x=>'<option value="'+x.id+'"'+(x.id===inst.id?' selected':'')+'>'+x.name+'</option>').join('')+'</select></label>';
  h+='<label>金額(每份)<input type="number" step="any" data-chg="instAmt" value="'+instAmt(I)+'"></label>';
  h+='<label>模式<select data-chg="instMode"><option value="all"'+(inst.mode==='all'?' selected':'')+'>其餘三家付給收款人</option><option value="one"'+(inst.mode==='one'?' selected':'')+'>單一付款人付給單一收款人</option><option value="payall"'+(inst.mode==='payall'?' selected':'')+'>付款人付給其餘三家</option><option value="burn"'+(inst.mode==='burn'?' selected':'')+'>付款人扣分(不加給他家)</option></select></label>';
  h+='<label>倍數<select data-chg="instMult">'+[1,2,3,4,5].map(n=>'<option value="'+n+'"'+(inst.mult===n?' selected':'')+'>×'+n+'</option>').join('')+'</select></label>';
  if(inst.mode==='all'||inst.mode==='one') h+='<label>收款人<select data-chg="instPayee">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(inst.payee===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>';
  if(inst.mode!=='all') h+='<label>付款人<select data-chg="instPayer">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(inst.payer===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>';
  h+='</div>'+(I.plusBase?'<p class="hint">此項目另加底 $'+baseAmt+'。</p>':'')+'<div class="btnrow"><button data-act="instSave">記錄:'+esc(I.name)+(inst.mult>1?' ×'+inst.mult:'')+'</button></div>';
  return h;
}
function viewHistory(){
  if(!S.history.length) return '<p class="hint">目前沒有紀錄</p>';
  let h='<div class="btnrow"><button data-act="undoRec">撤銷最後一局</button></div>';
  S.history.slice().reverse().forEach((r,ri)=>{
    const no=S.history.length-ri; const t=new Date(r.time);
    h+='<div class="card rec"><div class="rh"><b>#'+no+'</b> '+(r.kind==='win'?'食糊':r.kind==='draw'?'流局':r.kind==='settle'?esc(r.name||'結清'):'籌碼:'+esc(r.name))+' <small>'+WIND[r.wind]+'風圈 · 莊 '+nm(r.dealer)+' 連莊'+r.streak+' · '+t.getHours()+':'+String(t.getMinutes()).padStart(2,'0')+'</small></div>';
    if(r.kind==='win') r.winners.forEach(w=>{ h+='<div class="rw">'+nm(w.p)+(w.self?' 自摸':' 食 '+nm(w.disc)+' 出銃')+(w.bao!=null&&w.bao!==w.p?'(由 '+nm(w.bao)+' 包)':'')+' — <b>'+w.total+'番</b><div class="hint">'+w.fans.map(f=>esc(f.name)+(f.n>1?'×'+f.n:'')+' '+f.total).join(' · ')+'</div></div>'; });
    (r.events||[]).forEach(e=>{ h+='<div class="hint">• '+evText(e)+'</div>'; });
    h+='<div class="prev">'+S.seat.map(p=>'<div><small>'+nm(p)+'</small><b class="'+(r.deltas[p]>=0?'pos':'neg')+'">'+money(r.deltas[p])+'</b></div>').join('')+'</div></div>';
  });
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
  h+='<div class="btnrow"><button class="primary" data-act="copySum">複製結算文字</button>'+((!isHK()&&S.ledger.length)?'<button data-act="payAll">結清全部拉數</button>':'')+'</div>';
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
  h+='<label>花牌規則(144張)<select data-chg="hkb" data-k="flowers"><option value="0"'+(!h0.flowers?' selected':'')+'>關(計門前清)</option><option value="1"'+(h0.flowers?' selected':'')+'>開(計花、無花)</option></select></label>';
  h+='<label>食糊後連莊<select data-chg="hkb" data-k="renzhuang"><option value="1"'+(h0.renzhuang?' selected':'')+'>莊家連莊</option><option value="0"'+(!h0.renzhuang?' selected':'')+'>輪莊</option></select></label></div>';
  h+='<p class="hint">總例:完全複合原則(必然並存的番種全部相加)、高點法;流局莊家輪替。不足起糊番數而食糊,當詐糊:扣例牌(封頂)分數,其他家不加分,本局重來。</p>';
  h+='<h3>番數對應分數(出銃)</h3><div class="fanTable">';
  for(let f=1;f<=pr.cap;f++) h+='<div class="frow"><span>'+f+' 番'+(f===pr.cap?'(封頂)':'')+'</span><input type="number" data-chg="hkrow" data-f="'+f+'" value="'+hkRon(f)+'"><i></i></div>';
  h+='</div><div class="btnrow"><button data-act="hkResetTable">還原分數表</button></div>';
  return h;
}
function viewSettings(){
  const c=S.cfg;
  let h='<h3>版本資訊</h3><div class="card"><div>目前版本:<b>'+APP_VERSION+'</b></div><div>更新時間:<b>'+APP_UPDATED+'</b></div>'+(upd?'<div class="pos">最新版本:<b>'+esc(upd.version)+'</b>'+(upd.updated?'('+esc(upd.updated)+')':'')+'</div>':'')+'<div class="dev">開發者:Instagram <a href="https://www.instagram.com/'+DEV_IG+'/" target="_blank" rel="noopener">@'+DEV_IG+'</a></div><div class="btnrow">'+(upd?'<button class="primary" data-act="upgrade">立即升級</button>':'')+'<button data-act="checkUpd">'+(checking?'檢查中…':'檢查更新')+'</button></div><div class="hint">App 開啟時會自動檢查。升級只會更新程式,不會清除你的紀錄。</div></div>';
  h+='<h3>玩法</h3><div class="card"><div>目前玩法:<b>'+(isHK()?'廣東牌(13張)':'港式台牌(16張)')+'</b></div><div class="btnrow"><button data-act="toChooser">更換玩法</button></div></div>';
  if(isHK()) h+=hkSettings();
  else {
    h+='<h3>番表預設</h3><div class="presetbtns">'
      +'<button class="'+(c.preset===1?'on':'')+'" data-act="preset" data-v="1">預設 #1:陶源麻雀王大賽番數表</button>'
      +'<button class="'+(c.preset===2?'on':'')+'" data-act="preset" data-v="2">預設 #2:香港麻雀協會總例<small>《港式十六張新章麻雀總例》2025-07-28 修訂版番種詳述</small></button>'
      +'<button class="'+(c.preset===3?'on':'')+'" data-act="preset" data-v="3">預設 #3:台牌百搭番數表</button></div>';
    if(!window.MJ2) h+='<div class="warn">未能載入預設 #2 的番表檔(engine2.js)。請確認已上傳該檔案。</div>';
    if(!window.MJ3) h+='<div class="warn">未能載入預設 #3 的番表(engine.js 版本過舊)。請更新 engine.js。</div>';
    h+='<p class="hint">三套預設各自記住你修改過的番數和即時籌碼金額,切換不會互相影響。切換時,本局正在輸入的手動番種會被清除。</p>';
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
    h+='<label>底 = 番值 ×<input type="number" step="any" data-chg="cfg" data-k="baseMult" value="'+c.baseMult+'"></label>';
    h+='<label>最低食糊番數(胡牌)<input type="number" data-chg="cfg" data-k="minFan" value="'+c.minFan+'"></label>';
    h+='<label>流局後<select data-chg="drawKeeps"><option value="1"'+(c.drawKeeps?' selected':'')+'>莊家繼續做莊</option><option value="0"'+(!c.drawKeeps?' selected':'')+'>輪莊</option></select></label></div>';
    h+='<p class="hint">目前底 $'+(c.fanValue*c.baseMult)+'。每家支付 = 底 + 番數 × 每番金額。同一家被同一人拉滿 3、6、9… 口時,會詢問是否斬拉(投降)。</p>';
  }
  h+='<h3>備份</h3><div class="btnrow"><button data-act="exportCopy">複製備份</button><button data-act="exportFile">下載備份檔</button><button data-act="importPaste">貼上匯入</button><button class="danger" data-act="resetAll">清除全部資料</button></div>';
  h+='<h3>番數表(可修改)</h3><p class="hint">目前:'+gameName()+'。灰色底表示無法自動偵測,只能手動加番。'+(isHK()?'':'右邊欄為暗(門清)時的番數。')+'</p><div class="fanTable">';
  const R=RL();
  fanList().forEach(f=>{ h+='<div class="frow'+(f.manual?' man':'')+'"><span>'+f.name+'</span><input type="number" data-chg="rule" data-id="'+f.id+'" data-f="fan" value="'+R[f.id].fan+'">'+(f.fanC!=null?'<input type="number" data-chg="rule" data-id="'+f.id+'" data-f="fanC" value="'+R[f.id].fanC+'">':'<i></i>')+'</div>'; });
  h+='</div><div class="btnrow"><button data-act="resetRules">還原此玩法的番數</button></div>';
  return h;
}
function render(){
  const y=window.scrollY;
  derive();
  applyTheme();
  const el=document.getElementById('app');
  if(!S.game||tab==='chooser'){ el.innerHTML='<div class="body">'+updBanner()+viewChooser()+'</div>'; window.scrollTo(0,0); return; }
  const views={table:viewTable,calc:viewCalc,history:viewHistory,settle:viewSettle,settings:viewSettings};
  const tabs=[['table','座位'],['calc','算番'],['history','歷史'],['settle','結算'],['settings','設定']];
  el.innerHTML='<div class="body">'+updBanner()+a2hsBanner()+views[tab]()+'</div><nav>'+tabs.map(t=>'<button class="'+(tab===t[0]?'on':'')+'" data-act="tab" data-v="'+t[0]+'">'+t[1]+'</button>').join('')+'</nav>';
  window.scrollTo(0,y);
  scheduleWarn();
}
function advance(keep,fromDraw){
  if(keep){ if(!fromDraw) S.streak++; }
  else { S.streak=0; S.dealerSeat=(S.dealerSeat+1)%4; if(S.dealerSeat===0) S.wind=(S.wind+1)%4; }
}
function before(){ return {dealerSeat:S.dealerSeat,streak:S.streak,wind:S.wind}; }
function pushRec(o){ S.history.push(Object.assign({id:Date.now(),time:Date.now(),dealer:dealerPid(),streak:S.streak,wind:S.wind,before:before(),ledgerBefore:copyL(S.ledger)},o)); }
function collectCurrent(){
  derive();
  const res=analyze(); const items=curItems(res); const total=items.reduce((a,x)=>a+x.total,0);
  return {p:E.winner,self:E.self,disc:E.disc,total,fans:items,qiang:!!E.flags.qiangkong&&!E.self,bao:baoVisible()?E.bao:null};
}
function validateCur(){
  if(!E.self){ if(E.disc==null){ toast('請選擇出銃者(放槍)'); return false; } if(E.disc===E.winner){ toast('出銃者不能是食糊者'); return false; } }
  return true;
}
function resetGameData(){
  try{ localStorage.setItem(PREV_KEY,JSON.stringify(S)); }catch(e){}
  S.history=[]; S.ledger=[]; S.streak=0; S.wind=0; S.dealerSeat=0; E=newEntry(); pending=[];
}
function act(a,d){
  derive();
  switch(a){
    case 'tab': tab=d.v; break;
    case 'toChooser': tab='chooser'; break;
    case 'game': {
      const v=d.v;
      if(v==='hk'&&!window.MJHK){ toast('找不到 engine_hk.js,請先上傳'); return; }
      if(S.game&&S.game!==v&&S.history.length){
        if(!confirm('更換玩法會開始新牌局,目前的紀錄會先保存為「上一場」(可在座位頁還原)。要繼續嗎?')) return;
        resetGameData();
      }
      S.game=v; pickM(); E=newEntry(); pending=[];
      const l0=instList()[0]; inst.id=l0.id; inst.mode=l0.mode; inst.mult=1;
      tab='table'; toast('已選擇:'+(v==='hk'?'廣東牌':'港式台牌')); break; }
    case 'hkPreset': S.cfg.hk.preset=d.v; break;
    case 'hkResetTable': S.cfg.hk.over={}; break;
    case 'upgrade': doUpgrade(); return;
    case 'dismissUpd': updDismissed=true; break;
    case 'checkUpd': checkUpdate(true); return;
    case 'preset': {
      const v=+d.v;
      if(v===2&&!window.MJ2){ toast('找不到 engine2.js,請先上傳'); return; }
      if(v===3&&!window.MJ3){ toast('engine.js 版本過舊,請先更新'); return; }
      S.cfg.preset=v; pickM(); E.excl={}; E.extra=[]; E.flags={};
      const l0=instList()[0]; inst.id=l0.id; inst.mode=l0.mode; inst.mult=1;
      toast('已切換為'+PRESET_NAME[v]); break; }
    case 'a2hsLater': a2hsHidden=true; break;
    case 'a2hsNever': a2hsHidden=true; try{ localStorage.setItem(A2HS_KEY,'1'); }catch(e){} toast('之後不再自動提示,可在設定頁查看教學'); break;
    case 'a2hsReset': try{ localStorage.removeItem(A2HS_KEY); }catch(e){} a2hsHidden=false; toast('下次開啟會再次提示'); break;
    case 'scheme': S.cfg.theme=Object.assign({},DEFAULT_THEME,SCHEMES[+d.i][1]); break;
    case 'themeReset': S.cfg.theme=Object.assign({},DEFAULT_THEME); break;
    case 'newGame': {
      if(!confirm('開始全新局?\n\n目前的紀錄、未結算的拉、連莊與風圈都會清空(玩家名稱、座位與設定會保留)。\n系統會先保存上一場,可在座位頁還原。')) return;
      resetGameData(); tab='table'; toast('已開始全新局'); break; }
    case 'restoreGame': {
      let p=null; try{ p=JSON.parse(localStorage.getItem(PREV_KEY)); }catch(e){}
      if(!p||!p.names){ toast('沒有可還原的牌局'); return; }
      if(!confirm('還原上一場牌局?目前的紀錄會被取代。')) return;
      try{ localStorage.setItem(PREV_KEY,JSON.stringify(S)); }catch(e){}
      S=norm(p); pickM(); E=newEntry(); pending=[]; toast('已還原'); break; }
    case 'rename': { const p=+d.p; const n=prompt('玩家名稱',S.names[p]); if(n&&n.trim()) S.names[p]=n.trim().slice(0,10); break; }
    case 'streak': S.streak=Math.max(0,S.streak+(+d.d)); break;
    case 'draw': {
      if(!confirm('記錄本局為流局?')) return;
      pushRec({kind:'draw',deltas:[0,0,0,0],events:[]});
      if(isHK()) advance(false); else advance(S.cfg.drawKeeps,true);
      toast('已記錄流局'); break; }
    case 'winner': E.winner=+d.p; E.bao=null; break;
    case 'disc': E.disc=+d.p; break;
    case 'self': E.self=d.v==='1'; if(!E.self) E.bao=null; break;
    case 'flower': E.flowers[+d.i]=!E.flowers[+d.i]; break;
    case 'step': E.step=+d.v; break;
    case 'tile': {
      const t=+d.t;
      if(E.all.length>=maxAll()){ toast('牌數已滿('+maxAll()+' 張)'); return; }
      if(tileCount(t)>=4){ toast('這張牌已有4張'); return; }
      touchEdit();
      E.all.push(t); E.excl={};
      if(E.step===1&&E.all.length===baseAll()){ E.step=2; toast('已選齊 '+baseAll()+' 張,請點選明牌(沒有明牌按「→③」;有槓可按「＋補牌」)'); }
      break; }
    case 'poolTap': {
      const t=+d.t, ac=allCounts();
      touchEdit();
      if(E.step===1){ const i=E.all.indexOf(t); if(i>=0) E.all.splice(i,1); E.excl={}; }
      else if(E.step===2){
        if(E.marks[t]<ac[t]) E.marks[t]++; else E.marks[t]=0;
        E.excl={};
      } else {
        if(E.win===t){ E.win=null; }
        else if(ac[t]-E.marks[t]<1){ toast('這張牌已標為明牌,不能當食糊牌;請先在②取消標記'); return; }
        else E.win=t;
        E.excl={};
      }
      break; }
    case 'kongToggle': { const t=+d.t; touchEdit(); E.kongOpen[t]=(E.kongOpen[t]===false); break; }
    case 'clearWin': E.win=null; E.step=3; E.excl={}; break;
    case 'undoTile': {
      touchEdit();
      for(let i=E.all.length-1;i>=0;i--){ const t=E.all[i]; if(E.marks[t]<tileCount(t)){ E.all.splice(i,1); break; } }
      if(!E.all.length) E.step=1;
      E.excl={}; break; }
    case 'clearHand': touchEdit(); E.all=[]; E.marks=Array(34).fill(0); E.kongOpen={}; E.melds=[]; E.win=null; E.step=1; E.excl={}; break;
    case 'rmMeld': {
      touchEdit();
      const m=E.melds[+d.i];
      if(m){
        if(m.t==='chow'){ [0,1,2].forEach(k=>{ if(E.marks[m.tile+k]>0) E.marks[m.tile+k]--; }); }
        else E.marks[m.tile]=Math.max(0,E.marks[m.tile]-(m.t==='kong'?4:3));
      }
      E.step=2; E.excl={}; break; }
    case 'unexcl': delete E.excl[d.id]; break;
    case 'extraN': { const x=E.extra[+d.i]; x.n+=+d.d; if(x.n<1) E.extra.splice(+d.i,1); break; }
    case 'rmExtra': E.extra.splice(+d.i,1); break;
    case 'clearEntry': E=newEntry(); pending=[]; break;
    case 'addWinner': {
      if(E.self){ toast('雙響/三響須為出銃'); return; }
      if(!validateCur()) return;
      const c=collectCurrent(); pending.push(c); const disc=E.disc; E=newEntry(); E.self=false; E.disc=disc;
      E.winner=S.seat.find(p=>p!==disc&&!pending.some(w=>w.p===p)); toast('已加入,請輸入下一位食糊者'); break; }
    case 'confirm': {
      if(!validateCur()) return;
      const cur=collectCurrent();
      const minF=isHK()?S.cfg.hk.minFan:S.cfg.minFan;
      const dealer=dealerPid();
      if(isHK()&&minF>0&&cur.total<minF){
        const pen=hkRon(99);
        if(!confirm('只有 '+cur.total+' 番,不足 '+minF+' 番起糊,當詐糊。\n\n'+S.names[cur.p]+' 扣 '+pen+' 分(例牌分數),其他三家不加分,本局重來(莊家不變)。\n確定記錄嗎?')) return;
        const del=[0,0,0,0]; del[cur.p]-=pen;
        pushRec({kind:'settle',name:'詐糊(不足'+minF+'番):'+S.names[cur.p],deltas:del,events:[]});
        E=newEntry(); pending=[]; tab='history'; toast('已記錄詐糊'); break;
      }
      if(!isHK()&&minF>0&&cur.total<minF&&!confirm('只有 '+cur.total+' 番,低於起糊 '+minF+' 番,仍要記錄?')) return;
      if(cur.total===0&&!confirm('合計 0 番,仍要記錄?')) return;
      const ws=pending.concat([cur]);
      if(isHK()){
        const deltas=settleHK(ws);
        S.history.push({id:Date.now(),time:Date.now(),kind:'win',dealer,streak:S.streak,wind:S.wind,winners:ws.map(w=>({p:w.p,self:w.self,disc:w.disc,total:w.total,fans:w.fans,bao:w.bao})),deltas,events:[],before:before(),ledgerBefore:copyL(S.ledger)});
        advance(ws.some(w=>w.p===dealer)&&S.cfg.hk.renzhuang,false);
        E=newEntry(); pending=[]; tab='history'; toast('已記錄'); break;
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
      S.history.push({id:Date.now(),time:Date.now(),kind:'win',dealer,streak:S.streak,wind:S.wind,winners:ws.map(w=>({p:w.p,self:w.self,disc:w.disc,total:w.total,fans:w.fans})),deltas:cash,events:ev,before:before(),ledgerBefore:lb});
      S.ledger=copyL(ledger);
      advance(ws.some(w=>w.p===dealer),false);
      E=newEntry(); pending=[]; tab='history'; toast('已記錄'); break; }
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
      let amt=instAmt(I)+(I.plusBase?S.cfg.fanValue*S.cfg.baseMult:0);
      amt=amt*(inst.mult||1);
      const deltas=instDeltas({amt:amt,mode:inst.mode,payee:inst.payee,payer:inst.payer},1);
      pushRec({kind:'instant',name:I.name+(inst.mult>1?' ×'+inst.mult:''),deltas,events:[]});
      toast('已記錄 '+I.name); break; }
    case 'undoRec': {
      if(!S.history.length) return; if(!confirm('撤銷最後一局?')) return;
      const r=S.history.pop(); if(r.before){ S.dealerSeat=r.before.dealerSeat; S.streak=r.before.streak; S.wind=r.before.wind; }
      S.ledger=copyL(r.ledgerBefore||[]); break; }
    case 'copySum': copy(summaryText()); break;
    case 'exportCopy': copy(JSON.stringify(S)); break;
    case 'exportFile': {
      const blob=new Blob([JSON.stringify(S)],{type:'application/json'}); const u=URL.createObjectURL(blob);
      const a2=document.createElement('a'); a2.href=u; a2.download='mahjong-backup-'+new Date().toISOString().slice(0,10)+'.json'; document.body.appendChild(a2); a2.click(); a2.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000); break; }
    case 'importPaste': {
      const t=prompt('貼上備份 JSON(會覆蓋現有資料)'); if(!t) return;
      try{ const j=JSON.parse(t); if(!j.names||!j.history) throw 0; S=norm(j); pickM(); toast('匯入成功'); }catch(e){ toast('格式錯誤'); return; } break; }
    case 'resetAll': if(confirm('確定清除全部玩家、紀錄與設定?此操作無法還原')){ S=defState(); pickM(); E=newEntry(); pending=[]; tab='table'; } else return; break;
    case 'resetRules': S.cfg.overs[pkey()]={}; break;
  }
  save(); render();
}
function copy(t){
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(()=>toast('已複製'),()=>fallbackCopy(t)); else fallbackCopy(t);
}
function fallbackCopy(t){ const x=document.createElement('textarea'); x.value=t; document.body.appendChild(x); x.select(); try{document.execCommand('copy'); toast('已複製');}catch(e){ prompt('請手動複製',t); } x.remove(); }
function chg(k,el){
  const d=el.dataset, v=el.type==='checkbox'?el.checked:el.value;
  switch(k){
    case 'seat': { const s=+d.s, p=+v, old=S.seat[s], ps=S.seat.indexOf(p); S.seat[ps]=old; S.seat[s]=p; break; }
    case 'dealerSeat': S.dealerSeat=+v; break;
    case 'wind': S.wind=+v; break;
    case 'theme': S.cfg.theme[d.k]=v; break;
    case 'flag': E.flags[d.k]=v; break;
    case 'excl': E.excl[d.id]=!v; break;
    case 'bao': E.bao=v===''?null:+v; break;
    case 'addId': if(v){ const f=E.extra.find(x=>x.id===v); if(f) f.n++; else E.extra.push({id:v,n:1}); } break;
    case 'instId': { const I=instList().find(x=>x.id===v); inst.id=v; if(I) inst.mode=I.mode; inst.mult=1; break; }
    case 'instMode': inst.mode=v; break;
    case 'instMult': inst.mult=+v; break;
    case 'instAmt': { const I=instList().find(x=>x.id===inst.id); const n=parseFloat(v); (S.cfg.instAmts[pkey()]=S.cfg.instAmts[pkey()]||{})[I.id]=isNaN(n)?0:n; break; }
    case 'instPayee': inst.payee=+v; break;
    case 'instPayer': inst.payer=+v; break;
    case 'cfg': { const n=parseFloat(v); S.cfg[d.k]=isNaN(n)?0:n; break; }
    case 'drawKeeps': S.cfg.drawKeeps=v==='1'; break;
    case 'hkn': { const n=parseFloat(v); S.cfg.hk[d.k]=isNaN(n)?0:n; break; }
    case 'hkb': S.cfg.hk[d.k]=v==='1'; break;
    case 'hkrow': { const n=parseFloat(v); if(!isNaN(n)) S.cfg.hk.over[d.f]=n; break; }
    case 'rule': { const o=OV(); const q=o[d.id]=o[d.id]||{}; q[d.f]=parseFloat(v); break; }
  }
  save(); render();
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
document.addEventListener('change',e=>{ const el=e.target.closest('[data-chg]'); if(el) chg(el.dataset.chg,el); });
['gesturestart','gesturechange','gestureend','dblclick'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault()));
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible') checkUpdate(false); });
if(navigator.storage&&navigator.storage.persist) navigator.storage.persist();
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
render();
setTimeout(()=>checkUpdate(false),1200);
})();
