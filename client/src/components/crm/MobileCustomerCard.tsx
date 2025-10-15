import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Edit,
  Eye,
  Star,
  DollarSign,
  Calendar,
  Activity
} from "lucide-react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  kycLevel: number;
  totalVolume: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  riskScore: number;
  accountTier: string;
  registrationDate: string;
  country: string;
  tradingPairs: string[];
  avatar?: string;
  notes?: string;
}

interface MobileCustomerCardProps {
  customer: Customer;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onMessage: (customer: Customer) => void;
}

export function MobileCustomerCard({ customer, onView, onEdit, onMessage }: MobileCustomerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'premium': return 'bg-purple-500';
      case 'gold': return 'bg-yellow-500';
      case 'silver': return 'bg-gray-400';
      case 'bronze': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

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
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={customer.avatar} />
              <AvatarFallback className="bg-blue-600 text-white">
                {customer.firstName[0]}{customer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white text-sm">
                {customer.firstName} {customer.lastName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(customer.status)} text-white border-0 text-xs`}
                >
                  {getStatusIcon(customer.status)}
                  <span className="ml-1 capitalize">{customer.status}</span>
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`${getTierColor(customer.accountTier)} text-white border-0 text-xs`}
                >
                  {customer.accountTier}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMessage(customer)}
              className="text-blue-400 hover:bg-blue-600/20"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:bg-gray-700"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="truncate">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{customer.country}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold text-green-400">
                {formatCurrency(customer.totalVolume)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(customer.registrationDate)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Activity className="w-4 h-4" />
              <span>Active {formatDate(customer.lastActive)}</span>
            </div>
          </div>
        </div>

        {/* KYC Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">KYC Level</span>
            <span className="text-sm font-semibold text-white">{customer.kycLevel}/3</span>
          </div>
          <Progress value={(customer.kycLevel / 3) * 100} className="h-2" />
        </div>

        {/* Risk Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Risk Score</span>
            <span className={`text-sm font-semibold ${
              customer.riskScore < 30 ? 'text-green-400' : 
              customer.riskScore < 70 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {customer.riskScore}/100
            </span>
          </div>
          <Progress 
            value={customer.riskScore} 
            className={`h-2 ${
              customer.riskScore < 30 ? 'bg-green-500' : 
              customer.riskScore < 70 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} 
          />
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-gray-700">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Trading Pairs</h4>
              <div className="flex flex-wrap gap-1">
                {customer.tradingPairs.map((pair, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {pair}
                  </Badge>
                ))}
              </div>
            </div>
            
            {customer.notes && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Notes</h4>
                <p className="text-sm text-gray-400">{customer.notes}</p>
              </div>
            )}
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(customer)}
                className="flex-1 text-blue-400 border-blue-400 hover:bg-blue-600/20"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(customer)}
                className="flex-1 text-green-400 border-green-400 hover:bg-green-600/20"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}