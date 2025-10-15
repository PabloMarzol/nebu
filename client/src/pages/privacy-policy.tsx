import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-4">
              Privacy Policy
            </CardTitle>
            <p className="text-white/80">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="text-white/90 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <div className="space-y-2">
                <p><strong>Account Information:</strong> Email address, phone number, full name, and verification documents for KYC compliance.</p>
                <p><strong>Financial Information:</strong> Payment methods, transaction history, trading activity, and portfolio data.</p>
                <p><strong>Device Information:</strong> Device identifiers, IP address, browser type, and mobile device information.</p>
                <p><strong>Usage Data:</strong> App interactions, feature usage, performance metrics, and analytics data.</p>
                <p><strong>Location Data:</strong> Approximate location for compliance and security purposes.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide and maintain our cryptocurrency trading services</li>
                <li>Process transactions and manage your account</li>
                <li>Comply with KYC/AML regulations and legal requirements</li>
                <li>Improve our platform and develop new features</li>
                <li>Send important account notifications and updates</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Detect and prevent fraud and security threats</li>
                <li>Personalize your trading experience and recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
              <p>We do not sell your personal information. We may share information in these situations:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Legal Compliance:</strong> When required by law, regulation, or court order</li>
                <li><strong>Service Providers:</strong> With trusted partners who help operate our platform</li>
                <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                <li><strong>Safety:</strong> To protect the rights and safety of our users and platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
              <p>We implement industry-leading security measures including:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>End-to-end encryption for all sensitive data</li>
                <li>Multi-factor authentication and biometric security</li>
                <li>Cold storage for cryptocurrency assets</li>
                <li>Regular security audits and penetration testing</li>
                <li>SOC 2 Type II compliance and bank-grade infrastructure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Access and download your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Data portability to other platforms</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and features</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              <p className="mt-2">You can control cookie preferences through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. International Transfers</h2>
              <p>Your data may be transferred and processed in countries outside your residence. We ensure appropriate safeguards are in place, including:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Adequacy decisions by relevant authorities</li>
                <li>Binding Corporate Rules (BCRs)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Data Retention</h2>
              <p>We retain your information for as long as necessary to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal and regulatory obligations</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Improve our platform and prevent fraud</li>
              </ul>
              <p className="mt-2">Typically, we retain data for 7 years after account closure for compliance purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Third-Party Services</h2>
              <p>Our platform integrates with third-party services including:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Payment processors for fiat transactions</li>
                <li>KYC/AML verification providers</li>
                <li>Market data and analytics services</li>
                <li>Cloud infrastructure providers</li>
                <li>Customer support platforms</li>
              </ul>
              <p className="mt-2">Each service has its own privacy policy governing data use.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Children's Privacy</h2>
              <p>Our services are not intended for users under 18 years old. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Updates to This Policy</h2>
              <p>We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of material changes through:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Email notifications to registered users</li>
                <li>In-app notifications and announcements</li>
                <li>Website banners and prominent notices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">12. Contact Information</h2>
              <div className="bg-white/5 p-4 rounded-lg">
                <p><strong>Data Protection Officer:</strong></p>
                <p>Email: privacy@nebulaxexchange.io</p>
                <p>Address: NebulaX Exchange Ltd</p>
                <p>1 Market Street, Financial District</p>
                <p>London EC2V 8BQ, United Kingdom</p>
                <p className="mt-2">For immediate privacy concerns, contact our 24/7 support team through the app or website.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">13. Regulatory Compliance</h2>
              <p>NebulaX Exchange operates under the following regulatory frameworks:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>GDPR:</strong> European General Data Protection Regulation</li>
                <li><strong>CCPA:</strong> California Consumer Privacy Act</li>
                <li><strong>PIPEDA:</strong> Personal Information Protection and Electronic Documents Act (Canada)</li>
                <li><strong>LGPD:</strong> Lei Geral de Proteção de Dados (Brazil)</li>
                <li><strong>MiCA:</strong> Markets in Crypto-Assets Regulation (EU)</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}