<script>
const I={chev:'<path d="m6 9 6 6 6-6"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',reset:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
 bookmark:'<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',ext:'<path d="M7 17 17 7M7 7h10v10"/>',
 eyeoff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
 up:'<path d="m18 15-6-6-6 6"/>',down:'<path d="m6 9 6 6 6-6"/>',left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',
 pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
 print:'<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'};
const ic=(n,s=16,sw=1.8,fill='none')=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[n]||''}</svg>`;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const t=$('#toast');t.innerHTML=esc(m);t.classList.add('on');clearTimeout(toast._);toast._=setTimeout(()=>t.classList.remove('on'),2400)}

/* ---------- small renderers ---------- */
const bodyB=b=>`<span class="bodyb b-${b}" title="${esc(BODY[b].n)}">${esc(BODY[b].s)}</span>`;
const kicker=i=>`<div class="kick"><span class="sq"></span>${esc(BODY[i.b].s)}<span class="d">·</span>${esc(PTYPE[i.type])}<span class="d">·</span>${esc(TH[i.themes[0]].s)}${i.cc?`<span class="d">·</span>${esc(EA_BY[i.cc].n)}`:''}${i.preview?'<span class="d">·</span><span class="v2t">v2 preview</span>':''}${prOf(i).length?`<span class="kpr">${prChips(i)}</span>`:''}</div>`;
const critChip=i=>{const l=critOf(i);return `<button class="crit l${l}" data-act="adj" data-id="${i.id}" title="Adjust editorial assessment">${CRIT[l]}${critEd(i)||relvEd(i)?`<span class="ed">${ic('pen',10,2.4)} Edited</span>`:''}<span class="car">${ic('chev',11,2.4)}</span></button>`};
const adjLine=i=>{const a=A(i),o=[];if(critEd(i))o.push(`${CRIT[a.lvl]} → ${CRIT[critOf(i)]}`);if(relvEd(i))o.push(`relevance ${RELV[a.relv]} → ${RELV[relvOf(i)]}`);return o.length?`<span class="adjusted">${ic('pen',12,2.2)}Adjusted by supervisory manager: ${o.join(' · ')}</span>`:''};
const reasonLine=i=>`<span class="reason">Auto: ${esc(A(i).reasons.slice(0,2).join(' + '))}</span>`;
const relvTag=i=>{const r=relvOf(i);return `<span class="relv ${relvEd(i)?'ed':''}">Bank relevance <b>${RELV[r]}</b><span class="bars">${[0,1,2].map(k=>`<i class="${k<3-r?'on':''}"></i>`).join('')}</span></span>`};
const curBtns=i=>`<span class="cur"><button class="${isIn(i.id)?'in':''}" data-act="inc" data-id="${i.id}" title="${isIn(i.id)?'Remove from brief':'Include in brief'} (B)">${ic('bookmark',17,1.8,isIn(i.id)?'currentColor':'none')}</button><button class="no" data-act="out" data-id="${i.id}" title="${isOut(i.id)?'Restore':'Not relevant'} (X)">${ic(isOut(i.id)?'reset':'eyeoff',16)}</button></span>`;
const inBrief=i=>isIn(i.id)?`<span class="inbrief">${ic('bookmark',11,2,'currentColor')}In brief</span>`:'';
const tagList=i=>`<div class="tags">${i.themes.map(t=>`<span class="tag" style="--c:${TH[t].c}">${esc(TH[t].s)}</span>`).join('')}${(i.emerg||[]).map(e=>`<span class="tag emg">${esc(EMERGING.find(x=>x.id===e).n)}</span>`).join('')}</div>`;
const dueChip=i=>{const d=daysTo(i.due);if(d==null)return '';return `<span class="due ${d<0?'closed':d<=14?'soon':d<=31?'month':''}">${ic('cal',11,2)}${esc(cap(dueLab(i.due)))}</span>`};
const srcLine=i=>`<div class="srcl"><span class="o">${esc(BODY[i.b].n)}</span><span class="tier off">Official</span><span class="num">${esc(pubLab(i))}</span>${dueChip(i)}<a class="orig" href="${esc(i.url)}" target="_blank" rel="noopener">Read the original${ic('ext',12,2.2)}</a></div>`;
function spark(arr,w=72,h=20,col='var(--navy)'){const mx=Math.max(...arr,.001),x=k=>k/(arr.length-1)*w,y=v=>h-2-v/mx*(h-4);const d=arr.map((v,k)=>`${k?'L':'M'}${x(k).toFixed(1)},${y(v).toFixed(1)}`).join('');return `<svg class="spk" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}L${w},${h}L0,${h}Z" fill="${col}" opacity=".1"/><path d="${d}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="${x(arr.length-1)}" cy="${y(arr[arr.length-1])}" r="2.2" fill="${col}"/></svg>`}
const prChip=(vid,full)=>`<button class="prc ${VBY[vid].pid}" data-act="vuln" data-id="${vid}" title="${esc(VBY[vid].P.p+' · '+VBY[vid].v)}">${VBY[vid].code}${full?' '+esc(VBY[vid].short):''}</button>`;
const prChips=(i,full)=>{const t=prOf(i);if(!t.length)return '';if(t.length>2)return `<span class="prc all" title="Feeds all SSM priorities">All SSM priorities</span>`;return t.map(v=>prChip(v,full)).join('')};
const stPill=(ss,k)=>`<span class="stp s-${ss}" style="--c:${FU_ST[ss][1]}">${ss==='overdue'&&k==='rem'?'Overdue · enforced':FU_ST[ss][0]}</span>`;
const SH2={p1:'geopolitical resilience',p2:'operational resilience'};
function glanceHtml(pool,big){return `<div class="glance ${big?'big':''}"><div class="gl0"><span>SSM priorities 2026–28 at a glance</span><small>Attention Index · follow-up status · next checkpoint</small>${big?'':`<button class="lnk" data-act="view" data-v="priorities">Open Priorities →</button>`}</div>
 <div class="glrow">${PRIOS.map(P=>{const ps=psai(P.id,pool);return `<div class="glp ${P.id}"><div class="glph"><span class="prn">${P.p}</span><b>${esc(P.short)}</b>${trendB(ps.trend)}<span class="saiw">${ps.score}</span></div>
  <div class="glvs">${P.vs.map(v=>{const vs=vsai(v.id,pool),ss=vStatus(v),nx=v.fu.next;return `<button class="glv" data-act="vuln" data-id="${v.id}"><span class="glc">${v.code}</span><span class="gln">${esc(v.short)}</span><span class="glsc">${vs.score}</span><span class="gld"><i style="background:${FU_ST[ss][1]}"></i>${ss==='overdue'?'Overdue item':esc(FU_ST[ss][0])}</span><span class="glx">Next: <b>${esc(fuDate(nx))}</b></span></button>`}).join('')}</div></div>`}).join('')}</div></div>`}
const trendB=t=>`<span class="trend" style="color:${TREND[t].col}">${TREND[t].a} ${TREND[t].n}</span>`;
const saiBar=(s,w=90)=>`<span class="saib" style="width:${w}px"><i style="width:${s}%"></i></span><b class="num saiv">${s}</b>`;

/* ---------- jurisdiction bar + universe ---------- */
function jurBar(){const j=JURS.find(x=>x.id===S.jur);
 return `<div class="jurbar"><span class="jl">Jurisdiction</span>${JURS.map(x=>`<button class="${x.id===S.jur?'on':''} ${x.v1?'':'v2'}" data-act="jur" data-v="${x.id}">${esc(x.n)}${x.v1?'<span class="v1t">v1</span>':'<span class="v2t">v2</span>'}</button>`).join('')}</div>
 <div class="univ"><span class="jl">Supervisory universe</span>${JURS.flatMap(x=>x.bodies.map(b=>`<span class="ub ${x.v1?'':'off'} ${x.id===S.jur||S.jur==='global'?'hl':''}" title="${esc(BODY[b].n)}${x.v1?' · covered in v1':' · coming in v2'}">${esc(BODY[b].s)}</span>`)).join('')}<span class="ul">${ic('lock',11,2)} greyed = coming in v2</span></div>
 ${j&&!j.v1?`<div class="v2note"><b>${esc(j.n)} is outside v1 scope.</b> v1 content is focused on ECB Banking Supervision and the euro area. ${S.jur==='global'?'The Global view shows the full universe, with v1 euro-area content plus the few preview items.':'One or two verified items are shown as a preview of v2 coverage.'} ${j.bodies.map(b=>BODY[b].s).join(' · ')} feeds coming in v2.</div>`:''}
 ${S.cc?`<div class="ccnote">Filtered to <b>${esc(EA_BY[S.cc].n)}</b> (${esc(EA_BY[S.cc].nca)}): national items plus euro-area-wide SSM/EBA/ESRB items that apply there. <button class="linkbtn" data-act="ccclear">Clear country</button></div>`:''}`}

function prBar(){const f=S.fl.prio,b=(v,l,cls='')=>`<button class="${f===v?'on':''} ${cls}" data-act="prf" data-v="${v}">${l}</button>`;
 return `<div class="prbar"><span class="jl">SSM priority</span>${b('all','All')}${PRIOS.map(P=>b(P.id,P.p,P.id)+P.vs.map(v=>b(v.id,v.code+' '+esc(v.short),P.id+' sub')).join('')).join('')}${b('none','Cross-cutting')}</div>`}
/* ---------- environment & attention ---------- */
const ARW={up:'▲',flat:'▶',next:'◆'};
function envAuto(){const c=client(),pool=scope().filter(i=>!isOut(i.id)).sort(rank),th=themesRanked(pool),ri=th.filter(t=>t.trend==='rising'&&t.score>0);
 const c0=pool.filter(i=>critOf(i)===0).length,c1=pool.filter(i=>critOf(i)===1).length,lvl=c0>=2?3:c0>=1||c1>=4?2:c1>=1?1:0;
 const jn=JURS.find(x=>x.id===S.jur).n;
 if(!pool.length)return {h:'No publications in scope for this jurisdiction',s:'Select Euro area (SSM) to see v1 content.',sig:[],lvl,pool,th,ri,c0,c1,tk:[]};
 const pr=PRIOS.map(P=>({P,s:psai(P.id,pool),vs:P.vs.map(v=>({v,s:vsai(v.id,pool)}))})),ord=[...pr].sort((a,b)=>b.s.score-a.s.score),top=ord[0],oth=ord[1];
 const hookV=x=>{const d=x.vs.filter(y=>y.v.fu.next.iso&&daysTo(y.v.fu.next.iso)>=0).sort((a,b)=>daysTo(a.v.fu.next.iso)-daysTo(b.v.fu.next.iso))[0];return (d||[...x.vs].sort((a,b)=>b.s.score-a.s.score)[0]).v};
 const hv1=hookV(top),hv2=hookV(oth);
 const h=S.jur==='ea'||S.jur==='global'?`${cap(SH2[top.P.id])} leads the SSM priorities as ${hv1.hook}; on ${SH2[oth.P.id]}, ${hv2.hook}`:`${jn}: v1 covers the SSM priorities only. ${th[0].s} leads the preview items`;
 const tagged=pool.filter(i=>prOf(i).length).length,over=VULNS.filter(v=>FU_STEPS.some(([k])=>fuSt(v.fu[k])==='overdue')),pub=VULNS.filter(v=>fuSt(v.fu.find)==='published');
 const nx=fuDated().filter(f=>f.k==='next'&&daysTo(f.iso)>=0).sort((a,b)=>daysTo(a.iso)-daysTo(b.iso))[0];
 const s=`${tagged} of ${pool.length} publications in scope for ${c.short}${S.cc?` in ${EA_BY[S.cc].n}`:''} feed the two SSM priorities for 2026–28. Priority 1 (${SH2.p1}) scores ${pr[0].s.score} and Priority 2 (${SH2.p2}) ${pr[1].s.score} on the Attention Index. On follow-up, ${pub.length} of ${VULNS.length} key concerns already have published findings and ${over.length} has an overdue, enforced deadline${nx?`. The next checkpoint is ${nx.st.t.charAt(0).toLowerCase()+nx.st.t.slice(1)} on ${dShort(nx.iso)}`:''}.`;
 const topPub=x=>prPubs(x.P.vs.map(v=>v.id),pool).filter(i=>prOf(i).length<=2).sort(rank)[0];
 const sig=pr.map(x=>{const tv=[...x.vs].sort((a,b)=>b.s.score-a.s.score);return {d:x.s.trend==='rising'?'up':'flat',k:x.P.p,t:`${x.P.short} · Index ${x.s.score}, ${TREND[x.s.trend].n.toLowerCase()}. Highest: ${tv[0].v.code} ${tv[0].v.short} (${tv[0].s.score}) and ${tv[1].v.code} ${tv[1].v.short} (${tv[1].s.score})`,id:topPub(x)&&topPub(x).id}});
 const fus=[...fuDated().filter(f=>f.k==='next'&&daysTo(f.iso)>=0).slice(0,1).map(f=>`${dShort(f.iso).replace(/ \d{4}$/,'')}: ${f.st.t.replace(/ due to the ECB$/,'')} (${f.v.code})`),
  ...over.map(v=>`Overdue, enforced: ${v.short} (${v.code})`),...VULNS.filter(v=>!v.fu.next.iso&&v.fu.next.d!=='tbc').slice(0,1).map(v=>`${v.fu.next.d}: ${v.fu.next.t.split(' (')[0]} (${v.code})`)];
 sig.push({d:'next',k:'Follow-up',t:fus.join(' · '),id:(nx&&nx.i&&nx.i.id)||(over[0]&&over[0].fu.rem.src)});
 const ex=new Set(['E13']),pick=list=>{const i=list.find(x=>!ex.has(x.id));if(i)ex.add(i.id);return i};
 const t1=pick(prPubs(top.P.vs.map(v=>v.id),pool).sort(rank)),t2=pick(prPubs(oth.P.vs.map(v=>v.id),pool).sort(rank));
 const ovSrc=over.map(v=>BYID[v.fu.rem.src]).filter(i=>i&&pool.includes(i)),t3=pick([...ovSrc,...prPubs(VULNS.map(v=>v.id),pool).sort(rank)]);
 return {h,s,sig,lvl,pool,th,ri,c0,c1,pr,tk:[t1,t2,t3].filter(Boolean).map(i=>({i,t:i.brief}))}}
function envData(){const a=envAuto(),o=EV();return {...a,h:o.h||a.h,s:o.s||a.s,sig:a.sig.map((g,k)=>({...g,t:o['g'+k]||g.t})),tk:a.tk.map(t=>({...t,t:(o.tk||{})[t.i.id]||t.t})),lvlEff:X().lvl!=null?X().lvl:a.lvl,edited:!!(o.h||o.s||o.g0||o.g1||o.g2||X().lvl!=null||Object.keys(o.tk||{}).length)}}
function matrixHtml(){const pool=scope().filter(i=>!isOut(i.id));
 const n=(g,l)=>pool.filter(i=>(g==='all'||groupOf(i)===g)&&(l==='all'||critOf(i)===l)).length;
 const cell=(g,l)=>{const v=n(g,l);return `<td class="${l==='all'?'tc':''}"><button class="${v?'':'z'} ${l===0&&v?'hot':''}" data-act="mx" data-g="${g}" data-l="${l}" title="${v?'Show these '+v+' publications':''}">${v||'–'}</button></td>`};
 return `<table class="cmx"><thead><tr><th>Publications</th>${CRIT.map((c,l)=>`<th class="l${l}">${c==='Critical'?'Crit.':c}</th>`).join('')}<th class="tot">Total</th></tr></thead><tbody>${[...PGROUP.map(g=>[g[0],g[1]]),['all','Total']].map(([g,lab])=>`<tr class="${g==='all'?'tot':''}"><td>${lab}</td>${[0,1,2,3].map(l=>cell(g,l)).join('')}${cell(g,'all')}</tr>`).join('')}</tbody></table>`}
function envInner(ed,cover){const d=envData(),ce=k=>ed?`contenteditable="true" data-x="env" data-k="${k}"`:'';
 return `<h2 class="envh" ${ce('h')}>${esc(d.h)}</h2><p class="envs" ${ce('s')}>${esc(d.s)}</p>
 ${ed||!cover?`<ul class="sigs">${d.sig.map((g,k)=>`<li><span class="ar ${g.d}">${ARW[g.d]}</span><span class="k">${g.k}</span><span ${ce('g'+k)}>${esc(g.t)}</span>${g.id?`<button class="go" data-act="read" data-id="${g.id}">Source →</button>`:''}</li>`).join('')}</ul>`:''}`}
function flowBar(){const sc=scope(),f=finalOrder(),adj=sc.filter(i=>critEd(i)||relvEd(i)||isOut(i.id)).length;
 const steps=[['Detect',`${INC.length} official publications · ${new Set(INC.map(i=>i.b)).size} authorities`,'desk'],['Filter',`${sc.filter(i=>!isOut(i.id)).length} in ${S.jur==='ea'?'SSM / euro-area':'selected'} scope`,'desk'],['Judge',`${adj} adjusted by the manager`,'desk'],['Brief',`${f.length} in Monday’s brief`,'brief'],['Record',`schema v0 · ${INC.filter(i=>i.j==='ea').length} extractions with citations`,'record']];
 return `<div class="flow"><span class="fl0">How this edition was made</span>${steps.map((s,k)=>`<button class="fs" data-act="flow" data-v="${s[2]}"><span class="fn">${k+1}</span><span><b>${s[0]}</b><small>${esc(s[1])}</small></span></button>`).join('<span class="fa">→</span>')}</div>`}
function renderExec(){const d=envData(),ed=S.execEdit,c=client();
 const watch=d.th.filter(t=>t.score>0).slice(0,3),dd=datedItems().filter(x=>daysTo(x.iso)>=0).slice(0,5);
 return `<section class="exec cover"><div class="xl">The supervisory environment · ${dateLong(EDITION)} · ${esc(JURS.find(x=>x.id===S.jur).n)}${S.cc?' · '+esc(EA_BY[S.cc].n):''}${d.edited?'<span class="edtag">Edited by editor</span>':''}
  ${ed&&d.edited?`<button class="linkbtn" data-act="xreset" style="margin-left:auto">Reset to automatic</button>`:''}<button class="xbtn ${ed?'on':''}" data-act="xedit" ${ed&&d.edited?'style="margin-left:10px"':''}>${ic(ed?'check':'pen',13,2)}${ed?'Done':'Edit'}</button></div>
 <div class="xtop"><div class="envin">${envInner(ed,true)}${ed?'':glanceHtml(d.pool)}</div>
  <div class="threat"><div class="tt"><span>Supervisory attention level</span><span>${hm(EDITION)} CEST</span></div>
   <div class="big" style="color:${LVC[d.lvlEff]}">${LEVELS[d.lvlEff]}<small>${d.lvlEff!==d.lvl?`set by editor · auto ${LEVELS[d.lvl]}`:'automatic'}</small></div>
   <div class="scale ${ed?'ed':''}">${LEVELS.map((l,k)=>`<button data-act="${ed?'xlvl':''}" data-v="${k}" style="${k<=d.lvlEff?`background:${LVC[k]};${ed?'color:#fff':''}`:''}">${ed?l:''}</button>`).join('')}</div>
   ${ed?'':`<div class="lbl">${LEVELS.map(l=>`<span>${l}</span>`).join('')}</div>`}
   ${matrixHtml()}
   <div class="basis">Rows group publications by the kind of ask: supervisory action, rule-making, agenda and data, or narrative. Click a count to filter the Desk.</div></div></div>
 ${ed?glanceHtml(d.pool):''}
 <div class="xl" style="margin-top:22px;color:var(--ink)">Three things to know · through the SSM priorities</div>
 <div class="ttk" style="margin-top:8px">${d.tk.map((t,k)=>{const i=t.i;return `<div class="tk"><span class="n">${k+1}</span><p ${ed?`contenteditable="true" data-x="tk" data-id="${i.id}"`:`data-act="read" data-id="${i.id}" style="cursor:pointer"`}>${esc(t.t)}</p>
  <div class="tm">${prChips(i,true)}<span class="cpill l${critOf(i)}">${CRIT[critOf(i)]}</span>${bodyB(i.b)}<span>${esc(PTYPE[i.type])} · ${esc(pubLab(i))}</span>${dueChip(i)}<button class="go" data-act="read" data-id="${i.id}">Open ${ic('arrow',12,2.2)}</button></div></div>`}).join('')}</div>
 <div class="pulse2"><div class="pc"><div class="ph"><span>Themes to watch · Attention Index</span><button class="lnk" data-act="view" data-v="themes">All themes →</button></div>
   ${watch.map(t=>`<button class="pi" data-act="theme" data-id="${t.id}">${spark(t.pts,46,18,TREND[t.trend].col)}<span><b class="h2">${esc(t.s)}</b><span class="pm">${trendB(t.trend)} · ${t.ps.length} pubs · ${t.bodies.map(b=>BODY[b].s).join(', ')}</span></span><span class="saiw">${t.score}</span></button>`).join('')}</div>
  <div class="pc"><div class="ph"><span>Next deadlines</span><button class="lnk" data-act="view" data-v="calendar">Calendar →</button></div>
   ${dd.map(x=>`<button class="pi" data-act="read" data-id="${x.i.id}"><span class="ddt"><b>${esc(dShort(x.iso).split(' ').slice(0,2).join(' '))}</b><small>${daysTo(x.iso)}d</small></span><span><b class="h2">${esc(x.i.h.length>78?x.i.h.slice(0,76)+'…':x.i.h)}</b><span class="pm">${esc(BODY[x.i.b].s)} · ${esc(x.k)}</span></span></button>`).join('')||'<div class="empty" style="padding:12px 0">No dated items.</div>'}</div>
  <div class="pc"><div class="ph"><span>Say vs Do · where action is</span><button class="lnk" data-act="view" data-v="themes">Matrix →</button></div>
   ${watch.map(t=>{const o=sayDo(t.id,d.pool);return `<button class="pi" data-act="theme" data-id="${t.id}"><span><b class="h2">${esc(t.s)}</b><span class="sdmini">${SD.map(([k,n])=>`<i class="${o[k].length?'on':''} k-${k}" title="${n}: ${o[k].length}">${o[k].length||''}</i>`).join('')}</span><span class="pm">${esc(gapOf(t.id,d.pool))}</span></span></button>`}).join('')}
   <div class="sdleg">${SD.map(([k,n])=>`<span><i class="k-${k} on"></i>${n}</span>`).join('')}</div></div></div>
 ${flowBar()}</section>`}

/* ---------- chrome ---------- */
function renderChrome(){const c=client();document.documentElement.style.setProperty('--accent',c.accent);document.documentElement.style.setProperty('--accent-deep',c.deep);
 $('#cLogo').textContent=c.logo;$('#cName').textContent=c.name;$('#cType').textContent='· '+c.type;$('#footClient').textContent=c.name;
 $('#utilDate').textContent=dateLong(EDITION);
 $('#liveLbl').innerHTML=`v0 mockup · crisis desk · stress, resolution, systemic risk`;
 $('#footDisc').textContent=`Pitch mockup · official public sources only · not affiliated with or endorsed by ${c.name}`;
 const sc=scope().filter(i=>!isOut(i.id)),cr=[0,1].map(l=>sc.filter(i=>critOf(i)===l).length);
 const r=radar();
 $('#tagline').innerHTML=`Crisis watch for <b>${esc(c.name)}</b> · Resolution, stress, CMDI and systemic risk`;
 $('#earL').innerHTML=`<div class="lab">Monday edition</div><b>${dateLong(EDITION)}</b><br>Live titles as of <span class="num">${hm(EDITION)}</span> CEST · ${scope().length} on this radar`;
 $('#earR').innerHTML=`<div class="lab">Curated by</div><b>${CONSULTANCY}</b><br>${sc.length} in scope · <span style="color:var(--c0);font-weight:600">${cr[0]} critical</span> · ${cr[1]} high`;
 const tk=datedItems().filter(d=>daysTo(d.iso)>=-3).slice(0,8);
 const items=tk.map(d=>`<button data-act="read" data-id="${d.i.id}"><b>${esc(dShort(d.iso))}</b><span>${esc(BODY[d.i.b].s)} · ${esc(d.k)}: ${esc(d.i.h)}</span></button>`).join('');
 $('#track').innerHTML=items+items;
 $('#clientMenu').innerHTML=`<div class="h">Client edition</div>${Object.values(CLIENTS).map(x=>`<button class="${x.id===S.client?'on':''}" data-act="client" data-c="${x.id}"><span class="logo" style="background:${x.accent}">${x.logo}</span><span><b>${esc(x.name)}</b><br><small>${esc(x.type)}</small></span></button>`).join('')}<div class="h" style="border-top:1px solid var(--rule);margin-top:6px;padding-top:10px;text-transform:none;letter-spacing:0;font-weight:500;font-size:11.5px">The same official feed is scored against each client’s presence and status. Demo clients are fictional.</div>`;
 renderNavCount()}
function renderNavCount(){$('#briefN').textContent=finalOrder().length}

/* ---------- FRONT ---------- */
function storySecond(i){return `<article class="story ${isOut(i.id)?'out':''}" data-id="${i.id}"><div class="sbody">${kicker(i)}<h3 class="hl" data-act="read" data-id="${i.id}">${esc(i.h)}</h3><p class="brief">${esc(i.brief)}</p>${srcLine(i)}</div><div class="sfoot">${critChip(i)}${relvTag(i)}<span style="margin-left:auto;display:flex;gap:6px;align-items:center">${inBrief(i)}${curBtns(i)}</span></div></article>`}
function renderFront(){const c=client(),pool=scope().filter(i=>!isOut(i.id)).sort(rank);S.ctx=pool.map(i=>i.id);
 const L=pool[0];if(!L){$('#main').innerHTML='<div class="empty">No publications in scope.</div>';return}
 const ex=L.sd||{};
 const briefs=WARS.map(s=>{const stand=s.elements[0], bank=s.elements[s.elements.length-1];return `<article><div class="asof">${esc(s.asof)}</div><h2>${esc(s.n)}</h2><p><b>${esc(stand.k)}.</b> ${esc(stand.v)}</p><p><b>${esc(bank.k)}.</b> ${esc(bank.v)}</p></article>`}).join('');
 const votes=ELECTIONS.slice(0,4).map(e=>`<article class="wire"><div class="dt">${esc(e.when)}</div><div><h3>${esc(e.where)}</h3><p>${esc(e.what.split('.').slice(0,1).join('.'))}.</p></div></article>`).join('');
 const ai=`<article class="wire"><div class="dt">One block</div><div><h3>${esc(AIBLOCK.h)}</h3><p>${esc(AIBLOCK.sum)}</p><ul class="pts">${AIBLOCK.bullets.map(b=>`<li><b>${esc(b.t)}.</b> ${esc(b.d)}</li>`).join('')}</ul></div><button class="lnk" data-act="view" data-v="ai">Open the block</button></article>`;
 $('#main').innerHTML=`<div class="sh"><h2>Clarity</h2><span class="sub">Two wars, the votes that can move them, one AI and fraud block</span></div><div class="sit">${briefs}</div><div class="sh"><h2>Elections</h2></div><div class="wires">${votes}</div><div class="sh"><h2>AI and fraud</h2></div><div class="wires">${ai}</div>`+jurBar()+renderExec()+`<div class="sh" style="margin-top:30px"><h2>On the desk</h2><span class="sub">Ranked by criticality for ${esc(c.short)} · ${pool.length} in scope · official sources only</span><button class="more" data-act="view" data-v="desk">Open the Desk ${ic('arrow',13,2)}</button></div>
 <section class="lead story" data-id="${L.id}"><div>${kicker(L)}<h2 class="hl" data-act="read" data-id="${L.id}">${esc(L.h)}</h2><p class="brief">${esc(L.brief)}</p>${srcLine(L)}
  <div class="leadmeta" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px">${critChip(L)}${adjLine(L)||reasonLine(L)}${relvTag(L)}${curBtns(L)}${inBrief(L)}</div>
  <div style="margin-top:16px"><button class="pbtn" data-act="read" data-id="${L.id}">Extraction &amp; citations ${ic('arrow',14,2)}</button></div></div>
  <div class="graphic"><div class="gt"><span>Extraction · schema v0</span><span class="gtv">${esc(L.id)}</span></div>
   ${SD.map(([k,n])=>`<div class="exr ${ex[k]?'':'na'}"><span class="exk k-${k}">${n}</span><span>${esc(ex[k]||'—')}</span></div>`).join('')}
   <div class="cap">Each field is paraphrased from the cited official document. <a href="${esc(L.url)}" target="_blank" rel="noopener">Source ↗</a></div></div></section>
 <div class="seconds">${pool.slice(1,4).map(storySecond).join('')}</div>
 ${pool.length>4?`<div class="sh"><h2>More from the Desk</h2><button class="more" data-act="view" data-v="desk">All publications ${ic('arrow',13,2)}</button></div><div class="more2">${pool.slice(4,10).map(i=>`<article class="story" data-id="${i.id}">${kicker(i)}<h3 class="hl" data-act="read" data-id="${i.id}">${esc(i.h)}</h3><p class="brief">${esc(i.brief)}</p><div style="display:flex;gap:8px;align-items:center;margin-top:8px">${critChip(i)}${dueChip(i)}<span style="margin-left:auto">${curBtns(i)}</span></div></article>`).join('')}</div>`:''}`}

/* ---------- THEMES ---------- */
function renderThemes(){const c=client(),f=S.fl.prio,pool=scope().filter(i=>prFilterOk(i,f)),tOk=t=>f==='all'?true:f==='none'?!themePr(t.id).length:themePr(t.id).some(v=>f.length===2?v.startsWith(f):v===f);
 const th=themesRanked(pool).filter(tOk),act=th.filter(t=>t.score>0),idle=th.filter(t=>!t.score);S.ctx=[];
 const feeds=t=>themePr(t.id).length?themePr(t.id).map(v=>prChip(v)).join(''):'<span class="prc none">Cross-cutting</span>';
 const bodies=[...new Set(pool.map(i=>i.b))];
 const top=act.slice(0,3);
 $('#main').innerHTML=`<div class="sechead"><div><h1>Themes</h1><p>The Supervisory Attention Index scores how hard supervisors are leaning on each theme. It combines authority, explicitness, recency, repetition, supervisory action and cross-body convergence, computed from the publications in scope.</p></div><div class="stat"><b>${act.filter(t=>t.trend==='rising').length}</b> themes rising<br>${act.length} of ${THEMES.length} fixed themes active</div></div>
 ${jurBar()}${prBar()}
 <div class="sh" style="margin-top:18px"><h2>Themes to watch</h2><span class="sub">Top 3 by Attention Index · external editorial, no internal data</span></div>
 <div class="watch3">${top.map((t,k)=>{const e=THEME_ED[t.id];return `<div class="w3"><div class="w3h"><span class="w3n">${k+1}</span><div><h3>${esc(t.n)}</h3><div class="w3m">${trendB(t.trend)} · Index <b>${t.score}</b> · ${t.ps.length} publications · ${t.bodies.map(b=>BODY[b].s).join(', ')}</div><div class="w3f">Feeds ${feeds(t)}</div></div>${spark(t.pts,70,24,TREND[t.trend].col)}</div>
   <p><b>What it means for ${esc(c.short)}:</b> ${esc(e.mean)}</p>${c.gsib?`<p class="gs"><b>G-SIB lens:</b> ${esc(e.gsib)}</p>`:''}
   <div class="lq"><span>Likely supervisor questions</span>${e.q.map(q=>`<div>“${esc(q)}”</div>`).join('')}</div>
   <button class="linkbtn" data-act="theme" data-id="${t.id}">Open ${t.ps.length} publications →</button></div>`}).join('')}</div>
 <div class="sh"><h2>Supervisory Attention Index</h2><span class="sub">0–100 · illustrative weights in v0 (${Object.entries(SAI_W).map(([k,w])=>`${SAI_L[k]} ${Math.round(w*100)}%`).join(' · ')})</span></div>
 <table class="sai"><thead><tr><th>#</th><th>Theme</th><th>Attention Index</th>${Object.keys(SAI_W).map(k=>`<th title="${SAI_L[k]}">${SAI_L[k].split(' ')[0]}</th>`).join('')}<th>Trend · 8 wks</th><th>Feeds SSM priority</th><th>Bodies</th><th>Next date</th></tr></thead><tbody>
 ${th.map((t,k)=>{const nd=datedItems().find(d=>d.i.themes.includes(t.id)&&daysTo(d.iso)>=0);return `<tr class="${t.score?'':'idle'}"><td class="num">${k+1}</td><td><button class="tl" data-act="theme" data-id="${t.id}"><i style="background:${t.c}"></i>${esc(t.n)}</button></td><td>${saiBar(t.score)}</td>
  ${Object.keys(SAI_W).map(c=>`<td><span class="cbar"><i style="height:${Math.round(t.c[c]*100)}%"></i></span></td>`).join('')}
  <td>${t.score?`${trendB(t.trend)} ${spark(t.pts,54,16,TREND[t.trend].col)}`:'<span class="reason">no signal</span>'}</td><td>${feeds(t)}</td><td>${t.bodies.map(bodyB).join(' ')||'—'}</td><td>${nd?`<button class="linkbtn" data-act="read" data-id="${nd.i.id}">${esc(dShort(nd.iso))}</button>`:'—'}</td></tr>`}).join('')}</tbody></table>
 <div class="noteil">Components are computed from the extraction schema: authority = issuing-body weight; explicitness = mention, expectation or requirement; recency = time-decayed count; repetition = publication count; action = reviews, exercises and enforcement; convergence = number of distinct bodies, including NCA echoes. Weights are illustrative in v0 and will be calibrated in v1.</div>
 <div class="sh"><h2>Emerging themes</h2><span class="sub">Signals outside the fixed taxonomy · flagged for editor review before promotion</span></div>
 <div class="emgrid">${EMERGING.map(e=>{const ev=e.ev.map(id=>BYID[id]).filter(i=>i&&inJur(i));return `<div class="emc ${ev.length?'':'idle'}"><h4>${esc(e.n)}</h4><p>${esc(e.note)}</p><div class="emm">First seen ${esc(dShort(e.first))} · ${ev.length} source${ev.length===1?'':'s'}</div>${ev.map(i=>`<button class="linkbtn" data-act="read" data-id="${i.id}">${esc(BODY[i.b].s)} · ${esc(i.h.length>60?i.h.slice(0,58)+'…':i.h)}</button>`).join('')}</div>`}).join('')}</div>
 <div class="sh"><h2>Say vs Do</h2><span class="sub">What supervisors say compared with what they do, find and require, per theme. Click a cell for the evidence.</span></div>
 <div style="overflow:auto"><table class="sdm"><thead><tr><th>Theme</th>${SD.map(([k,n,d])=>`<th><b>${n}</b><small>${d}</small></th>`).join('')}<th>Read-out</th></tr></thead><tbody>
 ${act.map(t=>{const o=sayDo(t.id,pool);return `<tr><td><button class="tl" data-act="theme" data-id="${t.id}"><i style="background:${t.c}"></i>${esc(t.s)}</button></td>${SD.map(([k])=>`<td class="${o[k].length?'on':''} k-${k}">${o[k].length?`<button data-act="read" data-id="${o[k][0].id}" title="${esc(o[k].map(x=>BYID[x.id].h).join(' | '))}"><b>${o[k].length}</b><span>${esc(o[k][0].t.length>70?o[k][0].t.slice(0,68)+'…':o[k][0].t)}</span></button>`:'<span class="z">—</span>'}</td>`).join('')}<td class="ro">${esc(gapOf(t.id,pool))}</td></tr>`}).join('')}</tbody></table></div>
 <div class="sh"><h2>Themes × authorities</h2><span class="sub">Publication counts · click to filter the Desk</span></div>
 <div style="overflow:auto"><table class="heat"><thead><tr><th>Theme</th>${bodies.map(b=>`<th>${esc(BODY[b].s)}</th>`).join('')}</tr></thead><tbody>
 ${act.map(t=>`<tr><td>${esc(t.s)}</td>${bodies.map(b=>{const n=t.ps.filter(i=>i.b===b).length;return `<td>${n?`<button data-act="mxb" data-theme="${t.id}" data-b="${b}" style="background:rgba(236,0,0,${Math.min(.85,.12+n*.18)});color:${n>=3?'#fff':'var(--ink)'}">${n}</button>`:'<span class="z">·</span>'}</td>`}).join('')}</tr>`).join('')}</tbody></table></div>
 ${idle.length?`<p class="reason" style="margin-top:14px">No signal in this sample: ${idle.map(t=>t.s).join(', ')}. Consumer, AML and crypto supervision sit largely outside the SSM prudential remit (national authorities, AMLA, MiCA authorities) and are planned for v2.</p>`:''}`}

/* ---------- DESK ---------- */
function sectionList(){const f=S.fl;let base=scope().filter(i=>prFilterOk(i,f.prio));if(f.theme!=='all')base=base.filter(i=>i.themes.includes(f.theme));if(f.body!=='all')base=base.filter(i=>i.b===f.body);if(f.grp!=='all')base=base.filter(i=>groupOf(i)===f.grp);
 const outN=base.filter(i=>isOut(i.id)).length;let l=base.filter(i=>f.showOut||!isOut(i.id));if(f.crit!=='all')l=l.filter(i=>critOf(i)===+f.crit);
 l=[...l].sort(f.sort==='due'?(a,b)=>(daysTo(a.due)??9999)-(daysTo(b.due)??9999)||rank(a,b):f.sort==='new'?(a,b)=>ageD(a)-ageD(b):rank);return {l,base:base.filter(i=>!isOut(i.id)),outN}}
function filterRow(base,outN){const f=S.fl,cnt=l=>base.filter(i=>critOf(i)===l).length,bodies=[...new Set(scope().map(i=>i.b))];
 const sel=(k,opts,lab)=>`<span class="fl">${lab}</span><select class="fsel" data-f="${k}">${opts.map(([v,t])=>`<option value="${v}" ${String(f[k])===String(v)?'selected':''}>${t}</option>`).join('')}</select>`;
 return `<div class="frow"><div class="fchips"><button class="${f.crit==='all'?'on':''}" data-act="fcrit" data-v="all">All ${base.length}</button>${CRIT.map((c,l)=>`<button class="l${l} ${f.crit===String(l)?'on':''}" data-act="fcrit" data-v="${l}">${c} ${cnt(l)}</button>`).join('')}</div>
 ${sel('prio',[['all','All priorities'],...PRIOS.flatMap(P=>[[P.id,P.p+' · '+P.short],...P.vs.map(v=>[v.id,'  '+v.code+' '+v.short])]),['none','Cross-cutting']],'SSM priority')}${sel('grp',[['all','Any kind'],...PGROUP.map(g=>[g[0],g[1]])],'Kind')}${sel('body',[['all','All authorities'],...bodies.map(b=>[b,BODY[b].s])],'Authority')}${sel('theme',[['all','All themes'],...THEMES.map(t=>[t.id,t.s])],'Theme')}${sel('sort',[['crit','Criticality'],['due','Deadline'],['new','Newest']],'Sort')}
 ${outN?`<button class="linkbtn" data-act="showout">${f.showOut?'Hide':'Show'} ${outN} not relevant</button>`:''}</div>`}
function row(i){return `<article class="row story ${isOut(i.id)?'out':''}" data-id="${i.id}"><div class="when"><span class="t">${esc(whenLab(i))}</span>${i.date?`<span class="yr">${i.date.slice(0,4)}</span>`:''}${bodyB(i.b)}<br>${esc(PTYPE[i.type])}${i.cc?`<br>${esc(EA_BY[i.cc].n)}`:'<br>Euro area-wide'}
  <div class="tlm">${i.due?`<span>Reply <b>${esc(dShort(i.due))}</b></span>`:''}${i.eff?`<span>Effective <b>${esc(/^\d{4}-\d{2}-\d{2}$/.test(i.eff)?dShort(i.eff):i.eff)}</b></span>`:''}<span>Explicitness <b>${['','mention','expectation','requirement'][i.x]}</b></span></div></div>
 <div>${kicker(i)}<h3 class="hl" data-act="read" data-id="${i.id}">${esc(i.h)}</h3><p class="brief">${esc(i.brief)}</p>${srcLine(i)}
  <div class="prline">${prOf(i).length?`Feeds ${prOf(i).length>2?'<span class="prc all">All SSM priorities</span>':prOf(i).map(v=>prChip(v,true)).join('')}`:'<span class="prc none">Cross-cutting · not tied to a 2026–28 priority</span>'}</div><div class="sdrow">${SD.filter(([k])=>i.sd&&i.sd[k]).map(([k,n])=>`<span class="sdp k-${k}"><b>${n}</b> ${esc(i.sd[k])}</span>`).join('')}</div>${tagList(i)}</div>
 <div class="side">${critChip(i)}${adjLine(i)||reasonLine(i)}${relvTag(i)}<div style="display:flex;align-items:center;gap:6px">${curBtns(i)}${inBrief(i)}</div></div></article>`}
function renderDesk(){const {l,base,outN}=sectionList(),c=client();S.ctx=l.map(i=>i.id);
 $('#main').innerHTML=`<div class="sechead"><div><h1>Desk</h1><p>Every official publication in scope, with fixed-schema extraction and citations. Filter, judge criticality, mark not relevant, and include items in Monday’s brief.</p></div><div class="stat"><b>${base.length}</b> publications in scope<br>${new Set(base.map(i=>i.b)).size} authorities</div></div>
 ${jurBar()}<section class="env compact"><div class="xl">Supervisory environment · ${dateLong(EDITION)} <button class="linkbtn" data-act="view" data-v="front" style="margin-left:auto">Full cover →</button></div><h2 class="envh">${esc(envData().h)}</h2></section>${filterRow(base,outN)}
 ${l.length?l.map(row).join(''):`<div class="empty">${S.jur==='ea'?'No publications match these filters.':'No verified items for this jurisdiction yet: coming in v2.'}</div>`}`}

/* ---------- CALENDAR ---------- */
function renderCalendar(){const c=client(),pipe=PIPE.filter(p=>S.jur==='global'||p.j===S.jur),isE=S.jur==='ea'||S.jur==='global';
 const dd=[...datedItems(),...(isE?fuDated().filter(f=>!(f.k==='next'&&datedItems().some(d=>d.i===f.i&&d.iso===f.iso))).map(f=>({i:f.i,iso:f.iso,k:`Follow-up · ${f.n}`,fu:f})):[])].sort((a,b)=>daysTo(a.iso)-daysTo(b.iso));S.ctx=dd.filter(d=>d.i).map(d=>d.i.id);
 const stg=[['cons','Consultation'],['reply','Reply deadline'],['fin','Final rule / decision'],['impl','Implementation / due']];
 const bucket=(a,b)=>dd.filter(d=>{const x=daysTo(d.iso);return x>=a&&x<=b});
 const lst=(arr)=>arr.length?arr.map(d=>d.fu?`<div class="ditem fu" data-act="vuln" data-id="${d.fu.v.id}"><div class="dd"><b>${esc(dShort(d.iso))}</b><small>${daysTo(d.iso)<0?'past':daysTo(d.iso)+' days'}</small></div><div><div class="kickm">${prChip(d.fu.v.id)} ${esc(d.k)}</div><h3>${esc(d.fu.st.t)}</h3></div><div>${stPill(fuSt(d.fu.st),d.fu.k)}</div></div>`
  :`<div class="ditem" data-act="read" data-id="${d.i.id}"><div class="dd"><b>${esc(dShort(d.iso))}</b><small>${daysTo(d.iso)<0?'closed':daysTo(d.iso)+' days'}</small></div><div><div class="kickm">${bodyB(d.i.b)} ${esc(d.k)} · ${esc(PTYPE[d.i.type])} ${prChips(d.i)}</div><h3>${esc(d.i.h)}</h3></div><div>${critChip(d.i)}</div></div>`).join(''):'<div class="empty" style="padding:14px 0">Nothing in this window.</div>';
 $('#main').innerHTML=`<div class="sechead"><div><h1>Calendar</h1><p>Regulatory dates (consultation → reply deadline → final rule → implementation) side by side with SSM priority follow-up milestones (planned reviews → data requests → findings → remediation → next checkpoint).</p></div><div class="stat"><b>${bucket(0,31).length}</b> dates within 31 days<br>${pipe.length} instruments · ${VULNS.length} priority trails</div></div>
 ${jurBar()}
 <div class="sh" style="margin-top:18px"><h2>Regulatory pipeline</h2><span class="sub">Dates as stated in official sources · “tbc” where the authority has not set one</span></div>
 <table class="pipe"><thead><tr><th>Jurisdiction</th><th>Instrument</th>${stg.map(s=>`<th>${s[1]}</th>`).join('')}<th>Theme</th></tr></thead><tbody>
 ${pipe.map(p=>{const ci=stg.findIndex(s=>s[0]===p.cur);return `<tr class="${p.preview?'pv':''}"><td>${esc(JURS.find(x=>x.id===p.j).n)}${p.preview?' <span class="v2t">v2</span>':''}</td><td><button class="tl" data-act="read" data-id="${p.src}">${esc(p.inst)}</button></td>${stg.map((s,k)=>`<td class="stg ${k<ci?'done':k===ci?'cur':''}"><span class="dot"></span>${esc(p.stages[s[0]])}</td>`).join('')}<td><span class="tag" style="--c:${TH[p.th].c}">${esc(TH[p.th].s)}</span></td></tr>`}).join('')||'<tr><td colspan="7"><div class="empty">Pipeline for this jurisdiction is coming in v2.</div></td></tr>'}</tbody></table>
 ${isE?`<div class="sh"><h2>SSM priority follow-up</h2><span class="sub">Where each key concern stands · next checkpoint · status computed from the edition date</span></div>
 <table class="pipe fut"><thead><tr><th>Priority</th>${FU_STEPS.map(f=>`<th>${f[1]}</th>`).join('')}</tr></thead><tbody>${VULNS.map(v=>`<tr><td>${prChip(v.id,true)}</td>${FU_STEPS.map(([k])=>{const st=v.fu[k],ss=fuSt(st);return `<td class="fuc" style="--c:${FU_ST[ss][1]}">${stPill(ss,k)}<span class="fdt">${esc(fuDate(st))}${st.ill?' · illustr.':''}</span></td>`}).join('')}</tr>`).join('')}</tbody></table>`:''}
 <div class="calcols"><div><div class="sh"><h2>This week</h2></div>${lst(bucket(0,7))}</div><div><div class="sh"><h2>This month</h2></div>${lst(bucket(8,31))}</div><div><div class="sh"><h2>Later &amp; recently closed</h2></div>${lst([...bucket(32,9999),...dd.filter(d=>daysTo(d.iso)<0&&daysTo(d.iso)>=-120)])}${isE?`<div class="reason" style="margin-top:8px">Undated follow-ups: ${VULNS.filter(v=>!v.fu.next.iso).map(v=>`${v.code} ${esc(v.fu.next.d)}`).join(' · ')}</div>`:''}</div></div>
 <div class="sh"><h2>Priorities feeding the work</h2><button class="more" data-act="view" data-v="priorities">Open Priorities ${ic('arrow',13,2)}</button></div>
 <p class="reason" style="font-size:13px">The SSM 2026–28 work programme sets the OSIs, thematic reviews and campaigns behind many of these dates. Planned activities are listed on the Priorities page, with evidence from this edition.</p>`}

/* ---------- MAP ---------- */
let WORLD=null,MAPP=null;
async function loadWorld(){if(WORLD)return WORLD;try{const r=await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');const t=await r.json();WORLD=topojson.feature(t,t.objects.countries)}catch(e){WORLD=null}return WORLD}
function ccStats(cc){const pool=INC.filter(i=>i.j==='ea'&&!isOut(i.id));return {nat:pool.filter(i=>i.cc===cc),wide:pool.filter(i=>!i.cc)}}
function renderMap(){const c=client();S.ctx=[];
 const isEA=S.jur==='ea'||S.jur==='global';
 const sel=S.cc?EA_BY[S.cc]:null,stt=S.cc?ccStats(S.cc):null;
 const list=S.cc?scope().filter(i=>!isOut(i.id)).sort((a,b)=>(b.cc===S.cc)-(a.cc===S.cc)||rank(a,b)):[];
 S.ctx=list.map(i=>i.id);
 $('#main').innerHTML=`<div class="sechead"><div><h1>Map</h1><p>Global trends compared with focused jurisdiction content. v1 maps the 21 euro-area (SSM) countries: click a country to see its national authority’s items next to the euro-area-wide SSM, EBA and ESRB publications that apply there.</p></div><div class="stat"><b>21</b> SSM countries<br>${INC.filter(i=>i.cc).length} national items · ${INC.filter(i=>i.j==='ea'&&!i.cc).length} euro-area-wide</div></div>
 ${jurBar()}
 ${isEA?`<div class="mapwrap"><div class="mapbox"><div id="eamap"><div class="maperr">Loading map…</div></div>
   <div class="mleg"><span><i style="background:#e9e4da"></i>Euro area (SSM)</span><span><i style="background:#f3c9c9"></i>National items in v1</span><span><i class="pres"></i>${esc(c.short)} presence (public, indicative)</span><span><i style="background:#f4f2ee;border:1px dashed #ccc"></i>Outside SSM</span></div></div>
  <div class="mapside">${sel?`<div class="xl">${esc(sel.n)}</div><h3 style="font:700 26px var(--serif);margin:4px 0 2px">${esc(sel.nca)}</h3>
   <div class="reason">National competent authority · SSM participant${c.presence.includes(sel.c)?` · <b style="color:var(--accent)">${esc(c.short)} present</b>`:''}</div>
   <div class="pstrip" style="margin:14px 0"><div><b class="num">${stt.nat.length}</b><span>National items</span></div><div><b class="num">${stt.wide.length}</b><span>EA-wide items apply</span></div></div>
   ${stt.nat.length?'':`<div class="v2note" style="margin:0 0 12px">No ${esc(sel.nca)} feed in v1: national publications are coming in v2. Euro-area-wide items still apply.</div>`}
   ${list.slice(0,8).map(i=>`<button class="mitem" data-act="read" data-id="${i.id}"><span>${bodyB(i.b)} ${i.cc===S.cc?'<b class="natt">National</b>':'<span class="reason">EA-wide</span>'}</span><b>${esc(i.h)}</b><span class="reason">${esc(pubLab(i))} · ${CRIT[critOf(i)]}</span></button>`).join('')}
   <button class="linkbtn" data-act="ccclear" style="margin-top:8px">Clear country</button>`
  :`<div class="xl">Select a country</div><p class="reason" style="font-size:13px;line-height:1.5">Click any euro-area country. Spain (Banco de España) and France (Banque de France) carry national items in this v0 sample. Other NCAs show the euro-area-wide SSM, EBA and ESRB items that apply to them.</p>
   <div class="cclist">${EA.map(x=>{const n=INC.filter(i=>i.cc===x.c).length;return `<button data-act="cc" data-v="${x.c}" class="${n?'has':''} ${c.presence.includes(x.c)?'pres':''}">${esc(x.n)}${n?`<b>${n}</b>`:''}</button>`}).join('')}</div>`}</div></div>`
 :`<div class="globmap"><div class="v2big">${ic('lock',22,2)}<h3>${esc(JURS.find(x=>x.id===S.jur).n)} map: coming in v2</h3><p>The universe is visible so the ambition is clear: ${JURS.find(x=>x.id===S.jur).bodies.map(b=>BODY[b].n).join(', ')}. v1 content is SSM / euro area only.</p><button class="pbtn red" data-act="jur" data-v="ea">Back to Euro area (SSM)</button></div></div>`}
 <div class="sh"><h2>Global picture</h2><span class="sub">Jurisdictions in the universe · v1 coverage vs v2 roadmap</span></div>
 <div class="jgrid">${JURS.map(j=>{const n=INC.filter(i=>i.j===j.id).length;return `<button class="jc ${j.v1?'v1':'off'} ${S.jur===j.id?'on':''}" data-act="jur" data-v="${j.id}"><b>${esc(j.n)}</b><span>${j.bodies.map(b=>BODY[b].s).join(' · ')}</span><em>${j.v1?`${n} publications · v1`:n?`${n} preview · v2`:'v2'}</em></button>`}).join('')}</div>`;
 if(isEA)drawMap()}
async function drawMap(){const w=await loadWorld(),el=$('#eamap');if(!el)return;if(!w||!window.d3){el.innerHTML=`<div class="maperr">Map needs an internet connection (D3 + world-atlas via jsDelivr). Use the country list on the right.</div>`;return}
 el.innerHTML='';const W=el.clientWidth||760,H=560,c=client();
 const feats=w.features.filter(f=>{const ll=d3.geoCentroid(f);return ll[0]>-25&&ll[0]<45&&ll[1]>30&&ll[1]<72||ISO_N[String(f.id).padStart(3,'0')]});
 const inEu=poly=>{const ll=d3.geoCentroid({type:'Polygon',coordinates:poly});return ll[0]>-11&&ll[0]<36&&ll[1]>34&&ll[1]<72};
 const trim=f=>f.geometry.type==='MultiPolygon'?{...f,geometry:{type:'MultiPolygon',coordinates:f.geometry.coordinates.filter(inEu)}}:f;
 const ea=feats.filter(f=>ISO_N[String(f.id).padStart(3,'0')]).map(trim);
 const proj=d3.geoConicConformal().rotate([-10,0]).center([0,51]).parallels([35,65]);proj.fitExtent([[10,10],[W-10,H-10]],{type:'FeatureCollection',features:ea});
 const path=d3.geoPath(proj),svg=d3.select(el).append('svg').attr('width',W).attr('height',H).style('display','block');
 svg.append('rect').attr('width',W).attr('height',H).attr('fill','#fbfaf7');svg.append('clipPath').attr('id','mclip').append('rect').attr('width',W).attr('height',H);
 svg.append('g').selectAll('path').data(feats.filter(f=>!ISO_N[String(f.id).padStart(3,'0')])).join('path').attr('d',path).attr('fill','#f4f2ee').attr('stroke','#ddd8cf').attr('clip-path','url(#mclip)').attr('stroke-width',.6);
 const g=svg.append('g');
 g.selectAll('path').data(ea).join('path').attr('d',path).attr('class','eac').attr('data-cc',f=>ISO_N[String(f.id).padStart(3,'0')])
  .attr('fill',f=>{const cc=ISO_N[String(f.id).padStart(3,'0')];return cc===S.cc?'var(--accent)':INC.some(i=>i.cc===cc)?'#f3c9c9':'#e9e4da'})
  .attr('stroke',f=>c.presence.includes(ISO_N[String(f.id).padStart(3,'0')])?'#1a1a1a':'#fff').attr('stroke-width',f=>c.presence.includes(ISO_N[String(f.id).padStart(3,'0')])?1.4:.8)
  .style('cursor','pointer').on('click',(e,f)=>{const cc=ISO_N[String(f.id).padStart(3,'0')];S.cc=S.cc===cc?null:cc;renderMain()})
  .append('title').text(f=>{const cc=ISO_N[String(f.id).padStart(3,'0')];return `${EA_BY[cc].n} · ${EA_BY[cc].nca}`});
 /* small states markers */
 [['MT',[14.45,35.9]],['LU',[6.13,49.8]],['CY',[33.2,35.1]]].forEach(([cc,ll])=>{const p=proj(ll);if(!p)return;svg.append('circle').attr('cx',p[0]).attr('cy',p[1]).attr('r',6).attr('fill',cc===S.cc?'var(--accent)':'#e9e4da').attr('stroke','#1a1a1a').attr('stroke-width',c.presence.includes(cc)?1.4:.6).style('cursor','pointer').on('click',()=>{S.cc=S.cc===cc?null:cc;renderMain()}).append('title').text(EA_BY[cc].n)});
 /* labels: national item counts */
 ea.forEach(f=>{const cc=ISO_N[String(f.id).padStart(3,'0')],n=INC.filter(i=>i.cc===cc).length;const ct=path.centroid(f);if(!ct||isNaN(ct[0]))return;
  const cx=cc==='FR'?proj([2.5,46.8]):cc==='PT'?proj([-8.2,39.6]):cc==='ES'?proj([-3.6,40.2]):ct;
  svg.append('text').attr('x',cx[0]).attr('y',cx[1]).attr('text-anchor','middle').attr('font-family','Inter').attr('font-size',n?12:9.5).attr('font-weight',n?700:500).attr('fill',cc===S.cc?'#fff':n?'#7a0010':'#8a867e').attr('pointer-events','none').text(n?`${cc} · ${n}`:cc)})}

/* ---------- PRIORITIES ---------- */
function trailHtml(v){return `<div class="trail">${FU_STEPS.map(([k,n],j)=>{const st=v.fu[k],ss=fuSt(st);return `<div class="tstep s-${ss} ${st.ill?'ill':''}" style="--c:${FU_ST[ss][1]}"><div class="tsh"><span class="tn">${j+1}</span>${n}</div>${stPill(ss,k)}<p>${esc(st.t)}</p>
  <div class="tsf"><span class="num">${esc(fuDate(st))}</span>${st.iso&&daysTo(st.iso)>=0?`<span class="due ${daysTo(st.iso)<=31?'month':''}">${daysTo(st.iso)}d</span>`:''}${st.src?`<button class="linkbtn" data-act="read" data-id="${st.src}" title="${esc(BYID[st.src].h)}">[${st.src}] ${esc(BODY[BYID[st.src].b].s)}</button>`:''}${st.ill?'<span class="illt">illustrative</span>':''}</div></div>`}).join('<span class="tarr">→</span>')}</div>`}
function renderPriorities(){const c=client(),pool=scope();S.ctx=prPubs(VULNS.map(v=>v.id),pool).sort(rank).map(i=>i.id);
 const nAct=PRIOS.reduce((a,p)=>a+p.vs.reduce((b,v)=>b+v.acts.length,0),0),cross=pool.filter(i=>!isOut(i.id)&&!prOf(i).length).sort(rank);
 const off=S.jur!=='ea'&&S.jur!=='global';
 $('#main').innerHTML=`<div class="sechead"><div><h1>Crisis agenda</h1><p>Crisis desk only: geopolitical stress, resolution and CMDI, deposit-guarantee funding, and the ESRB frontier-AI warning. Supervisory and regulatory items are not in this radar.</p></div><div class="stat"><b>2</b> priorities · ${VULNS.length} key concerns<br>${nAct} planned activities · <a href="${PRIO_URL}" target="_blank" rel="noopener" style="color:var(--accent)">official page ↗</a></div></div>
 ${jurBar()}
 ${off?`<div class="empty">The ${esc(JURS.find(x=>x.id===S.jur).n)} supervisory priorities are coming in v2 (e.g. ${JURS.find(x=>x.id===S.jur).bodies.map(b=>BODY[b].s).join(', ')} annual priorities letters).</div>`:`
 ${glanceHtml(pool,true)}
 ${PRIOS.map(P=>{const ps=psai(P.id,pool),sd=prSayDo(P.vs.map(v=>v.id),pool),ths=THEMES.filter(t=>themePr(t.id).some(v=>v.startsWith(P.id)));return `<section class="pcardL ${P.id}" id="pr-${P.id}">
  <div class="pch"><div><span class="prn">${P.p} · official wording</span><h2>${esc(P.t)}</h2>
   <div class="pcm"><a href="${P.url}" target="_blank" rel="noopener">ECB Banking Supervision, priorities 2026–28 ↗</a><span>${ps.ps.length} publications · ${ps.bodies.map(b=>BODY[b].s).join(', ')}</span></div></div>
   <div class="pcidx"><span>Attention Index</span><b>${ps.score}</b>${trendB(ps.trend)}${spark(ps.pts,90,24,TREND[ps.trend].col)}</div></div>
  <div class="pcgrid"><div class="pcwhy"><h4>Why it matters for a G-SIB · ${esc(c.short)}</h4><p>${esc(P.gsib)}</p>
    <h4>Linked themes</h4><div class="pcth">${ths.map(t=>{const x=sai(t.id,pool);return `<button class="tl" data-act="theme" data-id="${t.id}"><i style="background:${t.c}"></i>${esc(t.s)} <b class="num">${x.score}</b></button>`}).join('')}</div></div>
   <div class="pcsd"><h4>Say vs Do</h4>${SD.map(([k,n])=>`<div class="sdl ${sd[k].length?'':'na'}"><span class="exk k-${k}">${n}</span><b class="num">${sd[k].length}</b>${sd[k].length?`<button data-act="read" data-id="${sd[k].find(x=>x.id!=='E13')?.id||sd[k][0].id}">${esc((sd[k].find(x=>x.id!=='E13')||sd[k][0]).t)}</button>`:'<span class="reason">Nothing in this edition</span>'}</div>`).join('')}</div></div>
  <div class="vlist">${P.vs.map(v=>{const vs=vsai(v.id,pool),ss=vStatus(v),ev=prPubs([v.id],pool).sort(rank);return `<div class="vcard" id="v-${v.id}"><div class="vch"><span class="glc">${v.code}</span><div><h3>${esc(v.v)}</h3><div class="vcm">${stPill(ss)}<span>${esc(cap(v.hook))}</span></div></div><div class="vidx"><small>Index</small>${saiBar(vs.score,80)}</div></div>
   ${trailHtml(v)}
   <div class="vev"><span>Evidence (${ev.length}):</span>${ev.slice(0,6).map(i=>`<button class="linkbtn" data-act="read" data-id="${i.id}">${esc(BODY[i.b].s)} · ${esc(i.h.length>58?i.h.slice(0,56)+'…':i.h)}</button>`).join('')}</div></div>`}).join('')}</div></section>`}).join('')}
 <div class="noteil">Trail steps come from official sources (cited). Steps marked “illustrative” show the usual supervisory sequence where timing or form is not public. Status is computed from the edition date. Overdue means a public supervisory deadline has passed and enforcement followed; it is not an assessment of ${esc(c.name)}.</div>
 <div class="calcols" style="grid-template-columns:1.1fr 1fr 1fr">
  <div><div class="sh"><h2>Ground truth · what supervisors found</h2></div>${GROUND.map(g=>{const i=BYID[g.src];return `<div class="gt1" data-act="read" data-id="${i.id}">${prChips(i)} <span class="tag" style="--c:${TH[g.th].c}">${esc(TH[g.th].s)}</span><p>${esc(g.t)}</p><span class="reason">${esc(BODY[i.b].s)} · ${esc(pubLab(i))} · source ↗</span></div>`}).join('')}</div>
  <div><div class="sh"><h2>Next follow-up checkpoints</h2></div>${VULNS.map(v=>{const st=v.fu.next,ss=fuSt(st);return `<div class="ditem" data-act="vuln" data-id="${v.id}"><div class="dd"><b>${esc(fuDate(st))}</b><small>${st.iso&&daysTo(st.iso)>=0?daysTo(st.iso)+' days':st.ill?'illustrative':''}</small></div><div><div class="kickm">${prChip(v.id,true)}</div><h3>${esc(st.t)}</h3></div><div>${stPill(ss)}</div></div>`}).join('')}</div>
  <div><div class="sh"><h2>Cross-cutting · outside the priorities</h2></div><p class="reason" style="margin:-4px 0 6px">Items that matter but are not tied to a 2026–28 priority.</p>${cross.map(i=>`<div class="ditem" data-act="read" data-id="${i.id}"><div class="dd"><b>${esc(whenLab(i))}</b><small>${esc(BODY[i.b].s)}</small></div><div><h3>${esc(i.h)}</h3></div><div></div></div>`).join('')}</div></div>`}`;
 if(S.vfocus){const el=document.getElementById('v-'+S.vfocus);S.vfocus=null;if(el){el.classList.add('flash');window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-120})}}}

/* ---------- READER ---------- */
function openReader(id){S.reader=id;if(!S.ctx.includes(id))S.ctx=[id];closePop();$('#tray').classList.remove('on');$('#modal').classList.remove('on','wide');renderReader();$('#reader').classList.add('on');$('#scrim').classList.add('on');$('#reader .pbody').scrollTop=0}
function closeReader(){S.reader=null;$('#reader').classList.remove('on');$('#scrim').classList.remove('on')}
function renderReader(){const i=BYID[S.reader];if(!i)return;const a=A(i),k=S.ctx.indexOf(i.id),c=client();
 const seg=(arr,cur,auto,act,cls)=>`<div class="seg">${arr.map((n,l)=>`<button class="${cls(l)} ${l===cur?'on':''} ${l===auto?'auto':''}" data-act="${act}" data-id="${i.id}" data-v="${l}">${n}</button>`).join('')}</div>`;
 const schema=[['Issuing body',BODY[i.b].n],['Jurisdiction',JURS.find(x=>x.id===i.j).n+(i.cc?` · ${EA_BY[i.cc].n} (${EA_BY[i.cc].nca})`:' · euro area-wide')],['Document type',PTYPE[i.type]],['Publication date',pubLab(i)],
  ['SSM priority fed',prOf(i).map(v=>VBY[v].code+' '+VBY[v].v).join('; ')||'Cross-cutting (not tied to a 2026–28 priority)'],['Themes (fixed)',i.themes.map(t=>TH[t].n).join('; ')],['Emerging themes',(i.emerg||[]).map(e=>EMERGING.find(x=>x.id===e).n).join('; ')||'—'],['Explicitness',['','1 · mention','2 · supervisory expectation','3 · requirement / deadline'][i.x]],
  ['Supervisory action',['0 · none','1 · plan / review','2 · exercise / OSI','3 · enforcement / binding request'][i.act]],['Reply / submission deadline',i.due?dShort(i.due):'—'],['Effective / application',i.eff?(/^\d{4}-\d{2}-\d{2}$/.test(i.eff)?dShort(i.eff):i.eff):'—'],
  ...SD.map(([k,n])=>[n,i.sd&&i.sd[k]||'—'])];
 $('#reader').innerHTML=`<div class="pbar"><span class="crumb">Desk · ${i.id}</span><span class="sp"></span><span class="crumb num" style="margin-right:6px">${k+1} of ${S.ctx.length}</span>
 <button class="ibtn" data-act="prev" title="Previous (←)">${ic('left',18)}</button><button class="ibtn" data-act="next" title="Next (→)">${ic('right',18)}</button><button class="ibtn" data-act="close" title="Close (Esc)">${ic('x',18)}</button></div>
 <div class="pbody">${kicker(i)}<h1 class="hl">${esc(i.h)}</h1><p class="stand">${esc(i.brief)}</p>
 <div class="srcbox"><div class="l1">Official source</div><div class="o">${esc(BODY[i.b].n)} <span class="tier off">Official</span></div>
  <div class="m">Published <b style="color:var(--ink)">${esc(pubLab(i))}</b>${i.due?` · Reply / submission <b style="color:var(--ink)">${esc(dShort(i.due))}</b> (${esc(dueLab(i.due))})`:''}${i.eff?` · Effective <b style="color:var(--ink)">${esc(/^\d{4}-\d{2}-\d{2}$/.test(i.eff)?dShort(i.eff):i.eff)}</b>`:''}</div>
  <a class="btnorig" href="${esc(i.url)}" target="_blank" rel="noopener">Read the original ${ic('ext',14,2.2)}</a>
  <div class="cor"><span>Link check: <b>${esc(i.check)}</b></span>${i.url2?`<a href="${esc(i.url2)}" target="_blank" rel="noopener" style="margin-left:auto;color:var(--accent);font-weight:600">Full document ↗</a>`:''}</div></div>
 <div class="assess"><div class="top"><span class="lab">Supervisory-manager assessment</span>${critChip(i)}${relvTag(i)}</div>
  <div class="reasons"><span style="background:none;border:0;padding-left:0;color:var(--meta)">Auto ${CRIT[a.lvl]} because:</span>${a.reasons.map(r=>`<span>${esc(r)}</span>`).join('')}</div>
  <div class="segs"><span class="sl">Criticality</span>${seg(CRIT,critOf(i),a.lvl,'setcrit',l=>'l'+l)}<span class="sl">Bank relevance</span>${seg(RELV,relvOf(i),a.relv,'setrelv',()=>'r')}</div>
  ${critEd(i)||relvEd(i)?`<div style="margin-top:10px;display:flex;gap:12px;align-items:center">${adjLine(i)}<button class="linkbtn" data-act="resetadj" data-id="${i.id}">Reset to auto</button></div>`:''}
  <div class="acts"><button class="pbtn ${isIn(i.id)?'inb':'red'}" data-act="inc" data-id="${i.id}">${ic('bookmark',14,2,isIn(i.id)?'currentColor':'none')}${isIn(i.id)?'In Monday’s brief: remove':'Include in brief'}</button><button class="pbtn" data-act="out" data-id="${i.id}">${ic(isOut(i.id)?'reset':'eyeoff',14,2)}${isOut(i.id)?'Restore':'Not relevant'}</button></div>
  ${isIn(i.id)?`<div style="margin-top:12px"><div class="lab" style="margin-bottom:5px">Editor’s note · printed in the brief</div><textarea class="notefield" data-note="${i.id}" placeholder="Context for the reader of the brief…">${esc(st(i.id).note||'')}</textarea></div>`:''}</div>
 <div class="rs"><h4>Summary</h4><p>${esc(i.sum)}</p></div>
 <div class="rs"><h4>Why it matters for ${esc(c.name)}</h4><p class="whyb">${esc(i.why)}</p></div>
 <div class="rs" id="exsec"><h4>Extraction · fixed schema v0 · with citations</h4>
  <table class="schema">${schema.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td><td class="cit">${v&&v!=='—'?`<a href="${esc(i.url)}" target="_blank" rel="noopener" title="Cited from the official source">[${esc(i.id)}]</a>`:''}</td></tr>`).join('')}</table>
  <div class="reason" style="margin-top:6px">Citation [${esc(i.id)}] = ${esc(BODY[i.b].s)}, “${esc(i.h)}”, ${esc(pubLab(i))}. <a href="${esc(i.url)}" target="_blank" rel="noopener">${esc(i.url.replace(/^https?:\/\//,'').slice(0,80))}…</a>${i.cite?` · ${esc(Object.values(i.cite).join(' · '))}`:''}</div></div>
 <div class="rs"><h4>Classification</h4>${tagList(i)}<div class="reason" style="margin-top:8px">Fields are paraphrased from the source; no internal bank data is used. Automated extraction requires editor review.</div></div>
 <div class="keys"><span><kbd>←</kbd> <kbd>→</kbd> previous / next</span><span><kbd>B</kbd> include in brief</span><span><kbd>X</kbd> not relevant</span><span><kbd>Esc</kbd> close</span></div></div>`}

