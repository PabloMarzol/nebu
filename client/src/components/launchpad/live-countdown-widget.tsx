import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./countdown-timer";
import { Rocket, Users, TrendingUp, Zap, AlertCircle } from "lucide-react";

interface LiveCountdownWidgetProps {
  launches: Array<{
    id: string;
    name: string;
    symbol: string;
    logo: string;
    endDate: string;
    status: "upcoming" | "live" | "completed" | "sold_out";
    currentRaise: number;
    targetRaise: number;
    participants: number;
  }>;
}

export default function LiveCountdownWidget({ launches }: LiveCountdownWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeLaunches = launches.filter(launch => 
    launch.status === "live" || launch.status === "upcoming"
  );

  useEffect(() => {
    if (activeLaunches.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeLaunches.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [activeLaunches.length]);

  if (activeLaunches.length === 0) return null;

  const currentLaunch = activeLaunches[currentIndex];
  const progressPercentage = (currentLaunch.currentRaise / currentLaunch.targetRaise) * 100;

  return (
    <Card className="glass border-2 border-purple-500/30 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5" />
      
      {/* Pulsing Effect for Live Launches */}
      {currentLaunch.status === "live" && (
        <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
      )}

      <CardContent className="relative z-10 p-6">
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{currentLaunch.logo}</div>
              <div>
                <h3 className="font-bold text-lg">{currentLaunch.name}</h3>
                <Badge variant="outline" className="text-xs">{currentLaunch.symbol}</Badge>
              </div>
            </div>
            
            <Badge className={`${
              currentLaunch.status === "live" 
                ? "bg-green-600 text-white animate-pulse" 
                : "bg-blue-600 text-white"
            }`}>
              {currentLaunch.status === "live" ? (
                <>
                  <Zap className="w-3 h-3 mr-1" />
                  LIVE NOW
                </>
              ) : (
                <>
                  <Rocket className="w-3 h-3 mr-1" />
                  STARTING SOON
                </>
              )}
            </Badge>
          </div>

          {/* Countdown Timer */}
          <div className="mb-4">
            <CountdownTimer
              targetDate={currentLaunch.endDate}
              status={currentLaunch.status}
              variant="large"
              title={currentLaunch.status === "live" ? "Ends In" : "Starts In"}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-2 bg-muted/20 rounded">
              <div className="text-lg font-bold text-green-400">
                ${(currentLaunch.currentRaise / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-muted-foreground">Raised</div>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <div className="text-lg font-bold text-blue-400">
                {progressPercentage.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <div className="text-lg font-bold text-purple-400">
                {(currentLaunch.participants / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full" 
            variant={currentLaunch.status === "live" ? "default" : "secondary"}
          >
            {currentLaunch.status === "live" ? (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Participate Now
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Join Whitelist
              </>
            )}
          </Button>

          {/* Navigation Dots */}
          {activeLaunches.length > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {activeLaunches.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-purple-400 w-6' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}