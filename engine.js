(function(root){
'use strict';
const SUITS=['萬','筒','索'], HON='東南西北中發白';
const tName=i=>i<27?(i%9+1)+SUITS[(i/9)|0]:HON[i-27];
const suitOf=i=>i<27?((i/9)|0):3;
const numOf=i=>i<27?(i%9+1):0;
const isHon=i=>i>=27;
const FLOWERS=['春','夏','秋','冬','梅','蘭','菊','竹'];
const YAO=[0,8,9,17,18,26,27,28,29,30,31,32,33];

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
function isLik(cnt){ let t=0,p=0; for(const c of cnt){ if(c===0) continue; if(c===3) t++; else if(c===2) p++; else return false; } return t===1&&p===7; }
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
  const key=a=>a.join(',');
  const cls=a=>a[0]%3;
  const dragon=['1,4,7','2,5,8','3,6,9'];
  const keys=sets.map(key);
  const isLong=keys.every(k=>dragon.indexOf(k)>=0)&&new Set(keys).size===3;
  const isFeng=new Set(keys).size===1;
  return {sets,isLong,isFeng};
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

function makeEngine(spec){
  const MAN=spec.MANUAL||[];
  const FANS=spec.RAW.map(r=>({id:r[0],name:r[1],fan:r[2],fanC:r[3]===undefined?null:r[3],manual:MAN.indexOf(r[0])>=0}));
  const SUP=spec.SUP, FORMULA=spec.FORMULA||{};
  function buildRules(over){
    const R={}; FANS.forEach(f=>{R[f.id]={id:f.id,name:f.name,fan:f.fan,fanC:f.fanC,manual:f.manual};});
    if(over) Object.keys(over).forEach(k=>{ if(R[k]){ const o=over[k]; if(o.fan!=null&&!isNaN(o.fan)) R[k].fan=+o.fan; if(o.fanC!=null&&!isNaN(o.fanC)) R[k].fanC=+o.fanC; }});
    return R;
  }
  function valueOf(R,it){
    const r=R[it.id]; if(!r) return 0;
    const n=it.n===undefined?1:it.n;
    if(FORMULA[it.id]) return FORMULA[it.id](n,r.fan);
    const u=(it.closed&&r.fanC!=null)?r.fanC:r.fan; return u*n;
  }
  function applySuppress(items,info){
    const ids=new Set(items.map(i=>i.id)), kill=new Set();
    Object.keys(SUP).forEach(a=>{ if(ids.has(a)) SUP[a].forEach(b=>kill.add(b)); });
    if(spec.ziyiseKillAn&&ids.has('ziyise')&&info.concealed) ['an2','an3','an4','an5'].forEach(b=>kill.add(b));
    if(info.dx&&[1,2,8,9].indexOf(info.dx)>=0) kill.add('quewu');
    let out=items.filter(i=>!kill.has(i.id));
    return out;
  }
  function packBest(R,occs){
    let best=[],bv=-1; const val=o=>valueOf(R,{id:o.id,n:1,closed:o.closed});
    (function dfs(i,chosen,v){
      if(v>bv){ bv=v; best=chosen.slice(); }
      for(let j=i;j<occs.length;j++){ const o=occs[j]; if(chosen.every(c=>shareOK(c.idxs,o.idxs))){ chosen.push(o); dfs(j+1,chosen,v+val(o)); chosen.pop(); } }
    })(0,[],0);
    return best;
  }
  function stateItems(ctx,items,concealed,tilesAll,o){
    const R=ctx.R, f=ctx.flags||{};
    const push=(id,n,closed)=>{ n=n===undefined?1:n; if(n>0&&R[id]) items.push({id,n,closed:!!closed}); };
    if(o.skipMenqing){ if(ctx.selfDraw) push('zimo'); }
    else if(concealed&&ctx.selfDraw) push('menqing_zimo');
    else if(concealed) push('menqing');
    else if(ctx.selfDraw) push('zimo');
    if(concealed&&ctx.selfDraw&&!R.menqing_zimo){ push('menmo'); }
    if(f.ting){ if((concealed||o.skipMenqing)&&R.menting) push('menting'); else push('ting'); }
    ['jishi','qiangkong','huashang','kongshang','haidi','hedi','tianhu','dihu','renhu','tianting','shuangxiang','sanxiang','guanshou'].forEach(k=>{ if(f[k]) push(k); });
    const fl=ctx.flowers||Array(8).fill(false), nf=fl.filter(Boolean).length;
    push('hua',nf);
    const hasHon=tilesAll.some(isHon);
    if(nf===0) push('wuhua');
    if(!hasHon) push('wuzi');
    if(!o.pinghu&&!hasHon&&nf===0) push('wuzihua');
    return {nf,hasHon};
  }
  function colorFans(ctx,items,tilesAll,meldG){
    const R=ctx.R; const push=id=>{ if(R[id]) items.push({id,n:1,closed:false}); };
    const hasHon=tilesAll.some(isHon);
    const suits=new Set(tilesAll.filter(t=>!isHon(t)).map(suitOf));
    if(tilesAll.every(t=>numOf(t)!==5)) push('quewu');
    if(suits.size===2) push('queyimen');
    if(tilesAll.every(t=>!isHon(t)&&numOf(t)>=2&&numOf(t)<=8)) push('duanyao');
    if(suits.size===1&&hasHon) push('hunyise'); else if(suits.size===1&&!hasHon) push('qingyise'); else if(suits.size===0) push('ziyise');
    const present=[tilesAll.some(t=>t>=27&&t<=30),tilesAll.some(t=>t>=31),tilesAll.some(t=>t<9),tilesAll.some(t=>t>=9&&t<18),tilesAll.some(t=>t>=18&&t<27)];
    if(present.every(Boolean)){
      const fl=ctx.flowers||[]; const fok=fl.slice(0,4).some(Boolean)&&fl.slice(4).some(Boolean);
      const da=meldG?meldG.every(Boolean):false;
      push('wumen'); push(da?'dawumen':'xiaowumen');
      if(fok) push('qimen');
    }
    if(tilesAll.every(t=>!isHon(t)&&numOf(t)>=6)) push('dayu5');
    if(tilesAll.every(t=>!isHon(t)&&numOf(t)<=4)) push('xiaoyu5');
    if(tilesAll.every(t=>!isHon(t)&&(numOf(t)===1||numOf(t)===9))) push('quanyaojiu');
    const BLUE=[16,27,28,29,30,33], GREEN=[19,20,21,23,25,32];
    if(tilesAll.every(t=>BLUE.indexOf(t)>=0)) push('lanyise');
    if(tilesAll.every(t=>GREEN.indexOf(t)>=0)) push('lvyise');
  }
  function evalStructure(ctx,sets,P,pl){
    const R=ctx.R, items=[];
    const push=(id,n,closed)=>{ n=n===undefined?1:n; if(n>0&&R[id]) items.push({id,n,closed:!!closed}); };
    const pickMax=c=>{ let b=null,bv=0; for(const x of c){ const v=valueOf(R,x); if(v>bv){bv=v;b=x;} } if(b) items.push(b); };
    sets.forEach((s,i)=>{ s.idx=i; });
    const chows=sets.filter(s=>s.t==='chow'), trips=sets.filter(s=>s.t!=='chow'), kongs=sets.filter(s=>s.t==='kong');
    const tilesOf=s=>s.t==='chow'?[s.tile,s.tile+1,s.tile+2]:[s.tile,s.tile,s.tile];
    const tilesAll=[]; sets.forEach(s=>tilesOf(s).forEach(t=>tilesAll.push(t))); tilesAll.push(P,P);
    const concealed=sets.every(s=>!s.open);
    const grp=t=>t<=26?2+((t/9)|0):(t<=30?0:1);
    const meldG=[false,false,false,false,false]; sets.forEach(s=>{ meldG[grp(s.tile)]=true; });
    const pinghu=chows.length===5||(!spec.pinghuStrict&&trips.length===0&&!isHon(P));
    const st=stateItems(ctx,items,concealed,tilesAll,{pinghu:chows.length===5||pinghu});
    colorFans(ctx,items,tilesAll,meldG);
    const fl=st.nf;
    if(pinghu){ if(fl===0&&!st.hasHon) push('wuzihua_pinghu'); else push('pinghu'); }
    // 字牌
    const wt=trips.filter(s=>s.tile>=27&&s.tile<=30).length, pw=P>=27&&P<=30;
    const dt=trips.filter(s=>s.tile>=31).length, pdg=P>=31;
    let cov=0;
    if(wt===4){ push('daxixi'); cov+=4; } else if(wt===3&&pw){ push('xiaosixi'); cov+=3; } else if(wt===3){ push('dasanfeng'); cov+=3; } else if(wt===2&&pw){ push('xiaosanfeng'); cov+=2; }
    if(dt===3){ push('dasanyuan'); cov+=3; } else if(dt===2&&pdg){ push('xiaosanyuan'); cov+=2; }
    push('zi',Math.max(0,trips.filter(s=>isHon(s.tile)).length-cov));
    push('minggang',kongs.filter(s=>s.open).length);
    push('angang',kongs.filter(s=>!s.open).length);
    if(!isHon(P)&&[2,5,8].indexOf(numOf(P))>=0) push('jiangyan');
    const waits=ctx.getWaits();
    if(waits===1) push('dudu'); else if(pl.kind==='edge'||pl.kind==='mid'||pl.kind==='pair') push('jiadu');
    if(pl.kind==='pung'&&waits>=2) push('duipeng');
    if(chows.length===0) push('duidui');
    const cn=c=>numOf(c.tile), cs=c=>suitOf(c.tile);
    const occ=(id,idxs)=>({id,idxs,closed:idxs.every(i=>!sets[i].open)});
    // 般高
    const kc={}; chows.forEach(s=>{kc[s.tile]=(kc[s.tile]||0)+1;});
    Object.keys(kc).forEach(k=>{ const c=kc[k]; if(c===2) push('banggao'); else if(c===3) push('sanbanggao'); else if(c===4) push('sibanggao'); else if(c>=5){ push('sibanggao'); push('wutongshun'); } });
    // 兩色同順 / 三相逢
    const ob=[];
    for(let i=0;i<chows.length;i++) for(let j=i+1;j<chows.length;j++){ const a=chows[i],b=chows[j]; if(cn(a)===cn(b)&&cs(a)!==cs(b)) ob.push(occ('zimei',[a.idx,b.idx])); }
    for(let i=0;i<chows.length;i++) for(let j=i+1;j<chows.length;j++) for(let l=j+1;l<chows.length;l++){
      const a=chows[i],b=chows[j],c=chows[l];
      if(cn(a)===cn(b)&&cn(b)===cn(c)&&new Set([cs(a),cs(b),cs(c)]).size===3) ob.push(occ('xiangfeng',[a.idx,b.idx,c.idx]));
    }
    packBest(R,ob).forEach(o=>push(o.id,1,o.closed));
    // 全姊妹:五組順子,每個數字組都有兩種以上花色
    if(chows.length===5){
      const byN={}; chows.forEach(c=>{ (byN[cn(c)]=byN[cn(c)]||new Set()).add(cs(c)); });
      if(Object.keys(byN).every(k=>byN[k].size>=2)) push('quanzimei');
    }
    // 老少上
    const cl=(su,num)=>chows.filter(c=>cs(c)===su&&cn(c)===num);
    for(let su=0;su<3;su++) if(cl(su,1).length&&cl(su,7).length) push('laoshaoshang');
    // 龍
    const closedOK=arrs=>arrs.every(a=>a.some(s=>!s.open));
    let dragon=null;
    for(let su=0;su<3&&!dragon;su++){ const a=[cl(su,1),cl(su,4),cl(su,7)]; if(a.every(x=>x.length)) dragon={id:'qinglong',closed:closedOK(a)}; }
    if(!dragon){ for(const p of perms3()){ const a=[cl(p[0],1),cl(p[1],4),cl(p[2],7)]; if(a.every(x=>x.length)){ dragon={id:'zalong',closed:closedOK(a)}; break; } } }
    if(dragon) push(dragon.id,1,dragon.closed);
    // 步高
    const bb=[];
    for(let su=0;su<3;su++) for(let n=1;n<=5;n++){ const a=[cl(su,n),cl(su,n+1),cl(su,n+2)]; if(a.every(x=>x.length)) bb.push({id:'qingbubu',n:1,closed:closedOK(a)}); }
    for(let n=1;n<=5;n++) for(const p of perms3()){ const a=[cl(p[0],n),cl(p[1],n+1),cl(p[2],n+2)]; if(a.every(x=>x.length)) bb.push({id:'zabubu',n:1,closed:closedOK(a)}); }
    pickMax(bb);
    // 全步高類
    if(chows.length===5){
      const ns=chows.map(cn).sort((a,b)=>a-b);
      if(ns.every((v,i)=>i===0||v-ns[i-1]===1)){
        const same=chows.every(c=>cs(c)===cs(chows[0])), cl5=chows.every(c=>!sets[c.idx].open);
        if(same) push(cl5?'quananqingbugao':'quanqingbugao'); else push(cl5?'quananbugao':'quanbugao');
      }
    }
    // 刻子
    const tn=[{},{},{}]; trips.forEach(s=>{ if(s.tile<27) tn[suitOf(s.tile)][numOf(s.tile)]=true; });
    for(let su=0;su<3;su++) if(tn[su][1]&&tn[su][9]) push('laoshaopeng');
    let bp=false;
    for(let n=1;n<=7&&!bp;n++) for(const p of perms3()){ if(tn[p[0]][n]&&tn[p[1]][n+1]&&tn[p[2]][n+2]){ bp=true; break; } }
    if(bp){ push('bubupeng'); push('dwaiyu'); }
    else {
      // 小外語通:兩門刻子 + 第三門對子,數字連續
      let sw=false;
      for(let n=1;n<=7&&!sw;n++){
        const nums=[n,n+1,n+2];
        for(const p of perms3()){
          for(let k=0;k<3&&!sw;k++){
            const pairNum=nums[k], others=nums.filter((_,i)=>i!==k);
            if(tn[p[0]][others[0]]&&tn[p[1]][others[1]]&&P<27&&suitOf(P)===p[2]&&numOf(P)===pairNum) sw=true;
          }
        }
      }
      if(sw) push('xwaiyu');
    }
    for(let n=1;n<=9;n++){
      const sw2=[0,1,2].filter(su=>tn[su][n]);
      if(sw2.length===3) push('sanxiongdi');
      else if(sw2.length===2){
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
    if(ac===5&&kongs.length===0) push('kankan');
    // 帶么 / 全帶X
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
    // 求人
    if(spec.qiuHKMA){
      if(sets.every(s=>s.open&&s.t!=='kong')&&pl.kind==='pair') push(ctx.selfDraw?'banqiu':'quanqiu');
    } else {
      const openN=sets.filter(s=>s.open).length;
      if(!ctx.selfDraw){ if(openN===5) push('quanqiu'); else if(openN===4) push('banqiu'); }
    }
    // 四歸(四張相同牌未開槓,按組數計)
    const tc=Array(34).fill(0);
    sets.forEach(s=>{ if(s.t==='chow'){tc[s.tile]++;tc[s.tile+1]++;tc[s.tile+2]++;} else tc[s.tile]+=(s.t==='kong'?4:3); });
    tc[P]+=2;
    const kt=new Set(kongs.map(k=>k.tile)); const g4=[];
    for(let t=0;t<34;t++) if(tc[t]===4&&!kt.has(t)){
      const open=sets.some(s=>s.open&&(s.t==='chow'?(t>=s.tile&&t<=s.tile+2):s.tile===t)); g4.push(open);
    }
    if(g4.length){
      const closed=g4.every(o=>!o), n=g4.length;
      if(n===1) push('sigui1',1,closed); else if(n===2) push('sigui2',1,closed);
      else if(n===3){ push('sigui2',1,closed); push('sigui1',1,closed); } else push('sigui4',1,closed);
    }
    return applySuppress(items,{concealed,dx});
  }
  function evalLik(ctx,cnt){
    const R=ctx.R, items=[]; const push=(id,n,closed)=>{ n=n===undefined?1:n; if(n>0&&R[id]) items.push({id,n,closed:!!closed}); };
    const tilesAll=[]; cnt.forEach((c,t)=>{ for(let i=0;i<c;i++) tilesAll.push(t); });
    stateItems(ctx,items,true,tilesAll,{skipMenqing:true});
    colorFans(ctx,items,tilesAll,null);
    const trip=cnt.findIndex(c=>c===3);
    if(isHon(trip)) push('zi');
    push('likgu');
    if(spec.likJiangyanEach){ let n=0; for(let t=0;t<27;t++) if(cnt[t]>=2&&[2,5,8].indexOf(numOf(t))>=0) n++; push('jiangyan',n); }
    if(ctx.getWaits()===1) push('dudu');
    return applySuppress(items,{concealed:true,dx:0});
  }
  function specialItems(ctx,cnt,kind,info){
    const R=ctx.R, items=[]; const push=(id,n,closed)=>{ n=n===undefined?1:n; if(n>0&&R[id]) items.push({id,n,closed:!!closed}); };
    const tilesAll=[]; cnt.forEach((c,t)=>{ for(let i=0;i<c;i++) tilesAll.push(t); });
    stateItems(ctx,items,true,tilesAll,{skipMenqing:true});
    if(kind==='shisan') push('shisanyao');
    else {
      push('shiliubuda');
      if(info&&info.isLong) push('budalong',1,ctx.selfDraw);
      if(info&&info.isFeng) push('budafeng',1,ctx.selfDraw);
    }
    return applySuppress(items,{concealed:true,dx:0});
  }
  function basic(inp){
    const ctx={R:buildRules(null),flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{}};
    const R=ctx.R, items=[]; const push=(id,n)=>{ if(n>0&&R[id]) items.push({id,n:n===undefined?1:n,closed:false}); };
    if(ctx.selfDraw) push('zimo',1);
    ['ting','jishi','qiangkong','huashang','kongshang','haidi','hedi','tianhu','dihu','renhu','tianting','shuangxiang','sanxiang','guanshou'].forEach(k=>{ if(ctx.flags[k]) push(k,1); });
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
    if(win==null||!cnt[win]) return {error:'請選擇胡牌'};
    const base={R,flowers:inp.flowers||Array(8).fill(false),selfDraw:!!inp.selfDraw,flags:inp.flags||{}};
    const noMelds=melds.length===0;
    const complete=c=>decompose(c,nSets).length>0||(noMelds&&(isLik(c)||(spec.autoSpecial&&(isShisan(c)||budaInfo(c)))));
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
        const items=evalStructure(base,sets,D.pair,pl);
        cands.push({items,total:tot(items)});
      });
    });
    if(noMelds&&isLik(cnt)){ const items=evalLik(base,cnt); cands.push({items,total:tot(items)}); }
    if(noMelds&&spec.autoSpecial){
      if(isShisan(cnt)){ const it=specialItems(base,cnt,'shisan'); cands.push({items:it,total:tot(it)}); }
      const bi=budaInfo(cnt); if(bi){ const it=specialItems(base,cnt,'buda',bi); cands.push({items:it,total:tot(it)}); }
    }
    if(!cands.length) return {error:'未能組成胡牌形(可略過牌型,改用手動選番)'};
    cands.sort((a,b)=>b.total-a.total);
    return {items:cands[0].items,total:cands[0].total,count:cands.length,waits:base.getWaits()};
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
    else if(ins.mode==='payall'){ [0,1,2,3].forEach(i=>{ if(i!==ins.payer){ d[ins.payer]-=amt; d[i]+=amt; } }); }
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
  return {id:spec.id,tName,suitOf,numOf,isHon,FLOWERS,FANS,INSTANT:spec.INSTANT,FLAGS:spec.FLAGS,SUPPRESS:SUP,buildRules,valueOf,analyze,basic,settle,instantDeltas,transfers,decompose,isLik,SUITS,HON};
}

/* ===== 預設 #1:舊番表(陶源麻雀王大賽) ===== */
const RAW1=[
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
['zimei','兩色同順(姊妹)',3],['quanzimei','全姊妹',20],['laoshaoshang','老少上',3],
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
const MAN1=['hundaix','dajie','zimoji','qizi','sizi','shizi','shiliubuda','shisanyao','kankan'];
/* 不複合原則:參照預設 #2(香港麻雀協會總例)的做法整理 */
const SUP1={
 ziyise:['duidui','hundaiyao','qingdaiyao','quewu','zi'],
 qingdaiyao:['quewu','hundaiyao'], hundaiyao:['quewu'],
 an3:['an2'], an4:['an2','an3'], an5:['duidui','an2','an3','an4'],
 lian5:['duidui'], xlian6:['duidui','qingyise'],
 qinglong:['laoshaoshang'], quanqiu:['dudu','jiadu','banqiu'], qimen:['wumen'],
 wuzihua_pinghu:['pinghu','wuzihua'], menqing_zimo:['zimo','menqing'],
 tianhu:['zimo','menqing','menqing_zimo'], dihu:['menqing'], renhu:['menqing'], tianting:['ting'],
 dudu:['jiadu'], sibanggao:['sanbanggao','banggao'], sanbanggao:['banggao'],
 xiaosixi:['dasanfeng','xiaosanfeng'], dasanfeng:['xiaosanfeng'], dasanyuan:['xiaosanyuan']
};
const INSTANT1=[
{id:'angang_i',name:'暗槓',amt:5,mode:'all'},{id:'yitaihua',name:'一台花',amt:5,mode:'all'},
{id:'yitaicao',name:'一台草',amt:3,mode:'all'},{id:'qi_qiang_yi',name:'七搶一',amt:30,mode:'one'},
{id:'yi_qiang_qi',name:'一搶七',amt:30,mode:'one'},{id:'bahua',name:'8隻花糊',amt:60,mode:'all'},
{id:'jiaocuopeng',name:'叫錯碰(付打出者)',amt:5,mode:'one'},{id:'cuogang',name:'錯槓糊',amt:10,mode:'one'},
{id:'zhahu',name:'詐糊',amt:50,mode:'one'},
{id:'zhuifan',name:'追番子(付其餘三家)',amt:5,mode:'payall'},{id:'zhuikai',name:'追開章(付其餘三家)',amt:10,mode:'payall'}
];
const FLAGS1=[['ting','叮'],['qiangkong','搶槓'],['huashang','花上自摸'],['kongshang','槓上自摸'],['haidi','海底撈月'],['tianhu','天胡'],['dihu','地胡'],['renhu','人胡'],['tianting','天叮'],['shuangxiang','雙響'],['sanxiang','三響']];
const API1=makeEngine({id:'tw1',RAW:RAW1,MANUAL:MAN1,SUP:SUP1,INSTANT:INSTANT1,FLAGS:FLAGS1,ziyiseKillAn:true});

/* ===== 預設 #3:台牌百搭番數表 ===== */
const RAW3=[
['ting','聽牌',5],['menting','門清聽牌',15],['jishi','即食',5],['menqing','門清',5],
['duanyao','斷么',10],['queyimen','缺一門',10],['quewu','缺五',10],
['xiongdi','兄弟',5],['xiaosanxiongdi','小三兄弟',15],['sanxiongdi','大三兄弟',30],
['zimei','姊妹(兩色同順)',3],['laoshaoshang','老少上',3],['laoshaopeng','老少碰',5],
['jiangyan','將眼',2],['duipeng','對碰',2],['dudu','獨獨',2],['banqiu','半求人',20],['quanqiu','全求人',40],
['hunyise','混一色',40],['duidui','對對糊',50],['hundaiyao','混帶么',40],
['xiaowumen','小五門齊',10],['dawumen','大五門齊',15],['qimen','七門齊',20],['xwaiyu','小外語通',8],['dwaiyu','大外語通',15],
['shiliubuda','十六不搭',60],['likgu','嚦咕嚦咕',50],['shisanyao','十三么',120],['quanyaojiu','全么九',300],['kankan','刻刻糊',160],
['qingyise','清一色',100],['ziyise','字一色',240],['xiaosanyuan','小三元',40],['dasanyuan','大三元',80],
['xiaosanfeng','小三風',30],['dasanfeng','大三風',60],['xiaosixi','小四喜',90],['daxixi','大四喜',120],
['tianhu','天糊',120],['dihu','地糊',120],['guanshou','冚手糊(玩家決定蓋牌打)',40],
['lanyise','藍一色',300],['lvyise','綠一色',240],
['qinglong','清龍',10,20],['zalong','雜龍',8,15],['qingbubu','清步高',15,30],['zabubu','雜步高',5,10],['xiangfeng','三相逢',10,20],
['hua','花',2],['zi','字',2],['wuhua','無花',2],['wuzi','無字',2],['wuzihua','無字花',10],['wuzihua_pinghu','大平糊',20],
['minggang','明槓',1],['angang','暗槓',2],['qiangkong','搶槓',10],
['an2','兩暗刻',5],['an3','三暗刻',15],['an4','四暗刻',30],['an5','五暗刻',80],
['quanzimei','全姊妹',20],['quanbugao','全步高',60],['quananbugao','全暗步高',90],['quanqingbugao','全清步高',120],['quananqingbugao','全暗清步高',160],
['quandaix','全帶X',100],['qingdaiyao','全帶么',80],['dayu5','大於五',60],['xiaoyu5','小於五',60],
['banggao','般高',5],['sanbanggao','太般高',20],['sibanggao','超般高',80],
['zimo','自摸',2],['menqing_zimo','門清自摸',10],['huashang','花上自摸(1×N+1)',1],['kongshang','槓上自摸',7],['gsg','槓上槓摸',40],['ggg','槓槓槓摸',120],
['hedi','河底撈魚',10],['haidi','海底撈月',20],['haidi1','海底撈月(一筒)',40],
['sizi','四子',40],['qizi','七子',20],['shizi','十子',10],
['sigui1','四歸一',5,10],['sigui2','四歸二',10,20],['sigui4','四歸四',45,90],['budalong','不搭(龍)',10,20],['budafeng','不搭(逢)',10,20],
['daji40','大雞糊(純,無其他番)',40],['daji60','大雞糊(另有番數,照計)',60],
['hunx30','混帶X(30)',30],['hunx20','混帶X(20)',20],['hunx10','混帶X(10)',10]
];
const MAN3=['huashang_n','gsg','ggg','haidi1','sizi','qizi','shizi','daji40','daji60','hunx30','hunx20','hunx10'];
const SUP3={
 menting:['menqing','ting'], wuzihua:['wuzi','wuhua'], wuzihua_pinghu:['wuzihua','wuzi','wuhua'],
 ziyise:['qingyise','duidui','quewu','hundaiyao','qingdaiyao'],
 an3:['an2'], an4:['an2','an3'], an5:['an2','an3','an4','duidui'], kankan:['an2','an3','an4','an5','duidui','menqing'],
 qinglong:['laoshaoshang'], dwaiyu:[], quanqiu:['dudu','jiadu','banqiu'], dudu:['jiadu'],
 qingdaiyao:['quewu','hundaiyao'], hundaiyao:['quewu'],
 quanyaojiu:['duidui','qingdaiyao','hundaiyao','quewu'], dayu5:['quewu'], xiaoyu5:['quewu'],
 lanyise:['hunyise','duidui','quewu'], lvyise:['hunyise','qingyise'],
 qimen:['xiaowumen','dawumen'], dawumen:['xiaowumen'],
 menqing_zimo:['zimo','menqing'], tianhu:['zimo','menqing','menqing_zimo'], dihu:['menqing'],
 sibanggao:['sanbanggao','banggao'], sanbanggao:['banggao'],
 quananqingbugao:['quanqingbugao','quananbugao','quanbugao','qingbubu','zabubu'], quanqingbugao:['quanbugao','qingbubu','zabubu'],
 quananbugao:['quanbugao','zabubu','qingbubu'], quanbugao:['zabubu','qingbubu'],
 xiaosixi:['dasanfeng','xiaosanfeng'], dasanfeng:['xiaosanfeng'], dasanyuan:['xiaosanyuan'],
 shiliubuda:['menqing','xiaowumen','dawumen','qimen'], shisanyao:['menqing','xiaowumen','dawumen'],
 likgu:['menqing','pinghu','duidui']
};
const INSTANT3=[
{id:'yitaihua',name:'一台花',amt:5,mode:'all'},{id:'yitaicao',name:'一台草',amt:10,mode:'all'},
{id:'angang_i',name:'暗槓',amt:10,mode:'all'},{id:'weidou',name:'圍骰(莊家收其餘三家)',amt:5,mode:'all'},
{id:'wenzhuang',name:'問莊圍三',amt:15,mode:'all'},
{id:'qi_qiang_yi',name:'七搶一 / 一搶七',amt:30,mode:'one'},{id:'baxian',name:'八仙過海',amt:120,mode:'all'},
{id:'wangkai',name:'忘開暗槓(罰,付其餘三家)',amt:10,mode:'payall'},{id:'jiaocuopeng',name:'叫錯碰(罰,付其餘三家)',amt:5,mode:'payall'},
{id:'zhahu',name:'詐糊(30+底,付其餘三家)',amt:30,mode:'payall',plusBase:true},
{id:'zhuifan',name:'追番子(付其餘三家)',amt:5,mode:'payall'},{id:'zhuikai',name:'追開章(付其餘三家)',amt:10,mode:'payall'},
{id:'xue',name:'雪(罰)',amt:5,mode:'payall'},{id:'fanxue',name:'反雪(罰)',amt:10,mode:'payall'},
{id:'bing',name:'冰(罰)',amt:10,mode:'payall'},{id:'fanbing',name:'反冰(罰)',amt:20,mode:'payall'}
];
const FLAGS3=[['ting','聽牌'],['jishi','即食'],['qiangkong','搶槓'],['huashang','花上自摸'],['kongshang','槓上自摸'],['haidi','海底撈月'],['hedi','河底撈魚'],['tianhu','天糊'],['dihu','地糊'],['guanshou','冚手糊']];
const API3=makeEngine({id:'tw3',RAW:RAW3,MANUAL:MAN3,SUP:SUP3,INSTANT:INSTANT3,FLAGS:FLAGS3,autoSpecial:true,likJiangyanEach:true,qiuHKMA:true,
  FORMULA:{huashang:(n,base)=>base*n+1}});

if(typeof module!=='undefined'&&module.exports){ module.exports=API1; module.exports.MJ3=API3; }
else { root.MJ=API1; root.MJ3=API3; }
})(typeof window!=='undefined'?window:globalThis);
