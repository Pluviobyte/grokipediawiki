# OG Image Creation Instructions

## Current Status
✅ SVG version created at: `src/assets/images/og-image.svg`
⚠️ Need JPG version for better social media compatibility

## Creating the JPG version

### Option 1: Using Online Tool (Easiest)
1. Open https://cloudconvert.com/svg-to-jpg
2. Upload `src/assets/images/og-image.svg`
3. Convert with these settings:
   - Width: 1200px
   - Height: 630px
   - Quality: 90%
4. Download and save as `src/assets/images/og-image.jpg`

### Option 2: Using Figma/Photoshop
1. Create new file: 1200x630px
2. Design elements:
   - Background: Dark blue (#0F172A)
   - Main container: Rounded rectangle with dark overlay
   - Logo: "GW" circle with brand color (#6366F1)
   - Title: "Grokipedia Wiki" (56px, bold, white)
   - Subtitle: "Independent Encyclopedia Analysis" (32px, gray)
   - Tagline: "The Unofficial PediaWiki Showdown" (28px, brand color)
   - Stats: "🌟 15+ Deep Analysis • Independent • Objective"
   - URL: "grokipediawiki.com" at bottom
3. Export as JPG (quality 90%)
4. Save to `src/assets/images/og-image.jpg`

### Option 3: Using Canva (Free)
1. Go to https://www.canva.com/
2. Create custom size: 1200 x 630 px
3. Use the design template from SVG
4. Download as JPG
5. Save to `src/assets/images/og-image.jpg`

## Design Specifications

**Required Dimensions**: 1200px × 630px (Facebook/Twitter standard)

**Color Palette**:
- Primary: #6366F1 (Indigo)
- Background: #0F172A (Dark blue)
- Text: #F8FAFC (White)
- Muted: #94A3B8 (Gray)

**Typography**:
- Title: Bold, 56px
- Subtitle: Regular, 32px
- Tagline: Semi-bold, 28px

**Content**:
- Logo/Brand: "GW" or full logo
- Main headline: "Grokipedia Wiki"
- Subtitle: "Independent Encyclopedia Analysis"
- Tagline: "The Unofficial PediaWiki Showdown"
- Trust indicators: Stars, stats
- Domain: "grokipediawiki.com"

## After Creating

1. Place the JPG file at: `src/assets/images/og-image.jpg`
2. Run `npm run build` to include it in dist/
3. Test with:
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Current SVG Reference

The SVG at `src/assets/images/og-image.svg` shows the exact layout. Use it as a reference when creating the JPG version.
