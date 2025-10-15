import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, TrendingUp, Calculator } from "lucide-react";

interface MarginTradingProps {
  symbol: string;
}

export default function MarginTrading({ symbol }: MarginTradingProps) {
  const [leverage, setLeverage] = useState([5]);
  const [amount, setAmount] = useState("");
  const [marginBalance, setMarginBalance] = useState("50000.00");
  const [availableBalance, setAvailableBalance] = useState("45000.00");
  const [borrowedAmount, setBorrowedAmount] = useState("5000.00");

  const maxLeverage = 20;
  const currentPrice = 67845.32;
  const leverageValue = leverage[0];
  const positionSize = parseFloat(amount || "0") * leverageValue;
  const liquidationPrice = currentPrice * (1 - 0.8 / leverageValue);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Margin Trading</span>
          <Badge variant="outline" className="text-xs">PRO</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Account Balance */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Margin Balance</div>
            <div className="font-semibold">${marginBalance}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Available</div>
            <div className="font-semibold text-green-400">${availableBalance}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Borrowed</div>
            <div className="font-semibold text-red-400">${borrowedAmount}</div>
          </div>
        </div>

        <Tabs defaultValue="long" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="long" className="text-green-400">Long</TabsTrigger>
            <TabsTrigger value="short" className="text-red-400">Short</TabsTrigger>
          </TabsList>

          <TabsContent value="long" className="space-y-4">
            {/* Leverage Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Leverage</Label>
                <Badge variant="outline">{leverageValue}x</Badge>
              </div>
              <Slider
                value={leverage}
                onValueChange={setLeverage}
                max={maxLeverage}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>{maxLeverage}x</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>Amount (USDT)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-right font-mono"
              />
            </div>

            {/* Position Details */}
            <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Position Size:</span>
                <span className="font-mono">${positionSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entry Price:</span>
                <span className="font-mono">${currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Liquidation Price:</span>
                <span className="font-mono text-red-400">${liquidationPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Margin Required:</span>
                <span className="font-mono">${(positionSize / leverageValue).toFixed(2)}</span>
              </div>
            </div>

            {/* Risk Warning */}
            <div className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-200">
                <div className="font-semibold mb-1">High Risk Warning</div>
                <div>Margin trading involves significant risk. You may lose more than your initial investment.</div>
              </div>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700">
              Open Long Position
            </Button>
          </TabsContent>

          <TabsContent value="short" className="space-y-4">
            {/* Similar structure for short positions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Leverage</Label>
                <Badge variant="outline">{leverageValue}x</Badge>
              </div>
              <Slider
                value={leverage}
                onValueChange={setLeverage}
                max={maxLeverage}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Amount (USDT)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-right font-mono"
              />
            </div>

            <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Position Size:</span>
                <span className="font-mono">${positionSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entry Price:</span>
                <span className="font-mono">${currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Liquidation Price:</span>
                <span className="font-mono text-red-400">${(currentPrice * (1 + 0.8 / leverageValue)).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-200">
                <div className="font-semibold mb-1">High Risk Warning</div>
                <div>Short selling with leverage carries extreme risk of unlimited losses.</div>
              </div>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700">
              Open Short Position
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}