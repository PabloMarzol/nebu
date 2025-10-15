import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Wallet, Clock, ArrowUpRight, ArrowDownRight, Lock, RefreshCw } from "lucide-react";

interface UserBalance {
  userId: string;
  currency: string;
  available: number;
  locked: number;
  total: number;
  lastUpdated: string;
}

interface BalanceUpdate {
  userId: string;
  currency: string;
  amount: number;
  type: 'credit' | 'debit' | 'lock' | 'unlock';
  reference?: string;
  description?: string;
}

interface PortfolioData {
  balances: UserBalance[];
  portfolioValue: number;
  history: BalanceUpdate[];
}

export default function PortfolioBalanceDisplay() {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  // Fetch portfolio data
  const { data: portfolio, isLoading, refetch } = useQuery({
    queryKey: ["/api/trading/portfolio"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading portfolio...
          </div>
        </CardContent>
      </Card>
    );
  }

  const portfolioData = portfolio as PortfolioData;
  const balances = portfolioData?.balances || [];
  const totalValue = portfolioData?.portfolioValue || 0;
  const history = portfolioData?.history || [];

  // Filter balances to show only non-zero
  const activeBalances = balances.filter(b => b.total > 0);

  // Get conversion rates (simplified)
  const getConversionRate = (currency: string): number => {
    const rates: Record<string, number> = {
      'BTC': 67000,
      'ETH': 3500,
      'USDT': 1,
      'USDC': 1,
      'DAI': 1,
      'LINK': 20,
      'UNI': 10
    };
    return rates[currency] || 0;
  };

  // Calculate USD value for balance
  const getUSDValue = (balance: UserBalance): number => {
    const rate = getConversionRate(balance.currency);
    return balance.total * rate;
  };

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'credit': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'debit': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'lock': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'unlock': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credit': return <ArrowUpRight className="h-3 w-3" />;
      case 'debit': return <ArrowDownRight className="h-3 w-3" />;
      case 'lock': return <Lock className="h-3 w-3" />;
      case 'unlock': return <RefreshCw className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.0%</span> from last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBalances.length}</div>
            <p className="text-xs text-muted-foreground">
              Currencies with balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="balances" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <TabsContent value="balances" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Balances</CardTitle>
              <CardDescription>
                Your current cryptocurrency holdings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBalances.length > 0 ? (
                  activeBalances.map((balance) => (
                    <div key={balance.currency} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {balance.currency.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{balance.currency}</div>
                          <div className="text-sm text-muted-foreground">
                            ${getUSDValue(balance).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">
                          {balance.total.toFixed(6)} {balance.currency}
                        </div>
                        <div className="text-sm space-x-2">
                          <span className="text-green-600">
                            Available: {balance.available.toFixed(6)}
                          </span>
                          {balance.locked > 0 && (
                            <span className="text-orange-600">
                              Locked: {balance.locked.toFixed(6)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No Assets Found</h3>
                    <p className="text-sm">
                      Deposit cryptocurrency or execute trades to see your balances here.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance History</CardTitle>
              <CardDescription>
                Recent balance changes and trading activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.length > 0 ? (
                  history.map((update, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeBadgeColor(update.type)}`}>
                          {getTypeIcon(update.type)}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{update.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {update.description || `${update.type} ${update.amount} ${update.currency}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-medium ${update.type === 'credit' ? 'text-green-600' : 
                          update.type === 'debit' ? 'text-red-600' : 'text-blue-600'}`}>
                          {update.type === 'credit' ? '+' : update.type === 'debit' ? '-' : ''}
                          {update.amount.toFixed(6)} {update.currency}
                        </div>
                        {update.reference && (
                          <div className="text-xs text-muted-foreground">
                            Ref: {update.reference.slice(0, 8)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No History Found</h3>
                    <p className="text-sm">
                      Your balance changes and trading activity will appear here.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}