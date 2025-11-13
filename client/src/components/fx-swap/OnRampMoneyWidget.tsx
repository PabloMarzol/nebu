import React, { useState, useEffect } from 'react';
import { useWalletAuth } from '../../hooks/useWalletAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Banknote,
  Wallet,
  ExternalLink,
  AlertCircle,
  Info,
  Globe,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface OnRampMoneyWidgetProps {
  onSwapInitiated?: (data: any) => void;
  onSwapError?: (error: any) => void;
}

interface Currency {
  code: string;
  name: string;
  fiatType: number;
}

interface CryptoOption {
  coin: string;
  networks: string[];
}

const OnRampMoneyWidget: React.FC<OnRampMoneyWidgetProps> = ({
  onSwapInitiated,
  onSwapError
}) => {
  const { isAuthenticated, walletAddress } = useWalletAuth();

  // Form state
  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [fiatCurrency, setFiatCurrency] = useState<string>('INR');
  const [cryptoCurrency, setCryptoCurrency] = useState<string>('usdt');
  const [network, setNetwork] = useState<string>('matic20');
  const [destinationWallet, setDestinationWallet] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('1'); // 1=Instant, 2=Bank
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [cryptos, setCryptos] = useState<CryptoOption[]>([]);
  const [availableNetworks, setAvailableNetworks] = useState<string[]>([]);

  // Fetch supported currencies and cryptos on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [currenciesRes, cryptosRes] = await Promise.all([
          fetch('/api/onramp-money/currencies'),
          fetch('/api/onramp-money/cryptos')
        ]);

        const currenciesData = await currenciesRes.json();
        const cryptosData = await cryptosRes.json();

        if (currenciesData.success) {
          setCurrencies(currenciesData.data);
        }

        if (cryptosData.success) {
          setCryptos(cryptosData.data);
          // Set default networks for USDT
          const usdtOption = cryptosData.data.find((c: CryptoOption) => c.coin === 'usdt');
          if (usdtOption) {
            setAvailableNetworks(usdtOption.networks);
          }
        }
      } catch (err) {
        console.error('Failed to fetch OnRamp Money config:', err);
        setError('Failed to load configuration');
      }
    };

    fetchConfig();
  }, []);

  // Update wallet address when connected
  useEffect(() => {
    if (walletAddress && !destinationWallet) {
      setDestinationWallet(walletAddress);
    }
  }, [walletAddress]);

  // Update available networks when crypto changes
  useEffect(() => {
    const selectedCrypto = cryptos.find(c => c.coin === cryptoCurrency);
    if (selectedCrypto) {
      setAvailableNetworks(selectedCrypto.networks);
      // Reset network to first available if current not supported
      if (!selectedCrypto.networks.includes(network)) {
        setNetwork(selectedCrypto.networks[0] || 'matic20');
      }
    }
  }, [cryptoCurrency, cryptos]);

  // Handle form submission
  const handleProceed = async () => {
    setError(null);

    // Validation
    if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!destinationWallet) {
      setError('Please enter your wallet address or connect your wallet');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(destinationWallet)) {
      setError('Invalid wallet address format');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/onramp-money/create-order', {
        method: 'POST',
        credentials: 'include', // Include session cookie for authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fiatAmount: parseFloat(fiatAmount),
          fiatCurrency,
          cryptoCurrency,
          network,
          walletAddress: destinationWallet,
          paymentMethod: parseInt(paymentMethod),
          phoneNumber: phoneNumber || undefined,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create OnRamp Money order');
      }

      console.log('OnRamp Money order created:', data.data);

      // Notify parent component
      if (onSwapInitiated) {
        onSwapInitiated(data.data);
      }

      // Redirect to OnRamp Money widget
      window.location.href = data.data.onrampUrl;

    } catch (err: any) {
      console.error('OnRamp Money order creation failed:', err);
      const errorMessage = err.message || 'Failed to initiate transaction';
      setError(errorMessage);

      if (onSwapError) {
        onSwapError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="w-5 h-5 text-blue-400" />
                OnRamp Money
              </CardTitle>
              <CardDescription className="mt-1">
                Buy crypto with fiat using instant payment methods
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              Powered by OnRamp.money
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Fiat Amount */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Amount to Pay</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-lg pr-24"
                disabled={loading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Select value={fiatCurrency} onValueChange={setFiatCurrency} disabled={loading}>
                  <SelectTrigger className="w-20 border-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported: INR, TRY, AED, MXN, VND, NGN
            </p>
          </div>

          {/* Crypto & Network Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cryptocurrency</Label>
              <Select value={cryptoCurrency} onValueChange={setCryptoCurrency} disabled={loading}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptos.map((crypto) => (
                    <SelectItem key={crypto.coin} value={crypto.coin}>
                      {crypto.coin.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Network</Label>
              <Select value={network} onValueChange={setNetwork} disabled={loading}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableNetworks.map((net) => (
                    <SelectItem key={net} value={net}>
                      {net.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              Destination Wallet
            </Label>
            <Input
              type="text"
              placeholder="0x..."
              value={destinationWallet}
              onChange={(e) => setDestinationWallet(e.target.value)}
              className="bg-slate-800/50 border-slate-600 font-mono text-sm"
              disabled={loading}
            />
            {!isAuthenticated && (
              <p className="text-xs text-yellow-400">
                Connect your wallet to auto-fill this field
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === '1' ? 'default' : 'outline'}
                className={`h-auto py-3 ${
                  paymentMethod === '1'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700'
                }`}
                onClick={() => setPaymentMethod('1')}
                disabled={loading}
              >
                <div className="flex flex-col items-center gap-1">
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs">Instant (UPI)</span>
                </div>
              </Button>
              <Button
                variant={paymentMethod === '2' ? 'default' : 'outline'}
                className={`h-auto py-3 ${
                  paymentMethod === '2'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700'
                }`}
                onClick={() => setPaymentMethod('2')}
                disabled={loading}
              >
                <div className="flex flex-col items-center gap-1">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Bank Transfer</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Optional: Phone Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Phone Number (Optional)</Label>
            <Input
              type="tel"
              placeholder="+91-9999999999"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-slate-800/50 border-slate-600"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +91 for India)
            </p>
          </div>

          {/* Info Alert */}
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-xs text-blue-200">
              You will be redirected to OnRamp Money to complete your payment. After payment, crypto will be sent directly to your wallet.
            </AlertDescription>
          </Alert>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Proceed Button */}
          <Button
            onClick={handleProceed}
            disabled={!isAuthenticated || loading || !fiatAmount || !destinationWallet}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Order...
              </>
            ) : !isAuthenticated ? (
              'Connect Wallet to Continue'
            ) : (
              <>
                Continue to OnRamp Money
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Features */}
          <div className="pt-4 border-t border-slate-700">
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="space-y-1">
                <div className="text-green-400 font-semibold">Fast</div>
                <div className="text-muted-foreground">Instant payments</div>
              </div>
              <div className="space-y-1">
                <div className="text-blue-400 font-semibold">Secure</div>
                <div className="text-muted-foreground">Licensed LP</div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-400 font-semibold">Global</div>
                <div className="text-muted-foreground">Multi-currency</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnRampMoneyWidget;
