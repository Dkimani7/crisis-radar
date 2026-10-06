<script>
/* ============ CONFIG (white-label) ============ */
const CONSULTANCY='Northbridge Risk Advisory';
const SNAP=Date.now();
const SNAP_LABEL=(()=>{const d=new Date(SNAP),p=n=>String(n).padStart(2,'0');return `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]} ${p(d.getDate())} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`})();
const CLIENTS={
 santander:{id:'santander',name:'Banco Santander',short:'Santander',type:'Spanish G-SIB · SSM significant institution',logo:'BS',accent:'#EC0000',deep:'#CC0000',real:1,gsib:1,
  presence:['ES','PT','DE','AT','BE','FI','FR','IT','NL'],core:['ES','PT','DE']},
 albion:{id:'albion',name:'Albion Strand Bank',short:'Albion Strand',type:'UK high-street bank (demo)',logo:'AS',accent:'#8A1C4A',deep:'#6E153B',gsib:0,presence:['IE'],core:['IE']},
 altamar:{id:'altamar',name:'Altamar Financiero',short:'Altamar',type:'LatAm-focused bank (demo)',logo:'AF',accent:'#D9480F',deep:'#B83C0C',gsib:0,presence:['ES'],core:['ES']}
};

/* ============ UNIVERSE: jurisdictions & bodies (v1 content = euro area / SSM only) ============ */
const JURS=[
 {id:'global',n:'Global',v1:0,bodies:['bcbs','fsb','bis']},
 {id:'ea',n:'Euro area (SSM)',v1:1,bodies:['ssm','ecb','eba','esrb','srb','amla','nca']},
 {id:'uk',n:'UK',v1:0,bodies:['pra','fca']},
 {id:'us',n:'US',v1:0,bodies:['fed','occ','fdic']},
 {id:'apac',n:'Asia-Pac',v1:0,bodies:['apra','mas','hkma','jfsa']},
 {id:'ca',n:'Canada',v1:0,bodies:['osfi']},
 {id:'ch',n:'Switzerland',v1:0,bodies:['finma']}
];
const BODY={
 ssm:{n:'ECB Banking Supervision (SSM)',s:'SSM',j:'ea',w:1.0,u:'https://www.bankingsupervision.europa.eu'},
 ecb:{n:'European Central Bank',s:'ECB',j:'ea',w:0.95,u:'https://www.ecb.europa.eu'},
 eba:{n:'European Banking Authority',s:'EBA',j:'ea',w:0.9,u:'https://www.eba.europa.eu',note:'EU-wide; applies across the euro area'},
 esrb:{n:'European Systemic Risk Board',s:'ESRB',j:'ea',w:0.85,u:'https://www.esrb.europa.eu',note:'EU-wide macroprudential'},
 srb:{n:'Single Resolution Board',s:'SRB',j:'ea',w:0.8,u:'https://www.srb.europa.eu'},
 amla:{n:'Anti-Money Laundering Authority',s:'AMLA',j:'ea',w:0.8,u:'https://www.amla.europa.eu'},
 nca:{n:'Euro-area national authorities',s:'NCAs',j:'ea',w:0.6,u:'https://www.bankingsupervision.europa.eu/about/thessm/html/index.en.html'},
 bde:{n:'Banco de España',s:'BdE',j:'ea',w:0.65,u:'https://www.bde.es',nca:'ES'},
 bdf:{n:'Banque de France / ACPR',s:'BdF',j:'ea',w:0.6,u:'https://www.banque-france.fr',nca:'FR'},
 bcbs:{n:'Basel Committee (BCBS)',s:'BCBS',j:'global',w:0.9,u:'https://www.bis.org/bcbs/'},
 fsb:{n:'Financial Stability Board',s:'FSB',j:'global',w:0.9,u:'https://www.fsb.org'},
 bis:{n:'Bank for International Settlements',s:'BIS',j:'global',w:0.7,u:'https://www.bis.org'},
 pra:{n:'Prudential Regulation Authority',s:'PRA',j:'uk',w:0.9,u:'https://www.bankofengland.co.uk/prudential-regulation'},
 fca:{n:'Financial Conduct Authority',s:'FCA',j:'uk',w:0.85,u:'https://www.fca.org.uk'},
 fed:{n:'Federal Reserve',s:'Fed',j:'us',w:0.9,u:'https://www.federalreserve.gov'},
 occ:{n:'Office of the Comptroller of the Currency',s:'OCC',j:'us',w:0.85,u:'https://www.occ.gov'},
 fdic:{n:'FDIC',s:'FDIC',j:'us',w:0.8,u:'https://www.fdic.gov'},
 apra:{n:'APRA',s:'APRA',j:'apac',w:0.85,u:'https://www.apra.gov.au'},
 mas:{n:'Monetary Authority of Singapore',s:'MAS',j:'apac',w:0.85,u:'https://www.mas.gov.sg'},
 hkma:{n:'Hong Kong Monetary Authority',s:'HKMA',j:'apac',w:0.85,u:'https://www.hkma.gov.hk'},
 jfsa:{n:'Japan FSA',s:'JFSA',j:'apac',w:0.85,u:'https://www.fsa.go.jp'},
 osfi:{n:'OSFI',s:'OSFI',j:'ca',w:0.85,u:'https://www.osfi-bsif.gc.ca'},
 finma:{n:'FINMA',s:'FINMA',j:'ch',w:0.85,u:'https://www.finma.ch'}
};
/* Euro area = SSM participating countries (21 from 1 Jan 2026). NCA names are public. */
const EA=[
 ['AT','Austria','FMA / OeNB'],['BE','Belgium','National Bank of Belgium'],['BG','Bulgaria','Bulgarian National Bank'],['HR','Croatia','Hrvatska narodna banka'],
 ['CY','Cyprus','Central Bank of Cyprus'],['EE','Estonia','Finantsinspektsioon'],['FI','Finland','FIN-FSA'],['FR','France','ACPR / Banque de France'],
 ['DE','Germany','BaFin / Deutsche Bundesbank'],['GR','Greece','Bank of Greece'],['IE','Ireland','Central Bank of Ireland'],['IT','Italy','Banca d’Italia'],
 ['LV','Latvia','Latvijas Banka'],['LT','Lithuania','Lietuvos bankas'],['LU','Luxembourg','CSSF'],['MT','Malta','MFSA'],['NL','Netherlands','De Nederlandsche Bank'],
 ['PT','Portugal','Banco de Portugal'],['SK','Slovakia','Národná banka Slovenska'],['SI','Slovenia','Banka Slovenije'],['ES','Spain','Banco de España']
].map(([c,n,nca])=>({c,n,nca}));
const EA_BY=Object.fromEntries(EA.map(x=>[x.c,x]));
/* ISO numeric (world-atlas ids) → ISO2 */
const ISO_N={'040':'AT','056':'BE','100':'BG','191':'HR','196':'CY','233':'EE','246':'FI','250':'FR','276':'DE','300':'GR','372':'IE','380':'IT','428':'LV','440':'LT','442':'LU','470':'MT','528':'NL','620':'PT','703':'SK','705':'SI','724':'ES'};

