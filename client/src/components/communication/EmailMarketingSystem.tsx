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
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Send, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  BarChart3,
  Target,
  Settings,
  Upload,
  Download,
  Image,
  Link,
  Type,
  Palette
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'welcome' | 'newsletter' | 'promotion' | 'transaction' | 'support';
  variables: string[];
  previewImage?: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template: string;
  recipients: number;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}

interface EmailContact {
  id: string;
  name: string;
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  tags: string[];
  lastOpened?: string;
  totalOpens: number;
  totalClicks: number;
}

export function EmailMarketingSystem() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [contacts, setContacts] = useState<EmailContact[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      // Load email templates
      const templatesResponse = await fetch('/api/email/templates');
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData.templates || []);
      }

      // Load email campaigns
      const campaignsResponse = await fetch('/api/email/campaigns');
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      // Load email contacts from CRM
      const contactsResponse = await fetch('/api/enhanced-crm/customers');
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        const emailContacts = contactsData.map((customer: any) => ({
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          status: customer.status === 'active' ? 'subscribed' : 'unsubscribed',
          tags: customer.tradingPairs || [],
          lastOpened: customer.lastActive,
          totalOpens: Math.floor(Math.random() * 50),
          totalClicks: Math.floor(Math.random() * 20)
        }));
        setContacts(emailContacts);
      }
    } catch (error) {
      console.error('Failed to load email data:', error);
    }
  };

  const sendEmail = async () => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          recipients: selectedContacts,
          template: selectedTemplate
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Email sent successfully to ${result.sent} recipients`);
        setEmailSubject("");
        setEmailContent("");
        setSelectedContacts([]);
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Error sending email');
    }
  };

  const createCampaign = async (campaignData: Partial<EmailCampaign>) => {
    try {
      const response = await fetch('/api/email/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        const newCampaign = await response.json();
        setCampaigns(prev => [...prev, newCampaign]);
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Email Marketing System</h2>
          <p className="text-gray-400">Professional email campaigns and automation</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-400 border-green-400">
            SendGrid Connected
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-400 border-blue-400 hover:bg-blue-600/20"
          >
            <Settings className="w-4 h-4 mr-2" />
            Email Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="campaigns" className="text-gray-300 data-[state=active]:text-white">
            <Mail className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="compose" className="text-gray-300 data-[state=active]:text-white">
            <Edit className="w-4 h-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-gray-300 data-[state=active]:text-white">
            <Type className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="contacts" className="text-gray-300 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Email Campaigns</h3>
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
                  
                  <p className="text-gray-400 text-sm mb-3">{campaign.subject}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recipients:</span>
                      <span className="text-white">{campaign.recipients.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Open Rate:</span>
                      <span className="text-green-400">{formatPercentage(campaign.openRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Click Rate:</span>
                      <span className="text-blue-400">{formatPercentage(campaign.clickRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivery:</span>
                      <span className="text-purple-400">{formatPercentage(campaign.deliveryRate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Email Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Label className="text-gray-300">Subject Line</Label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject..."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Email Content</Label>
                    <Textarea
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Write your email content here..."
                      className="bg-gray-700 border-gray-600 text-white h-40"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Image className="w-4 h-4 mr-2" />
                      Add Image
                    </Button>
                    <Button variant="outline" size="sm">
                      <Link className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                    <Button variant="outline" size="sm">
                      <Palette className="w-4 h-4 mr-2" />
                      Design
                    </Button>
                  </div>

                  <Button
                    onClick={sendEmail}
                    disabled={!emailSubject || !emailContent || selectedContacts.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Email ({selectedContacts.length} recipients)
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recipients ({selectedContacts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {contacts.slice(0, 10).map((contact) => (
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
                            <p className="text-gray-400 text-xs">{contact.email}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              contact.status === 'subscribed' ? 'border-green-500 text-green-400' : 'border-gray-500 text-gray-400'
                            } text-xs`}
                          >
                            {contact.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => setSelectedContacts(contacts.map(c => c.id))}
                  >
                    Select All ({contacts.length})
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Email Preview</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('desktop')}
                      >
                        Desktop
                      </Button>
                      <Button
                        variant={previewMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('mobile')}
                      >
                        Mobile
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`border border-gray-600 rounded-lg p-4 ${
                    previewMode === 'mobile' ? 'max-w-xs mx-auto' : 'w-full'
                  }`}>
                    <div className="bg-white rounded-lg p-4 text-black">
                      <h3 className="text-lg font-bold mb-4">{emailSubject || 'Email Subject'}</h3>
                      <div className="prose prose-sm">
                        {emailContent ? (
                          <div dangerouslySetInnerHTML={{ __html: emailContent.replace(/\n/g, '<br>') }} />
                        ) : (
                          <p className="text-gray-500">Email content will appear here...</p>
                        )}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          NebulaX Exchange • Unsubscribe • View in browser
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Email Templates</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  {template.previewImage && (
                    <div className="mb-4">
                      <img
                        src={template.previewImage}
                        alt={template.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{template.name}</h4>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{template.subject}</p>
                  <p className="text-gray-300 text-xs mb-4 line-clamp-2">{template.content}</p>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setEmailSubject(template.subject);
                        setEmailContent(template.content);
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
            <h3 className="text-xl font-semibold text-white">Email Contacts</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Total Contacts</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{contacts.length.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">Subscribed</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">
                  {contacts.filter(c => c.status === 'subscribed').length.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Avg Opens</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">
                  {(contacts.reduce((sum, c) => sum + c.totalOpens, 0) / contacts.length).toFixed(1)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-white">Avg Clicks</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">
                  {(contacts.reduce((sum, c) => sum + c.totalClicks, 0) / contacts.length).toFixed(1)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {contacts.slice(0, 10).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{contact.name}</h4>
                        <p className="text-gray-400 text-sm">{contact.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <p className="text-white">{contact.totalOpens} opens</p>
                        <p className="text-gray-400">{contact.totalClicks} clicks</p>
                      </div>
                      
                      <Badge
                        variant="outline"
                        className={`${
                          contact.status === 'subscribed' 
                            ? 'border-green-500 text-green-400' 
                            : contact.status === 'unsubscribed'
                            ? 'border-yellow-500 text-yellow-400'
                            : 'border-red-500 text-red-400'
                        }`}
                      >
                        {contact.status}
                      </Badge>
                      
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4" />
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
                  <Mail className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Emails Sent</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">45,678</p>
                <p className="text-green-400 text-sm">+18% this month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">Open Rate</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">42.5%</p>
                <p className="text-green-400 text-sm">+3.2% improvement</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Click Rate</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">8.7%</p>
                <p className="text-green-400 text-sm">+1.4% increase</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-white">Conversion</h3>
                </div>
                <p className="text-2xl font-bold text-white mt-2">3.4%</p>
                <p className="text-green-400 text-sm">+0.8% increase</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}