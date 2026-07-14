import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  ExternalLink,
  Code,
  FileText,
  AlertCircle
} from "lucide-react";
import { LandingPage as LandingPageType, FAQItem, AnalysisResult, RepairSummary, HistoryItem } from "../types";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import Editor from "../components/Editor";
import Compare from "../components/Compare";
import RepairSummaryCard from "../components/RepairSummary";
import Scanner from "../components/Scanner";
import FAQ from "../components/FAQ";
import History from "../components/History";
import TexlyPromo from "../components/TexlyPromo";
import { LANDING_PAGES } from "../content/pages";

interface LandingPageProps {
  page: LandingPageType;
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

export default function LandingPage({
  page,
  inputText,
  setInputText,
  originalText,
  analysis,
  repairSummary,
  isRepaired,
  activeTab,
  setActiveTab,
  compareMode,
  setCompareMode,
  isDragging,
  reportOpen,
  setReportOpen,
  expandedCard,
  setExpandedCard,
  history,
  handleClear,
  handleCopy,
  handleAnalyze,
  handleFix,
  handleLoadSample,
  handleExport,
  loadHistoryItem,
  deleteHistoryItem,
  clearHistory,
  handleHelpfulFeedback,
  triggerToast,
}: LandingPageProps) {

  const scrollToEditor = () => {
    const editorEl = document.getElementById("tab-edit");
    if (editorEl) {
      editorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" id={`landing-page-${page.id}`}>
      <SEO page={page} />

      {/* Hero Section */}
      <Hero page={page} />

      {/* Tool Section: Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6" id="interactive-tool-grid">
        
        {/* Left Column: Editor Workspace */}
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

        {/* Right Column: Scan Anomalies, History, & Promo */}
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

          {/* Texly Promo box */}
          <TexlyPromo />

          {/* History log */}
          <History
            history={history}
            loadHistoryItem={loadHistoryItem}
            deleteHistoryItem={deleteHistoryItem}
            clearHistory={clearHistory}
          />

        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-20 border-t border-gray-100 dark:border-gray-850 pt-16" id="how-it-works">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              The Architecture
            </span>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-gray-950 dark:text-gray-50 tracking-tight sm:text-3xl">
              How the Cleaning Engine Repairs Your Text
            </h2>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              We understand how formatting decays across system clipboards. This module executes safe, multi-pass cleaning passes directly in your web browser memory.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-950 dark:text-gray-50">Local Analysis Scan</h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    The real-time scanner audits your paste, isolating invisible control chars, hyphen splices, and excessive space arrays.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-950 dark:text-gray-50">Heuristic Splicing Rules</h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Advanced regular expressions merge sentences split abruptly by margin boundaries while protecting standard punctuation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-950 dark:text-gray-50">Safe Export & Save</h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Export your repaired draft immediately as formatted TXT, MD, DOCX, or pure HTML markup files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Problem & Solution block */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/20 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
                <AlertCircle className="h-3 w-3" /> The Core Problem
              </span>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {page.problemDescription}
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-850 pt-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/20 px-2.5 py-1 text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
                <CheckCircle className="h-3 w-3" /> The Professional Solution
              </span>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {page.solutionDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Examples Section */}
      {page.examples && page.examples.length > 0 && (
        <div className="mt-20 border-t border-gray-100 dark:border-gray-850 pt-16" id="examples-comparison">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Comparative Demo</span>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 dark:text-gray-50 sm:text-3xl mt-2">
              Before & After Repairs
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              See how bad layouts are instantly translated to pristine prose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {page.examples.map((ex, index) => (
              <div key={index} className="rounded-2xl border border-gray-100 dark:border-gray-850 overflow-hidden shadow-xs flex flex-col">
                <div className="bg-gray-100/50 dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-850 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Example #{index + 1}</span>
                  <span className="text-[10px] uppercase font-mono font-bold text-red-500 bg-red-50 dark:bg-red-950/25 px-1.5 py-0.5 rounded">Before Repair</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-950/40 text-xs font-mono text-gray-600 dark:text-gray-300 flex-grow whitespace-pre-wrap">
                  {ex.input}
                </div>
                <div className="bg-blue-50/10 dark:bg-blue-950/10 px-4 py-3 border-t border-b border-gray-100 dark:border-gray-850 flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono font-bold text-green-600 bg-green-50 dark:bg-green-950/25 px-1.5 py-0.5 rounded">After Clean</span>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-200 flex-grow whitespace-pre-wrap font-medium">
                  {ex.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialty FAQs */}
      <FAQ items={page.faq} />

      {/* Related Specialty Tools Section */}
      {page.relatedPages && page.relatedPages.length > 0 && (
        <div className="mt-16 border-t border-gray-100 dark:border-gray-850 pt-12 text-center" id="related-specialty-tools">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
            Related Text Repair Tools
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {page.relatedPages.map((slug) => {
              const related = LANDING_PAGES[slug];
              if (!related) return null;
              return (
                <Link
                  key={slug}
                  to={`/${slug}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-xs hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200"
                >
                  <Sparkles className="h-3 w-3 text-blue-500" />
                  {related.title}
                  <ArrowRight className="h-3 w-3 opacity-60" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Call To Action Banner */}
      <div className="mt-20 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl" id="landing-page-cta">
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-extrabold sm:text-3xl tracking-tight">
            Clean and Polish Your Clipboard Instantly
          </h3>
          <p className="text-sm text-blue-100 leading-relaxed">
            Experience our offline-first technology. Safe, incredibly fast, and 100% private. Text never leaves your browser context.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={scrollToEditor}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-md hover:bg-gray-50 transition cursor-pointer"
            >
              Start Fixing Text
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://texlyonline.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-white/20 px-6 py-3 text-sm font-bold text-white transition"
            >
              Check Out Texly
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="flex justify-center items-center gap-6 pt-6 text-[11px] text-blue-100/80">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> 100% Private</span>
            <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5" /> Client-Side Only</span>
            <span className="flex items-center gap-1">✓ No Sign-up Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
