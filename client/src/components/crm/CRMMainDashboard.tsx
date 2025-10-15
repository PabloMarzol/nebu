import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerManagement } from "./CustomerManagement";
import { SalesPipeline } from "./SalesPipeline";
import { SupportTicketing } from "./SupportTicketing";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { MobileCRMNavigation } from "./MobileCRMNavigation";
import { 
  Users, 
  Target, 
  MessageSquare, 
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Settings,
  ExternalLink
} from "lucide-react";

export function CRMMainDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock summary data
  const summaryData = {
    customers: {
      total: 15420,
      new: 1250,
      active: 12800
    },
    deals: {
      total: 145,
      value: 2450000,
      won: 87
    },
    support: {
      tickets: 342,
      resolved: 318,
      avgResponse: 2.4
    },
    revenue: {
      current: 2450000,
      growth: 16.7
    }
  };

  const [notifications] = useState(12); // Mock notification count

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileCRMNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notifications={notifications}
        />
      </div>

      {/* Desktop Layout */}
      <div className="lg:ml-64 p-6 pt-20 lg:pt-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">CRM Dashboard</h1>
          <p className="text-gray-400">Customer Relationship Management & Business Operations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 mb-6">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="customers" className="text-gray-300 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="sales" className="text-gray-300 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="support" className="text-gray-300 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-400 text-sm">Total Customers</p>
                      <p className="text-2xl font-semibold text-white">
                        {summaryData.customers.total.toLocaleString()}
                      </p>
                      <p className="text-green-400 text-sm">
                        +{summaryData.customers.new} new this month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-400 text-sm">Revenue</p>
                      <p className="text-2xl font-semibold text-white">
                        ${summaryData.revenue.current.toLocaleString()}
                      </p>
                      <p className="text-green-400 text-sm">
                        +{summaryData.revenue.growth}% growth
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-400 text-sm">Active Deals</p>
                      <p className="text-2xl font-semibold text-white">
                        {summaryData.deals.total}
                      </p>
                      <p className="text-blue-400 text-sm">
                        ${summaryData.deals.value.toLocaleString()} pipeline
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-600 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-400 text-sm">Support Tickets</p>
                      <p className="text-2xl font-semibold text-white">
                        {summaryData.support.tickets}
                      </p>
                      <p className="text-green-400 text-sm">
                        {summaryData.support.resolved} resolved
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <button 
                    onClick={() => setActiveTab("customers")}
                    className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Add New Customer</p>
                        <p className="text-gray-400 text-sm">Register a new customer account</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab("sales")}
                    className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-green-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Create New Deal</p>
                        <p className="text-gray-400 text-sm">Add a new sales opportunity</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab("support")}
                    className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-yellow-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Create Support Ticket</p>
                        <p className="text-gray-400 text-sm">Log a customer support request</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab("analytics")}
                    className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 text-purple-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">View Analytics</p>
                        <p className="text-gray-400 text-sm">Detailed performance metrics</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => window.open('/exchange-operations', '_blank')}
                    className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 text-cyan-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Exchange Operations</p>
                        <p className="text-gray-400 text-sm">Liquidity, compliance, treasury management</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>
                  </button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-600 rounded-full">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Deal closed: Enterprise Trading Platform</p>
                      <p className="text-gray-400 text-xs">2 hours ago • $250,000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-blue-600 rounded-full">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm">New customer registered: Tech Corp Ltd</p>
                      <p className="text-gray-400 text-xs">4 hours ago • KYC Level 2</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-yellow-600 rounded-full">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Support ticket resolved: KYC verification issue</p>
                      <p className="text-gray-400 text-xs">6 hours ago • Ticket #TK-001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-purple-600 rounded-full">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Deal updated: White Label Solution moved to negotiation</p>
                      <p className="text-gray-400 text-xs">8 hours ago • $750,000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-red-600 rounded-full">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Urgent ticket created: Withdrawal processing delay</p>
                      <p className="text-gray-400 text-xs">12 hours ago • High priority</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">This Month's Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-2">
                      {summaryData.customers.new}
                    </div>
                    <p className="text-gray-400">New Customers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500 mb-2">
                      {summaryData.deals.won}
                    </div>
                    <p className="text-gray-400">Deals Won</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500 mb-2">
                      {summaryData.support.avgResponse}h
                    </div>
                    <p className="text-gray-400">Avg Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500 mb-2">
                      ${(summaryData.deals.value / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-gray-400">Pipeline Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="sales">
            <SalesPipeline />
          </TabsContent>

          <TabsContent value="support">
            <SupportTicketing />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}