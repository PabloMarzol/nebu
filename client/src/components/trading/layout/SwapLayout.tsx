import { Card, CardContent } from "@/components/ui/card";
import SwapInterface from "@/components/trading/SwapInterface";
import PortfolioOverview from "@/components/trading/portfolio-overview";

/**
 * Swap Layout Component - REWRITTEN FROM SCRATCH
 * Clean layout for token swapping with PROPER dropdown support
 *
 * CRITICAL FIXES:
 * - Removed ALL transforms, filters, and backdrop-filters
 * - Ensured proper z-index stacking contexts
 * - Fixed dropdown positioning issues
 * - Removed problematic parent containers
 *
 * Features:
 * - Crypto to Crypto Swap (0x Protocol)
 * - Fiat to Crypto (OnRamp Money)
 * - Multi-chain support (Ethereum, Base, Arbitrum)
 * - Non-custodial and secure
 *
 * DROPDOWN REQUIREMENTS:
 * - No CSS transforms on parent containers
 * - No CSS filters on parent containers
 * - No will-change properties
 * - Proper overflow: visible on all parents
 * - Clean stacking contexts with z-index
 */
export default function SwapLayout() {
  return (
    <div className="swap-layout-container">
      {/* Swap Header - Clean, no transforms */}
      <div className="swap-header-section">
        <Card className="glass swap-header-card">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Token Swap</h2>
            <p className="text-gray-400">
              Instantly swap tokens at the best available rates powered by 0x Protocol
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Swap Interface - Centered, dropdown-safe */}
      <div className="swap-interface-section">
        <div className="swap-interface-inner">
          <SwapInterface />
        </div>
      </div>

      {/* Portfolio & Info - Bottom section */}
      <div className="swap-info-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioOverview />
          <Card className="glass">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-white">About Swaps</h3>
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
    </div>
  );
}
