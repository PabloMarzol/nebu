import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { 
  Handshake,
  Shield,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Building,
  Globe,
  Phone,
  MessageSquare,
  FileText,
  Calendar,
  ArrowRightLeft,
  Target,
  Award,
  Settings,
  Filter,
  Search,
  Bell,
  Crown
} from "lucide-react";

interface OTCDeal {
  id: string;
  type: "buy" | "sell";
  asset: string;
  amount: string;
  price: string;
  totalValue: string;
  counterparty: string;
  counterpartyRating: number;
  status: "pending" | "matched" | "executing" | "completed" | "cancelled";
  visibility: "public" | "private" | "verified_only";
  minCounterpartyRating: number;
  expires: string;
  created: string;
  fees: string;
  escrowRequired: boolean;
  requiresKYC: boolean;
  institutionalOnly: boolean;
  notes?: string;
  terms?: string;
}

interface OTCCounterparty {
  id: string;
  name: string;
  type: "individual" | "institution" | "market_maker" | "hedge_fund";
  rating: number;
  completedDeals: number;
  totalVolume: string;
  averageSize: string;
  responseTime: string;
  verified: boolean;
  kycCompleted: boolean;
  location: string;
  avatar: string;
  preferredAssets: string[];
  minDealSize: string;
  maxDealSize: string;
  isOnline: boolean;
  lastSeen: string;
}

interface OTCOrder {
  id: string;
  type: "buy" | "sell";
  asset: string;
  quantity: string;
  priceType: "market" | "limit" | "negotiable";
  limitPrice?: string;
  totalValue: string;
  urgency: "low" | "medium" | "high";
  visibility: "public" | "private" | "institutional";
  minCounterpartyRating: number;
  maxSlippage: number;
  splitAllowed: boolean;
  expires: string;
  status: "active" | "matched" | "cancelled" | "completed";
  description?: string;
}

