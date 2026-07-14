import React, { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

interface ContactFormProps {
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

export default function ContactForm({ triggerToast }: ContactFormProps) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      triggerToast("Please fill out all fields.", "warning");
      return;
    }
    setContactSuccess(true);
    setContactName("");
    setContactEmail("");
    setContactMsg("");
    triggerToast("Message sent! We'll reply shortly.", "success");
  };

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-sm max-w-xl mx-auto" id="contact-content">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-6">
        <Mail className="h-6 w-6" />
      </div>
      <h1 className="font-display text-2xl font-extrabold text-gray-950 dark:text-gray-50 sm:text-3xl">
        Contact Support
      </h1>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Have feedback, feature requests, or questions? Send us a message and we'll reply shortly.
      </p>

      {contactSuccess ? (
        <div className="mt-8 rounded-xl bg-green-50 dark:bg-green-950/20 p-6 border border-green-100 dark:border-green-900/30 text-center animate-fade-in">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <h3 className="font-bold text-green-900 dark:text-green-300 text-sm">Message Sent Successfully</h3>
          <p className="text-xs text-green-700 dark:text-green-450 mt-1">We appreciate your support and feedback!</p>
          <button
            onClick={() => setContactSuccess(false)}
            className="mt-4 text-xs font-bold text-green-800 dark:text-green-400 underline hover:text-green-950 dark:hover:text-green-300 cursor-pointer"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleContactSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition"
              id="contact-name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition"
              id="contact-email"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
              Message Content
            </label>
            <textarea
              required
              rows={4}
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              placeholder="Write your message here..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none transition resize-none"
              id="contact-msg"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-bold text-white shadow-md transition duration-150 cursor-pointer"
            id="contact-submit"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
