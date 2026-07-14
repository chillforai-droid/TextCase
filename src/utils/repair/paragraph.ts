export function repairParagraphs(text: string): { repairedText: string; mergedLinesCount: number; ocrMergedCount: number } {
  let lines = text.split(/\r?\n/);
  let mergedLinesCount = 0;
  let ocrMergedCount = 0;
  const cleanedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    if (i < lines.length - 1) {
      const nextLine = lines[i + 1];
      const trimmedCurrent = currentLine.trim();
      const trimmedNext = nextLine.trim();

      // Merge criteria: current line ends in standard word character or comma, next line starts with lowercase letter
      if (
        trimmedCurrent.length > 0 &&
        trimmedNext.length > 0 &&
        /[a-zA-Z,;]$/.test(trimmedCurrent) &&
        /^[a-z]/.test(trimmedNext) &&
        !trimmedCurrent.endsWith(".") &&
        !trimmedCurrent.endsWith("?") &&
        !trimmedCurrent.endsWith("!") &&
        !trimmedCurrent.startsWith("#") && // Avoid merging markdown headers
        !trimmedCurrent.startsWith("-") && // Avoid merging markdown lists
        !trimmedCurrent.startsWith("*")
      ) {
        lines[i + 1] = trimmedCurrent + " " + trimmedNext;
        mergedLinesCount++;
        ocrMergedCount++;
      } else {
        cleanedLines.push(currentLine);
      }
    } else {
      cleanedLines.push(currentLine);
    }
  }

  const repairedText = cleanedLines.join("\n");
  return { repairedText, mergedLinesCount, ocrMergedCount };
}
