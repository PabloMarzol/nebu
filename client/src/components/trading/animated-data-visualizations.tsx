import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart, Zap } from "lucide-react";

interface DataPoint {
  timestamp: number;
  value: number;
  volume?: number;
  sentiment?: number;
}

interface AnimatedMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  color: string;
  icon: string;
  trend: "up" | "down" | "neutral";
  sparklineData: number[];
}

export default function AnimatedDataVisualizations() {
  const [metrics, setMetrics] = useState<AnimatedMetric[]>([
    {
      id: "btc-price",
      label: "Bitcoin Price",
      value: 67420,
      previousValue: 65850,
      change: 1570,
      changePercent: 2.38,
      color: "#f7931a",
      icon: "₿",
      trend: "up",
      sparklineData: [65000, 65500, 64800, 66200, 67000, 66800, 67420]
    },
    {
      id: "portfolio-value",
      label: "Portfolio Value",
      value: 125640,
      previousValue: 122100,
      change: 3540,
      changePercent: 2.9,
      color: "#10b981",
      icon: "💼",
      trend: "up",
      sparklineData: [118000, 120000, 119500, 122100, 124000, 123500, 125640]
    },
    {
      id: "market-cap",
      label: "Market Cap",
      value: 2.4e12,
      previousValue: 2.35e12,
      change: 5e10,
      changePercent: 2.13,
      color: "#06b6d4",
      icon: "🏦",
      trend: "up",
      sparklineData: [2.2e12, 2.25e12, 2.3e12, 2.35e12, 2.38e12, 2.36e12, 2.4e12]
    },
    {
      id: "volume-24h",
      label: "24h Volume",
      value: 45.2e9,
      previousValue: 52.1e9,
      change: -6.9e9,
      changePercent: -13.24,
      color: "#ec4899",
      icon: "📊",
      trend: "down",
      sparklineData: [52e9, 48e9, 50e9, 49e9, 47e9, 46e9, 45.2e9]
    }
  ]);

  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  // Real-time price simulation
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => {
          const volatility = metric.id === "volume-24h" ? 0.05 : 0.02;
          const change = (Math.random() - 0.5) * 2 * volatility;
          const newValue = metric.value * (1 + change);
          const newChange = newValue - metric.previousValue;
          const newChangePercent = (newChange / metric.previousValue) * 100;
          
          return {
            ...metric,
            previousValue: metric.value,
            value: newValue,
            change: newChange,
            changePercent: newChangePercent,
            trend: newChange > 0 ? "up" : newChange < 0 ? "down" : "neutral",
            sparklineData: [...metric.sparklineData.slice(1), newValue]
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Animated counter hook
  const useAnimatedCounter = (targetValue: number, duration: number = 1000) => {
    const [currentValue, setCurrentValue] = useState(targetValue);
    
    useEffect(() => {
      const startValue = currentValue;
      const difference = targetValue - startValue;
      const startTime = Date.now();
      
      const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const newValue = startValue + (difference * easeOutCubic);
        
        setCurrentValue(newValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };
      
      requestAnimationFrame(updateValue);
    }, [targetValue, duration]);
    
    return currentValue;
  };

  // Sparkline component with animations
  const AnimatedSparkline = ({ data, color, width = 100, height = 30 }: {
    data: number[];
    color: string;
    width?: number;
    height?: number;
  }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${color.slice(1)}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={`M 0,${height} L ${points} L ${width},${height} Z`}
          fill={`url(#gradient-${color.slice(1)})`}
          className="animate-pulse"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-sm"
        >
          <animate
            attributeName="stroke-dasharray"
            values={`0,${width * 2};${width * 2},0`}
            dur="2s"
            repeatCount="indefinite"
          />
        </polyline>
        
        {/* Animated dots */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              opacity={index === data.length - 1 ? 1 : 0.6}
              className={index === data.length - 1 ? "animate-pulse" : ""}
            >
              {index === data.length - 1 && (
                <animate
                  attributeName="r"
                  values="2;4;2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          );
        })}
      </svg>
    );
  };

  // Animated metric card
  const AnimatedMetricCard = ({ metric }: { metric: AnimatedMetric }) => {
    const animatedValue = useAnimatedCounter(metric.value);
    const animatedChange = useAnimatedCounter(metric.change);
    
    const formatValue = (value: number) => {
      if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
      if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
      return `$${value.toFixed(2)}`;
    };

    return (
      <Card className="glass-strong relative overflow-hidden group hover:border-purple-400/50 transition-all duration-300 h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-3 relative h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <span className="text-lg animate-bounce" style={{ animationDelay: `${Math.random() * 2}s` }}>
                {metric.icon}
              </span>
              <h3 className="font-semibold text-xs">{metric.label}</h3>
            </div>
            <Badge className={`${
              metric.trend === "up" ? "bg-green-500" : 
              metric.trend === "down" ? "bg-red-500" : "bg-gray-500"
            } animate-pulse text-xs px-1 py-0`}>
              {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"}
            </Badge>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-1">
            <div className="text-xl font-bold" style={{ color: metric.color }}>
              {formatValue(animatedValue)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`text-xs flex items-center space-x-1 ${
                metric.changePercent > 0 ? "text-green-400" : 
                metric.changePercent < 0 ? "text-red-400" : "text-gray-400"
              }`}>
                {metric.changePercent > 0 ? <TrendingUp className="w-2 h-2" /> : 
                 metric.changePercent < 0 ? <TrendingDown className="w-2 h-2" /> : 
                 <Activity className="w-2 h-2" />}
                <span>
                  {metric.changePercent > 0 ? "+" : ""}{metric.changePercent.toFixed(2)}%
                </span>
              </div>
              
              <div className="text-[10px] text-muted-foreground">
                {formatValue(Math.abs(animatedChange))}
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <AnimatedSparkline data={metric.sparklineData} color={metric.color} width={80} height={20} />
          </div>
          
          {/* Animated background elements - smaller */}
          <div className="absolute top-1 right-1 opacity-10">
            <div 
              className="w-12 h-12 rounded-full animate-spin-slow"
              style={{ background: `conic-gradient(from 0deg, ${metric.color}, transparent, ${metric.color})` }}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  // Clean professional donut chart
  const AnimatedDonutChart = () => {
    const data = [
      { label: "Bitcoin", value: 45, color: "#f7931a" },
      { label: "Ethereum", value: 25, color: "#627eea" },
      { label: "Solana", value: 15, color: "#9945ff" },
      { label: "Others", value: 15, color: "#06b6d4" }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="flex flex-col items-center justify-center h-full p-0 space-y-1 overflow-hidden">
        {/* Maximum possible donut chart size */}
        <div className="relative">
          <svg width="180" height="180" className="transform -rotate-90">
            <defs>
              {data.map((item, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={item.color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={item.color} stopOpacity="0.6" />
                </linearGradient>
              ))}
            </defs>
            
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="64"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
            />
            
            {data.map((item, index) => {
              const percentage = item.value / total;
              const circumference = 2 * Math.PI * 64;
              const strokeDasharray = `${percentage * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage * circumference;
              cumulativePercentage += percentage;

              return (
                <circle
                  key={index}
                  cx="90"
                  cy="90"
                  r="64"
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-2000 ease-out"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values={`0 ${circumference};${strokeDasharray}`}
                    dur="2s"
                    fill="freeze"
                  />
                </circle>
              );
            })}
          </svg>
          
          {/* Center text with ample space */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-white leading-tight">Portfolio</div>
            <div className="text-xl text-gray-400 leading-tight">Distribution</div>
          </div>
        </div>
        
        {/* Compact legend */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-full text-center">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-center space-x-1">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-gray-300">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Animated bar chart
  const AnimatedBarChart = () => {
    const data = [
      { label: "Mon", value: 65 },
      { label: "Tue", value: 45 },
      { label: "Wed", value: 80 },
      { label: "Thu", value: 35 },
      { label: "Fri", value: 95 },
      { label: "Sat", value: 60 },
      { label: "Sun", value: 75 }
    ];

    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <div className="w-full h-32">
        <svg width="100%" height="128" viewBox="0 0 280 128">
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 80;
            const x = index * 40 + 10;
            const y = 100 - barHeight;

            return (
              <g key={index}>
                {/* Animated bar */}
                <rect
                  x={x}
                  y={100}
                  width="24"
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx="2"
                  className="transition-all duration-1000 ease-out"
                >
                  <animate
                    attributeName="height"
                    values={`0;${barHeight}`}
                    dur="1s"
                    begin={`${index * 0.1}s`}
                    fill="freeze"
                  />
                  <animate
                    attributeName="y"
                    values={`100;${y}`}
                    dur="1s"
                    begin={`${index * 0.1}s`}
                    fill="freeze"
                  />
                </rect>
                
                {/* Value label */}
                <text
                  x={x + 12}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-white"
                  opacity="0"
                >
                  {item.value}
                  <animate
                    attributeName="opacity"
                    values="0;1"
                    dur="0.5s"
                    begin={`${index * 0.1 + 1}s`}
                    fill="freeze"
                  />
                </text>
                
                {/* Day label */}
                <text
                  x={x + 12}
                  y="115"
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Live Data Visualizations</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
              className="glass"
            >
              <Zap className={`w-4 h-4 mr-2 ${isAnimating ? 'animate-pulse' : ''}`} />
              {isAnimating ? "Pause" : "Resume"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Animated Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <AnimatedMetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Advanced Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Distribution */}
          <Card className="glass-strong overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>Portfolio Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <AnimatedDonutChart />
            </CardContent>
          </Card>

          {/* Weekly Performance */}
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Weekly Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedBarChart />
            </CardContent>
          </Card>
        </div>

        {/* Real-time Price Waves */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle>Market Pulse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-24 relative overflow-hidden">
              <svg width="100%" height="96" className="absolute inset-0">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0">
                      <animate attributeName="stop-opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0">
                      <animate attributeName="stop-opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                </defs>
                
                {/* Animated wave paths */}
                {[0, 1, 2].map((wave) => (
                  <path
                    key={wave}
                    d={`M 0 ${48 + wave * 8} Q 150 ${20 + wave * 8} 300 ${48 + wave * 8} T 600 ${48 + wave * 8}`}
                    fill="none"
                    stroke="url(#waveGradient)"
                    strokeWidth="2"
                    opacity={0.7 - wave * 0.2}
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="-300 0;0 0;300 0"
                      dur={`${4 + wave}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                ))}
                
                {/* Floating particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <circle
                    key={i}
                    r="2"
                    fill="#8b5cf6"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="cx"
                      values={`${Math.random() * 600};${Math.random() * 600 + 300}`}
                      dur={`${3 + Math.random() * 4}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      values={`${Math.random() * 96};${Math.random() * 96}`}
                      dur={`${2 + Math.random() * 3}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.8;0"
                      dur={`${2 + Math.random() * 2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">Live Market Activity</div>
                  <div className="text-sm text-muted-foreground">Real-time data visualization</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400 animate-pulse">+12.5%</div>
                <div className="text-sm text-muted-foreground">24h Change</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 animate-pulse">2.4M</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 animate-pulse">$45.2B</div>
                <div className="text-sm text-muted-foreground">Total Volume</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400 animate-pulse">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}