import React, { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Terminal, Map } from "lucide-react";

import { ActivePage, AnalysisResult, RepairSummary, HistoryItem } from "./types";
import { analyzeText } from "./utils/analysis";
import { repairText } from "./utils/repair";
import { LANDING_PAGES } from "./content/pages";

// Import modular components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import SEO from "./components/SEO";
import AuditReportModal from "./components/AuditReportModal";
import FeedbackModal from "./components/FeedbackModal";

// Lazy-load sub-pages for lightning-fast bundles
import LandingPage from "./pages/LandingPage";
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const SitemapPage = React.lazy(() => import("./pages/SitemapPage"));
const RobotsPage = React.lazy(() => import("./pages/RobotsPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const FeedbackPage = React.lazy(() => import("./components/FeedbackPage"));
const RoadmapPage = React.lazy(() => import("./components/RoadmapPage"));
const ChangelogPage = React.lazy(() => import("./components/ChangelogPage"));
const BlogSection = React.lazy(() => import("./components/BlogSection"));

import { repairSessionService } from "./services/repairSessionService";
import { feedbackService } from "./services/feedbackService";


export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

interface LandingPageProps {
  page: typeof LANDING_PAGES[string];
  inputText: string;
  setInputText: (text: string) => void;
  originalText: string;
  analysis: AnalysisResult;
  repairSummary: RepairSummary | null;
  isRepaired: boolean;
  activeTab: "edit" | "compare";
  setActiveTab: (tab: "edit" | "compare") => void;
  compareMode: "side" | "unified";
  setCompareMode: (mode: "side" | "unified") => void;
  isDragging: boolean;
  reportOpen: boolean;
  setReportOpen: (open: boolean) => void;
  expandedCard: string | null;
  setExpandedCard: (card: string | null) => void;
  history: HistoryItem[];
  handleClear: () => void;
  handleCopy: () => void;
  handleAnalyze: () => void;
  handleFix: () => void;
  handleLoadSample: () => void;
  handleExport: (format: "txt" | "md" | "html" | "docx") => void;
  loadHistoryItem: (item: HistoryItem) => void;
  deleteHistoryItem: (id: string, e: React.MouseEvent) => void;
  clearHistory: () => void;
  handleHelpfulFeedback: (helpful: boolean) => void;
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

function LandingPageSelector(props: Omit<LandingPageProps, "page">) {
  const { slug } = useParams();
  
  // Custom mapping to preserve support for legacy paths
  let pageKey = slug || "default";
  if (pageKey === "fix-copy-paste") {
    pageKey = "fix-copy-paste-text";
  }

  const page = LANDING_PAGES[pageKey];
  if (!page) {
    return <NotFoundPage />;
  }

  return <LandingPage page={page} {...props} />;
}

function AppContent() {
  const { landingPageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Root States
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [currentLandingPage, setCurrentLandingPage] = useState<string>("default");
  const [inputText, setInputText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult>(analyzeText(""));
  const [repairSummary, setRepairSummary] = useState<RepairSummary | null>(null);
  const [isRepaired, setIsRepaired] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // V2 UI States
  const [activeTab, setActiveTab] = useState<"edit" | "compare">("edit");
  const [compareMode, setCompareMode] = useState<"side" | "unified">("side");
  const [isDragging, setIsDragging] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Theme Sync
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem("textcase-theme");
    return (saved as "light" | "dark" | "system") || "system";
  });

  // Repair History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("textcase-history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast System
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "info" | "warning">("success");

  const triggerToast = (msg: string, type: "success" | "info" | "warning" = "success") => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Sync state based on URL route path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActivePage("home");
      setCurrentLandingPage("default");
    } else if (path === "/blog") {
      setActivePage("blog");
    } else if (path.startsWith("/blog/")) {
      setActivePage("blog-post");
    } else if (path === "/about") {
      setActivePage("about");
    } else if (path === "/contact") {
      setActivePage("contact");
    } else if (path === "/privacy") {
      setActivePage("privacy");
    } else if (path === "/terms") {
      setActivePage("terms");
    } else if (path === "/sitemap") {
      setActivePage("sitemap");
    } else if (path === "/robots") {
      setActivePage("robots");
    } else if (path === "/feedback") {
      setActivePage("feedback");
    } else if (path === "/roadmap") {
      setActivePage("roadmap");
    } else if (path === "/changelog") {
      setActivePage("changelog");
    } else {
      // Check if the parameter matches a specialized landing page
      let pageKey = path.substring(1);
      if (pageKey === "fix-copy-paste") {
        pageKey = "fix-copy-paste-text";
      }
      if (LANDING_PAGES[pageKey]) {
        setActivePage("home");
        setCurrentLandingPage(pageKey);
      } else {
        // Safe fallback
        setActivePage("home");
        setCurrentLandingPage("default");
      }
    }
  }, [location.pathname]);

  // Sync input text with active landing page sample when input is empty
  useEffect(() => {
    const activeSample = LANDING_PAGES[currentLandingPage]?.sampleText || "";
    if (activePage === "home" && !inputText) {
      setInputText(activeSample);
      setIsRepaired(false);
      setOriginalText("");
      setRepairSummary(null);
    }
  }, [currentLandingPage, activePage]);

  // Auto-scan analysis on input change
  useEffect(() => {
    if (inputText) {
      const res = analyzeText(inputText);
      setAnalysis(res);
    } else {
      setAnalysis(analyzeText(""));
    }
  }, [inputText]);

  // Sync Document Theme class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem("textcase-theme", theme);
  }, [theme]);

  // Global Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePage !== "home") return;

      // Ctrl + Enter to Repair Instantly
      if (e.ctrlKey && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleFix();
      }
      // Ctrl + Shift + Enter to Force Analyze
      if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleAnalyze();
      }
      // Ctrl + L to clear
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputText, activePage]);

  const handlePageChange = (page: ActivePage) => {
    if (page === "home") {
      navigate("/");
    } else if (page === "blog-post") {
      navigate("/blog");
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLandingPageChange = (key: string) => {
    navigate(`/${key === "default" ? "" : key}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setInputText("");
    setOriginalText("");
    setIsRepaired(false);
    setRepairSummary(null);
    setActiveTab("edit");
    triggerToast("Editor cleared.", "info");
  };

  const handleCopy = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    triggerToast("Copied to clipboard!", "success");
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      triggerToast("Please enter some text to analyze.", "warning");
      return;
    }
    const res = analyzeText(inputText);
    setAnalysis(res);
    triggerToast("Text analysis complete!", "success");
  };

  const handleFix = () => {
    if (!inputText.trim()) {
      triggerToast("Please enter some text to repair.", "warning");
      return;
    }

    const startTime = performance.now();
    const result = repairText(inputText);
    const processingTime = Math.round(performance.now() - startTime);
    
    setOriginalText(inputText);
    setInputText(result.repairedText);
    setRepairSummary(result.summary);
    setIsRepaired(true);

    // Calc total problems fixed
    const totalFixed = Object.values(result.summary).reduce((sum, val) => sum + val, 0);

    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + new Date().toLocaleDateString(),
      original: inputText,
      repaired: result.repairedText,
      problemsFixed: totalFixed,
      characters: result.repairedText.length
    };

    const updatedHistory = [newItem, ...history].slice(0, 15);
    setHistory(updatedHistory);
    localStorage.setItem("textcase-history", JSON.stringify(updatedHistory));

    // Refersh analysis on repaired text
    const newAnalysis = analyzeText(result.repairedText);
    setAnalysis(newAnalysis);

    triggerToast(`Document repaired successfully! Fixed ${totalFixed} formatting bugs.`, "success");

    // Background Logging to Supabase (non-blocking)
    const ua = navigator.userAgent;
    const browser = ua.includes("Firefox")
      ? "Firefox"
      : ua.includes("Chrome")
      ? "Chrome"
      : ua.includes("Safari")
      ? "Safari"
      : ua.includes("Edge")
      ? "Edge"
      : "Unknown Browser";

    const device = /tablet|ipad/i.test(ua)
      ? "Tablet"
      : /mobile|iphone|android/i.test(ua)
      ? "Mobile"
      : "Desktop";

    const wordsCount = result.repairedText.trim().split(/\s+/).filter(Boolean).length;
    const rulesAppliedCount = Object.values(result.summary).reduce((acc, val) => acc + (val > 0 ? 1 : 0), 0);

    repairSessionService.create({
      session_id: newItem.id,
      repair_mode: currentLandingPage,
      characters: result.repairedText.length,
      words: wordsCount,
      processing_time: processingTime,
      problems_found: totalFixed,
      rules_applied: rulesAppliedCount,
      success: true,
      browser,
      device
    }).catch((err) => {
      console.warn("Background session logging to Supabase skipped or failed:", err.message);
    });
  };

  const handleHelpfulFeedback = (helpful: boolean) => {
    if (helpful) {
      feedbackService.create({
        name: "Automatic Repair Auditor",
        feedback_type: "Suggestion",
        category: "General",
        message: "User marked repair as helpful! 👍",
        original_text: originalText.slice(0, 1000),
        repair_mode: currentLandingPage,
        likes: 0,
        is_public: false,
        status: "fixed"
      }).catch((err) => {
        console.warn("Helpful rating logging to Supabase skipped or failed:", err.message);
      });
      triggerToast("Thank you for your feedback!", "success");
    } else {
      setFeedbackModalOpen(true);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setOriginalText(item.original);
    setInputText(item.repaired);
    setIsRepaired(true);
    setRepairSummary({
      markdownRemoved: item.problemsFixed,
      hiddenCharsRemoved: 0,
      brokenLinesRepaired: 0,
      spacesNormalized: 0,
      unicodeNormalized: 0,
      ocrRepaired: 0
    });
    setActiveTab("compare");
    triggerToast("Restored from history!", "success");
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("textcase-history", JSON.stringify(updated));
    triggerToast("History item removed.", "info");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("textcase-history");
    triggerToast("History cleared.", "info");
  };

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === "docx") {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          if (arrayBuffer) {
            import("mammoth").then(async (mammoth) => {
              const result = await mammoth.extractRawText({ arrayBuffer });
              setInputText(result.value);
              setIsRepaired(false);
              setOriginalText("");
              setRepairSummary(null);
              setActiveTab("edit");
              triggerToast(`DOCX file '${file.name}' loaded successfully!`, "success");
            }).catch(() => {
              triggerToast("Error loading DOCX parser library.", "warning");
            });
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        triggerToast("Failed to parse Word Document", "warning");
      }
    } else if (extension === "txt" || extension === "md" || extension === "html") {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (text) {
            setInputText(text);
            setIsRepaired(false);
            setOriginalText("");
            setRepairSummary(null);
            setActiveTab("edit");
            triggerToast(`File '${file.name}' loaded successfully!`, "success");
          }
        };
        reader.readAsText(file);
      } catch (err) {
        triggerToast("Failed to read text file", "warning");
      }
    } else {
      triggerToast("Unsupported format. Use TXT, MD, HTML, or DOCX.", "warning");
    }
  };

  const handleLoadSample = () => {
    const activeSample = LANDING_PAGES[currentLandingPage]?.sampleText || LANDING_PAGES.default.sampleText;
    setInputText(activeSample);
    setIsRepaired(false);
    setOriginalText("");
    setRepairSummary(null);
    triggerToast("Sample text loaded!", "success");
  };

  // Multi-format exporter
  const handleExport = (format: "txt" | "md" | "html" | "docx") => {
    if (!inputText) {
      triggerToast("No text available to export.", "warning");
      return;
    }
    const element = document.createElement("a");
    let file: Blob;
    let filename = `repaired-document-${new Date().toISOString().slice(0, 10)}`;

    if (format === "txt") {
      file = new Blob([inputText], { type: "text/plain;charset=utf-8" });
      filename += ".txt";
    } else if (format === "md") {
      file = new Blob([inputText], { type: "text/markdown;charset=utf-8" });
      filename += ".md";
    } else if (format === "html") {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Repaired Document - TextCase</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #1f2937; background-color: #f9fafb; }
    .card { background: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #f3f4f6; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    p { margin-bottom: 1.5em; white-space: pre-wrap; font-size: 15px; color: #374151; }
    hr { border: 0; border-top: 1px solid #e5e7eb; margin: 2em 0; }
  </style>
</head>
<body>
  <div class="card">
    ${inputText.split('\n').map(p => p.trim() ? `<p>${p.trim()}</p>` : '<br>').join('\n')}
  </div>
</body>
</html>`;
      file = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      filename += ".html";
    } else { // docx (using MS Word HTML conversion trick)
      const docContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><title>Repaired Document</title></head>
<body style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.5;">
  ${inputText.split('\n').map(p => p.trim() ? `<p>${p.trim()}</p>` : '<p>&nbsp;</p>').join('')}
</body>
</html>`;
      file = new Blob([docContent], { type: "application/msword;charset=utf-8" });
      filename += ".doc";
    }

    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast(`${format.toUpperCase()} export downloaded!`, "success");
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition duration-150 select-none selection:bg-blue-500/20"
      id="app-root-container"
    >
      <SEO page={LANDING_PAGES[currentLandingPage] || LANDING_PAGES.default} />
      
      <Navbar theme={theme} setTheme={setTheme} activePage={activePage} setActivePage={handlePageChange} />

      <main className="flex-grow pt-24" id="app-main-content">
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            }
          >
            <Routes location={location}>
              {/* Static sub-pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage triggerToast={triggerToast} />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/sitemap" element={<SitemapPage triggerToast={triggerToast} />} />
              <Route path="/robots" element={<RobotsPage triggerToast={triggerToast} />} />
              <Route path="/blog" element={<BlogSection />} />
              <Route path="/blog/:id" element={<BlogSection />} />
              <Route path="/feedback" element={<FeedbackPage triggerToast={triggerToast} />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/changelog" element={<ChangelogPage />} />

              {/* Dynamic specialty landing page routes */}
              <Route
                path="/:slug"
                element={
                  <LandingPageSelector
                    inputText={inputText}
                    setInputText={setInputText}
                    originalText={originalText}
                    analysis={analysis}
                    repairSummary={repairSummary}
                    isRepaired={isRepaired}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    compareMode={compareMode}
                    setCompareMode={setCompareMode}
                    isDragging={isDragging}
                    reportOpen={reportOpen}
                    setReportOpen={setReportOpen}
                    expandedCard={expandedCard}
                    setExpandedCard={setExpandedCard}
                    history={history}
                    handleClear={handleClear}
                    handleCopy={handleCopy}
                    handleAnalyze={handleAnalyze}
                    handleFix={handleFix}
                    handleLoadSample={handleLoadSample}
                    handleExport={handleExport}
                    loadHistoryItem={loadHistoryItem}
                    deleteHistoryItem={deleteHistoryItem}
                    clearHistory={clearHistory}
                    handleHelpfulFeedback={handleHelpfulFeedback}
                    triggerToast={triggerToast}
                  />
                }
              />

              {/* Default Home route */}
              <Route
                path="/"
                element={
                  <LandingPage
                    page={LANDING_PAGES.default}
                    inputText={inputText}
                    setInputText={setInputText}
                    originalText={originalText}
                    analysis={analysis}
                    repairSummary={repairSummary}
                    isRepaired={isRepaired}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    compareMode={compareMode}
                    setCompareMode={setCompareMode}
                    isDragging={isDragging}
                    reportOpen={reportOpen}
                    setReportOpen={setReportOpen}
                    expandedCard={expandedCard}
                    setExpandedCard={setExpandedCard}
                    history={history}
                    handleClear={handleClear}
                    handleCopy={handleCopy}
                    handleAnalyze={handleAnalyze}
                    handleFix={handleFix}
                    handleLoadSample={handleLoadSample}
                    handleExport={handleExport}
                    loadHistoryItem={loadHistoryItem}
                    deleteHistoryItem={deleteHistoryItem}
                    clearHistory={clearHistory}
                    handleHelpfulFeedback={handleHelpfulFeedback}
                    triggerToast={triggerToast}
                  />
                }
              />

              {/* Catch-all 404 custom page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      <Footer setActivePage={handlePageChange} setCurrentLandingPage={handleLandingPageChange} />

      {/* Toast Notification Container */}
      <Toast
        message={toastMessage}
        isOpen={!!toastMessage}
        onClose={() => setToastMessage("")}
        type={toastType}
      />

      {/* Verification Auditor Seal Report Modal */}
      <AuditReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        repairSummary={repairSummary}
        originalLength={originalText.length}
        repairedLength={inputText.length}
      />

      {/* Post-Repair Failure Bug Report Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        originalText={originalText}
        repairMode={currentLandingPage}
        triggerToast={triggerToast}
      />
    </div>
  );
}

