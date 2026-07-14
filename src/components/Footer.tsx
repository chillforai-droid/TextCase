import { ActivePage } from "../types";
import { CheckSquare, ShieldCheck, Cpu, ArrowUpRight } from "lucide-react";

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  setCurrentLandingPage?: (page: string) => void;
}

export default function Footer({ setActivePage, setCurrentLandingPage }: FooterProps) {
  const handlePageLink = (page: ActivePage) => {
    if (setCurrentLandingPage && page === "home") {
      setCurrentLandingPage("default");
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLandingPageLink = (key: string) => {
    if (setCurrentLandingPage) {
      setCurrentLandingPage(key);
    }
    setActivePage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand block */}
          <div className="space-y-6 xl:col-span-1">
            <button
              onClick={() => handlePageLink("home")}
              className="flex items-center gap-2 text-left focus:outline-none"
              id="footer-logo"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-gray-50 block leading-none">
                  TextCase
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  Smart Text Fixer
                </span>
              </div>
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
              Automatically detect and repair broken line wraps, PDF copy hyphens,
              ChatGPT markdown leftovers, and invisible Unicode characters instantly.
              100% private, browser-only repair engine.
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/20 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                100% Offline (Privacy First)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                <Cpu className="h-3.5 w-3.5" />
                In-Browser Processing
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Specialty Tools
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <button
                    onClick={() => handleLandingPageLink("default")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium"
                  >
                    Smart Fixer (Default)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLandingPageLink("fix-chatgpt-formatting")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium"
                  >
                    Fix ChatGPT Formatting
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLandingPageLink("fix-pdf-text")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium"
                  >
                    PDF Text Repair
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLandingPageLink("fix-copy-paste")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium"
                  >
                    Copy-Paste Cleaner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLandingPageLink("remove-hidden-unicode")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium"
                  >
                    Remove Hidden Unicode
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <button
                    onClick={() => handlePageLink("home")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-home"
                  >
                    Smart Fixer Tool
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink("blog")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-blog"
                  >
                    How-To Guides
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink("roadmap")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-roadmap"
                  >
                    Product Roadmap
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink("changelog")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-changelog"
                  >
                    System Changelog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink("feedback")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-feedback"
                  >
                    Feedback Board
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink("about")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-about"
                  >
                    About TextCase
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Legal & SEO
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <button
                    onClick={() => handlePageLink("privacy")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-privacy"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink("terms")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-terms"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink("sitemap")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-sitemap"
                  >
                    Sitemap XML
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink("robots")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium"
                    id="footer-link-robots"
                  >
                    Robots.txt
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Supported Formats
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Plain Text
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Markdown
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  PDF Copy
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  OCR
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Unicode
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  HTML
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; 2026 TextCase. Built with precision. All text remains safely on your computer.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handlePageLink("contact")}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white cursor-pointer"
              id="footer-link-contact"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
