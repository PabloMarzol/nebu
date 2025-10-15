import { useState, useEffect } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { 
  getSwapQuote, 
  getTokenPrice, 
  fetchTokenList, 
  searchTokens,
  getTokensForChain,
  type Token, 
  type SwapQuote 
} from '@/lib/zeroXServices';
import { SUPPORTED_CHAINS, getChainById } from '@/lib/chains';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowDownUp, 
  Loader2, 
  AlertCircle, 
  Network, 
  Settings,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SwapInterface() {
  const { walletAddress, isAuthenticated, chainId } = useWalletAuth();
  
  // Token lists
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  
  // Token selection
  const [sellToken, setSellToken] = useState<Token | null>(null);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  
  // Token picker
  const [isTokenPickerOpen, setIsTokenPickerOpen] = useState(false);
  const [tokenPickerMode, setTokenPickerMode] = useState<'sell' | 'buy'>('sell');
  const [tokenSearchQuery, setTokenSearchQuery] = useState('');

  const [tradingMode, setTradingMode] = useState<'swap' | 'spot' | 'perps'>('swap');

  
  const currentChain = getChainById(chainId);
  
  // Load tokens when chain changes
  useEffect(() => {
    loadTokens();
  }, [chainId]);
  
  const loadTokens = async () => {
    setIsLoadingTokens(true);
    try {
      const tokens = await fetchTokenList(chainId);
      console.log('Loaded tokens:', tokens.length);
      console.log('First 10 tokens:', tokens.slice(0, 10));
      
      setAllTokens(tokens);
      
      // Set default tokens - find ETH and USDC
      const ethToken = tokens.find(t => 
        t.symbol === 'ETH' || 
        t.symbol === 'WETH' ||
        t.address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      );
      
      const usdcToken = tokens.find(t => t.symbol === 'USDC');
      
      console.log('Found ETH token:', ethToken);
      console.log('Found USDC token:', usdcToken);
      
      if (ethToken && usdcToken) {
        setSellToken(ethToken);
        setBuyToken(usdcToken);
      } else if (tokens.length >= 2) {
        setSellToken(tokens[0]);
        setBuyToken(tokens[1]);
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
      const fallbackTokens = getTokensForChain(chainId);
      console.log('Using fallback tokens:', fallbackTokens);
      setAllTokens(fallbackTokens);
      setSellToken(fallbackTokens[0]);
      setBuyToken(fallbackTokens[1]);
    } finally {
      setIsLoadingTokens(false);
    }
  };
  
  // Amounts
  const [sellAmount, setSellAmount] = useState<string>('');
  const [buyAmount, setBuyAmount] = useState<string>('');
  
  // UI state
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [priceImpact, setPriceImpact] = useState<string>('0');
  const [slippage, setSlippage] = useState<string>('0.5');

  // TX Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('20'); // minutes
  const [expertMode, setExpertMode] = useState(false);
  const [autoRouter, setAutoRouter] = useState(true);

  const isChainSupported = SUPPORTED_CHAINS[chainId] !== undefined;

  // Get price quote when sell amount changes
  useEffect(() => {
    if (!sellAmount || parseFloat(sellAmount) <= 0 || !isChainSupported || !sellToken || !buyToken) {
      setBuyAmount('');
      setQuote(null);
      setPriceImpact('0');
      return;
    }

    const fetchPrice = async () => {
      setIsLoadingQuote(true);
      setError(null);
      
      try {
        const sellAmountWei = (parseFloat(sellAmount) * Math.pow(10, sellToken.decimals)).toString();
        
        const price = await getTokenPrice(
          sellToken.address,
          buyToken.address,
          sellAmountWei,
          chainId
        );
        
        const buyAmountReadable = (parseInt(price.buyAmount) / Math.pow(10, buyToken.decimals)).toFixed(6);
        setBuyAmount(buyAmountReadable);
        
        // Calculate price impact - FIXED
        const sellAmt = parseFloat(sellAmount);
        const buyAmt = parseFloat(buyAmountReadable);
        const priceFromQuote = parseFloat(price.price);
        
        if (sellAmt > 0 && buyAmt > 0 && !isNaN(priceFromQuote) && priceFromQuote > 0) {
          // Expected rate: how much buy token per sell token
          const expectedRate = buyAmt / sellAmt;
          // Actual rate from API (might be inverted, so check)
          const actualRate = priceFromQuote > 1 ? priceFromQuote : 1 / priceFromQuote;
          
          // Calculate impact
          const impact = Math.abs(((expectedRate - actualRate) / actualRate) * 100);
          setPriceImpact(impact.toFixed(2));
        } else {
          setPriceImpact('< 0.01');
        }
        
      } catch (err: any) {
        console.error('Price fetch error:', err);
        setError(err.message || 'Failed to get price quote');
        setBuyAmount('');
        setPriceImpact('0');
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const timer = setTimeout(fetchPrice, 500);
    return () => clearTimeout(timer);
  }, [sellAmount, sellToken, buyToken, chainId, isChainSupported]);

  // Open token picker
  const openTokenPicker = (mode: 'sell' | 'buy') => {
    setTokenPickerMode(mode);
    setTokenSearchQuery('');
    setIsTokenPickerOpen(true);
  };

  // Select token from picker
  const selectToken = (token: Token) => {
    if (tokenPickerMode === 'sell') {
      setSellToken(token);
      if (buyToken?.address === token.address) {
        setBuyToken(sellToken);
      }
    } else {
      setBuyToken(token);
      if (sellToken?.address === token.address) {
        setSellToken(buyToken);
      }
    }
    setIsTokenPickerOpen(false);
  };

  // Swap tokens
  const handleSwapDirection = () => {
    const temp = sellToken;
    setSellToken(buyToken);
    setBuyToken(temp);
    setSellAmount(buyAmount);
    setBuyAmount('');
  };

  // Switch network
  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        const chain = SUPPORTED_CHAINS[targetChainId];
        if (chain) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrl],
              blockExplorerUrls: [chain.blockExplorer],
            }],
          });
        }
      }
    }
  };

  // Execute swap
  const handleSwap = async () => {
    if (!isAuthenticated || !walletAddress || !sellAmount || !sellToken || !buyToken) {
      setError('Please connect wallet and enter amount');
      return;
    }

    if (!isChainSupported) {
      setError('Please switch to a supported network');
      return;
    }

    setIsSwapping(true);
    setError(null);

    try {
      const sellAmountWei = (parseFloat(sellAmount) * Math.pow(10, sellToken.decimals)).toString();
      
      const swapQuote = await getSwapQuote(
        sellToken.address,
        buyToken.address,
        sellAmountWei,
        walletAddress,
        chainId
      );
      
      setQuote(swapQuote);

      if (swapQuote.issues?.allowance) {
        setError('Token approval required. Please approve spending first.');
        return;
      }

      if (window.ethereum) {
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: walletAddress,
            to: swapQuote.transaction?.to,
            data: swapQuote.transaction?.data,
            value: swapQuote.transaction?.value || '0x0',
            gas: swapQuote.transaction?.gas,
          }],
        });

        const explorerUrl = `${currentChain?.blockExplorer}/tx/${txHash}`;
        alert(`Swap submitted!\n\nView on explorer: ${explorerUrl}`);
        
        setSellAmount('');
        setBuyAmount('');
        setQuote(null);
      }
    } catch (err: any) {
      console.error('Swap error:', err);
      setError(err.message || 'Failed to execute swap');
    } finally {
      setIsSwapping(false);
    }
  };

  const filteredTokens = searchTokens(allTokens, tokenSearchQuery);

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ArrowDownUp className="w-5 h-5 text-purple-400" />
              Swap
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsSettingsOpen(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Network indicator */}
          <div className="flex items-center gap-2 text-sm mt-2">
            <div className={`w-2 h-2 rounded-full ${isChainSupported ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-muted-foreground">
              {currentChain?.name || 'Unknown Network'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Unsupported network warning */}
          {!isChainSupported && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="text-sm">This network is not supported for swaps.</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => switchNetwork(1)}
                    >
                      Switch to Mainnet
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => switchNetwork(11155111)}
                    >
                      Switch to Sepolia
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Testnet warning */}
          {chainId === 11155111 && (
            <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/30">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200 text-xs">
                <strong>Testnet Mode:</strong> Using simulated prices. Switch to Mainnet for real trading.
              </AlertDescription>
            </Alert>
          )}

          {/* Sell Token Section */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <Label className="text-xs text-muted-foreground mb-2">You Pay</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="number"
                placeholder="0.0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="flex-1 bg-transparent border-none text-2xl font-bold p-0 h-auto focus-visible:ring-0"
                disabled={!isChainSupported || !sellToken}
              />
              
              <Button
                variant="outline"
                onClick={() => openTokenPicker('sell')}
                disabled={!isChainSupported}
                className="h-10 px-3 bg-slate-700/50 hover:bg-slate-700 border-slate-600"
              >
                {sellToken ? (
                  <div className="flex items-center gap-2">
                    {sellToken.logoURI && (
                      <img src={sellToken.logoURI} alt={sellToken.symbol} className="w-5 h-5 rounded-full" />
                    )}
                    <span className="font-semibold">{sellToken.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                ) : (
                  <span>Select</span>
                )}
              </Button>
            </div>
            
            {sellToken && (
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>~$0.00</span>
                <span>Balance: 0.00</span>
              </div>
            )}
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapDirection}
              className="rounded-full h-10 w-10 bg-slate-800 hover:bg-slate-700 border-slate-600"
              disabled={!isChainSupported || !sellToken || !buyToken}
            >
              <ArrowDownUp className="w-5 h-5" />
            </Button>
          </div>

          {/* Buy Token Section */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <Label className="text-xs text-muted-foreground mb-2">You Receive</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="number"
                placeholder="0.0"
                value={buyAmount}
                readOnly
                className="flex-1 bg-transparent border-none text-2xl font-bold p-0 h-auto text-muted-foreground"
              />
              
              <Button
                variant="outline"
                onClick={() => openTokenPicker('buy')}
                disabled={!isChainSupported}
                className="h-10 px-3 bg-slate-700/50 hover:bg-slate-700 border-slate-600"
              >
                {buyToken ? (
                  <div className="flex items-center gap-2">
                    {buyToken.logoURI && (
                      <img src={buyToken.logoURI} alt={buyToken.symbol} className="w-5 h-5 rounded-full" />
                    )}
                    <span className="font-semibold">{buyToken.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                ) : (
                  <span>Select</span>
                )}
              </Button>
            </div>
            
            {buyToken && (
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>~$0.00</span>
              </div>
            )}
          </div>

          {/* Swap Details */}
          {buyAmount && isChainSupported && sellToken && buyToken && !isLoadingQuote && (
            <div className="bg-slate-800/30 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-medium">
                  1 {sellToken.symbol} = {(parseFloat(buyAmount) / parseFloat(sellAmount) || 0).toFixed(6)} {buyToken.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Impact</span>
                <span className={`font-medium ${
                  parseFloat(priceImpact) > 5 ? 'text-red-400' : 
                  parseFloat(priceImpact) > 1 ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>
                  {priceImpact === '0' || !priceImpact ? '< 0.01%' : `${priceImpact}%`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Slippage</span>
                <span className="font-medium">{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deadline</span>
                <span className="font-medium">{deadline} min</span>
              </div>
              {expertMode && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                  <AlertCircle className="w-3 h-3" />
                  Expert Mode Active
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!isAuthenticated || !sellAmount || isSwapping || isLoadingQuote || !isChainSupported || !sellToken || !buyToken}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {isSwapping ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Swapping...
              </>
            ) : isLoadingQuote ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Getting Quote...
              </>
            ) : !isAuthenticated ? (
              'Connect Wallet'
            ) : !isChainSupported ? (
              'Unsupported Network'
            ) : !sellToken || !buyToken ? (
              'Select Tokens'
            ) : (
              'Swap'
            )}
          </Button>

          {/* Powered by */}
          <div className="text-center text-xs text-muted-foreground pt-2">
            Powered by 0x Protocol
          </div>
        </CardContent>
      </Card>




      {/* Token Picker Dialog - Complete structural isolation */}
      <Dialog open={isTokenPickerOpen} onOpenChange={setIsTokenPickerOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 p-0 overflow-visible">
          {/* Isolated Header with Search - Force separate stacking context */}
          <div className="relative z-20 bg-slate-900">
            <div className="px-6 pt-6 pb-4">
              <DialogTitle>Select a token</DialogTitle>
            </div>
            
            {/* Search Bar - Absolute positioning to escape container */}
            <div className="px-6 pb-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or symbol"
                  value={tokenSearchQuery}
                  onChange={(e) => setTokenSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 focus-visible:ring-purple-500 w-full"
                />
                {tokenSearchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-slate-700"
                    onClick={() => setTokenSearchQuery('')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            {/* Visual separator with higher z-index */}
            <div className="h-px bg-slate-700 relative z-30"></div>
          </div>

          {/* Token List Container - Separate stacking context */}
          <div className="relative z-10 max-h-[50vh] overflow-y-auto bg-slate-900 pt-2">
            <div className="p-6">
              {isLoadingTokens ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  <span className="ml-3 text-muted-foreground">Loading tokens...</span>
                </div>
              ) : filteredTokens.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-xl mb-3">No tokens found</div>
                  <div className="text-sm opacity-75">Try searching with a different term</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTokens.map((token) => (
                    <button
                      key={token.address}
                      onClick={() => selectToken(token)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800 transition-all duration-200 group border border-transparent hover:border-purple-500/30"
                    >
                      <div className="flex-shrink-0 w-10 h-10">
                        {token.logoURI ? (
                          <img 
                            src={token.logoURI} 
                            alt={token.symbol} 
                            className="w-10 h-10 rounded-full group-hover:scale-110 transition-transform duration-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center ${token.logoURI ? 'hidden' : ''}`}>
                          <span className="text-sm font-bold text-purple-400">
                            {token.symbol.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-white text-lg">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {token.name}
                        </div>
                      </div>
                      {(sellToken?.address === token.address || buyToken?.address === token.address) && (
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Transaction Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Slippage Tolerance Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Slippage Tolerance</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum price difference you'll accept
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSlippage('0.5');
                    setCustomSlippage('');
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Reset to 0.5%
                </button>
              </div>
              
              {/* Preset slippage buttons */}
              <div className="grid grid-cols-4 gap-3">
                {['0.1', '0.5', '1.0'].map((preset) => (
                  <Button
                    key={preset}
                    variant={slippage === preset && !customSlippage ? 'default' : 'outline'}
                    size="default"
                    onClick={() => {
                      setSlippage(preset);
                      setCustomSlippage('');
                    }}
                    className={`text-sm font-medium ${
                      slippage === preset && !customSlippage 
                        ? 'bg-purple-600 hover:bg-purple-700 border-purple-500' 
                        : 'hover:bg-slate-800 border-slate-600'
                    }`}
                  >
                    {preset}%
                  </Button>
                ))}
                
                {/* Custom slippage input */}
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Custom"
                    value={customSlippage}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomSlippage(value);
                      if (value) setSlippage(value);
                    }}
                    className="text-sm bg-slate-800 border-slate-600 pr-8"
                    step="0.1"
                    min="0.1"
                    max="50"
                  />
                  {customSlippage && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  )}
                </div>
              </div>

              {/* Slippage warnings */}
              <div className="min-h-[60px]">
                {parseFloat(slippage) < 0.5 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-sm text-yellow-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Your transaction may fail due to low slippage tolerance
                    </p>
                  </div>
                )}
                {parseFloat(slippage) > 5 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      High slippage tolerance - you may receive fewer tokens
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Deadline Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Transaction Deadline</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Time limit for transaction execution
                </p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-24 text-center bg-slate-700 border-slate-600"
                    min="1"
                    max="180"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Transaction will revert if pending for more than {deadline} minutes
                </p>
              </div>
            </div>

            {/* Advanced Settings Section */}
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold">Advanced Settings</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Professional trading options
                </p>
              </div>

              {/* Auto Router Toggle */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="text-sm font-medium">Smart Routing</Label>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Use 0x's advanced routing algorithm to find the best prices across multiple liquidity sources
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoRouter(!autoRouter)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                      autoRouter ? 'bg-purple-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoRouter ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Expert Mode Toggle */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="text-sm font-medium">Expert Mode</Label>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                        HIGH RISK
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Bypasses confirmation dialogs and allows high slippage trades. Only enable if you understand the risks.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!expertMode) {
                        const confirm = window.confirm(
                          '⚠️ EXPERT MODE WARNING\n\n' +
                          'Expert mode disables safety confirmations and allows:\n' +
                          '• High slippage trades (potential significant losses)\n' +
                          '• MEV vulnerability\n' +
                          '• Failed transactions without warnings\n\n' +
                          'This is intended for experienced traders only.\n\n' +
                          'Enable Expert Mode?'
                        );
                        if (confirm) setExpertMode(true);
                      } else {
                        setExpertMode(false);
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                      expertMode ? 'bg-red-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        expertMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={() => {
                  setSlippage('0.5');
                  setCustomSlippage('');
                  setDeadline('20');
                  setAutoRouter(true);
                  setExpertMode(false);
                }}
                className="flex-1 border-slate-600 hover:bg-slate-800"
              >
                Reset All
              </Button>
              <Button
                onClick={() => setIsSettingsOpen(false)}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
