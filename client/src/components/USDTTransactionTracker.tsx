import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface USDTTransactionTrackerProps {
  paymentIntentId: string;
  expectedAmount: number;
  destinationWallet: string;
  onTransactionComplete?: (txHash: string) => void;
}

interface TransactionStatus {
  status: 'checking' | 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  txHash?: string;
  confirmations?: number;
  currentStep?: string;
  error?: string;
}

export default function USDTTransactionTracker({ 
  paymentIntentId, 
  expectedAmount, 
  destinationWallet, 
  onTransactionComplete 
}: USDTTransactionTrackerProps) {
  const { toast } = useToast();
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>({
    status: 'checking',
    message: 'Checking your USDT transaction status...',
    currentStep: 'initializing'
  });
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (paymentIntentId) {
      checkTransactionStatus();
      // Set up polling for real-time updates
      const interval = setInterval(checkTransactionStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [paymentIntentId]);

  const checkTransactionStatus = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    
    try {
      const response = await fetch('/api/recovery/check-usdt-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentIntentId,
          destinationWallet 
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to check transaction status');
      }

      const status = data.data;
      
      // Update status based on response
      if (status.status === 'completed' && status.txHash) {
        setTransactionStatus({
          status: 'completed',
          message: 'USDT has been successfully sent to your wallet!',
          txHash: status.txHash,
          confirmations: status.confirmations || 0,
          currentStep: 'completed'
        });

        // Notify parent component
        if (onTransactionComplete && status.txHash) {
          onTransactionComplete(status.txHash);
        }

        // Show success toast
        toast({
          title: "USDT Transaction Complete! 🎉",
          description: `${expectedAmount} USDT has been sent to your wallet.`,
          duration: 5000,
        });

      } else if (status.status === 'processing') {
        setTransactionStatus({
          status: 'processing',
          message: 'USDT transaction is being processed...',
          confirmations: status.confirmations,
          currentStep: 'processing'
        });

      } else if (status.status === 'pending') {
        setTransactionStatus({
          status: 'pending',
          message: 'Waiting for USDT transaction to be initiated...',
          currentStep: 'pending'
        });

      } else if (status.status === 'failed') {
        setTransactionStatus({
          status: 'failed',
          message: status.error || 'USDT transaction failed',
          error: status.error,
          currentStep: 'failed'
        });

        toast({
          title: "Transaction Failed",
          description: status.error || "USDT transaction could not be completed",
          variant: "destructive",
        });

      } else {
        // Still checking/unknown status
        setTransactionStatus({
          status: 'checking',
          message: 'Checking USDT transaction status...',
          currentStep: 'checking'
        });
      }

    } catch (error: any) {
      console.error('USDT status check failed:', error);
      setTransactionStatus({
        status: 'failed',
        message: 'Failed to check transaction status',
        error: error.message,
        currentStep: 'error'
      });

      toast({
        title: "Status Check Failed",
        description: "Unable to check USDT transaction status",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = () => {
    switch (transactionStatus.status) {
      case 'checking': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'processing': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (transactionStatus.status) {
      case 'checking': return 'border-blue-500/30 bg-blue-500/10';
      case 'pending': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'processing': return 'border-blue-500/30 bg-blue-500/10';
      case 'completed': return 'border-green-500/30 bg-green-500/10';
      case 'failed': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const handleViewOnExplorer = () => {
    if (transactionStatus.txHash) {
      window.open(`https://etherscan.io/tx/${transactionStatus.txHash}`, '_blank');
    }
  };

  const handleManualCheck = () => {
    checkTransactionStatus();
  };

  return (
    <div className={`space-y-4 p-4 rounded-lg border-2 ${getStatusColor()}`}>
      {/* Status Header */}
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <h4 className="font-semibold text-white">USDT Transaction Status</h4>
          <p className="text-sm text-muted-foreground">{transactionStatus.message}</p>
        </div>
        <Badge variant="outline" className="capitalize">
          {transactionStatus.status}
        </Badge>
      </div>

      {/* Transaction Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Expected Amount:</span>
          <div className="text-white font-medium">{expectedAmount} USDT</div>
        </div>
        <div>
          <span className="text-muted-foreground">Destination:</span>
          <div className="font-mono text-xs">
            {destinationWallet.slice(0, 6)}...{destinationWallet.slice(-4)}
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      {transactionStatus.status === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Confirmations</span>
            <span>{transactionStatus.confirmations || 0}/12</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((transactionStatus.confirmations || 0) / 12 * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Transaction Hash */}
      {transactionStatus.txHash && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Transaction Hash:</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleViewOnExplorer}
              className="text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View on Explorer
            </Button>
          </div>
          <div className="font-mono text-xs bg-slate-800/50 p-2 rounded border border-slate-600 break-all">
            {transactionStatus.txHash}
          </div>
        </div>
      )}

      {/* Success State */}
      {transactionStatus.status === 'completed' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-green-300">
              <p className="font-medium">Transaction Complete!</p>
              <p>Your USDT has been successfully delivered to your wallet.</p>
            </div>
          </div>
        </div>
      )}

      {/* Failed State */}
      {transactionStatus.status === 'failed' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-300">
              <p className="font-medium">Transaction Failed</p>
              <p>{transactionStatus.error || 'The USDT transaction could not be completed.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Check Button */}
      {(transactionStatus.status === 'checking' || transactionStatus.status === 'pending') && (
        <Button
          onClick={handleManualCheck}
          disabled={isChecking}
          variant="outline"
          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          size="sm"
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Status
            </>
          )}
        </Button>
      )}
    </div>
  );
}
