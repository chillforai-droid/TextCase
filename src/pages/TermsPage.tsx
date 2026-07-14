import { motion } from "motion/react";

export default function TermsPage() {
  return (
    <motion.div
      key="terms-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="terms-content">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-gray-5 tracking-tight mb-6">
          Terms of Service
        </h1>
        <div className="space-y-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          <p className="font-bold text-gray-800 dark:text-gray-250">Effective Date: July 10, 2026</p>
          <p>
            Welcome to TextCase – Smart Text Fixer. By using our application, you agree to these Terms of Service.
          </p>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-55 text-lg pt-4">1. Acceptable Use</h3>
          <p>
            You are free to use TextCase for personal, commercial, academic, or professional projects. There are no character limits, pricing paywalls, or usage caps on the application.
          </p>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-55 text-lg pt-4">2. Disclaimer of Warranty</h3>
          <p>
            The service is provided "as is" and "as available". We make no warranties of any kind regarding accuracy, security, completeness, or reliability of repaired text output. Always verify important documents manually.
          </p>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-gray-55 text-lg pt-4">3. System Integrity</h3>
          <p>
            You agree not to attempt to disrupt the performance of our application or overload our hosted bundle assets.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
