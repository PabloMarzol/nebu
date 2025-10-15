import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, TrendingUp, TrendingDown, Zap, Shield, Info, CheckCircle } from "lucide-react";

interface Notification {
  id: string;
  type: 'price' | 'trade' | 'security' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
  isRead?: boolean;
  data?: any;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible?: number;
}

const notificationIcons = {
  price: TrendingUp,
  trade: Zap,
  security: Shield,
  info: Info,
  success: CheckCircle
};

const notificationColors = {
  price: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
  trade: 'border-green-500/30 bg-green-500/5 text-green-400',
  security: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
  info: 'border-gray-500/30 bg-gray-500/5 text-gray-400',
  success: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
};

export default function SubtleNotificationSystem({ 
  notifications, 
  onDismiss, 
  onMarkAsRead,
  position = 'top-right',
  maxVisible = 5 
}: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Show only the most recent notifications
    const recent = notifications.slice(0, maxVisible);
    setVisibleNotifications(recent);

    // Auto-dismiss notifications with duration
    recent.forEach(notification => {
      if (notification.duration) {
        setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
      }
    });
  }, [notifications, maxVisible, onDismiss]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-2 max-w-sm w-full pointer-events-none`}>
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification, index) => {
          const IconComponent = notificationIcons[notification.type];
          const colorClasses = notificationColors[notification.type];
          
          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ 
                opacity: 0, 
                x: position.includes('right') ? 300 : -300,
                scale: 0.8
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: position.includes('right') ? 300 : -300,
                scale: 0.8,
                transition: { duration: 0.2 }
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                delay: index * 0.05
              }}
              className="pointer-events-auto"
            >
              <motion.div
                className={`border backdrop-blur-md rounded-lg p-4 shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 ${colorClasses} ${
                  notification.isRead ? 'opacity-70' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    className="flex-shrink-0 mt-0.5"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: notification.isRead ? 0 : [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold truncate">
                        {notification.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismiss(notification.id);
                        }}
                        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <p className="text-xs opacity-90 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {formatTime(notification.timestamp)}
                      </span>
                      
                      {!notification.isRead && (
                        <motion.div
                          className="w-2 h-2 bg-current rounded-full"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar for timed notifications */}
                {notification.duration && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-current rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: notification.duration / 1000, ease: "linear" }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Notification Provider Hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Sample notification generators
  const showPriceAlert = (symbol: string, price: number, change: number) => {
    addNotification({
      type: 'price',
      title: `${symbol} Price Alert`,
      message: `${symbol} reached $${price.toLocaleString()} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`,
      duration: 5000,
      data: { symbol, price, change }
    });
  };

  const showTradeNotification = (type: string, symbol: string, amount: number) => {
    addNotification({
      type: 'trade',
      title: `Trade ${type}`,
      message: `Successfully ${type.toLowerCase()}ed ${amount} ${symbol}`,
      duration: 4000,
      data: { type, symbol, amount }
    });
  };

  const showSecurityAlert = (message: string) => {
    addNotification({
      type: 'security',
      title: 'Security Alert',
      message,
      duration: 8000
    });
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    showPriceAlert,
    showTradeNotification,
    showSecurityAlert
  };
}