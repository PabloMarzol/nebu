import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Shield, Activity } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    totalUsers: 15847,
    activeTickets: 23,
    pendingApprovals: 8,
    criticalAlerts: 2,
    volume24h: 2456789.45,
    revenue24h: 45672.89,
    complianceStatus: 98.5,
    systemHealth: 99.8
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 NebulaX Admin Panel
          </h1>
          <p className="text-gray-300">
            Comprehensive platform management and monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Volume</p>
                  <p className="text-2xl font-bold text-white">${(stats.volume24h / 1000000).toFixed(2)}M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Tickets</p>
                  <p className="text-2xl font-bold text-white">{stats.activeTickets}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Health</p>
                  <p className="text-2xl font-bold text-white">{stats.systemHealth}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-black/10 rounded">
                  <span className="text-gray-300">New user registration</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">Success</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-black/10 rounded">
                  <span className="text-gray-300">KYC verification pending</span>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-black/10 rounded">
                  <span className="text-gray-300">Withdrawal request</span>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">Processing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-black/10 rounded">
                  <span className="text-gray-300">High risk transaction detected</span>
                  <Badge variant="outline" className="text-red-400 border-red-400">Critical</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-black/10 rounded">
                  <span className="text-gray-300">API rate limit approaching</span>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">Warning</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-black/10 rounded">
                  <span className="text-gray-300">System maintenance scheduled</span>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">Info</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}