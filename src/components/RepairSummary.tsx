import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Printer, Clipboard } from "lucide-react";
import { RepairSummary as RepairSummaryType } from "../types";

interface RepairSummaryProps {
  repairSummary: RepairSummaryType | null;
  handleCopy: () => void;
  setReportOpen: (open: boolean) => void;
  onHelpfulFeedback: (helpful: boolean) => void;
}

export default function RepairSummary({
  repairSummary,
  handleCopy,
  setReportOpen,
  onHelpfulFeedback
}: RepairSummaryProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!repairSummary) return null;

  const handleVote = (helpful: boolean) => {
    setFeedbackSubmitted(true);
    onHelpfulFeedback(helpful);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-2xl border border-green-150/60 dark:border-green-950/40 bg-green-50/20 dark:bg-green-950/5 p-5 shadow-sm relative overflow-hidden mb-6"
      id="repair-summary-card"
    >
      {/* Success visual glow bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-green-500 animate-pulse" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 shadow-xs">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-100 text-base leading-snug">Repair Complete</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">100% formatted anomalies resolved locally.</p>
          </div>
        </div>
        
        {/* Report trigger */}
        <button
          onClick={() => setReportOpen(true)}
          className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
        >
          <Printer className="h-3 w-3" />
          <span>View Report</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-green-50/20 dark:bg-green-950/10 p-3 rounded-xl border border-green-100/50 dark:border-green-950/30">
        <div className="flex justify-between py-1 border-b border-green-100/10 dark:border-green-950/10">
          <span>Markdown elements</span>
          <span className="font-mono font-bold text-green-700 dark:text-green-400">{repairSummary.markdownRemoved}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-green-100/10 dark:border-green-950/10">
          <span>Hidden characters</span>
          <span className="font-mono font-bold text-green-700 dark:text-green-400">{repairSummary.hiddenCharsRemoved}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-green-100/10 dark:border-green-950/10">
          <span>Broken line wraps</span>
          <span className="font-mono font-bold text-green-700 dark:text-green-400">{repairSummary.brokenLinesRepaired}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-green-100/10 dark:border-green-950/10">
          <span>Extra spaces / tabs</span>
          <span className="font-mono font-bold text-green-700 dark:text-green-400">{repairSummary.spacesNormalized}</span>
        </div>
        <div className="flex justify-between py-1 col-span-2">
          <span>OCR & Unicode fixes applied</span>
          <span className="font-mono font-bold text-green-700 dark:text-green-400">{(repairSummary.ocrRepaired || 0) + (repairSummary.unicodeNormalized || 0)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[10px] text-green-600 dark:text-green-400 font-bold tracking-wider uppercase bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full border border-green-100/20">
          No server routing (Local)
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-white dark:text-gray-950 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-gray-850 dark:hover:bg-gray-100 transition duration-150 cursor-pointer"
          id="btn-summary-copy"
        >
          <Clipboard className="h-3.5 w-3.5" />
          <span>Copy Clean text</span>
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-green-100/10 dark:border-green-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
          Was this repair helpful?
        </span>
        {feedbackSubmitted ? (
          <span className="text-[11px] text-green-600 dark:text-green-400 font-bold animate-fade-in">
            Thanks! We logged your anonymous vote. ❤️
          </span>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleVote(true)}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-300 transition cursor-pointer flex items-center gap-1"
            >
              👍 Yes
            </button>
            <button
              onClick={() => handleVote(false)}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 transition cursor-pointer flex items-center gap-1"
            >
              👎 No
            </button>
          </div>
        )}
      </div>

    </motion.div>
  );
}
