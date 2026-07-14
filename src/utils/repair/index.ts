import { RepairSummary } from "../../types";
import { decodeHtmlEntities } from "./html";
import { repairUnicode } from "./unicode";
import { stripMarkdown } from "./markdown";
import { repairOcrArtifacts } from "./ocr";
import { repairParagraphs } from "./paragraph";
import { normalizeSpacing } from "./spacing";

export { REPAIR_RULES } from "./rules";

interface RepairResult {
  repairedText: string;
  summary: RepairSummary;
}

/**
 * Enterprise-grade Repair Engine (v3) refactored with a modular, data-driven architecture.
 * Processes raw text through independent, ordered cleaning phases.
 */
export function repairText(text: string): RepairResult {
  if (!text) {
    return {
      repairedText: "",
      summary: {
        markdownRemoved: 0,
        hiddenCharsRemoved: 0,
        brokenLinesRepaired: 0,
        spacesNormalized: 0,
        unicodeNormalized: 0,
        ocrRepaired: 0
      }
    };
  }

  let repaired = text;

  // Initialize summary counters
  let markdownRemoved = 0;
  let hiddenCharsRemoved = 0;
  let brokenLinesRepaired = 0;
  let spacesNormalized = 0;
  let unicodeNormalized = 0;
  let ocrRepaired = 0;

  // PASS 1: Decode HTML entities
  const htmlRes = decodeHtmlEntities(repaired);
  repaired = htmlRes.repairedText;
  unicodeNormalized += htmlRes.count;

  // PASS 2: Strip hidden Unicode and ASCII controls
  const uniRes1 = repairUnicode(repaired);
  repaired = uniRes1.repairedText;
  hiddenCharsRemoved += uniRes1.hiddenRemoved;
  unicodeNormalized += uniRes1.unicodeNormalized;

  // PASS 3: OCR cleanup part 1 (Page markings & Stray hyphens)
  const ocrRes = repairOcrArtifacts(repaired);
  repaired = ocrRes.repairedText;
  ocrRepaired += ocrRes.ocrRepairedCount;
  brokenLinesRepaired += ocrRes.brokenLinesCount;

  // PASS 4: Paragraph sentence splices merging
  const paraRes = repairParagraphs(repaired);
  repaired = paraRes.repairedText;
  brokenLinesRepaired += paraRes.mergedLinesCount;
  ocrRepaired += paraRes.ocrMergedCount;

  // PASS 5: Strip markdown markers
  const mdRes = stripMarkdown(repaired);
  repaired = mdRes.repairedText;
  markdownRemoved += mdRes.count;

  // PASS 6: Spacing normalization
  const spaceRes = normalizeSpacing(repaired);
  repaired = spaceRes.repairedText;
  spacesNormalized += spaceRes.count;

  return {
    repairedText: repaired,
    summary: {
      markdownRemoved,
      hiddenCharsRemoved,
      brokenLinesRepaired,
      spacesNormalized,
      unicodeNormalized,
      ocrRepaired
    }
  };
}
