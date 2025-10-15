import { useWalletAuth } from "@/hooks/useWalletAuth";
import { WalletConnect } from "@/components/WalletConnect";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function PersonalizedWelcome() {
  const { isAuthenticated, walletAddress } = useWalletAuth();

  if (isAuthenticated && walletAddress) {
    // Format wallet address: 0x1234...5678
    const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    
    return (
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-xl font-bold text-white">
                Welcome back, {shortAddress}!
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Ready to trade? Your portfolio is waiting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">
                Welcome to Nebula X
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Connect your wallet to start trading
              </p>
            </div>
          </div>
          <WalletConnect />
        </div>
      </CardContent>
    </Card>
  );
}