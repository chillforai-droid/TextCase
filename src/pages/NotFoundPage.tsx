import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full space-y-6"
      >
        {/* Error Graphic */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 mb-2">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-6xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-850 dark:text-gray-200">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
            The link you followed may be broken, or the specialty page has been re-routed. Let's get you back on track!
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Back to Home Tool
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 text-sm font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
