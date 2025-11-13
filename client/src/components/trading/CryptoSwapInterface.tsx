import { useState, useEffect } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { 
 getSwapQuote, 
  getTokenPrice, 
  fetchTokenList, 
  searchTokens,
 getTokensForChain,
  type Token, 
  type SwapQuote,
  approveToken
} from '@/lib/zeroXServices';
import { ethers } from 'ethers';
import { SUPPORTED_CHAINS, getChainById } from '@/lib/chains';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowDownUp, 
  Loader2, 
 AlertCircle, 
 ChevronDown,
  Search,
  X,
  Sparkles
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import SwapSuccessPopup from './SwapSuccessPopup';

export default function CryptoSwapInterface() {
  const { walletAddress, isAuthenticated, chainId } = useWalletAuth();
  const { balances, totalUsdValue, isLoading: isLoadingBalances, error: balanceError } = useWalletBalance();
  
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showGaslessOnly, setShowGaslessOnly] = useState(false);

  const currentChain = getChainById(chainId);

  // 🚀 OPTIMIZATION 3: Debounced search (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(tokenSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [tokenSearchQuery]);
  
  // Load tokens when chain changes
  useEffect(() => {
    loadTokens();
  }, [chainId]);
  
  const loadTokens = async () => {
    setIsLoadingTokens(true);
    try {
      const tokens = await fetchTokenList(chainId);
      setAllTokens(tokens);
      
      // Set default tokens - find ETH and USDC
      const ethToken = tokens.find(t => 
        t.symbol === 'ETH' || 
        t.symbol === 'WETH' ||
        t.address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      );
      
      const usdcToken = tokens.find(t => t.symbol === 'USDC');
      
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
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [priceImpact, setPriceImpact] = useState<string>('0');
  const [slippage, setSlippage] = useState<string>('0.5');



  // Swap success popup
  const [isSwapSuccessOpen, setIsSwapSuccessOpen] = useState(false);
  const [swapTxHash, setSwapTxHash] = useState('');
  const [swapExplorerUrl, setSwapExplorerUrl] = useState('');

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
        
        // Calculate price impact
        const sellAmt = parseFloat(sellAmount);
        const buyAmt = parseFloat(buyAmountReadable);
        const priceFromQuote = parseFloat(price.price);
        
        if (sellAmt > 0 && buyAmt > 0 && !isNaN(priceFromQuote) && priceFromQuote > 0) {
          const expectedRate = buyAmt / sellAmt;
          const actualRate = priceFromQuote > 1 ? priceFromQuote : 1 / priceFromQuote;
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

  // Handle token approval
  const handleApprove = async () => {
    if (!isAuthenticated || !walletAddress || !sellToken || !quote) {
      setError('Please connect wallet and ensure tokens are selected');
      return;
    }

    if (!quote.issues?.allowance) {
      setError('No approval needed for this transaction');
      return;
    }

    setIsApproving(true);
    setError(null);

    try {
      // Get the provider and signer from the user's wallet
      if (!window.ethereum) {
        throw new Error('Ethereum wallet not found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get the spender address from the quote issues
      const spenderAddress = quote.issues.allowance.spender;
      const tokenAddress = sellToken.address;
      
      // Use MAX_UINT256 for unlimited approval
      const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

      // Call the approveToken function
      const txHash = await approveToken(
        tokenAddress,
        spenderAddress,
        MAX_UINT256,
        signer
      );

      console.log('Approval successful:', txHash);
      setError('Token approved successfully! You can now proceed with the swap.');
      
      // Optionally refetch the quote to update allowance status
      if (sellAmount && parseFloat(sellAmount) > 0) {
        const sellAmountWei = (parseFloat(sellAmount) * Math.pow(10, sellToken.decimals)).toString();
        const updatedQuote = await getSwapQuote(
          sellToken.address,
          buyToken!.address,
          sellAmountWei,
          walletAddress,
          chainId,
          sellToken.supportsGasless || false,
          buyToken!.supportsGasless || false
        );
        setQuote(updatedQuote);

        // Clear error if allowance is now sufficient
        if (!updatedQuote.issues?.allowance) {
          setError(null);
        }
      }
    } catch (err: any) {
      console.error('Approval error:', err);
      setError(err.message || 'Failed to approve token');
    } finally {
      setIsApproving(false);
    }
 };

  // Execute gasless swap
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
      
      // 🚀 FIX: Pass gasless support flags to use correct endpoint
      const swapQuote = await getSwapQuote(
        sellToken.address,
        buyToken.address,
        sellAmountWei,
        walletAddress,
        chainId,
        sellToken.supportsGasless || false,
        buyToken.supportsGasless || false
      );
      
      // Log the received swap quote for debugging
      console.log('Received swap quote from backend:', swapQuote);
      
      setQuote(swapQuote);

      if (swapQuote.issues?.allowance) {
        setError('Token approval required. Please approve spending first.');
        return;
      }

      if (swapQuote.trade?.eip712 && window.ethereum) {
        // Handle gasless transaction with EIP-712 signing
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        try {
          let approvalSignature = null;
          let tradeSignature = null;

          // Sign approval if present
          if (swapQuote.approval?.eip712) {
            const { domain: approvalDomain, types: approvalTypes, message: approvalMessage } = swapQuote.approval.eip712;
            const filteredApprovalTypes = { ...approvalTypes };
            delete filteredApprovalTypes.EIP712Domain;

            console.log('Approval EIP-712 Signing Inputs:');
            console.log('  Domain:', JSON.stringify(approvalDomain, null, 2));
            console.log('  Filtered Types:', JSON.stringify(filteredApprovalTypes, null, 2));
            console.log('  Message:', JSON.stringify(approvalMessage, null, 2));

            approvalSignature = await signer.signTypedData(approvalDomain, filteredApprovalTypes, approvalMessage);
            console.log('Approval signature:', approvalSignature);
          }

          // Sign trade
          const { domain: tradeDomain, types: tradeTypes, message: tradeMessage } = swapQuote.trade.eip712;
          const filteredTradeTypes = { ...tradeTypes };
          delete filteredTradeTypes.EIP712Domain;

          console.log('Trade EIP-712 Signing Inputs:');
          console.log('  Domain:', JSON.stringify(tradeDomain, null, 2));
          console.log('  Filtered Types:', JSON.stringify(filteredTradeTypes, null, 2));
          console.log('  Message:', JSON.stringify(tradeMessage, null, 2));

          tradeSignature = await signer.signTypedData(tradeDomain, filteredTradeTypes, tradeMessage);
          console.log('Trade signature:', tradeSignature);

          // Submit the signed metatransactions to backend
          const submitResponse = await fetch('/api/0x/gasless-submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              trade_type: swapQuote.trade?.type,
              trade_eip712: swapQuote.trade?.eip712,
              trade_signature: tradeSignature,
              ...(swapQuote.approval && {
                approval_type: swapQuote.approval?.type,
                approval_eip712: swapQuote.approval?.eip712,
                approval_signature: approvalSignature,
              }),
              chain_id: chainId
            }),
          });

          if (!submitResponse.ok) {
            const error = await submitResponse.json();
            throw new Error(error.reason || error.error || 'Failed to submit gasless transaction');
          }

          const result = await submitResponse.json();

          // Show success message with transaction hash if available
          const txHash = result.tradeHash || result.hash || result.txHash || 'unknown';
          const explorerUrl = `${currentChain?.blockExplorer}/tx/${txHash}`;
          
          setSwapTxHash(txHash);
          setSwapExplorerUrl(explorerUrl);
          setIsSwapSuccessOpen(true);

          setSellAmount('');
          setBuyAmount('');
          setQuote(null);

        } catch (signError: any) {
          console.error('EIP-712 signing error:', signError);
          setError(signError.message || 'Failed to sign gasless transaction');
        }
      } else if (swapQuote.transaction && window.ethereum) {
        // Fallback to regular transaction if no gasless trade is present
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: walletAddress,
            to: swapQuote.transaction.to,
            data: swapQuote.transaction.data,
            value: swapQuote.transaction.value || '0x0',
            gas: swapQuote.transaction.gas,
          }],
        });

        const explorerUrl = `${currentChain?.blockExplorer}/tx/${txHash}`;
        alert(`Swap submitted!\n\nView on explorer: ${explorerUrl}`);
        
        setSellAmount('');
        setBuyAmount('');
        setQuote(null);
      } else {
        console.error('Swap quote received but no valid transaction data:', swapQuote);
        setError('No valid transaction data received from 0x API');
      }
    } catch (err: any) {
      console.error('Swap error:', err);
      setError(err.message || 'Failed to execute swap');
    } finally {
      setIsSwapping(false);
    }
  };

  // 🚀 Use debounced query for filtering to prevent UI lag
  const filteredTokens = searchTokens(allTokens, debouncedSearchQuery)
    .filter(token => !showGaslessOnly || token.supportsGasless);

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ArrowDownUp className="w-5 h-5 text-purple-400" />
              Crypto Swap
            </CardTitle>

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
          className="h-10 px-3 bg-slate-700/50 hover:bg-slate-700 border-slate-600 relative" // Added 'relative' for positioning gasless indicator
        >
          {sellToken ? (
            <div className="flex items-center gap-2">
              {sellToken.logoURI && (
                <img src={sellToken.logoURI} alt={sellToken.symbol} className="w-5 h-5 rounded-full" />
              )}
              <span className="font-semibold">{sellToken.symbol}</span>
              {/* Gasless Swap Indicator */}
              {sellToken.supportsGasless && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-xs cursor-help">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Gasless
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Swap without paying gas fees. The platform covers your gas costs.</p>
                  </TooltipContent>
                </Tooltip>
              )}
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
                <span>
                  Balance: {
                    isLoadingBalances
                      ? 'Loading...'
                      : balances.find(b => b.address.toLowerCase() === sellToken.address.toLowerCase())?.balanceFormatted || '0.00'
                  } {sellToken.symbol}
                </span>
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
                className="h-10 px-3 bg-slate-700/50 hover:bg-slate-700 border-slate-600 relative" // Added 'relative' for positioning gasless indicator
              >
                {buyToken ? (
                  <div className="flex items-center gap-2">
                    {buyToken.logoURI && (
                      <img src={buyToken.logoURI} alt={buyToken.symbol} className="w-5 h-5 rounded-full" />
                    )}
                    <span className="font-semibold">{buyToken.symbol}</span>
                    {/* Gasless Swap Indicator */}
                    {buyToken.supportsGasless && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-xs cursor-help">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Gasless
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Swap without paying gas fees. The platform covers your gas costs.</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
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

            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Approval and Swap Buttons */}
          {quote?.issues?.allowance ? (
            <>
              <Button
                onClick={handleApprove}
                disabled={!isAuthenticated || isApproving || isLoadingQuote || !isChainSupported || !sellToken || !buyToken}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                size="lg"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  'Approve Token'
                )}
              </Button>
              <Button
                onClick={handleSwap}
                disabled={true}
                className="w-full h-14 text-lg font-semibold bg-gray-600 cursor-not-allowed opacity-50"
                size="lg"
              >
                Swap (Approval Required)
              </Button>
            </>
          ) : (
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
          )}

          {/* Powered by */}
          <div className="text-center text-xs text-muted-foreground pt-2">
            Powered by 0x Protocol
          </div>
        </CardContent>
      </Card>

      {/* Token Picker Dialog */}
      <Dialog open={isTokenPickerOpen} onOpenChange={setIsTokenPickerOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 p-0 overflow-visible">
          <div className="relative z-20 bg-slate-900">
            <div className="px-6 pt-6 pb-4">
              <DialogTitle>Select a token</DialogTitle>
            </div>
            
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
            <div className="px-6 pb-3 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="gasless-filter"
                  checked={showGaslessOnly}
                  onChange={(e) => setShowGaslessOnly(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="gasless-filter" className="text-sm text-muted-foreground">
                  Show gasless tokens only
                </label>
              </div>
            </div>
            <div className="h-px bg-slate-700 relative z-30"></div>
          </div>

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
                      <div className="flex items-center gap-2">
                        {token.supportsGasless && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Gasless
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Swap without paying gas fees. The platform covers your gas costs.</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {(sellToken?.address === token.address || buyToken?.address === token.address) && (
                          <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>



      {/* Swap Success Popup */}
      <SwapSuccessPopup
        isOpen={isSwapSuccessOpen}
        onClose={() => setIsSwapSuccessOpen(false)}
        txHash={swapTxHash}
        explorerUrl={swapExplorerUrl}
      />
    </>
  );
}
