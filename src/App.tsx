import React, { useState, useEffect } from "react";
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
import Hero from "./components/Hero";
import Editor from "./components/Editor";
import Compare from "./components/Compare";
import RepairSummaryCard from "./components/RepairSummary";
import Scanner from "./components/Scanner";
import FAQ from "./components/FAQ";
import History from "./components/History";
import ContactForm from "./components/ContactForm";
import BlogSection from "./components/BlogSection";
import AuditReportModal from "./components/AuditReportModal";
import TexlyPromo from "./components/TexlyPromo";

// Import SaaS pages and services
import FeedbackPage from "./components/FeedbackPage";
import RoadmapPage from "./components/RoadmapPage";
import ChangelogPage from "./components/ChangelogPage";
import FeedbackModal from "./components/FeedbackModal";
import { repairSessionService } from "./services/repairSessionService";
import { feedbackService } from "./services/feedbackService";


export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
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
      const pageKey = path.substring(1);
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
          {activePage === "home" && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
            >
              {/* Dynamic Hero */}
              <Hero page={LANDING_PAGES[currentLandingPage] || LANDING_PAGES.default} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
                
                {/* Left Column: Interactive Workspace */}
                <div className="lg:col-span-7 flex flex-col">
                  {/* Mode Tabs */}
                  <div className="flex items-center justify-between mb-4 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setActiveTab("edit")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                          activeTab === "edit"
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                            : "text-gray-400 dark:text-gray-550 hover:text-gray-750 cursor-pointer"
                        }`}
                        id="tab-edit"
                      >
                        Interactive Workspace
                      </button>
                      <button
                        onClick={() => {
                          if (!originalText) {
                            triggerToast("No repairs executed yet. Paste text and click 'Fix Text' first.", "info");
                            return;
                          }
                          setActiveTab("compare");
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          activeTab === "compare"
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                            : "text-gray-400 dark:text-gray-550 hover:text-gray-750 cursor-pointer"
                        }`}
                        id="tab-compare"
                      >
                        Diff Auditor
                        {originalText && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </button>
                    </div>

                    {activeTab === "compare" && (
                      <div className="flex items-center gap-1 bg-gray-50/50 dark:bg-gray-950/20 p-0.5 rounded-lg border border-gray-200/30">
                        <button
                          onClick={() => setCompareMode("side")}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            compareMode === "side"
                              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xs"
                              : "text-gray-400 dark:text-gray-550 cursor-pointer"
                          }`}
                        >
                          Side-by-Side
                        </button>
                        <button
                          onClick={() => setCompareMode("unified")}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            compareMode === "unified"
                              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xs"
                              : "text-gray-400 dark:text-gray-550 cursor-pointer"
                          }`}
                        >
                          Unified
                        </button>
                      </div>
                    )}
                  </div>

                  {activeTab === "edit" ? (
                    <Editor
                      inputText={inputText}
                      setInputText={setInputText}
                      handleClear={handleClear}
                      handleCopy={handleCopy}
                      handleAnalyze={handleAnalyze}
                      handleFix={handleFix}
                      handleLoadSample={handleLoadSample}
                      handleExport={handleExport}
                      isDragging={isDragging}
                    />
                  ) : (
                    <Compare
                      originalText={originalText}
                      inputText={inputText}
                      setActiveTab={setActiveTab}
                    />
                  )}
                </div>

                {/* Right Column: Scan Anomalies & Summary Stats */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Success box */}
                  <AnimatePresence>
                    {isRepaired && repairSummary && (
                      <RepairSummaryCard
                        repairSummary={repairSummary}
                        handleCopy={handleCopy}
                        setReportOpen={setReportOpen}
                        onHelpfulFeedback={handleHelpfulFeedback}
                      />
                    )}
                  </AnimatePresence>

                  {/* Real-Time Scanner */}
                  <Scanner
                    inputText={inputText}
                    analysis={analysis}
                    expandedCard={expandedCard}
                    setExpandedCard={setExpandedCard}
                    handleFix={handleFix}
                    handleLoadSample={handleLoadSample}
                    triggerToast={triggerToast}
                  />

                  {/* Texly Premium Promotion */}
                  <TexlyPromo />

                  {/* Local History logs */}
                  <History
                    history={history}
                    loadHistoryItem={loadHistoryItem}
                    deleteHistoryItem={deleteHistoryItem}
                    clearHistory={clearHistory}
                  />

                </div>
              </div>

              {/* FAQ Section */}
              <FAQ />
            </motion.div>
          )}

          {activePage === "blog" && (
            <BlogSection />
          )}

          {activePage === "blog-post" && (
            <BlogSection />
          )}

          {activePage === "about" && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="about-content">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-6">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h1 className="font-display text-3xl font-extrabold text-gray-950 dark:text-gray-5 block sm:text-4xl tracking-tight">
                  About TextCase
                </h1>
                <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
                  The clean text repair utility built for developers, writers, editors, and anyone tired of terrible copy-paste layouts.
                </p>

                <div className="mt-8 border-t border-gray-100 dark:border-gray-850 pt-8 space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    TextCase was born out of frustration. When copying passages from PDFs, research papers, ChatGPT windows, or mobile websites, the text invariably breaks. Hard returns appear in weird places, hyphens split single words, and weird invisible characters disrupt compilers and messaging grids.
                  </p>
                  <p>
                    Most online solutions are bloated, require logins, display distracting ads, or worse—send your confidential text to external servers for parsing.
                  </p>
                  <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-50 text-lg pt-4">Our Technology Principles</h3>
                  <ul className="space-y-3 pt-2">
                    <li className="flex gap-3">
                      <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                      <span><strong>Offline Parsing Engine:</strong> Your data does not travel over wires. Every character replacement takes place locally in your browser memory.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                      <span><strong>High-Performance Regular Expressions:</strong> Fully optimized algorithms handle massive novels, research documents, and bulk strings in milliseconds.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                      <span><strong>No Tracker Bloat:</strong> Pure clean product architecture. No account logs, cookies, or marketing trackers are active.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "contact" && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <ContactForm triggerToast={triggerToast} />
            </motion.div>
          )}

          {activePage === "privacy" && (
            <motion.div
              key="privacy-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="privacy-content">
                <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight mb-6">
                  Privacy Policy
                </h1>
                <div className="space-y-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  <p className="font-bold text-gray-800 dark:text-gray-250">Last updated: July 10, 2026</p>
                  <p>
                    At TextCase, we care deeply about privacy. In fact, we built this tool with a **Privacy First** paradigm.
                  </p>
                  <p className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 font-semibold">
                    We do not collect, store, transmit, or monitor any text you paste into our application. All scanning, character analyses, and repairs run 100% inside your web browser using local client-side JavaScript.
                  </p>
                  <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-50 text-lg pt-4">1. Data Storage</h3>
                  <p>
                    Your pasted content resides in standard volatile browser memory (RAM) while you edit and analyze. Once you refresh your browser, close the browser window, or clear the editor, your text is completely destroyed. It is never persisted on any server database.
                  </p>
                  <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-50 text-lg pt-4">2. Cookies & Trackers</h3>
                  <p>
                    TextCase does not use tracking cookies, behavioral pixel trackers, or advertising trackers. We maintain a pure utility architecture.
                  </p>
                  <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-50 text-lg pt-4">3. Local Security</h3>
                  <p>
                    Because processing occurs completely on your machine, your text is as secure as your computer itself. This makes TextCase highly appropriate for editing sensitive legal agreements, personal communications, or health records.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "terms" && (
            <motion.div
              key="terms-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="terms-content">
                <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight mb-6">
                  Terms of Service
                </h1>
                <div className="space-y-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  <p className="font-bold text-gray-800 dark:text-gray-250">Effective Date: July 10, 2026</p>
                  <p>
                    Welcome to TextCase – Smart Text Fixer. By using our application, you agree to these Terms of Service.
                  </p>
                  <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-50 text-lg pt-4">1. Acceptable Use</h3>
                  <p>
                    You are free to use TextCase for personal, commercial, academic, or professional projects. There are no character limits, pricing paywalls, or usage caps on the application.
                  </p>
                  <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-50 text-lg pt-4">2. Disclaimer of Warranty</h3>
                  <p>
                    The service is provided "as is" and "as available". We make no warranties of any kind regarding accuracy, security, completeness, or reliability of repaired text output. Always verify important documents manually.
                  </p>
                  <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-50 text-lg pt-4">3. System Integrity</h3>
                  <p>
                    You agree not to attempt to disrupt the performance of our application or overload our hosted bundle assets.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "sitemap" && (
            <motion.div
              key="sitemap-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="sitemap-content">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-6">
                  <Map className="h-6 w-6" />
                </div>
                <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
                  Sitemap XML
                </h1>
                <p className="mt-2 text-xs text-gray-400">
                  Search engines can crawl our complete clean directory. Here is the visual schema representing `sitemap.xml` for index engines.
                </p>

                <div className="mt-8 border-t border-gray-100 dark:border-gray-850 pt-8">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider text-gray-400 dark:text-gray-500">Interactive Map</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button onClick={() => handlePageChange("home")} className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left cursor-pointer">
                      Home (Smart Tool)
                    </button>
                    <button onClick={() => handlePageChange("blog")} className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left cursor-pointer">
                      Blog (Guides Hub)
                    </button>
                    <button onClick={() => handlePageChange("about")} className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left cursor-pointer">
                      About Page
                    </button>
                    <button onClick={() => handlePageChange("contact")} className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left cursor-pointer">
                      Contact Form
                    </button>
                    <button onClick={() => handlePageChange("privacy")} className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left cursor-pointer">
                      Privacy Policy
                    </button>
                    <button onClick={() => handlePageChange("terms")} className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left cursor-pointer">
                      Terms of Service
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3 uppercase tracking-wider text-gray-400 dark:text-gray-500">Raw Sitemap Source</h3>
                  <div className="relative rounded-xl bg-gray-950 p-4 font-mono text-[11px] text-gray-300 border border-gray-800 overflow-x-auto">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://textcase.in/</loc><priority>1.0</priority></url>\n  <url><loc>https://textcase.in/blog</loc><priority>0.8</priority></url>\n  <url><loc>https://textcase.in/about</loc><priority>0.5</priority></url>\n  <url><loc>https://textcase.in/contact</loc><priority>0.5</priority></url>\n</urlset>`);
                        triggerToast("Raw Sitemap XML copied!", "success");
                      }}
                      className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white rounded px-2 py-1 text-[10px] cursor-pointer"
                    >
                      Copy XML
                    </button>
                    <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://textcase.in/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://textcase.in/blog</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://textcase.in/about</loc>
    <lastmod>2026-07-13</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://textcase.in/contact</loc>
    <lastmod>2026-07-13</lastmod>
    <priority>0.5</priority>
  </url>
</urlset>`}</pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "robots" && (
            <motion.div
              key="robots-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="robots-content">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-6">
                  <Terminal className="h-6 w-6" />
                </div>
                <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
                  Robots.txt Source
                </h1>
                <p className="mt-2 text-xs text-gray-400">
                  Standard directives for search engine crawler agents.
                </p>

                <div className="mt-8 border-t border-gray-100 dark:border-gray-850 pt-8">
                  <div className="relative rounded-xl bg-gray-950 p-5 font-mono text-sm text-gray-300 border border-gray-800">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://textcase.in/sitemap.xml");
                        triggerToast("Robots.txt copied!", "success");
                      }}
                      className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white rounded px-2 py-1 text-xs cursor-pointer"
                    >
                      Copy Raw
                    </button>
                    <pre className="space-y-1">
                      <div><span className="text-blue-400"># Directives for index robots</span></div>
                      <div>User-agent: *</div>
                      <div>Allow: /</div>
                      <div>Disallow: /api/</div>
                      <br />
                      <div><span className="text-blue-400"># Link sitemap location</span></div>
                      <div>Sitemap: https://textcase.in/sitemap.xml</div>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "feedback" && (
            <motion.div
              key="feedback-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <FeedbackPage triggerToast={triggerToast} />
            </motion.div>
          )}

          {activePage === "roadmap" && (
            <motion.div
              key="roadmap-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <RoadmapPage />
            </motion.div>
          )}

          {activePage === "changelog" && (
            <motion.div
              key="changelog-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ChangelogPage />
            </motion.div>
          )}
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
