import assert from "node:assert/strict";
import { loadModule } from "./audit-i18n.mjs";

const { getCollections, collectionRecords } = loadModule("src/data/collections.ts");
const { artworkRecords, getArtworkForImage, getPhotoContent } = loadModule("src/data/artworks.ts");
const { locales } = loadModule("src/lib/i18n/config.ts");
const { publicPaths } = loadModule("src/lib/i18n/routes.ts");
const { dictionaries, getTranslator } = loadModule("src/lib/i18n/messages.ts");
const ids = new Set(), photographs = new Set();
for (const artwork of artworkRecords) {
  assert.ok(!ids.has(artwork.id), `Duplicate artwork ID: ${artwork.id}`); ids.add(artwork.id);
  assert.ok(collectionRecords.some(collection => collection.slug === artwork.collectionSlug));
  for (const image of artwork.images) {
    assert.ok(!photographs.has(image.originalName), `Image belongs to multiple artworks: ${image.originalName}`);
    photographs.add(image.originalName);
    assert.ok(collectionRecords.some(collection => collection.images.some(photo => photo.originalName === image.originalName)));
    for (const locale of locales) {
      assert.ok(dictionaries[locale][artwork.visualComposition]);
      assert.ok(dictionaries[locale][image.visualDescription]);
      assert.ok(dictionaries[locale][image.alt]);
      const content = getPhotoContent(image.originalName, getTranslator(locale));
      assert.equal(content.alt, dictionaries[locale][image.alt]);
      assert.equal(content.description, dictionaries[locale][image.visualDescription]);
    }
  }
}
let count = 0;
for (const collection of getCollections()) {
  for (const image of collection.images) {
    assert.ok(getArtworkForImage(image.originalName), `Needs visual inspection and translated description before publication: ${image.originalName}`);
    count++;
  }
}
for (const collection of collectionRecords.filter(collection => !collection.published)) {
  assert.ok(!publicPaths.includes(`/colecciones/${collection.slug}`));
}
console.log(`PASS artworks: ${ids.size} artwork records, ${count} public photographs × ${locales.length} languages; no missing descriptions or duplicate artwork/image assignments.`);
