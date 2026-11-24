import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadModule } from "./audit-i18n.mjs";
const { formatMoney, locales, localizedPath } = loadModule("src/lib/i18n/config.ts");
const { getCollections } = loadModule("src/data/collections.ts");
const { getPhotoContent } = loadModule("src/data/artworks.ts");
const { getTranslator } = loadModule("src/lib/i18n/messages.ts");
const { routeMetadata } = loadModule("src/lib/i18n/routes.ts");
const { getProductBySlug } = loadModule("src/data/products.ts");
const settings = JSON.parse(readFileSync(new URL("../src/data/collections-settings.json", import.meta.url), "utf8"));
const renamed = Object.entries(settings).filter(([, setting]) => setting.mergeInto).map(([slug, setting]) => [`/colecciones/${slug}`, `/colecciones/${setting.mergeInto}`]);
renamed.push(["/tienda/vasija-silvadora", "/tienda/soplo-al-sol"]);
const retiredProducts = ["luminaria-corteza", "vasija-organica", "vasija-espinas", "vasija-silvadora-ii", "figura-flautista"];
const base = process.env.TEST_BASE_URL || "http://localhost:3105";
const escape = text => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
for (const prefix of ["", ...locales.map(locale => `/${locale}`)]) {
  for (const [legacy, current] of renamed) {
    const response = await fetch(base + prefix + legacy + "?utm_source=review", { redirect: "manual" });
    assert.equal(response.status, 308, prefix + legacy);
    assert.equal(response.headers.get("location"), `${prefix === "/es" ? "" : prefix}${current}?utm_source=review`);
  }
}
for (const locale of locales) {
  const hidden = await fetch(base + localizedPath("/colecciones/aros-collares", locale));
  assert.equal(hidden.status, 404, locale);
  assert.equal((await fetch(base + localizedPath("/colecciones/obra", locale))).status, 404);
  for (const route of ["/tienda", "/experiencias"]) {
    assert.equal((await fetch(base + localizedPath(route, locale))).status, 200);
  }
  const catalog = await (await fetch(base + localizedPath("/colecciones", locale))).text();
  assert.ok(!catalog.includes('href="' + localizedPath("/colecciones/aros-collares", locale) + '"'));
  assert.ok(!catalog.includes('href="' + localizedPath("/colecciones/pichuda", locale) + '"'));
  assert.ok(!catalog.includes('href="' + localizedPath("/colecciones/obra", locale) + '"'));
  for (const slug of retiredProducts) {
    assert.equal((await fetch(base + localizedPath(`/tienda/${slug}`, locale), { redirect: "manual" })).status, 404);
  }
  for (const [slug, name, usd] of [
    ["soplo-al-sol", "Soplo al sol", 150],
    ["tambor-ceremonial", "Tambor ceremonial", 145],
    ["derbake", "Derbake", 250],
    ["vasija-puntas", "Vasija Puntas", 300],
    ["luminaria-geometria", "Luminaria Geométrica", 105],
    ["fuente-venas", "Fuente Venas", 250],
  ]) {
    const product = getProductBySlug(slug, locale);
    assert.equal(product.name, name);
    assert.equal(product.priceUSD, usd);
    const response = await fetch(base + localizedPath(`/tienda/${slug}`, locale));
    assert.equal(response.status, 200);
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.ok(html.includes(name));
    assert.ok(html.includes(formatMoney(usd, "USD", locale)));
    if (product.stock === 0 || product.stock === null) {
      const t = getTranslator(locale);
      assert.ok(html.includes(t(product.stock === 0 ? "Vendida" : "Disponibilidad a confirmar")));
      assert.ok(!html.includes(t("Agregar al carrito")));
    }
  }
  for (const collection of getCollections()) {
    const response = await fetch(base + localizedPath(`/colecciones/${collection.slug}`, locale));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`<h1 class="font-brand">${escape(collection.name)}</h1>`));
    for (const image of collection.images) {
      const content = getPhotoContent(image.originalName, getTranslator(locale));
      assert.ok(html.includes(`alt="${escape(content.alt)}"`), `${locale}/${collection.slug}: translated visual alt missing`);
      assert.ok(html.includes(escape(content.description)), `${locale}/${collection.slug}: visual description missing`);
    }
  }
}
const previousOrigin = process.env.NEXT_PUBLIC_SITE_URL;
try {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
  const entries = loadModule("src/app/sitemap.ts").default();
  const urls = entries.map(entry => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  const retired = ["/colecciones/obra", "/colecciones/aros-collares", ...renamed.map(([legacy]) => legacy), ...retiredProducts.map(slug => `/tienda/${slug}`)];
  assert.ok(!urls.some(url => retired.some(route => new URL(url).pathname.endsWith(route))));
  for (const locale of locales) for (const collection of getCollections()) {
    const route = `/colecciones/${collection.slug}`;
    const url = "https://example.test" + localizedPath(route, locale);
    assert.ok(urls.includes(url));
    const metadata = routeMetadata(route, locale);
    assert.equal(metadata.alternates.canonical, url);
    assert.equal(Object.keys(metadata.alternates.languages).length, 6);
    assert.equal(metadata.openGraph.images.length, 1);
  }
} finally {
  if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = previousOrigin;
}
console.log("PASS HTTP: permanent redirects with query strings, unpublished-route 404s, store prices, translated descriptions and alt text, and SEO across six languages.");
