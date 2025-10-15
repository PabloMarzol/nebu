import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Rocket, Users, Target, Shield, FileText, TrendingUp, Star, Calendar, DollarSign } from "lucide-react";
import CountdownTimer from "@/components/launchpad/countdown-timer";

export default function ProjectDetails() {
  const [location, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Extract project ID from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const projectId = urlParams.get('id') || '1';
  
  // Mock project data - in production this would come from API
  const projectData = {
    id: "1",
    name: "DeFiChain Protocol",
    symbol: "DCP", 
    logo: "🔗",
    description: "Next-generation decentralized finance protocol with innovative yield farming mechanisms and cross-chain interoperability.",
    longDescription: `DeFiChain Protocol represents the next evolution in decentralized finance, combining cutting-edge blockchain technology with innovative financial instruments. Our protocol offers:

    • Advanced Yield Farming: Multi-layer liquidity mining with dynamic APY optimization
    • Cross-Chain Bridge: Seamless asset transfers across 15+ blockchain networks  
    • Governance DAO: Community-driven protocol development and treasury management
    • Insurance Layer: Built-in smart contract protection and risk mitigation
    • NFT Integration: Unique DeFi-NFT hybrid products and collateralization`,
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
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    website: "https://defichain-protocol.io",
    whitepaper: "https://docs.defichain-protocol.io/whitepaper.pdf",
    socialLinks: {
      twitter: "https://twitter.com/DeFiChainProto",
      telegram: "https://t.me/defichain_protocol",
      discord: "https://discord.gg/defichain",
      medium: "https://medium.com/@defichain"
    },
    team: [
      {
        name: "Dr. Sarah Chen",
        role: "CEO & Co-Founder",
        bio: "Former Goldman Sachs VP, PhD in Computer Science from MIT",
        linkedin: "https://linkedin.com/in/sarah-chen-defi"
      },
      {
        name: "Marcus Rodriguez",
        role: "CTO & Co-Founder", 
        bio: "Ex-Ethereum Core Developer, 10+ years blockchain experience",
        linkedin: "https://linkedin.com/in/marcus-rodriguez-dev"
      },
      {
        name: "Dr. Emily Watson",
        role: "Head of Research",
        bio: "Former Deutsche Bank Quant, PhD in Mathematical Finance",
        linkedin: "https://linkedin.com/in/emily-watson-quant"
      }
    ],
    roadmap: [
      { quarter: "Q1 2025", milestone: "Token Launch & DEX Listing", status: "current" },
      { quarter: "Q2 2025", milestone: "Cross-Chain Bridge Launch", status: "planned" },
      { quarter: "Q3 2025", milestone: "Governance DAO Activation", status: "planned" },
      { quarter: "Q4 2025", milestone: "Insurance Layer Integration", status: "planned" }
    ],
    tokenomics: {
      publicSale: { percentage: 40, amount: "400,000,000", description: "Public token sale allocation" },
      privateSale: { percentage: 30, amount: "300,000,000", description: "Strategic investors and VCs" },
      team: { percentage: 15, amount: "150,000,000", description: "Team allocation with 4-year vesting" },
      treasury: { percentage: 15, amount: "150,000,000", description: "Development and ecosystem growth" }
    },
    riskFactors: [
      "Smart contract vulnerabilities",
      "Regulatory changes in DeFi space",
      "Market volatility and liquidity risks",
      "Competition from established protocols",
      "Technical implementation challenges"
    ],
    highlights: [
      "Led by experienced team from traditional finance and blockchain",
      "Audited by top security firms (CertiK, Quantstamp)",
      "Strategic partnerships with major DeFi protocols",
      "Innovative cross-chain architecture",
      "Strong community and early adoption metrics"
    ]
  };

  const progressPercentage = (projectData.currentRaise / projectData.targetRaise) * 100;
  const participationPercentage = (projectData.participants / projectData.maxParticipants) * 100;

  const handleParticipate = () => {
    navigate('/launchpad');
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/launchpad')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Launchpad</span>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{projectData.logo}</div>
                  <div>
                    <CardTitle className="text-3xl mb-2">{projectData.name}</CardTitle>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-sm">{projectData.symbol}</Badge>
                      <Badge variant="secondary">{projectData.category}</Badge>
                      <Badge className="bg-green-600 text-white">
                        {projectData.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Token Price</div>
                  <div className="text-2xl font-bold">${projectData.launchPrice}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                {projectData.description}
              </p>
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleParticipate}
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Participate Now
                </Button>
                <button 
                  className="relative z-50 border border-blue-500 text-blue-400 hover:bg-blue-500/10 text-lg px-8 py-4 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-transparent flex items-center gap-2"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Project Details Whitepaper button clicked!");
                    alert("Opening DeFiChain whitepaper...");
                    window.open('/defichain-whitepaper.html', '_blank');
                  }}
                  onMouseDown={(e) => {
                    console.log("Project Details Whitepaper button mouse down!");
                  }}
                >
                  <FileText className="w-5 h-5" />
                  Whitepaper
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Countdown Timer */}
          <CountdownTimer
            targetDate={projectData.endDate}
            status={projectData.status as any}
            title="Launch Ends In"
            variant="large"
          />

          {/* Key Stats */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Launch Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-semibold">
                    ${projectData.currentRaise.toLocaleString()} / ${projectData.targetRaise.toLocaleString()}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="text-center text-sm font-semibold text-purple-400">
                  {progressPercentage.toFixed(1)}% Complete
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{projectData.participants.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">${projectData.minimumBuy}</div>
                  <div className="text-sm text-muted-foreground">Min Buy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  {projectData.longDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-sm leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Key Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {projectData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tokenomics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Token Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(projectData.tokenomics).map(([key, data]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div>
                        <div className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="text-sm text-muted-foreground">{data.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{data.percentage}%</div>
                        <div className="text-sm text-muted-foreground">{data.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Vesting Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="font-semibold mb-2">Token Generation Event (TGE)</div>
                    <div className="text-2xl font-bold text-green-400">25%</div>
                    <div className="text-sm text-muted-foreground">Immediate unlock at launch</div>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="font-semibold mb-2">Linear Vesting</div>
                    <div className="text-2xl font-bold text-blue-400">75%</div>
                    <div className="text-sm text-muted-foreground">Released over 12 months</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectData.team.map((member, index) => (
              <Card key={index} className="glass">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="font-semibold text-lg mb-1">{member.name}</div>
                  <div className="text-sm text-purple-400 mb-3">{member.role}</div>
                  <div className="text-sm text-muted-foreground">{member.bio}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Development Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectData.roadmap.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
                    <div className={`w-4 h-4 rounded-full ${item.status === 'current' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <div className="flex-1">
                      <div className="font-semibold">{item.quarter}</div>
                      <div className="text-sm text-muted-foreground">{item.milestone}</div>
                    </div>
                    <Badge variant={item.status === 'current' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectData.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{risk}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Official Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <button 
                  className="relative z-50 border border-gray-600 text-gray-300 hover:bg-gray-600/10 text-sm px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-transparent flex items-center gap-2 w-full justify-start"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Documents Tab Whitepaper button clicked!");
                    alert("Opening DeFiChain whitepaper...");
                    window.open('/defichain-whitepaper.html', '_blank');
                  }}
                  onMouseDown={(e) => {
                    console.log("Documents Tab Whitepaper button mouse down!");
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Whitepaper
                </button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Audit Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Tokenomics Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(projectData.socialLinks).map(([platform, url]) => (
                  <Button key={platform} variant="outline" className="w-full justify-start capitalize">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {platform}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}