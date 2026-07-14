import { FAQItem } from "../types";

export const FAQ_DATA: FAQItem[] = [
  {
    question: "What is broken text?",
    answer: "Broken text refers to content that has lost its proper formatting, layout, or character encoding. This typically happens when copying and pasting from PDFs, ChatGPT, OCR scans, legacy editors, or mobile web views, resulting in unwanted line breaks, stray hyphens, double spacing, smart quotes, or hidden invisible characters."
  },
  {
    question: "How does this tool work?",
    answer: "TextCase scans your pasted text using an optimized local analysis engine. It checks for specific formatting anomalies using regular expressions and character maps. Once detected, the repair engine cleans, normalizes, and rebuilds your text as pure, beautiful plain text in a single click."
  },
  {
    question: "Does text leave my device?",
    answer: "Absolutely not. Privacy is our top priority. The entire scanning, analysis, and repair process happens 100% inside your web browser using local JavaScript. Your text is never sent to any server, database, or external API."
  },
  {
    question: "Can I repair ChatGPT formatting?",
    answer: "Yes. When you copy code or text from ChatGPT, it often retains markdown symbols (like hashes, bold markers, backticks) or hidden Unicode wrappers. TextCase will automatically strip those block elements and output clean, readable text."
  },
  {
    question: "Can I repair text copied from AI tools like ChatGPT, Gemini and Claude?",
    answer: "Absolutely. Different AI interfaces render markdown, code blocks, list indicators, and trailing markers slightly differently. TextCase detects formatting patterns typical to ChatGPT, Claude, Gemini, and other LLMs, instantly removing markdown clutter, extra indentations, and weirdly wrapped blocks of text."
  },
  {
    question: "Can I repair PDF copied text?",
    answer: "Yes. Copying from PDFs often introduces hard word-hyphenations across line boundaries (e.g. 'com- / puter') and splits sentences mid-flow. Our engine automatically merges hyphenated fragments and resolves broken mid-sentence lines into unified paragraphs."
  },
  {
    question: "Can I repair OCR text?",
    answer: "Yes. Optical Character Recognition (OCR) software is famous for introducing random line wraps, extra trailing spaces, double periods, or stray hyphens. TextCase is specially trained to detect these anomalies and clean them up."
  },
  {
    question: "Can I remove Markdown?",
    answer: "Yes, you can easily strip headers (#), lists (- or 1.), bold (**), italics (*), links, code blocks, and inline code snippets, turning them into standard readable plain text format."
  },
  {
    question: "Can I remove hidden Unicode?",
    answer: "Yes. Hidden characters like Zero-Width Spaces (ZWSP), Byte Order Marks (BOM), Zero-Width Joiners (ZWJ), and non-breaking spaces (NBSP) can break text editors, database queries, and code compilers. TextCase detects and strips them instantly."
  },
  {
    question: "Is this free?",
    answer: "Yes! TextCase is 100% free with unlimited usage. There are no limits on character length, no accounts or registration, and no ads. It's a pure utility designed for speed and reliability."
  }
];
