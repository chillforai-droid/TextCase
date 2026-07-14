import { supabase } from "../lib/supabase";
import { ChangelogItem } from "../types/changelog";

export const changelogService = {
  async create(item: Omit<ChangelogItem, "id" | "created_at">): Promise<ChangelogItem> {
    const { data, error } = await supabase
      .from("changelog")
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(): Promise<ChangelogItem[]> {
    const { data, error } = await supabase
      .from("changelog")
      .select("*")
      .order("release_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<ChangelogItem>): Promise<ChangelogItem> {
    const { data, error } = await supabase
      .from("changelog")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("changelog")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
