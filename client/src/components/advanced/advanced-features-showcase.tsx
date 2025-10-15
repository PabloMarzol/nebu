import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Settings,
  Zap,
  Brain,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

const ADVANCED_FEATURES = [
  {
    title: "Advanced Portfolio Analytics",
    description: "Professional portfolio analysis with risk metrics, diversification scoring, and automated rebalancing recommendations.",
    icon: BarChart3,
    path: "/advanced-portfolio",
    features: [
      "Sharpe Ratio & Risk Analysis",
      "Diversification Scoring",
      "Auto-Rebalancing Engine",
      "Performance Projections"
    ],
    badge: "Pro"
  },
  {
    title: "Advanced Trading Orders",
    description: "Sophisticated order types for professional traders including TWAP, VWAP, Iceberg, and algorithmic execution.",
    icon: Target,
    path: "/advanced-trading",
    features: [
      "Stop Loss & Take Profit",
      "Trailing Stops",
      "TWAP & VWAP Execution",
      "Iceberg Orders"
    ],
    badge: "Professional"
  },
  {
    title: "AI Trading Intelligence",
    description: "Machine learning powered trading signals, market sentiment analysis, and portfolio optimization.",
    icon: Brain,
    path: "/ai-assistant",
    features: [
      "AI Trading Signals",
      "Market Sentiment Analysis",
      "Portfolio Optimization",
      "Natural Language Commands"
    ],
    badge: "AI-Powered"
  },
  {
    title: "Risk Management Suite",
    description: "Comprehensive risk assessment tools with real-time monitoring and alert systems.",
    icon: Settings,
    path: "/risk-evaluation",
    features: [
      "Real-time Risk Monitoring",
      "VaR Calculations",
      "Stress Testing",
      "Risk Alerts"
    ],
    badge: "Enterprise"
  }
];

export default function AdvancedFeaturesShowcase() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Advanced Trading Features</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Professional-grade tools and analytics that give you a competitive edge in cryptocurrency trading
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ADVANCED_FEATURES.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {feature.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{feature.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={feature.path}>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    Explore Feature
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-6 text-center">
        <div className="space-y-4">
          <TrendingUp className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-2xl font-bold">Ready to Level Up Your Trading?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            These advanced features are designed for serious traders who want professional-grade tools and analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/advanced-portfolio">
              <Button size="lg">
                Start with Portfolio Analytics
              </Button>
            </Link>
            <Link href="/advanced-trading">
              <Button variant="outline" size="lg">
                Explore Advanced Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}