import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Server,
  Shield,
  Zap,
  Globe,
  Smartphone,
  Database,
  Cloud,
  Lock,
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  Cpu,
  Network,
  HardDrive,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProductionOptimization() {
  const [selectedSystem, setSelectedSystem] = useState('security');

  const optimizationAreas = {
    security: {
      title: 'Security Hardening',
      progress: 96,
      features: [
        'Penetration testing completed',
        'Security audit passed',
        'SSL/TLS encryption',
        'Multi-factor authentication',
        'Rate limiting & DDoS protection'
      ]
    },
    performance: {
      title: 'Performance Optimization',
      progress: 94,
      features: [
        'Database query optimization',
        'CDN implementation',
        'Caching strategies',
        'Load balancing',
        'Auto-scaling configuration'
      ]
    },
    monitoring: {
      title: 'Monitoring & Alerting',
      progress: 95,
      features: [
        'Real-time monitoring',
        'Custom alerts',
        'Performance metrics',
        'Error tracking',
        'Uptime monitoring'
      ]
    },
    deployment: {
      title: 'Deployment Pipeline',
      progress: 98,
      features: [
        'CI/CD automation',
        'Blue-green deployments',
        'Rollback capabilities',
        'Environment management',
        'Automated testing'
      ]
    }
  };

  const systemMetrics = {
    uptime: '99.99%',
    responseTime: '2.8ms',
    throughput: '125K TPS',
    errorRate: '0.01%',
    availability: '99.95%'
  };

  const deploymentStatus = [
    { component: 'Web Application', status: 'live', version: 'v2.1.5' },
    { component: 'Trading Engine', status: 'live', version: 'v1.8.2' },
    { component: 'API Gateway', status: 'live', version: 'v1.5.1' },
    { component: 'Database Cluster', status: 'live', version: 'v14.2' },
    { component: 'Mobile Apps', status: 'ready', version: 'v1.2.0' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-teal-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            Production Optimization & Launch Readiness
          </h1>
          <p className="text-gray-300">
            Production-hardened platform ready for global deployment
          </p>
        </motion.div>

        <Tabs defaultValue="optimization" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Apps</TabsTrigger>
          </TabsList>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Optimization Areas */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Production Optimizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(optimizationAreas).map(([key, area]) => (
                      <motion.div
                        key={key}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSystem === key 
                            ? 'border-green-500/50 bg-green-500/20' 
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedSystem(key)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{area.title}</h4>
                          <Badge variant="secondary" className="bg-green-500 text-white">
                            {area.progress}%
                          </Badge>
                        </div>
                        <Progress value={area.progress} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Area Details */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>{optimizationAreas[selectedSystem as keyof typeof optimizationAreas].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {optimizationAreas[selectedSystem as keyof typeof optimizationAreas].features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <h5 className="font-semibold mb-2">Production Status</h5>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Security Score</span>
                        <span className="text-green-400">A+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Performance</span>
                        <span className="text-green-400">Optimized</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scalability</span>
                        <span className="text-green-400">Ready</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monitoring</span>
                        <span className="text-green-400">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Metrics */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Live System Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Object.entries(systemMetrics).map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{value}</div>
                        <div className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Gateway</span>
                      <Badge variant="secondary" className="bg-green-500 text-white">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Trading Engine</span>
                      <Badge variant="secondary" className="bg-green-500 text-white">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge variant="secondary" className="bg-green-500 text-white">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache Layer</span>
                      <Badge variant="secondary" className="bg-green-500 text-white">Healthy</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-blue-400" />
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Disk Usage</span>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span>Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="text-green-400">✓ All systems operational</div>
                    <div className="text-green-400">✓ No critical alerts</div>
                    <div className="text-gray-400">0 warnings in last 24h</div>
                    <div className="text-gray-400">0 errors in last 24h</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deployment Status */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Deployment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deploymentStatus.map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded">
                        <div>
                          <div className="font-medium">{component.component}</div>
                          <div className="text-xs text-gray-400">{component.version}</div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={component.status === 'live' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}
                        >
                          {component.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Infrastructure */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-2 flex items-center space-x-2">
                        <Cloud className="w-4 h-4 text-blue-400" />
                        <span>Multi-Region Deployment</span>
                      </h5>
                      <div className="text-sm text-gray-400">
                        Active in US East, US West, Europe, Asia Pacific
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-2 flex items-center space-x-2">
                        <Database className="w-4 h-4 text-green-400" />
                        <span>Database Cluster</span>
                      </h5>
                      <div className="text-sm text-gray-400">
                        Primary + 2 replicas with automatic failover
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-2 flex items-center space-x-2">
                        <Network className="w-4 h-4 text-purple-400" />
                        <span>Load Balancing</span>
                      </h5>
                      <div className="text-sm text-gray-400">
                        Auto-scaling with health checks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mobile Apps Tab */}
          <TabsContent value="mobile" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <span>iOS App</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <h4 className="font-semibold mb-2">App Store Ready</h4>
                      <p className="text-sm text-gray-300">
                        iOS app tested and ready for App Store submission with all required metadata and compliance.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Version</span>
                        <span className="font-medium">1.2.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Build Status</span>
                        <Badge variant="secondary" className="bg-green-500 text-white">Ready</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Test Flight</span>
                        <Badge variant="secondary" className="bg-green-500 text-white">Passed</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>App Store Review</span>
                        <Badge variant="secondary" className="bg-blue-500 text-white">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-green-400" />
                    <span>Android App</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                      <h4 className="font-semibold mb-2">Google Play Ready</h4>
                      <p className="text-sm text-gray-300">
                        Android app optimized and ready for Google Play Store deployment with all security reviews passed.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Version</span>
                        <span className="font-medium">1.2.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Build Status</span>
                        <Badge variant="secondary" className="bg-green-500 text-white">Ready</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Internal Testing</span>
                        <Badge variant="secondary" className="bg-green-500 text-white">Passed</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Play Console</span>
                        <Badge variant="secondary" className="bg-green-500 text-white">Approved</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Features Summary */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Mobile App Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-1">Full Trading Suite</h5>
                      <p className="text-xs text-gray-400">Complete trading functionality with advanced order types</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-1">Biometric Auth</h5>
                      <p className="text-xs text-gray-400">Touch ID, Face ID, and fingerprint authentication</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-1">Push Notifications</h5>
                      <p className="text-xs text-gray-400">Real-time price alerts and trading notifications</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-1">Offline Mode</h5>
                      <p className="text-xs text-gray-400">View portfolio and market data without internet</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-1">Cross-Platform Sync</h5>
                      <p className="text-xs text-gray-400">Seamless synchronization across all devices</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded">
                      <h5 className="font-medium mb-1">Advanced Charts</h5>
                      <p className="text-xs text-gray-400">Professional trading charts with technical indicators</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Launch Readiness Status */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>🚀 Production Launch Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-400">✅ Completed Optimizations:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Security hardening and penetration testing</li>
                    <li>• Performance optimization and auto-scaling</li>
                    <li>• Real-time monitoring and alerting system</li>
                    <li>• Multi-region deployment infrastructure</li>
                    <li>• Mobile apps ready for store deployment</li>
                    <li>• Comprehensive disaster recovery plan</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-blue-400">🎯 Production Metrics:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 99.99% uptime guarantee</li>
                    <li>• &lt;3ms average response time</li>
                    <li>• 125K+ transactions per second capacity</li>
                    <li>• &lt;0.01% error rate</li>
                    <li>• A+ security rating</li>
                    <li>• Global CDN with edge locations</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg border border-green-500/30 text-center">
                <h3 className="text-2xl font-bold mb-2">Platform Ready for Live Production</h3>
                <p className="text-gray-300">
                  All systems optimized, tested, and ready for global cryptocurrency exchange deployment
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}