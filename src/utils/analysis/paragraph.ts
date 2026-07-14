import { ProblemReport } from "../../types";

export function analyzeParagraphs(text: string, hyphenatedCount: number): { report: ProblemReport; count: number } {
  const brokenOcrLinesRegex = /[a-zA-Z,;]\n[a-z]/g;
  const brokenOcrLinesCount = (text.match(brokenOcrLinesRegex) || []).length;

  const brokenLinesTotal = brokenOcrLinesCount + hyphenatedCount;
  const brokenLinesDetails: string[] = [];
  if (brokenOcrLinesCount > 0) brokenLinesDetails.push(`${brokenOcrLinesCount} mid-sentence line break(s)`);
  if (hyphenatedCount > 0) brokenLinesDetails.push(`${hyphenatedCount} hyphenated line wrap(s) (e.g. part-\\nner)`);

  return {
    count: brokenLinesTotal,
    report: {
      id: "brokenLines",
      name: "Broken Lines",
      count: brokenLinesTotal,
      status: brokenLinesTotal === 0 ? "green" : brokenLinesTotal <= 5 ? "yellow" : "red",
      description: "Sentence fragments split across multiple lines or hyphenated word wraps.",
      details: brokenLinesDetails
    }
  };
}
