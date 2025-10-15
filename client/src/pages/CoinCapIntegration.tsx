import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, Search, RefreshCw } from 'lucide-react';
import SimpleMarketTable from '@/components/markets/simple-market-table';

interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export default function CoinCapIntegration() {
  const queryClient = useQueryClient();
  const [selectedAsset, setSelectedAsset] = useState<string>('bitcoin');
  const [searchSymbols, setSearchSymbols] = useState<string>('BTC,ETH,SOL');
  const [refreshKey, setRefreshKey] = useState(0);
  const [customPrices, setCustomPrices] = useState<any>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch top cryptocurrencies
  const { data: topAssets, isLoading: loadingTop, error: topError } = useQuery({
    queryKey: [`/api/coincap/top/20`, refreshKey],
    retry: false,
  });

  // Fetch specific asset details
  const { data: assetDetails, isLoading: loadingAsset } = useQuery({
    queryKey: [`/api/coincap/assets/${selectedAsset}`, refreshKey],
    retry: false,
    enabled: !!selectedAsset,
  });

  // Fetch asset history
  const { data: assetHistory, isLoading: loadingHistory } = useQuery({
    queryKey: [`/api/coincap/assets/${selectedAsset}/history?interval=d1`, refreshKey],
    retry: false,
    enabled: !!selectedAsset,
  });

  // Fetch market statistics
  const { data: marketStats, isLoading: loadingStats } = useQuery({
    queryKey: [`/api/coincap/stats`, refreshKey],
    retry: false,
  });

  // Fetch exchanges
  const { data: exchanges, isLoading: loadingExchanges } = useQuery({
    queryKey: [`/api/coincap/exchanges`, refreshKey],
    retry: false,
  });

  const formatPrice = (price: string | number) => {
    const num = parseFloat(price.toString());
    if (num >= 1000) {
      return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${num.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: string | number) => {
    const num = parseFloat(marketCap.toString());
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    }
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const formatChange = (change: string | number) => {
    const num = parseFloat(change.toString());
    return num.toFixed(2);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate all CoinCap queries to force fresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/coincap/top/20'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/coincap/assets'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/coincap/stats'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/coincap/exchanges'] })
      ]);
      
      // Also increment refresh key as backup
      setRefreshKey(prev => prev + 1);
      
      // Clear custom prices to show fresh data
      setCustomPrices(null);
      
      console.log('Data refresh initiated - all CoinCap queries invalidated');
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchCustomPrices = async () => {
    const symbols = searchSymbols.split(',').map(s => s.trim().toUpperCase());
    setIsLoadingPrices(true);
    try {
      const response = await fetch('/api/coincap/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols })
      });
      
      if (response.ok) {
        const result = await response.json();
        setCustomPrices(result);
        console.log('Custom prices loaded:', result);
      } else {
        console.error('Failed to fetch prices:', response.statusText);
        setCustomPrices({ error: 'Failed to fetch prices' });
      }
    } catch (error) {
      console.error('Error fetching custom prices:', error);
      setCustomPrices({ error: 'Network error' });
    } finally {
      setIsLoadingPrices(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            CoinCap API Integration
          </h1>
          <p className="text-xl text-gray-300">
            Real-time cryptocurrency market data powered by CoinCap API
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              variant="outline" 
              className="bg-white/10 text-white border-white/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              Live Data Connected
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="markets" className="text-white data-[state=active]:bg-purple-600">Markets</TabsTrigger>
            <TabsTrigger value="details" className="text-white data-[state=active]:bg-purple-600">Asset Details</TabsTrigger>
            <TabsTrigger value="exchanges" className="text-white data-[state=active]:bg-purple-600">Exchanges</TabsTrigger>
            <TabsTrigger value="tools" className="text-white data-[state=active]:bg-purple-600">API Tools</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            
            {/* Market Stats */}
            {marketStats?.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium">Total Market Cap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {formatMarketCap(marketStats.data.totalMarketCap)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium">24h Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {formatMarketCap(marketStats.data.totalVolume24h)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium">Bitcoin Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(marketStats.data.bitcoin?.priceUsd || 0)}
                    </div>
                    <div className={`text-sm ${parseFloat(marketStats.data.bitcoin?.changePercent24Hr || '0') >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(marketStats.data.bitcoin?.changePercent24Hr || '0') >= 0 ? '+' : ''}{formatChange(marketStats.data.bitcoin?.changePercent24Hr || '0')}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium">Ethereum Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(marketStats.data.ethereum?.priceUsd || 0)}
                    </div>
                    <div className={`text-sm ${parseFloat(marketStats.data.ethereum?.changePercent24Hr || '0') >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(marketStats.data.ethereum?.changePercent24Hr || '0') >= 0 ? '+' : ''}{formatChange(marketStats.data.ethereum?.changePercent24Hr || '0')}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Top Cryptocurrencies */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top 20 Cryptocurrencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTop ? (
                  <div className="text-white">Loading top cryptocurrencies...</div>
                ) : topError ? (
                  <div className="text-red-400">Error loading data. Please check your CoinCap API configuration.</div>
                ) : topAssets?.data ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead className="border-b border-white/20">
                        <tr>
                          <th className="text-left py-2">#</th>
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Symbol</th>
                          <th className="text-right py-2">Price</th>
                          <th className="text-right py-2">24h Change</th>
                          <th className="text-right py-2">Market Cap</th>
                          <th className="text-right py-2">Volume 24h</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topAssets.data.map((asset: CoinCapAsset, index: number) => (
                          <tr key={asset.id} className="border-b border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => setSelectedAsset(asset.id)}>
                            <td className="py-3">{asset.rank}</td>
                            <td className="py-3">{asset.name}</td>
                            <td className="py-3">
                              <Badge variant="outline" className="border-white/30 text-white">
                                {asset.symbol}
                              </Badge>
                            </td>
                            <td className="py-3 text-right">{formatPrice(asset.priceUsd)}</td>
                            <td className="py-3 text-right">
                              <span className={`flex items-center justify-end gap-1 ${
                                parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {parseFloat(asset.changePercent24Hr) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {formatChange(asset.changePercent24Hr)}%
                              </span>
                            </td>
                            <td className="py-3 text-right">{formatMarketCap(asset.marketCapUsd)}</td>
                            <td className="py-3 text-right">{formatMarketCap(asset.volumeUsd24Hr)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-white">No data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Markets Tab */}
          <TabsContent value="markets" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Live Cryptocurrency Markets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-white">
                    <SimpleMarketTable searchTerm="" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Asset Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Asset Details */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Asset Details: {selectedAsset}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingAsset ? (
                    <div className="text-white">Loading asset details...</div>
                  ) : assetDetails?.data ? (
                    <div className="space-y-4 text-white">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400">Name</div>
                          <div className="font-semibold">{assetDetails.data.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Symbol</div>
                          <div className="font-semibold">{assetDetails.data.symbol}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Rank</div>
                          <div className="font-semibold">#{assetDetails.data.rank}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Price USD</div>
                          <div className="font-semibold">{formatPrice(assetDetails.data.priceUsd)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Market Cap</div>
                          <div className="font-semibold">{formatMarketCap(assetDetails.data.marketCapUsd)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">24h Volume</div>
                          <div className="font-semibold">{formatMarketCap(assetDetails.data.volumeUsd24Hr)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">24h Change</div>
                          <div className={`font-semibold ${parseFloat(assetDetails.data.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {parseFloat(assetDetails.data.changePercent24Hr) >= 0 ? '+' : ''}{formatChange(assetDetails.data.changePercent24Hr)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Supply</div>
                          <div className="font-semibold">{formatMarketCap(assetDetails.data.supply)}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white">Select an asset to view details</div>
                  )}
                </CardContent>
              </Card>

              {/* Price History */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Price History (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingHistory ? (
                    <div className="text-white">Loading price history...</div>
                  ) : assetHistory?.data ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {assetHistory.data.slice(-10).map((point: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-white text-sm">
                          <div>{new Date(point.time).toLocaleDateString()}</div>
                          <div>{formatPrice(point.priceUsd)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white">No history data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exchanges Tab */}
          <TabsContent value="exchanges" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Cryptocurrency Exchanges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingExchanges ? (
                  <div className="text-white">Loading exchanges...</div>
                ) : exchanges?.data ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead className="border-b border-white/20">
                        <tr>
                          <th className="text-left py-2">#</th>
                          <th className="text-left py-2">Name</th>
                          <th className="text-right py-2">24h Volume (USD)</th>
                          <th className="text-right py-2">Trading Pairs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exchanges.data.slice(0, 10).map((exchange: any, index: number) => (
                          <tr key={exchange.id} className="border-b border-white/10">
                            <td className="py-3">{exchange.rank || index + 1}</td>
                            <td className="py-3">{exchange.name}</td>
                            <td className="py-3 text-right">{formatMarketCap(exchange.volumeUsd || 0)}</td>
                            <td className="py-3 text-right">{exchange.tradingPairs || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-white">No exchange data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Custom Price Lookup */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Custom Price Lookup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Symbols (comma-separated)
                    </label>
                    <Input
                      value={searchSymbols}
                      onChange={(e) => setSearchSymbols(e.target.value)}
                      placeholder="BTC,ETH,SOL,ADA"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button 
                    onClick={fetchCustomPrices} 
                    disabled={isLoadingPrices}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isLoadingPrices ? 'Loading...' : 'Get Prices'}
                  </Button>
                  
                  {/* Price Results */}
                  {customPrices && (
                    <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
                      <h4 className="text-white font-semibold mb-3">Price Results:</h4>
                      {customPrices.error ? (
                        <div className="text-red-400">{customPrices.error}</div>
                      ) : customPrices.data ? (
                        <div className="space-y-2">
                          {Object.entries(customPrices.data).map(([symbol, price]: [string, any]) => (
                            <div key={symbol} className="flex justify-between items-center">
                              <span className="text-gray-300 font-medium">{symbol}:</span>
                              <span className="text-white font-bold">{formatPrice(price)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400">No price data available</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* API Status */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">API Integration Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">CoinCap Connection</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rate Limiting</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">API Key Required</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Optional</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Data Freshness</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Real-time</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-white font-semibold mb-2">Available Endpoints:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• /api/coincap/assets - Top cryptocurrencies</li>
                      <li>• /api/coincap/assets/:id - Asset details</li>
                      <li>• /api/coincap/assets/:id/history - Price history</li>
                      <li>• /api/coincap/markets - Market data</li>
                      <li>• /api/coincap/exchanges - Exchange information</li>
                      <li>• /api/coincap/rates - Exchange rates</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}