import { useState, useEffect, useCallback } from "react";
import { ChangelogItem } from "../types/changelog";
import { changelogService } from "../services/changelogService";

const DEFAULT_CHANGELOG_ITEMS: ChangelogItem[] = [
  {
    id: "changelog-1",
    version: "1.0.5",
    title: "SEO Canonical Domains & Metadata Upgrade",
    description: "Upgraded XML sitemaps, robots structures, JSON-LD schemas, and canonical tags to fully align with our production domain: textcase.in.\n\nKey enhancements:\n• Configured global canonical metadata tagging targeting textcase.in.\n• Injected complete multi-tier JSON-LD schema (Organization, WebPage, SoftwareApplication).\n• Created fully dynamic interactive robots.txt and sitemap.xml source preview pages.",
    release_date: "2026-07-13",
    created_at: "2026-07-13T00:00:00.000Z"
  },
  {
    id: "changelog-2",
    version: "1.0.2",
    title: "Unicode Invisible Character Scanning",
    description: "Introduced advanced inspection modules highlighting exactly how many hidden Unicode characters, byte marks, and control symbols are breaking your pastes.\n\nKey enhancements:\n• Visual problem report detailing exact occurrences of Zero Width Spaces (ZWSP), Byte Order Marks (BOM), and Non-Breaking Spaces (NBSP).\n• One-click safe purging of layout-disrupting bytes without losing standard spacing.\n• High contrast highlights showing warning states on broken line elements.",
    release_date: "2026-07-08",
    created_at: "2026-07-08T00:00:00.000Z"
  },
  {
    id: "changelog-3",
    version: "1.0.0",
    title: "Production Release: Smart Text Repair Tool",
    description: "Initial launch of TextCase, an offline-first browser utility designed to parse, analyze, and repair text copied from PDFs, OCR engines, and AI chat sessions.\n\nKey enhancements:\n• Core sentence splicing model merging broken line wraps and resolving visual text layout fractures.\n• Intelligent hyphenation merging (joins split-words like 'inter-pretation' back to 'interpretation').\n• ChatGPT formatting washer (converts raw bold asterisks, hashes, backticks, and lists into polished prose).\n• 100% local, client-side, privacy-first processing (text never leaves the local browser context).",
    release_date: "2026-07-01",
    created_at: "2026-07-01T00:00:00.000Z"
  }
];

export function useChangelog() {
  const [changelogItems, setChangelogItems] = useState<ChangelogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChangelog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await changelogService.getAll();
      if (data && data.length > 0) {
        setChangelogItems(data);
      } else {
        setChangelogItems(DEFAULT_CHANGELOG_ITEMS);
      }
    } catch (err: any) {
      console.warn("Could not load changelog from database, using static defaults. Error:", err.message);
      setChangelogItems(DEFAULT_CHANGELOG_ITEMS);
    } finally {
      setLoading(false);
    }
  }, []);

  const addChangelogItem = async (item: Omit<ChangelogItem, "id" | "created_at">) => {
    try {
      const newItem = await changelogService.create(item);
      setChangelogItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err: any) {
      console.error("Failed to add changelog item:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchChangelog();
  }, [fetchChangelog]);

  return {
    changelogItems,
    loading,
    error,
    refresh: fetchChangelog,
    addChangelogItem,
  };
}
