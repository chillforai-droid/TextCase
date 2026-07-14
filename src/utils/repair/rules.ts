import { RepairRule } from "../../types";

export const REPAIR_RULES: RepairRule[] = [
  // --- CATEGORY: HTML ENTITIES (Priority 10-29) ---
  {
    id: "html-middot",
    name: "Decode Middot Entity",
    category: "html",
    description: "Converts &middot; into a standard bullet dot (·).",
    regex: /&middot;/gi,
    replacement: "·",
    priority: 10,
    enabled: true,
    example: "text&middot;text"
  },
  {
    id: "html-bull",
    name: "Decode Bullet Entity",
    category: "html",
    description: "Converts &bull; into a standard list bullet (•).",
    regex: /&bull;/gi,
    replacement: "•",
    priority: 11,
    enabled: true,
    example: "&bull; bullet"
  },
  {
    id: "html-copy",
    name: "Decode Copyright Entity",
    category: "html",
    description: "Converts &copy; into ©.",
    regex: /&copy;/gi,
    replacement: "©",
    priority: 12,
    enabled: true,
    example: "&copy; 2026"
  },
  {
    id: "html-reg",
    name: "Decode Registered Entity",
    category: "html",
    description: "Converts &reg; into ®.",
    regex: /&reg;/gi,
    replacement: "®",
    priority: 13,
    enabled: true,
    example: "Brand&reg;"
  },
  {
    id: "html-trade",
    name: "Decode Trademark Entity",
    category: "html",
    description: "Converts &trade; into ™.",
    regex: /&trade;/gi,
    replacement: "™",
    priority: 14,
    enabled: true,
    example: "Brand&trade;"
  },
  {
    id: "html-euro",
    name: "Decode Euro Entity",
    category: "html",
    description: "Converts &euro; into €.",
    regex: /&euro;/gi,
    replacement: "€",
    priority: 15,
    enabled: true,
    example: "&euro;100"
  },
  {
    id: "html-deg",
    name: "Decode Degree Entity",
    category: "html",
    description: "Converts &deg; into °.",
    regex: /&deg;/gi,
    replacement: "°",
    priority: 16,
    enabled: true,
    example: "45&deg;"
  },
  {
    id: "html-mdash",
    name: "Decode Em-Dash Entity",
    category: "html",
    description: "Converts &mdash; into em-dash (—).",
    regex: /&mdash;/gi,
    replacement: "—",
    priority: 17,
    enabled: true,
    example: "word&mdash;word"
  },
  {
    id: "html-ndash",
    name: "Decode En-Dash Entity",
    category: "html",
    description: "Converts &ndash; into en-dash (–).",
    regex: /&ndash;/gi,
    replacement: "–",
    priority: 18,
    enabled: true,
    example: "1&ndash;10"
  },
  {
    id: "html-ldquo",
    name: "Decode Left Double Quote",
    category: "html",
    description: "Converts &ldquo; into left smart quote (“).",
    regex: /&ldquo;/gi,
    replacement: "“",
    priority: 19,
    enabled: true,
    example: "&ldquo;hello"
  },
  {
    id: "html-rdquo",
    name: "Decode Right Double Quote",
    category: "html",
    description: "Converts &rdquo; into right smart quote (”).",
    regex: /&rdquo;/gi,
    replacement: "”",
    priority: 20,
    enabled: true,
    example: "hello&rdquo;"
  },
  {
    id: "html-lsquo",
    name: "Decode Left Single Quote",
    category: "html",
    description: "Converts &lsquo; into left curly quote (‘).",
    regex: /&lsquo;/gi,
    replacement: "‘",
    priority: 21,
    enabled: true,
    example: "&lsquo;hello"
  },
  {
    id: "html-rsquo",
    name: "Decode Right Single Quote",
    category: "html",
    description: "Converts &rsquo; into right curly quote (’).",
    regex: /&rsquo;/gi,
    replacement: "’",
    priority: 22,
    enabled: true,
    example: "hello&rsquo;"
  },
  {
    id: "html-hellip",
    name: "Decode Ellipsis Entity",
    category: "html",
    description: "Converts &hellip; into standard periods (...).",
    regex: /&hellip;/gi,
    replacement: "...",
    priority: 23,
    enabled: true,
    example: "wait&hellip;"
  },
  {
    id: "html-lt",
    name: "Decode Less Than",
    category: "html",
    description: "Converts &lt; into <.",
    regex: /&lt;/gi,
    replacement: "<",
    priority: 24,
    enabled: true,
    example: "a &lt; b"
  },
  {
    id: "html-gt",
    name: "Decode Greater Than",
    category: "html",
    description: "Converts &gt; into >.",
    regex: /&gt;/gi,
    replacement: ">",
    priority: 25,
    enabled: true,
    example: "a &gt; b"
  },
  {
    id: "html-quot",
    name: "Decode Double Quote Entity",
    category: "html",
    description: "Converts &quot; into standard quote (\").",
    regex: /&quot;/gi,
    replacement: '"',
    priority: 26,
    enabled: true,
    example: "&quot;hello&quot;"
  },
  {
    id: "html-apos",
    name: "Decode Apostrophe Entity",
    category: "html",
    description: "Converts &apos; or &#39; into standard single quote (').",
    regex: /&apos;|&#39;/gi,
    replacement: "'",
    priority: 27,
    enabled: true,
    example: "worker&#39;s"
  },
  {
    id: "html-amp",
    name: "Decode Ampersand Entity",
    category: "html",
    description: "Converts &amp; into standard ampersand (&). Done last.",
    regex: /&amp;/gi,
    replacement: "&",
    priority: 28,
    enabled: true,
    example: "R&amp;D"
  },

  // --- CATEGORY: HIDDEN UNICODE (Priority 30-49) ---
  {
    id: "unicode-zwsp",
    name: "Remove Zero-Width Space",
    category: "unicode",
    description: "Deletes invisible compiler-breaking Zero-Width Spaces (U+200B).",
    regex: /\u200B/g,
    replacement: "",
    priority: 30,
    enabled: true,
    example: "word\u200Bword"
  },
  {
    id: "unicode-zwj",
    name: "Remove Zero-Width Joiner",
    category: "unicode",
    description: "Deletes invisible Zero-Width Joiner characters (U+200D).",
    regex: /\u200D/g,
    replacement: "",
    priority: 31,
    enabled: true,
    example: "word\u200Dword"
  },
  {
    id: "unicode-zwnj",
    name: "Remove Zero-Width Non-Joiner",
    category: "unicode",
    description: "Deletes invisible Zero-Width Non-Joiner characters (U+200C).",
    regex: /\u200C/g,
    replacement: "",
    priority: 32,
    enabled: true,
    example: "word\u200Cword"
  },
  {
    id: "unicode-bom",
    name: "Remove Byte Order Mark (BOM)",
    category: "unicode",
    description: "Purges the hidden file marker Byte Order Mark (U+FEFF).",
    regex: /\uFEFF/g,
    replacement: "",
    priority: 33,
    enabled: true,
    example: "\uFEFFstart"
  },
  {
    id: "unicode-ltr",
    name: "Remove Left-to-Right Indicator",
    category: "unicode",
    description: "Strips LTR directionality layout artifacts (U+200E).",
    regex: /\u200E/g,
    replacement: "",
    priority: 34,
    enabled: true,
    example: "\u200Etext"
  },
  {
    id: "unicode-rtl",
    name: "Remove Right-to-Left Indicator",
    category: "unicode",
    description: "Strips RTL directionality layout artifacts (U+200F).",
    regex: /\u200F/g,
    replacement: "",
    priority: 35,
    enabled: true,
    example: "\u200Ftext"
  },
  {
    id: "unicode-wj",
    name: "Remove Word Joiner",
    category: "unicode",
    description: "Strips invisible Word Joiner character formats (U+2060).",
    regex: /\u2060/g,
    replacement: "",
    priority: 36,
    enabled: true,
    example: "text\u2060text"
  },
  {
    id: "unicode-orc",
    name: "Remove Object Replacement Code",
    category: "unicode",
    description: "Strips strange placeholder Object Replacement codes (U+FFFC).",
    regex: /\uFFFC/g,
    replacement: "",
    priority: 37,
    enabled: true,
    example: "image\uFFFCtext"
  },
  {
    id: "unicode-softhyphen",
    name: "Remove Soft Hyphen",
    category: "unicode",
    description: "Clears hidden soft hyphens (U+00AD) that break text matching.",
    regex: /\u00AD/g,
    replacement: "",
    priority: 38,
    enabled: true,
    example: "un\u00ADusual"
  },
  {
    id: "unicode-hairspace",
    name: "Normalize Hair Space",
    category: "unicode",
    description: "Replaces hair-thin spaces (U+200A) with regular space.",
    regex: /\u200A/g,
    replacement: " ",
    priority: 39,
    enabled: true,
    example: "a\u200Ab"
  },
  {
    id: "unicode-thinspace",
    name: "Normalize Thin Space",
    category: "unicode",
    description: "Replaces non-standard narrow spaces (U+2009) with normal space.",
    regex: /\u2009/g,
    replacement: " ",
    priority: 40,
    enabled: true,
    example: "a\u2009b"
  },
  {
    id: "unicode-nbsp",
    name: "Normalize Non-Breaking Space",
    category: "unicode",
    description: "Converts annoying HTML &nbsp; and U+00A0 spaces into normal blank spaces.",
    regex: /\u00A0|&nbsp;/g,
    replacement: " ",
    priority: 41,
    enabled: true,
    example: "words&nbsp;words"
  },

  // --- CATEGORY: CONTROL CHARACTERS & TAGS (Priority 50-69) ---
  {
    id: "control-ascii",
    name: "Strip ASCII Controls",
    category: "control",
    description: "Deletes unprintable legacy ASCII control characters.",
    regex: /[\x00-\x08\x0B\x0C\x0E-\x1F]/g,
    replacement: "",
    priority: 50,
    enabled: true,
    example: "hello\x07world"
  },
  {
    id: "html-breaks",
    name: "Convert HTML Breaks",
    category: "control",
    description: "Converts <br> tags into standard newlines before tag purging.",
    regex: /<br\s*\/?>/gi,
    replacement: "\n",
    priority: 51,
    enabled: true,
    example: "line1<br/>line2"
  },
  {
    id: "html-strip-tags",
    name: "Strip Generic HTML Tags",
    category: "control",
    description: "Removes HTML tags while preserving text inner content.",
    regex: /<\/?[a-zA-Z1-6]+[^>]*>/g,
    replacement: "",
    priority: 52,
    enabled: true,
    example: "<p>text</p>"
  },

  // --- CATEGORY: UNICODE NORMALIZATION (Priority 70-89) ---
  {
    id: "unicode-quotes-double",
    name: "Normalize Smart Double Quotes",
    category: "unicode",
    description: "Converts curly quotes like “ ” or „ ” into flat double quotes (\").",
    regex: /[“”„‟]/g,
    replacement: '"',
    priority: 70,
    enabled: true,
    example: "“speech”"
  },
  {
    id: "unicode-quotes-single",
    name: "Normalize Smart Single Quotes",
    category: "unicode",
    description: "Converts curly single quotes ‘ ’ or ‚ ’ into standard straight apostrophes (').",
    regex: /[‘’‚‛]/g,
    replacement: "'",
    priority: 71,
    enabled: true,
    example: "worker’s"
  },
  {
    id: "unicode-backticks-as-quotes",
    name: "Convert High Backticks to Single Quotes",
    category: "unicode",
    description: "Standardizes high backticks (`) used as curly quotes.",
    regex: /`+/g,
    replacement: "'",
    priority: 72,
    enabled: true,
    example: "worker`s"
  },
  {
    id: "unicode-long-dashes",
    name: "Normalize Mathematical Dashes",
    category: "unicode",
    description: "Converts em-dashes (—) or en-dashes (–) into standard keyboard hyphens (-).",
    regex: /[—–―]/g,
    replacement: "-",
    priority: 73,
    enabled: true,
    example: "1—10"
  },
  {
    id: "unicode-periods-ellipsis",
    name: "Clean Repeated Periods",
    category: "unicode",
    description: "Converts four or more consecutive dots into standard ellipsis (...).",
    regex: /\.{4,}/g,
    replacement: "...",
    priority: 74,
    enabled: true,
    example: "wait...."
  },
  {
    id: "unicode-repeated-exclamation",
    name: "De-duplicate Exclamation Marks",
    category: "unicode",
    description: "Simplifies consecutive exclamation marks to a single one.",
    regex: /!{2,}/g,
    replacement: "!",
    priority: 75,
    enabled: true,
    example: "wow!!"
  },
  {
    id: "unicode-repeated-question",
    name: "De-duplicate Question Marks",
    category: "unicode",
    description: "Simplifies consecutive question marks to a single one.",
    regex: /\?{2,}/g,
    replacement: "?",
    priority: 76,
    enabled: true,
    example: "really??"
  },
  {
    id: "unicode-repeated-commas",
    name: "De-duplicate Commas",
    category: "unicode",
    description: "Simplifies consecutive duplicate commas.",
    regex: /,{2,}/g,
    replacement: ",",
    priority: 77,
    enabled: true,
    example: "item, , item"
  },
  {
    id: "unicode-repeated-semicolons",
    name: "De-duplicate Semicolons",
    category: "unicode",
    description: "Simplifies duplicate semicolons.",
    regex: /;{2,}/g,
    replacement: ";",
    priority: 78,
    enabled: true,
    example: "code;;"
  },

  // --- CATEGORY: OCR REPAIR / DOCUMENT CLEANUP (Priority 90-109) ---
  {
    id: "ocr-page-indicators",
    name: "Remove Page Margins / Headers",
    category: "ocr",
    description: "Clears PDF page numbers, 'Page X of Y' or '[X/Y]' indicators on isolated lines.",
    regex: /^\s*(Page \d+ of \d+|Page \d+|\b\d+ of \d+\b|\[\d+\/\d+\])\s*$/gim,
    replacement: "",
    priority: 90,
    enabled: true,
    example: "Page 4 of 24"
  },
  {
    id: "ocr-stray-hyphen-spaces",
    name: "Join Stray Spaced Hyphens",
    category: "ocr",
    description: "Joins stray spaced hyphens back into compounds (e.g. text - book -> text-book).",
    regex: /(\b[a-zA-Z]+)\s+-\s+([a-zA-Z]+\b)/g,
    replacement: "$1-$2",
    priority: 92,
    enabled: true,
    example: "text - book"
  },

  // --- CATEGORY: MARKDOWN SYNTAX (Priority 110-149) ---
  {
    id: "md-code-block-lang",
    name: "Strip Language Codeblocks",
    category: "markdown",
    description: "Clears codeblock backticks and language definitions.",
    regex: /```[a-zA-Z0-9-]*\r?\n([\s\S]*?)```/g,
    replacement: "$1",
    priority: 110,
    enabled: true,
    example: "```javascript\nconst x = 1;\n```"
  },
  {
    id: "md-code-block-raw",
    name: "Strip Raw Codeblocks",
    category: "markdown",
    description: "Removes multi-line code boundaries.",
    regex: /```([\s\S]*?)```/g,
    replacement: "$1",
    priority: 111,
    enabled: true,
    example: "```code```"
  },
  {
    id: "md-inline-code",
    name: "Strip Inline Backticks",
    category: "markdown",
    description: "Strips single inline code backticks.",
    regex: /`([^`\n]+)`/g,
    replacement: "$1",
    priority: 112,
    enabled: true,
    example: "`code`"
  },
  {
    id: "md-bold-stars",
    name: "Strip Bold Stars (**)",
    category: "markdown",
    description: "Strips double asterisks formatting stars.",
    regex: /\*\*([^*]+)\*\*/g,
    replacement: "$1",
    priority: 113,
    enabled: true,
    example: "**bold**"
  },
  {
    id: "md-bold-underscores",
    name: "Strip Bold Underscores (__)",
    category: "markdown",
    description: "Strips bold underscore markers.",
    regex: /__([^_]+)__/g,
    replacement: "$1",
    priority: 114,
    enabled: true,
    example: "__bold__"
  },
  {
    id: "md-italic-stars",
    name: "Strip Italic Stars (*)",
    category: "markdown",
    description: "Strips single star italic markers.",
    regex: /\*([^*]+)\*/g,
    replacement: "$1",
    priority: 115,
    enabled: true,
    example: "*italic*"
  },
  {
    id: "md-italic-underscores",
    name: "Strip Italic Underscores (_)",
    category: "markdown",
    description: "Strips single underscore italic markers.",
    regex: /_([^_]+)_/g,
    replacement: "$1",
    priority: 116,
    enabled: true,
    example: "_italic_"
  },
  {
    id: "md-strikethrough",
    name: "Strip Strikethroughs (~~)",
    category: "markdown",
    description: "Strips strikethrough wave markers.",
    regex: /~~([^~]+)~~/g,
    replacement: "$1",
    priority: 117,
    enabled: true,
    example: "~~striked~~"
  },
  {
    id: "md-headers",
    name: "Strip Hash Headers (#)",
    category: "markdown",
    description: "Deletes leading markdown header symbols.",
    regex: /^#{1,6}\s+(.+)$/gm,
    replacement: "$1",
    priority: 118,
    enabled: true,
    example: "### Header Title"
  },
  {
    id: "md-task-checkboxes",
    name: "Strip Task Checkboxes",
    category: "markdown",
    description: "Strips list checkboxes like - [ ] or - [x].",
    regex: /^\s*[-*+]\s*\[[ xX]\]\s*(.+)$/gm,
    replacement: "$1",
    priority: 119,
    enabled: true,
    example: "- [x] task item"
  },
  {
    id: "md-unordered-bullets",
    name: "Strip Unordered Bullet Lists",
    category: "markdown",
    description: "Removes unordered list bullet characters.",
    regex: /^\s*[-*+]\s+(.+)$/gm,
    replacement: "$1",
    priority: 120,
    enabled: true,
    example: "- Bullet point"
  },
  {
    id: "md-ordered-numbers",
    name: "Strip Ordered List Numbers",
    category: "markdown",
    description: "Strips digits and dots from ordered lists.",
    regex: /^\s*\d+\.\s+(.+)$/gm,
    replacement: "$1",
    priority: 121,
    enabled: true,
    example: "1. List item"
  },
  {
    id: "md-blockquotes",
    name: "Strip Blockquote Markers (>)",
    category: "markdown",
    description: "Strips leading markdown quotation blocks.",
    regex: /^\s*>\s*(.+)$/gm,
    replacement: "$1",
    priority: 122,
    enabled: true,
    example: "> Quoted text"
  },
  {
    id: "md-images",
    name: "Strip Markdown Images",
    category: "markdown",
    description: "Extracts image alternative titles and strips link URLs.",
    regex: /!\[([^\]]*)\]\(([^)]+)\)/g,
    replacement: "$1",
    priority: 123,
    enabled: true,
    example: "![caption](url)"
  },
  {
    id: "md-links",
    name: "Strip Hyperlinks",
    category: "markdown",
    description: "Converts links like [Text](URL) into a clean, human-readable format.",
    regex: /\[([^\]]+)\]\(([^)]+)\)/g,
    replacement: "$1 ($2)",
    priority: 124,
    enabled: true,
    example: "[Google](https://google.com)"
  },
  {
    id: "md-horizontal-rules",
    name: "Strip Horizontal Rules",
    category: "markdown",
    description: "Strips separator divider lines.",
    regex: /^\s*([-*_])\1{2,}\s*$/gm,
    replacement: "",
    priority: 125,
    enabled: true,
    example: "---"
  }
];
