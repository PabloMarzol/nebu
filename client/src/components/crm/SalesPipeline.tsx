import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, DollarSign, Calendar, User, Target, TrendingUp, ArrowRight } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  client: string;
  email: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  lastActivity: string;
  source: string;
  assignedTo: string;
  notes?: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  date: string;
  user: string;
}

const PIPELINE_STAGES = [
  { key: 'lead', label: 'New Lead', color: 'bg-gray-500' },
  { key: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
  { key: 'proposal', label: 'Proposal', color: 'bg-yellow-500' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { key: 'closed-won', label: 'Closed Won', color: 'bg-green-500' },
  { key: 'closed-lost', label: 'Closed Lost', color: 'bg-red-500' }
];

export function SalesPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterStage, setFilterStage] = useState("all");
  const [filterUser, setFilterUser] = useState("all");

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    // Mock data - in production, this would be an API call
    const mockDeals: Deal[] = [
      {
        id: "1",
        title: "Enterprise Trading Platform",
        client: "Tech Corp Ltd",
        email: "cto@techcorp.com",
        value: 250000,
        stage: 'proposal',
        probability: 75,
        expectedCloseDate: "2025-02-15",
        lastActivity: "2025-01-08",
        source: "Website",
        assignedTo: "John Smith",
        notes: "Strong interest in institutional features",
        activities: [
          {
            id: "1",
            type: "meeting",
            description: "Product demo presentation",
            date: "2025-01-08",
            user: "John Smith"
          }
        ]
      },
      {
        id: "2",
        title: "Crypto Fund Management",
        client: "Investment Partners",
        email: "partners@invest.com",
        value: 500000,
        stage: 'negotiation',
        probability: 85,
        expectedCloseDate: "2025-01-25",
        lastActivity: "2025-01-09",
        source: "Referral",
        assignedTo: "Sarah Chen",
        activities: [
          {
            id: "2",
            type: "call",
            description: "Contract terms discussion",
            date: "2025-01-09",
            user: "Sarah Chen"
          }
        ]
      },
      {
        id: "3",
        title: "White Label Solution",
        client: "Regional Bank",
        email: "digital@bank.com",
        value: 750000,
        stage: 'qualified',
        probability: 60,
        expectedCloseDate: "2025-03-01",
        lastActivity: "2025-01-07",
        source: "Cold Outreach",
        assignedTo: "Mike Johnson",
        activities: []
      }
    ];
    
    setDeals(mockDeals);
  };

  const getStageConfig = (stage: string) => {
    return PIPELINE_STAGES.find(s => s.key === stage) || PIPELINE_STAGES[0];
  };

  const getDealsByStage = (stage: string) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getTotalValue = () => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const getWeightedValue = () => {
    return deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  };

  const filteredDeals = deals.filter(deal => {
    const matchesStage = filterStage === "all" || deal.stage === filterStage;
    const matchesUser = filterUser === "all" || deal.assignedTo === filterUser;
    return matchesStage && matchesUser;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Pipeline</h1>
          <p className="text-gray-400">Track deals and manage sales opportunities</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Deal Title</Label>
                <Input className="bg-gray-700 border-gray-600 text-white" placeholder="Enter deal title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Client Name</Label>
                  <Input className="bg-gray-700 border-gray-600 text-white" placeholder="Client name" />
                </div>
                <div>
                  <Label className="text-gray-300">Email</Label>
                  <Input type="email" className="bg-gray-700 border-gray-600 text-white" placeholder="client@nebulaxexchange.io" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Deal Value</Label>
                  <Input type="number" className="bg-gray-700 border-gray-600 text-white" placeholder="0" />
                </div>
                <div>
                  <Label className="text-gray-300">Expected Close Date</Label>
                  <Input type="date" className="bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Stage</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {PIPELINE_STAGES.slice(0, -2).map(stage => (
                        <SelectItem key={stage.key} value={stage.key}>{stage.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Source</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Notes</Label>
                <Textarea className="bg-gray-700 border-gray-600 text-white" rows={3} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Deal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Deals</p>
                <p className="text-2xl font-semibold text-white">{deals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Pipeline Value</p>
                <p className="text-2xl font-semibold text-white">${getTotalValue().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Weighted Value</p>
                <p className="text-2xl font-semibold text-white">${Math.round(getWeightedValue()).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Avg Deal Size</p>
                <p className="text-2xl font-semibold text-white">
                  ${deals.length > 0 ? Math.round(getTotalValue() / deals.length).toLocaleString() : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Stages</SelectItem>
            {PIPELINE_STAGES.map(stage => (
              <SelectItem key={stage.key} value={stage.key}>{stage.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="All Users" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="John Smith">John Smith</SelectItem>
            <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
            <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {PIPELINE_STAGES.map((stage, index) => (
          <div key={stage.key} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{stage.label}</h3>
              <Badge className={`${stage.color} text-white`}>
                {getDealsByStage(stage.key).length}
              </Badge>
            </div>
            <div className="space-y-3 min-h-[400px]">
              {getDealsByStage(stage.key).map((deal) => (
                <Card
                  key={deal.id}
                  className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={() => setSelectedDeal(deal)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium text-white mb-2">{deal.title}</h4>
                    <p className="text-sm text-gray-400 mb-2">{deal.client}</p>
                    <p className="text-green-400 font-semibold mb-2">${deal.value.toLocaleString()}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Close: {deal.expectedCloseDate}</span>
                        <span>{deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} className="h-1" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{deal.assignedTo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Deal Details Modal */}
      {selectedDeal && (
        <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedDeal.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Client</Label>
                  <p className="text-white">{selectedDeal.client}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Email</Label>
                  <p className="text-white">{selectedDeal.email}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Deal Value</Label>
                  <p className="text-white text-xl">${selectedDeal.value.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Probability</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedDeal.probability} className="flex-1" />
                    <span className="text-white">{selectedDeal.probability}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Expected Close</Label>
                  <p className="text-white">{selectedDeal.expectedCloseDate}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Assigned To</Label>
                  <p className="text-white">{selectedDeal.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Source</Label>
                  <p className="text-white">{selectedDeal.source}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Stage</Label>
                  <Badge className={`${getStageConfig(selectedDeal.stage).color} text-white`}>
                    {getStageConfig(selectedDeal.stage).label}
                  </Badge>
                </div>
              </div>
              
              {selectedDeal.notes && (
                <div>
                  <Label className="text-gray-300">Notes</Label>
                  <p className="text-white bg-gray-700 p-3 rounded mt-1">{selectedDeal.notes}</p>
                </div>
              )}

              <div>
                <Label className="text-gray-300">Recent Activities</Label>
                <div className="space-y-2 mt-2">
                  {selectedDeal.activities.length > 0 ? (
                    selectedDeal.activities.map((activity) => (
                      <div key={activity.id} className="bg-gray-700 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <p className="text-white">{activity.description}</p>
                          <Badge variant="outline" className="border-blue-500 text-blue-400">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {activity.date} by {activity.user}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No activities recorded</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  Add Activity
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Deal
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Move Stage
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}