/* ---------- POPOVER ---------- */
function openPop(id,anchor){S.pop=id;renderPop();$('#pop').classList.add('on');const r=anchor.getBoundingClientRect();let x=r.left+window.scrollX-6,y=r.bottom+window.scrollY+9;const mx=window.innerWidth-396;if(x>mx)x=mx;$('#pop').style.left=x+'px';$('#pop').style.top=y+'px';$('#pop').style.setProperty('--ax','24px')}
function closePop(){S.pop=null;$('#pop').classList.remove('on')}
function renderPop(){const i=BYID[S.pop];if(!i)return;const a=A(i);
 const seg=(arr,cur,auto,act,cls)=>`<div class="seg">${arr.map((n,l)=>`<button class="${cls(l)} ${l===cur?'on':''} ${l===auto?'auto':''}" data-act="${act}" data-id="${i.id}" data-v="${l}">${n}</button>`).join('')}</div>`;
 $('#pop').innerHTML=`<div class="ph"><span>Editorial assessment · ${i.id}</span><button class="ibtn" style="width:24px;height:24px" data-act="popclose">${ic('x',14,2)}</button></div>
 <div class="auto">Auto: <b>${CRIT[a.lvl]}</b> · relevance <b>${RELV[a.relv]}</b><br><span style="color:var(--meta)">${esc(a.reasons.join(' + '))}</span></div>
 <div class="segs"><span class="sl">Criticality</span>${seg(CRIT,critOf(i),a.lvl,'setcrit',l=>'l'+l)}<span class="sl">Relevance</span>${seg(RELV,relvOf(i),a.relv,'setrelv',()=>'r')}</div>
 ${critEd(i)||relvEd(i)?`<div style="margin-top:10px">${adjLine(i)}</div>`:''}
 <div class="foot">${critEd(i)||relvEd(i)?`<button class="linkbtn" data-act="resetadj" data-id="${i.id}">Reset to auto</button>`:'<span class="hint">• marks the automatic value</span>'}<button class="pbtn ${isIn(i.id)?'inb':'red'}" style="height:30px" data-act="inc" data-id="${i.id}">${ic('bookmark',13,2,isIn(i.id)?'currentColor':'none')}${isIn(i.id)?'In brief':'Include'}</button></div>`}

