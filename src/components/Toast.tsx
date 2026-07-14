import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "info" | "warning";
}

export default function Toast({ message, isOpen, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bgStyles = {
    success: "bg-gray-900 text-white border-gray-800",
    info: "bg-blue-50 text-blue-800 border-blue-100",
    warning: "bg-amber-50 text-amber-800 border-amber-100"
  };

  const iconColors = {
    success: "text-green-400",
    info: "text-blue-500",
    warning: "text-amber-500"
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3.5 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${bgStyles[type]}`}
      role="alert"
      id="toast-notification"
    >
      <CheckCircle className={`h-5 w-5 shrink-0 ${iconColors[type]}`} />
      <span className="text-sm font-semibold tracking-tight">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded-lg p-1 text-gray-400 hover:text-white transition-colors focus:outline-none"
        id="toast-close-btn"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
