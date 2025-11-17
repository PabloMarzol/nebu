import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Options Trading Placeholder Component
 * Coming Soon page for options trading features
 *
 * Planned Features:
 * - Call & Put Options (European & American style)
 * - Advanced options strategies (spreads, straddles)
 * - Customizable strikes and expiries
 * - Professional-grade options tools
 * - Risk management calculators
 */
export default function OptionsPlaceholder() {
  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardContent className="p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">🚀</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Options Trading</h3>
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-4">
              <span className="text-yellow-400 font-semibold">Coming Soon</span>
            </div>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Advanced options strategies with customizable strikes and expiries are currently
              under development. We're building a comprehensive options trading platform with
              professional-grade tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">
                  Call & Put Options
                </h4>
                <p className="text-gray-400 text-sm">
                  European & American style options
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-400 mb-2">
                  Options Strategies
                </h4>
                <p className="text-gray-400 text-sm">
                  Spreads, straddles, and complex strategies
                </p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">Stay tuned for updates!</p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-green-600"
              disabled
            >
              Launch Options Platform
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
