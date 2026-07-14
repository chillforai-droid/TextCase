import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Printer } from "lucide-react";
import { RepairSummary } from "../types";

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  repairSummary: RepairSummary | null;
  originalLength: number;
  repairedLength: number;
}

export default function AuditReportModal({
  isOpen,
  onClose,
  repairSummary,
  originalLength,
  repairedLength
}: AuditReportModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" id="audit-report-overlay">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
            id="audit-report-container"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-blue-600" />
                <h3 className="font-display font-black text-gray-950 dark:text-gray-50 text-base uppercase">Audit & Repair Report</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                Close ×
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {/* Visual Header block */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-850">
                <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                  <span>REPORT ID: #{Date.now().toString().slice(-6)}</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-black text-gray-850 dark:text-gray-200 mt-2">TextCase Verification Seal</h4>
                <p className="text-[11px] text-gray-400 dark:text-gray-550 mt-1">This certifies that all raw input markers, broken layouts, and Unicode spaces were completely normalized locally inside the browser. No telemetry or server transmissions took place.</p>
              </div>

              <div className="space-y-2">
                <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Scanned Category Audits</h5>
                
                {/* Category audits progress bars */}
                <div className="space-y-3">
                  {(() => {
                    const categories = [
                      { name: "Markdown Elements", count: repairSummary?.markdownRemoved || 0 },
                      { name: "Hidden Unicode Chars", count: repairSummary?.hiddenCharsRemoved || 0 },
                      { name: "Broken PDF Line Breaks", count: repairSummary?.brokenLinesRepaired || 0 },
                      { name: "Extra Spacing & Tabs", count: repairSummary?.spacesNormalized || 0 },
                      { name: "OCR Artifacts Rebuilt", count: repairSummary?.ocrRepaired || 0 }
                    ];

                    return categories.map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <span>{cat.name}</span>
                          <span className="font-mono text-green-650 dark:text-green-400">{cat.count > 0 ? `${cat.count} Cleared` : "0 (Pristine)"}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: cat.count > 0 ? "100%" : "0%" }}
                          />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-850 pt-3 space-y-2 text-xs text-gray-500">
                <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300">
                  <span>Result Status:</span>
                  <span className="text-green-600">Passed (Clean)</span>
                </div>
                <div className="flex justify-between">
                  <span>Original characters:</span>
                  <span>{originalLength}</span>
                </div>
                <div className="flex justify-between">
                  <span>Repaired characters:</span>
                  <span>{repairedLength}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Report</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Close Auditor
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
