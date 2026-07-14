import { ProblemReport } from "../../types";

export function analyzeOcr(text: string, lines: string[], hyphenatedCount: number): { report: ProblemReport; count: number } {
  const trailingSpacedLineRegex = /[ \t]+\r?\n/g;
  const strayHyphensRegex = /(\b[a-zA-Z]+)\s+-\s+([a-zA-Z]+\b)/g;
  const pageLinesRegex = /^\s*(Page \d+ of \d+|Page \d+|\b\d+ of \d+\b|\[\d+\/\d+\])\s*$/gim;

  const trailingSpacedLineCount = (text.match(trailingSpacedLineRegex) || []).length;
  const strayHyphensCount = (text.match(strayHyphensRegex) || []).length;
  const pageLinesCount = (text.match(pageLinesRegex) || []).length;

  let paragraphSplitCount = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i].trim();
    const next = lines[i + 1].trim();
    if (
      current.length > 0 &&
      next.length > 0 &&
      /[a-zA-Z,;]$/.test(current) &&
      /^[a-z]/.test(next) &&
      !current.endsWith(".") &&
      !current.endsWith(":") &&
      !current.endsWith("?") &&
      !current.endsWith("!") &&
      !current.startsWith("#") &&
      !current.startsWith("-")
    ) {
      paragraphSplitCount++;
    }
  }

  const ocrProblemsTotal = hyphenatedCount + paragraphSplitCount + strayHyphensCount + trailingSpacedLineCount + pageLinesCount;
  const ocrProblemsDetails: string[] = [];
  if (hyphenatedCount > 0) ocrProblemsDetails.push(`${hyphenatedCount} hyphenated word wraps`);
  if (paragraphSplitCount > 0) ocrProblemsDetails.push(`${paragraphSplitCount} mid-paragraph line splices`);
  if (strayHyphensCount > 0) ocrProblemsDetails.push(`${strayHyphensCount} isolated spaces around hyphens`);
  if (trailingSpacedLineCount > 0) ocrProblemsDetails.push(`${trailingSpacedLineCount} line(s) with trailing white-space`);
  if (pageLinesCount > 0) ocrProblemsDetails.push(`${pageLinesCount} page number footer line(s)`);

  return {
    count: ocrProblemsTotal,
    report: {
      id: "ocrProblems",
      name: "OCR Problems",
      count: ocrProblemsTotal,
      status: ocrProblemsTotal === 0 ? "green" : ocrProblemsTotal <= 5 ? "yellow" : "red",
      description: "Artifacts from optical character recognition, including hyphenated breaks or loose fragments.",
      details: ocrProblemsDetails
    }
  };
}
