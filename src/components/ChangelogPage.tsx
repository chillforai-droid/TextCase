import React from "react";
import { ListRestart, Milestone, Calendar, ArrowUpRight, CheckCircle } from "lucide-react";
import { useChangelog } from "../hooks/useChangelog";

export default function ChangelogPage() {
  const { changelogItems, loading, error } = useChangelog();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
          <ListRestart className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-950 dark:text-gray-5 sm:text-4xl tracking-tight">
          System Changelog
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Stay updated with core replacement engine tuning, library integrations,
          and interface polishing releases. All changes are deployed client-side instantly.
        </p>
      </div>

      {loading ? (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
          {[1, 2, 3].map((n) => (
            <div key={n} className="relative flex flex-col sm:flex-row items-start sm:justify-between animate-pulse">
              <div className="w-full sm:w-[45%] h-24 bg-gray-100/60 dark:bg-gray-900/40 border border-gray-200/20 rounded-2xl" />
              <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-gray-950 z-10" />
              <div className="w-full sm:w-[45%] mt-4 sm:mt-0 h-10 bg-gray-100/60 dark:bg-gray-900/40 border border-gray-200/20 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto p-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 text-sm">
          Failed to fetch dynamic changelog from Supabase. Live updates will resume once configured.
        </div>
      ) : changelogItems.length === 0 ? (
        <div className="max-w-md mx-auto p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <Milestone className="h-8 w-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No releases posted yet</h3>
          <p className="text-xs text-gray-400 mt-1">Check back soon for system version releases!</p>
        </div>
      ) : (
        <div className="relative border-l border-gray-200 dark:border-gray-800 pl-6 sm:pl-8 ml-4 space-y-12 max-w-3xl mx-auto">
          {changelogItems.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Timeline marker node */}
              <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-2 border-gray-50 dark:border-gray-950 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-200 shadow-sm z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 group-hover:bg-white" />
              </span>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm hover:border-gray-255 dark:hover:border-gray-800 transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100/40 dark:border-blue-900/10 px-3 py-1 rounded-xl font-mono shadow-inner">
                      v{item.version}
                    </span>
                    <h3 className="font-display font-bold text-gray-950 dark:text-gray-50 text-base">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5 opacity-60" />
                    <span>{new Date(item.release_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-550 dark:text-gray-350 leading-relaxed whitespace-pre-wrap pl-1">
                  {item.description}
                </div>

                {/* Aesthetic bottom bar */}
                <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800/40 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                    <CheckCircle className="h-3.5 w-3.5" /> Deployed Client-Side
                  </span>
                  <span>ID: {item.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
