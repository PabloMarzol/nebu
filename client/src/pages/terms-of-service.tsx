import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                By accessing and using NebulaX ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p className="text-gray-300">
                These Terms of Service ("Terms") govern your use of our cryptocurrency trading platform, including all features, services, and functionalities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Permission is granted to temporarily access NebulaX for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>attempt to decompile or reverse engineer any software contained on the Platform</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>3. Trading Risks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Cryptocurrency trading involves substantial risk and is not suitable for every investor. You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, and financial resources.
              </p>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-300 font-semibold">
                  WARNING: You may lose some or all of your invested capital; therefore, you should not speculate with capital that you cannot afford to lose.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>4. Account Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your login credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>5. KYC and Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                NebulaX operates under progressive verification requirements:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Email verification: Trading up to $25,000 per day</li>
                <li>Phone verification: Trading up to $250,000 per day</li>
                <li>Identity verification: Trading up to $1,000,000 per day</li>
              </ul>
              <p className="text-gray-300">
                We reserve the right to request additional verification at any time for compliance purposes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>6. Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                While we strive for 99.9% uptime, NebulaX may be temporarily unavailable due to maintenance, upgrades, or technical issues. We are not liable for any losses incurred during service interruptions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>7. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                In no event shall NebulaX or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Platform.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>8. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                For questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none text-gray-300 space-y-2">
                <li>Email: legal@nebulax.com</li>
                <li>Telegram: <a href="https://t.me/+byrMgAT0Psg5Y2U8" className="text-blue-400 hover:underline">https://t.me/+byrMgAT0Psg5Y2U8</a></li>
                <li>Support: support@nebulax.com</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}