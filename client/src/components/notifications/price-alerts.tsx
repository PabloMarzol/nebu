import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X, 
  AlertTriangle,
  DollarSign,
  Smartphone
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  alertType: 'above' | 'below';
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
}

interface PriceAlertsProps {
  phoneNumber?: string;
  isPhoneVerified?: boolean;
}

export default function PriceAlerts({ phoneNumber, isPhoneVerified = false }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    alertType: 'above' as 'above' | 'below'
  });

  const { toast } = useToast();

  // Popular trading pairs for quick selection
  const popularPairs = [
    { symbol: 'BTC/USDT', currentPrice: 43250.00 },
    { symbol: 'ETH/USDT', currentPrice: 2580.00 },
    { symbol: 'SOL/USDT', currentPrice: 98.50 },
    { symbol: 'ADA/USDT', currentPrice: 0.45 },
    { symbol: 'DOT/USDT', currentPrice: 7.25 },
    { symbol: 'LINK/USDT', currentPrice: 14.80 }
  ];

  useEffect(() => {
    loadExistingAlerts();
  }, []);

  const loadExistingAlerts = () => {
    // Mock existing alerts - in real app, fetch from API
    const mockAlerts: PriceAlert[] = [
      {
        id: '1',
        symbol: 'BTC/USDT',
        targetPrice: 45000,
        alertType: 'above',
        currentPrice: 43250,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        symbol: 'ETH/USDT',
        targetPrice: 2400,
        alertType: 'below',
        currentPrice: 2580,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    setAlerts(mockAlerts);
  };

  const handleCreateAlert = async () => {
    if (!isPhoneVerified) {
      toast({
        title: "Phone Not Verified",
        description: "Please verify your phone number first to receive SMS alerts",
        variant: "destructive"
      });
      return;
    }

    if (!newAlert.symbol || !newAlert.targetPrice) {
      toast({
        title: "Missing Information",
        description: "Please select a trading pair and enter a target price",
        variant: "destructive"
      });
      return;
    }

    const targetPrice = parseFloat(newAlert.targetPrice);
    if (isNaN(targetPrice) || targetPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid target price",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get current price for the selected pair
      const selectedPair = popularPairs.find(p => p.symbol === newAlert.symbol);
      const currentPrice = selectedPair?.currentPrice || 0;

      // Create the alert
      const alertData = {
        phoneNumber,
        symbol: newAlert.symbol,
        price: currentPrice,
        alertType: newAlert.alertType,
        targetPrice
      };

      const response = await apiRequest("/api/sms/price-alert", {
        method: "POST",
        body: JSON.stringify(alertData)
      });

      if (response.success) {
        // Add to local state
        const newAlertItem: PriceAlert = {
          id: Date.now().toString(),
          symbol: newAlert.symbol,
          targetPrice,
          alertType: newAlert.alertType,
          currentPrice,
          isActive: true,
          createdAt: new Date().toISOString()
        };

        setAlerts(prev => [...prev, newAlertItem]);
        setNewAlert({ symbol: '', targetPrice: '', alertType: 'above' });
        setShowCreateForm(false);

        toast({
          title: "Price Alert Created",
          description: `You'll receive an SMS when ${newAlert.symbol} ${newAlert.alertType === 'above' ? 'rises above' : 'falls below'} $${targetPrice.toFixed(2)}`,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Failed to Create Alert",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed",
    });
  };

  const getAlertStatus = (alert: PriceAlert) => {
    const { alertType, targetPrice, currentPrice } = alert;
    
    if (alertType === 'above' && currentPrice >= targetPrice) {
      return { status: 'triggered', color: 'text-green-400', bg: 'bg-green-500/20' };
    } else if (alertType === 'below' && currentPrice <= targetPrice) {
      return { status: 'triggered', color: 'text-green-400', bg: 'bg-green-500/20' };
    } else {
      return { status: 'active', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-purple-400" />
              <span>SMS Price Alerts</span>
              <Badge variant="outline" className="bg-purple-500/20 text-purple-300">
                {alerts.length} Active
              </Badge>
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              disabled={!isPhoneVerified}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </CardHeader>
        
        {!isPhoneVerified && (
          <CardContent>
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-orange-400 font-medium">Phone Verification Required</p>
                  <p className="text-orange-300 text-sm">
                    Verify your phone number in SMS Settings to receive price alerts
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Create Alert Form */}
      {showCreateForm && isPhoneVerified && (
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Create New Price Alert</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Trading Pair</Label>
                <Select
                  value={newAlert.symbol}
                  onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularPairs.map(pair => (
                      <SelectItem key={pair.symbol} value={pair.symbol}>
                        <div className="flex items-center justify-between w-full">
                          <span>{pair.symbol}</span>
                          <span className="text-gray-400 ml-2">${pair.currentPrice.toFixed(2)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Alert Type</Label>
                <Select
                  value={newAlert.alertType}
                  onValueChange={(value: 'above' | 'below') => setNewAlert(prev => ({ ...prev, alertType: value }))}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span>Above (Breakout)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="below">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4 text-red-400" />
                        <span>Below (Breakdown)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Price ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAlert}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Creating..." : "Create Alert"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      <div className="space-y-4">
        {alerts.map(alert => {
          const statusInfo = getAlertStatus(alert);
          return (
            <Card key={alert.id} className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {alert.alertType === 'above' ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="font-medium">{alert.symbol}</p>
                        <p className="text-sm text-gray-400">
                          Alert when {alert.alertType} ${alert.targetPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-medium">${alert.currentPrice.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">Current Price</p>
                    </div>

                    <Badge className={`${statusInfo.bg} ${statusInfo.color} border-none`}>
                      {statusInfo.status === 'triggered' ? 'Triggered' : 'Active'}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {alerts.length === 0 && isPhoneVerified && (
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Price Alerts</h3>
              <p className="text-gray-400 mb-4">
                Create your first price alert to get notified via SMS when markets move
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}