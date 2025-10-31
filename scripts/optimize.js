const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const { minify: minifyHTML } = require('html-minifier-terser');
const { minify: minifyJS } = require('terser');
const sharp = require('sharp');

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Minify HTML files
async function minifyHTMLFiles() {
  console.log('🗜️  Minifying HTML files...');

  const htmlFiles = glob.sync(path.join(DIST_DIR, '**/*.html'));

  for (const file of htmlFiles) {
    const content = await fs.readFile(file, 'utf8');
    const minified = await minifyHTML(content, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
    });
    await fs.writeFile(file, minified);
  }

  console.log(`✓ Minified ${htmlFiles.length} HTML file(s)`);
}

// Minify JavaScript files
async function minifyJSFiles() {
  console.log('🗜️  Minifying JavaScript files...');

  const jsFiles = glob.sync(path.join(DIST_DIR, 'assets/js/**/*.js'));

  for (const file of jsFiles) {
    const content = await fs.readFile(file, 'utf8');
    const result = await minifyJS(content, {
      compress: {
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    });

    if (result.code) {
      await fs.writeFile(file, result.code);
    }
  }

  console.log(`✓ Minified ${jsFiles.length} JavaScript file(s)`);
}

// Optimize images
async function optimizeImages() {
  console.log('🖼️  Optimizing images...');

  const imageFiles = glob.sync(path.join(DIST_DIR, 'assets/images/**/*.{jpg,jpeg,png}'));
  let optimized = 0;

  for (const file of imageFiles) {
    const ext = path.extname(file);
    const outputPath = file.replace(ext, '.webp');

    try {
      await sharp(file)
        .webp({ quality: 80 })
        .toFile(outputPath);

      // Keep original and add WebP version
      optimized++;
    } catch (error) {
      console.warn(`⚠️  Failed to optimize ${path.basename(file)}`);
    }
  }

  console.log(`✓ Optimized ${optimized} image(s) to WebP format`);
}

async function optimize() {
  console.log('\n⚡ Optimizing build...\n');

  try {
    await minifyHTMLFiles();
    await minifyJSFiles();
    await optimizeImages();

    console.log('\n✅ Optimization complete!\n');
  } catch (error) {
    console.error('\n❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

optimize();
