import { REPAIR_RULES } from "./rules";

export function stripMarkdown(text: string): { repairedText: string; count: number } {
  let repaired = text;
  let count = 0;

  // Filter rules for Markdown category and sort by priority
  const markdownRules = REPAIR_RULES.filter(r => r.category === "markdown" && r.enabled).sort((a, b) => a.priority - b.priority);

  for (const rule of markdownRules) {
    const matches = repaired.match(rule.regex) || [];
    if (matches.length > 0) {
      count += matches.length;
      repaired = repaired.replace(rule.regex, rule.replacement as string);
    }
  }

  return { repairedText: repaired, count };
}
