"use strict";
const D={
"Desert Temple":{"Easy":253n,"Medium":396n,"Hard":785n,"Insane":1307n,"Nightmare":2669n},
"Winter Outpost":{"Easy":8340n,"Medium":11300n,"Hard":16140n,"Insane":27840n,"Nightmare":46180n},
"Pirate Island":{"Insane":51150n,"Nightmare":84910n},
"King's Castle":{"Insane":135900n,"Nightmare":271800n},
"The Underworld":{"Insane":546000n,"Nightmare":924000n},
"Samurai Palace":{"Insane":1724000n,"Nightmare":2280000n},
"The Canals":{"Insane":4594000n,"Nightmare":8005000n},
"Ghastly Harbor":{"Insane":12840000n,"Nightmare":24160000n},
"Steampunk Sewers":{"Insane":35700000n,"Nightmare":59600000n},
"Boss Raid (Lvl 130)":{"Tier 30":130000000n},
"Orbital Outpost":{"Insane":222000000n,"Nightmare":320000000n},
"Volcanic Chambers":{"Insane":750000000n,"Nightmare":1229000000n},
"Aquatic Temple":{"Insane":2036000000n,"Nightmare":3564000000n},
"Enchanted Forest":{"Insane":6900000000n,"Nightmare":11280000000n},
"Northern Lands":{"Insane":21840000000n,"Nightmare":36600000000n,"Nightmare + Rodin":60100000000n},
"Gilded Skies":{"Insane":63500000000n,"Nightmare":115500000000n},
"Yokai Peak":{"Insane":192650000000n,"Nightmare":350950000000n},
"Abyssal Void":{"Insane":1070000000000n,"Nightmare":1470000000000n}
}
const DEF={currentLevel:"181",currentExp:"0",targetLevel:"200",dungeon:"Northern Lands",difficulty:"Nightmare",runTime:"3:53",vip:true,boost:false,customXpEnabled:false,customXp:"36.6B"};
const U={"":1n,K:1000n,M:1000000n,B:1000000000n,T:1000000000000n,QA:1000000000000000n,QI:1000000000000000000n,SX:1000000000000000000000n};
const $=id=>document.getElementById(id),KEY="dq-xp-calculator-v4";
let tt,st;
function pbi(b,e){b=BigInt(b);e=BigInt(e);let r=1n;while(e){if(e&1n)r*=b;b*=b;e>>=1n}return r}
function lvl(l){const e=l-1,n=84n*pbi(113,e),d=pbi(100,e);return(n*2n+d)/(d*2n)}
function num(v){let s=String(v??"").trim().replaceAll(",","").toUpperCase();if(!s)return 0n;let m=s.match(/^([0-9]+(?:\.[0-9]+)?)\s*(K|M|B|T|QA|QI|SX)?$/);if(!m)throw Error("EXP 형식을 확인하세요. 예: 101B, 2.5T");let[a,f=""]=m[1].split("."),sc=10n**BigInt(f.length);return BigInt(a+f)*U[m[2]||""]/sc}
function sh(v,d=2){let a=v<0n?-v:v,sg=v<0n?"-":"",us=[[10n**21n,"Sx"],[10n**18n,"Qi"],[10n**15n,"Qa"],[10n**12n,"T"],[10n**9n,"B"],[10n**6n,"M"],[10n**3n,"K"]],sc=10n**BigInt(d);for(const[f,s]of us)if(a>=f){let x=(a*sc+f/2n)/f,w=x/sc,z=(x%sc).toString().padStart(d,"0").replace(/0+$/,"");return sg+w+(z?"."+z:"")+s}return sg+a}
function sec(v){let s=String(v||"").trim();if(!s)return 0;if(/^\d+(?:\.\d+)?$/.test(s))return Math.round(+s*60);let m=s.match(/^(\d+):([0-5]\d)$/);if(!m)throw Error("평균 시간은 3:53 형식으로 입력하세요.");return +m[1]*60+ +m[2]}
function dur(x){if(!x)return"—";let d=Math.floor(x/86400);x%=86400;let h=Math.floor(x/3600);x%=3600;let m=Math.floor(x/60),a=[];if(d)a.push(d+"d");if(h)a.push(h+"h");if((!d||!h)&&m)a.push(m+"m");return a.slice(0,2).join(" ")||"<1m"}
function ceil(a,b){return(a+b-1n)/b}
function state(){return{currentLevel:$("currentLevel").value,currentExp:$("currentExp").value,targetLevel:$("targetLevel").value,dungeon:$("dungeon").value,difficulty:$("difficulty").value,runTime:$("runTime").value,vip:$("vip").checked,boost:$("boost").checked,solo:$("solo").checked,hc:$("hc").checked,event2:$("event2").checked,event15:$("event15").checked,customXpEnabled:$("customXpEnabled").checked,customXp:$("customXp").value}}
function diffs(){let n=$("dungeon").value;$("difficulty").innerHTML=Object.keys(D[n]||{}).map(x=>'<option value="'+x+'">'+x+"</option>").join("")}
function apply(s){s={...DEF,...s};$("currentLevel").value=s.currentLevel;$("currentExp").value=s.currentExp;$("targetLevel").value=s.targetLevel;if(D[s.dungeon])$("dungeon").value=s.dungeon;diffs();if(D[$("dungeon").value]?.[s.difficulty]!==undefined)$("difficulty").value=s.difficulty;$("runTime").value=s.runTime;$("vip").checked=!!s.vip;$("boost").checked=!!s.boost;$("solo").checked=!!s.solo;$("hc").checked=!!s.hc;$("event2").checked=!!s.event2;$("event15").checked=!!s.event15;$("customXpEnabled").checked=!!s.customXpEnabled;$("customXp").value=s.customXp;$("customXpField").hidden=!$("customXpEnabled").checked}
function calc(){
let c=+$("currentLevel").value,t=+$("targetLevel").value;if(!Number.isInteger(c)||!Number.isInteger(t)||c<1||t<=c||t>1000)throw Error("레벨 입력값을 확인하세요.");
let ce=num($("currentExp").value),cr=lvl(c);if(ce<0n||ce>=cr)throw Error("현재 EXP가 현재 레벨 요구량보다 작아야 합니다.");
let total=0n,rows=[];for(let l=c;l<t;l++){let r=lvl(l),n=l===c?r-ce:r;total+=n;rows.push({l,n})}
let base=$("customXpEnabled").checked?num($("customXp").value):D[$("dungeon").value][$("difficulty").value];let mul=100+($("vip").checked?20:0)+($("boost").checked?100:0)+($("solo").checked?10:0)+($("hc").checked?10:0)+($("event2").checked?100:0)+($("event15").checked?50:0),xpr=base*BigInt(mul)/100n,runs=ceil(total,xpr),rs=sec($("runTime").value),rn=Number(runs),rph=rs?3600/rs:0,xph=rs?xpr*3600n/BigInt(rs):0n;rows.forEach(x=>x.r=ceil(x.n,xpr));return{c,t,ce,cr,total,rows,base,mul,xpr,runs,rs,rph,xph,time:rs?rn*rs:0}}
function render(o){$("runs").textContent=o.runs.toLocaleString("en-US");$("summary").textContent=$("dungeon").value+" · "+$("difficulty").value+" · Lv."+o.c+" → "+o.t;$("xpRemaining").textContent=sh(o.total);$("xpRemainingExact").textContent=o.total.toLocaleString("en-US")+" EXP";$("xpPerRun").textContent=sh(o.xpr);$("baseXpLabel").textContent="Base "+sh(o.base);$("multiplier").textContent=(o.mul/100).toFixed(2)+"x";$("timeRemaining").textContent=dur(o.time);$("runsPerHour").textContent=o.rph?o.rph.toFixed(1)+" runs/h":"시간 미입력";$("xpPerHour").textContent=o.xph?sh(o.xph)+"/h":"—";$("vipPart").textContent=$("vip").checked?"+0.20x":"+0.00x";$("boostPart").textContent=$("boost").checked?"+1.00x":"+0.00x";$("soloPart").textContent=$("solo").checked?"+0.10x":"+0.00x";$("hcPart").textContent=$("hc").checked?"+0.10x":"+0.00x";$("eventPart").textContent=$("event2").checked?"+1.00x":($("event15").checked?"+0.50x":"+0.00x");$("totalMultiplierSide").textContent=(o.mul/100).toFixed(2)+"x";$("multiplierCaption").textContent=[$("vip").checked?"VIP":"",$("boost").checked?"EXP Boost":"",$("solo").checked?"Solo":"",$("hc").checked?"HC":"",$("event2").checked?"2x Event":"",$("event15").checked?"1.5x Event":""].filter(Boolean).join(" + ")||"Base only";$("currentExpParsed").textContent="= "+o.ce.toLocaleString("en-US")+" EXP · 다음 레벨까지 "+sh(o.cr-o.ce);$("progressFrom").textContent=o.c;$("progressTo").textContent=o.t;$("progressFill").style.width=Math.max(2,Math.min(100,Number(o.ce*10000n/o.cr)/100))+"%";$("efficiencyBar").style.width=Math.min(100,Math.max(12,o.rph*6))+"%";$("levelList").innerHTML=o.rows.map(x=>'<div class="level-row"><span class="level-route"><span class="level-badge">Lv.'+x.l+" → "+(x.l+1)+'</span></span><span><strong>'+sh(x.n)+'</strong> <span class="muted">EXP</span></span><span><strong>'+x.r.toLocaleString("en-US")+'</strong> <span class="muted">판</span></span></div>').join("");$("error").hidden=true}
function rec(save=true){try{render(calc());if(save){clearTimeout(st);$("savedIndicator").textContent="저장 중…";st=setTimeout(()=>{localStorage.setItem(KEY,JSON.stringify(state()));$("savedIndicator").textContent="저장됨"},250)}}catch(e){$("error").textContent=e.message;$("error").hidden=false}}
function toast(m){let x=$("toast");x.textContent=m;x.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>x.classList.remove("show"),1800)}
function init(){
$("dungeon").innerHTML=Object.keys(D).map(x=>'<option value="'+x+'">'+x+"</option>").join("");let q=new URLSearchParams(location.search),saved=null;try{saved=JSON.parse(localStorage.getItem(KEY)||"null")}catch{};let u=q.has("from")?{currentLevel:q.get("from"),targetLevel:q.get("to"),currentExp:q.get("xp")||"0",dungeon:q.get("d")||DEF.dungeon,difficulty:q.get("mode")||DEF.difficulty,runTime:q.get("time")||DEF.runTime,vip:q.get("vip")==="1",boost:q.get("boost")==="1",solo:q.get("solo")==="1",hc:q.get("hc")==="1",event2:q.get("event2")==="1",event15:q.get("event15")==="1",customXpEnabled:q.get("custom")==="1",customXp:q.get("xprun")||DEF.customXp}:null;apply(u||saved||DEF);
$("dungeon").onchange=()=>{diffs();rec()};$("customXpEnabled").onchange=()=>{$("customXpField").hidden=!$("customXpEnabled").checked;rec()};$("event2").onchange=()=>{if($("event2").checked)$("event15").checked=false;rec()};$("event15").onchange=()=>{if($("event15").checked)$("event2").checked=false;rec()};["currentLevel","currentExp","targetLevel","difficulty","runTime","vip","boost","solo","hc","customXp"].forEach(id=>{$(id).oninput=()=>rec();$(id).onchange=()=>rec()});
$("resetButton").onclick=()=>{apply(DEF);localStorage.removeItem(KEY);history.replaceState(null,"",location.pathname);rec();toast("기본값으로 초기화했습니다.")};
$("shareButton").onclick=async()=>{let s=state(),q=new URLSearchParams({from:s.currentLevel,to:s.targetLevel,xp:s.currentExp,d:s.dungeon,mode:s.difficulty,time:s.runTime});if(s.vip)q.set("vip","1");if(s.boost)q.set("boost","1");if(s.solo)q.set("solo","1");if(s.hc)q.set("hc","1");if(s.event2)q.set("event2","1");if(s.event15)q.set("event15","1");if(s.customXpEnabled){q.set("custom","1");q.set("xprun",s.customXp)}let url=location.origin+location.pathname+"?"+q;try{await navigator.clipboard.writeText(url);toast("설정 링크가 복사되었습니다.")}catch{prompt("이 링크를 복사하세요.",url)}};
rec(false)}
init();