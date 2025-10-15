import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, Phone, Bot } from "lucide-react";
import LiveChatBox from "@/components/communication/LiveChatBox";
import EmailMessaging from "@/components/communication/EmailMessaging";
import SMSMessaging from "@/components/communication/SMSMessaging";
import AIAssistant from "@/components/communication/AIAssistant";

export default function CommunicationCenter() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Communication Center
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with NebulaX through multiple channels for instant support
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-enhanced">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Live Chat</div>
            </CardContent>
          </Card>

          <Card className="glass-enhanced">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">7</div>
              <div className="text-sm text-muted-foreground">Email Departments</div>
            </CardContent>
          </Card>

          <Card className="glass-enhanced">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">Global</div>
              <div className="text-sm text-muted-foreground">SMS Support</div>
            </CardContent>
          </Card>

          <Card className="glass-enhanced">
            <CardContent className="p-6 text-center">
              <Bot className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">AI</div>
              <div className="text-sm text-muted-foreground">Smart Assistant</div>
            </CardContent>
          </Card>
        </div>

        {/* Communication Tabs */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Live Chat</span>
              <Badge className="bg-green-500/20 text-green-600 text-xs">Online</Badge>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>SMS</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <span>Live Chat Support</span>
                  <Badge className="bg-green-500/20 text-green-600">Available 24/7</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Click the chat button in the bottom right corner to start a live conversation with our support team.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average response time: &lt; 30 seconds
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <EmailMessaging />
          </TabsContent>

          <TabsContent value="sms">
            <SMSMessaging />
          </TabsContent>

          <TabsContent value="ai">
            <AIAssistant />
          </TabsContent>
        </Tabs>

        {/* Contact Information */}
        <Card className="glass-enhanced mt-8">
          <CardHeader>
            <CardTitle>NebulaX Contact Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { email: 'support@nebulaxexchange.io', dept: 'General Support', desc: '24/7 technical assistance' },
                { email: 'accounts@nebulaxexchange.io', dept: 'Account Services', desc: 'Account setup and verification' },
                { email: 'traders@nebulaxexchange.io', dept: 'Trading Support', desc: 'Trading questions and strategies' },
                { email: 'developers@nebulaxexchange.io', dept: 'Developer Support', desc: 'API and integration help' },
                { email: 'sales@nebulaxexchange.io', dept: 'Sales Team', desc: 'Premium and institutional services' },
                { email: 'enquiries@nebulaxexchange.io', dept: 'Business Enquiries', desc: 'Partnerships and opportunities' },
                { email: 'info@nebulaxexchange.io', dept: 'General Information', desc: 'Platform information and FAQs' }
              ].map((contact, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="font-medium text-sm">{contact.dept}</div>
                  <div className="text-purple-500 text-sm font-mono">{contact.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">{contact.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Chat Component */}
      <LiveChatBox />
    </div>
  );
}