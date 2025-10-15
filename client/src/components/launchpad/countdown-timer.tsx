import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, Calendar, TrendingUp } from "lucide-react";
import AnimatedProgressRing from "./animated-progress-ring";

interface CountdownTimerProps {
  targetDate: string;
  status: "upcoming" | "live" | "completed" | "sold_out";
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  variant?: "compact" | "large" | "hero";
  onTimeUp?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function CountdownTimer({
  targetDate,
  status,
  title,
  subtitle,
  showProgress = false,
  variant = "compact",
  onTimeUp
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  
  const [isActive, setIsActive] = useState(false);
  const [pulse, setPulse] = useState(false);

  const calculateTimeRemaining = (endDate: string): TimeRemaining => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      total: difference
    };
  };

  useEffect(() => {
    if (status === "live" || status === "upcoming") {
      setIsActive(true);
      
      const timer = setInterval(() => {
        const remaining = calculateTimeRemaining(targetDate);
        setTimeRemaining(remaining);
        
        // Pulse effect when time is running low
        if (remaining.total <= 300000 && remaining.total > 0) { // Last 5 minutes
          setPulse(true);
        } else {
          setPulse(false);
        }
        
        // Call onTimeUp when countdown reaches zero
        if (remaining.total <= 0 && onTimeUp) {
          onTimeUp();
          setIsActive(false);
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsActive(false);
    }
  }, [targetDate, status, onTimeUp]);

  const getStatusConfig = () => {
    switch (status) {
      case "live":
        return {
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/20",
          label: "LIVE NOW",
          icon: <Zap className="w-4 h-4" />
        };
      case "upcoming":
        return {
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
          label: "STARTING SOON",
          icon: <Calendar className="w-4 h-4" />
        };
      case "completed":
        return {
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/20",
          label: "COMPLETED",
          icon: <TrendingUp className="w-4 h-4" />
        };
      case "sold_out":
        return {
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20",
          label: "SOLD OUT",
          icon: <TrendingUp className="w-4 h-4" />
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/20",
          label: "ENDED",
          icon: <Clock className="w-4 h-4" />
        };
    }
  };

  const statusConfig = getStatusConfig();
  const isUrgent = timeRemaining.total <= 3600000 && timeRemaining.total > 0; // Last hour
  const isCritical = timeRemaining.total <= 300000 && timeRemaining.total > 0; // Last 5 minutes

  if (variant === "hero") {
    return (
      <div className={`relative p-8 rounded-2xl ${statusConfig.bgColor} ${statusConfig.borderColor} border-2 ${pulse ? 'animate-pulse' : ''}`}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-2xl opacity-50" />
        <div className="absolute top-4 right-4">
          <Badge className={`${statusConfig.color} ${statusConfig.bgColor} border-0`}>
            {statusConfig.icon}
            <span className="ml-1">{statusConfig.label}</span>
          </Badge>
        </div>
        
        <div className="relative z-10">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-lg text-muted-foreground mb-6">{subtitle}</p>}
          
          {isActive && timeRemaining.total > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: "DAYS", value: timeRemaining.days, max: 30 },
                { label: "HOURS", value: timeRemaining.hours, max: 24 },
                { label: "MINUTES", value: timeRemaining.minutes, max: 60 },
                { label: "SECONDS", value: timeRemaining.seconds, max: 60 }
              ].map((unit, index) => (
                <div key={unit.label} className="text-center">
                  <AnimatedProgressRing
                    progress={(unit.value / unit.max) * 100}
                    size={120}
                    strokeWidth={6}
                    color={isCritical ? "#ef4444" : isUrgent ? "#f59e0b" : statusConfig.color.replace('text-', '#')}
                    animated={true}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isCritical ? 'text-red-400' : isUrgent ? 'text-orange-400' : statusConfig.color}`}>
                        {unit.value.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold tracking-wider">
                        {unit.label}
                      </div>
                    </div>
                  </AnimatedProgressRing>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className={`text-4xl font-bold ${statusConfig.color}`}>
                {status === "completed" ? "LAUNCH COMPLETE" : 
                 status === "sold_out" ? "SOLD OUT" : "ENDED"}
              </div>
            </div>
          )}
          
          {showProgress && (
            <div className="mt-6">
              <Progress 
                value={timeRemaining.total > 0 ? 100 - ((timeRemaining.total / (7 * 24 * 60 * 60 * 1000)) * 100) : 100} 
                className="h-2"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === "large") {
    return (
      <Card className={`glass ${statusConfig.borderColor} border-2 ${pulse ? 'animate-pulse' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              {title && <span className="font-semibold">{title}</span>}
            </div>
            <Badge className={`${statusConfig.color} ${statusConfig.bgColor} border-0`}>
              {statusConfig.icon}
              <span className="ml-1">{statusConfig.label}</span>
            </Badge>
          </div>
          
          {isActive && timeRemaining.total > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Days", value: timeRemaining.days },
                { label: "Hours", value: timeRemaining.hours },
                { label: "Minutes", value: timeRemaining.minutes },
                { label: "Seconds", value: timeRemaining.seconds }
              ].map((unit) => (
                <div key={unit.label} className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className={`text-2xl font-bold ${isCritical ? 'text-red-400 animate-pulse' : isUrgent ? 'text-orange-400' : statusConfig.color}`}>
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className={`text-xl font-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Compact variant (default)
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border ${pulse ? 'animate-pulse' : ''}`}>
      <Clock className="w-4 h-4" />
      {isActive && timeRemaining.total > 0 ? (
        <div className="flex items-center space-x-1">
          <span className={`font-mono font-semibold ${isCritical ? 'text-red-400' : isUrgent ? 'text-orange-400' : statusConfig.color}`}>
            {timeRemaining.days > 0 && `${timeRemaining.days}d `}
            {timeRemaining.hours.toString().padStart(2, '0')}:
            {timeRemaining.minutes.toString().padStart(2, '0')}:
            {timeRemaining.seconds.toString().padStart(2, '0')}
          </span>
          <Badge variant="outline" className={`text-xs ${statusConfig.color} border-current`}>
            {statusConfig.label}
          </Badge>
        </div>
      ) : (
        <Badge className={`${statusConfig.color} ${statusConfig.bgColor} border-0`}>
          {statusConfig.icon}
          <span className="ml-1">{statusConfig.label}</span>
        </Badge>
      )}
    </div>
  );
}