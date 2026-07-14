import React from "react";
import { Sparkles, ArrowRight, ExternalLink, Zap } from "lucide-react";

export default function TexlyPromo() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-violet-200 dark:border-violet-900/50 bg-white dark:bg-gray-900/60 p-6 shadow-md transition duration-300 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-800"
      id="texly-promo-card"
    >
      {/* Background soft glowing accent */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10 pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/10 pointer-events-none" />

      <div className="flex flex-col gap-4">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-55/10 px-2.5 py-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <Sparkles className="h-3 w-3" />
            Recommended Tool
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-gray-400 dark:text-gray-500">
            <Zap className="h-2.5 w-2.5 text-amber-500" /> Fast & Free
          </span>
        </div>

        {/* Brand Title & Headline */}
        <div>
          <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
            Texly Online
            <span className="text-[11px] font-normal px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              v2.0
            </span>
          </h3>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Need beautiful fancy fonts, stylish unicode symbols, and cool text decorators? Experience <strong>Texly</strong>—our ultra-fast premium sister tool built for content creators and messaging enthusiasts.
          </p>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5">
          {["Fancy Font Generator", "Unicode Symbols", "Cool Nicknames", "Text Art"].map((tag, idx) => (
            <span
              key={idx}
              className="rounded-lg bg-gray-55/60 dark:bg-gray-800/40 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link Box */}
        <div className="mt-2">
          <a
            href="https://texlyonline.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 p-3.5 text-center text-sm font-bold text-white shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all duration-200 cursor-pointer"
            id="texly-promo-cta-btn"
          >
            <span className="flex items-center gap-2">
              Use Texly Online Now
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-white/15 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
