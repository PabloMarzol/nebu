import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, BarChart } from "lucide-react";

interface AdvancedChartProps {
  symbol: string;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function AdvancedChart({ symbol }: AdvancedChartProps) {
  const [timeframe, setTimeframe] = useState("1h");
  const [chartType, setChartType] = useState("candlestick");
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(67845.32);
  const [priceChange, setPriceChange] = useState(2.34);

  const timeframes = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];

  useEffect(() => {
    // Generate realistic candlestick data
    const generateCandleData = () => {
      const data: CandleData[] = [];
      let basePrice = 67800;
      
      for (let i = 0; i < 24; i++) {
        const open = basePrice + (Math.random() - 0.5) * 100;
        const close = open + (Math.random() - 0.5) * 200;
        const high = Math.max(open, close) + Math.random() * 50;
        const low = Math.min(open, close) - Math.random() * 50;
        const volume = Math.random() * 1000000;
        
        data.push({
          time: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
          open: Math.round(open * 100) / 100,
          high: Math.round(high * 100) / 100,
          low: Math.round(low * 100) / 100,
          close: Math.round(close * 100) / 100,
          volume: Math.round(volume)
        });
        
        basePrice = close;
      }
      
      return data;
    };

    setCandleData(generateCandleData());

    // Simulate real-time price updates
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.round((prev + change) * 100) / 100;
      });
      setPriceChange((Math.random() - 0.5) * 5);
    }, 2000);

    return () => clearInterval(interval);
  }, [timeframe]);

  const renderCandlestick = (candle: CandleData, index: number) => {
    const isGreen = candle.close > candle.open;
    const bodyHeight = Math.abs(candle.close - candle.open);
    const maxHeight = 200;
    const priceRange = Math.max(...candleData.map(c => c.high)) - Math.min(...candleData.map(c => c.low));
    const scaledBodyHeight = (bodyHeight / priceRange) * maxHeight;
    const scaledWickTop = ((candle.high - Math.max(candle.open, candle.close)) / priceRange) * maxHeight;
    const scaledWickBottom = ((Math.min(candle.open, candle.close) - candle.low) / priceRange) * maxHeight;

    return (
      <div key={index} className="flex flex-col items-center h-full justify-end">
        {/* Top wick */}
        <div 
          className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
          style={{ height: `${scaledWickTop}px` }}
        />
        {/* Body */}
        <div 
          className={`w-2 ${isGreen ? 'bg-green-400' : 'bg-red-400'} border ${isGreen ? 'border-green-500' : 'border-red-500'}`}
          style={{ height: `${Math.max(scaledBodyHeight, 2)}px` }}
        />
        {/* Bottom wick */}
        <div 
          className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
          style={{ height: `${scaledWickBottom}px` }}
        />
      </div>
    );
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-lg">{symbol} Chart</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                ${currentPrice.toLocaleString()}
              </span>
              <Badge variant={priceChange >= 0 ? "default" : "destructive"} className="flex items-center space-x-1">
                {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={chartType === "candlestick" ? "default" : "outline"}
              onClick={() => setChartType("candlestick")}
            >
              <BarChart className="w-4 h-4 mr-1" />
              Candles
            </Button>
            <Button
              size="sm"
              variant={chartType === "line" ? "default" : "outline"}
              onClick={() => setChartType("line")}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Line
            </Button>
          </div>
        </div>

        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              size="sm"
              variant={timeframe === tf ? "default" : "ghost"}
              onClick={() => setTimeframe(tf)}
              className="text-xs px-2 py-1 h-7"
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80 relative bg-muted/20 rounded-lg p-2">
          {chartType === "candlestick" ? (
            <div className="flex items-end justify-between h-full px-2 space-x-1">
              {candleData.map((candle, index) => renderCandlestick(candle, index))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-muted-foreground">
                Line chart visualization would be implemented here
              </div>
            </div>
          )}
        </div>

        {/* Technical Indicators */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-muted-foreground">24h Volume</div>
            <div className="font-semibold">1.2M {symbol.slice(0, 3)}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">24h High</div>
            <div className="font-semibold text-green-400">${(currentPrice * 1.02).toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">24h Low</div>
            <div className="font-semibold text-red-400">${(currentPrice * 0.98).toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}