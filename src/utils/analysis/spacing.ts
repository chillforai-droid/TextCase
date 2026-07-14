import { ProblemReport } from "../../types";

export function analyzeSpacing(text: string): { report: ProblemReport; count: number } {
  const doubleSpacesRegex = / [ ]+/g;
  const tabsRegex = /\t/g;
  const duplicateBlanksRegex = /\r?\n\s*\r?\n\s*\r?\n/g;

  const doubleSpacesCount = (text.match(doubleSpacesRegex) || []).length;
  const tabsCount = (text.match(tabsRegex) || []).length;
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