/* ============ TAXONOMY ============ */
const PTYPE={speech:'Speech',blog:'Blog',pr:'Press release',consult:'Consultation',guideline:'Guideline',stress:'Stress test',enforce:'Enforcement',priorities:'Priorities',report:'Report / statistics',request:'Supervisory request',guide:'Guide / Q&A',other:'Other'};
/* Exec matrix groups publication types into "what kind of ask" */
const PGROUP=[['action','Supervisory action',['stress','enforce','request']],['rules','Rule-making',['consult','guideline','guide']],['agenda','Agenda & data',['priorities','report','pr','other']],['narr','Narrative',['speech','blog']]];
const CRIT=['Critical','High','Watch','Low'];
const RELV=['High','Medium','Low'];
const LEVELS=['Calm','Elevated','Heightened','Critical'],LVC=['#2F6B4F','#9A6A00','#C2410C','#A30016'];
const SD=[['narr','Narrative','What supervisors say'],['sup','Supervisory activity','Reviews, OSIs, exercises'],['reg','Regulatory activity','Rules, guidelines, ITS'],['def','Observed deficiency','What they found'],['rem','Expected remediation','What banks must do']];
const THEMES=[
 {id:'dora',n:'Cyber & operational resilience / DORA',s:'Cyber / DORA',c:'#C2410C'},
 {id:'tpr',n:'Third-party & outsourcing',s:'Third-party',c:'#57534E'},
 {id:'irrbb',n:'Interest-rate risk / IRRBB',s:'IRRBB',c:'#0E7490'},
 {id:'esg',n:'Climate & ESG',s:'Climate & ESG',c:'#15803D'},
 {id:'consumer',n:'Consumer protection',s:'Consumer',c:'#A16207'},
 {id:'capital',n:'Capital & stress testing',s:'Capital / stress',c:'#1D4ED8'},
 {id:'aml',n:'AML / financial crime',s:'AML',c:'#B91C1C'},
 {id:'ai',n:'AI & data governance (incl. RDARR)',s:'AI & data / RDARR',c:'#6D28D9'},
 {id:'crypto',n:'Crypto / MiCA',s:'Crypto / MiCA',c:'#C2185B'},
 {id:'liq',n:'Liquidity & funding',s:'Liquidity',c:'#0F766E'},
 {id:'gov',n:'Governance & culture',s:'Governance',c:'#1F3A5F'}
];
const TH=Object.fromEntries(THEMES.map(t=>[t.id,t]));

/* Emerging themes: detected outside the fixed taxonomy (editorial in v0) */
const EMERGING=[
 {id:'geo',n:'Geopolitical risk preparedness',ev:['E10','E09'],first:'2026-07-31',note:'Priority 1 of the SSM agenda and the subject of the 2026 thematic reverse stress test.'},
 {id:'frontier',n:'Frontier-AI cyber threat',ev:['E14','E04'],first:'2026-07-07',note:'ESRB warning plus an ECB request for action plans by 31 October 2026.'},
  {id:'cmdi',n:'Supervision–resolution continuum (CMDI)',ev:['E06'],first:'2026-09-22',note:'Reformed CMDI package in the Official Journal since April 2026; stronger ECB early-intervention role.'}
];

