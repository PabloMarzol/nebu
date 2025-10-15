import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Download, 
  Star, 
  Shield, 
  Zap, 
  Eye,
  CheckCircle,
  Apple,
  Wallet,
  BarChart3,
  Bell,
  Fingerprint,
  QrCode,
  TrendingUp,
  Users,
  Crown,
  Award
} from "lucide-react";
import { FaApple, FaGooglePlay, FaAndroid } from "react-icons/fa";

export default function Mobile() {
  const features = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Advanced Trading",
      description: "Full trading functionality with real-time charts and advanced order types"
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      title: "Multi-Currency Wallet",
      description: "Secure storage for 50+ cryptocurrencies with instant transfers"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Live Market Data",
      description: "Real-time price feeds and market analysis on the go"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Smart Notifications",
      description: "Customizable alerts for price movements and trading opportunities"
    },
    {
      icon: <Fingerprint className="w-5 h-5" />,
      title: "Biometric Security",
      description: "Face ID, Touch ID, and PIN protection for enhanced security"
    },
    {
      icon: <QrCode className="w-5 h-5" />,
      title: "QR Code Payments",
      description: "Quick crypto payments and transfers using QR codes"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Social Trading",
      description: "Follow top traders and copy their strategies automatically"
    },
    {
      icon: <Crown className="w-5 h-5" />,
      title: "Premium Features",
      description: "Advanced analytics, AI insights, and priority support"
    }
  ];

  const screenshots = [
    {
      title: "Trading Interface",
      description: "Professional trading tools optimized for mobile",
      image: "/api/placeholder/300/600"
    },
    {
      title: "Portfolio Dashboard",
      description: "Real-time portfolio tracking and analytics",
      image: "/api/placeholder/300/600"
    },
    {
      title: "Market Analysis",
      description: "Comprehensive market data and charts",
      image: "/api/placeholder/300/600"
    }
  ];

  const tiers = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Basic trading",
        "Wallet storage",
        "Price alerts",
        "Standard support"
      ],
      color: "gray"
    },
    {
      name: "Pro",
      price: "$9.99/month",
      features: [
        "Advanced trading tools",
        "Premium analytics",
        "Copy trading",
        "Priority support",
        "API access"
      ],
      color: "purple",
      popular: true
    },
    {
      name: "Elite",
      price: "$29.99/month",
      features: [
        "All Pro features",
        "AI trading assistant",
        "Institutional tools",
        "White-label access",
        "Dedicated manager"
      ],
      color: "gold"
    }
  ];

  const stats = [
    { label: "Downloads", value: "500K+", icon: <Download className="w-5 h-5" /> },
    { label: "App Rating", value: "4.8", icon: <Star className="w-5 h-5" /> },
    { label: "Active Users", value: "150K+", icon: <Users className="w-5 h-5" /> },
    { label: "Security Score", value: "AAA", icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Nebula X Mobile
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Trade cryptocurrencies anywhere, anytime with our advanced mobile app. Professional-grade features in your pocket.
          </p>
          
          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 flex items-center gap-3 px-8">
              <FaApple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </Button>
            <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-3 px-8">
              <FaGooglePlay className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </Button>
          </div>

          {/* App Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-purple-400">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Mobile-First Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="text-purple-400 mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">App Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-4 h-96 flex items-center justify-center">
                  <div className="text-purple-400">
                    <Smartphone className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">{screenshot.title}</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{screenshot.title}</h3>
                <p className="text-muted-foreground text-sm">{screenshot.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Mobile App Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`border-2 relative ${
                  tier.popular 
                    ? 'border-purple-500 scale-105' 
                    : 'border-purple-500/20'
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-purple-400">{tier.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                        : 'bg-purple-600'
                    }`}
                  >
                    Download {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <Card className="border-2 border-purple-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Shield className="w-6 h-6" />
                Bank-Grade Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Fingerprint className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Biometric Protection</h3>
                  <p className="text-sm text-muted-foreground">Face ID, Touch ID, and fingerprint authentication</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                  <p className="text-sm text-muted-foreground">Military-grade encryption for all data transmission</p>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">Zero-knowledge architecture protects your privacy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join over 500,000 traders who trust Nebula X for their mobile cryptocurrency trading needs. 
                Download now and start trading in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Download className="w-5 h-5 mr-2" />
                  Download Free App
                </Button>
                <Button size="lg" variant="outline">
                  <Award className="w-5 h-5 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}