import { Card, CardContent } from "@/components/ui/card";
import SwapInterface from "@/components/trading/SwapInterface";
import PortfolioOverview from "@/components/trading/portfolio-overview";

/**
 * Swap Layout Component
 * Clean layout for token swapping powered by 0x Protocol
 *
 * Features:
 * - Instant token swaps at best available rates (SwapInterface)
 * - Portfolio balance tracking (PortfolioOverview)
 * - Multi-chain support (Ethereum, Base, Arbitrum, etc.)
 * - Gasless swaps for supported tokens
 * - Non-custodial and secure
 *
 * Note: SwapInterface component is kept untouched as per user requirements
 */
export default function SwapLayout() {
  return (
    <div className="space-y-6 swap-tab-content">
      {/* Swap Header */}
      <div className="mb-6">
        <Card className="glass">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Token Swap</h2>
            <p className="text-gray-400">
              Instantly swap tokens at the best available rates powered by 0x Protocol
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Centered Swap Interface */}
      <div className="flex justify-center mb-6 swap-interface-container">
        <div className="w-full max-w-md swap-interface-wrapper">
          <SwapInterface />
        </div>
      </div>

      {/* Portfolio & Info Below - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioOverview />
        <Card className="glass">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">About 0x Swaps</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Best prices from 100+ liquidity sources</li>
              <li>✓ No registration required</li>
              <li>✓ Non-custodial & secure</li>
              <li>✓ Minimal slippage</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
