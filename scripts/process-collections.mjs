import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
let source = path.join(root, 'public/colecciones');
// Windows is case-insensitive; retain the source folder's actual spelling on Linux too.
try { await fs.access(source); } catch {
  const folders = (await fs.readdir(path.join(root, 'public'), { withFileTypes: true })).filter(entry => entry.isDirectory() && entry.name.toLowerCase() === 'colecciones');
  if (folders.length === 1) source = path.join(root, 'public', folders[0].name);
}
const manifestPath = path.join(root, 'src/data/collections-manifest.json');
const settings = JSON.parse(await fs.readFile(path.join(root, 'src/data/collections-settings.json'), 'utf8'));
const recipe = 'webp-q88-2400-thumb720-auto-orient-srgb-v1';
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const slugify = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
async function walk(dir, prefix = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path.join(dir, entry.name), relative));
    else if (entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name)) files.push(relative);
  }
  return files;
}
export function identify(filename) {
  const stem = path.posix.basename(filename).replace(/\.[^.]+$/, '');
  const edited = /(?:[ _-]+)(editad[ao]|mejorad[ao]|retocad[ao]|edited|enhanced|retouched)(?:[ _-]*\d+)?$/i;
  const clean = stem.replace(edited, '');
  const match = clean.match(/^(.*?)[ _-]*(\d+)(?:[ _-]+(\d+))?$/);
  const base = (match ? match[1] : clean).trim().replace(/[ _-]+/g, ' ');
  return { base, slug: slugify(base), numbers: match ? [Number(match[2]), Number(match[3] ?? 0)] : [0, 0], edited: edited.test(stem), variant: !!match?.[3] };
}
export function collectionGroup(slug) {
  const seen = new Set();
  while (settings[slug]?.mergeInto) {
    if (seen.has(slug)) throw new Error(`Circular collection merge: ${slug}`);
    seen.add(slug);
    slug = settings[slug].mergeInto;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid merge target');
  }
  return slug;
}
async function main() {
  let files;
  try { files = (await walk(source)).sort((a, b) => a.localeCompare(b, 'es', { numeric: true })); }
  catch (error) {
    if (error.code === 'ENOENT') throw new Error('Falta public/colecciones. No se usará otra carpeta ni se modificará el manifiesto existente.');
    throw error;
  }
  let previous = { collections: [] };
  try { previous = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const cached = new Map(previous.collections.flatMap(c => c.images.map(i => [i.originalName, i])));
  const groups = new Map(), errors = [], warnings = [], content = new Map(), pixels = new Map();
  if (files.some(name => /^hurna/i.test(name))) warnings.push('Hurna: grafia conservada del archivo; confirmar titulo artistico.');
  let reused = 0;
  for (const originalName of files) {
    try {
      const info = identify(originalName);
      if (!info.slug) throw new Error('Nombre sin base identificable; requiere clasificación manual.');
      if (info.variant || info.edited || info.numbers[0] === 0) warnings.push(`${originalName}: numeración alternativa, edición o nombre sin número; conservado para revisión.`);
      const input = await fs.readFile(path.join(source, originalName));
      const digest = hash(input);
      const metadata = await sharp(input).metadata();
      const originalMetadata = { format: metadata.format, width: metadata.width, height: metadata.height, orientation: metadata.orientation ?? 1 };
      if (content.has(digest)) warnings.push(`${originalName}: duplicado binario de ${content.get(digest)}; ambos conservados.`);
      else content.set(digest, originalName);
      const pixelHash = hash(await sharp(input).autoOrient().toColourspace('srgb').removeAlpha().raw().toBuffer());
      if (pixels.has(pixelHash)) warnings.push(`${originalName}: mismos píxeles que ${pixels.get(pixelHash)}; ambos conservados.`);
      else pixels.set(pixelHash, originalName);
      const id = hash(originalName).slice(0, 16);
      const basename = `${slugify(path.posix.basename(originalName).replace(/\.[^.]+$/, ''))}-${id}-${digest.slice(0, 10)}`;
      const relative = `/images/collections/${info.slug}/${basename}.webp`;
      const thumbnail = `/images/collections/${info.slug}/${basename}-thumb.webp`;
      const target = path.join(root, 'public', relative);
      const thumbTarget = path.join(root, 'public', thumbnail);
      const old = cached.get(originalName);
      let image;
      if (old?.sourceHash === digest && old.recipe === recipe && old.src === relative && old.thumbnail === thumbnail && await fs.stat(target).then(() => true, () => false) && await fs.stat(thumbTarget).then(() => true, () => false)) {
        image = old; reused++;
      } else {
        await fs.mkdir(path.dirname(target), { recursive: true });
        const pipeline = () => sharp(input).autoOrient().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).withIccProfile('srgb').webp({ quality: 88, effort: 6 });
        const result = await pipeline().toFile(target);
        const thumb = await sharp(input).autoOrient().resize({ width: 720, height: 720, fit: 'inside', withoutEnlargement: true }).withIccProfile('srgb').webp({ quality: 88, effort: 6 }).toFile(thumbTarget);
        image = { id, src: relative, thumbnail, originalName, order: 0, width: result.width, height: result.height, alt: '', sourceHash: digest, recipe, originalBytes: input.length, optimizedBytes: result.size, thumbnailBytes: thumb.size };
      }
      const group = collectionGroup(info.slug);
      if (!groups.has(group)) groups.set(group, { base: info.base, images: [] });
      groups.get(group).images.push({ ...image, originalMetadata, sequence: info.numbers });
    } catch (error) { errors.push({ file: originalName, error: error.message }); console.error(originalName, error.message); }
  }
  // Preserve prior valid entries on individual failures; never delete generated photographs.
  for (const error of errors) {
    const old = cached.get(error.file);
    const collection = previous.collections.find(c => c.images.some(i => i.originalName === error.file));
    if (old && collection) {
      const group = collectionGroup(collection.slug);
      if (!groups.has(group)) groups.set(group, { base: collection.name, images: [] });
      groups.get(group).images.push({ ...old, sequence: identify(error.file).numbers });
    }
  }
  const collections = [...groups].map(([slug, group], index) => {
    const override = settings[slug] ?? {};
    const name = override.name ?? ({ 'aros-collares': 'Aros y collares' }[slug] ?? group.base.charAt(0).toLocaleUpperCase('es') + group.base.slice(1));
    const images = group.images.sort((a, b) => a.sequence[0] - b.sequence[0] || a.sequence[1] - b.sequence[1] || a.originalName.localeCompare(b.originalName, 'es', { numeric: true })).map((entry, order) => { const image = { ...entry }; delete image.sequence; return ({ ...image, order: override.imageOrder?.indexOf(image.originalName) >= 0 ? override.imageOrder.indexOf(image.originalName) : (override.imageOrder?.length ?? 0) + order, alt: name }); }).sort((a, b) => a.order - b.order);
    const cover = images.find(i => i.originalName === override.cover)?.id ?? images[0].id;
    if (override.cover && !images.some(i => i.originalName === override.cover)) warnings.push(`${slug}: portada configurada no encontrada; se usa la primera imagen.`);
    return { id: slug, slug, name, cover, order: override.order ?? index, published: override.published ?? true, images };
  }).sort((a, b) => a.order - b.order);
  const all = collections.flatMap(c => c.images);
  const originalBytes = all.reduce((n, i) => n + i.originalBytes, 0);
  const optimizedBytes = all.reduce((n, i) => n + i.optimizedBytes + i.thumbnailBytes, 0);
  const result = { source: 'public/colecciones', recipe, found: files.length, processed: all.length, originalBytes, optimizedBytes, reduction: originalBytes ? (1 - optimizedBytes / originalBytes) * 100 : 0, warnings, errors, collections };
  await fs.writeFile(manifestPath, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ found: files.length, processed: all.length, reused, collections: collections.length, originalBytes, optimizedBytes, reduction: result.reduction, warnings, errors }, null, 2));
  if (errors.length) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) main().catch(error => { console.error(error.message); process.exitCode = 1; });
