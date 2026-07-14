import React, { useState } from "react";
import { Compass, Calendar, ArrowRight, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { useRoadmap } from "../hooks/useRoadmap";
import { RoadmapItem } from "../types/roadmap";

export default function RoadmapPage() {
  const { roadmapItems, loading, error } = useRoadmap();
  const [activeFilter, setActiveFilter] = useState<"all" | "planned" | "in-progress" | "completed">("all");

  const statusColors = {
    planned: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/30",
      icon: <Compass className="h-4 w-4" />
    },
    "in-progress": {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/30",
      icon: <Clock className="h-4 w-4 animate-spin-slow" />
    },
    completed: {
      bg: "bg-green-50 dark:bg-green-950/20",
      text: "text-green-700 dark:text-green-400",
      border: "border-green-100 dark:border-green-900/30",
      icon: <CheckCircle2 className="h-4 w-4" />
    }
  };

  const filteredItems = roadmapItems.filter(item => {
    if (activeFilter === "all") return true;
    return item.status === activeFilter;
  });

  // Group items for Column View (when "all" filter is active)
  const columns: { status: "planned" | "in-progress" | "completed"; title: string; subtitle: string }[] = [
    { status: "planned", title: "Planned", subtitle: "Future ideas & features under consideration" },
    { status: "in-progress", title: "In Progress", subtitle: "Active development on the core engine" },
    { status: "completed", title: "Completed", subtitle: "Deployed features & enhancements" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
          <Calendar className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-950 dark:text-gray-5 sm:text-4xl tracking-tight">
          Product Roadmap
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          See what we are building, what is planned next, and what has been successfully completed. 
          Our focus is to maintain a privacy-first, lightning-fast text formatting workspace.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
          {(["all", "planned", "in-progress", "completed"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                activeFilter === filter
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-750 dark:hover:text-gray-350 cursor-pointer"
              }`}
            >
              {filter.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-3">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-100/75 dark:bg-gray-900/60 rounded-2xl animate-pulse" />
              <div className="h-28 bg-gray-100/75 dark:bg-gray-900/60 rounded-2xl animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto p-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 text-sm">
          Failed to load dynamic roadmap from Supabase. Review setup configurations or check database connectivity.
        </div>
      ) : roadmapItems.length === 0 ? (
        <div className="max-w-md mx-auto p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <Calendar className="h-8 w-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Roadmap is empty</h3>
          <p className="text-xs text-gray-400 mt-1">Please populate the roadmap table via your Supabase dashboard.</p>
        </div>
      ) : activeFilter !== "all" ? (
        // List/Card view for single filter
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredItems.map((item) => {
            const config = statusColors[item.status];
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm hover:border-gray-250 dark:hover:border-gray-800 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${config.bg} ${config.text} ${config.border} border`}>
                    {config.icon}
                    <span className="capitalize">{item.status.replace("-", " ")}</span>
                  </span>
                  {item.version && (
                    <span className="text-[10px] bg-gray-150 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold px-2 py-0.5 rounded-full">
                      v{item.version}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-950 dark:text-gray-50 text-base mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        // Column View (grouped by status)
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {columns.map((col) => {
            const colItems = roadmapItems.filter(item => item.status === col.status);
            const config = statusColors[col.status];
            return (
              <div key={col.status} className="flex flex-col h-full bg-gray-100/40 dark:bg-gray-950/20 border border-gray-200/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-8 w-8 rounded-xl flex items-center justify-center ${config.bg} ${config.text}`}>
                      {config.icon}
                    </span>
                    <h3 className="font-bold text-gray-950 dark:text-gray-50 text-base">
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-xs bg-gray-200/50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 px-2.5 py-0.5 rounded-full font-bold">
                    {colItems.length}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-550 mb-5 leading-relaxed pl-1">
                  {col.subtitle}
                </p>

                {colItems.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-gray-200 dark:border-gray-800/60 rounded-xl">
                    <span className="text-xs text-gray-400">No items categorized in this status</span>
                  </div>
                ) : (
                  <div className="space-y-4 flex-grow">
                    {colItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl p-5 shadow-xs hover:shadow-sm transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] text-gray-400 font-medium">
                            ID: {item.id.slice(0, 6)}
                          </span>
                          {item.version && (
                            <span className="text-[9px] bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100/30 font-bold px-1.5 py-0.5 rounded">
                              v{item.version}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1.5 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
