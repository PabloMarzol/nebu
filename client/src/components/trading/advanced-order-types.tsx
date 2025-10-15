import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Clock, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Zap,
  Settings
} from "lucide-react";

export default function AdvancedOrderTypes() {
  const [orderType, setOrderType] = useState("market");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [ocoEnabled, setOcoEnabled] = useState(false);
  const [trailingStop, setTrailingStop] = useState(false);

  const orderTypes = [
    {
      id: "market",
      name: "Market Order",
      description: "Execute immediately at current market price",
      icon: <Zap className="h-5 w-5" />,
      color: "green"
    },
    {
      id: "limit",
      name: "Limit Order", 
      description: "Execute at specified price or better",
      icon: <Target className="h-5 w-5" />,
      color: "blue"
    },
    {
      id: "stop",
      name: "Stop Order",
      description: "Trigger market order when price reached",
      icon: <Shield className="h-5 w-5" />,
      color: "orange"
    },
    {
      id: "stop-limit",
      name: "Stop-Limit",
      description: "Trigger limit order when stop price reached",
      icon: <Settings className="h-5 w-5" />,
      color: "purple"
    },
    {
      id: "oco",
      name: "OCO (One-Cancels-Other)",
      description: "Two orders, cancel one when other fills",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "yellow"
    },
    {
      id: "ioc",
      name: "IOC (Immediate-or-Cancel)",
      description: "Execute immediately, cancel remainder",
      icon: <Clock className="h-5 w-5" />,
      color: "red"
    },
    {
      id: "fok",
      name: "FOK (Fill-or-Kill)",
      description: "Execute completely or cancel entirely",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "gray"
    },
    {
      id: "trailing",
      name: "Trailing Stop",
      description: "Dynamic stop that follows price movement",
      icon: <TrendingDown className="h-5 w-5" />,
      color: "indigo"
    }
  ];

  const getColorClass = (color: string) => {
    const colors = {
      green: "bg-green-500/10 border-green-500/30 text-green-400",
      blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      orange: "bg-orange-500/10 border-orange-500/30 text-orange-400",
      purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      red: "bg-red-500/10 border-red-500/30 text-red-400",
      gray: "bg-gray-500/10 border-gray-500/30 text-gray-400",
      indigo: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Advanced Order Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={orderType} onValueChange={setOrderType}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
              {orderTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="text-xs">
                  {type.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {orderTypes.map((type) => (
              <TabsContent key={type.id} value={type.id}>
                <Card className={`${getColorClass(type.color)} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {type.icon}
                      <h3 className="font-semibold">{type.name}</h3>
                    </div>
                    <p className="text-sm opacity-80 mb-4">{type.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input placeholder="0.00" className="bg-black/30" />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input placeholder="Market Price" className="bg-black/30" />
                      </div>
                    </div>

                    {/* Advanced Options */}
                    {type.id !== "market" && (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Stop Loss</Label>
                          <Switch checked={!!stopLoss} onCheckedChange={(checked) => 
                            checked ? setStopLoss("0.00") : setStopLoss("")} />
                        </div>
                        {stopLoss && (
                          <Input 
                            value={stopLoss}
                            onChange={(e) => setStopLoss(e.target.value)}
                            placeholder="Stop Loss Price"
                            className="bg-black/30"
                          />
                        )}

                        <div className="flex items-center justify-between">
                          <Label>Take Profit</Label>
                          <Switch checked={!!takeProfit} onCheckedChange={(checked) => 
                            checked ? setTakeProfit("0.00") : setTakeProfit("")} />
                        </div>
                        {takeProfit && (
                          <Input 
                            value={takeProfit}
                            onChange={(e) => setTakeProfit(e.target.value)}
                            placeholder="Take Profit Price"
                            className="bg-black/30"
                          />
                        )}

                        {type.id === "stop" && (
                          <div className="flex items-center justify-between">
                            <Label>Trailing Stop</Label>
                            <Switch checked={trailingStop} onCheckedChange={setTrailingStop} />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-6">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Buy
                      </Button>
                      <Button className="flex-1 bg-red-600 hover:bg-red-700">
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Sell
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Management */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "Limit", pair: "BTC/USDT", amount: "0.5", price: "42,500", status: "Open" },
              { type: "Stop", pair: "ETH/USDT", amount: "2.0", price: "2,800", status: "Pending" },
              { type: "OCO", pair: "SOL/USDT", amount: "10", price: "95.50", status: "Partial" }
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{order.type}</Badge>
                  <span className="text-white">{order.pair}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">{order.amount}</span>
                  <span className="text-white">${order.price}</span>
                  <Badge className={
                    order.status === "Open" ? "bg-green-500" :
                    order.status === "Pending" ? "bg-yellow-500" : "bg-blue-500"
                  }>
                    {order.status}
                  </Badge>
                  <Button size="sm" variant="destructive">Cancel</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}