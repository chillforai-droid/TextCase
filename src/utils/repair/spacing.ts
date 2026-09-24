export function normalizeSpacing(text: string): { repairedText: string; count: number } {
  const lines = text.split(/\r?\n/);
  const finalLines: string[] = [];
  let spaceIssuesLineCount = 0;

  for (const originalLine of lines) {
    let line = originalLine;

    // Preserve leading indentation (important for code, lists, and formatted text).
    const leadingMatch = line.match(/^[ \\t]*/)?.[0] ?? "";
    const content = line.slice(leadingMatch.length);

    if (line.endsWith(" ") || line.endsWith("\\t")) {
      spaceIssuesLineCount++;
      line = line.replace(/[ \\t]+$/g, "");
    }

    // Convert tabs only inside the indentation/content when they are not meaningful.
    // Keep leading indentation intact rather than trimming it away.
    const normalizedLeading = leadingMatch.replace(/\\t/g, "  ");
    let normalizedContent = content;

    // Collapse repeated spaces only in non-indented prose lines.
    // Indented lines are treated as formatted/code-like content and preserved.
    if (leadingMatch.length === 0 && /  +/.test(normalizedContent)) {
      normalizedContent = normalizedContent.replace(/  +/g, " ");
      spaceIssuesLineCount++;
    }

    finalLines.push(normalizedLeading + normalizedContent);
  }

  let repaired = finalLines.join("\n");

  // Remove unnecessary duplicate empty lines (3 or more consecutive empty lines -> single empty line).
  const tripleBlankRegex = /(\r?\n\s*){3,}/g;
  const tripleBlankMatches = repaired.match(tripleBlankRegex) || [];
  if (tripleBlankMatches.length > 0) {
    spaceIssuesLineCount += tripleBlankMatches.length;
    repaired = repaired.replace(tripleBlankRegex, "\n\n");
  }

  // Remove only trailing whitespace/newlines from the complete document.
  // Do not use trim(), which destroys intentional leading indentation.
  repaired = repaired.replace(/[ \t]+$/g, "").replace(/\n+$/g, "");

  return { repairedText: repaired, count: spaceIssuesLineCount };
}
