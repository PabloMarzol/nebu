import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink, Loader2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RecoveryStatus from '@/components/RecoveryStatus';
import USDTTransactionTracker from '@/components/USDTTransactionTracker';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [fxSwapDetails, setFxSwapDetails] = useState<any>(null);

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    const redirectStatus = urlParams.get('redirect_status');

    if (paymentIntent && redirectStatus === 'succeeded') {
      setPaymentDetails({
        paymentIntentId: paymentIntent,
        status: redirectStatus,
        clientSecret: paymentIntentClientSecret
      });

      // Try to get FX swap details from session storage or local storage
      const storedDetails = sessionStorage.getItem('fxSwapDetails');
      if (storedDetails) {
        setFxSwapDetails(JSON.parse(storedDetails));
        // Clear the stored details after retrieving
        sessionStorage.removeItem('fxSwapDetails');
      }

      // Auto-create FX swap order if we have payment details but no stored details
      if (!storedDetails && paymentIntent) {
        autoCreateSwapOrder(paymentIntent);
      }
    }

    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const autoCreateSwapOrder = async (paymentIntentId: string) => {
    try {
      console.log('[Payment Success] Auto-creating FX swap order for payment:', paymentIntentId);
      
      // Try to get swap details from different sources
      let swapDetails = null;
      
      // Check localStorage as fallback
      const localStorageDetails = localStorage.getItem('fxSwapDetails');
      if (localStorageDetails) {
        swapDetails = JSON.parse(localStorageDetails);
        localStorage.removeItem('fxSwapDetails');
      }
      
      // If still no details, try to get from API based on payment intent
      if (!swapDetails) {
        const response = await fetch('/api/recovery/get-payment-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            swapDetails = data.data;
          }
        }
      }

      if (swapDetails) {
        console.log('[Payment Success] Found swap details, creating order:', swapDetails);
        
        // Create the FX swap order
        const createResponse = await fetch('/api/manual/trigger-fx-swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntentId,
            userId: swapDetails.userId || 'cd58399b-b81c-4e1a-bc8c-a41cc76e4325', // Default user
            fiatAmount: swapDetails.fiatAmount,
            destinationWallet: swapDetails.destinationWallet,
            clientOrderId: `FX_auto_${Date.now()}`
          })
        });

        const result = await createResponse.json();
        
        if (result.success) {
          console.log('[Payment Success] Auto-created swap order successfully:', result.data);
          setFxSwapDetails({
            fiatAmount: swapDetails.fiatAmount,
            fiatCurrency: swapDetails.fiatCurrency || 'GBP',
            targetToken: 'USDT',
            estimatedOutput: result.data.estimatedOutput,
            destinationWallet: swapDetails.destinationWallet,
            orderId: result.data.orderId
          });
          
          toast({
            title: "Swap Order Created!",
            description: "Your FX swap order has been created automatically.",
            duration: 3000,
          });
        } else {
          console.error('[Payment Success] Failed to auto-create swap order:', result.error);
          
          // Show recovery option
          toast({
            title: "Swap Order Creation Failed",
            description: "Please use the recovery option below to complete your swap.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } else {
        console.log('[Payment Success] No swap details found, user will need to use recovery');
      }
    } catch (error) {
      console.error('[Payment Success] Error auto-creating swap order:', error);
      
      toast({
        title: "Auto-creation Failed",
        description: "Please use the recovery option below to complete your swap.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleContinueTrading = () => {
    setLocation('/trading');
  };

  const handleViewPortfolio = () => {
    setLocation('/portfolio');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Processing Payment Success</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-red-400">Payment Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We couldn't verify your payment details. Please contact support if you believe this is an error.
            </p>
            <Button onClick={() => setLocation('/support')} className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-400">Payment Successful!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Your FX swap payment has been processed successfully
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-400">Payment Confirmed</h3>
                <p className="text-sm text-green-200">
                  Your GBP to USDT swap is being processed. Your crypto will be sent to your wallet shortly.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Payment Details</h3>
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID:</span>
                <span className="font-mono text-sm">
                  {paymentDetails.paymentIntentId?.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {paymentDetails.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Type:</span>
                <span className="text-white">
                  {fxSwapDetails ? `FX Swap (${fxSwapDetails.fiatCurrency} → ${fxSwapDetails.targetToken})` : 'FX Swap'}
                </span>
              </div>
              {fxSwapDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="text-white">
                      {fxSwapDetails.fiatAmount} {fxSwapDetails.fiatCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Output:</span>
                    <span className="text-white">
                      {fxSwapDetails.estimatedOutput} {fxSwapDetails.targetToken}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">What happens next?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p>Your payment has been confirmed and the swap process has been initiated</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p>
                  {fxSwapDetails ? `${fxSwapDetails.targetToken} will be sent to your connected wallet within a few minutes` : 'Your crypto will be sent to your connected wallet within a few minutes'}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p>You'll receive a notification when the transaction is complete</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button 
              onClick={handleContinueTrading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue Trading
            </Button>
            <Button 
              onClick={handleViewPortfolio}
              variant="outline"
              className="border-slate-600 hover:bg-slate-700"
            >
              View Portfolio
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-slate-700">
            <p>Need help? Contact our support team if you have any questions.</p>
          </div>

          {/* USDT Transaction Status - Real-time updates */}
          {paymentDetails?.paymentIntentId && fxSwapDetails && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>USDT Transaction Status</span>
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                      Live Updates
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <USDTTransactionTracker 
                    paymentIntentId={paymentDetails.paymentIntentId}
                    expectedAmount={fxSwapDetails.estimatedOutput}
                    destinationWallet={fxSwapDetails.destinationWallet}
                    onTransactionComplete={(txHash) => {
                      toast({
                        title: "USDT Delivered! 🎉",
                        description: "Your USDT has been sent to your wallet successfully.",
                        duration: 5000,
                      });
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recovery Status - Only shows if needed */}
          {paymentDetails?.paymentIntentId && (
            <div className="mt-6">
              <RecoveryStatus 
                paymentIntentId={paymentDetails.paymentIntentId}
                onRecoveryComplete={() => {
                  toast({
                    title: "Recovery Complete!",
                    description: "Your swap has been completed successfully.",
                  });
                  // Refresh to show updated status
                  setTimeout(() => window.location.reload(), 1000);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
