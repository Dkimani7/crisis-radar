<script>
/* ============ CORE HELPERS ============ */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const BYID=Object.fromEntries(INC.map(i=>[i.id,i]));
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const EDITION=new Date(SNAP);
const dateLong=d=>`${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const hm=d=>String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
const dShort=iso=>{if(!iso)return '';const d=new Date(iso+'T12:00:00');return isNaN(d)?iso:`${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`};
const daysTo=iso=>{if(!iso||!/^\d{4}-\d{2}-\d{2}$/.test(iso))return null;return Math.ceil((new Date(iso+'T23:59:59')-EDITION)/864e5)};
const ageD=i=>i.date?Math.max(0,Math.round((EDITION-new Date(i.date+'T12:00:00'))/864e5)):400;
const dueLab=iso=>{const d=daysTo(iso);if(d==null)return '';if(d<0)return `closed ${dShort(iso)}`;if(d===0)return 'due today';if(d===1)return 'due tomorrow';return `due in ${d} days`};
const pubLab=i=>i.pubLabel||dShort(i.date);
const monthOnly=i=>i.pubLabel&&/^[A-Z][a-z]+ \d{4}$/.test(i.pubLabel);
const whenLab=i=>!i.date?'Undated':monthOnly(i)?i.pubLabel.split(' ')[0].slice(0,3)+'.':dShort(i.date).replace(/ \d{4}$/,'');
const shortPub=i=>!i.date?pubLab(i):monthOnly(i)?i.pubLabel:dShort(i.date);
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ============ STATE ============ */
const KEY='supervisoryRadar.ssmV0';let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const S={client:CLIENTS[saved.client]?saved.client:'santander',ed:saved.ed||{},view:'front',jur:'ea',cc:null,reader:null,ctx:[],pop:null,execEdit:false,
 fl:{crit:'all',grp:'all',body:'all',theme:'all',prio:'all',sort:'crit',showOut:false}};
function client(){return CLIENTS[S.client]}
const E=()=>S.ed[S.client]||(S.ed[S.client]={st:{},order:[],cover:'',prep:'Head of Supervisory Affairs',env:{},x:{}});
const EV=()=>E().env||(E().env={}),X=()=>E().x||(E().x={});
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({client:S.client,ed:S.ed}))}catch(e){}};
const st=id=>E().st[id]||{};

/* ============ SCOPE & SCORING ============ */
function radar(){return ({n:'Crisis Radar',short:'Crisis',kicker:'Crisis watch',tag:'Resolution, stress, CMDI and systemic risk',prio:'Stress & resolution',brief:"Monday’s Crisis Brief",foot:'Official crisis, resolution and systemic-risk publications'});
const inLane=i=>true;
const inJur=i=>S.jur==='global'?true:i.j===S.jur;            /* Global = universe view (v1 content + previews) */
const inCC=i=>!S.cc||i.cc===S.cc||(!i.cc&&i.j==='ea');      /* EA-wide items apply to every euro-area country */
const scopeAll=()=>INC.filter(i=>inJur(i)&&inLane(i));
const scope=()=>scopeAll().filter(inCC);
function autoAssess(i){
 const c=client(),r=[];let R=i.rel;
 if(i.j!=='ea'){R-=25;r.push('Outside v1 scope (preview)')}
 if(i.cc&&!c.presence.includes(i.cc))R-=20;
 if(i.cc&&c.core.includes(i.cc)){R+=6;r.push(EA_BY[i.cc].n+' · core market')}
 if(!c.gsib&&i.b==='ssm'&&i.type==='request')R-=10;
 const dd=daysTo(i.due);
 if(i.x===3)r.push(dd!=null&&dd>=0?'Requirement with deadline':'Explicit requirement');else if(i.x===2)r.push('Supervisory expectation');
 if(dd!=null&&dd>=0&&dd<=31)r.push(`Deadline in ${dd} days`);
 if(i.act>=3)r.push(i.type==='enforce'?'Enforcement action':'Binding request');else if(i.act===2)r.push('Supervisory exercise');
 if(BODY[i.b].w>=0.95)r.push(BODY[i.b].s+' authority');
 let lvl=i.sev>=5?0:i.sev>=4?1:i.sev>=3?2:3;
 if(dd!=null&&dd>=0&&dd<=31&&i.x===3&&lvl>0)lvl--;
 if(R<55)lvl=Math.max(lvl,2);if(R<40)lvl=3;
 const relv=R>=75?0:R>=55?1:2;
 return {lvl,relv,R,reasons:r.slice(0,4),inScope:true,pts:R+(5-i.sev)*-8};
}
const AC={};const A=i=>{const k=S.client;const c=(AC[k]=AC[k]||{});return c[i.id]||(c[i.id]=autoAssess(i))};
const critOf=i=>st(i.id).crit!=null?st(i.id).crit:A(i).lvl;
const relvOf=i=>st(i.id).relv!=null?st(i.id).relv:A(i).relv;
const critEd=i=>st(i.id).crit!=null&&st(i.id).crit!==A(i).lvl;
const relvEd=i=>st(i.id).relv!=null&&st(i.id).relv!==A(i).relv;
const isIn=id=>st(id).inc==='in',isOut=id=>st(id).inc==='out';
const rank=(a,b)=>critOf(a)-critOf(b)||relvOf(a)-relvOf(b)||A(b).R-A(a).R||ageD(a)-ageD(b);
const finalOrder=()=>{const o=E().order;return o.filter(isIn).map(id=>BYID[id]).filter(i=>i&&inLane(i)).sort((a,b)=>critOf(a)-critOf(b)||o.indexOf(a.id)-o.indexOf(b.id))};
const groupOf=i=>(PGROUP.find(g=>g[2].includes(i.type))||PGROUP[2])[0];

/* ============ SUPERVISORY ATTENTION INDEX ============
 Per theme, from the publications in scope. Six components (0–1), illustrative weights in v0:
 Authority · Explicitness · Recency · Repetition · Supervisory action · Cross-jurisdiction convergence */
const SAI_W={auth:.15,expl:.15,rec:.20,rep:.15,act:.20,conv:.15};
const SAI_L={auth:'Authority',expl:'Explicitness',rec:'Recency',rep:'Repetition',act:'Supervisory action',conv:'Convergence'};
function themePubs(tid,pool){return (pool||scope()).filter(i=>!isOut(i.id)&&i.themes.includes(tid))}
function saiCore(ps,wt){
 if(!ps.length)return {score:0,c:{auth:0,expl:0,rec:0,rep:0,act:0,conv:0},ps,bodies:[],trend:'cooling',pts:Array(8).fill(0),recent:0};
 const bodies=[...new Set(ps.map(i=>i.b))];
 const c={auth:Math.max(...ps.map(i=>BODY[i.b].w)),
  expl:ps.reduce((a,i)=>a+i.x*wt(i),0)/ps.reduce((a,i)=>a+wt(i),0)/3,
  rec:Math.min(1,ps.reduce((a,i)=>a+wt(i)*Math.exp(-ageD(i)/45),0)/2),
  rep:Math.min(1,ps.reduce((a,i)=>a+wt(i),0)/5),
  act:Math.min(1,Math.max(...ps.map(i=>i.act*(wt(i)===1?1:.67)))/3*.7+ps.filter(i=>i.act>=2&&wt(i)===1).length*.15),
  conv:Math.min(1,(bodies.length-1)/3+(bodies.some(b=>BODY[b].nca)?.15:0))};
 const score=Math.round(100*Object.entries(SAI_W).reduce((a,[k,w])=>a+w*c[k],0));
 const pts=[];for(let w=7;w>=0;w--){pts.push(ps.filter(i=>i.date&&ageD(i)>=w*7&&ageD(i)<(w+1)*7).length)}
 const recent=ps.filter(i=>i.date&&ageD(i)<=35).length,older=ps.filter(i=>i.date&&ageD(i)>35&&ageD(i)<=180).length;
 const trend=recent>=2&&recent>=older?'rising':recent===0?'cooling':'persistent';
 return {score,c,ps,bodies,trend,pts,recent};
}
function sai(tid,pool){return saiCore(themePubs(tid,pool),i=>i.themes[0]===tid?1:.45)}
/* ---- SSM priorities: tags, index, follow-up ---- */
const prOf=i=>PR_TAG[i.id]||[];
const prLab=vid=>VBY[vid].code+' '+VBY[vid].short;
const prPubs=(ids,pool)=>(pool||scope()).filter(i=>!isOut(i.id)&&prOf(i).some(v=>ids.includes(v)));
const prWt=i=>prOf(i).length>2?.45:1;
function vsai(vid,pool){return saiCore(prPubs([vid],pool),prWt)}
function psai(pid,pool){return saiCore(prPubs(PRIOS.find(p=>p.id===pid).vs.map(v=>v.id),pool),prWt)}
function prSayDo(ids,pool){const ps=prPubs(ids,pool),o={};SD.forEach(([k])=>o[k]=ps.filter(i=>i.sd&&i.sd[k]).map(i=>({id:i.id,t:i.sd[k]})));return o}
/* a dated checkpoint that has passed without being done becomes overdue */
const fuSt=st=>{if(st.iso&&st.st==='upcoming'&&daysTo(st.iso)<0)return 'overdue';return st.st};
const fuDate=st=>st.iso?dShort(st.iso):st.d||'';
function vStatus(v){const sts=FU_STEPS.map(([k])=>fuSt(v.fu[k]));return sts.includes('overdue')?'overdue':sts.includes('published')&&v.fu.rem.st!=='upcoming'?'progress':sts.includes('published')?'published':'progress'}
const nextFU=v=>v.fu.next;
const fuDated=()=>VULNS.flatMap(v=>FU_STEPS.filter(([k])=>v.fu[k].iso).map(([k,n])=>({v,k,n,st:v.fu[k],iso:v.fu[k].iso,i:v.fu[k].src?BYID[v.fu[k].src]:null})));
const themePr=tid=>THEME_PR[tid]||[];
const prFilterOk=(i,f)=>f==='all'?true:f==='none'?!prOf(i).length:f.length===2?prOf(i).some(v=>v.startsWith(f)):prOf(i).includes(f);
const TREND={rising:{n:'Rising',a:'▲',col:'#C8102E'},persistent:{n:'Persistent',a:'▶',col:'#57534E'},cooling:{n:'Cooling',a:'▼',col:'#4f7a96'}};
function themesRanked(pool){return THEMES.map(t=>({...t,...sai(t.id,pool)})).sort((a,b)=>b.score-a.score)}

/* ============ SAY vs DO ============ */
function sayDo(tid,pool){const ps=themePubs(tid,pool);const o={};SD.forEach(([k])=>o[k]=ps.filter(i=>i.sd&&i.sd[k]).map(i=>({id:i.id,t:i.sd[k]})));return o}
function gapOf(tid,pool){const o=sayDo(tid,pool);const say=o.narr.length,sup=o.sup.length,reg=o.reg.length,rem=o.rem.length,def=o.def.length,doo=sup+reg+rem;
 if(!say&&!doo)return '—';if(say&&!doo)return 'Talk ahead of action';if(!say)return 'Action without narrative';
 if(def&&!rem)return 'Findings, remediation unclear';if(def>rem)return 'Findings outpace remediation asks';
 if(say>doo)return 'Narrative-led: action building';if(reg>sup+rem)return 'Rule-making-led';if(sup+rem>=say)return 'Action-led: reviews & remediation';return 'Aligned'}

/* ============ NEXT DEADLINES ============ */
const datedItems=()=>{const out=[];scope().filter(i=>!isOut(i.id)).forEach(i=>{if(daysTo(i.due)!=null)out.push({i,iso:i.due,k:i.type==='consult'?'Reply deadline':i.type==='request'?'ECB submission due':'Due'});if(daysTo(i.eff)!=null)out.push({i,iso:i.eff,k:'Effective'})});return out.sort((a,b)=>daysTo(a.iso)-daysTo(b.iso))};
</script>
