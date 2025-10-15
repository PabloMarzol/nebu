import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  Clock,
  Shield,
  User,
  Zap,
  TrendingUp,
  AlertCircle,
  Settings,
  FileText,
  Globe
} from "lucide-react";

interface ComplianceLevel {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  dailyLimit: string;
  monthlyLimit: string;
  features: string[];
  verificationTime: string;
  status: "active" | "available" | "locked";
}

export default function StreamlinedCompliance() {
  const [selectedLevel, setSelectedLevel] = useState("basic");

  const complianceLevels: ComplianceLevel[] = [
    {
      id: "instant",
      name: "Instant Access",
      description: "Start trading immediately with email verification",
      requirements: ["Email verification", "Accept terms"],
      dailyLimit: "$1,000",
      monthlyLimit: "$5,000",
      features: ["Instant trading", "Basic features", "Email support"],
      verificationTime: "30 seconds",
      status: "active"
    },
    {
      id: "basic",
      name: "Basic Compliance",
      description: "Standard verification for most users",
      requirements: ["Personal information", "ID document photo"],
      dailyLimit: "$10,000",
      monthlyLimit: "$50,000",
      features: ["All trading features", "Higher limits", "Priority support"],
      verificationTime: "2-5 minutes",
      status: "available"
    },
    {
      id: "enhanced",
      name: "Enhanced Access",
      description: "For high-volume traders and institutions",
      requirements: ["Address verification", "Source of funds declaration"],
      dailyLimit: "$100,000",
      monthlyLimit: "Unlimited",
      features: ["Institutional features", "OTC trading", "Dedicated support"],
      verificationTime: "1-24 hours",
      status: "available"
    }
  ];

  const regulatoryInfo = [
    {
      title: "Czech VASP License",
      description: "Licensed Virtual Asset Service Provider under Czech Financial Analytical Unit",
      status: "Active",
      licenseNumber: "VASP-2024-0158"
    },
    {
      title: "EU MiCA Compliance",
      description: "Compliant with Markets in Crypto-Assets regulation",
      status: "Preparing",
      licenseNumber: "Effective 2024"
    },
    {
      title: "AML/CFT Standards",
      description: "Anti-Money Laundering and Counter-Terrorism Financing compliance",
      status: "Active",
      licenseNumber: "FATF Standards"
    }
  ];

  const essentialChecks = [
    {
      name: "Sanctions Screening",
      description: "Basic check against global sanctions lists",
      status: "automated",
      required: true
    },
    {
      name: "PEP Screening",
      description: "Politically Exposed Persons verification",
      status: "enhanced_only",
      required: false
    },
    {
      name: "Transaction Monitoring",
      description: "Automated monitoring for suspicious patterns",
      status: "continuous",
      required: true
    },
    {
      name: "Reporting",
      description: "Regulatory reporting when thresholds are met",
      status: "automated",
      required: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "available": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "locked": return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Compliance Overview */}
      <Card className="glass border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400">Compliance Status: Active</h3>
                <p className="text-sm text-muted-foreground">
                  Your account meets all regulatory requirements for current trading level
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">95%</div>
              <div className="text-sm text-muted-foreground">Compliance Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {complianceLevels.map((level) => (
          <Card 
            key={level.id} 
            className={`glass cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              selectedLevel === level.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-border'
            }`}
            onClick={() => setSelectedLevel(level.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{level.name}</CardTitle>
                <Badge className={getStatusColor(level.status)} variant="outline">
                  {level.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{level.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Daily Limit</div>
                  <div className="font-semibold text-blue-400">{level.dailyLimit}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Verification</div>
                  <div className="font-semibold text-green-400">{level.verificationTime}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Requirements:</div>
                {level.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Includes:</div>
                {level.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {level.status === "available" && (
                <Button className="w-full" size="sm">
                  Upgrade Level
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Essential Compliance Checks */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <span>Essential Compliance Checks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {essentialChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="flex items-center space-x-3">
                  <h5 className="font-semibold">{check.name}</h5>
                  {check.required && (
                    <Badge className="bg-red-500/20 text-red-400" variant="outline">
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{check.description}</p>
              </div>
              
              <div className="text-right">
                <Badge 
                  className={
                    check.status === "automated" || check.status === "continuous" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  } 
                  variant="outline"
                >
                  {check.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Regulatory Information */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-purple-400" />
            <span>Regulatory Framework</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {regulatoryInfo.map((info, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <h5 className="font-semibold">{info.title}</h5>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </div>
              <div className="text-right">
                <Badge 
                  className={
                    info.status === "Active" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-blue-500/20 text-blue-400"
                  } 
                  variant="outline"
                >
                  {info.status}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {info.licenseNumber}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Simplified Onboarding Process */}
      <Card className="glass border-blue-500/30">
        <CardHeader>
          <CardTitle>Streamlined Onboarding Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Instant Start</h4>
              <p className="text-sm text-muted-foreground">
                Begin trading in 30 seconds with email verification only
              </p>
            </div>

            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <User className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Quick Upgrade</h4>
              <p className="text-sm text-muted-foreground">
                Increase limits with simple ID photo in 2 minutes
              </p>
            </div>

            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Enhanced Access</h4>
              <p className="text-sm text-muted-foreground">
                Unlock institutional features with address verification
              </p>
            </div>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-semibold text-green-400">Optimized for User Experience</h5>
                <p className="text-sm text-muted-foreground mt-1">
                  Our streamlined compliance process reduces onboarding friction while maintaining 
                  full regulatory compliance with Czech VASP requirements. Only essential information 
                  is collected, and verification is automated wherever possible.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Compliance Report</h4>
            <p className="text-sm text-muted-foreground mb-4">
              View your current compliance status and requirements
            </p>
            <Button variant="outline" className="w-full">
              View Report
            </Button>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 text-center">
            <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Privacy Settings</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your data privacy and compliance preferences
            </p>
            <Button variant="outline" className="w-full">
              Manage Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}