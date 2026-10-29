(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
function selectEngine(g,p=1){const E=g==='hk'?root.MJHK:({1:root.MJ,2:root.MJ2,3:root.MJ3,4:root.MJ4})[p];if(!E||typeof E.analyze!=='function')throw Error('計番引擎未載入，請重新開啟');return g!=='hk'&&root.MJRULES?root.MJRULES.wrap(E):E;}
function analyzeEntry(e,c,context){
 const E=selectEngine(c.game,c.preset),R=E.buildRules(c.over||{}),hk=c.game==='hk',flowers=Array.from({length:8},(_,i)=>e.flowers.includes(i));
 let result;
 if(e.mode==='quick'){
  if(!hk)throw Error('快速記番只適用於廣東牌');
  const items=Object.entries(e.quick).filter(([id,n])=>id!=='zimo'&&R[id]&&n>0).map(([id,n])=>({id,n,closed:false}));
  if(e.self&&R.zimo&&!items.some(x=>x.id==='xiaohuahu'))items.push({id:'zimo',n:1,closed:false});
  if(!items.length)throw Error('請選擇番種');result={items,count:0};
 }else{
  if(e.tiles.includes(34))throw Error('百搭搜尋尚未接駁，暫不能計算含百搭手牌');
  const all=e.tiles.slice(),hand=all.slice();
  for(const m of e.melds){const ts=m.t==='chow'?[m.tile,m.tile+1,m.tile+2]:Array(m.t==='kong'?4:3).fill(m.tile);for(const t of ts){const i=hand.indexOf(t);if(i<0)throw Error('明牌標記與手牌不符');hand.splice(i,1);}}
  const counts=Array(34).fill(0);all.forEach(t=>counts[t]++);if(counts.some(x=>x>4))throw Error('同款牌不可超過4張');
  if(e.win==null||!hand.includes(e.win))throw Error('請指定手牌內的食糊牌');
  if(hk&&e.concealed===null)throw Error('請確認門清狀態');
  const inp={hand,melds:e.melds,win:e.win,flowers,selfDraw:e.self,flags:e.flags,concealed:!!e.concealed,useFlowers:!!c.flowers||e.flowers.length>0,seatWind:context.seatWind,roundWind:context.roundWind,kongKeep:c.preset===4};
  result=E.analyze(inp,c.over||{});if(!result||result.error)throw Error(result&&result.error||'未能分析牌型');
 }
 const items=result.items.map(x=>({...x}));
 if(!hk&&!items.some(x=>x.id==='di'))items.unshift({id:'di',n:1,closed:false});
 const fans=items.map(x=>({id:x.id,n:x.n===undefined?1:x.n,name:R[x.id]?R[x.id].name:x.id,value:x.id==='di'&&!R.di?Number(c.base||5):E.valueOf(R,x)}));
 if(e.adjust)fans.push({id:'adjust',name:'手動調整',value:e.adjust,n:1});
 const raw=Math.max(0,fans.reduce((a,f)=>a+f.value,0)),base=hk?Math.min(raw,c.cap||10):raw,di=fans.filter(f=>f.id==='di').reduce((a,f)=>a+f.value,0);
 return {fans,raw,base,low:(hk?base:base-di)<c.min,quick:e.mode==='quick',count:result.count||0};
}
root.MockupEngine={selectEngine,analyzeEntry};
if(typeof module!=='undefined'&&module.exports){module.exports={selectEngine,analyzeEntry};return;}
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const B=(n,a,attrs='',cls='')=>`<button type="button" data-action="${a}" ${attrs} class="${cls}">${n}</button>`,P=(n,a,attrs='')=>B(n,a,attrs,'primary');
const players=[{name:'Anthony',emoji:'🐶'},{name:'Gary',emoji:'🐯'},{name:'Lori',emoji:'🐉'},{name:'Kevin',emoji:'🦊'}],winds=['東','南','西','北'],names={tw:'港式台牌・無百搭',wild:'港式台牌・通用百搭',hk:'廣東牌'};
const s={page:'game',started:false,c:{game:'tw',preset:1,value:1,min:0,base:5,cap:10,ratio:.5,flowers:false,keep:true,draw:true,jokers:4,over:{}},dealer:0,streak:0,wind:0,seat:[0,1,2,3],custom:false,history:[],ledger:[],cash:[0,0,0,0],step:0,pageNo:0,record:0,historyTab:'history',e:null};
const fresh=()=>({winner:0,payer:1,self:false,tiles:[],melds:[],win:null,flowers:[],flags:{},concealed:null,adjust:0,mode:'hand',quick:{}});s.e=fresh();
const label=p=>esc(players[p].emoji)+' '+esc(players[p].name),engine=()=>selectEngine(s.c.game,s.c.preset),tname=t=>t===34?'百搭':engine().tName(t);
const screen=$('#screen'),actions=$('#actions'),dialog=$('#panel');let submit=null,timer;
function note(n,undo=false){clearTimeout(timer);$('#notice').innerHTML=esc(n)+(undo?B('撤銷','undo'):'');$('#notice').hidden=false;timer=setTimeout(()=>$('#notice').hidden=true,5000);}
function close(){if(dialog.open)dialog.close();submit=null;}
function panel(title,body,buttons='',fn=null){$('#panel-title').textContent=title;$('#panel-body').innerHTML=body;$('#panel-actions').innerHTML=buttons;submit=fn;if(!dialog.open)dialog.showModal();}
function go(p){close();s.page=p;s.pageNo=0;render();}
function section(h,cls=''){screen.innerHTML=`<section class="screen ${cls}">${h}</section>`;}
function foot(h=''){actions.innerHTML=h;}
function field(n,k,v){return `<div class="field"><label>${n}<input data-field="${k}" type="number" value="${v}" min="0" step="any"></label></div>`;}
function toggle(n,k,v){return `<p>${n}</p><div class="choice-row">${B('否','toggle',`data-key="${k}" data-v="0" aria-pressed="${!v}"`)}${B('是','toggle',`data-key="${k}" data-v="1" aria-pressed="${!!v}"`)}</div>`;}
function pager(a,n,total){return `<div class="pager">${B('‹',a,`data-d="-1" ${n===0?'disabled':''}`)}<span>${n+1} / ${Math.max(1,total)}</span>${B('›',a,`data-d="1" ${n>=total-1?'disabled':''}`)}</div>`;}
function context(){return {seatWind:(s.seat.indexOf(s.e.winner)-s.seat.indexOf(s.dealer)+4)%4,roundWind:s.wind};}
function calc(){try{return {valid:true,...analyzeEntry(s.e,s.c,context())};}catch(e){return {valid:false,message:e.message};}}
function bonus(p){return s.c.game!=='hk'&&(p===s.dealer||s.e.winner===s.dealer)?1+2*s.streak:0;}
function preview(r){let h=r.valid?`基本 ${r.base}${s.c.game==='hk'?'':` + 莊家 ${!s.e.self?bonus(s.e.payer):s.e.winner===s.dealer?bonus(0):0}`} 番` :esc(r.message);return `<div class="fan-preview ${r.valid?(r.low?'bad':'good'):'idle'}">${h}${r.low?' · 未達起糊':''}</div>`;}
function totals(){const a=s.cash.slice();s.ledger.forEach(x=>{a[x.from]-=x.amount;a[x.to]+=x.amount;});return a;}
function balances(a){return `<div class="balance-grid">${a.map((v,p)=>`<div>${label(p)}<strong class="${v<0?'negative':'positive'}">${v>0?'+':''}${v}</strong></div>`).join('')}</div>`;}
function payTx(r){const payers=s.e.self?[0,1,2,3].filter(p=>p!==s.e.winner):[s.e.payer];return payers.map(p=>{let amount;if(s.c.game==='hk'){const base=[0,2,4,8,16,24,32,48,64,96,128][Math.min(10,Math.max(1,Math.floor(r.base)))];amount=s.e.self?Math.round(base*s.c.ratio):base;}else amount=Math.round((r.base+bonus(p))*s.c.value);return {from:p,to:s.e.winner,amount};});}
function applyTx(tx){let ledger=clone(s.ledger),cash=[0,0,0,0],events=[];
 if(s.c.game==='hk'){tx.forEach(x=>{cash[x.from]-=x.amount;cash[x.to]+=x.amount;});return {ledger,cash,events};}
 const handled=new Set();ledger=ledger.filter(old=>{const same=tx.find(x=>x.from===old.from&&x.to===old.to),rev=tx.find(x=>x.from===old.to&&x.to===old.from);if(same){const before=old.amount;old.amount=Math.ceil(before*1.5)+same.amount;old.k++;handled.add(old.from+'>'+old.to);events.push({type:'拉',before,add:same.amount,amount:old.amount,k:old.k});return true;}if(rev){const n=Math.floor(old.amount/2);cash[old.from]-=n;cash[old.to]+=n;return false;}if(tx.every(x=>x.to===old.to))return true;cash[old.from]-=old.amount;cash[old.to]+=old.amount;return false;});tx.forEach(x=>{if(!handled.has(x.from+'>'+x.to))ledger.push({...x,k:1});});return {ledger,cash,events};}
function snapshot(){return clone({dealer:s.dealer,streak:s.streak,wind:s.wind,ledger:s.ledger,cash:s.cash});}
function record(title,ds,extra={}){s.history.push({title,ds:ds.slice(),before:snapshot(),...extra});ds.forEach((v,p)=>s.cash[p]+=v);s.record=s.history.length-1;}
function advance(keep){if(keep)s.streak++;else{s.streak=0;s.dealer=s.seat[(s.seat.indexOf(s.dealer)+1)%4];if(s.seat.indexOf(s.dealer)===0)s.wind=(s.wind+1)%4;}}
function ruleSummary(){return `<div class="summary-card"><div class="summary-row"><span>玩法</span><span>${names[s.c.game]}</span></div><div class="summary-row"><span>番表</span><span>${s.c.game==='hk'?'10番128':'預設 #'+s.c.preset}</span></div><div class="summary-row"><span>最低食糊</span><span>${s.c.min} 番</span></div><div class="summary-row"><span>${s.c.game==='hk'?'自摸比例':'每番金額'}</span><span>${s.c.game==='hk'?s.c.ratio:'$'+s.c.value}</span></div></div>`;}
function render(){foot();$('#page-title').textContent=({game:'開始新牌局',preset:'開局設定',basic:'自訂設置 · 1 / 2',advanced:'自訂設置 · 2 / 2',players:'確認本場玩家',summary:'開局摘要',table:'牌桌',method:'記錄食糊',editor:'輸入牌型',quick:'快速記番',review:'確認番數',records:'歷史與結算',settings:'高級設置'})[s.page];$('#back').hidden=['game','table','records','settings'].includes(s.page);$('#main-nav').hidden=!s.started||!['table','records','settings'].includes(s.page);$('#main-nav').querySelectorAll('button').forEach(b=>{if(b.dataset.tab===s.page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 switch(s.page){
 case 'game':section(`<h2>選擇玩法</h2><div class="game-options">${Object.entries(names).map(([g,n])=>B(n,'game',`data-game="${g}"`)).join('')}</div>${s.started?B('返回牌桌','go','data-page="table"'):''}`,'welcome');break;
 case 'preset':section(`<h2>需要自訂設置嗎？</h2>${ruleSummary()}${P('使用預設，繼續','default')}${B('自訂設置','custom')}`);break;
 case 'basic':section(`<div class="field"><label>番表<select data-field="preset">${[1,2,3,4].map(n=>`<option value="${n}" ${n===s.c.preset?'selected':''}>預設 #${n}</option>`).join('')}</select></label></div>${s.c.game==='hk'?field('自摸付款比例','ratio',s.c.ratio):field('每番金額','value',s.c.value)}${field('最低食糊番數','min',s.c.min)}${s.c.game==='wild'?field('百搭數量','jokers',s.c.jokers):''}`);if(s.c.game==='hk')screen.querySelector('.field').innerHTML='<label>計分方案<select disabled><option>10番128</option></select></label>';foot(B('返回','go','data-page="preset"')+P('下一步','go','data-page="advanced"'));break;
 case 'advanced':section(s.c.game==='hk'?toggle('花牌規則','flowers',s.c.flowers)+toggle('莊家食糊連莊','keep',s.c.keep):toggle('流局繼續做莊','draw',s.c.draw)+`<p class="muted">底番在所選番表內設定。</p>`);foot(B('上一步','go','data-page="basic"')+P('完成設置','go','data-page="players"'));break;
 case 'players':section(`<div class="player-list">${s.seat.map((p,i)=>`<div class="player-row">${winds[i]} <span class="player-name">${label(p)}</span>${B('編輯','edit-player',`data-p="${p}"`)}</div>`).join('')}</div><label>莊家<select data-field="dealer">${players.map((_,p)=>`<option value="${p}" ${p===s.dealer?'selected':''}>${esc(players[p].name)}</option>`).join('')}</select></label>${B('調整座位','seats')}`);foot(B('返回','go',`data-page="${s.custom?'advanced':'preset'}"`)+P('下一步','go','data-page="summary"'));break;
 case 'summary':section(ruleSummary()+`<div class="grid-2">${s.seat.map((p,i)=>`<div class="card">${winds[i]} ${label(p)}</div>`).join('')}</div><p>莊家：${label(s.dealer)}</p>`);foot(B('返回','go','data-page="players"')+P('確認開局','start'));break;
 case 'table':{const a=totals();section(`<div class="table-status"><span>${names[s.c.game]}</span>${B('⋯','more')}</div><div class="table-board">${s.seat.map((p,i)=>B(`<span class="emoji">${players[p].emoji}</span><span class="name">${esc(players[p].name)}</span><span class="wind">${winds[i]}${p===s.dealer?' · 莊':''}</span><span class="balance ${a[p]<0?'negative':'positive'}">${a[p]>0?'+':''}${a[p]}</span>`,'player',`data-p="${p}"`,`seat ${['east','south','west','north'][i]} ${p===s.dealer?'dealer':''}`)).join('')}<div class="table-center">${winds[s.wind]}風圈<br>連莊 ${s.streak}${B('流局','draw')}</div></div><div class="table-bottom">${B('未結拉數 '+s.ledger.length+' 筆 ›','ledger')}<div class="table-actions">${B('記錄賞罰','event')}${P('記錄食糊','winner-list')}</div></div>`,'table-screen');break;}
 case 'method':section(`<h2>${label(s.e.winner)} 食糊</h2><p>出銃者／自摸</p><div class="payer-grid">${players.map((_,p)=>p===s.e.winner?'':B(label(p),'payer',`data-p="${p}" aria-pressed="${!s.e.self&&p===s.e.payer}"`)).join('')}${B('🀄 自摸','self',`aria-pressed="${s.e.self}"`)}</div><div class="stack">${B('牌型計番','mode',`data-mode="hand" aria-pressed="${s.e.mode==='hand'}"`)}${s.c.game==='hk'?B('快速選番種','mode',`data-mode="quick" aria-pressed="${s.e.mode==='quick'}"`):''}</div>`);foot(B('返回','go','data-page="table"')+P('繼續','begin'));break;
 case 'editor':editor();break;
 case 'quick':{const R=engine().buildRules(s.c.over),ids=engine().FANS.filter(f=>f.id!=='zimo').map(f=>f.id).sort((a,b)=>R[a].fan-R[b].fan),list=ids.slice(s.pageNo*4,s.pageNo*4+4);section(preview(calc())+`<div class="fan-grid">${list.map(id=>B(`${esc(R[id].name)}<br><small>${R[id].fan} 番 × ${s.e.quick[id]||0}</small>`,'quick-fan',`data-id="${id}" aria-pressed="${!!s.e.quick[id]}"`)).join('')}</div><p class="muted">未驗證牌型，請確認所選番種可同時計算。</p><div class="grow"></div>`+pager('page',s.pageNo,Math.ceil(ids.length/4)));foot(B('返回','go','data-page="method"')+P('確認番數','go','data-page="review"'));break;}
 case 'review':review();break;
 case 'records':records();break;
 case 'settings':section(`<div class="settings-grid">${[['本場規則','rules'],['番數表','fan-table'],['玩家座位','seats'],['外觀字體','appearance'],['備份','backup'],['版本說明','about']].map(([n,a])=>B(n,a)).join('')}</div>`);break;
 }}
function editor(){screen.innerHTML=$('#editor-template').innerHTML;const titles=['選牌',s.c.game==='hk'?'槓／門清':'明牌','食糊','花牌','特殊'];screen.querySelectorAll('.step-nav button').forEach((b,i)=>{b.textContent=(i<s.step?'✓ ':i+1+' ')+titles[i];b.className=i===s.step?'current':i<s.step?'done':'';if(i===s.step)b.setAttribute('aria-current','step');});$('#step-help').textContent=`第${s.step+1}步：${['輸入整副牌','標明上、碰、明槓或暗槓','指定最後食糊的牌','選花牌，沒有可略過','選特殊情況，沒有可略過'][s.step]}`;$('#fan-preview').outerHTML=preview(calc());const cols=s.e.tiles.length>18?8:6,pile=$('#hand-pile'),used={};const mc={};s.e.melds.forEach(m=>{const ts=m.t==='chow'?[m.tile,m.tile+1,m.tile+2]:Array(m.t==='kong'?4:3).fill(m.tile);ts.forEach(t=>mc[t]=(mc[t]||0)+1);});pile.style.setProperty('--hand-cols',cols);pile.innerHTML=s.e.tiles.map((t,i)=>{const marked=(used[t]=(used[t]||0)+1)<= (mc[t]||0),n=t<27?`${t%9+1}<span class="suit">${['萬','筒','索'][Math.floor(t/9)]}</span>`:tname(t);return B(n,'tile-tap',`data-i="${i}" data-marked="${marked}"`,`tile ${t<27?['wan','tong','sok'][Math.floor(t/9)]:'honor'} ${marked?'marked':''} ${t===s.e.win&&!marked?'winning':''}`);}).join('')+Array(Math.max(0,cols*3-s.e.tiles.length)).fill('<span class="tile-slot"></span>').join('');const p=$('#step-content');
 if(s.step===0)p.innerHTML=`<div class="editor-tools">${B('退一張','remove')}${B('清空','clear')}</div><div class="palette">${Array.from({length:s.c.game==='wild'?35:34},(_,t)=>B(tname(t),'add',`data-t="${t}"`,t<27?['wan','tong','sok'][Math.floor(t/9)]:'')).join('')}</div>`;
 if(s.step===1)p.innerHTML=`<div class="row"><span class="muted">點牌堆加入明牌組</span>${B('移除明牌','remove-meld')}</div><div class="menqing"><p>門清狀態</p>${B('是','concealed','data-v="1" aria-pressed="'+(s.e.concealed===true)+'"')}${B('否','concealed','data-v="0" aria-pressed="'+(s.e.concealed===false)+'"')}</div>`;
 if(s.step===2)p.innerHTML=`<p class="info-message">${s.e.win===null?'請點選未標為明牌的食糊牌':'已選：'+tname(s.e.win)}</p>`;
 if(s.step===3)p.innerHTML=`<div class="flowers-grid">${engine().FLOWERS.map((n,i)=>B(n,'flower',`data-i="${i}" aria-pressed="${s.e.flowers.includes(i)}"`)).join('')}</div>`;
 if(s.step===4){const R=engine().buildRules(s.c.over),flags=engine().FLAGS.filter(([id])=>id!=='menqing').sort((a,b)=>(R[a[0]]?.fan||0)-(R[b[0]]?.fan||0));p.innerHTML=`<div class="flags-grid">${flags.slice(s.pageNo*4,s.pageNo*4+4).map(([id,n])=>B(`${esc(n)}<small> ${R[id]?.fan||0} 番</small>`,'flag',`data-id="${id}" aria-pressed="${!!s.e.flags[id]}"`)).join('')}</div>`+pager('page',s.pageNo,Math.ceil(flags.length/4));}
 foot(B(s.step?'上一步':'返回','prev')+P(s.step===4?'確認番數':'下一步','next'));
}
function review(){const r=calc();if(!r.valid){section(`<p class="warning">${esc(r.message)}</p>`);foot(B('返回修改','go',`data-page="${s.e.mode==='quick'?'quick':'editor'}"`));return;}const tx=payTx(r),out=applyTx(tx),ds=out.cash.slice(),before=totals();out.ledger.forEach(x=>{ds[x.from]-=x.amount;ds[x.to]+=x.amount;});s.ledger.forEach(x=>{ds[x.from]+=x.amount;ds[x.to]-=x.amount;});section(`<h3>${label(s.e.winner)} ${s.e.self?'自摸':'食 '+label(s.e.payer)}</h3>${preview(r)}<div class="fan-summary">${r.fans.slice(s.pageNo*4,s.pageNo*4+4).map(f=>`<div><span>${esc(f.name)}${f.n>1?' ×'+f.n:''}</span><strong>${f.value}</strong></div>`).join('')}</div>${pager('page',s.pageNo,Math.ceil(r.fans.length/4))}${balances(ds)}<p class="muted">${s.c.game==='hk'?'本局收付':'本局淨變動（含未結拉數）'}</p>${r.low?'<p class="warning">未達起糊番數，請返回檢查。</p>':''}<div class="adjust-entry"><span>有特別改動？</span>${B('修改','adjust')}</div>`);foot(B('返回修改','go',`data-page="${s.e.mode==='quick'?'quick':'editor'}"`)+P('確認記錄','commit',r.low?'disabled':''));}
function records(){const tabs=`<div class="segment">${B('歷史','history-tab','data-v="history"')}${B('結算','history-tab','data-v="settle"')}</div>`;if(s.historyTab==='settle'){const a=totals(),tr=engine().transfers(a);section(tabs+balances(a)+tr.slice(s.pageNo*3,s.pageNo*3+3).map(x=>`<div class="transfer-row">${label(x.from)} → ${label(x.to)}<strong>$${x.amt}</strong></div>`).join('')+(!tr.length?'<p>目前無需轉帳</p>':'')+`<div class="grow"></div>`+pager('page',s.pageNo,Math.ceil(tr.length/3))+B('查看拉數','ledger'));return;}if(!s.history.length){section(tabs+'<p>暫無紀錄</p>');return;}s.record=Math.max(0,Math.min(s.record,s.history.length-1));const r=s.history[s.record];section(tabs+`<h3>第${s.record+1}筆 · ${esc(r.title)}</h3>${balances(r.ds)}<div class="fan-summary">${(r.fans||[]).slice(s.pageNo*4,s.pageNo*4+4).map(f=>`<div><span>${esc(f.name)}</span><strong>${f.value}</strong></div>`).join('')}</div>${pager('page',s.pageNo,Math.ceil((r.fans||[]).length/4))}<div class="grow"></div>${s.record===s.history.length-1?B('撤銷此筆','undo','','danger'):''}${pager('record',s.record,s.history.length)}`);}
function playerChoices(a){return `<div class="payer-grid">${players.map((_,p)=>B(label(p),a,`data-p="${p}"`)).join('')}</div>`;}
function event(p=0){const list=engine().INSTANT||[];panel('賞罰事件',`<div class="event-grid">${list.slice(s.pageNo*6,s.pageNo*6+6).map((x,i)=>B(esc(x.name),'event-choice',`data-i="${s.pageNo*6+i}" data-p="${p}"`)).join('')}</div>`+pager('event-page',s.pageNo,Math.ceil(list.length/6)));}
function groupAt(t){const options=[['碰','pung',true],['明槓','kong',true],['暗槓','kong',false]];if(t<27&&t%9<=6)options.unshift(['上','chow',true]);panel('標示明牌',`<p>${esc(tname(t))}</p><div class="grid-2">${options.map(([n,k,o])=>B(n,'group',`data-t="${t}" data-kind="${k}" data-open="${o}"`)).join('')}</div>`);}
function act(a,d){try{switch(a){
 case 'game':s.c={game:d.game,preset:d.game==='wild'?3:1,value:1,min:d.game==='hk'?3:0,base:5,cap:10,ratio:.5,flowers:false,keep:true,draw:true,jokers:4,over:{}};engine();go('preset');break;
 case 'default':s.custom=false;go('players');break;case 'custom':s.custom=true;go('basic');break;
 case 'go':go(d.page);break;case 'tab':go(d.tab);break;case 'toggle':s.c[d.key]=d.v==='1';render();break;
 case 'start':s.started=true;s.history=[];s.cash=[0,0,0,0];s.ledger=[];s.streak=0;s.wind=0;go('table');break;
 case 'rules':panel('本場規則',ruleSummary(),P('關閉','close'));break;
 case 'more':panel('牌局管理',B('撤銷上一筆','undo')+B('開始新牌局','new')+B('本場規則','rules'));break;
 case 'new':if(confirm('設定新牌局？確認開局後會清除目前原型紀錄。'))go('game');break;
 case 'player':panel(players[+d.p].name,P('食糊／自摸','winner',`data-p="${d.p}"`)+B('賞罰事件','event',`data-p="${d.p}"`)+B('改名／Emoji','edit-player',`data-p="${d.p}"`)+B('換位','seats'));break;
 case 'winner-list':panel('誰食糊？',playerChoices('winner'));break;
 case 'winner':s.e=fresh();s.e.winner=+d.p;s.e.payer=[0,1,2,3].find(p=>p!==s.e.winner);s.step=0;go('method');break;
 case 'payer':s.e.payer=+d.p;s.e.self=false;render();break;case 'self':s.e.self=true;render();break;case 'mode':s.e.mode=d.mode;render();break;case 'begin':go(s.e.mode==='quick'?'quick':'editor');break;
 case 'page':s.pageNo=Math.max(0,s.pageNo+(+d.d));render();break;
 case 'add':{const t=+d.t;if(s.e.tiles.filter(x=>x===t).length>=(t===34?s.c.jokers:4)){note('此款牌已達上限');const el=screen.querySelector(`[data-t="${t}"]`);if(el){el.classList.add('over-limit');setTimeout(()=>el.classList.remove('over-limit'),400);}return;}if(s.e.tiles.length>=22){note('已達手牌上限');return;}s.e.tiles.push(t);render();break;}
 case 'remove':s.e.tiles.pop();s.e.win=null;s.e.melds=[];render();break;
 case 'clear':if(confirm('清空本手牌？')){s.e.tiles=[];s.e.win=null;s.e.melds=[];render();}break;
 case 'tile-tap':{const t=s.e.tiles[+d.i];if(s.step===0){s.e.tiles.splice(+d.i,1);s.e.melds=[];s.e.win=null;render();}else if(s.step===1)groupAt(t);else if(s.step===2){if(d.marked==='true'){note('明牌或槓內的牌不能作食糊牌');return;}s.e.win=t;render();}break;}
 case 'group':{const t=+d.t,ts=d.kind==='chow'?[t,t+1,t+2]:Array(d.kind==='kong'?4:3).fill(t),left=s.e.tiles.slice();for(const m of s.e.melds){const ms=m.t==='chow'?[m.tile,m.tile+1,m.tile+2]:Array(m.t==='kong'?4:3).fill(m.tile);ms.forEach(t=>left.splice(left.indexOf(t),1));}for(const t of ts){const i=left.indexOf(t);if(i<0){note('未標記的牌不足以組成這組明牌');return;}left.splice(i,1);}s.e.melds.push({t:d.kind,tile:t,open:d.open==='true'});if(d.kind!=='kong'||d.open==='true')s.e.concealed=false;s.e.win=null;close();render();break;}
 case 'remove-meld':panel('移除明牌',s.e.melds.map((m,i)=>B(`${m.open===false?'暗':''}${m.t==='chow'?'上':m.t==='pung'?'碰':'槓'} ${tname(m.tile)}`,'drop-meld',`data-i="${i}"`)).join('')||'<p>暫無明牌</p>');break;
 case 'drop-meld':s.e.melds.splice(+d.i,1);close();render();break;
 case 'concealed':if(d.v==='1'&&s.e.melds.some(m=>m.t!=='kong'||m.open)){note('有明牌時不能手動標為門清');return;}s.e.concealed=d.v==='1';render();break;
 case 'flower':{const i=+d.i;s.e.flowers=s.e.flowers.includes(i)?s.e.flowers.filter(x=>x!==i):s.e.flowers.concat(i);render();break;}
 case 'flag':s.e.flags[d.id]=!s.e.flags[d.id];render();break;
 case 'step':if(+d.step<=s.step){s.step=+d.step;s.pageNo=0;render();}break;
 case 'prev':if(!s.step)go('method');else{s.step--;s.pageNo=0;render();}break;
 case 'next':if(s.step===0&&!s.e.tiles.length){note('請先輸入牌');return;}if(s.step===1&&s.c.game==='hk'&&s.e.concealed===null){note('請確認門清狀態');return;}if(s.step===2&&s.e.win===null){note('請指定食糊牌');return;}if(s.step===4)go('review');else{s.step++;s.pageNo=0;render();}break;
 case 'quick-fan':{const f=engine().buildRules(s.c.over)[d.id],old=s.e.quick[d.id]||0;panel(f.name,`<p>每份 ${f.fan} 番</p><label>份數<input id="qcount" type="number" min="0" max="8" step="1" value="${old}"></label>`,B('取消','close')+P('套用','submit'),()=>{const n=+$('#qcount').value;if(!Number.isInteger(n)||n<0||n>8){note('份數須為0至8整數');return;}s.e.quick[d.id]=n;close();render();});break;}
 case 'adjust':panel('特別改動',`<label>調整番數<input id="adjust" type="number" value="${s.e.adjust}" step="1"></label>`,B('取消','close')+P('套用','submit'),()=>{const n=+$('#adjust').value;if(!Number.isFinite(n)){note('請輸入數字');return;}s.e.adjust=n;close();s.pageNo=0;render();});break;
 case 'commit':{const r=calc();if(!r.valid)throw Error(r.message);if(r.low)throw Error('未達起糊番數');const out=applyTx(payTx(r));record(players[s.e.winner].name+(s.e.self?' 自摸':' 食 '+players[s.e.payer].name),out.cash,{kind:'win',fans:r.fans,entry:clone(s.e),rules:clone(s.c),events:out.events});s.ledger=out.ledger;advance(s.e.winner===s.dealer&&(s.c.game!=='hk'||s.c.keep));go('table');note('已記錄食糊',true);break;}
 case 'event':s.pageNo=0;event(+d.p||0);break;case 'event-page':s.pageNo=Math.max(0,s.pageNo+(+d.d));event();break;
 case 'event-choice':{const x=engine().INSTANT[+d.i],amt=typeof x.amt==='number'?x.amt:128;panel(x.name,`<label>玩家<select id="ep">${players.map((_,p)=>`<option value="${p}" ${p===+d.p?'selected':''}>${esc(players[p].name)}</option>`).join('')}</select></label><label>每份金額<input id="ea" type="number" min="0" value="${amt}"></label><label>對方<select id="eq">${players.map((_,p)=>`<option value="${p}">${esc(players[p].name)}</option>`).join('')}</select></label><p class="muted">${esc(x.mode==='all'?'其餘三家付款':x.mode==='payall'?'玩家付給其餘三家':x.mode==='burn'?'只扣玩家':'玩家付給對方')}</p>`,B('取消','close')+P('確認記錄','submit'),()=>{const p=+$('#ep').value,q=+$('#eq').value,n=+$('#ea').value;if(!Number.isFinite(n)||n<=0)throw Error('請輸入大於0的金額');if(x.mode==='one'&&p===q)throw Error('付款人與收款人不能相同');const ds=[0,0,0,0];if(x.mode==='burn')ds[p]-=n;else if(x.mode==='one'){ds[p]-=n;ds[q]+=n;}else players.forEach((_,i)=>{if(i!==p){const v=x.mode==='all'?n:-n;ds[p]+=v;ds[i]-=v;}});record(x.name,ds,{kind:'event'});go('table');note('已記錄'+x.name,true);});break;}
 case 'undo':if(s.history.length){const r=s.history.pop();Object.assign(s,clone(r.before));close();render();note('已撤銷上一筆');}else note('沒有可撤銷的紀錄');break;
 case 'draw':if(confirm('記錄流局？')){record('流局',[0,0,0,0],{kind:'draw'});if(s.c.game==='hk'||!s.c.draw)advance(false);render();note('已記錄流局',true);}break;
 case 'ledger':panel('未結拉數',s.ledger.slice(s.pageNo*4,s.pageNo*4+4).map(x=>`<div class="ledger-row">${label(x.from)} → ${label(x.to)}<strong>$${x.amount} · 拉${x.k}口</strong></div>`).join('')||'<p>無未結拉數</p>',B('關閉','close'));break;
 case 'history-tab':s.historyTab=d.v;s.pageNo=0;render();break;case 'record':s.record+=+d.d;s.pageNo=0;render();break;
 case 'edit-player':{const p=+d.p;panel('編輯玩家',`<label>名稱<input id="pn" value="${esc(players[p].name)}"></label><label>Emoji<select id="pe">${['🐶','🐯','🐉','🦊','🐼','🐰','🦁','🐢'].map(e=>`<option ${e===players[p].emoji?'selected':''}>${e}</option>`).join('')}</select></label>`,B('取消','close')+P('儲存','submit'),()=>{const n=$('#pn').value.trim();if(!n)throw Error('請輸入名稱');players[p].name=n;players[p].emoji=$('#pe').value;close();render();});break;}
 case 'seats':panel('玩家座位',s.seat.map((p,i)=>`<label>${winds[i]}位<select data-seat="${i}">${players.map((_,q)=>`<option value="${q}" ${p===q?'selected':''}>${esc(players[q].name)}</option>`).join('')}</select></label>`).join(''),P('完成','close'));break;
 case 'fan-table':{const R=engine().buildRules(s.c.over),ids=Object.keys(R).sort((a,b)=>R[a].fan-R[b].fan);panel('番數表',ids.slice(s.pageNo*4,s.pageNo*4+4).map(id=>`<label>${esc(R[id].name)}<input data-rule="${id}" type="number" min="0" value="${R[id].fan}"></label>`).join(''),pager('rule-page',s.pageNo,Math.ceil(ids.length/4))+B('完成','close'));break;}
 case 'rule-page':s.pageNo+=+d.d;act('fan-table',{});break;
 case 'appearance':panel('外觀字體',B('標準文字','font','data-size="16"')+B('大字','font','data-size="18"'),P('完成','close'));break;case 'font':document.documentElement.style.fontSize=d.size+'px';break;
 case 'backup':{const blob=new Blob([JSON.stringify({format:'mockup-engine-2',state:s,players},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),el=document.createElement('a');el.href=url;el.download='mahjong-2-backup.json';el.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
 case 'about':panel('版本說明','<p>2.0 計番引擎接駁版</p><p>資料只保留於本次開啟；離開前可匯出備份。百搭搜尋、多響、包牌及斬拉確認尚未接駁。</p>',P('關閉','close'));break;
 case 'close':close();render();break;case 'submit':if(submit)submit();break;
 }}catch(e){note(e.message||'操作未完成');}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)act(b.dataset.action,b.dataset);});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset.field){const k=el.dataset.field,v=Number(el.value);if(k==='dealer')s.dealer=v;else if(Number.isFinite(v)&&v>=0)s.c[k]=v;else note('請輸入有效數值');}if(el.dataset.rule){const v=Number(el.value);if(Number.isFinite(v)&&v>=0)s.c.over[el.dataset.rule]={fan:v};}if(el.dataset.seat!==undefined){const i=+el.dataset.seat,j=s.seat.indexOf(+el.value);[s.seat[i],s.seat[j]]=[s.seat[j],s.seat[i]];act('seats',{});}});
$('#back').addEventListener('click',()=>go(({preset:'game',basic:'preset',advanced:'basic',players:'preset',summary:'players',method:'table',editor:'method',quick:'method',review:s.e.mode==='quick'?'quick':'editor'})[s.page]||'table'));
render();
})(typeof window!=='undefined'?window:globalThis);
