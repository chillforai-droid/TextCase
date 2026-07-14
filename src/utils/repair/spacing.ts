export function normalizeSpacing(text: string): { repairedText: string; count: number } {
  let lines = text.split(/\r?\n/);
  const finalLines: string[] = [];
  let spaceIssuesLineCount = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Detect leading/trailing line padding
    if (line.startsWith(" ") || line.startsWith("\t") || line.endsWith(" ") || line.endsWith("\t")) {
      spaceIssuesLineCount++;
    }

    // Convert tabs to space
    if (line.includes("\t")) {
      line = line.replace(/\t/g, " ");
      spaceIssuesLineCount++;
    }

    // Convert multi-spaces to single space
    if (/  +/.test(line)) {
      line = line.replace(/  +/g, " ");
      spaceIssuesLineCount++;
    }

    finalLines.push(line.trim());
  }

  let repaired = finalLines.join("\n");

  // Remove unnecessary duplicate empty lines (3 or more consecutive empty lines -> single empty line)
  const tripleBlankRegex = /(\r?\n\s*){3,}/g;
  const tripleBlankMatches = repaired.match(tripleBlankRegex) || [];
  if (tripleBlankMatches.length > 0) {
    spaceIssuesLineCount += tripleBlankMatches.length;
    repaired = repaired.replace(tripleBlankRegex, "\n\n");
  }

  return { repairedText: repaired.trim(), count: spaceIssuesLineCount };
}
