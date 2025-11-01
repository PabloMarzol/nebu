import { useState, useEffect } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { 
  getFxSwapQuote,
  getFxSwapLimits,
  createFxSwapPayment,
  formatFiat,
  formatCrypto,
  isValidEthereumAddress,
  type FiatCurrency,
  type TargetToken,
  type FxSwapQuote,
  type FxSwapLimits,
  FIAT_CURRENCIES,
  TARGET_TOKENS,
} from '@/lib/fxSwapServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  AlertCircle,
  ChevronDown,
  Wallet,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '@/components/StripePaymentForm';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_LIVE_KEY || '');


export default function FxSwapInterface() {
  const { walletAddress, isAuthenticated } = useWalletAuth();
  
  // Currency & Token selection
  const [fiatCurrency, setFiatCurrency] = useState<FiatCurrency>('GBP');
  const [targetToken, setTargetToken] = useState<TargetToken>('USDT');
  
  // Amount & Wallet
  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [destinationWallet, setDestinationWallet] = useState<string>('');
  const [useConnectedWallet, setUseConnectedWallet] = useState(true);
  
  // Quote & Limits
  const [quote, setQuote] = useState<FxSwapQuote | null>(null);
  const [limits, setLimits] = useState<FxSwapLimits | null>(null);
  
  // UI State
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isLoadingLimits, setIsLoadingLimits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Payment Dialog
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Currency & Token Pickers
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState(false);
  const [isTokenPickerOpen, setIsTokenPickerOpen] = useState(false);

  // Set destination wallet to connected wallet by default
  useEffect(() => {
    if (walletAddress && useConnectedWallet) {
      setDestinationWallet(walletAddress);
    }
  }, [walletAddress, useConnectedWallet]);

  // Load limits on mount
  useEffect(() => {
    loadLimits();
  }, []);

  // Get quote when amount changes
  useEffect(() => {
    if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
      setQuote(null);
      return;
    }

    const fetchQuote = async () => {
      setIsLoadingQuote(true);
      setError(null);
      
      try {
        const quoteData = await getFxSwapQuote(
          parseFloat(fiatAmount),
          fiatCurrency,
          targetToken
        );
        setQuote(quoteData);
      } catch (err: any) {
        console.error('Quote fetch error:', err);
        setError(err.message || 'Failed to get quote');
        setQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [fiatAmount, fiatCurrency, targetToken]);

  const loadLimits = async () => {
    setIsLoadingLimits(true);
    try {
      const limitsData = await getFxSwapLimits();
      setLimits(limitsData);
    } catch (err: any) {
      console.error('Failed to load limits:', err);
    } finally {
      setIsLoadingLimits(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!isAuthenticated || !walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const finalDestination = useConnectedWallet ? walletAddress : destinationWallet;
    
    if (!isValidEthereumAddress(finalDestination)) {
      setError('Invalid destination wallet address');
      return;
    }

    setError(null);

    try {
      // Store FX swap details for payment success page
      if (quote) {
        sessionStorage.setItem('fxSwapDetails', JSON.stringify({
          fiatAmount: parseFloat(fiatAmount),
          fiatCurrency,
          targetToken,
          estimatedOutput: quote.quote.estimatedOutput,
          destinationWallet: finalDestination
        }));
      }

      const payment = await createFxSwapPayment(
        parseFloat(fiatAmount),
        finalDestination,
        fiatCurrency,
        targetToken
      );

      setClientSecret(payment.clientSecret);
      setOrderId(payment.orderId);
      setIsPaymentDialogOpen(true);
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'Failed to initiate payment');
    }
  };
  
  const handlePaymentSuccess = () => {
    setIsPaymentDialogOpen(false);
    setFiatAmount('');
    setQuote(null);
    alert(`Payment successful! Your ${targetToken} will be sent to ${destinationWallet} shortly.`);
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const currencySymbol = FIAT_CURRENCIES[fiatCurrency].symbol;
  const minAmount = limits?.limits.minSwapAmountGbp || 10;
  const maxAmount = limits?.limits.maxSwapAmountGbp || 10000;

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">💷</span>
            FX Swap
            <span className="ml-auto text-xs font-normal text-muted-foreground bg-green-500/10 px-2 py-1 rounded-full">
              Fiat → Crypto
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Buy crypto with {FIAT_CURRENCIES[fiatCurrency].flag} {FIAT_CURRENCIES[fiatCurrency].name}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Fiat Currency Input */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <Label className="text-xs text-muted-foreground mb-2">You Pay</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="number"
                placeholder="0.00"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                className="flex-1 bg-transparent border-none text-2xl font-bold p-0 h-auto focus-visible:ring-0"
                min={minAmount}
                max={maxAmount}
                step="0.01"
              />
              
              <Button
                variant="outline"
                onClick={() => setIsCurrencyPickerOpen(true)}
                className="h-10 px-3 bg-slate-700/50 hover:bg-slate-700 border-slate-600"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{FIAT_CURRENCIES[fiatCurrency].flag}</span>
                  <span className="font-semibold">{fiatCurrency}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            </div>
            
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>Min: {currencySymbol}{minAmount}</span>
              <span>Max: {currencySymbol}{maxAmount}</span>
            </div>
          </div>

          {/* Arrow Separator */}
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
              <span className="text-xl">→</span>
            </div>
          </div>

          {/* Target Token Output */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <Label className="text-xs text-muted-foreground mb-2">You Receive</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="text"
                placeholder="0.00"
                value={quote ? formatCrypto(quote.quote.estimatedOutput) : ''}
                readOnly
                className="flex-1 bg-transparent border-none text-2xl font-bold p-0 h-auto text-muted-foreground"
              />
              
              <Button
                variant="outline"
                onClick={() => setIsTokenPickerOpen(true)}
                className="h-10 px-3 bg-slate-700/50 hover:bg-slate-700 border-slate-600"
              >
                <div className="flex items-center gap-2">
                  <img 
                    src={TARGET_TOKENS[targetToken].logo} 
                    alt={targetToken} 
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="font-semibold">{targetToken}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            </div>
            
            {quote && (
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>≈ ${formatCrypto(quote.quote.estimatedOutput, 2)}</span>
                <span className="text-green-400">+ {formatCrypto(quote.quote.estimatedOutput)} {targetToken}</span>
              </div>
            )}
          </div>

          {/* Destination Wallet */}
          <div className="bg-slate-800/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Destination Wallet
              </Label>
              <button
                onClick={() => setUseConnectedWallet(!useConnectedWallet)}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                {useConnectedWallet ? 'Use different wallet' : 'Use connected wallet'}
              </button>
            </div>
            
            {!useConnectedWallet && (
              <Input
                type="text"
                placeholder="0x..."
                value={destinationWallet}
                onChange={(e) => setDestinationWallet(e.target.value)}
                className="bg-slate-700 border-slate-600 font-mono text-sm"
              />
            )}
            
            {useConnectedWallet && walletAddress && (
              <div className="bg-slate-700/50 rounded px-3 py-2 font-mono text-xs text-muted-foreground">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
          </div>

          {/* Quote Details */}
          {quote && !isLoadingQuote && (
            <div className="bg-slate-800/30 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-medium">
                  1 {fiatCurrency} = ${quote.quote.fxRate.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee ({limits?.limits.platformFeePercent}%)</span>
                <span className="font-medium">{currencySymbol}{quote.quote.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Gas</span>
                <span className="font-medium">${quote.quote.gasFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between font-semibold">
                <span>Total Cost</span>
                <span className="text-green-400">{currencySymbol}{quote.quote.totalCost.toFixed(2)}</span>
              </div>
              
              <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 mt-3">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200">
                  Rate valid for 30 seconds. Minimum output: {formatCrypto(quote.quote.minimumOutput)} {targetToken}
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleInitiatePayment}
            disabled={!isAuthenticated || !fiatAmount || isLoadingQuote || !quote}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            size="lg"
          >
            {isLoadingQuote ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Getting Quote...
              </>
            ) : !isAuthenticated ? (
              'Connect Wallet'
            ) : !fiatAmount ? (
              'Enter Amount'
            ) : (
              <>
                Pay with Card
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Info Footer */}
          <div className="text-center text-xs text-muted-foreground pt-2 space-y-1">
            <p>Secure payment via Stripe</p>
            <p>Crypto delivered to your wallet in minutes</p>
          </div>
        </CardContent>
      </Card>

      {/* Currency Picker Dialog */}
      <Dialog open={isCurrencyPickerOpen} onOpenChange={setIsCurrencyPickerOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Select Currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {(Object.keys(FIAT_CURRENCIES) as FiatCurrency[]).map((currency) => (
              <button
                key={currency}
                onClick={() => {
                  setFiatCurrency(currency);
                  setIsCurrencyPickerOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800 transition-all duration-200 border ${
                  fiatCurrency === currency 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-transparent'
                }`}
              >
                <span className="text-3xl">{FIAT_CURRENCIES[currency].flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-lg">{currency}</div>
                  <div className="text-sm text-muted-foreground">
                    {FIAT_CURRENCIES[currency].name}
                  </div>
                </div>
                {fiatCurrency === currency && (
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Token Picker Dialog */}
      <Dialog open={isTokenPickerOpen} onOpenChange={setIsTokenPickerOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Select Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {(Object.keys(TARGET_TOKENS) as TargetToken[]).map((token) => (
              <button
                key={token}
                onClick={() => {
                  setTargetToken(token);
                  setIsTokenPickerOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800 transition-all duration-200 border ${
                  targetToken === token 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-transparent'
                }`}
              >
                <img 
                  src={TARGET_TOKENS[token].logo} 
                  alt={token} 
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-lg">{token}</div>
                  <div className="text-sm text-muted-foreground">
                    {TARGET_TOKENS[token].name}
                  </div>
                </div>
                {targetToken === token && (
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          {clientSecret && (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#3b82f6',
                    colorBackground: '#ffffff',
                    colorText: '#1f2937',
                    borderRadius: '8px',
                  },
                }
              }}
            >
              <StripePaymentForm 
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
          {!clientSecret && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Initializing payment...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
