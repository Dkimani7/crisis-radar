<script>
/* ================= PDF (jsPDF, embedded fonts, selectable text) ================= */
const FONT_SRC={
 'Serif-Regular':['Serif','normal','https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-Regular.ttf'],
 'Serif-Bold':['Serif','bold','https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-Bold.ttf'],
 'Serif-It':['Serif','italic','https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-It.ttf'],
 'SerifD-Black':['SerifD','normal','https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4Display-Black.ttf'],
 'Sans-Regular':['Sans','normal','https://cdn.jsdelivr.net/gh/adobe-fonts/source-sans@release/TTF/SourceSans3-Regular.ttf'],
 'Sans-Bold':['Sans','bold','https://cdn.jsdelivr.net/gh/adobe-fonts/source-sans@release/TTF/SourceSans3-Bold.ttf']};
let FONT_CACHE=null;
async function loadFonts(){if(FONT_CACHE)return FONT_CACHE;const out={};await Promise.all(Object.entries(FONT_SRC).map(async([k,v])=>{const r=await fetch(v[2]);if(!r.ok)throw new Error('font '+k);const b=new Uint8Array(await r.arrayBuffer());let s='';for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));out[k]=btoa(s)}));return FONT_CACHE=out}
const hexRgb=h=>{h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
const mix=(h,a)=>hexRgb(h).map(v=>Math.round(255-(255-v)*a));
async function exportPdf(){const btn=$('#pdfBtn');const lab=btn?btn.innerHTML:'';if(btn){btn.disabled=true;btn.innerHTML='Preparing PDF…'}
 try{if(!window.jspdf)throw new Error('jsPDF not loaded');let fonts=null;try{fonts=await loadFonts()}catch(e){console.warn('Embedded fonts unavailable, using core fonts',e)}
  const doc=buildPdf(fonts);const c=C(),d=new Date();const fn=`Monday-Crisis-Radar_SSM_${c.short.replace(/\s+/g,'-')}_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.pdf`;
  window.__lastPdf=doc.output('datauristring');doc.save(fn);toast(`PDF downloaded · ${fn}`)}
 catch(e){console.warn('PDF export failed, opening print view',e);toast('PDF library unavailable — opening print view');printEdition()}
 finally{if(btn){btn.disabled=false;btn.innerHTML=lab}}}
function buildPdf(fonts){
 const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4',compress:true});
 const F={serif:'times',serifD:'times',sans:'helvetica'};
 if(fonts){Object.entries(FONT_SRC).forEach(([k,v])=>{doc.addFileToVFS(k+'.ttf',fonts[k]);doc.addFont(k+'.ttf',v[0],v[1])});F.serif='Serif';F.serifD='SerifD';F.sans='Sans'}
 const clean=s=>{s=String(s??'');s=s.replace(/→/g,'to').replace(/[▲▶▼◆]/g,'');if(fonts)return s.replace(/[^\x00-\u024F\u2010-\u2027\u20AC]/g,'');return s.replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/—|–/g,'-').replace(/·/g,'-').replace(/…/g,'...').replace(/€/g,'EUR ').replace(/č/g,'c').replace(/[^\x00-\xFF]/g,'')};
 const c=C(),e=E(),acc=hexRgb(c.accent),INK=[26,26,26],META=[110,106,99],NAVY=hexRgb('#1F3A5F'),CR=['#A30016','#C2410C','#9A6A00','#7d7d7d'].map(hexRgb),LVR=LVC.map(hexRgb);
 const W=210,H=297,M=16,CW=W-2*M,BOT=H-17,PT=0.3528;
 const font=(f,st,sz,col=INK)=>{doc.setFont(F[f],fonts||st!=='italic'||f!=='sans'?st:'normal');doc.setFontSize(sz);doc.setTextColor(...col)};
 const lh=(sz,k=1.32)=>sz*PT*k;
 let L={top:0,y:0,x:M,w:CW,n:1,ci:0,gap:7,maxY:0};
 const colX=k=>M+k*(L.w+L.gap);
 function gutter(){if(L.n>1){doc.setDrawColor(190,184,175);doc.setLineWidth(.25);for(let k=1;k<L.n;k++){const gx=colX(k)-L.gap/2;doc.line(gx,L.top+1,gx,Math.max(L.maxY,L.y)-2)}}}
 function newPage(){gutter();doc.addPage();runHead();L.top=L.y=M+11;L.ci=0;L.x=colX(0);L.maxY=L.y}
 function cols(n,gap=7){if(L.n>1)gutter();const y=Math.max(L.y,L.maxY);L={top:y,y,x:M,w:(CW-gap*(n-1))/n,n,ci:0,gap,maxY:y}}
 function need(h){if(L.y+h<=BOT)return;L.maxY=Math.max(L.maxY,L.y);if(L.ci<L.n-1){L.ci++;L.x=colX(L.ci);L.y=L.top}else newPage()}
 function adv(h){L.y+=h;L.maxY=Math.max(L.maxY,L.y)}
 function para(txt,f,st,sz,col,k=1.38,keep=0,ind=0){font(f,st,sz,col);const lines=doc.splitTextToSize(clean(txt),L.w-ind),h=lh(sz,k);need(h*Math.min(lines.length,keep||2));
  lines.forEach(ln=>{need(h);doc.text(ln,L.x+ind,L.y,{baseline:'top'});adv(h)})}
 function label(txt,col,sz=6.6){font('sans','bold',sz,col);need(lh(sz,1.6)+6);doc.text(clean(txt).toUpperCase(),L.x,L.y,{baseline:'top',charSpace:.25});adv(lh(sz,1.6))}
 function rule(col=[215,210,202],w=.2,gapB=3){if(L.y+gapB+6>BOT){L.y=BOT+1;return}doc.setDrawColor(...col);doc.setLineWidth(w);doc.line(L.x,L.y,L.x+L.w,L.y);adv(gapB)}
 function section(t,sub){cols(1);need(22);doc.setDrawColor(...INK);doc.setLineWidth(.5);doc.line(M,L.y,W-M,L.y);adv(2.5);font('serif','bold',15,INK);doc.text(clean(t),M,L.y,{baseline:'top'});
  if(sub){const tw=doc.getTextWidth(clean(t));font('sans','normal',7,META);doc.text(clean(sub),M+tw+4,L.y+2.4,{baseline:'top'})}adv(8.5)}
 function runHead(){font('sans','bold',6.6,META);doc.text(clean(`MONDAY SUPERVISORY RADAR · SSM / EURO AREA EDITION · ${c.name.toUpperCase()}`),M,M,{baseline:'top',charSpace:.2});doc.text(clean(dateLong(EDITION).toUpperCase()),W-M,M,{baseline:'top',align:'right',charSpace:.2});
  doc.setDrawColor(...acc);doc.setLineWidth(.6);doc.line(M,M+5,W-M,M+5)}
 const sparkPdf=(pts,x,y,w,h,col)=>{const mx=Math.max(...pts,.001);doc.setDrawColor(...col);doc.setLineWidth(.35);for(let k=1;k<pts.length;k++)doc.line(x+(k-1)/(pts.length-1)*w,y+h-pts[k-1]/mx*h,x+k/(pts.length-1)*w,y+h-pts[k]/mx*h);doc.setFillColor(...col);doc.circle(x+w,y+h-pts[pts.length-1]/mx*h,.55,'F')};
 const tri=(cx,cy,d)=>{if(d==='rising')doc.triangle(cx,cy-1.2,cx-1.05,cy+.8,cx+1.05,cy+.8,'F');else if(d==='cooling')doc.triangle(cx,cy+1.2,cx-1.05,cy-.8,cx+1.05,cy-.8,'F');else doc.triangle(cx+1.2,cy,cx-.8,cy-1.05,cx-.8,cy+1.05,'F')};
 const list=finalOrder(),sc=scope(),scIn=sc.filter(i=>!isOut(i.id)),d=envData(),th=themesRanked(scIn).filter(t=>t.score>0);
 /* ---- masthead ---- */
 font('sans','bold',6.6,META);doc.text(clean(`WEEKLY BRIEF · CONFIDENTIAL · PREPARED FOR ${c.name.toUpperCase()}`),M,M-2,{baseline:'top',charSpace:.25});
 doc.text(clean(`Curated by ${CONSULTANCY}`),W-M,M-2,{baseline:'top',align:'right'});
 font('serifD','normal',33,INK);doc.text(clean('Monday’s Crisis Brief'),W/2,M+5,{baseline:'top',align:'center'});
 font('serif','italic',11,META);doc.text(clean(`SSM / Euro area edition · The ${c.name} edition`),W/2,M+19,{baseline:'top',align:'center'});
 doc.setFillColor(...acc);doc.rect(M,M+27,CW,1.1,'F');doc.setDrawColor(...INK);doc.setLineWidth(.25);doc.line(M,M+29.2,W-M,M+29.2);
 font('sans','bold',7.4,INK);doc.text(clean(dateLong(EDITION)),M,M+31.6,{baseline:'top'});
 font('sans','normal',7.4,META);doc.text(clean(`${scIn.length} official publications in scope · ${list.length} selected · v0 mockup`),W/2,M+31.6,{baseline:'top',align:'center'});
 font('sans','bold',7.4,INK);doc.text(clean(`Prepared by: ${e.prep||'Supervisory Affairs'}`),W-M,M+31.6,{baseline:'top',align:'right'});
 doc.setDrawColor(200,195,187);doc.setLineWidth(.2);doc.line(M,M+36.6,W-M,M+36.6);
 /* ---- cover: environment + attention box ---- */
 let y=M+42;const bw2=66,bx=W-M-bw2;
 font('sans','bold',6.8,acc);doc.text('THE SUPERVISORY ENVIRONMENT',M,y,{baseline:'top',charSpace:.3});
 if(d.edited){const lw=doc.getTextWidth('THE SUPERVISORY ENVIRONMENT')+27*.3+5;font('sans','bold',6.2,META);doc.text('EDITED BY EDITOR',M+lw,y+.3,{baseline:'top',charSpace:.2})}
 const bh=56;doc.setDrawColor(...INK);doc.setLineWidth(.3);doc.rect(bx,y,bw2,bh);
 font('sans','bold',5.8,META);doc.text('SUPERVISORY ATTENTION LEVEL',bx+4,y+3.5,{baseline:'top',charSpace:.2});
 doc.setDrawColor(225,220,212);doc.setLineWidth(.15);doc.line(bx+4,y+8,bx+bw2-4,y+8);
 font('serif','bold',19,LVR[d.lvlEff]);doc.text(LEVELS[d.lvlEff],bx+4,y+10.5,{baseline:'top'});
 font('sans','normal',6,META);doc.text(d.lvlEff!==d.lvl?`set by editor (auto ${LEVELS[d.lvl]})`:'automatic',bx+bw2-4,y+14,{baseline:'top',align:'right'});
 const cw=(bw2-8-3)/4;LEVELS.forEach((l,k)=>{doc.setFillColor(...(k<=d.lvlEff?LVR[k]:[231,226,217]));doc.rect(bx+4+k*(cw+1),y+20,cw,2.2,'F');font('sans','normal',5.2,META);doc.text(l,bx+4+k*(cw+1),y+23.6,{baseline:'top'})});
 {const n=(g,l)=>scIn.filter(i=>(g==='all'||groupOf(i)===g)&&(l==='all'||critOf(i)===l)).length;const x0=bx+4,lw=24,cw2=(bw2-8-lw)/5;let my=y+29;
  font('sans','bold',5.2,META);doc.text('PUBLICATIONS',x0,my,{baseline:'top',charSpace:.15});
  ['CRIT.','HIGH','WATCH','LOW','TOTAL'].forEach((t,k)=>{font('sans','bold',5.2,k<4?CR[k]:INK);doc.text(t,x0+lw+cw2*k+cw2/2,my,{baseline:'top',align:'center',charSpace:.1})});
  my+=3.4;doc.setDrawColor(...INK);doc.setLineWidth(.25);doc.line(x0,my,bx+bw2-4,my);
  [...PGROUP.map(g=>[g[0],g[1]]),['all','Total']].forEach(([g,lab])=>{if(g==='all'){doc.setDrawColor(...INK);doc.setLineWidth(.25);doc.line(x0,my,bx+bw2-4,my)}
   font('sans','bold',5.8,INK);doc.text(clean(lab),x0,my+1.1,{baseline:'top'});
   [0,1,2,3,'all'].forEach((l,k)=>{const v=n(g,l);font('serif',v&&(l===0||g==='all'||l==='all')?'bold':'normal',7.6,v?(l===0?CR[0]:INK):[190,184,175]);doc.text(v?String(v):'–',x0+lw+cw2*k+cw2/2,my+.5,{baseline:'top',align:'center'})});
   my+=4.1;if(g!=='all'){doc.setDrawColor(225,220,212);doc.setLineWidth(.15);doc.line(x0,my,bx+bw2-4,my)}})}
 const vw=CW-bw2-9;let vy=y+5.5,VS=18;font('serif','bold',VS,INK);let vl=doc.splitTextToSize(clean(d.h),vw);if(vl.length>4){VS=15;font('serif','bold',VS,INK);vl=doc.splitTextToSize(clean(d.h),vw)}
 vl.forEach(ln=>{doc.text(ln,M,vy,{baseline:'top'});vy+=lh(VS,1.12)});vy+=1.5;
 font('serif','normal',9.2,[60,57,52]);doc.splitTextToSize(clean(d.s),vw).forEach(ln=>{doc.text(ln,M,vy,{baseline:'top'});vy+=lh(9.2,1.38)});vy+=1.5;
 /* signals omitted in PDF: the priorities table carries them */
 y=Math.max(vy,y+bh)+4;
 /* SSM priorities status + follow-up */
 doc.setDrawColor(...INK);doc.setLineWidth(.25);doc.line(M,y,W-M,y);font('sans','bold',6.8,acc);doc.text('SSM PRIORITIES 2026–28 · STATUS & FOLLOW-UP',M,y+2.6,{baseline:'top',charSpace:.3});
 font('sans','normal',6,META);doc.text(clean('Attention Index 0-100 · follow-up trail: plan → data → findings → remediation → next'),W-M,y+2.8,{baseline:'top',align:'right'});y+=8;
 {const cx=[M,M+52,M+76,M+112],stw=7;font('sans','bold',5.4,META);['KEY CONCERN','INDEX','FOLLOW-UP TRAIL','NEXT CHECKPOINT'].forEach((t,k)=>doc.text(t,cx[k],y,{baseline:'top',charSpace:.15}));y+=3.2;
  PRIOS.forEach(P=>{const ps=psai(P.id,scIn),pc=hexRgb(P.id==='p1'?'#9A3412':'#1F3A5F');doc.setFillColor(...pc);doc.rect(M,y,CW,5,'F');
   font('sans','bold',6.6,[255,255,255]);doc.text(clean(`${P.p.toUpperCase()} · ${P.short.toUpperCase()}`),M+2,y+1.3,{baseline:'top',charSpace:.15});
   font('sans','bold',6.6,[255,255,255]);doc.text(clean(`Index ${ps.score} · ${TREND[ps.trend].n}`),W-M-2,y+1.3,{baseline:'top',align:'right'});y+=6.4;
   P.vs.forEach(v=>{const vs=vsai(v.id,scIn),nx=v.fu.next;
    font('sans','bold',6.6,pc);doc.text(v.code,cx[0],y,{baseline:'top'});font('serif','bold',8.4,INK);doc.text(clean(v.short),cx[0]+8,y-.3,{baseline:'top'});
    font('sans','normal',5.6,META);doc.splitTextToSize(clean(cap(v.hook)),43).slice(0,2).forEach((ln,q)=>doc.text(ln,cx[0]+8,y+3.4+q*2.3,{baseline:'top'}));
    doc.setFillColor(236,232,225);doc.rect(cx[1],y+1.2,14,1.4,'F');doc.setFillColor(...acc);doc.rect(cx[1],y+1.2,14*vs.score/100,1.4,'F');font('serif','bold',9,acc);doc.text(String(vs.score),cx[1]+16,y,{baseline:'top'});
    FU_STEPS.forEach(([k,n],q)=>{const ss=fuSt(v.fu[k]),col=hexRgb(FU_ST[ss][1]),x=cx[2]+q*stw;if(ss==='upcoming'){doc.setDrawColor(...col);doc.setLineWidth(.4);doc.circle(x+1.6,y+1.8,1.3,'S')}else{doc.setFillColor(...col);doc.circle(x+1.6,y+1.8,1.5,'F')}
     if(q<4){doc.setDrawColor(200,195,187);doc.setLineWidth(.2);doc.line(x+3.4,y+1.8,x+stw-.2,y+1.8)}font('sans','normal',4.6,META);doc.text(['Plan','Data','Find.','Rem.','Next'][q],x+1.6,y+4,{baseline:'top',align:'center'})});
    const ns=fuSt(nx);font('sans','bold',7,ns==='overdue'?CR[0]:INK);const dl=clean(fuDate(nx)+(nx.ill?' (illustr.)':''));doc.text(dl,cx[3],y,{baseline:'top'});
    const dw=doc.getTextWidth(dl);if(nx.iso&&daysTo(nx.iso)>=0){font('sans','bold',6,acc);doc.text(`${daysTo(nx.iso)} days`,cx[3]+dw+2,y+.3,{baseline:'top'})}
    font('serif','normal',7.4,INK);doc.splitTextToSize(clean(nx.t),W-M-cx[3]).slice(0,2).forEach((ln,q)=>doc.text(ln,cx[3],y+3.1+q*2.8,{baseline:'top'}));
    const ov=FU_STEPS.find(([k])=>fuSt(v.fu[k])==='overdue');if(ov){font('sans','bold',5.8,CR[0]);doc.text(doc.splitTextToSize(clean('OVERDUE, ENFORCED: '+(v.fu[ov[0]].sh||v.fu[ov[0]].t)),CW-10)[0],cx[0]+8,y+8.6,{baseline:'top'});y+=2.8}
    y+=10.2;doc.setDrawColor(230,226,218);doc.setLineWidth(.15);doc.line(M,y-1.2,W-M,y-1.2)});y+=1});
  let lx=M;font('sans','normal',5.6,META);Object.entries(FU_ST).forEach(([k,[n,c0]])=>{doc.setFillColor(...hexRgb(c0));doc.circle(lx+1,y+1,1,'F');doc.text(n,lx+3,y,{baseline:'top'});lx+=doc.getTextWidth(n)+8});
  doc.text('Status computed from public sources at the edition date; not an assessment of the bank.',W-M,y,{baseline:'top',align:'right'});y+=6}
 /* Rising / Persistent / Cooling */
 doc.setDrawColor(...INK);doc.setLineWidth(.25);doc.line(M,y,W-M,y);font('sans','bold',6.8,INK);doc.text('THEMES · SUPERVISORY ATTENTION INDEX',M,y+2.6,{baseline:'top',charSpace:.3});
 font('sans','normal',6,META);doc.text('0-100 · illustrative weights v0',W-M,y+2.8,{baseline:'top',align:'right'});y+=8;
 {const grp=['rising','persistent','cooling'],tw=(CW-12)/3;let ys=[y,y,y];grp.forEach((g,k)=>{const x=M+k*(tw+6),tl=th.filter(t=>t.trend===g),col=hexRgb(TREND[g].col);
  doc.setFillColor(...col);tri(x+1.2,ys[k]+1.4,g);font('sans','bold',7,col);doc.text(TREND[g].n.toUpperCase(),x+4,ys[k],{baseline:'top',charSpace:.2});ys[k]+=5;
  if(!tl.length){font('sans','normal',7,META);doc.text('No theme in this group',x,ys[k],{baseline:'top'});ys[k]+=4}
  tl.slice(0,y>200?3:4).forEach(t=>{font('serif','bold',9.4,INK);doc.text(clean(t.s),x,ys[k],{baseline:'top'});font('serif','bold',11,acc);doc.text(String(t.score),x+tw,ys[k]-.4,{baseline:'top',align:'right'});
   sparkPdf(t.pts,x+tw-22,ys[k]+.4,10,3,col);
   doc.setFillColor(236,232,225);doc.rect(x,ys[k]+4.6,tw,1,'F');doc.setFillColor(...acc);doc.rect(x,ys[k]+4.6,tw*t.score/100,1,'F');
   font('sans','normal',6.2,META);doc.text(clean(`${t.ps.length} pubs · ${t.bodies.map(b=>BODY[b].s).join(', ')}`),x,ys[k]+6.6,{baseline:'top'});ys[k]+=11});});y=Math.max(...ys)+1}
 L={top:y,y,x:M,w:CW,n:1,ci:0,gap:7,maxY:y};
 if(e.cover&&e.cover.trim()){need(22);doc.setDrawColor(...INK);doc.setLineWidth(.25);doc.line(M,L.y,W-M,L.y);adv(3.5);label('From the editor',acc);para(e.cover,'serif','italic',10,INK,1.4);adv(2)}
 /* ---- page 2: convergence, G-SIB implications, questions ---- */
 if(doc.getNumberOfPages()===1)newPage();else adv(4);
 section('SSM priority follow-up trails','Planned OSIs / reviews → data request → findings → remediation ask → next checkpoint');
 cols(2);
 VULNS.forEach(v=>{need(34);const pc=hexRgb(v.pid==='p1'?'#9A3412':'#1F3A5F');font('sans','bold',6.6,pc);doc.text(clean(`${v.code} · ${v.P.short.toUpperCase()}`),L.x,L.y,{baseline:'top',charSpace:.15});
  font('serif','bold',8,acc);doc.text(`Index ${vsai(v.id,scIn).score}`,L.x+L.w,L.y-.4,{baseline:'top',align:'right'});adv(3.6);
  para(v.v,'serif','bold',9.6,INK,1.22);adv(.6);
  FU_STEPS.forEach(([k,n])=>{const st=v.fu[k],ss=fuSt(st),col=hexRgb(FU_ST[ss][1]);font('serif','normal',7.6,INK);const tl=doc.splitTextToSize(clean(st.t),L.w-30);need(tl.length*lh(7.6,1.3)+2.8);
   doc.setFillColor(...col);doc.circle(L.x+1,L.y+1.2,.9,'F');font('sans','bold',5.6,INK);doc.text(clean(n.toUpperCase()),L.x+3,L.y+.3,{baseline:'top',charSpace:.1});
   font('sans','bold',5.4,col);doc.text(clean(ss==='overdue'&&k==='rem'?'OVERDUE · ENFORCED':FU_ST[ss][0].toUpperCase()),L.x+3,L.y+2.6,{baseline:'top',charSpace:.1});
   font('serif','normal',7.6,INK);tl.forEach((ln,q)=>doc.text(ln,L.x+30,L.y+q*lh(7.6,1.3),{baseline:'top'}));
   let yy=L.y+tl.length*lh(7.6,1.3);font('sans','normal',5.8,META);const meta=clean(`${fuDate(st)}${st.ill?' · illustrative':''}`);doc.text(meta,L.x+30,yy,{baseline:'top'});
   if(st.src){const mw=doc.getTextWidth(meta+'  ');font('sans','normal',5.8,acc);doc.textWithLink(`[${st.src}]`,L.x+30+mw,yy,{url:BYID[st.src].url,baseline:'top'})}
   adv(Math.max(5.2,tl.length*lh(7.6,1.3)+3))});adv(1.5);rule([200,195,187],.2,3.5)});
 para('Steps cite official sources. "Illustrative" marks the usual supervisory sequence where timing or form is not public. "Overdue" means a public supervisory deadline passed and enforcement followed; it is not an assessment of the client.','sans','normal',6.4,META,1.4);adv(3);
 /* three things */
 cols(1);need(60);y=L.y;font('sans','bold',6.8,INK);doc.text('THREE THINGS TO KNOW · THROUGH THE SSM PRIORITIES',M,y,{baseline:'top',charSpace:.3});y+=5;
 {const tw=(CW-12)/3;let ys=[y,y,y];d.tk.forEach((t,k)=>{const x=M+k*(tw+6),i=t.i;font('serif','bold',17,acc);doc.text(String(k+1),x,ys[k]-1,{baseline:'top'});
  font('serif','normal',8.8,INK);const ll=doc.splitTextToSize(clean(t.t),tw-7);(ll.length>8?[...ll.slice(0,7),ll[7].replace(/\s*\S*$/,'…')]:ll).forEach((ln,j)=>doc.text(ln,x+7,ys[k]+j*lh(8.8,1.34),{baseline:'top'}));ys[k]+=Math.min(ll.length,8)*lh(8.8,1.34)+1.2;
  {const pt=prOf(i);if(pt.length){font('sans','bold',6,hexRgb(pt[0].startsWith('p1')?'#9A3412':'#1F3A5F'));doc.text(clean(pt.length>2?'ALL SSM PRIORITIES':pt.map(v=>VBY[v].code+' '+VBY[v].short).join(' + ').toUpperCase()),x+7,ys[k],{baseline:'top',charSpace:.1});ys[k]+=3.4}}font('sans','bold',6,CR[critOf(i)]);doc.text(CRIT[critOf(i)].toUpperCase(),x+7,ys[k],{baseline:'top',charSpace:.15});font('sans','normal',6.2,META);{const mx=x+7+doc.getTextWidth(CRIT[critOf(i)].toUpperCase())+3.5;font('sans','normal',6.2,META);doc.text(doc.splitTextToSize(clean(`${BODY[i.b].s} · ${shortPub(i)}${i.due?' · due '+dShort(i.due).replace(/ \d{4}$/,''):''}`),tw-(mx-x))[0],mx,ys[k],{baseline:'top'})}ys[k]+=4;
  doc.textWithLink(clean('Source'),x+7,ys[k],{url:i.url,baseline:'top'});ys[k]+=3});y=Math.max(...ys)+3}
 L.y=L.maxY=y;L.top=y;

 section('Convergence & implications',`Themes where two or more authorities are pulling in the same direction`);
 const conv=th.filter(t=>t.bodies.length>=2);
 cols(2);
 conv.forEach(t=>{const ed=THEME_ED[t.id],o=sayDo(t.id,scIn);need(30);
  font('serif','bold',11.5,INK);doc.text(clean(t.n),L.x,L.y,{baseline:'top'});adv(lh(11.5,1.2));
  font('sans','bold',6.4,hexRgb(TREND[t.trend].col));doc.text(clean(`${TREND[t.trend].n.toUpperCase()} · INDEX ${t.score} · ${t.bodies.map(b=>BODY[b].s).join(' + ')}`),L.x,L.y,{baseline:'top',charSpace:.15});adv(4);
  font('sans','normal',6.2,META);doc.text(clean('Say vs Do: '+SD.map(([k,n])=>`${n} ${o[k].length}`).join(' · ')+' · '+gapOf(t.id,scIn)),L.x,L.y,{baseline:'top'});adv(4);
  para(ed.mean,'serif','normal',8.6,INK,1.38);adv(.8);
  if(c.gsib){label('G-SIB implication',acc,6);para(ed.gsib,'serif','normal',8.6,INK,1.38);adv(.8)}
  label('Likely supervisor questions',META,6);ed.q.forEach(q=>para('“'+q+'”','serif','italic',8.4,[60,57,52],1.36,0,2));adv(1.5);rule([210,205,197],.2,3.5)});
 /* emerging */
 label('Emerging themes · editor review',[138,106,31]);
 EMERGING.forEach(em=>{const ev=em.ev.map(id=>BYID[id]).filter(Boolean);para(`${em.n}: ${em.note} (${ev.map(i=>i.id).join(', ')})`,'serif','normal',8.2,INK,1.36);adv(.8)});
 /* ---- calendar ---- */
 section('Calendar · what is coming','Consultation → reply deadline → final rule → implementation');
 const dd=datedItems().filter(x=>daysTo(x.iso)>=0);
 cols(1);
 dd.forEach(x=>{need(6);font('sans','bold',7.6,acc);doc.text(clean(dShort(x.iso)),M,L.y,{baseline:'top'});font('sans','normal',6.6,META);doc.text(clean(`${daysTo(x.iso)} days`),M,L.y+3.2,{baseline:'top'});
  font('sans','bold',6.6,INK);doc.text(clean(`${BODY[x.i.b].s} · ${x.k}`.toUpperCase()),M+26,L.y,{baseline:'top',charSpace:.1});font('serif','normal',8.6,INK);const hl=doc.splitTextToSize(clean(x.i.h),CW-26);hl.slice(0,2).forEach((ln,k)=>doc.text(ln,M+26,L.y+3.3+k*3.6,{baseline:'top'}));adv(4+Math.min(hl.length,2)*3.6);doc.setDrawColor(225,220,212);doc.setLineWidth(.15);doc.line(M,L.y,W-M,L.y);adv(1.5)});
 adv(2);label('Regulatory pipeline',INK);
 {const cw3=[46,26,26,30,CW-128];const hd=['Instrument','Consultation','Reply','Final rule','Implementation'];need(8);let x=M;hd.forEach((h,k)=>{font('sans','bold',5.8,META);doc.text(h.toUpperCase(),x,L.y,{baseline:'top',charSpace:.15});x+=cw3[k]});adv(3.6);doc.setDrawColor(...INK);doc.setLineWidth(.25);doc.line(M,L.y,W-M,L.y);adv(1.2);
  PIPE.filter(p=>p.j==='ea').forEach(p=>{const cells=[p.inst,p.stages.cons,p.stages.reply,p.stages.fin,p.stages.impl],ks=['inst','cons','reply','fin','impl'];font('sans','normal',6.6,INK);const ls=cells.map((t,k)=>doc.splitTextToSize(clean(t),cw3[k]-2.5));const hh=Math.max(...ls.map(l=>l.length))*2.9+1.6;need(hh);let x=M;
   ls.forEach((l,k)=>{const cur=ks[k]===p.cur;font('sans',k===0||cur?'bold':'normal',6.6,cur?acc:INK);l.forEach((ln,j)=>doc.text(ln,x,L.y+j*2.9,{baseline:'top'}));x+=cw3[k]});adv(hh);doc.setDrawColor(225,220,212);doc.setLineWidth(.15);doc.line(M,L.y,W-M,L.y);adv(1.2)});
  font('sans','normal',5.8,META);need(4);doc.text('Current stage in red. "tbc" = not yet set by the authority. Dates as stated in official sources.',M,L.y,{baseline:'top'});adv(4)}
 /* ---- priorities & ground truth ---- */
 section('Supervisory priorities & ground truth','SSM priorities 2026–28 · what inspections and exercises found');
 cols(2);
 PRIOS.forEach(p=>{label(p.p,acc);para(p.t,'serif','bold',9.6,INK,1.3);adv(1);p.vs.forEach(v=>{para('• '+v.v,'serif','normal',8.4,INK,1.35);para(v.acts.slice(0,2).join('; '),'sans','normal',6.6,META,1.35,0,3);adv(.8)});adv(2)});
 label('Ground truth',INK);GROUND.forEach(g=>{const i=BYID[g.src];para(g.t,'serif','normal',8.4,INK,1.36);font('sans','normal',6.2,acc);need(3.4);doc.textWithLink(clean(`${BODY[i.b].s} · ${pubLab(i)} [${i.id}]`),L.x,L.y,{url:i.url,baseline:'top'});adv(4.2)});
 /* ---- selected publications ---- */
 section('Selected publications',`${list.length} chosen by the editor · fixed extraction schema · cited`);
 cols(2);
 list.forEach((i,k)=>{const l=critOf(i);font('serif','bold',11.4,INK);const hl=doc.splitTextToSize(clean(i.h),L.w);need(6+hl.length*lh(11.4,1.16)+14);
  font('sans','bold',6.2,[255,255,255]);const bt=CRIT[l].toUpperCase(),bw=doc.getTextWidth(bt)+bt.length*.15+3.2;doc.setFillColor(...CR[l]);doc.rect(L.x,L.y,bw,3.6,'F');doc.text(bt,L.x+1.6,L.y+.75,{baseline:'top',charSpace:.15});
  font('sans','bold',6.2,acc);doc.text(clean(`${k+1} · ${BODY[i.b].s} · ${PTYPE[i.type]} · ${TH[i.themes[0]].s}`.toUpperCase()),L.x+bw+2,L.y+.75,{baseline:'top',charSpace:.15});adv(5.2);
  font('serif','bold',11.4,INK);hl.forEach(ln=>{doc.text(ln,L.x,L.y,{baseline:'top'});adv(lh(11.4,1.16))});adv(1);
  para(`${BODY[i.b].n} · ${pubLab(i)}${i.due?' · reply/submission '+dShort(i.due):''}${i.eff?' · effective '+(/^\d{4}-\d{2}-\d{2}$/.test(i.eff)?dShort(i.eff):i.eff):''}`,'sans','normal',6.6,META,1.4);
  if(critEd(i))para(`Adjusted by supervisory manager: ${CRIT[A(i).lvl]} to ${CRIT[l]}`,'sans','bold',6.6,acc,1.4);
  adv(.8);para(i.sum,'serif','normal',8.6,INK,1.38);adv(1);
  label(`Why it matters for ${c.short}`,acc,6);para(i.why,'serif','normal',8.6,INK,1.38);adv(1);
  label('Extraction · schema v0',META,6);
  SD.forEach(([kk,n])=>{if(!(i.sd&&i.sd[kk]))return;const lw=24;font('serif','normal',7.6,INK);const tl=doc.splitTextToSize(clean(i.sd[kk]),L.w-lw-1);need(tl.length*lh(7.6,1.32)+.6);font('sans','bold',5.8,INK);doc.splitTextToSize(clean(n),lw-2).forEach((ln,j)=>doc.text(ln,L.x,L.y+.4+j*2.4,{baseline:'top'}));font('serif','normal',7.6,INK);tl.forEach(ln=>{doc.text(ln,L.x+lw,L.y,{baseline:'top'});adv(lh(7.6,1.32))});adv(.6)});
  const note=(st(i.id).note||'').trim();if(note){font('serif','italic',8.4);const nl=doc.splitTextToSize(clean(note),L.w-6),h=nl.length*lh(8.4,1.4)+8;need(h);
   doc.setFillColor(...mix(c.accent,.07));doc.rect(L.x,L.y,L.w,h,'F');doc.setFillColor(...acc);doc.rect(L.x,L.y,.8,h,'F');
   font('sans','bold',6.2,acc);doc.text("EDITOR'S NOTE",L.x+3,L.y+2,{baseline:'top',charSpace:.25});font('serif','italic',8.4,INK);nl.forEach((ln,j)=>doc.text(ln,L.x+3,L.y+5.4+j*lh(8.4,1.4),{baseline:'top'}));adv(h+2)}
  font('sans','bold',6.8,INK);need(4);doc.text('Source: ',L.x,L.y,{baseline:'top'});font('sans','normal',6.8,acc);doc.textWithLink(clean(`[${i.id}] ${BODY[i.b].s}, ${pubLab(i)}`),L.x+doc.getTextWidth('Source: ')+1,L.y,{url:i.url,baseline:'top'});adv(4.2);
  adv(1.5);rule([200,195,187],.2,4)});
 /* ---- sources ---- */
 section('Sources','Every claim in this brief is cited to an official public document');
 cols(1);
 const used=[...new Set([...list,...d.tk.map(t=>t.i),...th.flatMap(t=>t.ps)].map(i=>i.id))].map(id=>BYID[id]).sort((a,b)=>a.id.localeCompare(b.id));
 used.forEach(i=>{font('sans','bold',6.6,INK);const pre=`[${i.id}]`;need(7);doc.text(pre,M,L.y,{baseline:'top'});font('sans','normal',6.6,INK);const tl=doc.splitTextToSize(clean(`${BODY[i.b].n}, “${i.h}”, ${pubLab(i)}.`),CW-12);tl.forEach((ln,k)=>doc.text(ln,M+12,L.y+k*2.9,{baseline:'top'}));adv(tl.length*2.9);
  font('sans','normal',6,acc);const u=i.url.length>120?i.url.slice(0,118)+'…':i.url;doc.textWithLink(clean(u),M+12,L.y,{url:i.url,baseline:'top'});adv(3.6)});
 adv(3);label('Method',META);
 para(`Detect: official publications from ECB Banking Supervision, ECB, EBA, ESRB and euro-area NCAs (v1 scope: SSM / euro area). Filter: relevance to ${c.name} by presence and status. Judge: automatic criticality from severity, explicitness, deadlines and supervisory action; the editor can override, and overrides are marked. Supervisory Attention Index = Authority, Explicitness, Recency, Repetition, Supervisory action and Cross-body convergence; weights are illustrative in v0. Extraction follows a fixed schema with a citation for each field; fields are paraphrased and require editor review.`,'sans','normal',7,META,1.4);
 adv(2);para(`v0 mockup · SSM focus · mix of live titles and illustrative Attention Index. External public sources only; no internal bank data. Pitch mockup prepared by ${CONSULTANCY}; not affiliated with or endorsed by ${c.name}. Not legal or regulatory advice.`,'sans','bold',7,INK,1.4);
 gutter();
 const np=doc.getNumberOfPages();for(let p=1;p<=np;p++){doc.setPage(p);doc.setDrawColor(200,195,187);doc.setLineWidth(.2);doc.line(M,H-12.5,W-M,H-12.5);font('sans','normal',6.6,META);
  doc.text(clean(`Official public sources only · v0 mockup, illustrative index · Pitch by ${CONSULTANCY}, not affiliated with ${c.name}`),M,H-11,{baseline:'top'});doc.text(`Page ${p} of ${np}`,W-M,H-11,{baseline:'top',align:'right'})}
 doc.setProperties({title:`Monday’s Crisis Brief — SSM / Euro area edition · ${c.name}`,author:e.prep||'Supervisory Affairs',creator:`Crisis Radar · ${CONSULTANCY}`,subject:'Monday’s Crisis Brief'});
 return doc}
