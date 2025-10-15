import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Target,
  DollarSign,
  Clock,
  Award,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  MessageSquare,
  Star
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: "website" | "referral" | "social" | "advertising" | "event" | "cold_outreach";
  stage: "new" | "contacted" | "qualified" | "demo_scheduled" | "proposal_sent" | "negotiation" | "closed_won" | "closed_lost";
  score: number;
  value: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  nextAction: string;
  nextActionDate: string;
  interests: string[];
  notes: string;
  conversionProbability: number;
  engagementLevel: "high" | "medium" | "low";
  timezone: string;
  preferredContact: "email" | "phone" | "video";
}

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
  conversionRate?: number;
  avgTimeInStage: number;
}

export default function LeadManagementCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState("pipeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "website",
    value: "",
    interests: [],
    notes: ""
  });

  // Sample data
  useEffect(() => {
    const sampleLeads: Lead[] = [
      {
        id: "lead-001",
        name: "Sarah Chen",
        email: "sarah.chen@techcorp.com",
        phone: "+1-555-0123",
        company: "TechCorp Industries",
        source: "website",
        stage: "qualified",
        score: 85,
        value: 250000,
        assignedTo: "Alex Rodriguez",
        createdAt: "2025-01-25",
        lastContact: "2025-01-29",
        nextAction: "Send technical proposal",
        nextActionDate: "2025-01-31",
        interests: ["Institutional Trading", "API Access", "High-Volume Trading"],
        notes: "CTO interested in API integration for algorithmic trading. Requires detailed technical documentation.",
        conversionProbability: 75,
        engagementLevel: "high",
        timezone: "PST",
        preferredContact: "email"
      },
      {
        id: "lead-002",
        name: "Marcus Williams",
        email: "m.williams@hedgefund.co",
        phone: "+1-555-0456",
        company: "Apex Hedge Fund",
        source: "referral",
        stage: "demo_scheduled",
        score: 92,
        value: 500000,
        assignedTo: "Jessica Martinez",
        createdAt: "2025-01-20",
        lastContact: "2025-01-28",
        nextAction: "Conduct platform demo",
        nextActionDate: "2025-01-30",
        interests: ["OTC Trading", "Institutional Features", "Multi-Asset Support"],
        notes: "Fund manager looking for OTC desk services. Very interested in large block trading capabilities.",
        conversionProbability: 85,
        engagementLevel: "high",
        timezone: "EST",
        preferredContact: "video"
      },
      {
        id: "lead-003",
        name: "Dr. Emily Foster",
        email: "emily.foster@university.edu",
        phone: "+1-555-0789",
        company: "State University Endowment",
        source: "event",
        stage: "proposal_sent",
        score: 78,
        value: 1000000,
        assignedTo: "David Kim",
        createdAt: "2025-01-15",
        lastContact: "2025-01-27",
        nextAction: "Follow up on proposal",
        nextActionDate: "2025-02-01",
        interests: ["Staking Services", "Treasury Management", "ESG Compliance"],
        notes: "Endowment fund interested in crypto staking for yield generation. Requires ESG compliance documentation.",
        conversionProbability: 65,
        engagementLevel: "medium",
        timezone: "CST",
        preferredContact: "email"
      },
      {
        id: "lead-004",
        name: "Ahmed Hassan",
        email: "ahmed@cryptofund.ae",
        phone: "+971-555-0321",
        company: "Gulf Crypto Fund",
        source: "advertising",
        stage: "negotiation",
        score: 88,
        value: 750000,
        assignedTo: "Sarah Johnson",
        createdAt: "2025-01-10",
        lastContact: "2025-01-29",
        nextAction: "Finalize contract terms",
        nextActionDate: "2025-02-02",
        interests: ["Islamic Finance Compliance", "Regional Support", "Multi-Currency"],
        notes: "Regional fund requiring Sharia-compliant trading solutions. Negotiating fee structure and compliance features.",
        conversionProbability: 80,
        engagementLevel: "high",
        timezone: "GST",
        preferredContact: "phone"
      },
      {
        id: "lead-005",
        name: "Lisa Thompson",
        email: "lisa@retailcorp.com",
        phone: "+1-555-0654",
        company: "RetailCorp Solutions",
        source: "social",
        stage: "new",
        score: 45,
        value: 50000,
        assignedTo: "Mike Davis",
        createdAt: "2025-01-28",
        lastContact: "2025-01-28",
        nextAction: "Initial qualification call",
        nextActionDate: "2025-01-31",
        interests: ["Retail Integration", "Payment Processing", "Basic Trading"],
        notes: "Retail company exploring crypto payment integration. Early stage inquiry.",
        conversionProbability: 35,
        engagementLevel: "low",
        timezone: "PST",
        preferredContact: "email"
      }
    ];
    setLeads(sampleLeads);
    setFilteredLeads(sampleLeads);
  }, []);

  // Filter leads based on search and filters
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter(lead => lead.stage === stageFilter);
    }

    if (sourceFilter !== "all") {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter(lead => lead.assignedTo === assigneeFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, stageFilter, sourceFilter, assigneeFilter]);

  // Calculate conversion funnel
  const conversionFunnel: ConversionFunnel[] = [
    { stage: "New", count: leads.filter(l => l.stage === "new").length, percentage: 100, avgTimeInStage: 2 },
    { stage: "Contacted", count: leads.filter(l => l.stage === "contacted").length, percentage: 85, conversionRate: 85, avgTimeInStage: 3 },
    { stage: "Qualified", count: leads.filter(l => l.stage === "qualified").length, percentage: 65, conversionRate: 76, avgTimeInStage: 5 },
    { stage: "Demo", count: leads.filter(l => l.stage === "demo_scheduled").length, percentage: 45, conversionRate: 69, avgTimeInStage: 4 },
    { stage: "Proposal", count: leads.filter(l => l.stage === "proposal_sent").length, percentage: 30, conversionRate: 67, avgTimeInStage: 7 },
    { stage: "Negotiation", count: leads.filter(l => l.stage === "negotiation").length, percentage: 20, conversionRate: 67, avgTimeInStage: 10 },
    { stage: "Closed Won", count: leads.filter(l => l.stage === "closed_won").length, percentage: 15, conversionRate: 75, avgTimeInStage: 0 }
  ];

  const getStageColor = (stage: string) => {
    const colors = {
      new: "bg-blue-500",
      contacted: "bg-yellow-500",
      qualified: "bg-orange-500",
      demo_scheduled: "bg-purple-500",
      proposal_sent: "bg-pink-500",
      negotiation: "bg-red-500",
      closed_won: "bg-green-500",
      closed_lost: "bg-gray-500"
    };
    return colors[stage as keyof typeof colors] || "bg-gray-500";
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      website: "🌐",
      referral: "👥",
      social: "📱",
      advertising: "📢",
      event: "🎪",
      cold_outreach: "📞"
    };
    return icons[source as keyof typeof icons] || "📋";
  };

  const getPriorityBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-red-500 text-white">Hot</Badge>;
    if (score >= 60) return <Badge className="bg-orange-500 text-white">Warm</Badge>;
    return <Badge className="bg-blue-500 text-white">Cold</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lead Management CRM</h1>
          <p className="text-muted-foreground">Comprehensive lead tracking and conversion optimization</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowLeadModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">15.2%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+2.1%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl font-bold">$2.55M</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+18%</span>
              <span className="text-muted-foreground ml-1">this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Deal Size</p>
                <p className="text-2xl font-bold">$510K</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-500">-3%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">Lead Pipeline</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="analytics">Lead Analytics</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="demo_scheduled">Demo</SelectItem>
                    <SelectItem value="proposal_sent">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="advertising">Advertising</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          <div className="grid gap-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-lg">{lead.name}</h3>
                          <p className="text-muted-foreground">{lead.company}</p>
                        </div>
                        {getPriorityBadge(lead.score)}
                        <Badge variant="outline">
                          {getSourceIcon(lead.source)} {lead.source}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          <p className="text-sm">{lead.email}</p>
                          <p className="text-sm">{lead.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pipeline Value</p>
                          <p className="text-lg font-semibold">${lead.value.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Probability: {lead.conversionProbability}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Action</p>
                          <p className="text-sm">{lead.nextAction}</p>
                          <p className="text-sm text-orange-500">{lead.nextActionDate}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {lead.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStageColor(lead.stage)} text-white`}>
                          {lead.stage.replace("_", " ")}
                        </Badge>
                        <div className="text-right text-sm text-muted-foreground">
                          Score: {lead.score}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => setSelectedLead(lead)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{stage.stage}</span>
                        <Badge variant="outline">{stage.count} leads</Badge>
                        {stage.conversionRate && (
                          <Badge variant="secondary">
                            {stage.conversionRate}% conversion
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg: {stage.avgTimeInStage} days
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      >
                        {stage.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["website", "referral", "advertising", "event", "social"].map((source) => {
                    const count = leads.filter(l => l.source === source).length;
                    const percentage = (count / leads.length) * 100;
                    return (
                      <div key={source} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{getSourceIcon(source)}</span>
                          <span className="capitalize">{source}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Alex Rodriguez", "Jessica Martinez", "David Kim", "Sarah Johnson", "Mike Davis"].map((assignee) => {
                    const assignedLeads = leads.filter(l => l.assignedTo === assignee);
                    const closedWon = assignedLeads.filter(l => l.stage === "closed_won").length;
                    const conversionRate = assignedLeads.length > 0 ? (closedWon / assignedLeads.length) * 100 : 0;
                    return (
                      <div key={assignee} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{assignee}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignedLeads.length} leads assigned
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{conversionRate.toFixed(1)}%</p>
                          <p className="text-sm text-muted-foreground">conversion</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2 hours ago", action: "Demo completed", lead: "Marcus Williams", type: "meeting" },
                  { time: "4 hours ago", action: "Proposal sent", lead: "Dr. Emily Foster", type: "document" },
                  { time: "6 hours ago", action: "Follow-up call", lead: "Ahmed Hassan", type: "call" },
                  { time: "1 day ago", action: "New lead created", lead: "Lisa Thompson", type: "lead" },
                  { time: "1 day ago", action: "Qualification completed", lead: "Sarah Chen", type: "qualification" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === "meeting" && <Calendar className="w-5 h-5 text-blue-500" />}
                      {activity.type === "document" && <FileText className="w-5 h-5 text-green-500" />}
                      {activity.type === "call" && <Phone className="w-5 h-5 text-orange-500" />}
                      {activity.type === "lead" && <UserPlus className="w-5 h-5 text-purple-500" />}
                      {activity.type === "qualification" && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.lead}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-background border border-border rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Lead Details: {selectedLead.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedLead(null)}>
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedLead.name}</p>
                    <p><strong>Company:</strong> {selectedLead.company}</p>
                    <p><strong>Email:</strong> {selectedLead.email}</p>
                    <p><strong>Phone:</strong> {selectedLead.phone}</p>
                    <p><strong>Timezone:</strong> {selectedLead.timezone}</p>
                    <p><strong>Preferred Contact:</strong> {selectedLead.preferredContact}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Lead Details</h3>
                  <div className="space-y-2">
                    <p><strong>Source:</strong> {selectedLead.source}</p>
                    <p><strong>Stage:</strong> {selectedLead.stage}</p>
                    <p><strong>Score:</strong> {selectedLead.score}/100</p>
                    <p><strong>Value:</strong> ${selectedLead.value.toLocaleString()}</p>
                    <p><strong>Probability:</strong> {selectedLead.conversionProbability}%</p>
                    <p><strong>Assigned To:</strong> {selectedLead.assignedTo}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Notes</h3>
                <p className="text-muted-foreground">{selectedLead.notes}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Next Action</h3>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p><strong>Action:</strong> {selectedLead.nextAction}</p>
                  <p><strong>Date:</strong> {selectedLead.nextActionDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}