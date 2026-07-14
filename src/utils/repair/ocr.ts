import { REPAIR_RULES } from "./rules";

export function repairOcrArtifacts(text: string): { repairedText: string; ocrRepairedCount: number; brokenLinesCount: number } {
  let repaired = text;
  let ocrRepairedCount = 0;
  let brokenLinesCount = 0;

  // 1. Remove Page Margins/Headers/Footers (ocr-page-indicators)
  const pageRule = REPAIR_RULES.find(r => r.id === "ocr-page-indicators");
  if (pageRule && pageRule.enabled) {
    const pageMatches = repaired.match(pageRule.regex) || [];
    if (pageMatches.length > 0) {
      ocrRepairedCount += pageMatches.length;
      repaired = repaired.replace(pageRule.regex, pageRule.replacement as string);
    }
  }

  // 2. Re-join hyphenated line wraps (e.g. coordi-\nnate -> coordinate)
  const hyphenatedRegex = /(\w+)-\r?\n(\w+)/g;
  const hyphenatedMatches = repaired.match(hyphenatedRegex) || [];
  if (hyphenatedMatches.length > 0) {
    brokenLinesCount += hyphenatedMatches.length;
    ocrRepairedCount += hyphenatedMatches.length;
    repaired = repaired.replace(hyphenatedRegex, "$1$2");
  }

  // 3. Join stray spaced hyphens (ocr-stray-hyphen-spaces)
  const strayRule = REPAIR_RULES.find(r => r.id === "ocr-stray-hyphen-spaces");
  if (strayRule && strayRule.enabled) {
    const strayMatches = repaired.match(strayRule.regex) || [];
    if (strayMatches.length > 0) {
      ocrRepairedCount += strayMatches.length;
      repaired = repaired.replace(strayRule.regex, strayRule.replacement as string);
    }
  }

  return { repairedText: repaired, ocrRepairedCount, brokenLinesCount };
}
