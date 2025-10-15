import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Upload,
  X,
  Search,
  FileText,
  HelpCircle
} from 'lucide-react';

const ticketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  userEmail: z.string().email('Please enter a valid email'),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface SupportTicketFormProps {
  onTicketCreated?: (ticket: any) => void;
  showKnowledgeBase?: boolean;
}

export function SupportTicketForm({ onTicketCreated, showKnowledgeBase = true }: SupportTicketFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      description: '',
      category: '',
      priority: 'medium',
      userEmail: '',
      userName: '',
    },
  });

  // Fallback categories
  const defaultCategories = [
    { id: 'trading', name: 'Trading Issues' },
    { id: 'account', name: 'Account & KYC' },
    { id: 'technical', name: 'Technical Support' },
    { id: 'billing', name: 'Billing & Payments' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'general', name: 'General Inquiry' }
  ];

  const availableCategories = defaultCategories;

  // Search knowledge base (simplified for now)
  const knowledgeArticles: any[] = [];
  const searchLoading = false;

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data: TicketFormData) => {
      const response = await apiRequest('POST', '/api/support/tickets', {
        ...data,
        supportEmail: 'support@nebulaxexchange.io'
      });
      return await response.json();
    },
    onSuccess: (ticket) => {
      setSubmittedTicket(ticket);
      toast({
        title: "Ticket Created Successfully", 
        description: `Your ticket ${ticket.ticketNumber} has been created. We'll respond within 24 hours.`,
        className: "bg-gradient-to-r from-green-600 to-blue-600 text-white border-none"
      });
      form.reset();
      onTicketCreated?.(ticket);
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Ticket",
        description: "Please try again or contact support directly.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: TicketFormData) => {
    createTicketMutation.mutate(data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleArticleClick = (article: any) => {
    console.log('Article clicked:', article);
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    urgent: 'bg-red-100 text-red-800 border-red-300'
  };

  // Show success screen if ticket was submitted
  if (submittedTicket) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-8">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Thank You for Contacting Support!
            </h1>
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-400 mb-3">
                Your Ticket Has Been Created Successfully
              </h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Ticket Number:</span>
                  <span className="text-white font-mono font-bold text-lg">{submittedTicket.ticketNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Priority:</span>
                  <Badge className={`capitalize ${submittedTicket.priority === 'urgent' ? 'bg-red-600' : submittedTicket.priority === 'high' ? 'bg-orange-600' : submittedTicket.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'}`}>
                    {submittedTicket.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Status:</span>
                  <Badge className="bg-blue-600">Open</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Created:</span>
                  <span className="text-white">{new Date(submittedTicket.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 text-center">
              <p className="text-slate-300 text-lg">
                Our support team has been notified and will respond to your inquiry within <strong className="text-white">24 hours</strong>.
              </p>
              <p className="text-slate-400">
                You will receive an email confirmation at your registered email address.
              </p>
              <div className="flex gap-4 justify-center mt-6">
                <Button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setShowForm(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Create Another Ticket
                </Button>
                <Button
                  onClick={() => setSubmittedTicket(null)}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Back to Support Center
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          <MessageSquare className="inline w-8 h-8 mr-3 text-blue-400" />
          Support Center
        </h1>
        <p className="text-slate-300">
          Get help with your account, trading, or technical issues
        </p>
      </div>

      {/* Knowledge Base Search */}
      {showKnowledgeBase && (
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search for answers to common questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white pr-10"
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
            </div>

            {searchLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span className="ml-2 text-slate-300">Searching...</span>
              </div>
            )}

            {knowledgeArticles.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold">Found {knowledgeArticles.length} articles:</h3>
                {knowledgeArticles.map((article: any) => (
                  <div
                    key={article.id}
                    className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{article.title}</h4>
                        <p className="text-slate-300 text-sm mt-1 line-clamp-2">
                          {article.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {article.viewCount} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Ticket Button */}
      {!showForm && (
        <div className="text-center">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Create Support Ticket
          </Button>
          <p className="text-slate-400 mt-2">
            Can't find what you're looking for? Create a support ticket and we'll help you directly.
          </p>
        </div>
      )}

      {/* Ticket Form */}
      {showForm && (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Create Support Ticket</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            className="bg-slate-800 border-slate-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            {...field} 
                            className="bg-slate-800 border-slate-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Category</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a category</option>
                            {availableCategories.map((category: any) => (
                              <option key={category.id} value={category.name} className="bg-slate-800 text-white">
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Priority</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select priority</option>
                            <option value="low" className="bg-slate-800 text-white">🟢 Low</option>
                            <option value="medium" className="bg-slate-800 text-white">🟡 Medium</option>
                            <option value="high" className="bg-slate-800 text-white">🟠 High</option>
                            <option value="urgent" className="bg-slate-800 text-white">🔴 Urgent</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief description of your issue" 
                          {...field} 
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide detailed information about your issue..." 
                          {...field} 
                          className="bg-slate-800 border-slate-600 text-white min-h-[120px]"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        Include any error messages, steps to reproduce, or relevant details
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-slate-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-300">Click to upload files</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports: Images, PDFs, Documents (max 10MB each)
                      </p>
                    </label>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-800 p-2 rounded">
                          <span className="text-sm text-white truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={createTicketMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex-1"
                  >
                    {createTicketMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Ticket...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Create Ticket
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
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