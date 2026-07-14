import { BlogArticle } from "../types";

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    slug: "fix-chatgpt-formatting",
    title: "How to Fix ChatGPT Formatting and Strip Markdown",
    excerpt: "Learn how to easily convert ChatGPT output into clean plain text without copying unwanted hashes, bold stars, or code blocks.",
    category: "AI & Formatting",
    date: "July 10, 2026",
    readTime: "3 min read",
    content: `Copying answers from ChatGPT is an essential part of modern workflows, but it often brings along markdown junk like double asterisks (\*\*), hashtag headers (#), list hyphens, and backticks.

If you paste this directly into an email, Slack message, or a Word document, it looks messy and unprofessional.

### Why ChatGPT Uses Markdown
ChatGPT and other LLMs output text using a language called Markdown. It is lightweight and easy for machines to render into styled HTML in your browser. However, when you copy this text, your clipboard often catches the raw markup characters rather than the rendered styling.

### How TextCase Repairs It
TextCase's intelligent repair algorithm runs locally in your browser. It:
1. Identifies bold (\*\*) and italic (\*) bounds and extracts only the plain text.
2. Removes leading hash marks (#) while preserving line breaks.
3. Translates links [Link Text](URL) into easily readable format like 'Link Text (URL)'.
4. Strips out code block boundaries (backticks) without destroying the spacing of the code itself.

By pasting your ChatGPT output into TextCase first, you get clean, professional prose ready to send in one click.`
  },
  {
    id: "2",
    slug: "fix-pdf-copy-text",
    title: "Why Copying Text from PDFs Breaks Lines and How to Fix It",
    excerpt: "PDF copying often breaks words across lines with hyphens or splits sentences abruptly. Discover how to repair these annoying artifacts.",
    category: "PDF Solutions",
    date: "July 08, 2026",
    readTime: "4 min read",
    content: `Have you ever copied a paragraph from a PDF document, pasted it into an email, and noticed that sentences are broken into weird short lines? Or worse, words are split with a hyphen like 'inter- \npretation'?

This is one of the most common text copy-paste headaches, and it has to do with how the PDF file format represents layouts.

### Why PDFs Break Copied Text
Unlike Microsoft Word or HTML pages, PDF (Portable Document Format) doesn't always understand 'paragraphs' or 'reflowable text'. Instead, it views a page as a canvas and places letters and words at exact coordinates on that canvas. 

When you highlight and copy text from a PDF, the operating system grabs the text line-by-line. If a line ends with a word hyphenated across boundaries, it copies that hyphen. If a line breaks to keep the text on the page, the system pastes that break as a hard newline (\n), fracturing your sentences.

### The Standard Fix
Manually scrolling through and backspacing every single broken line and hyphen is exhausting. 

TextCase automates this instantly:
- **Hyphenation Merge**: It detects patterns like 'word-\\npart' and joins them into 'wordpart'.
- **Sentence Splice**: It detects lines that end mid-clause and join with a lowercase letter on the next line, sewing them back into a single natural paragraph.

Paste your PDF copy into TextCase to restore readable, continuous paragraphs in a split second.`
  },
  {
    id: "3",
    slug: "remove-hidden-unicode",
    title: "The Danger of Hidden Unicode Characters (ZWSP, BOM, and NBSP)",
    excerpt: "Invisible characters can slip into your text, breaking databases, software compilers, and UI layouts. Learn how to scan and delete them.",
    category: "Unicode Guide",
    date: "July 05, 2026",
    readTime: "5 min read",
    content: `Sometimes what you can't see *can* hurt your application or presentation. Invisible Unicode characters are a frequent source of mysterious software bugs, formatting anomalies, and broken search queries.

### What are Hidden Characters?
The Unicode standard includes several control characters designed for layout but invisible to the human eye:
- **Zero-Width Space (ZWSP - U+200B)**: Used to indicate word boundaries in scripts without spaces, but often sneaks into copied web text.
- **Byte Order Mark (BOM - U+FEFF)**: A legacy marker used to declare the byte order of a text stream, frequently appearing at the start of copied files.
- **Zero-Width Joiner (ZWJ - U+200D)**: Used to glue characters together (like emojis or complex scripts).
- **Non-Breaking Space (NBSP - U+00A0)**: Forces words to stay on the same line, but can break standard string matching or wrap logic unexpectedly in web designs.

### Why They Cause Problems
If a zero-width space is hidden inside an email address, a login field, or a block of code, a system will treat it as a unique character. Your user won't understand why their password fails, or why their SQL queries return syntax errors.

### Scanning and Purging
Using a tool like TextCase reveals these characters instantly. The Analysis Report highlights how many invisible characters are present in your input text. Clicking 'Fix Text' completely purges these hidden gremlins while converting non-breaking spaces into standard, compliant spaces.`
  },
  {
    id: "4",
    slug: "remove-markdown",
    title: "A Complete Guide to Removing Markdown and Copying Raw Text",
    excerpt: "Converting markdown into clean text is essential for emails, documentation, and reporting. Read our quick guide.",
    category: "Formatting Hacks",
    date: "July 01, 2026",
    readTime: "3 min read",
    content: `Markdown is a magnificent format for writing. It keeps your hands on the keyboard and makes formatting lightweight. However, markdown belongs in editors, not final emails, messages, or legal briefs.

### The Challenge of Raw Markdown
If you write a markdown document and copy it, you're copying raw characters:
- Bold text is wrapped in **double asterisks**.
- Headers are prefixed with #, ##, or ###.
- Blockquotes are prefixed with >.
- Inline code has backticks (\`).

To present this to non-technical stakeholders, you have to export it, or painstakingly delete the formatting marks.

### The Automatic TextCase Solution
TextCase acts as a universal markdown washer. In less than a millisecond, it strips away bold stars, italic lines, list ticks, header signs, blockquotes, and link enclosures. It extracts the raw content and presents it as clean, readable plain text.`
  },
  {
    id: "5",
    slug: "repair-ocr-text",
    title: "How to Repair OCR Text and Clean Scan Copy Errors",
    excerpt: "Scan-to-text tools are incredible, but they create multiple punctuation errors and weird spacing. Learn how to clean OCR text.",
    category: "OCR Problems",
    date: "June 25, 2026",
    readTime: "4 min read",
    content: `Optical Character Recognition (OCR) tools extract text from images and PDF scans. While they have improved immensely, OCR text frequently contains tiny, annoying errors.

### Common OCR Artifacts
- **Stray Hyphens**: Words split across columns are kept with hyphens, even if they aren't at the end of a line anymore.
- **Double Spaces / Bad Kerning**: Spacing around characters can be read as multiple space bars.
- **Punctuation Confusions**: OCR engines often misread commas as periods, or duplicate periods (....) due to page noise.
- **Sentence Fracturing**: Standard lines are often terminated with a newline character, splitting single paragraphs into dozens of single lines.

### Polishing OCR Outputs
TextCase cleans these artifacts in a batch. It merges the broken line segments, normalizes spaces and punctuation, replaces stray dashes, and trims away any leading/trailing garbage that crawled in from the edges of the image scan. It makes scanned documents readable again.`
  }
];
