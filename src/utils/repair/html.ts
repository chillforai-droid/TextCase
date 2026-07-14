import { REPAIR_RULES } from "./rules";

export function decodeHtmlEntities(text: string): { repairedText: string; count: number } {
  let repaired = text;
  let count = 0;

  // Filter rules for HTML category and sort by priority
  const htmlRules = REPAIR_RULES.filter(r => r.category === "html" && r.enabled).sort((a, b) => a.priority - b.priority);

  for (const rule of htmlRules) {
    const matches = repaired.match(rule.regex) || [];
    if (matches.length > 0) {
      count += matches.length;
      repaired = repaired.replace(rule.regex, rule.replacement as string);
    }
  }

  return { repairedText: repaired, count };
}
