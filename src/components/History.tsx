import React from "react";
import { History as HistoryIcon, Trash2, CheckCircle } from "lucide-react";
import { HistoryItem } from "../types";

interface HistoryProps {
  history: HistoryItem[];
  loadHistoryItem: (item: HistoryItem) => void;
  deleteHistoryItem: (id: string, e: React.MouseEvent) => void;
  clearHistory: () => void;
}

export default function History({
  history,
  loadHistoryItem,
  deleteHistoryItem,
  clearHistory
}: HistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-4" id="local-history-card">
      <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-850">
        <div className="flex items-center gap-2">
          <HistoryIcon className="h-4 w-4 text-blue-500" />
          <h3 className="font-display font-black text-gray-900 dark:text-gray-50 text-sm uppercase tracking-wider">Local History</h3>
        </div>
        <button
          onClick={clearHistory}
          className="text-[10px] font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="h-3 w-3" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => loadHistoryItem(item)}
            className="group flex items-center justify-between gap-4 p-2.5 rounded-xl border border-gray-50 dark:border-gray-855 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 hover:border-blue-100 dark:hover:border-blue-900/40 cursor-pointer transition duration-150"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50/50 dark:bg-green-950/30 text-green-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="text-left overflow-hidden">
                <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 block truncate max-w-[180px]">
                  {item.repaired.slice(0, 45) || "Empty file content"}...
                </span>
                <span className="text-[9px] text-gray-400 font-medium block">
                  {item.date} • {item.characters} chars
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[9px] font-bold bg-green-100/70 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-md">
                {item.problemsFixed} Fixed
              </span>
              <button
                onClick={(e) => deleteHistoryItem(item.id, e)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
