import StreamlinedCompliance from "@/components/trading/streamlined-compliance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Shield, AlertTriangle, Download, ExternalLink } from "lucide-react";

export default function Compliance() {
  return (
    <div className="min-h-screen page-content bg-background pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Legal & Compliance Center
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete legal documentation and streamlined compliance processes
          </p>
        </div>

        {/* Legal Documents Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Terms of Service</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Complete terms governing the use of NebulaX platform and services
              </p>
              <div className="flex space-x-2">
                <Link href="/terms-of-service" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Privacy Policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                How we collect, use, and protect your personal information
              </p>
              <div className="flex space-x-2">
                <Link href="/privacy-policy" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>AML Policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Anti-money laundering procedures and compliance framework
              </p>
              <div className="flex space-x-2">
                <Link href="/aml-policy" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Risk Disclosure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Important risk warnings for cryptocurrency trading
              </p>
              <div className="flex space-x-2">
                <Link href="/risk-disclosure" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regulatory Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-purple-400">VASP Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>License Number:</strong> CZ-VASP-2024-001</p>
                <p><strong>Issued By:</strong> Czech National Bank</p>
                <p><strong>Status:</strong> <span className="text-green-400">Active</span></p>
                <p><strong>Valid Until:</strong> December 31, 2025</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-cyan-400">Business Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Company:</strong> NebulaX Exchange s.r.o.</p>
                <p><strong>Registration:</strong> 12345678</p>
                <p><strong>Jurisdiction:</strong> Czech Republic</p>
                <p><strong>Address:</strong> Wenceslas Square 1, Prague 1</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-green-400">Compliance Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>AML/CFT:</strong> 5AMLD Compliant</p>
                <p><strong>GDPR:</strong> Full Compliance</p>
                <p><strong>MiCA:</strong> Ready for 2024</p>
                <p><strong>Audits:</strong> Annual Independent Review</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streamlined Compliance Dashboard */}
        <StreamlinedCompliance />

        {/* Contact Information */}
        <Card className="glass mt-12">
          <CardHeader>
            <CardTitle>Legal & Compliance Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Legal Inquiries</h4>
                <p>Email: legal@nebulax.exchange</p>
                <p>Phone: +420 123 456 789</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Compliance Officer</h4>
                <p>Email: compliance@nebulax.exchange</p>
                <p>Response Time: 24-48 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}