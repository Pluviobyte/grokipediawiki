const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const PAGES_DIR = path.join(__dirname, 'src', 'pages');

// Find all .hbs and .html files in pages directory
const filesPattern = path.join(PAGES_DIR, '**', '*.{hbs,html}').replace(/\\/g, '/');
const files = glob.sync(filesPattern);

let fixedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check if file has frontmatter with path ending in .html
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (match) {
    const frontmatterStr = match[1];

    // Check if path ends with .html"
    if (frontmatterStr.includes('"path":') && frontmatterStr.includes('.html"')) {
      // Replace .html" with /"
      const newContent = content.replace(
        /"path":\s*"([^"]+)\.html"/g,
        '"path": "$1/"'
      );

      if (newContent !== content) {
        fs.writeFileSync(file, newContent);
        const relativePath = path.relative(PAGES_DIR, file);
        console.log(`✓ Fixed: ${relativePath}`);
        fixedCount++;
      }
    }
  }
});

console.log(`\n✅ Fixed ${fixedCount} files with incorrect path configurations`);
