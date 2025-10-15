import MarketSentimentTracker from "@/components/trading/market-sentiment-tracker";

export default function MarketSentiment() {
  return (
    <div className="min-h-screen page-content bg-background pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Real-Time Market Sentiment
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Live sentiment analysis across social media, news, and on-chain data
          </p>
        </div>

        {/* Market Sentiment Tracker */}
        <MarketSentimentTracker />
      </div>
    </div>
  );
}