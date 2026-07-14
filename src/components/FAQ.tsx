import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { FAQ_DATA } from "../content/faq";

export default function FAQ() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl mt-24 mb-16" id="faq-section">
      <div className="text-center mb-10">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 mb-4">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-gray-900 dark:text-gray-50 sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Everything you need to know about our in-browser repair engines.
        </p>
      </div>

      <div className="space-y-3" id="faq-list">
        {FAQ_DATA.map((faq, index) => {
          const isExpanded = expandedFaq === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200"
            >
              <button
                onClick={() => setExpandedFaq(isExpanded ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left focus:outline-none cursor-pointer"
                id={`faq-btn-${index}`}
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-850">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
