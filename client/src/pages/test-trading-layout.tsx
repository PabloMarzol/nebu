import { useState } from "react";
import StandaloneTrading from "./standalone-trading";

export default function TestTradingLayout() {
  const [tradingMode, setTradingMode] = useState<'spot' | 'futures'>('spot');

  return (
    <div className="min-h-screen bg-[#0b0e11]">
      {/* Simple Mode Switcher */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-[#1a1d24] border border-slate-700 rounded-lg p-2 flex space-x-2">
          <button
            onClick={() => setTradingMode('spot')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              tradingMode === 'spot'
                ? 'bg-[#00c2b2]/20 text-[#00c2b2] border border-[#00c2b2]/30'
                : 'text-[#a1a1a1] hover:text-white'
            }`}
          >
            Spot Trading
          </button>
          <button
            onClick={() => setTradingMode('futures')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              tradingMode === 'futures'
                ? 'bg-[#00c2b2]/20 text-[#00c2b2] border border-[#00c2b2]/30'
                : 'text-[#a1a1a1] hover:text-white'
            }`}
          >
            Futures Trading
          </button>
        </div>
      </div>

      {/* Standalone Trading Interface */}
      <StandaloneTrading tradingMode={tradingMode} />
    </div>
  );
}
