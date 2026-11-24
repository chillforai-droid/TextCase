import { GoogleGenAI, Type } from "@google/genai";

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export const SYSTEM_INSTRUCTION = `You are the TextCase AI Agent — the unified voice and text assistant built into TextCase (https://www.textcase.in), "Smart Text Fixer".

Your mission: Perform EVERY task that TextCase's website pages do — directly via user text or voice commands — so the user never has to navigate across multiple pages unless they explicitly ask to open a page.

LANGUAGE & TONE:
- Respond naturally in the user's language (Hindi, Hinglish, English, or any language they write/speak in). If the user speaks or writes in Hindi or Hinglish, reply clearly in friendly, natural Hindi/Hinglish (using simple, clear phrasing; keep technical terms like Markdown, Unicode, PDF, OCR, Title Case, DOCX clear).
- Be concise, action-oriented, and helpful. When you execute tools, confirm what was done and summarize key results (e.g., number of issues fixed, health score, converted output preview, exported file format).
- Never invent or hallucinate tool results; always call the appropriate tool(s) to read or modify real website state.

COMPLETE WEBSITE KNOWLEDGE BASE (TextCase):
1. Core Brand & Principles:
   - Name: TextCase ("Fix Broken Text Instantly").
   - Core Engine: 100% browser-local text analysis, repair, and case conversion engine (JavaScript/TypeScript regex & Unicode pipeline). When using the local editor/tools directly, text stays in browser RAM; when using this AI Agent, user messages and workspace context are processed via the server-side Gemini API.
   - Free, unlimited character length, no account required.
   - Keyboard shortcuts: Ctrl+Enter (Fix Text Instantly), Ctrl+Shift+Enter (Analyze Text), Ctrl+L (Clear Editor).
   - File Import: Drag-and-drop or upload .txt, .md, .html, and .docx (parsed locally with Mammoth).
   - Multi-Format Export: .txt (Plain Text), .md (Markdown), .html (Styled HTML Document), .doc (Word-compatible MS Word HTML document).

2. All 10 Specialty Tools / Landing Pages:
   - "default" (/) — Smart Text Fixer: All-in-one repair for broken copy-pastes, OCR glitches, markdown, and hidden Unicode.
   - "fix-chatgpt-formatting" (/fix-chatgpt-formatting) — ChatGPT Formatting: Strips markdown headers (#), bold (**), italics (*), backticks (\`), code blocks, links, blockquotes from ChatGPT, Claude, Gemini, DeepSeek.
   - "fix-pdf-text" (/fix-pdf-text) — PDF Text Repair: Merges sentences split mid-paragraph by PDF column margins and rejoins hyphenated words (e.g. "per-\\nsonal" -> "personal").
   - "fix-copy-paste-text" (/fix-copy-paste-text) — Copy-Paste Cleaner: Removes duplicate spaces, excessive tabs, curly smart quotes (“ ” ‘ ’ -> " '), and web paste artifacts.
   - "remove-hidden-unicode" (/remove-hidden-unicode) — Remove Hidden Unicode: Detects and removes Zero-Width Spaces (ZWSP U+200B), Byte Order Marks (BOM U+FEFF), Zero-Width Joiners/Non-Joiners (ZWJ/ZWNJ), Non-Breaking Spaces (NBSP U+00A0), and unprintable control chars that break compilers/databases.
   - "fix-ocr-text" (/fix-ocr-text) — OCR Text Repair: Cleans scanner artifacts like repeated commas (", , ,"), spaced periods (". . ."), repeated punctuation ("!! !!"), page markers ("Page 12 of 150"), hyphenated wraps, and split sentences.
   - "remove-markdown" (/remove-markdown) — Remove Markdown: Converts CommonMark/GFM markdown (headers, emphasis, links [Label](URL) -> Label (URL), blockquotes, task lists, tables) into clean plain text.
   - "remove-extra-spaces" (/remove-extra-spaces) — Remove Extra Spaces: Trims whitespace, collapses multiple spaces/tabs, normalizes excessive blank lines while preserving paragraph breaks.
   - "repair-text" (/repair-text) — Repair Text: Comprehensive multi-pass text restorer combining all 6 cleaning passes.
   - "case-converter" (/case-converter) — Case Converter: Converts text to UPPERCASE ("upper"), lowercase ("lower"), Title Case ("title"), Sentence case ("sentence"), or Capitalize Each Line ("capitalize-lines"). Note: Case conversion is intentionally separate from Fix Text so repair never alters letter casing unexpectedly.

3. Six-Pass Repair Engine Architecture:
   - Pass 1: Decode HTML entities (&amp;, &nbsp;, &quot;, etc.).
   - Pass 2: Strip hidden Unicode (ZWSP, BOM, control chars) and normalize curly quotes/dashes.
   - Pass 3: OCR cleanup (stray hyphens, page markings, repeated punctuation).
   - Pass 4: Paragraph & sentence splicing (rejoin split lines while preserving true paragraph breaks).
   - Pass 5: Strip Markdown syntax markers.
   - Pass 6: Normalize horizontal spaces, tabs, and blank lines.

4. Workspace Features:
   - Interactive Workspace ("edit") vs Diff Auditor ("compare" in "side" Side-by-Side or "unified" view).
   - Real-Time Scanner: Inspects Markdown, Hidden Characters, Broken Lines, Extra Spaces, OCR Problems, Unicode Problems, and computes a Health Score (0-100) plus character/word/line counts.
   - Audit Report Modal: Detailed summary seal showing before/after character counts and fixes per category.
   - Local History: Saves up to 15 recent repairs in browser localStorage for instant restore.

5. Other Website Pages (which you can serve directly via lookup_site_content or submit_user_message):
   - Blog / How-To Guides (/blog): 5 in-depth guides:
     1) "fix-chatgpt-formatting" — How to Fix ChatGPT Formatting and Strip Markdown
     2) "fix-pdf-copy-text" — Why Copying Text from PDFs Breaks Lines and How to Fix It
     3) "remove-hidden-unicode" — The Danger of Hidden Unicode Characters (ZWSP, BOM, and NBSP)
     4) "remove-markdown" — A Complete Guide to Removing Markdown and Copying Raw Text
     5) "repair-ocr-text" — How to Repair OCR Text and Clean Scan Copy Errors
   - Prompt Store (/prompt-store): Curated AI prompts organized by category (fetched from Supabase when configured).
   - Roadmap (/roadmap): Product roadmap (completed, in-progress like Batch File Processing, planned like Browser Extension & Custom Regex Rules Engine).
   - Changelog (/changelog): Release history (v1.0.5 SEO/domains, v1.0.2 Unicode scanner, v1.0.0 Core Repair Engine).
   - Feedback Board (/feedback) & Contact Support (/contact): Users can submit bug reports, feature suggestions, or support inquiries directly through you using submit_user_message!
   - About (/about), Privacy Policy (/privacy), Terms of Service (/terms), Sitemap (/sitemap), Robots (/robots).
   - Related Creator Projects mentioned on site: VoiceID (voiceid.online) and Texly (texlyonline.in).

EXECUTION RULES:
- If the user provides text inside their prompt AND asks to fix/clean/convert/analyze it, pass that text to the tool (e.g., repair_text({ text }), convert_case({ mode, text }), analyze_text({ text })).
- If the user says "isko fix karo", "fix the text", "convert to title case", "export word doc", etc., WITHOUT pasting new text, operate directly on the CURRENT editor text shown in Workspace Context!
- If the user asks multiple things in one command (e.g. "repair text, convert to sentence case, and copy it" or "load PDF sample and fix it"), execute all required tools in sequence!
- For any questions about guides, FAQs, roadmap, changelog, prompt store, about, privacy, or terms, call lookup_site_content to fetch exact live/local site content and explain clearly without forcing the user to leave the current page.
- Only call navigate_to_page if the user explicitly asks to open/visit a page.`;

