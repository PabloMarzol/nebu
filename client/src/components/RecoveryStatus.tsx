import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecoveryStatusProps {
  paymentIntentId?: string;
  orderId?: string;
  onRecoveryComplete?: () => void;
}

interface RecoveryStatus {
  status: 'checking' | 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  details?: {
    fiatAmount?: number;
    targetToken?: string;
    estimatedOutput?: number;
    destinationWallet?: string;
    currentStep?: string;
    error?: string;
  };
  canRecover: boolean;
  recoverySteps?: string[];
}

export default function RecoveryStatus({ paymentIntentId, orderId, onRecoveryComplete }: RecoveryStatusProps) {
  const { toast } = useToast();
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus>({
    status: 'checking',
    message: 'Checking your payment status...',
    canRecover: false
  });
  const [isRecovering, setIsRecovering] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (paymentIntentId || orderId) {
      checkRecoveryStatus();
    }
  }, [paymentIntentId, orderId]);

  const checkRecoveryStatus = async () => {
    try {
      setRecoveryStatus({
        status: 'checking',
        message: 'Analyzing your payment and swap status...',
        canRecover: false
      });

      const response = await fetch('/api/recovery/check-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentIntentId, 
          orderId 
        })
      });

      const data = await response.json();

      if (!data.success) {
        setRecoveryStatus({
          status: 'failed',
          message: 'Unable to check recovery status',
          details: { error: data.error },
          canRecover: false
        });
        return;
      }

      const order = data.data.order;
      const needsRecovery = data.data.canRecover;
      const recoveryAction = data.data.recoveryAction;

      if (!needsRecovery) {
        setRecoveryStatus({
          status: 'completed',
          message: 'Your payment and swap completed successfully!',
          details: {
            fiatAmount: parseFloat(order.fiatAmount),
            targetToken: order.targetToken,
            estimatedOutput: parseFloat(order.targetTokenAmount),
            destinationWallet: order.destinationWallet
          },
          canRecover: false
        });
        return;
      }

      // Set up recovery-needed status
      setRecoveryStatus({
        status: 'pending',
        message: `Recovery needed: ${recoveryAction}`,
        details: {
          fiatAmount: parseFloat(order.fiatAmount),
          targetToken: order.targetToken,
          estimatedOutput: parseFloat(order.targetTokenAmount),
          destinationWallet: order.destinationWallet,
          currentStep: order.status,
          error: order.errorMessage
        },
        canRecover: true,
        recoverySteps: getRecoverySteps(order.status)
      });

    } catch (error) {
      console.error('Recovery check failed:', error);
      setRecoveryStatus({
        status: 'failed',
        message: 'Failed to check recovery status',
        details: { error: 'Network error' },
        canRecover: false
      });
    }
  };

  const getRecoverySteps = (status: string): string[] => {
    switch (status) {
      case 'STRIPE_CONFIRMED':
        return [
          '1. Payment confirmed successfully',
          '2. FX swap execution needed',
          '3. USDT transfer to your wallet'
        ];
      case 'SWAP_EXECUTING':
        return [
          '1. Payment confirmed',
          '2. Swap in progress - may have stalled',
          '3. Complete swap and transfer USDT'
        ];
      case 'SWAP_COMPLETED':
        return [
          '1. Payment and swap completed',
          '2. USDT transfer needed',
          '3. Final delivery to your wallet'
        ];
      default:
        return ['1. Complete recovery process', '2. Verify USDT delivery'];
    }
  };

  const handleRecovery = async () => {
    if (!recoveryStatus.details?.destinationWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to proceed with recovery",
        variant: "destructive"
      });
      return;
    }

    setIsRecovering(true);
    setRecoveryStatus(prev => ({
      ...prev,
      status: 'processing',
      message: 'Executing recovery process...'
    }));

    try {
      const response = await fetch('/api/recovery/execute-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: orderId || recoveryStatus.details?.orderId,
          force: true 
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecoveryStatus({
          status: 'completed',
          message: 'Recovery completed successfully!',
          details: {
            ...recoveryStatus.details,
            currentStep: 'COMPLETED'
          },
          canRecover: false
        });

        toast({
          title: "Recovery Successful! 🎉",
          description: "Your USDT has been sent to your wallet",
          duration: 5000
        });

        onRecoveryComplete?.();
      } else {
        throw new Error(data.message || 'Recovery failed');
      }

    } catch (error) {
      console.error('Recovery failed:', error);
      setRecoveryStatus({
        status: 'failed',
        message: 'Recovery process failed',
        details: { 
          ...recoveryStatus.details, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        },
        canRecover: true
      });

      toast({
        title: "Recovery Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const getStatusIcon = () => {
    switch (recoveryStatus.status) {
      case 'checking': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'processing': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (recoveryStatus.status) {
      case 'checking': return 'border-blue-500/30 bg-blue-500/10';
      case 'pending': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'processing': return 'border-blue-500/30 bg-blue-500/10';
      case 'completed': return 'border-green-500/30 bg-green-500/10';
      case 'failed': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  if (!paymentIntentId && !orderId) {
    return null; // Don't show if no payment to check
  }

  return (
    <Card className={`glass border-2 ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-lg">Payment Recovery Status</span>
          <Badge variant="outline" className="ml-auto">
            {recoveryStatus.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Message */}
        <div className="flex items-start space-x-2">
          {getStatusIcon()}
          <p className="text-sm text-muted-foreground flex-1">
            {recoveryStatus.message}
          </p>
        </div>

        {/* Recovery Steps */}
        {recoveryStatus.recoverySteps && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recovery Process:</h4>
            <div className="space-y-1">
              {recoveryStatus.recoverySteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    recoveryStatus.status === 'completed' ? 'bg-green-400' :
                    recoveryStatus.status === 'processing' && index === 0 ? 'bg-blue-400 animate-pulse' :
                    'bg-gray-400'
                  }`} />
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Toggle */}
        {recoveryStatus.details && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full justify-between"
            >
              <span>Transaction Details</span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            {showDetails && (
              <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>£{recoveryStatus.details.fiatAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected:</span>
                  <span>{recoveryStatus.details.estimatedOutput} {recoveryStatus.details.targetToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="font-mono text-xs">
                    {recoveryStatus.details.destinationWallet?.slice(0, 6)}...
                    {recoveryStatus.details.destinationWallet?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Status:</span>
                  <span>{recoveryStatus.details.currentStep}</span>
                </div>
                {recoveryStatus.details.error && (
                  <div className="flex justify-between text-red-400">
                    <span className="text-muted-foreground">Error:</span>
                    <span>{recoveryStatus.details.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Recovery Action */}
        {recoveryStatus.canRecover && (
          <div className="space-y-3 pt-4 border-t border-slate-700">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-300">
                  <p className="font-medium">Recovery Available</p>
                  <p>Your payment was successful but the crypto swap needs to be completed.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleRecovery}
              disabled={isRecovering}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              size="lg"
            >
              {isRecovering ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing Recovery...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Complete My Swap
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              This will execute the missing swap and send {recoveryStatus.details?.targetToken} to your wallet
            </p>
          </div>
        )}

        {/* Success State */}
        {recoveryStatus.status === 'completed' && (
          <div className="space-y-3 pt-4 border-t border-green-700">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-green-300">
                  <p className="font-medium">Recovery Complete!</p>
                  <p>Your {recoveryStatus.details?.targetToken} has been sent to your wallet.</p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => window.open(`https://etherscan.io/address/${recoveryStatus.details?.destinationWallet}`, '_blank')}
              className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Blockchain
            </Button>
          </div>
        )}

        {/* Failed State */}
        {recoveryStatus.status === 'failed' && (
          <div className="space-y-3 pt-4 border-t border-red-700">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-300">
                  <p className="font-medium">Recovery Failed</p>
                  <p>{recoveryStatus.details?.error || 'Please try again or contact support'}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={checkRecoveryStatus}
                variant="outline"
                className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                disabled={isRecovering}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => window.open('mailto:support@nebulaxexchange.io', '_blank')}
                variant="outline"
                className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
