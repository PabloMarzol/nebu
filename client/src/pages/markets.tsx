import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import SimpleMarketTable from "@/components/markets/simple-market-table";
import EnhancedMarketTable from "@/components/markets/enhanced-market-table";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Filter, TrendingUp, DollarSign, Zap, Shield } from "lucide-react";

export default function Markets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMarket, setSelectedMarket] = useState("spot");
  const [selectedPair, setSelectedPair] = useState("all");

  return (
    <div className="min-h-screen page-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Cryptocurrency Markets
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">Trade leading cryptocurrencies with competitive fees</p>
        </div>

        <Card className="glass">
          <CardContent className="p-8">
            {/* Market Statistics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass p-4 rounded-lg border border-purple-500/20">
                <div className="text-sm text-muted-foreground">24h Volume</div>
                <div className="text-2xl font-bold text-[hsl(var(--accent-purple))]">$2.84B</div>
                <div className="text-xs text-green-400">+12.4%</div>
              </div>
              <div className="glass p-4 rounded-lg border border-purple-500/20">
                <div className="text-sm text-muted-foreground">Active Pairs</div>
                <div className="text-2xl font-bold text-[hsl(var(--accent-pink))]">
                  {selectedPair === "all" ? "845" : selectedPair === "usdt" ? "324" : selectedPair === "btc" ? "156" : selectedPair === "eth" ? "198" : "67"}
                </div>
                <div className="text-xs text-blue-400">Live</div>
              </div>
              <div className="glass p-4 rounded-lg border border-purple-500/20">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-2xl font-bold text-cyan-400">$1.72T</div>
                <div className="text-xs text-green-400">+5.8%</div>
              </div>
              <div className="glass p-4 rounded-lg border border-purple-500/20">
                <div className="text-sm text-muted-foreground">Fear & Greed</div>
                <div className="text-2xl font-bold text-yellow-400">72</div>
                <div className="text-xs text-yellow-400">Greed</div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Market Type Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="glass border-purple-500/20 flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>{selectedMarket === "spot" ? "Spot Trading" : selectedMarket === "futures" ? "Futures" : selectedMarket === "options" ? "Options" : "Margin"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass border-purple-500/20">
                    <DropdownMenuLabel>Market Types</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedMarket("spot")}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Spot Trading
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedMarket("futures")}>
                      <Zap className="w-4 h-4 mr-2" />
                      Futures
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedMarket("options")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Options
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedMarket("margin")}>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Margin Trading
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Trading Pairs Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="glass border-purple-500/20 flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{selectedPair === "all" ? "All Pairs" : selectedPair === "usdt" ? "USDT Pairs" : selectedPair === "btc" ? "BTC Pairs" : selectedPair === "eth" ? "ETH Pairs" : "EUR Pairs"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass border-purple-500/20">
                    <DropdownMenuLabel>Trading Pairs</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedPair("all")}>
                      <span className="mr-2">🌐</span>
                      All Pairs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPair("usdt")}>
                      <span className="mr-2">💰</span>
                      USDT Pairs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPair("btc")}>
                      <span className="mr-2">₿</span>
                      BTC Pairs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPair("eth")}>
                      <span className="mr-2">Ξ</span>
                      ETH Pairs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPair("eur")}>
                      <span className="mr-2">€</span>
                      EUR Pairs
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Category Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="glass border-purple-500/20 flex items-center space-x-2">
                      <Filter className="w-4 h-4" />
                      <span>{selectedCategory === "all" ? "All Categories" : selectedCategory === "defi" ? "DeFi" : selectedCategory === "gaming" ? "Gaming" : selectedCategory === "ai" ? "AI/ML" : selectedCategory === "layer1" ? "Layer 1" : "Favorites"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass border-purple-500/20">
                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                      <span className="mr-2">🌐</span>
                      All Categories
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("favorites")}>
                      <span className="mr-2">⭐</span>
                      Favorites
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedCategory("defi")}>
                      <span className="mr-2">🏦</span>
                      DeFi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("layer1")}>
                      <span className="mr-2">🔗</span>
                      Layer 1
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("gaming")}>
                      <span className="mr-2">🎮</span>
                      Gaming & NFTs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("ai")}>
                      <span className="mr-2">🤖</span>
                      AI & Machine Learning
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("meme")}>
                      <span className="mr-2">🐕</span>
                      Meme Coins
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="Search markets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Select defaultValue="volume">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="change">Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SimpleMarketTable searchTerm={searchTerm} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
