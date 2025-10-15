import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Download, Shield, AlertTriangle } from "lucide-react";

export default function AMLPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/compliance">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Anti-Money Laundering Policy</h1>
              <p className="text-muted-foreground mt-1">Effective Date: January 1, 2025</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <Card className="glass">
          <CardContent className="p-8 prose prose-lg max-w-none dark:prose-invert">
            <div className="space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">1. Policy Statement</h2>
                <p>
                  NebulaX Exchange is committed to preventing money laundering and terrorist financing. 
                  We maintain a comprehensive AML program designed to detect, prevent, and report 
                  suspicious activities in compliance with applicable laws and regulations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">2. Customer Due Diligence (CDD)</h2>
                
                <h3 className="text-xl font-medium mb-3">2.1 Identity Verification</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>All customers must verify their identity before trading</li>
                  <li>Government-issued photo identification required</li>
                  <li>Address verification through utility bills or bank statements</li>
                  <li>Enhanced due diligence for high-risk customers</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">2.2 KYC Levels</h3>
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400">Level 1 - Basic Verification</h4>
                    <ul className="list-disc ml-6 space-y-1 mt-2">
                      <li>Email and phone verification</li>
                      <li>Daily trading limit: $1,000</li>
                      <li>Withdrawal limit: $500/day</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400">Level 2 - Standard Verification</h4>
                    <ul className="list-disc ml-6 space-y-1 mt-2">
                      <li>Government ID verification</li>
                      <li>Address confirmation</li>
                      <li>Daily trading limit: $10,000</li>
                      <li>Withdrawal limit: $5,000/day</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400">Level 3 - Enhanced Verification</h4>
                    <ul className="list-disc ml-6 space-y-1 mt-2">
                      <li>Source of funds documentation</li>
                      <li>Enhanced background checks</li>
                      <li>Daily trading limit: $50,000</li>
                      <li>Withdrawal limit: $25,000/day</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">3. Transaction Monitoring</h2>
                
                <h3 className="text-xl font-medium mb-3">3.1 Automated Monitoring</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Real-time transaction screening</li>
                  <li>Pattern recognition for suspicious activities</li>
                  <li>Threshold-based alerts for large transactions</li>
                  <li>Cross-referencing with sanctions lists</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">3.2 Suspicious Activity Indicators</h3>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-3">Red Flags Include:</h4>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Transactions inconsistent with customer profile</li>
                    <li>Rapid movement of funds without clear purpose</li>
                    <li>Use of multiple accounts to evade reporting thresholds</li>
                    <li>Transactions with high-risk jurisdictions</li>
                    <li>Unusual trading patterns or timing</li>
                    <li>Reluctance to provide required documentation</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">4. Sanctions Screening</h2>
                
                <h3 className="text-xl font-medium mb-3">4.1 Screening Lists</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>OFAC (Office of Foreign Assets Control) sanctions</li>
                  <li>EU consolidated sanctions list</li>
                  <li>UN Security Council sanctions</li>
                  <li>National sanctions lists</li>
                  <li>Politically Exposed Persons (PEP) lists</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">4.2 Screening Process</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Real-time screening during onboarding</li>
                  <li>Ongoing monitoring of existing customers</li>
                  <li>Regular updates to screening databases</li>
                  <li>Manual review of potential matches</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">5. Record Keeping</h2>
                
                <h3 className="text-xl font-medium mb-3">5.1 Documentation Requirements</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Customer identification records: 5 years after account closure</li>
                  <li>Transaction records: 5 years from transaction date</li>
                  <li>Suspicious activity reports: 5 years from filing</li>
                  <li>AML training records: 3 years</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">5.2 Data Security</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Encrypted storage of sensitive documents</li>
                  <li>Access controls and audit trails</li>
                  <li>Regular backups and disaster recovery</li>
                  <li>Compliance with data protection regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">6. Reporting Requirements</h2>
                
                <h3 className="text-xl font-medium mb-3">6.1 Suspicious Activity Reports (SARs)</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Filed within 30 days of detection</li>
                  <li>Submitted to relevant Financial Intelligence Unit</li>
                  <li>Confidential reporting process</li>
                  <li>No customer notification of SAR filing</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">6.2 Large Transaction Reporting</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Transactions over €10,000 equivalent reported</li>
                  <li>Aggregated transactions within 24 hours</li>
                  <li>Cross-border payment reporting</li>
                  <li>Virtual asset transfer reporting</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">7. Risk Assessment</h2>
                
                <h3 className="text-xl font-medium mb-3">7.1 Customer Risk Factors</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Geographic location and jurisdiction</li>
                  <li>Business type and industry</li>
                  <li>Transaction patterns and volume</li>
                  <li>Source of funds and wealth</li>
                  <li>PEP status and associations</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">7.2 Risk Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-green-400">Low Risk</h4>
                    <p className="text-sm mt-2">Standard monitoring and controls</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-yellow-400">Medium Risk</h4>
                    <p className="text-sm mt-2">Enhanced monitoring and periodic review</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-red-400">High Risk</h4>
                    <p className="text-sm mt-2">Continuous monitoring and senior approval</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">8. Training and Awareness</h2>
                
                <h3 className="text-xl font-medium mb-3">8.1 Staff Training</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Annual AML training for all employees</li>
                  <li>Specialized training for compliance staff</li>
                  <li>Regular updates on regulatory changes</li>
                  <li>Testing and certification requirements</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">8.2 Customer Education</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>AML policy disclosure during onboarding</li>
                  <li>Educational resources on compliance requirements</li>
                  <li>Clear communication of reporting obligations</li>
                  <li>Regular compliance reminders</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">9. Governance and Oversight</h2>
                
                <h3 className="text-xl font-medium mb-3">9.1 AML Officer</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Designated AML compliance officer</li>
                  <li>Direct reporting to senior management</li>
                  <li>Authority to implement AML measures</li>
                  <li>Regular board reporting on AML matters</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">9.2 Independent Testing</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Annual independent AML audit</li>
                  <li>Penetration testing of monitoring systems</li>
                  <li>Regulatory examination preparation</li>
                  <li>Continuous improvement program</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">10. Contact Information</h2>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p><strong>AML Compliance Officer</strong></p>
                  <p>Email: compliance@nebulax.exchange</p>
                  <p>Phone: +420 123 456 789</p>
                  <p>Address: Wenceslas Square 1, Prague 1, Czech Republic</p>
                  <p>VASP License: CZ-VASP-2024-001</p>
                </div>
              </section>

              <div className="border-t pt-8">
                <p className="text-sm text-muted-foreground italic">
                  This AML policy is reviewed annually and updated as needed to reflect regulatory changes and best practices.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}