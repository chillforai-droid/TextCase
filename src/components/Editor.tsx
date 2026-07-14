import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Clipboard,
  Trash2,
  Download,
  ChevronDown,
  Globe,
  FileCode2,
  Search,
  Sparkles
} from "lucide-react";

interface EditorProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleClear: () => void;
  handleCopy: () => void;
  handleAnalyze: () => void;
  handleFix: () => void;
  handleLoadSample: () => void;
  handleExport: (format: "txt" | "md" | "html" | "docx") => void;
  isDragging: boolean;
}

export default function Editor({
  inputText,
  setInputText,
  handleClear,
  handleCopy,
  handleAnalyze,
  handleFix,
  handleLoadSample,
  handleExport,
  isDragging
}: EditorProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close export dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
      }
    } catch {
      // Fallback if permission is denied
    }
  };

  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const lineCount = inputText ? inputText.split(/\n/).length : 0;

  return (
    <div className="flex flex-col flex-grow relative" id="editor-wrapper">
      {/* Drag Overlay visual indicator */}
      {isDragging && (
        <div className="absolute inset-0 z-40 bg-blue-600/10 backdrop-blur-[2px] rounded-2xl border-2 border-dashed border-blue-500 flex items-center justify-center animate-pulse pointer-events-none">
          <div className="bg-white dark:bg-gray-900 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3">
            <span className="text-blue-500 font-extrabold text-lg">📄</span>
            <span className="font-display font-black text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Drop Document to Import
            </span>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-150 dark:border-gray-850 bg-white dark:bg-gray-900 p-5 shadow-sm flex flex-col flex-grow min-h-[500px]">
        {/* Textarea Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800" id="editor-toolbar">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <FileText className="h-4 w-4" />
            <span>Live Text Workspace</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePaste}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
              title="Paste Clipboard Content"
              id="btn-paste"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>Paste</span>
            </button>
            <button
              onClick={handleClear}
              disabled={!inputText}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50/20 dark:hover:bg-red-950/20 disabled:opacity-40 transition-all cursor-pointer"
              title="Clear Editor Input"
              id="btn-clear-trash"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-black transition-all shadow-md shadow-blue-500/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Load messy template text"
              id="btn-sample-try"
            >
              <span>✨ Try Sample</span>
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <div className="relative flex-grow mt-4 min-h-[300px]">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or drop your messy text here (e.g. from ChatGPT, PDF, Web scans) to begin automatic analysis..."
            className="w-full h-full min-h-[300px] resize-none border-0 p-0 text-sm sm:text-base text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-750 focus:outline-none focus:ring-0 leading-relaxed font-sans bg-transparent"
            id="text-editor"
          />

          {/* Empty state overlay indicator */}
          {!inputText && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-3 animate-bounce">
                <Clipboard className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black text-gray-800 dark:text-gray-200">Paste or drag text here</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[280px] mb-4">
                Supports DOCX, Markdown, PDF copy-pastes, and hidden characters. Processed 100% offline.
              </p>
              <button
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4.5 py-2.5 text-xs font-black shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.03] active:scale-[0.97] pointer-events-auto cursor-pointer"
                id="btn-empty-sample"
              >
                <span>✨ Try Sample</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic metadata counters & Fixes list */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 dark:border-gray-800 pt-3">
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-550 mr-1">Fixes:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-100/30 dark:border-green-900/40">
            ✔ Markdown
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-100/30 dark:border-purple-900/40">
            ✔ Unicode
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100/30 dark:border-amber-900/40">
            ✔ OCR
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/40">
            ✔ PDF Column Margins
          </span>
        </div>

        {/* Character/Word Counters and Export Menu */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4 text-xs font-mono text-gray-400 dark:text-gray-500">
            <div>
              <span className="text-gray-750 dark:text-gray-300 font-bold">{charCount}</span> chars
            </div>
            <div>
              <span className="text-gray-750 dark:text-gray-300 font-bold">{wordCount}</span> words
            </div>
            <div>
              <span className="text-gray-750 dark:text-gray-300 font-bold">{lineCount}</span> lines
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!inputText}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-45 transition cursor-pointer"
              id="btn-copy"
            >
              <Clipboard className="h-3.5 w-3.5" />
              Copy Output
            </button>

            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={!inputText}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-45 transition cursor-pointer"
                id="btn-download"
              >
                <Download className="h-3.5 w-3.5 text-blue-500" />
                <span>Export As...</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 bottom-full mb-1.5 z-30 w-44 origin-bottom-right rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 shadow-xl ring-1 ring-black/5">
                  <button
                    onClick={() => {
                      handleExport("txt");
                      setShowExportMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-gray-400" />
                    <span>Plain Text (.txt)</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExport("md");
                      setShowExportMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                  >
                    <FileCode2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Markdown (.md)</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExport("html");
                      setShowExportMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                  >
                    <Globe className="h-3.5 w-3.5 text-amber-500" />
                    <span>HTML Document (.html)</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExport("docx");
                      setShowExportMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    <span>Word Document (.docx)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3 animate-fade-in">
          <button
            onClick={handleAnalyze}
            disabled={!inputText}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 py-3.5 text-sm font-black shadow-xs hover:bg-blue-100/50 dark:hover:bg-blue-950/40 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
            id="btn-analyze"
          >
            <Search className="h-4 w-4" />
            Analyze Text
          </button>
          <button
            onClick={handleFix}
            disabled={!inputText}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-white py-3.5 text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            id="btn-fix"
          >
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            Fix Text Instantly
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Tips */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 justify-center text-[11px] text-gray-400 dark:text-gray-505">
        <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-mono text-[9px] shadow-xs">Ctrl + Enter</kbd>
        <span>to Repair</span>
        <span className="text-gray-300 dark:text-gray-800">•</span>
        <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-mono text-[9px] shadow-xs">Ctrl + Shift + Enter</kbd>
        <span>to Analyze</span>
        <span className="text-gray-300 dark:text-gray-800">•</span>
        <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-mono text-[9px] shadow-xs">Ctrl + L</kbd>
        <span>to Clear</span>
      </div>
    </div>
  );
}
