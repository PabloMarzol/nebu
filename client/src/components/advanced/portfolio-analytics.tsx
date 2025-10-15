import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Target, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PortfolioAllocation {
  asset: string;
  currentWeight: number;
  targetWeight: number;
  rebalanceAmount: number;
  recommendation: 'buy' | 'sell' | 'hold';
}

interface RiskMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
}

interface PortfolioInsights {
  totalValue: number;
  allocations: PortfolioAllocation[];
  riskMetrics: RiskMetrics;
  diversificationScore: number;
  rebalanceRecommendations: string[];
  performanceProjection: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
}

interface AutoRebalanceSettings {
  enabled: boolean;
  threshold: number;
  frequency: string;
  maxRebalanceAmount: number;
}

export default function PortfolioAnalytics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [autoRebalanceSettings, setAutoRebalanceSettings] = useState<AutoRebalanceSettings>({
    enabled: false,
    threshold: 5,
    frequency: 'monthly',
    maxRebalanceAmount: 1000
  });

  const { data: portfolioInsights, isLoading: insightsLoading, refetch: refetchInsights } = useQuery({
    queryKey: ['/api/portfolio/analytics'],
    retry: false
  });

  const { data: rebalanceSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/portfolio/auto-rebalance-settings'],
    retry: false
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: AutoRebalanceSettings) => {
      return await apiRequest('POST', '/api/portfolio/auto-rebalance-settings', settings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Auto-rebalance settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/auto-rebalance-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update auto-rebalance settings.",
        variant: "destructive",
      });
    }
  });

  const executeRebalanceMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/portfolio/execute-rebalance');
    },
    onSuccess: () => {
      toast({
        title: "Rebalance Executed",
        description: "Portfolio rebalancing has been completed successfully.",
      });
      refetchInsights();
    },
    onError: (error) => {
      toast({
        title: "Rebalance Failed",
        description: "Failed to execute portfolio rebalancing.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (rebalanceSettings && typeof rebalanceSettings === 'object') {
      setAutoRebalanceSettings(rebalanceSettings as AutoRebalanceSettings);
    }
  }, [rebalanceSettings]);

  const handleSettingsUpdate = () => {
    updateSettingsMutation.mutate(autoRebalanceSettings);
  };

  const getRiskColor = (score: number) => {
    if (score < 0.5) return "text-red-500";
    if (score < 1.0) return "text-yellow-500";
    return "text-green-500";
  };

  const getDiversificationColor = (score: number) => {
    if (score < 50) return "text-red-500";
    if (score < 75) return "text-yellow-500";
    return "text-green-500";
  };

  if (insightsLoading || settingsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const insights: PortfolioInsights = (portfolioInsights && typeof portfolioInsights === 'object') ? portfolioInsights as PortfolioInsights : {
    totalValue: 0,
    allocations: [],
    riskMetrics: { sharpeRatio: 0, maxDrawdown: 0, volatility: 0, beta: 0, alpha: 0 },
    diversificationScore: 0,
    rebalanceRecommendations: [],
    performanceProjection: { conservative: 0, moderate: 0, aggressive: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
          <p className="text-muted-foreground">Advanced portfolio analysis and optimization</p>
        </div>
        <Button
          onClick={() => refetchInsights()}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Portfolio Value</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">${insights.totalValue.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Diversification</span>
            </div>
            <div className="mt-2">
              <div className={`text-2xl font-bold ${getDiversificationColor(insights.diversificationScore)}`}>
                {insights.diversificationScore.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Sharpe Ratio</span>
            </div>
            <div className="mt-2">
              <div className={`text-2xl font-bold ${getRiskColor(insights.riskMetrics.sharpeRatio)}`}>
                {insights.riskMetrics.sharpeRatio.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Volatility</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {(insights.riskMetrics.volatility * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="allocations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="settings">Auto-Rebalance</TabsTrigger>
        </TabsList>

        <TabsContent value="allocations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.allocations.map((allocation, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{allocation.asset}</span>
                        <Badge variant={
                          allocation.recommendation === 'buy' ? 'default' :
                          allocation.recommendation === 'sell' ? 'destructive' : 'secondary'
                        }>
                          {allocation.recommendation}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {allocation.currentWeight.toFixed(1)}% / {allocation.targetWeight.toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Progress value={allocation.currentWeight} className="flex-1" />
                      <Progress value={allocation.targetWeight} className="flex-1 opacity-50" />
                    </div>
                    {Math.abs(allocation.rebalanceAmount) > 50 && (
                      <div className="text-sm text-muted-foreground">
                        Suggested: {allocation.rebalanceAmount > 0 ? 'Buy' : 'Sell'} ${Math.abs(allocation.rebalanceAmount).toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rebalancing Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.rebalanceRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => executeRebalanceMutation.mutate()}
                  disabled={executeRebalanceMutation.isPending}
                  className="w-full"
                >
                  {executeRebalanceMutation.isPending ? 'Executing...' : 'Execute Rebalancing'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sharpe Ratio</span>
                  <span className={getRiskColor(insights.riskMetrics.sharpeRatio)}>
                    {insights.riskMetrics.sharpeRatio.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max Drawdown</span>
                  <span className="text-red-500">
                    {(insights.riskMetrics.maxDrawdown * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Beta</span>
                  <span>{insights.riskMetrics.beta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Alpha</span>
                  <span className={insights.riskMetrics.alpha > 0 ? 'text-green-500' : 'text-red-500'}>
                    {(insights.riskMetrics.alpha * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {insights.riskMetrics.sharpeRatio > 1 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm">Risk-Adjusted Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {insights.diversificationScore > 75 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm">Portfolio Diversification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {insights.riskMetrics.maxDrawdown < 0.2 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">Drawdown Control</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">Conservative</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(insights.performanceProjection.conservative * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Annual Return</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">Moderate</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(insights.performanceProjection.moderate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Annual Return</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">Aggressive</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(insights.performanceProjection.aggressive * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Annual Return</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Auto-Rebalance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Auto-Rebalancing</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically rebalance portfolio when allocations drift
                  </div>
                </div>
                <Switch
                  checked={autoRebalanceSettings.enabled}
                  onCheckedChange={(checked) =>
                    setAutoRebalanceSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              {autoRebalanceSettings.enabled && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rebalance Threshold</span>
                      <span className="text-sm text-muted-foreground">
                        {autoRebalanceSettings.threshold}%
                      </span>
                    </div>
                    <Slider
                      value={[autoRebalanceSettings.threshold]}
                      onValueChange={([value]) =>
                        setAutoRebalanceSettings(prev => ({ ...prev, threshold: value }))
                      }
                      max={20}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Max Rebalance Amount</span>
                      <span className="text-sm text-muted-foreground">
                        ${autoRebalanceSettings.maxRebalanceAmount}
                      </span>
                    </div>
                    <Slider
                      value={[autoRebalanceSettings.maxRebalanceAmount]}
                      onValueChange={([value]) =>
                        setAutoRebalanceSettings(prev => ({ ...prev, maxRebalanceAmount: value }))
                      }
                      max={10000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleSettingsUpdate}
                disabled={updateSettingsMutation.isPending}
                className="w-full"
              >
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}