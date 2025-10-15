import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  MessageSquare, 
  Users, 
  Clock, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Eye,
  Send,
  Paperclip,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Timer,
  BarChart3,
  TrendingUp,
  Phone,
  Mail,
  MessageCircle,
  Headphones,
  Calendar,
  Activity
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SupportTicket {
  id: number;
  ticketNumber: string;
  userId?: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  assignedTo?: string;
  tags: string[];
  slaDeadline?: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  satisfaction?: number;
  createdAt: string;
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
    kycLevel: number;
  };
}

interface SupportMessage {
  id: number;
  ticketId: number;
  senderId: string;
  senderType: 'user' | 'admin';
  message: string;
  attachments: any[];
  isInternal: boolean;
  createdAt: string;
}

export default function AdminSupportCRM() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  // Support Tickets Data
  const { data: supportTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['/api/admin-panel/support/tickets', { 
      status: statusFilter, 
      priority: priorityFilter, 
      category: categoryFilter 
    }],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Selected Ticket Messages
  const { data: ticketMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/admin-panel/support/tickets', selectedTicket, 'messages'],
    enabled: !!selectedTicket
  });

  // User Activity Data (for 360° view)
  const { data: userActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['/api/admin-panel/support/users', 'selected-user', 'activity'],
    enabled: activeTab === 'user-360'
  });

  // Create Support Message Mutation
  const createMessageMutation = useMutation({
    mutationFn: async ({ ticketId, message, isInternal }: { ticketId: number; message: string; isInternal: boolean }) => {
      return apiRequest(`/api/admin-panel/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          senderId: 'admin-user',
          senderType: 'admin',
          message,
          isInternal,
          attachments: []
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-panel/support/tickets'] });
      setNewMessage('');
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      case 'in_progress': return 'bg-blue-500';
      case 'waiting_user': return 'bg-yellow-500';
      case 'open': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <AlertTriangle className="h-4 w-4" />;
      case 'trading': return <TrendingUp className="h-4 w-4" />;
      case 'kyc': return <UserCheck className="h-4 w-4" />;
      case 'payment': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleSendMessage = () => {
    if (selectedTicket && newMessage.trim()) {
      createMessageMutation.mutate({
        ticketId: selectedTicket,
        message: newMessage,
        isInternal: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Headphones className="h-10 w-10 text-purple-400" />
            Customer Support & CRM
          </h1>
          <p className="text-lg text-gray-300">
            Manage support tickets, customer communications, and user analytics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Open Tickets</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(supportTickets) ? supportTickets.filter(t => t.status === 'open').length : 0}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Urgent Priority</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(supportTickets) ? supportTickets.filter(t => t.priority === 'urgent').length : 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Response Time</p>
                  <p className="text-2xl font-bold text-white">2.4h</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Satisfaction</p>
                  <p className="text-2xl font-bold text-white">4.8/5</p>
                </div>
                <Star className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="user-360">User 360° View</TabsTrigger>
            <TabsTrigger value="analytics">SLA & Analytics</TabsTrigger>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          </TabsList>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tickets List */}
              <div className="lg:col-span-2">
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Support Tickets Queue
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage and respond to customer support requests
                    </CardDescription>
                    
                    {/* Filters */}
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search tickets..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-black/30 border-purple-500/30 text-white w-64"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32 bg-black/30 border-purple-500/30 text-white">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="waiting_user">Waiting User</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-32 bg-black/30 border-purple-500/30 text-white">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-32 bg-black/30 border-purple-500/30 text-white">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="trading">Trading</SelectItem>
                          <SelectItem value="kyc">KYC</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {ticketsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Array.isArray(supportTickets) && supportTickets.map((ticket: SupportTicket) => (
                          <div 
                            key={ticket.id}
                            className={`p-4 bg-black/20 rounded-lg border cursor-pointer transition-colors ${
                              selectedTicket === ticket.id ? 'border-purple-500' : 'border-gray-600 hover:border-gray-500'
                            }`}
                            onClick={() => setSelectedTicket(ticket.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {getCategoryIcon(ticket.category)}
                                  <span className="text-sm text-gray-400">#{ticket.ticketNumber}</span>
                                </div>
                                <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs`}>
                                  {ticket.priority}
                                </Badge>
                                <Badge className={`${getStatusColor(ticket.status)} text-white text-xs`}>
                                  {ticket.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-white font-medium mb-1">{ticket.subject}</h3>
                            <p className="text-gray-300 text-sm line-clamp-2">{ticket.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  {ticket.user?.email || 'Anonymous'}
                                </span>
                                {ticket.user?.kycLevel && (
                                  <Badge variant="outline" className="text-xs">
                                    KYC L{ticket.user.kycLevel}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {ticket.assignedTo && (
                                  <Badge variant="outline" className="text-xs">
                                    {ticket.assignedTo}
                                  </Badge>
                                )}
                                {ticket.slaDeadline && (
                                  <div className="flex items-center gap-1 text-xs text-orange-400">
                                    <Timer className="h-3 w-3" />
                                    {new Date(ticket.slaDeadline).toLocaleTimeString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Ticket Details & Messages */}
              <div className="lg:col-span-1">
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Ticket Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTicket ? (
                      <div className="space-y-4">
                        {/* Ticket Messages */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {messagesLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                            </div>
                          ) : (
                            Array.isArray(ticketMessages) && ticketMessages.map((message: SupportMessage) => (
                              <div 
                                key={message.id}
                                className={`p-3 rounded-lg ${
                                  message.senderType === 'admin' 
                                    ? 'bg-purple-500/20 border-l-4 border-purple-500' 
                                    : 'bg-blue-500/20 border-l-4 border-blue-500'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-white">
                                    {message.senderType === 'admin' ? 'Support Agent' : 'Customer'}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {new Date(message.createdAt).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-sm">{message.message}</p>
                                {message.isInternal && (
                                  <Badge variant="outline" className="text-xs mt-2">
                                    Internal Note
                                  </Badge>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Message Input */}
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Type your response..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="bg-black/30 border-purple-500/30 text-white min-h-24"
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleSendMessage}
                              className="flex-1 bg-purple-600 hover:bg-purple-700"
                              disabled={!newMessage.trim()}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </Button>
                            <Button variant="outline" size="sm">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full text-green-400 border-green-500">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Resolved
                          </Button>
                          <Button variant="outline" className="w-full text-blue-400 border-blue-500">
                            <Users className="h-4 w-4 mr-2" />
                            Escalate to Manager
                          </Button>
                          <Button variant="outline" className="w-full text-gray-400 border-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Follow-up
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Select a ticket to view details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* User 360° View Tab */}
          <TabsContent value="user-360" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User 360° Dashboard
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Complete view of user trading, wallet, support, and compliance activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* User Profile */}
                  <Card className="bg-black/20 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">User Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">John Smith</p>
                          <p className="text-sm text-gray-400">john.smith@example.com</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">KYC Level:</span>
                          <Badge className="bg-green-500 text-white">Level 2</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Account Tier:</span>
                          <span className="text-white">Premium</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Registration:</span>
                          <span className="text-white">Jan 15, 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Login:</span>
                          <span className="text-white">2 hours ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trading Activity */}
                  <Card className="bg-black/20 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Trading Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Volume:</span>
                          <span className="text-white">$847,392</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Trades:</span>
                          <span className="text-white">1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg Trade Size:</span>
                          <span className="text-white">$679</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">P&L (30d):</span>
                          <span className="text-green-400">+$12,456</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fees Paid:</span>
                          <span className="text-white">$1,247</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Support History */}
                  <Card className="bg-black/20 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Support History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Tickets:</span>
                          <span className="text-white">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Resolved:</span>
                          <span className="text-green-400">7</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Open:</span>
                          <span className="text-yellow-400">1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg Resolution:</span>
                          <span className="text-white">4.2 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Satisfaction:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Timeline */}
                <Card className="bg-black/20 border-gray-600 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Recent Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { time: '2 hours ago', action: 'Logged in from Chrome (IP: 192.168.1.100)', type: 'security' },
                        { time: '3 hours ago', action: 'Executed market buy: 0.5 BTC @ $45,230', type: 'trading' },
                        { time: '1 day ago', action: 'Withdrew $5,000 to bank account ****1234', type: 'financial' },
                        { time: '2 days ago', action: 'Updated phone number (+1-555-0123)', type: 'profile' },
                        { time: '3 days ago', action: 'Created support ticket #TKT-4567', type: 'support' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'security' ? 'bg-red-500' :
                            activity.type === 'trading' ? 'bg-green-500' :
                            activity.type === 'financial' ? 'bg-blue-500' :
                            activity.type === 'profile' ? 'bg-purple-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <div>
                            <p className="text-white text-sm">{activity.action}</p>
                            <p className="text-gray-400 text-xs">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SLA & Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SLA Metrics */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    SLA Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">First Response Time</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold">1.2h</span>
                        <span className="text-sm text-gray-400">(Target: 2h)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Resolution Time</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold">4.8h</span>
                        <span className="text-sm text-gray-400">(Target: 8h)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">SLA Compliance</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold">96.4%</span>
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Customer Satisfaction</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold">4.8/5</span>
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Performance */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Agent Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Johnson', tickets: 47, rating: 4.9, responseTime: '45m' },
                      { name: 'Mike Chen', tickets: 42, rating: 4.8, responseTime: '52m' },
                      { name: 'Emma Wilson', tickets: 38, rating: 4.7, responseTime: '1.1h' },
                      { name: 'David Brown', tickets: 35, rating: 4.6, responseTime: '1.3h' }
                    ].map((agent, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{agent.name}</p>
                            <p className="text-sm text-gray-400">{agent.tickets} tickets resolved</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-white text-sm">{agent.rating}</span>
                          </div>
                          <p className="text-xs text-gray-400">{agent.responseTime} avg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge-base" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Knowledge Base & Templates
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Quick response templates and knowledge articles
                </CardDescription>
                <Button className="w-fit bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Article
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'KYC Verification Process', category: 'Account', views: 1247, updated: '2 days ago' },
                    { title: 'Trading Fee Structure', category: 'Trading', views: 986, updated: '1 week ago' },
                    { title: 'Withdrawal Processing Times', category: 'Payments', views: 834, updated: '3 days ago' },
                    { title: 'API Rate Limits', category: 'Technical', views: 567, updated: '1 day ago' },
                    { title: 'Security Best Practices', category: 'Security', views: 445, updated: '5 days ago' },
                    { title: 'Mobile App Troubleshooting', category: 'Technical', views: 323, updated: '1 week ago' }
                  ].map((article, index) => (
                    <Card key={index} className="bg-black/20 border-gray-600 hover:border-purple-500 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-gray-400">{article.updated}</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">{article.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Eye className="h-3 w-3" />
                            {article.views} views
                          </div>
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}