export const AGENT_TOOLS = [
  {
    name: "repair_text",
    description:
      "Run TextCase's 6-pass text repair engine to fix broken lines, PDF hyphenations, ChatGPT Markdown, OCR artifacts, extra spaces, smart quotes, HTML entities, and hidden Unicode. Optionally accepts new text to put into the editor before repairing.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "Optional text to place in the editor and repair. If omitted, repairs the current editor text.",
        },
        mode: {
          type: Type.STRING,
          description:
            "Optional context mode (e.g., default, fix-chatgpt-formatting, fix-pdf-text, fix-copy-paste-text, remove-hidden-unicode, fix-ocr-text, remove-markdown, remove-extra-spaces, repair-text).",
        },
      },
    },
  },
  {
    name: "analyze_text",
    description:
      "Scan text in the workspace (or provided text) to compute Health Score (0-100), character/word/line counts, and exact counts of Markdown, Hidden Unicode, Broken Lines, Extra Spaces, OCR Problems, and Unicode Problems.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "Optional text to load and analyze. If omitted, analyzes current editor text.",
        },
      },
    },
  },
  {
    name: "convert_case",
    description:
      "Convert current editor text (or provided text) into UPPERCASE, lowercase, Title Case, Sentence case, or Capitalize Each Line.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        mode: {
          type: Type.STRING,
          description: "One of: 'upper', 'lower', 'title', 'sentence', 'capitalize-lines'.",
        },
        text: {
          type: Type.STRING,
          description: "Optional text to convert. If omitted, converts current editor text.",
        },
      },
      required: ["mode"],
    },
  },
  {
    name: "set_editor_text",
    description: "Set or append text in the live TextCase editor.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "The text content to put into the editor.",
        },
        append: {
          type: Type.BOOLEAN,
          description: "If true, appends to existing editor text instead of replacing it.",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "load_sample_text",
    description:
      "Load built-in sample messy text for a specific TextCase tool so the user can test or demonstrate it.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        pageKey: {
          type: Type.STRING,
          description:
            "Tool key: 'default', 'fix-chatgpt-formatting', 'fix-pdf-text', 'fix-copy-paste-text', 'remove-hidden-unicode', 'fix-ocr-text', 'remove-markdown', 'remove-extra-spaces', 'repair-text', or 'case-converter'.",
        },
      },
    },
  },
  {
    name: "clear_editor",
    description: "Clear all text and reset repair state in the TextCase editor.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: "copy_output",
    description: "Copy the current text from the TextCase editor to the user's clipboard.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: "export_document",
    description: "Export and download the current editor text as a file.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        format: {
          type: Type.STRING,
          description: "Export format: 'txt', 'md', 'html', or 'docx'.",
        },
      },
      required: ["format"],
    },
  },
  {
    name: "switch_workspace_view",
    description:
      "Switch the workspace view between Interactive Editor ('edit'), Diff Auditor ('compare'), or open the detailed Audit Report Modal ('audit_report').",
    parameters: {
      type: Type.OBJECT,
      properties: {
        view: {
          type: Type.STRING,
          description: "Target view: 'edit', 'compare', or 'audit_report'.",
        },
        compareMode: {
          type: Type.STRING,
          description: "When view is 'compare', optional diff mode: 'side' or 'unified'.",
        },
      },
      required: ["view"],
    },
  },
  {
    name: "manage_history",
    description: "List saved local repair history, restore an item by 1-based index, or clear history.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          description: "Action: 'list', 'restore', or 'clear'.",
        },
        index: {
          type: Type.NUMBER,
          description: "1-based index of history item to restore when action is 'restore'.",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "set_theme",
    description: "Change the website UI theme between light, dark, or system.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        theme: {
          type: Type.STRING,
          description: "Theme value: 'light', 'dark', or 'system'.",
        },
      },
      required: ["theme"],
    },
  },
  {
    name: "lookup_site_content",
    description:
      "Retrieve full content from any TextCase page without navigating away: blog guides, FAQs, Prompt Store categories/prompts, Roadmap, Changelog, About, Privacy, or Terms.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        section: {
          type: Type.STRING,
          description:
            "Section: 'blog_list', 'blog_article', 'faq', 'prompt_store', 'roadmap', 'changelog', 'about', 'privacy', 'terms', or 'tools_overview'.",
        },
        slugOrQuery: {
          type: Type.STRING,
          description: "Optional blog slug, prompt category slug, or search query.",
        },
      },
      required: ["section"],
    },
  },
  {
    name: "submit_user_message",
    description:
      "Submit user feedback to the Feedback Board or send a support inquiry to the Contact Support database without visiting those pages.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        type: {
          type: Type.STRING,
          description: "'feedback' or 'contact'.",
        },
        name: {
          type: Type.STRING,
          description: "User's name (defaults to 'Voice/Chat User' for feedback if not given).",
        },
        email: {
          type: Type.STRING,
          description: "User's email address (required for 'contact' support messages).",
        },
        message: {
          type: Type.STRING,
          description: "The feedback or support message text.",
        },
        feedbackType: {
          type: Type.STRING,
          description: "For feedback: 'Bug', 'Feature Request', or 'Suggestion'.",
        },
        category: {
          type: Type.STRING,
          description: "For feedback: 'General', 'PDF', 'ChatGPT', 'OCR', 'Unicode', or 'Markdown'.",
        },
        isPublic: {
          type: Type.BOOLEAN,
          description: "Whether feedback should appear publicly on the Feedback Board.",
        },
      },
      required: ["type", "message"],
    },
  },
  {
    name: "navigate_to_page",
    description:
      "Navigate the browser to a specific TextCase route ONLY when the user explicitly asks to open or view that page.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description:
            "Route path like '/', '/blog', '/prompt-store', '/roadmap', '/changelog', '/feedback', '/about', '/contact', '/privacy', '/terms', '/fix-chatgpt-formatting', '/fix-pdf-text', etc.",
        },
      },
      required: ["path"],
    },
  },
];

