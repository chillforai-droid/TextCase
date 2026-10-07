import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Copy, Loader2, Search, Sparkles, WandSparkles } from "lucide-react";
import type { PromptCategory, PromptItem } from "../types";
import {
  getPublishedPrompt,
  getPublishedPromptCategories,
  getPublishedPromptCategory,
  getPublishedPromptsByCategory,
} from "../services/promptStoreService";

const BASE_URL = "https://www.textcase.in";

function setPromptSEO(title: string, description: string, canonical: string, type: "website" | "article" = "website") {
  document.title = title;
  const setMeta = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  setMeta("description", description);
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.rel = "canonical";
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.href = canonical;

  const id = "textcase-prompt-store-jsonld";
  document.getElementById(id)?.remove();
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "CollectionPage",
    name: title,
    description,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "TextCase", url: BASE_URL },
  });
  document.head.appendChild(script);
}

function StoreHeader({ count }: { count?: number }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-5 py-10 dark:border-blue-900/40 dark:from-blue-950/30 dark:via-gray-950 dark:to-indigo-950/30 sm:px-10">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-gray-900/80 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" /> Prompt Store
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          AI Prompts for Real-World Tasks
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          Discover practical prompts organized by category. Copy a prompt, adapt it to your task, and keep the useful ones in your own workflow.
        </p>
        {typeof count === "number" && count > 0 && (
          <p className="mt-4 text-sm font-semibold text-gray-500 dark:text-gray-400">{count} published categories available</p>
        )}
      </div>
    </section>
  );
}

function LoadingState() {
  return <div className="flex min-h-[260px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-blue-600" /></div>;
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
      <p className="font-bold">Prompt Store data is not available yet.</p>
      <p className="mt-1 opacity-80">{message}</p>
    </div>
  );
}

function CopyPromptButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy Prompt"}
    </button>
  );
}

