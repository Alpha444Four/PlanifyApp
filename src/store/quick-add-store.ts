import { create } from "zustand";

/**
 * Tiny UI store that controls the shared Quick Add dialog. Any component can
 * open it (Quick Actions, dashboard empty-state CTAs) and a single dialog
 * instance (rendered on the dashboard) reacts to it.
 */
export type QuickAddType = "task" | "habit" | "meal" | "reminder";

interface QuickAddState {
  open: boolean;
  type: QuickAddType;
  openDialog: (type: QuickAddType) => void;
  closeDialog: () => void;
}

export const useQuickAddStore = create<QuickAddState>((set) => ({
  open: false,
  type: "task",
  openDialog: (type) => set({ open: true, type }),
  closeDialog: () => set({ open: false }),
}));
