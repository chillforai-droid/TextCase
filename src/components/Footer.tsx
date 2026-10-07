import { ActivePage } from "../types";
import { CheckSquare, ShieldCheck, Cpu, ArrowUpRight } from "lucide-react";

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  setCurrentLandingPage?: (page: string) => void;
}

export default function Footer({ setActivePage, setCurrentLandingPage }: FooterProps) {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand block */}
          <div className="space-y-6 xl:col-span-1">
            <a
              href="/"
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
            </a>
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
                  <a href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium">Smart Fixer (Default)</a>
                </li>
                <li>
                  <a href="/fix-chatgpt-formatting" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium">Fix ChatGPT Formatting</a>
                </li>
                <li>
                  <a href="/fix-pdf-text" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium">PDF Text Repair</a>
                </li>
                <li>
                  <a href="/fix-copy-paste-text" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium">Copy-Paste Cleaner</a>
                </li>
                <li>
                  <a href="/remove-hidden-unicode" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none text-left cursor-pointer font-medium">Remove Hidden Unicode</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-home">Smart Fixer Tool</a>
                </li>
                <li>
                  <a href="/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-blog">How-To Guides</a>
                </li>
                <li>
                  <a href="/prompt-store" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-prompt-store">Prompt Store</a>
                </li>
                <li>
                  <a href="/roadmap" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-roadmap">Product Roadmap</a>
                </li>
                <li>
                  <a href="/changelog" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-changelog">System Changelog</a>
                </li>
                <li>
                  <a href="/feedback" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-feedback">Feedback Board</a>
                </li>
                <li>
                  <a href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-about">About TextCase</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Legal & SEO
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-terms">Terms of Service</a>
                </li>
                <li>
                  <a href="/sitemap" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-sitemap">Sitemap XML</a>
                </li>
                <li>
                  <a href="/robots" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white focus:outline-none cursor-pointer font-medium" id="footer-link-robots">Robots.txt</a>
                </li>
                <li>
                  <a
                    href="https://www.voiceid.online/?utm_source=textcase&utm_medium=referral&utm_campaign=voiceid_promotion&utm_content=footer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white font-medium"
                    id="footer-link-voiceid"
                  >
                    VoiceID <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
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
            <a href="/contact" className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white cursor-pointer" id="footer-link-contact">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
