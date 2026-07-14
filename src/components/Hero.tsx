import { LandingPage } from "../types";

interface HeroProps {
  page: LandingPage;
}

export default function Hero({ page }: HeroProps) {
  if (!page) return null;

  return (
    <div className="mx-auto max-w-4xl text-center mt-2 sm:mt-4 mb-8" id="hero-section">
      <h1 className="font-display text-3xl font-black tracking-tight text-gray-900 dark:text-gray-5 sm:text-5xl leading-tight animate-fade-in">
        {page.h1}
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
        {page.subtitle}
      </p>
    </div>
  );
}
