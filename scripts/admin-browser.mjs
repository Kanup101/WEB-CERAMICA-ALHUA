import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { setTimeout as delay } from "node:timers/promises";

export async function testAdminBrowser(base, credentials, lodgingId) {
  const targets = await (await fetch("http://127.0.0.1:9225/json/list")).json();
  const target = targets.find(item => item.type === "page" && item.url === "about:blank");
  assert.ok(target, "Use a fresh isolated Chrome tab");
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener("open", resolve, { once: true }));
  const pending = new Map(), errors = []; let id = 0;
  socket.addEventListener("message", event => { const data = JSON.parse(event.data); if (data.id) { const task = pending.get(data.id); pending.delete(data.id); if (data.error) task.reject(data.error); else task.resolve(data.result); } if (data.method === "Runtime.exceptionThrown") errors.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text); });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); });
  async function evaluate(expression) { const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw Error(result.exceptionDetails.text); return result.result.value; }
  async function until(expression) { for (let i = 0; i < 240; i++) { try { if (await evaluate(expression)) return; } catch { /* navigation */ } await delay(75); } throw Error("Browser condition timed out"); }
  async function visit(route, text) { await send("Page.navigate", { url: base + route }); await until(`document.readyState==='complete' && document.querySelector('main')?.innerText.includes(${JSON.stringify(text)})`); await delay(100); }
  async function click(selector) { const point = await evaluate(`(()=>{const node=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.getBoundingClientRect().width>0);if(!node)return null;node.scrollIntoView({block:'center',behavior:'instant'});const r=node.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`); assert.ok(point, selector); await send("Input.dispatchMouseEvent", { type: "mousePressed", ...point, button: "left", clickCount: 1 }); await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...point, button: "left", clickCount: 1 }); }
  async function fill(selector, value) { await click(selector); await send("Input.insertText", { text: value }); }
  try {
    await send("Page.enable"); await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, mobile: false, deviceScaleFactor: 1 });
    await visit("/admin/login", "Acceso administrativo");
    await fill('input[name="email"]', credentials.email); await fill('input[name="password"]', credentials.password);
    await click('button[type="submit"], form button:not([type])');
    await until("location.pathname==='/admin/difusion' && document.querySelector('main')?.innerText.includes('Total de alojamientos')");
    const routes = [["/admin/difusion", "Total de alojamientos"], ["/admin/difusion/alojamientos", "registros"], ["/admin/difusion/alojamientos/nuevo", "Nuevo alojamiento"], [`/admin/difusion/alojamientos/${lodgingId}`, "Historial de cambios"], ["/admin/difusion/campanas", "Editar borrador"]];
    for (const width of [360, 768, 1440]) {
      await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, mobile: width < 768, deviceScaleFactor: 1 });
      for (const [route, text] of routes) { await visit(route, text); assert.ok(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"), `${route} overflows at ${width}`); }
      console.log(`PASS admin browser: five screens at ${width}px`);
    }
    await visit("/admin/difusion/alojamientos/nuevo", "Nuevo alojamiento");
    await fill('[name="name"]', "Alojamiento UI aislado"); await fill('[name="city"]', "Salta"); await fill('[name="email"]', "ui@example.invalid"); await fill('[name="source"]', "Prueba local autorizada de interfaz");
    await click('form button:not([type])');
    await until("location.pathname.startsWith('/admin/difusion/alojamientos/') && !location.pathname.endsWith('/nuevo') && document.querySelector('main')?.innerText.includes('Historial de cambios')");
    const artifact = path.join(os.tmpdir(), "yanina-admin-ui.png");
    const capture = await send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(artifact, Buffer.from(capture.data, "base64"));
    await click('header button'); await until("location.pathname==='/admin/login'");
    assert.deepEqual(errors, []);
    console.log("PASS admin browser: real login, contact creation, logout and no runtime exceptions. Screenshot:", artifact);
  } finally { socket.close(); }
}
