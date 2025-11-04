import React, { useState, useEffect } from 'react';
import { useWalletAuth } from '../../hooks/useWalletAuth';

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
  const { isAuthenticated, walletAddress } = useWalletAuth();

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
        setError('Failed to load ALT5 configuration');
      }
    };

    fetchAlt5Config();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check authentication
    if (!isAuthenticated || !walletAddress) {
      setError('Please connect your wallet to use ALT5 on-ramp');
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

      // Create order with ALT5 custodial service
      const orderData = {
        gbpAmount,
        destinationWallet,
        targetToken,
        userId: walletAddress, // Use real wallet address from auth
        clientOrderId: `alt5_${Date.now()}`,
        paymentMethod: 'bank_transfer' // Default payment method
      };

      const response = await fetch('/api/alt5-custodial/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Display payment instructions to user
        console.log('ALT5 order created:', result.data);
        
        // Show payment instructions to user
        alert(`ALT5 order created successfully!\nOrder ID: ${result.data.orderId}\nPlease complete your payment using the payment method you selected. You will receive ${targetToken} at ${destinationWallet} once payment is confirmed.`);
        
        // In a real implementation, you would:
        // 1. Poll for order status updates
        // 2. Handle completion with real-time updates
        // 3. Show payment confirmation status
        
        if (onSwapComplete) {
          onSwapComplete(result.data);
        }
      } else {
        setError(result.message || 'Failed to create ALT5 order');
        if (onSwapError) {
          onSwapError(result.message);
        }
      }
    } catch (err) {
      console.error('Error creating ALT5 order:', err);
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Buy Crypto with GBP (ALT5 On-Ramp)</h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-4">
          <p>Please connect your wallet to use the ALT5 on-ramp service.</p>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Why use ALT5 On-Ramp?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Lower fees than traditional payment processors (2% vs 3-5%)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-50 mr-2">✓</span>
              <span>No chargeback risk - instant settlement after payment confirmation</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Global access - available in countries where Stripe may not operate</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-50 mr-2">✓</span>
              <span>Professional rates from institutional liquidity providers</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Direct crypto delivery to your wallet</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Buy Crypto with GBP (ALT5 On-Ramp)</h2>
      
      <form onSubmit={handleCreateOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (£)
          </label>
          <input
            type="number"
            value={fiatAmount}
            onChange={(e) => setFiatAmount(e.target.value)}
            min="25"
            max="50000"
            step="0.01"
            placeholder="Enter GBP amount (min £25, max £50,000)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Min: £25, Max: £50,000</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Token
          </label>
          <select
            value={targetToken}
            onChange={(e) => setTargetToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {supportedAssets.map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination Wallet
          </label>
          <input
            type="text"
            value={destinationWallet}
            onChange={(e) => setDestinationWallet(e.target.value)}
            placeholder="0x... Ethereum wallet address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-20 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Buy ${targetToken} with GBP`
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </form>

      {/* Display ALT5 benefits */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Why use ALT5 On-Ramp?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Lower fees than traditional payment processors (2% vs 3-5%)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>No chargeback risk - instant settlement after payment confirmation</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Global access - available in countries where Stripe may not operate</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Professional rates from institutional liquidity providers</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Direct crypto delivery to your wallet</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Alt5CustodialOnramp;
