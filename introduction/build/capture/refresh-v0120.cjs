// Refresh the introduction with the released v0.12.0, isolated simulator
// (v0.12.0: D1 at the Kea's 500 ms FFC minimum; the Live/Plan highlights show
// in the run shot).
// NMR_RELEASE_BIN, NMR_CAPTURE_WORK and optional NMR_OFE_COMMAND/NMR_OFE_GUI.
// Requires a clean capture folder; logs/owner credentials never enter this repo.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawn,execFileSync}=require('node:child_process'),{setTimeout:delay}=require('node:timers/promises');
const {chromium}=require('playwright-core');
const bin=process.env.NMR_RELEASE_BIN,work=process.env.NMR_CAPTURE_WORK,shots=path.resolve(__dirname,'../shots');
if(!bin||!work)throw Error('NMR_RELEASE_BIN and NMR_CAPTURE_WORK required');
fs.mkdirSync(work,{recursive:true});fs.cpSync(path.join(bin,'demo'),path.join(work,'demo'),{recursive:true});
const cfg=path.join(work,'gui.json');fs.writeFileSync(cfg,JSON.stringify({console:'kea',simulator:true,listen:'127.0.0.1:0',agentHardware:'allow',analysis:{method:'legacy-prospa-v1'},prospaDir:'demo/prospa',prefDir:'prefs',bridgeDir:'bridge',dataDir:'results',ofe:{command:process.env.NMR_OFE_COMMAND?[process.env.NMR_OFE_COMMAND]:undefined,gui:process.env.NMR_OFE_GUI,guiPaths:'same'},terminal:{enable:true,shell:['bash'],dir:work,agents:[{name:'Claude',command:'claude'},{name:'Codex',command:'codex'}]}}));
let gui,browser,ctx,page,logs='';const errors=[],boxes={};
async function until(fn,label,ms=90000){const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await delay(200)}throw Error(label+(page?' · '+await page.locator('#page-results').innerText().catch(()=>'' ):''))}
(async()=>{
 gui=spawn(path.join(bin,'onenmrd-gui'),['-config',cfg,'-no-browser'],{cwd:work,stdio:['ignore','pipe','pipe']});for(const s of[gui.stdout,gui.stderr])s.on('data',b=>logs+=b);
 await until(()=>/open the GUI with this link[^\n]*#t=([0-9a-f]{32})/.test(logs),'GUI startup');assert.ok(logs.includes('onenmrd-gui v0.12.0'),'version');
 const addr=/OneNMRD-go-gui at (http:\/\/127\.0\.0\.1:\d+)/.exec(logs)[1],token=/#t=([0-9a-f]{32})/.exec(logs)[1];
 async function api(route,body,method){const r=await fetch(addr+'/api/'+route,{method:method||(body===undefined?'GET':'POST'),headers:{'Content-Type':'application/json','X-FFC-GUI':token},body:body===undefined?undefined:JSON.stringify(body)});const d=await r.json();assert.equal(r.status,200,route+JSON.stringify(d));return d}
 await api('params/load',{name:'demo4fields'});await api('params/set',{nrPnts:'8192',nrScans:'16',nrCict:'1',dumTau:'0',shiFdt:'0',npNoise:'256',nptGau:'0'});
 const rows=[500,1500,4000,8000].map(f=>({T:25,f,d1:500,seq:3,ns:16,taus:[1000,3000,10000,30000,100000,300000,500000]}));await api('plan',{rows},'PUT');
 browser=await chromium.launch(process.env.CHROME?{executablePath:process.env.CHROME}:{});ctx=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:2});
 await ctx.addInitScript(()=>localStorage.setItem('onenmrd-theme','dim'));page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());page.setDefaultTimeout(20000);
 // the console switch the menu makes (POST /api/setup), then the reload it does
 async function setup(console_,magnet){let t0=Date.now(),seen='';while(true){const st=await api('status');const k=JSON.stringify({p:st.pending,s:st.backend.state,c:st.backend.command,a:st.archiveBusy});if(k!==seen){console.log('before setup',((Date.now()-t0)/1000).toFixed(1)+'s',k.slice(0,300));seen=k}if(!st.pending&&!st.archiveBusy&&st.backend.state!=='running')break;if(Date.now()-t0>120000)throw Error('still pending '+k);await delay(500)}await api('setup',{console:console_,magnet});await page.reload();await page.waitForFunction(m=>window.__status?.gui&&window.__status?.config?.magnet===m,magnet,{timeout:45000});await delay(1000)}
 async function layout(name){const l=fs.readFileSync(path.join(__dirname,'layouts',name+'.json'),'utf8');await page.evaluate(l=>localStorage.setItem('ffc-layout-v1',l),l);await page.reload();await page.waitForFunction(()=>window.__status?.gui);await delay(1200)}
 async function shot(name,selectors={}){await page.mouse.move(1915,1075);await delay(500);for(const[k,s]of Object.entries(selectors)){const b=await page.locator(s).first().boundingBox();if(b)boxes[k]=[b.x*2,b.y*2,(b.x+b.width)*2,(b.y+b.height)*2].map(Math.round)}await page.screenshot({path:path.join(shots,name)});console.log('Captured',name)}
 await page.goto(addr+'/#t='+token);await page.waitForFunction(()=>window.__status?.gui);assert.equal(await page.evaluate(()=>AppTheme.get()),'dim');
 await layout('sequences');await page.locator('#sd-seq').selectOption('ffc2');await delay(1000);
 await page.evaluate(()=>{const e=[...document.querySelectorAll('#page-settings legend')].find(e=>/sequences available/i.test(e.textContent));e?.closest('fieldset')?.scrollIntoView({block:'center'})});
 await shot('20-sequences.png',{sequence:'#page-seqs',plan:'#page-plan'});
 await layout('run');await page.locator('#h-seq').selectOption('ffc2');const started=page.waitForResponse(r=>r.url().endsWith('/api/run')&&r.request().method()==='POST');await page.locator('#h-run').click();await page.locator('dialog[open] button[value="ok"]').click();const runResponse=await started;assert.equal(runResponse.status(),200,await runResponse.text());
 await until(async()=>{const d=await api('live');return d.fields?.length>=2||d.fit||d.avg?.re?.length>0},'live data');
 // A late run frame has the M(tau) curve, field fit and Results together.
 let saved=false;await until(async()=>{const d=await api('status');const pr=d.planRow;if(!saved&&pr&&pr.row===3&&pr.itau>=4&&pr.scan>=8){await shot('30-live.png');saved=true}if(d.backend.state==='error')throw Error(JSON.stringify(d.backend));return d.backend.state==='done'},'four-field completion',180000);
 if(!saved)await shot('30-live.png');
 const mon=await api('monitor');const railSnapshots=(mon.readings||[]).filter(r=>r.key==='positive15').length;// the monitor keeps its last 7200 readings: in the slower v0.12.0 Simulator
 // the field events push the earlier rows' rail snapshots out
 console.log('rail snapshots still in the monitor:',railSnapshots);
 const results=await api('results');fs.writeFileSync(path.join(work,'results.json'),JSON.stringify(results,null,2));
 await layout('noise');await page.locator('#lv-ff').fill('20');await page.locator('#lv-ff').press('Enter');await delay(2000);await page.evaluate(()=>document.getElementById('analysis-panel')?.scrollIntoView({block:'start'}));await page.locator('#lv-note-close').click().catch(()=>{});await shot('35-noise.png');
 await page.evaluate(()=>localStorage.setItem('ffc-layout-v1',JSON.stringify({cols:[{w:100,panes:[{id:'diag',h:100}]}]})));await page.reload();await page.waitForFunction(()=>window.__status?.gui);await page.locator('#dg-span').selectOption('60');await delay(1000);await page.locator('#dg-pause').click();
 await shot('44-diagnostic-groups.png',{groups:'#dg-channels'});
 await layout('diagnostics');await page.locator('#dg-span').selectOption('60');await delay(800);await page.locator('#dg-pause').click();await page.locator('#dg-live').evaluate(e=>e.scrollIntoView({block:'start'}));await shot('45-diagnostics.png',{hall:'#dg-live',down:'#dg-down',up:'#dg-up'});
 await page.locator('#dg-metrics').evaluate(e=>e.scrollIntoView({block:'start'}));await shot('46-diagnostics-trends.png',{metrics:'#dg-metrics'});
 await setup('ultrarelax8','17.9618mhz');await delay(1500);await page.locator('.pane-body:has(#page-diag)').evaluate(e=>e.scrollTop=0);await shot('47-fixed-field.png');
 await setup('ultrarelax8','8.24mhz-ffc');await layout('uspin');
 for(let i=0;i<2;i++){const text=execFileSync(path.join(bin,'hardware-emulator'),['-config',cfg,'-console','ultrarelax8','-checklog','-seed',String(100+i)],{encoding:'utf8'});await api('check/import',{text});await delay(1100)}
 await page.evaluate(async()=>{await loadChecks();const h=[...document.querySelectorAll('#page-console h2,#page-console h3,#page-console legend')].find(e=>/calibration|FFC voltage/i.test(e.textContent));h?.scrollIntoView({block:'start'})});await shot('10-ultrarelax8.png');
 await setup('kea','8.24mhz-ffc');await layout('results');
 if(process.env.NMR_OFE_COMMAND){await page.getByRole('button',{name:'Fit in OFE',exact:true}).click();await until(async()=>{const t=await page.locator('#page-results').innerText();if(/failed|not found/i.test(t.slice(0,900)))throw Error(t.slice(0,1300));const cells=await page.locator('#page-results table tbody tr td:nth-child(3)').allInnerTexts();return cells.length>0&&cells.every(c=>/\d/.test(c))},'OFE fit',90000);await shot('40-results.png');
 if(process.env.NMR_OFE_GUI){await page.waitForFunction(()=>!document.querySelector('#r-ofe-open').disabled,null,{timeout:30000});const pop=ctx.waitForEvent('page');await page.getByRole('button',{name:/Open in OFE-GUI/}).click();const p2=await pop;await p2.waitForTimeout(8000);await p2.evaluate(()=>{localStorage.setItem('onefite-gui-theme','dim')});await p2.reload();await p2.waitForTimeout(5000);if(await p2.locator('#logX').count())await p2.locator('#logX').check({force:true});await p2.locator('#plotBtn').click();await p2.waitForTimeout(8000);await p2.screenshot({path:path.join(shots,'60-ofe-gui.png')});console.log('Captured 60-ofe-gui.png');await p2.close()}}
 await layout('terminal');await page.getByRole('button',{name:'Restart',exact:true}).click();await delay(1500);await page.locator('.xterm-helper-textarea').focus();
 const command=`clear; grep '^## ' AGENTS.md; curl -s ${addr}/api/results | python3 -c 'import sys,json; print("Saved simulator runs:"); [print(r["name"]) for r in json.load(sys.stdin)]'`;
 await page.keyboard.type(command,{delay:2});await page.keyboard.press('Enter');await delay(1500);await shot('50-terminal.png');
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'shot-boxes.json'),JSON.stringify(boxes,null,2));fs.writeFileSync(path.join(work,'verification.json'),JSON.stringify({version:'v0.12.0',theme:'dim',simulation:true,planRows:4,railSnapshots,browserErrors:errors,ofeFit:!!process.env.NMR_OFE_COMMAND},null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();if(gui)gui.kill('SIGTERM');fs.writeFileSync(path.join(work,'private-gui.log'),logs)});
