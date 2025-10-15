import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Eye,
  Users,
  FileCheck,
  Globe
} from "lucide-react";
import { Link } from "wouter";

interface DueDiligenceSummaryProps {
  projectId: string;
  projectName: string;
  symbol: string;
}

interface QuickStats {
  overallScore: number;
  status: "approved" | "under_review" | "rejected";
  teamVerified: boolean;
  auditsCompleted: number;
  complianceStatus: "compliant" | "pending" | "non_compliant";
  riskLevel: "low" | "medium" | "high" | "critical";
  lastUpdated: string;
}

export default function DueDiligenceSummary({ 
  projectId, 
  projectName, 
  symbol 
}: DueDiligenceSummaryProps) {
  
  // Mock data based on project - would typically come from API
  const getProjectData = (id: string): QuickStats => {
    const projectData: Record<string, QuickStats> = {
      "1": {
        overallScore: 87,
        status: "approved",
        teamVerified: true,
        auditsCompleted: 2,
        complianceStatus: "compliant",
        riskLevel: "low",
        lastUpdated: "2024-12-10"
      },
      "2": {
        overallScore: 82,
        status: "approved", 
        teamVerified: true,
        auditsCompleted: 1,
        complianceStatus: "pending",
        riskLevel: "medium",
        lastUpdated: "2024-12-09"
      },
      "3": {
        overallScore: 91,
        status: "approved",
        teamVerified: true,
        auditsCompleted: 3,
        complianceStatus: "compliant", 
        riskLevel: "low",
        lastUpdated: "2024-12-08"
      }
    };
    
    return projectData[id] || {
      overallScore: 75,
      status: "under_review",
      teamVerified: false,
      auditsCompleted: 0,
      complianceStatus: "pending",
      riskLevel: "medium",
      lastUpdated: "2024-12-07"
    };
  };

  const stats = getProjectData(projectId);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "compliant":
        return "bg-green-600 text-white";
      case "under_review":
      case "pending":
        return "bg-yellow-600 text-white";
      case "rejected":
      case "non_compliant":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "compliant":
        return <CheckCircle className="w-4 h-4" />;
      case "under_review":
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
      case "non_compliant":
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

  return (
    <Card className="glass border-blue-500/30 bg-blue-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-lg">Due Diligence Report</span>
          </div>
          <Badge className={getStatusColor(stats.status)}>
            {getStatusIcon(stats.status)}
            <span className="ml-1">{stats.status.replace('_', ' ').toUpperCase()}</span>
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(stats.overallScore)} mb-1`}>
            {stats.overallScore}
          </div>
          <div className="text-sm text-muted-foreground mb-2">Overall Security Score</div>
          <Progress value={stats.overallScore} className="h-2" />
        </div>

        {/* Quick Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Team</span>
            </div>
            <Badge className={stats.teamVerified ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
              {stats.teamVerified ? "Verified" : "Pending"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-green-400" />
              <span>Audits</span>
            </div>
            <Badge variant="outline">
              {stats.auditsCompleted} Complete
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Compliance</span>
            </div>
            <Badge className={getStatusColor(stats.complianceStatus)}>
              {getStatusIcon(stats.complianceStatus)}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>Risk</span>
            </div>
            <Badge variant="outline" className={getRiskColor(stats.riskLevel)}>
              {stats.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Security Highlights */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Security Highlights:</div>
          <div className="space-y-1 text-xs">
            {stats.auditsCompleted > 0 && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span>Smart contracts audited by {stats.auditsCompleted} firms</span>
              </div>
            )}
            {stats.teamVerified && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span>Team identity verified and KYC complete</span>
              </div>
            )}
            {stats.complianceStatus === "compliant" && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span>Regulatory compliance verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link href="/due-diligence">
          <Button className="w-full" variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Full Report
          </Button>
        </Link>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}