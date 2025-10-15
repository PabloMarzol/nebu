import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Phone, MessageSquare, Bell, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SMSAlert {
  id: string;
  type: 'price' | 'trade' | 'security' | 'news';
  symbol?: string;
  condition: string;
  threshold?: number;
  enabled: boolean;
}

export default function SMSMessaging() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [alerts, setAlerts] = useState<SMSAlert[]>([
    {
      id: '1',
      type: 'price',
      symbol: 'BTC',
      condition: 'above',
      threshold: 45000,
      enabled: true
    },
    {
      id: '2',
      type: 'trade',
      condition: 'order_filled',
      enabled: true
    },
    {
      id: '3',
      type: 'security',
      condition: 'login_alert',
      enabled: false
    }
  ]);

  const { toast } = useToast();

  const sendSMSMutation = useMutation({
    mutationFn: async (data: { phone: string; message: string }) => {
      return apiRequest('/api/sms/send', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "SMS Sent!",
        description: "Your message has been delivered successfully.",
      });
      setMessage('');
    },
    onError: (error: any) => {
      toast({
        title: "SMS Failed",
        description: error.message || "Failed to send SMS message.",
        variant: "destructive",
      });
    }
  });

  const setupAlertsMutation = useMutation({
    mutationFn: async (alertData: SMSAlert[]) => {
      return apiRequest('/api/sms/alerts', {
        method: 'POST',
        body: JSON.stringify({ alerts: alertData })
      });
    },
    onSuccess: () => {
      toast({
        title: "Alerts Updated",
        description: "SMS alert preferences saved successfully.",
      });
    }
  });

  const handleSendSMS = () => {
    if (!phoneNumber || !message) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message.",
        variant: "destructive",
      });
      return;
    }

    sendSMSMutation.mutate({ phone: phoneNumber, message });
  };

  const toggleAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    );
    setAlerts(updatedAlerts);
    setupAlertsMutation.mutate(updatedAlerts);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price': return <TrendingUp className="w-4 h-4" />;
      case 'trade': return <DollarSign className="w-4 h-4" />;
      case 'security': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* SMS Messaging */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <span>Send SMS Message</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Quick Templates</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMessage("🚀 Your NebulaX trade has been executed successfully!")}
                >
                  Trade Alert
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMessage("📈 BTC price alert: Target reached!")}
                >
                  Price Alert
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your SMS message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={160}
            />
            <div className="text-sm text-muted-foreground text-right">
              {message.length}/160 characters
            </div>
          </div>

          <Button
            onClick={handleSendSMS}
            disabled={sendSMSMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Phone className="w-4 h-4 mr-2" />
            {sendSMSMutation.isPending ? 'Sending...' : 'Send SMS'}
          </Button>
        </CardContent>
      </Card>

      {/* SMS Alerts Configuration */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-500" />
            <span>SMS Alert Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getAlertIcon(alert.type)}
                <div>
                  <div className="font-medium">
                    {alert.type === 'price' && `${alert.symbol} Price Alert`}
                    {alert.type === 'trade' && 'Trade Notifications'}
                    {alert.type === 'security' && 'Security Alerts'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {alert.type === 'price' && `Notify when ${alert.symbol} goes ${alert.condition} $${alert.threshold}`}
                    {alert.type === 'trade' && 'Get notified when orders are filled'}
                    {alert.type === 'security' && 'Security and login notifications'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={alert.enabled ? "default" : "secondary"}>
                  {alert.enabled ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  checked={alert.enabled}
                  onCheckedChange={() => toggleAlert(alert.id)}
                />
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                toast({
                  title: "More Alerts",
                  description: "Navigate to SMS Settings for advanced alert configuration.",
                });
                window.location.href = '/sms-settings';
              }}
            >
              Configure More Alerts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support via SMS */}
      <Card className="glass-enhanced border-purple-500/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">24/7 SMS Support</h3>
              <p className="text-muted-foreground">
                Text us anytime for urgent trading support
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setPhoneNumber('+1-555-NEBULA-X');
                  setMessage('I need help with my trading account');
                }}
              >
                Quick Support Request
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600"
                onClick={() => window.location.href = 'sms:+15553624852?body=NebulaX Support Request: '}
              >
                Text Support Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}