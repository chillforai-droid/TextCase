import { ProblemReport } from "../../types";

export function analyzeMarkdown(text: string): { report: ProblemReport; count: number } {
  const boldRegex = /\*\*([^*]+)\*\*|__([^_]+)__/g;
  const italicRegex = /\*([^*]+)\*|_([^_]+)_/g;
  const strikeRegex = /~~([^~]+)~~/g;
  const headerRegex = /^#{1,6}\s+.+/gm;
  const listRegex = /^\s*([-*+]\s+|\d+\.\s+).+/gm;
  const codeBlockRegex = /```[\s\S]*?```/g;
  const inlineCodeRegex = /`[^`\n]+`/g;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const blockquoteRegex = /^\s*>.+/gm;
  const hrRegex = /^\s*([-*_])\1{2,}\s*$/gm;
  const taskListRegex = /^\s*[-*+]\s*\[[ xX]\]\s*.+/gm;
  const htmlTagsRegex = /<\/?[a-zA-Z1-6]+[^>]*>/g;

  const boldCount = (text.match(boldRegex) || []).length;
  const italicCount = (text.match(italicRegex) || []).length;
  const strikeCount = (text.match(strikeRegex) || []).length;
  const headerCount = (text.match(headerRegex) || []).length;
  const listCount = (text.match(listRegex) || []).length;
  const codeBlockCount = (text.match(codeBlockRegex) || []).length;
  const inlineCodeCount = (text.match(inlineCodeRegex) || []).length;
  const linkCount = (text.match(linkRegex) || []).length;
  const imageCount = (text.match(imageRegex) || []).length;
  const blockquoteCount = (text.match(blockquoteRegex) || []).length;
  const hrCount = (text.match(hrRegex) || []).length;
  const taskListCount = (text.match(taskListRegex) || []).length;
  const htmlTagsCount = (text.match(htmlTagsRegex) || []).length;

  const markdownTotal = boldCount + italicCount + strikeCount + headerCount + listCount + codeBlockCount + 
                        inlineCodeCount + linkCount + imageCount + blockquoteCount + hrCount + taskListCount + htmlTagsCount;
  
  const markdownDetails: string[] = [];
  if (boldCount > 0) markdownDetails.push(`${boldCount} bold marker(s) (e.g. **text**)`);
  if (italicCount > 0) markdownDetails.push(`${italicCount} italic marker(s) (e.g. *text*)`);
  if (strikeCount > 0) markdownDetails.push(`${strikeCount} strikethrough marker(s) (~~text~~)`);
  if (headerCount > 0) markdownDetails.push(`${headerCount} header line(s) (e.g. # Header)`);
  if (listCount > 0) markdownDetails.push(`${listCount} standard list item(s)`);
  if (codeBlockCount > 0) markdownDetails.push(`${codeBlockCount} multi-line code block(s)`);
  if (inlineCodeCount > 0) markdownDetails.push(`${inlineCodeCount} inline backtick code snippet(s)`);
  if (linkCount > 0) markdownDetails.push(`${linkCount} hyperlink(s) [Text](URL)`);
  if (imageCount > 0) markdownDetails.push(`${imageCount} image link(s)`);
  if (blockquoteCount > 0) markdownDetails.push(`${blockquoteCount} quote block marker(s)`);
  if (hrCount > 0) markdownDetails.push(`${hrCount} horizontal separator line(s)`);
  if (taskListCount > 0) markdownDetails.push(`${taskListCount} markdown task checkbox(es)`);
  if (htmlTagsCount > 0) markdownDetails.push(`${htmlTagsCount} raw HTML tags found`);

  return {
    count: markdownTotal,
    report: {
      id: "markdown",
      name: "Markdown Found",
      count: markdownTotal,
      status: markdownTotal === 0 ? "green" : markdownTotal <= 5 ? "yellow" : "red",
      description: "Markdown formatting markers like bold, italic, headers, list items, or links.",
      details: markdownDetails
    }
  };
}
