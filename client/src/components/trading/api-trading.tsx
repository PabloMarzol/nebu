import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Copy, Key, Eye, EyeOff, Code, Activity } from "lucide-react";

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed: string;
  status: "active" | "disabled";
}

export default function APITrading() {
  const [showKey, setShowKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const apiKeys: APIKey[] = [
    {
      id: "1",
      name: "Trading Bot Alpha",
      key: "nx_live_k1j2h3g4f5d6s7a8q9w0e1r2t3y4u5i6o7p8",
      permissions: ["spot_trading", "futures_trading", "read_account"],
      created: "2024-12-01",
      lastUsed: "2024-12-10 14:32:15",
      status: "active"
    },
    {
      id: "2", 
      name: "Portfolio Monitor",
      key: "nx_live_a9s8d7f6g5h4j3k2l1z0x9c8v7b6n5m4q3w2",
      permissions: ["read_account", "read_portfolio"],
      created: "2024-11-15",
      lastUsed: "2024-12-10 16:45:23",
      status: "active"
    }
  ];

  const availablePermissions = [
    { id: "read_account", name: "Read Account", description: "View account balance and info" },
    { id: "read_portfolio", name: "Read Portfolio", description: "View portfolio positions" },
    { id: "spot_trading", name: "Spot Trading", description: "Place and cancel spot orders" },
    { id: "futures_trading", name: "Futures Trading", description: "Place and cancel futures orders" },
    { id: "margin_trading", name: "Margin Trading", description: "Access margin trading features" },
    { id: "withdrawals", name: "Withdrawals", description: "Initiate cryptocurrency withdrawals" }
  ];

  const apiUsageStats = {
    totalRequests: "1,245,678",
    successRate: "99.97%",
    avgLatency: "12ms",
    rateLimit: "1200/min"
  };

  return (
    <div className="space-y-6">
      {/* API Overview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <span>API Trading</span>
            <Badge variant="outline" className="text-xs">INSTITUTIONAL</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{apiUsageStats.totalRequests}</div>
              <div className="text-sm text-muted-foreground">API Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{apiUsageStats.successRate}</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{apiUsageStats.avgLatency}</div>
              <div className="text-sm text-muted-foreground">Avg Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{apiUsageStats.rateLimit}</div>
              <div className="text-sm text-muted-foreground">Rate Limit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys Management */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span className="font-semibold">{apiKey.name}</span>
                    <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                      {apiKey.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => setShowKey(!showKey)}>
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="font-mono text-sm bg-muted/20 p-2 rounded">
                  {showKey ? apiKey.key : "•".repeat(32) + apiKey.key.slice(-8)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Created</div>
                    <div>{apiKey.created}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Last Used</div>
                    <div>{apiKey.lastUsed}</div>
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground text-sm mb-2">Permissions</div>
                  <div className="flex flex-wrap gap-1">
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Revoke</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Create New API Key */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Key</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Key Name</Label>
                    <Input
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Trading Bot, Portfolio Monitor"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Permissions</Label>
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="font-semibold text-sm">{permission.name}</div>
                          <div className="text-xs text-muted-foreground">{permission.description}</div>
                        </div>
                        <Switch
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPermissions([...selectedPermissions, permission.id]);
                            } else {
                              setSelectedPermissions(selectedPermissions.filter(p => p !== permission.id));
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="text-sm font-semibold text-yellow-400 mb-1">Security Notice</div>
                    <div className="text-xs text-yellow-200">
                      API keys provide programmatic access to your account. Store them securely and never share them publicly.
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={!newKeyName || selectedPermissions.length === 0}
                  >
                    Generate API Key
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="docs" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">REST API Endpoint</h4>
                    <code className="text-sm bg-black/20 p-2 rounded block">
                      https://api.nebulaxexchange.io/v1/
                    </code>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">WebSocket Endpoint</h4>
                    <code className="text-sm bg-black/20 p-2 rounded block">
                      wss://ws.nebulaxexchange.io/v1/stream
                    </code>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Sample Code</h4>
                    <div className="bg-black/40 p-4 rounded-lg font-mono text-sm">
                      <div className="text-green-400"># Python Example</div>
                      <div className="text-gray-300">import requests</div>
                      <div className="text-gray-300">
                        headers = {'{'}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;'X-API-Key': 'your_api_key',
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'
                        <br />
                        {'}'}
                      </div>
                      <div className="text-gray-300">
                        response = requests.get(
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;'https://api.nebulaxexchange.io/v1/account',
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;headers=headers
                        <br />
                        )
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Rate Limits</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted/20 rounded">
                        <div className="font-semibold">REST API</div>
                        <div className="text-muted-foreground">1200 requests/minute</div>
                      </div>
                      <div className="p-3 bg-muted/20 rounded">
                        <div className="font-semibold">WebSocket</div>
                        <div className="text-muted-foreground">10 connections/IP</div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Full Documentation
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* API Activity Monitor */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Real-time API Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { method: "GET", endpoint: "/v1/portfolio", status: 200, latency: "15ms", time: "14:32:45", key: "Trading Bot Alpha" },
              { method: "POST", endpoint: "/v1/orders", status: 201, latency: "23ms", time: "14:32:43", key: "Trading Bot Alpha" },
              { method: "GET", endpoint: "/v1/markets/BTCUSDT", status: 200, latency: "8ms", time: "14:32:41", key: "Portfolio Monitor" },
              { method: "DELETE", endpoint: "/v1/orders/12345", status: 200, latency: "19ms", time: "14:32:39", key: "Trading Bot Alpha" },
              { method: "GET", endpoint: "/v1/account/balance", status: 200, latency: "12ms", time: "14:32:37", key: "Portfolio Monitor" },
            ].map((request, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg font-mono text-sm">
                <div className="flex items-center space-x-4">
                  <Badge variant={request.method === 'GET' ? 'outline' : request.method === 'POST' ? 'default' : 'secondary'}>
                    {request.method}
                  </Badge>
                  <span>{request.endpoint}</span>
                  <Badge variant={request.status === 200 || request.status === 201 ? 'default' : 'destructive'}>
                    {request.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <span>{request.latency}</span>
                  <span>{request.time}</span>
                  <span className="text-xs">{request.key}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}