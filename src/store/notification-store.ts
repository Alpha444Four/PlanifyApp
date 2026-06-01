import { create } from "zustand";
import type { AppNotification, ReminderKind } from "@/services/notifications/notification-mock";
import * as notificationService from "@/services/notification-service";

interface NotificationState {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  push: (input: {
    title: string;
    body: string;
    kind: ReminderKind;
  }) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,

  refresh: async () => {
    set({ loading: true });
    try {
      const items = await notificationService.getNotifications();
      set({
        items,
        unreadCount: items.filter((n) => !n.read).length,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  push: async (input) => {
    await notificationService.pushNotification(input);
    await get().refresh();
  },

  markAllRead: async () => {
    await notificationService.markAllRead();
    await get().refresh();
  },

  clearAll: async () => {
    await notificationService.clearAllNotifications();
    await get().refresh();
  },
}));
