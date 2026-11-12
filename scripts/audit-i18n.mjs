import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const cache = new Map();
export function loadModule(filename) {
  const resolved = path.resolve(root, filename);
  if (cache.has(resolved)) return cache.get(resolved).exports;
  const loaded = { exports: {} };
  cache.set(resolved, loaded);
  const source = ts.transpileModule(fs.readFileSync(resolved, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText;
  const localRequire = name => {
    if (!name.startsWith(".") && !name.startsWith("@/")) return require(name);
    const candidate = name.startsWith("@/") ? path.join(root, "src", name.slice(2)) : path.resolve(path.dirname(resolved), name);
    if (candidate.endsWith(".json")) return JSON.parse(fs.readFileSync(candidate, "utf8"));
    return loadModule(candidate.endsWith(".ts") ? candidate : candidate + ".ts");
  };
  new Function("require", "module", "exports", source)(localRequire, loaded, loaded.exports);
  return loaded.exports;
}

const { locales, localizedPath, unprefixedPath, formatMoney } = loadModule("src/lib/i18n/config.ts");
const dictionaries = Object.fromEntries(locales.map(locale => [locale, JSON.parse(fs.readFileSync(`messages/${locale}.json`, "utf8"))]));
const keys = Object.keys(dictionaries.es).sort();
const placeholders = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
for (const locale of locales) {
  assert.deepEqual(Object.keys(dictionaries[locale]).sort(), keys, `${locale}: key parity`);
  for (const key of keys) {
    const value = dictionaries[locale][key];
    assert.equal(typeof value, "string");
    assert.ok(value.trim(), `${locale}: empty ${key}`);
    assert.ok(!/\uFFFD|TODO|TRANSLATE|lorem ipsum/i.test(value), `${locale}: placeholder ${key}`);
    assert.deepEqual(placeholders(value), placeholders(dictionaries.es[key]), `${locale}: interpolation ${key}`);
    if (locale !== "es" && value === dictionaries.es[key]) {
      assert.ok(["Subtotal", "Total", "Contacto", "Contact", "Email", "Video", "Checkout", "Argentina", "Salta, Argentina", "Salta · Argentina", "de", "disponibles", "{count} disponibles"].includes(key), `${locale}: untranslated ${key}`);
    }
  }
}

const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const textExemptions = new Set(["Yanina Cardozo", "WhatsApp", "x", "USD", "←", "+"]);
const violations = [];
for (const file of [...files("src/components"), ...files("src/views"), ...files("src/app")].filter(file => file.endsWith(".tsx"))) {
  // The private administration is explicitly Spanish-only; public coverage stays mandatory.
  if (file.split(path.sep).includes("admin")) continue;
  const source = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isJsxText(node)) {
      const value = node.text.replace(/\s+/g, " ").trim();
      if (/[\p{L}]/u.test(value) && !textExemptions.has(value)) violations.push(`${file}: literal JSX text: ${value}`);
    }
    if (ts.isJsxAttribute(node) && ["aria-label", "title", "placeholder", "alt", "label", "description", "eyebrow"].includes(node.name.getText(ast)) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const value = node.initializer.text;
      if (value && !textExemptions.has(value)) violations.push(`${file}: literal attribute: ${value}`);
    }
    if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(keys.includes(node.arguments[0].text), `${file}: missing key ${node.arguments[0].text}`);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  if (source.includes('from "next/link"') && !file.endsWith("LanguageSwitcher.tsx")) violations.push(`${file}: bypasses localized navigation`);
}
assert.deepEqual(violations, []);

const { getProducts, productRecords } = loadModule("src/data/products.ts");
const { getWorkshops, workshopRecords } = loadModule("src/data/workshops.ts");
const { getExperiences } = loadModule("src/data/experiences.ts");
const contact = loadModule("src/lib/contact.ts");
const { publicPaths, routeMetadata } = loadModule("src/lib/i18n/routes.ts");
for (const locale of locales) {
  assert.equal(getProducts(locale).length, productRecords.length);
  assert.equal(getWorkshops(locale).length, workshopRecords.length);
  assert.equal(getExperiences(locale).find(item => item.slug === "barro-mates-y-encuentros").priceUSD, 35);
  for (const product of getProducts(locale)) {
    const original = productRecords.find(item => item.id === product.id);
    for (const field of ["id", "slug", "name", "priceARS", "priceUSD", "stock", "images", "category"]) assert.deepEqual(product[field], original[field]);
  }
  for (const workshop of getWorkshops(locale)) {
    const original = workshopRecords.find(item => item.id === workshop.id);
    for (const field of ["id", "slug", "priceARS", "priceUSD", "availableSpots", "image"]) assert.deepEqual(workshop[field], original[field]);
  }
  const product = getProducts(locale)[0], workshop = getWorkshops(locale)[0], experience = getExperiences(locale)[0];
  const messages = [dictionaries[locale]["Hola Yanina, quiero hacer una consulta."], contact.productWhatsAppMessage(product, locale), contact.workshopWhatsAppMessage(workshop, locale), contact.experienceWhatsAppMessage(experience, locale), contact.checkoutWhatsAppMessage([{ product, quantity: 2 }], product.priceARS * 2, locale)];
  for (const message of messages) {
    const url = new URL(contact.whatsappHref(message));
    assert.equal(url.pathname, "/5493874669134");
    assert.equal(url.searchParams.get("text"), message);
    assert.ok(!/\{\w+\}/.test(message));
  }
  assert.ok(messages[3].includes(formatMoney(35, "USD", locale)));
  for (const route of publicPaths) {
    const target = localizedPath(route, locale);
    assert.equal(localizedPath(target, locale), target);
    for (const destination of locales) assert.equal(localizedPath(target, destination), localizedPath(route, destination));
    assert.ok(routeMetadata(route, locale).description);
  }
}
assert.equal(localizedPath("/en/tienda/vasija-puntas?utm_source=hotel#details", "fr"), "/fr/tienda/vasija-puntas?utm_source=hotel#details");
assert.equal(localizedPath("https://wa.me/5493874669134", "ko"), "https://wa.me/5493874669134");
console.log(`PASS: ${keys.length} messages × ${locales.length} locales; placeholder parity; JSX/attribute audit; catalog invariants; WhatsApp; ${publicPaths.length} paths × 6 locale transitions.`);

if (process.argv.includes("--http")) {
  const base = process.env.TEST_BASE_URL || "http://localhost:3105";
  let count = 0;
  for (const locale of locales) {
    for (const route of publicPaths) {
      const url = localizedPath(route, locale);
      const response = await fetch(base + url);
      assert.equal(response.status, 200, url);
      const html = await response.text();
      assert.ok(html.includes(`<html lang="${locale}"`), `${url}: html lang`);
      assert.ok(html.includes(`hrefLang="${locale}"`) || html.includes(`hreflang="${locale}"`), `${url}: hreflang`);
      const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
      if (locale !== "es") assert.ok(!visible.includes(">Tienda<") && !visible.includes(">Agregar al carrito<"), `${url}: Spanish UI leak`);
      assert.ok(!visible.includes("localhost:3000"), `${url}: fabricated canonical origin`);
      for (const match of visible.matchAll(/<a\b[^>]*href="(\/[^"#]*)"/g)) {
        const link = new URL(match[1].replaceAll("&amp;", "&"), base);
        assert.ok(publicPaths.includes(unprefixedPath(link.pathname)), `${url}: broken internal link ${link.pathname}`);
        assert.equal(link.pathname, localizedPath(unprefixedPath(link.pathname), locale), `${url}: link lost locale ${link.pathname}`);
      }
      count++;
    }
    const missing = await fetch(base + localizedPath("/no-existe", locale));
    assert.equal(missing.status, 404, `${locale}: missing route`);
    assert.ok((await missing.text()).includes(dictionaries[locale]["Página no encontrada"]), `${locale}: localized 404`);
  }
  const campaign = await fetch(base + "/fr/experiencias/barro-mates-y-encuentros?utm_source=hotel&utm_medium=referral");
  assert.equal(campaign.status, 200);
  const preference = await fetch(base + "/tienda/taza-biblioteca?utm_source=hotel", { headers: { Cookie: "yanina-locale=fr" }, redirect: "manual" });
  assert.equal(preference.status, 307);
  assert.equal(new URL(preference.headers.get("location"), base).pathname, "/fr/tienda/taza-biblioteca");
  assert.equal(new URL(preference.headers.get("location"), base).search, "?utm_source=hotel");
  console.log(`PASS: ${count} localized pages, HTML languages, hreflang, metadata, legacy paths, six localized 404s, UTM and preference redirect.`);
}
