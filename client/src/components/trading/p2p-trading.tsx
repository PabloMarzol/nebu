import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { 
  Users, 
  ArrowUpDown, 
  Clock, 
  Shield, 
  Star,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Wallet,
  ArrowRight,
  RefreshCw,
  Zap,
  DollarSign,
  Bitcoin,
  Globe
} from "lucide-react";

interface P2POffer {
  id: string;
  trader: {
    name: string;
    username: string;
    avatar: string;
    rating: number;
    completedTrades: number;
    responseTime: string;
    isVerified: boolean;
    isOnline: boolean;
  };
  type: "buy" | "sell";
  crypto: string;
  fiat: string;
  price: number;
  minAmount: number;
  maxAmount: number;
  available: number;
  paymentMethods: string[];
  terms: string;
  timeLimit: string;
}

interface DepositOption {
  id: string;
  name: string;
  type: "crypto" | "fiat";
  icon: string;
  fee: string;
  time: string;
  minAmount: string;
  maxAmount: string;
  available: boolean;
}

export default function P2PTrading() {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");

  const [p2pOffers] = useState<P2POffer[]>([
    {
      id: "offer1",
      trader: {
        name: "CryptoMaster",
        username: "@cryptomaster",
        avatar: "/api/placeholder/40/40",
        rating: 4.9,
        completedTrades: 1247,
        responseTime: "2 min",
        isVerified: true,
        isOnline: true
      },
      type: "sell",
      crypto: "BTC",
      fiat: "USD",
      price: 67420,
      minAmount: 100,
      maxAmount: 5000,
      available: 2.5,
      paymentMethods: ["Bank Transfer", "PayPal", "Zelle"],
      terms: "Quick release after payment confirmation",
      timeLimit: "15 minutes"
    },
    {
      id: "offer2",
      trader: {
        name: "DigitalTrader",
        username: "@digitaltrader",
        avatar: "/api/placeholder/40/40",
        rating: 4.8,
        completedTrades: 892,
        responseTime: "5 min",
        isVerified: true,
        isOnline: true
      },
      type: "buy",
      crypto: "BTC",
      fiat: "USD",
      price: 67380,
      minAmount: 50,
      maxAmount: 2000,
      available: 1.8,
      paymentMethods: ["Bank Transfer", "Cash App"],
      terms: "Must provide payment proof",
      timeLimit: "30 minutes"
    }
  ]);

  const [depositOptions] = useState<DepositOption[]>([
    {
      id: "btc",
      name: "Bitcoin",
      type: "crypto",
      icon: "₿",
      fee: "0.0005 BTC",
      time: "10-60 min",
      minAmount: "0.001 BTC",
      maxAmount: "10 BTC",
      available: true
    },
    {
      id: "eth",
      name: "Ethereum",
      type: "crypto",
      icon: "Ξ",
      fee: "0.01 ETH",
      time: "5-30 min",
      minAmount: "0.01 ETH",
      maxAmount: "100 ETH",
      available: true
    },
    {
      id: "bank",
      name: "Bank Transfer",
      type: "fiat",
      icon: "🏦",
      fee: "$2.50",
      time: "1-3 days",
      minAmount: "$50",
      maxAmount: "$50,000",
      available: true
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      type: "fiat",
      icon: "💳",
      fee: "3.5%",
      time: "Instant",
      minAmount: "$20",
      maxAmount: "$2,000",
      available: true
    }
  ]);

  const P2POfferCard = ({ offer }: { offer: P2POffer }) => (
    <Card className="glass hover:border-purple-400/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={offer.trader.avatar} />
                <AvatarFallback>{offer.trader.name[0]}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-background ${
                offer.trader.isOnline ? "bg-green-500" : "bg-gray-500"
              }`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-semibold">{offer.trader.name}</p>
                {offer.trader.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                  {offer.trader.rating}
                </div>
                <span>•</span>
                <span>{offer.trader.completedTrades} trades</span>
                <span>•</span>
                <span>{offer.trader.responseTime}</span>
              </div>
            </div>
          </div>
          <Badge className={offer.type === "buy" ? "bg-green-500" : "bg-red-500"}>
            {offer.type.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-bold text-lg">${offer.price.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Available</span>
            <span className="font-semibold">{offer.available} {offer.crypto}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Limits</span>
            <span className="text-sm">${offer.minAmount} - ${offer.maxAmount}</span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Payment Methods</p>
            <div className="flex flex-wrap gap-1">
              {offer.paymentMethods.map((method, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {method}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-2 bg-gray-500/10 rounded text-xs">
            <p className="text-muted-foreground">Terms:</p>
            <p>{offer.terms}</p>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {offer.type === "buy" ? "Sell" : "Buy"} {offer.crypto}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const DepositCard = ({ option }: { option: DepositOption }) => (
    <Card className={`glass hover:border-purple-400/50 transition-all duration-300 ${
      !option.available ? "opacity-50" : ""
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">
            {option.icon}
          </div>
          <div>
            <h3 className="font-semibold">{option.name}</h3>
            <Badge variant="outline" className="text-xs">
              {option.type === "crypto" ? "Crypto" : "Fiat"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span className="font-semibold">{option.fee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="font-semibold">{option.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Limits</span>
            <span className="text-xs">{option.minAmount} - {option.maxAmount}</span>
          </div>
        </div>

        <Button 
          className="w-full mt-4" 
          disabled={!option.available}
          variant={option.available ? "default" : "secondary"}
        >
          {option.available ? (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Deposit {option.name}
            </>
          ) : (
            "Unavailable"
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const CryptoConverter = () => (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5" />
          <span>Instant Crypto Converter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex space-x-2">
              <Select defaultValue="BTC">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="0.00" 
                className="flex-1"
                type="number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <div className="flex space-x-2">
              <Select defaultValue="ETH">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="0.00" 
                className="flex-1"
                readOnly
                value="20.54"
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-500/10 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Exchange Rate</span>
            <span className="font-semibold">1 BTC = 20.54 ETH</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Network Fee</span>
            <span className="font-semibold">0.002 ETH</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Conversion Fee</span>
            <span className="font-semibold">0.1%</span>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
          <ArrowRight className="w-4 h-4 mr-2" />
          Convert Instantly
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          P2P Trading & Crypto Services
        </h2>
        <p className="text-muted-foreground">Direct peer-to-peer trading and instant crypto conversions</p>
      </div>

      <Tabs defaultValue="p2p" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass">
          <TabsTrigger value="p2p">P2P Trading</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
        </TabsList>

        <TabsContent value="p2p" className="space-y-6">
          {/* P2P Controls */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <Label>I want to</Label>
                  <Select value={tradeType} onValueChange={(value: "buy" | "sell") => setTradeType(value)}>
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
                  <Label>Crypto</Label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="SOL">Solana (SOL)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fiat</Label>
                  <Select value={selectedFiat} onValueChange={setSelectedFiat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Amount ({selectedFiat})</Label>
                  <Input 
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                  />
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Users className="w-4 h-4 mr-2" />
                  Find Traders
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* P2P Offers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {p2pOffers.map((offer) => (
              <P2POfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Quick Trade Actions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Shield className="w-6 h-6 mb-2" />
                <span>Create Offer</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Clock className="w-6 h-6 mb-2" />
                <span>Express Trade</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Star className="w-6 h-6 mb-2" />
                <span>Top Traders</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposit" className="space-y-6">
          {/* Deposit Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {depositOptions.map((option) => (
              <DepositCard key={option.id} option={option} />
            ))}
          </div>

          {/* Deposit Instructions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="w-5 h-5" />
                <span>Deposit Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Bitcoin className="w-5 h-5 mr-2 text-orange-400" />
                    Crypto Deposits
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• Generate unique deposit address</p>
                    <p>• Minimum 3 network confirmations</p>
                    <p>• Funds available after confirmation</p>
                    <p>• Network fees apply</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-400" />
                    Fiat Deposits
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• KYC verification required</p>
                    <p>• Bank transfers 1-3 business days</p>
                    <p>• Card payments instant</p>
                    <p>• Daily/monthly limits apply</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convert" className="space-y-6">
          <CryptoConverter />

          {/* Recent Conversions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { from: "0.5 BTC", to: "10.27 ETH", rate: "20.54", time: "2 hours ago" },
                  { from: "100 SOL", to: "0.21 BTC", rate: "0.0021", time: "1 day ago" },
                  { from: "5 ETH", to: "16,250 USDT", rate: "3,250", time: "2 days ago" }
                ].map((conversion, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm">
                        <span className="font-semibold">{conversion.from}</span>
                        <ArrowRight className="w-4 h-4 inline mx-2" />
                        <span className="font-semibold text-green-400">{conversion.to}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">Rate: {conversion.rate}</p>
                      <p className="text-muted-foreground">{conversion.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}