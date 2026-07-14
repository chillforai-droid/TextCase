import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <motion.div
      key="about-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="about-content">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-6">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-950 dark:text-gray-5 block sm:text-4xl tracking-tight">
          About TextCase
        </h1>
        <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
          The clean text repair utility built for developers, writers, editors, and anyone tired of terrible copy-paste layouts.
        </p>

        <div className="mt-8 border-t border-gray-100 dark:border-gray-850 pt-8 space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            TextCase was born out of frustration. When copying passages from PDFs, research papers, ChatGPT windows, or mobile websites, the text invariably breaks. Hard returns appear in weird places, hyphens split single words, and weird invisible characters disrupt compilers and messaging grids.
          </p>
          <p>
            Most online solutions are bloated, require logins, display distracting ads, or worse—send your confidential text to external servers for parsing.
          </p>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-50 text-lg pt-4">Our Technology Principles</h3>
          <ul className="space-y-3 pt-2">
            <li className="flex gap-3">
              <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
              <span><strong>Offline Parsing Engine:</strong> Your data does not travel over wires. Every character replacement takes place locally in your browser memory.</span>
            </li>
            <li className="flex gap-3">
              <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
              <span><strong>High-Performance Regular Expressions:</strong> Fully optimized algorithms handle massive novels, research documents, and bulk strings in milliseconds.</span>
            </li>
            <li className="flex gap-3">
              <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
              <span><strong>No Tracker Bloat:</strong> Pure clean product architecture. No account logs, cookies, or marketing trackers are active.</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
