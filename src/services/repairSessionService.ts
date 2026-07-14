import { supabase } from "../lib/supabase";
import { RepairSession } from "../types/repairSession";

export const repairSessionService = {
  async create(session: Omit<RepairSession, "id" | "created_at">): Promise<RepairSession> {
    const { data, error } = await supabase
      .from("repair_sessions")
      .insert([session])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async get(id: string): Promise<RepairSession> {
    const { data, error } = await supabase
      .from("repair_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(): Promise<RepairSession[]> {
    const { data, error } = await supabase
      .from("repair_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<RepairSession>): Promise<RepairSession> {
    const { data, error } = await supabase
      .from("repair_sessions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("repair_sessions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
