import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Plus, MessageSquare, Clock, AlertCircle, CheckCircle, User, Calendar, Tag } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  customer: {
    name: string;
    email: string;
    id: string;
  };
  status: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  messages: TicketMessage[];
  tags: string[];
}

interface TicketMessage {
  id: string;
  content: string;
  sender: string;
  senderType: 'customer' | 'agent';
  timestamp: string;
  attachments?: string[];
}

export function SupportTicketing() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    // Mock data - in production, this would be an API call
    const mockTickets: Ticket[] = [
      {
        id: "TK-001",
        subject: "Unable to complete KYC verification",
        customer: {
          name: "John Smith",
          email: "john.smith@nebulaxexchange.io",
          id: "1"
        },
        status: "open",
        priority: "high",
        category: "KYC/Verification",
        assignedTo: "Sarah Chen",
        createdAt: "2025-01-09T10:30:00Z",
        updatedAt: "2025-01-09T10:30:00Z",
        description: "Customer unable to upload documents due to format error",
        messages: [
          {
            id: "1",
            content: "I'm trying to upload my passport for KYC verification but keep getting a format error. I've tried both JPG and PNG formats.",
            sender: "John Smith",
            senderType: "customer",
            timestamp: "2025-01-09T10:30:00Z"
          }
        ],
        tags: ["kyc", "upload-issue"]
      },
      {
        id: "TK-002",
        subject: "Trading fee calculation question",
        customer: {
          name: "Maria Garcia",
          email: "maria.garcia@nebulaxexchange.io",
          id: "2"
        },
        status: "in-progress",
        priority: "medium",
        category: "Trading",
        assignedTo: "Mike Johnson",
        createdAt: "2025-01-08T15:45:00Z",
        updatedAt: "2025-01-09T09:15:00Z",
        description: "Customer has questions about fee structure for large volume trades",
        messages: [
          {
            id: "2",
            content: "Can you explain how the fees are calculated for trades over $100,000? I want to understand the maker/taker fee structure.",
            sender: "Maria Garcia",
            senderType: "customer",
            timestamp: "2025-01-08T15:45:00Z"
          },
          {
            id: "3",
            content: "Hi Maria, thank you for reaching out. For trades over $100k, you qualify for our premium fee tier. Let me break down the structure for you...",
            sender: "Mike Johnson",
            senderType: "agent",
            timestamp: "2025-01-09T09:15:00Z"
          }
        ],
        tags: ["fees", "trading", "premium"]
      },
      {
        id: "TK-003",
        subject: "Withdrawal processing delay",
        customer: {
          name: "Ahmed Hassan",
          email: "ahmed.hassan@nebulaxexchange.io",
          id: "3"
        },
        status: "pending",
        priority: "urgent",
        category: "Withdrawals",
        assignedTo: "Sarah Chen",
        createdAt: "2025-01-07T08:20:00Z",
        updatedAt: "2025-01-08T14:30:00Z",
        description: "Large withdrawal has been pending for 24+ hours",
        messages: [
          {
            id: "4",
            content: "My withdrawal of $50,000 USDT has been pending for over 24 hours. Can you please check the status?",
            sender: "Ahmed Hassan",
            senderType: "customer",
            timestamp: "2025-01-07T08:20:00Z"
          },
          {
            id: "5",
            content: "I understand your concern. Large withdrawals require additional security verification. I've escalated this to our compliance team for priority review.",
            sender: "Sarah Chen",
            senderType: "agent",
            timestamp: "2025-01-08T14:30:00Z"
          }
        ],
        tags: ["withdrawal", "compliance", "urgent"]
      }
    ];
    
    setTickets(mockTickets);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'pending': return 'bg-orange-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getTicketStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length
    };
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const newMessage: TicketMessage = {
      id: Date.now().toString(),
      content: replyMessage,
      sender: "Current Agent",
      senderType: "agent",
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      updatedAt: new Date().toISOString()
    };

    setSelectedTicket(updatedTicket);
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setReplyMessage("");
  };

  const stats = getTicketStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Ticketing</h1>
          <p className="text-gray-400">Manage customer support requests and communications</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Customer Email</Label>
                <Input className="bg-gray-700 border-gray-600 text-white" placeholder="customer@nebulaxexchange.io" />
              </div>
              <div>
                <Label className="text-gray-300">Subject</Label>
                <Input className="bg-gray-700 border-gray-600 text-white" placeholder="Ticket subject" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Priority</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select priority" />
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
                  <Label className="text-gray-300">Category</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="kyc">KYC/Verification</SelectItem>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="withdrawals">Withdrawals</SelectItem>
                      <SelectItem value="deposits">Deposits</SelectItem>
                      <SelectItem value="technical">Technical Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea className="bg-gray-700 border-gray-600 text-white" rows={4} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Tickets</p>
                <p className="text-2xl font-semibold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Open Tickets</p>
                <p className="text-2xl font-semibold text-white">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-semibold text-white">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-600 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Urgent</p>
                <p className="text-2xl font-semibold text-white">{stats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition-colors"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{ticket.subject}</h3>
                        <p className="text-gray-400 text-sm">{ticket.id} • {ticket.customer.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                          {ticket.status}
                        </Badge>
                        <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                      <span>{ticket.assignedTo || 'Unassigned'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ticket.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">{selectedTicket.subject}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(selectedTicket.status)} text-white`}>
                    {selectedTicket.status}
                  </Badge>
                  <span className={`text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Customer</Label>
                  <p className="text-white">{selectedTicket.customer.name}</p>
                  <p className="text-gray-400 text-sm">{selectedTicket.customer.email}</p>
                </div>
                
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <p className="text-white">{selectedTicket.category}</p>
                </div>

                <div>
                  <Label className="text-gray-300">Assigned To</Label>
                  <p className="text-white">{selectedTicket.assignedTo || 'Unassigned'}</p>
                </div>

                <div>
                  <Label className="text-gray-300">Messages</Label>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded ${
                          message.senderType === 'customer' 
                            ? 'bg-blue-900/30 border-l-4 border-blue-500' 
                            : 'bg-green-900/30 border-l-4 border-green-500'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-white text-sm font-medium">{message.sender}</span>
                          <span className="text-gray-400 text-xs">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Reply</Label>
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="bg-gray-700 border-gray-600 text-white mt-2"
                    rows={3}
                  />
                  <Button 
                    onClick={handleSendReply}
                    className="bg-blue-600 hover:bg-blue-700 mt-2 w-full"
                    disabled={!replyMessage.trim()}
                  >
                    Send Reply
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Select a ticket to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}