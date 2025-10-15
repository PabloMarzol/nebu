import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, TrendingUp, Shield, Globe, Zap, BarChart3, DollarSign } from "lucide-react";

export default function InstitutionalDashboard() {
  const [selectedMetric, setSelectedMetric] = useState("volume");

  const institutionalMetrics = {
    totalAUM: "2.4B",
    dailyVolume: "456M",
    activeClients: "1,247",
    avgTicketSize: "125K",
    uptime: "99.98%",
    latency: "0.8ms"
  };

  const clientTiers = [
    { name: "Hedge Funds", count: 84, volume: "1.2B", color: "purple" },
    { name: "Asset Managers", count: 156, volume: "780M", color: "blue" },
    { name: "Trading Firms", count: 203, volume: "425M", color: "green" },
    { name: "Family Offices", count: 89, volume: "156M", color: "orange" },
    { name: "Pension Funds", count: 45, volume: "98M", color: "cyan" }
  ];

  const performanceData = [
    { period: "1D", volume: "456M", trades: "125K", clients: "1,247", pnl: "+2.4%" },
    { period: "7D", volume: "3.2B", trades: "892K", clients: "1,389", pnl: "+18.7%" },
    { period: "30D", volume: "12.8B", trades: "3.2M", clients: "1,456", pnl: "+127.3%" },
    { period: "90D", volume: "38.4B", trades: "9.8M", clients: "1,523", pnl: "+445.2%" }
  ];

  const riskMetrics = {
    var95: "12.4M",
    exposureLimit: "85%",
    leverageRatio: "4.2x",
    liquidityRatio: "92%",
    concentrationRisk: "Low"
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-xs text-muted-foreground">AUM</span>
            </div>
            <div className="text-xl font-bold">${institutionalMetrics.totalAUM}</div>
            <div className="text-xs text-green-400">+12.4% YTD</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">24h Volume</span>
            </div>
            <div className="text-xl font-bold">${institutionalMetrics.dailyVolume}</div>
            <div className="text-xs text-blue-400">+8.2% vs avg</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Active Clients</span>
            </div>
            <div className="text-xl font-bold">{institutionalMetrics.activeClients}</div>
            <div className="text-xs text-purple-400">+5.2% MoM</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-muted-foreground">Avg Ticket</span>
            </div>
            <div className="text-xl font-bold">${institutionalMetrics.avgTicketSize}</div>
            <div className="text-xs text-orange-400">+15.7% vs LY</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Uptime</span>
            </div>
            <div className="text-xl font-bold">{institutionalMetrics.uptime}</div>
            <div className="text-xs text-green-400">SLA: 99.95%</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Latency</span>
            </div>
            <div className="text-xl font-bold">{institutionalMetrics.latency}</div>
            <div className="text-xs text-cyan-400">Target: &lt;1ms</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Distribution */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Client Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientTiers.map((tier, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${tier.color}-400`} />
                    <span className="font-semibold">{tier.name}</span>
                    <Badge variant="outline" className="text-xs">{tier.count}</Badge>
                  </div>
                  <span className="font-mono text-sm">${tier.volume}</span>
                </div>
                <Progress 
                  value={(parseFloat(tier.volume.replace(/[^0-9.]/g, '')) / 1200) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Risk Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-xs text-muted-foreground">VaR (95%)</div>
                <div className="text-lg font-bold">${riskMetrics.var95}</div>
                <div className="text-xs text-green-400">Within limits</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-xs text-muted-foreground">Exposure</div>
                <div className="text-lg font-bold">{riskMetrics.exposureLimit}</div>
                <div className="text-xs text-orange-400">of limit used</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-xs text-muted-foreground">Leverage</div>
                <div className="text-lg font-bold">{riskMetrics.leverageRatio}</div>
                <div className="text-xs text-blue-400">Optimal range</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-xs text-muted-foreground">Liquidity</div>
                <div className="text-lg font-bold">{riskMetrics.liquidityRatio}</div>
                <div className="text-xs text-green-400">Above minimum</div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Risk Assessment</span>
                <Badge variant="default" className="bg-green-600">LOW</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                All risk metrics within acceptable parameters. Portfolio diversification optimal.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {performanceData.map((period, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="font-semibold text-center mb-3">{period.period}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume:</span>
                        <span className="font-mono">${period.volume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trades:</span>
                        <span className="font-mono">{period.trades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clients:</span>
                        <span className="font-mono">{period.clients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">P&L:</span>
                        <span className="font-mono text-green-400">{period.pnl}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trading" className="space-y-4">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Top Trading Pairs</h4>
                  {[
                    { pair: "BTC/USDT", volume: "156M", share: "34%" },
                    { pair: "ETH/USDT", volume: "98M", share: "21%" },
                    { pair: "BTC/ETH", volume: "78M", share: "17%" },
                    { pair: "SOL/USDT", volume: "45M", share: "10%" }
                  ].map((pair, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/10 rounded">
                      <span className="font-mono">{pair.pair}</span>
                      <div className="text-right">
                        <div className="font-semibold">${pair.volume}</div>
                        <div className="text-xs text-muted-foreground">{pair.share}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Order Types</h4>
                  {[
                    { type: "Market", count: "45,234", percent: "36%" },
                    { type: "Limit", count: "67,890", percent: "54%" },
                    { type: "Stop Loss", count: "8,945", percent: "7%" },
                    { type: "Advanced", count: "3,567", percent: "3%" }
                  ].map((order, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/10 rounded">
                      <span>{order.type}</span>
                      <div className="text-right">
                        <div className="font-semibold">{order.count}</div>
                        <div className="text-xs text-muted-foreground">{order.percent}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Settlement</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                      <div className="font-semibold text-green-400">T+0 Settlement</div>
                      <div className="text-sm text-muted-foreground">Instant settlement for 98.7% of trades</div>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                      <div className="font-semibold text-blue-400">Cross-Margin</div>
                      <div className="text-sm text-muted-foreground">Advanced portfolio margining available</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Client Onboarding</h4>
                  <div className="space-y-3">
                    {[
                      { stage: "KYC Verification", completed: 156, pending: 23, time: "2.3 days" },
                      { stage: "Legal Documentation", completed: 134, pending: 45, time: "3.1 days" },
                      { stage: "Technical Integration", completed: 128, pending: 51, time: "4.7 days" },
                      { stage: "Go-Live", completed: 119, pending: 60, time: "6.2 days" }
                    ].map((stage, index) => (
                      <div key={index} className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm">{stage.stage}</span>
                          <span className="text-xs text-muted-foreground">Avg: {stage.time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">Completed: {stage.completed}</span>
                          <span className="text-orange-400">Pending: {stage.pending}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Client Support</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">4.9</div>
                      <div className="text-xs text-muted-foreground">Satisfaction Score</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">15min</div>
                      <div className="text-xs text-muted-foreground">Avg Response Time</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-400">99.2%</div>
                      <div className="text-xs text-muted-foreground">Resolution Rate</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">24/7</div>
                      <div className="text-xs text-muted-foreground">Support Coverage</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technology" className="space-y-4">
              <div className="grid grid-cols-3 gap-6">
                <Card className="bg-muted/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Infrastructure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs">CPU Usage</span>
                      <span className="text-xs font-mono">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                    <div className="flex justify-between">
                      <span className="text-xs">Memory</span>
                      <span className="text-xs font-mono">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="flex justify-between">
                      <span className="text-xs">Network I/O</span>
                      <span className="text-xs font-mono">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">125,000</div>
                      <div className="text-xs text-muted-foreground">Orders/sec</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">0.8ms</div>
                      <div className="text-xs text-muted-foreground">Avg Latency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">99.98%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">WAF Protection</span>
                      <Badge variant="default" className="text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">DDoS Mitigation</span>
                      <Badge variant="default" className="text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Pen Testing</span>
                      <Badge variant="outline" className="text-xs">Weekly</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Audit Trail</span>
                      <Badge variant="default" className="text-xs">100%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}