export default function OTCTrading() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [selectedDeal, setSelectedDeal] = useState<string>("");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [searchQuery, setSearchQuery] = useState("");

  const [otcDeals, setOtcDeals] = useState<OTCDeal[]>([
    {
      id: "deal1",
      type: "sell",
      asset: "BTC",
      amount: "50.0",
      price: "$67,500",
      totalValue: "$3,375,000",
      counterparty: "Institutional Trader",
      counterpartyRating: 9.8,
      status: "pending",
      visibility: "verified_only",
      minCounterpartyRating: 8.0,
      expires: "2 days",
      created: "30 minutes ago",
      fees: "$3,375",
      escrowRequired: true,
      requiresKYC: true,
      institutionalOnly: true,
      notes: "Large block trade, prefer single counterparty"
    },
    {
      id: "deal2",
      type: "buy",
      asset: "ETH",
      amount: "1,000",
      price: "$3,250",
      totalValue: "$3,250,000",
      counterparty: "Hedge Fund Alpha",
      counterpartyRating: 9.5,
      status: "matched",
      visibility: "private",
      minCounterpartyRating: 7.5,
      expires: "1 day",
      created: "2 hours ago",
      fees: "$3,250",
      escrowRequired: true,
      requiresKYC: true,
      institutionalOnly: false
    },
    {
      id: "deal3",
      type: "sell",
      asset: "SOL",
      amount: "25,000",
      price: "$142.50",
      totalValue: "$3,562,500",
      counterparty: "Market Maker Pro",
      counterpartyRating: 9.2,
      status: "executing",
      visibility: "public",
      minCounterpartyRating: 6.0,
      expires: "6 hours",
      created: "4 hours ago",
      fees: "$3,562",
      escrowRequired: false,
      requiresKYC: false,
      institutionalOnly: false
    }
  ]);

  const [counterparties, setCounterparties] = useState<OTCCounterparty[]>([
    {
      id: "cp1",
      name: "Goldman Digital Assets",
      type: "institution",
      rating: 9.8,
      completedDeals: 847,
      totalVolume: "$2.4B",
      averageSize: "$2.8M",
      responseTime: "< 5 min",
      verified: true,
      kycCompleted: true,
      location: "New York, US",
      avatar: "/api/placeholder/40/40",
      preferredAssets: ["BTC", "ETH", "SOL"],
      minDealSize: "$1M",
      maxDealSize: "$50M",
      isOnline: true,
      lastSeen: "Active now"
    },
    {
      id: "cp2",
      name: "Crypto Whale Ventures",
      type: "hedge_fund",
      rating: 9.5,
      completedDeals: 623,
      totalVolume: "$1.8B",
      averageSize: "$2.9M",
      responseTime: "< 10 min",
      verified: true,
      kycCompleted: true,
      location: "London, UK",
      avatar: "/api/placeholder/40/40",
      preferredAssets: ["BTC", "ETH", "MATIC", "AVAX"],
      minDealSize: "$500K",
      maxDealSize: "$25M",
      isOnline: true,
      lastSeen: "2 minutes ago"
    },
    {
      id: "cp3",
      name: "Sovereign Wealth Digital",
      type: "institution",
      rating: 9.9,
      completedDeals: 234,
      totalVolume: "$5.2B",
      averageSize: "$22.2M",
      responseTime: "< 15 min",
      verified: true,
      kycCompleted: true,
      location: "Singapore",
      avatar: "/api/placeholder/40/40",
      preferredAssets: ["BTC", "ETH"],
      minDealSize: "$10M",
      maxDealSize: "$100M",
      isOnline: false,
      lastSeen: "1 hour ago"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "matched": return "bg-blue-500";
      case "executing": return "bg-purple-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "institution": return "text-blue-400";
      case "hedge_fund": return "text-purple-400";
      case "market_maker": return "text-green-400";
      case "individual": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "institution": return "🏛️";
      case "hedge_fund": return "📈";
      case "market_maker": return "🎯";
      case "individual": return "👤";
      default: return "🏢";
    }
  };

  const OTCDealCard = ({ deal }: { deal: OTCDeal }) => (
    <Card className="glass-strong hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${deal.type === "buy" ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">
                  {deal.type.toUpperCase()} {deal.asset}
                </CardTitle>
                {deal.institutionalOnly && <Crown className="w-4 h-4 text-yellow-400" />}
                {deal.requiresKYC && <Shield className="w-4 h-4 text-blue-400" />}
              </div>
              <p className="text-sm text-muted-foreground">{deal.amount} {deal.asset}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(deal.status)}>
              {deal.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {deal.visibility === "public" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Price and Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Price per Unit</p>
            <p className="text-xl font-bold text-green-400">{deal.price}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-xl font-bold">{deal.totalValue}</p>
          </div>
        </div>

        {/* Counterparty Info */}
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{deal.counterparty}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xs ${i < Math.floor(deal.counterpartyRating) ? "text-yellow-400" : "text-gray-600"}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {deal.counterpartyRating}/10
                </span>
              </div>
            </div>
            <Badge variant="outline">
              Min Rating: {deal.minCounterpartyRating}
            </Badge>
          </div>
        </div>

        {/* Deal Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Expires</p>
            <p className="font-semibold flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {deal.expires}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Fees</p>
            <p className="font-semibold">{deal.fees}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Escrow</p>
            <p className="font-semibold flex items-center">
              {deal.escrowRequired ? (
                <>
                  <Lock className="w-3 h-3 mr-1 text-green-400" />
                  Required
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3 mr-1 text-yellow-400" />
                  Optional
                </>
              )}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-semibold">{deal.created}</p>
          </div>
        </div>

        {/* Notes */}
        {deal.notes && (
          <div className="p-2 bg-gray-500/10 rounded text-sm">
            <p className="text-muted-foreground mb-1">Notes:</p>
            <p>{deal.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {deal.status === "pending" && (
            <>
              <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Handshake className="w-4 h-4 mr-2" />
                {deal.type === "buy" ? "Sell to" : "Buy from"}
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </>
          )}
          {deal.status === "matched" && (
            <Button className="flex-1 bg-green-500 hover:bg-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Execute Trade
            </Button>
          )}
          {deal.status === "executing" && (
            <Button className="flex-1" disabled>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              In Progress...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CounterpartyCard = ({ counterparty }: { counterparty: OTCCounterparty }) => (
    <Card className="glass hover:border-purple-400/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={counterparty.avatar} alt={counterparty.name} />
                <AvatarFallback>{counterparty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                counterparty.isOnline ? "bg-green-500" : "bg-gray-500"
              }`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{counterparty.name}</h3>
                {counterparty.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs">{getTypeIcon(counterparty.type)}</span>
                <span className={`text-xs ${getTypeColor(counterparty.type)}`}>
                  {counterparty.type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{counterparty.location}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-xs ${i < Math.floor(counterparty.rating) ? "text-yellow-400" : "text-gray-600"}`}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{counterparty.rating}/10</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Completed Deals</p>
            <p className="font-semibold">{counterparty.completedDeals}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Volume</p>
            <p className="font-semibold text-green-400">{counterparty.totalVolume}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Deal Size</p>
            <p className="font-semibold">{counterparty.averageSize}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Response Time</p>
            <p className="font-semibold">{counterparty.responseTime}</p>
          </div>
        </div>

        <div className="mt-3 p-2 bg-purple-500/10 rounded">
          <p className="text-xs text-muted-foreground mb-1">Deal Range</p>
          <p className="text-sm font-semibold">{counterparty.minDealSize} - {counterparty.maxDealSize}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {counterparty.preferredAssets.map((asset) => (
            <Badge key={asset} variant="outline" className="text-xs">
              {asset}
            </Badge>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <Button size="sm" className="flex-1">
            <MessageSquare className="w-3 h-3 mr-1" />
            Contact
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="w-3 h-3" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Last seen: {counterparty.lastSeen}
        </p>
      </CardContent>
    </Card>
  );

  const CreateOTCOrder = () => (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Create OTC Order</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Order Type</Label>
            <Select value={orderType} onValueChange={(value: "buy" | "sell") => setOrderType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Asset</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
                <SelectItem value="MATIC">Polygon (MATIC)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Quantity</Label>
            <Input placeholder="0.00" type="number" />
          </div>
          <div>
            <Label>Price Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select price type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Price</SelectItem>
                <SelectItem value="limit">Limit Price</SelectItem>
                <SelectItem value="negotiable">Negotiable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Limit Price (if applicable)</Label>
          <Input placeholder="$0.00" type="number" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Minimum Counterparty Rating</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5.0+</SelectItem>
                <SelectItem value="6">6.0+</SelectItem>
                <SelectItem value="7">7.0+</SelectItem>
                <SelectItem value="8">8.0+</SelectItem>
                <SelectItem value="9">9.0+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Visibility</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="institutional">Institutional Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="escrow" />
            <Label htmlFor="escrow">Require Escrow</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="kyc" />
            <Label htmlFor="kyc">KYC Required</Label>
          </div>
        </div>

        <div>
          <Label>Additional Notes</Label>
          <Textarea placeholder="Any special requirements or notes..." />
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
          Create OTC Order
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen page-content">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            OTC Trading Platform
          </h1>
          <p className="text-xl text-muted-foreground">
            Institutional-grade over-the-counter trading for large volume transactions
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Handshake className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Active Deals</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold">$2.8B</p>
                <p className="text-sm text-muted-foreground">24h Volume</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">456</p>
                <p className="text-sm text-muted-foreground">Verified Traders</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <p className="text-2xl font-bold">8.5m</p>
                <p className="text-sm text-muted-foreground">Avg Settlement</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="create">Create Order</TabsTrigger>
            <TabsTrigger value="counterparties">Counterparties</TabsTrigger>
            <TabsTrigger value="my-deals">My Deals</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Filters */}
            <Card className="glass">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search deals by asset, counterparty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assets</SelectItem>
                      <SelectItem value="BTC">Bitcoin</SelectItem>
                      <SelectItem value="ETH">Ethereum</SelectItem>
                      <SelectItem value="SOL">Solana</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="buy">Buy Orders</SelectItem>
                      <SelectItem value="sell">Sell Orders</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="matched">Matched</SelectItem>
                      <SelectItem value="executing">Executing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {otcDeals.map((deal) => (
                <OTCDealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <CreateOTCOrder />
          </TabsContent>

          <TabsContent value="counterparties" className="space-y-6">
            {/* Counterparty Filters */}
            <Card className="glass">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search counterparties..." className="pl-10" />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="institution">Institutions</SelectItem>
                      <SelectItem value="hedge_fund">Hedge Funds</SelectItem>
                      <SelectItem value="market_maker">Market Makers</SelectItem>
                      <SelectItem value="individual">Individuals</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="9">9.0+ Stars</SelectItem>
                      <SelectItem value="8">8.0+ Stars</SelectItem>
                      <SelectItem value="7">7.0+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="text-green-400">
                    • Online Only
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Counterparties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {counterparties.map((counterparty) => (
                <CounterpartyCard key={counterparty.id} counterparty={counterparty} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-deals" className="space-y-6">
            {/* My Deals Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <p className="text-2xl font-bold">487</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold">$125M</p>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Deals */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {otcDeals.slice(0, 2).map((deal) => (
                    <div key={deal.id} className="p-4 border rounded-lg glass">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge className={deal.type === "buy" ? "bg-green-500" : "bg-red-500"}>
                              {deal.type.toUpperCase()}
                            </Badge>
                            <span className="font-semibold">{deal.asset}</span>
                            <Badge className={getStatusColor(deal.status)}>
                              {deal.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {deal.amount} {deal.asset} @ {deal.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{deal.totalValue}</p>
                          <p className="text-sm text-muted-foreground">{deal.created}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}