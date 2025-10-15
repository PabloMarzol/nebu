import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserCheck,
  UserX
} from "lucide-react";
import { UserRole } from "@/hooks/useRoleBasedAccess";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: "active" | "inactive" | "pending";
  lastLogin: Date;
  createdAt: Date;
  permissions: string[];
}

interface RoleTemplate {
  role: UserRole;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  workspaceAccess: Record<string, "full" | "read" | "limited" | "none">;
}

const roleTemplates: RoleTemplate[] = [
  {
    role: "admin",
    name: "Administrator",
    description: "Full system access and user management",
    color: "bg-red-500",
    permissions: ["all"],
    workspaceAccess: {
      "customer-ops": "full",
      "sales-revenue": "full",
      "marketing-growth": "full",
      "compliance-risk": "full",
      "exchange-ops": "full",
      "analytics-intelligence": "full"
    }
  },
  {
    role: "manager",
    name: "Manager",
    description: "Management access with reporting capabilities",
    color: "bg-blue-500",
    permissions: ["view_reports", "manage_team", "view_analytics"],
    workspaceAccess: {
      "customer-ops": "full",
      "sales-revenue": "full",
      "marketing-growth": "read",
      "compliance-risk": "read",
      "exchange-ops": "read",
      "analytics-intelligence": "full"
    }
  },
  {
    role: "customer_support",
    name: "Customer Support",
    description: "Customer service and support operations",
    color: "bg-green-500",
    permissions: ["create_tickets", "manage_customers", "view_customer_data"],
    workspaceAccess: {
      "customer-ops": "full",
      "sales-revenue": "read",
      "marketing-growth": "none",
      "compliance-risk": "limited",
      "exchange-ops": "none",
      "analytics-intelligence": "limited"
    }
  },
  {
    role: "sales",
    name: "Sales Representative",
    description: "Sales pipeline and revenue operations",
    color: "bg-purple-500",
    permissions: ["manage_sales", "view_customers", "create_deals"],
    workspaceAccess: {
      "customer-ops": "limited",
      "sales-revenue": "full",
      "marketing-growth": "read",
      "compliance-risk": "none",
      "exchange-ops": "none",
      "analytics-intelligence": "limited"
    }
  },
  {
    role: "compliance",
    name: "Compliance Officer",
    description: "Regulatory compliance and risk management",
    color: "bg-yellow-500",
    permissions: ["manage_compliance", "view_reports", "manage_kyc"],
    workspaceAccess: {
      "customer-ops": "limited",
      "sales-revenue": "none",
      "marketing-growth": "none",
      "compliance-risk": "full",
      "exchange-ops": "limited",
      "analytics-intelligence": "limited"
    }
  },
  {
    role: "client",
    name: "Client",
    description: "Client-facing access with limited permissions",
    color: "bg-gray-500",
    permissions: ["create_tickets", "view_own_data"],
    workspaceAccess: {
      "customer-ops": "limited",
      "sales-revenue": "none",
      "marketing-growth": "none",
      "compliance-risk": "none",
      "exchange-ops": "none",
      "analytics-intelligence": "none"
    }
  }
];

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@nebulaxexchange.io",
    firstName: "John",
    lastName: "Admin",
    role: "admin",
    status: "active",
    lastLogin: new Date("2025-01-12T10:30:00"),
    createdAt: new Date("2025-01-01T00:00:00"),
    permissions: ["all"]
  },
  {
    id: "2",
    email: "support@nebulaxexchange.io",
    firstName: "Sarah",
    lastName: "Support",
    role: "customer_support",
    status: "active",
    lastLogin: new Date("2025-01-12T15:45:00"),
    createdAt: new Date("2025-01-05T00:00:00"),
    permissions: ["create_tickets", "manage_customers", "view_customer_data"]
  },
  {
    id: "3",
    email: "sales@nebulaxexchange.io",
    firstName: "Mike",
    lastName: "Sales",
    role: "sales",
    status: "active",
    lastLogin: new Date("2025-01-11T14:20:00"),
    createdAt: new Date("2025-01-03T00:00:00"),
    permissions: ["manage_sales", "view_customers", "create_deals"]
  },
  {
    id: "4",
    email: "client@nebulaxexchange.io",
    firstName: "Client",
    lastName: "User",
    role: "client",
    status: "active",
    lastLogin: new Date("2025-01-12T09:15:00"),
    createdAt: new Date("2025-01-10T00:00:00"),
    permissions: ["create_tickets", "view_own_data"]
  }
];