/* ============ PUBLICATIONS · fixed extraction schema v0 ============
 Every field is extracted from the cited official source (paraphrased). sd = Say-vs-Do layers present in the document.
 x = explicitness (1 mention · 2 expectation · 3 requirement / deadline). act = supervisory action strength (0 none · 1 review / plan · 2 exercise / OSI · 3 enforcement / binding request).
*/
const INC=[
{id:'E14',b:'esrb',j:'ea',type:'request',date:'2026-07-07',pubLabel:'Warning 25 Jun · published 7 Jul 2026',
 h:'ESRB warns frontier AI models could strain cyber resilience; ECB asks significant banks for action plans by 31 October',
 brief:'ESRB/2026/3 warns that frontier AI models raise systemic cyber risk. It notes that the ECB has asked significant institutions to assess the threat without delay and to develop a comprehensive action plan by 31 October 2026.',
 sum:'The ESRB warning of 25 June 2026 (ESRB/2026/3) addresses systemic cyber risks stemming from frontier artificial intelligence models. Among authorities’ current initiatives, it records that the ECB, as banking supervisor, has requested significant institutions to assess the impact of the evolving threat landscape without delay and to develop, by 31 October 2026, a comprehensive action plan setting out concrete measures to address these risks.',
 why:'As an SSM significant institution, Santander falls within the ECB request. The action plan is due in under four weeks and will likely feed JST dialogue on cyber resilience, third-party dependencies and board oversight.',
 themes:['dora','ai','tpr'],emerg:['frontier'],x:3,act:3,sev:5,rel:95,due:'2026-10-31',eff:null,
 sd:{narr:'Frontier AI models create systemic cyber risk for the EU financial system.',sup:'ECB request to significant institutions to assess the evolving threat landscape.',rem:'Comprehensive action plan with concrete measures, due 31 October 2026.'},
 url:'https://www.esrb.europa.eu/news/pr/date/2026/html/esrb.pr260707~4e1b68241a.en.html',url2:'https://www.esrb.europa.eu/pub/pdf/warnings/esrb.warning260625_on_systemic_cyber_risks_stemming_from_frontier_ai_models%7Eef424708cf.en.pdf',
 cite:{due:'Warning text, recital on current initiatives (PDF)',sd:'Press release + warning PDF'},check:'verified HTTP 200 (press release + PDF); 31 Oct deadline confirmed in PDF text'},
{id:'E10',b:'ssm',j:'ea',type:'stress',date:'2026-07-31',
 h:'ECB publishes results of 2026 geopolitical risk reverse stress test',
 brief:'110 directly supervised banks ran a reverse stress test to a 300bp CET1 depletion. Scenarios were generally meaningful, but the ECB found weaknesses in granularity, solvency–liquidity interaction and the realism of mitigating actions.',
 sum:'Banks were asked to identify plausible geopolitical scenarios severe enough to deplete CET1 by at least 300 basis points. The ECB highlights needed improvements in the granularity and sensitivity of risk assessments, the consistency between scenario narratives and solvency/liquidity impacts, the realism of mitigating actions in systemic crises, and the articulation of solvency–liquidity interactions. Liquidity generally stayed above minimums, but several banks showed only a muted liquidity response; the ECB will follow up with the banks concerned. Results feed SREP and supervisory dialogue.',
 why:'Bank-specific follow-up runs through the JST. Expect challenge on Santander’s ICAAP scenario design, FX liquidity across its multi-currency footprint, and the plausibility of management actions.',
 themes:['capital','liq'],emerg:['geo'],x:2,act:2,sev:4,rel:88,due:null,eff:null,
 sd:{sup:'Thematic reverse stress test of 110 significant institutions.',def:'Weak scenario granularity, inconsistent solvency/liquidity translation, optimistic mitigating actions, muted liquidity response.',rem:'ECB follow-up with banks concerned to improve stress-testing frameworks; results inform SREP.'},
 url:'https://www.bankingsupervision.europa.eu/press/pr/date/2026/html/ssm.pr260731~93964644b0.en.html',url2:'https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.geopolstresstest202608.en.pdf',
 check:'verified HTTP 200 (press release + final results PDF)'},
{id:'E16',b:'eba',j:'ea',type:'consult',date:'2026-07-23',
 h:'EBA consults on Guidelines on investment of DGS available financial means (EBA/CP/2026/12)',
 brief:'Consultation under the revised Deposit Guarantee Schemes Directive to improve depositor protection. Responses are due by 23 October 2026.',
 sum:'The consultation (23 July – 23 October 2026) covers how deposit guarantee schemes invest their available financial means. Contributions are published after the consultation closes unless confidentiality is requested.',
 why:'Spain’s and Portugal’s deposit guarantee schemes fund themselves from member banks. Investment rules affect scheme resilience and the potential for extraordinary contributions.',
 themes:['liq'],emerg:['cmdi'],x:2,act:0,sev:3,rel:66,due:'2026-10-23',eff:null,
 sd:{reg:'Draft guidelines on DGS investment under the revised DGSD.'},
 url:'https://www.eba.europa.eu/publications-and-media/events/consultation-guidelines-investment-available-financial-means',check:'verified HTTP 200'},
{id:'E17',b:'eba',j:'ea',type:'guideline',date:'2026-06-15',pubLabel:'June 2026',
 h:'EBA revised Guidelines on SREP and supervisory stress testing (final report)',
 brief:'One consolidated SREP framework integrating ESG, operational resilience/DORA, IRRBB with CSRBB, third-country branches and Pillar 1/Pillar 2 interaction. The separate ICT SREP guidelines are repealed.',
 sum:'The revision consolidates SREP provisions while integrating ESG factors, operational resilience, third-country branches and clarifications on the interaction between revised Pillar 1 and Pillar 2 including the output floor. ICT risk assessment moves into the main guidelines (EBA/GL/2017/05 repealed). IRRBB guidance is extended to CSRBB. The revision also strengthens proportionality, sequencing and attention to institutions’ track record in addressing deficiencies.',
 why:'This rewrites the methodology behind Santander’s SREP letter: DORA, ESG and IRRBB/CSRBB findings now feed one consistent assessment, and the remediation track record counts.',
 themes:['capital','irrbb','dora','esg'],emerg:[],x:3,act:1,sev:4,rel:86,due:null,eff:'tbc',
 sd:{reg:'Consolidated SREP guidelines integrating DORA, ESG, IRRBB/CSRBB.',rem:'Institutions’ track record in addressing deficiencies is factored into SREP.'},
 url:'https://www.eba.europa.eu/sites/default/files/2026-06/fd5fbfa1-2efb-4122-8e91-4831469d8150/Final%20Report%20on%20revised%20SREP%20and%20supervisory%20stress%20testing%20Guidelines.pdf',check:'verified HTTP 200 (PDF)'},
{id:'E09',b:'ssm',j:'ea',type:'blog',date:'2026-09-11',
 h:'Preparing for the unknown: lessons from the ECB’s reverse stress test on geopolitical risk (Buch)',
 brief:'Supervisory Board Chair Claudia Buch draws three messages: granular data, board-steered scenario flexibility and realistic management actions, because a shared exit may be blocked when everyone uses it.',
 sum:'Banks reported mostly internal mitigating measures (about 74%, such as ICT resilience and cyber recovery) and enhanced monitoring (60%). Market-dependent actions were also common: asset disposals 40%, repricing 39%, funding-mix optimisation 35% and capital issuance 22%. Banks estimated these would recover about half of the depleted capital.',
 why:'This is the narrative layer behind the stress-test follow-up. Santander’s board-level scenario governance and the realism of disposal or repricing assumptions will be tested.',
 themes:['capital','gov'],emerg:['geo'],x:2,act:1,sev:3,rel:76,due:null,eff:null,
 sd:{narr:'Preparedness needs granular data, board steering and realistic management actions.',def:'Reliance on market-dependent mitigation that may fail in systemic stress.'},
 url:'https://www.bankingsupervision.europa.eu/press/blog/2026/html/ssm.blog20260911~97fe7661d0.en.html',check:'verified HTTP 200'},
{id:'E04',b:'ecb',j:'ea',type:'speech',date:'2026-10-01',
 h:'Where AI risks meet (Lagarde, ESRB annual conference)',
 brief:'President Lagarde frames AI as an opportunity and a systemic risk, linking AI adoption to cyber resilience and citing ESRB, ESMA, BCBS and FSB work.',
 sum:'The address at the ESRB’s tenth annual conference places AI alongside cyber and operational resilience on the macroprudential agenda and refers to the ESRB warning on frontier AI and cyber resilience.',
 why:'Top-level ECB signal reinforcing the 31 October action-plan request (E14).',
 themes:['ai','dora'],emerg:['frontier'],x:1,act:0,sev:3,rel:70,due:null,eff:null,
 sd:{narr:'AI risks converge with cyber and financial-stability risks.'},
 url:'https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp261001~cf3c630379.en.html',check:'verified HTTP 200'},
{id:'E06',b:'ssm',j:'ea',type:'speech',date:'2026-09-22',
 h:'From going concern to gone concern: the supervision–resolution continuum after a decade of the SRM (Machado)',
 brief:'The reformed CMDI framework, published in the Official Journal in April 2026, strengthens early intervention and gives the ECB a stronger role, anchored directly in the SRM Regulation.',
 sum:'Machado cites Directive (EU) 2026/806, Regulation (EU) 2026/808 and Directive (EU) 2026/804. The package revisits early intervention, resolution conditions and funding, and clarifies escalation and ECB–SRB cooperation.',
 why:'This sharpens the escalation path for any Santander entity in difficulty and links recovery planning to the SRB.',
 themes:['liq','gov'],emerg:['cmdi'],x:2,act:0,sev:3,rel:64,due:null,eff:null,
 sd:{narr:'Supervision and resolution form one continuum.',reg:'CMDI reform published in the OJ (April 2026).'},
 url:'https://www.bankingsupervision.europa.eu/press/speeches/date/2026/html/ssm.sp260922_1~fb8d813281.en.html',check:'verified HTTP 200'},
{id:'F01',b:'bdf',j:'ea',cc:'FR',type:'pr',date:'2026-07-31',
 h:'Banque de France relays the ECB’s 2026 geopolitical reverse stress test results',
 brief:'The French NCA republishes the SSM press release, an example of NCA–SSM communication interplay.',
 sum:'This mirrors the ECB release on the 2026 thematic reverse stress test covering 110 euro-area banks.',
 why:'Shows how SSM outputs propagate through national authorities. In v2, NCA feeds will capture national add-ons.',
 themes:['capital'],emerg:['geo'],x:1,act:0,sev:2,rel:40,due:null,eff:null,
 sd:{narr:'NCA relays the SSM exercise.'},
 url:'https://www.banque-france.fr/en/press-release/ecb-publishes-results-2026-geopolitical-risk-reverse-stress-test',check:'verified HTTP 200'},
/* Global previews, outside v1 scope */
{id:'G02',b:'fed',j:'us',type:'stress',date:'2026-06-24',preview:1,
 h:'Federal Reserve 2026 stress test results',
 brief:'32 banks could absorb about $708bn in losses under the severely adverse scenario. Aggregate CET1 falls to 11.2% before recovering to 12.7%.',
 sum:'Fed DFAST 2026 results.',why:'Preview of v2 US coverage (Santander US).',themes:['capital'],emerg:[],x:2,act:2,sev:3,rel:70,due:null,eff:null,
 sd:{sup:'Supervisory stress test of 32 banks.'},url:'https://federalreserve.gov/supervisionreg/dfa-stress-tests-2026.htm',check:'verified HTTP 200'}
];

