import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'price_alert' | 'trade' | 'security' | 'news' | 'system' | 'marketing';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data?: any;
  actionUrl?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
      state.lastUpdated = new Date().toISOString();
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    clearNotificationsByType: (state, action: PayloadAction<Notification['type']>) => {
      const notificationsToRemove = state.notifications.filter(n => n.type === action.payload);
      const unreadToRemove = notificationsToRemove.filter(n => !n.read).length;
      
      state.notifications = state.notifications.filter(n => n.type !== action.payload);
      state.unreadCount = Math.max(0, state.unreadCount - unreadToRemove);
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
      state.lastUpdated = new Date().toISOString();
    },
    updateUnreadCount: (state) => {
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  clearNotificationsByType,
  setNotifications,
  updateUnreadCount,
  clearError,
} = notificationSlice.actions;

export default notificationSlice.reducer;