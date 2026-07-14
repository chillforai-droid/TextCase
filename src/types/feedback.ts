export interface Feedback {
  id: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  email?: string;
  feedback_type: "Bug Report" | "Feature Request" | "Suggestion" | "Repair Failed" | "Other";
  category: "Markdown" | "Unicode" | "OCR" | "PDF" | "Paragraph" | "Spacing" | "General";
  message: string;
  original_text?: string;
  repair_mode?: string;
  browser?: string;
  device?: string;
  status?: "pending" | "investigating" | "fixed" | "closed";
  priority?: "low" | "medium" | "high";
  likes: number;
  admin_reply?: string;
  fixed_version?: string;
  is_public: boolean;
}
