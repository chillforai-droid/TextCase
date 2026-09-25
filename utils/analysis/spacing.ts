import { ProblemReport } from "../../types";

export function analyzeSpacing(text: string): { report: ProblemReport; count: number } {
  const lines = text.split(/\r?\n/);

  // Do not count leading indentation as an error: indentation can be intentional
  // in code, lists, poetry, and formatted documents. Only inspect content after
  // the leading indentation prefix.
  const doubleSpacesCount = lines.reduce((total, line) => {
    const content = line.replace(/^[ \t]+/, "");
    return total + (content.match(/ {2,}/g) || []).length;
  }, 0);

  const tabsCount = lines.reduce((total, line) => {
    const content = line.replace(/^[ \t]+/, "");
    return total + (content.match(/\t/g) || []).length;
  }, 0);

  const duplicateBlanksRegex = /\r?\n\s*\r?\n\s*\r?\n/g;
  const duplicateBlanksCount = (text.match(duplicateBlanksRegex) || []).length;

  const extraSpacesTotal = doubleSpacesCount + tabsCount + duplicateBlanksCount;
  const extraSpacesDetails: string[] = [];
  if (doubleSpacesCount > 0) extraSpacesDetails.push(`${doubleSpacesCount} multi-space sequence(s)`);
  if (tabsCount > 0) extraSpacesDetails.push(`${tabsCount} tab character(s) (\\t)`);
  if (duplicateBlanksCount > 0) extraSpacesDetails.push(`${duplicateBlanksCount} excessive consecutive blank line(s)`);

  return {
    count: extraSpacesTotal,
    report: {
      id: "extraSpaces",
      name: "Extra Spaces",
      count: extraSpacesTotal,
      status: extraSpacesTotal === 0 ? "green" : extraSpacesTotal <= 5 ? "yellow" : "red",
      description: "Extraneous spaces, tabs, double/triple spaces, or excessive consecutive empty lines.",
      details: extraSpacesDetails
    }
  };
}
