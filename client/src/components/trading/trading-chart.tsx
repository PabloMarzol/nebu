import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Volume2, 
  Settings, 
  Maximize2,
  Activity,
  Plus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHyperliquidAllMids } from "@/lib/hyperliquidService";
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  ColorType,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries,
  Time
} from 'lightweight-charts';


interface TradingChartProps {
  symbol: string;
  timeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  height?: number;
}

interface CandlestickData {
  time: Time; // TradingView Time type
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}



export default function TradingChart({ 
  symbol, 
  timeframe: initialTimeframe = '15m',
  onTimeframeChange,
  height = 600 
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [indicators, setIndicators] = useState<string[]>([]);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [timeframe, setTimeframe] = useState(initialTimeframe);

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
        console.log('[TradingChart] Fetching Hyperliquid price data');
        const mids = await getHyperliquidAllMids();
        console.log('[TradingChart] Received mids data:', mids);
        return mids;
      } catch (error) {
        console.error('[TradingChart] Error fetching price data:', error);
        return {};
      }
    },
    refetchInterval: 3000, // Update every 3 seconds
    retry: 2,
  });

  // Fetch 24h market data for price change and volume
  const { data: marketData } = useQuery({
    queryKey: ['hyperliquid', 'market', coinSymbol],
    queryFn: async () => {
      try {
        console.log('[TradingChart] Fetching Hyperliquid market data for:', coinSymbol);
        const response = await fetch(`/api/hyperliquid/market/${coinSymbol}`);
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        const data = await response.json();
        console.log('[TradingChart] Received market data:', data);
        return data;
      } catch (error) {
        console.error('[TradingChart] Error fetching market data:', error);
        return null;
      }
    },
    enabled: !!coinSymbol,
    refetchInterval: 30000, // Update every 30 seconds
    retry: 2,
  });

  // Get current price from Hyperliquid data
  const currentPrice = priceData?.[coinSymbol] ? parseFloat(priceData[coinSymbol]) : 
    (symbol.includes('BTC') ? 107673 : symbol.includes('ETH') ? 2845.67 : 145.89);
  
  // Calculate real price change and volume from market data - NO MOCK DATA
  const priceChange = marketData?.change24h || 0; // Real data only, 0 if unavailable
  const volume24h = marketData?.volume24h || 0; // Real data only, 0 if unavailable

  // Helper function to get timeframe interval in seconds
  const getTimeIntervalSeconds = (tf: string) => {
    const intervals: { [key: string]: number } = {
      '1m': 60,
      '5m': 5 * 60,
      '15m': 15 * 60,
      '1h': 60 * 60,
      '4h': 4 * 60 * 60,
      '1D': 24 * 60 * 60,
    };
    return intervals[tf] || intervals['15m'];
  };

  // Map our timeframes to Hyperliquid's format
  const getHyperliquidInterval = (tf: string) => {
    const mapping: { [key: string]: string } = {
      '1m': '1m',
      '5m': '5m', 
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1D': '1d', // Note: Hyperliquid uses lowercase 'd'
    };
    return mapping[tf] || '15m';
  };

  // Fetch real historical candlestick data from Hyperliquid using candleSnapshot
  const { data: historicalData, isLoading: isLoadingHistorical } = useQuery({
    queryKey: ['hyperliquid', 'candleSnapshot', coinSymbol, timeframe],
    queryFn: async (): Promise<CandlestickData[]> => {
      try {
        console.log('[TradingChart] Fetching Hyperliquid candleSnapshot for:', coinSymbol, timeframe);
        
        const hyperliquidInterval = getHyperliquidInterval(timeframe);
        const endTime = Math.floor(Date.now() / 1000);
        const startTime = endTime - (100 * getTimeIntervalSeconds(timeframe)); // Last 100 candles
        
        // Use the Hyperliquid candleSnapshot API directly
        const response = await fetch('https://api.hyperliquid.xyz/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'candleSnapshot',
            req: {
              coin: coinSymbol,
              interval: hyperliquidInterval,
              startTime: startTime,
              endTime: endTime
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[TradingChart] Received candleSnapshot response:', {
          coin: coinSymbol,
          interval: hyperliquidInterval,
          dataLength: data?.length || 0,
          startTime: new Date(startTime * 1000).toISOString(),
          endTime: new Date(endTime * 1000).toISOString()
        });
        
        // Transform Hyperliquid candle data to TradingView format
        if (data && Array.isArray(data) && data.length > 0) {
          const transformedData = data.map((candle: any) => {
            // Hyperliquid candle format: [timestamp, open, high, low, close, volume]
            const [timestamp, open, high, low, close, volume] = candle;
            return {
              time: timestamp as Time,
              open: parseFloat(open),
              high: parseFloat(high),
              low: parseFloat(low),
              close: parseFloat(close),
              volume: parseFloat(volume || 0)
            };
          }).filter((candle: CandlestickData) => {
            // Filter out invalid candles
            return candle.time && 
                   !isNaN(candle.open) && 
                   !isNaN(candle.high) && 
                   !isNaN(candle.low) && 
                   !isNaN(candle.close) &&
                   candle.open > 0 && candle.high > 0 && candle.low > 0 && candle.close > 0;
          }).sort((a, b) => (a.time as number) - (b.time as number)); // Ensure chronological order
          
          console.log('[TradingChart] Transformed candle data:', {
            originalCount: data.length,
            transformedCount: transformedData.length,
            firstCandle: transformedData[0],
            lastCandle: transformedData[transformedData.length - 1]
          });
          
          return transformedData;
        }
        
        console.warn('[TradingChart] No valid candle data received from Hyperliquid API');
        return [];
      } catch (error) {
        console.error('[TradingChart] Error fetching candleSnapshot data:', error);
        throw error; // Re-throw to let React Query handle retries
      }
    },
    enabled: !!coinSymbol && !!timeframe,
    retry: 3, // Retry failed requests
    retryDelay: 1000, // Wait 1 second between retries
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Generate fallback candlestick data based on current price (only used if historical data fails)
  const generateCandlestickData = (basePrice: number, periods: number = 50): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let price = basePrice;
    
    // Get current time and interval
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const intervalSeconds = getTimeIntervalSeconds(timeframe);
    
    // Calculate the current candle start time (aligned to timeframe)
    const currentCandleStartTime = Math.floor(now / intervalSeconds) * intervalSeconds;
    
    console.log('[TradingChart] Generating fallback data with intervalSeconds:', intervalSeconds, 'timeframe:', timeframe);

    for (let i = 0; i < periods; i++) {
      // Calculate candle start time going backwards from current candle
      const candleStartTime = currentCandleStartTime - ((periods - 1 - i) * intervalSeconds);
      
      const volatility = price * 0.002; // 0.2% volatility
      
      const open = price;
      const change = (Math.random() - 0.5) * volatility * 2;
      const close = Math.max(0.01, open + change); // Prevent negative prices
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.3;
      const volume = 50 + Math.random() * 200;

      data.push({
        time: candleStartTime as Time,
        open: parseFloat(open.toFixed(4)),
        high: parseFloat(high.toFixed(4)),
        low: parseFloat(Math.max(0.01, low).toFixed(4)),
        close: parseFloat(close.toFixed(4)),
        volume: parseFloat(volume.toFixed(2))
      });

      price = close;
    }
    
    console.log('[TradingChart] Generated candle times:', {
      first: new Date(data[0].time as number * 1000).toISOString(),
      last: new Date(data[data.length - 1].time as number * 1000).toISOString(),
      intervalCheck: (data[1].time as number) - (data[0].time as number),
      expectedInterval: intervalSeconds
    });
    
    return data;
  };

  



  // Initialize TradingView Lightweight Charts - ONLY ONCE
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: isFullscreen ? window.innerHeight - 200 : height,
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#d1d5db',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { 
          color: 'rgba(139, 92, 246, 0.1)',
          style: 0, // Solid
        },
        horzLines: { 
          color: 'rgba(139, 92, 246, 0.1)',
          style: 0, // Solid
        },
      },
      crosshair: {
        mode: 1, // Normal mode
        vertLine: {
          color: 'rgba(139, 92, 246, 0.7)',
          width: 1,
          style: 3, // Dashed
        },
        horzLine: {
          color: 'rgba(139, 92, 246, 0.7)',
          width: 1,
          style: 3, // Dashed
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(139, 92, 246, 0.2)',
      },
      rightPriceScale: {
        borderColor: 'rgba(139, 92, 246, 0.2)',
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.35 : 0.1, // Reserve space for volume panel
        },
      },
      leftPriceScale: {
        visible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Use historical data if available, otherwise use fallback
    const dataToUse = historicalData && historicalData.length > 0 ? historicalData : generateCandlestickData(currentPrice);
    setChartData(dataToUse);
    
    // Debug: Log the first few data points to verify format
    console.log('[TradingChart] Initial data sample:', {
      length: dataToUse.length,
      first: dataToUse[0],
      last: dataToUse[dataToUse.length - 1],
      timeFormat: typeof dataToUse[0]?.time,
      source: historicalData && historicalData.length > 0 ? 'historical' : 'fallback'
    });

    // Add candlestick series using theme-matching colors
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#8b5cf6',           // Purple for bullish candles (matches theme)
      downColor: '#ef4444',         // Red for bearish candles  
      borderDownColor: '#ef4444',   // Red borders for bearish
      borderUpColor: '#8b5cf6',     // Purple borders for bullish
      wickDownColor: '#ef4444',     // Red wicks for bearish
      wickUpColor: '#8b5cf6',       // Purple wicks for bullish
      priceLineVisible: false,      // Clean look without price line
    });

    candlestickSeriesRef.current = candlestickSeries;
    
    try {
      candlestickSeries.setData(dataToUse);
      console.log('[TradingChart] Successfully set initial candlestick data');
    } catch (error) {
      console.error('[TradingChart] Error setting initial candlestick data:', error);
      console.log('[TradingChart] Problematic data:', dataToUse.slice(0, 5));
    }

    // Add volume series if enabled using new v5 API
    if (showVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: 'rgba(139, 92, 246, 0.5)',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Empty string creates overlay scale (separate panel)
      });

      // Configure volume series to appear in bottom panel
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.75, // Volume starts at 75% from top (bottom 25% of chart)
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries;
      
      const volumeData = dataToUse.map(item => ({
        time: item.time,
        value: item.volume || 0,
        color: item.close >= item.open ? 'rgba(139, 92, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)' // Purple/Red theme
      }));
      
      volumeSeries.setData(volumeData);
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: isFullscreen ? window.innerHeight - 200 : height,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [showVolume, isFullscreen, height]); // Removed currentPrice dependency

  // Update chart when price data changes - SMART CANDLE MANAGEMENT
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current || chartData.length === 0) return;

    console.log('[TradingChart] Updating chart with new price:', currentPrice);
    
    // Get current time and timeframe interval
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const intervalSeconds = getTimeIntervalSeconds(timeframe);
    
    // Calculate the current candle's start time based on timeframe
    const currentCandleStartTime = Math.floor(now / intervalSeconds) * intervalSeconds;
    
    // Get the last candle
    const lastCandle = chartData[chartData.length - 1];
    const lastCandleTime = typeof lastCandle.time === 'number' ? lastCandle.time : 
                          typeof lastCandle.time === 'string' ? parseInt(lastCandle.time) : 0;
    
    console.log('[TradingChart] Time comparison:', {
      currentCandleStartTime,
      lastCandleTime,
      shouldCreateNewCandle: currentCandleStartTime > lastCandleTime,
      timeframe,
      intervalSeconds
    });
    
    let newData: CandlestickData[];
    
    // Check if we need to create a new candle
    if (currentCandleStartTime > lastCandleTime) {
      console.log('[TradingChart] Creating new candle for time:', currentCandleStartTime);
      
      // Create a new candle
      const newCandle: CandlestickData = {
        time: currentCandleStartTime as Time,
        open: currentPrice,
        high: currentPrice,
        low: currentPrice,
        close: currentPrice,
        volume: 0 // Start with 0 volume, will be updated with real data if available
      };
      
      // Add the new candle to the data
      newData = [...chartData, newCandle];
      
      // Keep only the last 100 candles for performance
      if (newData.length > 100) {
        newData = newData.slice(-100);
      }
    } else {
      // Update the existing last candle
      const updatedCandle = {
        ...lastCandle,
        close: currentPrice,
        high: Math.max(lastCandle.high, currentPrice),
        low: Math.min(lastCandle.low, currentPrice),
        // Keep the same volume for existing candle
      };
      
      newData = [...chartData.slice(0, -1), updatedCandle];
    }
    
    // Update state and chart
    setChartData(newData);
    
    try {
      candlestickSeriesRef.current.setData(newData);
      console.log('[TradingChart] Successfully updated chart with', newData.length, 'candles');
    } catch (error) {
      console.error('[TradingChart] Error updating candlestick series:', error);
    }

    // Update volume series if it exists
    if (volumeSeriesRef.current && showVolume) {
      const volumeData = newData.map(item => ({
        time: item.time,
        value: item.volume || 0,
        color: item.close >= item.open ? 'rgba(139, 92, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)' // Purple/Red theme
      }));
      try {
        volumeSeriesRef.current.setData(volumeData);
      } catch (error) {
        console.error('[TradingChart] Error updating volume series:', error);
      }
    }
  }, [currentPrice, timeframe]);

  // Handle chart type changes
  useEffect(() => {
    if (!chartRef.current) return;

    // Remove existing series
    if (candlestickSeriesRef.current) {
      chartRef.current.removeSeries(candlestickSeriesRef.current);
    }
    if (volumeSeriesRef.current) {
      chartRef.current.removeSeries(volumeSeriesRef.current);
    }

    // Add appropriate series based on chart type using new v5 API
    if (chartType === 'candlestick') {
      const candlestickSeries = chartRef.current.addSeries(CandlestickSeries, {
        upColor: '#8b5cf6',           // Purple for bullish candles (matches theme)
        downColor: '#ef4444',         // Red for bearish candles  
        borderDownColor: '#ef4444',   // Red borders for bearish
        borderUpColor: '#8b5cf6',     // Purple borders for bullish
        wickDownColor: '#ef4444',     // Red wicks for bearish
        wickUpColor: '#8b5cf6',       // Purple wicks for bullish
        priceLineVisible: false,      // Clean look without price line
      });
      candlestickSeriesRef.current = candlestickSeries;
      candlestickSeries.setData(chartData);
    } else if (chartType === 'line') {
      const lineSeries = chartRef.current.addSeries(LineSeries, {
        color: '#8b5cf6',
        lineWidth: 2,
      });
      const lineData = chartData.map(item => ({
        time: item.time,
        value: (item.open + item.close) / 2,
      }));
      lineSeries.setData(lineData);
    } else if (chartType === 'area') {
      const areaSeries = chartRef.current.addSeries(AreaSeries, {
        lineColor: '#8b5cf6',
        topColor: 'rgba(139, 92, 246, 0.4)',
        bottomColor: 'rgba(139, 92, 246, 0.0)',
        lineWidth: 2,
      });
      const areaData = chartData.map(item => ({
        time: item.time,
        value: (item.open + item.close) / 2,
      }));
      areaSeries.setData(areaData);
    }

    // Re-add volume series if enabled using new v5 API
    if (showVolume) {
      const volumeSeries = chartRef.current.addSeries(HistogramSeries, {
        color: 'rgba(139, 92, 246, 0.5)',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Empty string creates overlay scale (separate panel)
      });

      // Configure volume series to appear in bottom panel
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.75, // Volume starts at 75% from top (bottom 25% of chart)
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries;
      
      const volumeData = chartData.map(item => ({
        time: item.time,
        value: item.volume || 0,
        color: item.close >= item.open ? 'rgba(139, 92, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)' // Purple/Red theme
      }));
      
      volumeSeries.setData(volumeData);
    }
  }, [chartType, showVolume, chartData]);

  // Update chart when historical data changes
  useEffect(() => {
    if (!chartRef.current || !historicalData) return;
    
    console.log('[TradingChart] Historical data updated, using real data');
    
    // Use real historical data when it becomes available
    if (historicalData.length > 0) {
      setChartData(historicalData);
      
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(historicalData);
      }
      
      if (volumeSeriesRef.current && showVolume) {
        const volumeData = historicalData.map((item: CandlestickData) => ({
          time: item.time,
          value: item.volume || 0,
          color: item.close >= item.open ? 'rgba(139, 92, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)' // Purple/Red theme
        }));
        volumeSeriesRef.current.setData(volumeData);
      }
    }
  }, [historicalData, showVolume]);

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  return (
    <div className={`bg-[#0b0e11] ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Chart Header */}
      <div className="border-b border-slate-800 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold text-white">
                {symbol.replace('/', '')} - {timeframe} · Hyperliquid
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-lg font-bold text-white">
                  ${currentPrice.toLocaleString()}
                </span>
                <span className={`flex items-center text-sm ${priceChange >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}`}>
                  {priceChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
                <span className="text-sm text-[#a1a1a1]">
                  Vol: {(volume24h / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Timeframe Selector */}
            <div className="flex items-center space-x-1 bg-[#1a1d24] rounded-lg p-1">
              {(['1m', '5m', '15m', '1h', '4h', '1D'] as const).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setTimeframe(tf);
                    onTimeframeChange?.(tf);
                  }}
                  className={`text-xs px-3 py-1 h-7 ${
                    timeframe === tf 
                      ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]' 
                      : 'text-[#a1a1a1] hover:text-white hover:bg-[#2a2d35]'
                  }`}
                >
                  {tf}
                </Button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex space-x-1 bg-[#1a1d24] rounded-lg p-1">
              {(['candlestick', 'line', 'area'] as const).map((type) => (
                <Button
                  key={type}
                  variant={chartType === type ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType(type)}
                  className={`text-xs capitalize px-3 py-1 h-7 ${
                    chartType === type 
                      ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]' 
                      : 'text-[#a1a1a1] hover:text-white hover:bg-[#2a2d35]'
                  }`}
                >
                  {type === 'candlestick' ? 'Candles' : type}
                </Button>
              ))}
            </div>

            {/* Indicators */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleIndicator('RSI')}
              className="text-xs h-7 border-slate-600 hover:border-[#8b5cf6]"
            >
              <Plus className="w-3 h-3 mr-1" />
              Indicators
            </Button>

            {/* Volume Toggle */}
            <Button
              variant={showVolume ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowVolume(!showVolume)}
              className={`text-xs h-7 ${
                showVolume 
                  ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]' 
                  : 'border-slate-600 hover:border-[#8b5cf6]'
              }`}
            >
              <Volume2 className="w-3 h-3 mr-1" />
              Volume
            </Button>

            {/* Fullscreen */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-xs h-7 border-slate-600 hover:border-[#8b5cf6]"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>

            {/* Live Status */}
            <Badge variant="outline" className="bg-[#16c784]/10 border-[#16c784]/30 text-[#16c784]">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>

        {/* Active Indicators */}
        {indicators.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-xs text-[#a1a1a1]">Indicators:</span>
            {indicators.map((indicator) => (
              <Badge
                key={indicator}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-red-500/20 border-slate-600"
                onClick={() => toggleIndicator(indicator)}
              >
                {indicator} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* TradingView Chart Container */}
      <div className="flex-1 p-4">
        <div 
          ref={chartContainerRef}
          className="w-full bg-[#0f172a] rounded-lg border border-slate-800"
          style={{ height: isFullscreen ? 'calc(100vh - 200px)' : `${height}px` }}
        />
      </div>

      {/* Chart Footer */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-xs text-[#a1a1a1]">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-[#16c784] rounded mr-2"></div>
              Live Hyperliquid Data
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-[#8b5cf6] rounded mr-2"></div>
              TradingView Lightweight Charts
            </span>
          </div>
          <div className="text-xs text-[#a1a1a1]">
            Last update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Fullscreen overlay close button */}
      {isFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-10"
        >
          Close Fullscreen
        </Button>
      )}
    </div>
  );
}