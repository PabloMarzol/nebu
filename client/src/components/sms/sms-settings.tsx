import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PriceAlertManager from "./price-alert-manager";
import {
  Phone,
  Shield,
  Bell,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Settings,
  Send,
  Target
} from "lucide-react";

interface SMSProvider {
  name: string;
  configured: boolean;
  balance?: number | string;
}

export default function SMSSettings() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [smsNotifications, setSmsNotifications] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get SMS providers status
  const { data: providers } = useQuery({
    queryKey: ['/api/sms/providers'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Get current user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user']
  });

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phoneNumber || "");
      setSmsNotifications(user.smsNotifications ?? true);
    }
  }, [user]);

  // Send verification SMS
  const verifyPhoneMutation = useMutation({
    mutationFn: (phoneNumber: string) => 
      apiRequest('/api/sms/verify-phone', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber })
      }),
    onSuccess: () => {
      toast({
        title: "Verification Code Sent",
        description: "Check your phone for the verification code"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Code",
        description: error.message || "Please check your phone number and try again",
        variant: "destructive"
      });
    }
  });

  // Send test SMS
  const testSMSMutation = useMutation({
    mutationFn: (data: { phoneNumber: string; message: string }) =>
      apiRequest('/api/sms/send', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      toast({
        title: "Test SMS Sent",
        description: "Check your phone for the test message"
      });
      setTestMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send SMS",
        description: error.message || "SMS service may not be configured",
        variant: "destructive"
      });
    }
  });

  const handleVerifyPhone = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    verifyPhoneMutation.mutate(phoneNumber);
  };

  const handleTestSMS = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please verify your phone number first",
        variant: "destructive"
      });
      return;
    }
    
    const message = testMessage.trim() || "Test message from NebulaX trading platform";
    testSMSMutation.mutate({ phoneNumber, message });
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
      }
    }
    return value;
  };

  const getProviderStatusColor = (provider: SMSProvider) => {
    if (!provider.configured) return "secondary";
    return "default";
  };

  const configuredProviders = providers?.filter((p: SMSProvider) => p.configured) || [];
  const hasConfiguredProviders = configuredProviders.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">SMS Notifications</h2>
        <p className="text-muted-foreground">
          Configure SMS alerts for trading activities and security notifications
        </p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>SMS Settings</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Price Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">

      {/* Provider Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>SMS Service Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasConfiguredProviders ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No SMS providers are currently configured. Contact your administrator to set up SMS services.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Providers:</span>
                <div className="flex space-x-2">
                  {configuredProviders.map((provider: SMSProvider) => (
                    <Badge key={provider.name} variant={getProviderStatusColor(provider)}>
                      {provider.name}
                      {provider.balance && typeof provider.balance === 'number' && (
                        <span className="ml-1">({provider.balance} credits)</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  SMS services are operational and ready to send notifications.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phone Number Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Phone Number</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex space-x-2">
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formatPhoneNumber(phoneNumber)}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleVerifyPhone}
                disabled={verifyPhoneMutation.isPending || !hasConfiguredProviders}
                variant="outline"
              >
                {verifyPhoneMutation.isPending ? "Sending..." : "Verify"}
              </Button>
            </div>
            {user?.phoneVerified ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Phone number verified</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter your phone number to receive SMS notifications
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
            <Label htmlFor="sms-notifications">Enable SMS notifications</Label>
          </div>
        </CardContent>
      </Card>

      {/* Test SMS */}
      {hasConfiguredProviders && phoneNumber && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Test SMS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-message">Test Message (optional)</Label>
              <Input
                id="test-message"
                placeholder="Custom test message..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                maxLength={160}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to send a default test message
              </p>
            </div>
            <Button
              onClick={handleTestSMS}
              disabled={testSMSMutation.isPending}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {testSMSMutation.isPending ? "Sending..." : "Send Test SMS"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Security Alerts</p>
                  <p className="text-sm text-muted-foreground">Login attempts, password changes</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Price Alerts</p>
                  <p className="text-sm text-muted-foreground">When assets reach target prices</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Trade Confirmations</p>
                  <p className="text-sm text-muted-foreground">Order fills and trade executions</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Account Updates</p>
                  <p className="text-sm text-muted-foreground">KYC status, withdrawal limits</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <PriceAlertManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}