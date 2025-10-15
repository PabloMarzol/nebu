import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Zap,
  Target,
  Settings,
  Upload,
  Download
} from "lucide-react";

interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  category: 'welcome' | 'verification' | 'support' | 'marketing' | 'alert';
  variables: string[];
}

interface SMSCampaign {
  id: string;
  name: string;
  template: string;
  recipients: number;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  deliveryRate: number;
  openRate: number;
}

interface SMSContact {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked';
  tags: string[];
  lastContact: string;
}

export function TextMessagingSystem() {
  const [activeTab, setActiveTab] = useState("compose");
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<SMSCampaign[]>([]);
  const [contacts, setContacts] = useState<SMSContact[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

  useEffect(() => {
    loadSMSData();
  }, []);

  const loadSMSData = async () => {
    try {
      // Load templates
      const templatesResponse = await fetch('/api/sms/templates');
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData.templates || []);
      }

      // Load campaigns
      const campaignsResponse = await fetch('/api/sms/campaigns');
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      // Load contacts
      const contactsResponse = await fetch('/api/enhanced-crm/customers');
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        const smsContacts = contactsData.map((customer: any) => ({
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          phone: customer.phone || '',
          status: customer.status === 'active' ? 'active' : 'inactive',
          tags: customer.tradingPairs || [],
          lastContact: customer.lastActive
        })).filter((contact: any) => contact.phone);
        setContacts(smsContacts);
      }
    } catch (error) {
      console.error('Failed to load SMS data:', error);
    }
  };

  const sendSMS = async () => {
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          recipients: selectedContacts,
          template: selectedTemplate,
          bulk: isBulkMode
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Message sent successfully to ${result.sent} recipients`);
        setMessageContent("");
        setSelectedContacts([]);
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
      alert('Error sending message');
    }
  };

  const createTemplate = async (template: Partial<SMSTemplate>) => {
    try {
      const response = await fetch('/api/sms/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplates(prev => [...prev, newTemplate]);
      }
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'sending': return 'bg-blue-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Text Messaging System</h2>
          <p className="text-gray-400">SMS campaigns and customer communication</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-400 border-green-400">
            Twilio Connected
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-400 border-blue-400 hover:bg-blue-600/20"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="compose" className="text-gray-300 data-[state=active]:text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-gray-300 data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-gray-300 data-[state=active]:text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="contacts" className="text-gray-300 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Compose Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bulk-mode"
                    checked={isBulkMode}
                    onCheckedChange={setIsBulkMode}
                  />
                  <Label htmlFor="bulk-mode" className="text-gray-300">
                    Bulk messaging mode
                  </Label>
                </div>

                <div>
                  <Label className="text-gray-300">Template (Optional)</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Message Content</Label>
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message here..."
                    className="bg-gray-700 border-gray-600 text-white h-32"
                    maxLength={160}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>{messageContent.length}/160 characters</span>
                    <span>{Math.ceil(messageContent.length / 160)} SMS</span>
                  </div>
                </div>

                <Button
                  onClick={sendSMS}
                  disabled={!messageContent || selectedContacts.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message ({selectedContacts.length} recipients)
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Recipients</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search contacts..."
                      className="bg-gray-700 border-gray-600 text-white w-48"
                    />
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedContacts.includes(contact.id)
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => {
                        if (selectedContacts.includes(contact.id)) {
                          setSelectedContacts(prev => prev.filter(id => id !== contact.id));
                        } else {
                          setSelectedContacts(prev => [...prev, contact.id]);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white text-sm">{contact.name}</h4>
                          <p className="text-gray-400 text-xs">{contact.phone}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            contact.status === 'active' ? 'border-green-500 text-green-400' : 'border-gray-500 text-gray-400'
                          } text-xs`}
                        >
                          {contact.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">SMS Campaigns</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{campaign.name}</h4>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(campaign.status)} text-white border-0 text-xs`}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Recipients:</span>
                      <span className="text-white">{campaign.recipients.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Rate:</span>
                      <span className="text-green-400">{campaign.deliveryRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Rate:</span>
                      <span className="text-blue-400">{campaign.openRate}%</span>
                    </div>
                    {campaign.scheduledAt && (
                      <div className="flex justify-between">
                        <span>Scheduled:</span>
                        <span className="text-yellow-400">{formatDate(campaign.scheduledAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">SMS Templates</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{template.content}</p>
                  {template.variables.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Variables:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setMessageContent(template.content);
                        setActiveTab("compose");
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">SMS Contacts</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{contact.name}</h4>
                        <p className="text-gray-400 text-sm">{contact.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <Badge
                        variant="outline"
                        className={`${
                          contact.status === 'active' 
                            ? 'border-green-500 text-green-400' 
                            : 'border-gray-500 text-gray-400'
                        }`}
                      >
                        {contact.status}
                      </Badge>
                      
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Messages Sent</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">12,847</p>
                <p className="text-green-400 text-sm">+23% this month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">Delivery Rate</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">98.5%</p>
                <p className="text-green-400 text-sm">+0.3% improvement</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Active Contacts</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">3,456</p>
                <p className="text-green-400 text-sm">+156 new contacts</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-white">Response Rate</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">24.3%</p>
                <p className="text-green-400 text-sm">+2.1% increase</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}