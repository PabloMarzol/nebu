import { useState, useEffect } from "react";

interface AnimatedLoadingProps {
  type?: "trading" | "chart" | "portfolio" | "blockchain" | "mining";
  message?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export default function AnimatedLoading({ 
  type = "trading", 
  message = "Loading...", 
  size = "md",
  color = "#8b5cf6" 
}: AnimatedLoadingProps) {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "w-8 h-8";
      case "lg": return "w-16 h-16";
      default: return "w-12 h-12";
    }
  };

  const renderTradingAnimation = () => (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg className={getSizeClasses()} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`${color}20`}
            strokeWidth="8"
          />
          {/* Animated progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={283 - (animationFrame * 4.7)}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
          {/* Center icon */}
          <text x="50" y="60" textAnchor="middle" fontSize="24" fill={color}>
            {animationFrame < 20 ? "₿" : animationFrame < 40 ? "Ξ" : "◊"}
          </text>
        </svg>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: color,
                left: `${50 + 30 * Math.cos((animationFrame + i * 20) * 0.2)}%`,
                top: `${50 + 30 * Math.sin((animationFrame + i * 20) * 0.2)}%`,
                opacity: 0.5 + 0.5 * Math.sin((animationFrame + i * 10) * 0.3),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderChartAnimation = () => (
    <div className="flex items-center justify-center">
      <svg className={getSizeClasses()} viewBox="0 0 100 100">
        {/* Chart bars */}
        {[20, 35, 50, 65, 80].map((x, i) => (
          <rect
            key={i}
            x={x - 3}
            y={80 - (20 + 30 * Math.sin((animationFrame + i * 10) * 0.3))}
            width="6"
            height={20 + 30 * Math.sin((animationFrame + i * 10) * 0.3)}
            fill={color}
            opacity={0.7 + 0.3 * Math.sin((animationFrame + i * 5) * 0.2)}
            rx="1"
          />
        ))}
        {/* Trend line */}
        <polyline
          points={[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]
            .map((val, i) => `${10 + i * 10},${60 + 15 * Math.sin((animationFrame + i * 5) * 0.2)}`)
            .join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.8"
        />
      </svg>
    </div>
  );

  const renderPortfolioAnimation = () => (
    <div className="flex items-center justify-center">
      <svg className={getSizeClasses()} viewBox="0 0 100 100">
        {/* Pie chart segments */}
        {[
          { start: 0, end: 120, color: "#00ff88" },
          { start: 120, end: 200, color: "#ff4757" },
          { start: 200, end: 300, color: "#ffa726" },
          { start: 300, end: 360, color: "#42a5f5" },
        ].map((segment, i) => {
          const startAngle = (segment.start + animationFrame * 2) * (Math.PI / 180);
          const endAngle = (segment.end + animationFrame * 2) * (Math.PI / 180);
          const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
          
          const x1 = 50 + 35 * Math.cos(startAngle);
          const y1 = 50 + 35 * Math.sin(startAngle);
          const x2 = 50 + 35 * Math.cos(endAngle);
          const y2 = 50 + 35 * Math.sin(endAngle);

          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={segment.color}
              opacity={0.7 + 0.3 * Math.sin((animationFrame + i * 15) * 0.1)}
            />
          );
        })}
        {/* Center circle */}
        <circle cx="50" cy="50" r="15" fill="#1a1a2e" />
        <text x="50" y="56" textAnchor="middle" fontSize="12" fill={color}>
          $
        </text>
      </svg>
    </div>
  );

  const renderBlockchainAnimation = () => (
    <div className="flex items-center justify-center">
      <div className="flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 border-2 rounded"
            style={{
              borderColor: color,
              backgroundColor: i <= (animationFrame / 12) % 5 ? color : "transparent",
              opacity: 0.5 + 0.5 * Math.sin((animationFrame - i * 3) * 0.5),
              transform: `scale(${0.8 + 0.2 * Math.sin((animationFrame + i * 5) * 0.3)})`,
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderMiningAnimation = () => (
    <div className="flex items-center justify-center">
      <svg className={getSizeClasses()} viewBox="0 0 100 100">
        {/* Mining pickaxe */}
        <g transform={`rotate(${-10 + 20 * Math.sin(animationFrame * 0.3)} 50 50)`}>
          <rect x="45" y="20" width="10" height="40" fill={color} rx="2" />
          <rect x="35" y="15" width="30" height="8" fill={color} rx="4" />
        </g>
        {/* Sparks */}
        {[...Array(6)].map((_, i) => (
          <circle
            key={i}
            cx={50 + 20 * Math.cos((animationFrame + i * 10) * 0.4)}
            cy={60 + 20 * Math.sin((animationFrame + i * 10) * 0.4)}
            r={1 + Math.sin((animationFrame + i * 5) * 0.6)}
            fill="#ffa726"
            opacity={0.3 + 0.7 * Math.sin((animationFrame + i * 8) * 0.4)}
          />
        ))}
        {/* Hash symbols */}
        <text x="30" y="85" fontSize="8" fill={color} opacity={0.5 + 0.5 * Math.sin(animationFrame * 0.2)}>
          #
        </text>
        <text x="70" y="85" fontSize="8" fill={color} opacity={0.5 + 0.5 * Math.sin((animationFrame + 15) * 0.2)}>
          #
        </text>
      </svg>
    </div>
  );

  const renderAnimation = () => {
    switch (type) {
      case "chart": return renderChartAnimation();
      case "portfolio": return renderPortfolioAnimation();
      case "blockchain": return renderBlockchainAnimation();
      case "mining": return renderMiningAnimation();
      default: return renderTradingAnimation();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {renderAnimation()}
      <div className="text-center">
        <div className="text-sm font-medium" style={{ color }}>
          {message}
        </div>
        <div className="flex space-x-1 mt-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: color,
                opacity: 0.3 + 0.7 * Math.sin((animationFrame + i * 10) * 0.4),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Crypto-themed loading messages
export const loadingMessages = {
  trading: [
    "Analyzing market trends...",
    "Calculating optimal entry points...",
    "Processing order book data...",
    "Syncing with exchange APIs...",
  ],
  chart: [
    "Loading candlestick data...",
    "Rendering price movements...",
    "Applying technical indicators...",
    "Fetching historical data...",
  ],
  portfolio: [
    "Calculating portfolio balance...",
    "Updating asset allocations...",
    "Syncing wallet balances...",
    "Computing performance metrics...",
  ],
  blockchain: [
    "Connecting to blockchain...",
    "Verifying transactions...",
    "Mining new blocks...",
    "Synchronizing network state...",
  ],
  mining: [
    "Initializing mining hardware...",
    "Calculating hash rates...",
    "Joining mining pool...",
    "Optimizing energy efficiency...",
  ],
};

// Helper component for loading overlays
export function LoadingOverlay({ 
  isLoading, 
  type = "trading", 
  children 
}: { 
  isLoading: boolean; 
  type?: AnimatedLoadingProps["type"]; 
  children: React.ReactNode;
}) {
  if (!isLoading) return <>{children}</>;

  const messages = loadingMessages[type || "trading"];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="relative">
      <div className="opacity-30">{children}</div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <AnimatedLoading type={type} message={randomMessage} />
      </div>
    </div>
  );
}