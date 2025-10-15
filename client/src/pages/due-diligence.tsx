import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Shield, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import DueDiligenceDashboard from "@/components/launchpad/due-diligence-dashboard";

interface ProjectSummary {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  overallScore: number;
  status: "approved" | "under_review" | "rejected";
  lastUpdated: string;
  category: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export default function DueDiligence() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const projects: ProjectSummary[] = [
    {
      id: "defichain-1",
      name: "DeFiChain Protocol",
      symbol: "DCP",
      logo: "🔗",
      overallScore: 87,
      status: "approved",
      lastUpdated: "2024-12-10T14:30:00Z",
      category: "DeFi",
      riskLevel: "low"
    },
    {
      id: "gameverse-1",
      name: "GameVerse Token",
      symbol: "GVT",
      logo: "🎮",
      overallScore: 82,
      status: "approved",
      lastUpdated: "2024-12-09T16:20:00Z",
      category: "Gaming",
      riskLevel: "medium"
    },
    {
      id: "solarcoin-1",
      name: "SolarCoin",
      symbol: "SLR",
      logo: "☀️",
      overallScore: 91,
      status: "approved",
      lastUpdated: "2024-12-08T11:45:00Z",
      category: "Green Energy",
      riskLevel: "low"
    },
    {
      id: "metaverse-1",
      name: "MetaVerse Protocol",
      symbol: "MVP",
      logo: "🌐",
      overallScore: 75,
      status: "under_review",
      lastUpdated: "2024-12-07T09:15:00Z",
      category: "Metaverse",
      riskLevel: "medium"
    },
    {
      id: "healthchain-1",
      name: "HealthChain",
      symbol: "HLTH",
      logo: "🏥",
      overallScore: 94,
      status: "approved",
      lastUpdated: "2024-12-06T13:30:00Z",
      category: "Healthcare",
      riskLevel: "low"
    },
    {
      id: "defiswap-1",
      name: "DefiSwap Token",
      symbol: "DST",
      logo: "💱",
      overallScore: 68,
      status: "under_review",
      lastUpdated: "2024-12-05T15:20:00Z",
      category: "DeFi",
      riskLevel: "high"
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600 text-white";
      case "under_review":
        return "bg-yellow-600 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "under_review":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 border-green-400";
      case "medium": return "text-yellow-400 border-yellow-400";
      case "high": return "text-orange-400 border-orange-400";
      case "critical": return "text-red-400 border-red-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  if (selectedProject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedProject(null)}
            className="mb-4"
          >
            ← Back to Projects
          </Button>
        </div>
        <DueDiligenceDashboard projectId={selectedProject} />
      </div>
    );
  }

  return (
    <div className="min-h-screen page-content pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Due Diligence Center
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive project analysis and risk assessment for token launches
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="glass mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                onClick={() => setStatusFilter("approved")}
                size="sm"
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === "under_review" ? "default" : "outline"}
                onClick={() => setStatusFilter("under_review")}
                size="sm"
              >
                Under Review
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                onClick={() => setStatusFilter("rejected")}
                size="sm"
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {projects.filter(p => p.status === "approved").length}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {projects.filter(p => p.status === "under_review").length}
            </div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(projects.reduce((sum, p) => sum + p.overallScore, 0) / projects.length)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id} 
            className="glass hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedProject(project.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{project.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">{project.symbol}</Badge>
                      <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusIcon(project.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(project.overallScore)}`}>
                    {project.overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground">Due Diligence Score</div>
                </div>

                {/* Risk Level */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level:</span>
                  <Badge variant="outline" className={`${getRiskColor(project.riskLevel)} text-xs`}>
                    {project.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                {/* Last Updated */}
                <div className="text-xs text-muted-foreground text-center">
                  Updated: {new Date(project.lastUpdated).toLocaleDateString()}
                </div>

                {/* View Button */}
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project.id);
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              No projects found matching your criteria.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Due Diligence Process */}
      <Card className="glass mt-12">
        <CardHeader>
          <CardTitle>Our Due Diligence Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Technical Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive smart contract audits, architecture review, and security assessment
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Market Evaluation</h3>
              <p className="text-sm text-muted-foreground">
                Market analysis, competitive landscape, and tokenomics validation
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Legal Compliance</h3>
              <p className="text-sm text-muted-foreground">
                Regulatory compliance verification and legal framework assessment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}