import { motion, useReducedMotion } from "framer-motion";
import { ListTodo, Flame, Apple, BellRing, type LucideIcon } from "lucide-react";
import { useQuickAddStore, type QuickAddType } from "@/store/quick-add-store";

type Action = {
  label: string;
  type: QuickAddType;
  icon: LucideIcon;
  gradient: string;
};

const actions: Action[] = [
  { label: "Add task", type: "task", icon: ListTodo, gradient: "from-sky-500 to-cyan-500" },
  { label: "Add habit", type: "habit", icon: Flame, gradient: "from-orange-500 to-rose-500" },
  { label: "Log meal", type: "meal", icon: Apple, gradient: "from-emerald-500 to-teal-500" },
  { label: "Create reminder", type: "reminder", icon: BellRing, gradient: "from-indigo-500 to-violet-500" },
];

export function QuickActions() {
  const openDialog = useQuickAddStore((s) => s.openDialog);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action, i) => (
        <motion.button
          key={action.type}
          type="button"
          onClick={() => openDialog(action.type)}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          className="focus-ring group flex flex-col items-start gap-3 rounded-3xl border border-border bg-card p-4 text-left shadow-soft transition-shadow hover:shadow-soft-lg dark:glass"
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}
          >
            <action.icon className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
