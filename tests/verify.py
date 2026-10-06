import asyncio, base64, os, subprocess, sys, json
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='file://'+os.path.join(ROOT,'index.html')
OUT=lambda n: os.path.join(ROOT,n)
async def main():
    errs=[]
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':1440,'height':900},device_scale_factor=2,accept_downloads=True)
        pg=await ctx.new_page()
        pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR '+str(e)))
        await pg.goto(URL); await pg.evaluate('localStorage.clear()'); await pg.reload()
        await pg.wait_for_function('window.__ready===true',timeout=20000)
        await pg.wait_for_timeout(1500)
        info=await pg.evaluate('''()=>({lvl:envData().lvl,crit:scope().filter(i=>critOf(i)===0).map(i=>i.id),high:scope().filter(i=>critOf(i)===1).map(i=>i.id),
          themes:themesRanked(scope()).map(t=>[t.s,t.score,t.trend,t.ps.length]),n:scope().length,head:envData().h})''')
        print(json.dumps(info,indent=1))
        await pg.screenshot(path=OUT('cover.png'))
        await pg.click('#sections button[data-v=priorities]'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=OUT('priorities-top.png'))
        await pg.evaluate("window.scrollTo(0,document.getElementById('pr-p2').getBoundingClientRect().top+window.scrollY-70)"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=OUT('priorities.png'))
        pinfo=await pg.evaluate('''()=>({p:PRIOS.map(P=>[P.id,psai(P.id,scope()).score]),v:VULNS.map(v=>[v.code,vsai(v.id,scope()).score,vStatus(v),fuDate(v.fu.next)])})''')
        print('PRIOS',json.dumps(pinfo))
        await pg.evaluate("window.scrollTo(0,0)")
        await pg.click('#sections button[data-v=desk]'); await pg.select_option('select[data-f=prio]','p2a'); await pg.wait_for_timeout(300)
        print('desk p2a rows',await pg.locator('article.row').count())
        for v,f in [('themes','themes.png'),('desk','desk.png'),('calendar','calendar.png')]:
            await pg.click(f'#sections button[data-v={v}]'); await pg.wait_for_timeout(500); await pg.screenshot(path=OUT(f))
        await pg.click('#sections button[data-v=map]'); await pg.wait_for_timeout(2500)
        await pg.evaluate("S.cc='ES';renderMain();window.scrollTo(0,0)")
        await pg.wait_for_timeout(2500); await pg.evaluate("window.scrollTo(0,250)"); await pg.wait_for_timeout(300); await pg.screenshot(path=OUT('map.png'))
        await pg.evaluate("S.cc=null;renderMain()")
        svg=await pg.locator('#eamap svg').count(); print('map svg',svg)
        # other jurisdictions + priorities for errors
        for j in ['uk','us','global','apac','ea']:
            await pg.click(f'.jurbar button[data-v={j}]'); await pg.wait_for_timeout(300)
        for v in ['priorities','front','themes','calendar','desk','map']:
            await pg.click(f'#sections button[data-v={v}]'); await pg.wait_for_timeout(300)
        # reader
        await pg.click('#sections button[data-v=front]'); await pg.wait_for_timeout(300)
        await pg.evaluate("openReader('E14')"); await pg.wait_for_timeout(400); await pg.screenshot(path=OUT('reader.png'))
        await pg.keyboard.press('Escape')
        # curate: include items, adjust, note
        await pg.evaluate('''()=>{['E14','E16','E10','E15','E13','E11'].forEach(id=>toggleInc(id));setSt('E12',{crit:1});setSt('E14',{note:'Confirm owner for the 31 Oct action plan and align with DORA TLPT scope.'});
          E().cover='Two hard dates this month (EBA DGS reply 23 Oct; ECB frontier-AI action plans 31 Oct). Third-party risk and stress-testing follow-ups are the 2027 OSI agenda.';save();renderAll()}''')
        await pg.click('#briefBtn'); await pg.wait_for_timeout(500); await pg.screenshot(path=OUT('tray.png'))
        await pg.evaluate('exportPdf()')
        await pg.wait_for_function('!!window.__lastPdf',timeout=60000)
        data=await pg.evaluate('window.__lastPdf')
        open(OUT('sample-supervisory-brief.pdf'),'wb').write(base64.b64decode(data.split(',',1)[1]))
        await b.close()
    subprocess.run(['pdftoppm','-png','-r','110','-f','1','-l','1','-singlefile',OUT('sample-supervisory-brief.pdf'),OUT('pdf-page1')],check=True)
    print('ERRORS',errs)
asyncio.run(main())