export function UserRoleManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const roleTemplate = roleTemplates.find(template => template.role === newRole);
    if (roleTemplate) {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole, permissions: roleTemplate.permissions }
          : user
      ));
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const getRoleTemplate = (role: UserRole) => {
    return roleTemplates.find(template => template.role === role);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "inactive": return <UserX className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Role Management</h1>
          <p className="text-gray-400">Manage user roles and permissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="border-gray-600">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="border-gray-600">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New User</DialogTitle>
              </DialogHeader>
              <CreateUserForm onClose={() => setIsCreateModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-white">Search Users</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by email, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role-filter" className="text-white">Filter by Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | "all")}>
                <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Roles</SelectItem>
                  {roleTemplates.map(template => (
                    <SelectItem key={template.role} value={template.role}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Role Templates</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Role</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Last Login</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => {
                      const roleTemplate = getRoleTemplate(user.role);
                      return (
                        <TableRow key={user.id} className="border-gray-700">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${roleTemplate?.color} text-white`}>
                              {roleTemplate?.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(user.status)}
                              <Badge className={`${getStatusColor(user.status)} text-white`}>
                                {user.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {user.lastLogin.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Switch
                                checked={user.status === "active"}
                                onCheckedChange={() => handleStatusToggle(user.id)}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleTemplates.map(template => (
              <Card key={template.role} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Badge className={`${template.color} text-white`}>
                      {template.name}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{template.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Workspace Access:</h4>
                    {Object.entries(template.workspaceAccess).map(([workspace, access]) => (
                      <div key={workspace} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{workspace.replace('-', ' ')}</span>
                        <Badge variant="outline" className="text-xs">
                          {access}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Role</TableHead>
                      <TableHead className="text-gray-300">Create Tickets</TableHead>
                      <TableHead className="text-gray-300">View Reports</TableHead>
                      <TableHead className="text-gray-300">Manage Users</TableHead>
                      <TableHead className="text-gray-300">Access Admin</TableHead>
                      <TableHead className="text-gray-300">View Financials</TableHead>
                      <TableHead className="text-gray-300">Manage Compliance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleTemplates.map(template => (
                      <TableRow key={template.role} className="border-gray-700">
                        <TableCell>
                          <Badge className={`${template.color} text-white`}>
                            {template.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {template.permissions.includes("create_tickets") || template.permissions.includes("all") ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          {template.permissions.includes("view_reports") || template.permissions.includes("all") ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          {template.permissions.includes("manage_users") || template.permissions.includes("all") ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          {template.permissions.includes("access_admin") || template.permissions.includes("all") ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          {template.permissions.includes("view_financials") || template.permissions.includes("all") ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          {template.permissions.includes("manage_compliance") || template.permissions.includes("all") ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-400" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      {selectedUser && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit User</DialogTitle>
            </DialogHeader>
            <EditUserForm 
              user={selectedUser} 
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updatedUser) => {
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                setIsEditModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "client" as UserRole
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle user creation logic here
    console.log("Creating user:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-white">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-white">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="role" className="text-white">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {roleTemplates.map(template => (
              <SelectItem key={template.role} value={template.role}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create User</Button>
      </div>
    </form>
  );
}

function EditUserForm({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (user: User) => void }) {
  const [formData, setFormData] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-white">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-white">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="role" className="text-white">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {roleTemplates.map(template => (
              <SelectItem key={template.role} value={template.role}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status" className="text-white">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "active" | "inactive" | "pending" }))}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}