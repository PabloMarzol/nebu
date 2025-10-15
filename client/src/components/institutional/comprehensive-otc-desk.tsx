import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users,
  FileText,
  Shield,
  Zap,
  Target,
  BarChart3,
  Globe,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Settings,
  Database,
  Network
} from "lucide-react";

export default function ComprehensiveOTCDesk() {
  const [activeTab, setActiveTab] = useState("rfq");
  const [tradeSize, setTradeSize] = useState("");
  const [settlement, setSettlement] = useState("crypto");

  const otcManagers = [
    {
      id: "mgr_001",
      name: "Sarah Chen",
      specialization: "Digital Assets",
      experience: "8 years",
      languages: ["English", "Mandarin", "Japanese"],
      timezone: "Asia/Singapore",
      status: "Available",
      activeClients: 23,
      volumeYTD: "$2.4B"
    },
    {
      id: "mgr_002", 
      name: "Marcus Rodriguez",
      specialization: "Institutional Trading",
      experience: "12 years",
      languages: ["English", "Spanish", "Portuguese"],
      timezone: "America/New_York",
      status: "In Meeting",
      activeClients: 31,
      volumeYTD: "$3.1B"
    },
    {
      id: "mgr_003",
      name: "Elena Volkov",
      specialization: "Derivatives & Structured Products",
      experience: "10 years", 
      languages: ["English", "Russian", "German"],
      timezone: "Europe/London",
      status: "Available",
      activeClients: 18,
      volumeYTD: "$1.8B"
    }
  ];

  const activeRFQs = [
    {
      id: "RFQ-2024-001",
      client: "Genesis Capital",
      asset: "BTC",
      side: "Buy",
      quantity: "100 BTC",
      indicativePrice: "$42,500",
      deadline: "2024-01-25 15:00 UTC",
      status: "Pending Quote",
      priority: "High"
    },
    {
      id: "RFQ-2024-002",
      client: "Alameda Research",
      asset: "ETH", 
      side: "Sell",
      quantity: "5,000 ETH",
      indicativePrice: "$2,800",
      deadline: "2024-01-25 16:30 UTC",
      status: "Quoted",
      priority: "Medium"
    },
    {
      id: "RFQ-2024-003",
      client: "Cumberland DRW",
      asset: "SOL",
      side: "Buy", 
      quantity: "50,000 SOL",
      indicativePrice: "$95.50",
      deadline: "2024-01-25 14:00 UTC",
      status: "Negotiating",
      priority: "Critical"
    }
  ];

  const blockTrades = [
    {
      id: "BLK-001",
      counterparty: "Jump Trading",
      asset: "BTC",
      quantity: "250 BTC",
      executionPrice: "$42,750",
      timestamp: "2024-01-25 09:30:15",
      settlement: "T+0",
      fees: "0.15%",
      status: "Settled"
    },
    {
      id: "BLK-002",
      counterparty: "Galaxy Digital",
      asset: "ETH",
      quantity: "10,000 ETH", 
      executionPrice: "$2,785",
      timestamp: "2024-01-25 11:45:22",
      settlement: "T+1",
      fees: "0.18%",
      status: "Settling"
    },
    {
      id: "BLK-003",
      counterparty: "Wintermute Trading",
      asset: "USDC",
      quantity: "$5,000,000 USDC",
      executionPrice: "$1.0001",
      timestamp: "2024-01-25 13:22:45", 
      settlement: "T+0",
      fees: "0.05%",
      status: "Executed"
    }
  ];

  const fixConnections = [
    {
      id: "FIX-001",
      venue: "B2C2",
      protocol: "FIX 4.4",
      status: "Connected",
      latency: "2.3ms",
      messagesPerSecond: "1,250",
      lastHeartbeat: "30 seconds ago"
    },
    {
      id: "FIX-002",
      venue: "Genesis Trading",
      protocol: "FIX 5.0",
      status: "Connected", 
      latency: "1.8ms",
      messagesPerSecond: "2,100",
      lastHeartbeat: "15 seconds ago"
    },
    {
      id: "FIX-003",
      venue: "Jump Trading",
      protocol: "FIX 4.4",
      status: "Disconnected",
      latency: "N/A",
      messagesPerSecond: "0",
      lastHeartbeat: "5 minutes ago"
    }
  ];

  const colocationServices = [
    {
      location: "Equinix NY4",
      region: "New York",
      latency: "< 0.5ms",
      capacity: "10 Gbps",
      utilization: "67%",
      status: "Active",
      monthlyFee: "$15,000"
    },
    {
      location: "Digital Realty LON2",
      region: "London",
      latency: "< 0.8ms", 
      capacity: "10 Gbps",
      utilization: "45%",
      status: "Active",
      monthlyFee: "£12,000"
    },
    {
      location: "GDS Singapore",
      region: "Singapore",
      latency: "< 1.2ms",
      capacity: "5 Gbps", 
      utilization: "32%",
      status: "Provisioning",
      monthlyFee: "S$18,000"
    }
  ];

  const settlementOptions = [
    { id: "crypto", name: "Cryptocurrency", description: "Direct crypto settlement", time: "Instant - 1 hour" },
    { id: "fiat", name: "Fiat Currency", description: "USD, EUR, GBP settlement", time: "T+1 - T+3" },
    { id: "stablecoin", name: "Stablecoin", description: "USDT, USDC settlement", time: "Instant - 30 minutes" },
    { id: "mixed", name: "Mixed Settlement", description: "Crypto vs Fiat", time: "T+0 - T+1" }
  ];

  const institutionalPricing = {
    tier1: { volume: "$10M+", makerFee: "0.05%", takerFee: "0.10%" },
    tier2: { volume: "$50M+", makerFee: "0.03%", takerFee: "0.08%" },
    tier3: { volume: "$100M+", makerFee: "0.02%", takerFee: "0.06%" },
    tier4: { volume: "$500M+", makerFee: "0.01%", takerFee: "0.04%" }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'connected': case 'active': case 'settled': case 'available': return 'bg-green-500';
      case 'quoted': case 'settling': case 'in meeting': case 'provisioning': return 'bg-yellow-500';
      case 'pending quote': case 'negotiating': case 'executed': return 'bg-blue-500';
      case 'disconnected': case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* OTC Desk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Daily Volume</p>
                <p className="text-2xl font-bold text-white">$145.7M</p>
                <p className="text-xs text-green-400">+23.4% vs yesterday</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active RFQs</p>
                <p className="text-2xl font-bold text-white">{activeRFQs.length}</p>
                <p className="text-xs text-blue-400">Response time: 45s avg</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Block Trades</p>
                <p className="text-2xl font-bold text-white">{blockTrades.length}</p>
                <p className="text-xs text-purple-400">Avg size: $12.5M</p>
              </div>
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">FIX Connections</p>
                <p className="text-2xl font-bold text-white">2/3</p>
                <p className="text-xs text-yellow-400">1 reconnecting</p>
              </div>
              <Network className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="rfq">RFQ System</TabsTrigger>
          <TabsTrigger value="block-trading">Block Trading</TabsTrigger>
          <TabsTrigger value="managers">Account Managers</TabsTrigger>
          <TabsTrigger value="fix-protocol">FIX Protocol</TabsTrigger>
          <TabsTrigger value="colocation">Co-location</TabsTrigger>
          <TabsTrigger value="pricing">Institutional Pricing</TabsTrigger>
        </TabsList>

        {/* Request for Quote (RFQ) System */}
        <TabsContent value="rfq">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submit RFQ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                        <SelectItem value="sol">Solana (SOL)</SelectItem>
                        <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Side</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Buy/Sell" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    placeholder="Enter quantity"
                    value={tradeSize}
                    onChange={(e) => setTradeSize(e.target.value)}
                    className="bg-black/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Settlement Preference</Label>
                  <Select value={settlement} onValueChange={setSettlement}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settlementOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-400">
                    {settlementOptions.find(o => o.id === settlement)?.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Additional Instructions</Label>
                  <Textarea 
                    placeholder="Special settlement instructions, timing requirements..."
                    className="bg-black/30"
                  />
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Submit RFQ
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Active RFQs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeRFQs.map((rfq) => (
                    <div key={rfq.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{rfq.id}</Badge>
                          <Badge className={
                            rfq.priority === 'Critical' ? 'bg-red-500' :
                            rfq.priority === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                          }>
                            {rfq.priority}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(rfq.status)}>
                          {rfq.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Client</p>
                          <p className="text-white">{rfq.client}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Trade</p>
                          <p className="text-white">{rfq.side} {rfq.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Indicative Price</p>
                          <p className="text-white">{rfq.indicativePrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Deadline</p>
                          <p className="text-white">{rfq.deadline}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Block Trading */}
        <TabsContent value="block-trading">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Large Block Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blockTrades.map((trade) => (
                  <div key={trade.id} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{trade.id}</Badge>
                        <span className="text-white font-medium">{trade.counterparty}</span>
                      </div>
                      <Badge className={getStatusColor(trade.status)}>
                        {trade.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Asset & Quantity</p>
                        <p className="text-white">{trade.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Execution Price</p>
                        <p className="text-white">{trade.executionPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Settlement</p>
                        <p className="text-white">{trade.settlement}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Fees</p>
                        <p className="text-white">{trade.fees}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dedicated Account Managers */}
        <TabsContent value="managers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otcManagers.map((manager) => (
              <Card key={manager.id} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{manager.name}</span>
                    <Badge className={getStatusColor(manager.status)}>
                      {manager.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Specialization</p>
                    <p className="text-white">{manager.specialization}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Experience</p>
                    <p className="text-white">{manager.experience}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Languages</p>
                    <p className="text-white">{manager.languages.join(", ")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Active Clients</p>
                      <p className="text-white">{manager.activeClients}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">YTD Volume</p>
                      <p className="text-white">{manager.volumeYTD}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FIX Protocol Support */}
        <TabsContent value="fix-protocol">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="h-5 w-5" />
                FIX Protocol Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fixConnections.map((connection) => (
                  <div key={connection.id} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{connection.venue}</span>
                        <Badge variant="outline">{connection.protocol}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(connection.status)}>
                          {connection.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Latency</p>
                        <p className="text-white">{connection.latency}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Messages/sec</p>
                        <p className="text-white">{connection.messagesPerSecond}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Last Heartbeat</p>
                        <p className="text-white">{connection.lastHeartbeat}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Connection ID</p>
                        <p className="text-white">{connection.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Co-location Services */}
        <TabsContent value="colocation">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5" />
                Co-location Services for HFT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colocationServices.map((service, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{service.location}</span>
                        <Badge variant="outline">{service.region}</Badge>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Latency</p>
                        <p className="text-white">{service.latency}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Capacity</p>
                        <p className="text-white">{service.capacity}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Utilization</p>
                        <div className="flex items-center gap-2">
                          <Progress value={parseInt(service.utilization)} className="w-16" />
                          <span className="text-white">{service.utilization}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">Monthly Fee</p>
                        <p className="text-white">{service.monthlyFee}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Institutional Pricing */}
        <TabsContent value="pricing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Custom Fee Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(institutionalPricing).map(([tier, pricing]) => (
                    <div key={tier} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium capitalize">{tier}</span>
                        <Badge variant="outline">{pricing.volume}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Maker Fee</p>
                          <p className="text-green-400">{pricing.makerFee}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Taker Fee</p>
                          <p className="text-white">{pricing.takerFee}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Settlement Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settlementOptions.map((option) => (
                    <div key={option.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="text-white font-medium mb-2">{option.name}</h4>
                      <p className="text-gray-400 text-sm mb-2">{option.description}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-400 text-sm">{option.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}