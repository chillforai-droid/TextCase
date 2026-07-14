import { useState, useEffect, useCallback } from "react";
import { Feedback } from "../types/feedback";
import { feedbackService } from "../services/feedbackService";

export function useFeedback() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getAllPublic();
      setFeedbackList(data);
    } catch (err: any) {
      setError(err.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  const addFeedback = async (feedback: Omit<Feedback, "id" | "created_at" | "updated_at">) => {
    try {
      const newFeedback = await feedbackService.create(feedback);
      if (newFeedback.is_public) {
        setFeedbackList((prev) => [newFeedback, ...prev]);
      }
      return newFeedback;
    } catch (err: any) {
      throw new Error(err.message || "Failed to submit feedback");
    }
  };

  const likeFeedback = async (id: string) => {
    try {
      const updated = await feedbackService.incrementLikes(id);
      setFeedbackList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, likes: updated.likes } : item))
      );
    } catch (err: any) {
      console.error("Failed to like feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedbackList,
    loading,
    error,
    refresh: fetchFeedback,
    addFeedback,
    likeFeedback,
  };
}
