import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Target, TrendingUp, TrendingDown, AlertTriangle, Calculator } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHyperliquidAllMids } from "@/lib/hyperliquidService";

interface FuturesTradingProps {
  symbol: string;
  onTradeExecuted?: (trade: any) => void;
}

export default function FuturesTrading({ symbol, onTradeExecuted }: FuturesTradingProps) {
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState([10]);
  const [marginType, setMarginType] = useState<'cross' | 'isolated'>('cross');
  const [reduceOnly, setReduceOnly] = useState(false);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Extract coin symbol for Hyperliquid
  const getCoinSymbol = (tradingSymbol: string) => {
    return tradingSymbol.split('/')[0].replace('-PERP', '');
  };

  const coinSymbol = getCoinSymbol(symbol);

  // Fetch real-time price data from Hyperliquid
  const { data: priceData } = useQuery({
    queryKey: ['hyperliquid', 'allmids'],
    queryFn: async () => {
      try {
        console.log('[FuturesTrading] Fetching Hyperliquid price data');
        const mids = await getHyperliquidAllMids();
        console.log('[FuturesTrading] Received mids data:', mids);
        return mids;
      } catch (error) {
        console.error('[FuturesTrading] Error fetching price data:', error);
        return {};
      }
    },
    refetchInterval: 2000, // Update every 2 seconds for trading
    retry: 2,
  });

  // Get current price from Hyperliquid data
  const currentPrice = priceData?.[coinSymbol] ? parseFloat(priceData[coinSymbol]) : 
    (symbol.includes('BTC') ? 67845.32 : 2845.67);
  
  const markPrice = currentPrice - 0.15; // Slight offset for mark price
  const indexPrice = currentPrice - 0.8; // Slight offset for index price

  console.log(`[FuturesTrading] Current price for ${coinSymbol}:`, currentPrice);

  // Calculate trade metrics
  const notionalValue = parseFloat(quantity || '0') * currentPrice;
  const initialMargin = notionalValue / leverage[0];
  const liquidationPrice = side === 'long' 
    ? currentPrice * (1 - 0.9 / leverage[0])
    : currentPrice * (1 + 0.9 / leverage[0]);

  const availableBalance = 50000; // Mock available balance
  const maxQuantity = (availableBalance * leverage[0]) / currentPrice;

  const handlePercentageClick = (percentage: number) => {
    const qty = (maxQuantity * percentage / 100);
    setQuantity(qty.toFixed(6));
  };

  const handleTradeSubmit = async () => {
    if (!quantity || (orderType === 'limit' && !price)) return;

    setIsExecuting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const trade = {
        symbol,
        side,
        orderType,
        quantity: parseFloat(quantity),
        price: orderType === 'market' ? currentPrice : parseFloat(price),
        leverage: leverage[0],
        marginType,
        reduceOnly,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        timestamp: Date.now()
      };

      onTradeExecuted?.(trade);
      
      // Reset form
      setQuantity('');
      setPrice('');
      setTakeProfit('');
      setStopLoss('');
      
    } catch (error) {
      console.error('Trade execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-[#0b0e11] p-4 space-y-4">
      {/* Market Info Header */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-[#1a1d24] rounded-lg border border-slate-800">
        <div className="text-center">
          <div className="text-xs text-[#a1a1a1]">Last Price</div>
          <div className="font-semibold text-white text-sm">${currentPrice.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[#a1a1a1]">Mark Price</div>
          <div className="font-semibold text-white text-sm">${markPrice.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[#a1a1a1]">Index Price</div>
          <div className="font-semibold text-white text-sm">${indexPrice.toLocaleString()}</div>
        </div>
      </div>

      {/* Trading Mode Selector */}
      <div className="flex items-center justify-between p-3 bg-[#1a1d24] rounded-lg border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#a1a1a1]">Mode:</span>
          <Badge variant={marginType === 'cross' ? 'default' : 'outline'}>
            Cross {leverage[0]}x
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMarginType(marginType === 'cross' ? 'isolated' : 'cross')}
          className="text-xs"
        >
          Switch to {marginType === 'cross' ? 'Isolated' : 'Cross'}
        </Button>
      </div>

      {/* Leverage Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-[#a1a1a1]">Leverage</Label>
          <span className="text-sm font-semibold text-[#00c2b2]">{leverage[0]}x</span>
        </div>
        <Slider
          value={leverage}
          onValueChange={setLeverage}
          max={100}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#a1a1a1]">
          <span>1x</span>
          <span>25x</span>
          <span>50x</span>
          <span>100x</span>
        </div>
      </div>

      {/* Long/Short Tabs */}
      <Tabs value={side} onValueChange={(value) => setSide(value as 'long' | 'short')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#1a1d24]">
          <TabsTrigger 
            value="long" 
            className="data-[state=active]:bg-[#16c784] data-[state=active]:text-black font-semibold"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Long
          </TabsTrigger>
          <TabsTrigger 
            value="short" 
            className="data-[state=active]:bg-[#ea3943] data-[state=active]:text-white font-semibold"
          >
            <TrendingDown className="w-4 h-4 mr-1" />
            Short
          </TabsTrigger>
        </TabsList>

        <TabsContent value={side} className="space-y-4 mt-4">
          {/* Order Type Selection */}
          <div className="grid grid-cols-3 gap-1">
            {['market', 'limit', 'stop'].map((type) => (
              <Button
                key={type}
                variant={orderType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOrderType(type as any)}
                className="text-xs capitalize"
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Price Input (for limit/stop orders) */}
          {orderType !== 'market' && (
            <div className="space-y-2">
              <Label className="text-xs text-[#a1a1a1]">
                {orderType === 'limit' ? 'Limit Price' : 'Stop Price'} (USDC)
              </Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={currentPrice.toString()}
                className="text-right font-mono bg-[#1a1d24] border-slate-700"
              />
            </div>
          )}

          {/* Quantity Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-[#a1a1a1]">
                Quantity ({symbol.split('/')[0]})
              </Label>
              <span className="text-xs text-[#a1a1a1]">
                Available: {availableBalance.toLocaleString()} USDC
              </span>
            </div>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="text-right font-mono bg-[#1a1d24] border-slate-700"
            />
          </div>

          {/* Quick Percentage Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                onClick={() => handlePercentageClick(percent)}
                className="text-xs"
              >
                {percent}%
              </Button>
            ))}
          </div>

          {/* Advanced Options */}
          <div className="space-y-3 p-3 bg-[#1a1d24] rounded-lg border border-slate-800">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-[#a1a1a1]">Reduce Only</Label>
              <Switch checked={reduceOnly} onCheckedChange={setReduceOnly} />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-[#a1a1a1]">Take Profit</Label>
                <Input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="Price"
                  className="text-xs bg-[#0b0e11] border-slate-700"
                />
              </div>
              <div>
                <Label className="text-xs text-[#a1a1a1]">Stop Loss</Label>
                <Input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="Price"
                  className="text-xs bg-[#0b0e11] border-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Trade Summary */}
          <div className="space-y-2 p-3 bg-[#1a1d24] rounded-lg border border-slate-800">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="w-3 h-3 text-[#a1a1a1]" />
              <span className="text-xs font-medium text-[#a1a1a1]">Trade Summary</span>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Notional Value:</span>
                <span className="font-mono text-white">${notionalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Initial Margin:</span>
                <span className="font-mono text-white">${initialMargin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Est. Liq. Price:</span>
                <span className="font-mono text-[#ea3943]">${liquidationPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Est. Fee:</span>
                <span className="font-mono text-white">${(notionalValue * 0.0005).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleTradeSubmit}
            disabled={!quantity || isExecuting || (orderType !== 'market' && !price)}
            className={`w-full font-semibold ${
              side === 'long' 
                ? 'bg-[#16c784] hover:bg-[#16c784]/90 text-black' 
                : 'bg-[#ea3943] hover:bg-[#ea3943]/90 text-white'
            }`}
          >
            {isExecuting ? (
              <>Processing...</>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                {side === 'long' ? 'Buy/Long' : 'Sell/Short'} {symbol.split('/')[0]}
              </>
            )}
          </Button>

          {/* Risk Warning */}
          <div className="flex items-start space-x-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded">
            <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-orange-200">
              <div className="font-medium mb-1">High Risk Warning</div>
              <div>Futures trading involves significant risk. Consider market volatility and funding costs.</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}