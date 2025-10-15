import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Rocket, Clock, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import CountdownTimer from "./countdown-timer";

interface FloatingCountdownProps {
  onDismiss?: () => void;
  isInline?: boolean;
}

export default function FloatingCountdown({ onDismiss, isInline = false }: FloatingCountdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Don't show if permanently dismissed
    if (isPermanentlyDismissed) {
      return;
    }

    // Only show countdown on homepage after 1 second
    if (location === '/') {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Show immediately on other pages
      setIsVisible(true);
    }
  }, [location, isPermanentlyDismissed]);

  // Auto-dismiss after 5 seconds when visible
  useEffect(() => {
    if (isVisible && location === '/' && !isPermanentlyDismissed) {
      const dismissTimer = setTimeout(() => {
        console.log("Auto-dismissing floating countdown after 5 seconds");
        setIsVisible(false);
        setIsPermanentlyDismissed(true);
        if (onDismiss) {
          onDismiss();
        }
      }, 5000);

      return () => clearTimeout(dismissTimer);
    }
  }, [isVisible, location, onDismiss, isPermanentlyDismissed]);

  // Mock data for the most urgent launch
  const urgentLaunch = {
    id: "1",
    name: "DeFiChain Protocol",
    symbol: "DCP",
    logo: "🔗",
    endDate: "2024-12-20T18:00:00Z",
    status: "live" as const,
    targetRaise: 2500000,
    currentRaise: 1875000
  };

  const handleDismiss = () => {
    console.log("Dismissing floating countdown");
    setIsVisible(false);
    setIsPermanentlyDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible || isPermanentlyDismissed) return null;

  // Render as button when inline
  if (isInline) {
    return (
      <div className="flex justify-center">
        <Link href="/launchpad">
          <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all duration-300">
            <Rocket className="h-4 w-4 mr-2" />
            View Launchpad
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[102px] right-6 z-50 animate-in slide-in-from-bottom-full duration-500">
      <Card className="glass border-2 border-green-500/30 shadow-2xl max-w-sm backdrop-blur-lg">
        <CardContent className="p-4">
          {!isMinimized ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-lg">{urgentLaunch.logo}</div>
                  <div>
                    <div className="font-semibold text-sm">{urgentLaunch.name}</div>
                    <Badge className="bg-green-600 text-white text-xs animate-pulse">
                      <Rocket className="w-3 h-3 mr-1" />
                      LIVE NOW
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMinimize();
                    }}
                    className="h-6 w-6 p-0 hover:bg-muted/20 z-50 relative"
                    style={{ zIndex: 50, pointerEvents: 'auto' }}
                  >
                    −
                  </Button>
                  <button
                    onClick={handleDismiss}
                    className="h-8 w-8 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/50 rounded cursor-pointer"
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Countdown */}
              <div className="mb-3">
                <CountdownTimer
                  targetDate={urgentLaunch.endDate}
                  status={urgentLaunch.status}
                  variant="compact"
                />
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{((urgentLaunch.currentRaise / urgentLaunch.targetRaise) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(urgentLaunch.currentRaise / urgentLaunch.targetRaise) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <Link href="/launchpad">
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <TrendingUp className="w-3 h-3 mr-2" />
                  Participate Now
                </Button>
              </Link>
            </>
          ) : (
            /* Minimized View */
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-sm">{urgentLaunch.logo}</div>
                <CountdownTimer
                  targetDate={urgentLaunch.endDate}
                  status={urgentLaunch.status}
                  variant="compact"
                />
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMinimize();
                  }}
                  className="h-6 w-6 p-0 hover:bg-muted/20 z-50 relative"
                  style={{ zIndex: 50, pointerEvents: 'auto' }}
                >
                  +
                </Button>
                <button
                  onClick={handleDismiss}
                  className="h-8 w-8 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/50 rounded cursor-pointer"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}