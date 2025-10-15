import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Wifi,
  WifiOff,
  Smartphone,
  RefreshCw,
  Database,
  CloudOff,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Globe,
  HardDrive,
  Clock,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CacheStatus {
  totalSize: number;
  apiCache: number;
  imageCache: number;
  staticCache: number;
  lastUpdated: Date;
}

interface PWACapability {
  name: string;
  supported: boolean;
  description: string;
  icon: React.ReactNode;
}

export default function PWAServiceWorker() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [swStatus, setSWStatus] = useState<'installing' | 'waiting' | 'active' | 'error' | 'none'>('none');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    totalSize: 0,
    apiCache: 0,
    imageCache: 0,
    staticCache: 0,
    lastUpdated: new Date()
  });

  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Check PWA capabilities
  const capabilities: PWACapability[] = [
    {
      name: "Service Worker",
      supported: 'serviceWorker' in navigator,
      description: "Background sync and caching",
      icon: <Settings className="w-4 h-4" />
    },
    {
      name: "App Install",
      supported: 'serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches,
      description: "Install as native app",
      icon: <Download className="w-4 h-4" />
    },
    {
      name: "Push Notifications",
      supported: 'Notification' in window && 'serviceWorker' in navigator,
      description: "Background notifications",
      icon: <Zap className="w-4 h-4" />
    },
    {
      name: "Background Sync",
      supported: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      description: "Sync data when back online",
      icon: <RefreshCw className="w-4 h-4" />
    },
    {
      name: "Offline Storage",
      supported: 'caches' in window,
      description: "Cache data for offline use",
      icon: <Database className="w-4 h-4" />
    },
    {
      name: "Web Share",
      supported: 'share' in navigator,
      description: "Native sharing capabilities",
      icon: <Globe className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Install prompt handling
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Register service worker
    registerServiceWorker();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        setSWStatus('installing');
        
        // Create a simple service worker script
        const swScript = `
          const CACHE_NAME = 'nebulax-cache-v1';
          const API_CACHE_NAME = 'nebulax-api-cache-v1';
          const IMAGE_CACHE_NAME = 'nebulax-image-cache-v1';

          const urlsToCache = [
            '/',
            '/static/js/bundle.js',
            '/static/css/main.css',
            '/manifest.json'
          ];

          self.addEventListener('install', (event) => {
            event.waitUntil(
              caches.open(CACHE_NAME)
                .then((cache) => cache.addAll(urlsToCache))
            );
          });

          self.addEventListener('fetch', (event) => {
            event.respondWith(
              caches.match(event.request)
                .then((response) => {
                  if (response) {
                    return response;
                  }
                  return fetch(event.request);
                })
            );
          });

          self.addEventListener('sync', (event) => {
            if (event.tag === 'background-sync') {
              event.waitUntil(doBackgroundSync());
            }
          });

          function doBackgroundSync() {
            // Sync offline data when back online
            return fetch('/api/sync-offline-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ timestamp: Date.now() })
            });
          }
        `;

        // Create blob URL for service worker
        const blob = new Blob([swScript], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);

        const registration = await navigator.serviceWorker.register(swUrl);
        setSwRegistration(registration);

        if (registration.installing) {
          setSWStatus('installing');
        } else if (registration.waiting) {
          setSWStatus('waiting');
          setUpdateAvailable(true);
        } else if (registration.active) {
          setSWStatus('active');
        }

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                setSWStatus('waiting');
              }
            });
          }
        });

        // Update cache status
        updateCacheStatus();

      } catch (error) {
        console.error('Service Worker registration failed:', error);
        setSWStatus('error');
      }
    }
  };

  const updateCacheStatus = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        let apiCache = 0;
        let imageCache = 0;
        let staticCache = 0;

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
              const size = parseInt(response.headers.get('content-length') || '0');
              totalSize += size;
              
              if (cacheName.includes('api')) {
                apiCache += size;
              } else if (cacheName.includes('image')) {
                imageCache += size;
              } else {
                staticCache += size;
              }
            }
          }
        }

        setCacheStatus({
          totalSize,
          apiCache,
          imageCache,
          staticCache,
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error('Failed to get cache status:', error);
      }
    }
  };

  const installApp = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
      }
    }
  };

  const updateServiceWorker = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      updateCacheStatus();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addToOfflineQueue = (action: any) => {
    setOfflineQueue(prev => [...prev, { ...action, timestamp: Date.now() }]);
  };

  const syncOfflineData = async () => {
    if (offlineQueue.length === 0) return;
    
    setSyncInProgress(true);
    try {
      // Simulate syncing offline data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOfflineQueue([]);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      syncOfflineData();
    }
  }, [isOnline, offlineQueue.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Progressive Web App (PWA)</h1>
          <p className="text-gray-400">Enhanced mobile capabilities and offline functionality</p>
        </div>

        {/* Connection Status */}
        <motion.div
          className={`mb-6 p-4 rounded-lg border-2 ${
            isOnline 
              ? 'border-green-500 bg-green-500/20' 
              : 'border-red-500 bg-red-500/20'
          }`}
          animate={{ scale: isOnline ? 1 : 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            {isOnline ? <Wifi className="w-6 h-6 text-green-400" /> : <WifiOff className="w-6 h-6 text-red-400" />}
            <div>
              <div className="font-semibold">
                {isOnline ? 'Online' : 'Offline Mode'}
              </div>
              <div className="text-sm opacity-90">
                {isOnline 
                  ? 'All features available' 
                  : `${offlineQueue.length} actions queued for sync`
                }
              </div>
            </div>
            {!isOnline && offlineQueue.length > 0 && (
              <Badge variant="secondary">{offlineQueue.length}</Badge>
            )}
          </div>
        </motion.div>

        <Tabs defaultValue="capabilities" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="install">Install</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="offline">Offline</TabsTrigger>
          </TabsList>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>PWA Feature Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capabilities.map((capability, index) => (
                    <motion.div
                      key={capability.name}
                      className={`p-4 rounded-lg border ${
                        capability.supported 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-red-500 bg-red-500/10'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {capability.icon}
                          <span className="font-semibold">{capability.name}</span>
                        </div>
                        <Badge variant={capability.supported ? 'default' : 'destructive'}>
                          {capability.supported ? 'Supported' : 'Not Supported'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{capability.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Install Tab */}
          <TabsContent value="install" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>App Installation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Installation Status */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-6 h-6" />
                      <div>
                        <div className="font-semibold">
                          {isInstalled ? 'App Installed' : 'Web App'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {isInstalled 
                            ? 'Running as installed PWA' 
                            : 'Running in browser'
                          }
                        </div>
                      </div>
                    </div>
                    <Badge variant={isInstalled ? 'default' : 'secondary'}>
                      {isInstalled ? 'Installed' : 'Browser'}
                    </Badge>
                  </div>

                  {/* Service Worker Status */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-6 h-6" />
                      <div>
                        <div className="font-semibold">Service Worker</div>
                        <div className="text-sm text-gray-400">
                          Status: {swStatus.charAt(0).toUpperCase() + swStatus.slice(1)}
                        </div>
                      </div>
                    </div>
                    <Badge variant={
                      swStatus === 'active' ? 'default' :
                      swStatus === 'error' ? 'destructive' : 'secondary'
                    }>
                      {swStatus}
                    </Badge>
                  </div>

                  {/* Install Button */}
                  {installPrompt && !isInstalled && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
                    >
                      <Download className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Install NebulaX App</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Install the app for faster access and offline capabilities
                      </p>
                      <Button onClick={installApp} className="bg-blue-500 hover:bg-blue-600">
                        <Download className="w-4 h-4 mr-2" />
                        Install App
                      </Button>
                    </motion.div>
                  )}

                  {/* Update Available */}
                  {updateAvailable && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30"
                    >
                      <RefreshCw className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Update Available</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        A new version of the app is available
                      </p>
                      <Button onClick={updateServiceWorker} className="bg-green-500 hover:bg-green-600">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update Now
                      </Button>
                    </motion.div>
                  )}

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Installation Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { icon: <Zap className="w-4 h-4" />, text: "Faster loading times" },
                        { icon: <CloudOff className="w-4 h-4" />, text: "Offline functionality" },
                        { icon: <Shield className="w-4 h-4" />, text: "Enhanced security" },
                        { icon: <Smartphone className="w-4 h-4" />, text: "Native app experience" }
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          {benefit.icon}
                          <span>{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cache Tab */}
          <TabsContent value="cache" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cache Management</span>
                  <Button variant="ghost" size="sm" onClick={updateCacheStatus}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Cache Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <HardDrive className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Total Cache Size</span>
                      </div>
                      <div className="text-2xl font-bold">{formatBytes(cacheStatus.totalSize)}</div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-5 h-5 text-green-400" />
                        <span className="font-semibold">Last Updated</span>
                      </div>
                      <div className="text-sm">{cacheStatus.lastUpdated.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Cache Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Cache Breakdown</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">API Cache</span>
                          <span className="text-sm">{formatBytes(cacheStatus.apiCache)}</span>
                        </div>
                        <Progress 
                          value={(cacheStatus.apiCache / cacheStatus.totalSize) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Image Cache</span>
                          <span className="text-sm">{formatBytes(cacheStatus.imageCache)}</span>
                        </div>
                        <Progress 
                          value={(cacheStatus.imageCache / cacheStatus.totalSize) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Static Cache</span>
                          <span className="text-sm">{formatBytes(cacheStatus.staticCache)}</span>
                        </div>
                        <Progress 
                          value={(cacheStatus.staticCache / cacheStatus.totalSize) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cache Actions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Cache Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={updateCacheStatus}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Status
                      </Button>
                      <Button variant="outline" onClick={clearCache}>
                        <Database className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offline Tab */}
          <TabsContent value="offline" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Offline Functionality</span>
                  {syncInProgress && <RefreshCw className="w-5 h-5 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Offline Queue */}
                  <div>
                    <h3 className="font-semibold mb-3">Queued Actions</h3>
                    {offlineQueue.length > 0 ? (
                      <div className="space-y-2">
                        {offlineQueue.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div>
                              <div className="font-medium">{item.type || 'Action'}</div>
                              <div className="text-sm text-gray-400">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                            <Badge variant="secondary">Queued</Badge>
                          </div>
                        ))}
                        
                        {isOnline && (
                          <Button 
                            onClick={syncOfflineData} 
                            disabled={syncInProgress}
                            className="w-full mt-3"
                          >
                            {syncInProgress ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Syncing...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Sync Now
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <CloudOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No queued actions</p>
                      </div>
                    )}
                  </div>

                  {/* Offline Features */}
                  <div>
                    <h3 className="font-semibold mb-3">Available Offline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { feature: "View Portfolio", status: "available", icon: <CheckCircle className="w-4 h-4 text-green-400" /> },
                        { feature: "Market Data", status: "cached", icon: <Info className="w-4 h-4 text-blue-400" /> },
                        { feature: "Place Orders", status: "queued", icon: <Clock className="w-4 h-4 text-yellow-400" /> },
                        { feature: "Settings", status: "available", icon: <CheckCircle className="w-4 h-4 text-green-400" /> }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            {item.icon}
                            <span className="text-sm">{item.feature}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Offline */}
                  <div>
                    <h3 className="font-semibold mb-3">Test Offline Mode</h3>
                    <Button
                      variant="outline"
                      onClick={() => {
                        addToOfflineQueue({ 
                          type: 'Test Trade Order', 
                          details: 'Buy 0.1 BTC at market price' 
                        });
                      }}
                    >
                      <div className="w-4 h-4 mr-2 text-center">+</div>
                      Add Test Action
                    </Button>
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