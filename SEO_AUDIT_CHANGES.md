# TextCase SEO & Promotion Audit Changes

Date: 2026-09-18

## Safe SEO fixes
- Preserved all existing landing-page URLs.
- Added a permanent Vercel redirect from the legacy `/fix-copy-paste` URL to `/fix-copy-paste-text`.
- Updated internal footer linking to use the canonical copy-paste URL directly.
- Expanded `public/sitemap.xml` to include all current landing pages and all existing blog article URLs.
- Removed obsolete `changefreq`/`priority` noise from the sitemap and kept accurate `lastmod` values for the current update.
- Removed the obsolete FAQ rich-result JSON-LD implementation while keeping visible FAQ content.
- Fixed route-aware metadata so About, Contact, Privacy, Terms, Blog, Blog articles, Roadmap, Changelog, Feedback, Sitemap, Robots, and landing pages get their own title, description, canonical, Open Graph metadata, and appropriate structured data.
- Added Article structured data for blog posts.
- Kept SoftwareApplication structured data for the actual TextCase landing pages.
- Kept canonical URLs on the current `/fix-copy-paste-text` path and did not delete any existing content page.

## Cross-site promotion
- Added a lightweight VoiceID promotion block globally before the footer, so it appears naturally across the site's routes.
- VoiceID copy is contextual and non-aggressive: it is presented as another tool from the creator rather than as an unrelated advertisement.
- Existing Texly promotion remains in the landing-page tool experience.

## Deployment note
- The project is configured for Vercel SPA rewrites with the legacy URL redirect evaluated before the catch-all rewrite.
- After deployment, submit/refresh `https://textcase.in/sitemap.xml` in Google Search Console and inspect the key URLs, especially `/`, `/repair-text`, `/fix-chatgpt-formatting`, `/fix-pdf-text`, and `/fix-copy-paste-text`.