/* ============ THEME EDITORIAL (external, no internal data) ============ */
const THEME_ED={
 dora:{mean:'The ECB wants frontier-AI cyber action plans by 31 Oct, DORA OSI campaigns and TLPT under the 2026–28 priorities, and a national incident process (BdE).',gsib:'As a G-SIB with critical cross-border functions, Santander faces a higher bar on recovery-time evidence, concentration on shared ICT providers and group-wide incident coordination.',q:['How does the 31 October action plan change your cyber roadmap and budget?','Which critical functions depend on a single cloud or ICT provider, and how was exit tested?','How is the board kept informed of frontier-AI threat scenarios?']},
 tpr:{mean:'The EBA non-ICT guidelines (final 18 Sep) extend outsourcing discipline beyond DORA, and the SSM runs a TPRM OSI campaign.',gsib:'Group-wide shared service centres and intra-group outsourcing in a G-SIB structure will be tested against both regimes.',q:['Is your register complete for non-ICT providers supporting critical functions?','What is your two-year plan to review existing critical arrangements?']},
 irrbb:{mean:'The revised SREP guidelines merge IRRBB and CSRBB into one assessment, so expect integrated challenge on rate and spread risk.',gsib:'Multi-currency balance sheets (EUR, GBP, BRL, USD) increase basis and optionality complexity in the combined score.',q:['How do you capture CSRBB alongside IRRBB in internal limits?']},
 esg:{mean:'Climate enforcement and ESG reporting sit on the supervisory desk, not this crisis edition.',gsib:'Transition-plan credibility across emerging-market books and Pillar 3 physical-risk disclosures face cross-jurisdiction comparison.',q:['Is the C&E materiality assessment evidence-ready for a deadline-based decision?','How is CRD VI transition planning embedded in strategy and risk appetite?']},
 consumer:{mean:'Mostly national in the euro area (BdE conduct remit). No SSM-level consumer item in this sample.',gsib:'Conduct issues in one market can carry reputational spillover across the group.',q:['How do BdE conduct findings feed group remediation?']},
 capital:{mean:'Reverse stress-test follow-up, CRR III standardised-approach reviews and SREP consolidation dominate the capital agenda.',gsib:'The G-SIB buffer, the output floor and SA-RWA consistency under CRR III will attract horizontal comparison across peers.',q:['How plausible are your management actions under a systemic geopolitical shock?','Where do SA-RWA calculations differ materially across entities?']},
 aml:{mean:'No AML item in this SSM-focused sample; AMLA coverage is planned for v2.',gsib:'Cross-border correspondent and LatAm flows remain a structural AML exposure.',q:['How will AMLA direct supervision interact with SSM prudential AML considerations in SREP?']},
 ai:{mean:'Buch and Lagarde speeches, SSM GenAI workshops and the RDARR system-wide strategy with escalation make AI and data a rising supervisory topic.',gsib:'RDARR capability is a G-SIB baseline expectation; AI use-case governance will be compared across global peers.',q:['Which RDARR findings remain open, and what is the escalation risk?','What is your inventory of generative-AI use cases and their controls?']},
 crypto:{mean:'No SSM item in this sample. MiCA perimeter items (e.g. CNMV) are outside v1 scope.',gsib:'Tokenisation and stablecoin partnerships may draw cross-supervisor attention.',q:['Do any group entities provide crypto-asset services needing authorisation?']},
 liq:{mean:'The DGS investment consultation closes 23 Oct, FX-LCR weaknesses surfaced in the reverse stress test, and the CMDI reform is in the OJ.',gsib:'FX liquidity across subsidiaries and resolution funding under CMDI are G-SIB-specific concerns.',q:['How does FX LCR behave under your own geopolitical scenario?']},
 gov:{mean:'Simplification comes with sharper escalation; on-site reform and published penalty cases sit on the supervisory desk, not this crisis edition.',gsib:'Board accountability for remediation across many legal entities is a structural G-SIB challenge.',q:['Which open findings are past due, and what is the board’s escalation view?']}
};

