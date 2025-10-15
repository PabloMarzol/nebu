import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Wallet, CreditCard, Search, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ConnectionStatus {
  success: boolean;
  message: string;
  configured: boolean;
  supportedAssets?: string[];
}

interface WalletResult {
  status: string;
  data?: {
    ref_id: string;
    price: number;
    address: string;
    coin: string;
    expires: string;
  };
  message?: string;
}

export default function Alt5PayIntegration() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletResult, setWalletResult] = useState<WalletResult | null>(null);
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const { toast } = useToast();

  // Form states
  const [walletForm, setWalletForm] = useState({
    asset: 'btc',
    refId: `order_${Date.now()}`,
    webhookUrl: '',
    currency: 'USD'
  });

  const [searchForm, setSearchForm] = useState({
    type: 'address',
    value: '',
    all: false
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', '/api/alt5pay/test');
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus({
        success: false,
        message: 'Failed to test connection',
        configured: false
      });
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('POST', '/api/alt5pay/wallet/create', walletForm);
      const data = await response.json();
      setWalletResult(data);
      
      if (data.status === 'success') {
        toast({
          title: "Wallet Created Successfully",
          description: `Address: ${data.data?.address}`,
        });
      } else {
        toast({
          title: "Wallet Creation Failed",
          description: data.message || data.error || 'Unknown error',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Wallet creation failed:', error);
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchTransaction = async () => {
    try {
      setLoading(true);
      const endpoint = `/api/alt5pay/transactions/${searchForm.type}/${searchForm.value}${searchForm.all ? '?all=true' : ''}`;
      const response = await apiRequest('GET', endpoint);
      const data = await response.json();
      setTransactionResult(data);
    } catch (error) {
      console.error('Transaction search failed:', error);
      setTransactionResult({ success: false, error: 'Search failed' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (configured: boolean, success: boolean) => {
    if (!configured) return 'destructive';
    return success ? 'default' : 'secondary';
  };

  const getStatusIcon = (configured: boolean, success: boolean) => {
    if (!configured) return <XCircle className="w-4 h-4" />;
    if (success) return <CheckCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Alt5Pay Integration</h1>
        <p className="text-muted-foreground">
          Complete cryptocurrency payment processing with Alt5Pay API
        </p>
      </div>

      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connection Status
            </CardTitle>
            <Button onClick={checkConnection} disabled={loading} variant="outline" size="sm">
              Test Connection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {connectionStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(connectionStatus.configured, connectionStatus.success)}>
                  {getStatusIcon(connectionStatus.configured, connectionStatus.success)}
                  {connectionStatus.configured 
                    ? (connectionStatus.success ? 'Connected' : 'Configured') 
                    : 'Not Configured'
                  }
                </Badge>
                <span className="text-sm text-muted-foreground">{connectionStatus.message}</span>
              </div>

              {!connectionStatus.configured && (
                <Alert>
                  <AlertDescription>
                    To enable Alt5Pay integration, add these environment variables:
                    <ul className="list-disc list-inside mt-2">
                      <li><code>ALT5_API_KEY</code> - Your public API key</li>
                      <li><code>ALT5_SECRET_KEY</code> - Your secret key</li>
                      <li><code>ALT5_MERCHANT_ID</code> - Your merchant ID</li>
                    </ul>
                    Get these from your Alt5Pay dashboard at dashboard.alt5pay.com
                  </AlertDescription>
                </Alert>
              )}

              {connectionStatus.supportedAssets && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Supported Assets</h4>
                  <div className="flex flex-wrap gap-1">
                    {connectionStatus.supportedAssets.map(asset => (
                      <Badge key={asset} variant="outline" className="text-xs">
                        {asset.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              <span>Testing connection...</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="create-wallet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create-wallet">Create Wallet</TabsTrigger>
          <TabsTrigger value="search-transactions">Search Transactions</TabsTrigger>
        </TabsList>

        {/* Create Wallet Tab */}
        <TabsContent value="create-wallet">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Create Payment Wallet
              </CardTitle>
              <CardDescription>
                Generate a unique wallet address for receiving cryptocurrency payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset">Cryptocurrency</Label>
                  <Select value={walletForm.asset} onValueChange={(value) => setWalletForm({...walletForm, asset: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                      <SelectItem value="erc20/usdt">USDT (ERC20)</SelectItem>
                      <SelectItem value="erc20/usdc">USDC (ERC20)</SelectItem>
                      <SelectItem value="bch">Bitcoin Cash (BCH)</SelectItem>
                      <SelectItem value="ltc">Litecoin (LTC)</SelectItem>
                      <SelectItem value="sol">Solana (SOL)</SelectItem>
                      <SelectItem value="ada">Cardano (ADA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Fiat Currency</Label>
                  <Select value={walletForm.currency} onValueChange={(value) => setWalletForm({...walletForm, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refId">Reference ID</Label>
                  <Input
                    id="refId"
                    value={walletForm.refId}
                    onChange={(e) => setWalletForm({...walletForm, refId: e.target.value})}
                    placeholder="Unique order/payment ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                  <Input
                    id="webhookUrl"
                    value={walletForm.webhookUrl}
                    onChange={(e) => setWalletForm({...walletForm, webhookUrl: e.target.value})}
                    placeholder="https://your-site.com/webhook"
                  />
                </div>
              </div>

              <Button onClick={createWallet} disabled={loading || !connectionStatus?.configured} className="w-full">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Creating Wallet...
                  </div>
                ) : (
                  'Create Wallet Address'
                )}
              </Button>

              {walletResult && (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    {walletResult.status === 'success' && walletResult.data ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Wallet Created Successfully</span>
                        </div>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div><strong>Address:</strong> <code className="text-sm bg-background px-2 py-1 rounded">{walletResult.data.address}</code></div>
                          <div><strong>Asset:</strong> {walletResult.data.coin}</div>
                          <div><strong>Current Price:</strong> ${walletResult.data.price.toLocaleString()}</div>
                          <div><strong>Expires:</strong> {new Date(walletResult.data.expires).toLocaleString()}</div>
                          <div><strong>Reference ID:</strong> {walletResult.data.ref_id}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span>{walletResult.message || 'Failed to create wallet'}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Transactions Tab */}
        <TabsContent value="search-transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Transactions
              </CardTitle>
              <CardDescription>
                Look up transaction status by address, transaction ID, or reference ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Search Type</Label>
                  <Select value={searchForm.type} onValueChange={(value) => setSearchForm({...searchForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="address">By Address</SelectItem>
                      <SelectItem value="tx">By Transaction ID</SelectItem>
                      <SelectItem value="ref">By Reference ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Search Value</Label>
                  <Input
                    value={searchForm.value}
                    onChange={(e) => setSearchForm({...searchForm, value: e.target.value})}
                    placeholder={`Enter ${searchForm.type === 'address' ? 'wallet address' : searchForm.type === 'tx' ? 'transaction ID' : 'reference ID'}`}
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={searchTransaction} disabled={loading || !searchForm.value || !connectionStatus?.configured} className="w-full">
                    Search
                  </Button>
                </div>
              </div>

              {transactionResult && (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    {transactionResult.status === 'success' && transactionResult.data ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Transaction Found</span>
                        </div>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          {Array.isArray(transactionResult.data) ? (
                            transactionResult.data.map((tx: any, index: number) => (
                              <div key={index} className="border-b pb-2 mb-2 last:border-b-0">
                                <div><strong>Status:</strong> <Badge variant={tx.status === 'Paid' ? 'default' : 'secondary'}>{tx.status}</Badge></div>
                                <div><strong>Amount:</strong> {tx.payment_amount} {tx.coin}</div>
                                <div><strong>Total:</strong> ${tx.total_payment}</div>
                                <div><strong>Date:</strong> {new Date(tx.date_time).toLocaleString()}</div>
                                <div><strong>TX ID:</strong> <code className="text-xs">{tx.txid}</code></div>
                              </div>
                            ))
                          ) : (
                            <>
                              <div><strong>Status:</strong> <Badge variant={transactionResult.data.status === 'Paid' ? 'default' : 'secondary'}>{transactionResult.data.status}</Badge></div>
                              <div><strong>Amount:</strong> {transactionResult.data.payment_amount} {transactionResult.data.coin}</div>
                              <div><strong>Total:</strong> ${transactionResult.data.total_payment}</div>
                              <div><strong>Date:</strong> {new Date(transactionResult.data.date_time).toLocaleString()}</div>
                              <div><strong>TX ID:</strong> <code className="text-xs">{transactionResult.data.txid}</code></div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span>{transactionResult.error || transactionResult.message || 'Transaction not found'}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}