/* ---------- TRAY ---------- */
function openTray(){closePop();S.reader=null;$('#reader').classList.remove('on');renderTray();$('#tray').classList.add('on');$('#scrim').classList.add('on')}
function renderTray(){const f=finalOrder(),c=client(),e=E(),sc=scope();let n=0;const d=envData(),ev=EV();
 const stats={rev:sc.length,inc:f.length,out:sc.filter(i=>isOut(i.id)).length,adj:sc.filter(i=>critEd(i)||relvEd(i)).length};
 $('#tray').innerHTML=`<div class="pbar"><span class="crumb">${esc(radar().brief)} · ${esc(c.name)}</span><span class="sp"></span><button class="ibtn" data-act="close" title="Close (Esc)">${ic('x',18)}</button></div>
 <div class="pbody"><h2>Monday’s Brief</h2><div class="sub">${f.length} publication${f.length===1?'':'s'} selected · ordered by adjusted criticality, then your order · SSM / Euro area edition</div>
 <div class="tfields"><div class="tf"><label>Prepared by</label><input id="prepIn" value="${esc(e.prep)}"></div><div class="tf"><label>Cover note</label><textarea class="notefield" id="coverIn" placeholder="What senior management should take away this week…">${esc(e.cover)}</textarea></div></div>
 <div class="xsum"><h5><span>Cover · 30-second read</span>${d.edited?'<button class="linkbtn" data-act="xreset">Reset to automatic</button>':''}</h5>
  <label>Environment headline</label><textarea data-x="env" data-k="h">${esc(d.h)}</textarea>
  <label>Standfirst</label><textarea data-x="env" data-k="s" style="min-height:64px">${esc(d.s)}</textarea>
  <label>Signals</label>${d.sig.map((g,k)=>`<textarea data-x="env" data-k="g${k}" placeholder="${g.k}">${esc(g.t)}</textarea>`).join('')}
  <label>Supervisory attention level</label><select data-x="lvl"><option value="auto" ${X().lvl==null?'selected':''}>Automatic (${LEVELS[d.lvl]})</option>${LEVELS.map((l,k)=>`<option value="${k}" ${X().lvl===k?'selected':''}>${l}</option>`).join('')}</select></div>
 ${f.length?[0,1,2,3].map(l=>{const g=f.filter(i=>critOf(i)===l);if(!g.length)return'';return `<div class="grp"><div class="gh l${l}">${CRIT[l]} · ${g.length}</div>${g.map((i,k)=>{n++;return `<div class="titem" data-tid="${i.id}" data-crit="${l}"><span class="h"></span><span class="no num">${n}</span>
  <div style="min-width:0">${kicker(i)}<h4 class="hl" data-act="read" data-id="${i.id}">${esc(i.h)}</h4><div style="margin-top:5px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">${critChip(i)}${adjLine(i)||`<span class="reason">${esc(BODY[i.b].s)} · ${esc(pubLab(i))}</span>`}</div></div>
  <div class="ctr"><button data-act="mup" data-id="${i.id}" ${k===0?'disabled':''} title="Move up">${ic('up',16,2)}</button><button data-act="mdown" data-id="${i.id}" ${k===g.length-1?'disabled':''} title="Move down">${ic('down',16,2)}</button><button data-act="inc" data-id="${i.id}" title="Remove from brief">${ic('x',15,2)}</button></div>
  <div class="nt"><textarea data-note="${i.id}" placeholder="Editor’s note (optional), printed under this publication">${esc(st(i.id).note||'')}</textarea></div></div>`}).join('')}</div>`}).join('')
  :`<div class="tempty">No publications selected yet.<br>Use the ${ic('bookmark',15)} on any publication to include it in Monday’s brief.</div>`}</div>
 <div class="tfoot"><span class="st">Reviewed <b>${stats.rev}</b> · included <b>${stats.inc}</b> · not relevant <b>${stats.out}</b> · adjusted <b>${stats.adj}</b></span><button class="pbtn" data-act="printview" ${f.length?'':'disabled'}>${ic('print',14,2)}Print view</button><button class="pbtn red" id="pdfBtn" data-act="pdf" ${f.length?'':'disabled'}>${ic('dl',14,2)}Export PDF</button></div>`;
 $('#prepIn').addEventListener('input',e=>{E().prep=e.target.value;save()});$('#coverIn').addEventListener('input',e=>{E().cover=e.target.value;save()})}

