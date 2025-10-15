import { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Copy, Trash2, Key, LogIn } from 'lucide-react';
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { WalletConnect } from "@/components/WalletConnect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ApiKey {
  id: string;
  name: string;
  keyId: string;
  keySecret: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['read']);
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { walletAddress, isLoading: authLoading, isAuthenticated } = useWalletAuth();

  const permissions = [
    { id: 'read', label: 'Read', description: 'View account and trading data' },
    { id: 'trade', label: 'Trade', description: 'Execute trades and manage orders' },
    { id: 'withdraw', label: 'Withdraw', description: 'Withdraw funds from account' },
    { id: 'transfer', label: 'Transfer', description: 'Transfer funds between accounts' },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchApiKeys();
    }
  }, [isAuthenticated]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/user/api-keys');
      if (response.ok) {
        const keys = await response.json();
        setApiKeys(keys);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your API key',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName,
          permissions: selectedPermissions,
        }),
      });

      if (response.ok) {
        const newKey = await response.json();
        setApiKeys([...apiKeys, newKey]);
        setShowCreateDialog(false);
        setNewKeyName('');
        setSelectedPermissions(['read']);
        
        toast({
          title: 'API Key Created',
          description: 'Your new API key has been created successfully. Make sure to copy it now as you won\'t be able to see it again.',
        });
      } else {
        throw new Error('Failed to create API key');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create API key. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleApiKey = async (keyId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setApiKeys(apiKeys.map(key => 
          key.id === keyId ? { ...key, isActive } : key
        ));
        
        toast({
          title: isActive ? 'API Key Enabled' : 'API Key Disabled',
          description: `API key has been ${isActive ? 'enabled' : 'disabled'} successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update API key status.',
        variant: 'destructive',
      });
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
        toast({
          title: 'API Key Deleted',
          description: 'API key has been permanently deleted.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete API key.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard`,
    });
  };

  const toggleSecretVisibility = (keyId: string) => {
    const newVisible = new Set(visibleSecrets);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleSecrets(newVisible);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show login requirement for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
              <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Wallet Connection Required
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Connect your wallet to manage API keys and access advanced trading features.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Keys</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage API keys for programmatic access to your NebulaX account
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Create New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create API Key
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Generate a new API key for programmatic access to your NebulaX account.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-5">
                  {/* API Key Name */}
                  <div>
                    <Label 
                      htmlFor="keyName" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      API Key Name
                    </Label>
                    <Input
                      id="keyName"
                      placeholder="Trading Bot"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full h-10 border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                  
                  {/* Permissions */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Permissions
                    </Label>
                    <div className="space-y-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPermissions([...selectedPermissions, permission.id]);
                              } else {
                                setSelectedPermissions(selectedPermissions.filter(p => p !== permission.id));
                              }
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <Label 
                              htmlFor={permission.id} 
                              className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                            >
                              {permission.label}
                            </Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                    className="px-4 py-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createApiKey}
                    disabled={!newKeyName.trim() || selectedPermissions.length === 0}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Create Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* API Key Usage Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Usage Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Security Best Practices:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Keep your API keys secure and never share them</li>
                  <li>• Use separate keys for different applications</li>
                  <li>• Regularly rotate your API keys</li>
                  <li>• Disable keys when not in use</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rate Limits:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Read operations: 1000 requests/minute</li>
                  <li>• Trade operations: 100 requests/minute</li>
                  <li>• Withdrawal operations: 10 requests/hour</li>
                  <li>• Transfer operations: 50 requests/hour</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-gray-500">Loading API keys...</div>
              </CardContent>
            </Card>
          ) : apiKeys.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
              <CardContent className="py-12">
                <div className="text-center max-w-md mx-auto">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No API Keys Created
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                    Create your first API key to start using the NebulaX API for automated trading, portfolio management, and account access.
                  </p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {apiKey.name}
                        <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                          {apiKey.isActive ? "Active" : "Disabled"}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Created {formatDate(apiKey.createdAt)}
                        {apiKey.lastUsed && ` • Last used ${formatDate(apiKey.lastUsed)}`}
                        • Used {apiKey.usageCount} times
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={apiKey.isActive}
                        onCheckedChange={(checked) => toggleApiKey(apiKey.id, checked)}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this API key? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteApiKey(apiKey.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Permissions */}
                    <div>
                      <Label className="text-sm font-medium">Permissions</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {apiKey.permissions.map((permission) => (
                          <Badge key={permission} variant="outline">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* API Key ID */}
                    <div>
                      <Label className="text-sm font-medium">API Key ID</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={apiKey.keyId}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.keyId, 'API Key ID')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* API Secret */}
                    <div>
                      <Label className="text-sm font-medium">API Secret</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={visibleSecrets.has(apiKey.id) 
                            ? apiKey.keySecret 
                            : '••••••••••••••••••••••••••••••••'
                          }
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSecretVisibility(apiKey.id)}
                        >
                          {visibleSecrets.has(apiKey.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.keySecret, 'API Secret')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* API Documentation Link */}
        <Card className="mt-6">
          <CardContent className="py-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Need Help Getting Started?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Check out our comprehensive API documentation for examples and implementation guides.
              </p>
              <Button variant="outline" asChild>
                <a href="/docs/api" target="_blank">
                  View API Documentation
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}