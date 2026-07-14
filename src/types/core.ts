export type ActivePage =
  | "home"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "blog"
  | "blog-post"
  | "sitemap"
  | "robots"
  | "feedback"
  | "roadmap"
  | "changelog";

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  boxOpen?: boolean;
}

export interface ProblemReport {
  id: string;
  name: string;
  count: number;
  status: "green" | "yellow" | "red";
  description: string;
  details?: string[];
}

export interface AnalysisResult {
  markdown: ProblemReport;
  hiddenChars: ProblemReport;
  brokenLines: ProblemReport;
  extraSpaces: ProblemReport;
  ocrProblems: ProblemReport;
  unicodeProblems: ProblemReport;
  healthScore: number;
}

export interface RepairSummary {
  markdownRemoved: number;
  hiddenCharsRemoved: number;
  brokenLinesRepaired: number;
  spacesNormalized: number;
  unicodeNormalized: number;
  ocrRepaired: number;
}

export interface RepairRule {
  id: string;
  name: string;
  category: "html" | "unicode" | "markdown" | "ocr" | "spacing" | "paragraph" | "control";
  description: string;
  regex: RegExp;
  replacement: string | ((match: string, ...args: any[]) => string);
  priority: number;
  enabled: boolean;
  example: string;
}

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  metaTitle: string;
  metaDesc: string;
  metaDescription: string;
  sampleText: string;
  keywords: string[];
  canonical: string;
  schema: string;
  heroTitle: string;
  heroDescription: string;
  faq: FAQItem[];
  problemDescription: string;
  solutionDescription: string;
  examples: { input: string; output: string }[];
  relatedPages: string[];
}

export interface HistoryItem {
  id: string;
  date: string;
  original: string;
  repaired: string;
  problemsFixed: number;
  characters: number;
}