/* ---------- MODALS ---------- */
function openRecord(){const c=client(),rows=[];scope().forEach(i=>{if(A(i).lvl<=1)rows.push({a:`Auto-classified ${CRIT[A(i).lvl]} (${A(i).reasons.slice(0,2).join(' + ')})`,i,by:'Crisis Radar v0'});if(critEd(i))rows.push({a:`Criticality adjusted ${CRIT[A(i).lvl]} → ${CRIT[critOf(i)]}`,i,by:E().prep});if(isIn(i.id))rows.push({a:'Included in Monday’s brief',i,by:E().prep});if(isOut(i.id))rows.push({a:'Marked not relevant',i,by:E().prep})});
 $('#modal').innerHTML=`<div style="display:flex;align-items:center;gap:12px"><div><h3>Record · ${esc(c.name)}</h3><div class="reason">Extraction schema v0 and decisions for this edition: what was flagged, why and by whom</div></div><button class="ibtn" data-act="mclose" style="margin-left:auto">${ic('x',18)}</button></div>
 <table class="rtab2"><thead><tr><th>When</th><th>Action</th><th>Publication</th><th>By</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="num">${hm(EDITION)}</td><td>${esc(r.a)}</td><td><button class="linkbtn" data-act="read" data-id="${r.i.id}">${esc(BODY[r.i.b].s)} · ${esc(r.i.h.slice(0,70))}</button></td><td>${esc(r.by)}</td></tr>`).join('')}</tbody></table>`;
 $('#modal').classList.add('on','wide');$('#scrim').classList.add('on')}
function watchlist(){const c=client();$('#modal').innerHTML=`<div style="display:flex;align-items:center;gap:12px"><span class="logo" style="width:40px;height:40px;font-size:14px;border-radius:8px">${c.logo}</span><div><h3>${esc(c.name)}</h3><div class="reason">${esc(c.type)}</div></div><button class="ibtn" data-act="mclose" style="margin-left:auto">${ic('x',18)}</button></div>
 <div class="wl"><div><h4>v1 scope</h4><p>ECB Banking Supervision (SSM), ECB, EBA, ESRB, and euro-area NCAs (BdE and BdF in this sample). SRB and AMLA are in the universe and planned.</p></div>
 <div><h4>Euro-area presence (public, indicative)</h4><p>${c.presence.map(x=>EA_BY[x].n).join(', ')} · core: ${c.core.map(x=>EA_BY[x].n).join(', ')}</p></div>
 <div><h4>Coming in v2</h4><p>${JURS.filter(j=>!j.v1).map(j=>`${j.n}: ${j.bodies.map(b=>BODY[b].s).join(', ')}`).join(' · ')}</p></div></div>
 <p class="reason" style="margin-top:12px">Configured per client by ${CONSULTANCY}. External public sources only; no internal bank data.</p>`;$('#modal').classList.add('on');$('#scrim').classList.add('on')}

/* ---------- render & actions ---------- */

function wireCard(w){return `<article class="wire"><div class="dt">${esc(w.d)}<br>${esc(w.s)}</div><div><h3>${esc(w.h)}</h3><p>${esc(w.b)}</p>${w.why?`<p class="why"><b>For a bank. </b>${esc(w.why)}</p>`:''}</div><a href="${esc(w.u)}" target="_blank" rel="noopener">Source ↗</a></article>`}

function renderGeo(){
 const wars=WARS.map(s=>`<article><div class="asof">${esc(s.asof)}</div><h2>${esc(s.n)}</h2>${s.elements.map(el=>`<p><b>${esc(el.k)}.</b> ${esc(el.v)}</p>`).join('')}</article>`).join('');
 const votes=ELECTIONS.map(e=>`<article class="wire"><div class="dt">${esc(e.when)}</div><div><h3>${esc(e.where)}</h3><p>${esc(e.what)}</p></div></article>`).join('');
 $('#main').innerHTML=`<div class="sechead"><div><h1>Geopolitics</h1><p>Two summaries, then the elections. Not a news feed.</p></div></div><div class="sit">${wars}</div><div class="sh"><h2>Country elections</h2><span class="sub">Votes that can move sanctions, energy policy and funding</span></div><div class="wires">${votes}</div>`;
}
function renderAi(){
 $('#main').innerHTML=`<div class="sechead"><div><h1>${esc(AIBLOCK.h)}</h1><p>${esc(AIBLOCK.sum)}</p></div></div><ul class="pts big">${AIBLOCK.bullets.map(b=>`<li><b>${esc(b.t)}.</b> ${esc(b.d)}</li>`).join('')}</ul>`;
}
function renderFraud(){S.view='ai';renderAi()}
function renderMain(){({front:renderFront,geo:renderGeo,ai:renderAi,fraud:renderFraud,themes:renderThemes,desk:renderDesk,calendar:renderCalendar,map:renderMap,priorities:renderPriorities})[S.view]()}
function renderAll(){renderChrome();renderMain();if(S.reader&&$('#reader').classList.contains('on'))renderReader();if($('#tray').classList.contains('on'))renderTray()}
function setView(v){S.view=v;S.fl={crit:'all',grp:'all',body:'all',theme:'all',prio:'all',sort:'crit',showOut:false};$$('#sections button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));closePop();window.scrollTo({top:0});renderMain()}
const setSt=(id,p)=>{E().st[id]={...st(id),...p};save()};
function toggleInc(id){const s=st(id);if(s.inc==='in'){setSt(id,{inc:null});E().order=E().order.filter(x=>x!==id);toast('Removed from brief')}else{setSt(id,{inc:'in'});if(!E().order.includes(id))E().order.push(id);toast('Included in Monday’s brief')}save();$('#briefBtn').classList.remove('bump');void $('#briefBtn').offsetWidth;$('#briefBtn').classList.add('bump');renderAll()}
function toggleOut(id){const s=st(id);if(s.inc==='out'){setSt(id,{inc:null});toast('Restored')}else{setSt(id,{inc:'out'});E().order=E().order.filter(x=>x!==id);toast('Marked not relevant')}renderAll()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');
 if(!t){if(!e.target.closest('#clientMenu')&&!e.target.closest('#clientBtn'))$('#clientMenu').classList.remove('on');if(!e.target.closest('#pop'))closePop();return}
 const a=t.dataset.act,id=t.dataset.id;
 switch(a){
  case 'read':openReader(id);break;
  case 'close':closeReader();$('#tray').classList.remove('on');$('#scrim').classList.remove('on');break;
  case 'prev':case 'next':{const k=S.ctx.indexOf(S.reader),j=a==='prev'?k-1:k+1;if(j>=0&&j<S.ctx.length){S.reader=S.ctx[j];renderReader()}break}
  case 'inc':toggleInc(id);break;
  case 'out':toggleOut(id);break;
  case 'adj':if(t.closest('#reader')){$('#reader #exsec')&&0}else openPop(id,t);break;
  case 'popclose':closePop();break;
  case 'setcrit':setSt(id,{crit:+t.dataset.v});renderAll();if(S.pop)renderPop();break;
  case 'setrelv':setSt(id,{relv:+t.dataset.v});renderAll();if(S.pop)renderPop();break;
  case 'resetadj':setSt(id,{crit:null,relv:null});renderAll();if(S.pop)renderPop();break;
  case 'view':setView(t.dataset.v);break;
  case 'jur':S.jur=t.dataset.v;if(S.jur!=='ea')S.cc=null;renderAll();break;
  case 'cc':S.cc=t.dataset.v;renderMain();break;
  case 'ccclear':S.cc=null;renderAll();break;
  case 'theme':setView('desk');S.fl.theme=id;renderMain();break;
  case 'prf':S.fl.prio=t.dataset.v;renderMain();break;
  case 'vuln':closeReader();$('#modal').classList.remove('on','wide');S.vfocus=id;if(S.view!=='priorities'){setView('priorities')}else renderMain();break;
  case 'mx':setView('desk');S.fl.grp=t.dataset.g;S.fl.crit=t.dataset.l==='all'?'all':t.dataset.l;renderMain();break;
  case 'mxb':setView('desk');S.fl.theme=t.dataset.theme;S.fl.body=t.dataset.b;renderMain();break;
  case 'fcrit':S.fl.crit=t.dataset.v;renderMain();break;
  case 'showout':S.fl.showOut=!S.fl.showOut;renderMain();break;
  case 'xedit':S.execEdit=!S.execEdit;renderMain();break;
  case 'xlvl':X().lvl=+t.dataset.v===envAuto().lvl?null:+t.dataset.v;if(X().lvl==null)delete X().lvl;save();renderMain();break;
  case 'xreset':E().env={};delete X().lvl;save();renderAll();break;
  case 'flow':if(t.dataset.v==='brief')openTray();else if(t.dataset.v==='record')openRecord();else setView(t.dataset.v);break;
  case 'client':S.client=t.dataset.c;$('#clientMenu').classList.remove('on');save();renderAll();toast(`Switched to ${client().name}`);break;
  case 'mup':case 'mdown':{const f=finalOrder(),i=BYID[id],g=f.filter(x=>critOf(x)===critOf(i)),k=g.indexOf(i),j=a==='mup'?k-1:k+1;if(j<0||j>=g.length)break;const o=E().order,ia=o.indexOf(id),ib=o.indexOf(g[j].id);[o[ia],o[ib]]=[o[ib],o[ia]];save();renderTray();break}
  case 'pdf':exportPdf();break;
  case 'printview':printEdition();break;
  case 'mclose':$('#modal').classList.remove('on','wide');$('#scrim').classList.remove('on');break;
 }});
document.addEventListener('change',e=>{const f=e.target.dataset.f;if(f){S.fl[f]=e.target.value;renderMain();return}
 if(e.target.dataset.x==='lvl'){const v=e.target.value;if(v==='auto')delete X().lvl;else X().lvl=+v;save();renderAll()}});
document.addEventListener('input',e=>{const el=e.target;
 if(el.dataset.note){setSt(el.dataset.note,{note:el.value});return}
 const x=el.dataset.x;if(!x||x==='lvl')return;const val=(el.value!=null&&el.tagName==='TEXTAREA'?el.value:el.innerText).trim(),o=EV();
 if(x==='env'){const k=el.dataset.k,auto=envAuto(),av=k==='h'?auto.h:k==='s'?auto.s:(auto.sig[+k.slice(1)]||{}).t;if(val&&val!==av)o[k]=val;else delete o[k]}
 if(x==='tk'){o.tk=o.tk||{};const av=BYID[el.dataset.id].brief;if(val&&val!==av)o.tk[el.dataset.id]=val;else delete o.tk[el.dataset.id]}
 save()});
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,[contenteditable=true]'))return;
 if(e.key==='Escape'){closePop();closeReader();$('#tray').classList.remove('on');$('#modal').classList.remove('on','wide');$('#scrim').classList.remove('on');return}
 if(S.reader){if(e.key==='ArrowLeft')$('#reader [data-act=prev]').click();if(e.key==='ArrowRight')$('#reader [data-act=next]').click();if(e.key==='b'||e.key==='B')toggleInc(S.reader);if(e.key==='x'||e.key==='X')toggleOut(S.reader)}});
$('#clientBtn').addEventListener('click',e=>{e.stopPropagation();$('#clientMenu').classList.toggle('on')});
$('#wlBtn').addEventListener('click',watchlist);
$('#briefBtn').addEventListener('click',openTray);
$('#scrim').addEventListener('click',()=>{closeReader();$('#tray').classList.remove('on');$('#modal').classList.remove('on','wide');$('#scrim').classList.remove('on')});
$('#resetBtn').addEventListener('click',()=>{S.ed[S.client]=null;delete S.ed[S.client];S.cc=null;save();renderAll();toast('Edition reset')});
$$('#sections button').forEach(b=>b.addEventListener('click',()=>{setView(b.dataset.v);history.replaceState(null,'','#'+b.dataset.v)}));
 if(location.hash){const v=location.hash.slice(1);if(['front','geo','ai','fraud','themes','desk','calendar','map','priorities'].includes(v))S.view=v==='fraud'?'ai':v}
$$('[data-i]').forEach(el=>el.innerHTML=ic(el.dataset.i,14,2));
try{renderAll();window.__ready=true}catch(err){console.error(err);const m=document.querySelector('#main');if(m)m.innerHTML='<div class="empty">This edition failed to render. '+esc(err.message)+'</div>';window.__ready=false}
</script>
