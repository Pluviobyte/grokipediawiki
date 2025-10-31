const fs = require('fs-extra');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR = path.join(__dirname, '..', 'dist');

async function copyAssets() {
  console.log('\n📦 Copying assets...\n');

  try {
    // Copy images
    const imagesDir = path.join(SRC_DIR, 'assets', 'images');
    if (fs.existsSync(imagesDir)) {
      await fs.copy(imagesDir, path.join(DIST_DIR, 'assets', 'images'));
      console.log('✓ Copied images');
    }

    // Copy fonts
    const fontsDir = path.join(SRC_DIR, 'assets', 'fonts');
    if (fs.existsSync(fontsDir)) {
      await fs.copy(fontsDir, path.join(DIST_DIR, 'assets', 'fonts'));
      console.log('✓ Copied fonts');
    }

    // Copy JavaScript files
    const jsDir = path.join(SRC_DIR, 'assets', 'js');
    if (fs.existsSync(jsDir)) {
      await fs.copy(jsDir, path.join(DIST_DIR, 'assets', 'js'));
      console.log('✓ Copied JavaScript files');
    }

    // Copy public files (robots.txt, sitemap.xml, etc.)
    const publicDir = path.join(__dirname, '..', 'public');
    if (fs.existsSync(publicDir)) {
      await fs.copy(publicDir, DIST_DIR);
      console.log('✓ Copied public files');
    }

    console.log('\n✅ Assets copied successfully\n');
  } catch (error) {
    console.error('\n❌ Failed to copy assets:', error.message);
    process.exit(1);
  }
}

copyAssets();
