import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileText, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download,
  ExternalLink,
  Lock,
  Globe,
  Users,
  Building,
  CreditCard,
  Eye
} from "lucide-react";
import { Link } from "wouter";

export default function ComplianceCenter() {
  const complianceDocuments = [
    {
      title: "Terms of Service",
      description: "Platform usage terms and user obligations",
      status: "active",
      lastUpdated: "2025-06-25",
      category: "Legal",
      route: "/terms",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "Privacy Policy",
      description: "Data collection, usage, and protection policies",
      status: "active",
      lastUpdated: "2025-06-25",
      category: "Privacy",
      route: "/privacy",
      icon: <Lock className="w-5 h-5" />
    },
    {
      title: "AML Policy",
      description: "Anti-Money Laundering compliance framework",
      status: "active",
      lastUpdated: "2025-06-25",
      category: "Financial",
      route: "/aml-policy",
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: "Risk Disclosure",
      description: "Trading risks and investment warnings",
      status: "active",
      lastUpdated: "2025-06-25",
      category: "Financial",
      route: "/risk-disclosure",
      icon: <AlertTriangle className="w-5 h-5" />
    }
  ];

  const complianceMetrics = [
    { label: "KYC Verification Rate", value: "94.7%", status: "good" },
    { label: "AML Screening Coverage", value: "100%", status: "excellent" },
    { label: "Document Compliance", value: "98.2%", status: "good" },
    { label: "Regulatory Updates", value: "Current", status: "excellent" },
    { label: "Audit Readiness", value: "95.8%", status: "good" },
    { label: "Data Protection Score", value: "99.1%", status: "excellent" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400 bg-green-500/20';
      case 'good': return 'text-blue-400 bg-blue-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const regulations = [
    {
      jurisdiction: "United States",
      framework: "SEC & CFTC Guidelines",
      status: "Compliant",
      lastReview: "2025-06-15"
    },
    {
      jurisdiction: "European Union",
      framework: "MiCA Regulation",
      status: "Compliant",
      lastReview: "2025-06-10"
    },
    {
      jurisdiction: "United Kingdom",
      framework: "FCA Crypto Rules",
      status: "Compliant",
      lastReview: "2025-06-12"
    },
    {
      jurisdiction: "Singapore",
      framework: "MAS Payment Services",
      status: "Compliant",
      lastReview: "2025-06-08"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Compliance Center
          </h1>
          <p className="text-gray-300">Regulatory compliance, legal documentation, and risk management</p>
        </div>

        {/* Compliance Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {complianceMetrics.map((metric, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{metric.label}</p>
                    <p className="text-xl font-bold">{metric.value}</p>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="documents">Legal Documents</TabsTrigger>
            <TabsTrigger value="regulations">Regulatory Framework</TabsTrigger>
            <TabsTrigger value="monitoring">Compliance Monitoring</TabsTrigger>
            <TabsTrigger value="reports">Audit Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <div className="grid gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <span>Platform Legal Documentation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {complianceDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                        <div className="flex items-center space-x-4">
                          <div className="text-cyan-400">
                            {doc.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{doc.title}</h3>
                            <p className="text-sm text-gray-400">{doc.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <Badge className="bg-gray-600/50 text-gray-300">
                                {doc.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Updated: {doc.lastUpdated}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                          <Link href={doc.route}>
                            <Button size="sm" className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regulations">
            <div className="grid gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    <span>Global Regulatory Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {regulations.map((reg, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                        <div className="flex items-center space-x-4">
                          <Globe className="w-5 h-5 text-blue-400" />
                          <div>
                            <h3 className="font-semibold">{reg.jurisdiction}</h3>
                            <p className="text-sm text-gray-400">{reg.framework}</p>
                            <span className="text-xs text-gray-500">
                              Last Review: {reg.lastReview}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {reg.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-yellow-400" />
                    <span>Real-time Monitoring</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/30">
                      <div>
                        <p className="font-medium">Transaction Monitoring</p>
                        <p className="text-sm text-gray-400">AML screening active</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/30">
                      <div>
                        <p className="font-medium">KYC Verification</p>
                        <p className="text-sm text-gray-400">Identity verification</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/30">
                      <div>
                        <p className="font-medium">Risk Assessment</p>
                        <p className="text-sm text-gray-400">Continuous evaluation</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <span>Alert Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium text-yellow-400">Pending Review</span>
                      </div>
                      <p className="text-sm text-gray-300">3 transactions awaiting AML review</p>
                    </div>
                    
                    <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="font-medium text-green-400">All Clear</span>
                      </div>
                      <p className="text-sm text-gray-300">No critical compliance issues detected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-green-400" />
                    <span>Compliance Reports & Audits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                      <div>
                        <h3 className="font-semibold">Q4 2024 Compliance Report</h3>
                        <p className="text-sm text-gray-400">Comprehensive quarterly compliance assessment</p>
                        <span className="text-xs text-gray-500">Generated: December 2024</span>
                      </div>
                      <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                      <div>
                        <h3 className="font-semibold">AML Effectiveness Report</h3>
                        <p className="text-sm text-gray-400">Anti-money laundering program assessment</p>
                        <span className="text-xs text-gray-500">Generated: November 2024</span>
                      </div>
                      <Button size="sm" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                      <div>
                        <h3 className="font-semibold">Security Audit Report</h3>
                        <p className="text-sm text-gray-400">Third-party security assessment</p>
                        <span className="text-xs text-gray-500">Generated: October 2024</span>
                      </div>
                      <Button size="sm" className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}