# Grokipedia Wiki

Independent third-party analysis platform for comparing Grokipedia and Wikipedia.

## Features

- ✅ Pure static HTML (SEO-friendly)
- ✅ Tailwind CSS for styling
- ✅ Handlebars templating
- ✅ GSAP animations
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Optimized build process

## Project Structure

```
grokipediawiki/
├── src/
│   ├── pages/              # Page templates (.hbs)
│   ├── partials/           # Reusable components (header, footer, etc.)
│   ├── layouts/            # Layout templates
│   ├── assets/
│   │   ├── css/            # Stylesheets
│   │   ├── js/             # JavaScript files
│   │   ├── images/         # Images
│   │   └── fonts/          # Fonts
│   └── data/               # JSON data files
├── dist/                   # Built static site (generated)
├── public/                 # Static files (copied as-is)
├── scripts/                # Build scripts
├── build.js                # Main build script
├── package.json            # Dependencies
└── tailwind.config.js      # Tailwind configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Install Tailwind CSS animate plugin
npm install -D tailwindcss-animate
```

### Development

```bash
# Start development server with watch mode
npm run dev
```

This will:
- Watch for changes in `src/` directory
- Automatically rebuild HTML from Handlebars templates
- Compile Tailwind CSS
- Start live-server at http://localhost:3000

### Building for Production

```bash
# Build static site
npm run build
```

This will:
1. Clean the `dist/` directory
2. Compile Handlebars templates to HTML
3. Build and minify Tailwind CSS
4. Copy all assets
5. Optimize images (convert to WebP)
6. Minify HTML and JavaScript

### Project Commands

```bash
npm run dev              # Development mode with hot reload
npm run build            # Production build
npm run build:clean      # Clean dist directory
npm run build:handlebars # Compile Handlebars only
npm run build:tailwind   # Compile Tailwind CSS only
npm run build:assets     # Copy assets only
npm run build:optimize   # Optimize build (minify)
```

## Adding New Pages

1. Create a new `.hbs` file in `src/pages/`
2. Add frontmatter with page metadata:

```handlebars
---
{
  "layout": "main",
  "title": "Page Title",
  "description": "Page description for SEO",
  "path": "/page-path/"
}
---

<h1>Your content here</h1>
```

3. The build system will automatically generate the HTML file

## Handlebars Helpers

Available helpers in templates:

- `{{year}}` - Current year
- `{{eq a b}}` - Equality check
- `{{times n}}` - Loop n times
- `{{json data}}` - Output JSON

## Deployment

The `dist/` folder contains the complete static site. Deploy to:

- **Cloudflare Pages**: Connect to Git repo, build command: `npm run build`, output dir: `dist`
- **Vercel**: Same as above
- **Netlify**: Same as above
- **GitHub Pages**: Push `dist/` contents to `gh-pages` branch
- **Any static host**: Upload `dist/` folder contents

## SEO Optimization

- All pages include comprehensive meta tags
- Structured data (JSON-LD) for rich snippets
- Semantic HTML5 markup
- Sitemap.xml (generate before deployment)
- robots.txt included

## Performance

- Optimized images (WebP format)
- Minified CSS and JavaScript
- Critical CSS inlined (optional)
- Lazy loading for images
- GSAP for smooth animations

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License

## Credits

Built with:
- [Tailwind CSS](https://tailwindcss.com/)
- [Handlebars](https://handlebarsjs.com/)
- [GSAP](https://greensock.com/gsap/)
- Design inspired by [ShipAny](https://shipany.ai/)
