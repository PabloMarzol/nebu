import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Wallet, 
  TrendingUp, 
  Globe, 
  Newspaper,
  Search,
  Copy
} from "lucide-react";

export default function APIServicesDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [searchToken, setSearchToken] = useState("ETH");

  // Check API services status
  const { data: servicesStatus } = useQuery({
    queryKey: ['/api/services/status'],
    refetchInterval: 30000,
  });

  // Get enhanced market data
  const { data: enhancedMarkets } = useQuery({
    queryKey: ['/api/markets/enhanced'],
    refetchInterval: 10000,
  });

  // Get crypto news
  const { data: cryptoNews } = useQuery({
    queryKey: ['/api/news'],
    refetchInterval: 60000,
  });

  // Get blockchain network info
  const { data: networkInfo } = useQuery({
    queryKey: ['/api/blockchain/network'],
    refetchInterval: 30000,
  });

  // Portfolio query (only when wallet address is provided)
  const { data: portfolioData, refetch: refetchPortfolio } = useQuery({
    queryKey: [`/api/blockchain/portfolio/${walletAddress}`],
    enabled: walletAddress.length === 42 && walletAddress.startsWith('0x'),
    refetchInterval: 15000,
  });

  const handlePortfolioSearch = () => {
    if (walletAddress.length === 42 && walletAddress.startsWith('0x')) {
      refetchPortfolio();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* API Services Status */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-green-400" />
            API Services Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {servicesStatus && Object.entries(servicesStatus).map(([service, active]) => (
              service !== 'timestamp' && (
                <div key={service} className="flex items-center space-x-2">
                  {active ? 
                    <CheckCircle className="h-4 w-4 text-green-400" /> : 
                    <XCircle className="h-4 w-4 text-red-400" />
                  }
                  <span className="text-sm capitalize">{service}</span>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Network Information */}
      {networkInfo && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
              Ethereum Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Block Number</p>
                <p className="font-mono text-lg">{networkInfo.blockNumber?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gas Price</p>
                <p className="font-mono text-lg">{networkInfo.gasPrice}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chain ID</p>
                <p className="font-mono text-lg">{networkInfo.chainId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="capitalize text-lg">{networkInfo.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Tracker */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-purple-400" />
            Blockchain Portfolio Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Enter Ethereum wallet address (0x...)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handlePortfolioSearch} disabled={!walletAddress.startsWith('0x')}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {portfolioData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Portfolio Overview</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(portfolioData.address)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">ETH Balance</p>
                  <p className="text-xl font-mono">{parseFloat(portfolioData.ethBalance).toFixed(4)} ETH</p>
                </div>
                
                {Object.entries(portfolioData.tokenBalances).length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Token Balances</p>
                    <div className="space-y-1">
                      {Object.entries(portfolioData.tokenBalances).map(([token, balance]: [string, any]) => (
                        <div key={token} className="flex justify-between text-sm">
                          <span>{token}</span>
                          <span className="font-mono">{parseFloat(balance).toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Market Data */}
      {enhancedMarkets && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-cyan-400" />
              Enhanced Market Data (CryptoCompare)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(enhancedMarkets).slice(0, 6).map(([symbol, data]: [string, any]) => (
                <div key={symbol} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{symbol}/USD</h4>
                    <Badge variant={data.USD?.CHANGEPCT24HOUR > 0 ? "default" : "destructive"}>
                      {data.USD?.CHANGEPCT24HOUR > 0 ? '+' : ''}{data.USD?.CHANGEPCT24HOUR?.toFixed(2)}%
                    </Badge>
                  </div>
                  <p className="text-xl font-mono">${data.USD?.PRICE?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Vol: ${data.USD?.VOLUME24HOUR?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crypto News */}
      {cryptoNews && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="mr-2 h-5 w-5 text-orange-400" />
              Latest Crypto News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cryptoNews.slice(0, 5).map((article: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{article.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{article.body?.substring(0, 150)}...</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{article.source_info?.name}</span>
                    <span>{new Date(article.published_on * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}