import { motion } from "motion/react";
import { Terminal } from "lucide-react";

interface RobotsPageProps {
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

export default function RobotsPage({ triggerToast }: RobotsPageProps) {
  return (
    <motion.div
      key="robots-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="robots-content">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-6">
          <Terminal className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-gray-5 tracking-tight">
          Robots.txt Source
        </h1>
        <p className="mt-2 text-xs text-gray-400">
          Standard directives for search engine crawler agents.
        </p>

        <div className="mt-8 border-t border-gray-100 dark:border-gray-850 pt-8">
          <div className="relative rounded-xl bg-gray-950 p-5 font-mono text-sm text-gray-300 border border-gray-800">
            <button
              onClick={() => {
                navigator.clipboard.writeText("User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://textcase.in/sitemap.xml");
                triggerToast("Robots.txt copied!", "success");
              }}
              className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white rounded px-2 py-1 text-xs cursor-pointer"
            >
              Copy Raw
            </button>
            <pre className="space-y-1">
              <div><span className="text-blue-400"># Directives for index robots</span></div>
              <div>User-agent: *</div>
              <div>Allow: /</div>
              <div>Disallow: /api/</div>
              <br />
              <div><span className="text-blue-400"># Link sitemap location</span></div>
              <div>Sitemap: https://textcase.in/sitemap.xml</div>
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
