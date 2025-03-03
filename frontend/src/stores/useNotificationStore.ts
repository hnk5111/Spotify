import { create } from "zustand";
import { toast } from "react-hot-toast";

interface Notification {
  id: string;
  message: string;
  type: "message" | "info";
  read: boolean;
  timestamp: Date;
  data?: any;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      notifications: [
        { ...notification, id, timestamp: new Date() },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    }));

    // Show toast notification
    toast(notification.message, {
      icon: notification.type === "message" ? "💬" : "ℹ️",
      position: "bottom-right",
      duration: 4000,
      className: "bg-card/95 backdrop-blur-sm border border-border/50",
    });
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: state.unreadCount - 1,
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !n.read)
        ? state.unreadCount - 1
        : state.unreadCount,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
})); 