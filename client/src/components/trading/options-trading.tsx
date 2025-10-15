import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingUp, TrendingDown, Calculator, AlertTriangle } from "lucide-react";

interface OptionsTradingProps {
  symbol: string;
}

interface OptionContract {
  strike: number;
  expiry: string;
  callPrice: number;
  putPrice: number;
  volume: number;
  openInterest: number;
}

export default function OptionsTrading({ symbol }: OptionsTradingProps) {
  const [selectedStrike, setSelectedStrike] = useState("68000");
  const [selectedExpiry, setSelectedExpiry] = useState("2024-12-27");
  const [quantity, setQuantity] = useState("");
  const [orderType, setOrderType] = useState("market");

  const currentPrice = 67845.32;
  const impliedVolatility = 0.45;

  const optionChain: OptionContract[] = [
    { strike: 66000, expiry: "2024-12-27", callPrice: 2450.50, putPrice: 605.20, volume: 125, openInterest: 890 },
    { strike: 67000, expiry: "2024-12-27", callPrice: 1780.30, putPrice: 935.00, volume: 245, openInterest: 1240 },
    { strike: 68000, expiry: "2024-12-27", callPrice: 1245.75, putPrice: 1399.45, volume: 380, openInterest: 2100 },
    { strike: 69000, expiry: "2024-12-27", callPrice: 845.20, putPrice: 1999.90, volume: 190, openInterest: 1650 },
    { strike: 70000, expiry: "2024-12-27", callPrice: 523.40, putPrice: 2677.10, volume: 95, openInterest: 780 },
  ];

  const selectedContract = optionChain.find(c => c.strike === parseInt(selectedStrike));
  const isInTheMoney = (strike: number, isCall: boolean) => {
    return isCall ? currentPrice > strike : currentPrice < strike;
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5" />
          <span>Options Trading</span>
          <Badge variant="outline" className="text-xs">ADVANCED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Market Info */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Underlying Price</div>
            <div className="font-semibold">${currentPrice.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Implied Volatility</div>
            <div className="font-semibold">{(impliedVolatility * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Time to Expiry</div>
            <div className="font-semibold">21 Days</div>
          </div>
        </div>

        {/* Contract Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Strike Price</Label>
            <Select value={selectedStrike} onValueChange={setSelectedStrike}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {optionChain.map((contract) => (
                  <SelectItem key={contract.strike} value={contract.strike.toString()}>
                    ${contract.strike.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-12-27">Dec 27, 2024</SelectItem>
                <SelectItem value="2025-01-03">Jan 03, 2025</SelectItem>
                <SelectItem value="2025-01-31">Jan 31, 2025</SelectItem>
                <SelectItem value="2025-03-28">Mar 28, 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Options Chain */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Options Chain</h4>
          <div className="bg-muted/20 rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 gap-2 p-3 text-xs font-semibold border-b border-border">
              <div>Strike</div>
              <div className="text-green-400">Call Price</div>
              <div className="text-green-400">Call Vol</div>
              <div className="text-center">Moneyness</div>
              <div className="text-red-400">Put Vol</div>
              <div className="text-red-400">Put Price</div>
              <div>OI</div>
            </div>
            {optionChain.map((contract) => (
              <div
                key={contract.strike}
                className={`grid grid-cols-7 gap-2 p-3 text-xs hover:bg-muted/10 cursor-pointer ${
                  contract.strike === parseInt(selectedStrike) ? 'bg-muted/20' : ''
                }`}
                onClick={() => setSelectedStrike(contract.strike.toString())}
              >
                <div className="font-mono">${contract.strike.toLocaleString()}</div>
                <div className="text-green-400 font-mono">${contract.callPrice.toFixed(2)}</div>
                <div className="text-green-400 font-mono">{contract.volume}</div>
                <div className="text-center">
                  {isInTheMoney(contract.strike, true) ? (
                    <Badge variant="default" className="text-xs px-1 py-0">ITM</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs px-1 py-0">OTM</Badge>
                  )}
                </div>
                <div className="text-red-400 font-mono">{contract.volume}</div>
                <div className="text-red-400 font-mono">${contract.putPrice.toFixed(2)}</div>
                <div className="font-mono">{contract.openInterest}</div>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="call" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="call" className="text-green-400">Call Options</TabsTrigger>
            <TabsTrigger value="put" className="text-red-400">Put Options</TabsTrigger>
          </TabsList>

          <TabsContent value="call" className="space-y-4">
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

              <div className="space-y-2">
                <Label>Quantity (Contracts)</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  className="text-right font-mono"
                />
              </div>

              {/* Option Details */}
              {selectedContract && (
                <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract:</span>
                    <span className="font-mono">{symbol} ${selectedContract.strike} Call</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Premium:</span>
                    <span className="font-mono text-green-400">${selectedContract.callPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="font-mono">${(selectedContract.callPrice * parseInt(quantity || "0") * 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Breakeven:</span>
                    <span className="font-mono">${(selectedContract.strike + selectedContract.callPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Profit:</span>
                    <span className="font-mono text-green-400">Unlimited</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Loss:</span>
                    <span className="font-mono text-red-400">${(selectedContract.callPrice * parseInt(quantity || "0") * 100).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Buy Call Option
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="put" className="space-y-4">
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

              <div className="space-y-2">
                <Label>Quantity (Contracts)</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  className="text-right font-mono"
                />
              </div>

              {selectedContract && (
                <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract:</span>
                    <span className="font-mono">{symbol} ${selectedContract.strike} Put</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Premium:</span>
                    <span className="font-mono text-red-400">${selectedContract.putPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="font-mono">${(selectedContract.putPrice * parseInt(quantity || "0") * 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Breakeven:</span>
                    <span className="font-mono">${(selectedContract.strike - selectedContract.putPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Profit:</span>
                    <span className="font-mono text-green-400">${((selectedContract.strike - selectedContract.putPrice) * parseInt(quantity || "0") * 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Loss:</span>
                    <span className="font-mono text-red-400">${(selectedContract.putPrice * parseInt(quantity || "0") * 100).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <Button className="w-full bg-red-600 hover:bg-red-700">
                <TrendingDown className="w-4 h-4 mr-2" />
                Buy Put Option
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Greeks Display */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Delta</div>
            <div className="font-semibold">0.65</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Gamma</div>
            <div className="font-semibold">0.012</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Theta</div>
            <div className="font-semibold text-red-400">-12.5</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Vega</div>
            <div className="font-semibold">45.2</div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-red-200">
            <div className="font-semibold mb-1">Options Trading Risk</div>
            <div>Options can expire worthless. Understand the Greeks and time decay before trading.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}