const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');
const { glob } = require('glob');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const PARTIALS_DIR = path.join(SRC_DIR, 'partials');
const LAYOUTS_DIR = path.join(SRC_DIR, 'layouts');
const DATA_DIR = path.join(SRC_DIR, 'data');

// Ensure dist directory exists
fs.ensureDirSync(DIST_DIR);

// Register Handlebars helpers
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('year', function() {
  return new Date().getFullYear();
});

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context, null, 2);
});

Handlebars.registerHelper('times', function(n, block) {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += block.fn(i);
  }
  return result;
});

Handlebars.registerHelper('add', function(a, b) {
  return a + b;
});

// Register all partials
function registerPartials() {
  const partialsPattern = path.join(PARTIALS_DIR, '**', '*.hbs').replace(/\\/g, '/');
  const partialFiles = glob.sync(partialsPattern);

  partialFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const partialName = path.relative(PARTIALS_DIR, file).replace(/\.hbs$/, '').replace(/\\/g, '/');
    Handlebars.registerPartial(partialName, content);
    console.log(`✓ Registered partial: ${partialName}`);
  });
}

// Load global data
function loadGlobalData() {
  const dataFile = path.join(DATA_DIR, 'site.json');
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }
  return {};
}

// Compile a page
function compilePage(pagePath, globalData) {
  const pageContent = fs.readFileSync(pagePath, 'utf8');

  // Extract frontmatter if exists
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = pageContent.match(frontmatterRegex);

  let frontmatter = {};
  let content = pageContent;

  if (match) {
    try {
      frontmatter = JSON.parse(match[1]);
      content = match[2];
    } catch (e) {
      console.warn(`Warning: Failed to parse frontmatter in ${pagePath}`);
    }
  }

  // Compile page template
  const template = Handlebars.compile(content);
  const pageData = { ...globalData, ...frontmatter, page: frontmatter };
  let html = template(pageData);

  // Apply layout if specified
  if (frontmatter.layout) {
    const layoutPath = path.join(LAYOUTS_DIR, `${frontmatter.layout}.hbs`);
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      const layoutTemplate = Handlebars.compile(layoutContent);
      html = layoutTemplate({ ...pageData, content: html });
    }
  }

  // Determine output path
  const relativePath = path.relative(PAGES_DIR, pagePath);
  let outputPath = path.join(DIST_DIR, relativePath.replace(/\.hbs$/, '.html'));

  // For non-index pages, create directory-based structure (e.g., page.html → page/index.html)
  // This allows URLs like /page/ to work instead of /page.html
  const fileName = path.basename(outputPath);
  if (fileName !== 'index.html') {
    const dirName = fileName.replace(/\.html$/, '');
    const parentDir = path.dirname(outputPath);
    outputPath = path.join(parentDir, dirName, 'index.html');
  }

  // Ensure output directory exists
  fs.ensureDirSync(path.dirname(outputPath));

  // Write file
  fs.writeFileSync(outputPath, html);
  console.log(`✓ Built: ${relativePath} → ${path.relative(DIST_DIR, outputPath)}`);
}

// Copy HTML files (non-template files)
function copyHtmlFiles() {
  const htmlPattern = path.join(PAGES_DIR, '**', '*.html').replace(/\\/g, '/');
  const htmlFiles = glob.sync(htmlPattern);

  htmlFiles.forEach(file => {
    const relativePath = path.relative(PAGES_DIR, file);
    const fileName = path.basename(file);
    const dirName = fileName.replace(/\.html$/, '');
    const parentDir = path.dirname(path.join(DIST_DIR, relativePath));
    const outputPath = path.join(parentDir, dirName, 'index.html');

    // Ensure output directory exists
    fs.ensureDirSync(path.dirname(outputPath));

    // Copy file
    fs.copyFileSync(file, outputPath);
    console.log(`✓ Copied: ${relativePath} → ${path.relative(DIST_DIR, outputPath)}`);
  });

  return htmlFiles.length;
}

// Build all pages
async function build() {
  console.log('\n🚀 Building static site...\n');

  try {
    // Register partials
    if (fs.existsSync(PARTIALS_DIR)) {
      registerPartials();
    }

    // Load global data
    const globalData = loadGlobalData();
    console.log(`✓ Loaded global data\n`);

    // Find all page files
    const pagesPattern = path.join(PAGES_DIR, '**', '*.hbs').replace(/\\/g, '/');
    const pageFiles = glob.sync(pagesPattern);

    if (pageFiles.length === 0) {
      console.warn('⚠️  No page files found in src/pages/');
      return;
    }

    // Compile each page
    console.log('📄 Building pages:\n');
    pageFiles.forEach(file => compilePage(file, globalData));

    // Copy HTML files
    console.log('\n📄 Copying HTML files:\n');
    const htmlCount = copyHtmlFiles();

    console.log(`\n✅ Build complete! Generated ${pageFiles.length} page(s) and copied ${htmlCount} HTML file(s)\n`);
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run build
build();
