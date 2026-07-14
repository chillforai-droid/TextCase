import { useState } from "react";
import { Columns } from "lucide-react";

interface CompareProps {
  originalText: string;
  inputText: string;
  setActiveTab: (tab: "edit" | "compare") => void;
}

export default function Compare({ originalText, inputText, setActiveTab }: CompareProps) {
  const [compareMode, setCompareMode] = useState<"side" | "unified">("side");

  // Difference calculator for Visual diff rendering
  const getLineDiffs = (orig: string, rep: string) => {
    const origLines = orig.split("\n");
    const repLines = rep.split("\n");
    const diffs: { type: "equal" | "added" | "removed"; text: string }[] = [];

    let i = 0;
    let j = 0;
    while (i < origLines.length || j < repLines.length) {
      if (i < origLines.length && j < repLines.length) {
        if (origLines[i] === repLines[j]) {
          diffs.push({ type: "equal", text: origLines[i] });
          i++;
          j++;
        } else {
          // Lookahead matching block up to 4 lines
          let found = false;
          for (let look = 1; look <= 4; look++) {
            if (i + look < origLines.length && origLines[i + look] === repLines[j]) {
              for (let k = 0; k < look; k++) {
                diffs.push({ type: "removed", text: origLines[i + k] });
              }
              i += look;
              found = true;
              break;
            }
            if (j + look < repLines.length && origLines[i] === repLines[j + look]) {
              for (let k = 0; k < look; k++) {
                diffs.push({ type: "added", text: repLines[j + k] });
              }
              j += look;
              found = true;
              break;
            }
          }
          if (!found) {
            diffs.push({ type: "removed", text: origLines[i] });
            diffs.push({ type: "added", text: repLines[j] });
            i++;
            j++;
          }
        }
      } else if (i < origLines.length) {
        diffs.push({ type: "removed", text: origLines[i] });
        i++;
      } else if (j < repLines.length) {
        diffs.push({ type: "added", text: repLines[j] });
        j++;
      }
    }
    return diffs;
  };

  return (
    <div className="flex flex-col flex-grow" id="compare-view">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
        <div className="flex items-center gap-2">
          <Columns className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Before vs After Comparisons</span>
        </div>
        
        {/* Toggle Sub-modes */}
        <div className="flex gap-1 bg-gray-50 dark:bg-gray-950 p-1 rounded-lg">
          <button
            onClick={() => setCompareMode("side")}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
              compareMode === "side"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-gray-500"
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setCompareMode("unified")}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
              compareMode === "unified"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-gray-500"
            }`}
          >
            Unified Diff
          </button>
        </div>
      </div>

      {/* Side-by-Side View */}
      {compareMode === "side" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-[380px] max-h-[500px] overflow-hidden">
          {/* Left: Original */}
          <div className="flex flex-col border border-red-100 dark:border-red-950/40 rounded-xl bg-red-50/10 dark:bg-red-950/5">
            <div className="flex items-center justify-between px-3 py-2 border-b border-red-100 dark:border-red-950/40 bg-red-50/30 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-black">
              <span>ORIGINAL SOURCE</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-red-100 dark:bg-red-950 text-red-800 rounded font-bold uppercase">Before</span>
            </div>
            <div className="p-3 text-xs font-mono overflow-y-auto flex-grow max-h-[440px] whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-400">
              {originalText.split("\n").map((line, idx) => {
                const hasChange = line !== inputText.split("\n")[idx];
                return (
                  <div
                    key={idx}
                    className={hasChange ? "bg-red-100/50 dark:bg-red-950/30 text-red-900 dark:text-red-300 line-through px-1 rounded-sm" : "px-1"}
                  >
                    {line || " "}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Repaired */}
          <div className="flex flex-col border border-green-100 dark:border-green-950/40 rounded-xl bg-green-50/10 dark:bg-green-950/5">
            <div className="flex items-center justify-between px-3 py-2 border-b border-green-100 dark:border-green-950/40 bg-green-50/30 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs font-black">
              <span>REPAIRED TEXT</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-green-100 dark:bg-green-950 text-green-800 rounded font-bold uppercase">Clean</span>
            </div>
            <div className="p-3 text-xs font-mono overflow-y-auto flex-grow max-h-[440px] whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
              {inputText.split("\n").map((line, idx) => {
                const hasChange = line !== originalText.split("\n")[idx];
                return (
                  <div
                    key={idx}
                    className={hasChange ? "bg-green-100/50 dark:bg-green-950/30 text-green-900 dark:text-green-300 font-medium px-1 rounded-sm" : "px-1"}
                  >
                    {line || " "}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Unified Interleaved Diff */
        <div className="flex flex-col border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-950/50 flex-grow min-h-[380px] max-h-[500px]">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-500">
            COMBINED COMPARISON LINE DIFFS (- Deleted, + Added)
          </div>
          <div className="p-4 text-xs font-mono overflow-y-auto flex-grow max-h-[450px] space-y-0.5 leading-relaxed">
            {getLineDiffs(originalText, inputText).map((line, idx) => {
              if (line.type === "removed") {
                return (
                  <div key={idx} className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-sm line-through flex items-start gap-1">
                    <span className="text-red-400 font-bold select-none">-</span>
                    <span>{line.text}</span>
                  </div>
                );
              } else if (line.type === "added") {
                return (
                  <div key={idx} className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-sm flex items-start gap-1 font-bold">
                    <span className="text-green-400 font-bold select-none">+</span>
                    <span>{line.text}</span>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="text-gray-500 px-2 py-0.5 flex items-start gap-1">
                    <span className="opacity-30 select-none"> </span>
                    <span>{line.text}</span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400">
        <span>Double-click or toggle to "Editor" page above to make active edits on current text.</span>
        <button
          onClick={() => setActiveTab("edit")}
          className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
        >
          Open Editor View
        </button>
      </div>
    </div>
  );
}
