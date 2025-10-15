import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Eye,
  ArrowLeft,
  Loader2,
  UserCheck,
  Calendar,
  Tag
} from 'lucide-react';

const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface SupportTicketViewProps {
  ticketNumber: string;
  onBack?: () => void;
}

export function SupportTicketView({ ticketNumber, onBack }: SupportTicketViewProps) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  });

  // Fetch ticket details
  const { data: ticketData, isLoading, error } = useQuery({
    queryKey: ['/api/support/tickets', ticketNumber],
    queryFn: () => apiRequest(`/api/support/tickets/${ticketNumber}`),
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds
  });

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: (data: MessageFormData) => apiRequest(`/api/support/tickets/${ticketData?.ticket?.id}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        senderId: 'user-123', // Would come from auth context
        senderName: ticketData?.ticket?.userName || 'User',
        senderType: 'user'
      }),
    }),
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your message has been added to the ticket.",
        className: "bg-gradient-to-r from-green-600 to-blue-600 text-white border-none"
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets', ticketNumber] });
    },
    onError: () => {
      toast({
        title: "Failed to Send Message",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: MessageFormData) => {
    addMessageMutation.mutate(data);
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
          <p className="text-slate-300">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Ticket Not Found</h3>
        <p className="text-slate-300 mb-4">
          The ticket number "{ticketNumber}" could not be found or you don't have permission to view it.
        </p>
        {onBack && (
          <Button onClick={onBack} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        )}
      </div>
    );
  }

  const { ticket, messages } = ticketData;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              Ticket #{ticket.ticketNumber}
            </h1>
            <p className="text-slate-300">{ticket.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`${autoRefresh ? 'text-green-400' : 'text-slate-400'} hover:text-white`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
        </div>
      </div>

      {/* Ticket Details */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Ticket Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Status</h3>
              <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1 w-fit`}>
                {getStatusIcon(ticket.status)}
                {ticket.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Priority</h3>
              <Badge className={`${getPriorityColor(ticket.priority)} w-fit`}>
                {ticket.priority.toUpperCase()}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Category</h3>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                <Tag className="w-3 h-3 mr-1" />
                {ticket.category}
              </Badge>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Created</h3>
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-slate-400" />
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Last Response</h3>
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-4 h-4 text-slate-400" />
                {ticket.lastResponseAt 
                  ? formatDistanceToNow(new Date(ticket.lastResponseAt), { addSuffix: true })
                  : 'No responses yet'
                }
              </div>
            </div>
          </div>

          {ticket.assignedTo && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Assigned Agent</h3>
              <div className="flex items-center gap-2 text-white">
                <UserCheck className="w-4 h-4 text-blue-400" />
                {ticket.assignedTo}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Description</h3>
            <div className="bg-slate-800/50 rounded-lg p-4 text-white">
              {ticket.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversation ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet. Start the conversation below!</p>
              </div>
            ) : (
              messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.senderType === 'agent' && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {message.senderName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-xs md:max-w-md ${message.senderType === 'user' ? 'order-first' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {message.senderName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {message.senderType === 'user' ? 'You' : 'Agent'}
                      </Badge>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.senderType === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-white'
                    }`}>
                      {message.message}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  {message.senderType === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-green-600 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Message */}
      {ticket.status !== 'closed' && (
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">Add Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          {...field}
                          className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={addMessageMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {addMessageMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}