import { motion, AnimatePresence } from "motion/react";
import { Info, Sparkles, Zap } from "lucide-react";
import { AnalysisResult, ProblemReport } from "../types";

interface ScannerProps {
  inputText: string;
  analysis: AnalysisResult;
  expandedCard: string | null;
  setExpandedCard: (id: string | null) => void;
  handleFix: () => void;
  handleLoadSample: () => void;
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

export default function Scanner({
  inputText,
  analysis,
  expandedCard,
  setExpandedCard,
  handleFix,
  handleLoadSample,
  triggerToast
}: ScannerProps) {
  // Extract only problem cards, ignoring any non-object properties like healthScore
  const problemCards = Object.entries(analysis)
    .filter(([key, val]) => typeof val === "object" && val !== null && "id" in val)
    .map(([_, val]) => val as ProblemReport);

  const totalProblems = problemCards.reduce((sum, item) => sum + item.count, 0);

  const getHealthScoreDetails = (score: number) => {
    if (score >= 95) {
      return {
        color: "text-green-500 dark:text-green-400 border-green-500/20",
        barColor: "bg-green-500",
        label: "Pristine",
        desc: "No critical formatting issues. Text is clean.",
        bg: "bg-green-500/10"
      };
    }
    if (score >= 80) {
      return {
        color: "text-blue-500 dark:text-blue-400 border-blue-500/20",
        barColor: "bg-blue-500",
        label: "Excellent",
        desc: "Minor formatting imperfections. Recommended to repair.",
        bg: "bg-blue-500/10"
      };
    }
    if (score >= 60) {
      return {
        color: "text-amber-500 dark:text-amber-400 border-amber-500/20",
        barColor: "bg-amber-500",
        label: "Irregular",
        desc: "Noticeable formatting anomalies, tabs or bad line returns detected.",
        bg: "bg-amber-500/10"
      };
    }
    return {
      color: "text-red-500 dark:text-red-400 border-red-500/20",
      barColor: "bg-red-500",
      label: "Needs Repair",
      desc: "Severe PDF margins, spacing or zero-width compile bugs present.",
      bg: "bg-red-500/10"
    };
  };

  const score = analysis.healthScore !== undefined ? analysis.healthScore : 100;
  const scoreMeta = getHealthScoreDetails(score);

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-4" id="realtime-scanner-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${inputText ? "bg-green-500 animate-ping" : "bg-gray-300 dark:bg-gray-700"}`} />
          <h3 className="font-display font-black text-gray-950 dark:text-gray-50 text-base">Real-Time Scanner</h3>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-gray-100 dark:bg-gray-950 text-gray-500 dark:text-gray-400 rounded-full font-bold">
          {inputText ? "Active Scan" : "Empty Input"}
        </span>
      </div>

      {/* Problem summary grid */}
      {!inputText ? (
        <div className="bg-gray-50/50 dark:bg-gray-950/40 rounded-xl p-5 border border-dashed border-gray-200 dark:border-gray-800 text-center">
          <Info className="h-5 w-5 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">No active text to scan</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 mb-4">Paste clipboard or try our pre-packaged sample:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-left max-w-xs mx-auto">
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
              <span className="text-green-500">✔</span> Markdown Markers
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
              <span className="text-green-500">✔</span> Hidden Characters
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
              <span className="text-green-500">✔</span> Broken Lines
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
              <span className="text-green-500">✔</span> OCR Alignments
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Premium Analysis Complete Box */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mb-8 pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
                </span>
                <span className="font-display font-extrabold text-xs uppercase tracking-wider">Analysis Complete</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-white/5">
                Local Privacy Guard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3.5xl font-black tracking-tight">{totalProblems}</span>
                  <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">Anomalies Detected</span>
                </div>

                {/* Health score visual dial */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Document Health</span>
                    <span className="text-xs font-semibold text-white/90 mt-0.5">{scoreMeta.label} • {score}%</span>
                  </div>
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    {/* Ring background */}
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.15)" strokeWidth="3.5" fill="transparent" />
                      <circle cx="20" cy="20" r="16" stroke="#fbbf24" strokeWidth="3.5" fill="transparent"
                        strokeDasharray={100}
                        strokeDashoffset={100 - score}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold font-mono text-white">{score}</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-5 flex flex-col justify-between sm:border-l border-white/10 sm:pl-4 pt-2 sm:pt-0">
                <div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Repair Duration</div>
                  <div className="text-lg font-black tracking-tight mt-0.5 text-yellow-300 flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-300 animate-pulse" />
                    &lt; 5 ms
                  </div>
                </div>

                <button
                  onClick={handleFix}
                  className="w-full mt-3.5 flex items-center justify-center gap-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-950 py-2.5 text-xs font-black shadow transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>⚡ Repair Instantly</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-2 gap-3" id="analysis-grid">
            {problemCards.map((card) => {
              const isClean = card.count === 0;
              const cardColorClass = isClean 
                ? "bg-green-50/75 dark:bg-green-950/10 border-green-100 dark:border-green-950/30" 
                : "bg-amber-50/70 dark:bg-amber-950/10 border-amber-100 dark:border-amber-950/30";

              return (
                <button
                  key={card.id}
                  onClick={() => {
                    if (card.count > 0) {
                      setExpandedCard(expandedCard === card.id ? null : card.id);
                    } else {
                      triggerToast(`${card.name} is completely clean!`, "success");
                    }
                  }}
                  className={`text-left p-3.5 rounded-xl border transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-850 ${
                    card.count > 0 ? "hover:shadow-md cursor-pointer" : "opacity-80"
                  } ${cardColorClass}`}
                  id={`card-${card.id}`}
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block leading-tight">
                      {card.name === "Markdown Found" ? "Markdown & HTML" : card.name === "Hidden Characters Found" ? "Hidden Chars" : card.name}
                    </span>
                    
                    {!isClean ? (
                      <div className="flex flex-col gap-1 my-1">
                        <span className="text-sm font-black text-amber-900 dark:text-amber-450 flex items-center gap-1">
                          <span className="text-amber-500 font-extrabold text-sm">⚠</span>
                          {card.count} Found
                        </span>
                        <span className="inline-flex items-center w-fit text-[9px] font-bold bg-amber-100/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-450 px-1.5 py-0.5 rounded border border-amber-200/50">
                          Needs Repair
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 my-1">
                        <span className="text-sm font-black text-green-900 dark:text-green-450 flex items-center gap-1">
                          <span className="text-green-500 font-extrabold text-sm">✅</span>
                          Clean
                        </span>
                        <span className="inline-flex items-center w-fit text-[9px] font-bold bg-green-100/85 dark:bg-green-950/30 text-green-800 dark:text-green-450 px-1.5 py-0.5 rounded border border-green-200/50">
                          Perfect
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>

                  {!isClean && (
                    <div className="mt-3 pt-2 border-t border-gray-100/50 dark:border-gray-800/50">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                        expandedCard === card.id
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50"
                          : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-blue-600 dark:hover:text-blue-450 hover:border-blue-200 dark:hover:border-blue-900/55 shadow-xs"
                      }`}>
                        {expandedCard === card.id ? "Hide Details ←" : "Show Details →"}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Expand details display */}
      <AnimatePresence>
        {expandedCard && analysis[expandedCard as keyof AnalysisResult] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-850 overflow-hidden"
            id="card-expanded-details"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
              {(analysis[expandedCard as keyof AnalysisResult] as ProblemReport).name} Details
            </h4>
            <ul className="space-y-1.5">
              {(analysis[expandedCard as keyof AnalysisResult] as ProblemReport).details?.map((detail, index) => (
                <li key={index} className="flex items-center gap-2 text-xs text-gray-650 dark:text-gray-350">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{detail}</span>
                </li>
              )) || <li className="text-xs text-gray-400">No raw details loaded.</li>}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
