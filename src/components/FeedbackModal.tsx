import React, { useState } from "react";
import { X, Send, AlertTriangle } from "lucide-react";
import { useFeedback } from "../hooks/useFeedback";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  repairMode: string;
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  originalText,
  repairMode,
  triggerToast
}: FeedbackModalProps) {
  const { addFeedback } = useFeedback();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      triggerToast("Please describe what went wrong.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const ua = navigator.userAgent;
      const browser = ua.includes("Firefox")
        ? "Firefox"
        : ua.includes("Chrome")
        ? "Chrome"
        : ua.includes("Safari")
        ? "Safari"
        : ua.includes("Edge")
        ? "Edge"
        : "Unknown Browser";

      const device = /tablet|ipad/i.test(ua)
        ? "Tablet"
        : /mobile|iphone|android/i.test(ua)
        ? "Mobile"
        : "Desktop";

      await addFeedback({
        name: "Automatic Repair Auditor",
        feedback_type: "Repair Failed",
        category: "General",
        message: message.trim(),
        original_text: originalText.slice(0, 1000), // safety trim
        repair_mode: repairMode,
        browser,
        device,
        is_public: false, // failed repairs are kept private for developer audits
        likes: 0,
        status: "pending"
      });

      triggerToast("Failed repair logged. Developers have been notified to tune the rules!", "success");
      setMessage("");
      onClose();
    } catch (err: any) {
      triggerToast(err.message || "Failed to log repair issue", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 mb-4">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50 mb-1">
          Improve Repair Accuracy
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-550 mb-4 leading-relaxed">
          Please tell us what went wrong with this repair (e.g., word clipping, leftover markdown, broken indentation). 
          Our engineers will inspect the original sample and update the regex rules.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550 mb-1.5">
              Issue Description
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g., Words are clumped together at the end of the second paragraph..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition resize-none"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-950/50 rounded-xl p-3 border border-gray-100 dark:border-gray-850 text-[10px] space-y-1 font-medium text-gray-500 dark:text-gray-400">
            <div><span className="font-bold">Repair Mode:</span> {repairMode}</div>
            <div><span className="font-bold">Sample length logged:</span> {originalText.length} characters</div>
            <div className="text-[9px] text-red-500/80 dark:text-red-400/85">
              * The original text will be saved privately in our bug reporter for rule audits only.
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? "Submitting..." : "Submit Bug"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
