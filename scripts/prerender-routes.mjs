import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const indexPath = path.join(distDir, "index.html");
const BASE_URL = "https://www.textcase.in";

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html was not found after Vite build.");
}

function readQuotedField(block, field) {
  const match = block.match(new RegExp(`${field}\\s*:\\s*"([^"]*)"`));
  return match?.[1] || "";
}

function readSourceRecord(filePath, marker, fields) {
  const source = fs.readFileSync(filePath, "utf8");
  const start = source.indexOf(marker);
  if (start < 0) return null;
  const end = source.indexOf("\n  },", start);
  const block = source.slice(start, end > start ? end : start + 5000);
  const record = {};
  for (const field of fields) record[field] = readQuotedField(block, field);
  return record;
}

const pagesSource = path.join(root, "src/content/pages.ts");
const blogSource = path.join(root, "src/content/blog.ts");
const landingSlugs = new Set([
  "fix-chatgpt-formatting",
  "fix-pdf-text",
  "fix-copy-paste-text",
  "remove-hidden-unicode",
  "fix-ocr-text",
  "remove-markdown",
  "remove-extra-spaces",
  "repair-text",
  "case-converter",
]);

const landingPages = new Map();
for (const slug of landingSlugs) {
  const record = readSourceRecord(pagesSource, `"${slug}": {`, ["metaTitle", "metaDesc", "title"]);
  if (record) landingPages.set(slug, record);
}

const blogSlugs = [
  "fix-chatgpt-formatting",
  "fix-pdf-copy-text",
  "remove-hidden-unicode",
  "remove-markdown",
  "repair-ocr-text",
];
const blogArticles = new Map();
for (const slug of blogSlugs) {
  const record = readSourceRecord(blogSource, `slug: "${slug}"`, ["title", "excerpt"]);
  if (record) blogArticles.set(slug, record);
}

const staticSeo = {
  "/blog": {
    title: "TextCase Guides – Text Repair, PDF, OCR & AI Formatting",
    description: "Practical guides for fixing copied text, PDF line breaks, OCR artifacts, Markdown, Unicode and AI formatting with TextCase.",
  },
  "/prompt-store": {
    title: "Prompt Store – AI Prompts by Category | TextCase",
    description: "Browse practical AI prompts organized by category. Find, copy and use prompts for writing, marketing, coding, SEO, research and everyday tasks.",
  },
  "/about": { title: "About TextCase | Smart Text Repair", description: "Learn how TextCase repairs messy copied text directly in your browser." },
  "/contact": { title: "Contact TextCase", description: "Contact the TextCase team with questions, feedback, or bug reports." },
  "/privacy": { title: "Privacy Policy | TextCase", description: "Read the TextCase privacy policy and learn how browser-based text processing works." },
  "/terms": { title: "Terms of Service | TextCase", description: "Read the terms of service for TextCase." },
};

function getSeo(route) {
  if (route === "/") {
    return {
      metaTitle: "TextCase – Fix Broken Text & Formatting Instantly",
      metaDesc: "Paste your text from ChatGPT, PDF, OCR, or Unicode. We'll automatically detect formatting issues and repair everything with one click.",
    };
  }
  const slug = route.replace(/^\//, "");
  if (landingPages.has(slug)) return landingPages.get(slug);
  if (route.startsWith("/blog/")) {
    const articleSlug = route.slice("/blog/".length);
    const article = blogArticles.get(articleSlug);
    if (article) {
      return {
        metaTitle: `${article.title} | TextCase`,
        metaDesc: article.excerpt,
      };
    }
  }
  return staticSeo[route] || {
    title: "TextCase – Fix Broken Text Instantly",
    description: "Repair broken copied text from ChatGPT, PDF, OCR, Markdown and Unicode instantly. Fast, free and browser-based.",
  };
}

const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname)
  .filter((route) => route !== "/prompt-admin");

const baseHtml = fs.readFileSync(indexPath, "utf8");

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

for (const route of routes) {
  const seo = getSeo(route);
  const title = seo.metaTitle || seo.title;
  const description = seo.metaDesc || seo.description || "";
  const canonical = `${BASE_URL}${route === "/" ? "/" : route}`;
  let html = baseHtml;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/i, `<meta name="description" content="${esc(description)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${esc(canonical)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${esc(canonical)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${esc(title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${esc(description)}" />`);
  html = html.replace(/<meta property="twitter:title" content="[^"]*"\s*\/>/i, `<meta property="twitter:title" content="${esc(title)}" />`);
  html = html.replace(/<meta property="twitter:description" content="[^"]*"\s*\/>/i, `<meta property="twitter:description" content="${esc(description)}" />`);

  const outputDir = route === "/" ? distDir : path.join(distDir, route.replace(/^\//, ""));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), html);
}

console.log(`Prerendered ${routes.length} canonical HTML routes.`);
