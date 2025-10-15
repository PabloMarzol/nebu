import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useMarketData } from "@/hooks/use-market-data";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  ArrowUpDown, 
  Calculator,
  TrendingUp,
  DollarSign
} from "lucide-react";

export default function CryptoConverter() {
  const { data: markets } = useMarketData();
  const { toast } = useToast();
  const [fromAmount, setFromAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [result, setResult] = useState("0");
  const [isConverting, setIsConverting] = useState(false);

  const cryptoOptions = [
    { value: "BTC", label: "Bitcoin (BTC)", symbol: "₿" },
    { value: "ETH", label: "Ethereum (ETH)", symbol: "Ξ" },
    { value: "SOL", label: "Solana (SOL)", symbol: "◎" },
    { value: "ADA", label: "Cardano (ADA)", symbol: "₳" },
    { value: "DOT", label: "Polkadot (DOT)", symbol: "●" },
    { value: "USDT", label: "Tether (USDT)", symbol: "₮" },
    { value: "USDC", label: "USD Coin (USDC)", symbol: "$" }
  ];

  const getPrice = (symbol: string) => {
    if (symbol === "USDT" || symbol === "USDC") return 1;
    const market = markets?.find(m => m.symbol === `${symbol}/USDT`);
    return market ? parseFloat(market.price) : 0;
  };

  const convertCurrency = () => {
    try {
      const amount = parseFloat(fromAmount) || 0;
      if (amount < 0) {
        setResult("0");
        return;
      }
      
      const fromPrice = getPrice(fromCurrency);
      const toPrice = getPrice(toCurrency);
      
      if (fromPrice > 0 && toPrice > 0) {
        const usdValue = amount * fromPrice;
        const convertedAmount = usdValue / toPrice;
        setResult(convertedAmount.toFixed(8));
      } else {
        setResult("0");
      }
    } catch (error) {
      console.warn("Conversion error:", error);
      setResult("0");
    }
  };

  const handleTradeNow = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to trade",
        variant: "destructive",
      });
      return;
    }
    
    setIsConverting(true);
    toast({
      title: "Redirecting to Trading",
      description: `Convert ${fromAmount} ${fromCurrency} to ${toCurrency} on the trading page`,
    });
    
    // Store conversion data for trading page
    const conversionData = {
      fromAmount,
      fromCurrency,
      toCurrency,
      result,
      timestamp: Date.now()
    };
    localStorage.setItem('pendingConversion', JSON.stringify(conversionData));
    
    setTimeout(() => setIsConverting(false), 1000);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  useEffect(() => {
    convertCurrency();
  }, [fromAmount, fromCurrency, toCurrency, markets]);

  const getSymbol = (currency: string) => {
    return cryptoOptions.find(opt => opt.value === currency)?.symbol || "";
  };

  return (
    <Card className="glass-enhanced border-2 border-cyan-400/30 hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
            <Calculator className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Quick Converter
            </h3>
            <p className="text-sm text-muted-foreground">Live crypto prices</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">From</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 btn-micro-hover"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-32 btn-slide-hover">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.symbol} {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapCurrencies}
              className="btn-rotate-hover rounded-full p-2 border-cyan-400/50 hover:bg-cyan-400/10"
            >
              <ArrowUpDown className="w-4 h-4 text-cyan-400" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={result}
                readOnly
                className="flex-1 bg-muted/50 cursor-not-allowed"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-32 btn-slide-hover">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.symbol} {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result Display */}
          <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cyan-400 font-medium">
                {getSymbol(fromCurrency)} {fromAmount} {fromCurrency} =
              </span>
              <span className="text-lg font-bold text-cyan-400">
                {getSymbol(toCurrency)} {result} {toCurrency}
              </span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live market rates
            </div>
          </div>

          {/* Quick Trade Button */}
          <Link href="/trading" className="w-full">
            <Button 
              className="w-full btn-glow-hover bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={handleTradeNow}
              disabled={isConverting}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              {isConverting ? "Loading..." : "Trade Now"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}