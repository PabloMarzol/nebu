import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Mail, Send, Users, Code, TrendingUp, Info, HelpCircle, ShoppingCart, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'support' | 'trading' | 'marketing' | 'development';
}

const EMAIL_DEPARTMENTS = [
  { 
    value: 'accounts@nebulaxexchange.io', 
    label: 'Account Services',
    icon: <Users className="w-4 h-4" />,
    description: 'Account setup, verification, and management'
  },
  { 
    value: 'developers@nebulaxexchange.io', 
    label: 'Developer Support',
    icon: <Code className="w-4 h-4" />,
    description: 'API documentation, technical integration help'
  },
  { 
    value: 'traders@nebulaxexchange.io', 
    label: 'Trading Support',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Trading questions, market analysis, order help'
  },
  { 
    value: 'info@nebulaxexchange.io', 
    label: 'General Information',
    icon: <Info className="w-4 h-4" />,
    description: 'Platform information and general inquiries'
  },
  { 
    value: 'enquiries@nebulaxexchange.io', 
    label: 'Business Enquiries',
    icon: <HelpCircle className="w-4 h-4" />,
    description: 'Partnership and business opportunities'
  },
  { 
    value: 'support@nebulaxexchange.io', 
    label: 'Technical Support',
    icon: <HelpCircle className="w-4 h-4" />,
    description: 'Technical issues and platform support'
  },
  { 
    value: 'sales@nebulaxexchange.io', 
    label: 'Sales Team',
    icon: <ShoppingCart className="w-4 h-4" />,
    description: 'Premium features and institutional services'
  }
];

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Account Verification Request',
    subject: 'Account Verification Assistance Required',
    body: 'Hello NebulaX Team,\n\nI need assistance with my account verification process. Please help me complete the KYC requirements.\n\nAccount Email: [Your Email]\nIssue: [Describe your verification issue]\n\nThank you for your assistance.',
    category: 'support'
  },
  {
    id: '2',
    name: 'Trading Question',
    subject: 'Trading Platform Inquiry',
    body: 'Dear Trading Team,\n\nI have a question about the trading platform functionality:\n\n[Your Question Here]\n\nI would appreciate your guidance on this matter.\n\nBest regards',
    category: 'trading'
  },
  {
    id: '3',
    name: 'API Integration Help',
    subject: 'API Integration Support Request',
    body: 'Hello Developer Team,\n\nI am integrating with the NebulaX API and need assistance with:\n\n[Specific API Issue]\n\nEndpoint: [API Endpoint]\nError: [Error Message]\n\nPlease provide guidance.\n\nThanks',
    category: 'development'
  },
  {
    id: '4',
    name: 'Partnership Inquiry',
    subject: 'Business Partnership Opportunity',
    body: 'Dear NebulaX Business Team,\n\nI am interested in exploring a partnership opportunity with NebulaX.\n\nCompany: [Your Company]\nProposal: [Brief Description]\n\nI would like to schedule a meeting to discuss this further.\n\nBest regards',
    category: 'marketing'
  }
];

