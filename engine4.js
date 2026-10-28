(function(root){
'use strict';
const SUITS=['萬','筒','索'],HON='東南西北中發白';
const tName=i=>i<27?(i%9+1)+SUITS[(i/9)|0]:HON[i-27];
const suitOf=i=>i<27?((i/9)|0):3;
const numOf=i=>i<27?(i%9+1):0;
const isHon=i=>i>=27;
const FLOWERS=['春','夏','秋','冬','梅','蘭','菊','竹'];
const YAO=[0,8,9,17,18,26,27,28,29,30,31,32,33];
const GREEN=[19,20,21,23,25,32];
/* 港式台牌 app 預設番數表(hoitoi.hk 番數表,2026-09-22) */
const RAW=[
['di','底',5],['zimo','自摸',1],['menqing','門清',5],['menmo','門清一摸',8],['ting','聽牌(叮)',5],['jishi','即食',5],
['mqdingdi','門清大叮底',20],['mqdingdimo','門清一摸(叮底)',3],
['duipeng','對碰',2],['dudu','獨獨',2],['jiadu','假獨',1],['jiangyan','將眼',2],['banqiu','半求人',15],['quanqiu','全求人',30],
['wuhua','無花',2],['hua','花',2],['qiqiangyi','七搶一/一搶七',30],['baxian','八仙過海',40],
['wuzi','無字',2],['wuzihua','無字花',10],['zi','字',2],['xiaosanfeng','小三風',20],['dasanfeng','大三風',40],['xiaosixi','小四喜',80],['daxixi','大四喜',120],['xiaosanyuan','小三元',30],['dasanyuan','大三元',60],['ziyise','字一色',100],
['pinghu','平糊',5],['wuzihua_pinghu','無字花大平',20],['queyimen','缺一門',10],['xiaowumen','小五門齊',10],['dawumen','大五門齊',15],['xiaoqimen','小七門齊',15],['daqimen','大七門齊',20],['dayu5','大於五',80],['xiaoyu5','少於五',80],['lvyise','綠一色',120],['jigu','雞糊',30],['yagu','鴨糊',15],
['duidui','對對糊',40],['kankan','間間糊',120],['an2','二暗刻',5],['an3','三暗刻',15],['an4','四暗刻',30],['an5','五暗刻',80],['gang','槓',2],
['hundaiyao','混帶么',20],['quandaiyao','全帶么',80],['hunyao','混么',60],['quanyao','全么',120],['duanyao','斷么',5],['laoshaoshang','老少(上)',3],['laoshaopeng','老少(碰)',5],
['qinglong','清龍',10,20],['zalong','雜龍',5,10],
['sigui1','四歸一',5,10],['sigui2','四歸二',10,20],['sigui4','四歸四',20,40],['banggao','般高',5,10],['shuangbanggao','雙般高',15,30],['yise3','一色三同順',20,40],['yise4','一色四同順',100,200],['yibu3','一色步步高',15,30],['yibu3t','一色步步高(跳,預設不計)',0,0],['quanyibu','全一色步步高',80,160],['lian2','二連刻',5],['xlian3','小三連刻',10],['lian3','三連刻',20],['qingyise','清一色',80],
['hunyise','混一色',40],['zimei','姊妹',3],['shuangzimei','雙姊妹',10],['quanzimei','全姊妹',20],['sanxiangfeng','三相逢',10,20],['tong4','四同順',20,40],['tong5','五同順',40,80],['sanbu3','三色步步高',5,10],['sanbu3t','三色步步高(跳,預設不計)',0,0],['quansanbu','全三色步步高',40,80],['xiongdi','兄弟',5],['xiaosanxiongdi','小三兄弟',10],['daxiongdi','大三兄弟',20],['xsanlian','小三色連刻',8],['dsanlian','大三色連刻',15],
['hundaix','混帶X',20],['hunx','混X',60],['quandaix','全帶X',80],['quewu','缺五',10],
['tianting','天叮',60],['diting','地叮',40],['shizi','十子',10],['qizi','七子',20],['sizi','四子',40],['hedi','河底撈魚',5],['haidi','海底撈月',10],['kongshang','槓上自摸',2],['huashang','花上自摸',2],['weiwei','連續尾牌食糊(n=連續補牌次數,至少2)',2],['qiangkong','搶槓',5],['shuangxiang','一炮雙響',5],['sanxiang','一炮三響',10],['fanxue2','反雪(雙響)',10],['fanxue3','反雪(三響)',20],['tianhu','天糊',120],['dihu','地糊',80],['renhu','人糊',60],
['likgu','嚦咕嚦咕',40],['lik8','嚦咕嚦咕(8對)',50],['shiliubuda','十六不搭',60],['budafei','十六不搭(叫16飛)',70],['busanxf','不搭三相逢',80],['budazalong','不搭雜龍',80],['shisanyao','十三么',120]
];
const MANUAL=['weiwei'];
const FANS=RAW.map(r=>({id:r[0],name:r[1],fan:r[2],fanC:r[3]===undefined?null:r[3],manual:MANUAL.indexOf(r[0])>=0}));
const FLAGS=[['ting','叮'],['jishi','即食'],['tianting','天叮'],['diting','地叮'],['shizi','十子'],['qizi','七子'],['sizi','四子'],['hedi','河底撈魚'],['haidi','海底撈月'],['kongshang','槓上自摸'],['huashang','花上自摸'],['qiangkong','搶槓'],['shuangxiang','一炮雙響'],['sanxiang','一炮三響'],['fanxue2','反雪(雙響)'],['fanxue3','反雪(三響)'],['qiqiangyi','七搶一/一搶七'],['tianhu','天糊'],['dihu','地糊'],['renhu','人糊']];
const EVENT=['jishi','shizi','qizi','sizi','hedi','haidi','kongshang','huashang','qiangkong','shuangxiang','sanxiang','fanxue2','fanxue3','tianhu','dihu','renhu','tianting','diting'];
const INSTANT=[{id:'angang_i',name:'暗槓(即收即賠,金額自訂)',amt:0,mode:'all'}];
const SUP={
 mqdingdi:['di','menqing','ting','menmo','zimo'],
 tianting:['mqdingdi','di','menqing','ting','menmo','zimo'], diting:['mqdingdi','di','menqing','ting','menmo','zimo'],
 mqdingdimo:['zimo','menmo'], menmo:['menqing','zimo'],
 kankan:['duidui','an2','an3','an4','an5','menqing','menmo','zimo'],
 tianhu:['zimo','menmo','mqdingdimo','sizi','qizi','shizi'],
 dihu:['renhu','sizi','qizi','shizi','jishi'], renhu:['sizi','qizi','shizi','jishi'], sizi:['qizi','shizi'], qizi:['shizi'],
 quanqiu:['banqiu'], qiqiangyi:['hua','wuhua'], baxian:['hua','wuhua'],
 wuzihua:['wuzi','wuhua'], wuzihua_pinghu:['pinghu','wuzi','wuhua','wuzihua'],
 ziyise:['zi','duidui','hunyise','hunyao','hundaiyao'],
 qingyise:['hunyise','queyimen','wuzi'], hunyao:['hundaiyao','duidui','hunyise'], quanyao:['hunyao','quandaiyao','hundaiyao','duidui','quewu'], quandaiyao:['hundaiyao','quewu'],
 dayu5:['wuzi','quewu'], xiaoyu5:['wuzi','quewu'], lvyise:['hunyise','qingyise','queyimen'],
 dawumen:['xiaowumen'], xiaoqimen:['xiaowumen'], daqimen:['xiaowumen','dawumen','xiaoqimen'],
 quanzimei:['zimei','shuangzimei'], shuangzimei:['zimei'], sanxiangfeng:['zimei'],
 tong5:['tong4','banggao','zimei','quanzimei'], tong4:['banggao'], quanyibu:['yibu3','yibu3t'], quansanbu:['sanbu3','sanbu3t'],
 hunx:['hundaix','duidui'], quandaix:['hundaix'],
 xiaosixi:['dasanfeng','xiaosanfeng'], dasanfeng:['xiaosanfeng'], dasanyuan:['xiaosanyuan']
};
function applySuppress(items){
  const ids=new Set(items.map(i=>i.id)), kill=new Set();
  Object.keys(SUP).forEach(a=>{ if(ids.has(a)) SUP[a].forEach(b=>kill.add(b)); });
  return items.filter(i=>!kill.has(i.id));
}
function buildRules(over){
  const R={}; FANS.forEach(f=>{R[f.id]={id:f.id,name:f.name,fan:f.fan,fanC:f.fanC,manual:f.manual};});
  if(over) Object.keys(over).forEach(k=>{ if(R[k]){ const o=over[k]; if(o.fan!=null&&!isNaN(o.fan)) R[k].fan=+o.fan; if(o.fanC!=null&&!isNaN(o.fanC)) R[k].fanC=+o.fanC; }});
  return R;
}
function valueOf(R,it){
  const r=R[it.id]; if(!r) return 0;
  if(it.id==='weiwei') return r.fan*(2*(it.n||2)+1);
  const u=(it.closed&&r.fanC!=null)?r.fanC:r.fan; return u*(it.n===undefined?1:it.n);
}
function decompose(cnt,nSets){ return MJCORE.decompose(cnt,nSets); }
function isLik(cnt){ let three=0; for(const c of cnt){ if(c===0||c===2||c===4) continue; if(c===3) three++; else return false; } return three===1; }
function isShisan(cnt){
  const isY=t=>YAO.indexOf(t)>=0;
  if(!YAO.every(t=>cnt[t]>=1)) return false;
  const c=cnt.slice();
  const ok=()=>{ let tot=0,dbl=0; for(let t=0;t<34;t++){ if(c[t]>0&&!isY(t)) return false; if(isY(t)){ if(c[t]===2) dbl++; else if(c[t]!==1) return false; tot+=c[t]; } } return tot===14&&dbl===1; };
  for(let t=0;t<34;t++){
    if(c[t]>=3){ c[t]-=3; const r=ok(); c[t]+=3; if(r) return true; }
    if(t<27&&numOf(t)<=7&&c[t]>0&&c[t+1]>0&&c[t+2]>0){ c[t]--;c[t+1]--;c[t+2]--; const r=ok(); c[t]++;c[t+1]++;c[t+2]++; if(r) return true; }
  }
  return false;
}
function budaInfo(cnt){
  let dbl=0,tot=0; const sets=[];
  for(let t=27;t<34;t++){ if(cnt[t]<1||cnt[t]>2) return null; if(cnt[t]===2) dbl++; tot+=cnt[t]; }
  for(let su=0;su<3;su++){
    const ns=[];
    for(let n=1;n<=9;n++){ const c=cnt[su*9+n-1]; if(c>2) return null; if(c>=1){ ns.push(n); if(c===2) dbl++; tot+=c; } }
    if(ns.length!==3) return null;
    for(let i=0;i<3;i++) for(let j=i+1;j<3;j++) if(ns[j]-ns[i]<3) return null;
    sets.push(ns);
  }
  if(!(dbl===1&&tot===17)) return null;
  const keys=sets.map(a=>a.join(','));
  const isLong=keys.every(k=>['1,4,7','2,5,8','3,6,9'].indexOf(k)>=0)&&new Set(keys).size===3;
  return {isLong,isFeng:new Set(keys).size===1};
}
function placements(D,w){
  const out=[];
  if(D.pair===w) out.push({kind:'pair',idx:-1});
  D.sets.forEach((s,idx)=>{
    if(s.t==='pung'&&s.tile===w) out.push({kind:'pung',idx});
    if(s.t==='chow'&&w>=s.tile&&w<=s.tile+2){
      const pos=w-s.tile; let k;
      if(pos===1) k='mid'; else if((pos===0&&numOf(s.tile)===7)||(pos===2&&numOf(s.tile)===1)) k='edge'; else k='two';
      out.push({kind:k,idx});
    }
  });
  return out;
}
function perms3(){ return [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]; }
const shareOK=(a,b)=>{ let s=0; a.forEach(x=>{ if(b.indexOf(x)>=0) s++; }); return s*2<Math.min(a.length,b.length); };
function packBest(R,occs){
  let best=[],bv=-1; const val=o=>valueOf(R,{id:o.id,n:1,closed:o.closed});
  (function dfs(i,chosen,v){
    if(v>bv){ bv=v; best=chosen.slice(); }
    for(let j=i;j<occs.length;j++){ const o=occs[j]; if(chosen.every(c=>shareOK(c.idxs,o.idxs))){ chosen.push(o); dfs(j+1,chosen,v+val(o)); chosen.pop(); } }
  })(0,[],0);
  return best;
}
function bestSingle(R,occs){
  let b=null,bv=0; occs.forEach(o=>{ const v=valueOf(R,{id:o.id,n:1,closed:o.closed}); if(v>bv){ bv=v; b=o; } }); return b;
}
function stateItems(ctx,items,concealed,tilesAll){
  const push=(id,n)=>{ n=n===undefined?1:n; if(n>0) items.push({id,n,closed:false}); };
  const f=ctx.flags||{};
  push('di');
  const tingAny=!!(f.ting||f.tianting||f.diting);
  if(concealed&&tingAny){ push('mqdingdi'); if(ctx.selfDraw) push('mqdingdimo'); }
  else {
    if(concealed){ if(ctx.selfDraw) push('menmo'); else push('menqing'); }
    else if(ctx.selfDraw) push('zimo');
    if(tingAny) push('ting');
  }
  EVENT.forEach(k=>{ if(f[k]) push(k); });
  const fl=ctx.flowers||Array(8).fill(false), nf=fl.filter(Boolean).length;
  if(f.qiqiangyi) push('qiqiangyi');
  else if(nf===8) push('baxian');
  else { push('hua',nf); if(nf===0) push('wuhua'); }
  const noHon=!tilesAll.some(isHon);
  if(noHon) push('wuzi');
  if(noHon&&nf===0) push('wuzihua');
  return {nf,noHon};
}
function chicken(ctx,items){
  const EX=['di','ting','jishi','shizi','qizi','sizi'];
  const face=items.filter(i=>EX.indexOf(i.id)<0).reduce((a,i)=>a+valueOf(ctx.R,i),0);
  const keep=items.filter(i=>['ting','jishi','shizi','qizi','sizi'].indexOf(i.id)>=0);
  if(!ctx.selfDraw&&face===2) return [{id:'jigu',n:1,closed:false}].concat(keep);
  if(ctx.selfDraw&&face===3) return [{id:'yagu',n:1,closed:false}].concat(keep);
  return items;
}
function finish(ctx,items,extraKill){
  let out=applySuppress(items);
  if(extraKill) out=out.filter(i=>!extraKill(i));
  return out.filter(i=>valueOf(ctx.R,i)!==0);
}
function evalBasic(ctx,sets,P,pl){
  const R=ctx.R, items=[];
  const kb=!!ctx.kongBreaks;
  const push=(id,n,closed,tile)=>{ n=n===undefined?1:n; if(n>0){ const o={id,n,closed:!!closed}; if(tile!=null) o.tile=tile; items.push(o); } };
  sets.forEach((s,i)=>{ s.idx=i; });
  const chows=sets.filter(s=>s.t==='chow'), trips=sets.filter(s=>s.t!=='chow'), kongs=sets.filter(s=>s.t==='kong');
  const tilesOf=s=>s.t==='chow'?[s.tile,s.tile+1,s.tile+2]:[s.tile,s.tile,s.tile];
  const tilesAll=[]; sets.forEach(s=>tilesOf(s).forEach(t=>tilesAll.push(t))); tilesAll.push(P,P);
  const closedSet=i=>sets[i].t==='kong'?(!kb||!sets[i].open):!sets[i].open;
  const concealed=sets.every((s,i)=>closedSet(i));
  const occ=(id,idxs)=>({id,idxs,closed:idxs.every(closedSet)});
  const st=stateItems(ctx,items,concealed,tilesAll);
  const hasHon=tilesAll.some(isHon), suits=new Set(tilesAll.filter(t=>!isHon(t)).map(suitOf));
  const cn=c=>numOf(c.tile), cs=c=>suitOf(c.tile);
  if(tilesAll.every(t=>!isHon(t)&&numOf(t)>=2&&numOf(t)<=8)) push('duanyao');
  if(!hasHon&&tilesAll.every(t=>numOf(t)!==5)) push('quewu');
  if(suits.size===1&&hasHon) push('hunyise'); else if(suits.size===1) push('qingyise'); else if(suits.size===0) push('ziyise');
  if(!hasHon&&suits.size===2) push('queyimen');
  if(tilesAll.every(t=>!isHon(t)&&numOf(t)>=6)) push('dayu5');
  if(tilesAll.every(t=>!isHon(t)&&numOf(t)<=4)) push('xiaoyu5');
  if(tilesAll.every(t=>GREEN.indexOf(t)>=0)) push('lvyise');
  const cat=t=>t<=26?2+((t/9)|0):(t<=30?0:1), c5=[0,0,0,0,0];
  tilesAll.forEach(t=>c5[cat(t)]++);
  if(c5.every(c=>c>0)){
    const big=c5.every(c=>c>=3), fl=ctx.flowers||[], fok=fl.slice(0,4).some(Boolean)&&fl.slice(4).some(Boolean);
    push(big?(fok?'daqimen':'dawumen'):(fok?'xiaoqimen':'xiaowumen'));
  }
  const wt=trips.filter(s=>s.tile>=27&&s.tile<=30).length, pw=P>=27&&P<=30;
  const dt=trips.filter(s=>s.tile>=31).length, pdg=P>=31;
  let cov=0;
  if(wt===4){ push('daxixi'); cov+=4; } else if(wt===3&&pw){ push('xiaosixi'); cov+=3; } else if(wt===3){ push('dasanfeng'); cov+=3; } else if(wt===2&&pw){ push('xiaosanfeng'); cov+=2; }
  if(dt===3){ push('dasanyuan'); cov+=3; } else if(dt===2&&pdg){ push('xiaosanyuan'); cov+=2; }
  push('zi',Math.max(0,trips.filter(s=>isHon(s.tile)).length-cov));
  if(!isHon(P)&&[2,5,8].indexOf(numOf(P))>=0) push('jiangyan');
  const waits=ctx.getWaits();
  if(waits===1) push('dudu'); else if(pl.kind==='pair'||pl.kind==='mid'||pl.kind==='edge') push('jiadu');
  if(pl.kind==='pung'&&waits>=2) push('duipeng');
  if(sets.every(s=>s.open&&s.t!=='kong')&&pl.kind==='pair') push(ctx.selfDraw?'banqiu':'quanqiu');
  if(chows.length===5){ push('pinghu'); if(!hasHon&&st.nf===0) push('wuzihua_pinghu'); }
  if(chows.length===0) push('duidui');
  push('gang',kongs.length);
  const ac=trips.filter(s=>s.t==='kong'?(!kb||!s.open):(!s.open&&!s.ronPung)).length;
  if(ac>=2) push('an'+Math.min(ac,5));
  if(chows.length===0&&ac===5&&ctx.selfDraw) push('kankan');
  const groups=sets.map(tilesOf); groups.push([P,P]);
  const hasT=g=>g.some(t=>!isHon(t)&&(numOf(t)===1||numOf(t)===9));
  const hasTH=g=>g.some(t=>isHon(t)||numOf(t)===1||numOf(t)===9);
  if(tilesAll.every(t=>isHon(t)||numOf(t)===1||numOf(t)===9)){ if(!hasHon) push('quanyao'); else if(suits.size>0) push('hunyao'); }
  if(groups.every(hasT)) push('quandaiyao'); else if(hasHon&&groups.every(hasTH)) push('hundaiyao');
  const numGroups=groups.filter(g=>!isHon(g[0]));
  for(let x=2;x<=8;x++){
    if(numGroups.length&&numGroups.every(g=>g.some(t=>numOf(t)===x))) push(hasHon?'hundaix':'quandaix');
    if(hasHon&&numGroups.length&&tilesAll.every(t=>isHon(t)||numOf(t)===x)) push('hunx');
  }
  const od=[];
  for(let su=0;su<3;su++){
    const a=chows.filter(c=>cs(c)===su&&cn(c)===1), b=chows.filter(c=>cs(c)===su&&cn(c)===4), c3=chows.filter(c=>cs(c)===su&&cn(c)===7);
    if(a.length&&b.length&&c3.length){ const o=occ('qinglong',[a[0].idx,b[0].idx,c3[0].idx]); o.su=su; od.push(o); }
  }
  perms3().forEach(p=>{
    const a=chows.filter(c=>cs(c)===p[0]&&cn(c)===1), b=chows.filter(c=>cs(c)===p[1]&&cn(c)===4), c3=chows.filter(c=>cs(c)===p[2]&&cn(c)===7);
    if(a.length&&b.length&&c3.length) od.push(occ('zalong',[a[0].idx,b[0].idx,c3[0].idx]));
  });
  const dragon=bestSingle(R,od); let qlSu=-1;
  if(dragon){ push(dragon.id,1,dragon.closed); if(dragon.id==='qinglong') qlSu=dragon.su; }
  for(let su=0;su<3;su++){
    if(su!==qlSu&&chows.some(c=>cs(c)===su&&cn(c)===1)&&chows.some(c=>cs(c)===su&&cn(c)===7)) push('laoshaoshang');
    const tp=n=>trips.some(s=>s.tile<27&&suitOf(s.tile)===su&&numOf(s.tile)===n);
    if(tp(1)&&tp(9)) push('laoshaopeng');
  }
  const kc={}; chows.forEach(c=>{ const k=cs(c)*10+cn(c); (kc[k]=kc[k]||[]).push(c.idx); });
  const k2=[], yise4Tiles=[];
  Object.keys(kc).forEach(k=>{
    const g=kc[k];
    if(g.length>=4){ push('yise4',1,g.slice(0,4).every(closedSet)); const base=(+k)%10, su=Math.floor((+k)/10); [0,1,2].forEach(d=>yise4Tiles.push(su*9+base-1+d)); }
    else if(g.length===3) push('yise3',1,g.every(closedSet));
    else if(g.length===2) k2.push(g);
  });
  if(k2.length>=2){ push('shuangbanggao',1,k2[0].concat(k2[1]).every(closedSet)); for(let i=2;i<k2.length;i++) push('banggao',1,k2[i].every(closedSet)); }
  else if(k2.length===1) push('banggao',1,k2[0].every(closedSet));
  const tc=Array(34).fill(0), gc=Array(34).fill(0), openT=Array(34).fill(false), kt=new Set(kongs.map(k=>k.tile));
  sets.forEach(s=>{
    if(s.t==='chow'){ for(let k=0;k<3;k++){ tc[s.tile+k]++; gc[s.tile+k]++; if(s.open) openT[s.tile+k]=true; } }
    else { tc[s.tile]+=(s.t==='kong'?4:3); gc[s.tile]++; if(s.open&&s.t!=='kong') openT[s.tile]=true; }
  });
  tc[P]+=2; gc[P]++;
  for(let t=0;t<34;t++) if(tc[t]===4&&!kt.has(t)&&gc[t]>=2) push(gc[t]===2?'sigui1':gc[t]===3?'sigui2':'sigui4',1,!openT[t],t);
  const at=n=>chows.filter(c=>cn(c)===n);
  const nums=chows.map(cn).sort((a,b)=>a-b);
  const consecutive=chows.length===5&&nums.every((v,i)=>i===0||v-nums[i-1]===1);
  let fullYi=false, fullSan=false;
  if(consecutive){
    const sorted=chows.slice().sort((a,b)=>cn(a)-cn(b));
    if(sorted.every(c=>cs(c)===cs(sorted[0]))){ fullYi=true; push('quanyibu',1,sorted.every(c=>closedSet(c.idx))); }
    else if([0,1,2].every(i=>new Set([cs(sorted[i]),cs(sorted[i+1]),cs(sorted[i+2])]).size===3)){ fullSan=true; push('quansanbu',1,sorted.every(c=>closedSet(c.idx))); }
  }
  const oy=[], os=[];
  for(let n=1;n<=5;n++) at(n).forEach(a=>at(n+1).forEach(b=>at(n+2).forEach(c=>{
    const ss=new Set([cs(a),cs(b),cs(c)]);
    if(ss.size===1) oy.push(occ('yibu3',[a.idx,b.idx,c.idx])); else if(ss.size===3) os.push(occ('sanbu3',[a.idx,b.idx,c.idx]));
  })));
  for(let n=1;n<=3;n++) at(n).forEach(a=>at(n+2).forEach(b=>at(n+4).forEach(c=>{
    const ss=new Set([cs(a),cs(b),cs(c)]);
    if(ss.size===1) oy.push(occ('yibu3t',[a.idx,b.idx,c.idx])); else if(ss.size===3) os.push(occ('sanbu3t',[a.idx,b.idx,c.idx]));
  })));
  if(!fullYi&&!fullSan){ packBest(R,oy).forEach(o=>push(o.id,1,o.closed)); packBest(R,os).forEach(o=>push(o.id,1,o.closed)); }
  const ob=[];
  for(let n=1;n<=7;n++){
    const arr=at(n), ss=new Set(arr.map(cs));
    if(ss.size===3){ const pick=[0,1,2].map(su=>arr.find(c=>cs(c)===su)); ob.push(occ('sanxiangfeng',pick.map(c=>c.idx))); }
    else if(ss.size===2) for(let i=0;i<arr.length;i++) for(let j=i+1;j<arr.length;j++) if(cs(arr[i])!==cs(arr[j])) ob.push(occ('zimei',[arr[i].idx,arr[j].idx]));
    if(arr.length>=4&&ss.size>1) push(arr.length>=5?'tong5':'tong4',1,arr.slice(0,arr.length>=5?5:4).every(c=>closedSet(c.idx)));
  }
  const zp=ob.filter(o=>o.id==='zimei');
  for(let i=0;i<zp.length;i++) for(let j=i+1;j<zp.length;j++) if(zp[i].idxs.every(x=>zp[j].idxs.indexOf(x)<0)) ob.push(occ('shuangzimei',zp[i].idxs.concat(zp[j].idxs)));
  const allSis=chows.length>=2&&chows.every(c=>chows.some(d=>d!==c&&cn(d)===cn(c)&&cs(d)!==cs(c)));
  if(allSis) push('quanzimei',1,chows.every(c=>closedSet(c.idx)));
  packBest(R,allSis?ob.filter(o=>o.id==='sanxiangfeng'):ob).forEach(o=>push(o.id,1,o.closed));
  const tn=[{},{},{}]; trips.forEach(s=>{ if(s.tile<27) tn[suitOf(s.tile)][numOf(s.tile)]=true; });
  for(let su=0;su<3;su++){
    const ns=Object.keys(tn[su]).map(Number).sort((a,b)=>a-b);
    let i=0;
    while(i<ns.length){
      let j=i; while(j+1<ns.length&&ns[j+1]===ns[j]+1) j++;
      const L=j-i+1;
      if(L>=2){
        let win=0; const eyeNear=k=>P<27&&suitOf(P)===su&&(numOf(P)===ns[k]-1||numOf(P)===ns[k+1]+1);
        for(let k=i;k<j;k++) if(eyeNear(k)) win++;
        push('xlian3',win);
        if(L===2&&!win) push('lian2');
        if(L>=3) push('lian3',L-2);
      }
      i=j+1;
    }
  }
  const tr=trips.filter(s=>s.tile<27);
  const seenD=new Set();
  tr.forEach(a=>tr.forEach(b=>tr.forEach(c=>{
    const ss=new Set([suitOf(a.tile),suitOf(b.tile),suitOf(c.tile)]);
    if(ss.size===3&&numOf(b.tile)===numOf(a.tile)+1&&numOf(c.tile)===numOf(a.tile)+2&&!seenD.has(numOf(a.tile))){ seenD.add(numOf(a.tile)); push('dsanlian'); }
  })));
  const seenX=new Set();
  tr.forEach(a=>tr.forEach(b=>{
    if(suitOf(a.tile)!==suitOf(b.tile)&&numOf(b.tile)===numOf(a.tile)+1&&P<27){
      const third=3-suitOf(a.tile)-suitOf(b.tile);
      if(suitOf(P)===third&&(numOf(P)===numOf(a.tile)-1||numOf(P)===numOf(b.tile)+1)&&!seenX.has(numOf(a.tile))){ seenX.add(numOf(a.tile)); push('xsanlian'); }
    }
  }));
  for(let n=1;n<=9;n++){
    const s=[0,1,2].filter(su=>tn[su][n]);
    if(s.length===3) push('daxiongdi');
    else if(s.length===2){ const third=[0,1,2].find(su=>s.indexOf(su)<0); if(P<27&&suitOf(P)===third&&numOf(P)===n) push('xiaosanxiongdi'); else push('xiongdi'); }
  }
  const out=finish(ctx,items,i=>i.id.indexOf('sigui')===0&&yise4Tiles.indexOf(i.tile)>=0);
  return chicken(ctx,out);
}
function specialItems(ctx,cnt,win,kind){
  const items=[], tilesAll=[]; cnt.forEach((c,t)=>{ for(let i=0;i<c;i++) tilesAll.push(t); });
  stateItems(ctx,items,true,tilesAll);
  let out=items;
  if(kind!=='shisanyao'){
    const hadMo=out.some(i=>i.id==='menmo');
    out=out.filter(i=>i.id!=='menqing'&&i.id!=='menmo');
    if(hadMo) out.push({id:'zimo',n:1,closed:false});
  }
  out.push({id:kind,n:1,closed:true});
  if(kind==='likgu'||kind==='lik8'){
    const hasHon=tilesAll.some(isHon), suits=new Set(tilesAll.filter(t=>!isHon(t)).map(suitOf));
    const push=id=>out.push({id,n:1,closed:false});
    if(tilesAll.every(t=>!isHon(t)&&numOf(t)>=2&&numOf(t)<=8)) push('duanyao');
    if(!hasHon&&tilesAll.every(t=>numOf(t)!==5)) push('quewu');
    if(suits.size===1&&hasHon) push('hunyise'); else if(suits.size===1) push('qingyise'); else if(suits.size===0) push('ziyise');
    if(!hasHon&&suits.size===2) push('queyimen');
    if(tilesAll.every(t=>!isHon(t)&&numOf(t)>=6)) push('dayu5');
    if(tilesAll.every(t=>!isHon(t)&&numOf(t)<=4)) push('xiaoyu5');
    if(tilesAll.every(t=>GREEN.indexOf(t)>=0)) push('lvyise');
  }
  return finish(ctx,out);
}
function basic(inp){
  const ctx={R:buildRules(null),flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{}};
  const items=[]; const f=ctx.flags;
  items.push({id:'di',n:1,closed:false});
  if(ctx.selfDraw) items.push({id:'zimo',n:1,closed:false});
  EVENT.concat(['ting']).forEach(k=>{ if(f[k]) items.push({id:k,n:1,closed:false}); });
  const nf=ctx.flowers.filter(Boolean).length;
  if(f.qiqiangyi) items.push({id:'qiqiangyi',n:1,closed:false});
  else if(nf===8) items.push({id:'baxian',n:1,closed:false});
  else { if(nf>0) items.push({id:'hua',n:nf,closed:false}); else items.push({id:'wuhua',n:1,closed:false}); }
  return applySuppress(items);
}
function analyze(inp,over){
  const R=buildRules(over);
  const melds=inp.melds||[], hand=inp.hand||[];
  const nSets=5-melds.length;
  if(nSets<0) return {error:'明牌多於5組'};
  const need=nSets*3+2;
  if(hand.length!==need) return {error:'手牌應為 '+need+' 張(現有 '+hand.length+' 張)'};
  const cnt=Array(34).fill(0); hand.forEach(t=>cnt[t]++);
  const all=cnt.slice();
  melds.forEach(m=>{ if(m.t==='chow'){all[m.tile]++;all[m.tile+1]++;all[m.tile+2]++;} else all[m.tile]+=(m.t==='kong'?4:3); });
  if(all.some(c=>c>4)) return {error:'同一款牌多於4張'};
  const win=inp.win;
  if(win==null||!cnt[win]) return {error:'請選擇胡牌'};
  const base={R,flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{},seatWind:inp.seatWind,roundWind:inp.roundWind,kongBreaks:inp.kongKeep===false};
  const noMelds=melds.length===0;
  const complete=c=>decompose(c,nSets).length>0||(noMelds&&(isLik(c)||isShisan(c)||budaInfo(c)));
  let wcache=null;
  base.getWaits=function(){
    if(wcache!==null) return wcache;
    const b=cnt.slice(); b[win]--; let n=0;
    for(let w=0;w<34;w++){ b[w]++; if(all[w]-(w===win?1:0)+1<=4&&complete(b)) n++; b[w]--; }
    wcache=n; return n;
  };
  const meldSets=melds.map(m=>({t:m.t,tile:m.tile,open:m.t==='kong'?m.open!==false:true}));
  const tot=items=>items.reduce((a,x)=>a+valueOf(R,x),0);
  const cands=[];
  decompose(cnt.slice(),nSets).forEach(D=>{
    placements(D,win).forEach(pl=>{
      const sets=meldSets.map(s=>({t:s.t,tile:s.tile,open:s.open})).concat(D.sets.map((s,i)=>({t:s.t,tile:s.tile,open:false,ronPung:(pl.kind==='pung'&&pl.idx===i&&!base.selfDraw)})));
      const items=evalBasic(base,sets,D.pair,pl);
      cands.push({items,total:tot(items)});
    });
  });
  if(noMelds){
    if(isLik(cnt)){ const it=specialItems(base,cnt,win,cnt[win]===3?'lik8':'likgu'); cands.push({items:it,total:tot(it)}); }
    if(isShisan(cnt)){ const it=specialItems(base,cnt,win,'shisanyao'); cands.push({items:it,total:tot(it)}); }
    const bi=budaInfo(cnt);
    if(bi){ const it=specialItems(base,cnt,win,bi.isFeng?'busanxf':bi.isLong?'budazalong':(cnt[win]===2?'budafei':'shiliubuda')); cands.push({items:it,total:tot(it)}); }
  }
  if(!cands.length) return {error:'未能組成胡牌形(可略過牌型,改用手動選番)'};
  cands.sort((a,b)=>b.total-a.total);
  return {items:cands[0].items,total:cands[0].total,count:cands.length,waits:base.getWaits()};
}
function settle(winners,dealer,streak,cfg){
  const d=[0,0,0,0], bonus=1+2*streak;
  winners.forEach(w=>{
    const payers=w.self?[0,1,2,3].filter(i=>i!==w.p):[w.disc];
    payers.forEach(q=>{ const fan=w.total+((q===dealer||w.p===dealer)?bonus:0); const amt=fan*cfg.fanValue; d[q]-=amt; d[w.p]+=amt; });
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
  while(cr.length&&db.length){ const a=cr[0],b=db[0], m=Math.min(a.v,b.v); res.push({from:b.i,to:a.i,amt:m}); a.v-=m; b.v-=m; if(a.v===0) cr.shift(); if(b.v===0) db.shift(); }
  return res;
}
const API={id:'hoitoi',tName,suitOf,numOf,isHon,FLOWERS,FANS,INSTANT,FLAGS,SUPPRESS:SUP,buildRules,valueOf,analyze,basic,settle,instantDeltas,transfers,SUITS,HON,decompose};
/* 其他預設共用的規則適配層:把預設#2與#4一致的做法放進#1、#3;並處理「明槓是否破門清」設定 */
const WRAP_CACHE=new Map();
function wrapRules(base){
  if(WRAP_CACHE.has(base)) return WRAP_CACHE.get(base);
  const w=Object.create(base);
  w.analyze=function(inp,over){
    const melds=inp.melds||[], hand=inp.hand||[], keep=!!inp.kongKeep;
    const m2=keep?melds.map(m=>m.t==='kong'?Object.assign({},m,{open:false}):m):melds;
    const r=base.analyze(Object.assign({},inp,{melds:m2}),over);
    if(!r||r.error||!r.items) return r;
    const R=base.buildRules(over);
    let items=r.items.slice();
    const tiles=hand.slice();
    melds.forEach(m=>{ const ts=m.t==='chow'?[m.tile,m.tile+1,m.tile+2]:Array(m.t==='kong'?4:3).fill(m.tile); ts.forEach(t=>tiles.push(t)); });
    if(tiles.some(t=>t>=27)) items=items.filter(i=>i.id!=='queyimen'&&i.id!=='quewu');
    items=items.filter(i=>i.id!=='banqiu'&&i.id!=='quanqiu');
    if(melds.length===5&&melds.every(m=>m.t!=='kong')){
      const id=inp.selfDraw?'banqiu':'quanqiu';
      if(R[id]){ const sup=(base.SUPPRESS&&base.SUPPRESS[id])||[]; items=items.filter(i=>sup.indexOf(i.id)<0); items.push({id,n:1,closed:false}); }
    }
    if(keep&&(R.minggang||R.angang)){
      const open=melds.filter(m=>m.t==='kong'&&m.open!==false).length, closed=melds.filter(m=>m.t==='kong'&&m.open===false).length;
      items=items.filter(i=>i.id!=='minggang'&&i.id!=='angang');
      if(open&&R.minggang) items.push({id:'minggang',n:open,closed:false});
      if(closed&&R.angang) items.push({id:'angang',n:closed,closed:false});
    }
    r.items=items; r.total=items.reduce((a,x)=>a+base.valueOf(R,x),0);
    return r;
  };
  WRAP_CACHE.set(base,w); return w;
}
root.MJRULES={wrap:wrapRules};
if(typeof module!=='undefined'&&module.exports) module.exports=API; else root.MJ4=API;
})(typeof window!=='undefined'?window:globalThis);
