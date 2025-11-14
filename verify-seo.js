const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('\n🔍 SEO Verification Report\n');
console.log('='.repeat(60));

// 1. Check for canonical tags in all HTML files
console.log('\n1. Checking Canonical Tags...\n');

const htmlFiles = glob.sync('dist/**/index.html');
let missingCanonical = [];
let wrongCanonicalFormat = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)"/);

  if (!canonicalMatch) {
    missingCanonical.push(file);
  } else {
    const canonicalUrl = canonicalMatch[1];
    // Check if canonical URL ends with .html (wrong format)
    if (canonicalUrl.includes('.html')) {
      wrongCanonicalFormat.push({ file, url: canonicalUrl });
    }
  }
});

if (missingCanonical.length === 0) {
  console.log('✅ All pages have canonical tags');
} else {
  console.log(`❌ ${missingCanonical.length} pages missing canonical tags:`);
  missingCanonical.forEach(f => console.log(`   - ${f}`));
}

if (wrongCanonicalFormat.length === 0) {
  console.log('✅ All canonical URLs use correct format (no .html)');
} else {
  console.log(`\n❌ ${wrongCanonicalFormat.length} pages have .html in canonical URL:`);
  wrongCanonicalFormat.forEach(({ file, url }) => {
    console.log(`   - ${file}`);
    console.log(`     URL: ${url}`);
  });
}

// 2. Verify sitemap URLs match actual files
console.log('\n\n2. Checking Sitemap URLs...\n');

const sitemapPath = 'dist/sitemap.xml';
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

  let missingPages = [];
  let urlFormatIssues = [];

  urls.forEach(url => {
    // Check if URL has .html extension (wrong format)
    if (url.includes('.html')) {
      urlFormatIssues.push(url);
    }

    // Convert URL to file path
    const urlPath = url.replace('https://grokipediawiki.com', '');
    let filePath;

    if (urlPath === '/' || urlPath === '') {
      filePath = 'dist/index.html';
    } else if (urlPath.endsWith('/')) {
      filePath = `dist${urlPath}index.html`;
    } else {
      filePath = `dist${urlPath}/index.html`;
    }

    if (!fs.existsSync(filePath)) {
      missingPages.push({ url, expectedPath: filePath });
    }
  });

  console.log(`📄 Total URLs in sitemap: ${urls.length}`);

  if (urlFormatIssues.length === 0) {
    console.log('✅ All sitemap URLs use correct format');
  } else {
    console.log(`\n❌ ${urlFormatIssues.length} URLs in sitemap have .html extension:`);
    urlFormatIssues.slice(0, 5).forEach(url => console.log(`   - ${url}`));
    if (urlFormatIssues.length > 5) {
      console.log(`   ... and ${urlFormatIssues.length - 5} more`);
    }
  }

  if (missingPages.length === 0) {
    console.log('✅ All sitemap URLs have corresponding files');
  } else {
    console.log(`\n❌ ${missingPages.length} URLs in sitemap don't have files:`);
    missingPages.forEach(({ url, expectedPath }) => {
      console.log(`   - ${url}`);
      console.log(`     Expected: ${expectedPath}`);
    });
  }
} else {
  console.log('❌ Sitemap not found at dist/sitemap.xml');
}

// 3. Check for meta descriptions
console.log('\n\n3. Checking Meta Descriptions...\n');

let missingDescription = [];
let shortDescription = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const descMatch = content.match(/<meta name="description" content="([^"]+)"/);

  if (!descMatch) {
    missingDescription.push(file);
  } else if (descMatch[1].length < 50) {
    shortDescription.push({ file, length: descMatch[1].length });
  }
});

if (missingDescription.length === 0) {
  console.log('✅ All pages have meta descriptions');
} else {
  console.log(`⚠️  ${missingDescription.length} pages missing meta descriptions`);
}

if (shortDescription.length === 0) {
  console.log('✅ All meta descriptions are adequate length (≥50 chars)');
} else {
  console.log(`⚠️  ${shortDescription.length} pages have short descriptions (<50 chars)`);
}

// 4. Check robots.txt
console.log('\n\n4. Checking robots.txt...\n');

const robotsPath = 'dist/robots.txt';
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  console.log('✅ robots.txt exists');

  if (robots.includes('Sitemap:')) {
    console.log('✅ robots.txt includes sitemap reference');
  } else {
    console.log('⚠️  robots.txt missing sitemap reference');
  }

  if (robots.includes('Disallow:')) {
    const disallowCount = (robots.match(/Disallow:/g) || []).length;
    console.log(`ℹ️  robots.txt has ${disallowCount} Disallow rule(s)`);
  }
} else {
  console.log('❌ robots.txt not found');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Summary\n');

const issues = [];
if (missingCanonical.length > 0) issues.push(`${missingCanonical.length} missing canonical tags`);
if (wrongCanonicalFormat.length > 0) issues.push(`${wrongCanonicalFormat.length} wrong canonical format`);
if (missingDescription.length > 0) issues.push(`${missingDescription.length} missing descriptions`);

if (issues.length === 0) {
  console.log('🎉 No critical SEO issues found!');
  console.log('\n✅ Your site is ready for deployment');
  console.log('\nNext steps:');
  console.log('1. Deploy to production');
  console.log('2. Submit sitemap to Google Search Console');
  console.log('3. Request re-indexing for updated pages');
} else {
  console.log('⚠️  Issues found:');
  issues.forEach(issue => console.log(`   - ${issue}`));
  console.log('\nReview the details above and fix the issues before deploying.');
}

console.log('\n' + '='.repeat(60) + '\n');
