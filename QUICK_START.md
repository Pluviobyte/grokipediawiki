# 🚀 Quick Start Guide

## Immediate Next Steps

### 1. Test Locally (2 minutes)

```bash
cd E:\Desktop\Grokiprediawiki

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser to see the site!

### 2. Deploy to Production (5 minutes)

#### Option A: Cloudflare Pages (Recommended)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Grokipedia Wiki"
   git remote add origin https://github.com/YOUR_USERNAME/grokipediawiki.git
   git push -u origin main
   ```

2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your GitHub repository
4. Configure build:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy!

#### Option B: Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow prompts and set:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3. Configure Domain

Point `grokipediawiki.com` DNS to your hosting provider:

**For Cloudflare Pages:**
- Add CNAME record: `grokipediawiki.com` → `your-site.pages.dev`

**For Vercel:**
- Follow Vercel's domain setup wizard

### 4. Set Up Analytics

1. Get Google Analytics ID from https://analytics.google.com
2. Edit `src/data/site.json`:
   ```json
   {
     "analytics": {
       "enabled": true,
       "googleAnalyticsId": "G-YOUR-ID-HERE"
     }
   }
   ```
3. Rebuild and redeploy: `npm run build`

---

## Customization Checklist

### Before Launch
- [ ] Replace logo.svg with professional design
- [ ] Create og-image.jpg (1200x630px)
- [ ] Update site.json with real social links
- [ ] Add Google Analytics ID
- [ ] Write first 3-5 analysis articles
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit

### Content to Add
- [ ] Replace placeholder analysis cards with real articles
- [ ] Add actual news/blog posts
- [ ] Create about page team bios
- [ ] Define AI toolbox features
- [ ] Write privacy policy and terms

### SEO Setup (Post-launch)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Create social media accounts
- [ ] Set up backlinks strategy
- [ ] Monitor with Google Analytics

---

## Project Structure Quick Reference

```
grokipediawiki/
├── src/
│   ├── pages/           # Edit pages here
│   │   ├── index.hbs    # Homepage
│   │   ├── analysis/    # Analysis section
│   │   ├── news/        # News section
│   │   ├── tools/       # Tools section
│   │   └── about/       # About page
│   ├── partials/        # Reusable components
│   │   ├── header.hbs   # Navigation
│   │   ├── footer.hbs   # Footer
│   │   └── meta-seo.hbs # SEO meta tags
│   ├── layouts/
│   │   └── main.hbs     # Main layout wrapper
│   ├── assets/
│   │   ├── css/
│   │   │   └── input.css   # Styles (Tailwind + custom)
│   │   ├── js/
│   │   │   └── main.js     # Interactions
│   │   └── images/         # Images
│   └── data/
│       └── site.json    # Global site data (EDIT THIS!)
└── dist/                # Build output (auto-generated)
```

---

## Key Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build for production
npm run build            # Full production build

# Individual tasks
npm run build:handlebars # Compile templates only
npm run build:tailwind   # Compile CSS only
npm run build:assets     # Copy assets only

# Clean
npm run build:clean      # Remove dist/ folder
```

---

## Editing Content

### Change Homepage Hero

Edit `src/pages/index.hbs`:

```handlebars
<h1 class="heading-1 animate-in delay-100 mb-6">
  <span class="block">Your Main Heading</span>
  <span class="text-gradient block mt-2">Your Tagline</span>
</h1>
```

### Change Navigation

Edit `src/data/site.json`:

```json
{
  "nav": [
    { "label": "New Link", "href": "/new-page/" }
  ]
}
```

### Add New Page

1. Create `src/pages/new-page/index.hbs`
2. Add frontmatter:
   ```handlebars
   ---
   {
     "layout": "main",
     "title": "Page Title",
     "description": "SEO description",
     "path": "/new-page/"
   }
   ---

   <section>Your content</section>
   ```
3. Run `npm run build`

### Change Colors/Theme

Edit `src/assets/css/input.css`:

```css
:root {
  --primary: 243 75% 59%;  /* Change primary color */
  --background: 0 0% 100%; /* Change background */
}
```

---

## Troubleshooting

### Build fails
```bash
# Clean and rebuild
npm run build:clean
npm install
npm run build
```

### Styles not updating
```bash
# Force recompile Tailwind
npm run build:tailwind
```

### Port 3000 in use
```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Or change port in package.json
# Edit: "dev:server": "live-server dist --port=8080"
```

---

## Performance Tips

- Keep images under 500KB
- Use WebP format for images
- Lazy load images with `class="lazy"`
- Minimize custom JavaScript
- Use Tailwind classes instead of custom CSS

---

## Support Resources

- **Documentation**: README.md
- **Project Summary**: PROJECT_SUMMARY.md
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Handlebars Guide**: https://handlebarsjs.com/guide
- **GSAP Docs**: https://greensock.com/docs

---

## Ready to Launch? ✅

- [x] Code complete
- [x] Build system tested
- [x] SEO optimized
- [x] Responsive design
- [ ] Domain configured
- [ ] Analytics set up
- [ ] Content added
- [ ] Deployed to production

**Your site is ready to deploy!** 🎉

Just add content, configure your domain, and push live!
