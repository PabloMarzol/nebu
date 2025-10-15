import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { Shield, Lock, Key, Smartphone, Mail, CheckCircle, AlertCircle, Settings, Eye, EyeOff, Copy, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useLocation } from 'wouter';

interface APIKey {
  id: string;
  name: string;
  key: string;
  secretPreview: string;
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
}

interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function SecuritySettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { walletAddress, isLoading: authLoading, isAuthenticated } = useWalletAuth();
  const [, setLocation] = useLocation();
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [apiKeyName, setApiKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['trading']);
  
  // UI states
  const [currentAuth, setCurrentAuth] = useState<'email' | 'google2fa'>('email');
  const [showAPIKeys, setShowAPIKeys] = useState(false);
  const [isCreatingAPIKey, setIsCreatingAPIKey] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access Security Settings",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation('/auth/login');
      }, 1000);
    }
  }, [authLoading, isAuthenticated, toast, setLocation]);

  // Show loading if auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <RefreshCw className="h-6 w-6 animate-spin text-purple-400" />
          <span className="text-white">Loading Security Settings...</span>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-300">
              You must be logged in to access Security Settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/auth/login')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock API keys data for now
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Trading Bot Alpha',
      key: 'nebulax_api_live_************************d8f2',
      secretPreview: '************************a5c7',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      permissions: ['trading', 'read']
    }
  ]);

  // Security recommendations
  const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>([
    {
      id: '1',
      title: 'Enable Google Authenticator for maximum security',
      description: 'Upgrade from email-based authentication to app-based 2FA',
      completed: false,
      priority: 'high'
    },
    {
      id: '2', 
      title: 'Add strong 16+ character password to your account',
      description: 'Use a mix of letters, numbers, and special characters',
      completed: true,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Configure trusted IP whitelisting',
      description: 'Restrict account access to specific IP addresses',
      completed: false,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Set up backup recovery phrase',
      description: 'Create a backup to recover your account if needed',
      completed: true,
      priority: 'high'
    }
  ]);

  // Handle password update
  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Mock password update for now
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  // Handle API key creation
  const handleCreateAPIKey = () => {
    if (!apiKeyName.trim()) {
      toast({
        title: "Missing Name",
        description: "Please provide a name for your API key.",
        variant: "destructive",
      });
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: apiKeyName,
      key: `nebulax_api_live_${Math.random().toString(36).substr(2, 24)}`,
      secretPreview: `************************${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      permissions: selectedPermissions
    };

    setApiKeys(prev => [...prev, newKey]);
    setApiKeyName('');
    setSelectedPermissions(['trading']);
    setIsCreatingAPIKey(false);
    
    toast({
      title: "API Key Created",
      description: "New API key has been generated successfully.",
    });
  };

  // Handle API key deletion
  const handleDeleteAPIKey = (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      toast({
        title: "API Key Deleted",
        description: "API key has been permanently removed.",
      });
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Security Settings
          </h1>
          <p className="text-muted-foreground">Protect your NebulaX Exchange account with advanced security</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Current Security Status */}
        <Card className="border-2 border-purple-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <CardTitle>Security Status</CardTitle>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Account Secured
              </Badge>
            </div>
            <CardDescription>
              Current authentication method and security level overview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {currentAuth === 'email' ? (
                  <Mail className="w-5 h-5 text-blue-500" />
                ) : (
                  <Smartphone className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <p className="font-medium">
                    {currentAuth === 'email' ? 'Email Authentication' : 'Google Authenticator'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentAuth === 'email' ? 'Basic email-based verification' : 'App-based 2FA protection'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Lock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium">Password Protected</p>
                  <p className="text-sm text-muted-foreground">Strong encryption enabled</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Method Switch */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <CardTitle>Authentication Method</CardTitle>
            </div>
            <CardDescription>
              Switch between email verification and Google Authenticator app-based 2FA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                currentAuth === 'email' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setCurrentAuth('email')}>
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Email Authentication</h3>
                    <p className="text-sm text-muted-foreground">Verification codes sent to email</p>
                  </div>
                </div>
                {currentAuth === 'email' && (
                  <Badge className="mt-2 bg-blue-500">Currently Active</Badge>
                )}
              </div>
              
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                currentAuth === 'google2fa' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setCurrentAuth('google2fa')}>
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Google Authenticator</h3>
                    <p className="text-sm text-muted-foreground">App-based 2FA protection</p>
                  </div>
                </div>
                {currentAuth === 'google2fa' && (
                  <Badge className="mt-2 bg-green-500">Currently Active</Badge>
                )}
              </div>
            </div>
            
            {currentAuth === 'email' && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Upgrade to Google Authenticator</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      For enhanced security, consider switching to Google Authenticator app-based 2FA.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Google Authenticator Setup */}
        <TwoFactorSetup 
          userId="demo-user-123"
          userEmail="traders@nebulaxexchange.io"
        />

        {/* Password Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <CardTitle>Password Management</CardTitle>
            </div>
            <CardDescription>
              Update your account password and manage login credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handlePasswordUpdate} 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
            
            {newPassword && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium mb-2">Password Strength:</p>
                <div className="space-y-1">
                  <div className={`text-xs ${newPassword.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                    {newPassword.length >= 8 ? '✓' : '✗'} At least 8 characters
                  </div>
                  <div className={`text-xs ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                    {/[A-Z]/.test(newPassword) ? '✓' : '✗'} Contains uppercase letter
                  </div>
                  <div className={`text-xs ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                    {/[0-9]/.test(newPassword) ? '✓' : '✗'} Contains number
                  </div>
                  <div className={`text-xs ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                    {/[^A-Za-z0-9]/.test(newPassword) ? '✓' : '✗'} Contains special character
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Keys Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                <CardTitle>API Keys</CardTitle>
              </div>
              <Button 
                onClick={() => setShowAPIKeys(!showAPIKeys)}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Keys
              </Button>
            </div>
            <CardDescription>
              Generate and manage API keys for programmatic trading access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showAPIKeys ? (
              <div className="text-center py-8">
                <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  API key management interface. Click "Manage Keys" to access your trading API keys.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Create New API Key */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Create New API Key</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="api-key-name">Key Name</Label>
                      <Input
                        id="api-key-name"
                        placeholder="e.g., Trading Bot Alpha"
                        value={apiKeyName}
                        onChange={(e) => setApiKeyName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Permissions</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['trading', 'read', 'withdraw'].map((permission) => (
                          <Button
                            key={permission}
                            variant={selectedPermissions.includes(permission) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedPermissions(prev => 
                                prev.includes(permission)
                                  ? prev.filter(p => p !== permission)
                                  : [...prev, permission]
                              );
                            }}
                          >
                            {permission.charAt(0).toUpperCase() + permission.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleCreateAPIKey}
                      disabled={loading}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {loading ? "Creating..." : "Create API Key"}
                    </Button>
                  </div>
                </div>

                {/* Existing API Keys */}
                <div>
                  <h4 className="font-semibold mb-3">Your API Keys</h4>
                  {apiKeys.length > 0 ? (
                    <div className="space-y-3">
                      {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h5 className="font-medium">{apiKey.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(apiKey.key)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteAPIKey(apiKey.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">API Key</Label>
                              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                {apiKey.key}
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Secret</Label>
                              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                {apiKey.secretPreview}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {apiKey.permissions.map((permission) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border rounded-lg">
                      <Key className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-muted-foreground">No API keys created yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Recommendations */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <CardTitle>Security Recommendations</CardTitle>
            </div>
            <CardDescription>
              Follow these best practices to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                  rec.completed ? 'bg-green-50 dark:bg-green-950/20' : 'bg-yellow-50 dark:bg-yellow-950/20'
                }`}>
                  {rec.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${
                      rec.priority === 'high' ? 'text-red-600' : 
                      rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <Badge variant={rec.completed ? "default" : "secondary"} className="text-xs">
                    {rec.completed ? "Completed" : rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}