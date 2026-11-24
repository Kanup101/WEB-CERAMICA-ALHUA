import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { loadModule } from './audit-i18n.mjs';
const { formatMoney, locales } = loadModule('src/lib/i18n/config.ts');
const base = process.env.TEST_BASE_URL ?? 'http://localhost:3105';
const port = 9227;
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'yanina-collections-browser-'));
const browser = spawn(process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-software-rasterizer', '--in-process-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let browserLog = '';
browser.stderr.on('data', data => { browserLog += data; });
let socket;
try {
 let targets;
 for(let attempt=0;attempt<100;attempt++) { try { targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); break; } catch { await delay(100); } }
 assert.ok(targets, 'Chrome debugging endpoint available: ' + browserLog.slice(-1000));
 socket = new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}));
 let id=0; const pending=new Map(), errors=[];
 socket.addEventListener('message',event=>{const value=JSON.parse(event.data);if(value.id){const task=pending.get(value.id); pending.delete(value.id);if(value.error)task.reject(value.error);else task.resolve(value.result);}if(value.method==='Runtime.exceptionThrown')errors.push(value.params.exceptionDetails.exception?.description ?? value.params.exceptionDetails.text);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const next=++id;const timer=setTimeout(()=>reject(Error('CDP timeout: '+method)),15000);pending.set(next,{resolve:value=>{clearTimeout(timer);resolve(value);},reject});socket.send(JSON.stringify({id:next,method,params}));});
 const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
 const until=async expression=>{for(let i=0;i<150;i++){try{if(await evaluate(expression))return;}catch{}await delay(100);}throw Error('Timed out: '+expression);};
 async function visit(route, locale='es') {await send('Page.navigate',{url:base+route});await until(`location.pathname===${JSON.stringify(route)} && document.readyState==='complete' && document.documentElement.lang===${JSON.stringify(locale)} && !!document.querySelector('main h1, main h2')`);await delay(300);}
 await send('Page.enable');await send('Runtime.enable');
 const manifest=JSON.parse(await fs.readFile('src/data/collections-manifest.json','utf8'));
 for(const width of [360,390,768,1440]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,mobile:width<768,deviceScaleFactor:1});
  await visit('/colecciones');
  await until("[...document.querySelectorAll('main img')].slice(0,1).every(image=>image.complete&&image.naturalWidth>0)");
  if(width===360 || width===1440) { const screenshot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(path.join(os.tmpdir(),`yanina-stage7b-catalog-${width}.png`),Buffer.from(screenshot.data,'base64')); }
  assert.equal(await evaluate("document.querySelectorAll('main a[href^=\"/colecciones/\"]').length"),manifest.collections.filter(collection=>collection.published).length);
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'));
  await visit('/colecciones/cuando-la-tierra-me-mira');
  if(width===360 || width===1440) { const screenshot=await send('Page.captureScreenshot',{format:'png'}); await fs.writeFile(path.join(os.tmpdir(),`yanina-stage7b-detail-${width}.png`),Buffer.from(screenshot.data,'base64')); }
  await evaluate("document.querySelector('main button').focus();document.querySelector('main button').click()");
  await until("!!document.querySelector('dialog[open]')");
  await until("document.querySelector('dialog img')?.complete && document.querySelector('dialog img')?.naturalWidth>0");
  await evaluate("document.querySelector('.lightbox-info-toggle').click()");
  await until("!!document.querySelector('#lightbox-artwork .artwork-description')");
  await evaluate("document.querySelector('#lightbox-artwork summary').click()");
  assert.ok(await evaluate("document.querySelector('#lightbox-artwork').innerText.includes('Pendiente de confirmación de Yanina.')"));
  await evaluate("document.querySelector('.lightbox-info-toggle').click()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});
  await until("document.querySelector('#collection-photo-count')?.textContent.startsWith('Fotografía 2 ')");
  if(width===360) {
   await evaluate("(()=>{const node=document.querySelector('.lightbox-image');const make=(type,x)=>{const event=new Event(type,{bubbles:true});Object.defineProperty(event,type==='touchstart'?'touches':'changedTouches',{value:[{clientX:x,clientY:200}]});node.dispatchEvent(event);};make('touchstart',250);make('touchend',100);})()");
   await until("document.querySelector('#collection-photo-count')?.textContent.startsWith('Fotografía 3 ')");
   await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowLeft',code:'ArrowLeft'});
  }
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowLeft',code:'ArrowLeft'});
  await until("document.querySelector('#collection-photo-count')?.textContent.startsWith('Fotografía 1 ')");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});
  await until("!document.querySelector('dialog')");
  assert.ok(await evaluate("document.activeElement===document.querySelector('main button')"));
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'));
  if(width===360) {
   await evaluate("document.querySelector('header button[aria-controls]').click()");
   await until("!!document.querySelector('#mobile-navigation')");
   assert.ok(await evaluate("!!document.querySelector('#mobile-navigation a[href=\"/colecciones\"]')"));
  }
  console.log(`PASS browser: catalog, lightbox, keyboard, focus restoration, mobile navigation, no overflow at ${width}px`);
 }
 for(const locale of ['en','de','fr','ko','zh-CN','es']) {
   await evaluate(`(()=>{const select=document.querySelector('header select');select.value=${JSON.stringify(locale)};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
   const route=(locale==='es'?'':'/'+locale)+'/colecciones/cuando-la-tierra-me-mira';
   await until(`location.pathname===${JSON.stringify(route)} && document.documentElement.lang===${JSON.stringify(locale)}`);
   await delay(250);
   assert.equal(await evaluate("document.querySelector('h1').textContent"),'Cuando la tierra me mira');
 }
 console.log('PASS browser: language selector preserves collection across all six languages');
 await visit('/tienda');
 assert.ok(await evaluate("document.querySelectorAll('main a').length>0"));
 await visit('/tienda/soplo-al-sol');
 await evaluate("[...document.querySelectorAll('main button')].find(button=>button.textContent.includes('Agregar al carrito'))?.click()");
 await evaluate("document.querySelector('header button[aria-label=\"Abrir carrito\"]').click()");
 await until("!!document.querySelector('aside[role=dialog] h3')");
 await evaluate("document.querySelector('aside button[aria-label=\"Cerrar carrito\"]').click()");
 const legacyCart = ['p-002', 'p-004', 'p-005', 'p-006', 'p-006', 'p-008', 'p-009', 'p-010', 'p-011']
   .map(id => ({ product: { id, name: 'Nombre antiguo', priceARS: 1, priceUSD: 1 }, quantity: 1 }));
 await evaluate(`localStorage.setItem('alhua-cart', ${JSON.stringify(JSON.stringify(legacyCart))})`);
 await visit('/checkout');
 for (const locale of [...locales.filter(value => value !== 'es'), 'es']) {
   await evaluate(`(()=>{const select=document.querySelector('header select');select.value=${JSON.stringify(locale)};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
   const route = (locale === 'es' ? '' : '/' + locale) + '/checkout';
   await until(`location.pathname===${JSON.stringify(route)} && document.documentElement.lang===${JSON.stringify(locale)} && document.querySelector('main aside')?.textContent.includes(${JSON.stringify(formatMoney(650, 'USD', locale))})`);
   const names = await evaluate("[...document.querySelectorAll('main article h3')].map(node=>node.textContent)");
   assert.deepEqual(names, ['Soplo al sol', 'Fuente Venas']);
   const message = await evaluate("new URL(document.querySelector('main a[href^=\"https://wa.me/\"]').href).searchParams.get('text')");
   assert.ok(message.includes(formatMoney(650, 'USD', locale)));
 }
 const saved = await evaluate("JSON.parse(localStorage.getItem('alhua-cart')).map(line=>[line.product.id,line.quantity])");
 assert.deepEqual(saved, [['p-005', 1], ['p-006', 2]]);
 console.log('PASS browser: legacy cart sanitation, USD subtotal and checkout persisted across all six locales');
 await visit('/');
 assert.ok(await evaluate("document.querySelector('main').innerText.includes('Colecciones') && !document.querySelector('main').innerText.includes('Piezas destacadas')"));
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await visit('/colecciones');
 assert.ok(await evaluate("[...document.querySelectorAll('.exhibition-reveal')].every(node=>getComputedStyle(node).opacity==='1'&&getComputedStyle(node).transform==='none')"));
 assert.ok(await evaluate("document.querySelectorAll('main a[href*=\"aros-collares\"], main a[href*=\"pichuda\"]').length===0"));
 assert.deepEqual(errors,[]);
 const screenshot=await send('Page.captureScreenshot',{format:'png'});
 await fs.writeFile(path.join(os.tmpdir(),'yanina-collections-home.png'),Buffer.from(screenshot.data,'base64'));
 console.log('PASS browser: home, store, add to cart and no runtime exceptions');
} finally {socket?.close();browser.kill();}
