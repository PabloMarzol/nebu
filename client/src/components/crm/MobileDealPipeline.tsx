import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Calendar, 
  User, 
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Edit,
  MessageSquare,
  Phone,
  Mail,
  Target,
  AlertCircle
} from "lucide-react";

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
}

interface MobileDealPipelineProps {
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onStageMove: (dealId: string, newStage: string) => void;
  onAddDeal: () => void;
}

const PIPELINE_STAGES = [
  { key: 'lead', label: 'New Lead', color: 'bg-gray-500', textColor: 'text-gray-100' },
  { key: 'qualified', label: 'Qualified', color: 'bg-blue-500', textColor: 'text-blue-100' },
  { key: 'proposal', label: 'Proposal', color: 'bg-yellow-500', textColor: 'text-yellow-100' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-500', textColor: 'text-orange-100' },
  { key: 'closed-won', label: 'Closed Won', color: 'bg-green-500', textColor: 'text-green-100' },
  { key: 'closed-lost', label: 'Closed Lost', color: 'bg-red-500', textColor: 'text-red-100' }
];

export function MobileDealPipeline({ deals, onDealClick, onStageMove, onAddDeal }: MobileDealPipelineProps) {
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStageInfo = (stage: string) => {
    return PIPELINE_STAGES.find(s => s.key === stage) || PIPELINE_STAGES[0];
  };

  const filteredDeals = selectedStage === 'all' 
    ? deals 
    : deals.filter(deal => deal.stage === selectedStage);

  const stageStats = PIPELINE_STAGES.map(stage => ({
    ...stage,
    count: deals.filter(deal => deal.stage === stage.key).length,
    value: deals
      .filter(deal => deal.stage === stage.key)
      .reduce((sum, deal) => sum + deal.value, 0)
  }));

  return (
    <div className="space-y-4">
      {/* Stage Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={selectedStage === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStage('all')}
          className="whitespace-nowrap"
        >
          All Deals ({deals.length})
        </Button>
        {PIPELINE_STAGES.map(stage => (
          <Button
            key={stage.key}
            variant={selectedStage === stage.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStage(stage.key)}
            className="whitespace-nowrap"
          >
            {stage.label} ({stageStats.find(s => s.key === stage.key)?.count || 0})
          </Button>
        ))}
      </div>

      {/* Pipeline Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Pipeline Overview</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddDeal}
              className="text-blue-400 border-blue-400 hover:bg-blue-600/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stageStats.map(stage => (
              <div key={stage.key} className="text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${stage.color} ${stage.textColor}`}>
                  {stage.label}
                </div>
                <div className="mt-2">
                  <div className="text-lg font-bold text-white">{stage.count}</div>
                  <div className="text-sm text-gray-400">{formatCurrency(stage.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deal Cards */}
      <div className="space-y-3">
        {filteredDeals.map(deal => {
          const stageInfo = getStageInfo(deal.stage);
          const isUrgent = new Date(deal.expectedCloseDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          
          return (
            <Card 
              key={deal.id}
              className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-200"
              onClick={() => onDealClick(deal)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {deal.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2">{deal.client}</p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`${stageInfo.color} ${stageInfo.textColor} border-0 text-xs`}
                      >
                        {stageInfo.label}
                      </Badge>
                      {isUrgent && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(deal.value)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {deal.probability}% probability
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs font-semibold text-white">{deal.probability}%</span>
                  </div>
                  <Progress value={deal.probability} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>Close: {formatDate(deal.expectedCloseDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    <span>{deal.assignedTo}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{deal.source}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(deal.lastActivity)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle call action
                      }}
                      className="text-blue-400 hover:bg-blue-600/20"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle email action
                      }}
                      className="text-green-400 hover:bg-green-600/20"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle message action
                      }}
                      className="text-purple-400 hover:bg-purple-600/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit action
                      }}
                      className="text-gray-400 hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDeals.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No deals found</h3>
            <p className="text-gray-400 mb-4">
              {selectedStage === 'all' 
                ? "Start by adding your first deal to the pipeline"
                : `No deals in ${getStageInfo(selectedStage).label} stage`}
            </p>
            <Button
              onClick={onAddDeal}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}