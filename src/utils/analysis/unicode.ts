import { ProblemReport } from "../../types";

export interface UnicodeAnalysis {
  hiddenChars: ProblemReport;
  hiddenCount: number;
  unicodeProblems: ProblemReport;
  unicodeCount: number;
}

export function analyzeUnicode(text: string, lines: string[]): UnicodeAnalysis {
  // 1. Hidden characters detection
  const zwspRegex = /\u200B/g;
  const zwjRegex = /\u200D/g;
  const zwnjRegex = /\u200C/g;
  const nbspRegex = /\u00A0|&nbsp;/g;
  const bomRegex = /\uFEFF/g;
  const ltrRegex = /\u200E/g;
  const rtlRegex = /\u200F/g;
  const wjRegex = /\u2060/g;
  const orcRegex = /\uFFFC/g;
  const softHyphenRegex = /\u00AD/g;
  const thinSpaceRegex = /[\u2009\u200A]/g;
  const controlCharsRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

  const zwspCount = (text.match(zwspRegex) || []).length;
  const zwjCount = (text.match(zwjRegex) || []).length;
  const zwnjCount = (text.match(zwnjRegex) || []).length;
  const nbspCount = (text.match(nbspRegex) || []).length;
  const bomCount = (text.match(bomRegex) || []).length;
  const ltrCount = (text.match(ltrRegex) || []).length;
  const rtlCount = (text.match(rtlRegex) || []).length;
  const wjCount = (text.match(wjRegex) || []).length;
  const orcCount = (text.match(orcRegex) || []).length;
  const softHyphenCount = (text.match(softHyphenRegex) || []).length;
  const thinSpaceCount = (text.match(thinSpaceRegex) || []).length;
  const controlCharsCount = (text.match(controlCharsRegex) || []).length;

  const hiddenCharsTotal = zwspCount + zwjCount + zwnjCount + nbspCount + bomCount + ltrCount + rtlCount + wjCount + orcCount + softHyphenCount + thinSpaceCount + controlCharsCount;
  const hiddenCharsDetails: string[] = [];
  if (zwspCount > 0) hiddenCharsDetails.push(`${zwspCount} Zero-Width Space(s) (U+200B)`);
  if (zwjCount > 0) hiddenCharsDetails.push(`${zwjCount} Zero-Width Joiner(s) (U+200D)`);
  if (zwnjCount > 0) hiddenCharsDetails.push(`${zwnjCount} Zero-Width Non-Joiner(s) (U+200C)`);
  if (nbspCount > 0) hiddenCharsDetails.push(`${nbspCount} Non-Breaking Space(s) (U+00A0)`);
  if (bomCount > 0) hiddenCharsDetails.push(`${bomCount} Byte Order Mark(s) (U+FEFF)`);
  if (ltrCount > 0 || rtlCount > 0) hiddenCharsDetails.push(`${ltrCount + rtlCount} text direction indicator(s) (LTR/RTL)`);
  if (wjCount > 0) hiddenCharsDetails.push(`${wjCount} hidden Word Joiner(s) (U+2060)`);
  if (orcCount > 0) hiddenCharsDetails.push(`${orcCount} Object Replacement code(s) (U+FFFC)`);
  if (softHyphenCount > 0) hiddenCharsDetails.push(`${softHyphenCount} soft hyphen(s) (U+00AD)`);
  if (thinSpaceCount > 0) hiddenCharsDetails.push(`${thinSpaceCount} thin/hair spaces`);
  if (controlCharsCount > 0) hiddenCharsDetails.push(`${controlCharsCount} unprintable ASCII control characters`);

  // 2. Unicode Problems (Quotes, punctuation, etc.)
  const curlyDoubleQuotesRegex = /[“”„‟]/g;
  const curlySingleQuotesRegex = /[‘’‚‛]/g;
  const longDashRegex = /[—–―]/g;
  const mixedLineEndings = text.includes("\r\n") && text.includes("\n") && !text.endsWith("\r\n");
  const repeatedPunctuationRegex = /[.]{4,}|!{2,}|\?{2,}|,{2,}/g;
  const htmlEntityRegex = /&(middot|bull|copy|reg|trade|euro|deg|mdash|ndash|ldquo|rdquo|lsquo|rsquo|hellip|lt|gt|quot|apos|amp|#[0-9]+);/gi;

  const curlyDoubleCount = (text.match(curlyDoubleQuotesRegex) || []).length;
  const curlySingleCount = (text.match(curlySingleQuotesRegex) || []).length;
  const longDashCount = (text.match(longDashRegex) || []).length;
  const mixedLineEndingsCount = mixedLineEndings ? 1 : 0;
  const repeatedPunctuationCount = (text.match(repeatedPunctuationRegex) || []).length;
  const htmlEntityCount = (text.match(htmlEntityRegex) || []).length;

  let leadingTrailingCount = 0;
  lines.forEach(l => {
    if (l.startsWith(" ") || l.startsWith("\t") || l.endsWith(" ") || l.endsWith("\t")) {
      leadingTrailingCount++;
    }
  });

  const unicodeProblemsTotal = curlyDoubleCount + curlySingleCount + longDashCount + mixedLineEndingsCount + repeatedPunctuationCount + leadingTrailingCount + htmlEntityCount;
  const unicodeProblemsDetails: string[] = [];
  if (curlyDoubleCount > 0) unicodeProblemsDetails.push(`${curlyDoubleCount} smart double quote(s) (“ ”)`);
  if (curlySingleCount > 0) unicodeProblemsDetails.push(`${curlySingleCount} curly single quote/apostrophe(s) (‘ ’)`);
  if (longDashCount > 0) unicodeProblemsDetails.push(`${longDashCount} mathematical or non-standard dash(es)`);
  if (mixedLineEndingsCount > 0) unicodeProblemsDetails.push("Mixed line breaks (CRLF and LF) detected");
  if (repeatedPunctuationCount > 0) unicodeProblemsDetails.push(`${repeatedPunctuationCount} repeated punctuation sequences`);
  if (leadingTrailingCount > 0) unicodeProblemsDetails.push(`${leadingTrailingCount} line(s) with leading/trailing white-space`);
  if (htmlEntityCount > 0) unicodeProblemsDetails.push(`${htmlEntityCount} HTML encoded entities (e.g. &amp;, &quot;)`);

  return {
    hiddenCount: hiddenCharsTotal,
    hiddenChars: {
      id: "hiddenChars",
      name: "Hidden Characters Found",
      count: hiddenCharsTotal,
      status: hiddenCharsTotal === 0 ? "green" : hiddenCharsTotal <= 5 ? "yellow" : "red",
      description: "Invisible Unicode characters such as Zero-Width Spaces, BOM, or non-breaking spaces.",
      details: hiddenCharsDetails
    },
    unicodeCount: unicodeProblemsTotal,
    unicodeProblems: {
      id: "unicodeProblems",
      name: "Unicode Problems",
      count: unicodeProblemsTotal,
      status: unicodeProblemsTotal === 0 ? "green" : unicodeProblemsTotal <= 5 ? "yellow" : "red",
      description: "Non-standard curly quotes, long dashes, mixed line endings, or repeated punctuations.",
      details: unicodeProblemsDetails
    }
  };
}
