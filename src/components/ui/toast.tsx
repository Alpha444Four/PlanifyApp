import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant =
  | "default"
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "error";

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (t: Omit<Toast, "id" | "variant"> & { variant?: ToastVariant }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, typeof Info> = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  destructive: XCircle,
  error: XCircle,
};

const accent: Record<ToastVariant, string> = {
  default: "text-primary",
  success: "text-success",
  warning: "text-amber-500",
  info: "text-accent",
  destructive: "text-destructive",
  error: "text-destructive",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, variant: "default", ...t }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.variant];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4 shadow-soft-lg"
              >
                <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", accent[t.variant])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-card-foreground">
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => remove(t.id)}
                  className="focus-ring rounded-md p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
                <ToastTimer id={t.id} onDone={remove} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastTimer({
  id,
  onDone,
}: {
  id: string;
  onDone: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDone]);
  return null;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
