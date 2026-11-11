// Uses Chrome's local debugging endpoint; no browser package or runtime translation service.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { loadModule } from "./audit-i18n.mjs";

const base = process.env.TEST_BASE_URL || "http://localhost:3105";
const endpoint = process.env.CHROME_DEBUG_URL || "http://127.0.0.1:9225";
const targets = await (await fetch(endpoint + "/json/list")).json();
const target = targets.find(item => item.type === "page" && (item.url === "about:blank" || item.url.startsWith(base)));
assert.ok(target, "Open an isolated headless Chrome instance at about:blank before running this test.");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let id = 0;
const pending = new Map(), runtimeErrors = [];
socket.addEventListener("message", event => {
  const data = JSON.parse(event.data);
  if (data.id) { const task = pending.get(data.id); pending.delete(data.id); if (data.error) task?.reject(data.error); else task?.resolve(data.result); }
  if (data.method === "Runtime.exceptionThrown") runtimeErrors.push(data.params.exceptionDetails.text + ": " + (data.params.exceptionDetails.exception?.description ?? ""));
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function ready(locale, pathname) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if (await evaluate(`document.readyState === 'complete' && document.documentElement.lang === ${JSON.stringify(locale)} && location.pathname === ${JSON.stringify(pathname)}`)) { await delay(100); return; }
    } catch { /* A full document navigation temporarily replaces the execution context. */ }
    await delay(50);
  }
  throw Error(`Navigation timed out: ${locale} ${pathname}`);
}
const { locales, localizedPath } = loadModule("src/lib/i18n/config.ts");
const { publicPaths } = loadModule("src/lib/i18n/routes.ts");
const dictionary = locale => JSON.parse(fs.readFileSync(`messages/${locale}.json`, "utf8"));
async function navigate(route, locale) { const url = localizedPath(route, locale); await send("Page.navigate", { url: base + url }); await ready(locale, url.split(/[?#]/)[0]); }
async function switchLocale(locale, pathname) {
  await evaluate(`(()=>{const select=document.querySelector('header select'); select.value=${JSON.stringify(locale)}; select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await ready(locale, localizedPath(pathname, locale));
}
async function clickText(text) {
  assert.ok(await evaluate(`(()=>{const target=[...document.querySelectorAll('button')].find(item=>item.textContent.trim()===${JSON.stringify(text)});if(!target)return false;target.click();return true;})()`), `Missing button: ${text}`);
  await delay(100);
}
await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.clearBrowserCookies");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
try {
  await navigate("/tienda/taza-biblioteca?utm_source=qa#piece", "es");
  await evaluate("localStorage.removeItem('alhua-cart')");
  await send("Page.reload");
  await ready("es", "/tienda/taza-biblioteca");
  await clickText(dictionary("es")["Agregar al carrito"]);
  const originalCart = await evaluate("JSON.parse(localStorage.getItem('alhua-cart'))");
  assert.equal(originalCart[0].quantity, 1);
  let current = "es";
  for (const locale of locales) {
    await switchLocale(locale, "/tienda/taza-biblioteca");
    current = locale;
    assert.equal(await evaluate("location.search + location.hash"), "?utm_source=qa#piece");
    assert.deepEqual(await evaluate("JSON.parse(localStorage.getItem('alhua-cart'))"), originalCart);
    assert.equal(await evaluate("localStorage.getItem('yanina-locale')"), locale);
    await evaluate(`[...document.querySelectorAll('button')].find(item=>item.getAttribute('aria-label')===${JSON.stringify(dictionary(locale)["Abrir carrito"])}&&item.getBoundingClientRect().width>0).click()`);
    await delay(100);
    const drawer = await evaluate("document.querySelector('aside[role=dialog]').innerText");
    assert.ok(await evaluate("document.querySelector('aside[role=dialog]').getBoundingClientRect().height >= innerHeight - 1"), `${locale}: cart covers viewport`);
    assert.ok(drawer.includes(dictionary(locale)["Tu seleccion"]), `${locale}: cart translation`);
    const checkoutPath = localizedPath("/checkout", locale);
    await evaluate(`document.querySelector('aside[role=dialog] a[href="${checkoutPath}"]').click()`);
    await ready(locale, checkoutPath);
    const checkout = await evaluate("document.querySelector('main').innerText");
    assert.ok(checkout.includes("Taza Biblioteca"), `${locale}: cart survived navigation`);
    assert.ok(checkout.includes(dictionary(locale)["Resumen de compra"]));
    const message = await evaluate("new URL(document.querySelector('main a[href^=\"https://wa.me/\"]').href).searchParams.get('text')");
    assert.ok(message.includes("Taza Biblioteca") && message.includes("ARS"));
    await navigate("/experiencias/barro-mates-y-encuentros", locale);
    const experienceMessage = await evaluate("new URL(document.querySelector('main a[href^=\"https://wa.me/\"]').href).searchParams.get('text')");
    assert.ok(experienceMessage.includes("35") && experienceMessage.includes("USD"));
    await navigate("/tienda/taza-biblioteca?utm_source=qa#piece", locale);
    console.log(`PASS browser flow: ${locale}, product → cart → checkout/WhatsApp; experience enquiry; preference and cart persistence.`);
  }
  // All locale transitions retain the exact detail, query and fragment.
  for (const locale of locales) { await switchLocale(locale, "/tienda/taza-biblioteca"); assert.equal(await evaluate("location.search + location.hash"), "?utm_source=qa#piece"); }
  assert.equal(await evaluate("document.documentElement.lang"), locales.at(-1));
  // Mobile, tablet and desktop coverage for every public route in each language.
  let pages = 0;
  for (const locale of locales) {
    for (const width of [375, 768, 1440]) {
      await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 768 });
      // Explicitly choose Spanish before an unprefixed URL to avoid preference redirects.
      await send("Network.setCookie", { name: "yanina-locale", value: locale, url: base, path: "/" });
      for (const route of publicPaths) {
        await navigate(route, locale);
        const dimensions = await evaluate("({scroll:document.documentElement.scrollWidth,width:innerWidth})");
        assert.ok(dimensions.scroll <= dimensions.width + 1, `${locale} ${route} @ ${width}: horizontal overflow ${JSON.stringify(dimensions)}`);
        pages++;
      }
    }
    await navigate("/", locale);
    await evaluate("document.querySelector('#newsletter-email').value='invalid';document.querySelector('#newsletter-email').form.requestSubmit()");
    await delay(100);
    assert.equal(await evaluate("document.querySelector('#newsletter-status').textContent"), dictionary(locale)["Ingresá un email válido."]);
    await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 1000, deviceScaleFactor: 1, mobile: true });
    await evaluate("document.querySelector('button[aria-controls=\"mobile-navigation\"]').click()");
    await delay(100);
    assert.equal(await evaluate("document.querySelector('#mobile-navigation select').options.length"), 6);
    await evaluate(`[...document.querySelectorAll('button')].find(item=>item.getAttribute('aria-label')===${JSON.stringify(dictionary(locale)["Abrir carrito"])}&&item.getBoundingClientRect().width>0).click()`);
    await delay(100);
    assert.ok(await evaluate("document.querySelector('aside[role=dialog]').getBoundingClientRect().height >= innerHeight - 1"), `${locale}: mobile cart covers viewport`);
    console.log(`PASS responsive: ${locale}, all 22 paths at 375/768/1440 px, mobile menu and localized form validation.`);
  }
  assert.deepEqual(runtimeErrors, [], "Browser runtime exceptions");
  const screenshots = path.join(os.tmpdir(), "yanina-i18n-qa");
  fs.mkdirSync(screenshots, { recursive: true });
  for (const [locale, route, width] of [["de", "/", 375], ["fr", "/experiencias/barro-mates-y-encuentros", 1440], ["ko", "/tienda/vasija-puntas", 375], ["zh-CN", "/contacto", 375]]) {
    await send("Network.setCookie", { name: "yanina-locale", value: locale, url: base, path: "/" });
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 768 });
    await navigate(route, locale);
    const capture = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    fs.writeFileSync(path.join(screenshots, `${locale}-${width}.png`), Buffer.from(capture.data, "base64"));
  }
  console.log(`PASS: ${pages} responsive page checks. Screenshots: ${screenshots}. Last flow locale: ${current}.`);
} finally { socket.close(); }
