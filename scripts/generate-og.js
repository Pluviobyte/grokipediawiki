const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

async function generateOG() {
  const srcSvg = path.join(__dirname, '..', 'src', 'assets', 'images', 'og-grokipedia.svg');
  const outJpg = path.join(__dirname, '..', 'src', 'assets', 'images', 'og-grokipedia.jpg');

  if (!fs.existsSync(srcSvg)) {
    console.error('❌ Source SVG not found:', srcSvg);
    process.exit(1);
  }

  try {
    console.log('🎨 Generating JPG from SVG...');
    const svgBuffer = await fs.readFile(srcSvg);

    await sharp(svgBuffer)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(outJpg);

    console.log('✅ Created:', outJpg);
  } catch (err) {
    console.error('❌ Failed to generate OG JPG:', err.message);
    process.exit(1);
  }
}

generateOG();