export default function EmailMessaging() {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [emailNotifications, setEmailNotifications] = useState({
    priceAlerts: true,
    tradeConfirmations: true,
    securityAlerts: true,
    marketNews: false,
    promotions: false
  });

  const { toast } = useToast();

  const sendEmailMutation = useMutation({
    mutationFn: async (data: { to: string; subject: string; message: string }) => {
      return apiRequest('/api/email/send', data);
    },
    onSuccess: () => {
      toast({
        title: "Email Sent Successfully",
        description: "Your message has been delivered to the NebulaX team.",
      });
      setSubject('');
      setMessage('');
    },
    onError: (error: any) => {
      toast({
        title: "Email Failed",
        description: error.message || "Failed to send email message.",
        variant: "destructive",
      });
    }
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (notifications: typeof emailNotifications) => {
      return apiRequest('/api/email/notifications', notifications);
    },
    onSuccess: () => {
      toast({
        title: "Preferences Updated",
        description: "Email notification settings saved successfully.",
      });
    }
  });

  const handleSendEmail = () => {
    if (!selectedDepartment || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    sendEmailMutation.mutate({
      to: selectedDepartment,
      subject,
      message
    });
  };

  const loadTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    setMessage(template.body);
    
    // Auto-select appropriate department
    if (template.category === 'support') setSelectedDepartment('support@nebulaxexchange.io');
    if (template.category === 'trading') setSelectedDepartment('traders@nebulaxexchange.io');
    if (template.category === 'development') setSelectedDepartment('developers@nebulaxexchange.io');
    if (template.category === 'marketing') setSelectedDepartment('enquiries@nebulaxexchange.io');
  };

  const updateNotificationSetting = (key: keyof typeof emailNotifications) => {
    const updated = { ...emailNotifications, [key]: !emailNotifications[key] };
    setEmailNotifications(updated);
    updateNotificationsMutation.mutate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Email Composer */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-purple-500" />
            <span>Contact NebulaX Team</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Department Selection */}
          <div className="space-y-2">
            <Label>Select Department</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose the right department for your inquiry" />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    <div className="flex items-center space-x-2">
                      {dept.icon}
                      <div>
                        <div className="font-medium">{dept.label}</div>
                        <div className="text-xs text-muted-foreground">{dept.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="grid grid-cols-2 gap-2">
              {EMAIL_TEMPLATES.map((template) => (
                <Button
                  key={template.id}
                  size="sm"
                  variant="outline"
                  onClick={() => loadTemplate(template)}
                  className="text-left h-auto p-3 justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.subject}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message to the NebulaX team..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>

          <Button
            onClick={handleSendEmail}
            disabled={sendEmailMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Send className="w-4 h-4 mr-2" />
            {sendEmailMutation.isPending ? 'Sending...' : 'Send Email'}
          </Button>
        </CardContent>
      </Card>

      {/* Email Notification Preferences */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-500" />
            <span>Email Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            priceAlerts: 'Price Alerts',
            tradeConfirmations: 'Trade Confirmations',
            securityAlerts: 'Security Alerts',
            marketNews: 'Market News & Analysis',
            promotions: 'Promotions & Updates'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-sm text-muted-foreground">
                  {key === 'priceAlerts' && 'Get notified when price targets are reached'}
                  {key === 'tradeConfirmations' && 'Confirmation emails for all trades'}
                  {key === 'securityAlerts' && 'Important security notifications'}
                  {key === 'marketNews' && 'Daily market analysis and news'}
                  {key === 'promotions' && 'New features and promotional offers'}
                </div>
              </div>
              <Switch
                checked={emailNotifications[key as keyof typeof emailNotifications]}
                onCheckedChange={() => updateNotificationSetting(key as keyof typeof emailNotifications)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Contact Actions */}
      <Card className="glass-enhanced border-purple-500/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col space-y-2"
              onClick={() => window.location.href = 'mailto:support@nebulaxexchange.io?subject=Urgent Trading Support'}
            >
              <HelpCircle className="w-6 h-6 text-purple-500" />
              <div className="text-center">
                <div className="font-medium">Urgent Support</div>
                <div className="text-xs text-muted-foreground">24/7 trading assistance</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col space-y-2"
              onClick={() => window.location.href = 'mailto:sales@nebulaxexchange.io?subject=Premium Services Inquiry'}
            >
              <ShoppingCart className="w-6 h-6 text-green-500" />
              <div className="text-center">
                <div className="font-medium">Premium Services</div>
                <div className="text-xs text-muted-foreground">Institutional trading</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col space-y-2"
              onClick={() => window.location.href = 'mailto:developers@nebulaxexchange.io?subject=API Integration Help'}
            >
              <Code className="w-6 h-6 text-blue-500" />
              <div className="text-center">
                <div className="font-medium">Developer Support</div>
                <div className="text-xs text-muted-foreground">API & integration help</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}