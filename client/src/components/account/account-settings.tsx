import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { 
  User, 
  Shield, 
  Bell, 
  Eye, 
  Globe,
  Smartphone,
  Mail,
  Lock,
  Key,
  CreditCard,
  Settings,
  Save,
  RefreshCw
} from "lucide-react";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  timezone: string;
  language: string;
  avatar?: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loginAlerts: boolean;
  tradingConfirmations: boolean;
  sessionTimeout: number;
  allowedIPs: string[];
}

interface NotificationSettings {
  emailMarketing: boolean;
  emailTrades: boolean;
  emailSecurity: boolean;
  emailNews: boolean;
  smsTrading: boolean;
  smsSecurity: boolean;
  pushNotifications: boolean;
  priceAlerts: boolean;
}

interface TradingPreferences {
  defaultOrderType: 'market' | 'limit';
  confirmBeforeTrading: boolean;
  showAdvancedInterface: boolean;
  defaultFiatCurrency: string;
  chartType: 'candlestick' | 'line' | 'area';
  soundAlerts: boolean;
  autoRefreshInterval: number;
}

export default function AccountSettings() {
  const { user } = useWalletAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    country: "US",
    timezone: "America/New_York",
    language: "en"
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: user?.twoFactorEnabled || false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    tradingConfirmations: true,
    sessionTimeout: 30,
    allowedIPs: []
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailMarketing: false,
    emailTrades: true,
    emailSecurity: true,
    emailNews: false,
    smsTrading: false,
    smsSecurity: true,
    pushNotifications: true,
    priceAlerts: true
  });

  const [trading, setTrading] = useState<TradingPreferences>({
    defaultOrderType: 'limit',
    confirmBeforeTrading: true,
    showAdvancedInterface: false,
    defaultFiatCurrency: 'USD',
    chartType: 'candlestick',
    soundAlerts: true,
    autoRefreshInterval: 5
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    try {
      // API call to update security settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      toast({
        title: "Security Settings Updated",
        description: "Your security preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update security settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // API call to update notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrading = async () => {
    setIsLoading(true);
    try {
      // API call to update trading preferences
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      toast({
        title: "Trading Preferences Updated",
        description: "Your trading preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update trading preferences.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile, security, and trading preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                  <div className="flex items-center gap-2">
                    {user?.emailVerified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge variant="destructive">Not Verified</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                  <div className="flex items-center gap-2">
                    {user?.phoneVerified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Optional</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={profile.country} onValueChange={(value) => setProfile({...profile, country: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure your account security and authentication methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {security.twoFactorEnabled && (
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    )}
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurity({...security, twoFactorEnabled: checked})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity({...security, loginAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Trading Confirmations</Label>
                    <p className="text-sm text-muted-foreground">
                      Require confirmation for large trades
                    </p>
                  </div>
                  <Switch
                    checked={security.tradingConfirmations}
                    onCheckedChange={(checked) => setSecurity({...security, tradingConfirmations: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select 
                    value={security.sessionTimeout.toString()} 
                    onValueChange={(value) => setSecurity({...security, sessionTimeout: parseInt(value)})}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    We recommend keeping two-factor authentication enabled and using strong, unique passwords.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSecurity} disabled={isLoading}>
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </h4>
                
                <div className="space-y-3 ml-6">
                  <div className="flex items-center justify-between">
                    <Label>Trading Activity</Label>
                    <Switch
                      checked={notifications.emailTrades}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailTrades: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Security Alerts</Label>
                    <Switch
                      checked={notifications.emailSecurity}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailSecurity: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Market News</Label>
                    <Switch
                      checked={notifications.emailNews}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailNews: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Marketing Updates</Label>
                    <Switch
                      checked={notifications.emailMarketing}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailMarketing: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  SMS Notifications
                </h4>
                
                <div className="space-y-3 ml-6">
                  <div className="flex items-center justify-between">
                    <Label>Trading Alerts</Label>
                    <Switch
                      checked={notifications.smsTrading}
                      onCheckedChange={(checked) => setNotifications({...notifications, smsTrading: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Security Alerts</Label>
                    <Switch
                      checked={notifications.smsSecurity}
                      onCheckedChange={(checked) => setNotifications({...notifications, smsSecurity: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Other Notifications
                </h4>
                
                <div className="space-y-3 ml-6">
                  <div className="flex items-center justify-between">
                    <Label>Push Notifications</Label>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Price Alerts</Label>
                    <Switch
                      checked={notifications.priceAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, priceAlerts: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Trading Preferences
              </CardTitle>
              <CardDescription>
                Customize your trading interface and default settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Order Type</Label>
                  <Select 
                    value={trading.defaultOrderType} 
                    onValueChange={(value: 'market' | 'limit') => setTrading({...trading, defaultOrderType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Fiat Currency</Label>
                  <Select 
                    value={trading.defaultFiatCurrency} 
                    onValueChange={(value) => setTrading({...trading, defaultFiatCurrency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <Select 
                    value={trading.chartType} 
                    onValueChange={(value: 'candlestick' | 'line' | 'area') => setTrading({...trading, chartType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candlestick">Candlestick</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Auto Refresh (seconds)</Label>
                  <Select 
                    value={trading.autoRefreshInterval.toString()} 
                    onValueChange={(value) => setTrading({...trading, autoRefreshInterval: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 second</SelectItem>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirm Before Trading</Label>
                    <p className="text-sm text-muted-foreground">
                      Show confirmation dialog before placing orders
                    </p>
                  </div>
                  <Switch
                    checked={trading.confirmBeforeTrading}
                    onCheckedChange={(checked) => setTrading({...trading, confirmBeforeTrading: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Advanced Interface</Label>
                    <p className="text-sm text-muted-foreground">
                      Show advanced trading tools and indicators
                    </p>
                  </div>
                  <Switch
                    checked={trading.showAdvancedInterface}
                    onCheckedChange={(checked) => setTrading({...trading, showAdvancedInterface: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound when orders are filled or price targets are hit
                    </p>
                  </div>
                  <Switch
                    checked={trading.soundAlerts}
                    onCheckedChange={(checked) => setTrading({...trading, soundAlerts: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveTrading} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Trading Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}