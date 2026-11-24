import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { loadModule } from "./audit-i18n.mjs";

const { productRecords, getProducts, getRelatedProducts } = loadModule("src/data/products.ts");
const { canPurchase, cartTotalUSD, reconcileCart } = loadModule("src/lib/cart.ts");
const { checkoutWhatsAppMessage, productWhatsAppMessage } = loadModule("src/lib/contact.ts");
const { publicPaths } = loadModule("src/lib/i18n/routes.ts");
const { locales, formatMoney } = loadModule("src/lib/i18n/config.ts");
const { dictionaries } = loadModule("src/lib/i18n/messages.ts");
const retired = ["luminaria-corteza", "vasija-organica", "vasija-espinas", "vasija-silvadora-ii", "figura-flautista"];
const expected = {
  "vasija-puntas": 300,
  "soplo-al-sol": 150,
  "tambor-ceremonial": 145,
  "luminaria-geometria": 105,
  "fuente-venas": 250,
  derbake: 250,
};

for (const field of ["id", "slug", "artworkId", "name"]) {
  const values = productRecords.map(product => product[field].normalize("NFD")
    .replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, ""));
  assert.ok(values.every(Boolean), `Missing commercial ${field}`);
  assert.equal(new Set(values).size, values.length, `Duplicate commercial ${field}`);
}

const photos = new Map();
for (const product of productRecords) {
  assert.ok(product.images.length, `${product.slug}: no photos`);
  for (const image of product.images) {
    const { data, info } = await sharp(`public${image}`).autoOrient().toColourspace("srgb").ensureAlpha()
      .raw().toBuffer({ resolveWithObject: true });
    const hash = createHash("sha256").update(`${info.width}x${info.height}:`).update(data).digest("hex");
    assert.ok(!photos.has(hash), `Identical image: ${product.slug} (${image}) and ${photos.get(hash)}. Review artwork identity.`);
    photos.set(hash, `${product.slug} (${image})`);
  }
}

const legacyLine = (id, quantity = 1) => ({ product: { id, name: "Nombre antiguo", priceARS: 1, priceUSD: 1 }, quantity });
for (const locale of locales) {
  const products = getProducts(locale);
  assert.deepEqual(Object.fromEntries(products.filter(p => p.priceUSD !== null).map(p => [p.slug, p.priceUSD])), expected);
  for (const slug of retired) {
    assert.ok(!publicPaths.includes(`/tienda/${slug}`));
    assert.ok(!products.some(p => p.slug === slug));
  }
  assert.ok(products.flatMap(p => getRelatedProducts(p, products.length, locale)).every(p => !retired.includes(p.slug)));
  const sold = products.find(p => p.slug === "vasija-puntas");
  assert.equal(sold.stock, 0);
  assert.ok(dictionaries[locale].Vendida);
  const derbake = products.filter(p => p.slug === "derbake");
  assert.equal(derbake.length, 1);
  assert.equal(derbake[0].stock, null);
  assert.match(derbake[0].images[0], /\/derbake\//);
  const taza = products.find(p => p.slug === "taza-biblioteca");
  assert.equal(taza.priceUSD, null);
  assert.ok([sold, derbake[0], taza].every(product => !canPurchase(product)));
  assert.ok(!productWhatsAppMessage(taza, locale).includes("USD"));
  assert.ok(productWhatsAppMessage(derbake[0], locale).includes(formatMoney(250, "USD", locale)));

  const blocked = ["p-001", "p-002", "p-004", "p-008", "p-009", "p-010", "p-011", "missing"].map(id => legacyLine(id));
  const stored = [...blocked, null, legacyLine("p-005", 1.5), legacyLine("p-005"), legacyLine("p-005"), legacyLine("p-006"), legacyLine("p-006", 100)];
  const cart = reconcileCart(JSON.parse(JSON.stringify(stored)), products);
  assert.deepEqual(cart.map(item => [item.product.name, item.product.priceUSD, item.quantity]), [["Soplo al sol", 150, 1], ["Fuente Venas", 250, 2]]);
  assert.equal(cartTotalUSD(cart), 650);
  assert.deepEqual(reconcileCart(cart, products), cart);
  assert.equal(checkoutWhatsAppMessage(blocked, locale), null);
  const message = checkoutWhatsAppMessage(stored, locale);
  for (const amount of [150, 500, 650]) assert.ok(message.includes(formatMoney(amount, "USD", locale)));
  assert.doesNotMatch(message, /ARS|Vasija Puntas|Nombre antiguo|Derbake/);
}
console.log("PASS commerce: confirmed USD prices, availability, legacy carts, checkout and photo/identity uniqueness across six locales.");
