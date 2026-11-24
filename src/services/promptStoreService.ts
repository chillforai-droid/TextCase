import { supabase } from "../lib/supabase";
import type { PromptCategory, PromptItem } from "../types";

export async function getPublishedPromptCategories(): Promise<PromptCategory[]> {
  const { data, error } = await supabase
    .from("prompt_categories")
    .select("id,name,slug,description,seo_title,seo_description,is_published,sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data || []) as PromptCategory[];
}

export async function getPublishedPromptCategory(slug: string): Promise<PromptCategory | null> {
  const { data, error } = await supabase
    .from("prompt_categories")
    .select("id,name,slug,description,seo_title,seo_description,is_published,sort_order")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  return (data || null) as PromptCategory | null;
}

export async function getPublishedPromptsByCategory(categoryId: string): Promise<PromptItem[]> {
  const { data, error } = await supabase
    .from("prompts")
    .select("id,category_id,title,slug,short_description,prompt_text,use_case,tags,is_published,sort_order,created_at,updated_at")
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as PromptItem[];
}

export async function getPublishedPrompt(slug: string): Promise<PromptItem | null> {
  const { data, error } = await supabase
    .from("prompts")
    .select("id,category_id,title,slug,short_description,prompt_text,use_case,tags,is_published,sort_order,created_at,updated_at,category:prompt_categories(name,slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  return (data || null) as unknown as PromptItem | null;
}
