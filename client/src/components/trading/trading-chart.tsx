import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Camera, Share2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import QuickTradePanel from "./trading-panel";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

interface TradingChartProps {
  symbol: string;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("5m");
  const [chartData, setChartData] = useState<Array<{x: number, y: number}>>([]);
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  // Fetch live market data
  const { data: marketsResponse } = useQuery({
    queryKey: ['/api/markets'],
    refetchInterval: 1000,
  });

  const markets = marketsResponse?.data || marketsResponse || [];
  
  const symbolData = markets.find((market: any) => {
    if (!market || !market.symbol) return false;
    const marketSymbol = market.symbol.toLowerCase();
    const targetSymbol = symbol.toLowerCase();
    return marketSymbol === targetSymbol || 
           marketSymbol.replace('/', '') === targetSymbol.replace('/', '');
  });

  const currentPrice = symbolData ? parseFloat(symbolData.price) || 0 : 50000;
  const priceChange = symbolData ? parseFloat(symbolData.change24h) || 0 : 0;
  const high24h = symbolData ? parseFloat(symbolData.high24h) || 0 : 0;
  const low24h = symbolData ? parseFloat(symbolData.low24h) || 0 : 0;
  const volume24h = symbolData ? parseFloat(symbolData.volume24h) || 0 : 0;
  const marketCap = symbolData ? parseFloat(symbolData.marketCap) || 0 : 0;

  const timeframes = ["1m", "5m", "1h", "1d"];

  // Initialize chart data ONCE
  useEffect(() => {
    if (currentPrice <= 0) return;

    const initializeData = () => {
      const data = [];
      const basePrice = currentPrice;
      let price = basePrice;
      const now = Date.now();
      
      // Generate initial 30 data points with timestamps
      for (let i = 29; i >= 0; i--) {
        const volatility = basePrice * 0.015;
        const change = (Math.random() - 0.5) * volatility;
        price = Math.max(price + change, basePrice * 0.85);
        
        const timestamp = now - (i * 5000); // 5-second intervals
        
        data.push({
          x: timestamp,
          y: parseFloat(price.toFixed(2))
        });
      }
      
      setChartData(data);
    };

    // Only initialize once when we first get currentPrice
    if (chartData.length === 0) {
      initializeData();
    }
  }, [currentPrice, chartData.length]);

  // Add real-time updates with FIXED time window
  useEffect(() => {
    if (chartData.length === 0 || !chartRef.current || currentPrice <= 0) return;

    const addRealTimePoint = () => {
      const chart = chartRef.current;
      if (!chart) return;

      const now = Date.now();
      const realPrice = parseFloat(currentPrice.toFixed(2));

      // Create new data point
      const newPoint = {
        x: now,
        y: realPrice
      };

      // Add to chart dataset
      if (chart.data.datasets[0] && chart.data.datasets[0].data) {
        chart.data.datasets[0].data.push(newPoint);

        // Remove old data points (keep last 30)
        if (chart.data.datasets[0].data.length > 30) {
          chart.data.datasets[0].data.shift();
        }
      }

      // Update time window - fixed 150-second sliding window
      const windowSize = 150000; // 150 seconds
      if (chart.options.scales && chart.options.scales.x) {
        chart.options.scales.x.min = now - windowSize;
        chart.options.scales.x.max = now;
      }

      // Update chart with no animation
      chart.update('none');

      // Update state
      setChartData(prevData => {
        const newData = [...prevData, newPoint];
        return newData.slice(-30);
      });
    };

    const interval = setInterval(addRealTimePoint, 5000);
    return () => clearInterval(interval);
  }, [currentPrice, chartData.length]);

  // Chart configuration
  const chartConfig = {
    datasets: [
      {
        label: `${symbol} Price`,
        data: chartData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#8b5cf6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#d1d5db',
        bodyColor: '#4d5e78ff',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${symbol}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        min: Date.now() - 150000,
        max: Date.now(),
        display: true,
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#d1d5db',
          autoSkip: true,
          maxTicksLimit: 6,
          font: {
            size: 11,
          },
        },
        time: {
          displayFormats: {
            second: 'HH:mm:ss',
            minute: 'HH:mm'
          }
        }
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7b91ff',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
          font: {
            size: 11,
          },
        },
      },
    },
    animation: {
      duration: 0,
    },
    transitions: {
      active: {
        animation: {
          duration: 0,
        }
      }
    },
  };

  // Helper functions
  const formatVolume = (vol: number) => {
    if (vol === 0) return '--';
    if (vol > 1000000) return (vol / 1000000).toFixed(1) + 'M';
    if (vol > 1000) return (vol / 1000).toFixed(1) + 'K';
    return vol.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const formatMarketCap = (cap: number) => {
    if (cap === 0) return '--';
    if (cap > 1e9) return '$' + (cap / 1e9).toFixed(1) + 'B';
    if (cap > 1e6) return '$' + (cap / 1e6).toFixed(1) + 'M';
    return '$' + cap.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart - Takes 2 columns */}
      <div className="lg:col-span-2">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-2xl font-bold">
                {symbol}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-mono">
                  ${currentPrice > 0 ? currentPrice.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  }) : '--'}
                </span>
                <span className={`flex items-center text-sm font-medium ${
                  priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {priceChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {priceChange !== 0 ? (priceChange >= 0 ? '+' : '') + priceChange.toFixed(2) + '%' : '+0.00%'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Screenshot
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Timeframe Selector */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={selectedTimeframe === tf ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(tf)}
                  className="text-xs font-medium"
                >
                  {tf}
                </Button>
              ))}
            </div>

            {/* Chart Container */}
            <div className="relative h-96 w-full bg-slate-900/50 rounded-lg overflow-hidden p-4">
              {chartData.length > 0 ? (
                <Line ref={chartRef} data={chartConfig} options={chartOptions} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-purple-400">
                    <BarChart3 className="w-8 h-8 animate-pulse" />
                    <p className="text-sm mt-2">Loading Chart.js chart...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chart Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">24h High</p>
                <p className="text-lg font-semibold text-green-500">
                  ${high24h > 0 ? high24h.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) : '--'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Low</p>
                <p className="text-lg font-semibold text-red-500">
                  ${low24h > 0 ? low24h.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) : '--'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-lg font-semibold">
                  {formatVolume(volume24h)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-lg font-semibold">
                  {formatMarketCap(marketCap)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Trade Panel - Takes 1 column */}
      <div className="lg:col-span-1">
        <QuickTradePanel 
          symbol={symbol} 
          currentPrice={currentPrice || 0}
          priceChange={priceChange || 0}
        />
      </div>
    </div>
  );
}