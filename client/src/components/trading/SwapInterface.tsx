import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownUp, Banknote } from 'lucide-react';
import CryptoSwapInterface from './CryptoSwapInterface';
import OnRampMoneyWidget from '../fx-swap/OnRampMoneyWidget';

export default function SwapInterface() {
  const [activeTab, setActiveTab] = useState<'crypto' | 'fx'>('crypto');

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'crypto' | 'fx')} className="w-full">
        {/* Tab Selector */}
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-800/50 border border-slate-700 p-1">
          <TabsTrigger 
            value="crypto" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-60 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all"
          >
            <ArrowDownUp className="w-4 h-4 mr-2" />
            Crypto Swap
          </TabsTrigger>
          <TabsTrigger 
            value="fx"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-60 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all"
          >
            <Banknote className="w-4 h-4 mr-2" />
            FX Swap
          </TabsTrigger>
        </TabsList>

        {/* Crypto to Crypto Swap */}
        <TabsContent value="crypto" className="mt-0">
          <CryptoSwapInterface />
        </TabsContent>

<<<<<<< HEAD
        {/* Fiat to Crypto Swap - Simplified to OnRamp Money only */}
        <TabsContent value="fx" className="mt-0">
          <OnRampMoneyWidget />
=======
        {/* Fiat to Crypto Swap - OnRamp Money Integration */}
        <TabsContent value="fx" className="mt-0">
          <ProviderSwapTabs defaultTab="onrampmoney" />
>>>>>>> d6aea94e8f211886155b80427b64130ee3695302
        </TabsContent>
      </Tabs>
    </div>
  );
}
