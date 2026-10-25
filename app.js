(function(){
'use strict';
const M=window.MJ;
const KEY='mj_hk_tw_v1';
const WIND='東南西北';
const defState=()=>({names:['玩家1','玩家2','玩家3','玩家4'],seat:[0,1,2,3],dealerSeat:0,streak:0,wind:0,history:[],cfg:{fanValue:1,baseMult:5,minFan:0,drawKeeps:true,over:{}}});
function load(){
  try{ const j=JSON.parse(localStorage.getItem(KEY)); if(j&&j.names){ const d=defState(); return Object.assign(d,j,{cfg:Object.assign(d.cfg,j.cfg||{})}); } }catch(e){}
  return defState();
}
let S=load();
const save=()=>{ try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} };
const newEntry=()=>({winner:null,self:true,disc:null,hand:[],melds:[],win:null,flowers:Array(8).fill(false),flags:{},mode:'chow',meldMode:'chow',excl:{},extra:[]});
let E=newEntry(), pending=[], tab='table';
let inst={id:'zhahu',mode:'one',payee:null,payer:null};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const seatOf=p=>S.seat.indexOf(p);
const dealerPid=()=>S.seat[S.dealerSeat];
const windOf=p=>WIND[(seatOf(p)-S.dealerSeat+4)%4];
const nm=p=>esc(S.names[p]);
const RL=()=>M.buildRules(S.cfg.over);
const money=n=>(n>0?'+':'')+n;
const stepOf=m=>m==='hand'?2:(m==='win'?3:1);
function balances(){ const b=[0,0,0,0]; S.history.forEach(r=>r.deltas.forEach((d,i)=>b[i]+=d)); return b; }
function toast(t){ const e=document.getElementById('toast'); e.textContent=t; e.className='show'; setTimeout(()=>{e.className='';},1800); }
function need(){ return (5-E.melds.length)*3+2; }
function tileCount(t){
  let n=E.hand.filter(x=>x===t).length+(E.win===t?1:0);
  E.melds.forEach(m=>{ if(m.t==='chow'){ if(t>=m.tile&&t<=m.tile+2) n++; } else if(m.tile===t) n+=(m.t==='kong'?4:3); });
  return n;
}
function analyze(){
  if(E.hand.length!==need()-1||E.win==null) return null;
  return M.analyze({hand:E.hand.concat([E.win]),melds:E.melds,win:E.win,flowers:E.flowers,selfDraw:E.self,flags:E.flags},S.cfg.over);
}
function curItems(res){
  const r=RL(); let it;
  if(res&&res.items) it=res.items.filter(x=>!E.excl[x.id]);
  else it=M.basic({flowers:E.flowers,selfDraw:E.self,flags:E.flags}).filter(x=>!E.excl[x.id]);
  it=it.concat(E.extra.map(x=>({id:x.id,n:x.n,closed:false})));
  return it.map(x=>{
    const f=r[x.id]; const c=x.closed&&f.fanC!=null; const unit=c?f.fanC:f.fan;
    return {id:x.id,name:f.name+(f.fanC!=null?(c?'(暗)':'(明)'):''),n:x.n,unit,total:unit*x.n};
  });
}
function tileBtn(t){ return '<button class="t s'+M.suitOf(t)+'" data-act="tile" data-t="'+t+'">'+M.tName(t)+'</button>'; }
function palette(){
  let h='<div class="pal">';
  for(let su=0;su<3;su++){ h+='<div class="row">'; for(let n=1;n<=9;n++) h+=tileBtn(su*9+n-1); h+='</div>'; }
  h+='<div class="row">'; for(let t=27;t<34;t++) h+=tileBtn(t); h+='</div></div>';
  return h;
}
function meldTxt(m){
  const n=M.tName(m.tile);
  if(m.t==='chow'){ const k=M.numOf(m.tile); return '吃 '+k+(k+1)+(k+2)+M.SUITS[M.suitOf(m.tile)]; }
  if(m.t==='pung') return '碰 '+n;
  return (m.open===false?'暗槓 ':'明槓 ')+n;
}
function winnerBtns(key,val){
  let h='<div class="seg">';
  S.seat.forEach(p=>{ h+='<button class="'+(val===p?'on':'')+'" data-act="'+key+'" data-p="'+p+'">'+nm(p)+'<small>'+windOf(p)+'</small></button>'; });
  return h+'</div>';
}
function viewTable(){
  const b=balances();
  const card=s=>{ const p=S.seat[s]; return '<div class="card seat '+(s===S.dealerSeat?'dealer':'')+'"><div class="sw">'+WIND[s]+'</div><div class="pn" data-act="rename" data-p="'+p+'">'+nm(p)+'</div><div class="mini">門風 '+windOf(p)+(s===S.dealerSeat?' · 莊':'')+'</div><div class="bal '+(b[p]>=0?'pos':'neg')+'">'+money(b[p])+'</div></div>'; };
  let h='<div class="status">'+WIND[S.wind]+'風圈 · 莊家 '+nm(dealerPid())+' · 連莊 '+S.streak+' (莊家番 +'+(1+2*S.streak)+')</div>';
  h+='<div class="cross"><div></div>'+card(3)+'<div></div>'+card(2)+'<div class="center">座位<br><small>(實際位置)</small></div>'+card(0)+'<div></div>'+card(1)+'<div></div></div>';
  h+='<h3>座位安排</h3><div class="grid2">';
  for(let s=0;s<4;s++){ h+='<label>'+WIND[s]+'位<select data-chg="seat" data-s="'+s+'">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(S.seat[s]===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>'; }
  h+='</div><p class="hint">點玩家名稱可改名。換座位時會自動與原本坐該位置的人對調。</p>';
  h+='<h3>莊家與風圈</h3><div class="grid2">';
  h+='<label>莊家座位<select data-chg="dealerSeat">'+[0,1,2,3].map(s=>'<option value="'+s+'"'+(S.dealerSeat===s?' selected':'')+'>'+WIND[s]+'位 '+nm(S.seat[s])+'</option>').join('')+'</select></label>';
  h+='<label>風圈<select data-chg="wind">'+[0,1,2,3].map(s=>'<option value="'+s+'"'+(S.wind===s?' selected':'')+'>'+WIND[s]+'風圈</option>').join('')+'</select></label>';
  h+='<div class="stepper">連莊 n=<button data-act="streak" data-d="-1">−</button><b>'+S.streak+'</b><button data-act="streak" data-d="1">＋</button></div></div>';
  h+='<div class="btnrow"><button class="primary" data-act="tab" data-v="calc">開始計番</button><button data-act="draw">流局(荒莊)</button></div>';
  return h;
}
function viewCalc(){
  const res=analyze(); const items=curItems(res); const total=items.reduce((a,x)=>a+x.total,0);
  if(E.winner==null) E.winner=S.seat[0];
  const st=stepOf(E.mode);
  let h='';
  if(pending.length) h+='<div class="note">已加入 '+pending.length+' 位食糊者:'+pending.map(w=>nm(w.p)+' '+w.total+'番').join('、')+'</div>';
  h+='<h3>食糊者</h3>'+winnerBtns('winner',E.winner);
  h+='<div class="seg two"><button class="'+(E.self?'on':'')+'" data-act="self" data-v="1">自摸</button><button class="'+(!E.self?'on':'')+'" data-act="self" data-v="0">出銃</button></div>';
  if(!E.self){ h+='<div class="lbl">出銃者</div>'+winnerBtns('disc',E.disc); }
  h+='<h3>花牌</h3><div class="flowers">'+M.FLOWERS.map((f,i)=>'<button class="fl '+(E.flowers[i]?'on':'')+'" data-act="flower" data-i="'+i+'">'+f+'</button>').join('')+'</div>';
  h+='<h3>特殊情況</h3><div class="flags">'+[['ting','叮'],['qiangkong','搶槓'],['huashang','花上自摸'],['kongshang','槓上自摸'],['haidi','海底撈月'],['tianhu','天胡'],['dihu','地胡'],['renhu','人胡'],['tianting','天叮'],['shuangxiang','雙響'],['sanxiang','三響']].map(a=>'<label><input type="checkbox" data-chg="flag" data-k="'+a[0]+'"'+(E.flags[a[0]]?' checked':'')+'>'+a[1]+'</label>').join('')+'</div>';
  h+='<h3>輸入牌</h3>';
  h+='<div class="steps">'+[[1,'① 明牌','吃碰槓'],[2,'② 手牌','未露出'],[3,'③ 和牌','最後一張']].map(a=>'<button class="'+(st===a[0]?'on':'')+'" data-act="step" data-v="'+a[0]+'">'+a[1]+'<small>'+a[2]+'</small></button>').join('')+'</div>';
  if(st===1){
    h+='<div class="seg modes">'+[['chow','吃'],['pung','碰'],['kong_open','明槓'],['kong_closed','暗槓']].map(a=>'<button class="'+(E.mode===a[0]?'on':'')+'" data-act="mode" data-v="'+a[0]+'">'+a[1]+'</button>').join('')+'</div>';
    h+='<p class="hint">'+({chow:'吃:點順子最細的一張(如 345 點 3)',pung:'碰:點該款牌',kong_open:'明槓:點該款牌(算一組)',kong_closed:'暗槓:點該款牌(算一組,不破壞門清)'})[E.mode]+'。沒有明牌可直接按「② 手牌」。</p>';
  } else if(st===2) h+='<p class="hint">輸入未露出的手牌(不含最後和的那張)。填滿後自動跳到③。</p>';
  else h+='<p class="hint">點選最後和的那一張牌。</p>';
  h+=palette();
  h+='<h3>明牌區 <small>'+E.melds.length+' 組</small></h3>';
  h+='<div class="zone">'+(E.melds.length?E.melds.map((m,i)=>'<span class="meld">'+meldTxt(m)+' <b data-act="rmMeld" data-i="'+i+'">✕</b></span>').join(''):'<span class="hint">無</span>')+'</div>';
  h+='<h3>手牌區 <small>'+E.hand.length+' / '+(need()-1)+' 張(不含和牌)</small></h3>';
  h+='<div class="zone">'+(E.hand.length?E.hand.slice().sort((a,b)=>a-b).map(t=>'<button class="t s'+M.suitOf(t)+'" data-act="rmHand" data-t="'+t+'">'+M.tName(t)+'</button>').join(''):'<span class="hint">未有手牌</span>')+'</div>';
  h+='<p class="hint">點手牌可刪除該張</p>';
  h+='<h3>和牌區</h3>';
  h+='<div class="zone winzone">'+(E.win!=null?'<button class="t s'+M.suitOf(E.win)+' win" data-act="clearWin">'+M.tName(E.win)+'</button><span class="hint">點此清除</span>':'<span class="hint">切到「③ 和牌」後點選最後和的那一張</span>')+'</div>';
  h+='<div class="btnrow"><button data-act="undoTile">退一張</button><button data-act="clearHand">全部清空</button></div>';
  h+='<h3>番數結果</h3>';
  if(res&&res.error) h+='<div class="warn">'+esc(res.error)+'</div>';
  else if(!res) h+='<div class="hint">牌未輸入完整,暫以手動番種計算</div>';
  else h+='<div class="ok">已自動分析(共 '+res.count+' 種拆法,取最高番;聽 '+res.waits+' 隻牌)</div>';
  h+='<div class="fans">'+items.map(x=>'<div class="fan"><label><input type="checkbox" data-chg="excl" data-id="'+x.id+'" checked> '+x.name+(x.n>1?' ×'+x.n:'')+'</label><span>'+x.total+'</span></div>').join('')+'</div>';
  const exl=Object.keys(E.excl).filter(k=>E.excl[k]);
  if(exl.length){ const r=RL(); h+='<div class="hint">已取消:'+exl.map(k=>'<a data-act="unexcl" data-id="'+k+'">'+r[k].name+'(恢復)</a>').join(' ')+'</div>'; }
  if(E.extra.length) h+='<div class="extras">'+E.extra.map((x,i)=>'<span class="meld">'+RL()[x.id].name+' ×'+x.n+' <b data-act="extraN" data-i="'+i+'" data-d="1">＋</b> <b data-act="extraN" data-i="'+i+'" data-d="-1">−</b> <b data-act="rmExtra" data-i="'+i+'">✕</b></span>').join('')+'</div>';
  h+='<div class="addfan"><select data-chg="addId"><option value="">＋ 手動加番種…</option>'+M.FANS.map(f=>'<option value="'+f.id+'">'+f.name+' ('+f.fan+(f.fanC!=null?'/'+f.fanC:'')+')</option>').join('')+'</select></div>';
  h+='<div class="total">合計 <b>'+total+'</b> 番'+(S.cfg.minFan>0&&total<S.cfg.minFan?' <span class="neg">(低於起糊 '+S.cfg.minFan+' 番)</span>':'')+'</div>';
  const ws=pending.map(w=>({p:w.p,self:false,disc:w.disc,total:w.total})).concat([{p:E.winner,self:E.self,disc:E.disc,total}]);
  if(E.self||E.disc!=null){
    const d=M.settle(ws,dealerPid(),S.streak,{fanValue:S.cfg.fanValue,baseMult:S.cfg.baseMult});
    h+='<div class="prev">'+S.seat.map(p=>'<div><small>'+nm(p)+'</small><b class="'+(d[p]>=0?'pos':'neg')+'">'+money(d[p])+'</b></div>').join('')+'</div>';
  }
  h+='<div class="btnrow"><button class="primary" data-act="confirm">確認入帳</button><button data-act="addWinner">再加一位食糊者(雙/三響)</button><button data-act="clearEntry">重設本鋪</button></div>';
  h+='<h3>即時收籌 / 罰則</h3>';
  const I=M.INSTANT.find(x=>x.id===inst.id);
  if(inst.payee==null) inst.payee=S.seat[0];
  if(inst.payer==null) inst.payer=S.seat[1];
  h+='<div class="grid2"><label>項目<select data-chg="instId">'+M.INSTANT.map(x=>'<option value="'+x.id+'"'+(x.id===inst.id?' selected':'')+'>'+x.name+' ('+x.amt+')</option>').join('')+'</select></label>';
  h+='<label>模式<select data-chg="instMode"><option value="all"'+(inst.mode==='all'?' selected':'')+'>其餘三家各付</option><option value="one"'+(inst.mode==='one'?' selected':'')+'>單一付款人</option></select></label>';
  h+='<label>收款人<select data-chg="instPayee">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(inst.payee===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>';
  if(inst.mode==='one') h+='<label>付款人<select data-chg="instPayer">'+[0,1,2,3].map(p=>'<option value="'+p+'"'+(inst.payer===p?' selected':'')+'>'+nm(p)+'</option>').join('')+'</select></label>';
  h+='</div><div class="btnrow"><button data-act="instSave">記錄 '+I.name+'</button></div>';
  return h;
}
function viewHistory(){
  if(!S.history.length) return '<p class="hint">暫時沒有紀錄</p>';
  let h='<div class="btnrow"><button data-act="undoRec">撤銷最後一鋪</button></div>';
  S.history.slice().reverse().forEach((r,ri)=>{
    const no=S.history.length-ri; const t=new Date(r.time);
    h+='<div class="card rec"><div class="rh"><b>#'+no+'</b> '+(r.kind==='win'?'食糊':r.kind==='draw'?'流局':'收籌:'+esc(r.name))+' <small>'+WIND[r.wind]+'風圈 · 莊 '+nm(r.dealer)+' 連'+r.streak+' · '+t.getHours()+':'+String(t.getMinutes()).padStart(2,'0')+'</small></div>';
    if(r.kind==='win') r.winners.forEach(w=>{ h+='<div class="rw">'+nm(w.p)+(w.self?' 自摸':' 食 '+nm(w.disc)+' 出銃')+' — <b>'+w.total+'番</b><div class="hint">'+w.fans.map(f=>esc(f.name)+(f.n>1?'×'+f.n:'')+' '+f.total).join(' · ')+'</div></div>'; });
    h+='<div class="prev">'+S.seat.map(p=>'<div><small>'+nm(p)+'</small><b class="'+(r.deltas[p]>=0?'pos':'neg')+'">'+money(r.deltas[p])+'</b></div>').join('')+'</div></div>';
  });
  return h;
}
function summaryText(){
  const b=balances(); let t='麻雀結算('+S.history.length+' 鋪)\n';
  S.seat.forEach(p=>{ t+=S.names[p]+': '+money(b[p])+'\n'; });
  const tr=M.transfers(b); if(tr.length){ t+='\n轉帳:\n'; tr.forEach(x=>{ t+=S.names[x.from]+' → '+S.names[x.to]+' $'+x.amt+'\n'; }); }
  return t;
}
function viewSettle(){
  const b=balances(); const tr=M.transfers(b);
  let h='<h3>累計輸贏</h3><table><tr><th>玩家</th><th>食糊鋪數</th><th>淨額</th></tr>';
  S.seat.forEach(p=>{ const wins=S.history.filter(r=>r.kind==='win'&&r.winners.some(w=>w.p===p)).length; h+='<tr><td>'+nm(p)+'</td><td>'+wins+'</td><td class="'+(b[p]>=0?'pos':'neg')+'"><b>'+money(b[p])+'</b></td></tr>'; });
  h+='</table><h3>建議轉帳</h3>';
  h+=tr.length?tr.map(x=>'<div class="tr">'+nm(x.from)+' → '+nm(x.to)+' <b>$'+x.amt+'</b></div>').join(''):'<p class="hint">暫時無需轉帳</p>';
  h+='<div class="btnrow"><button class="primary" data-act="copySum">複製結算文字</button></div>';
  return h;
}
function viewSettings(){
  const c=S.cfg; let h='<h3>金額設定</h3><div class="grid2">';
  h+='<label>每番金額<input type="number" step="any" data-chg="cfg" data-k="fanValue" value="'+c.fanValue+'"></label>';
  h+='<label>底 = 番值 ×<input type="number" step="any" data-chg="cfg" data-k="baseMult" value="'+c.baseMult+'"></label>';
  h+='<label>最低糊牌番數<input type="number" data-chg="cfg" data-k="minFan" value="'+c.minFan+'"></label>';
  h+='<label>流局後<select data-chg="drawKeeps"><option value="1"'+(c.drawKeeps?' selected':'')+'>莊家連莊</option><option value="0"'+(!c.drawKeeps?' selected':'')+'>輪莊</option></select></label></div>';
  h+='<p class="hint">目前底 $'+(c.fanValue*c.baseMult)+'。每家支付 = 底 + 番數 × 每番金額。</p>';
  h+='<h3>備份</h3><div class="btnrow"><button data-act="exportCopy">複製備份</button><button data-act="exportFile">下載備份檔</button><button data-act="importPaste">貼上匯入</button><button class="danger" data-act="resetAll">清除全部資料</button></div>';
  h+='<h3>番數表(可修改)</h3><p class="hint">灰色底表示無法自動偵測、只能手動加番。右邊欄為暗(門清)時的番數。</p><div class="fanTable">';
  const R=RL();
  M.FANS.forEach(f=>{ h+='<div class="frow'+(f.manual?' man':'')+'"><span>'+f.name+'</span><input type="number" data-chg="rule" data-id="'+f.id+'" data-f="fan" value="'+R[f.id].fan+'">'+(f.fanC!=null?'<input type="number" data-chg="rule" data-id="'+f.id+'" data-f="fanC" value="'+R[f.id].fanC+'">':'<i></i>')+'</div>'; });
  h+='</div><div class="btnrow"><button data-act="resetRules">還原預設番數</button></div>';
  return h;
}
function render(){
  const y=window.scrollY;
  const views={table:viewTable,calc:viewCalc,history:viewHistory,settle:viewSettle,settings:viewSettings};
  const tabs=[['table','座位'],['calc','計番'],['history','歷史'],['settle','結算'],['settings','設定']];
  document.getElementById('app').innerHTML='<div class="body">'+views[tab]()+'</div><nav>'+tabs.map(t=>'<button class="'+(tab===t[0]?'on':'')+'" data-act="tab" data-v="'+t[0]+'">'+t[1]+'</button>').join('')+'</nav>';
  window.scrollTo(0,y);
}
function advance(keep){
  if(keep) S.streak++;
  else { S.streak=0; S.dealerSeat=(S.dealerSeat+1)%4; if(S.dealerSeat===0) S.wind=(S.wind+1)%4; }
}
function before(){ return {dealerSeat:S.dealerSeat,streak:S.streak,wind:S.wind}; }
function collectCurrent(){
  const res=analyze(); const items=curItems(res); const total=items.reduce((a,x)=>a+x.total,0);
  return {p:E.winner,self:E.self,disc:E.disc,total,fans:items};
}
function validateCur(){
  if(!E.self){ if(E.disc==null){ toast('請選擇出銃者'); return false; } if(E.disc===E.winner){ toast('出銃者不能是食糊者'); return false; } }
  return true;
}
function act(a,d){
  switch(a){
    case 'tab': tab=d.v; break;
    case 'rename': { const p=+d.p; const n=prompt('玩家名稱',S.names[p]); if(n&&n.trim()) S.names[p]=n.trim().slice(0,10); break; }
    case 'streak': S.streak=Math.max(0,S.streak+(+d.d)); break;
    case 'draw': { if(!confirm('記錄流局?')) return; const bf=before(); S.history.push({id:Date.now(),time:Date.now(),kind:'draw',dealer:dealerPid(),streak:S.streak,wind:S.wind,deltas:[0,0,0,0],before:bf}); advance(S.cfg.drawKeeps); toast('已記錄流局'); break; }
    case 'winner': E.winner=+d.p; break;
    case 'disc': E.disc=+d.p; break;
    case 'self': E.self=d.v==='1'; break;
    case 'flower': E.flowers[+d.i]=!E.flowers[+d.i]; break;
    case 'step': { const v=+d.v; E.mode=v===1?E.meldMode:(v===2?'hand':'win'); break; }
    case 'mode': E.mode=d.v; E.meldMode=d.v; break;
    case 'tile': {
      const t=+d.t;
      if(E.mode==='hand'||E.mode==='win'){
        if(tileCount(t)-(E.mode==='win'&&E.win===t?1:0)>=4){ toast('這款牌已有4張'); return; }
        if(E.mode==='win') E.win=t;
        else {
          if(E.hand.length>=need()-1){ toast('手牌已滿,請點和牌'); E.mode='win'; break; }
          E.hand.push(t);
          if(E.hand.length>=need()-1&&E.win==null) E.mode='win';
        }
        E.excl={};
      } else {
        if(E.melds.length>=5){ toast('明牌已滿'); return; }
        const cntT=tileCount(t);
        if(E.mode==='chow'){ if(t>=27||M.numOf(t)>7){ toast('順子起始牌須為1至7'); return; } E.melds.push({t:'chow',tile:t,open:true}); }
        else if(E.mode==='pung'){ if(cntT>1){ toast('這款牌已不夠3張'); return; } E.melds.push({t:'pung',tile:t,open:true}); }
        else { if(cntT>0){ toast('這款牌已不夠4張'); return; } E.melds.push({t:'kong',tile:t,open:E.mode==='kong_open'}); }
        while(E.hand.length>need()-1) E.hand.pop();
        E.excl={};
      }
      break; }
    case 'rmHand': { const i=E.hand.indexOf(+d.t); if(i>=0) E.hand.splice(i,1); E.excl={}; break; }
    case 'clearWin': E.win=null; E.mode='win'; E.excl={}; break;
    case 'undoTile': if(E.mode==='win'||(!E.hand.length&&E.win!=null)) E.win=null; else if(E.mode==='hand'&&E.hand.length) E.hand.pop(); else if(E.melds.length) E.melds.pop(); E.excl={}; break;
    case 'clearHand': E.hand=[]; E.melds=[]; E.win=null; E.mode='chow'; E.meldMode='chow'; E.excl={}; break;
    case 'rmMeld': E.melds.splice(+d.i,1); E.excl={}; break;
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
      if(S.cfg.minFan>0&&cur.total<S.cfg.minFan&&!confirm('只有 '+cur.total+' 番,低於起糊 '+S.cfg.minFan+' 番,仍要入帳?')) return;
      if(cur.total===0&&!confirm('合計 0 番,仍要入帳?')) return;
      const ws=pending.concat([cur]);
      const deltas=M.settle(ws,dealerPid(),S.streak,{fanValue:S.cfg.fanValue,baseMult:S.cfg.baseMult});
      const bf=before();
      S.history.push({id:Date.now(),time:Date.now(),kind:'win',dealer:dealerPid(),streak:S.streak,wind:S.wind,winners:ws.map(w=>({p:w.p,self:w.self,disc:w.disc,total:w.total,fans:w.fans})),deltas,before:bf});
      advance(ws.some(w=>w.p===dealerPid()));
      E=newEntry(); pending=[]; tab='history'; toast('已入帳'); break; }
    case 'instSave': {
      if(inst.mode==='one'&&inst.payer===inst.payee){ toast('付款人與收款人不能相同'); return; }
      const I=M.INSTANT.find(x=>x.id===inst.id);
      const deltas=M.instantDeltas({amt:I.amt,mode:inst.mode,payee:inst.payee,payer:inst.payer},S.cfg.fanValue);
      S.history.push({id:Date.now(),time:Date.now(),kind:'instant',name:I.name,dealer:dealerPid(),streak:S.streak,wind:S.wind,deltas,before:before()});
      toast('已記錄 '+I.name); break; }
    case 'undoRec': {
      if(!S.history.length) return; if(!confirm('撤銷最後一鋪?')) return;
      const r=S.history.pop(); if(r.before){ S.dealerSeat=r.before.dealerSeat; S.streak=r.before.streak; S.wind=r.before.wind; } break; }
    case 'copySum': copy(summaryText()); break;
    case 'exportCopy': copy(JSON.stringify(S)); break;
    case 'exportFile': {
      const blob=new Blob([JSON.stringify(S)],{type:'application/json'}); const u=URL.createObjectURL(blob);
      const a2=document.createElement('a'); a2.href=u; a2.download='mahjong-backup-'+new Date().toISOString().slice(0,10)+'.json'; document.body.appendChild(a2); a2.click(); a2.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000); break; }
    case 'importPaste': {
      const t=prompt('貼上備份 JSON(會覆蓋現有資料)'); if(!t) return;
      try{ const j=JSON.parse(t); if(!j.names||!j.history) throw 0; const d2=defState(); S=Object.assign(d2,j,{cfg:Object.assign(d2.cfg,j.cfg||{})}); toast('匯入成功'); }catch(e){ toast('格式錯誤'); return; } break; }
    case 'resetAll': if(confirm('確定清除全部玩家、紀錄與設定?此操作無法還原')){ S=defState(); E=newEntry(); pending=[]; } else return; break;
    case 'resetRules': S.cfg.over={}; break;
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
    case 'flag': E.flags[d.k]=v; break;
    case 'excl': E.excl[d.id]=!v; break;
    case 'addId': if(v){ const f=E.extra.find(x=>x.id===v); if(f) f.n++; else E.extra.push({id:v,n:1}); } break;
    case 'instId': { inst.id=v; inst.mode=M.INSTANT.find(x=>x.id===v).mode; break; }
    case 'instMode': inst.mode=v; break;
    case 'instPayee': inst.payee=+v; break;
    case 'instPayer': inst.payer=+v; break;
    case 'cfg': { const n=parseFloat(v); S.cfg[d.k]=isNaN(n)?0:n; break; }
    case 'drawKeeps': S.cfg.drawKeeps=v==='1'; break;
    case 'rule': { const o=S.cfg.over[d.id]=S.cfg.over[d.id]||{}; o[d.f]=parseFloat(v); break; }
  }
  save(); render();
}
/* 觸控:在 touchend 即時處理點擊並阻止瀏覽器的雙擊放大;滑動不觸發 */
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
if(navigator.storage&&navigator.storage.persist) navigator.storage.persist();
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
render();
})();
