import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Activity, Wifi, WifiOff, Database, TrendingUp } from "lucide-react";

interface MarketDataStatus {
  marketDataProviders: string[];
  blockchainConnection: boolean;
  lastUpdated: string;
  status: 'connected' | 'disconnected';
}

export default function MarketDataStatus() {
  const { data: status, isLoading } = useQuery<MarketDataStatus>({
    queryKey: ['/api/market-data/status'],
    refetchInterval: 10000, // Update every 10 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 animate-pulse text-blue-400" />
            <span className="text-sm text-slate-400">Checking connections...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) return null;

  const getStatusIcon = () => {
    if (status.status === 'connected') {
      return <Wifi className="w-4 h-4 text-green-400" />;
    }
    return <WifiOff className="w-4 h-4 text-red-400" />;
  };

  const getStatusColor = () => {
    return status.status === 'connected' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span>Live Market Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm text-slate-300">
                {status.status === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Badge className={getStatusColor()}>
              {status.marketDataProviders.length} providers
            </Badge>
          </div>

          {/* Connected Providers */}
          {status.marketDataProviders.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Active Feeds</div>
              <div className="flex flex-wrap gap-1">
                {status.marketDataProviders.map((provider) => (
                  <Badge
                    key={provider}
                    variant="outline"
                    className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30"
                  >
                    {provider}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Blockchain Connection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">Blockchain</span>
            </div>
            <Badge className={status.blockchainConnection ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
              {status.blockchainConnection ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
            Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}