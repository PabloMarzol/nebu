import React, { useState, useEffect } from 'react';
import Alt5CustodialOnramp from '../components/fx-swap/alt5-custodial-onramp';
import { useWalletAuth } from '../hooks/useWalletAuth';

const FXSwapPage: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<'alt5'>('alt5');
  const [swapHistory, setSwapHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, walletAddress } = useWalletAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSwapHistory();
    }
  }, [isAuthenticated]);

  const fetchSwapHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/fx-swap/history?userId=${walletAddress}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setSwapHistory(data);
    } catch (error) {
      console.error('Error fetching swap history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapComplete = (result: any) => {
    console.log('Swap completed:', result);
    // Refresh swap history
    if (isAuthenticated) {
      fetchSwapHistory();
    }
  };

  const handleSwapError = (error: any) => {
    console.error('Swap error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FX Swap Service</h1>
          <p className="text-lg text-gray-600">
            Buy cryptocurrency with GBP using our secure on-ramp services
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <Alt5CustodialOnramp 
            onSwapComplete={handleSwapComplete} 
            onSwapError={handleSwapError} 
          />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Rates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">BTC/GBP</p>
                <p className="font-medium">£50,245.32</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">ETH/GBP</p>
                <p className="font-medium">£3,125.45</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">USDT/GBP</p>
                <p className="font-medium">£0.99</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">SOL/GBP</p>
                <p className="font-medium">£125.67</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Swap History</h2>
          {loading ? (
            <div className="text-center py-4">
              <p>Loading swap history...</p>
            </div>
          ) : swapHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {swapHistory.map((swap, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(swap.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        £{swap.fiatAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {swap.targetToken}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          swap.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : swap.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {swap.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No swap history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FXSwapPage;
