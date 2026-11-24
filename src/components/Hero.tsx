import { Bot, Mic } from "lucide-react";
import { LandingPage } from "../types";

interface HeroProps {
  page: LandingPage;
  onOpenAgent?: () => void;
  onStartVoice?: () => void;
}

export default function Hero({ page, onOpenAgent, onStartVoice }: HeroProps) {
  if (!page) return null;

  return (
    <div className="mx-auto max-w-4xl text-center mt-2 sm:mt-4 mb-8" id="hero-section">
      <h1 className="font-display text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl leading-tight animate-fade-in">
        {page.h1}
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
        {page.subtitle}
      </p>
      {(onOpenAgent || onStartVoice) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {onOpenAgent && (
            <button
              onClick={onOpenAgent}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 dark:bg-white px-4 py-2.5 text-xs font-bold text-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-200 transition cursor-pointer whitespace-nowrap shrink-0"
              id="hero-open-ai-agent"
            >
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
          )}
          {onStartVoice && (
            <button
              onClick={onStartVoice}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-100 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer whitespace-nowrap shrink-0"
              id="hero-voice-command"
            >
              <Mic className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Voice Command (Hindi / EN)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
