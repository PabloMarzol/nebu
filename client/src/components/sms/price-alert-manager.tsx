import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Bell,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface PriceAlert {
  id: number;
  symbol: string;
  targetPrice: string;
  direction: 'above' | 'below';
  isActive: boolean;
  phoneNumber: string;
  createdAt: string;
}

export default function PriceAlertManager() {
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    direction: 'above' as 'above' | 'below',
    phoneNumber: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Popular trading pairs
  const tradingPairs = [
    'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT', 'DOT/USDT',
    'LINK/USDT', 'UNI/USDT', 'AVAX/USDT', 'MATIC/USDT', 'ATOM/USDT'
  ];

  // Get current user for phone number
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user']
  });

  // Get user's price alerts
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['/api/sms/price-alerts'],
    enabled: !!user
  });

  // Create price alert mutation
  const createAlertMutation = useMutation({
    mutationFn: (alertData: any) =>
      apiRequest('/api/sms/price-alert', {
        method: 'POST',
        body: JSON.stringify(alertData)
      }),
    onSuccess: () => {
      toast({
        title: "Price Alert Created",
        description: "You'll receive an SMS when the price target is reached"
      });
      setNewAlert({ symbol: '', targetPrice: '', direction: 'above', phoneNumber: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/sms/price-alerts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Alert",
        description: error.message || "Please check your settings and try again",
        variant: "destructive"
      });
    }
  });

  // Delete price alert mutation
  const deleteAlertMutation = useMutation({
    mutationFn: (alertId: number) =>
      apiRequest(`/api/sms/price-alerts/${alertId}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      toast({
        title: "Price Alert Deleted",
        description: "Alert has been removed successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sms/price-alerts'] });
    }
  });

  const handleCreateAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const phoneNumber = newAlert.phoneNumber || user?.phoneNumber;
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please set your phone number in SMS settings first",
        variant: "destructive"
      });
      return;
    }

    createAlertMutation.mutate({
      ...newAlert,
      phoneNumber
    });
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'above' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getDirectionText = (direction: string) => {
    return direction === 'above' ? 'Above' : 'Below';
  };

  return (
    <div className="space-y-6">
      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Price Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Trading Pair</Label>
              <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trading pair" />
                </SelectTrigger>
                <SelectContent>
                  {tradingPairs.map(pair => (
                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPrice">Target Price ($)</Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Alert When Price Goes</Label>
              <Select value={newAlert.direction} onValueChange={(value: 'above' | 'below') => setNewAlert(prev => ({ ...prev, direction: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above Target</SelectItem>
                  <SelectItem value="below">Below Target</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
              <Input
                id="phoneNumber"
                placeholder={user?.phoneNumber || "+1 (555) 123-4567"}
                value={newAlert.phoneNumber}
                onChange={(e) => setNewAlert(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to use your default phone number
              </p>
            </div>
          </div>

          <Button 
            onClick={handleCreateAlert}
            disabled={createAlertMutation.isPending}
            className="w-full"
          >
            {createAlertMutation.isPending ? "Creating..." : "Create Price Alert"}
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Active Price Alerts</span>
            <Badge variant="secondary">{alerts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No price alerts configured. Create your first alert above to get notified when prices hit your targets.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert: PriceAlert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getDirectionIcon(alert.direction)}
                    <div>
                      <div className="font-medium">{alert.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        Alert when {getDirectionText(alert.direction).toLowerCase()} ${alert.targetPrice}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {alert.isActive ? (
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAlertMutation.mutate(alert.id)}
                      disabled={deleteAlertMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Example Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Bull Market Alert:</strong> Set BTC above $50,000 to catch breakout momentum</p>
            <p><strong>Bear Market Alert:</strong> Set ETH below $2,000 to identify buying opportunities</p>
            <p><strong>Profit Taking:</strong> Set SOL above $30 to secure gains on your position</p>
            <p><strong>Stop Loss:</strong> Set your holdings below purchase price to limit losses</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}