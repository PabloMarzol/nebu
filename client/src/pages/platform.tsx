import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState } from "react";
import { 
  Smartphone, 
  Monitor, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Code,
  CheckCircle,
  ArrowUpDown,
  DollarSign
} from "lucide-react";

export default function Platform() {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("43,250");
  const [orderType, setOrderType] = useState("buy");

  const cryptoPrices = {
    BTC: "43,250",
    ETH: "2,345",
    ADA: "0.45",
    SOL: "98.50"
  };

  return (
    <div className="min-h-screen page-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="text-center mb-12 page-header">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Trading Platform
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">Comprehensive trading tools designed for your success</p>
        </div>

        {/* Platform Overview */}
        <Card className="glass mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Trade Your Way</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Whether you're a beginner or professional trader, our platform provides all the tools you need to succeed in cryptocurrency markets.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 h-5 w-5" />
                    <span>Simple buy/sell interface for beginners</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 h-5 w-5" />
                    <span>Advanced order types for professionals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 h-5 w-5" />
                    <span>Real-time market data and analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 h-5 w-5" />
                    <span>Mobile and desktop trading</span>
                  </div>
                </div>
              </div>
              
              {/* Interactive Trading Widget */}
              <Card className="glass-strong border-purple-500/30">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-purple-400 mb-2">Quick Trade</h3>
                    <p className="text-sm text-muted-foreground">Execute trades instantly</p>
                  </div>
                  
                  {/* Order Type Toggle */}
                  <div className="flex bg-muted/20 rounded-lg p-1 mb-4">
                    <Button
                      variant={orderType === "buy" ? "default" : "ghost"}
                      size="sm"
                      className={`flex-1 ${orderType === "buy" ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => setOrderType("buy")}
                    >
                      Buy
                    </Button>
                    <Button
                      variant={orderType === "sell" ? "default" : "ghost"}
                      size="sm"
                      className={`flex-1 ${orderType === "sell" ? "bg-red-600 hover:bg-red-700" : ""}`}
                      onClick={() => setOrderType("sell")}
                    >
                      Sell
                    </Button>
                  </div>

                  {/* Crypto Selection */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Cryptocurrency</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(cryptoPrices).map(([crypto, cryptoPrice]) => (
                        <Button
                          key={crypto}
                          variant={selectedCrypto === crypto ? "default" : "outline"}
                          size="sm"
                          className={selectedCrypto === crypto ? "bg-purple-600" : ""}
                          onClick={() => {
                            setSelectedCrypto(crypto);
                            setPrice(cryptoPrice);
                          }}
                        >
                          {crypto}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Amount</label>
                    <div className="relative">
                      <Input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                        {selectedCrypto}
                      </span>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Price (USD)</label>
                    <div className="relative">
                      <Input
                        value={price}
                        readOnly
                        className="bg-muted/20 cursor-not-allowed"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mb-4 p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total:</span>
                      <span className="text-lg font-bold text-purple-400">
                        ${amount && price ? (parseFloat(amount) * parseFloat(price.replace(/,/g, ''))).toLocaleString() : "0.00"}
                      </span>
                    </div>
                  </div>

                  {/* Trade Button */}
                  <Link href="/trading">
                    <Button 
                      className={`w-full font-semibold ${
                        orderType === "buy" 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {orderType === "buy" ? "Buy" : "Sell"} {selectedCrypto}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Feature Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="glass">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Simple Buy/Sell</h3>
              <p className="text-muted-foreground mb-4">
                Perfect for beginners, our simple interface makes it easy to buy and sell cryptocurrencies with just a few clicks.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• One-click trading</li>
                <li>• Real-time price updates</li>
                <li>• Instant order execution</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-purple))] rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Order Book & Depth</h3>
              <p className="text-muted-foreground mb-4">
                Advanced order book with market depth visualization for professional traders who need detailed market insights.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time order book</li>
                <li>• Market depth charts</li>
                <li>• Liquidity analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-pink))] to-[hsl(var(--accent-cyan))] rounded-xl flex items-center justify-center mb-6">
                <Settings className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Advanced Orders</h3>
              <p className="text-muted-foreground mb-4">
                Professional order types including stop-loss, take-profit, and conditional orders for advanced trading strategies.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Stop, Limit, Market orders</li>
                <li>• OCO (One-Cancels-Other)</li>
                <li>• Trailing stop orders</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-[hsl(var(--accent-purple))] rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">TradingView Integration</h3>
              <p className="text-muted-foreground mb-4">
                Professional charting with TradingView integration, offering advanced technical analysis tools and indicators.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 100+ technical indicators</li>
                <li>• Multiple chart types</li>
                <li>• Custom drawing tools</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Mobile & Desktop Access */}
        <Card className="glass mb-12">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Trade Anywhere, Anytime</h2>
              <p className="text-xl text-muted-foreground">Access your account and trade on any device</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Monitor className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Web Platform</h3>
                <p className="text-muted-foreground">
                  Full-featured web application with all professional trading tools available directly in your browser.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-purple))] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile Apps</h3>
                <p className="text-muted-foreground">
                  Native iOS and Android apps with push notifications and full trading capabilities on the go.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Access */}
        <Card className="glass mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-pink))] to-green-500 rounded-xl flex items-center justify-center mb-6">
                  <Code className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold mb-4">API Access</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Integrate with our RESTful API and WebSocket feeds for algorithmic trading and custom applications.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 h-5 w-5" />
                    <span>RESTful API for account management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 h-5 w-5" />
                    <span>WebSocket feeds for real-time data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 h-5 w-5" />
                    <span>Rate limiting and security features</span>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-6 font-mono text-sm">
                <div className="text-green-400 mb-2"># Get market data</div>
                <div className="text-muted-foreground">GET /api/markets</div>
                <div className="text-green-400 mb-2 mt-4"># Place order</div>
                <div className="text-muted-foreground">POST /api/orders</div>
                <div className="text-green-400 mb-2 mt-4"># WebSocket connection</div>
                <div className="text-muted-foreground">wss://api.nebulaxexchange.io/ws</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join millions of traders who trust NebulaX for their cryptocurrency trading needs.
            </p>
            <Link href="/trading">
              <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] hover:shadow-2xl transition-all duration-300">
                Try Platform Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
