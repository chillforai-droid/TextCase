import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Map } from "lucide-react";

interface SitemapPageProps {
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

export default function SitemapPage({ triggerToast }: SitemapPageProps) {
  return (
    <motion.div
      key="sitemap-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm" id="sitemap-content">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-6">
          <Map className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-gray-5 tracking-tight">
          Sitemap XML
        </h1>
        <p className="mt-2 text-xs text-gray-400">
          Search engines can crawl our complete clean directory. Here is the visual schema representing `sitemap.xml` for index engines.
        </p>

        <div className="mt-8 border-t border-gray-100 dark:border-gray-850 pt-8">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider text-gray-400 dark:text-gray-500">Interactive Map</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link to="/" className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left">
              Home (Smart Tool)
            </Link>
            <Link to="/blog" className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left">
              Blog (Guides Hub)
            </Link>
            <Link to="/about" className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left">
              About Page
            </Link>
            <Link to="/contact" className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left">
              Contact Form
            </Link>
            <Link to="/privacy" className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left">
              Privacy Policy
            </Link>
            <Link to="/terms" className="p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-850 text-left">
              Terms of Service
            </Link>
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3 uppercase tracking-wider text-gray-400 dark:text-gray-550">Raw Sitemap Source</h3>
          <div className="relative rounded-xl bg-gray-950 p-4 font-mono text-[11px] text-gray-300 border border-gray-800 overflow-x-auto">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://textcase.in/</loc><priority>1.0</priority></url>\n  <url><loc>https://textcase.in/blog</loc><priority>0.8</priority></url>\n  <url><loc>https://textcase.in/about</loc><priority>0.5</priority></url>\n  <url><loc>https://textcase.in/contact</loc><priority>0.5</priority></url>\n</urlset>`);
                triggerToast("Raw Sitemap XML copied!", "success");
              }}
              className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white rounded px-2 py-1 text-[10px] cursor-pointer"
            >
              Copy XML
            </button>
            <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://textcase.in/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://textcase.in/blog</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://textcase.in/about</loc>
    <lastmod>2026-07-13</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://textcase.in/contact</loc>
    <lastmod>2026-07-13</lastmod>
    <priority>0.5</priority>
  </url>
</urlset>`}</pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
