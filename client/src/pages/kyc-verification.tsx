import SimplifiedKYC from "@/components/trading/simplified-kyc";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, FileText, AlertTriangle } from "lucide-react";

export default function KYCVerificationPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quick Identity Verification
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Simple 2-minute verification to start trading immediately with higher limits
          </p>
        </div>

        {/* Legal Compliance Notice */}
        <Card className="glass mb-8 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-400">Privacy & Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Your personal information is protected under our comprehensive privacy and compliance framework. 
                  By proceeding with verification, you consent to our data processing practices as outlined in our legal documents.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/privacy-policy" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 underline">
                    <FileText className="w-4 h-4 mr-1" />
                    Privacy Policy
                  </Link>
                  <Link href="/aml-policy" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 underline">
                    <Shield className="w-4 h-4 mr-1" />
                    AML Policy
                  </Link>
                  <Link href="/terms-of-service" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 underline">
                    <FileText className="w-4 h-4 mr-1" />
                    Terms of Service
                  </Link>
                  <Link href="/risk-disclosure" className="inline-flex items-center text-sm text-red-400 hover:text-red-300 underline">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Risk Disclosure
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simplified KYC Component */}
        <SimplifiedKYC />
      </div>
    </div>
  );
}