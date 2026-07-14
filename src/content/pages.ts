import { LandingPage } from "../types";

const APP_URL = "https://textcase.in";

export const LANDING_PAGES: Record<string, LandingPage> = {
  default: {
    id: "default",
    slug: "",
    title: "Smart Text Fixer",
    h1: "Paste Messy Text. Get Perfect Prose.",
    subtitle: "Clean up broken copy-pastes, fix OCR glitches, strip unwanted markdown, and purge hidden unicode gremlins in one click.",
    metaTitle: "TextCase – Fix Broken Text & Formatting Instantly",
    metaDesc: "Paste your text from ChatGPT, PDF, OCR, or Unicode. We'll automatically detect formatting issues and repair everything with one click.",
    metaDescription: "Paste your text from ChatGPT, PDF, OCR, or Unicode. We'll automatically detect formatting issues and repair everything with one click.",
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
    heroTitle: "Paste Messy Text. Get Perfect Prose.",
    heroDescription: "Clean up broken copy-pastes, fix OCR glitches, strip unwanted markdown, and purge hidden unicode gremlins in one click.",
    problemDescription: "Digital copy-pastes are notoriously fragile. When you extract text from PDF documents, OCR screen scans, or AI engines like ChatGPT, the original typography fractures. Hard hyphenations split words, random carriage returns disrupt flow, and unprintable byte orders leak into compilers, causing frustrating formatting bugs.",
    solutionDescription: "TextCase provides a unified, secure, local browser-first workspace that instantly scans your clipboard. Through a series of multi-pass heuristic regex rules, it automatically synthesizes paragraphs, strips markdown syntax, normalizes blank lines, sanitizes typography, and cleans unprintable characters.",
    examples: [
      {
        input: "The smart sys-\ntem automatically de-\ntects layout bugs.",
        output: "The smart system automatically detects layout bugs."
      },
      {
        input: "Check out “curly quotes” & hidden spaces\u200B",
        output: 'Check out "curly quotes" & hidden spaces'
      }
    ],
    relatedPages: ["fix-chatgpt-formatting", "fix-pdf-text", "fix-copy-paste-text", "remove-hidden-unicode"],
    faq: [
      {
        question: "What formatting issues does TextCase solve?",
        answer: "TextCase addresses broken paragraph wraps, split line hyphenations from PDFs, excessive spacing/tabs, smart typographic curly quotes, raw markdown elements from AI chat exports, scanned OCR artifacts, and hidden zero-width spaces."
      },
      {
        question: "How is TextCase different from other text editors?",
        answer: "TextCase runs 100% locally in your browser memory. No text is ever uploaded to a server, providing military-grade privacy for sensitive documents, legal papers, and private communications."
      },
      {
        question: "Can I use TextCase on mobile devices?",
        answer: "Yes, our responsive responsive layout adapts beautifully to phones and tablets. You can easily clean up mobile copies on the go."
      }
    ],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase Smart Text Fixer",
      "url": `${APP_URL}/`,
      "description": "Clean up broken copy-pastes, fix OCR glitches, strip unwanted markdown, and purge hidden unicode gremlins in one click.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "fix-chatgpt-formatting": {
    id: "fix-chatgpt-formatting",
    slug: "fix-chatgpt-formatting",
    title: "ChatGPT Formatting",
    h1: "Strip ChatGPT Markdown & Backticks",
    subtitle: "Instantly clean raw markdown headers, bold blocks, italics, bullet hashes, and code snippets into clean text.",
    metaTitle: "Fix ChatGPT Formatting & Strip Markdown | TextCase",
    metaDesc: "Easily strip unwanted ChatGPT formatting symbols like backticks, hashes, bullet symbols, bold/italic markers, and links to get clean copyable plain text.",
    metaDescription: "Easily strip unwanted ChatGPT formatting symbols like backticks, hashes, bullet symbols, bold/italic markers, and links to get clean copyable plain text.",
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
    heroTitle: "Strip ChatGPT Markdown & Backticks",
    heroDescription: "Instantly clean raw markdown headers, bold blocks, italics, bullet hashes, and code snippets into clean prose.",
    problemDescription: "Copying text from AI platforms like ChatGPT, Gemini, or Claude usually preserves raw Markdown formatting. Your clipboards end up filled with annoying asterisks for bolding, backticks for inline codes, blockquotes, and hashtag markers for headers, which look highly unprofessional when pasted into standard emails or documents.",
    solutionDescription: "This module strips the formatting syntaxes of Markdown while keeping the underlying literal text layout. Headers are normalized into capitalized blocks, list markers are preserved as standard spaces or bullets, and surrounding asterisks are safely washed away.",
    examples: [
      {
        input: "We must analyze **critical telemetry** immediately.",
        output: "We must analyze critical telemetry immediately."
      },
      {
        input: "- `user_id` validation filter",
        output: "- user_id validation filter"
      }
    ],
    relatedPages: ["remove-markdown", "repair-text", "fix-copy-paste-text"],
    faq: [
      {
        question: "Does this ChatGPT formatter keep my lists intact?",
        answer: "Yes. It strips bold asterisks and backticks from your bullet lists but keeps standard list layouts readable and well-spaced."
      },
      {
        question: "Does it work with other AI platforms like Claude or Gemini?",
        answer: "Absolutely. All major LLMs use Markdown as their primary rendering language, so our ChatGPT Formatting tool is compatible with Claude, Gemini, DeepSeek, and custom chat portals."
      },
      {
        question: "Can I undo the markdown removal?",
        answer: "We support a Diff Auditor view to view exactly what was removed, allowing you to copy fragments of the original if you need to restore code segments."
      }
    ],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase ChatGPT Formatter",
      "url": `${APP_URL}/fix-chatgpt-formatting`,
      "description": "Instantly clean raw ChatGPT markdown headers, bold blocks, lists, and backticks into clean text.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "fix-pdf-text": {
    id: "fix-pdf-text",
    slug: "fix-pdf-text",
    title: "PDF Text Repair",
    h1: "Fix Broken PDF Copy-Pastes & Margins",
    subtitle: "Merge sentences split mid-paragraph and clean hyphenated words caused by bad PDF column margins.",
    metaTitle: "Fix PDF Copy-Paste Formatting & Broken Lines | TextCase",
    metaDesc: "Tired of broken line-wraps and words split by hyphens when copying from PDFs? TextCase merges lines and hyphenations into clean fluid paragraphs instantly.",
    metaDescription: "Tired of broken line-wraps and words split by hyphens when copying from PDFs? TextCase merges lines and hyphenations into clean fluid paragraphs instantly.",
    sampleText: `This is a typical PDF document layout where sentences are bro-
ken across multiple lines randomly. Furthermore, some key-
words are hyphenated because they happened to fall right at the col-
umn margin boundary.

Copying this text directly results in unreadable fragments that we must
repair into a continuous, flowing paragraph.`,
    keywords: ["PDF column margin repair", "Merge split lines", "Remove hard hyphens", "Rebuild paragraphs", "Fix sentence layout"],
    canonical: `${APP_URL}/fix-pdf-text`,
    heroTitle: "Fix Broken PDF Copy-Pastes & Margins",
    heroDescription: "Merge sentences split mid-paragraph and clean hyphenated words caused by bad PDF column margins.",
    problemDescription: "Copying prose from PDF readers creates fragmented layouts. Words on the margins get cut in half with hyphenations, and sentence lines get chopped at the column borders. When pasted into standard word processors, they retain those hard carriage returns, resulting in extremely choppy lines instead of flowing paragraphs.",
    solutionDescription: "The PDF Text Repair module detects words split across lines by hyphens and rejoins them back together. It also smart-analyzes sentence terminations (checking for periods, capitals, and commas) to decide whether to merge two lines or preserve a paragraph break.",
    examples: [
      {
        input: "The system is de-\nsigned for high perfor-\nmance workloads.",
        output: "The system is designed for high performance workloads."
      },
      {
        input: "First line of research\nsecond line of continuous prose.",
        output: "First line of research second line of continuous prose."
      }
    ],
    relatedPages: ["fix-ocr-text", "repair-text", "remove-extra-spaces"],
    faq: [
      {
        question: "Why does text copy so poorly from PDFs?",
        answer: "PDF is a presentation format meant to lock document layouts. It stores coordinates of individual characters rather than continuous streams of paragraphs, so copy-pasting reads them line-by-line rather than naturally."
      },
      {
        question: "Does this preserve table structures?",
        answer: "PDF repair is optimized for continuous prose, articles, and essays. Intricate tabular formats should be copied separately to avoid structural merging."
      },
      {
        question: "Does it join split words like 'per-sonal'?",
        answer: "Yes, it detects hyphens sitting right at the end of a line, removes them, and stitches the word back into 'personal' automatically."
      }
    ],
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
  "fix-copy-paste-text": {
    id: "fix-copy-paste-text",
    slug: "fix-copy-paste-text",
    title: "Copy-Paste Cleaner",
    h1: "Clean Spacing & Copied Web Glitches",
    subtitle: "Normalize excessive double-spaces, tabs, strange indentation, smart curly quotes, and website artifacts.",
    metaTitle: "Clean Copy-Paste Spacing & Curly Quotes | TextCase",
    metaDesc: "Remove duplicate spacing, tabs, smart curly quotes, and other invisible copy-paste artifacts from legacy web pages and Word documents instantly.",
    metaDescription: "Remove duplicate spacing, tabs, smart curly quotes, and other invisible copy-paste artifacts from legacy web pages and Word documents instantly.",
    sampleText: `This   contains   unwanted    multiple spaces and strange tab\tspacing.
It also features "smart quotes" like “curly double quotes” and ‘single curly quotes’ which break some compilers.
Let's   normalize   the spacing   and sanitize quotes.`,
    keywords: ["Remove tabs & spaces", "Replace smart quotes", "Fix spacing glitches", "Clean Word formatting", "Web paste sanitizer"],
    canonical: `${APP_URL}/fix-copy-paste-text`,
    heroTitle: "Clean Spacing & Copied Web Glitches",
    heroDescription: "Normalize excessive double-spaces, tabs, strange indentation, smart curly quotes, and website artifacts.",
    problemDescription: "Web pages and legacy rich text documents often introduce strange layout blocks when copied. You often find yourself with multiple tabs, bloated blocks of double/triple spaces, and curly 'smart quotes' that trigger unexpected compiler errors inside databases, scripts, or markdown parsers.",
    solutionDescription: "The Copy-Paste Cleaner strips out trailing whitespace, replaces curly single and double quotes with standard straight quotes, converts multiple tabs into simple single spaces, and normalizes space clumps into structured paragraphs.",
    examples: [
      {
        input: "This    is   spaced   very    weirdly.",
        output: "This is spaced very weirdly."
      },
      {
        input: "He said “hello” & ‘welcome’",
        output: 'He said "hello" & \'welcome\''
      }
    ],
    relatedPages: ["remove-extra-spaces", "remove-hidden-unicode", "repair-text"],
    faq: [
      {
        question: "Why should I convert smart quotes?",
        answer: "Smart quotes look beautiful in books but cause major compile errors in database queries, command lines, and coding languages like JavaScript or Python."
      },
      {
        question: "Does it delete my line breaks?",
        answer: "No. It normalizes excessive empty lines but preserves standard spacing so your paragraph separations remain clean."
      },
      {
        question: "Can I process code paste cleanups?",
        answer: "Yes, this tool is highly recommended for developers cleaning up copied configuration files, JSON strings, or code snippets before parsing."
      }
    ],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase Copy-Paste Cleaner",
      "url": `${APP_URL}/fix-copy-paste-text`,
      "description": "Normalize double-spacing, tabs, smart quote curly styles, and strange line spaces locally.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "remove-hidden-unicode": {
    id: "remove-hidden-unicode",
    slug: "remove-hidden-unicode",
    title: "Remove Hidden Unicode",
    h1: "Strip Invisible Zero-Width Characters",
    subtitle: "Instantly strip hidden zero-width spaces, Byte Order Marks (BOM), and compiler-breaking characters.",
    metaTitle: "Remove Hidden Unicode & Zero-Width Spaces | TextCase",
    metaDesc: "Find and remove invisible compiler-breaking zero-width spaces (ZWSP), Byte Order Marks (BOM), and hidden Unicode artifacts from your text 100% locally.",
    metaDescription: "Find and remove invisible compiler-breaking zero-width spaces (ZWSP), Byte Order Marks (BOM), and hidden Unicode artifacts from your text 100% locally.",
    sampleText: `This text has hidden compiler-breaking unicode characters.\u200B
Can you see the zero-width space here\u200B or the non-breaking space\u00A0between words?
These hidden characters can cause unexpected syntax errors in your application or databases. Let's inspect and remove them.`,
    keywords: ["Zero-width space remover", "BOM stripped", "Hidden characters audit", "Compiler error fix", "Database query sanitizer"],
    canonical: `${APP_URL}/remove-hidden-unicode`,
    heroTitle: "Strip Invisible Zero-Width Characters",
    heroDescription: "Instantly strip hidden zero-width spaces, Byte Order Marks (BOM), and compiler-breaking characters.",
    problemDescription: "Invisible formatting characters can cause massive developer headaches. Characters like Zero-Width Spaces (ZWSP), Byte Order Marks (BOM), and Non-Breaking Spaces (NBSP) are completely invisible in standard text editors but will crash program compilers, damage database lookups, and break string comparisons.",
    solutionDescription: "The Hidden Unicode Remover audits your string byte-by-byte. It flags invisible characters with visible markers in the scanner and allows you to instantly purge them while retaining standard ascii characters.",
    examples: [
      {
        input: "const\u200B val = 'test';",
        output: "const val = 'test';"
      },
      {
        input: "Hello\u00A0World!",
        output: "Hello World!"
      }
    ],
    relatedPages: ["fix-copy-paste-text", "remove-extra-spaces", "repair-text"],
    faq: [
      {
        question: "How do hidden Unicode characters get into my text?",
        answer: "They are often used on modern web pages for invisible formatting, or are generated as markers by rich text editors, translation apps, or scraper programs."
      },
      {
        question: "Will this alter standard letters or emojis?",
        answer: "No. This tool specifically targets hidden structural control characters (like ZWSP, BOM, and NBSP) while leaving your standard text, numbers, punctuation, and emojis completely untouched."
      },
      {
        question: "Is this safe for database cleaning?",
        answer: "Yes, it is highly recommended to run SQL inserts or JSON dumps through this tool to prevent character set issues during parsing."
      }
    ],
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
    slug: "fix-ocr-text",
    title: "OCR Text Repair",
    h1: "Repair OCR Text & Scan Copy Errors",
    subtitle: "Automatically clean up scan artifacts, double punctuation, split paragraphs, and stray characters from scans.",
    metaTitle: "Fix OCR Scan Text Errors & Spacing | TextCase",
    metaDesc: "Clean up scanner text copy-pastes. Normalize multiple punctuation errors, hyphenations, split paragraphs, and stray characters in seconds.",
    metaDescription: "Clean up scanner text copy-pastes. Normalize multiple punctuation errors, hyphenations, split paragraphs, and stray characters in seconds.",
    sampleText: `THE RECIPIENT , , , shall establish security pro-
cedures to safeguard confidential data . . .
These regulations are extremely active!! Let's repair the OCR text.
Page 12 of 150`,
    keywords: ["OCR text fixer", "Scanner copy clean", "Fix multiple commas", "Fix repeated exclamation", "Scan text repair"],
    canonical: `${APP_URL}/fix-ocr-text`,
    heroTitle: "Repair OCR Text & Scan Copy Errors",
    heroDescription: "Automatically clean up scan artifacts, double punctuation, split paragraphs, and stray characters from scans.",
    problemDescription: "Optical Character Recognition (OCR) systems are prone to reading errors. They frequently read paper folds as commas, generate repetitive commas (', , ,'), split single sentences across unrelated lines, fail to recognize line wraps, and insert stray punctuation marks or random page headers right in the middle of a continuous text block.",
    solutionDescription: "Our OCR Text Repair utility applies complex syntax rules to merge split words, normalize clustered spacing, reduce double commas, clean repeated exclamations, and restore the paragraph structure into beautifully formatted text.",
    examples: [
      {
        input: "The company , , , agrees to comply.",
        output: "The company, agrees to comply."
      },
      {
        input: "This scan was successful!! !!",
        output: "This scan was successful!"
      }
    ],
    relatedPages: ["fix-pdf-text", "repair-text", "remove-extra-spaces"],
    faq: [
      {
        question: "How does OCR repair identify scan artifacts?",
        answer: "It flags clusters of duplicate commas, spaced periods (e.g. '. . .'), and uppercase letters that appear immediately after line breaks without terminal punctuation."
      },
      {
        question: "Can it fix bad spelling?",
        answer: "No. This tool focuses entirely on grammar, punctuation layouts, line breaks, and whitespace abnormalities rather than vocabulary corrections, ensuring the source words remain unmodified."
      },
      {
        question: "Can I upload scanned documents?",
        answer: "Yes, you can upload plain .txt files or copy-paste directly from any document reader."
      }
    ],
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
    slug: "remove-markdown",
    title: "Remove Markdown",
    h1: "Strip Markdown Syntaxes to Plain Text",
    subtitle: "Strips all markdown headers, bold boundaries, italic lines, task lists, and hyperlinks into standard raw text.",
    metaTitle: "Strip Markdown to Plain Text Converter | TextCase",
    metaDesc: "Remove all markdown syntax formatting like headers, bullets, bold marks, italics, hyperlinks, and tables to export pure plain text files.",
    metaDescription: "Remove all markdown syntax formatting like headers, bullets, bold marks, italics, hyperlinks, and tables to export pure plain text files.",
    sampleText: `### Markdown Text
This is a **bold** and *italicized* paragraph.
[Link to Documentation](https://example.com)
* Nested Bullet List Item
* Second Nested Bullet`,
    keywords: ["Strip markdown", "Convert markdown to plain text", "Remove headers stars", "Clean raw txt exporter", "Markdown sanitizer"],
    canonical: `${APP_URL}/remove-markdown`,
    heroTitle: "Strip Markdown Syntaxes to Plain Text",
    heroDescription: "Strips all markdown headers, bold boundaries, italic lines, task lists, and hyperlinks into standard raw text.",
    problemDescription: "Markdown is great for writing, but it's difficult to read or copy when presented in its raw format. Having headers marked with multiple '#' tags, lists with bullet dashes, blockquotes, and link syntaxes like '[Label](URL)' renders your documents unusable when submitting to non-markdown platforms.",
    solutionDescription: "The Remove Markdown module parses markdown files and converts them into pure plain text. It extracts anchor text from links, strips bold/italic/code markups, converts headers into standard titles, and flattens structured content into elegant paragraphs.",
    examples: [
      {
        input: "Go to [Google](https://google.com) now.",
        output: "Go to Google now."
      },
      {
        input: "#### Critical Header Info",
        output: "Critical Header Info"
      }
    ],
    relatedPages: ["fix-chatgpt-formatting", "repair-text", "fix-copy-paste-text"],
    faq: [
      {
        question: "Will I lose my bulleted items?",
        answer: "No. The formatting symbols are cleaned up, but the hierarchy and layout of list nodes are preserved as legible text blocks."
      },
      {
        question: "Does it support markdown tables?",
        answer: "Yes, it flattens raw grid indicators into clean, readable text rows so that the data remains legible."
      },
      {
        question: "Is this secure for confidential documentation?",
        answer: "Absolutely. All processing takes place locally inside your browser, meaning your secret documentation never travels across any server."
      }
    ],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase Markdown Stripper",
      "url": `${APP_URL}/remove-markdown`,
      "description": "Turn complex markdown files, blocks, and indicators into pure standard plain text.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "remove-extra-spaces": {
    id: "remove-extra-spaces",
    slug: "remove-extra-spaces",
    title: "Remove Extra Spaces",
    h1: "Normalize Unwanted Double Spaces & Tabs",
    subtitle: "Instantly clean up bloated spaces, irregular spacing gaps, and tab margins to keep your prose standard.",
    metaTitle: "Remove Extra Spaces & Double Spacing Online | TextCase",
    metaDesc: "Quickly remove duplicate spaces, trailing tabulator indentations, and weird spacing gaps from your text documents locally inside your browser.",
    metaDescription: "Quickly remove duplicate spaces, trailing tabulator indentations, and weird spacing gaps from your text documents locally inside your browser.",
    sampleText: `This text      has a lot of       unwanted extra spaces.
There are also multiple tabs	here	and	there,
and double line breaks that are   excessive.
Let's normalize the whitespace.`,
    keywords: ["Remove double spaces", "Whitespace normalizer", "Strip empty lines", "Trim trailing spaces", "Clean copy indentations"],
    canonical: `${APP_URL}/remove-extra-spaces`,
    heroTitle: "Normalize Unwanted Double Spaces & Tabs",
    heroDescription: "Instantly clean up bloated spaces, irregular spacing gaps, and tab margins to keep your prose standard.",
    problemDescription: "Irregular spacing splits paragraphs, breaks page alignments, and looks extremely sloppy. It is usually caused by word processor translation errors, bad web scraping, or copying from old command terminals and database grids.",
    solutionDescription: "The Remove Extra Spaces module automatically trims leading and trailing spacing, reduces double or triple blank lines to clean single breaks, and collapses multiple horizontal spaces or tabs into a single elegant separator.",
    examples: [
      {
        input: "This   has   too    many   spaces.",
        output: "This has too many spaces."
      },
      {
        input: "First line.\n\n\n\nSecond line.",
        output: "First line.\n\nSecond line."
      }
    ],
    relatedPages: ["fix-copy-paste-text", "remove-hidden-unicode", "repair-text"],
    faq: [
      {
        question: "Will it remove my paragraph indents?",
        answer: "No. Standard paragraph structures are kept, but duplicate empty lines and double spaces are cleaned up."
      },
      {
        question: "Can I use this for code snippets?",
        answer: "This is perfect for code comment cleaning, though we recommend keeping the compare mode active to verify code spacing rules."
      },
      {
        question: "Is there a size limit for files?",
        answer: "There are no size limits. It runs in browser RAM, capable of processing massive novels or datasets in a fraction of a second."
      }
    ],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase Whitespace Normalizer",
      "url": `${APP_URL}/remove-extra-spaces`,
      "description": "Normalize bloated spaces, irregular whitespace gaps, and tab margins instantly.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  },
  "repair-text": {
    id: "repair-text",
    slug: "repair-text",
    title: "Repair Text",
    h1: "Comprehensive Online Text Restorer",
    subtitle: "The ultimate text sanitizer re-aligning broken sentences, typography mistakes, and web clipping artifacts.",
    metaTitle: "Repair Text Formatting & Restore Broken Layouts | TextCase",
    metaDesc: "The ultimate free, in-browser text repair utility. Automatically fix split sentences, smart quotes, bad line breaks, and duplicate punctuation.",
    metaDescription: "The ultimate free, in-browser text repair utility. Automatically fix split sentences, smart quotes, bad line breaks, and duplicate punctuation.",
    sampleText: `Dear client ,
The "Smart Repair" system can identify smart quotes , double commas , ,
and broken line endings that occur mid-sentence.
We want to re-align this prose.`,
    keywords: ["Comprehensive text fixer", "Online layout restorer", "Splicing sentences", "Typography errors", "Clean copy-paste text"],
    canonical: `${APP_URL}/repair-text`,
    heroTitle: "Comprehensive Online Text Restorer",
    heroDescription: "The ultimate text sanitizer re-aligning broken sentences, typography mistakes, and web clipping artifacts.",
    problemDescription: "Text formatting breaks easily when moved between modern messaging systems, PDF files, legacy document formats, and databases. Standard text fixers only allow simple find-and-replace, requiring you to painstakingly locate and fix errors manually.",
    solutionDescription: "TextCase's repair engine combines all cleaning systems (PDF splicing, OCR correction, spacing normalizer, markdown washing, smart-to-straight quote conversions, and invisible character scanning) into a single unified workspace.",
    examples: [
      {
        input: "The system , , is ready.",
        output: "The system, is ready."
      },
      {
        input: "Sentence split\nmid-flow is joined.",
        output: "Sentence split mid-flow is joined."
      }
    ],
    relatedPages: ["fix-pdf-text", "fix-chatgpt-formatting", "fix-copy-paste-text", "remove-hidden-unicode"],
    faq: [
      {
        question: "Is the text repair accurate?",
        answer: "Yes. Our heuristic rules examine neighboring character types to ensure spelling remains pristine while repairing grammar spaces."
      },
      {
        question: "Do you offer API support?",
        answer: "TextCase is a 100% offline client application, meaning the repair engine runs in your browser. This keeps the application completely free and infinitely scalable."
      },
      {
        question: "Will my formatting keep its italic or bold attributes?",
        answer: "This is a plain-text utility designed to deliver standard, clean, unformatted text files perfect for code repositories, emails, or drafts."
      }
    ],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TextCase Online Text Restorer",
      "url": `${APP_URL}/repair-text`,
      "description": "The ultimate browser-based text layout, paragraph, punctuation, and Unicode sanitizer.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    })
  }
};
