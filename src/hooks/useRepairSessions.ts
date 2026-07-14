import { useState, useEffect, useCallback } from "react";
import { RepairSession } from "../types/repairSession";
import { repairSessionService } from "../services/repairSessionService";

export function useRepairSessions() {
  const [sessions, setSessions] = useState<RepairSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repairSessionService.getAll();
      setSessions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load repair sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  const addSession = async (session: Omit<RepairSession, "id" | "created_at">) => {
    try {
      const newSession = await repairSessionService.create(session);
      setSessions((prev) => [newSession, ...prev]);
      return newSession;
    } catch (err: any) {
      console.error("Failed to add repair session to Supabase:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    refresh: fetchSessions,
    addSession,
  };
}
