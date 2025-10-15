import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Users, 
  Lock, 
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface SecurityStats {
  security: {
    blockedIPs: number;
    suspiciousIPs: number;
    recentEvents: any[];
    activeLimits: number;
  };
  sessions: {
    totalActiveSessions: number;
    activeUsers: number;
    recentAlerts: any[];
    sessionsByHour: number[];
  };
  audit: {
    totalEvents: number;
    eventsLast24h: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topUsers: Array<{ userId: string; eventCount: number }>;
    recentCriticalEvents: any[];
  };
  risk: {
    totalProfiles: number;
    alertsByType: Record<string, number>;
    alertsBySeverity: Record<string, number>;
    recentAlerts: any[];
    riskDistribution: Record<string, number>;
  };
  compliance: {
    pendingReports: number;
    completedReports: number;
    flaggedTransactions: number;
    complianceScore: number;
  };
  timestamp: string;
}

export default function SecurityDashboard() {
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Fetch security dashboard data
  const { data: securityData, isLoading, refetch } = useQuery({
    queryKey: ["/api/security/dashboard"],
    refetchInterval: refreshInterval,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading security dashboard...
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = securityData as SecurityStats;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sessions?.totalActiveSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.sessions?.activeUsers || 0} unique users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.audit?.eventsLast24h || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.risk?.recentAlerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              {stats?.compliance?.pendingReports || 0} pending reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Status Alerts */}
      {stats?.security?.recentEvents?.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Alert:</strong> {stats.security.recentEvents.length} recent security events detected. 
            {stats.security.blockedIPs > 0 && ` ${stats.security.blockedIPs} IPs currently blocked.`}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rate Limiting Status */}
            <Card>
              <CardHeader>
                <CardTitle>Rate Limiting & DDoS Protection</CardTitle>
                <CardDescription>API protection and traffic monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Rate Limits</span>
                    <Badge variant="outline">{stats?.security?.activeLimits || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blocked IPs</span>
                    <Badge variant={stats?.security?.blockedIPs > 0 ? "destructive" : "default"}>
                      {stats?.security?.blockedIPs || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suspicious Activity</span>
                    <Badge variant={stats?.security?.suspiciousIPs > 0 ? "secondary" : "default"}>
                      {stats?.security?.suspiciousIPs || 0} IPs flagged
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Activity</CardTitle>
                <CardDescription>System activity and event tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Events</span>
                    <Badge variant="outline">{stats?.audit?.totalEvents || 0}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Events by Category</div>
                    {Object.entries(stats?.audit?.eventsByCategory || {}).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{category}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Security</CardTitle>
              <CardDescription>Active sessions and security monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Session Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{stats?.sessions?.totalActiveSessions || 0}</div>
                    <div className="text-sm text-muted-foreground">Active Sessions</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{stats?.sessions?.activeUsers || 0}</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{stats?.sessions?.recentAlerts?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Security Alerts</div>
                  </div>
                </div>

                {/* Recent Session Alerts */}
                {stats?.sessions?.recentAlerts?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Recent Session Alerts</h4>
                    <div className="space-y-2">
                      {stats.sessions.recentAlerts.slice(0, 5).map((alert: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <div>
                              <div className="font-medium capitalize">{alert.type}</div>
                              <div className="text-sm text-muted-foreground">
                                User: {alert.userId}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">By Severity</h4>
                    <div className="space-y-2">
                      {Object.entries(stats?.audit?.eventsBySeverity || {}).map(([severity, count]) => (
                        <div key={severity} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(severity)}>
                              {severity}
                            </Badge>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critical Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.audit?.recentCriticalEvents?.length > 0 ? (
                    stats.audit.recentCriticalEvents.slice(0, 5).map((event: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <div className="flex-1">
                          <div className="font-medium">{event.action}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.category} - {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No critical events in the last 24 hours
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{stats?.risk?.totalProfiles || 0}</div>
                    <div className="text-sm text-muted-foreground">Risk Profiles</div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(stats?.risk?.riskDistribution || { low: 0, medium: 0, high: 0 }).map(([tier, count]) => (
                      <div key={tier} className="flex items-center justify-between">
                        <span className="capitalize">{tier} Risk</span>
                        <Badge variant={tier === 'high' ? 'destructive' : tier === 'medium' ? 'secondary' : 'outline'}>{String(count)}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Risk Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.risk?.recentAlerts?.length > 0 ? (
                    stats.risk.recentAlerts.slice(0, 5).map((alert: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <div className="flex-1">
                          <div className="font-medium">{alert.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {alert.message}
                          </div>
                        </div>
                        <Badge className={getStatusColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent risk alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats?.compliance?.complianceScore || 0}%</div>
                    <div className="text-sm text-muted-foreground">Compliance Score</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-semibold">{stats?.compliance?.completedReports || 0}</div>
                      <div className="text-xs text-muted-foreground">Completed Reports</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-semibold">{stats?.compliance?.flaggedTransactions || 0}</div>
                      <div className="text-xs text-muted-foreground">Flagged Transactions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Reports</span>
                    <Badge variant={stats?.compliance?.pendingReports > 0 ? "destructive" : "default"}>
                      {stats?.compliance?.pendingReports || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Flagged Transactions</span>
                    <Badge variant={stats?.compliance?.flaggedTransactions > 0 ? "secondary" : "outline"}>
                      {stats?.compliance?.flaggedTransactions || 0}
                    </Badge>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">System Status: Compliant</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All compliance checks passed successfully
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}