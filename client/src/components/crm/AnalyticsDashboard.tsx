import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3, 
  PieChart, 
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down';
  };
  customers: {
    total: number;
    new: number;
    active: number;
    churn: number;
  };
  deals: {
    total: number;
    won: number;
    lost: number;
    conversion: number;
  };
  support: {
    tickets: number;
    resolved: number;
    avgResponse: number;
    satisfaction: number;
  };
}

interface ChartData {
  period: string;
  revenue: number;
  customers: number;
  deals: number;
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    // Mock data - in production, this would be an API call
    const mockData: AnalyticsData = {
      revenue: {
        current: 2450000,
        previous: 2100000,
        change: 16.7,
        trend: 'up'
      },
      customers: {
        total: 15420,
        new: 1250,
        active: 12800,
        churn: 2.3
      },
      deals: {
        total: 145,
        won: 87,
        lost: 23,
        conversion: 60.0
      },
      support: {
        tickets: 342,
        resolved: 318,
        avgResponse: 2.4,
        satisfaction: 4.6
      }
    };

    const mockChartData: ChartData[] = [
      { period: 'Week 1', revenue: 580000, customers: 3200, deals: 18 },
      { period: 'Week 2', revenue: 620000, customers: 3450, deals: 22 },
      { period: 'Week 3', revenue: 595000, customers: 3380, deals: 20 },
      { period: 'Week 4', revenue: 655000, customers: 3590, deals: 27 }
    ];

    setTimeout(() => {
      setAnalyticsData(mockData);
      setChartData(mockChartData);
      setLoading(false);
    }, 500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading || !analyticsData) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Track performance metrics and business insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={fetchAnalyticsData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-semibold text-white">
                  {formatCurrency(analyticsData.revenue.current)}
                </p>
                <div className="flex items-center mt-2">
                  {analyticsData.revenue.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    analyticsData.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analyticsData.revenue.change}%
                  </span>
                  <span className="text-gray-400 text-sm ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Customers</p>
                <p className="text-2xl font-semibold text-white">
                  {formatNumber(analyticsData.customers.total)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">
                    +{formatNumber(analyticsData.customers.new)}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">new this period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Deal Conversion</p>
                <p className="text-2xl font-semibold text-white">
                  {analyticsData.deals.conversion}%
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-sm">
                    {analyticsData.deals.won} won
                  </span>
                  <span className="text-gray-400 text-sm mx-1">•</span>
                  <span className="text-red-500 text-sm">
                    {analyticsData.deals.lost} lost
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Support Satisfaction</p>
                <p className="text-2xl font-semibold text-white">
                  {analyticsData.support.satisfaction}/5.0
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-sm">
                    {analyticsData.support.avgResponse}h avg response
                  </span>
                </div>
              </div>
              <div className="p-3 bg-yellow-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="revenue" className="text-gray-300">Revenue</TabsTrigger>
          <TabsTrigger value="customers" className="text-gray-300">Customers</TabsTrigger>
          <TabsTrigger value="sales" className="text-gray-300">Sales</TabsTrigger>
          <TabsTrigger value="support" className="text-gray-300">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{data.period}</span>
                      <span className="text-white font-medium">
                        {formatCurrency(data.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Trading Fees</span>
                    <span className="text-white font-medium">
                      {formatCurrency(analyticsData.revenue.current * 0.65)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subscription Plans</span>
                    <span className="text-white font-medium">
                      {formatCurrency(analyticsData.revenue.current * 0.25)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Premium Features</span>
                    <span className="text-white font-medium">
                      {formatCurrency(analyticsData.revenue.current * 0.10)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{data.period}</span>
                      <span className="text-white font-medium">
                        {formatNumber(data.customers)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Customers</span>
                    <Badge className="bg-green-600 text-white">
                      {formatNumber(analyticsData.customers.active)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">New Customers</span>
                    <Badge className="bg-blue-600 text-white">
                      {formatNumber(analyticsData.customers.new)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Churn Rate</span>
                    <Badge className="bg-red-600 text-white">
                      {analyticsData.customers.churn}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Sales Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Deals</span>
                    <span className="text-white font-medium">{analyticsData.deals.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Won Deals</span>
                    <Badge className="bg-green-600 text-white">{analyticsData.deals.won}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Lost Deals</span>
                    <Badge className="bg-red-600 text-white">{analyticsData.deals.lost}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Conversion Rate</span>
                    <Badge className="bg-blue-600 text-white">{analyticsData.deals.conversion}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Deal Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{data.period}</span>
                      <span className="text-white font-medium">{data.deals} deals</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Support Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Tickets</span>
                    <span className="text-white font-medium">{analyticsData.support.tickets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Resolved Tickets</span>
                    <Badge className="bg-green-600 text-white">{analyticsData.support.resolved}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Avg Response Time</span>
                    <Badge className="bg-blue-600 text-white">{analyticsData.support.avgResponse}h</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Satisfaction Score</span>
                    <Badge className="bg-yellow-600 text-white">{analyticsData.support.satisfaction}/5.0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Ticket Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">KYC/Verification</span>
                    <span className="text-white font-medium">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Trading Issues</span>
                    <span className="text-white font-medium">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Withdrawals</span>
                    <span className="text-white font-medium">22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Technical</span>
                    <span className="text-white font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Performance Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {analyticsData.revenue.change}%
              </div>
              <p className="text-gray-400">Revenue Growth</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {analyticsData.deals.conversion}%
              </div>
              <p className="text-gray-400">Conversion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                {analyticsData.support.satisfaction}
              </div>
              <p className="text-gray-400">Customer Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}