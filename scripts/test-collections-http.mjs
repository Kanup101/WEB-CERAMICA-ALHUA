import assert from "node:assert/strict";
import { loadModule } from "./audit-i18n.mjs";
const { locales, localizedPath } = loadModule("src/lib/i18n/config.ts");
const { getCollections } = loadModule("src/data/collections.ts");
const { getPhotoContent } = loadModule("src/data/artworks.ts");
const { getTranslator } = loadModule("src/lib/i18n/messages.ts");
const { routeMetadata } = loadModule("src/lib/i18n/routes.ts");
const base = process.env.TEST_BASE_URL || "http://localhost:3105";
const escape = text => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
for (const prefix of ["", "/es", "/en", "/de", "/fr", "/ko", "/zh-CN"]) {
  const response = await fetch(base + prefix + "/colecciones/pichuda?utm_source=review", { redirect: "manual" });
  assert.equal(response.status, 308, prefix);
  assert.equal(response.headers.get("location"), `${prefix === "/es" ? "" : prefix}/colecciones/pinchuda?utm_source=review`);
}
for (const locale of locales) {
  const hidden = await fetch(base + localizedPath("/colecciones/aros-collares", locale));
  assert.equal(hidden.status, 404, locale);
  const catalog = await (await fetch(base + localizedPath("/colecciones", locale))).text();
  assert.ok(!catalog.includes('href="' + localizedPath("/colecciones/aros-collares", locale) + '"'));
  assert.ok(!catalog.includes('href="' + localizedPath("/colecciones/pichuda", locale) + '"'));
  for (const collection of getCollections()) {
    const response = await fetch(base + localizedPath(`/colecciones/${collection.slug}`, locale));
    assert.equal(response.status, 200);
    const html = await response.text();
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
  assert.ok(!urls.some(url => /colecciones\/(pichuda|aros-collares)/.test(url)));
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
console.log("PASS HTTP: seven permanent redirects with query strings; six unpublished-route 404s; 40 visual descriptions and alt texts × six languages; sitemap, canonical, hreflang and social covers.");
