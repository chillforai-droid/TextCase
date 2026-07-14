import { LandingPage } from "../types";

const APP_URL = "https://textcase.in"; // Virtual production URL for Canonical tags

export const LANDING_PAGES: Record<string, LandingPage> = {
  default: {
    id: "default",
    title: "Homepage",
    h1: "Paste Broken Text. Get Perfect Text.",
    subtitle: "Clean messy copy-pastes, remove formatting symbols, and fix OCR glitches in one click.",
    metaTitle: "TextCase – Fix Broken Text Instantly",
    metaDesc: "Paste your text from ChatGPT, PDF, OCR, or Unicode. We'll automatically detect formatting issues and repair everything with one click.",
    sampleText: `---
title: TextCase Test Sample
category: Markdown & OCR
---

# TextCase - **Smart Text Fixer**

Welcome to this **highly messy** test document copy-pasted from a broken PDF scan and a ChatGPT session.
It contains smart quotes like “this text” and curly single quotes like ’that’ or ’worker’s’.

It also has excessive   spaces, tabs	spaced text, and hidden zero-width spaces\u200B that break text compilers.

Words are frequently split-
across lines due to bad PDF col-
umn margins and OCR alignment.

### Markdown Stripping
Let's see some inline code: \`const text = "messy"\`
and a markdown link: [Visit TextCase on Github](https://github.com/textcase)

- Bullet item one
- Bullet item two

And finally, OCR line breaks that split sentences
abruptly right in the middle
of a normal paragraph, which should be merged smoothly.

Let's clean this up instantly!`,
    keywords: ["ChatGPT formatting", "PDF copied text", "OCR errors", "Markdown", "Hidden Unicode", "Broken paragraphs", "Weird spacing"],
    canonical: `${APP_URL}/`,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase",
      "url": `${APP_URL}/`,
      "description": "Clean messy copy-pastes, remove formatting symbols, and fix OCR glitches in one click.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "fix-chatgpt-formatting": {
    id: "fix-chatgpt-formatting",
    title: "ChatGPT Formatting",
    h1: "Strip ChatGPT Markdown & Backticks",
    subtitle: "Instantly clean raw markdown headers, bold blocks, italics, bullet hashes, and code snippets into clean text.",
    metaTitle: "Fix ChatGPT Formatting & Strip Markdown | TextCase",
    metaDesc: "Easily strip unwanted ChatGPT formatting symbols like backticks, hashes, bullet symbols, bold/italic markers, and links to get clean copyable plain text.",
    sampleText: `# Response from ChatGPT

Here is the **analyzed data**:
- \`User Authentication\`: Active but needs check
- \`Data Validation\`: Fully certified

You can find more info at [documentation](https://example.com/docs). Let's review the final code block:
\`\`\`javascript
const result = checkStatus();
\`\`\``,
    keywords: ["ChatGPT raw text", "Markdown stripping", "Remove backticks", "Strip bold text", "Convert list items", "Plain text converter"],
    canonical: `${APP_URL}/fix-chatgpt-formatting`,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase ChatGPT Formatter",
      "url": `${APP_URL}/fix-chatgpt-formatting`,
      "description": "Instantly clean raw ChatGPT markdown headers, bold stars, lists, and backticks into clean text.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "fix-pdf-text": {
    id: "fix-pdf-text",
    title: "PDF Text Repair",
    h1: "Fix Broken PDF Copy-Pastes & Margins",
    subtitle: "Merge sentences split mid-paragraph and clean hyphenated words caused by bad PDF column margins.",
    metaTitle: "Fix PDF Copy-Paste Formatting & Broken Lines | TextCase",
    metaDesc: "Tired of broken line-wraps and words split by hyphens when copying from PDFs? TextCase merges lines and hyphenations into clean fluid paragraphs instantly.",
    sampleText: `This is a typical PDF document layout where sentences are bro-
ken across multiple lines randomly. Furthermore, some key-
words are hyphenated because they happened to fall right at the col-
umn margin boundary.

Copying this text directly results in unreadable fragments that we must
repair into a continuous, flowing paragraph.`,
    keywords: ["PDF column margin repair", "Merge split lines", "Remove hard hyphens", "Rebuild paragraphs", "Fix sentence layout"],
    canonical: `${APP_URL}/fix-pdf-text`,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase PDF Text Repair",
      "url": `${APP_URL}/fix-pdf-text`,
      "description": "Merge lines split mid-paragraph and repair word hyphenations from copied PDF documents.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "fix-copy-paste": {
    id: "fix-copy-paste",
    title: "Copy-Paste Cleaner",
    h1: "Clean Spacing & Copied Web Glitches",
    subtitle: "Normalize excessive double-spaces, tabs, strange indentation, smart curly quotes, and website artifacts.",
    metaTitle: "Clean Copy-Paste Spacing & Curly Quotes | TextCase",
    metaDesc: "Remove duplicate spacing, tabs, smart curly quotes, and other invisible copy-paste artifacts from legacy web pages and Word documents instantly.",
    sampleText: `This   contains   unwanted    multiple spaces and strange tab\tspacing.
It also features "smart quotes" like “curly double quotes” and ‘single curly quotes’ which break some compilers.
Let's   normalize   the spacing   and sanitize quotes.`,
    keywords: ["Remove tabs & spaces", "Replace smart quotes", "Fix spacing glitches", "Clean Word formatting", "Web paste sanitizer"],
    canonical: `${APP_URL}/fix-copy-paste`,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase Copy-Paste Cleaner",
      "url": `${APP_URL}/fix-copy-paste`,
      "description": "Normalize double-spacing, tabs, smart quote curly styles, and strange line spaces locally.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "remove-hidden-unicode": {
    id: "remove-hidden-unicode",
    title: "Remove Hidden Unicode",
    h1: "Strip Invisible Zero-Width Characters",
    subtitle: "Instantly strip hidden zero-width spaces, Byte Order Marks (BOM), and compiler-breaking characters.",
    metaTitle: "Remove Hidden Unicode & Zero-Width Spaces | TextCase",
    metaDesc: "Find and remove invisible compiler-breaking zero-width spaces (ZWSP), Byte Order Marks (BOM), and hidden Unicode artifacts from your text 100% locally.",
    sampleText: `This text has hidden compiler-breaking unicode characters.\u200B
Can you see the zero-width space here\u200B or the non-breaking space\u00A0between words?
These hidden characters can cause unexpected syntax errors in your application or databases. Let's inspect and remove them.`,
    keywords: ["Zero-width space remover", "BOM stripped", "Hidden characters audit", "Compiler error fix", "Database query sanitizer"],
    canonical: `${APP_URL}/remove-hidden-unicode`,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase Hidden Unicode Remover",
      "url": `${APP_URL}/remove-hidden-unicode`,
      "description": "Remove hidden zero-width spaces (ZWSP), Byte Order Marks (BOM), and unprintable control characters.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "fix-ocr-text": {
    id: "fix-ocr-text",
    title: "OCR Text Repair",
    h1: "Repair OCR Text & Scan Copy Errors",
    subtitle: "Automatically clean up scan artifacts, double punctuation, split paragraphs, and stray characters from scans.",
    metaTitle: "Fix OCR Scan Text Errors & Spacing | TextCase",
    metaDesc: "Clean up scanner text copy-pastes. Normalize multiple punctuation errors, hyphenations, split paragraphs, and stray characters in seconds.",
    sampleText: `THE RECIPIENT , , , shall establish security pro-
cedures to safeguard confidential data . . .
These regulations are extremely active!! Let's repair the OCR text.
Page 12 of 150`,
    keywords: ["OCR text fixer", "Scanner copy clean", "Fix multiple commas", "Fix repeated exclamation", "Scan text repair"],
    canonical: `${APP_URL}/fix-ocr-text`,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase OCR Text Repair",
      "url": `${APP_URL}/fix-ocr-text`,
      "description": "Clean up multiple commas, duplicate punctuations, and split lines from optical scans.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "remove-markdown": {
    id: "remove-markdown",
    title: "Remove Markdown",
    h1: "Strip Markdown Syntaxes to Plain Text",
    subtitle: "Strips all markdown headers, bold boundaries, italic lines, task lists, and hyperlinks into standard raw text.",
    metaTitle: "Strip Markdown to Plain Text Converter | TextCase",
    metaDesc: "Remove all markdown syntax formatting like headers, bullets, bold marks, italics, hyperlinks, and tables to export pure plain text files.",
    sampleText: `### Markdown Text
This is a **bold** and *italicized* paragraph.
[Link to Documentation](https://example.com)
* Nested Bullet List Item
* Second Nested Bullet`,
    keywords: ["Strip markdown", "Convert markdown to plain text", "Remove headers stars", "Clean raw txt exporter", "Markdown sanitizer"],
    canonical: `${APP_URL}/remove-markdown`,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase Markdown Stripper",
      "url": `${APP_URL}/remove-markdown`,
      "description": "Turn complex markdown files, blocks, and indicators into pure standard plain text.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  }
};
