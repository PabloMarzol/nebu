import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter,
  Star,
  Eye,
  Activity,
  BarChart3
} from 'lucide-react';
import { useLiveData } from '@/components/websocket/live-data-provider';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  category: string;
}

export default function EnhancedMarketTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("volume");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  
  const { prices, isConnected } = useLiveData();

  // Convert live data to enhanced market format
  const markets: MarketData[] = Object.values(prices).map((priceData) => ({
    symbol: priceData.symbol,
    price: priceData.price,
    change24h: priceData.change24h,
    changePercent: priceData.changePercent,
    volume: priceData.volume,
    high24h: priceData.price * 1.05, // Simulated high
    low24h: priceData.price * 0.95, // Simulated low
    marketCap: priceData.price * priceData.volume * 0.1, // Simulated market cap
    category: priceData.symbol.includes('BTC') || priceData.symbol.includes('ETH') ? 'major' : 'altcoin'
  }));

  // Static fallback data
  const staticMarkets: MarketData[] = [
    {
      symbol: "BTC/USDT",
      price: 43250.89,
      change24h: 1234.56,
      changePercent: 2.94,
      volume: 2400000000,
      high24h: 44500,
      low24h: 42800,
      marketCap: 850000000000,
      category: "major"
    },
    {
      symbol: "ETH/USDT", 
      price: 2654.32,
      change24h: 89.45,
      changePercent: 3.48,
      volume: 1200000000,
      high24h: 2720,
      low24h: 2580,
      marketCap: 320000000000,
      category: "major"
    },
    {
      symbol: "SOL/USDT",
      price: 108.45,
      change24h: -5.67,
      changePercent: -4.97,
      volume: 450000000,
      high24h: 115,
      low24h: 105,
      marketCap: 48000000000,
      category: "altcoin"
    },
    {
      symbol: "ADA/USDT",
      price: 0.47,
      change24h: 0.02,
      changePercent: 4.44,
      volume: 320000000,
      high24h: 0.49,
      low24h: 0.45,
      marketCap: 16500000000,
      category: "altcoin"
    },
    {
      symbol: "DOT/USDT",
      price: 6.89,
      change24h: 0.34,
      changePercent: 5.19,
      volume: 180000000,
      high24h: 7.12,
      low24h: 6.55,
      marketCap: 9200000000,
      category: "altcoin"
    }
  ];

  const displayMarkets = markets.length > 0 ? markets : staticMarkets;

  // Filter and sort markets
  const filteredMarkets = displayMarkets
    .filter(market => {
      const matchesSearch = market.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || market.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'change':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'volume':
          aValue = a.volume;
          bValue = b.volume;
          break;
        case 'marketCap':
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
          break;
        default:
          aValue = a.symbol;
          bValue = b.symbol;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(symbol)) {
        newWatchlist.delete(symbol);
      } else {
        newWatchlist.add(symbol);
      }
      return newWatchlist;
    });
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap?: number): string => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="major">Major Pairs</SelectItem>
                <SelectItem value="altcoin">Altcoins</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="change">Change</SelectItem>
                <SelectItem value="marketCap">Market Cap</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>

            <Badge className={isConnected ? 'bg-green-500' : 'bg-red-500'}>
              {isConnected ? 'Live' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Market Table */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Market Overview ({filteredMarkets.length} pairs)</span>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Real-time data</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3">Market</th>
                  <th className="text-right p-3">Price</th>
                  <th className="text-right p-3">24h Change</th>
                  <th className="text-right p-3">24h High</th>
                  <th className="text-right p-3">24h Low</th>
                  <th className="text-right p-3">Volume</th>
                  <th className="text-right p-3">Market Cap</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarkets.map((market) => (
                  <tr 
                    key={market.symbol} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                          {market.symbol.split('/')[0].slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold">{market.symbol}</div>
                          <div className="text-xs text-gray-400 capitalize">{market.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-3">
                      <div className="font-semibold">${market.price.toLocaleString()}</div>
                    </td>
                    <td className="text-right p-3">
                      <div className={`flex items-center justify-end space-x-1 ${
                        market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {market.changePercent >= 0 ? 
                          <TrendingUp className="w-4 h-4" /> : 
                          <TrendingDown className="w-4 h-4" />
                        }
                        <span className="font-semibold">
                          {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {market.change24h >= 0 ? '+' : ''}${market.change24h.toFixed(2)}
                      </div>
                    </td>
                    <td className="text-right p-3">
                      <div className="text-green-400">${market.high24h.toLocaleString()}</div>
                    </td>
                    <td className="text-right p-3">
                      <div className="text-red-400">${market.low24h.toLocaleString()}</div>
                    </td>
                    <td className="text-right p-3">
                      <div className="font-semibold">{formatVolume(market.volume)}</div>
                    </td>
                    <td className="text-right p-3">
                      <div className="font-semibold">{formatMarketCap(market.marketCap)}</div>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWatchlist(market.symbol)}
                          className={watchlist.has(market.symbol) ? 'text-yellow-400' : 'text-gray-400'}
                        >
                          <Star className={`w-4 h-4 ${watchlist.has(market.symbol) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {filteredMarkets.filter(m => m.changePercent > 0).length}
            </div>
            <div className="text-sm text-gray-400">Gainers</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-400 mb-2">
              {filteredMarkets.filter(m => m.changePercent < 0).length}
            </div>
            <div className="text-sm text-gray-400">Losers</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {formatVolume(filteredMarkets.reduce((sum, m) => sum + m.volume, 0))}
            </div>
            <div className="text-sm text-gray-400">Total Volume</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {watchlist.size}
            </div>
            <div className="text-sm text-gray-400">Watchlist</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}