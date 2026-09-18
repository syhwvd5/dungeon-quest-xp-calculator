"use strict";
(() => {
  const $p = id => document.getElementById(id);
  const compact = n => {
    n = Number(n);
    if (!Number.isFinite(n)) return "—";
    const units = [[1e15,"Qa"],[1e12,"T"],[1e9,"B"],[1e6,"M"],[1e3,"K"]];
    for (const [v,s] of units) if (Math.abs(n) >= v) return (n/v).toFixed(Math.abs(n/v)>=100?0:Math.abs(n/v)>=10?1:2).replace(/\.0+$/,"")+s;
    return Math.round(n).toLocaleString();
  };

  // Tabs
  const tabs = [...document.querySelectorAll(".planner-tab")];
  const views = [...document.querySelectorAll(".planner-view")];
  function showView(name) {
    tabs.forEach(b => b.classList.toggle("active", b.dataset.view === name));
    views.forEach(v => {
      const on = v.id === "view-" + name;
      v.hidden = !on;
      v.classList.toggle("active", on);
    });
    try { localStorage.setItem("dqr.activeTab.v1", name); } catch {}
  }
  tabs.forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));
  let savedTab = "runs";
  try { savedTab = localStorage.getItem("dqr.activeTab.v1") || "runs"; } catch {}
  if (!tabs.some(b => b.dataset.view === savedTab)) savedTab = "runs";
  showView(savedTab);

  // Data from dqr-planner, with Northern Lands kept aligned to this site's Discord-bot calibration.
  const DB = [
    ["Desert Temple","DT",{Easy:253,Medium:396,Hard:785,Insane:1307,Nightmare:2669}],
    ["Winter Outpost","WO",{Easy:8340,Medium:11300,Hard:16140,Insane:27840,Nightmare:46180}],
    ["Pirate Island","PI",{Insane:51150,Nightmare:84910}],
    ["King's Castle","KC",{Insane:135900,Nightmare:271800}],
    ["The Underworld","UW",{Insane:546000,Nightmare:924000}],
    ["Samurai Palace","SP",{Insane:1724000,Nightmare:2280000}],
    ["The Canals","TC",{Insane:4594000,Nightmare:8005000}],
    ["Ghastly Harbor","GH",{Insane:12840000,Nightmare:24160000}],
    ["Steampunk Sewers","SS",{Insane:35700000,Nightmare:59600000}],
    ["Boss Raid (Lvl 130)","BR",{"Tier 30":130000000}],
    ["Orbital Outpost","OO",{Insane:222000000,Nightmare:320000000}],
    ["Volcanic Chambers","VC",{Insane:750000000,Nightmare:1229000000}],
    ["Aquatic Temple","AT",{Insane:2036000000,Nightmare:3564000000}],
    ["Enchanted Forest","EF",{Insane:6900000000,Nightmare:11280000000}],
    ["Northern Lands","NL",{Insane:21840000000,Nightmare:36600000000,"Nightmare + Rodin":60100000000}],
    ["Gilded Skies","GS",{Insane:63500000000,Nightmare:115500000000}],
    ["Yokai Peak","YP",{Insane:192650000000,Nightmare:350950000000}],
    ["Abyssal Void","AV",{Insane:1070000000000,Nightmare:1470000000000}]
  ];

  // Dungeon EXP database
  const allDiffs = ["Easy","Medium","Hard","Insane","Nightmare","Nightmare + Rodin","Tier 30"];
  function renderExpDb() {
    const q = ($p("expSearch")?.value || "").trim().toLowerCase();
    const rows = DB.filter(([name,abbr]) => !q || name.toLowerCase().includes(q) || abbr.toLowerCase().includes(q));
    if ($p("expHead")) $p("expHead").innerHTML = "<tr><th>Dungeon</th>"+allDiffs.map(d=>"<th>"+d+"</th>").join("")+"</tr>";
    if ($p("expBody")) $p("expBody").innerHTML = rows.map(([name,abbr,runs]) =>
      "<tr><td class='dname'>"+name+" <small>"+abbr+"</small></td>"+
      allDiffs.map(d=>"<td>"+(runs[d] ? compact(runs[d]) : "—")+"</td>").join("")+"</tr>"
    ).join("");
    if ($p("expCount")) $p("expCount").textContent = rows.length+" / "+DB.length;
  }
  $p("expSearch")?.addEventListener("input", renderExpDb);
  renderExpDb();

  // Gamepass / farming snapshot
  const PRICES = [
    ["DT","670k","Accurate","2.4m","4.4m","10.1m"],
    ["WO","14m","Accurate","50m","91.7M","210m"],
    ["PI","45.5m","Accurate","162.5m","297.9m","682.5m"],
    ["KC","105m","Accurate","375m","687.5m","1.6B"],
    ["UW","210m","Accurate","750m","1.4B","3.1B"],
    ["SP","507.5m","Accurate","1.8B","3.3B","7.6B"],
    ["TC","857.5m","Accurate","3.1B","5.6B","12.9B"],
    ["GH","1.645B","Accurate","5.9B","10.8B","24.7B"],
    ["SS","3.9B","Accurate","13.8B","25.2B","57.8B"],
    ["BR","7.0B","Accurate","25B","45B","105B"],
    ["OO","8.4B","Accurate","30B","55B","126B"],
    ["VC","14.0B","Accurate","50.0B","91.7B","210.0B"],
    ["AT","16.8B","Accurate","60.0B","110.0B","252.0B"],
    ["EF","23.8B","Accurate","85.0B","155.8B","357.0B"],
    ["NL","31.5B","Accurate","NA","NA","NA"],
    ["GS","56.0B","Accurate","NA","NA","NA"],
    ["YP","NA","NA","NA","NA","NA"],
    ["AV","NA","NA","NA","NA","NA"]
  ];
  const fullName = Object.fromEntries(DB.map(([n,a])=>[a,n]));
  function renderPrices() {
    const q = ($p("priceSearch")?.value || "").trim().toLowerCase();
    const rows = PRICES.filter(r => !q || (fullName[r[0]]+" "+r[0]).toLowerCase().includes(q));
    if ($p("priceHead")) $p("priceHead").innerHTML = "<tr><th>Dungeon</th><th>Gamepass price</th><th>Accuracy</th><th>1HR</th><th>2HR</th><th>4HR</th></tr>";
    if ($p("priceBody")) $p("priceBody").innerHTML = rows.map(r =>
      "<tr><td class='dname'>"+(fullName[r[0]]||r[0])+" <small>"+r[0]+"</small></td>"+
      r.slice(1).map(x=>"<td>"+(String(x).toUpperCase()==="NA"?"—":x)+"</td>").join("")+"</tr>"
    ).join("");
    if ($p("priceCount")) $p("priceCount").textContent = rows.length+" / "+PRICES.length;
  }
  $p("priceSearch")?.addEventListener("input", renderPrices);
  renderPrices();

  // Pot + gold
  const GOLD_RAMP=[100,156,215,278,344,415,490,552,636,719,838,929,1055,1182,1308,1435,1561,1688,1814,1942,2159,2339,2529,2731];
  const CUM=[0]; for(let i=0;i<GOLD_RAMP.length;i++) CUM.push(CUM[i]+GOLD_RAMP[i]);
  const capStart=466, capRate=100000;
  let potMode="gear";
  function goldAt(n){n=Math.floor(n);if(n<0)return 0;if(n<GOLD_RAMP.length)return GOLD_RAMP[n];return Math.min(220*n-2335,capRate)}
  function cumulativeGold(k){k=Math.max(0,Math.floor(k));if(k<=24)return CUM[k];if(k<=capStart)return CUM[24]+(k-24)*(110*k+195);return capRate*k-23829475}
  function goldRange(a,b){a=Math.max(0,Math.floor(a));b=Math.max(a,Math.floor(b));return cumulativeGold(b)-cumulativeGold(a)}
  function gearPot(start,up){let s=start;for(let i=0;i<up;i++)s+=Math.min(10,Math.floor(s/20));return s}
  function calcPot(){
    const start=Math.max(0,Math.floor(+$p("potCurrent").value||0));
    const done=Math.max(0,Math.floor(+$p("potDone").value||0));
    const total=Math.max(0,Math.floor(+$p("potTotal").value||0));
    const left=Math.max(0,total-done);
    const result=potMode==="gear"?gearPot(start,left):start+left*10;
    $p("potMax").textContent=result.toLocaleString();
    const gold=goldRange(done,total);
    $p("goldNeeded").textContent=gold.toLocaleString();
    $p("goldNext").textContent=left?goldAt(done).toLocaleString()+" gold":"—";
    $p("upgradesLeft").textContent=left.toLocaleString();
    const pct=total?Math.min(100,done/total*100):0;
    $p("potProgress").style.width=pct+"%";
    $p("potProgressText").textContent=done.toLocaleString()+" / "+total.toLocaleString()+" ("+Math.round(pct)+"%)";
    $p("potFormula").textContent=potMode==="gear"?"S += min(10, floor(S/20))":"pot + remaining upgrades × 10";
    try{localStorage.setItem("dqr.pot.integrated.v1",JSON.stringify({potMode,start,done,total}))}catch{}
  }
  document.querySelectorAll("[data-potmode]").forEach(btn=>btn.addEventListener("click",()=>{
    potMode=btn.dataset.potmode;
    document.querySelectorAll("[data-potmode]").forEach(x=>x.classList.toggle("active",x===btn));
    calcPot();
  }));
  ["potCurrent","potDone","potTotal"].forEach(id=>$p(id)?.addEventListener("input",calcPot));
  try{
    const s=JSON.parse(localStorage.getItem("dqr.pot.integrated.v1")||"null");
    if(s){potMode=s.potMode||"gear";$p("potCurrent").value=s.start??1;$p("potDone").value=s.done??0;$p("potTotal").value=s.total??0;document.querySelectorAll("[data-potmode]").forEach(x=>x.classList.toggle("active",x.dataset.potmode===potMode))}
  }catch{}
  calcPot();

  // Screenshot OCR
  $p("potScanFile")?.addEventListener("change", async e => {
    const file=e.target.files?.[0]; if(!file)return;
    const status=$p("potScanStatus");
    if(!window.Tesseract){status.textContent="OCR 라이브러리를 불러오지 못했습니다.";return}
    status.textContent="이미지에서 숫자를 읽는 중…";
    try{
      const r=await Tesseract.recognize(file,"eng",{logger:m=>{if(m.status==="recognizing text")status.textContent="OCR "+Math.round((m.progress||0)*100)+"%";}});
      const text=r.data.text||"";
      const upgrades=text.match(/Upgrades?\s*[:\-]?\s*(\d+)\s*\/\s*(\d+)/i);
      const physical=text.match(/Physical(?:\s+power)?\s*[:\-]?\s*([\d,]+)/i);
      const spell=text.match(/Spell(?:\s+Power)?\s*[:\-]?\s*([\d,]+)/i);
      const health=text.match(/Health\s*[:\-]?\s*([\d,]+)/i);
      if(upgrades){$p("potDone").value=upgrades[1];$p("potTotal").value=upgrades[2]}
      const vals=[physical,spell,health].filter(Boolean).map(m=>Number(m[1].replaceAll(",",""))).filter(Number.isFinite);
      if(vals.length)$p("potCurrent").value=Math.max(...vals);
      calcPot();
      status.textContent=upgrades||vals.length?"인식 완료. 값이 맞는지 확인하세요.":"숫자를 찾지 못했습니다. 직접 입력하세요.";
    }catch(err){status.textContent="OCR 실패. 직접 입력하세요."}
  });

  // Damage calculator data
  const SPELLS = [
    {abbr:"PI",name:"Pirate Island",warrior:[["Demonic Strike",5.6],["Enchanted Spinning Blades",21]],mage:[["Ghostly Cannon Barrage",27.6],["Pulse Fire",27.2],["Phantom Flames",29.2]]},
    {abbr:"KC",name:"King's Castle",warrior:[["Glacial Blows",16.8],["Blade Throw",12.4]],mage:[["Void Beam",27.9],["Electric Boom",25.5],["Thunderous Blast",9]]},
    {abbr:"UW",name:"The Underworld",warrior:[["Rending Slice",19.6],["Infernal Strike",19.6]],mage:[["Infernal Orbs",26.4],["Demonic Spikes",27.12],["Ice Totem",31],["Ice Nova",27]]},
    {abbr:"SP",name:"Samurai Palace",warrior:[["Flame Cyclone",49],["Berserk",28.6],["Lava Lash",17.4]],mage:[["Hand Cannon",12],["Earth Clap",21],["Enchanted Shuriken",26],["Ghostly Rampage",30.6],["Illusion Blast",38]]},
    {abbr:"TC",name:"The Canals",warrior:[["Runic Strike",18.5],["Electric Slash",38.4],["Blade Revolver",34.2],["Blade Storm",46.8]],mage:[["Earth Kick",22],["Tsunami",29.5],["Icicle Barrage",33],["Forgotten Army",32.8],["Vortex",41.5]]},
    {abbr:"GH",name:"Ghastly Harbor",warrior:[["Mighty Leap",24.7],["Pulse Beam",33],["Phantom Blades",34.8],["Earth Spikes",32]],mage:[["Spirit Bomb",38],["Smite",25],["Void Spheres",43],["Phantom Striker",40.8]]},
    {abbr:"SS",name:"Steampunk Sewers",warrior:[["Arrow Rain",35],["Star Barrage",44.4],["Triple Blade Throw",42],["Chained Energy Blasts",60]],mage:[["Starfall",38],["Pulse Waves",33],["Overcharge",44.25],["Chromatic Rain",54.9]]},
    {abbr:"BR",name:"Boss Raid",warrior:[["Explosive Punch",37],["Electric Grinder",42],["Arrow Barrage",38],["Ground Stomp",37],["Twin Slash",27]],mage:[["Orb of Destruction",51],["Chain Lightning",38],["Infernal Blast",43.5],["Demonic Curse",46],["Molten Ball",40]]},
    {abbr:"OO",name:"Orbital Outpost",warrior:[["Focus Beam",47],["Vortex Grenade",80],["Explosive Mine",48]],mage:[["Mystery Matter",61.35],["Electric Field",66.8],["Energy Orb",65]]},
    {abbr:"VC",name:"Volcanic Chambers",warrior:[["Molten Shards",75],["Blade Fall",82],["Lava Barrage",83.2]],mage:[["Lava Beam Orb",75],["Lava Cage",84],["Amethyst Blast",82]]},
    {abbr:"AT",name:"Aquatic Temple",warrior:[["Spear Strike",86],["Ice Barrage",92],["Ice Crash",92]],mage:[["Water Orb",86],["Ice Spikes",92],["Aquatic Smite",92]]},
    {abbr:"EF",name:"Enchanted Forest",warrior:[["Piercing Roots",100],["Crystalline Cannon",110.21],["Wind Blast",107]],mage:[["Fungal Poison",100.2],["Agony Orbs",107],["Lightning Burst",107]]},
    {abbr:"NL",name:"Northern Lands",warrior:[["Frost Cone",112],["Gale Barrage",119],["Flame Shuriken",119]],mage:[["Flame Strike",112],["Geyser",119],["Soul Drain",118.98]]}
  ];
  const dmgD=$p("dmgDungeon"), dmgS=$p("dmgSpell");
  SPELLS.forEach((d,i)=>{const o=document.createElement("option");o.value=i;o.textContent=d.name;dmgD.appendChild(o)});
  function buildSpells(){
    const d=SPELLS[+dmgD.value]; dmgS.innerHTML="";
    [["Warrior",d.warrior],["Mage",d.mage]].forEach(([g,list])=>{
      const og=document.createElement("optgroup");og.label=g;
      list.forEach(([name,mult])=>{const o=document.createElement("option");o.value=mult;o.textContent=name+" · "+mult+"x";og.appendChild(o)});
      dmgS.appendChild(og);
    });
    calcDamage();
  }
  function calcDamage(){
    const weapon=+$p("dmgWeapon").value||0,armor=+$p("dmgArmor").value||0,helmet=+$p("dmgHelmet").value||0,skill=+$p("dmgSkill").value||0;
    const spell=+$p("dmgSpell").value||0,inner=+$p("dmgInner").value||1;
    const base=weapon*(0.6597+0.013202*skill)*((armor+helmet)*0.0028)*spell;
    const final=base*inner;
    $p("damageCompact").textContent=compact(final);
    $p("damageExact").textContent=Number.isFinite(final)?Math.round(final).toLocaleString():"—";
    $p("dmgBase").textContent=compact(base);
    $p("dmgMult").textContent=spell?spell+"x":"—";
    $p("dmgInnerEcho").textContent=inner.toFixed(2)+"x";
  }
  dmgD.value=SPELLS.findIndex(d=>d.abbr==="NL");
  dmgD.addEventListener("change",buildSpells);
  dmgS.addEventListener("change",calcDamage);
  ["dmgWeapon","dmgArmor","dmgHelmet","dmgSkill","dmgInner"].forEach(id=>$p(id)?.addEventListener("input",calcDamage));
  buildSpells();

  // Keep Boss Raid HC unavailable in the Runs view.
  const dungeon=$p("dungeon"), hc=$p("hc");
  function syncBossRaid(){
    if(!dungeon||!hc)return;
    const boss=dungeon.value.startsWith("Boss Raid");
    hc.disabled=boss;
    const card=hc.closest(".toggle-card");
    if(card)card.classList.toggle("disabled",boss);
    if(boss&&hc.checked){hc.checked=false;hc.dispatchEvent(new Event("change",{bubbles:true}))}
  }
  dungeon?.addEventListener("change",syncBossRaid);
  syncBossRaid();
})();
