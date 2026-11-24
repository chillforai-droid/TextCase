import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Feedback } from "../types/feedback";

export const feedbackService = {
  async create(feedback: Omit<Feedback, "id" | "created_at" | "updated_at">): Promise<Feedback> {
    if (!isSupabaseConfigured) {
      throw new Error("Feedback database is not configured in this environment.");
    }
    const { data, error } = await supabase
      .from("feedback")
      .insert([feedback])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllPublic(): Promise<Feedback[]> {
    if (!isSupabaseConfigured) {
      return [];
    }
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Could not fetch public feedback:", error);
      return [];
    }
    return data || [];
  },

  async update(id: string, updates: Partial<Feedback>): Promise<Feedback> {
    if (!isSupabaseConfigured) {
      throw new Error("Feedback database is not configured in this environment.");
    }
    const { data, error } = await supabase
      .from("feedback")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error("Feedback database is not configured in this environment.");
    }
    const { error } = await supabase
      .from("feedback")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async incrementLikes(id: string): Promise<Feedback> {
    if (!isSupabaseConfigured) {
      throw new Error("Feedback database is not configured in this environment.");
    }
    const { data: current, error: getError } = await supabase
      .from("feedback")
      .select("likes")
      .eq("id", id)
      .single();

    if (getError) throw getError;

    const newLikes = (current?.likes || 0) + 1;

    const { data, error } = await supabase
      .from("feedback")
      .update({ likes: newLikes })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
