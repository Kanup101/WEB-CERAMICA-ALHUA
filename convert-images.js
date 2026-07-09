/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "public/images/originales");
const outputDir = path.join(__dirname, "public/images/products");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png"]);

async function convertImages() {
  if (!fs.existsSync(inputDir)) {
    console.error("No existe la carpeta public/images/originales.");
    console.error("Crea esa carpeta y coloca ahi imagenes JPG, JPEG o PNG.");
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);
  const sourceImages = files.filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()));

  if (!sourceImages.length) {
    console.log("No se encontraron imagenes JPG, JPEG o PNG para convertir.");
    return;
  }

  console.log(`Convirtiendo ${sourceImages.length} imagen(es) a WEBP...`);

  for (const file of sourceImages) {
    const ext = path.extname(file).toLowerCase();
    const inputPath = path.join(inputDir, file);
    const outputName = path
      .basename(file, ext)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const outputPath = path.join(outputDir, `${outputName}.webp`);

    await sharp(inputPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath);

    console.log(`OK ${file} -> ${outputName}.webp`);
  }

  console.log(`Listo. Las imagenes optimizadas quedaron en public/images/products.`);
}

convertImages().catch((error) => {
  console.error("Error al convertir imagenes:");
  console.error(error);
  process.exit(1);
});
