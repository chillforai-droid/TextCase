import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  CheckCircle2,
  Loader2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import { ActivePage, AnalysisResult, HistoryItem, RepairSummary } from "../types";
import { analyzeText, getTextStats } from "../utils/analysis";
import { repairText } from "../utils/repair";
import { applyCase, CaseMode } from "../utils/case";
import { LANDING_PAGES } from "../content/pages";
import { BLOG_ARTICLES } from "../content/blog";
import { FAQ_DATA } from "../content/faq";
import { repairSessionService } from "../services/repairSessionService";
import { feedbackService } from "../services/feedbackService";
import { roadmapService } from "../services/roadmapService";
import { changelogService } from "../services/changelogService";
import {
  getPublishedPrompt,
  getPublishedPromptCategories,
  getPublishedPromptsByCategory,
} from "../services/promptStoreService";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

interface ActionReceipt {
  id: string;
  label: string;
  detail?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: ActionReceipt[];
  isError?: boolean;
}

interface ToolCallItem {
  id?: string;
  name: string;
  args: Record<string, unknown>;
}

interface AIAgentProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  startVoiceSignal: number;
  activePage: ActivePage;
  currentLandingPage: string;
  inputText: string;
  setInputText: (text: string) => void;
  originalText: string;
  setOriginalText: (text: string) => void;
  analysis: AnalysisResult;
  setAnalysis: (res: AnalysisResult) => void;
  setRepairSummary: (summary: RepairSummary | null) => void;
  isRepaired: boolean;
  setIsRepaired: (val: boolean) => void;
  activeTab: "edit" | "compare";
  setActiveTab: (tab: "edit" | "compare") => void;
  compareMode: "side" | "unified";
  setCompareMode: (mode: "side" | "unified") => void;
  caseMode: CaseMode;
  setCaseMode: (mode: CaseMode) => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  loadHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
  setReportOpen: (open: boolean) => void;
  handleExport: (format: "txt" | "md" | "html" | "docx", overrideText?: string) => void;
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

const FALLBACK_ROADMAP = [
  { title: "In-Browser Fast Text Repair Engine", status: "completed", version: "1.0.0", description: "Instant single-click repair of broken line wraps, smart quotes, paragraph splits, and PDF hyphenations." },
  { title: "Zero-Width Hidden Unicode Detector", status: "completed", version: "1.0.2", description: "Detect and purge hidden ZWSP, BOM, and NBSP characters." },
  { title: "ChatGPT Markdown Strip Utility", status: "completed", version: "1.0.5", description: "Remove unwanted markdown symbols while preserving continuous prose." },
  { title: "Batch File Processing & Uploads", status: "in-progress", version: "1.1.0", description: "Upload local .txt and .pdf files to run the repair engine in batch mode." },
  { title: "Browser Extension (Chrome, Firefox & Safari)", status: "planned", description: "Highlight broken text anywhere on the web and repair it via context menu." },
  { title: "Custom Regex Rules Engine", status: "planned", description: "Define and save custom search-and-replace regular expressions." },
];

const FALLBACK_CHANGELOG = [
  { version: "1.0.5", title: "SEO Canonical Domains & Metadata Upgrade", release_date: "2026-07-13", description: "Upgraded XML sitemaps, robots structures, JSON-LD schemas, and canonical tags targeting textcase.in." },
  { version: "1.0.2", title: "Unicode Invisible Character Scanning", release_date: "2026-07-08", description: "Advanced inspection flagging ZWSP, BOM, and NBSP with one-click safe purging." },
  { version: "1.0.0", title: "Production Release: Smart Text Repair Tool", release_date: "2026-07-01", description: "Initial launch with sentence splicing, hyphenation merging, ChatGPT markdown washer, and local processing." },
];

const QUICK_PROMPTS = [
  "Is text ko fix karo aur report dikhao",
  "Title Case me convert karo",
  "Hidden Unicode scan karo",
  "Prompt Store & Roadmap batao",
  "PDF sample load karke repair karo",
  "Word (.doc) me export karo",
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "नमस्ते! मैं TextCase AI Agent हूँ। आप बोलकर (Voice) या लिखकर (Text) इस वेबसाइट के सारे काम यहीं से करवा सकते हैं — जैसे text repair, PDF/OCR/ChatGPT cleanup, Unicode scan, Case conversion, Diff compare, TXT/MD/HTML/DOCX export, Blog guides, Prompt Store, Roadmap, या Feedback/Support भेजना। बिना किसी दूसरे page पर जाए बताइए, क्या मदद करूँ?",
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = String(reader.result || "");
      const idx = res.indexOf(",");
      resolve(idx >= 0 ? res.slice(idx + 1) : res);
    };
    reader.onerror = () => reject(new Error("Failed to read audio recording"));
    reader.readAsDataURL(blob);
  });
}

