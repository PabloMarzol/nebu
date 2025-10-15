import { Platform, Alert, PermissionsAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationConfig {
  enablePushNotifications: boolean;
  enablePriceAlerts: boolean;
  enableTradeNotifications: boolean;
  enableSecurityAlerts: boolean;
  enableNewsAlerts: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
  sound: boolean;
  vibration: boolean;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below' | 'change';
  value: number;
  percentage?: number;
  enabled: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface NotificationHistory {
  id: string;
  type: 'price_alert' | 'trade' | 'security' | 'news' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;
  private config: NotificationConfig = {
    enablePushNotifications: true,
    enablePriceAlerts: true,
    enableTradeNotifications: true,
    enableSecurityAlerts: true,
    enableNewsAlerts: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    sound: true,
    vibration: true,
  };
  private priceAlerts: PriceAlert[] = [];
  private notificationHistory: NotificationHistory[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load configuration
      await this.loadConfig();
      
      // Request permissions
      await this.requestPermissions();
      
      // Configure push notifications
      this.configurePushNotifications();
      
      // Load saved data
      await this.loadPriceAlerts();
      await this.loadNotificationHistory();
      
      // Start monitoring
      this.startPriceMonitoring();
      
      this.isInitialized = true;
      console.log('[NotificationService] Initialized successfully');
    } catch (error) {
      console.error('[NotificationService] Initialization failed:', error);
      throw error;
    }
  }

  private async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permissions through the notification configuration
    } catch (error) {
      console.error('[NotificationService] Permission request failed:', error);
      return false;
    }
  }

  private configurePushNotifications(): void {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('[NotificationService] Push token:', token);
        this.savePushToken(token.token);
      },

      onNotification: (notification) => {
        console.log('[NotificationService] Notification received:', notification);
        this.handleNotificationReceived(notification);
      },

      onAction: (notification) => {
        console.log('[NotificationService] Notification action:', notification);
        this.handleNotificationAction(notification);
      },

      onRegistrationError: (error) => {
        console.error('[NotificationService] Registration error:', error);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channels for Android
    if (Platform.OS === 'android') {
      this.createNotificationChannels();
    }
  }

  private createNotificationChannels(): void {
    const channels = [
      {
        channelId: 'price_alerts',
        channelName: 'Price Alerts',
        channelDescription: 'Notifications for price alerts',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      {
        channelId: 'trade_notifications',
        channelName: 'Trade Notifications',
        channelDescription: 'Notifications for trade updates',
        soundName: 'default',
        importance: 3,
        vibrate: true,
      },
      {
        channelId: 'security_alerts',
        channelName: 'Security Alerts',
        channelDescription: 'Security-related notifications',
        soundName: 'default',
        importance: 5,
        vibrate: true,
      },
      {
        channelId: 'news_alerts',
        channelName: 'News Alerts',
        channelDescription: 'Crypto news notifications',
        soundName: 'default',
        importance: 2,
        vibrate: false,
      },
    ];

    channels.forEach(channel => {
      PushNotification.createChannel(channel, () => {
        console.log(`[NotificationService] Channel ${channel.channelId} created`);
      });
    });
  }

  // Price Alerts
  async createPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): Promise<PriceAlert> {
    try {
      const newAlert: PriceAlert = {
        ...alert,
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      this.priceAlerts.push(newAlert);
      await this.savePriceAlerts();

      console.log('[NotificationService] Price alert created:', newAlert);
      return newAlert;
    } catch (error) {
      console.error('[NotificationService] Failed to create price alert:', error);
      throw error;
    }
  }

  async deletePriceAlert(alertId: string): Promise<void> {
    try {
      this.priceAlerts = this.priceAlerts.filter(alert => alert.id !== alertId);
      await this.savePriceAlerts();
      console.log('[NotificationService] Price alert deleted:', alertId);
    } catch (error) {
      console.error('[NotificationService] Failed to delete price alert:', error);
      throw error;
    }
  }

  async togglePriceAlert(alertId: string): Promise<void> {
    try {
      const alert = this.priceAlerts.find(a => a.id === alertId);
      if (alert) {
        alert.enabled = !alert.enabled;
        await this.savePriceAlerts();
        console.log('[NotificationService] Price alert toggled:', alertId, alert.enabled);
      }
    } catch (error) {
      console.error('[NotificationService] Failed to toggle price alert:', error);
      throw error;
    }
  }

  getPriceAlerts(): PriceAlert[] {
    return [...this.priceAlerts];
  }

  private async checkPriceAlerts(symbol: string, currentPrice: number): Promise<void> {
    try {
      const symbolAlerts = this.priceAlerts.filter(
        alert => alert.symbol === symbol && alert.enabled && !alert.triggeredAt
      );

      for (const alert of symbolAlerts) {
        let triggered = false;

        switch (alert.condition) {
          case 'above':
            triggered = currentPrice > alert.value;
            break;
          case 'below':
            triggered = currentPrice < alert.value;
            break;
          case 'change':
            // For percentage change, we'd need historical data
            // This is simplified
            break;
        }

        if (triggered) {
          await this.triggerPriceAlert(alert, currentPrice);
        }
      }
    } catch (error) {
      console.error('[NotificationService] Price alert check failed:', error);
    }
  }

  private async triggerPriceAlert(alert: PriceAlert, currentPrice: number): Promise<void> {
    try {
      alert.triggeredAt = new Date().toISOString();
      await this.savePriceAlerts();

      const title = `Price Alert: ${alert.symbol}`;
      const message = `${alert.symbol} is now ${alert.condition} $${alert.value}. Current price: $${currentPrice.toFixed(6)}`;

      await this.sendNotification({
        type: 'price_alert',
        title,
        message,
        data: { alertId: alert.id, symbol: alert.symbol, price: currentPrice },
        priority: 'high',
        channelId: 'price_alerts',
      });

      console.log('[NotificationService] Price alert triggered:', alert.id);
    } catch (error) {
      console.error('[NotificationService] Failed to trigger price alert:', error);
    }
  }

  // Trading Notifications
  async sendTradeNotification(tradeData: {
    orderId: string;
    symbol: string;
    side: 'buy' | 'sell';
    amount: number;
    price: number;
    status: string;
  }): Promise<void> {
    try {
      if (!this.config.enableTradeNotifications) return;

      const title = `Trade ${tradeData.status}`;
      const message = `${tradeData.side.toUpperCase()} ${tradeData.amount} ${tradeData.symbol} at $${tradeData.price}`;

      await this.sendNotification({
        type: 'trade',
        title,
        message,
        data: tradeData,
        priority: 'normal',
        channelId: 'trade_notifications',
      });
    } catch (error) {
      console.error('[NotificationService] Failed to send trade notification:', error);
    }
  }

  // Security Notifications
  async sendSecurityAlert(alertData: {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<void> {
    try {
      if (!this.config.enableSecurityAlerts) return;

      const title = `Security Alert: ${alertData.type}`;
      const priority = alertData.severity === 'critical' ? 'urgent' : 'high';

      await this.sendNotification({
        type: 'security',
        title,
        message: alertData.message,
        data: alertData,
        priority,
        channelId: 'security_alerts',
      });
    } catch (error) {
      console.error('[NotificationService] Failed to send security alert:', error);
    }
  }

  // News Notifications
  async sendNewsNotification(newsData: {
    title: string;
    summary: string;
    category: string;
    importance: 'low' | 'medium' | 'high';
  }): Promise<void> {
    try {
      if (!this.config.enableNewsAlerts) return;

      const title = `Crypto News: ${newsData.category}`;
      const priority = newsData.importance === 'high' ? 'normal' : 'low';

      await this.sendNotification({
        type: 'news',
        title,
        message: newsData.summary,
        data: newsData,
        priority,
        channelId: 'news_alerts',
      });
    } catch (error) {
      console.error('[NotificationService] Failed to send news notification:', error);
    }
  }

  // Core Notification Methods
  private async sendNotification(notificationData: {
    type: NotificationHistory['type'];
    title: string;
    message: string;
    data?: Record<string, any>;
    priority: NotificationHistory['priority'];
    channelId?: string;
  }): Promise<void> {
    try {
      // Check if notifications are enabled
      if (!this.config.enablePushNotifications) return;

      // Check quiet hours
      if (this.isQuietHours()) {
        console.log('[NotificationService] Skipping notification due to quiet hours');
        await this.saveToHistory(notificationData);
        return;
      }

      // Send push notification
      PushNotification.localNotification({
        title: notificationData.title,
        message: notificationData.message,
        playSound: this.config.sound,
        soundName: 'default',
        vibrate: this.config.vibration,
        priority: this.getPushPriority(notificationData.priority),
        channelId: notificationData.channelId || 'default',
        userInfo: notificationData.data,
        largeIcon: 'ic_launcher',
        smallIcon: 'ic_notification',
      });

      // Save to history
      await this.saveToHistory(notificationData);

      console.log('[NotificationService] Notification sent:', notificationData.title);
    } catch (error) {
      console.error('[NotificationService] Failed to send notification:', error);
    }
  }

  private async saveToHistory(notificationData: {
    type: NotificationHistory['type'];
    title: string;
    message: string;
    data?: Record<string, any>;
    priority: NotificationHistory['priority'];
  }): Promise<void> {
    try {
      const historyItem: NotificationHistory = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...notificationData,
        timestamp: new Date().toISOString(),
        read: false,
      };

      this.notificationHistory.unshift(historyItem);
      
      // Keep only last 100 notifications
      this.notificationHistory = this.notificationHistory.slice(0, 100);
      
      await this.saveNotificationHistory();
    } catch (error) {
      console.error('[NotificationService] Failed to save notification history:', error);
    }
  }

  // Notification History Management
  getNotificationHistory(): NotificationHistory[] {
    return [...this.notificationHistory];
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const notification = this.notificationHistory.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        await this.saveNotificationHistory();
      }
    } catch (error) {
      console.error('[NotificationService] Failed to mark notification as read:', error);
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      this.notificationHistory.forEach(notification => {
        notification.read = true;
      });
      await this.saveNotificationHistory();
    } catch (error) {
      console.error('[NotificationService] Failed to mark all notifications as read:', error);
    }
  }

  getUnreadNotificationCount(): number {
    return this.notificationHistory.filter(n => !n.read).length;
  }

  // Configuration Management
  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  async updateConfig(config: Partial<NotificationConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...config };
      await AsyncStorage.setItem('notificationConfig', JSON.stringify(this.config));
      console.log('[NotificationService] Configuration updated');
    } catch (error) {
      console.error('[NotificationService] Failed to update configuration:', error);
    }
  }

  // Utility Methods
  private isQuietHours(): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.config.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = this.config.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private getPushPriority(priority: NotificationHistory['priority']): 'min' | 'low' | 'default' | 'high' | 'max' {
    switch (priority) {
      case 'low': return 'min';
      case 'normal': return 'default';
      case 'high': return 'high';
      case 'urgent': return 'max';
      default: return 'default';
    }
  }

  private startPriceMonitoring(): void {
    // This would typically connect to your real-time price feed
    // For now, we'll simulate with a simple interval
    setInterval(async () => {
      try {
        // Check price alerts periodically
        // In a real implementation, this would be event-driven
        const symbols = [...new Set(this.priceAlerts.map(alert => alert.symbol))];
        
        for (const symbol of symbols) {
          // Simulate price check - replace with real price service
          const currentPrice = Math.random() * 50000; // Placeholder
          await this.checkPriceAlerts(symbol, currentPrice);
        }
      } catch (error) {
        console.error('[NotificationService] Price monitoring error:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  private handleNotificationReceived(notification: any): void {
    // Handle when notification is received while app is open
    console.log('[NotificationService] Handling received notification:', notification);
  }

  private handleNotificationAction(notification: any): void {
    // Handle when user taps on notification
    console.log('[NotificationService] Handling notification action:', notification);
  }

  // Data Persistence
  private async loadConfig(): Promise<void> {
    try {
      const configData = await AsyncStorage.getItem('notificationConfig');
      if (configData) {
        this.config = { ...this.config, ...JSON.parse(configData) };
      }
    } catch (error) {
      console.error('[NotificationService] Failed to load config:', error);
    }
  }

  private async loadPriceAlerts(): Promise<void> {
    try {
      const alertsData = await AsyncStorage.getItem('priceAlerts');
      if (alertsData) {
        this.priceAlerts = JSON.parse(alertsData);
      }
    } catch (error) {
      console.error('[NotificationService] Failed to load price alerts:', error);
    }
  }

  private async savePriceAlerts(): Promise<void> {
    try {
      await AsyncStorage.setItem('priceAlerts', JSON.stringify(this.priceAlerts));
    } catch (error) {
      console.error('[NotificationService] Failed to save price alerts:', error);
    }
  }

  private async loadNotificationHistory(): Promise<void> {
    try {
      const historyData = await AsyncStorage.getItem('notificationHistory');
      if (historyData) {
        this.notificationHistory = JSON.parse(historyData);
      }
    } catch (error) {
      console.error('[NotificationService] Failed to load notification history:', error);
    }
  }

  private async saveNotificationHistory(): Promise<void> {
    try {
      await AsyncStorage.setItem('notificationHistory', JSON.stringify(this.notificationHistory));
    } catch (error) {
      console.error('[NotificationService] Failed to save notification history:', error);
    }
  }

  private async savePushToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('pushToken', token);
      console.log('[NotificationService] Push token saved');
    } catch (error) {
      console.error('[NotificationService] Failed to save push token:', error);
    }
  }
}

export const NotificationService = NotificationService.getInstance();
export default NotificationService;