function PromptCard({ prompt, categorySlug }: { prompt: PromptItem; categorySlug: string }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex-1">
        <h2 className="text-lg font-extrabold text-gray-950 dark:text-white">{prompt.title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{prompt.short_description}</p>
        {prompt.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {prompt.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{tag}</span>)}
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <Link to={`/prompt-store/${categorySlug}/${prompt.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
          View prompt <ArrowRight className="h-4 w-4" />
        </Link>
        <CopyPromptButton prompt={prompt.prompt_text} />
      </div>
    </article>
  );
}

function StoreHome() {
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPromptSEO(
      "Prompt Store – AI Prompts by Category | TextCase",
      "Browse practical AI prompts organized by category. Find, copy and use prompts for writing, marketing, coding, SEO, research and everyday tasks.",
      `${BASE_URL}/prompt-store`
    );
    getPublishedPromptCategories()
      .then(setCategories)
      .catch((err) => setError(err?.message || "Create and publish categories in the Prompt Store database to populate this page."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => categories.filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(search.toLowerCase())), [categories, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <StoreHeader count={categories.length} />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-2xl font-black text-gray-950 dark:text-white">Browse Prompt Categories</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Each category can have its own focused prompt collection.</p></div>
        {categories.length > 0 && <label className="relative block sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories" className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white" /></label>}
      </div>
      {loading ? <LoadingState /> : error ? <div className="mt-6"><ErrorState message={error} /></div> : filtered.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">No published categories yet. The standalone Prompt Admin can add them later.</div> : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((category) => <Link key={category.id} to={`/prompt-store/${category.slug}`} className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"><WandSparkles className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-extrabold text-gray-950 dark:text-white">{category.name}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{category.description}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400">Browse prompts <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
          </Link>)}
        </div>
      )}
      <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/60">
        <h2 className="text-xl font-extrabold text-gray-950 dark:text-white">How the Prompt Store works</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {[["Choose a category", "Find prompts grouped around one clear task or use case."], ["Open a prompt", "Read the purpose, tags and full prompt before using it."], ["Copy and adapt", "Copy the prompt and customize it for your own workflow."]].map(([title, text]) => <div key={title}><h3 className="font-bold text-gray-900 dark:text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p></div>)}
        </div>
      </section>
    </div>
  );
}

function CategoryPage({ categorySlug }: { categorySlug: string }) {
  const [category, setCategory] = useState<PromptCategory | null>(null);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublishedPromptCategory(categorySlug)
      .then(async (c) => {
        setCategory(c);
        if (c) setPrompts(await getPublishedPromptsByCategory(c.id));
      })
      .catch((err) => setError(err?.message || "Unable to load this prompt category."))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  useEffect(() => {
    if (!category) return;
    setPromptSEO(category.seo_title || `${category.name} Prompts – AI Prompt Collection | TextCase`, category.seo_description || category.description, `${BASE_URL}/prompt-store/${category.slug}`);
  }, [category]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10"><LoadingState /></div>;
  if (error) return <div className="mx-auto max-w-7xl px-4 py-10"><ErrorState message={error} /></div>;
  if (!category) return <div className="mx-auto max-w-7xl px-4 py-10"><ErrorState message="This prompt category is not published or does not exist." /></div>;

  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Link to="/prompt-store" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400"><ArrowLeft className="h-4 w-4" /> All categories</Link>
    <header className="mt-6 max-w-3xl"><p className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Prompt Category</p><h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">{category.name} Prompts</h1><p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">{category.description}</p></header>
    <div className="mt-8 flex items-center justify-between"><h2 className="text-2xl font-black text-gray-950 dark:text-white">Prompts in {category.name}</h2><span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{prompts.length} published</span></div>
    {prompts.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">No published prompts in this category yet.</div> : <div className="mt-5 grid gap-5 md:grid-cols-2">{prompts.map((p) => <PromptCard key={p.id} prompt={p} categorySlug={category.slug} />)}</div>}
  </div>;
}

function PromptDetailPage({ categorySlug, promptSlug }: { categorySlug: string; promptSlug: string }) {
  const [prompt, setPrompt] = useState<PromptItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getPublishedPrompt(promptSlug).then(setPrompt).catch((err) => setError(err?.message || "Unable to load this prompt.")).finally(() => setLoading(false));
  }, [promptSlug]);
  useEffect(() => {
    if (!prompt) return;
    const categoryName = prompt.category?.name || "AI";
    setPromptSEO(`${prompt.title} – ${categoryName} Prompt | TextCase`, prompt.short_description, `${BASE_URL}/prompt-store/${categorySlug}/${prompt.slug}`, "article");
  }, [prompt, categorySlug]);
  if (loading) return <div className="mx-auto max-w-4xl px-4 py-10"><LoadingState /></div>;
  if (error || !prompt) return <div className="mx-auto max-w-4xl px-4 py-10"><ErrorState message={error || "This prompt is not published or does not exist."} /></div>;
  return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
    <Link to={`/prompt-store/${categorySlug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400"><ArrowLeft className="h-4 w-4" /> Back to category</Link>
    <article className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-10">
      <p className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">{prompt.category?.name || "Prompt"}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">{prompt.title}</h1>
      <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">{prompt.short_description}</p>
      {prompt.tags?.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{prompt.tags.map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{tag}</span>)}</div>}
      {prompt.use_case && <section className="mt-8"><h2 className="text-lg font-extrabold text-gray-950 dark:text-white">Best use case</h2><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{prompt.use_case}</p></section>}
      <section className="mt-8"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-extrabold text-gray-950 dark:text-white">Prompt</h2><CopyPromptButton prompt={prompt.prompt_text} /></div><pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-7 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">{prompt.prompt_text}</pre></section>
    </article>
  </div>;
}

export default function PromptStorePage() {
  const params = useParams();
  const categorySlug = params.categorySlug;
  const promptSlug = params.promptSlug;
  if (categorySlug && promptSlug) return <PromptDetailPage categorySlug={categorySlug} promptSlug={promptSlug} />;
  if (categorySlug) return <CategoryPage categorySlug={categorySlug} />;
  return <StoreHome />;
}
