import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Download, AlertTriangle, TrendingDown, Zap } from "lucide-react";

export default function RiskDisclosure() {
  return (
    <div className="min-h-screen bg-background pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/trading">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Trading
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Risk Disclosure Statement</h1>
              <p className="text-muted-foreground mt-1">Important Information for Cryptocurrency Trading</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Critical Warning Banner */}
        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-2">⚠️ High Risk Investment Warning</h2>
              <p className="text-red-300">
                Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. 
                You could lose your entire investment. Only invest money you can afford to lose completely.
              </p>
            </div>
          </div>
        </div>

        <Card className="glass">
          <CardContent className="p-8 prose prose-lg max-w-none dark:prose-invert">
            <div className="space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">1. General Risks of Cryptocurrency Trading</h2>
                
                <h3 className="text-xl font-medium mb-3">1.1 Market Volatility</h3>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Cryptocurrency prices can fluctuate dramatically within minutes</li>
                    <li>Daily price swings of 20-50% or more are common</li>
                    <li>Market movements can be triggered by news, regulations, or sentiment</li>
                    <li>Historical performance does not predict future results</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium mb-3 mt-6">1.2 Liquidity Risks</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Some cryptocurrencies may have limited trading volume</li>
                  <li>Large orders may significantly impact market prices</li>
                  <li>You may not be able to sell at desired prices during volatile periods</li>
                  <li>Market gaps can result in unexpected execution prices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">2. Technology and Security Risks</h2>
                
                <h3 className="text-xl font-medium mb-3">2.1 Technical Failures</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Platform downtime may prevent trading during critical moments</li>
                  <li>Internet connectivity issues can affect order execution</li>
                  <li>Software bugs or system errors may impact transactions</li>
                  <li>Blockchain network congestion can delay transfers</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">2.2 Security Threats</h3>
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Hacking attempts targeting exchanges and user accounts</li>
                    <li>Phishing attacks attempting to steal credentials</li>
                    <li>Loss of private keys results in permanent asset loss</li>
                    <li>Social engineering attacks targeting customer information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">3. Regulatory and Legal Risks</h2>
                
                <h3 className="text-xl font-medium mb-3">3.1 Regulatory Changes</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Government regulations can change without notice</li>
                  <li>New laws may restrict or prohibit cryptocurrency trading</li>
                  <li>Tax obligations may be complex and subject to change</li>
                  <li>Cross-border transfers may face regulatory restrictions</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">3.2 Legal Status</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Cryptocurrencies may not be legal tender in your jurisdiction</li>
                  <li>Consumer protection laws may not apply to crypto transactions</li>
                  <li>Dispute resolution mechanisms may be limited</li>
                  <li>Recovery of lost funds may be impossible</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">4. Specific Trading Risks</h2>
                
                <h3 className="text-xl font-medium mb-3">4.1 Leverage and Margin Trading</h3>
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                  <p className="font-semibold text-red-400 mb-2">Extreme Risk Warning:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Leveraged trading amplifies both gains and losses</li>
                    <li>You can lose more than your initial investment</li>
                    <li>Margin calls may force closure of positions at losses</li>
                    <li>Interest charges accrue on borrowed funds</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium mb-3 mt-6">4.2 Order Execution</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Market orders may execute at unexpected prices</li>
                  <li>Stop-loss orders do not guarantee execution at set prices</li>
                  <li>Slippage can occur during volatile market conditions</li>
                  <li>Partial fills may result in unexpected position sizes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">5. Platform-Specific Risks</h2>
                
                <h3 className="text-xl font-medium mb-3">5.1 NebulaX Platform Risks</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Custodial risk - we hold your cryptocurrencies</li>
                  <li>Business risk - platform operations may be disrupted</li>
                  <li>Counterparty risk in P2P and copy trading features</li>
                  <li>Smart contract risks in staking and DeFi integrations</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">5.2 Third-Party Dependencies</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Blockchain network dependencies for transactions</li>
                  <li>External data provider risks for pricing information</li>
                  <li>Banking partner risks for fiat transactions</li>
                  <li>Regulatory compliance service dependencies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">6. Staking and DeFi Risks</h2>
                
                <h3 className="text-xl font-medium mb-3">6.1 Staking Risks</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Lock-up periods may prevent access to funds</li>
                  <li>Slashing risks can result in partial loss of staked assets</li>
                  <li>Validator performance affects staking rewards</li>
                  <li>Network changes may impact staking mechanisms</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">6.2 DeFi Protocol Risks</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Smart contract bugs can result in total loss</li>
                  <li>Protocol governance changes may affect returns</li>
                  <li>Impermanent loss in liquidity provision</li>
                  <li>Flash loan attacks and MEV exploitation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">7. Risk Management Recommendations</h2>
                
                <h3 className="text-xl font-medium mb-3">7.1 Investment Principles</h3>
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Never invest more than you can afford to lose completely</li>
                    <li>Diversify across different assets and strategies</li>
                    <li>Start with small amounts to learn the platform</li>
                    <li>Understand all features before using them</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium mb-3 mt-6">7.2 Security Best Practices</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Enable two-factor authentication (2FA)</li>
                  <li>Use strong, unique passwords</li>
                  <li>Regularly monitor account activity</li>
                  <li>Keep personal information secure</li>
                  <li>Consider hardware wallets for large holdings</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">8. Tax Implications</h2>
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                  <p className="font-semibold text-blue-400 mb-2">Important Tax Notice:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Cryptocurrency transactions may be taxable events</li>
                    <li>Trading gains and losses must be reported to tax authorities</li>
                    <li>Staking rewards are typically considered taxable income</li>
                    <li>Consult with tax professionals for specific guidance</li>
                    <li>Maintain detailed records of all transactions</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">9. Support and Resources</h2>
                
                <h3 className="text-xl font-medium mb-3">9.1 Educational Resources</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Comprehensive trading guides and tutorials</li>
                  <li>Risk management educational content</li>
                  <li>Market analysis and research reports</li>
                  <li>Webinars and educational events</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6">9.2 Customer Support</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>24/7 customer support for technical issues</li>
                  <li>Trading support during market hours</li>
                  <li>Security incident response team</li>
                  <li>Compliance and regulatory guidance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">10. Acknowledgment</h2>
                <div className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-lg">
                  <p className="font-semibold mb-4">By using NebulaX trading services, you acknowledge that:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>You have read and understood this risk disclosure</li>
                    <li>You understand the risks associated with cryptocurrency trading</li>
                    <li>You are financially capable of bearing potential losses</li>
                    <li>You will seek professional advice when needed</li>
                    <li>You accept full responsibility for your trading decisions</li>
                  </ul>
                </div>
              </section>

              <div className="border-t pt-8">
                <p className="text-sm text-muted-foreground italic">
                  This risk disclosure is for informational purposes only and does not constitute investment advice. 
                  Trading decisions should be based on your own research and risk tolerance.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Link href="/trading">
            <Button variant="outline">
              I Understand the Risks - Continue Trading
            </Button>
          </Link>
          <Link href="/education">
            <Button>
              Learn More About Risk Management
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}