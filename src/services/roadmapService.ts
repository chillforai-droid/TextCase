import { supabase } from "../lib/supabase";
import { RoadmapItem } from "../types/roadmap";

export const roadmapService = {
  async create(item: Omit<RoadmapItem, "id" | "created_at">): Promise<RoadmapItem> {
    const { data, error } = await supabase
      .from("roadmap")
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(): Promise<RoadmapItem[]> {
    const { data, error } = await supabase
      .from("roadmap")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<RoadmapItem>): Promise<RoadmapItem> {
    const { data, error } = await supabase
      .from("roadmap")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("roadmap")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
