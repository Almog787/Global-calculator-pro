import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve('public/images');

async function optimizeImages() {
  if (!fs.existsSync(imagesDir)) {
    console.log('Images directory not found.');
    return;
  }

  const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpg') || file.endsWith('.png'));

  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const fileNameWithoutExt = path.parse(file).name;
    const outputPath = path.join(imagesDir, `${fileNameWithoutExt}.webp`);

    console.log(`Optimizing: ${file}`);

    // Define resizing logic based on filename
    let transform = sharp(inputPath);
    if (file.includes('hero')) {
      // Hero image max width 1200px
      transform = transform.resize(1200, null, { withoutEnlargement: true });
    } else if (file.includes('cat-')) {
      // Category background images can be much smaller, e.g., 600px width
      transform = transform.resize(600, null, { withoutEnlargement: true });
    }

    await transform
      .webp({ quality: 80 }) // High compression with webp
      .toFile(outputPath);
      
    console.log(`Saved optimized image to: ${outputPath}`);
  }
}

optimizeImages().catch(console.error);
