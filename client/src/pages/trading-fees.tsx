import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Crown,
  Star,
  CheckCircle,
  Info,
  Calculator,
  BarChart3,
  ArrowRight
} from 'lucide-react';

export default function TradingFees() {
  const spotTradingFees = [
    { volume: 'Tier 1 (0 - $10K)', maker: '0.10%', taker: '0.12%', badge: 'Basic' },
    { volume: 'Tier 2 ($10K - $50K)', maker: '0.08%', taker: '0.10%', badge: 'Pro' },
    { volume: 'Tier 3 ($50K - $250K)', maker: '0.06%', taker: '0.08%', badge: 'Premium' },
    { volume: 'Tier 4 ($250K - $1M)', maker: '0.04%', taker: '0.06%', badge: 'Elite' },
    { volume: 'Tier 5 ($1M+)', maker: '0.02%', taker: '0.04%', badge: 'Institutional' }
  ];

  const withdrawalFees = [
    { asset: 'Bitcoin (BTC)', network: 'Bitcoin', fee: '0.0005 BTC', fiat: '~$32.50' },
    { asset: 'Ethereum (ETH)', network: 'Ethereum', fee: '0.005 ETH', fiat: '~$12.40' },
    { asset: 'USDT', network: 'Ethereum (ERC-20)', fee: '15 USDT', fiat: '$15.00' },
    { asset: 'USDT', network: 'Tron (TRC-20)', fee: '1 USDT', fiat: '$1.00' },
    { asset: 'USDC', network: 'Ethereum (ERC-20)', fee: '15 USDC', fiat: '$15.00' },
    { asset: 'BNB', network: 'BSC', fee: '0.005 BNB', fiat: '~$1.50' },
    { asset: 'ADA', network: 'Cardano', fee: '1 ADA', fiat: '~$0.45' },
    { asset: 'SOL', network: 'Solana', fee: '0.01 SOL', fiat: '~$2.30' }
  ];

  const specialFees = [
    { service: 'P2P Trading', fee: '0.35%', description: 'Per completed trade' },
    { service: 'OTC Desk', fee: 'Negotiable', description: 'Custom rates for large orders' },
    { service: 'Staking Rewards', fee: '10%', description: 'Commission on earned rewards' },
    { service: 'Copy Trading', fee: '20%', description: 'Performance fee on profitable trades' },
    { service: 'Fiat Deposits', fee: 'Free', description: 'Bank transfers and cards' },
    { service: 'Fiat Withdrawals', fee: '$25', description: 'SWIFT wire transfers' }
  ];

  const tierBenefits = [
    { tier: 'Basic', color: 'bg-gray-500', benefits: ['Email support', 'Basic charts'] },
    { tier: 'Pro', color: 'bg-blue-500', benefits: ['Priority support', 'Advanced charts', 'API access'] },
    { tier: 'Premium', color: 'bg-purple-500', benefits: ['24/7 support', 'Advanced analytics', 'Copy trading'] },
    { tier: 'Elite', color: 'bg-yellow-500', benefits: ['Dedicated manager', 'Premium insights', 'Early features'] },
    { tier: 'Institutional', color: 'bg-green-500', benefits: ['Custom solutions', 'Bulk trading', 'White-label options'] }
  ];

  return (
    <div className="min-h-screen page-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Trading Fees & Limits
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transparent, competitive pricing with volume-based discounts. Trade more, pay less.
          </p>
        </div>

        {/* Fee Calculator */}
        <Card className="mb-8 border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-purple-400" />
              Fee Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">$0.50</div>
                <div className="text-sm text-muted-foreground">Fee for $500 trade (Tier 1)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">$2.00</div>
                <div className="text-sm text-muted-foreground">Fee for $2,500 trade (Tier 2)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">$6.00</div>
                <div className="text-sm text-muted-foreground">Fee for $10,000 trade (Tier 3)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spot Trading Fees */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
              Spot Trading Fees
            </CardTitle>
            <p className="text-muted-foreground">
              Volume-based tier system calculated over 30-day period
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Trading Volume (30 days)</th>
                    <th className="text-left py-3 px-4">Maker Fee</th>
                    <th className="text-left py-3 px-4">Taker Fee</th>
                    <th className="text-left py-3 px-4">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {spotTradingFees.map((tier, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">{tier.volume}</td>
                      <td className="py-3 px-4 text-green-400">{tier.maker}</td>
                      <td className="py-3 px-4 text-orange-400">{tier.taker}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{tier.badge}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-400 mb-1">Fee Structure Explanation</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Maker Fee:</strong> Charged when your order adds liquidity to the order book</li>
                    <li>• <strong>Taker Fee:</strong> Charged when your order removes liquidity from the order book</li>
                    <li>• Volume tiers are calculated based on your 30-day trading volume</li>
                    <li>• Fees are automatically applied based on your current tier</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Fees */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-6 w-6 text-blue-400" />
              Withdrawal Fees
            </CardTitle>
            <p className="text-muted-foreground">
              Network fees for cryptocurrency withdrawals
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Asset</th>
                    <th className="text-left py-3 px-4">Network</th>
                    <th className="text-left py-3 px-4">Fee</th>
                    <th className="text-left py-3 px-4">USD Equivalent</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalFees.map((asset, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">{asset.asset}</td>
                      <td className="py-3 px-4 text-muted-foreground">{asset.network}</td>
                      <td className="py-3 px-4 text-orange-400">{asset.fee}</td>
                      <td className="py-3 px-4 text-muted-foreground">{asset.fiat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Special Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400" />
              Special Services & Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialFees.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50">
                  <div>
                    <div className="font-medium">{service.service}</div>
                    <div className="text-sm text-muted-foreground">{service.description}</div>
                  </div>
                  <div className="text-lg font-bold text-primary">{service.fee}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-purple-400" />
              Tier Benefits
            </CardTitle>
            <p className="text-muted-foreground">
              Additional perks and features for each trading tier
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {tierBenefits.map((tier, index) => (
                <div key={index} className="text-center p-4 rounded-lg border border-border/50">
                  <div className={`w-4 h-4 ${tier.color} rounded-full mx-auto mb-2`}></div>
                  <div className="font-medium mb-2">{tier.tier}</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Volume Discounts */}
        <Card className="border-green-500/20 bg-gradient-to-r from-green-500/5 to-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-green-400" />
              Volume Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-card/50 rounded-lg">
                <div className="text-3xl font-bold text-green-400 mb-2">50%</div>
                <div className="text-sm text-muted-foreground">Lower fees vs competitors</div>
              </div>
              <div className="text-center p-6 bg-card/50 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">$1M+</div>
                <div className="text-sm text-muted-foreground">Institutional tier threshold</div>
              </div>
              <div className="text-center p-6 bg-card/50 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Premium support</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}