/* ============ SSM PRIORITIES 2026–28 = THE SPINE ============
 Official wording and planned activities from the ECB Banking Supervision priorities page (E13).
 Follow-up trail: plan (OSIs / thematic reviews) → data request → findings → remediation ask → next checkpoint.
 st: done | progress | published | upcoming | overdue. ill:1 = illustrative step (timing or form not stated publicly). */
const PRIO_URL='https://www.bankingsupervision.europa.eu/framework/priorities/html/ssm.supervisory_priorities202511.en.html';
const FU_STEPS=[['plan','Planned OSIs / reviews'],['data','Data request'],['find','Findings'],['rem','Remediation ask'],['next','Next checkpoint']];
const FU_ST={done:['Done','#57534E'],progress:['In progress','#1F3A5F'],published:['Findings published','#2F6B4F'],upcoming:['Upcoming','#9A6A00'],overdue:['Overdue','#A30016']};
const PRIOS=[
 {id:'p1',p:'Priority 1',short:'Geopolitical & macro-financial resilience',t:'Strengthening banks’ resilience to geopolitical risks and macro-financial uncertainties',url:PRIO_URL,
  gsib:'A multi-currency balance sheet across Europe and the Americas means geopolitical scenarios hit capital, FX liquidity and asset quality at the same time. The reverse stress test showed management actions and FX liquidity are where supervisors push hardest, and G-SIB buffers make capital-planning credibility a peer-comparison topic.',
  vs:[
  {id:'p1a',code:'P1.1',short:'Credit standards',v:'Ensure prudent risk-taking and sound credit standards',th:'capital',hook:'the credit-underwriting thematic review is under way, findings still to come',
   acts:['Thematic review of credit underwriting standards (new lending)','Targeted review of loan pricing (follow-up)','Targeted credit-risk OSIs on origination and underwriting'],ev:['E10'],
   fu:{plan:{t:'Thematic review of underwriting standards for new lending; loan-pricing follow-up; credit-risk OSIs on origination',d:'2026–27',st:'progress',src:'E13'},
       data:{t:'Data collection on new-lending standards and pricing for the thematic review',d:'tbc',st:'upcoming',ill:1},
       find:{t:'No horizontal findings published yet',d:'—',st:'upcoming'},
       rem:{t:'Expected: underwriting within risk appetite, and pricing that reflects risk',d:'—',st:'upcoming',src:'E13'},
       next:{t:'Thematic-review feedback to banks',d:'tbc',st:'upcoming',ill:1}}},
  {id:'p1b',code:'P1.2',short:'Capital & CRR III',v:'Ensure adequate capitalisation and consistent implementation of CRR III',th:'capital',hook:'reverse-stress-test findings move into SREP follow-up',
   acts:['Targeted reviews and OSIs on SA risk-weighted assets','Targeted reviews of the operational-risk business indicator component','2026 thematic reverse stress test (geopolitical)'],ev:['E10','E09','E17'],
   fu:{plan:{t:'Targeted reviews and OSIs on standardised-approach RWAs and the op-risk business indicator (CRR III)',d:'2026–28',st:'progress',src:'E13'},
       data:{t:'2026 thematic reverse stress test: 110 directly supervised banks submitted their own geopolitical scenarios',iso:'2026-07-31',st:'done',src:'E10'},
       find:{t:'Solvency–liquidity interaction poorly captured; some FX LCRs below 100%; mitigating actions recover only about half of depleted capital',iso:'2026-07-31',st:'published',src:'E10'},
       rem:{t:'Bank-specific follow-up to improve stress-testing frameworks; results feed the qualitative SREP assessment',d:'2026–27',st:'progress',src:'E10'},
       next:{t:'SREP 2026 decisions communicated to banks (usual annual cycle)',d:'Q4 2026 – Q1 2027',st:'upcoming',ill:1}}},
  {id:'p1c',code:'P1.3',short:'Climate & nature',v:'Ensure prudent management of climate and nature-related risks',th:'esg',hook:'enforcement shows climate deadlines are policed',
   acts:['Follow-up of remediation from the 2022 thematic review and climate stress test','Thematic review of transition planning (CRD VI)','Horizontal assessment of Pillar 3 ESG disclosures','Deep dive into physical-risk capabilities','Targeted C&N OSIs'],ev:[],
   fu:{plan:{t:'Remediation follow-up (2022 thematic review); transition-planning thematic review (CRD VI); Pillar 3 ESG assessment; physical-risk deep dive',d:'2026–28',st:'progress',src:'E13'},
       data:{t:'EBA ESG supervisory-reporting ITS: consultation closed 10 Jul 2026, final ITS pending; phase 2 from 09/2027 (tentative)',d:'Closed 10 Jul 2026',st:'progress',src:'E18'},
       find:{t:'Climate-risk materiality assessment not completed by the ECB deadline (31 May 2024) at some banks',d:'2025–26',st:'published',src:'E11'},
       rem:{t:'Climate-risk penalties are tracked on the supervisory radar',d:'Deadline 31 May 2024',st:'overdue',src:'E12',sh:'Climate-risk deadline misses are on the supervisory radar'},
       next:{t:'ESG reporting phase 2 (tentative)',d:'Sep 2027',st:'upcoming',src:'E18'}}}]},
 {id:'p2',p:'Priority 2',short:'Operational resilience & ICT',t:'Strengthening banks’ operational resilience and fostering robust ICT capabilities',url:PRIO_URL,
  gsib:'Critical functions run on shared group ICT and third-party platforms across many jurisdictions. G-SIB status raises the bar on recovery-time evidence, TLPT, concentration on cloud providers and RDARR, which is a BCBS 239 baseline for G-SIBs.',
  vs:[
  {id:'p2a',code:'P2.1',short:'Cyber, ICT & third parties',v:'Implement robust and resilient operational risk management frameworks',th:'dora',hook:'frontier-AI cyber action plans are due 31 Oct',
   acts:['Follow-up on banks reporting material ICT security / outsourcing shortcomings','Two OSI campaigns: cybersecurity management and third-party risk management (DORA)','Threat-led penetration testing (TLPT)','Targeted review of ICT change management','Deep dive into cloud-provider dependency'],ev:['E14'],
   fu:{plan:{t:'Two OSI campaigns (cybersecurity; third-party risk under DORA), TLPT, ICT change-management review, cloud-dependency deep dive',d:'2026–27',st:'progress',src:'E13'},
       data:{t:'ECB request to significant institutions: assess the frontier-AI cyber threat and build a comprehensive action plan',d:'Requested 2026',st:'progress',src:'E14'},
       find:{t:'Material shortcomings from past cybersecurity and third-party risk reviews still to be remediated',d:'Nov 2025',st:'published',src:'E13'},
       rem:{t:'Action plan with concrete measures; review of critical non-ICT third-party arrangements within two years (EBA GL)',d:'2026–28',st:'upcoming',src:'E15'},
       next:{t:'Frontier-AI cyber action plans due to the ECB',iso:'2026-10-31',st:'upcoming',src:'E14'}}},
  {id:'p2b',code:'P2.2',short:'Risk data (RDARR)',v:'Remedy deficiencies in risk reporting capabilities and related information systems (RDARR)',th:'ai',hook:'the escalation ladder applies where RDARR remediation lags',
   acts:['System-wide RDARR strategy with remediation and escalation process','Targeted RDARR OSIs, including on previously identified severe findings'],ev:[],
   fu:{plan:{t:'System-wide RDARR strategy with remediation and escalation; targeted OSIs, including on previously identified severe findings',d:'2026–28',st:'progress',src:'E13'},
       data:{t:'Tracking of bank remediation plans against the escalation process',d:'Ongoing',st:'progress',ill:1},
       find:{t:'Long-standing RDARR deficiencies and previously identified severe findings',d:'Nov 2025',st:'published',src:'E13'},
       rem:{t:'Timely remediation; escalation up to periodic penalty payments where it lags',d:'Sep 2026',st:'progress',src:'E02'},
       next:{t:'Targeted RDARR OSIs',d:'tbc',st:'upcoming'}}},
  {id:'p2c',code:'P2.3',short:'Digital & AI',v:'Medium-to-long-term: digital and AI strategies, governance and risk management',th:'ai',hook:'AI remains at narrative stage, with no findings yet',
   acts:['Targeted horizontal workshops on generative-AI applications','Cooperation with AI Act market-surveillance authorities and the EBA'],ev:['E04'],
   fu:{plan:{t:'Horizontal workshops on generative-AI applications; cooperation with AI Act authorities and the EBA',d:'2026–28',st:'progress',src:'E13'},
       data:{t:'Inventory of AI use cases ahead of the workshops',d:'tbc',st:'upcoming',ill:1},
       find:{t:'No findings published yet: narrative stage (Buch 22 Sep, Lagarde 1 Oct)',d:'—',st:'upcoming',src:'E05'},
       rem:{t:'Expected: governance of AI use cases, data and model risk',d:'—',st:'upcoming',src:'E04'},
       next:{t:'Linked checkpoint: frontier-AI cyber action plans',iso:'2026-10-31',st:'upcoming',src:'E14'}}}]}
];
const VULNS=PRIOS.flatMap(p=>p.vs.map(v=>({...v,pid:p.id,P:p})));const VBY=Object.fromEntries(VULNS.map(v=>[v.id,v]));
/* Editorial tag: which SSM priority each publication feeds ([] = cross-cutting / outside the priorities) */
const PR_TAG={E14:['p2a','p2c'],E10:['p1b'],E15:['p2a'],E13:['p1a','p1b','p1c','p2a','p2b','p2c'],E11:['p1c'],E16:[],E17:['p1b','p2a'],E09:['p1b'],E05:['p2c'],E04:['p2c','p2a'],
 E01:[],E02:['p2b'],E03:['p1b'],E07:[],E06:[],E08:['p1b'],E18:['p1c'],E19:[],E12:['p1c'],B01:['p2a'],B02:[],B03:[],F01:['p1b'],G01:[],G02:[]};
