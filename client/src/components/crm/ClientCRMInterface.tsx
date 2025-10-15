import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessageSquare, 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Search,
  Filter,
  Plus,
  Eye,
  Settings,
  HelpCircle,
  Shield,
  Bell,
  Mail,
  Phone
} from "lucide-react";
import { useWalletAuth } from "@/hooks/useWalletAuth";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "trading" | "account" | "technical" | "billing" | "compliance" | "general";
  createdAt: Date;
  updatedAt: Date;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  message: string;
  isFromSupport: boolean;
  createdAt: Date;
  author: string;
}

interface ClientProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  kycStatus: "pending" | "verified" | "rejected";
  accountTier: "basic" | "pro" | "premium";
  tradingLimits: {
    daily: number;
    monthly: number;
    current: number;
  };
  preferences: {
    notifications: boolean;
    twoFactorAuth: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
  };
}

// Mock data
const mockTickets: SupportTicket[] = [
  {
    id: "1",
    subject: "Unable to complete KYC verification",
    description: "I'm having trouble uploading my ID document for verification. The system keeps rejecting it.",
    status: "in-progress",
    priority: "medium",
    category: "compliance",
    createdAt: new Date("2025-01-12T10:30:00"),
    updatedAt: new Date("2025-01-12T14:45:00"),
    responses: [
      {
        id: "1",
        message: "Thank you for contacting us. Our compliance team is reviewing your submission. Please ensure your document is clear and all corners are visible.",
        isFromSupport: true,
        createdAt: new Date("2025-01-12T11:15:00"),
        author: "Support Team"
      }
    ]
  },
  {
    id: "2",
    subject: "Trading order execution delay",
    description: "My market order took longer than expected to execute. Can you help explain why?",
    status: "resolved",
    priority: "low",
    category: "trading",
    createdAt: new Date("2025-01-11T16:20:00"),
    updatedAt: new Date("2025-01-11T17:30:00"),
    responses: [
      {
        id: "2",
        message: "Market orders are executed at the best available price. During high volatility, there can be slight delays. Your order was executed successfully within normal parameters.",
        isFromSupport: true,
        createdAt: new Date("2025-01-11T17:30:00"),
        author: "Trading Support"
      }
    ]
  }
];

const mockProfile: ClientProfile = {
  id: "client-1",
  email: "client@nebulaxexchange.io",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  kycStatus: "verified",
  accountTier: "pro",
  tradingLimits: {
    daily: 50000,
    monthly: 500000,
    current: 25000
  },
  preferences: {
    notifications: true,
    twoFactorAuth: true,
    emailAlerts: true,
    smsAlerts: false
  }
};

