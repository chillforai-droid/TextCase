import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { BLOG_ARTICLES } from "../content/blog";

export default function BlogSection() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const selectedArticle = slug
    ? (BLOG_ARTICLES.find((a) => a.slug === slug || a.id === slug) || null)
    : null;

  const handleReadArticle = (article: typeof BLOG_ARTICLES[0]) => {
    navigate(`/blog/${article.slug || article.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHub = () => {
    navigate(`/blog`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {!selectedArticle ? (
          <motion.div
            key="blog-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50/80 dark:bg-blue-950/30 dark:text-blue-400 px-3 py-1 rounded-full">
                Educational Guides
              </span>
              <h1 className="font-display text-4xl font-extrabold text-gray-900 dark:text-gray-50 mt-4 tracking-tight sm:text-5xl">
                TextCase Knowledge Hub
              </h1>
              <p className="text-base text-gray-400 dark:text-gray-500 mt-4 leading-relaxed">
                Understand formatting bugs, OCR scan fixes, invisible characters, and clipboard hacks with our deep-dive manuals.
              </p>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-grid">
              {BLOG_ARTICLES.map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md hover:border-gray-200/80 dark:hover:border-gray-800 transition duration-300"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-3">
                    <span className="text-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:text-blue-400 px-2 py-0.5 rounded font-bold">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h2 className="font-display font-bold text-gray-950 dark:text-gray-50 text-base leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition">
                    <button
                      onClick={() => handleReadArticle(article)}
                      className="text-left font-bold cursor-pointer"
                    >
                      {article.title}
                    </button>
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2.5 flex-grow line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-850/60 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gray-450">{article.readTime}</span>
                    <button
                      onClick={() => handleReadArticle(article)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Read Post <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="blog-post"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-3xl"
          >
            <button
              onClick={handleBackToHub}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Knowledge Hub
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500 mb-4">
              <span className="text-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:text-blue-400 px-2 py-0.5 rounded font-bold">
                {selectedArticle.category}
              </span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <h1 className="font-display text-3xl font-extrabold text-gray-950 dark:text-gray-50 sm:text-4xl tracking-tight leading-tight">
              {selectedArticle.title}
            </h1>

            <div className="mt-8 border-t border-gray-100 dark:border-gray-850 pt-8 text-sm sm:text-base text-gray-600 dark:text-gray-300 space-y-6 leading-relaxed whitespace-pre-wrap font-sans">
              {selectedArticle.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
