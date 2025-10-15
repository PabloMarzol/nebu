import { useState, useEffect } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { getSwapQuote, getTokenPrice, COMMON_TOKENS } from '@/lib/zeroXServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuickTradePanelProps {
  symbol: string; // "BTC/USDT"
  currentPrice: number;
  priceChange: number;
}



export default function QuickTradePanel({ symbol, currentPrice = 0.0, priceChange = 0.0 }: QuickTradePanelProps) {
  const { walletAddress, isAuthenticated } = useWalletAuth();
  
  
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedOutput, setEstimatedOutput] = useState<string>('');

  // Parse symbol to get base and quote tokens
  const [baseToken, quoteToken] = symbol.split('/');
  
  // Map symbol to token addresses (you can expand this)
  const getTokenAddress = (tokenSymbol: string) => {
    const tokenMap: Record<string, string> = {
      'BTC': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 
      'WBTC': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      'ETH': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 
      'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 
      'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      'SOL': '0xD31a59c85aE9D8edEFeC411D448f90841571b89c', 
      'ADA': '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47', 
    };
    
    return tokenMap[tokenSymbol] || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  };

  const getTokenDecimals = (tokenSymbol: string) => {
    const decimalsMap: Record<string, number> = {
      'BTC': 8,
      'WBTC': 8,
      'ETH': 18,
      'WETH': 18,
      'USDT': 6,
      'USDC': 6,
      'DAI': 18,
      'SOL': 9,
      'ADA': 18,
    };
    
    return decimalsMap[tokenSymbol] || 18;
  };


  

  const baseTokenAddress = getTokenAddress(baseToken);
  const quoteTokenAddress = getTokenAddress(quoteToken);
  const baseDecimals = getTokenDecimals(baseToken);
  const quoteDecimals = getTokenDecimals(quoteToken);

  // Calculate total or amount based on input
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setTotal('');
      setEstimatedOutput('');
      return;
    }

    const calculateEstimate = async () => {
      setIsLoadingQuote(true);
      setError(null);

      try {
        let sellToken, buyToken, sellAmount, sellDecimals, buyDecimals;

        if (orderType === 'buy') {
          // Buying base token with quote token (e.g., buying BTC with USDT)
          sellToken = quoteTokenAddress;
          buyToken = baseTokenAddress;
          sellDecimals = quoteDecimals;
          buyDecimals = baseDecimals;
          
          // Calculate how much quote token we need to spend
          const estimatedQuoteAmount = parseFloat(amount) * currentPrice;
          sellAmount = (estimatedQuoteAmount * Math.pow(10, sellDecimals)).toString();
        } else {
          // Selling base token for quote token (e.g., selling BTC for USDT)
          sellToken = baseTokenAddress;
          buyToken = quoteTokenAddress;
          sellDecimals = baseDecimals;
          buyDecimals = quoteDecimals;
          sellAmount = (parseFloat(amount) * Math.pow(10, sellDecimals)).toString();
        }

        const price = await getTokenPrice(sellToken, buyToken, sellAmount);
        
        const outputAmount = parseInt(price.buyAmount) / Math.pow(10, buyDecimals);
        setEstimatedOutput(outputAmount.toFixed(6));
        
        if (orderType === 'buy') {
          setTotal((parseFloat(amount) * currentPrice).toFixed(2));
        } else {
          setTotal(outputAmount.toFixed(2));
        }

      } catch (err: any) {
        console.error('Price estimate error:', err);
        setError('Failed to get price estimate');
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const timer = setTimeout(calculateEstimate, 500);
    return () => clearTimeout(timer);
  }, [amount, orderType, currentPrice, baseTokenAddress, quoteTokenAddress]);

  const handleTrade = async () => {
    if (!isAuthenticated || !walletAddress) {
      setError('Please connect your wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsExecuting(true);
    setError(null);

    try {
      let sellToken, buyToken, sellAmount;

      if (orderType === 'buy') {
        sellToken = quoteTokenAddress;
        buyToken = baseTokenAddress;
        const quoteAmount = parseFloat(amount) * currentPrice;
        sellAmount = (quoteAmount * Math.pow(10, quoteDecimals)).toString();
      } else {
        sellToken = baseTokenAddress;
        buyToken = quoteTokenAddress;
        sellAmount = (parseFloat(amount) * Math.pow(10, baseDecimals)).toString();
      }

      const quote = await getSwapQuote(sellToken, buyToken, sellAmount, walletAddress);

      if (window.ethereum) {
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: walletAddress,
            to: quote.transaction?.to,
            data: quote.transaction?.data,
            value: quote.transaction?.value || '0x0',
            gas: quote.transaction?.gas,
          }],
        });

        alert(`Trade executed! Transaction: ${txHash}`);
        setAmount('');
        setTotal('');
        setEstimatedOutput('');
      }
    } catch (err: any) {
      console.error('Trade execution error:', err);
      setError(err.message || 'Failed to execute trade');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quick Trade</span>
          <div className={`flex items-center text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            ${currentPrice > 0 ? currentPrice.toLocaleString() : '--'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-500">
              Buy {baseToken}
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500">
              Sell {baseToken}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label>Amount ({baseToken})</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Total ({quoteToken})</Label>
              <Input
                type="text"
                placeholder="0.0"
                value={total}
                readOnly
                className="bg-muted"
              />
            </div>

            {estimatedOutput && (
              <div className="text-sm text-muted-foreground">
                You'll receive approximately {estimatedOutput} {baseToken}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleTrade}
              disabled={!isAuthenticated || !amount || isExecuting || isLoadingQuote}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Buying...
                </>
              ) : isLoadingQuote ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Quote...
                </>
              ) : (
                `Buy ${baseToken}`
              )}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label>Amount ({baseToken})</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Total ({quoteToken})</Label>
              <Input
                type="text"
                placeholder="0.0"
                value={total}
                readOnly
                className="bg-muted"
              />
            </div>

            {estimatedOutput && (
              <div className="text-sm text-muted-foreground">
                You'll receive approximately {estimatedOutput} {quoteToken}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleTrade}
              disabled={!isAuthenticated || !amount || isExecuting || isLoadingQuote}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Selling...
                </>
              ) : isLoadingQuote ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Quote...
                </>
              ) : (
                `Sell ${baseToken}`
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {!isAuthenticated && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Connect your wallet to start trading
          </div>
        )}
      </CardContent>
    </Card>
  );
}