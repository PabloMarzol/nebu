import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Users, 
  Filter,
  Search,
  Plus,
  Eye,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Calendar,
  Tag,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SupportDashboardProps {
  onCreateTicket?: () => void;
  onViewTicket?: (ticketNumber: string) => void;
  showAdminView?: boolean;
}

export function SupportDashboard({ onCreateTicket, onViewTicket, showAdminView = false }: SupportDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch support statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/support/admin/stats'],
    enabled: showAdminView,
  });

  // Fetch tickets with filters
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['/api/support/admin/tickets', filterStatus, filterPriority, currentPage],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPriority !== 'all') params.append('priority', filterPriority);
      params.append('page', currentPage.toString());
      params.append('limit', '10');
      
      return fetch(`/api/support/admin/tickets?${params}`).then(res => res.json());
    },
    enabled: showAdminView,
  });

  // Mock user tickets for non-admin view
  const mockUserTickets = [
    {
      id: 1,
      ticketNumber: 'TKT-2025-001',
      subject: 'Unable to withdraw funds',
      status: 'open',
      priority: 'high',
      category: 'Account Issues',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastResponseAt: null,
    },
    {
      id: 2,
      ticketNumber: 'TKT-2025-002',
      subject: 'Trading fee calculation question',
      status: 'resolved',
      priority: 'medium',
      category: 'Trading',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastResponseAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  const tickets = showAdminView ? (ticketsData?.tickets || []) : mockUserTickets;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Eye className="w-4 h-4" />;
      case 'in_progress': return <RefreshCw className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <AlertCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            {showAdminView ? 'Support Dashboard' : 'My Support Tickets'}
          </h1>
          <p className="text-slate-300 mt-1">
            {showAdminView 
              ? 'Manage and respond to customer support tickets'
              : 'View and manage your support requests'
            }
          </p>
        </div>
        <Button
          onClick={onCreateTicket}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Admin Statistics */}
      {showAdminView && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Tickets</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Open Tickets</p>
                  <p className="text-2xl font-bold text-white">{stats.open}</p>
                </div>
                <Eye className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-600/20 to-green-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold text-white">{stats.avgResponseTime}m</p>
                </div>
                <Clock className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setFilterStatus('all');
                setFilterPriority('all');
                setSearchQuery('');
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Support Tickets ({filteredTickets.length})</span>
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              {isLoading ? 'Loading...' : `${filteredTickets.length} tickets`}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
                <p className="text-slate-300 mb-4">
                  {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Try adjusting your filters or search terms.'
                    : 'No support tickets have been created yet.'
                  }
                </p>
                <Button
                  onClick={onCreateTicket}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </div>
            ) : (
              filteredTickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => onViewTicket?.(ticket.ticketNumber)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{ticket.subject}</h3>
                        <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={`${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-300">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          #{ticket.ticketNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                        </span>
                        {ticket.lastResponseAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last response {formatDistanceToNow(new Date(ticket.lastResponseAt), { addSuffix: true })}
                          </span>
                        )}
                        {showAdminView && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {ticket.userName}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                          {ticket.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {showAdminView && ticketsData && ticketsData.total > 10 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Previous
            </Button>
            <span className="text-slate-300 px-4">
              Page {currentPage} of {Math.ceil(ticketsData.total / 10)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(ticketsData.total / 10)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}