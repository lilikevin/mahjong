(function(root){
'use strict';
const SUITS=['萬','筒','索'], HON='東南西北中發白';
const tName=i=>i<27?(i%9+1)+SUITS[(i/9)|0]:HON[i-27];
const suitOf=i=>i<27?((i/9)|0):3;
const numOf=i=>i<27?(i%9+1):0;
const isHon=i=>i>=27;
const FLOWERS=['春','夏','秋','冬','梅','蘭','菊','竹'];
const YAO=[0,8,9,17,18,26,27,28,29,30,31,32,33];
/* 香港麻雀協會《港式十六張新章麻雀總例》(2025-07-28 修訂)番種詳述 */
const RAW=[
['zimo','自摸',1],['menqing','門清',5],['menmo','門摸',5],['ting','叮牌',5],['menting','門叮',15],['jishi','即食',5],
['haidi','海底撈月',10],['qiangkong','搶槓',10],['huashang','花上自摸',2],['kongshang','槓上自摸',5],['weipai','尾牌連摸(n=連摸張數)',5],
['shuangxiang','雙響',5],['sanxiang','三響',10],
['tianting','天叮',40],['diting','地叮',30],['renting','人叮',20],['tianhu','天糊',120],['dihu','地糊',120],['renhu','人糊',80],
['sijinei','四隻內',40],['qijinei','七隻內',20],['shijinei','十隻內',10],
['banqiu','半求人',20],['quanqiu','全求人',40],['jiangyan','將眼',2],['duipeng','對碰',1],['jiadu','假獨',1],['dudu','獨獨',2],
['zipai','字牌',1],['zhengzi','正字',1],['hua','花',1],['zhenghua','正花',1],['wuhua','無花',1],['wuzi','無字',1],['wuzihua','無字花',5],
['yitaihua','一台花',10],['baxian','八仙過海',40],['daji','大雞糊',40],['daya','大鴨糊',20],
['pinghu','平糊',5],['wuzihua_pinghu','無字花平糊',15],
['zalong','雜龍',10,20],['qinglong','清龍',15,30],['laoshaoshun','老少順',3],['shuanglaoshaoshun','雙老少順',15],
['yise2','一色同順',5],['shuangyise','雙一色同順',20],['yise3','一色三同順',30,60],['yise4','一色四同順',180,360],
['liangse','兩色同順',3],['sanse','三色同順',10,20],['shuangtong','雙同順',10],['tong4','四同順',20],['tong5','五同順',60],
['sanbu3','三色三步高',5,10],['sanbu4','三色四步高',15,30],['sanbu5','三色五步高',50,100],
['yibu3','一色三步高',20,40],['yibu4','一色四步高',60,120],['yibu5','一色五步高',200,400],
['lianhuantao','連環套',15,30],['jinmen','金門大橋',50,100],
['gang','槓',2],['duidui','對對糊',40],['an2','兩暗刻',5],['an3','三暗刻',20],['an4','四暗刻',60],['an5','五暗刻',180],['kankan','坎坎糊',240],
['laoshaoke','老少刻',5],['shuanglaoshaoke','雙老少刻',30],
['lian2','兩連刻',5],['xlian3','小三連刻',15],['dlian3','大三連刻',30],['xlian4','小四連刻',60],['dlian4','大四連刻',90],
['xlian5','小五連刻',150],['dlian5','大五連刻',240],['xlian6','小六連刻',480],['shuanglian','雙連刻',20],
['tongke2','兩同刻',5],['xtongke3','小三同刻',20],['dtongke3','大三同刻',40],['shuangtongke','雙同刻',20],
['duanyao','斷么九',10],['hundaiyao','混帶么',40],['quandaiyao','全帶么',80],['hunyaojiu','混么九',80],['qingyaojiu','清么九',420],
['quewu','缺五',10],['hunmanting','混滿庭芳',40],['manting','滿庭芳',120],
['hunyise','混一色',40],['qingyise','清一色',120],['queyimen','缺一門',10],
['xiaowumen','小五門齊',10],['dawumen','大五門齊',20],['xiaoqimen','小七門齊',15],['daqimen','大七門齊',30],
['ziyise','字一色',120],['xiaosanyuan','小三元',40],['dasanyuan','大三元',80],['xiaosanfeng','小三風',30],['dasanfeng','大三風',60],
['xiaosixi','小四喜',120],['daxixi','大四喜',160],
['sigui2','四歸二',5,10],['sigui3','四歸三',15,30],['sigui4','四歸四',60,120],['bagui','八歸',20],['shierguei','十二歸',80],
['shisanyao','十三么九',100],['shisanfei','十三扉',20],['shiliubuda','十六不搭',50],['shiliufei','十六扉不搭',20],
['likgu','嚦咕嚦咕',40],['baduilik','八對嚦咕',10],['sanyuanlik','三元嚦咕',20],['sixilik','四喜嚦咕',40],['sansetongdui','三色同對',10],
['lianduei3','三連對',5],['lianduei4','四連對',15],['lianduei5','五連對',30],['lianduei6','六連對',60],['lianduei7','七連對',120],['lianduei8','八連對',420]
];
const MANUAL=['weipai','sijinei','qijinei','shijinei'];
const FANS=RAW.map(r=>({id:r[0],name:r[1],fan:r[2],fanC:r[3]===undefined?null:r[3],manual:MANUAL.indexOf(r[0])>=0}));
const FLAGS=[['ting','叮牌'],['jishi','即食'],['tianting','天叮'],['diting','地叮'],['renting','人叮'],['qiangkong','搶槓'],['huashang','花上自摸'],['kongshang','槓上自摸'],['haidi','海底撈月'],['tianhu','天糊'],['dihu','地糊'],['renhu','人糊'],['shuangxiang','雙響'],['sanxiang','三響']];
const INSTANT=[
 {id:'qi_qiang_yi',name:'七搶一(收持一張花的一家)',amt:30,mode:'one'},
 {id:'liangtaihua',name:'兩台花(八隻花,收每家)',amt:40,mode:'all'},
 {id:'angang_i',name:'暗槓(收每家一底)',amt:5,mode:'all'}
];
/* 「不計」與不複合原則 */
const SUP={
 menmo:['zimo'], menting:['menqing','ting'], wuzihua:['wuzi','wuhua'], wuzihua_pinghu:['pinghu','wuzi','wuhua','wuzihua'],
 banqiu:['dudu','jiadu','zimo'], quanqiu:['dudu','jiadu'], dudu:['jiadu'],
 qinglong:['laoshaoshun'], shuanglaoshaoshun:['shuangtong','laoshaoshun'],
 shuangyise:['yise2'], yise3:['yise2'], yise4:['yise2','yise3'],
 sanse:['liangse'], shuangtong:['liangse'], tong5:['pinghu','tong4'],
 sanbu4:['sanbu3'], sanbu5:['pinghu','sanbu3','sanbu4'],
 yibu4:['yibu3'], yibu5:['pinghu','yibu3','yibu4','lianhuantao'], jinmen:['lianhuantao'],
 an3:['an2'], an4:['an2','an3'], an5:['duidui','an2','an3','an4'], kankan:['menqing','duidui','an2','an3','an4','an5'],
 shuanglaoshaoke:['shuangtongke','laoshaoke'], dlian5:['duidui'], xlian6:['duidui','qingyise'],
 duanyao:['wuzi'], quandaiyao:['wuzi','quewu','hundaiyao'], qingyaojiu:['wuzi','quewu','quandaiyao','hunyaojiu','hundaiyao'],
 hunyaojiu:['hundaiyao'], quewu:['wuzi'], manting:['wuzi','hunmanting'],
 qingyise:['wuzi','queyimen'], queyimen:['wuzi'], xiaoqimen:['xiaowumen'], daqimen:['dawumen','xiaoqimen','xiaowumen'], dawumen:['xiaowumen'],
 xiaosixi:['dasanfeng','xiaosanfeng'], dasanfeng:['xiaosanfeng'], dasanyuan:['xiaosanyuan'],
 tianting:['menqing','menting'], diting:['menqing','menting'],
 tianhu:['menqing','zimo','menmo'], dihu:['menqing'], renhu:['menqing'],
 sanxiang:['shuangxiang'], huashang:['zimo'], kongshang:['zimo'], weipai:['zimo','huashang','kongshang'],
 sijinei:['qijinei','shijinei'], qijinei:['shijinei'],
 shisanyao:['menqing','xiaowumen','dawumen'], shiliubuda:['menqing','xiaowumen','dawumen'],
 likgu:['menqing','jiangyan','zipai','zhengzi'], lianduei8:['qingyise'], shierguei:['bagui']
};
function applySuppress(items,info){
  const ids=new Set(items.map(i=>i.id)), kill=new Set();
  Object.keys(SUP).forEach(a=>{ if(ids.has(a)) SUP[a].forEach(b=>kill.add(b)); });
  const x=info&&info.manX;
  if(x){
    if(ids.has('manting')){ if(x===1||x===9){ kill.add('quandaiyao'); kill.add('hundaiyao'); } if([1,2,8,9].indexOf(x)>=0) kill.add('quewu'); }
    if(ids.has('hunmanting')&&(x===1||x===9)) kill.add('hundaiyao');
  }
  return items.filter(i=>!kill.has(i.id));
}
function buildRules(over){
  const R={};
  FANS.forEach(f=>{R[f.id]={id:f.id,name:f.name,fan:f.fan,fanC:f.fanC,manual:f.manual};});
  if(over) Object.keys(over).forEach(k=>{ if(R[k]){ const o=over[k]; if(o.fan!=null&&!isNaN(o.fan)) R[k].fan=+o.fan; if(o.fanC!=null&&!isNaN(o.fanC)) R[k].fanC=+o.fanC; }});
  return R;
}
function valueOf(R,it){
  const r=R[it.id]; if(!r) return 0;
  if(it.id==='weipai') return r.fan*Math.pow(2,Math.max(1,(it.n||2)-1));
  const u=(it.closed&&r.fanC!=null)?r.fanC:r.fan; return u*(it.n===undefined?1:it.n);
}
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
      if(i<27&&numOf(i)<=7&&cnt[i+1]>0&&cnt[i+2]>0){ cnt[i]--;cnt[i+1]--;cnt[i+2]--; sets.push({t:'chow',tile:i}); rec(); sets.pop(); cnt[i]++;cnt[i+1]++;cnt[i+2]++; }
    })();
    cnt[p]+=2;
  }
  return res;
}
function isLik2(cnt){ let three=0; for(const c of cnt){ if(c===0||c===2||c===4) continue; if(c===3) three++; else return false; } return three===1; }
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


