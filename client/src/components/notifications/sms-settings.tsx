import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Shield, 
  Bell, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  MessageSquare,
  Settings,
  Smartphone
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SMSSettingsProps {
  userPhone?: string;
  isPhoneVerified?: boolean;
}

export default function SMSSettings({ userPhone = "", isPhoneVerified = false }: SMSSettingsProps) {
  const [phoneNumber, setPhoneNumber] = useState(userPhone);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(isPhoneVerified);
  const [isLoading, setIsLoading] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    tradeNotifications: true,
    securityAlerts: true,
    deposits: true,
    withdrawals: true,
    twoFactorAuth: true
  });

  const { toast } = useToast();

  const handleSendVerification = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/sms/verify-phone", {
        method: "POST",
        body: JSON.stringify({ phoneNumber })
      });

      if (response.success) {
        setShowVerification(true);
        toast({
          title: "Verification Code Sent",
          description: `A 6-digit code has been sent to ${phoneNumber}`,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Failed to Send Code",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiRequest("/api/sms/validate-phone", {
        method: "POST",
        body: JSON.stringify({ code: verificationCode })
      });

      if (response.success) {
        setPhoneVerified(true);
        setShowVerification(false);
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTestSMS = async () => {
    if (!phoneVerified) {
      toast({
        title: "Phone Not Verified",
        description: "Please verify your phone number first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/sms/test", {
        method: "POST",
        body: JSON.stringify({ phoneNumber })
      });

      if (response.success) {
        toast({
          title: "Test SMS Sent",
          description: "Check your phone for the test message",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error.message || "Failed to send test SMS",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotificationPreference = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Phone Verification Section */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span>Phone Number Verification</span>
            {phoneVerified && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex space-x-2">
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={phoneVerified}
                className="bg-gray-700/50 border-gray-600"
              />
              {!phoneVerified && (
                <Button 
                  onClick={handleSendVerification}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Sending..." : "Verify"}
                </Button>
              )}
            </div>
          </div>

          {showVerification && (
            <div className="space-y-2 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Label htmlFor="code">Verification Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="bg-gray-700/50 border-gray-600"
                />
                <Button 
                  onClick={handleVerifyCode}
                  disabled={isVerifying}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isVerifying ? "Verifying..." : "Confirm"}
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
            </div>
          )}

          {phoneVerified && (
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Phone number verified</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTestSMS}
                disabled={isLoading}
                className="border-green-500/30 text-green-400 hover:bg-green-500/20"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Test SMS
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <span>SMS Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price Alerts */}
          <div className="flex items-center justify-between p-3 border border-gray-600/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium">Price Alerts</p>
                <p className="text-sm text-gray-400">Get notified when prices hit your targets</p>
              </div>
            </div>
            <Switch
              checked={notifications.priceAlerts}
              onCheckedChange={(checked) => updateNotificationPreference('priceAlerts', checked)}
              disabled={!phoneVerified}
            />
          </div>

          {/* Trade Notifications */}
          <div className="flex items-center justify-between p-3 border border-gray-600/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium">Trade Notifications</p>
                <p className="text-sm text-gray-400">Order fills and trade confirmations</p>
              </div>
            </div>
            <Switch
              checked={notifications.tradeNotifications}
              onCheckedChange={(checked) => updateNotificationPreference('tradeNotifications', checked)}
              disabled={!phoneVerified}
            />
          </div>

          {/* Security Alerts */}
          <div className="flex items-center justify-between p-3 border border-gray-600/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-red-400" />
              <div>
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-gray-400">Login attempts and account changes</p>
              </div>
            </div>
            <Switch
              checked={notifications.securityAlerts}
              onCheckedChange={(checked) => updateNotificationPreference('securityAlerts', checked)}
              disabled={!phoneVerified}
            />
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-3 border border-gray-600/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">SMS codes for secure login</p>
              </div>
            </div>
            <Switch
              checked={notifications.twoFactorAuth}
              onCheckedChange={(checked) => updateNotificationPreference('twoFactorAuth', checked)}
              disabled={!phoneVerified}
            />
          </div>

          {/* Deposit Notifications */}
          <div className="flex items-center justify-between p-3 border border-gray-600/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-medium">Deposit Confirmations</p>
                <p className="text-sm text-gray-400">Confirmed deposits and credits</p>
              </div>
            </div>
            <Switch
              checked={notifications.deposits}
              onCheckedChange={(checked) => updateNotificationPreference('deposits', checked)}
              disabled={!phoneVerified}
            />
          </div>

          {/* Withdrawal Notifications */}
          <div className="flex items-center justify-between p-3 border border-gray-600/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <div>
                <p className="font-medium">Withdrawal Confirmations</p>
                <p className="text-sm text-gray-400">Withdrawal processing updates</p>
              </div>
            </div>
            <Switch
              checked={notifications.withdrawals}
              onCheckedChange={(checked) => updateNotificationPreference('withdrawals', checked)}
              disabled={!phoneVerified}
            />
          </div>

          {!phoneVerified && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <p className="text-orange-400 text-sm">
                  Verify your phone number to enable SMS notifications
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Status */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            <span>SMS Service Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-400">Powered by Twilio</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}