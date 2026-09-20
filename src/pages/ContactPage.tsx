import { motion } from "motion/react";
import ContactForm from "../components/ContactForm";
import { ArrowUpRight, Mic2 } from "lucide-react";

interface ContactPageProps {
  triggerToast: (msg: string, type?: "success" | "info" | "warning") => void;
}

export default function ContactPage({ triggerToast }: ContactPageProps) {
  return (
    <motion.div
      key="contact-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <ContactForm triggerToast={triggerToast} />

      <section className="mt-8 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60" aria-label="VoiceID information">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Mic2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">From the creator</p>
            <h2 className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">Explore VoiceID</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Looking for a place to connect, message and talk? Discover VoiceID through the official website.
            </p>
            <a href="https://www.voiceid.online/?utm_source=textcase&utm_medium=referral&utm_campaign=voiceid_promotion&utm_content=contact_page" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Visit VoiceID <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
