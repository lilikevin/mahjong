
const assert=require('assert'),W=require('./output/engine_wild.js');
function dec(c,n){
 for(let p=0;p<34;p++)if(c[p]>=2){c[p]-=2;
 function go(left){let t=c.findIndex(v=>v>0);if(t<0)return left===0;if(!left)return false;
 if(c[t]>=3){c[t]-=3;let ok=go(left-1);c[t]+=3;if(ok)return true;}
 if(t<27&&t%9<7&&c[t+1]&&c[t+2]){c[t]--;c[t+1]--;c[t+2]--;let ok=go(left-1);c[t]++;c[t+1]++;c[t+2]++;if(ok)return true;}return false;}
 const ok=go(n);c[p]+=2;if(ok)return true;}return false;
}
function lik(c){return c.filter(x=>x===3).length===1&&c.every(x=>[0,2,3,4].includes(x));}
function shisan(c){const y=[0,8,9,17,18,26,27,28,29,30,31,32,33];
 if(!y.every(t=>c[t]))return false;
 for(let t=0;t<34;t++){let gs=[];if(c[t]>=3)gs.push([t,t,t]);if(t<27&&t%9<7&&c[t]&&c[t+1]&&c[t+2])gs.push([t,t+1,t+2]);
 for(const g of gs){const d=c.slice();g.forEach(x=>d[x]--);if(d.reduce((a,b)=>a+b,0)===14&&y.every(x=>d[x]===1||d[x]===2)&&d.filter(x=>x===2).length===1&&d.every((v,x)=>!v||y.includes(x)))return true;}}return false;}
function buda(c){let tw=0;for(let t=27;t<34;t++){if(c[t]<1||c[t]>2)return false;if(c[t]===2)tw++;}
 for(let su=0;su<3;su++){let ns=[];for(let n=0;n<9;n++){let x=c[su*9+n];if(x>2)return false;if(x)ns.push(n);if(x===2)tw++;}if(ns.length!==3||ns[1]-ns[0]<3||ns[2]-ns[1]<3)return false;}return tw===1;}
function ok(c,n,sp){return dec(c.slice(),n)||(sp&&(lik(c)||shisan(c)||buda(c)));}
function brute(f,k,n,sp,base){let seen=new Set();const c=W.count(f);function go(start,left){if(!left){if(ok(c,n,sp))seen.add(c.join(','));return;}for(let t=start;t<34;t++)if(c[t]+base[t]<4){c[t]++;go(t,left-1);c[t]--;}}go(0,k);return seen;}
let seed=12345;function rand(n){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;}
function hand(n){for(;;){let a=[];for(let i=0;i<n;i++){let g=rand(2)?Array(3).fill(rand(34)):(()=>{let t=rand(3)*9+rand(7);return [t,t+1,t+2];})();a.push(...g);}let p=rand(34);a.push(p,p);if(Math.max(...W.count(a))<=4)return a;}}
let trials=0;
for(let i=0;i<90;i++){
 const n=i%5+1,k=i%3+1,sp=n===5,base=Array(34).fill(0);let a=hand(n);for(let j=a.length-1;j>0;j--){let x=rand(j+1);[a[j],a[x]]=[a[x],a[j]];}let f=a.slice(k);
 const expected=brute(f,k,n,sp,base),got=new Set([...W.targets(f,k,n,base,sp)].filter(c=>ok(c,n,sp)).map(c=>c.join(',')));
 assert.deepStrictEqual([...got].sort(),[...expected].sort());trials++;
}
for(const a of [[0,0,0,1,1,1,1,2,2,3,3,4,4,5,5,6,6],[0,8,9,17,18,26,27,28,29,30,31,32,33,33,1,2,3],[0,3,6,9,12,15,18,21,24,27,28,29,30,31,32,33,33]]){
 for(let k=0;k<=3;k++){let f=a.slice(k),base=Array(34).fill(0);const e=brute(f,k,5,true,base),g=new Set([...W.targets(f,k,5,base,true)].filter(c=>ok(c,5,true)).map(c=>c.join(',')));assert.deepStrictEqual([...g].sort(),[...e].sort());trials++;}}
assert.strictEqual(W.options({t:'chow',physical:[0,1,34],tile:0}).length,1);
assert.strictEqual(W.options({t:'pung',physical:[0,1,34],tile:0}).length,0);
assert.strictEqual(W.options({t:'kong',physical:[34,34,34,34],tile:33,open:false}).length,1);
console.log(JSON.stringify({comparisonCases:trials,groupValidationCases:3,passed:true}));
