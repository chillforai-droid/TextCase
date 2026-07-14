import { useState, useRef, useEffect } from "react";
import { ActivePage } from "../types";
import { Sparkles, Menu, X, CheckSquare, Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export default function Navbar({ activePage, setActivePage, theme, setTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems: { label: string; page: ActivePage }[] = [
    { label: "Home", page: "home" },
    { label: "Blog", page: "blog" },
    { label: "Roadmap", page: "roadmap" },
    { label: "Changelog", page: "changelog" },
    { label: "Feedback", page: "feedback" },
    { label: "About", page: "about" },
  ];

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowThemeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getThemeIcon = (t: typeof theme) => {
    switch (t) {
      case "light":
        return <Sun className="h-4 w-4 text-amber-500" />;
      case "dark":
        return <Moon className="h-4 w-4 text-indigo-400" />;
      case "system":
        return <Laptop className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getThemeLabel = (t: typeof theme) => {
    switch (t) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          className="flex items-center gap-2 text-left group focus:outline-none"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:scale-105">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.page || (item.page === "blog" && activePage === "blog-post");
              return (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                  id={`nav-${item.page}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Theme Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-haspopup="true"
              aria-expanded={showThemeDropdown}
              id="theme-select-btn"
            >
              {getThemeIcon(theme)}
              <span>{getThemeLabel(theme)}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {showThemeDropdown && (
              <div className="absolute right-0 mt-1.5 w-36 origin-top-right rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-150">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      setShowThemeDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                      theme === t
                        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getThemeIcon(t)}
                      <span>{getThemeLabel(t)}</span>
                    </div>
                    {theme === t && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Direct Simple Toggle Button on Mobile to cycle themes */}
          <button
            onClick={() => {
              const order: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
              const nextIndex = (order.indexOf(theme) + 1) % order.length;
              setTheme(order[nextIndex]);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400"
            aria-label="Toggle theme"
          >
            {getThemeIcon(theme)}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={isOpen}
            id="mobile-menu-btn"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-1 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive = activePage === item.page || (item.page === "blog" && activePage === "blog-post");
            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`block w-full text-left px-4 py-3 text-base font-semibold rounded-lg transition-all duration-150 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
                id={`mobile-nav-${item.page}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
