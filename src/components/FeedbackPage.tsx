import React, { useState } from "react";
import { MessageSquare, Heart, CheckCircle, Send, HelpCircle, ThumbsUp } from "lucide-react";
import { useFeedback } from "../hooks/useFeedback";
import { Feedback } from "../types/feedback";

interface FeedbackPageProps {
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

export default function FeedbackPage({ triggerToast }: FeedbackPageProps) {
  const { feedbackList, loading, error, addFeedback, likeFeedback } = useFeedback();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState<Feedback["feedback_type"]>("Suggestion");
  const [category, setCategory] = useState<Feedback["category"]>("General");
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      triggerToast("Please enter a message.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await addFeedback({
        name: name.trim() || "Anonymous",
        email: email.trim() || undefined,
        feedback_type: feedbackType,
        category,
        message: message.trim(),
        is_public: isPublic,
        likes: 0,
        status: "pending"
      });
      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      triggerToast("Feedback submitted successfully!", "success");
    } catch (err: any) {
      triggerToast(err.message || "Failed to submit feedback", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-950 dark:text-gray-5 sm:text-4xl tracking-tight">
          Feedback & Suggestion Board
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Help us build the ultimate text repair workspace. Tell us what features you want,
          report format bugs, or vote on ideas submitted by others.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50 mb-1">
            Submit Feedback
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
            We review every piece of feedback to continuously improve our formatting engines.
          </p>

          {submitSuccess ? (
            <div className="rounded-xl bg-green-50 dark:bg-green-950/20 p-6 border border-green-100 dark:border-green-900/30 text-center animate-fade-in">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-green-900 dark:text-green-300 text-sm">Thank You!</h3>
              <p className="text-xs text-green-700 dark:text-green-450 mt-1">
                Your feedback has been successfully registered.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 text-xs font-bold text-green-800 dark:text-green-400 underline hover:text-green-950 dark:hover:text-green-300 cursor-pointer"
              >
                Submit more feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                    Type
                  </label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value as Feedback["feedback_type"])}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="Suggestion">Suggestion</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Repair Failed">Repair Failed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Feedback["category"])}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="General">General</option>
                    <option value="Markdown">Markdown</option>
                    <option value="Unicode">Unicode</option>
                    <option value="OCR">OCR</option>
                    <option value="PDF">PDF Text</option>
                    <option value="Paragraph">Paragraph</option>
                    <option value="Spacing">Spacing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                  Message Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue, failed repair, or feature suggestion in detail..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition resize-none"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="is-public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="is-public" className="text-xs text-gray-600 dark:text-gray-400 select-none cursor-pointer">
                  Make this feedback public on our suggestion board
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2.5 text-sm font-bold text-white shadow-md transition duration-150 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Post Feedback"}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Public Feedbacks */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
              Community Ideas & Reports
            </h2>
            <span className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-500 px-2.5 py-1 rounded-full font-medium">
              {feedbackList.length} Entries
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 rounded-2xl bg-gray-100/60 dark:bg-gray-900/40 border border-gray-200/20 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 text-sm">
              Failed to connect with Supabase. Verify credentials are correct.
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <HelpCircle className="h-8 w-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No public feedback yet</h3>
              <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts with the community!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl p-5 shadow-sm hover:border-gray-200 dark:hover:border-gray-800 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-gray-800 dark:text-gray-200">
                        {item.name || "Anonymous"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.feedback_type === "Bug Report" || item.feedback_type === "Repair Failed"
                          ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                          : item.feedback_type === "Feature Request"
                          ? "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
                          : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                      }`}>
                        {item.feedback_type}
                      </span>
                      <span className="text-[10px] font-bold bg-gray-50 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-650 dark:text-gray-350 leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800/40 flex items-center justify-between">
                    <button
                      onClick={() => likeFeedback(item.id)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-550 dark:hover:text-red-400 transition focus:outline-none cursor-pointer"
                    >
                      <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 hover:scale-110 transition duration-150" />
                      <span>{item.likes || 0} Likes</span>
                    </button>

                    {item.status && (
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${
                        item.status === "fixed"
                          ? "text-green-600 dark:text-green-400"
                          : item.status === "investigating"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-400"
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>

                  {/* Admin Reply */}
                  {item.admin_reply && (
                    <div className="mt-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/10 rounded-xl p-3 text-xs">
                      <div className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-1 mb-1">
                        <ThumbsUp className="h-3 w-3" />
                        Developer Reply:
                      </div>
                      <p className="text-gray-650 dark:text-gray-300 leading-relaxed">
                        {item.admin_reply}
                      </p>
                      {item.fixed_version && (
                        <div className="mt-1.5 text-[10px] font-bold text-green-700 dark:text-green-450">
                          Fixed in Version {item.fixed_version}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