function buildContextPrompt(ctx) {
  if (!ctx) return "";
  const preview = (ctx.inputText || "").slice(0, 3500);
  const truncated = (ctx.inputText || "").length > 3500 ? "\n...[truncated]..." : "";
  return `\n\n[LIVE WORKSPACE CONTEXT]
- Current Route: ${ctx.currentRoute || "/"}
- Active Tool Mode: ${ctx.currentLandingPage || "default"}
- Active Tab: ${ctx.activeTab || "edit"} (compareMode: ${ctx.compareMode || "side"})
- Repaired State: ${ctx.isRepaired ? "Yes" : "No"}
- Selected Case Mode: ${ctx.caseMode || "none"}
- Theme: ${ctx.theme || "system"}
- History Items: ${ctx.historyCount ?? 0}
- Text Length: ${(ctx.inputText || "").length} chars
- Live Analysis: ${
    ctx.analysis
      ? `Health ${ctx.analysis.healthScore}/100 | Markdown: ${ctx.analysis.markdown}, HiddenChars: ${ctx.analysis.hiddenChars}, BrokenLines: ${ctx.analysis.brokenLines}, ExtraSpaces: ${ctx.analysis.extraSpaces}, OCR: ${ctx.analysis.ocrProblems}, Unicode: ${ctx.analysis.unicodeProblems}`
      : "N/A"
  }
- Current Editor Text:
"""
${preview}${truncated}
"""`;
}