/* Themes → priorities they feed */
const THEME_PR={capital:['p1a','p1b'],irrbb:['p1b'],esg:['p1c'],dora:['p2a'],tpr:['p2a'],ai:['p2b','p2c'],gov:[],liq:[],consumer:[],aml:[],crypto:[]};
/* Ground truth: what supervisors found (inspections, exercises, enforcement) */
const GROUND=[
 {t:'Stress-testing frameworks: solvency–liquidity interaction poorly captured; some FX LCRs fall below 100% under bank-specific scenarios',src:'E10',th:'capital'},
 {t:'Mitigating actions often market-dependent (disposals 40%, repricing 39%); estimated to recover only about half of depleted capital',src:'E09',th:'capital'},
 
 
 {t:'Frontier-AI threat landscape: action plans requested by 31 October 2026',src:'E14',th:'dora'}
];
/* ============ REGULATORY PIPELINE: jurisdiction → consultation → reply → final → implementation ============ */
const PIPE=[
 {j:'ea',inst:'EBA GL on investment of DGS available financial means (EBA/CP/2026/12)',th:'liq',stages:{cons:'23 Jul 2026',reply:'23 Oct 2026',fin:'tbc',impl:'tbc'},cur:'reply',src:'E16'},
 {j:'ea',inst:'ECB action plans on frontier-AI cyber risk (significant institutions)',th:'dora',stages:{cons:'—',reply:'—',fin:'ECB request (per ESRB/2026/3)',impl:'31 Oct 2026'},cur:'impl',src:'E14'},
 {j:'ea',inst:'EBA revised SREP & supervisory stress-testing GL',th:'capital',stages:{cons:'done',reply:'closed',fin:'June 2026',impl:'tbc'},cur:'fin',src:'E17'},
 {j:'ea',inst:'CMDI reform (Dir. 2026/806, Reg. 2026/808, Dir. 2026/804)',th:'liq',stages:{cons:'done',reply:'closed',fin:'OJ April 2026',impl:'Transposition (tbc)'},cur:'impl',src:'E06'}
];


