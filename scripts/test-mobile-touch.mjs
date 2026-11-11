// Chrome DevTools Protocol: real touch input, not DOM click()/dispatchEvent().
import assert from "node:assert/strict";
import fs from "node:fs";
import { setTimeout as delay } from "node:timers/promises";

const base = process.env.TEST_BASE_URL || "http://192.168.100.7:3000";
const endpoint = process.env.CHROME_DEBUG_URL || "http://127.0.0.1:9225";
const targets = await (await fetch(endpoint + "/json/list")).json();
const target = targets.find(item => item.type === "page" && (item.url === "about:blank" || item.url.startsWith(base)));
assert.ok(target, "An isolated Chrome tab is required.");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let id = 0;
const pending = new Map();
const errors = [], requests = [], sockets = [];
socket.addEventListener("message", event => {
  const data = JSON.parse(event.data);
  if (data.id) { const task = pending.get(data.id); pending.delete(data.id); if (data.error) task?.reject(data.error); else task?.resolve(data.result); }
  if (data.method === "Runtime.exceptionThrown") errors.push(data.params.exceptionDetails.exception?.description ?? data.params.exceptionDetails.text);
  if (data.method === "Network.responseReceived" && data.params.response.status >= 400) requests.push({ url: data.params.response.url, status: data.params.response.status });
  if (data.method === "Network.webSocketFrameError") sockets.push(data.params.errorMessage);
});
function send(method, params = {}) { return new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); }); }
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression, message, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) { try { if (await evaluate(expression)) return; } catch { /* Navigating replaces the context. */ } await delay(75); }
  throw Error(message);
}
async function tap(selector, mouse = false) {
  const point = await evaluate(`(()=>{const node=[...document.querySelectorAll(${JSON.stringify(selector)})].find(item=>item.getBoundingClientRect().width>0); if(!node) return null; const r=node.getBoundingClientRect(); const x=r.x+r.width/2,y=r.y+r.height/2;const hit=document.elementFromPoint(x,y);return {x,y,reachable:node===hit||node.contains(hit),target:hit?.outerHTML.slice(0,200)};})()`);
  assert.ok(point?.reachable, `Touch target blocked: ${selector}: ${JSON.stringify(point)}`);
  if (mouse) {
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 });
  } else {
    await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: point.x, y: point.y, radiusX: 3, radiusY: 3, force: 1, id: 0 }] });
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
}
const locales = ["es", "en", "de", "fr", "ko", "zh-CN"];
const dictionaries = Object.fromEntries(locales.map(locale => [locale, JSON.parse(fs.readFileSync(`messages/${locale}.json`, "utf8"))]));
const localized = (path, locale) => locale === "es" ? path : `/${locale}${path === "/" ? "" : path}`;
const menu = 'button[aria-controls="mobile-navigation"]';
const cart = locale => `header button[aria-label=${JSON.stringify(dictionaries[locale]["Abrir carrito"])}]`;
async function ready(locale, route) {
  await until(`document.readyState==='complete' && document.documentElement.lang===${JSON.stringify(locale)} && location.pathname===${JSON.stringify(localized(route, locale))} && [...document.querySelectorAll(${JSON.stringify(menu)})].some(button=>Object.keys(button).some(key=>key.startsWith('__reactProps')))`, `Page did not hydrate: ${locale} ${route}`);
}
await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 900, deviceScaleFactor: 1, mobile: true });
try {
  await send("Page.navigate", { url: base + "/" });
  if (process.argv.includes("--probe")) {
    await delay(8000);
    console.log("Probe", await evaluate(`({lang:document.documentElement.lang,width:innerWidth,menu:[...document.querySelectorAll(${JSON.stringify(menu)})].map(x=>({rect:x.getBoundingClientRect().toJSON(),react:Object.keys(x).filter(k=>k.startsWith('__react'))}))})`));
    await tap(menu); await delay(600);
    console.log("Menu after touch", await evaluate("!!document.querySelector('#mobile-navigation')"));
    await tap(cart("es")); await delay(600);
    console.log("Cart after touch", await evaluate("!!document.querySelector('[role=dialog]')"));
    console.log(JSON.stringify({ errors, requests, sockets }, null, 2));
  } else {
    // Only the isolated test profile is seeded. Existing customer carts are never cleared.
    await send("Network.setCookie", { name: "yanina-locale", value: "es", url: base, path: "/" });
    await send("Page.navigate", { url: base + "/" }); await ready("es", "/");
    const products = await evaluate("localStorage.getItem('alhua-cart')");
    assert.ok(products === null || JSON.parse(products).length === 0, "Use a fresh test browser profile.");
    await send("Page.navigate", { url: base + "/tienda/taza-biblioteca" }); await ready("es", "/tienda/taza-biblioteca");
    const add = dictionaries.es["Agregar al carrito"];
    await evaluate(`(()=>{const button=[...document.querySelectorAll('main button')].find(x=>x.textContent.trim()===${JSON.stringify(add)});button.setAttribute('data-touch-test-add','');button.scrollIntoView({block:'center',behavior:'instant'});})()`);
    await tap("[data-touch-test-add]");
    await until("JSON.parse(localStorage.getItem('alhua-cart')||'[]').length===1", "Product not persisted");
    const saved = await evaluate("localStorage.getItem('alhua-cart')");
    let cases = 0;
    for (const width of [360, 375, 390, 430]) {
      await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: true });
      for (const locale of locales) {
        await send("Network.setCookie", { name: "yanina-locale", value: locale, url: base, path: "/" });
        await send("Page.navigate", { url: base + localized("/", locale) }); await ready(locale, "/");
        await tap(menu); await until("!!document.querySelector('#mobile-navigation')", "Menu did not open");
        await tap(menu); await until("!document.querySelector('#mobile-navigation')", "Menu did not close");
        await tap(menu); await until("!!document.querySelector('#mobile-navigation')", "Menu did not reopen");
        await tap(`#mobile-navigation a[href="${localized("/tienda", locale)}"]`);
        await ready(locale, "/tienda");
        await until("!document.querySelector('#mobile-navigation')", "Menu stayed open after navigation");
        await tap(cart(locale)); await until("!!document.querySelector('aside[role=dialog]')", "Cart did not open");
        assert.ok(await evaluate("document.querySelector('aside[role=dialog]').innerText.includes('Taza Biblioteca')"));
        const close = `aside[role=dialog] button[aria-label=${JSON.stringify(dictionaries[locale]["Cerrar carrito"])}]`;
        await tap(close); await until("!document.querySelector('aside[role=dialog]')", "Cart did not close");
        await tap(cart(locale)); await until("!!document.querySelector('aside[role=dialog]')", "Cart did not reopen");
        await tap(`aside[role=dialog] a[href="${localized("/checkout", locale)}"]`);
        await ready(locale, "/checkout"); await until("!document.querySelector('aside[role=dialog]')", "Cart stayed open after checkout navigation");
        assert.equal(await evaluate("localStorage.getItem('alhua-cart')"), saved);
        // Open the real native selector with touch, then select using native keyboard input.
        await tap(menu); await until("!!document.querySelector('#mobile-navigation')", "Menu on checkout did not open");
        const next = locales[(locales.indexOf(locale) + 1) % locales.length];
        await tap("#mobile-navigation select");
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Home", code: "Home", windowsVirtualKeyCode: 36 });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Home", code: "Home", windowsVirtualKeyCode: 36 });
        for (let i = 0; i < locales.indexOf(next); i++) {
          await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40 });
          await send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40 });
        }
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
        await ready(next, "/checkout");
        await tap(menu); await until("!!document.querySelector('#mobile-navigation')", "Menu failed after locale change");
        await tap(menu); await until("!document.querySelector('#mobile-navigation')", "Menu close failed after locale change");
        await tap(cart(next)); await until("!!document.querySelector('aside[role=dialog]')", "Cart failed after locale change");
        await tap(`aside[role=dialog] button[aria-label=${JSON.stringify(dictionaries[next]["Cerrar carrito"])}]`);
        await until("!document.querySelector('aside[role=dialog]')", "Cart close failed after locale change");
        assert.equal(await evaluate("localStorage.getItem('alhua-cart')"), saved);
        console.log(`PASS touch ${width}px ${locale} → ${next}: menu, links, cart, checkout, locale, persistence.`);
        cases++;
      }
    }
    await send("Emulation.setTouchEmulationEnabled", { enabled: false });
    await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const locale of locales) {
      await send("Network.setCookie", { name: "yanina-locale", value: locale, url: base, path: "/" });
      await send("Page.navigate", { url: base + localized("/", locale) }); await ready(locale, "/");
      await tap(cart(locale), true); await until("!!document.querySelector('aside[role=dialog]')", "Desktop cart did not open");
      await tap(`aside[role=dialog] button[aria-label=${JSON.stringify(dictionaries[locale]["Cerrar carrito"])}]`, true);
      await until("!document.querySelector('aside[role=dialog]')", "Desktop cart did not close");
      await tap(`header nav a[href="${localized("/tienda", locale)}"]`, true); await ready(locale, "/tienda");
      assert.equal(await evaluate("localStorage.getItem('alhua-cart')"), saved);
      console.log(`PASS desktop 1440px ${locale}: mouse navigation, cart and persistence.`);
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, []);
    assert.deepEqual(sockets, []);
    console.log(`PASS: ${cases} touch scenarios at ${base}, no JavaScript/resource/WebSocket errors.`);
  }
} finally { socket.close(); }