export function formatGeminiError(err) {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg === "GEMINI_API_KEY_MISSING") {
    return {
      status: 500,
      message: "GEMINI_API_KEY is not configured. Please add your Gemini API key in Settings > Secrets (or Vercel Environment Variables).",
    };
  }
  if (msg.includes("403") || msg.includes("PERMISSION_DENIED") || msg.includes("API_KEY_INVALID") || msg.includes("400")) {
    return {
      status: 400,
      message: "Gemini API key error. Please verify your GEMINI_API_KEY in Settings > Secrets (or Vercel Environment Variables).",
    };
  }
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message: "Gemini API rate limit reached. Please wait a moment and try again.",
    };
  }
  if (msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand")) {
    return {
      status: 503,
      message: "AI model is temporarily busy due to high demand. Please try again in a few seconds.",
    };
  }
  return {
    status: 500,
    message: msg || "Failed to process AI Agent request.",
  };
}

export async function handleAgentChat(body) {
  const ai = getAiClient();
  const {
    messages = [],
    workspaceContext,
    contentsOverride,
    toolResponses,
  } = body || {};

  const contextSuffix = buildContextPrompt(workspaceContext);

  let contents;
  if (Array.isArray(contentsOverride) && contentsOverride.length > 0) {
    contents = [...contentsOverride];
    if (Array.isArray(toolResponses) && toolResponses.length > 0) {
      contents.push({
        role: "user",
        parts: toolResponses.map((tr) => ({
          functionResponse: {
            id: tr.id,
            name: tr.name,
            response: tr.response,
          },
        })),
      });
    }
  } else {
    const recentMessages = messages.slice(-16);
    contents = recentMessages.map((m, idx) => {
      const isLastUser = idx === recentMessages.length - 1 && m.role === "user";
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: isLastUser ? `${m.text}${contextSuffix}` : m.text }],
      };
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-4-hydrogen",
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: AGENT_TOOLS }],
    },
  });

  const functionCalls = response.functionCalls;
  const modelTurnContent = response.candidates?.[0]?.content;

  if (functionCalls && functionCalls.length > 0 && modelTurnContent) {
    return {
      type: "tool_calls",
      calls: functionCalls.map((fc) => ({
        id: fc.id,
        name: fc.name,
        args: fc.args || {},
      })),
      updatedContents: [...contents, modelTurnContent],
    };
  }

  return {
    type: "message",
    text: response.text || "Done.",
  };
}

export async function handleAgentTranscribe(body) {
  const ai = getAiClient();
  const { audioBase64, mimeType, languageHint } = body || {};

  if (!audioBase64) {
    const err = new Error("Missing audio payload.");
    err.statusCode = 400;
    throw err;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.5-transcribe",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType || "audio/webm",
            data: audioBase64,
          },
        },
        {
          text: languageHint
            ? `Transcribe this voice command accurately. Expected language/script hint: ${languageHint}. Return only the spoken words.`
            : "Transcribe this voice command accurately (may be Hindi, Hinglish, or English). Return only the spoken words.",
        },
      ],
    },
  });

  return {
    text: (response.text || "").trim(),
  };
}
