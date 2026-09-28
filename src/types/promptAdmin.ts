export type Category = {
  id: string; name: string; slug: string; description: string;
  seo_title: string | null; seo_description: string | null;
  is_published: boolean; sort_order: number; created_at: string; updated_at: string;
};
export type Prompt = {
  id: string; category_id: string; title: string; slug: string;
  short_description: string; prompt_text: string; use_case: string | null;
  tags: string[]; is_published: boolean; sort_order: number;
  created_at: string; updated_at: string;
  category?: { name: string; slug: string } | null;
};
