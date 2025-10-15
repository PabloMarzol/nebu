import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Wallet,
  Copy,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Shield,
  Zap
} from "lucide-react";

interface SupportedCrypto {
  symbol: string;
  name: string;
  network: string;
  contractAddress?: string;
  decimals: number;
  minAmount: string;
  maxAmount: string;
  confirmationsRequired: number;
  processingFee: string;
}

interface CryptoPayment {
  id: string;
  userId: string;
  cryptocurrency: string;
  amount: string;
  walletAddress: string;
  paymentAddress: string;
  status: 'pending' | 'confirmed' | 'failed' | 'expired';
  transactionHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  expiresAt: string;
}

export default function CryptoPayment() {
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [currentPayment, setCurrentPayment] = useState<CryptoPayment | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get supported cryptocurrencies
  const { data: supportedCryptos = [], isLoading: loadingCryptos } = useQuery({
    queryKey: ['/api/crypto/supported']
  });

  // Get user's payments
  const { data: userPayments = [], refetch: refetchPayments } = useQuery({
    queryKey: ['/api/crypto/payments'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: (data: { cryptocurrency: string; amount: string }) =>
      apiRequest('/api/crypto/create-payment', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data) => {
      setCurrentPayment(data.payment);
      toast({
        title: "Payment Created",
        description: `Send ${data.payment.amount} ${data.payment.cryptocurrency} to the address below`
      });
      refetchPayments();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Payment",
        description: error.message || "Please check your input and try again",
        variant: "destructive"
      });
    }
  });

  // Update countdown timer
  useEffect(() => {
    if (!currentPayment) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(currentPayment.expiresAt).getTime();
      const remaining = Math.max(0, expiry - now);
      setTimeLeft(Math.floor(remaining / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentPayment]);

  // Auto-refresh payment status
  useEffect(() => {
    if (!currentPayment || currentPayment.status !== 'pending') return;

    const interval = setInterval(async () => {
      try {
        const response = await apiRequest(`/api/crypto/payment/${currentPayment.id}`);
        setCurrentPayment(response);
        
        if (response.status === 'confirmed') {
          toast({
            title: "Payment Confirmed!",
            description: `Your ${response.cryptocurrency} payment has been confirmed`
          });
          refetchPayments();
        }
      } catch (error) {
        console.error('Failed to update payment status:', error);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [currentPayment]);

  const handleCreatePayment = () => {
    if (!selectedCrypto || !amount) {
      toast({
        title: "Missing Information",
        description: "Please select a cryptocurrency and enter an amount",
        variant: "destructive"
      });
      return;
    }

    const crypto = supportedCryptos.find((c: SupportedCrypto) => c.symbol === selectedCrypto);
    if (!crypto) return;

    const amountNum = parseFloat(amount);
    if (amountNum < parseFloat(crypto.minAmount) || amountNum > parseFloat(crypto.maxAmount)) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between ${crypto.minAmount} and ${crypto.maxAmount} ${crypto.symbol}`,
        variant: "destructive"
      });
      return;
    }

    createPaymentMutation.mutate({ cryptocurrency: selectedCrypto, amount });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`
    });
  };

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'confirmed':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getConfirmationProgress = (confirmations: number, required: number) => {
    return Math.min(100, (confirmations / required) * 100);
  };

  if (currentPayment && currentPayment.status === 'pending') {
    const crypto = supportedCryptos.find((c: SupportedCrypto) => c.symbol === currentPayment.cryptocurrency);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Payment Instructions</span>
              </div>
              {getStatusBadge(currentPayment.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {timeLeft > 0 ? (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Time remaining: <strong>{formatTimeLeft(timeLeft)}</strong>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Payment has expired. Please create a new payment.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Payment Address</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={currentPayment.paymentAddress}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentPayment.paymentAddress, "Payment address")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <div className="text-lg font-bold">{currentPayment.amount} {currentPayment.cryptocurrency}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Network</Label>
                  <div className="text-lg">{crypto?.name || currentPayment.cryptocurrency}</div>
                </div>
              </div>

              {crypto?.contractAddress && (
                <div>
                  <Label className="text-sm font-medium">Contract Address</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={crypto.contractAddress}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(crypto.contractAddress!, "Contract address")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentPayment.confirmations > 0 && (
                <div>
                  <Label className="text-sm font-medium">Confirmations</Label>
                  <div className="space-y-2 mt-1">
                    <div className="flex justify-between text-sm">
                      <span>{currentPayment.confirmations} of {currentPayment.requiredConfirmations}</span>
                      <span>{Math.round(getConfirmationProgress(currentPayment.confirmations, currentPayment.requiredConfirmations))}%</span>
                    </div>
                    <Progress value={getConfirmationProgress(currentPayment.confirmations, currentPayment.requiredConfirmations)} />
                  </div>
                </div>
              )}

              {currentPayment.transactionHash && (
                <div>
                  <Label className="text-sm font-medium">Transaction Hash</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={currentPayment.transactionHash}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentPayment.transactionHash!, "Transaction hash")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/tx/${currentPayment.transactionHash}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Send exactly {currentPayment.amount} {currentPayment.cryptocurrency} to the address above.
                Do not send from an exchange wallet. Processing fee: {crypto?.processingFee} {currentPayment.cryptocurrency}
              </AlertDescription>
            </Alert>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPayment(null)}
                className="flex-1"
              >
                Create New Payment
              </Button>
              <Button 
                variant="outline" 
                onClick={() => refetchPayments()}
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Crypto Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {supportedCryptos.map((crypto: SupportedCrypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{crypto.symbol}</span>
                        <span className="text-muted-foreground">- {crypto.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {selectedCrypto && (
                <p className="text-sm text-muted-foreground">
                  Min: {supportedCryptos.find((c: SupportedCrypto) => c.symbol === selectedCrypto)?.minAmount} {selectedCrypto} | 
                  Max: {supportedCryptos.find((c: SupportedCrypto) => c.symbol === selectedCrypto)?.maxAmount} {selectedCrypto}
                </p>
              )}
            </div>
          </div>

          <Button 
            onClick={handleCreatePayment}
            disabled={createPaymentMutation.isPending || !selectedCrypto || !amount}
            className="w-full"
          >
            {createPaymentMutation.isPending ? "Creating Payment..." : "Create Payment"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      {userPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userPayments.slice(0, 5).map((payment: CryptoPayment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{payment.amount} {payment.cryptocurrency}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(payment.status)}
                    {payment.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPayment(payment)}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supported Cryptocurrencies */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportedCryptos.map((crypto: SupportedCrypto) => (
              <div key={crypto.symbol} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{crypto.symbol}</div>
                  <Badge variant="outline">{crypto.network}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>{crypto.name}</div>
                  <div>Min: {crypto.minAmount} | Max: {crypto.maxAmount}</div>
                  <div>Confirmations: {crypto.confirmationsRequired}</div>
                  <div>Fee: {crypto.processingFee} {crypto.symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}