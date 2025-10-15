import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, CheckCircle, Clock, AlertCircle, TrendingUp, Wallet, QrCode } from 'lucide-react';

interface Payment {
  id: string;
  address: string;
  asset: string;
  refId: string;
  currency: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'expired';
  createdAt: string;
  expiresAt: string;
  transactionId?: string;
  confirmations?: number;
}

interface PaymentStats {
  total: number;
  confirmed: number;
  pending: number;
  expired: number;
  confirmationRate: string;
  totalValueUSD: string;
  supportedAssets: number;
}

const SUPPORTED_ASSETS = [
  'BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'SOL', 'DOT', 'LINK', 
  'MATIC', 'LTC', 'BCH', 'XRP', 'DOGE', 'AVAX'
];

const CURRENCIES = ['USD', 'CAD', 'EUR'];

export default function PaymentSimulation() {
  const [asset, setAsset] = useState('BTC');
  const [refId, setRefId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate random refId
  useEffect(() => {
    setRefId(`sim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`);
  }, []);

  // Fetch all payments
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments/simulation/all'],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Fetch payment statistics
  const { data: statsData } = useQuery({
    queryKey: ['/api/payments/simulation/stats'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Fetch current crypto prices
  const { data: pricesData } = useQuery({
    queryKey: ['/api/payments/simulation/prices'],
    refetchInterval: 15000 // Refresh every 15 seconds
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      return await apiRequest('POST', '/api/alt5pay/wallet/create', paymentData);
    },
    onSuccess: () => {
      toast({
        title: 'Payment Created',
        description: 'Payment wallet created successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments/simulation/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/payments/simulation/stats'] });
      // Generate new refId for next payment
      setRefId(`sim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Confirm payment mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: async (refId: string) => {
      return await apiRequest('POST', `/api/payments/simulation/confirm/${refId}`);
    },
    onSuccess: () => {
      toast({
        title: 'Payment Confirmed',
        description: 'Payment has been manually confirmed!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments/simulation/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/payments/simulation/stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Confirmation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreatePayment = async () => {
    if (!asset || !refId) {
      toast({
        title: 'Missing Information',
        description: 'Please select asset and enter reference ID',
        variant: 'destructive',
      });
      return;
    }

    createPaymentMutation.mutate({
      asset: asset.toLowerCase(),
      refId,
      currency,
      amount: amount ? parseFloat(amount) : undefined
    });
  };

  const handleConfirmPayment = (refId: string) => {
    confirmPaymentMutation.mutate(refId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Address copied to clipboard',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return amount < 1 ? amount.toFixed(6) : amount.toFixed(4);
  };

  const payments: Payment[] = paymentsData?.data || [];
  const stats: PaymentStats | undefined = statsData?.data;
  const prices: Record<string, number> = pricesData?.data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Payment Simulation System
          </h1>
          <p className="text-purple-200">
            Complete cryptocurrency payment testing environment while Alt5Pay integration is finalized
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-200">Total Payments</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-200">Confirmed</p>
                    <p className="text-2xl font-bold text-green-400">{stats.confirmed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-200">Success Rate</p>
                    <p className="text-2xl font-bold text-white">{stats.confirmationRate}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-200">Total Value</p>
                    <p className="text-2xl font-bold text-white">${stats.totalValueUSD}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Creation Form */}
          <Card className="lg:col-span-1 bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Create Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="asset" className="text-purple-200">Cryptocurrency</Label>
                <Select value={asset} onValueChange={setAsset}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_ASSETS.map((assetOption) => (
                      <SelectItem key={assetOption} value={assetOption}>
                        <div className="flex items-center justify-between w-full">
                          <span>{assetOption}</span>
                          {prices[assetOption.toLowerCase()] && (
                            <span className="text-sm text-gray-500 ml-2">
                              ${prices[assetOption.toLowerCase()].toFixed(2)}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="refId" className="text-purple-200">Reference ID</Label>
                <Input
                  id="refId"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Enter unique reference ID"
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-purple-200">Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Leave empty for $100 equivalent"
                />
              </div>

              <div>
                <Label htmlFor="currency" className="text-purple-200">Fiat Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCreatePayment}
                disabled={createPaymentMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {createPaymentMutation.isPending ? 'Creating...' : 'Create Payment'}
              </Button>
            </CardContent>
          </Card>

          {/* Payments List */}
          <Card className="lg:col-span-2 bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-purple-200 mt-2">Loading payments...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-200">No payments created yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {payments.map((payment) => (
                    <div key={payment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{payment.asset}</span>
                          {getStatusBadge(payment.status)}
                        </div>
                        <span className="text-sm text-purple-200">
                          {formatAmount(payment.amount)} {payment.asset}
                        </span>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between text-purple-200">
                          <span>Ref ID:</span>
                          <span className="font-mono">{payment.refId}</span>
                        </div>
                        <div className="flex justify-between text-purple-200">
                          <span>Address:</span>
                          <button
                            onClick={() => copyToClipboard(payment.address)}
                            className="font-mono text-xs hover:text-white flex items-center gap-1"
                          >
                            {payment.address.substring(0, 10)}...{payment.address.substring(-6)}
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        {payment.transactionId && (
                          <div className="flex justify-between text-purple-200">
                            <span>Tx ID:</span>
                            <span className="font-mono text-xs">
                              {payment.transactionId.substring(0, 10)}...
                            </span>
                          </div>
                        )}
                        {payment.confirmations && (
                          <div className="flex justify-between text-purple-200">
                            <span>Confirmations:</span>
                            <span>{payment.confirmations}/6</span>
                          </div>
                        )}
                      </div>

                      {payment.status === 'pending' && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <Button
                            onClick={() => handleConfirmPayment(payment.refId)}
                            disabled={confirmPaymentMutation.isPending}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {confirmPaymentMutation.isPending ? 'Confirming...' : 'Confirm Payment'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Prices */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Live Cryptocurrency Prices (Simulated)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
              {Object.entries(prices).map(([asset, price]) => (
                <div key={asset} className="text-center">
                  <div className="text-sm font-semibold text-purple-200 uppercase">{asset}</div>
                  <div className="text-lg font-bold text-white">${price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}