import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Calendar, Target, Users, DollarSign, TrendingUp, Clock, Shield } from "lucide-react";
import { Link } from "wouter";
import CountdownTimer from "./countdown-timer";
import LaunchHero from "./launch-hero";
import LiveCountdownWidget from "./live-countdown-widget";
import ParticipationRewards from "./participation-rewards";
import RewardsWidget from "./rewards-widget";
import DueDiligenceSummary from "./due-diligence-summary";

interface TokenLaunch {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  category: string;
  totalSupply: string;
  launchPrice: number;
  targetRaise: number;
  currentRaise: number;
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed" | "sold_out";
  allocation: {
    public: number;
    private: number;
    team: number;
    treasury: number;
  };
  vestingSchedule: string;
  minimumBuy: number;
  maximumBuy: number;
  chainId: string;
  contractAddress?: string;
}

interface TokenLaunchesProps {
  onSelectLaunch?: (launchId: string) => void;
}

export default function TokenLaunches({ onSelectLaunch }: TokenLaunchesProps = {}) {
  const [selectedTab, setSelectedTab] = useState("live");
  const [showRewardsWidget, setShowRewardsWidget] = useState(true);

  // Auto-hide DeFi Chain protocol popup after 5 seconds
  useEffect(() => {
    if (showRewardsWidget && selectedTab === "live") {
      const timer = setTimeout(() => {
        setShowRewardsWidget(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showRewardsWidget, selectedTab]);

  const tokenLaunches: TokenLaunch[] = [
    {
      id: "1",
      name: "DeFiChain Protocol",
      symbol: "DCP",
      logo: "🔗",
      description: "Next-generation decentralized finance protocol with innovative yield farming mechanisms and cross-chain interoperability.",
      category: "DeFi",
      totalSupply: "1,000,000,000",
      launchPrice: 0.05,
      targetRaise: 2500000,
      currentRaise: 1875000,
      participants: 8420,
      maxParticipants: 10000,
      startDate: "2025-01-25T10:00:00Z",
      endDate: "2025-02-05T18:00:00Z", 
      status: "live",
      allocation: { public: 40, private: 30, team: 15, treasury: 15 },
      vestingSchedule: "25% TGE, 75% over 12 months",
      minimumBuy: 100,
      maximumBuy: 5000,
      chainId: "ethereum",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678"
    },
    {
      id: "2",
      name: "GameVerse Token",
      symbol: "GVT",
      logo: "🎮",
      description: "Revolutionary gaming metaverse ecosystem connecting players, developers, and investors in a unified virtual economy.",
      category: "Gaming",
      totalSupply: "500,000,000",
      launchPrice: 0.12,
      targetRaise: 3000000,
      currentRaise: 3000000,
      participants: 12500,
      maxParticipants: 12500,
      startDate: "2024-12-08T12:00:00Z",
      endDate: "2024-12-12T20:00:00Z",
      status: "sold_out",
      allocation: { public: 35, private: 35, team: 20, treasury: 10 },
      vestingSchedule: "20% TGE, 80% over 18 months",
      minimumBuy: 200,
      maximumBuy: 8000,
      chainId: "polygon"
    },
    {
      id: "3",
      name: "AI Analytics Network",
      symbol: "AAN",
      logo: "🤖",
      description: "Decentralized artificial intelligence network providing advanced analytics and machine learning services for blockchain applications.",
      category: "AI",
      totalSupply: "2,000,000,000",
      launchPrice: 0.03,
      targetRaise: 1800000,
      currentRaise: 0,
      participants: 0,
      maxParticipants: 15000,
      startDate: "2024-12-22T14:00:00Z",
      endDate: "2024-12-28T22:00:00Z",
      status: "upcoming",
      allocation: { public: 45, private: 25, team: 20, treasury: 10 },
      vestingSchedule: "30% TGE, 70% over 10 months",
      minimumBuy: 50,
      maximumBuy: 3000,
      chainId: "ethereum"
    },
    {
      id: "4",
      name: "EcoGreen Protocol",
      symbol: "ECO",
      logo: "🌱",
      description: "Carbon-negative blockchain protocol incentivizing environmental sustainability through tokenized carbon credits and green energy certificates.",
      category: "Environment",
      totalSupply: "750,000,000",
      launchPrice: 0.08,
      targetRaise: 2200000,
      currentRaise: 2200000,
      participants: 9876,
      maxParticipants: 10000,
      startDate: "2024-11-25T09:00:00Z",
      endDate: "2024-11-30T21:00:00Z",
      status: "completed",
      allocation: { public: 50, private: 20, team: 15, treasury: 15 },
      vestingSchedule: "15% TGE, 85% over 24 months",
      minimumBuy: 75,
      maximumBuy: 4000,
      chainId: "binance"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-600";
      case "upcoming": return "bg-blue-600";
      case "completed": return "bg-purple-600";
      case "sold_out": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const featuredLaunch = tokenLaunches.find(launch => launch.status === "live") || tokenLaunches[0];

  const filteredLaunches = tokenLaunches.filter(launch => {
    if (selectedTab === "live") return launch.status === "live";
    if (selectedTab === "upcoming") return launch.status === "upcoming";
    if (selectedTab === "completed") return launch.status === "completed" || launch.status === "sold_out";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Featured Launch Hero */}
      {featuredLaunch && (
        <LaunchHero
          projectId={featuredLaunch.id}
          projectName={featuredLaunch.name}
          tokenSymbol={featuredLaunch.symbol}
          description={featuredLaunch.description}
          logo={featuredLaunch.logo}
          category={featuredLaunch.category}
          launchDate={featuredLaunch.startDate}
          endDate={featuredLaunch.endDate}
          status={featuredLaunch.status}
          currentRaise={featuredLaunch.currentRaise}
          targetRaise={featuredLaunch.targetRaise}
          participants={featuredLaunch.participants}
          maxParticipants={featuredLaunch.maxParticipants}
          launchPrice={featuredLaunch.launchPrice}
          featured={true}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8 pt-12">
        <h2 className="text-3xl font-bold mb-4">All Token Launches</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our complete collection of vetted blockchain projects and token opportunities.
        </p>
      </div>

      {/* Live Countdown Widget and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <LiveCountdownWidget launches={tokenLaunches} />
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">$15.2M</div>
                <div className="text-sm text-muted-foreground">Total Raised</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">47</div>
                <div className="text-sm text-muted-foreground">Projects Launched</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">125K</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">287%</div>
                <div className="text-sm text-muted-foreground">Avg ROI</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live" className="text-green-400">Live Sales</TabsTrigger>
          <TabsTrigger value="upcoming" className="text-blue-400">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="text-purple-400">Completed</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLaunches.map((launch) => (
              <Card key={launch.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{launch.logo}</div>
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{launch.name}</span>
                          <Badge variant="outline" className="text-xs">{launch.symbol}</Badge>
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{launch.category}</Badge>
                          <Badge className={`text-xs ${getStatusColor(launch.status)} text-white`}>
                            {launch.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CountdownTimer
                      targetDate={launch.status === "upcoming" ? launch.startDate : launch.endDate}
                      status={launch.status}
                      variant="compact"
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {launch.description}
                  </p>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        ${launch.currentRaise.toLocaleString()} / ${launch.targetRaise.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(launch.currentRaise / launch.targetRaise) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{launch.participants.toLocaleString()} participants</span>
                      <span>{((launch.currentRaise / launch.targetRaise) * 100).toFixed(1)}% funded</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-mono font-semibold">${launch.launchPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supply:</span>
                      <span className="font-mono font-semibold">{parseInt(launch.totalSupply).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Buy:</span>
                      <span className="font-mono font-semibold">${launch.minimumBuy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Buy:</span>
                      <span className="font-mono font-semibold">${launch.maximumBuy}</span>
                    </div>
                  </div>

                  {/* Allocation Chart */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Token Allocation</div>
                    <div className="grid grid-cols-4 gap-1 h-2 rounded">
                      <div className="bg-green-500 rounded-l" style={{ flex: launch.allocation.public }} />
                      <div className="bg-blue-500" style={{ flex: launch.allocation.private }} />
                      <div className="bg-purple-500" style={{ flex: launch.allocation.team }} />
                      <div className="bg-orange-500 rounded-r" style={{ flex: launch.allocation.treasury }} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <span>Public {launch.allocation.public}%</span>
                      <span>Private {launch.allocation.private}%</span>
                      <span>Team {launch.allocation.team}%</span>
                      <span>Treasury {launch.allocation.treasury}%</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      className="flex-1" 
                      disabled={launch.status !== "live"}
                      variant={launch.status === "live" ? "default" : "secondary"}
                      onClick={() => {
                        if (launch.status === "live" && onSelectLaunch) {
                          onSelectLaunch(launch.id);
                        }
                      }}
                    >
                      {launch.status === "live" ? (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Participate Now
                        </>
                      ) : launch.status === "upcoming" ? (
                        <>
                          <Calendar className="w-4 h-4 mr-2" />
                          Notify Me
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          View Results
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Open whitepaper link - for DeFiChain Protocol, open a comprehensive whitepaper
                        if (launch.name === "DeFiChain Protocol") {
                          window.open("/defichain-whitepaper.html", "_blank");
                        } else {
                          // For other projects, show a placeholder or generic whitepaper
                          window.open("#", "_blank");
                        }
                      }}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Whitepaper
                    </Button>
                    <Link href={`/project-details?id=${launch.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* How It Works */}
      <Card className="glass mt-12">
        <CardHeader>
          <CardTitle>How Token Launches Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">1. Rigorous Vetting</h3>
              <p className="text-sm text-muted-foreground">All projects undergo comprehensive due diligence and security audits before listing.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">2. Fair Allocation</h3>
              <p className="text-sm text-muted-foreground">Transparent allocation system ensuring fair access for all qualified participants.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">3. Secure Investment</h3>
              <p className="text-sm text-muted-foreground">Funds held in smart contracts with built-in investor protection mechanisms.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">4. Token Distribution</h3>
              <p className="text-sm text-muted-foreground">Automatic token distribution following predefined vesting schedules and milestones.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Widget */}
      {showRewardsWidget && selectedTab === "live" && (
        <RewardsWidget
          launchId="1"
          projectName="DeFiChain Protocol"
          onClose={() => setShowRewardsWidget(false)}
        />
      )}
    </div>
  );
}