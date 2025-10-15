import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Target, TrendingUp, TrendingDown, Zap, Clock, Shield } from "lucide-react";

interface AdvancedOrdersProps {
  symbol: string;
}

export default function AdvancedOrders({ symbol }: AdvancedOrdersProps) {
  const [orderType, setOrderType] = useState("stop_loss");
  const [quantity, setQuantity] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [timeInForce, setTimeInForce] = useState("GTC");
  const [reduceOnly, setReduceOnly] = useState(false);
  const [postOnly, setPostOnly] = useState(false);
  const [iceberg, setIceberg] = useState(false);
  const [icebergQty, setIcebergQty] = useState("");
  const [trailingPercent, setTrailingPercent] = useState([1]);

  const currentPrice = 67845.32;

  const orderTypes = [
    { value: "stop_loss", label: "Stop Loss", icon: Shield, description: "Sell when price falls to limit losses" },
    { value: "take_profit", label: "Take Profit", icon: Target, description: "Sell when price rises to secure profits" },
    { value: "stop_limit", label: "Stop Limit", icon: TrendingDown, description: "Stop order that becomes limit order" },
    { value: "trailing_stop", label: "Trailing Stop", icon: TrendingUp, description: "Dynamic stop that follows price movement" },
    { value: "oco", label: "OCO (One-Cancels-Other)", icon: Zap, description: "Two orders, one cancels the other" },
    { value: "bracket", label: "Bracket Order", icon: Target, description: "Entry with stop loss and take profit" }
  ];

  const timeInForceOptions = [
    { value: "GTC", label: "Good Till Canceled" },
    { value: "IOC", label: "Immediate or Cancel" },
    { value: "FOK", label: "Fill or Kill" },
    { value: "GTX", label: "Good Till Crossing" }
  ];

  const selectedOrderType = orderTypes.find(type => type.value === orderType);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Advanced Orders</span>
          <Badge variant="outline" className="text-xs">PRO</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Type Selection */}
        <div className="space-y-3">
          <Label>Order Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {orderTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={orderType === type.value ? "default" : "outline"}
                  onClick={() => setOrderType(type.value)}
                  className="flex items-center space-x-2 h-auto p-3"
                >
                  <IconComponent className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">{type.label}</div>
                    <div className="text-xs opacity-70">{type.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-green-400">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="text-red-400">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-4">
              {/* Quantity */}
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

              {/* Order-specific fields */}
              {orderType === "stop_loss" || orderType === "take_profit" || orderType === "stop_limit" ? (
                <div className="space-y-2">
                  <Label>Trigger Price (USDT)</Label>
                  <Input
                    type="number"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                    placeholder={currentPrice.toString()}
                    className="text-right font-mono"
                  />
                </div>
              ) : null}

              {orderType === "stop_limit" ? (
                <div className="space-y-2">
                  <Label>Limit Price (USDT)</Label>
                  <Input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder={currentPrice.toString()}
                    className="text-right font-mono"
                  />
                </div>
              ) : null}

              {orderType === "trailing_stop" ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Trailing Percentage</Label>
                    <Badge variant="outline">{trailingPercent[0]}%</Badge>
                  </div>
                  <Slider
                    value={trailingPercent}
                    onValueChange={setTrailingPercent}
                    max={10}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.1%</span>
                    <span>10%</span>
                  </div>
                </div>
              ) : null}

              {orderType === "oco" ? (
                <>
                  <div className="space-y-2">
                    <Label>Stop Price (USDT)</Label>
                    <Input
                      type="number"
                      value={triggerPrice}
                      onChange={(e) => setTriggerPrice(e.target.value)}
                      placeholder={(currentPrice * 0.95).toFixed(2)}
                      className="text-right font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Limit Price (USDT)</Label>
                    <Input
                      type="number"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      placeholder={(currentPrice * 1.05).toFixed(2)}
                      className="text-right font-mono"
                    />
                  </div>
                </>
              ) : null}

              {orderType === "bracket" ? (
                <>
                  <div className="space-y-2">
                    <Label>Entry Price (USDT)</Label>
                    <Input
                      type="number"
                      placeholder={currentPrice.toString()}
                      className="text-right font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stop Loss (USDT)</Label>
                      <Input
                        type="number"
                        placeholder={(currentPrice * 0.95).toFixed(2)}
                        className="text-right font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Take Profit (USDT)</Label>
                      <Input
                        type="number"
                        placeholder={(currentPrice * 1.05).toFixed(2)}
                        className="text-right font-mono"
                      />
                    </div>
                  </div>
                </>
              ) : null}

              {/* Advanced Options */}
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold text-sm">Advanced Options</h4>
                
                <div className="space-y-2">
                  <Label>Time in Force</Label>
                  <Select value={timeInForce} onValueChange={setTimeInForce}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeInForceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Reduce Only</Label>
                      <div className="text-xs text-muted-foreground">Only reduce position</div>
                    </div>
                    <Switch checked={reduceOnly} onCheckedChange={setReduceOnly} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Post Only</Label>
                      <div className="text-xs text-muted-foreground">Maker order only</div>
                    </div>
                    <Switch checked={postOnly} onCheckedChange={setPostOnly} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Iceberg Order</Label>
                      <div className="text-xs text-muted-foreground">Hide order size</div>
                    </div>
                    <Switch checked={iceberg} onCheckedChange={setIceberg} />
                  </div>
                  {iceberg && (
                    <Input
                      type="number"
                      value={icebergQty}
                      onChange={(e) => setIcebergQty(e.target.value)}
                      placeholder="Visible quantity"
                      className="text-right font-mono"
                    />
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-3 p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/20">
                <div className="font-semibold text-sm">Order Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Type:</span>
                    <span>{selectedOrderType?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Side:</span>
                    <span className="text-green-400">Buy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-mono">{quantity || "0"} {symbol.slice(0, 3)}</span>
                  </div>
                  {triggerPrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trigger Price:</span>
                      <span className="font-mono">${triggerPrice}</span>
                    </div>
                  )}
                  {limitPrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Limit Price:</span>
                      <span className="font-mono">${limitPrice}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Cost:</span>
                    <span className="font-mono">${(parseFloat(quantity || "0") * (parseFloat(triggerPrice) || currentPrice)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Target className="w-4 h-4 mr-2" />
                Place {selectedOrderType?.label}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            {/* Similar structure for sell orders */}
            <div className="space-y-4">
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

              {orderType !== "bracket" && (
                <div className="space-y-2">
                  <Label>Trigger Price (USDT)</Label>
                  <Input
                    type="number"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                    placeholder={currentPrice.toString()}
                    className="text-right font-mono"
                  />
                </div>
              )}

              <div className="space-y-3 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20">
                <div className="font-semibold text-sm">Order Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Type:</span>
                    <span>{selectedOrderType?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Side:</span>
                    <span className="text-red-400">Sell</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-mono">{quantity || "0"} {symbol.slice(0, 3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Value:</span>
                    <span className="font-mono">${(parseFloat(quantity || "0") * (parseFloat(triggerPrice) || currentPrice)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Target className="w-4 h-4 mr-2" />
                Place {selectedOrderType?.label}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Advanced Orders */}
        <div className="space-y-3">
          <h4 className="font-semibold">Active Advanced Orders</h4>
          <div className="space-y-2">
            {[
              { type: "Stop Loss", side: "sell", quantity: "0.05", trigger: "65000", status: "active" },
              { type: "Take Profit", side: "sell", quantity: "0.03", trigger: "70000", status: "active" },
              { type: "Trailing Stop", side: "sell", quantity: "0.02", trigger: "66500", status: "triggered" }
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={order.status === 'active' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                  <div>
                    <div className="font-semibold text-sm">{order.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.side} {order.quantity} {symbol.slice(0, 3)} @ ${order.trigger}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Cancel</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}