import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Calendar, Target, AlertCircle } from "lucide-react";

interface FuturesTradingProps {
  symbol: string;
}

export default function FuturesTrading({ symbol }: FuturesTradingProps) {
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState("10");
  const [marginType, setMarginType] = useState("cross");

  const leverageOptions = ["1", "2", "5", "10", "20", "50", "100"];
  const currentPrice = 67845.32;
  const markPrice = 67844.15;
  const fundingRate = 0.0012;

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Futures Trading</span>
            <Badge variant="outline" className="text-xs">PERP</Badge>
          </CardTitle>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Funding Rate</div>
            <div className="text-sm font-semibold text-green-400">+{(fundingRate * 100).toFixed(4)}%</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Market Info */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Last Price</div>
            <div className="font-semibold">${currentPrice.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Mark Price</div>
            <div className="font-semibold">${markPrice.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Index Price</div>
            <div className="font-semibold">${(currentPrice - 1.2).toLocaleString()}</div>
          </div>
        </div>

        {/* Leverage & Margin */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Leverage</Label>
            <Select value={leverage} onValueChange={setLeverage}>
              <SelectTrigger>
                <SelectValue placeholder="Select leverage" />
              </SelectTrigger>
              <SelectContent>
                {leverageOptions.map((lev) => (
                  <SelectItem key={lev} value={lev}>{lev}x</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Margin Mode</Label>
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

        <Tabs defaultValue="long" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="long" className="text-green-400">Long</TabsTrigger>
            <TabsTrigger value="short" className="text-red-400">Short</TabsTrigger>
          </TabsList>

          <TabsContent value="long" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant={orderType === "market" ? "default" : "outline"}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </Button>
                <Button
                  size="sm"
                  variant={orderType === "limit" ? "default" : "outline"}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </Button>
              </div>

              {orderType === "limit" && (
                <div className="space-y-2">
                  <Label>Price (USDT)</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={currentPrice.toString()}
                    className="text-right font-mono"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Quantity ({symbol.slice(0, 3)})</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="text-right font-mono"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {["25%", "50%", "75%", "100%"].map((percent) => (
                  <Button
                    key={percent}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Calculate based on available balance
                      const availableBalance = 10000; // Mock available balance
                      const maxQuantity = (availableBalance * parseInt(leverage) * parseFloat(percent.replace('%', '')) / 100) / currentPrice;
                      setQuantity(maxQuantity.toFixed(6));
                    }}
                  >
                    {percent}
                  </Button>
                ))}
              </div>

              {/* Position Details */}
              <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Notional Value:</span>
                  <span className="font-mono">${(parseFloat(quantity || "0") * currentPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Initial Margin:</span>
                  <span className="font-mono">${((parseFloat(quantity || "0") * currentPrice) / parseInt(leverage)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Liq. Price:</span>
                  <span className="font-mono text-red-400">${(currentPrice * (1 - 0.9 / parseInt(leverage))).toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Target className="w-4 h-4 mr-2" />
                Long {symbol}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="short" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant={orderType === "market" ? "default" : "outline"}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </Button>
                <Button
                  size="sm"
                  variant={orderType === "limit" ? "default" : "outline"}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </Button>
              </div>

              {orderType === "limit" && (
                <div className="space-y-2">
                  <Label>Price (USDT)</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={currentPrice.toString()}
                    className="text-right font-mono"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Quantity ({symbol.slice(0, 3)})</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="text-right font-mono"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["25%", "50%", "75%", "100%"].map((percent) => (
                  <Button
                    key={percent}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const availableBalance = 10000;
                      const maxQuantity = (availableBalance * parseInt(leverage) * parseFloat(percent.replace('%', '')) / 100) / currentPrice;
                      setQuantity(maxQuantity.toFixed(6));
                    }}
                  >
                    {percent}
                  </Button>
                ))}
              </div>

              <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Notional Value:</span>
                  <span className="font-mono">${(parseFloat(quantity || "0") * currentPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Initial Margin:</span>
                  <span className="font-mono">${((parseFloat(quantity || "0") * currentPrice) / parseInt(leverage)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Liq. Price:</span>
                  <span className="font-mono text-red-400">${(currentPrice * (1 + 0.9 / parseInt(leverage))).toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Target className="w-4 h-4 mr-2" />
                Short {symbol}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Risk Warning */}
        <div className="flex items-start space-x-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-orange-200">
            <div className="font-semibold mb-1">Futures Trading Risk</div>
            <div>Perpetual futures carry high risk. Consider market volatility and funding costs.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}