import { motion } from "motion/react";
import ContactForm from "../components/ContactForm";

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
    </motion.div>
  );
}
