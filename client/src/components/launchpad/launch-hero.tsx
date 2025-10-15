import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "wouter";
import CountdownTimer from "./countdown-timer";
import ICOParticipation from "./ico-participation";
import { Rocket, Users, Target, Star, TrendingUp, Shield, FileText } from "lucide-react";

interface LaunchHeroProps {
  projectId?: string;
  projectName: string;
  tokenSymbol: string;
  description: string;
  logo: string;
  category: string;
  launchDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed" | "sold_out";
  currentRaise: number;
  targetRaise: number;
  participants: number;
  maxParticipants: number;
  launchPrice: number;
  featured?: boolean;
}

export default function LaunchHero({
  projectId = "defichain-1",
  projectName,
  tokenSymbol,
  description,
  logo,
  category,
  launchDate,
  endDate,
  status,
  currentRaise,
  targetRaise,
  participants,
  maxParticipants,
  launchPrice,
  featured = false
}: LaunchHeroProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [showParticipationModal, setShowParticipationModal] = useState(false);

  useEffect(() => {
    // Generate floating particles for visual effect
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10
    }));
    setParticles(newParticles);

    // Animate glow effect for live launches
    if (status === "live") {
      const glowInterval = setInterval(() => {
        setGlowIntensity((prev) => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(glowInterval);
    }
  }, [status]);

  const progressPercentage = (currentRaise / targetRaise) * 100;
  const participationPercentage = (participants / maxParticipants) * 100;

  const getStatusIcon = () => {
    switch (status) {
      case "live": return <Rocket className="w-6 h-6" />;
      case "upcoming": return <Target className="w-6 h-6" />;
      case "completed": return <TrendingUp className="w-6 h-6" />;
      case "sold_out": return <Star className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  const handleCountdownComplete = () => {
    // Handle when countdown reaches zero
    console.log("Launch countdown completed!");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-cyan-900/20" />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}

        {/* Dynamic Glow Effect for Live Launches */}
        {status === "live" && (
          <div 
            className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent"
            style={{
              opacity: 0.3 + (glowIntensity / 1000),
              transform: `scale(${1 + glowIntensity / 500})`
            }}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {featured && (
            <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              FEATURED LAUNCH
            </Badge>
          )}
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-6xl">{logo}</div>
            <div>
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {projectName}
                </span>
              </h1>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <Badge variant="outline" className="text-lg px-3 py-1">{tokenSymbol}</Badge>
                <Badge variant="secondary" className="text-lg px-3 py-1">{category}</Badge>
              </div>
            </div>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
            {description}
          </p>
        </div>

        {/* Hero Countdown Timer */}
        <div className="mb-12">
          <CountdownTimer
            targetDate={status === "upcoming" ? launchDate : endDate}
            status={status}
            title={status === "upcoming" ? "Launch Starts In" : status === "live" ? "Launch Ends In" : "Launch Complete"}
            variant="hero"
            showProgress={true}
            onTimeUp={handleCountdownComplete}
          />
        </div>

        {/* Launch Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                ${currentRaise.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Raised</div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {progressPercentage.toFixed(1)}% of ${targetRaise.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {participants.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Participants</div>
              <Progress value={participationPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {participationPercentage.toFixed(1)}% of {maxParticipants.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                ${launchPrice}
              </div>
              <div className="text-sm text-muted-foreground">Token Price</div>
              <div className="text-xs text-green-400 mt-1">Fixed Price</div>
            </CardContent>
          </Card>

          <Card className="glass border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon()}
              </div>
              <div className="text-lg font-bold text-orange-400 mb-2">
                {status.replace('_', ' ').toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">Launch Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10" style={{ pointerEvents: 'auto' }}>
          {status === "live" && (
            <>
              <button 
                className="relative z-50 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200 cursor-pointer border-0 flex items-center gap-2 animate-pulse"
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Participate Now button clicked!");
                  alert("Opening participation modal...");
                  setShowParticipationModal(true);
                }}
                onMouseDown={(e) => {
                  console.log("Participate button mouse down!");
                }}
              >
                <Rocket className="w-6 h-6" />
                Participate Now
              </button>
              <button 
                className="relative z-50 border border-blue-500 text-blue-400 hover:bg-blue-500/10 text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-transparent flex items-center gap-2"
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Whitepaper button clicked!");
                  alert("Opening whitepaper...");
                  window.open('/defichain-whitepaper.html', '_blank');
                }}
                onMouseDown={(e) => {
                  console.log("Whitepaper button mouse down!");
                }}
              >
                <FileText className="w-6 h-6" />
                Whitepaper
              </button>
              <Link href={`/project-details?id=${projectId}`}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8 py-4 relative z-50"
                  style={{ pointerEvents: 'auto' }}
                >
                  View Details
                </Button>
              </Link>
            </>
          )}
          
          {status === "upcoming" && (
            <>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-8 py-4"
              >
                <Users className="mr-2 h-6 w-6" />
                Join Whitelist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10 text-lg px-8 py-4"
              >
                Get Notified
              </Button>
            </>
          )}
          
          {(status === "completed" || status === "sold_out") && (
            <>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4"
              >
                <TrendingUp className="mr-2 h-6 w-6" />
                View Results
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8 py-4"
              >
                Trade Token
              </Button>
            </>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-green-400">287%</div>
              <div className="text-sm text-muted-foreground">Avg ROI</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">47</div>
              <div className="text-sm text-muted-foreground">Projects Launched</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">$15.2M</div>
              <div className="text-sm text-muted-foreground">Total Raised</div>
            </div>
          </div>
        </div>
      </div>

      {/* Participation Modal */}
      {showParticipationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowParticipationModal(false)} />
          <div className="relative bg-background border border-border rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Participate in {projectName} Launch</h2>
              <Button variant="ghost" onClick={() => setShowParticipationModal(false)}>
                ✕
              </Button>
            </div>
            <div className="p-6">
              <ICOParticipation 
                launchId={projectId}
                projectName={projectName}
                tokenSymbol={tokenSymbol}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}