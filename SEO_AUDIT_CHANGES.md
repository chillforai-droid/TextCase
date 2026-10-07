# TextCase SEO + Build Fixes

## What was fixed

- Standardized the production canonical host on `https://www.textcase.in`.
- Added a single Vercel redirect from the non-www host to the www host.
- Kept the legacy `/fix-copy-paste` URL as a direct 301 to `/fix-copy-paste-text` on the canonical host.
- Updated `robots.txt`, `sitemap.xml`, `index.html`, route SEO metadata, and page canonical URLs to the same host.
- Removed low-value product-status routes from the XML sitemap and added the public Prompt Store root.
- Added `Disallow: /prompt-admin` to robots.txt.
- Converted footer navigation from JavaScript buttons to real crawlable `<a href>` links.
- Added build-time route prerendering for all sitemap URLs so each route receives its own title, description, Open Graph metadata, and canonical URL in the initial HTML response.
- Fixed the `/prompt-admin` conditional return so it no longer changes React Hook order.
- Fixed Prompt Admin category/prompt save modals so their Save buttons submit the actual forms.
- Fixed a syntax error in the Prompt Admin prompts table that prevented TypeScript compilation.
- Kept the existing Word-compatible `.doc` exporter label accurate rather than claiming it produces a real OOXML `.docx` file.

## Verification performed here

- All `.ts` and `.tsx` files pass TypeScript parser/syntax validation.
- Vercel build could not be executed in this environment because the uploaded project's npm dependency installation could not complete; the local `node_modules` snapshot was incomplete and did not contain Vite.
- The new prerender script was executed independently against a test `dist/index.html` and successfully generated 21 route HTML files with route-specific titles and canonicals.
- `package.json` and `package-lock.json` root dependency definitions match.

## Before production deployment

Run:

```bash
npm ci
npm run lint
npm run build
```

Then deploy the generated project to Vercel and submit the canonical `https://www.textcase.in/sitemap.xml` in Google Search Console.