export function ClientCRMInterface() {
  const { walletAddress, isAuthenticated } = useWalletAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [profile, setProfile] = useState<ClientProfile>(mockProfile);
  const [activeTab, setActiveTab] = useState("support");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    description: "",
    category: "general" as SupportTicket['category'],
    priority: "medium" as SupportTicket['priority']
  });

  const handleCreateTicket = () => {
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      subject: newTicketForm.subject,
      description: newTicketForm.description,
      status: "open",
      priority: newTicketForm.priority,
      category: newTicketForm.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: []
    };

    setTickets([newTicket, ...tickets]);
    setNewTicketForm({
      subject: "",
      description: "",
      category: "general",
      priority: "medium"
    });
  };

  const handleTicketResponse = (ticketId: string, message: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? {
            ...ticket,
            responses: [...ticket.responses, {
              id: Date.now().toString(),
              message,
              isFromSupport: false,
              createdAt: new Date(),
              author: `${profile.firstName} ${profile.lastName}`
            }],
            updatedAt: new Date()
          }
        : ticket
    ));
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case "open": return "bg-yellow-500";
      case "in-progress": return "bg-blue-500";
      case "resolved": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "urgent": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getKYCStatusColor = (status: ClientProfile['kycStatus']) => {
    switch (status) {
      case "verified": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Please log in to access your account and support center.
            </p>
            <Button className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Client Portal</h1>
              <p className="text-gray-400">
                Account management and support center
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="capitalize">{profile.accountTier}</span>
              </Badge>
              <Badge className={`${getKYCStatusColor(profile.kycStatus)} text-white`}>
                KYC {profile.kycStatus}
              </Badge>
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1">
                  {tickets.filter(t => t.status === "open" || t.status === "in-progress").length}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information Summary */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Account Status</p>
                  <p className="text-lg font-semibold text-green-400">Active</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Daily Limit Used</p>
                  <p className="text-lg font-semibold">{((profile.tradingLimits.current / profile.tradingLimits.daily) * 100).toFixed(1)}%</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {Math.round((profile.tradingLimits.current / profile.tradingLimits.daily) * 100)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Open Tickets</p>
                  <p className="text-lg font-semibold">
                    {tickets.filter(t => t.status === "open" || t.status === "in-progress").length}
                  </p>
                </div>
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">2FA Status</p>
                  <p className="text-lg font-semibold text-green-400">
                    {profile.preferences.twoFactorAuth ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <Shield className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-6">
            <TabsTrigger value="support">Support Center</TabsTrigger>
            <TabsTrigger value="profile">Account Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Support Tickets List */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Support Tickets</CardTitle>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedTicket(null)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Ticket
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tickets.map(ticket => (
                        <div 
                          key={ticket.id}
                          className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-white">{ticket.subject}</h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {ticket.description.substring(0, 100)}...
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={`${getStatusColor(ticket.status)} text-white text-xs`}>
                                  {ticket.status}
                                </Badge>
                                <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs`}>
                                  {ticket.priority}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {ticket.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {ticket.responses.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {ticket.responses.length} replies
                                </Badge>
                              )}
                              <Eye className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ticket Details or Create Form */}
              <div>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {selectedTicket ? "Ticket Details" : "Create New Ticket"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTicket ? (
                      <TicketDetailsView 
                        ticket={selectedTicket} 
                        onResponse={handleTicketResponse}
                      />
                    ) : (
                      <NewTicketForm 
                        form={newTicketForm}
                        onChange={setNewTicketForm}
                        onSubmit={handleCreateTicket}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Account Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">First Name</Label>
                    <Input 
                      value={profile.firstName} 
                      className="bg-gray-700 border-gray-600 text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-white">Last Name</Label>
                    <Input 
                      value={profile.lastName} 
                      className="bg-gray-700 border-gray-600 text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input 
                      value={profile.email} 
                      className="bg-gray-700 border-gray-600 text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-white">Phone</Label>
                    <Input 
                      value={profile.phone || ""} 
                      className="bg-gray-700 border-gray-600 text-white"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white">Account Tier</Label>
                  <div className="mt-2">
                    <Badge className="bg-blue-500 text-white capitalize">
                      {profile.accountTier}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-white">Trading Limits</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Limit:</span>
                      <span className="text-white">${profile.tradingLimits.daily.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Limit:</span>
                      <span className="text-white">${profile.tradingLimits.monthly.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Usage:</span>
                      <span className="text-white">${profile.tradingLimits.current.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-sm text-gray-400">Receive account updates via email</p>
                    </div>
                    <Badge className={profile.preferences.emailAlerts ? "bg-green-500" : "bg-gray-500"}>
                      {profile.preferences.emailAlerts ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">SMS Notifications</Label>
                      <p className="text-sm text-gray-400">Receive security alerts via SMS</p>
                    </div>
                    <Badge className={profile.preferences.smsAlerts ? "bg-green-500" : "bg-gray-500"}>
                      {profile.preferences.smsAlerts ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-400">Enhanced security for your account</p>
                    </div>
                    <Badge className={profile.preferences.twoFactorAuth ? "bg-green-500" : "bg-red-500"}>
                      {profile.preferences.twoFactorAuth ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TicketDetailsView({ ticket, onResponse }: { ticket: SupportTicket; onResponse: (ticketId: string, message: string) => void }) {
  const [replyMessage, setReplyMessage] = useState("");

  const handleSubmitReply = () => {
    if (replyMessage.trim()) {
      onResponse(ticket.id, replyMessage);
      setReplyMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-white">{ticket.subject}</h3>
        <p className="text-sm text-gray-400 mt-1">{ticket.description}</p>
        <div className="flex items-center space-x-2 mt-2">
          <Badge className={`${getStatusColor(ticket.status)} text-white text-xs`}>
            {ticket.status}
          </Badge>
          <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs`}>
            {ticket.priority}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium text-white">Conversation</h4>
        {ticket.responses.map(response => (
          <div 
            key={response.id}
            className={`p-3 rounded-lg ${
              response.isFromSupport ? "bg-blue-900/50 ml-4" : "bg-gray-700 mr-4"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{response.author}</span>
              <span className="text-xs text-gray-400">
                {response.createdAt.toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-300">{response.message}</p>
          </div>
        ))}
      </div>

      {ticket.status !== "closed" && (
        <div className="space-y-2">
          <Label className="text-white">Reply to ticket</Label>
          <Textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply..."
            className="bg-gray-700 border-gray-600 text-white"
            rows={3}
          />
          <Button 
            onClick={handleSubmitReply}
            disabled={!replyMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Reply
          </Button>
        </div>
      )}
    </div>
  );
}

function NewTicketForm({ form, onChange, onSubmit }: {
  form: any;
  onChange: (form: any) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Subject</Label>
        <Input
          value={form.subject}
          onChange={(e) => onChange({ ...form, subject: e.target.value })}
          placeholder="Brief description of your issue"
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      
      <div>
        <Label className="text-white">Category</Label>
        <Select value={form.category} onValueChange={(value) => onChange({ ...form, category: value })}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="trading">Trading</SelectItem>
            <SelectItem value="account">Account</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">Priority</Label>
        <Select value={form.priority} onValueChange={(value) => onChange({ ...form, priority: value })}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Detailed description of your issue"
          className="bg-gray-700 border-gray-600 text-white"
          rows={4}
        />
      </div>

      <Button 
        onClick={onSubmit}
        disabled={!form.subject.trim() || !form.description.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Create Ticket
      </Button>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "open": return "bg-yellow-500";
    case "in-progress": return "bg-blue-500";
    case "resolved": return "bg-green-500";
    case "closed": return "bg-gray-500";
    default: return "bg-gray-500";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "low": return "bg-green-500";
    case "medium": return "bg-yellow-500";
    case "high": return "bg-orange-500";
    case "urgent": return "bg-red-500";
    default: return "bg-gray-500";
  }
}