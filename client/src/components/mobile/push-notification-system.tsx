import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Bell,
  BellRing,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  DollarSign,
  Clock,
  Volume2,
  VolumeX,
  Vibrate,
  Smartphone,
  Mail,
  MessageSquare,
  X,
  Plus,
  Trash2,
  Edit,
  Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationRule {
  id: string;
  type: 'price' | 'volume' | 'trade' | 'security' | 'news';
  asset?: string;
  condition: 'above' | 'below' | 'change_percent' | 'volume_spike';
  value: number;
  enabled: boolean;
  title: string;
  message: string;
}

interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'price_alert' | 'trade_executed' | 'security' | 'news' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  read: boolean;
  actions?: { label: string; action: string }[];
}

export default function PushNotificationSystem() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    sound: true,
    vibration: true,
    badge: true,
    priority: 'medium' as 'low' | 'medium' | 'high',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    frequency: {
      priceAlerts: 5, // minutes
      tradeAlerts: 0, // immediate
      newsAlerts: 60 // minutes
    }
  });

  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      type: 'price',
      asset: 'BTC',
      condition: 'above',
      value: 45000,
      enabled: true,
      title: 'BTC Price Alert',
      message: 'Bitcoin price is above $45,000'
    },
    {
      id: '2',
      type: 'price',
      asset: 'ETH',
      condition: 'below',
      value: 2500,
      enabled: true,
      title: 'ETH Price Alert',
      message: 'Ethereum price dropped below $2,500'
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<NotificationRule>>({
    type: 'price',
    condition: 'above',
    enabled: true
  });

  // Check notification support and permission
  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
        addNotification({
          type: 'system',
          title: 'Notifications Enabled',
          message: 'You will now receive push notifications from NebulaX',
          priority: 'medium'
        });
      }
    }
  };

  // Add new notification
  const addNotification = (notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: PushNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50

    // Show browser notification if enabled and permission granted
    if (settings.enabled && notificationPermission === 'granted') {
      const notif = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.priority === 'critical',
        silent: !settings.sound,

      });

      // Auto-close after 5 seconds unless critical
      if (notification.priority !== 'critical') {
        setTimeout(() => notif.close(), 5000);
      }

      notif.onclick = () => {
        window.focus();
        notif.close();
        markAsRead(newNotification.id);
      };
    }

    // Trigger vibration if enabled and supported
    if (settings.vibration && 'vibrate' in navigator) {
      const vibrationPattern = {
        low: [100],
        medium: [200, 100, 200],
        high: [300, 100, 300, 100, 300],
        critical: [500, 200, 500, 200, 500]
      };
      navigator.vibrate(vibrationPattern[notification.priority]);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const addRule = () => {
    if (newRule.type && newRule.condition && newRule.value && newRule.title) {
      const rule: NotificationRule = {
        id: Date.now().toString(),
        type: newRule.type,
        asset: newRule.asset,
        condition: newRule.condition,
        value: newRule.value,
        enabled: true,
        title: newRule.title,
        message: newRule.message || `${newRule.asset} price ${newRule.condition} ${newRule.value}`
      };
      
      setRules(prev => [...prev, rule]);
      setNewRule({ type: 'price', condition: 'above', enabled: true });
    }
  };

  const updateRule = (id: string, updates: Partial<NotificationRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  // Simulate notifications based on rules
  useEffect(() => {
    if (!settings.enabled) return;

    const interval = setInterval(() => {
      const activeRules = rules.filter(rule => rule.enabled);
      if (activeRules.length === 0) return;

      // Simulate random price movements and trigger notifications
      const randomRule = activeRules[Math.floor(Math.random() * activeRules.length)];
      const shouldTrigger = Math.random() > 0.8; // 20% chance

      if (shouldTrigger) {
        addNotification({
          type: 'price_alert',
          title: randomRule.title,
          message: randomRule.message,
          priority: 'medium'
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [settings.enabled, rules]);

  const getNotificationIcon = (type: PushNotification['type']) => {
    switch (type) {
      case 'price_alert': return <TrendingUp className="w-4 h-4" />;
      case 'trade_executed': return <CheckCircle className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'news': return <Info className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: PushNotification['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/20';
      case 'high': return 'border-orange-500 bg-orange-500/20';
      case 'medium': return 'border-blue-500 bg-blue-500/20';
      case 'low': return 'border-gray-500 bg-gray-500/20';
      default: return 'border-gray-500 bg-gray-500/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Push Notification System</h1>
          <p className="text-gray-400">Manage your real-time trading alerts and notifications</p>
        </div>

        {/* Notification Support Status */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notification Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Browser Support</div>
                  <div className="text-sm text-gray-400">
                    {isSupported ? 'Supported' : 'Not supported on this device'}
                  </div>
                </div>
                <Badge variant={isSupported ? 'default' : 'destructive'}>
                  {isSupported ? 'Supported' : 'Not Supported'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Permission Status</div>
                  <div className="text-sm text-gray-400">
                    Current notification permission level
                  </div>
                </div>
                <Badge variant={
                  notificationPermission === 'granted' ? 'default' :
                  notificationPermission === 'denied' ? 'destructive' : 'secondary'
                }>
                  {notificationPermission}
                </Badge>
              </div>

              {notificationPermission !== 'granted' && isSupported && (
                <Button onClick={requestPermission} className="w-full">
                  <BellRing className="w-4 h-4 mr-2" />
                  Enable Push Notifications
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rules">Alert Rules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Notifications</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{unreadCount} unread</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    >
                      Mark All Read
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 rounded-lg border ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'ring-2 ring-blue-500/50' : ''
                        }`}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        layout
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`p-2 rounded-full ${
                              notification.type === 'price_alert' ? 'bg-blue-500/20' :
                              notification.type === 'trade_executed' ? 'bg-green-500/20' :
                              notification.type === 'security' ? 'bg-yellow-500/20' :
                              notification.type === 'news' ? 'bg-purple-500/20' :
                              'bg-gray-500/20'
                            }`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold">{notification.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
                              <div className="text-xs text-gray-400">
                                {notification.timestamp.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {notifications.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No notifications yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-3"
                        onClick={() => addNotification({
                          type: 'system',
                          title: 'Test Notification',
                          message: 'This is a test notification to verify the system is working',
                          priority: 'low'
                        })}
                      >
                        Send Test Notification
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alert Rules Tab */}
          <TabsContent value="rules" className="mt-4">
            <div className="space-y-4">
              {/* Add New Rule */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Create Alert Rule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Alert Type</label>
                      <Select 
                        value={newRule.type} 
                        onValueChange={(value: any) => setNewRule(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price">Price Alert</SelectItem>
                          <SelectItem value="volume">Volume Alert</SelectItem>
                          <SelectItem value="trade">Trade Alert</SelectItem>
                          <SelectItem value="security">Security Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newRule.type === 'price' && (
                      <>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Asset</label>
                          <Input
                            placeholder="e.g., BTC, ETH"
                            value={newRule.asset || ''}
                            onChange={(e) => setNewRule(prev => ({ ...prev, asset: e.target.value.toUpperCase() }))}
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Condition</label>
                          <Select 
                            value={newRule.condition} 
                            onValueChange={(value: any) => setNewRule(prev => ({ ...prev, condition: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="above">Above</SelectItem>
                              <SelectItem value="below">Below</SelectItem>
                              <SelectItem value="change_percent">Change %</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Value</label>
                          <Input
                            type="number"
                            placeholder="Enter value"
                            value={newRule.value || ''}
                            onChange={(e) => setNewRule(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                          />
                        </div>
                      </>
                    )}

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 mb-2 block">Alert Title</label>
                      <Input
                        placeholder="Enter alert title"
                        value={newRule.title || ''}
                        onChange={(e) => setNewRule(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 mb-2 block">Alert Message</label>
                      <Input
                        placeholder="Enter alert message"
                        value={newRule.message || ''}
                        onChange={(e) => setNewRule(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Button onClick={addRule} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Alert Rule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Rules */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Active Alert Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) => updateRule(rule.id, { enabled: checked })}
                          />
                          <div>
                            <div className="font-medium">{rule.title}</div>
                            <div className="text-sm text-gray-400">
                              {rule.asset} {rule.condition} {rule.value}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteRule(rule.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {rules.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No alert rules configured</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">General</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Enable Notifications</div>
                        <div className="text-sm text-gray-400">Master toggle for all notifications</div>
                      </div>
                      <Switch
                        checked={settings.enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Sound</div>
                        <div className="text-sm text-gray-400">Play sound with notifications</div>
                      </div>
                      <Switch
                        checked={settings.sound}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sound: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Vibration</div>
                        <div className="text-sm text-gray-400">Vibrate on notifications</div>
                      </div>
                      <Switch
                        checked={settings.vibration}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, vibration: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Badge Count</div>
                        <div className="text-sm text-gray-400">Show unread count on app icon</div>
                      </div>
                      <Switch
                        checked={settings.badge}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, badge: checked }))}
                      />
                    </div>
                  </div>

                  {/* Priority Settings */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="font-semibold">Priority</h3>
                    
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Default Priority Level</label>
                      <Select 
                        value={settings.priority} 
                        onValueChange={(value: any) => setSettings(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quiet Hours */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="font-semibold">Quiet Hours</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Enable Quiet Hours</div>
                        <div className="text-sm text-gray-400">Reduce notifications during specified hours</div>
                      </div>
                      <Switch
                        checked={settings.quietHours.enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, enabled: checked }
                        }))}
                      />
                    </div>

                    {settings.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Start Time</label>
                          <Input
                            type="time"
                            value={settings.quietHours.start}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              quietHours: { ...prev.quietHours, start: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">End Time</label>
                          <Input
                            type="time"
                            value={settings.quietHours.end}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              quietHours: { ...prev.quietHours, end: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Test Section */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="font-semibold">Test Notifications</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => addNotification({
                          type: 'price_alert',
                          title: 'Test Price Alert',
                          message: 'BTC price reached $45,000',
                          priority: 'medium'
                        })}
                      >
                        Test Price Alert
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => addNotification({
                          type: 'trade_executed',
                          title: 'Test Trade Alert',
                          message: 'Your buy order has been executed',
                          priority: 'high'
                        })}
                      >
                        Test Trade Alert
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => addNotification({
                          type: 'security',
                          title: 'Test Security Alert',
                          message: 'New login detected from unknown device',
                          priority: 'critical'
                        })}
                      >
                        Test Security Alert
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => addNotification({
                          type: 'system',
                          title: 'Test System Alert',
                          message: 'System maintenance scheduled',
                          priority: 'low'
                        })}
                      >
                        Test System Alert
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}