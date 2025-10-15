import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Bell, 
  Shield, 
  MessageSquare,
  Settings,
  TrendingUp
} from "lucide-react";
import SMSSettings from "@/components/notifications/sms-settings";
import PriceAlerts from "@/components/notifications/price-alerts";

export default function SMSNotificationsPage() {
  // Mock user data - in real app, get from auth context
  const [userPhone, setUserPhone] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            SMS Notifications
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Stay connected with real-time SMS alerts for trading and security
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              Powered by Twilio
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Encrypted
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
              <Bell className="w-4 h-4 mr-2" />
              Real-time Delivery
            </Badge>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700/50 text-center">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Price Alerts</h3>
              <p className="text-sm text-gray-400">Get notified when your favorite cryptocurrencies hit target prices</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 text-center">
            <CardContent className="p-6">
              <Smartphone className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Phone Verification</h3>
              <p className="text-sm text-gray-400">Verify your phone number for secure KYC compliance</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 text-center">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Two-Factor Auth</h3>
              <p className="text-sm text-gray-400">Enhanced security with SMS-based 2FA codes</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 text-center">
            <CardContent className="p-6">
              <Bell className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Trade Notifications</h3>
              <p className="text-sm text-gray-400">Instant alerts for order fills and trade executions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              SMS Settings
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Price Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SMSSettings 
              userPhone={userPhone}
              isPhoneVerified={isPhoneVerified}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <PriceAlerts 
              phoneNumber={userPhone}
              isPhoneVerified={isPhoneVerified}
            />
          </TabsContent>
        </Tabs>

        {/* SMS Benefits */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 mt-8">
          <CardHeader>
            <CardTitle className="text-center">Why Use SMS Notifications?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Instant Delivery</h4>
                <p className="text-sm text-gray-300">
                  Receive alerts within seconds of market movements or security events
                </p>
              </div>
              <div>
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Enhanced Security</h4>
                <p className="text-sm text-gray-300">
                  Add an extra layer of protection with SMS-based two-factor authentication
                </p>
              </div>
              <div>
                <Bell className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Never Miss Important Events</h4>
                <p className="text-sm text-gray-300">
                  Stay informed about price movements, trades, and account activity 24/7
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}