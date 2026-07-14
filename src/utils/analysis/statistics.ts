export function calculateHealthScore(problems: {
  markdown: number;
  hiddenChars: number;
  brokenLines: number;
  ocrProblems: number;
  extraSpaces: number;
  unicodeProblems: number;
}): number {
  const initialScore = 100;

  // Weighted penalties
  const markdownPenalty = problems.markdown * 2.0;
  const hiddenPenalty = problems.hiddenChars * 3.0;
  const brokenLinesPenalty = problems.brokenLines * 4.0;
  const ocrPenalty = problems.ocrProblems * 4.0;
  const spacesPenalty = problems.extraSpaces * 1.0;
  const unicodePenalty = problems.unicodeProblems * 1.0;

  const totalPenalties = markdownPenalty + hiddenPenalty + brokenLinesPenalty + ocrPenalty + spacesPenalty + unicodePenalty;
  
  const score = Math.max(0, Math.min(100, Math.round(initialScore - totalPenalties)));
  return score;
}

export function getTextStats(text: string): { characters: number; words: number; lines: number } {
  if (!text) {
    return { characters: 0, words: 0, lines: 0 };
  }
  const characters = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const lines = text.split(/\r?\n/).length;

  return { characters, words, lines };
}
