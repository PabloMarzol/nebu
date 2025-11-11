import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface SwapSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  explorerUrl: string;
}

const SwapSuccessPopup: React.FC<SwapSuccessPopupProps> = ({
  isOpen,
  onClose,
  txHash,
  explorerUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Swap Successful!</h3>
          <p className="text-slate-300">Your transaction has been submitted successfully.</p>
        </div>

        {/* Transaction details */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <div className="text-sm text-slate-400 mb-2">Transaction Hash</div>
          <div className="text-white font-mono text-sm break-all font-medium">
            {txHash}
          </div>
        </div>

        {/* View on explorer button */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-600 hover:bg-slate-700 text-white"
          >
            Close
          </Button>
          <Button
            onClick={() => window.open(explorerUrl, '_blank')}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Explorer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwapSuccessPopup;
