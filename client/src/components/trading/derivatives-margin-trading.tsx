import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  AlertTriangle, 
  Shield, 
  Zap,
  DollarSign,
  Target,
  Calendar,
  BarChart3,
  PieChart
} from "lucide-react";

export default function DerivativesMarginTrading() {
  const [leverage, setLeverage] = useState("1");
  const [marginType, setMarginType] = useState("cross");
  const [contractType, setContractType] = useState("perpetual");
  const [positionSize, setPositionSize] = useState("");

  const leverageOptions = ["1", "3", "5", "10", "25", "50", "75", "100", "125"];
  
  const marginData = {
    totalBalance: 12500.45,
    availableBalance: 8750.30,
    marginUsed: 3750.15,
    unrealizedPnL: 245.67,
    marginRatio: 30.2,
    liquidationPrice: 41250.00
  };

  const positions = [
    {
      symbol: "BTC/USDT",
      type: "Long",
      size: "0.5",
      entryPrice: "42,500",
      markPrice: "42,750",
      pnl: "+125.00",
      margin: "850.00",
      leverage: "5x"
    },
    {
      symbol: "ETH/USDT", 
      type: "Short",
      size: "2.0",
      entryPrice: "2,800",
      markPrice: "2,785",
      pnl: "+30.00",
      margin: "560.00",
      leverage: "10x"
    }
  ];

  const futuresContracts = [
    { name: "BTC Quarterly", expiry: "2024-03-29", funding: "0.01%" },
    { name: "ETH Quarterly", expiry: "2024-03-29", funding: "0.008%" },
    { name: "SOL Quarterly", expiry: "2024-03-29", funding: "0.012%" }
  ];

  const optionsData = [
    { strike: "40,000", call: "2,750", put: "250", expiry: "7d" },
    { strike: "42,000", call: "1,500", put: "750", expiry: "7d" },
    { strike: "44,000", call: "800", put: "1,550", expiry: "7d" }
  ];

  const leveragedTokens = [
    { name: "BTC3L", price: "158.45", change: "+5.2%" },
    { name: "BTC3S", price: "89.33", change: "-5.1%" },
    { name: "ETH5L", price: "245.67", change: "+8.7%" },
    { name: "ETH5S", price: "134.22", change: "-8.9%" }
  ];

  return (
    <div className="space-y-6">
      {/* Margin Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Balance</span>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">${marginData.totalBalance.toLocaleString()}</p>
            <p className="text-sm text-green-400">Available: ${marginData.availableBalance.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Unrealized P&L</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">+${marginData.unrealizedPnL}</p>
            <p className="text-sm text-gray-400">Margin Used: ${marginData.marginUsed.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Margin Ratio</span>
              <Shield className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{marginData.marginRatio}%</p>
            <Progress value={marginData.marginRatio} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="perpetuals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="perpetuals">Perpetual Futures</TabsTrigger>
          <TabsTrigger value="options">Options Trading</TabsTrigger>
          <TabsTrigger value="leveraged">Leveraged Tokens</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>

        {/* Perpetual Futures */}
        <TabsContent value="perpetuals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Open Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contract</Label>
                    <Select value={contractType} onValueChange={setContractType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perpetual">BTC/USDT Perpetual</SelectItem>
                        <SelectItem value="quarterly">BTC Quarterly</SelectItem>
                        <SelectItem value="weekly">BTC Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Margin Type</Label>
                    <Select value={marginType} onValueChange={setMarginType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cross">Cross Margin</SelectItem>
                        <SelectItem value="isolated">Isolated Margin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Leverage</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {leverageOptions.map((lev) => (
                      <Button
                        key={lev}
                        variant={leverage === lev ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLeverage(lev)}
                        className="text-xs"
                      >
                        {lev}x
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Position Size</Label>
                    <Input placeholder="0.00 BTC" className="bg-black/30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Order Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Market" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    Long
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700">
                    Short
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Futures Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {futuresContracts.map((contract, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                      <div>
                        <p className="text-white font-medium">{contract.name}</p>
                        <p className="text-sm text-gray-400">Expires: {contract.expiry}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400">{contract.funding}</p>
                        <p className="text-xs text-gray-400">Funding Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Options Trading */}
        <TabsContent value="options">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                BTC Options Chain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3 text-gray-400">Strike Price</th>
                      <th className="text-left p-3 text-gray-400">Call Premium</th>
                      <th className="text-left p-3 text-gray-400">Put Premium</th>
                      <th className="text-left p-3 text-gray-400">Expiry</th>
                      <th className="text-left p-3 text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionsData.map((option, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="p-3 text-white">${option.strike}</td>
                        <td className="p-3 text-green-400">${option.call}</td>
                        <td className="p-3 text-red-400">${option.put}</td>
                        <td className="p-3 text-gray-400">{option.expiry}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Buy Call</Button>
                            <Button size="sm" variant="outline">Buy Put</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leveraged Tokens */}
        <TabsContent value="leveraged">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {leveragedTokens.map((token, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{token.name}</h3>
                    <Badge className={token.change.startsWith('+') ? 'bg-green-500' : 'bg-red-500'}>
                      {token.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white mb-3">${token.price}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      Buy
                    </Button>
                    <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                      Sell
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Positions */}
        <TabsContent value="positions">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Active Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {positions.map((position, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-semibold">{position.symbol}</h3>
                        <Badge className={position.type === "Long" ? "bg-green-500" : "bg-red-500"}>
                          {position.type}
                        </Badge>
                        <Badge variant="outline">{position.leverage}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Close</Button>
                        <Button size="sm" variant="outline">Add Margin</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Size</p>
                        <p className="text-white">{position.size}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Entry Price</p>
                        <p className="text-white">${position.entryPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Mark Price</p>
                        <p className="text-white">${position.markPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">P&L</p>
                        <p className="text-green-400">{position.pnl}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Margin</p>
                        <p className="text-white">${position.margin}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Liq. Price</p>
                        <p className="text-red-400">${marginData.liquidationPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Risk Management Panel */}
      <Card className="bg-black/20 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Risk Management & Liquidation Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-red-400">Liquidation Price</Label>
              <p className="text-2xl font-bold text-red-400">${marginData.liquidationPrice.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-yellow-400">Margin Ratio</Label>
              <p className="text-2xl font-bold text-yellow-400">{marginData.marginRatio}%</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Auto-Deleveraging Rank</Label>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className={`w-4 h-4 ${i <= 2 ? 'bg-green-500' : 'bg-gray-600'}`} />
                  ))}
                </div>
                <span className="text-green-400">Low Risk</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}