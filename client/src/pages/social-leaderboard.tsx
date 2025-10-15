import SocialTradingLeaderboard from "@/components/launchpad/social-trading-leaderboard";

export default function SocialLeaderboard() {
  return (
    <div className="min-h-screen page-content bg-background pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Social Trading Leaderboard
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Top performers, live trading signals, and community insights
          </p>
        </div>

        <SocialTradingLeaderboard />
      </div>
    </div>
  );
}