function budaInfo(cnt, flags){
  const mode = (flags&&flags.budaMode) || (typeof M!=='undefined'&&M.BUDA_MODE) || (typeof self!=='undefined'&&self.BUDA_MODE) || 'strict';
  const minGap = mode==='loose' ? 2 : 3;
  let dbl=0,tot=0; const sets=[];
  for(let t=27;t<34;t++){ if(cnt[t]<1||cnt[t]>2) return null; if(cnt[t]===2) dbl++; tot+=cnt[t]; }
  for(let su=0;su<3;su++){
    const ns=[];
    for(let n=1;n<=9;n++){ const c=cnt[su*9+n-1]; if(c>2) return null; if(c>=1){ ns.push(n); if(c===2) dbl++; tot+=c; } }
    if(ns.length<1) return null;
    if(mode==='strict' && ns.length!==3) return null;
    for(let i=0;i<ns.length;i++) for(let j=i+1;j<ns.length;j++) if(ns[j]-ns[i] < minGap) return null;
    sets.push(ns);
  }
  if(!(dbl===1&&tot===17)) return null;
  const keys=sets.map(a=>a.join(','));
  return {sets, isLong: keys.every(k=>['1,4,7','2,5,8','3,6,9'].includes(k)) && new Set(keys).size===3, isFeng: new Set(keys).size===1 };
}
function isBuda(cnt, flags){
  const mode = (flags&&flags.budaMode) || (typeof M!=='undefined'&&M.BUDA_MODE) || (typeof self!=='undefined'&&self.BUDA_MODE) || 'strict';
  const minGap = mode==='loose' ? 2 : 3;
  let dbl=0,tot=0;
  for(let t=27;t<34;t++){ if(cnt[t]<1||cnt[t]>2) return false; if(cnt[t]===2) dbl++; tot+=cnt[t]; }
  for(let su=0;su<3;su++){
    const ns=[];
    for(let n=1;n<=9;n++){ const c=cnt[su*9+n-1]; if(c>2) return false; if(c>=1){ ns.push(n); if(c===2) dbl++; tot+=c; } }
    if(ns.length<1) return false;
    if(mode==='strict' && ns.length!==3) return false;
    for(let i=0;i<ns.length;i++) for(let j=i+1;j<ns.length;j++) if(ns[j]-ns[i] < minGap) return false;
  }
  return dbl===1&&tot===17;
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
    for(let j=i;j<occs.length;j++){
      const o=occs[j];
      if(chosen.every(c=>shareOK(c.idxs,o.idxs))){ chosen.push(o); dfs(j+1,chosen,v+val(o)); chosen.pop(); }
    }
  })(0,[],0);
  return best;
}
function bestSingle(R,occs){
  let b=null,bv=0; occs.forEach(o=>{ const v=valueOf(R,{id:o.id,n:1,closed:o.closed}); if(v>bv){ bv=v; b=o; } }); return b;
}
function flowerItems(ctx,push){
  const fl=ctx.flowers||Array(8).fill(false), nf=fl.filter(Boolean).length;
  if(nf===8) push('baxian');
  else {
    const rest=fl.slice();
    if(fl.slice(0,4).every(Boolean)){ push('yitaihua'); for(let i=0;i<4;i++) rest[i]=false; }
    if(fl.slice(4).every(Boolean)){ push('yitaihua'); for(let i=4;i<8;i++) rest[i]=false; }
    push('hua',rest.filter(Boolean).length);
    if(ctx.seatWind!=null&&ctx.seatWind>=0) push('zhenghua',(rest[ctx.seatWind]?1:0)+(rest[ctx.seatWind+4]?1:0));
  }
  return nf;
}
const FLAGIDS=['jishi','haidi','qiangkong','huashang','kongshang','shuangxiang','sanxiang','tianting','diting','renting','tianhu','dihu','renhu'];
function stateItems(ctx,items,concealed,tilesAll){
  const push=(id,n)=>{ n=n===undefined?1:n; if(n>0) items.push({id,n,closed:false}); };
  const f=ctx.flags||{};
  if(concealed) push('menqing');
  if(ctx.selfDraw){ if(concealed) push('menmo'); else push('zimo'); }
  if(f.ting){ if(concealed) push('menting'); else push('ting'); }
  FLAGIDS.forEach(k=>{ if(f[k]) push(k); });
  const nf=flowerItems(ctx,push);
  if(nf===0) push('wuhua');
  const noHon=!tilesAll.some(isHon);
  if(noHon) push('wuzi');
  if(noHon&&nf===0) push('wuzihua');
  return {nf,noHon};
}
function colorFans(ctx,items,tilesAll){
  const push=id=>items.push({id,n:1,closed:false});
  const hasHon=tilesAll.some(isHon);
  const suits=new Set(tilesAll.filter(t=>!isHon(t)).map(suitOf));
  if(tilesAll.every(t=>!isHon(t)&&numOf(t)>=2&&numOf(t)<=8)) push('duanyao');
  if(!hasHon&&tilesAll.every(t=>numOf(t)!==5)) push('quewu');
  if(suits.size===1&&hasHon) push('hunyise'); else if(suits.size===1&&!hasHon) push('qingyise'); else if(suits.size===0) push('ziyise');
  if(!hasHon&&suits.size===2) push('queyimen');
}
function menFans(ctx,items,tilesAll,meldG){
  const present=[tilesAll.some(t=>t>=27&&t<=30),tilesAll.some(t=>t>=31),tilesAll.some(t=>t<9),tilesAll.some(t=>t>=9&&t<18),tilesAll.some(t=>t>=18&&t<27)];
  if(!present.every(Boolean)) return;
  const da=meldG.every(Boolean), fl=ctx.flowers||[];
  const fok=fl.slice(0,4).some(Boolean)&&fl.slice(4).some(Boolean);
  items.push({id:fok?(da?'daqimen':'xiaoqimen'):(da?'dawumen':'xiaowumen'),n:1,closed:false});
}
function evalBasic(ctx,sets,P,pl){
  const R=ctx.R, items=[];
  const push=(id,n,closed)=>{ n=n===undefined?1:n; if(n>0) items.push({id,n,closed:!!closed}); };
  sets.forEach((s,i)=>{ s.idx=i; });
  const chows=sets.filter(s=>s.t==='chow'), trips=sets.filter(s=>s.t!=='chow'), kongs=sets.filter(s=>s.t==='kong');
  const tilesOf=s=>s.t==='chow'?[s.tile,s.tile+1,s.tile+2]:[s.tile,s.tile,s.tile];
  const tilesAll=[]; sets.forEach(s=>tilesOf(s).forEach(t=>tilesAll.push(t))); tilesAll.push(P,P);
  const concealed=sets.every(s=>!s.open);
  const occ=(id,idxs)=>({id,idxs,closed:idxs.every(i=>i>=100||!sets[i].open)});
  const st=stateItems(ctx,items,concealed,tilesAll);
  colorFans(ctx,items,tilesAll);
  const grp=t=>t<=26?2+((t/9)|0):(t<=30?0:1);
  const meldG=[false,false,false,false,false]; sets.forEach(s=>{ meldG[grp(s.tile)]=true; });
  menFans(ctx,items,tilesAll,meldG);
  // 字牌類
  const wt=trips.filter(s=>s.tile>=27&&s.tile<=30).length, pw=P>=27&&P<=30;
  const dt=trips.filter(s=>s.tile>=31).length, pdg=P>=31;
  let windFan=null, dragFan=null;
  if(wt===4) windFan='daxixi'; else if(wt===3&&pw) windFan='xiaosixi'; else if(wt===3) windFan='dasanfeng'; else if(wt===2&&pw) windFan='xiaosanfeng';
  if(dt===3) dragFan='dasanyuan'; else if(dt===2&&pdg) dragFan='xiaosanyuan';
  if(windFan) push(windFan); if(dragFan) push(dragFan);
  let zp=0,zz=0;
  trips.forEach(s=>{
    const w=s.tile>=27&&s.tile<=30, d=s.tile>=31;
    if(!w&&!d) return;
    if((w&&windFan)||(d&&dragFan)) return;
    zp++;
    if(d||(ctx.seatWind!=null&&s.tile===27+ctx.seatWind)||(ctx.roundWind!=null&&s.tile===27+ctx.roundWind)) zz++;
  });
  push('zipai',zp); push('zhengzi',zz);
  // 順子與刻子
  if(chows.length===0) push('duidui');
  push('gang',kongs.length);
  if(!isHon(P)&&[2,5,8].indexOf(numOf(P))>=0) push('jiangyan');
  const waits=ctx.getWaits();
  if(waits===1) push('dudu'); else if(pl.kind==='edge'||pl.kind==='mid'||pl.kind==='pair') push('jiadu');
  if(pl.kind==='pung'&&waits>=2) push('duipeng');
  if(sets.every(s=>s.open&&s.t!=='kong')&&pl.kind==='pair') push(ctx.selfDraw?'banqiu':'quanqiu');
  if(chows.length===5){ push('pinghu'); if(st.noHon&&st.nf===0) push('wuzihua_pinghu'); }
  else if(chows.length===5-0&&false){}
  if(trips.length===0&&chows.length<5){}
  // 平糊:五副均為順子(已含於上)
  const cn=(c)=>numOf(c.tile), cs=(c)=>suitOf(c.tile);
  // 一色同順
  const gm={}; chows.forEach(c=>{ const k=cs(c)*10+cn(c); (gm[k]=gm[k]||[]).push(c.idx); });
  const oa=[]; let quad=false;
  Object.keys(gm).forEach(k=>{
    const g=gm[k];
    for(let i=0;i<g.length;i++) for(let j=i+1;j<g.length;j++) oa.push(occ('yise2',[g[i],g[j]]));
    for(let i=0;i<g.length;i++) for(let j=i+1;j<g.length;j++) for(let l=j+1;l<g.length;l++) oa.push(occ('yise3',[g[i],g[j],g[l]]));
    if(g.length===4){ oa.push(occ('yise4',g.slice())); quad=true; }
  });
  const pa=oa.filter(o=>o.id==='yise2');
  for(let i=0;i<pa.length;i++) for(let j=i+1;j<pa.length;j++) if(pa[i].idxs.every(x=>pa[j].idxs.indexOf(x)<0)) oa.push(occ('shuangyise',pa[i].idxs.concat(pa[j].idxs)));
  const chA=packBest(R,oa); chA.forEach(o=>push(o.id,1,o.closed));
  if(quad&&!chA.some(o=>o.id==='shuangyise')) push('shuangyise');
  // 兩色同順 / 三色同順 / 雙同順
  const ob=[];
  for(let i=0;i<chows.length;i++) for(let j=i+1;j<chows.length;j++){ const a=chows[i],b=chows[j]; if(cn(a)===cn(b)&&cs(a)!==cs(b)) ob.push(occ('liangse',[a.idx,b.idx])); }
  for(let i=0;i<chows.length;i++) for(let j=i+1;j<chows.length;j++) for(let l=j+1;l<chows.length;l++){
    const a=chows[i],b=chows[j],c=chows[l];
    if(cn(a)===cn(b)&&cn(b)===cn(c)&&new Set([cs(a),cs(b),cs(c)]).size===3) ob.push(occ('sanse',[a.idx,b.idx,c.idx]));
  }
  const pb=ob.filter(o=>o.id==='liangse');
  for(let i=0;i<pb.length;i++) for(let j=i+1;j<pb.length;j++) if(pb[i].idxs.every(x=>pb[j].idxs.indexOf(x)<0)) ob.push(occ('shuangtong',pb[i].idxs.concat(pb[j].idxs)));
  packBest(R,ob).forEach(o=>push(o.id,1,o.closed));
  // 四同順 / 五同順
  const byNum={}; chows.forEach(c=>{ byNum[cn(c)]=(byNum[cn(c)]||0)+1; });
  Object.keys(byNum).forEach(k=>{ if(byNum[k]>=5) push('tong5'); else if(byNum[k]>=4) push('tong4'); });
  // 老少順
  const oc=[];
  for(let su=0;su<3;su++){
    const l1=chows.filter(c=>cs(c)===su&&cn(c)===1), l7=chows.filter(c=>cs(c)===su&&cn(c)===7);
    l1.forEach(a=>l7.forEach(b=>oc.push(occ('laoshaoshun',[a.idx,b.idx]))));
  }
  const pc=oc.filter(o=>o.id==='laoshaoshun');
  for(let i=0;i<pc.length;i++) for(let j=i+1;j<pc.length;j++) if(pc[i].idxs.every(x=>pc[j].idxs.indexOf(x)<0)) oc.push(occ('shuanglaoshaoshun',pc[i].idxs.concat(pc[j].idxs)));
  packBest(R,oc).forEach(o=>push(o.id,1,o.closed));
  // 龍
  const od=[];
  for(let su=0;su<3;su++){
    const a=chows.filter(c=>cs(c)===su&&cn(c)===1), b=chows.filter(c=>cs(c)===su&&cn(c)===4), c3=chows.filter(c=>cs(c)===su&&cn(c)===7);
    a.forEach(x=>b.forEach(y=>c3.forEach(z=>od.push(occ('qinglong',[x.idx,y.idx,z.idx])))));
  }
  perms3().forEach(p=>{
    const a=chows.filter(c=>cs(c)===p[0]&&cn(c)===1), b=chows.filter(c=>cs(c)===p[1]&&cn(c)===4), c3=chows.filter(c=>cs(c)===p[2]&&cn(c)===7);
    a.forEach(x=>b.forEach(y=>c3.forEach(z=>od.push(occ('zalong',[x.idx,y.idx,z.idx])))));
  });
  packBest(R,od).forEach(o=>push(o.id,1,o.closed));
  // 步高(三色)
  const at=(n)=>chows.filter(c=>cn(c)===n);
  const oe=[], of_=[], og=[];
  for(let n=1;n<=5;n++){
    at(n).forEach(a=>at(n+1).forEach(b=>at(n+2).forEach(c=>{
      if(new Set([cs(a),cs(b),cs(c)]).size===3){
        oe.push(occ('sanbu3',[a.idx,b.idx,c.idx]));
        at(n+3).forEach(d=>{ if(cs(d)===cs(a)){ oe.push(occ('sanbu4',[a.idx,b.idx,c.idx,d.idx]));
          at(n+4).forEach(e=>{ if(cs(e)===cs(b)) oe.push(occ('sanbu5',[a.idx,b.idx,c.idx,d.idx,e.idx])); }); } });
      }
      if(cs(a)===cs(b)&&cs(b)===cs(c)){
        of_.push(occ('yibu3',[a.idx,b.idx,c.idx]));
        at(n+3).forEach(d=>{ if(cs(d)===cs(a)){ of_.push(occ('yibu4',[a.idx,b.idx,c.idx,d.idx]));
          at(n+4).forEach(e=>{ if(cs(e)===cs(a)) of_.push(occ('yibu5',[a.idx,b.idx,c.idx,d.idx,e.idx])); }); } });
      }
    })));
  }
  for(let n=1;n<=3;n++){
    at(n).forEach(a=>at(n+2).forEach(b=>at(n+4).forEach(c=>{
      if(cs(a)===cs(b)&&cs(b)===cs(c)){
        og.push(occ('lianhuantao',[a.idx,b.idx,c.idx]));
        at(n+6).forEach(d=>{ if(cs(d)===cs(a)) og.push(occ('jinmen',[a.idx,b.idx,c.idx,d.idx])); });
      }
    })));
  }
  [oe,of_,og].forEach(list=>{ const b=bestSingle(R,list); if(b) push(b.id,1,b.closed); });
  // 暗刻 / 坎坎糊
  const ac=trips.filter(s=>!s.open&&!s.ronPung).length;
  if(ac>=2) push('an'+Math.min(ac,5));
  if(ac===5&&kongs.length===0) push('kankan');
  // 老少刻
  const tp=(su,n)=>trips.filter(s=>s.tile<27&&suitOf(s.tile)===su&&numOf(s.tile)===n);
  const ok=[];
  for(let su=0;su<3;su++) tp(su,1).forEach(a=>tp(su,9).forEach(b=>ok.push(occ('laoshaoke',[a.idx,b.idx]))));
  const pk=ok.slice();
  for(let i=0;i<pk.length;i++) for(let j=i+1;j<pk.length;j++) if(pk[i].idxs.every(x=>pk[j].idxs.indexOf(x)<0)) ok.push(occ('shuanglaoshaoke',pk[i].idxs.concat(pk[j].idxs)));
  packBest(R,ok).forEach(o=>push(o.id,1,o.closed));
  // 連刻
  const lc=[];
  const runs=[];
  for(let su=0;su<3;su++){
    const ns=Array.from(new Set(trips.filter(s=>s.tile<27&&suitOf(s.tile)===su).map(s=>numOf(s.tile)))).sort((a,b)=>a-b);
    let i=0;
    while(i<ns.length){
      let j=i; while(j+1<ns.length&&ns[j+1]===ns[j]+1) j++;
      const L=j-i+1;
      if(L>=2){
        runs.push({su,L,s:ns[i],e:ns[j]});
        const smallOK=P<27&&suitOf(P)===su&&(numOf(P)===ns[i]-1||numOf(P)===ns[j]+1);
        const bigId={2:'lian2',3:'dlian3',4:'dlian4',5:'dlian5'}[L];
        if(bigId) lc.push({id:bigId,idxs:[0],closed:true});
        if(smallOK){ const sid={2:'xlian3',3:'xlian4',4:'xlian5',5:'xlian6'}[L]; if(sid) lc.push({id:sid,idxs:[0],closed:true}); }
      }
      i=j+1;
    }
  }
  if(runs.length>=2) lc.push({id:'shuanglian',idxs:[0],closed:true});
  const bl=bestSingle(R,lc); if(bl) push(bl.id);
  // 同刻
  const ot=[];
  for(let n=1;n<=9;n++){
    const list=[0,1,2].map(su=>tp(su,n)[0]).map((x,su)=>x?{su,idx:x.idx}:null).filter(Boolean);
    if(list.length===3) ot.push(occ('dtongke3',list.map(x=>x.idx)));
    for(let i=0;i<list.length;i++) for(let j=i+1;j<list.length;j++){
      ot.push(occ('tongke2',[list[i].idx,list[j].idx]));
      if(list.length===2){ const third=[0,1,2].find(su=>!list.some(x=>x.su===su)); if(P<27&&suitOf(P)===third&&numOf(P)===n) ot.push(occ('xtongke3',[list[i].idx,list[j].idx,100+n])); }
    }
  }
  const pt=ot.filter(o=>o.id==='tongke2');
  for(let i=0;i<pt.length;i++) for(let j=i+1;j<pt.length;j++) if(pt[i].idxs.every(x=>pt[j].idxs.indexOf(x)<0)) ot.push(occ('shuangtongke',pt[i].idxs.concat(pt[j].idxs)));
  packBest(R,ot).forEach(o=>push(o.id,1,o.closed));
  // 數字類
  const groups=sets.map(tilesOf); groups.push([P,P]);
  const hasT=g=>g.some(t=>!isHon(t)&&(numOf(t)===1||numOf(t)===9));
  const hasTH=g=>g.some(t=>isHon(t)||numOf(t)===1||numOf(t)===9);
  const hasHon=tilesAll.some(isHon);
  if(tilesAll.every(t=>isHon(t)||numOf(t)===1||numOf(t)===9)){ if(hasHon&&!tilesAll.every(isHon)) push('hunyaojiu'); else if(!hasHon) push('qingyaojiu'); }
  if(groups.every(hasT)) push('quandaiyao'); else if(groups.every(hasTH)&&hasHon) push('hundaiyao');
  let manX=0;
  for(let x=1;x<=9;x++){
    if(groups.every(g=>g.some(t=>!isHon(t)&&numOf(t)===x))){ push('manting'); manX=x; break; }
  }
  if(!manX){
    for(let x=1;x<=9;x++){
      if(groups.every(g=>g.some(t=>isHon(t)||numOf(t)===x))&&hasHon){ push('hunmanting'); manX=x; break; }
    }
  }
  // 四歸
  const tc=Array(34).fill(0), gc=Array(34).fill(0), openT=Array(34).fill(false), kt=new Set(kongs.map(k=>k.tile));
  sets.forEach(s=>{
    if(s.t==='chow'){ for(let k=0;k<3;k++){ tc[s.tile+k]++; gc[s.tile+k]++; if(s.open) openT[s.tile+k]=true; } }
    else { tc[s.tile]+=(s.t==='kong'?4:3); gc[s.tile]++; if(s.open&&s.t!=='kong') openT[s.tile]=true; }
  });
  tc[P]+=2; gc[P]++;
  let mg=0;
  for(let t=0;t<34;t++) if(tc[t]===4&&!kt.has(t)&&gc[t]>=2){ mg++; push('sigui'+Math.min(gc[t],4),1,!openT[t]); }
  if(mg===2) push('bagui'); else if(mg>=3) push('shierguei');
  let out=applySuppress(items,{manX});
  // 大雞 / 大鴨
  if(!ctx.selfDraw){ if(out.length===1&&out[0].id==='hua'&&out[0].n===1) out.push({id:'daji',n:1,closed:false}); }
  else if(out.length===2&&out.some(i=>i.id==='hua'&&i.n===1)&&out.some(i=>i.id==='zimo')) out.push({id:'daya',n:1,closed:false});
  return out;
}
function specialItems(ctx,cnt,win,kind,waits){
  const items=[]; const push=(id,n)=>{ n=n===undefined?1:n; if(n>0) items.push({id,n,closed:true}); };
  const tilesAll=[]; cnt.forEach((c,t)=>{ for(let i=0;i<c;i++) tilesAll.push(t); });
  stateItems(ctx,items,true,tilesAll);
  colorFans(ctx,items,tilesAll);
  const grp=t=>t<=26?2+((t/9)|0):(t<=30?0:1);
  menFans(ctx,items,tilesAll,[false,false,false,false,false]);
  if(kind==='lik'){
    push('likgu');
    if(cnt[win]===3) push('baduilik');
    const pr=t=>cnt[t]>=2;
    if([31,32,33].every(pr)) push('sanyuanlik');
    if([27,28,29,30].every(pr)) push('sixilik');
    for(let n=0;n<9;n++) if(pr(n)&&pr(9+n)&&pr(18+n)) push('sansetongdui');
    let best=0;
    for(let su=0;su<3;su++){ let run=0; for(let n=0;n<9;n++){ if(pr(su*9+n)){ run++; if(run>best) best=run; } else run=0; } }
    if(best>=3) push('lianduei'+best);
    let q=0; for(let t=0;t<34;t++) if(cnt[t]===4){ q++; items.push({id:'sigui2',n:1,closed:true}); }
    if(q===2) push('bagui'); else if(q>=3) push('shierguei');
    if(waits===1) push('dudu');
  } else if(kind==='shisan'){ push('shisanyao'); if(waits>=13) push('shisanfei'); }
  else if(kind==='buda'){ push('shiliubuda'); if(waits>=16) push('shiliufei'); }
  return applySuppress(items,{});
}
function basic(inp){
  const ctx={flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{},seatWind:inp.seatWind};
  const items=[]; const push=(id,n)=>{ n=n===undefined?1:n; if(n>0) items.push({id,n,closed:false}); };
  if(ctx.selfDraw) push('zimo');
  if(ctx.flags.ting) push('ting');
  FLAGIDS.forEach(k=>{ if(ctx.flags[k]) push(k); });
  flowerItems(ctx,push);
  return applySuppress(items,{});
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
  if(all.some(c=>c>4)&&!(melds.length===0&&isLik2(cnt)&&false)) { if(all.some(c=>c>4)) return {error:'同一款牌多於4張'}; }
  const win=inp.win;
  if(win==null||!cnt[win]) return {error:'請選擇胡牌'};
  const base={R,flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{},seatWind:inp.seatWind,roundWind:inp.roundWind};
  const noMelds=melds.length===0;
  const complete=c=>decompose(c,nSets).length>0||(noMelds&&(isLik2(c)||isShisan(c)||isBuda(c)));
  let wcache=null;
  base.getWaits=function(){
    if(wcache!==null) return wcache;
    const b=cnt.slice(); b[win]--; let n=0;
    for(let w=0;w<34;w++){ b[w]++; if(all[w]-(w===win?1:0)+1<=4&&complete(b)) n++; b[w]--; }
    wcache=n; return n;
  };
  const meldSets=melds.map(m=>({t:m.t,tile:m.tile,open:m.t==='kong'?m.open!==false:true}));
  const tot=items=>items.reduce((a,x)=>a+valueOf(R,x),0);
  let cands=[];
  decompose(cnt.slice(),nSets).forEach(D=>{
    placements(D,win).forEach(pl=>{
      const sets=meldSets.map(s=>({t:s.t,tile:s.tile,open:s.open})).concat(D.sets.map((s,i)=>({t:s.t,tile:s.tile,open:false,ronPung:(pl.kind==='pung'&&pl.idx===i&&!base.selfDraw)})));
      const items=evalBasic(base,sets,D.pair,pl);
      cands.push({items,total:tot(items)});
    });
  });
  cands.sort((a,b)=>b.total-a.total);
  const bestBasic=cands.length?cands[0]:null;
  const specials=[];
  if(noMelds){
    if(isLik2(cnt)){ const it=specialItems(base,cnt,win,'lik',base.getWaits()); specials.push({items:it,total:tot(it),lik:true}); }
    if(isShisan(cnt)){ const it=specialItems(base,cnt,win,'shisan',base.getWaits()); specials.push({items:it,total:tot(it)}); }
    if(isBuda(cnt)){ const it=specialItems(base,cnt,win,'buda',base.getWaits()); specials.push({items:it,total:tot(it)}); }
  }
  let finals=[];
  if(bestBasic) finals.push(bestBasic);
  specials.forEach(s=>{
    if(s.lik&&bestBasic){ const comb=bestBasic.items.concat(s.items); finals.push({items:comb,total:tot(comb)}); }
    else finals.push(s);
  });
  if(!finals.length) return {error:'未能組成胡牌形(可改用手動選番)'};
  finals.sort((a,b)=>b.total-a.total);
  return {items:finals[0].items,total:finals[0].total,count:cands.length+specials.length,waits:base.getWaits()};
}
function settle(winners,dealer,streak,cfg){
  const d=[0,0,0,0], bonus=1+2*streak, base=cfg.fanValue*cfg.baseMult;
  winners.forEach(w=>{
    const payers=w.self?[0,1,2,3].filter(i=>i!==w.p):[w.disc];
    payers.forEach(q=>{ const fan=w.total+((q===dealer||w.p===dealer)?bonus:0); const amt=base+fan*cfg.fanValue; d[q]-=amt; d[w.p]+=amt; });
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
const API={id:'hkma',tName,suitOf,numOf,isHon,FLOWERS,FANS,INSTANT,FLAGS,SUPPRESS:SUP,buildRules,valueOf,analyze,basic,settle,instantDeltas,transfers,SUITS,HON,decompose};
if(typeof module!=='undefined'&&module.exports) module.exports=API; else root.MJ2=API;
})(typeof window!=='undefined'?window:globalThis);
