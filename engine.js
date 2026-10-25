(function(root){
'use strict';
const SUITS=['萬','筒','索'], HON='東南西北中發白';
const tName=i=>i<27?(i%9+1)+SUITS[(i/9)|0]:HON[i-27];
const suitOf=i=>i<27?((i/9)|0):3;
const numOf=i=>i<27?(i%9+1):0;
const isHon=i=>i>=27;
const FLOWERS=['春','夏','秋','冬','梅','蘭','菊','竹'];
const RAW=[
['zimo','自摸',1],['menqing','門清',5],['menqing_zimo','門清自摸',10],['ting','叮',5],
['qiangkong','搶槓',1],['huashang','花上自摸',2],['kongshang','槓上自摸',2],['haidi','海底撈月',10],
['shuangxiang','雙響',5],['sanxiang','三響',10],
['zi','字(每組)',2],['hua','花(每隻)',2],
['wuzihua','無字花',10],['wuzihua_pinghu','無字花大平糊',20],['pinghu','平糊',5],
['quewu','缺五',10],['queyimen','缺一門',10],['wumen','五門齊',10],['qimen','七門齊',20],
['duanyao','斷么九',10],['dudu','獨獨(真獨)',2],['jiadu','假獨',1],['jiangyan','將眼',2],['duipeng','對碰',2],
['minggang','明槓',1],['angang','暗槓',2],
['banggao','般高',5],['sanbanggao','三般高',30],['sibanggao','四般高',60],['wutongshun','五同順',50],
['sigui1','四歸一',5,10],['sigui2','四歸二',15,30],['sigui4','四歸四',40,80],
['zimei','姊妹',3],['quanzimei','全姊妹',20],['laoshaoshang','老少上',3],
['zalong','雜龍',5,10],['qinglong','清龍',10,20],['xiangfeng','三相逢',10,20],
['zabubu','雜步步高',5,10],['qingbubu','清步步高',10,20],['bubupeng','步步高碰',10],
['laoshaopeng','老少碰',5],['xiongdi','兄弟碰',5],['xiaosanxiongdi','小三兄弟碰',10],['sanxiongdi','三兄弟碰',20],
['lian2','二連碰',5],['lian3','三連碰',20],['lian4','四連碰',40],['lian5','五連碰',80],
['xlian3','小三連碰',20],['xlian4','小四連碰',30],['xlian5','小五連碰',60],['xlian6','小六連碰',120],
['an2','兩暗刻',5],['an3','三暗刻',15],['an4','四暗刻',30],['an5','五暗刻',60],
['duidui','對對糊',40],['hunyise','混一色',40],['qingyise','清一色',100],['ziyise','字一色',160],
['hundaiyao','混帶么',30],['qingdaiyao','清帶么',60],['quandaix','全帶X',80],['hundaix','混帶X(最多一款)',30],
['quanqiu','全求人',30],['banqiu','半求人',15],
['xiaosanfeng','小三風',20],['dasanfeng','大三風',40],['xiaosanyuan','小三元',30],['dasanyuan','大三元',60],
['xiaosixi','小四喜',80],['daxixi','大四喜',120],
['likgu','嚦咕嚦咕',60],
['tianhu','天胡',120],['dihu','地胡',80],['renhu','人胡',40],['tianting','天叮',40],
['dajie','大雞',30],['zimoji','自摸雞(鴨)',15],['qizi','七子',20],['sizi','四子',40],['shizi','十子',10],
['shiliubuda','十六不搭',60],['shisanyao','十三么',120],['kankan','坎坎糊',160]
];
const MANUAL=['hundaix','dajie','zimoji','qizi','sizi','shizi','shiliubuda','shisanyao','kankan'];
const FANS=RAW.map(r=>({id:r[0],name:r[1],fan:r[2],fanC:r[3]===undefined?null:r[3],manual:MANUAL.indexOf(r[0])>=0}));
const INSTANT=[
{id:'angang_i',name:'暗槓',amt:5,mode:'all'},{id:'yitaihua',name:'一台花',amt:5,mode:'all'},
{id:'yitaicao',name:'一台草',amt:3,mode:'all'},{id:'qi_qiang_yi',name:'七搶一',amt:30,mode:'one'},
{id:'yi_qiang_qi',name:'一搶七',amt:30,mode:'one'},{id:'bahua',name:'8隻花糊',amt:60,mode:'all'},
{id:'jiaocuopeng',name:'叫錯碰',amt:5,mode:'one'},{id:'cuogang',name:'錯槓糊',amt:10,mode:'one'},
{id:'zhahu',name:'詐糊',amt:50,mode:'one'}
];
const SUPPRESS={
 ziyise:['duidui','hundaiyao','qingdaiyao','quewu','zi'],
 qingdaiyao:['quewu','hundaiyao'],
 hundaiyao:['quewu'],
 an5:['duidui'],
 lian5:['duidui'],
 xlian6:['duidui','qingyise'],
 qinglong:['laoshaoshang'],
 quanqiu:['dudu','jiadu','banqiu'],
 qimen:['wumen'],
 wuzihua_pinghu:['pinghu','wuzihua'],
 menqing_zimo:['zimo','menqing'],
 tianhu:['zimo','menqing','menqing_zimo'],
 dihu:['menqing'], renhu:['menqing'],
 tianting:['ting'],
 dudu:['jiadu']
};
function applySuppress(items,info){
  const ids=new Set(items.map(i=>i.id));
  const kill=new Set();
  Object.keys(SUPPRESS).forEach(a=>{ if(ids.has(a)) SUPPRESS[a].forEach(b=>kill.add(b)); });
  if(ids.has('ziyise')&&info.concealed) ['an2','an3','an4','an5'].forEach(b=>kill.add(b));
  if(info.dx&&[1,2,8,9].indexOf(info.dx)>=0) kill.add('quewu');
  let out=items.filter(i=>!kill.has(i.id));
  if(ids.has('qingbubu')) out=out.map(i=>i.id==='zimei'?Object.assign({},i,{n:i.n-2}):i).filter(i=>i.n>0);
  return out;
}
function buildRules(over){
  const R={};
  FANS.forEach(f=>{R[f.id]={id:f.id,name:f.name,fan:f.fan,fanC:f.fanC,manual:f.manual};});
  if(over) Object.keys(over).forEach(k=>{ if(R[k]){ const o=over[k]; if(o.fan!=null&&!isNaN(o.fan)) R[k].fan=+o.fan; if(o.fanC!=null&&!isNaN(o.fanC)) R[k].fanC=+o.fanC; }});
  return R;
}
function valueOf(R,it){ const r=R[it.id]; if(!r) return 0; const u=(it.closed&&r.fanC!=null)?r.fanC:r.fan; return u*(it.n===undefined?1:it.n); }
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
      if(i<27&&numOf(i)<=7&&cnt[i+1]>0&&cnt[i+2]>0){
        cnt[i]--;cnt[i+1]--;cnt[i+2]--; sets.push({t:'chow',tile:i}); rec(); sets.pop(); cnt[i]++;cnt[i+1]++;cnt[i+2]++;
      }
    })();
    cnt[p]+=2;
  }
  return res;
}
function isLik(cnt){
  let t=0,p=0;
  for(const c of cnt){ if(c===0) continue; if(c===3) t++; else if(c===2) p++; else return false; }
  return t===1&&p===7;
}
function placements(D,w){
  const out=[];
  if(D.pair===w) out.push({kind:'pair',idx:-1});
  D.sets.forEach((s,idx)=>{
    if(s.t==='pung'&&s.tile===w) out.push({kind:'pung',idx});
    if(s.t==='chow'&&w>=s.tile&&w<=s.tile+2){
      const pos=w-s.tile; let k;
      if(pos===1) k='mid';
      else if((pos===0&&numOf(s.tile)===7)||(pos===2&&numOf(s.tile)===1)) k='edge';
      else k='two';
      out.push({kind:k,idx});
    }
  });
  return out;
}
function perms3(){ return [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]; }
function common(ctx,items,tilesAll,concealed,o){
  const push=(id,n,closed)=>{ n=n===undefined?1:n; if(n>0) items.push({id,n,closed:!!closed}); };
  const hasHon=tilesAll.some(isHon);
  const suits=new Set(tilesAll.filter(t=>!isHon(t)).map(suitOf));
  const fl=ctx.flowers.filter(Boolean).length;
  if(o.skipMenqing){ if(ctx.selfDraw) push('zimo'); }
  else if(concealed&&ctx.selfDraw) push('menqing_zimo');
  else if(concealed) push('menqing');
  else if(ctx.selfDraw) push('zimo');
  ['ting','qiangkong','huashang','kongshang','haidi','tianhu','dihu','renhu','tianting','shuangxiang','sanxiang'].forEach(k=>{ if(ctx.flags&&ctx.flags[k]) push(k); });
  push('hua',fl);
  if(!o.pinghu&&!hasHon&&fl===0) push('wuzihua');
  if(tilesAll.every(t=>numOf(t)!==5)) push('quewu');
  if(suits.size===2) push('queyimen');
  const wind=tilesAll.some(t=>t>=27&&t<=30), drag=tilesAll.some(t=>t>=31);
  if(suits.size===3&&wind&&drag){
    const a=ctx.flowers.slice(0,4).some(Boolean), b=ctx.flowers.slice(4).some(Boolean);
    if(a&&b) push('qimen'); else push('wumen');
  }
  if(tilesAll.every(t=>!isHon(t)&&numOf(t)>=2&&numOf(t)<=8)) push('duanyao');
  if(suits.size===1&&hasHon) push('hunyise');
  else if(suits.size===1&&!hasHon) push('qingyise');
  else if(suits.size===0) push('ziyise');
}
function evalStructure(ctx,sets,P,pl){
  const items=[]; const R=ctx.R;
  const push=(id,n,closed)=>{ n=n===undefined?1:n; if(n>0) items.push({id,n,closed:!!closed}); };
  const pickMax=c=>{ let b=null,bv=0; for(const x of c){ const v=valueOf(R,x); if(v>bv){bv=v;b=x;} } if(b) items.push(b); };
  const chows=sets.filter(s=>s.t==='chow'), trips=sets.filter(s=>s.t!=='chow'), kongs=sets.filter(s=>s.t==='kong');
  const tilesOf=s=>s.t==='chow'?[s.tile,s.tile+1,s.tile+2]:[s.tile,s.tile,s.tile];
  const tilesAll=[]; sets.forEach(s=>tilesOf(s).forEach(t=>tilesAll.push(t))); tilesAll.push(P,P);
  const concealed=sets.every(s=>!s.open);
  const fl=ctx.flowers.filter(Boolean).length;
  const pinghu=trips.length===0&&!isHon(P);
  common(ctx,items,tilesAll,concealed,{pinghu});
  if(pinghu){ if(fl===0) push('wuzihua_pinghu'); else push('pinghu'); }
  push('minggang',kongs.filter(s=>s.open).length);
  push('angang',kongs.filter(s=>!s.open).length);
  if(!isHon(P)&&[2,5,8].indexOf(numOf(P))>=0) push('jiangyan');
  const waits=ctx.getWaits();
  if(waits===1) push('dudu');
  else if(pl.kind==='edge'||pl.kind==='mid'||pl.kind==='pair') push('jiadu');
  if(pl.kind==='pung'&&waits>=2) push('duipeng');
  if(chows.length===0) push('duidui');
  const byS=[[],[],[]]; chows.forEach(s=>byS[suitOf(s.tile)].push(s));
  const cs=(su,num)=>byS[su].filter(s=>numOf(s.tile)===num);
  const closedOK=arrs=>arrs.every(a=>a.some(s=>!s.open));
  const kc={}; chows.forEach(s=>{kc[s.tile]=(kc[s.tile]||0)+1;});
  Object.keys(kc).forEach(k=>{ const c=kc[k]; if(c===2) push('banggao'); else if(c===3) push('sanbanggao'); else if(c===4) push('sibanggao'); else if(c>=5){ push('sibanggao'); push('wutongshun'); } });
  for(let su=0;su<3;su++){
    const ns=Array.from(new Set(byS[su].map(s=>numOf(s.tile)))).sort((a,b)=>a-b);
    let pairs=0; for(let i=1;i<ns.length;i++) if(ns[i]-ns[i-1]===1) pairs++;
    push('zimei',pairs);
    if(cs(su,1).length&&cs(su,7).length) push('laoshaoshang');
  }
  if(chows.length===5){
    const su0=suitOf(chows[0].tile);
    const ns=Array.from(new Set(chows.map(s=>numOf(s.tile)))).sort((a,b)=>a-b);
    if(chows.every(s=>suitOf(s.tile)===su0)&&ns.length===5&&ns[4]-ns[0]===4) push('quanzimei');
  }
  let dragon=null;
  for(let su=0;su<3&&!dragon;su++){ const a=[cs(su,1),cs(su,4),cs(su,7)]; if(a.every(x=>x.length)) dragon={id:'qinglong',closed:closedOK(a)}; }
  if(!dragon){ for(const p of perms3()){ const a=[cs(p[0],1),cs(p[1],4),cs(p[2],7)]; if(a.every(x=>x.length)){ dragon={id:'zalong',closed:closedOK(a)}; break; } } }
  if(dragon) push(dragon.id,1,dragon.closed);
  for(let n=1;n<=7;n++){ const a=[cs(0,n),cs(1,n),cs(2,n)]; if(a.every(x=>x.length)) push('xiangfeng',1,closedOK(a)); }
  const bb=[];
  for(let su=0;su<3;su++) for(let n=1;n<=5;n++){ const a=[cs(su,n),cs(su,n+1),cs(su,n+2)]; if(a.every(x=>x.length)) bb.push({id:'qingbubu',n:1,closed:closedOK(a)}); }
  for(let n=1;n<=5;n++) for(const p of perms3()){ const a=[cs(p[0],n),cs(p[1],n+1),cs(p[2],n+2)]; if(a.every(x=>x.length)) bb.push({id:'zabubu',n:1,closed:closedOK(a)}); }
  pickMax(bb);
  const tn=[{},{},{}]; trips.forEach(s=>{ if(s.tile<27) tn[suitOf(s.tile)][numOf(s.tile)]=true; });
  for(let su=0;su<3;su++) if(tn[su][1]&&tn[su][9]) push('laoshaopeng');
  let bp=false;
  for(let n=1;n<=7&&!bp;n++) for(const p of perms3()){ if(tn[p[0]][n]&&tn[p[1]][n+1]&&tn[p[2]][n+2]){ bp=true; break; } }
  if(bp) push('bubupeng');
  for(let n=1;n<=9;n++){
    const sw=[0,1,2].filter(su=>tn[su][n]);
    if(sw.length===3) push('sanxiongdi');
    else if(sw.length===2){
      const third=[0,1,2].find(su=>!tn[su][n]);
      if(P<27&&suitOf(P)===third&&numOf(P)===n) push('xiaosanxiongdi'); else push('xiongdi');
    }
  }
  const ln=[];
  for(let su=0;su<3;su++){
    const ns=Object.keys(tn[su]).map(Number).sort((a,b)=>a-b);
    let i=0;
    while(i<ns.length){
      let j=i; while(j+1<ns.length&&ns[j+1]===ns[j]+1) j++;
      const L=j-i+1;
      if(L>=2) ln.push({id:'lian'+L,n:1});
      if(L>=2&&P<27&&suitOf(P)===su&&(numOf(P)===ns[i]-1||numOf(P)===ns[j]+1)) ln.push({id:'xlian'+(L+1),n:1});
      i=j+1;
    }
  }
  pickMax(ln.filter(x=>R[x.id]));
  const ac=trips.filter(s=>!s.open&&!s.ronPung).length;
  if(ac>=2) push('an'+Math.min(ac,5));
  const groups=sets.map(tilesOf); groups.push([P,P]);
  const hasT=g=>g.some(t=>!isHon(t)&&(numOf(t)===1||numOf(t)===9));
  const hasTH=g=>g.some(t=>isHon(t)||numOf(t)===1||numOf(t)===9);
  const dc=[]; let dx=0;
  const hasHon=tilesAll.some(isHon);
  if(groups.every(hasT)) dc.push({id:'qingdaiyao',n:1});
  else if(groups.every(hasTH)&&hasHon) dc.push({id:'hundaiyao',n:1});
  for(let x=1;x<=9;x++) if(groups.every(g=>g.some(t=>!isHon(t)&&numOf(t)===x))) dc.push({id:'quandaix',n:1,x});
  pickMax(dc);
  const chosen=items.find(i=>i.id==='quandaix'); if(chosen) dx=chosen.x;
  const openN=sets.filter(s=>s.open).length;
  if(!ctx.selfDraw){ if(openN===5) push('quanqiu'); else if(openN===4) push('banqiu'); }
  const wt=trips.filter(s=>s.tile>=27&&s.tile<=30).length, pw=P>=27&&P<=30;
  let cov=0;
  if(wt===4){ push('daxixi'); cov+=4; } else if(wt===3&&pw){ push('xiaosixi'); cov+=3; } else if(wt===3){ push('dasanfeng'); cov+=3; } else if(wt===2&&pw){ push('xiaosanfeng'); cov+=2; }
  const dt=trips.filter(s=>s.tile>=31).length, pdg=P>=31;
  if(dt===3){ push('dasanyuan'); cov+=3; } else if(dt===2&&pdg){ push('xiaosanyuan'); cov+=2; }
  push('zi',Math.max(0,trips.filter(s=>isHon(s.tile)).length-cov));
  const tc=Array(34).fill(0);
  sets.forEach(s=>{ if(s.t==='chow'){tc[s.tile]++;tc[s.tile+1]++;tc[s.tile+2]++;} else tc[s.tile]+=(s.t==='kong'?4:3); });
  tc[P]+=2;
  const kt=new Set(kongs.map(k=>k.tile));
  const g4=[];
  for(let t=0;t<34;t++) if(tc[t]===4&&!kt.has(t)){
    const open=sets.some(s=>s.open&&(s.t==='chow'?(t>=s.tile&&t<=s.tile+2):s.tile===t));
    g4.push(open);
  }
  if(g4.length){
    const closed=g4.every(o=>!o), n=g4.length;
    if(n===1) push('sigui1',1,closed); else if(n===2) push('sigui2',1,closed);
    else if(n===3){ push('sigui2',1,closed); push('sigui1',1,closed); } else push('sigui4',1,closed);
  }
  return applySuppress(items,{concealed,dx});
}
function evalLik(ctx,cnt){
  const items=[]; const push=(id,n)=>{ n=n===undefined?1:n; if(n>0) items.push({id,n,closed:false}); };
  const tilesAll=[]; cnt.forEach((c,t)=>{ for(let i=0;i<c;i++) tilesAll.push(t); });
  common(ctx,items,tilesAll,true,{skipMenqing:true});
  const trip=cnt.findIndex(c=>c===3);
  if(isHon(trip)) push('zi');
  push('likgu');
  if(ctx.getWaits()===1) push('dudu');
  return applySuppress(items,{concealed:true,dx:0});
}
function basic(inp){
  const ctx={flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{}};
  const items=[]; const push=(id,n)=>{ if(n>0) items.push({id,n:n===undefined?1:n,closed:false}); };
  if(ctx.selfDraw) push('zimo',1);
  ['ting','qiangkong','huashang','kongshang','haidi','tianhu','dihu','renhu','tianting','shuangxiang','sanxiang'].forEach(k=>{ if(ctx.flags[k]) push(k,1); });
  push('hua',ctx.flowers.filter(Boolean).length);
  return applySuppress(items,{concealed:false,dx:0});
}
function analyze(inp,over){
  const R=buildRules(over);
  const melds=inp.melds||[], hand=inp.hand||[];
  const nSets=5-melds.length;
  if(nSets<0) return {error:'副露多於5組'};
  const need=nSets*3+2;
  if(hand.length!==need) return {error:'手牌應為 '+need+' 張(現有 '+hand.length+' 張)'};
  const cnt=Array(34).fill(0); hand.forEach(t=>cnt[t]++);
  const all=cnt.slice();
  melds.forEach(m=>{ if(m.t==='chow'){all[m.tile]++;all[m.tile+1]++;all[m.tile+2]++;} else all[m.tile]+=(m.t==='kong'?4:3); });
  if(all.some(c=>c>4)) return {error:'同一款牌多於4張'};
  const win=inp.win;
  if(win==null||!cnt[win]) return {error:'請選擇和牌'};
  const base={R,flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{}};
  let wcache=null;
  base.getWaits=function(){
    if(wcache!==null) return wcache;
    const b=cnt.slice(); b[win]--; let n=0;
    for(let w=0;w<34;w++){
      b[w]++;
      if(all[w]-(w===win?1:0)+1<=4&&(decompose(b,nSets).length||(melds.length===0&&isLik(b)))) n++;
      b[w]--;
    }
    wcache=n; return n;
  };
  const meldSets=melds.map(m=>({t:m.t,tile:m.tile,open:m.t==='kong'?m.open!==false:true}));
  const cands=[];
  decompose(cnt.slice(),nSets).forEach(D=>{
    placements(D,win).forEach(pl=>{
      const sets=meldSets.map(s=>({t:s.t,tile:s.tile,open:s.open})).concat(D.sets.map((s,i)=>({t:s.t,tile:s.tile,open:false,ronPung:(pl.kind==='pung'&&pl.idx===i&&!base.selfDraw)})));
      const items=evalStructure(base,sets,D.pair,pl);
      cands.push({items,total:items.reduce((a,x)=>a+valueOf(R,x),0)});
    });
  });
  if(melds.length===0&&isLik(cnt)){
    const items=evalLik(base,cnt);
    cands.push({items,total:items.reduce((a,x)=>a+valueOf(R,x),0)});
  }
  if(!cands.length) return {error:'未能組成糊牌型(可略過牌型,改用手動選番)'};
  cands.sort((a,b)=>b.total-a.total);
  return {items:cands[0].items,total:cands[0].total,count:cands.length,waits:base.getWaits()};
}
function settle(winners,dealer,streak,cfg){
  const d=[0,0,0,0], bonus=1+2*streak, base=cfg.fanValue*cfg.baseMult;
  winners.forEach(w=>{
    const payers=w.self?[0,1,2,3].filter(i=>i!==w.p):[w.disc];
    payers.forEach(q=>{
      const fan=w.total+((q===dealer||w.p===dealer)?bonus:0);
      const amt=base+fan*cfg.fanValue;
      d[q]-=amt; d[w.p]+=amt;
    });
  });
  return d;
}
function instantDeltas(ins,fv){
  const d=[0,0,0,0], amt=ins.amt*fv;
  if(ins.mode==='all'){ [0,1,2,3].forEach(i=>{ if(i!==ins.payee){ d[i]-=amt; d[ins.payee]+=amt; } }); }
  else { d[ins.payer]-=amt; d[ins.payee]+=amt; }
  return d;
}
function transfers(bal){
  const cr=[],db=[];
  bal.forEach((v,i)=>{ if(v>0) cr.push({i,v}); else if(v<0) db.push({i,v:-v}); });
  cr.sort((a,b)=>b.v-a.v); db.sort((a,b)=>b.v-a.v);
  const res=[];
  while(cr.length&&db.length){
    const a=cr[0],b=db[0], m=Math.min(a.v,b.v);
    res.push({from:b.i,to:a.i,amt:m}); a.v-=m; b.v-=m;
    if(a.v===0) cr.shift(); if(b.v===0) db.shift();
  }
  return res;
}
const API={tName,suitOf,numOf,isHon,FLOWERS,FANS,INSTANT,SUPPRESS,buildRules,valueOf,analyze,basic,settle,instantDeltas,transfers,decompose,isLik,SUITS,HON};
if(typeof module!=='undefined'&&module.exports) module.exports=API; else root.MJ=API;
})(typeof window!=='undefined'?window:globalThis);
