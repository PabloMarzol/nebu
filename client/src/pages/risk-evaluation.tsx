import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import InteractiveRiskEvaluator from "@/components/trading/interactive-risk-evaluator";

export default function RiskEvaluation() {
  const [searchToken, setSearchToken] = useState("");

  return (
    <div className="min-h-screen page-content bg-background pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Interactive Token Risk Evaluation
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive risk analysis with AI-powered assessment and scenario testing
          </p>
        </div>

        {/* Token Search */}
        <Card className="glass border-blue-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search token (e.g., BTC, ETH, SOL)"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>Analyze</Button>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Risk Evaluator */}
        <InteractiveRiskEvaluator />
      </div>
    </div>
  );
}