import { useState } from "react";
import { useLocation } from "wouter";
import SimpleAIChat from "@/components/trading/simple-ai-chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AIAssistant() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [, setLocation] = useLocation();

  const handleDismiss = () => {
    setIsDismissed(true);
    // Navigate back to home after dismissing
    setTimeout(() => setLocation("/"), 500);
  };

  return (
    <div className="min-h-screen page-content">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Trading Assistant
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Get real-time market insights, trading strategies, and personalized recommendations
          </p>
        </div>

        {!isDismissed ? (
          <div className="h-[700px]">
            <SimpleAIChat onClose={handleDismiss} />
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-xl text-muted-foreground mb-6">AI Assistant has been dismissed</p>
            <Button onClick={() => setLocation("/")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Real-time analysis of cryptocurrency markets, trends, and sentiment
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Trading Strategies</h3>
            <p className="text-sm text-muted-foreground">
              Personalized trading recommendations based on your risk profile
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">
              Advanced risk evaluation and portfolio optimization suggestions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}