import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { identify, collectionGroup } from './process-collections.mjs';
assert.deepEqual(identify('Obra 1_1.JPG').numbers, [1, 1]);
assert.equal(identify('Obra 1_1.JPG').slug, 'obra');
assert.equal(identify('AROS_collares10.JPEG').slug, 'aros-collares');
assert.equal(identify('aros collares2.png').numbers[0], 2);
assert.equal(identify('Obra 2_editada.webp').edited, true);
assert.notEqual(identify('pichuda2.png').slug, identify('pinchuda1.png').slug);
assert.equal(collectionGroup(identify('pichuda2.png').slug), 'el-beso');
const manifest = JSON.parse(await fs.readFile('src/data/collections-manifest.json', 'utf8'));
const names = new Set(), targets = new Set(), inventory = [];
assert.equal(manifest.collections.length, 15);
assert.equal(manifest.collections.filter(collection => collection.published).length, 14);
assert.ok(!manifest.collections.some(collection => ['bocadeloca', 'pinchuda', 'pichuda', 'obra'].includes(collection.slug)));
const kiss = manifest.collections.find(collection => collection.slug === 'el-beso');
assert.deepEqual(kiss.images.map(image => image.originalName), ['bocadeloca.png', 'pinchuda1.png', 'pichuda2.png']);
assert.equal(new Set(kiss.images.map(image => image.sourceHash)).size, kiss.images.length);
assert.equal(manifest.collections.find(collection => collection.slug === 'aros-collares').published, false);
for (const collection of manifest.collections) {
  assert.ok(collection.images.some(image => image.id === collection.cover));
  for (const image of collection.images) {
    assert.ok(!names.has(image.originalName)); names.add(image.originalName);
    const original = await fs.readFile(path.join('public/colecciones', image.originalName));
    assert.equal(createHash('sha256').update(original).digest('hex'), image.sourceHash, 'Original unchanged');
    const metadata = await sharp(original).metadata();
    inventory.push({ file: image.originalName, format: metadata.format, width: metadata.width, height: metadata.height, orientation: metadata.orientation ?? 1, bytes: original.length });
    const oriented = metadata.autoOrient ?? { width: metadata.width, height: metadata.height };
    for (const output of [image.src, image.thumbnail]) {
      assert.ok(!targets.has(output)); targets.add(output);
      const converted = await sharp(path.join('public', output)).metadata();
      assert.equal(converted.format, 'webp');
      assert.ok(converted.width <= oriented.width && converted.height <= oriented.height);
      assert.ok(Math.abs(converted.width / converted.height - oriented.width / oriented.height) < 0.015);
      await sharp(path.join('public', output)).raw().toBuffer();
    }
  }
}
const excluded = (await fs.readdir('public/colecciones')).filter(name => identify(name).slug === 'obra');
assert.equal(excluded.length, 5);
assert.equal(names.size + excluded.length, manifest.found);
assert.ok(excluded.every(name => !names.has(name)));
const duplicate = await fs.readFile('public/colecciones/Obra 4.jpg');
const retained = manifest.collections.find(collection => collection.slug === 'soplo-al-sol').images.find(image => image.originalName === 'Vasija silvadora 1.jpg');
assert.equal(createHash('sha256').update(duplicate).digest('hex'), retained.sourceHash);
const aros = manifest.collections.find(c => c.slug === 'aros-collares');
assert.ok(aros.images.findIndex(i => i.originalName === 'aros_collares2.jpg') < aros.images.findIndex(i => i.originalName === 'aros_collares10.jpg'));
console.log(`PASS: grouping, numeric order, ${names.size} source hashes, ${targets.size} decoded WebP files, no collisions, aspect ratios and no upscaling.`);
if (process.argv.includes('--inventory')) console.log(JSON.stringify(inventory));
