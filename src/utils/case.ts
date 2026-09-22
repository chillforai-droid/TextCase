export type CaseMode =
  | "none"
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "capitalize-lines";

const wordBoundary = /([\p{L}\p{N}][^\s]*)/gu;

function titleCase(text: string): string {
  return text.toLocaleLowerCase().replace(wordBoundary, (word) => {
    const first = word.charAt(0);
    return first.toLocaleUpperCase() + word.slice(1);
  });
}

function sentenceCase(text: string): string {
  const lower = text.toLocaleLowerCase();
  let capitalizeNext = true;

  return Array.from(lower).map((char) => {
    if (capitalizeNext && /\p{L}/u.test(char)) {
      capitalizeNext = false;
      return char.toLocaleUpperCase();
    }
    if (/[.!?\n]/u.test(char)) {
      capitalizeNext = true;
    }
    return char;
  }).join("");
}

function capitalizeLines(text: string): string {
  return text.split(/\r?\n/).map((line) => {
    const index = line.search(/\p{L}/u);
    if (index < 0) return line;
    return line.slice(0, index) + line.charAt(index).toLocaleUpperCase() + line.slice(index + 1).toLocaleLowerCase();
  }).join("\n");
}

export function applyCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toLocaleUpperCase();
    case "lower":
      return text.toLocaleLowerCase();
    case "title":
      return titleCase(text);
    case "sentence":
      return sentenceCase(text);
    case "capitalize-lines":
      return capitalizeLines(text);
    case "none":
    default:
      return text;
  }
}
