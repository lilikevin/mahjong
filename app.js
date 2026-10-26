(function(){
'use strict';
const APP_VERSION='v1.2 beta';
const APP_UPDATED='2026-10-26 22:45 (香港時間)';
const DEV_IG='kevinli999';
let M=window.MJ;
const KEY='mj_hk_tw_v1';
const PREV_KEY='mj_hk_tw_prev_game';
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
const HUAHU=[['huahu7','花糊(七搶一)',30],['huahu8','花糊(自摸兩台花)',40]];
const OPT_INST=[
 {id:'xue',name:'雪(罰)',mode:'payall'},{id:'fanxue',name:'反雪(罰)',mode:'payall'},{id:'bing',name:'冰(罰)',mode:'payall'},{id:'fanbing',name:'反冰(罰)',mode:'payall'},
 {id:'weidou',name:'圍骰(莊家收其餘三家)',mode:'all'},{id:'wenzhuang',name:'問莊圍三',mode:'all'},{id:'wangkai',name:'忘開暗槓(罰,付其餘三家)',mode:'payall'},
 {id:'zhuifan',name:'追番子(付其餘三家)',mode:'payall'},{id:'zhuikai',name:'追開章(付其餘三家)',mode:'payall'}
];
const defHK=()=>({preset:'10-128',minFan:3,bao12:true,baoSan:true,flowers:false,renzhuang:true,ratio:0.5,over:{}});
const defState=()=>({game:null,names:['玩家1','玩家2','玩家3','玩家4'],seat:[0,1,2,3],dealerSeat:0,streak:0,wind:0,history:[],ledger:[],cfg:{fanValue:1,baseMult:5,minFan:0,drawKeeps:true,preset:1,wildLimit:4,wildPreset:3,overs:{1:{},2:{},3:{},hk:{}},instAmts:{1:{},2:{},3:{},hk:{}},hk:defHK(),theme:Object.assign({},DEFAULT_THEME)}});
function norm(j){
  const d=defState(); const s=Object.assign(d,j,{cfg:Object.assign(d.cfg,j.cfg||{}),ledger:j.ledger||[]});
  const th=Object.assign({},DEFAULT_THEME,(j.cfg&&j.cfg.theme)||{});
  if(j.cfg&&j.cfg.bg&&!(j.cfg.theme&&j.cfg.theme.bg)) th.bg=j.cfg.bg;
  s.cfg.theme=th;
  const c=s.cfg;
  if(!c.overs||typeof c.overs!=='object') c.overs={1:(j.cfg&&j.cfg.over)||{},2:{},3:{}};
  ['1','2','3','hk','wild1','wild2','wild3'].forEach(k=>{ if(!c.overs[k]) c.overs[k]={}; });
  if(!c.instAmts||typeof c.instAmts!=='object') c.instAmts={};
  ['1','2','3','hk','wild1','wild2','wild3'].forEach(k=>{ if(!c.instAmts[k]) c.instAmts[k]={}; });
  c.hk=Object.assign(defHK(),c.hk||{}); if(!c.hk.over) c.hk.over={};
  if(!HK_PRESETS[c.hk.preset]) c.hk.preset='10-128';
  if([1,2,3].indexOf(c.preset)<0) c.preset=1;
  c.wildLimit=[4,5,6,7,8].includes(+c.wildLimit)?+c.wildLimit:4;
  c.wildPreset=[1,2,3].includes(+c.wildPreset)?+c.wildPreset:3;
  if(s.game!=='tw'&&s.game!=='hk'&&s.game!=='wild') s.game=(s.history&&s.history.length)?'tw':null;
  return s;
}
function load(){
  try{ const j=JSON.parse(localStorage.getItem(KEY)); if(j&&j.names) return norm(j); }catch(e){}
  return defState();
}
let S=load();
const isHK=()=>S.game==='hk';
const isWild=()=>S.game==='wild';
const SETS=()=>isHK()?4:5;
function pickM(){
  if(S.game==='hk'&&window.MJHK){ M=window.MJHK; return; }
  const p=isWild()?S.cfg.wildPreset:S.cfg.preset;
  M=(p===2&&window.MJ2)?window.MJ2:(p===3&&window.MJ3)?window.MJ3:window.MJ;
}
pickM();
const save=()=>{ try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} };
const newEntry=()=>({winner:null,self:true,disc:null,all:[],wildGroups:[],wildSelect:[],marks:Array(34).fill(0),kongOpen:{},melds:[],hand:[],win:null,partBad:false,mode:'pick',flowers:Array(8).fill(false),flags:{},excl:{},extra:[],bao:null});
let E=newEntry(), pending=[], tab='table', wildPick=false;
let inst={id:null,mode:'one',payee:null,payer:null,mult:1};
let upd=null, updDismissed=false, checking=false, a2hsHidden=false;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const seatOf=p=>S.seat.indexOf(p);
const dealerPid=()=>S.seat[S.dealerSeat];
const windIdx=p=>(seatOf(p)-S.dealerSeat+4)%4;
const windOf=p=>WIND[windIdx(p)];
const nm=p=>esc(S.names[p]);
const pkey=()=>isHK()?'hk':isWild()?'wild'+S.cfg.wildPreset:String(S.cfg.preset);
const OV=()=>S.cfg.overs[pkey()]||(S.cfg.overs[pkey()]={});
function phList(){ return isHK()?[]:PH_FANS.filter(p=>!M.FANS.some(f=>f.id===p.id)); }
function huahuList(){ return isHK()?[]:HUAHU.map(h=>({id:h[0],name:h[1]})); }
function huahuDef(id){ const d=HUAHU.find(x=>x[0]===id); return ((isWild()?S.cfg.wildPreset:S.cfg.preset)===2&&d)?d[2]:0; }
function fanList(){
  return M.FANS.concat(phList().map(p=>({id:p.id,name:p.name,fan:0,fanC:null,manual:true})))
    .concat(huahuList().map(h=>({id:h.id,name:h.name,fan:huahuDef(h.id),fanC:null,manual:true})));
}
function RL(){
  const r=M.buildRules(OV());
  phList().forEach(p=>{ const o=OV()[p.id]; r[p.id]={id:p.id,name:p.name,fan:(o&&o.fan!=null&&!isNaN(o.fan))?+o.fan:0,fanC:null,manual:true}; });
  huahuList().forEach(h=>{ const o=OV()[h.id]; r[h.id]={id:h.id,name:h.name,fan:(o&&o.fan!=null&&!isNaN(o.fan))?+o.fan:huahuDef(h.id),fanC:null,manual:true}; });
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
.zone.tap{cursor:pointer;min-height:70px}
.modebar{min-height:58px;display:flex;align-items:center;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:8px 10px;font-size:13px;line-height:1.45;color:#eef5ef;margin:6px 0}
.poolbox{min-height:60px}
.askcard{margin:10px 0}
.askcard .seg button{padding:14px 4px;font-size:16px;font-weight:600}
`;
const DYN_CSS=`
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
  if(t===34){o=o||{};const tag=o.tag||'span';return '<'+tag+' '+(o.attrs||'')+' class="mt '+(o.cls||'')+'" style="color:#8b2670"><b>百</b><i>搭</i></'+tag+'>';}
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
    await Promise.all(['./','index.html','app.js','engine.js','engine2.js','engine_hk.js','engine_wild.js','wild-worker.js','manifest.json','sw.js','version.json','icon-192.png','icon-512.png'].map(f=>fetch(f,{cache:'reload'}).catch(()=>{})));
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
  if(isWild()){E.melds=E.wildGroups;E.hand=E.all.slice();return;}
  const ac=allCounts();
  for(let t=0;t<34;t++){ if(E.marks[t]>ac[t]) E.marks[t]=ac[t]; if(E.marks[t]<0) E.marks[t]=0; }
  if(E.win!=null){ const unm=ac[E.win]-E.marks[E.win]; if(unm<1) E.win=null; }
  E.melds=bestMelds();
  const mc=meldCountsOf(E.melds), hand=[]; let taken=false;
  for(let t=0;t<34;t++){ const n=ac[t]-mc[t]; for(let i=0;i<n;i++){ if(!taken&&E.win!=null&&t===E.win){ taken=true; } else hand.push(t); } }
  E.hand=hand;
}
function ctxExtra(){ const x={useFlowers:isHK()?hkFlowerMode():true}; if(E.winner!=null){ x.roundWind=S.wind; x.seatWind=windIdx(E.winner); } return x; }
function combos(arr,k){ const res=[]; (function r(i,cur){ if(cur.length===k){ res.push(cur.slice()); return; } for(let j=i;j<arr.length;j++){ cur.push(arr[j]); r(j+1,cur); cur.pop(); } })(0,[]); return res; }
/* 廣東牌:只需選齊全部牌。槓由牌數推算;食糊牌自動取最高番;門前清由牌堆下方的問題回答 */
function analyzeHK(){
  const N=E.all.length;
  if(!N) return null;
  const k=N-14;
  if(k<0) return {error:'牌數不足:現有 '+N+' 張,廣東牌需要 14 張(有槓每槓多 1 張)'};
  if(k>4) return {error:'牌數過多:現有 '+N+' 張'};
  const ac=allCounts(); const quad=[]; for(let t=0;t<34;t++) if(ac[t]===4) quad.push(t);
  if(k>quad.length) return {error:'現有 '+N+' 張,即有 '+k+' 個槓,但只有 '+quad.length+' 款牌有 4 張'};
  const R=RL(); let best=null, cnt=0;
  combos(quad,k).forEach(cb=>{
    const melds=cb.map(t=>({t:'kong',tile:t,open:true}));
    const c=ac.slice(); cb.forEach(t=>{ c[t]-=4; });
    const hand=[]; for(let t=0;t<34;t++) for(let i=0;i<c[t];i++) hand.push(t);
    const seen={};
    hand.forEach(w=>{
      if(seen[w]) return; seen[w]=1;
      let r=null;
      try{ r=M.analyze(Object.assign({hand:hand,melds:melds,win:w,flowers:E.flowers,selfDraw:E.self,flags:E.flags,concealed:!!E.flags.menqing},ctxExtra()),OV()); }catch(e){}
      cnt++;
      if(r&&!r.error&&r.items){ let tot=0; r.items.forEach(x=>{ tot+=M.valueOf(R,x); }); if(!best||tot>best.total) best={items:r.items,total:tot,count:0,waits:r.waits}; }
    });
  });
  if(!best) return {error:'這副牌組不成食糊牌形'};
  best.count=cnt; return best;
}
function analyze(){
  if(isWild()) return wildResult();
  if(isHK()) return analyzeHK();
  if(E.win==null||E.hand.length!==need()-1) return null;
  return M.analyze(Object.assign({hand:E.hand.concat([E.win]),melds:E.melds,win:E.win,flowers:E.flowers,selfDraw:E.self,flags:E.flags},ctxExtra()),OV());
}
function curItems(res){
  const r=RL(); let it;
  if(res&&res.items) it=res.items.filter(x=>!E.excl[x.id]);
  else it=M.basic(Object.assign({flowers:E.flowers,selfDraw:E.self,flags:E.flags,concealed:!!E.flags.menqing},ctxExtra())).filter(x=>!E.excl[x.id]);
  if(!isHK()) HUAHU.forEach(h=>{ if(E.flags[h[0]]&&!E.excl[h[0]]) it.push({id:h[0],n:1,closed:false}); });
  it=it.concat(E.extra.map(x=>({id:x.id,n:x.n,closed:false})));
  it=hkFlowerAdjust(it,r);
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
function gameLabel(v){ return v==='wild'?'港式台牌（通用百搭）':v==='hk'?'廣東牌':'港式台牌（無百搭）'; }
function gameName(){ if(isWild()) return '港式台牌（通用百搭）· 加'+S.cfg.wildLimit+'張 · '+PRESET_NAME[S.cfg.wildPreset]; return isHK()?('廣東牌 · '+HK_PRESETS[S.cfg.hk.preset].name):('港式台牌（無百搭）· '+PRESET_NAME[S.cfg.preset]); }
function viewChooser(){
  let h='<div class="chooser"><h2>麻雀計番</h2><div class="sub">請選擇玩法</div>';
  h+='<button data-act="game" data-v="tw">港式台牌（無百搭）<small>16張；五組面子加一對眼，有拉、踢半、斬拉，三套番表預設</small></button>';
  h+='<button data-act="game" data-v="wild">港式台牌（通用百搭）<small>16張；開局選加4至8張通用百搭，自動搜尋最高番</small></button>';
  if(wildPick) h+='<div class="card askcard"><div class="zl" style="margin-top:0">本場牌組加入幾張通用百搭？</div><div class="seg">'+[4,5,6,7,8].map(n=>'<button style="text-align:center;padding:14px 4px;margin:0" class="'+(S.cfg.wildLimit===n?'on':'')+'" data-act="game" data-v="wild" data-n="'+n+'">'+n+'張</button>').join('')+'</div><div class="hint">這是整副牌加入的百搭數量，不是你手持的張數。</div></div>';
  h+='<button data-act="game" data-v="hk">廣東牌（13張）<small>四組面子加一對眼，三番起糊，10番封頂，二五雞・半辣上等計分表；可輸入花牌自動判斷</small></button>';
  if(!window.MJHK) h+='<div class="warn">未能載入廣東牌檔案(engine_hk.js),請確認已上傳。</div>';
  if(S.game) h+='<div class="btnrow"><button data-act="tab" data-v="table" style="text-align:center;font-size:15px">返回目前牌局(現為'+gameLabel(S.game)+')</button></div>';
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
function baoVisible(){
  if(!isHK()||!E.self) return false;
  const h=S.cfg.hk;
  return !!(h.bao12||h.baoSan);
}
function inputSection(){
  if(isWild()) return inputWild();
  if(isHK()) return inputSectionHK();
  const md=E.mode;
  const tip=md==='pick'?'① 選牌:點上方牌盤加牌,點牌堆裡的牌可刪除。選齊後,點下面「明牌」框的空白處。'
    :(md==='meld'?'② 選明牌:點牌堆裡已上(吃)、碰、槓出來的牌(再點可取消)。沒有明牌就直接點「食糊牌」框的空白處。'
    :'③ 選食糊牌:點牌堆裡最後食糊(胡牌)的那一張,再點一次可取消。');
  let h='<h3>輸入牌</h3>';
  h+='<div class="modebar">'+tip+'</div>';
  h+=palette();
  h+='<div class="zl">牌堆 <small>共 '+E.all.length+' 張</small></div>';
  let markedWin=false;
  const used=Array(34).fill(0);
  h+='<div class="zone poolbox"><div class="tiles">'+(E.all.length?E.all.slice().sort((a,b)=>a-b).map(t=>{
    const idx=used[t]++; const isMk=idx<E.marks[t];
    let cls=isMk?'mk2':'';
    if(!isMk&&E.win===t&&!markedWin){ markedWin=true; cls='mark'; }
    return mt(t,{tag:'button',cls:cls,attrs:'data-act="poolTap" data-t="'+t+'"'});
  }).join(''):'<span class="hint">點上方牌盤選牌</span>')+'</div></div>';
  h+='<div class="btnrow"><button data-act="undoTile">退一張</button><button data-act="clearHand">全部清空</button></div>';
  h+='<h3>牌型確認</h3><div class="card entered">';
  h+='<div class="zl">明牌 <small>'+E.melds.length+' 組(點空白處選明牌,點牌可取消)</small></div>';
  h+='<div class="zone tap'+(md==='meld'?' active':'')+'" data-act="mode" data-v="meld">'+(E.melds.length?E.melds.map((m,i)=>meldGroup(m,i)).join(''):'<span class="hint">點此選明牌(沒有明牌可略過)</span>')+'</div>';
  h+='<div class="zl">食糊牌(胡牌) <small>'+(E.win!=null?'點牌可取消':'點空白處指名')+'</small></div>';
  h+='<div class="zone winzone tap'+(md==='win'?' active':'')+'" data-act="mode" data-v="win">'+(E.win!=null?mt(E.win,{tag:'button',cls:'big',attrs:'data-act="clearWin"'}):'<span class="hint">點此選食糊牌</span>')+'</div>';
  h+='</div>';
  return h;
}
function inputSectionHK(){
  const mq=E.flags.menqing;
  let h='<h3>輸入牌</h3>';
  h+='<div class="modebar">選牌:點上方牌盤選齊全部的牌(有槓時,每個槓多一張),點牌堆裡的牌可刪除。不用標明牌和食糊牌。</div>';
  h+=palette();
  h+=hkFlowerInput();
  h+='<div class="zl">牌堆 <small>共 '+E.all.length+' 張</small></div>';
  h+='<div class="zone poolbox"><div class="tiles">'+(E.all.length?E.all.slice().sort((a,b)=>a-b).map(t=>mt(t,{tag:'button',attrs:'data-act="poolTap" data-t="'+t+'"'})).join(''):'<span class="hint">點上方牌盤選牌</span>')+'</div></div>';
  h+='<div class="btnrow"><button data-act="undoTile">退一張</button><button data-act="clearHand">全部清空</button></div>';
  h+='<div class="card askcard"><div class="zl" style="margin-top:0">是不是門前清?(胡牌前沒有上、碰、槓過牌)</div>'
    +'<div class="seg two"><button class="'+(mq===true?'on':'')+'" data-act="menqing" data-v="1">是(門前清)</button><button class="'+(mq===false?'on':'')+'" data-act="menqing" data-v="0">否(有上、碰、槓過)</button></div>'
    +'<div class="hint">'+(hkFlowerMode()?'花牌規則下不另計「門前清」番;但選「是」才會計坎坎糊、九子連環。未選擇時按「否」計算。':'選「是」才會計門前清、坎坎糊、九子連環;未選擇時按「否」計算(只計對對糊)。')+'</div></div>';
  return h;
}
function resultHint(res){
  if(isWild()) return wildHint(res);
  if(isHK()){
    if(!E.all.length) return '<div class="hint">請先用牌盤選牌。</div>';
    if(res&&res.error) return '<div class="warn">這副牌可能輸入有誤,或是詐糊。('+esc(res.error)+')</div>';
    if(!res) return '<div class="hint">請先用牌盤選牌。</div>';
    return '<div class="ok">已自動分析(共 '+res.count+' 種讀法,取最高番)</div>';
  }
  if(E.win==null) return '<div class="hint">未指名食糊牌:請點「食糊牌」框的空白處,再點牌堆裡最後食糊的那張,即可自動算番。</div>';
  if(E.partBad) return '<div class="warn">明牌標記無法組成'+CHI+'、碰或槓(每組3張,槓4張),可能輸入有誤。</div>';
  if(res&&res.error) return '<div class="warn">這副牌可能輸入有誤,或是詐糊。('+esc(res.error)+')</div>';
  if(!res) return '<div class="warn">牌數與預期不符(手牌連食糊牌 '+(E.hand.length+1)+' 張,應為 '+need()+' 張),可能輸入有誤,或是詐糊。</div>';
  return '<div class="ok">已自動分析(共 '+res.count+' 種拆法,取最高番;聽 '+res.waits+' 張牌)</div>';
}
function viewCalc(){
  const res=analyze(); const items=curItems(res);
  const rawTotal=items.reduce((a,x)=>a+x.total,0);
  const total=isHK()?Math.min(rawTotal,hkCap()):rawTotal;
  if(E.winner==null) E.winner=S.seat[0];
  let h='<div class="status">目前:<b>'+WIND[S.wind]+'風圈</b> · 莊家 '+nm(dealerPid())+' · 連莊 '+S.streak+' 次<br>食糊者(胡牌)'+nm(E.winner)+' 的門風:<b>'+windOf(E.winner)+'風</b>'+(E.winner===dealerPid()?'(莊家)':'')+'</div>';
  h+='<div class="hint">各家門風:'+S.seat.map(p=>nm(p)+' '+windOf(p)).join(' · ')+'<br>玩法:'+gameName()+'</div>';
  if(pending.length) h+='<div class="note">已加入 '+pending.length+' 位食糊者:'+pending.map(w=>nm(w.p)+' '+w.total+'番').join('、')+'</div>';
  h+='<h3>食糊者(胡牌)</h3>'+winnerBtns('winner',E.winner);
  h+='<div class="seg two"><button class="'+(E.self?'on':'')+'" data-act="self" data-v="1">自摸</button><button class="'+(!E.self?'on':'')+'" data-act="self" data-v="0">出銃(放槍)</button></div>';
  if(!E.self){ h+='<div class="lbl">出銃者(放槍)</div>'+winnerBtns('disc',E.disc); }
  if(!isHK()) h+='<h3>花牌</h3><div class="flowers">'+M.FLOWERS.map((f,i)=>'<button class="fl '+(E.flowers[i]?'on':'')+'" data-act="flower" data-i="'+i+'">'+f+'</button>').join('')+'</div>';
  const flagList=(M.FLAGS||DEFAULT_FLAGS).filter(a=>!(isHK()&&a[0]==='menqing')).concat(isHK()?[]:HUAHU.map(h2=>[h2[0],h2[1]]));
  h+='<h3>特殊情況</h3><div class="flags">'+flagList.map(a=>'<label><input type="checkbox" data-chg="flag" data-k="'+a[0]+'"'+(E.flags[a[0]]?' checked':'')+'>'+a[1]+'</label>').join('')+'</div>';
  if(!isHK()) h+='<p class="hint">勾選「花糊」:其番數直接加在本局食糊者的番數上,一併按本局結算,不另外拉落下一鋪。</p>';
  h+=inputSection();
  h+='<h3>番數結果</h3>';
  h+=resultHint(res);
  if(baoVisible()){
    h+='<h3>包牌(自摸時由供牌者包付三家)</h3><label>包牌者<select data-chg="bao"><option value="">無</option>'+S.seat.filter(p=>p!==E.winner).map(p=>'<option value="'+p+'"'+(E.bao===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label><p class="hint">十二章包:供給第四組明章(明坎、上、任何槓)的一家包付;第四組是暗槓則無人包。大三元包:供給第三組三元牌明章的一家包付。包後不包先,只計一家。</p>';
  }
  h+='<div class="fans">'+items.map(x=>'<div class="fan"><label><input type="checkbox" data-chg="excl" data-id="'+x.id+'" checked> '+x.name+(x.n>1?' ×'+x.n:'')+'</label><span>'+x.total+'</span></div>').join('')+(isHK()?'':lockedFanRows())+'</div>';
  const exl=Object.keys(E.excl).filter(k=>E.excl[k]);
  if(exl.length){ const r=RL(); h+='<div class="hint">已取消:'+exl.map(k=>'<a data-act="unexcl" data-id="'+k+'">'+(r[k]?r[k].name:k)+'(恢復)</a>').join(' ')+'</div>'; }
  if(E.extra.length){ const r=RL(); h+='<div class="extras">'+E.extra.map((x,i)=>'<span class="meld">'+(r[x.id]?r[x.id].name:x.id)+' ×'+x.n+' <b data-act="extraN" data-i="'+i+'" data-d="1">＋</b> <b data-act="extraN" data-i="'+i+'" data-d="-1">−</b> <b data-act="rmExtra" data-i="'+i+'">✕</b></span>').join('')+'</div>'; }
  h+='<div class="addfan"><select data-chg="addId"><option value="">＋ 手動加番種…</option>'+fanList().map(f=>'<option value="'+f.id+'">'+f.name+' ('+f.fan+(f.fanC!=null?'/'+f.fanC:'')+')</option>').join('')+'</select></div>';
  const minF=isHK()?S.cfg.hk.minFan:S.cfg.minFan;
  h+='<div class="total">'+(isHK()?'合計 <b>'+total+'</b> 番':finalTotals(total))+(isHK()&&rawTotal>hkCap()?' <span class="hint">(疊加 '+rawTotal+' 番,封頂 '+hkCap()+' 番)</span>':'')+(minF>0&&total<minF?' <span class="neg">('+(isHK()?'不足 '+minF+' 番,記錄時當詐糊':'低於起糊 '+minF+' 番')+')</span>':'')+'</div>';
  if(isHK()){
    if(E.self||E.disc!=null){
      const w0={p:E.winner,self:E.self,disc:E.disc,total:total,qiang:!!E.flags.qiangkong&&!E.self,bao:E.bao};
      const d=settleHK(pending.concat([w0]));
      h+='<h3>本局計分預覽</h3><div class="prev">'+S.seat.map(p=>'<div><small>'+nm(p)+'</small><b class="'+(d[p]>=0?'pos':'neg')+'">'+money(d[p])+'</b></div>').join('')+'</div><p class="hint">'+HK_PRESETS[S.cfg.hk.preset].name+':'+total+' 番出銃 '+hkRon(total)+' 分,自摸每家 '+hkShare(total)+' 分。</p>';
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
    if(r.kind==='win') r.winners.forEach(w=>{ h+='<div class="rw">'+nm(w.p)+(w.self?' 自摸':' 食 '+nm(w.disc)+' 出銃')+(w.bao!=null&&w.bao!==w.p?'(由 '+nm(w.bao)+' 包)':'')+' — <b>'+w.total+'番</b>'+(w.raw&&w.raw>w.total?'<small>(疊加 '+w.raw+' 番,封頂)</small>':'')+'<div class="hint">'+w.fans.map(f=>esc(f.name)+(f.n>1?'×'+f.n:'')+' '+f.total).join(' · ')+'</div></div>'; });
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
  let h='<h3>版本資訊</h3><div class="card"><div>目前版本:<b>'+APP_VERSION+'</b></div><div>更新時間:<b>'+APP_UPDATED+'</b></div>'+(upd?'<div class="pos">最新版本:<b>'+esc(upd.version)+'</b>'+(upd.updated?'('+esc(upd.updated)+')':'')+'</div>':'')+'<div class="dev">開發者:Instagram <a href="https://www.instagram.com/'+DEV_IG+'/" target="_blank" rel="noopener">@'+DEV_IG+'</a></div><div class="btnrow">'+(upd?'<button class="primary" data-act="upgrade">立即升級</button>':'')+'<button data-act="checkUpd">'+(checking?'檢查中…':'檢查更新')+'</button></div><div class="hint">App 開啟時會自動檢查。升級只會更新程式,不會清除你的紀錄。</div></div>';
  h+='<h3>玩法</h3><div class="card"><div>目前玩法:<b>'+gameLabel(S.game)+'</b></div><div class="btnrow"><button data-act="toChooser">更換玩法</button></div></div>';
  if(isWild()) h+='<div class="note">本場牌組加 '+S.cfg.wildLimit+' 張通用百搭。百搭可代34種非花牌；真白板仍是白板。代入後同款牌連副露最多4張；不額外加百搭番。已宣告副露中的百搭用途固定。要改百搭數量，請到「更換玩法」重新選擇。</div>';
  if(isHK()) h+=hkSettings();
  else {
    h+='<h3>番表預設</h3><div class="presetbtns">'
      +'<button class="'+((isWild()?c.wildPreset:c.preset)===1?'on':'')+'" data-act="preset" data-v="1">預設 #1:陶源麻雀王大賽番數表</button>'
      +'<button class="'+((isWild()?c.wildPreset:c.preset)===2?'on':'')+'" data-act="preset" data-v="2">預設 #2:香港麻雀協會總例<small>《港式十六張新章麻雀總例》2025-07-28 修訂版番種詳述</small></button>'
      +'<button class="'+((isWild()?c.wildPreset:c.preset)===3?'on':'')+'" data-act="preset" data-v="3">預設 #3:台牌百搭番數表</button></div>';
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
  if(wildJob&&(!isWild()||wildKey!==wildSignature())){wildStop();wildDone=null;wildKey='';}
  const y=window.scrollY;
  derive();
  applyTheme();
  const el=document.getElementById('app');
  if(!S.game||tab==='chooser'){ el.innerHTML='<div class="body">'+updBanner()+viewChooser()+'</div>'; window.scrollTo(0,0); return; }
  const views={table:viewTable,calc:viewCalc,history:viewHistory,settle:viewSettle,settings:viewSettings};
  const tabs=[['table','座位'],['calc','算番'],['history','歷史'],['settle','結算'],['settings','設定']];
  el.innerHTML='<div class="body">'+updBanner()+a2hsBanner()+views[tab]()+'</div><nav>'+tabs.map(t=>'<button class="'+(tab===t[0]?'on':'')+'" data-act="tab" data-v="'+t[0]+'">'+t[1]+'</button>').join('')+'</nav>';
  window.scrollTo(0,y);
}
function advance(keep,fromDraw){
  if(keep){ if(!fromDraw) S.streak++; }
  else { S.streak=0; S.dealerSeat=(S.dealerSeat+1)%4; if(S.dealerSeat===0) S.wind=(S.wind+1)%4; }
}
function before(){ return {dealerSeat:S.dealerSeat,streak:S.streak,wind:S.wind}; }
function pushRec(o){ S.history.push(Object.assign({id:Date.now(),time:Date.now(),dealer:dealerPid(),streak:S.streak,wind:S.wind,before:before(),ledgerBefore:copyL(S.ledger)},o)); }
function collectCurrent(){
  derive();
  const res=analyze(); const items=curItems(res); const raw=items.reduce((a,x)=>a+x.total,0);
  const total=isHK()?Math.min(raw,hkCap()):raw;
  return {wild:isWild()?{limit:S.cfg.wildLimit,preset:S.cfg.wildPreset,physical:E.all.slice(),groups:E.wildGroups,replacements:res.replacements,assigned:res.assigned,win:res.win}:null,p:E.winner,self:E.self,disc:E.disc,total,raw,fans:items,qiang:!!E.flags.qiangkong&&!E.self,bao:baoVisible()?E.bao:null};
}
function validateCur(){
  if(isWild()){const r=wildResult();if(!r||r.error||!r.complete){toast('請先完成百搭最高番搜尋');return false;}if(E.wildSelect.length){toast('請先完成或取消正在選取的副露');return false;}}
  if(!E.self){ if(E.disc==null){ toast('請選擇出銃者(放槍)'); return false; } if(E.disc===E.winner){ toast('出銃者不能是食糊者'); return false; } }
  return true;
}
function resetGameData(){
  try{ localStorage.setItem(PREV_KEY,JSON.stringify(S)); }catch(e){}
  S.history=[]; S.ledger=[]; S.streak=0; S.wind=0; S.dealerSeat=0; E=newEntry(); pending=[];
}
function act(a,d){
  if(isWild()&&wildAction(a,d)){save();render();return;}
  derive();
  switch(a){
    case 'tab': tab=d.v; break;
    case 'toChooser': tab='chooser'; wildPick=false; break;
    case 'menqing': E.flags.menqing=(d.v==='1'); E.excl={}; break;
    case 'game': {
      const v=d.v;
      if(v==='wild'&&d.n==null){ wildPick=true; tab='chooser'; break; }
      let wl=S.cfg.wildLimit;
      if(v==='wild'){
        wl=Number(d.n);
        if(!Number.isInteger(wl)||wl<4||wl>8){ toast('百搭數量只可選4至8張'); return; }
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
      tab='table'; toast('已選擇:'+gameLabel(v)); break; }
    case 'hkPreset': S.cfg.hk.preset=d.v; break;
    case 'hkResetTable': S.cfg.hk.over={}; break;
    case 'upgrade': doUpgrade(); return;
    case 'dismissUpd': updDismissed=true; break;
    case 'checkUpd': checkUpdate(true); return;
    case 'preset': {
      const v=+d.v;
      if(v===2&&!window.MJ2){ toast('找不到 engine2.js,請先上傳'); return; }
      if(v===3&&!window.MJ3){ toast('engine.js 版本過舊,請先更新'); return; }
      if(isWild()) S.cfg.wildPreset=v; else S.cfg.preset=v; pickM(); E.excl={}; E.extra=[]; E.flags={};
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
    case 'mode': E.mode=d.v; break;
    case 'tile': {
      const t=+d.t;
      if(tileCount(t)>=4){ toast('這張牌已有4張'); return; }
      E.all.push(t); E.mode='pick'; E.excl={};
      break; }
    case 'poolTap': {
      const t=+d.t, ac=allCounts();
      if(E.mode==='pick'){ const i=E.all.indexOf(t); if(i>=0) E.all.splice(i,1); E.excl={}; }
      else if(E.mode==='meld'){
        if(E.marks[t]<ac[t]) E.marks[t]++; else E.marks[t]=0;
        E.excl={};
      } else {
        if(E.win===t){ E.win=null; }
        else if(ac[t]-E.marks[t]<1){ toast('這張牌已標為明牌,不能當食糊牌;請先取消明牌標記'); return; }
        else E.win=t;
        E.excl={};
      }
      break; }
    case 'kongToggle': { const t=+d.t; E.kongOpen[t]=(E.kongOpen[t]===false); break; }
    case 'clearWin': E.win=null; E.mode='win'; E.excl={}; break;
    case 'undoTile': {
      for(let i=E.all.length-1;i>=0;i--){ const t=E.all[i]; if(E.marks[t]<tileCount(t)){ E.all.splice(i,1); break; } }
      if(!E.all.length) E.mode='pick';
      E.excl={}; break; }
    case 'clearHand': E.all=[]; E.marks=Array(34).fill(0); E.kongOpen={}; E.melds=[]; E.win=null; E.mode='pick'; E.excl={}; break;
    case 'rmMeld': {
      const m=E.melds[+d.i];
      if(m){
        if(m.t==='chow'){ [0,1,2].forEach(k=>{ if(E.marks[m.tile+k]>0) E.marks[m.tile+k]--; }); }
        else E.marks[m.tile]=Math.max(0,E.marks[m.tile]-(m.t==='kong'?4:3));
      }
      E.mode='meld'; E.excl={}; break; }
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
        S.history.push({id:Date.now(),time:Date.now(),kind:'win',dealer,streak:S.streak,wind:S.wind,winners:ws.map(w=>({p:w.p,self:w.self,disc:w.disc,total:w.total,raw:w.raw,fans:w.fans,bao:w.bao})),deltas,events:[],before:before(),ledgerBefore:copyL(S.ledger)});
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
      S.history.push({id:Date.now(),time:Date.now(),kind:'win',dealer,streak:S.streak,wind:S.wind,winners:ws.map(w=>({p:w.p,self:w.self,disc:w.disc,total:w.total,fans:w.fans,wild:w.wild})),deltas:cash,events:ev,before:before(),ledgerBefore:lb});
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

function payRows(total){
  if(!E.self&&E.disc==null) return [];
  const dealer=dealerPid(),bonus=1+2*S.streak,fv=S.cfg.fanValue;
  const payers=E.self?[0,1,2,3].filter(p=>p!==E.winner):[E.disc];
  return payers.map(q=>{
    const extra=(q===dealer||E.winner===dealer)?bonus:0,fan=S.cfg.baseMult+total+extra;
    return {payer:q,pattern:total,base:S.cfg.baseMult,dealerFan:extra?1:0,streakFan:extra?2*S.streak:0,fan:fan,amount:Math.round(fan*fv)};
  });
}
function lockedFanRows(){
  const dealer=dealerPid(),streak=S.streak,fv=S.cfg.fanValue;
  const row=(name,fan,note)=>'<div class="fan" style="opacity:.92"><label>🔒 '+name+(note?' <small>'+note+'</small>':'')+'</label><span>'+(fan>0?'+':'')+fan+'</span></div>';
  let scope;
  if(E.winner===dealer) scope='莊家食糊:每位付款人都加';
  else if(E.self) scope='閒家自摸:只加在莊家的一份';
  else if(E.disc==null) scope='出銃時:莊家食糊或莊家出銃才加';
  else scope=E.disc===dealer?'莊家出銃:適用':'本局不適用';
  const applies=E.self||E.disc!=null?(E.winner===dealer||E.self||E.disc===dealer):true;
  return row('底(固定,不能刪除)',S.cfg.baseMult,fv===1?'每付款人一份':'每付款人一份,每番 $'+fv)+row('莊家加番(固定)',applies?1:0,scope)+row('連莊加番 2 × '+streak+'(固定)',applies?2*streak:0,scope)+'<div class="hint">底及莊家加番只在這份清單計算一次;下方合計與記帳預覽不會再重複加。</div>';
}
function finalTotals(total){
  const rows=payRows(total);
  if(!rows.length) return '合計 <b>'+total+'</b> 番(選自摸或出銃者後,會顯示含底及莊家的應付合計)';
  const groups=[];
  rows.forEach(r=>{let g=groups.find(x=>x.fan===r.fan);if(!g){g={fan:r.fan,amount:r.amount,names:[]};groups.push(g);}g.names.push(nm(r.payer));});
  if(groups.length===1) return '每位付款人應付 <b>'+groups[0].fan+'</b> 番 = <b>$'+groups[0].amount+'</b>';
  return groups.map(g=>g.names.join('、')+' 付 <b>'+g.fan+'</b> 番 = <b>$'+g.amount+'</b>').join('<br>');
}
let wildJob=null,wildKey='',wildDone=null,wildBusy=false,wildProgress=0;
function wildInput(){return {hand:E.all.slice(),groups:JSON.parse(JSON.stringify(E.wildGroups)),win:E.win,selfDraw:E.self,flags:E.flags,flowers:E.flowers,limit:S.cfg.wildLimit,preset:S.cfg.wildPreset,...ctxExtra()};}
function wildSignature(){return JSON.stringify([wildInput(),OV(),E.excl]);}
function wildStop(){if(wildJob)wildJob.terminate();wildJob=null;wildBusy=false;}
function wildResult(){
 if(wildKey!==wildSignature()){wildStop();wildDone=null;wildKey='';}
 return wildDone;
}
function wildStart(){
 wildStop();wildDone=null;wildProgress=0;
 if(E.wildSelect.length){toast('請先加入或取消正在選取的一組牌');return;}
 if(E.win==null){toast('請先選食糊牌');return;}
 if(!E.self&&E.win===34){toast('他家打出的百搭不可食糊');return;}
 const inp=wildInput();wildKey=wildSignature();wildBusy=true;
 try{
  const job=wildJob=new Worker('wild-worker.js');
  job.onmessage=e=>{if(wildJob!==job)return;const d=e.data;if(d.progress!=null){wildProgress=d.progress;const el=document.getElementById('wild-progress');if(el)el.textContent='已評估 '+wildProgress+' 種代入及食糊牌組合'+(d.best!=null?',目前最高 '+d.best+' 番':'');return;}
   if(d.done){wildDone=d.result;wildBusy=false;job.terminate();wildJob=null;render();}};
  job.onerror=e=>{if(wildJob!==job)return;wildDone={error:e.message||'無法載入背景計番,請檢查已上傳 wild-worker.js、engine_wild.js'};wildStop();render();};
  job.postMessage({inp,over:OV(),excluded:Object.keys(E.excl).filter(k=>E.excl[k])});
 }catch(e){wildBusy=false;wildDone={error:String(e)};}
}
function wildAction(a,d){
 if(a==='wildRun'){wildStart();return true;}
 if(a==='wildStop'){wildStop();wildDone=null;return true;}
 if(a==='wildPool'){
  const i=+d.i,t=E.all[i];
  if(E.mode==='win'){E.win=E.win===t?null:t;}
  else if(E.mode==='meld'){const j=E.wildSelect.indexOf(i);if(j>=0)E.wildSelect.splice(j,1);else E.wildSelect.push(i);}
  else{E.all.splice(i,1);E.wildSelect=[];if(!E.all.includes(E.win))E.win=null;}
  return true;
 }
 if(a==='wildCancelGroup'){E.wildSelect=[];return true;}
 if(a==='wildGroup'){
  if(E.wildGroups.length>=5){toast('最多五組副露');return true;}
  const physical=E.wildSelect.map(i=>E.all[i]),kind=d.v,sz=kind==='kong'?4:3;
  const g={t:kind,physical,open:d.open!=='0'};
  if(physical.length!==sz){toast('請在牌堆選'+sz+'張牌');return true;}
  let target=kind==='chow'?0:physical.find(t=>t!==34);if(target==null)target=0;
  const text=prompt(kind==='chow'?'此組上牌起始牌:輸入1m至7m／1p至7p／1s至7s(m萬 p筒 s索)':'此組碰／槓代表哪款牌?輸入1m至9s或東南西北中發白',wildCode(target));
  if(text===null)return true;
  const tile=wildParse(text.trim());
  if(tile==null||(kind==='chow'&&(tile>=27||tile%9>6))){toast('牌名格式不正確');return true;}
  g.tile=tile;const expected=kind==='chow'?[tile,tile+1,tile+2]:Array(sz).fill(tile),left=expected.slice();
  for(const t of physical.filter(t=>t!==34)){const j=left.indexOf(t);if(j<0){toast('真牌與指定副露不相符');return true;}left.splice(j,1);}
  E.wildGroups.push(g);for(const i of E.wildSelect.slice().sort((a,b)=>b-a))E.all.splice(i,1);
  E.wildSelect=[];E.win=null;E.mode='pick';return true;
 }
 if(a==='wildRemoveGroup'){const g=E.wildGroups.splice(+d.i,1)[0];if(g)E.all.push(...g.physical);E.wildSelect=[];return true;}
 if(a==='tile'){
  const t=+d.t,total=E.all.concat(E.wildGroups.flatMap(g=>g.physical));
  if(total.filter(x=>x===t).length>=(t===34?S.cfg.wildLimit:4)){toast(t===34?'已達本場百搭上限':'真牌最多4張');return true;}
  E.all.push(t);E.wildSelect=[];E.mode='pick';E.excl={};return true;
 }
 if(a==='undoTile'){E.all.pop();E.wildSelect=[];if(!E.all.includes(E.win))E.win=null;return true;}
 if(a==='clearHand'){E.all=[];E.wildGroups=[];E.wildSelect=[];E.win=null;E.mode='pick';E.excl={};return true;}
 return false;
}
function wildCode(t){return t<27?(t%9+1)+['m','p','s'][Math.floor(t/9)]:'東南西北中發白'[t-27];}
function wildParse(v){const z='東南西北中發白'.indexOf(v);if(v.length===1&&z>=0)return 27+z;const m=/^([1-9])([mps])$/i.exec(v);return m?['m','p','s'].indexOf(m[2].toLowerCase())*9+Number(m[1])-1:null;}
function inputWild(){
 let h='<div class="warn">通用百搭版為測試版,正式記帳前請人工核對。只含通用百搭,不含越南分類百搭。</div><h3>輸入牌(含百搭)</h3><div class="note">手牌與食糊牌放入牌堆;副露逐組加入。百搭用專用「百搭」鍵,白板仍作真白板。本場共加 '+S.cfg.wildLimit+' 張百搭,不代表你的手牌必須有這麼多張。</div>';
 h+=palette()+'<div class="btnrow"><button data-act="tile" data-t="34">＋ 百搭</button></div>';
 h+='<div class="seg"><button data-act="mode" data-v="pick" class="'+(E.mode==='pick'?'on':'')+'">刪牌</button><button data-act="mode" data-v="meld" class="'+(E.mode==='meld'?'on':'')+'">選副露</button><button data-act="mode" data-v="win" class="'+(E.mode==='win'?'on':'')+'">選食糊牌</button></div>';
 h+='<div class="hint">'+(E.mode==='meld'?'點選3或4張,再按下方組別按鈕。':'點「選食糊牌」再點最後食糊的一張;刪牌模式點牌即刪除。')+'</div>';
 h+='<div class="zl">手牌連食糊牌 '+E.all.length+' 張(應 '+((5-E.wildGroups.length)*3+2)+' 張)</div><div class="zone tiles">'+E.all.map((t,i)=>mt(t,{tag:'button',cls:E.wildSelect.includes(i)?'mk2':t===E.win?'mark':'',attrs:'data-act="wildPool" data-i="'+i+'"'})).join('')+'</div>';
 if(E.mode==='meld') h+='<div class="btnrow"><button data-act="wildGroup" data-v="chow">加入上牌</button><button data-act="wildGroup" data-v="pung">加入碰牌</button><button data-act="wildGroup" data-v="kong" data-open="1">加入明槓</button><button data-act="wildGroup" data-v="kong" data-open="0">加入暗槓</button><button data-act="wildCancelGroup">取消選取</button></div>';
 h+='<div class="btnrow"><button data-act="undoTile">退一張手牌</button><button data-act="clearHand">全部清空</button></div><h3>副露／槓(已宣告的百搭用途固定)</h3>';
 h+=E.wildGroups.map((g,i)=>'<div class="card">'+g.physical.map(t=>mt(t)).join('')+' → '+(g.t==='chow'?'上':g.t==='pung'?'碰':g.open?'明槓':'暗槓')+' '+M.tName(g.tile)+(g.physical.includes(34)?'(含百搭)':'')+' <button data-act="wildRemoveGroup" data-i="'+i+'">退回手牌</button></div>').join('');
 h+='<div class="hint">食糊牌:'+(E.win==null?'未選':E.win===34?'百搭(只限自摸)':M.tName(E.win))+'。百搭不能代花牌;代入後同款牌最多4張。假碰優先權屬牌桌規則,本計番器不裁定搶碰。</div>';
 h+='<div class="btnrow"><button class="primary" data-act="wildRun">搜尋最高番</button>'+(wildBusy?'<button data-act="wildStop">取消搜尋</button>':'')+'</div><div id="wild-progress" class="hint">'+(wildBusy?'正在完整搜尋,已評估 '+wildProgress+' 種;未完成前不能記錄。':'變更牌、花牌、番表或特殊情況後,請重新搜尋。')+'</div>';
 return h;
}
function wildHint(r){
 if(wildBusy) return '<div class="note">最高番搜尋中;可取消,不會把中途結果當成最優解。</div>';
 if(!r) return '<div class="hint">輸入完成後按「搜尋最高番」。</div>';
 if(r.error) return '<div class="warn">'+esc(r.error)+'</div>';
 return '<div class="ok">完整搜尋完成:'+r.count+' 種代入及食糊牌組合;牌型最高 '+r.total+' 番。<br>手牌百搭代入:'+(r.replacements.map(t=>M.tName(t)).join('、')||'無')+(E.win===34?'<br>自摸百搭當作:'+M.tName(r.win):'')+'<br>聽牌種類(含可摸百搭):'+r.waits+'</div>';
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