import React, { useState, useEffect } from 'react';
import { useWalletAuth } from '../../hooks/useWalletAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowDownUp, 
  Loader2, 
  Banknote, 
  Wallet,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { io, Socket } from 'socket.io-client';

interface Alt5CustodialOnrampProps {
  onSwapComplete?: (result: any) => void;
  onSwapError?: (error: any) => void;
}

const Alt5CustodialOnramp: React.FC<Alt5CustodialOnrampProps> = ({ 
  onSwapComplete, 
  onSwapError 
}) => {
  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [targetToken, setTargetToken] = useState<string>('USDT');
  const [destinationWallet, setDestinationWallet] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [supportedAssets, setSupportedAssets] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState<'form' | 'bankDetails' | 'completed'>('form');
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderProgress, setOrderProgress] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const { isAuthenticated, walletAddress } = useWalletAuth();

  // Copy to clipboard function
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Get supported assets and configuration on component mount
  useEffect(() => {
    const fetchAlt5Config = async () => {
      try {
        const response = await fetch('/api/alt5-custodial/config');
        const data = await response.json();
        
        if (data.success) {
          setConfig(data.data);
          setSupportedAssets(data.data.supportedTokens || []);
        } else {
          console.error('Failed to fetch ALT5 config:', data.message);
          setSupportedAssets(['USDT', 'USDC', 'BTC', 'ETH']);
        }
      } catch (err) {
        console.error('Error fetching ALT5 config:', err);
        setSupportedAssets(['USDT', 'USDC', 'BTC', 'ETH']);
        setError('Failed to load configuration');
      }
    };

    fetchAlt5Config();
  }, []);

  // WebSocket connection setup
  useEffect(() => {
    const socketInstance = io(window.location.origin, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setSocketConnected(false);
    });

    socketInstance.on('order-update', (update: any) => {
      console.log('Received order update:', update);
      if (update.orderId === orderId) {
        setOrderProgress(update.status);
        if (update.depositAddress) {
          setDepositAddress(update.depositAddress);
        }
        if (update.status === 'completed' || update.status === 'failed') {
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
        }
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setSocketConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Subscribe to order updates when orderId changes
  useEffect(() => {
    if (socket && orderId) {
      socket.emit('subscribe-order', orderId);
      console.log('Subscribed to order updates for:', orderId);
    }

    return () => {
      if (socket && orderId) {
        socket.emit('unsubscribe-order', orderId);
        console.log('Unsubscribed from order updates for:', orderId);
      }
    };
  }, [socket, orderId]);

  // Order polling function
  const startOrderPolling = async () => {
    if (!orderId) return;

    // Clear any existing polling interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Set up polling every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/alt5-trading/order-status/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json();

        if (result.success) {
          const status = result.data.status.toLowerCase();
          setOrderProgress(status as 'pending' | 'processing' | 'completed' | 'failed');

          // If order is completed, get the deposit address
          if (status === 'completed' && result.data.depositAddress) {
            setDepositAddress(result.data.depositAddress);
            clearInterval(interval);
            setPollingInterval(null);
          } else if (status === 'failed') {
            clearInterval(interval);
            setPollingInterval(null);
          }
        } else {
          console.error('Failed to fetch order status:', result.message);
        }
      } catch (err) {
        console.error('Error polling order status:', err);
      }
    }, 5000); // Poll every 5 seconds

    setPollingInterval(interval);
  };

  // Clean up polling interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check authentication
    if (!isAuthenticated || !walletAddress) {
      setError('Please connect your wallet to use the on-ramp service');
      setLoading(false);
      return;
    }

    try {
      // Validate inputs
      const gbpAmount = parseFloat(fiatAmount);
      if (isNaN(gbpAmount) || gbpAmount < 25 || gbpAmount > 50000) {
        setError('Amount must be between £25 and £50,000');
        setLoading(false);
        return;
      }

      if (!destinationWallet || !destinationWallet.startsWith('0x') || destinationWallet.length !== 42) {
        setError('Please enter a valid Ethereum wallet address');
        setLoading(false);
        return;
      }

      // Create order with custodial service
      const orderData = {
        gbpAmount,
        destinationWallet,
        targetToken,
        userId: walletAddress, // Use real wallet address from auth
        clientOrderId: `nebula_${Date.now()}`,
        paymentMethod: 'bank_transfer' // Default payment method
      };

      const response = await fetch('/api/alt5-trading/on-ramp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Display payment instructions with bank details
        console.log('On-ramp order created:', result.data);
        
        // Update state with order ID and bank details
        setOrderId(result.data.orderId || result.data.id);
        setBankDetails(result.data.bankDetails);
        setOrderStatus('bankDetails');
        
        if (onSwapComplete) {
          onSwapComplete(result.data);
        }
      } else {
        setError(result.message || 'Failed to create on-ramp order');
        if (onSwapError) {
          onSwapError(result.message);
        }
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order');
      if (onSwapError) {
        onSwapError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Card className="w-full mx-auto bg-white border-gray-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
            <Banknote className="w-5 h-5 text-blue-600" />
            Fiat to Crypto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Please connect your wallet to use the fiat on-ramp service.
            </AlertDescription>
          </Alert>
          
          <div className="text-center text-xs text-gray-500 pt-2">
            Powered by NebulaX Payment Network
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto bg-white border-gray-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
            <Banknote className="w-5 h-5 text-blue-600" />
            Fiat to Crypto
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {orderStatus === 'form' && (
          <>
            {/* GBP Amount Input */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <Label className="text-xs text-muted-foreground mb-2">You Pay</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  min="25"
                  max="50000"
                  step="0.01"
                  className="flex-1 bg-transparent border-none text-2xl font-bold p-0 h-auto focus-visible:ring-0"
                />
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg border border-slate-600">
                  <span className="font-semibold text-white">GBP</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>Min: £25, Max: £50,000</span>
              </div>
            </div>

            {/* Target Token Selection */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Label className="text-xs text-gray-600 mb-2">You Receive</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="text"
                  placeholder="Select token"
                  value={targetToken}
                  readOnly
                  className="flex-1 bg-transparent border-none text-2xl font-bold p-0 h-auto text-gray-500"
                />
                <select
                  value={targetToken}
                  onChange={(e) => setTargetToken(e.target.value)}
                  className="px-3 py-2 bg-white rounded-lg border border-gray-300 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {supportedAssets.map(asset => (
                    <option key={asset} value={asset}>{asset}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination Wallet */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Label className="text-xs text-gray-600 mb-2">Destination Wallet</Label>
              <div className="flex items-center gap-2 mt-2">
                <Wallet className="w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  value={destinationWallet}
                  onChange={(e) => setDestinationWallet(e.target.value)}
                  placeholder="0x... Ethereum wallet address"
                  className="flex-1 bg-transparent border-none text-sm p-0 h-auto focus-visible:ring-0 text-gray-900"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleCreateOrder}
              disabled={loading || !fiatAmount || !destinationWallet}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Buy ${targetToken} with GBP`
              )}
            </Button>

            {/* Powered by */}
            <div className="text-center text-xs text-muted-foreground pt-2">
              Powered by NebulaX Payment Network
            </div>
          </>
        )}

        {orderStatus === 'bankDetails' && bankDetails && (
          <div className="space-y-4">
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Your order has been created! Complete your bank transfer using the details below.
              </AlertDescription>
            </Alert>

            {/* Bank Details Card */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="font-medium text-white mb-4">Bank Transfer Details</h4>
              
              <div className="space-y-3">
                {[
                  { label: 'Account Number', value: bankDetails.accountNumber, field: 'accountNumber' },
                  { label: 'Routing Number', value: bankDetails.routingNumber, field: 'routingNumber' },
                  { label: 'Bank Name', value: bankDetails.bankName, field: 'bankName' },
                  { label: 'SWIFT Code', value: bankDetails.swiftCode, field: 'swiftCode' },
                  { label: 'IBAN', value: bankDetails.iban, field: 'iban' },
                  { label: 'Sort Code', value: bankDetails.sortCode, field: 'sortCode' },
                  { label: 'Reference', value: bankDetails.reference, field: 'reference' }
                ].map(({ label, value, field }) => (
                  <div key={field} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{label}:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white text-sm">{value}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(value, field)}
                      >
                        {copiedField === field ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <Alert className="bg-yellow-500/10 border-yellow-500/30">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200 text-sm">
                <ul className="space-y-1">
                  <li>• Include the reference number exactly as shown</li>
                  <li>• Transfer must be in GBP</li>
                  <li>• Processing typically takes 1-3 business days</li>
                  <li>• You will receive {targetToken} once payment is confirmed</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setOrderStatus('form')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  setOrderStatus('completed');
                  startOrderPolling();
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                I've Completed the Transfer
              </Button>
            </div>
          </div>
        )}

        {orderStatus === 'completed' && (
          <div className="space-y-4">
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Order Status: {orderProgress.charAt(0).toUpperCase() + orderProgress.slice(1)}
              </AlertDescription>
            </Alert>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  orderProgress === 'completed' ? 'bg-green-500 w-full' :
                  orderProgress === 'processing' ? 'bg-blue-500 w-3/4' :
                  orderProgress === 'pending' ? 'bg-yellow-500 w-1/4' :
                  'bg-red-500 w-full'
                }`}
              ></div>
            </div>

            {depositAddress && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h4 className="font-medium text-green-400 mb-3">Crypto Delivery Address</h4>
                <div className="flex items-center justify-between bg-slate-800 p-3 rounded border border-slate-600 mb-3">
                  <span className="font-mono text-xs text-white break-all">{depositAddress}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(depositAddress, 'depositAddress')}
                  >
                    {copiedField === 'depositAddress' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your {targetToken} will be delivered to: {destinationWallet}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setOrderStatus('bankDetails')}
                className="flex-1"
              >
                Back to Details
              </Button>
              <Button
                onClick={() => {
                  setOrderStatus('form');
                  setFiatAmount('');
                  setOrderId('');
                  setBankDetails(null);
                  setDepositAddress(null);
                  setOrderProgress('pending');
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                New Order
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Alt5CustodialOnramp;
