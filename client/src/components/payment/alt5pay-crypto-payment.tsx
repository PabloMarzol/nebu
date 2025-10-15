import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle, Copy, ExternalLink, RefreshCw } from "lucide-react";
import QRCode from "qrcode";

interface CryptoAsset {
  code: string;
  name: string;
  icon: string;
}

interface PaymentWallet {
  ref_id: string;
  price: number;
  address: string;
  coin: string;
  expires: string;
}

interface TransactionStatus {
  status: 'Paid' | 'Pending';
  payment_amount: number;
  total_payment: number;
  txid: string;
  confirmation: string;
}

const SUPPORTED_ASSETS: CryptoAsset[] = [
  { code: 'BTC', name: 'Bitcoin', icon: '₿' },
  { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { code: 'USDT', name: 'Tether', icon: '₮' },
  { code: 'USDC', name: 'USD Coin', icon: '$' },
  { code: 'SOL', name: 'Solana', icon: '◎' },
  { code: 'ADA', name: 'Cardano', icon: '₳' },
  { code: 'AVAX', name: 'Avalanche', icon: '🔺' },
  { code: 'MATIC', name: 'Polygon', icon: '⬢' }
];

interface Alt5PayCryptoPaymentProps {
  amount: number;
  currency: 'USD' | 'EUR' | 'CAD';
  orderId: string;
  onPaymentComplete: (transaction: TransactionStatus) => void;
  onPaymentCancel: () => void;
}

export default function Alt5PayCryptoPayment({
  amount,
  currency,
  orderId,
  onPaymentComplete,
  onPaymentCancel
}: Alt5PayCryptoPaymentProps) {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [paymentWallet, setPaymentWallet] = useState<PaymentWallet | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (paymentWallet && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            toast({
              title: "Payment Expired",
              description: "Please create a new payment request",
              variant: "destructive"
            });
            setPaymentWallet(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentWallet, timeRemaining, toast]);

  // Auto-check payment status
  useEffect(() => {
    if (paymentWallet && !transactionStatus) {
      const checkInterval = setInterval(async () => {
        await checkPaymentStatus();
      }, 10000); // Check every 10 seconds

      return () => clearInterval(checkInterval);
    }
  }, [paymentWallet, transactionStatus]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const createPaymentWallet = async (asset: CryptoAsset) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/alt5pay/create-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: asset.code.toLowerCase(),
          refId: orderId,
          amount,
          currency,
          webhookUrl: `${window.location.origin}/api/alt5pay/webhook`
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setPaymentWallet(data.data);
        setSelectedAsset(asset);
        
        // Calculate time remaining (30 minutes from creation)
        const expiryTime = new Date(data.data.expires).getTime();
        const now = Date.now();
        setTimeRemaining(Math.max(0, Math.floor((expiryTime - now) / 1000)));

        // Generate QR code
        const qrData = `${asset.code.toLowerCase()}:${data.data.address}?amount=${data.data.price}`;
        const qrUrl = await QRCode.toDataURL(qrData);
        setQrCodeUrl(qrUrl);

        toast({
          title: "Payment Wallet Created",
          description: `Send ${asset.name} to the generated address`,
        });
      } else {
        throw new Error(data.message || 'Failed to create payment wallet');
      }
    } catch (error) {
      console.error('Failed to create payment wallet:', error);
      toast({
        title: "Error",
        description: "Failed to create payment wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentWallet) return;

    setIsChecking(true);
    try {
      const response = await fetch('/api/alt5pay/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: paymentWallet.address
        })
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.data.status === 'Paid') {
        setTransactionStatus(data.data);
        onPaymentComplete(data.data);
        
        toast({
          title: "Payment Confirmed!",
          description: `Received ${data.data.payment_amount} ${paymentWallet.coin}`,
        });
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const resetPayment = () => {
    setSelectedAsset(null);
    setPaymentWallet(null);
    setQrCodeUrl('');
    setTimeRemaining(0);
    setTransactionStatus(null);
  };

  if (transactionStatus) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white">Payment Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-white/80">
          <p className="mb-4">
            Your payment of {transactionStatus.payment_amount} {paymentWallet?.coin} has been confirmed.
          </p>
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <p className="text-sm">Transaction ID:</p>
            <p className="font-mono text-xs break-all">{transactionStatus.txid}</p>
          </div>
          <p className="text-sm">Confirmations: {transactionStatus.confirmation}</p>
        </CardContent>
      </Card>
    );
  }

  if (paymentWallet) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              Pay with {selectedAsset?.name}
            </CardTitle>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block">
              <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48" />
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/60 text-sm">Amount</p>
              <p className="text-white font-semibold">
                {paymentWallet.price} {selectedAsset?.code}
              </p>
              <p className="text-white/60 text-sm">
                ≈ {amount} {currency}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/60 text-sm">Wallet Address</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(paymentWallet.address, 'Address')}
                  className="text-white/60 hover:text-white"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-white font-mono text-sm break-all">
                {paymentWallet.address}
              </p>
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={checkPaymentStatus}
              disabled={isChecking}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              {isChecking ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Check Status
            </Button>
            
            <Button
              variant="ghost"
              onClick={resetPayment}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Try Another Asset
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-200 text-sm">
              <strong>Instructions:</strong>
            </p>
            <ul className="text-blue-200/80 text-sm mt-1 space-y-1">
              <li>• Send exactly {paymentWallet.price} {selectedAsset?.code}</li>
              <li>• Use the address above or scan the QR code</li>
              <li>• Payment will be confirmed automatically</li>
              <li>• Do not send from an exchange wallet</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-center">
          Choose Cryptocurrency
        </CardTitle>
        <p className="text-white/60 text-center">
          Pay {amount} {currency} with crypto
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {SUPPORTED_ASSETS.map((asset) => (
            <Button
              key={asset.code}
              variant="outline"
              onClick={() => createPaymentWallet(asset)}
              disabled={isLoading}
              className="h-16 border-white/20 hover:bg-white/10 text-white flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">{asset.icon}</span>
              <span className="text-xs">{asset.code}</span>
            </Button>
          ))}
        </div>

        <Separator className="my-4 bg-white/20" />

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={onPaymentCancel}
            className="flex-1 text-white/60 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>

        <div className="mt-4 bg-white/5 rounded-lg p-3">
          <p className="text-white/60 text-xs text-center">
            Powered by Alt5 Pay • Secure crypto payments
          </p>
        </div>
      </CardContent>
    </Card>
  );
}