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
import { Search, Filter, Plus, Edit, Eye, Mail, Phone, DollarSign, Calendar, AlertCircle } from "lucide-react";

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
  notes?: string;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // In production, this would be an API call
      const mockCustomers: Customer[] = [
        {
          id: "1",
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@nebulaxexchange.io",
          phone: "+1234567890",
          kycLevel: 3,
          totalVolume: 125000,
          lastActive: "2025-01-09",
          status: "active",
          riskScore: 25,
          accountTier: "Premium",
          registrationDate: "2024-06-15",
          country: "United States",
          tradingPairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
          notes: "High-value customer with consistent trading activity"
        },
        {
          id: "2",
          firstName: "Sarah",
          lastName: "Chen",
          email: "sarah.chen@nebulaxexchange.io",
          phone: "+1987654321",
          kycLevel: 2,
          totalVolume: 45000,
          lastActive: "2025-01-08",
          status: "active",
          riskScore: 15,
          accountTier: "Pro",
          registrationDate: "2024-08-22",
          country: "Canada",
          tradingPairs: ["BTC/USDT", "ETH/BTC"],
          notes: "Regular trader, good compliance record"
        },
        {
          id: "3",
          firstName: "Ahmed",
          lastName: "Hassan",
          email: "ahmed.hassan@nebulaxexchange.io",
          kycLevel: 1,
          totalVolume: 8500,
          lastActive: "2025-01-07",
          status: "pending",
          riskScore: 45,
          accountTier: "Basic",
          registrationDate: "2024-12-01",
          country: "UAE",
          tradingPairs: ["BTC/USDT"],
          notes: "Pending additional verification documents"
        }
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
    const matchesTier = filterTier === "all" || customer.accountTier === filterTier;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 20) return 'text-green-600';
    if (score < 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Management</h1>
          <p className="text-gray-400">Manage customer accounts, KYC, and compliance</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">First Name</Label>
                  <Input className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Last Name</Label>
                  <Input className="bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input type="email" className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label className="text-gray-300">Phone</Label>
                <Input className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label className="text-gray-300">Country</Label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Customer
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
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Customers</p>
                <p className="text-2xl font-semibold text-white">{customers.length}</p>
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
                <p className="text-gray-400 text-sm">Total Volume</p>
                <p className="text-2xl font-semibold text-white">
                  ${customers.reduce((sum, c) => sum + c.totalVolume, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Pending KYC</p>
                <p className="text-2xl font-semibold text-white">
                  {customers.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Active Today</p>
                <p className="text-2xl font-semibold text-white">
                  {customers.filter(c => c.lastActive === "2025-01-09").length}
                </p>
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
              placeholder="Search customers..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterTier} onValueChange={setFilterTier}>
          <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="Basic">Basic</SelectItem>
            <SelectItem value="Pro">Pro</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customer List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading customers...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-300">Contact</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">KYC Level</th>
                    <th className="text-left py-3 px-4 text-gray-300">Volume</th>
                    <th className="text-left py-3 px-4 text-gray-300">Risk Score</th>
                    <th className="text-left py-3 px-4 text-gray-300">Last Active</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-gray-400 text-sm">{customer.accountTier}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-300">
                            <Mail className="w-3 h-3 mr-1" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center text-sm text-gray-300">
                              <Phone className="w-3 h-3 mr-1" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(customer.status)} text-white`}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          Level {customer.kycLevel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-white">
                        ${customer.totalVolume.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getRiskColor(customer.riskScore)}`}>
                          {customer.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {customer.lastActive}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCustomer(customer)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                <TabsTrigger value="overview" className="text-gray-300">Overview</TabsTrigger>
                <TabsTrigger value="trading" className="text-gray-300">Trading</TabsTrigger>
                <TabsTrigger value="compliance" className="text-gray-300">Compliance</TabsTrigger>
                <TabsTrigger value="notes" className="text-gray-300">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <p className="text-white">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Phone</Label>
                    <p className="text-white">{selectedCustomer.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Country</Label>
                    <p className="text-white">{selectedCustomer.country}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Registration Date</Label>
                    <p className="text-white">{selectedCustomer.registrationDate}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="trading" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Total Volume</Label>
                    <p className="text-white text-xl">${selectedCustomer.totalVolume.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Account Tier</Label>
                    <p className="text-white">{selectedCustomer.accountTier}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Trading Pairs</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedCustomer.tradingPairs.map((pair) => (
                        <Badge key={pair} variant="outline" className="border-blue-500 text-blue-400">
                          {pair}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="compliance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">KYC Level</Label>
                    <p className="text-white">Level {selectedCustomer.kycLevel}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Risk Score</Label>
                    <p className={`text-xl font-medium ${getRiskColor(selectedCustomer.riskScore)}`}>
                      {selectedCustomer.riskScore}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Status</Label>
                    <Badge className={`${getStatusColor(selectedCustomer.status)} text-white`}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-300">Last Active</Label>
                    <p className="text-white">{selectedCustomer.lastActive}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4">
                <div>
                  <Label className="text-gray-300">Customer Notes</Label>
                  <Textarea
                    value={selectedCustomer.notes || ''}
                    className="bg-gray-700 border-gray-600 text-white mt-2"
                    rows={6}
                    placeholder="Add customer notes..."
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Notes
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}