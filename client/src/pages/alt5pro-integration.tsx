/**
 * Alt5Pro Integration Dashboard
 * Frontend interface for Alt5Pro API functionality
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Shield, 
  Database, 
  Settings, 
  Bell,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useWalletAuth } from "@/hooks/useWalletAuth";

interface MarketData {
  instrument: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: string;
}

interface ConnectionStatus {
  success: boolean;
  totalTests: number;
  successfulTests: number;
  results: Array<{
    endpoint: string;
    success: boolean;
    error?: string;
  }>;
}

export default function Alt5ProIntegration() {
  const { isAuthenticated, user } = useWalletAuth();
  const { toast } = useToast();
  
  // State management
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [orderBookData, setOrderBookData] = useState(null);
  const [platformInfo, setPlatformInfo] = useState(null);
  
  // Form states
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  
  const [selectedInstrument, setSelectedInstrument] = useState('BTCUSDT');

  // Load initial data
  useEffect(() => {
    loadMarketData();
    testConnection();
  }, []);

  // CLIENT ONBOARDING FUNCTIONS
  
  const handleSignup = async () => {
    setSignupLoading(true);
    try {
      const response = await apiRequest('POST', '/api/alt5pro/client/signup', signupForm);
      
      if (response.success) {
        toast({
          title: "Account Created Successfully",
          description: "Please check your email for verification instructions.",
        });
        
        // Reset form
        setSignupForm({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phoneNumber: ''
        });
      } else {
        toast({
          title: "Signup Failed",
          description: response.error || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setSignupLoading(false);
    }
  };

  const loadMarketData = async () => {
    try {
      const response = await apiRequest('GET', '/api/alt5pro/client/market/ticker');
      if (response.success && response.data) {
        setMarketData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error('Market data error:', error);
      toast({
        title: "Market Data Error",
        description: "Failed to load real-time market data",
        variant: "destructive",
      });
    }
  };

  const loadOrderBook = async (instrument: string) => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', `/api/alt5pro/client/market/orderbook/${instrument}?limit=10`);
      if (response.success) {
        setOrderBookData(response.data);
      } else {
        toast({
          title: "Order Book Error",
          description: "Failed to load order book data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Order book error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlatformInfo = async () => {
    try {
      const response = await apiRequest('GET', '/api/alt5pro/client/platform/info');
      if (response.success) {
        setPlatformInfo(response.data);
      }
    } catch (error) {
      console.error('Platform info error:', error);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/alt5pro/admin/system/test-connection');
      setConnectionStatus(response);
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus({
        success: false,
        totalTests: 0,
        successfulTests: 0,
        results: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Alt5Pro Integration Dashboard
          </h1>
          <p className="text-blue-200">
            Professional crypto trading infrastructure powered by Alt5Pro APIs
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5" />
              API Connection Status
            </CardTitle>
            <CardDescription className="text-blue-200">
              Real-time connectivity to Alt5Pro services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Button onClick={testConnection} disabled={loading} variant="outline">
                {loading ? "Testing..." : "Test Connection"}
              </Button>
              {connectionStatus && (
                <Badge 
                  variant={connectionStatus.success ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {connectionStatus.success ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {connectionStatus.success ? "Connected" : "Connection Failed"}
                </Badge>
              )}
            </div>
            
            {connectionStatus && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {connectionStatus.totalTests}
                  </div>
                  <div className="text-sm text-blue-200">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {connectionStatus.successfulTests}
                  </div>
                  <div className="text-sm text-blue-200">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {connectionStatus.totalTests - connectionStatus.successfulTests}
                  </div>
                  <div className="text-sm text-blue-200">Failed</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="client" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur">
            <TabsTrigger value="client" className="data-[state=active]:bg-white/20">
              Client Onboarding
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-white/20">
              Market Data
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-white/20" disabled={!isAuthenticated}>
              Admin Panel
            </TabsTrigger>
            <TabsTrigger value="platform" className="data-[state=active]:bg-white/20">
              Platform Info
            </TabsTrigger>
          </TabsList>

          {/* CLIENT ONBOARDING TAB */}
          <TabsContent value="client" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  Client Account Creation
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Create new trading accounts via Alt5Pro Identity Server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="client@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Secure password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input
                        id="firstName"
                        value={signupForm.firstName}
                        onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        value={signupForm.phoneNumber}
                        onChange={(e) => setSignupForm({...signupForm, phoneNumber: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="+1234567890"
                      />
                    </div>
                    <Button 
                      onClick={handleSignup} 
                      disabled={signupLoading || !signupForm.email || !signupForm.password}
                      className="w-full mt-4"
                    >
                      {signupLoading ? "Creating Account..." : "Create Trading Account"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MARKET DATA TAB */}
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5" />
                    Real-time Market Ticker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={loadMarketData} disabled={loading} className="mb-4">
                    {loading ? "Loading..." : "Refresh Market Data"}
                  </Button>
                  
                  {marketData.length > 0 ? (
                    <div className="space-y-2">
                      {marketData.slice(0, 5).map((data, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded">
                          <span className="text-white font-medium">{data.instrument || 'BTC/USDT'}</span>
                          <div className="text-right">
                            <div className="text-white">${data.price?.toFixed(2) || 'N/A'}</div>
                            <div className={`text-sm ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {data.change24h >= 0 ? '+' : ''}{data.change24h?.toFixed(2) || 'N/A'}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <Info className="w-4 h-4" />
                      <AlertTitle>No Market Data</AlertTitle>
                      <AlertDescription>
                        Click "Refresh Market Data" to load real-time pricing information
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Database className="w-5 h-5" />
                    Order Book Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={selectedInstrument}
                      onChange={(e) => setSelectedInstrument(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="BTCUSDT"
                    />
                    <Button onClick={() => loadOrderBook(selectedInstrument)} disabled={loading}>
                      Load Order Book
                    </Button>
                  </div>
                  
                  {orderBookData ? (
                    <div className="space-y-2">
                      <div className="text-green-400 font-medium">Bids</div>
                      {/* Order book rendering would go here */}
                      <div className="text-sm text-green-400">Order book data loaded successfully</div>
                    </div>
                  ) : (
                    <Alert>
                      <Info className="w-4 h-4" />
                      <AlertTitle>No Order Book Data</AlertTitle>
                      <AlertDescription>
                        Enter an instrument symbol and click "Load Order Book"
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ADMIN PANEL TAB */}
          <TabsContent value="admin" className="space-y-6">
            {isAuthenticated ? (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5" />
                    Administrative Functions
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Backend management and monitoring tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Users className="w-6 h-6 mb-2" />
                      User Management
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Database className="w-6 h-6 mb-2" />
                      Account Analytics
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Settings className="w-6 h-6 mb-2" />
                      System Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>
                  Please log in to access administrative functions.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* PLATFORM INFO TAB */}
          <TabsContent value="platform" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Info className="w-5 h-5" />
                  Platform Information
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Alt5Pro platform status and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={loadPlatformInfo} disabled={loading} className="mb-4">
                  {loading ? "Loading..." : "Load Platform Info"}
                </Button>
                
                {platformInfo ? (
                  <div className="space-y-2">
                    <div className="text-sm text-green-400">Platform information loaded successfully</div>
                    <pre className="text-xs text-white bg-black/20 p-3 rounded overflow-auto">
                      {JSON.stringify(platformInfo, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertTitle>No Platform Data</AlertTitle>
                    <AlertDescription>
                      Click "Load Platform Info" to retrieve system information
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-blue-200">
          <p>Alt5Pro Integration • Professional Trading Infrastructure</p>
        </div>
      </div>
    </div>
  );
}