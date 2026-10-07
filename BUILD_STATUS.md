# TextCase build status — 2026-10-07

## Fixed in this package

1. PromptAdminPage TypeScript/JSX syntax error fixed.
2. Prompt admin React hook-order bug fixed.
3. Prompt admin category/prompt forms fixed so Save submits.
4. Canonical host standardized to `https://www.textcase.in`.
5. Non-www -> www Vercel redirect added.
6. Legacy `/fix-copy-paste` -> canonical `/fix-copy-paste-text` redirect preserved.
7. robots.txt updated to block `/prompt-admin` and point to the canonical sitemap.
8. Sitemap cleaned to canonical public URLs and Prompt Store root.
9. Footer navigation changed to crawlable anchors.
10. Build-time prerendering added for all sitemap routes (21 HTML routes).
11. Route-specific title/description/Open Graph/canonical tags are emitted in initial HTML.
12. Static index and informational sitemap/robots pages use the canonical host.

## Verification

- TypeScript/TSX parser validation: PASS.
- Prerender script test: PASS; 21 route HTML files generated with route-specific metadata.
- package.json/package-lock.json root dependency declarations: MATCH.
- Full `npm ci` and Vite production build: NOT VERIFIED in this execution environment because dependency installation timed out and the available `node_modules` snapshot was incomplete (Vite executable unavailable).

## Vercel deployment check

The repository should be deployed with the normal Vercel build command from `package.json`:

`npm run build`

After deployment, verify:

- `https://www.textcase.in/`
- `https://www.textcase.in/sitemap.xml`
- `https://www.textcase.in/robots.txt`
- `https://www.textcase.in/repair-text`
- `https://www.textcase.in/case-converter`
- `https://www.textcase.in/blog/fix-chatgpt-formatting`

Then resubmit `https://www.textcase.in/sitemap.xml` in Google Search Console.
