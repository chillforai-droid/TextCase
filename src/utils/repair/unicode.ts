import { REPAIR_RULES } from "./rules";

export function repairUnicode(text: string): { repairedText: string; hiddenRemoved: number; unicodeNormalized: number } {
  let repaired = text;
  let hiddenRemoved = 0;
  let unicodeNormalized = 0;

  // 1. Process Hidden Unicode characters (category: "unicode" and rule id starts with "unicode-zw" / "unicode-bom" / "unicode-ltr" / "unicode-rtl" / "unicode-wj" / "unicode-orc" / "unicode-softhyphen" / "unicode-hairspace" / "unicode-thinspace" / "unicode-nbsp")
  const hiddenRules = REPAIR_RULES.filter(
    r => r.category === "unicode" && 
    ["unicode-zwsp", "unicode-zwj", "unicode-zwnj", "unicode-bom", "unicode-ltr", "unicode-rtl", "unicode-wj", "unicode-orc", "unicode-softhyphen", "unicode-hairspace", "unicode-thinspace", "unicode-nbsp"].includes(r.id) &&
    r.enabled
  );

  for (const rule of hiddenRules) {
    const matches = repaired.match(rule.regex) || [];
    if (matches.length > 0) {
      hiddenRemoved += matches.length;
      repaired = repaired.replace(rule.regex, rule.replacement as string);
    }
  }

  // 2. Process ASCII Control Characters (category: "control")
  const controlRules = REPAIR_RULES.filter(r => r.category === "control" && r.enabled);
  for (const rule of controlRules) {
    const matches = repaired.match(rule.regex) || [];
    if (matches.length > 0) {
      if (rule.id === "control-ascii") {
        hiddenRemoved += matches.length;
      }
      repaired = repaired.replace(rule.regex, rule.replacement as string);
    }
  }

  // 3. Process Smart Punctuation & Quotes Normalization (category: "unicode" but other IDs)
  const normIds = ["unicode-quotes-double", "unicode-quotes-single", "unicode-backticks-as-quotes", "unicode-long-dashes", "unicode-periods-ellipsis", "unicode-repeated-exclamation", "unicode-repeated-question", "unicode-repeated-commas", "unicode-repeated-semicolons"];
  const normalizationRules = REPAIR_RULES.filter(
    r => r.category === "unicode" && normIds.includes(r.id) && r.enabled
  );

  for (const rule of normalizationRules) {
    const matches = repaired.match(rule.regex) || [];
    if (matches.length > 0) {
      unicodeNormalized += matches.length;
      repaired = repaired.replace(rule.regex, rule.replacement as string);
    }
  }

  return { repairedText: repaired, hiddenRemoved, unicodeNormalized };
}
