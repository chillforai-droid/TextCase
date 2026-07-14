import { useState, useEffect, useCallback } from "react";
import { RoadmapItem } from "../types/roadmap";
import { roadmapService } from "../services/roadmapService";

const DEFAULT_ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "default-1",
    title: "In-Browser Fast Text Repair Engine",
    description: "Instant single-click repair of broken line wraps, smart quotes, paragraph splits, and PDF word hyphenations.",
    status: "completed",
    version: "1.0.0",
    display_order: 1,
    created_at: "2026-07-01T00:00:00.000Z"
  },
  {
    id: "default-2",
    title: "Zero-Width Hidden Unicode Detector",
    description: "Detect, analyze, and purge hidden formatting gremlins like zero-width spaces (ZWSP), byte order marks (BOM), and non-breaking spaces (NBSP).",
    status: "completed",
    version: "1.0.2",
    display_order: 2,
    created_at: "2026-07-03T00:00:00.000Z"
  },
  {
    id: "default-3",
    title: "ChatGPT Markdown Strip Utility",
    description: "Remove unwanted markdown symbols (headers, bold asterisks, blockquote marks, and inline backticks) while preserving continuous prose.",
    status: "completed",
    version: "1.0.5",
    display_order: 3,
    created_at: "2026-07-10T00:00:00.000Z"
  },
  {
    id: "default-4",
    title: "Batch File Processing & Uploads",
    description: "Upload local .txt and .pdf files to automatically run the repair engine in batch modes without any manual copy-pasting.",
    status: "in-progress",
    version: "1.1.0",
    display_order: 4,
    created_at: "2026-07-11T00:00:00.000Z"
  },
  {
    id: "default-5",
    title: "Browser Extension (Chrome, Firefox & Safari)",
    description: "A lightweight popup extension allowing you to highlight broken text anywhere on the web and repair it instantly via context menu.",
    status: "planned",
    display_order: 5,
    created_at: "2026-07-12T00:00:00.000Z"
  },
  {
    id: "default-6",
    title: "Custom Regex Rules Engine",
    description: "Define, test, and save your own search-and-replace regular expressions to create bespoke text cleaning flows.",
    status: "planned",
    display_order: 6,
    created_at: "2026-07-13T00:00:00.000Z"
  }
];

export function useRoadmap() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roadmapService.getAll();
      if (data && data.length > 0) {
        setRoadmapItems(data);
      } else {
        setRoadmapItems(DEFAULT_ROADMAP_ITEMS);
      }
    } catch (err: any) {
      console.warn("Could not load roadmap from database, using static defaults. Error:", err.message);
      setRoadmapItems(DEFAULT_ROADMAP_ITEMS);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRoadmapItem = async (item: Omit<RoadmapItem, "id" | "created_at">) => {
    try {
      const newItem = await roadmapService.create(item);
      setRoadmapItems((prev) => [...prev, newItem].sort((a, b) => a.display_order - b.display_order));
      return newItem;
    } catch (err: any) {
      console.error("Failed to add roadmap item:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return {
    roadmapItems,
    loading,
    error,
    refresh: fetchRoadmap,
    addRoadmapItem,
  };
}