/* ============ CRISIS CLARITY · one brief, not a wire ============ */
const WARS=[
 {id:'iran',n:'United States and Iran',asof:'6 October 2026',
  elements:[
   {k:'Where it stands',v:'Eighth month. This is no longer a short supply shock. The Strait of Hormuz is the leverage point.'},
   {k:'What moved',v:'On 9 September Iran attacked ships near Hormuz and the US sank five Iranian tankers. Brent settled at $101. On 6 October Chevron said physical crude landed in Asia is closer to $150 than the futures price near $100.'},
   {k:'What is at stake',v:'About a fifth of traded oil went through Hormuz before the war. The G7 agreed a 100 million barrel release. JPMorgan has no baseline for how it ends, with about 10 million barrels a day already disrupted.'},
   {k:'For a bank',v:'USD funding, refined-product prices, and sanctions screening on shipping. Do not lock the scenario to one ceasefire date.'}
  ]},
 {id:'ukr',n:'Russia and Ukraine',asof:'late September 2026',
  elements:[
   {k:'Where it stands',v:'A stuck front and a winter strike campaign. Territory is not moving the way Moscow claims.'},
   {k:'What moved',v:'The Institute for the Study of War says Russian net gains since March are near zero. Ukrainian counterattacks continue toward Kupyansk, Oleksandrivka and Lyman. Russia launched 173 drones overnight on 25–26 September.'},
   {k:'What is at stake',v:'Energy infrastructure into winter, sanctions, and cyber. The US signed the Graham sanctions act on Russia and Iran on 18 September.'},
   {k:'For a bank',v:'The credit channel is energy, cyber and sanctions, not a map of villages.'}
  ]}
];
const ELECTIONS=[
 {when:'25 October 2026',where:'Brazil',what:'Presidential runoff, if needed, after the 4 October first round. Also Bulgaria (president) and Serbia (parliament) the same day.'},
 {when:'27 October 2026',where:'Israel',what:'Knesset election. Matters for the Iran war and energy risk, not as a European credit event.'},
 {when:'3 November 2026',where:'United States',what:'Midterms. The Iran war is the foreign-policy issue. A Chicago Council survey this week found 86% say the war has been bad for the cost of living.'},
 {when:'7 November 2026',where:'New Zealand',what:'Parliament. A developed-market vote, not a war vote.'},
 {when:'29 November 2026',where:'Spain',what:'Parliament, on the elections calendar. A euro-area vote with no crisis trigger attached yet.'},
 {when:'Reference, 2024',where:'Romania',what:'A presidential vote was annulled after a Russian influence operation. The pattern is the point, not a new ballot.'}
];
const AIBLOCK={
 h:'AI, model risk and fraud',
 sum:'One risk, two doors. A model that finds exploits, and a model that impersonates a person. Both skip a control that assumed a human attacker or a real caller.',
 bullets:[
  {t:'Deepfake fraud · Fideuram',d:'February, reported 25 September. A WhatsApp message looked like it came from Intesa Sanpaolo’s chief executive. A follow-up call used an AI clone of a lawyer’s voice. €95 million was sent, mostly to China and Hong Kong. About €53 million was recovered. About €36 million is still missing.'},
  {t:'AI intrusion · South Korea',d:'28 September to 6 October. Seven financial firms, about 66,000 people, entered through a loan-broker portal rather than the core ledger. Investigators point to Artex, an open-source AI tool. No funds stolen. The president said AI was used.'},
  {t:'Model capability · Mythos',d:'Anthropic’s Claude Mythos, April, released to selected partners. Nikkei on 2 October: Japanese banks are finding about twice as many flaws. Palo Alto found 75 in a month and a working exploit more than 70% of the time.'}
 ]
};
</script>
