import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownUp, Banknote } from 'lucide-react';
import CryptoSwapInterface from './CryptoSwapInterface';
import ProviderSwapTabs from './ProviderSwapTabs';

export default function SwapInterface() {
  const [activeTab, setActiveTab] = useState<'crypto' | 'fx'>('crypto');

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'crypto' | 'fx')} className="w-full">
        {/* Tab Selector */}
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-800/50 border border-slate-700 p-1">
          <TabsTrigger 
            value="crypto" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all"
          >
            <ArrowDownUp className="w-4 h-4 mr-2" />
            Crypto Swap
          </TabsTrigger>
          <TabsTrigger 
            value="fx"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all"
          >
            <Banknote className="w-4 h-4 mr-2" />
            FX Swap
          </TabsTrigger>
        </TabsList>

        {/* Crypto to Crypto Swap */}
        <TabsContent value="crypto" className="mt-0">
          <CryptoSwapInterface />
        </TabsContent>

        {/* Fiat to Crypto Swap - OnRamp Money Integration */}
        <TabsContent value="fx" className="mt-0">
          <ProviderSwapTabs defaultTab="onrampmoney" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
