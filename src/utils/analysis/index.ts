import { AnalysisResult, ProblemReport } from "../../types";
import { analyzeMarkdown } from "./markdown";
import { analyzeUnicode } from "./unicode";
import { analyzeOcr } from "./ocr";
import { analyzeSpacing } from "./spacing";
import { analyzeParagraphs } from "./paragraph";
import { calculateHealthScore } from "./statistics";

export { calculateHealthScore, getTextStats } from "./statistics";

/**
 * Enterprise-grade Text Analysis Engine (v3) refactored with a modular, data-driven architecture.
 * Scans input text and returns a detailed report of detected formatting anomalies.
 */
export function analyzeText(text: string): AnalysisResult {
  if (!text) {
    return {
      markdown: createEmptyReport("markdown", "Markdown Found", "Markdown formatting markers like bold, italic, headers, list items, or links."),
      hiddenChars: createEmptyReport("hiddenChars", "Hidden Characters Found", "Invisible Unicode characters such as Zero-Width Spaces, BOM, or non-breaking spaces."),
      brokenLines: createEmptyReport("brokenLines", "Broken Lines", "Sentence fragments split across multiple lines or hyphenated word wraps."),
      extraSpaces: createEmptyReport("extraSpaces", "Extra Spaces", "Extraneous spaces, tabs, double/triple spaces, or excessive consecutive empty lines."),
      ocrProblems: createEmptyReport("ocrProblems", "OCR Problems", "Artifacts from optical character recognition, including hyphenated breaks or loose fragments."),
      unicodeProblems: createEmptyReport("unicodeProblems", "Unicode Problems", "Non-standard curly quotes, long dashes, mixed line endings, or repeated punctuations."),
      healthScore: 100
    };
  }

  const lines = text.split(/\r?\n/);

  // Pre-calculate hyphenated count to share between Paragraph and OCR analysis
  const hyphenatedLineRegex = /\w+-\r?\n\w+/g;
  const hyphenatedCount = (text.match(hyphenatedLineRegex) || []).length;

  // 1. Analyze Markdown
  const mdRes = analyzeMarkdown(text);

  // 2. Analyze Unicode (Hidden and Curly)
  const uniRes = analyzeUnicode(text, lines);

  // 3. Analyze Paragraphs
  const paraRes = analyzeParagraphs(text, hyphenatedCount);

  // 4. Analyze Spacing
  const spaceRes = analyzeSpacing(text);

  // 5. Analyze OCR Problems
  const ocrRes = analyzeOcr(text, lines, hyphenatedCount);

  // 6. Calculate Dynamic Health Score
  const healthScore = calculateHealthScore({
    markdown: mdRes.count,
    hiddenChars: uniRes.hiddenCount,
    brokenLines: paraRes.count,
    ocrProblems: ocrRes.count,
    extraSpaces: spaceRes.count,
    unicodeProblems: uniRes.unicodeCount
  });

  return {
    markdown: mdRes.report,
    hiddenChars: uniRes.hiddenChars,
    brokenLines: paraRes.report,
    extraSpaces: spaceRes.report,
    ocrProblems: ocrRes.report,
    unicodeProblems: uniRes.unicodeProblems,
    healthScore
  };
}

function createEmptyReport(id: string, name: string, description: string): ProblemReport {
  return {
    id,
    name,
    count: 0,
    status: "green",
    description,
    details: []
  };
}
