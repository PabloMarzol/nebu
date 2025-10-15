import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Brain, TrendingUp, AlertTriangle, BarChart3, Zap, Shield, Target } from "lucide-react";

interface ProjectRiskSummary {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  aiRiskScore: number;
  confidence: number;
  lastAnalyzed: string;
  category: string;
  marketCap: string;
  riskTrend: "improving" | "stable" | "deteriorating";
  keyRisks: string[];
}

export default function AIRiskAssessment() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const projects: ProjectRiskSummary[] = [
    {
      id: "defi-protocol-1",
      name: "DeFi Protocol Alpha",
      symbol: "DPA",
      logo: "🔥",
      aiRiskScore: 23,
      confidence: 92,
      lastAnalyzed: "2 hours ago",
      category: "DeFi",
      marketCap: "$45.2M",
      riskTrend: "improving",
      keyRisks: ["Liquidity Risk", "Smart Contract Risk"]
    },
    {
      id: "gaming-token-1",
      name: "GameFi Universe",
      symbol: "GFU",
      logo: "🎮",
      aiRiskScore: 67,
      confidence: 85,
      lastAnalyzed: "4 hours ago",
      category: "Gaming",
      marketCap: "$12.8M",
      riskTrend: "stable",
      keyRisks: ["Market Volatility", "Adoption Risk"]
    },
    {
      id: "layer2-solution",
      name: "Layer2 Bridge",
      symbol: "L2B",
      logo: "⚡",
      aiRiskScore: 34,
      confidence: 88,
      lastAnalyzed: "1 hour ago",
      category: "Infrastructure",
      marketCap: "$89.3M",
      riskTrend: "improving",
      keyRisks: ["Technical Risk", "Competition"]
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-green-400";
    if (score <= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskLabel = (score: number) => {
    if (score <= 30) return "Low Risk";
    if (score <= 60) return "Medium Risk";
    return "High Risk";
  };

  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    return (
      <div className="min-h-screen page-content bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedProject(null)}
              className="mb-4 glass border-purple-500/30 text-white hover:bg-purple-500/20"
            >
              ← Back to Risk Dashboard
            </Button>
          </div>
          
          <Card className="glass border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-400" />
                <span>AI Risk Analysis - {project?.name}</span>
                <Badge variant="outline">NebulaX-Risk-v2.1</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className={`text-5xl font-bold mb-2 ${getRiskColor(project?.aiRiskScore || 23)}`}>
                    {project?.aiRiskScore || 23}
                  </div>
                  <div className="text-lg font-semibold mb-1">Risk Score</div>
                  <div className="text-sm text-muted-foreground">{getRiskLabel(project?.aiRiskScore || 23)}</div>
                  <Progress value={100 - (project?.aiRiskScore || 23)} className="h-2 mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{project?.confidence || 92}%</div>
                  <div className="text-lg font-semibold mb-1">AI Confidence</div>
                  <div className="text-sm text-muted-foreground">Based on 1,247 data points</div>
                  <Progress value={project?.confidence || 92} className="h-2 mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">72</div>
                  <div className="text-lg font-semibold mb-1">Market Sentiment</div>
                  <div className="text-sm text-muted-foreground">Bullish trend</div>
                  <Progress value={72} className="h-2 mt-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-strong">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <span>Risk Factors</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-orange-400 pl-4">
                      <div className="font-semibold">Low Initial Liquidity</div>
                      <div className="text-sm text-muted-foreground">High impact, medium likelihood</div>
                      <div className="text-xs text-orange-400 mt-1">Projected initial liquidity below safe thresholds</div>
                    </div>
                    <div className="border-l-4 border-yellow-400 pl-4">
                      <div className="font-semibold">Centralized Admin Controls</div>
                      <div className="text-sm text-muted-foreground">Medium impact, low likelihood</div>
                      <div className="text-xs text-yellow-400 mt-1">Multi-sig governance mitigates admin risks</div>
                    </div>
                    <div className="border-l-4 border-red-400 pl-4">
                      <div className="font-semibold">Regulatory Uncertainty</div>
                      <div className="text-sm text-muted-foreground">High impact, medium likelihood</div>
                      <div className="text-xs text-red-400 mt-1">Token classification unclear in key jurisdictions</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-strong">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span>Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-green-400 pl-4">
                      <div className="font-semibold">Strong Technical Foundation</div>
                      <div className="text-sm text-muted-foreground">Code quality score: 8.5/10</div>
                      <div className="text-xs text-green-400 mt-1">Comprehensive security audits completed</div>
                    </div>
                    <div className="border-l-4 border-blue-400 pl-4">
                      <div className="font-semibold">Active Development</div>
                      <div className="text-sm text-muted-foreground">Regular updates and improvements</div>
                      <div className="text-xs text-blue-400 mt-1">High developer activity on GitHub</div>
                    </div>
                    <div className="border-l-4 border-purple-400 pl-4">
                      <div className="font-semibold">Community Support</div>
                      <div className="text-sm text-muted-foreground">Growing user base and engagement</div>
                      <div className="text-xs text-purple-400 mt-1">Positive sentiment across social platforms</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-strong mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span>AI Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-500/10">
                      <div className="text-green-400 font-semibold mb-1">HOLD</div>
                      <div className="text-sm text-muted-foreground">Low risk profile suitable for long-term holding</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-500/10">
                      <div className="text-blue-400 font-semibold mb-1">MONITOR</div>
                      <div className="text-sm text-muted-foreground">Watch for regulatory developments</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-500/10">
                      <div className="text-purple-400 font-semibold mb-1">DIVERSIFY</div>
                      <div className="text-sm text-muted-foreground">Limit exposure to 5% of portfolio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-content bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Risk Assessment
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Advanced machine learning analysis for comprehensive token risk evaluation
          </p>
        </div>

        <Card className="glass mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects or tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass border-purple-500/30"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className="glass"
                >
                  All
                </Button>
                <Button
                  variant={selectedCategory === "DeFi" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("DeFi")}
                  className="glass"
                >
                  DeFi
                </Button>
                <Button
                  variant={selectedCategory === "Gaming" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Gaming")}
                  className="glass"
                >
                  Gaming
                </Button>
                <Button
                  variant={selectedCategory === "Infrastructure" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Infrastructure")}
                  className="glass"
                >
                  Infrastructure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="glass border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer group"
              onClick={() => setSelectedProject(project.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{project.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">{project.symbol}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={getRiskColor(project.aiRiskScore)}>
                    {getRiskLabel(project.aiRiskScore)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">AI Risk Score</span>
                    <span className={`font-bold text-lg ${getRiskColor(project.aiRiskScore)}`}>
                      {project.aiRiskScore}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="font-semibold text-blue-400">{project.confidence}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Market Cap</span>
                    <span className="font-semibold">{project.marketCap}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trend</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className={`w-4 h-4 ${
                        project.riskTrend === "improving" ? "text-green-400" : 
                        project.riskTrend === "stable" ? "text-yellow-400" : "text-red-400"
                      }`} />
                      <span className="text-sm capitalize">{project.riskTrend}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-purple-500/20">
                    <div className="text-xs text-muted-foreground mb-2">Key Risks:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.keyRisks.slice(0, 2).map((risk, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {risk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last analyzed: {project.lastAnalyzed}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="glass">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-purple-500/20">
                  <Brain className="w-12 h-12 text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Risk Analysis</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our advanced machine learning algorithms analyze over 200 risk factors including smart contract vulnerabilities, 
                market volatility, liquidity risks, regulatory compliance, and community sentiment to provide comprehensive 
                risk assessments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="font-semibold">Technical Analysis</div>
                  <div className="text-sm text-muted-foreground">Smart contract audits & code quality</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="font-semibold">Market Analysis</div>
                  <div className="text-sm text-muted-foreground">Liquidity, volatility & sentiment</div>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="font-semibold">Real-time Updates</div>
                  <div className="text-sm text-muted-foreground">Continuous monitoring & alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}