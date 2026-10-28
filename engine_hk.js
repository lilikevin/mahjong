(function(root){
'use strict';
const SUITS=['萬','筒','索'], HON='東南西北中發白';
const tName=i=>i<27?(i%9+1)+SUITS[(i/9)|0]:HON[i-27];
const suitOf=i=>i<27?((i/9)|0):3;
const numOf=i=>i<27?(i%9+1):0;
const isHon=i=>i>=27;
const FLOWERS=['春','夏','秋','冬','梅','蘭','菊','竹'];
const YAO=[0,8,9,17,18,26,27,28,29,30,31,32,33];
const RAW=[
['pinghu','平糊',1],['zimo','自摸',1],['sanyuan','三元牌(每坎)',1],['fengpai','風牌(門風 / 圈風)',1],['huayao','花么',1],
['qiangkong','搶槓',1],['kongshang','槓上自摸',1],['haidi','海底撈月',1],['menqing','門前清(無花規則)',1],
['zhenghua','門風花(正花)',1],['wuhua','無花',1],['yitaihua','一台花',1],
['hunyise','混一色',3],['duidui','對對糊',3],['xiaosanyuan','小三元',3],['xiaohuahu','小花糊(七張花,不加自摸)',3],
['dasanyuan','大三元',5],['qingyise','清一色',7],
['quanfanzi','全番子',10],['xiaosixi','小四喜',10],['daxixi','大四喜',10],['kankan','坎坎糊',10],['shibaluohan','十八羅漢',10],
['qingyaojiu','清么九',10],['tianhu','天糊',10],['dihu','地糊',10],['shisanyao','十三么',10],['gsg','槓上槓自摸',10],
['jiuzi','九子連環',10],['dahuahu','大花糊(八張花)',10]
];
const MANUAL=['xiaohuahu','dahuahu'];
const FANS=RAW.map(r=>({id:r[0],name:r[1],fan:r[2],fanC:null,manual:MANUAL.indexOf(r[0])>=0}));
const FLAGS=[['menqing','門前清'],['qiangkong','搶槓'],['kongshang','槓上自摸'],['haidi','海底撈月'],['gsg','槓上槓自摸'],['tianhu','天糊'],['dihu','地糊']];
const INSTANT=[
 {id:'zhahu',name:'詐糊(扣例牌分,不加給他家)',amt:'cap',mode:'burn'},
 {id:'penalty',name:'犯規罰分(自訂,扣分)',amt:0,mode:'burn'}
];
function buildRules(over){
  const R={}; FANS.forEach(f=>{R[f.id]={id:f.id,name:f.name,fan:f.fan,fanC:null,manual:f.manual};});
  if(over) Object.keys(over).forEach(k=>{ if(R[k]){ const o=over[k]; if(o.fan!=null&&!isNaN(o.fan)) R[k].fan=+o.fan; }});
  return R;
}
function valueOf(R,it){ const r=R[it.id]; if(!r) return 0; return r.fan*(it.n===undefined?1:it.n); }
function decompose(cnt,nSets){ return MJCORE.decompose(cnt,nSets); }
function isShisan(cnt){
  if(!YAO.every(t=>cnt[t]>=1)) return false;
  let tot=0,dbl=0;
  for(let t=0;t<34;t++){ if(cnt[t]>0&&YAO.indexOf(t)<0) return false; if(YAO.indexOf(t)>=0){ if(cnt[t]===2) dbl++; else if(cnt[t]!==1) return false; tot+=cnt[t]; } }
  return tot===14&&dbl===1;
}
function isJiuzi(cnt){
  for(let su=0;su<3;su++){
    const base=[3,1,1,1,1,1,1,1,3]; let ok=true, extra=0, tot=0;
    for(let n=0;n<9;n++){ const c=cnt[su*9+n]; tot+=c; if(c<base[n]) ok=false; else extra+=c-base[n]; }
    if(ok&&extra===1&&tot===14) return true;
  }
  return false;
}
function placements(D,w){
  const out=[];
  if(D.pair===w) out.push({kind:'pair',idx:-1});
  D.sets.forEach((s,idx)=>{
    if(s.t==='pung'&&s.tile===w) out.push({kind:'pung',idx});
    if(s.t==='chow'&&w>=s.tile&&w<=s.tile+2) out.push({kind:'chow',idx});
  });
  return out;
}
function stateItems(ctx,items,concealedAll){
  const R=ctx.R; const push=(id,n)=>{ n=n===undefined?1:n; if(n>0&&R[id]) items.push({id,n,closed:false}); };
  const f=ctx.flags||{};
  if(ctx.selfDraw) push('zimo');
  ['qiangkong','kongshang','haidi','gsg','tianhu','dihu'].forEach(k=>{ if(f[k]) push(k); });
  const fl=ctx.flowers||Array(8).fill(false), nf=fl.filter(Boolean).length;
  if(ctx.useFlowers){
    if(ctx.seatWind!=null&&ctx.seatWind>=0) push('zhenghua',(fl[ctx.seatWind]?1:0)+(fl[ctx.seatWind+4]?1:0));
    if(nf===0) push('wuhua');
    if(fl.slice(0,4).every(Boolean)) push('yitaihua');
    if(fl.slice(4).every(Boolean)) push('yitaihua');
    if(nf===8) push('dahuahu');
  } else if(concealedAll) push('menqing');
}
function evalBasic(ctx,sets,P,pl){
  const R=ctx.R, items=[]; const push=(id,n)=>{ n=n===undefined?1:n; if(n>0&&R[id]) items.push({id,n,closed:false}); };
  const chows=sets.filter(s=>s.t==='chow'), trips=sets.filter(s=>s.t!=='chow'), kongs=sets.filter(s=>s.t==='kong');
  const tilesAll=[]; sets.forEach(s=>{ if(s.t==='chow'){ tilesAll.push(s.tile,s.tile+1,s.tile+2); } else tilesAll.push(s.tile,s.tile,s.tile); }); tilesAll.push(P,P);
  const concealedAll=(ctx.concealed!=null)?!!ctx.concealed:sets.every(s=>!s.open&&s.t!=='kong');
  stateItems(ctx,items,concealedAll);
  if(chows.length===4) push('pinghu');
  if(chows.length===0) push('duidui');
  const dr=trips.filter(s=>s.tile>=31).length;
  push('sanyuan',dr);
  if(dr===3) push('dasanyuan'); else if(dr===2&&P>=31) push('xiaosanyuan');
  let fp=0;
  trips.forEach(s=>{ if(s.tile>=27&&s.tile<=30){ if(ctx.seatWind!=null&&s.tile===27+ctx.seatWind) fp++; if(ctx.roundWind!=null&&s.tile===27+ctx.roundWind) fp++; } });
  push('fengpai',fp);
  const wt=trips.filter(s=>s.tile>=27&&s.tile<=30).length;
  if(wt===4) push('daxixi'); else if(wt===3&&P>=27&&P<=30) push('xiaosixi');
  const hasHon=tilesAll.some(isHon);
  const suits=new Set(tilesAll.filter(t=>!isHon(t)).map(suitOf));
  if(suits.size===1&&hasHon) push('hunyise');
  else if(suits.size===1&&!hasHon) push('qingyise');
  if(suits.size===0) push('quanfanzi');
  if(tilesAll.every(t=>isHon(t)||numOf(t)===1||numOf(t)===9)) push('huayao');
  if(tilesAll.every(t=>!isHon(t)&&(numOf(t)===1||numOf(t)===9))) push('qingyaojiu');
  if(kongs.length===4) push('shibaluohan');
  const ac=trips.filter(s=>!s.ronPung&&s.t!=='kong').length;
  if(trips.length===4&&kongs.length===0&&ac===4&&concealedAll) push('kankan');
  // 1.5 SUP: 清么九/全番子 互斥 花么，十八羅漢 互斥 對對
  const has = id=>items.some(x=>x.id===id);
  if(has('qingyaojiu')||has('quanfanzi')){
    for(let i=items.length-1;i>=0;i--) if(items[i].id==='huayao') items.splice(i,1);
  }
  if(has('shibaluohan')){
    for(let i=items.length-1;i>=0;i--) if(items[i].id==='duidui') items.splice(i,1);
  }
  return items;
}
function basic(inp){
  const ctx={R:buildRules(null),flowers:inp.flowers,selfDraw:!!inp.selfDraw,flags:inp.flags||{},seatWind:inp.seatWind,useFlowers:!!inp.useFlowers};
  const items=[]; stateItems(ctx,items,!!inp.concealed);
  return items;
}
function analyze(inp,over){
  const R=buildRules(over);
  const melds=inp.melds||[], hand=inp.hand||[];
  const nSets=4-melds.length;
  if(nSets<0) return {error:'副露多於4組'};
  const need=nSets*3+2;
  if(hand.length!==need) return {error:'手牌應為 '+need+' 張(現有 '+hand.length+' 張)'};
  const cnt=Array(34).fill(0); hand.forEach(t=>cnt[t]++);
  const all=cnt.slice();
  melds.forEach(m=>{ if(m.t==='chow'){all[m.tile]++;all[m.tile+1]++;all[m.tile+2]++;} else all[m.tile]+=(m.t==='kong'?4:3); });
  if(all.some(c=>c>4)) return {error:'同一款牌多於4張'};
  const win=inp.win;
  if(win==null||!cnt[win]) return {error:'請選擇食糊牌'};
  const base={R,flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{},seatWind:inp.seatWind,roundWind:inp.roundWind,useFlowers:!!inp.useFlowers,concealed:(inp.concealed!=null)?!!inp.concealed:null};
  const noMelds=melds.length===0;
  const complete=c=>decompose(c,nSets).length>0||(noMelds&&(isShisan(c)||isJiuzi(c)));
  let wc=null;
  const waits=()=>{ if(wc!==null) return wc; const b=cnt.slice(); b[win]--; let n=0; for(let w=0;w<34;w++){ b[w]++; if(all[w]-(w===win?1:0)+1<=4&&complete(b)) n++; b[w]--; } wc=n; return n; };
  const tot=items=>items.reduce((a,x)=>a+valueOf(R,x),0);
  const meldSets=melds.map(m=>({t:m.t,tile:m.tile,open:m.t==='kong'?m.open!==false:true}));
  const cands=[];
  decompose(cnt.slice(),nSets).forEach(D=>{
    placements(D,win).forEach(pl=>{
      const sets=meldSets.map(s=>({t:s.t,tile:s.tile,open:s.open})).concat(D.sets.map((s,i)=>({t:s.t,tile:s.tile,open:false,ronPung:(pl.kind==='pung'&&pl.idx===i&&!base.selfDraw)})));
      const items=evalBasic(base,sets,D.pair,pl);
      cands.push({items,total:tot(items)});
    });
  });
  const conSpecial=(base.concealed==null)?true:base.concealed;
  if(noMelds){
    if(isShisan(cnt)){ const it=[]; stateItems(base,it,conSpecial); if(R.shisanyao) it.push({id:'shisanyao',n:1,closed:false}); cands.push({items:it,total:tot(it)}); }
    if(isJiuzi(cnt)&&conSpecial&&(base.selfDraw||waits()===9)){ const it=[]; stateItems(base,it,true); if(R.jiuzi) it.push({id:'jiuzi',n:1,closed:false}); cands.push({items:it,total:tot(it)}); }
  }
  if(!cands.length) return {error:'未能組成食糊牌形(可改用手動選番)'};
  cands.sort((a,b)=>b.total-a.total);
  return {items:cands[0].items,total:cands[0].total,count:cands.length,waits:waits()};
}
function instantDeltas(ins,fv){
  const d=[0,0,0,0], amt=ins.amt*(fv===undefined?1:fv);
  if(ins.mode==='all'){ [0,1,2,3].forEach(i=>{ if(i!==ins.payee){ d[i]-=amt; d[ins.payee]+=amt; } }); }
  else if(ins.mode==='payall'){ [0,1,2,3].forEach(i=>{ if(i!==ins.payer){ d[ins.payer]-=amt; d[i]+=amt; } }); }
  else if(ins.mode==='burn'){ d[ins.payer]-=amt; }
  else { d[ins.payer]-=amt; d[ins.payee]+=amt; }
  return d;
}
function transfers(bal){
  const cr=[],db=[];
  bal.forEach((v,i)=>{ if(v>0) cr.push({i,v}); else if(v<0) db.push({i,v:-v}); });
  cr.sort((a,b)=>b.v-a.v); db.sort((a,b)=>b.v-a.v);
  const res=[];
  while(cr.length&&db.length){ const a=cr[0],b=db[0], m=Math.min(a.v,b.v); res.push({from:b.i,to:a.i,amt:m}); a.v-=m; b.v-=m; if(a.v===0) cr.shift(); if(b.v===0) db.shift(); }
  return res;
}
const API={id:'hk',tName,suitOf,numOf,isHon,FLOWERS,FANS,INSTANT,FLAGS,buildRules,valueOf,analyze,basic,instantDeltas,transfers,decompose,SUITS,HON};
if(typeof module!=='undefined'&&module.exports) module.exports=API; else root.MJHK=API;
})(typeof window!=='undefined'?window:globalThis);