function printEdition(){const c=C(),e=E(),l=finalOrder(),ev=envData();
 $('#print-root').innerHTML=`<div class="pe"><div class="mh"><small>Weekly brief · Prepared for ${esc(c.name)} · Curated by ${CONSULTANCY}</small><h1>Monday Supervisory Radar</h1><em>SSM / Euro area edition</em></div>
 <div class="dl2"><b>${dateLong(EDITION)}</b><span>${l.length} publications</span><b>Prepared by: ${esc(e.prep)}</b></div><h2>${esc(ev.h)}</h2><p class="cn">${esc(ev.s)}</p>${e.cover?`<p class="cn">${esc(e.cover)}</p>`:''}
 <div class="cols">${l.map((i,k)=>`<div class="st"><div class="k" style="color:${c.accent}">${k+1} · ${CRIT[critOf(i)]} · ${esc(BODY[i.b].s)} · ${esc(PTYPE[i.type])}</div><h2>${esc(i.h)}</h2><div class="mt">${esc(pubLab(i))}${i.due?' · reply '+esc(dShort(i.due)):''}</div><p>${esc(i.sum)}</p><p><b>Why it matters for ${esc(c.name)}:</b> ${esc(i.why)}</p>${st(i.id).note?`<p><i>Editor’s note: ${esc(st(i.id).note)}</i></p>`:''}<div class="mt">Source: ${esc(i.url)}</div></div>`).join('')}</div>
 <div class="mt">Official public sources only · v0 mockup · not affiliated with ${esc(c.name)}.</div></div>`;
 window.print()}
</script>
</body></html>
