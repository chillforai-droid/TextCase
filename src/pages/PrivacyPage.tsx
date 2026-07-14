import { motion } from "motion/react";

export default function PrivacyPage() {
  return (
    <motion.div
      key="privacy-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="privacy-content">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-gray-5 tracking-tight mb-6">
          Privacy Policy
        </h1>
        <div className="space-y-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          <p className="font-bold text-gray-800 dark:text-gray-250">Last updated: July 10, 2026</p>
          <p>
            At TextCase, we care deeply about privacy. In fact, we built this tool with a **Privacy First** paradigm.
          </p>
          <p className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 font-semibold">
            We do not collect, store, transmit, or monitor any text you paste into our application. All scanning, character analyses, and repairs run 100% inside your web browser using local client-side JavaScript.
          </p>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-55 text-lg pt-4">1. Data Storage</h3>
          <p>
            Your pasted content resides in standard volatile browser memory (RAM) while you edit and analyze. Once you refresh your browser, close the browser window, or clear the editor, your text is completely destroyed. It is never persisted on any server database.
          </p>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-55 text-lg pt-4">2. Cookies & Trackers</h3>
          <p>
            TextCase does not use tracking cookies, behavioral pixel trackers, or advertising trackers. We maintain a pure utility architecture.
          </p>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-55 text-lg pt-4">3. Local Security</h3>
          <p>
            Because processing occurs completely on your machine, your text is as secure as your computer itself. This makes TextCase highly appropriate for editing sensitive legal agreements, personal communications, or health records.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
