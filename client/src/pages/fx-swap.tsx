import React from 'react';
import OnRampMoneyWidget from '../components/fx-swap/OnRampMoneyWidget';

const FXSwapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-80 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">NebulaX OnRamp</h1>
          <p className="text-lg text-gray-300">
            Buy crypto with fiat using instant payment methods
          </p>
        </div>

        <OnRampMoneyWidget />
      </div>
    </div>
  );
};

export default FXSwapPage;