async function parseJsonResponse(resp: Response): Promise<Record<string, any>> {
  const raw = await resp.text();
  if (!raw || !raw.trim()) {
    throw new Error(
      `Empty response from AI Agent API (HTTP ${resp.status}). Make sure the /api/agent routes are deployed and running.`
    );
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(
      `Unexpected server response (HTTP ${resp.status}). Make sure the backend API routes are active.`
    );
  }
}

export default function AIAgent(props: AIAgentProps) {
  const {
    isOpen,
    setIsOpen,
    startVoiceSignal,
    currentLandingPage,
    inputText,
    setInputText,
    originalText,
    setOriginalText,
    analysis,
    setAnalysis,
    setRepairSummary,
    isRepaired,
    setIsRepaired,
    activeTab,
    setActiveTab,
    compareMode,
    setCompareMode,
    caseMode,
    setCaseMode,
    theme,
    setTheme,
    history,
    setHistory,
    loadHistoryItem,
    clearHistory,
    setReportOpen,
    handleExport,
    triggerToast,
  } = props;

  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Voice Input & Output states
  const [voiceLang, setVoiceLang] = useState<"hi-IN" | "en-US">("hi-IN");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "recording" | "transcribing">("idle");
  const [interimTranscript, setInterimTranscript] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const lastVoiceSignalRef = useRef(0);
  const latestInputRef = useRef(inputText);
  latestInputRef.current = inputText;

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, isOpen]);

  // Respond to external "Voice Command" trigger
  useEffect(() => {
    if (startVoiceSignal > 0 && startVoiceSignal !== lastVoiceSignalRef.current) {
      lastVoiceSignalRef.current = startVoiceSignal;
      setIsOpen(true);
      setTimeout(() => {
        if (voiceStatus === "idle") {
          startVoiceInput();
        }
      }, 180);
    }
  }, [startVoiceSignal]);

  // Cleanup audio streams & speech on unmount
  useEffect(() => {
    return () => {
      stopAllVoiceCapture(false);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function speakText(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleaned = text.replace(/[*_`#]/g, "").slice(0, 800);
      const utterance = new SpeechSynthesisUtterance(cleaned);
      const hasDevanagari = /[\u0900-\u097F]/.test(cleaned);
      const targetLang = hasDevanagari ? "hi-IN" : voiceLang;
      utterance.lang = targetLang;
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLang.split("-")[0].toLowerCase())) ||
        voices[0];
      if (matchingVoice) utterance.voice = matchingVoice;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speechSynthesis runtime quirks
    }
  }

  function stopAllVoiceCapture(submitRecorded = true) {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        if (!submitRecorded) {
          mediaRecorderRef.current.ondataavailable = null;
          mediaRecorderRef.current.onstop = null;
        }
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (!submitRecorded && mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  }

  async function startMediaRecorderFallback() {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      triggerToast("Microphone is not supported in this browser.", "warning");
      setVoiceStatus("idle");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;

        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];
        if (chunks.length === 0) {
          setVoiceStatus("idle");
          return;
        }

        setVoiceStatus("transcribing");
        try {
          const blob = new Blob(chunks, { type: mimeType });
          const audioBase64 = await blobToBase64(blob);
          const resp = await fetch("/api/agent/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioBase64,
              mimeType: mimeType.split(";")[0],
              languageHint: voiceLang === "hi-IN" ? "Hindi or Hinglish" : "English",
            }),
          });
          const data = await parseJsonResponse(resp);
          if (!resp.ok) {
            throw new Error(data.error || "Transcription failed");
          }
          const transcript = (data.text || "").trim();
          setVoiceStatus("idle");
          if (transcript) {
            await sendUserMessage(transcript);
          } else {
            triggerToast("No speech detected. Please try again.", "info");
          }
        } catch (err: any) {
          setVoiceStatus("idle");
          triggerToast(err?.message || "Voice transcription failed.", "warning");
        }
      };

      recorder.start();
      setVoiceStatus("recording");
    } catch {
      setVoiceStatus("idle");
      triggerToast("Microphone permission denied or unavailable.", "warning");
    }
  }

  function startVoiceInput() {
    if (voiceStatus === "listening") {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          setVoiceStatus("idle");
        }
      }
      return;
    }

    if (voiceStatus === "recording") {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    if (voiceStatus === "transcribing" || isSending) return;

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      startMediaRecorderFallback();
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognitionRef.current = recognition;
      recognition.lang = voiceLang;
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      let finalText = "";
      let fallbackTriggered = false;

      setInterimTranscript("");
      setVoiceStatus("listening");

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) {
            finalText += (finalText ? " " : "") + piece.trim();
          } else {
            interim += piece;
          }
        }
        setInterimTranscript((finalText + (interim ? " " + interim : "")).trim());
      };

      recognition.onerror = (event: any) => {
        const errCode = event?.error;
        if (errCode === "network" || errCode === "service-not-allowed") {
          fallbackTriggered = true;
          recognitionRef.current = null;
          setInterimTranscript("");
          startMediaRecorderFallback();
          return;
        }
        if (errCode === "not-allowed") {
          triggerToast("Microphone access denied. Please allow mic permission.", "warning");
        } else if (errCode !== "aborted" && errCode !== "no-speech") {
          triggerToast(`Voice input error: ${errCode}`, "warning");
        }
        setVoiceStatus("idle");
        setInterimTranscript("");
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        if (fallbackTriggered) return;
        recognitionRef.current = null;
        setVoiceStatus("idle");
        const spoken = (finalText || interimTranscript).trim();
        setInterimTranscript("");
        if (spoken) {
          sendUserMessage(spoken);
        }
      };

      recognition.start();
    } catch {
      startMediaRecorderFallback();
    }
  }

  async function executeToolCall(
    call: ToolCallItem,
    workingState: { text: string; original: string }
  ): Promise<{ result: Record<string, unknown>; receipt?: ActionReceipt }> {
    const args = call.args || {};

    switch (call.name) {
      case "repair_text": {
        const sourceText =
          typeof args.text === "string" && args.text.length > 0 ? args.text : workingState.text;
        if (!sourceText.trim()) {
          return {
            result: { success: false, error: "Editor is empty. Ask user to provide or load sample text first." },
          };
        }
        const startTime = performance.now();
        const repaired = repairText(sourceText);
        const processingTime = Math.round(performance.now() - startTime);
        const newAnalysis = analyzeText(repaired.repairedText);
        const totalFixed = Object.values(repaired.summary).reduce(
          (sum, val) => sum + (typeof val === "number" ? val : 0),
          0
        );

        workingState.original = sourceText;
        workingState.text = repaired.repairedText;

        setOriginalText(sourceText);
        setInputText(repaired.repairedText);
        setRepairSummary(repaired.summary);
        setIsRepaired(true);
        setAnalysis(newAnalysis);

        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          date:
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
            " " +
            new Date().toLocaleDateString(),
          original: sourceText,
          repaired: repaired.repairedText,
          problemsFixed: totalFixed,
          characters: repaired.repairedText.length,
        };
        setHistory((prev) => {
          const updated = [newItem, ...prev].slice(0, 15);
          localStorage.setItem("textcase-history", JSON.stringify(updated));
          return updated;
        });

        const wordsCount = repaired.repairedText.trim().split(/\s+/).filter(Boolean).length;
        const rulesAppliedCount = Object.values(repaired.summary).reduce(
          (acc, val) => acc + (typeof val === "number" && val > 0 ? 1 : 0),
          0
        );
        repairSessionService
          .create({
            session_id: newItem.id,
            repair_mode: String(args.mode || currentLandingPage || "ai-agent"),
            characters: repaired.repairedText.length,
            words: wordsCount,
            processing_time: processingTime,
            problems_found: totalFixed,
            rules_applied: rulesAppliedCount,
            success: true,
            browser: "AI Agent",
            device: "Web",
          })
          .catch(() => {});

        triggerToast(`Repaired ${totalFixed} formatting issues.`, "success");

        return {
          result: {
            success: true,
            totalFixed,
            summary: repaired.summary,
            healthScoreAfter: newAnalysis.healthScore,
            characters: repaired.repairedText.length,
            words: wordsCount,
            repairedTextPreview: repaired.repairedText.slice(0, 2000),
          },
          receipt: {
            id: `${call.name}-${Date.now()}`,
            label: `Repaired text (${totalFixed} issues fixed)`,
            detail: `Health ${newAnalysis.healthScore}/100`,
          },
        };
      }

      case "analyze_text": {
        const target =
          typeof args.text === "string" && args.text.length > 0 ? args.text : workingState.text;
        if (typeof args.text === "string" && args.text.length > 0) {
          workingState.text = args.text;
          setInputText(args.text);
          setIsRepaired(false);
        }
        const scan = analyzeText(target);
        const stats = getTextStats(target);
        setAnalysis(scan);

        return {
          result: {
            success: true,
            healthScore: scan.healthScore,
            stats,
            issues: {
              markdown: { count: scan.markdown.count, details: scan.markdown.details },
              hiddenChars: { count: scan.hiddenChars.count, details: scan.hiddenChars.details },
              brokenLines: { count: scan.brokenLines.count, details: scan.brokenLines.details },
              extraSpaces: { count: scan.extraSpaces.count, details: scan.extraSpaces.details },
              ocrProblems: { count: scan.ocrProblems.count, details: scan.ocrProblems.details },
              unicodeProblems: { count: scan.unicodeProblems.count, details: scan.unicodeProblems.details },
            },
          },
          receipt: {
            id: `${call.name}-${Date.now()}`,
            label: "Scanned workspace text",
            detail: `Health ${scan.healthScore}/100 · ${stats.words} words`,
          },
        };
      }

      case "convert_case": {
        const mode = String(args.mode || "none") as CaseMode;
        const validModes: CaseMode[] = ["upper", "lower", "title", "sentence", "capitalize-lines"];
        if (!validModes.includes(mode)) {
          return {
            result: { success: false, error: `Unsupported case mode '${mode}'.` },
          };
        }
        const sourceText =
          typeof args.text === "string" && args.text.length > 0 ? args.text : workingState.text;
        if (!sourceText.trim()) {
          return { result: { success: false, error: "No text available to convert case." } };
        }
        const converted = applyCase(sourceText, mode);
        workingState.original = sourceText;
        workingState.text = converted;

        setOriginalText(sourceText);
        setInputText(converted);
        setCaseMode(mode);
        setIsRepaired(true);
        setRepairSummary(null);
        setAnalysis(analyzeText(converted));
        triggerToast(`Converted text to ${mode} case.`, "success");

        return {
          result: {
            success: true,
            mode,
            characters: converted.length,
            convertedTextPreview: converted.slice(0, 2000),
          },
          receipt: {
            id: `${call.name}-${Date.now()}`,
            label: `Converted case to ${mode}`,
          },
        };
      }

      case "set_editor_text": {
        const incoming = String(args.text || "");
        const next = args.append && workingState.text ? `${workingState.text}\n${incoming}` : incoming;
        workingState.text = next;
        workingState.original = "";
        setInputText(next);
        setOriginalText("");
        setIsRepaired(false);
        setRepairSummary(null);
        setAnalysis(analyzeText(next));
        setActiveTab("edit");
        return {
          result: { success: true, characters: next.length },
          receipt: {
            id: `${call.name}-${Date.now()}`,
            label: args.append ? "Appended text to editor" : "Updated editor text",
            detail: `${next.length} chars`,
          },
        };
      }

      case "load_sample_text": {
        const key = String(args.pageKey || currentLandingPage || "default");
        const page = LANDING_PAGES[key] || LANDING_PAGES.default;
        workingState.text = page.sampleText;
        workingState.original = "";
        setInputText(page.sampleText);
        setOriginalText("");
        setIsRepaired(false);
        setRepairSummary(null);
        setAnalysis(analyzeText(page.sampleText));
        setActiveTab("edit");
        triggerToast(`Loaded ${page.title} sample.`, "success");
        return {
          result: {
            success: true,
            pageKey: page.id,
            title: page.title,
            samplePreview: page.sampleText.slice(0, 800),
          },
          receipt: {
            id: `${call.name}-${Date.now()}`,
            label: `Loaded sample (${page.title})`,
          },
        };
      }

      case "clear_editor": {
        workingState.text = "";
        workingState.original = "";
        setInputText("");
        setOriginalText("");
        setIsRepaired(false);
        setRepairSummary(null);
        setActiveTab("edit");
        triggerToast("Editor cleared.", "info");
        return {
          result: { success: true },
          receipt: { id: `${call.name}-${Date.now()}`, label: "Cleared editor" },
        };
      }

      case "copy_output": {
        if (!workingState.text) {
          return { result: { success: false, error: "Nothing in editor to copy." } };
        }
        try {
          await navigator.clipboard.writeText(workingState.text);
          triggerToast("Copied to clipboard!", "success");
          return {
            result: { success: true, copiedCharacters: workingState.text.length },
            receipt: {
              id: `${call.name}-${Date.now()}`,
              label: "Copied text to clipboard",
              detail: `${workingState.text.length} chars`,
            },
          };
        } catch {
          return {
            result: {
              success: false,
              error: "Browser blocked automatic clipboard write; text is visible in the editor for manual copy.",
            },
          };
        }
      }

      case "export_document": {
        const format = String(args.format || "txt").toLowerCase() as "txt" | "md" | "html" | "docx";
        if (!["txt", "md", "html", "docx"].includes(format)) {
          return { result: { success: false, error: "Format must be txt, md, html, or docx." } };
        }
        if (!workingState.text) {
          return { result: { success: false, error: "Editor is empty. Nothing to export." } };
        }
        handleExport(format, workingState.text);
        return {
          result: { success: true, format },
          receipt: {
            id: `${call.name}-${Date.now()}`,
            label: `Exported ${format.toUpperCase()} file`,
          },
        };
      }

      case "switch_workspace_view": {
        const view = String(args.view || "edit");
        if (view === "audit_report") {
          setReportOpen(true);
          return {
            result: { success: true, view: "audit_report" },
            receipt: { id: `${call.name}-${Date.now()}`, label: "Opened Audit Report" },
          };
        }
        if (view === "compare") {
          if (!workingState.original && !originalText) {
            return {
              result: {
                success: false,
                error: "No repair or case conversion has been performed yet to compare.",
              },
            };
          }
          if (args.compareMode === "side" || args.compareMode === "unified") {
            setCompareMode(args.compareMode);
          }
          setActiveTab("compare");
          return {
            result: { success: true, view: "compare", compareMode: args.compareMode || compareMode },
            receipt: { id: `${call.name}-${Date.now()}`, label: "Opened Diff Auditor" },
          };
        }
        setActiveTab("edit");
        return {
          result: { success: true, view: "edit" },
          receipt: { id: `${call.name}-${Date.now()}`, label: "Switched to Interactive Workspace" },
        };
      }

      case "manage_history": {
        const action = String(args.action || "list");
        if (action === "list") {
          return {
            result: {
              success: true,
              count: history.length,
              items: history.map((item, i) => ({
                index: i + 1,
                id: item.id,
                date: item.date,
                problemsFixed: item.problemsFixed,
                characters: item.characters,
                preview: item.repaired.slice(0, 120),
              })),
            },
          };
        }
        if (action === "restore") {
          const idx = Math.max(0, Number(args.index || 1) - 1);
          const item = history[idx];
          if (!item) {
            return { result: { success: false, error: "History item not found at that index." } };
          }
          loadHistoryItem(item);
          workingState.original = item.original;
          workingState.text = item.repaired;
          return {
            result: { success: true, restoredIndex: idx + 1, characters: item.characters },
            receipt: { id: `${call.name}-${Date.now()}`, label: `Restored history #${idx + 1}` },
          };
        }
        if (action === "clear") {
          clearHistory();
          return {
            result: { success: true },
            receipt: { id: `${call.name}-${Date.now()}`, label: "Cleared repair history" },
          };
        }
        return { result: { success: false, error: "Unknown history action." } };
      }

      case "set_theme": {
        const nextTheme = String(args.theme || "system") as "light" | "dark" | "system";
        if (!["light", "dark", "system"].includes(nextTheme)) {
          return { result: { success: false, error: "Theme must be light, dark, or system." } };
        }
        setTheme(nextTheme);
        triggerToast(`Theme set to ${nextTheme}.`, "info");
        return {
          result: { success: true, theme: nextTheme },
          receipt: { id: `${call.name}-${Date.now()}`, label: `Theme changed to ${nextTheme}` },
        };
      }

      case "lookup_site_content": {
        const section = String(args.section || "tools_overview");
        const query = String(args.slugOrQuery || "").toLowerCase().trim();

        if (section === "tools_overview") {
          return {
            result: {
              tools: Object.values(LANDING_PAGES).map((p) => ({
                id: p.id,
                path: p.slug ? `/${p.slug}` : "/",
                title: p.title,
                subtitle: p.subtitle,
                examples: p.examples,
              })),
            },
          };
        }
        if (section === "blog_list") {
          return {
            result: {
              articles: BLOG_ARTICLES.map((a) => ({
                slug: a.slug,
                title: a.title,
                category: a.category,
                date: a.date,
                readTime: a.readTime,
                excerpt: a.excerpt,
              })),
            },
          };
        }
        if (section === "blog_article") {
          const match =
            BLOG_ARTICLES.find((a) => a.slug === query) ||
            BLOG_ARTICLES.find(
              (a) =>
                a.slug.includes(query) ||
                a.title.toLowerCase().includes(query) ||
                a.category.toLowerCase().includes(query)
            ) ||
            BLOG_ARTICLES[0];
          return {
            result: {
              slug: match.slug,
              title: match.title,
              category: match.category,
              readTime: match.readTime,
              content: match.content.slice(0, 5000),
            },
          };
        }
        if (section === "faq") {
          const pageFaq = LANDING_PAGES[currentLandingPage]?.faq || [];
          return {
            result: {
              generalFaq: FAQ_DATA,
              toolSpecificFaq: pageFaq,
            },
          };
        }
        if (section === "roadmap") {
          try {
            const data = await roadmapService.getAll();
            return { result: { items: data.length > 0 ? data : FALLBACK_ROADMAP } };
          } catch {
            return { result: { items: FALLBACK_ROADMAP, source: "built-in defaults" } };
          }
        }
        if (section === "changelog") {
          try {
            const data = await changelogService.getAll();
            return { result: { releases: data.length > 0 ? data : FALLBACK_CHANGELOG } };
          } catch {
            return { result: { releases: FALLBACK_CHANGELOG, source: "built-in defaults" } };
          }
        }
        if (section === "prompt_store") {
          try {
            const categories = await getPublishedPromptCategories();
            if (!categories.length) {
              return {
                result: {
                  available: false,
                  message:
                    "Prompt Store is currently empty or database credentials are not connected yet. You can still ask me directly to craft any AI prompt for writing, coding, SEO, marketing, or research!",
                },
              };
            }
            if (query) {
              const matchedCat = categories.find(
                (c) => c.slug.includes(query) || c.name.toLowerCase().includes(query)
              );
              if (matchedCat) {
                const prompts = await getPublishedPromptsByCategory(matchedCat.id);
                return { result: { category: matchedCat, prompts } };
              }
              const singlePrompt = await getPublishedPrompt(query);
              if (singlePrompt) return { result: { prompt: singlePrompt } };
            }
            const firstPrompts = await getPublishedPromptsByCategory(categories[0].id);
            return {
              result: {
                categories,
                featuredCategory: categories[0].name,
                featuredPrompts: firstPrompts.slice(0, 6),
              },
            };
          } catch {
            return {
              result: {
                available: false,
                message:
                  "Prompt Store database is currently unavailable in this environment, but I can generate custom prompts for any task directly here!",
              },
            };
          }
        }
        if (section === "about") {
          return {
            result: {
              summary:
                "TextCase is a fast, free, privacy-first text repair utility built for developers, writers, and editors. Core repair runs 100% locally in browser RAM using optimized regex and Unicode passes.",
            },
          };
        }
        if (section === "privacy") {
          return {
            result: {
              summary:
                "Core TextCase repair, analysis, and case conversion run 100% client-side in browser RAM without storing text or tracking cookies. When you use this AI Agent, your chat/voice prompt and active editor context are sent to our server-side Gemini endpoint to fulfill your request.",
            },
          };
        }
        if (section === "terms") {
          return {
            result: {
              summary:
                "TextCase is free for personal, academic, and commercial use with no character limits or paywalls, provided as-is. Always review critical documents after automated formatting.",
            },
          };
        }
        return { result: { error: "Unknown content section." } };
      }

      case "submit_user_message": {
        const msgType = String(args.type || "feedback");
        const message = String(args.message || "").trim();
        if (!message) {
          return { result: { success: false, error: "Message text is required." } };
        }
        if (msgType === "contact") {
          const name = String(args.name || "").trim();
          const email = String(args.email || "").trim();
          if (!name || !email) {
            return {
              result: {
                success: false,
                error: "Please provide both name and email address to send a support message.",
              },
            };
          }
          try {
            if (!isSupabaseConfigured) {
              return {
                result: {
                  success: false,
                  error: "Support database is not configured in this environment.",
                },
              };
            }
            const { error } = await supabase.from("user_inquiries").insert({
              name,
              email,
              message,
              status: "new",
            });
            if (error) throw error;
            triggerToast("Support message sent!", "success");
            return {
              result: { success: true },
              receipt: { id: `${call.name}-${Date.now()}`, label: "Sent Contact Support message" },
            };
          } catch (err: any) {
            return {
              result: {
                success: false,
                error: err?.message || "Support database is not configured in this environment.",
              },
            };
          }
        } else {
          try {
            await feedbackService.create({
              name: String(args.name || "TextCase User"),
              feedback_type: (args.feedbackType as any) || "Suggestion",
              category: (args.category as any) || "General",
              message,
              original_text: workingState.text.slice(0, 1000),
              repair_mode: currentLandingPage,
              likes: 0,
              is_public: typeof args.isPublic === "boolean" ? args.isPublic : true,
              status: "pending",
            });
            triggerToast("Feedback submitted!", "success");
            return {
              result: { success: true },
              receipt: { id: `${call.name}-${Date.now()}`, label: "Submitted feedback" },
            };
          } catch (err: any) {
            return {
              result: {
                success: false,
                error: err?.message || "Feedback database is not configured in this environment.",
              },
            };
          }
        }
      }

      case "navigate_to_page": {
        const targetPath = String(args.path || "/");
        navigate(targetPath);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return {
          result: { success: true, navigatedTo: targetPath },
          receipt: { id: `${call.name}-${Date.now()}`, label: `Opened ${targetPath}` },
        };
      }

      default:
        return { result: { error: `Unknown tool ${call.name}` } };
    }
  }

  async function sendUserMessage(rawText: string) {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setDraft("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsSending(true);

    const workingState = {
      text: latestInputRef.current,
      original: originalText,
    };
    const collectedReceipts: ActionReceipt[] = [];

    try {
      const workspaceContext = {
        currentRoute: location.pathname,
        currentLandingPage,
        inputText: workingState.text,
        originalText: workingState.original,
        isRepaired,
        activeTab,
        compareMode,
        caseMode,
        theme,
        historyCount: history.length,
        analysis: {
          healthScore: analysis.healthScore,
          markdown: analysis.markdown.count,
          hiddenChars: analysis.hiddenChars.count,
          brokenLines: analysis.brokenLines.count,
          extraSpaces: analysis.extraSpaces.count,
          ocrProblems: analysis.ocrProblems.count,
          unicodeProblems: analysis.unicodeProblems.count,
        },
      };

      let payload: Record<string, unknown> = {
        messages: nextHistory
          .filter((m) => !m.isError && m.id !== "welcome")
          .map((m) => ({ role: m.role, text: m.text })),
        workspaceContext,
      };

      let finalAssistantText = "";
      let rounds = 0;

      while (rounds < 5) {
        rounds++;
        const resp = await fetch("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await parseJsonResponse(resp);
        if (!resp.ok) {
          throw new Error(data.error || "AI Agent request failed.");
        }

        if (data.type === "tool_calls" && Array.isArray(data.calls)) {
          const toolResponses: Array<{
            id?: string;
            name: string;
            response: Record<string, unknown>;
          }> = [];

          for (const call of data.calls as ToolCallItem[]) {
            const executed = await executeToolCall(call, workingState);
            if (executed.receipt) {
              collectedReceipts.push(executed.receipt);
            }
            toolResponses.push({
              id: call.id,
              name: call.name,
              response: executed.result,
            });
          }

          payload = {
            contentsOverride: data.updatedContents,
            toolResponses,
          };
          continue;
        }

        finalAssistantText = data.text || "Done.";
        break;
      }

      if (!finalAssistantText && collectedReceipts.length > 0) {
        finalAssistantText = collectedReceipts.map((r) => r.label).join(", ") + ".";
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: finalAssistantText,
        actions: collectedReceipts.length > 0 ? collectedReceipts : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (autoSpeak && finalAssistantText) {
        speakText(finalAssistantText);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: "assistant",
        text: err?.message || "Something went wrong reaching the AI Agent.",
        actions: collectedReceipts.length > 0 ? collectedReceipts : undefined,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  }

  const stats = getTextStats(inputText);

  return (
    <>
      {/* Compact Floating AI Agent Dock (bottom-right) */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1.5 shadow-lg">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white transition whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            id="btn-open-ai-agent"
          >
            <Bot className="h-4 w-4" />
            <span>AI Agent</span>
          </button>
          <button
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => startVoiceInput(), 180);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Start Voice Command"
            title="Start Voice Command"
            id="btn-dock-voice"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Slide-Over AI Agent Workspace Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full sm:w-[440px] flex-col border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl select-text"
            aria-label="TextCase AI Agent"
            id="ai-agent-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-950">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-bold text-gray-950 dark:text-white truncate">
                    TextCase AI
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate tabular-nums">
                    {stats.words} words · {analysis.healthScore}/100
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Voice Language Switch */}
                <button
                  onClick={() => setVoiceLang((l) => (l === "hi-IN" ? "en-US" : "hi-IN"))}
                  className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-[11px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer whitespace-nowrap"
                  title="Switch Voice Recognition Language"
                >
                  {voiceLang === "hi-IN" ? "हिन्दी / EN" : "EN"}
                </button>

                {/* Auto-Speak Toggle */}
                <button
                  onClick={() => {
                    const next = !autoSpeak;
                    setAutoSpeak(next);
                    if (!next && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border transition cursor-pointer ${
                    autoSpeak
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  aria-label={autoSpeak ? "Mute voice replies" : "Speak replies aloud"}
                  title={autoSpeak ? "Voice replies On" : "Voice replies Off"}
                >
                  {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>

                {/* Clear Chat */}
                <button
                  onClick={() => setMessages([WELCOME_MESSAGE])}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Close */}
                <button
                  onClick={() => {
                    stopAllVoiceCapture(false);
                    setVoiceStatus("idle");
                    setIsOpen(false);
                  }}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                  aria-label="Close AI Agent"
                  id="btn-close-ai-agent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  {/* Action Receipts executed by this assistant turn */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mb-1.5 flex flex-col gap-1 w-full max-w-[92%]">
                      {msg.actions.map((act) => (
                        <div
                          key={act.id}
                          className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-2.5 py-1.5 text-[11px] text-gray-700 dark:text-gray-300"
                        >
                          <span className="flex items-center gap-1.5 font-semibold truncate">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" />
                            <span className="truncate">{act.label}</span>
                          </span>
                          {act.detail && (
                            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 shrink-0 tabular-nums">
                              {act.detail}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : msg.isError
                        ? "border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
                        : "border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {msg.text}
                    {msg.role === "assistant" && !msg.isError && (
                      <div className="mt-1.5 flex justify-end">
                        <button
                          onClick={() => speakText(msg.text)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                          title="Listen"
                        >
                          <Volume2 className="h-3 w-3" />
                          <span>Listen</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span>Processing your request…</span>
                </div>
              )}

              {/* Quick Suggestions when conversation is fresh */}
              {messages.length <= 2 && !isSending && (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Try saying or clicking:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendUserMessage(q)}
                        className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Live Voice Capture Banner */}
            {voiceStatus !== "idle" && (
              <div className="border-t border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 flex items-center justify-between gap-2 text-xs text-blue-800 dark:text-blue-200">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                  <span className="truncate font-medium">
                    {voiceStatus === "listening"
                      ? interimTranscript || "Listening… speak your command"
                      : voiceStatus === "recording"
                      ? "Recording voice command… tap mic to send"
                      : "Transcribing voice command…"}
                  </span>
                </div>
                {voiceStatus !== "transcribing" && (
                  <button
                    onClick={startVoiceInput}
                    className="shrink-0 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white cursor-pointer"
                  >
                    Stop & Send
                  </button>
                )}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendUserMessage(draft);
              }}
              className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3"
            >
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={startVoiceInput}
                  disabled={voiceStatus === "transcribing" || isSending}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition cursor-pointer ${
                    voiceStatus === "listening" || voiceStatus === "recording"
                      ? "border-red-500 bg-red-600 text-white"
                      : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400"
                  } disabled:opacity-50`}
                  aria-label={
                    voiceStatus === "idle" ? "Speak voice command" : "Stop voice command"
                  }
                  title="Voice Command (Hindi / English)"
                  id="btn-agent-mic"
                >
                  {voiceStatus === "listening" || voiceStatus === "recording" ? (
                    <MicOff className="h-4 w-4" />
                  ) : voiceStatus === "transcribing" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>

                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendUserMessage(draft);
                    }
                  }}
                  placeholder="Ask or speak (Hindi / EN)…"
                  className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-sm leading-snug text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  id="ai-agent-input"
                />

                <button
                  type="submit"
                  disabled={!draft.trim() || isSending}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-45 disabled:cursor-not-allowed transition cursor-pointer"
                  aria-label="Send message"
                  id="btn-agent-send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
