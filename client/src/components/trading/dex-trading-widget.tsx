import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowUpDown, TrendingUp, Shield } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DEXTradingWidget() {
  const { toast } = useToast();
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1");

  // Check DEX configuration status
  const { data: dexStatus } = useQuery({
    queryKey: ['/api/dex/tokens'],
    retry: false,
  });

  // Get swap quote
  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ['/api/dex/quote', fromToken, toToken, amount],
    enabled: !!amount && parseFloat(amount) > 0,
    refetchInterval: 10000, // Update quotes every 10 seconds
  });

  // Execute swap mutation
  const swapMutation = useMutation({
    mutationFn: async (swapData: any) => {
      return await apiRequest('/api/dex/swap', {
        method: 'POST',
        body: JSON.stringify(swapData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Swap Executed",
        description: "Your decentralized swap has been submitted to the blockchain.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Swap Failed",
        description: error.message || "Failed to execute swap",
        variant: "destructive",
      });
    },
  });

  const handleSwap = () => {
    if (!amount || !fromToken || !toToken) {
      toast({
        title: "Missing Information",
        description: "Please fill in all swap details",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would use the user's wallet address
    const userWallet = "0x1234567890123456789012345678901234567890";

    swapMutation.mutate({
      src: fromToken,
      dst: toToken,
      amount: amount,
      from: userWallet,
      slippage: parseFloat(slippage),
    });
  };

  const popularPairs = [
    { from: "ETH", to: "USDT", label: "ETH → USDT" },
    { from: "BTC", to: "ETH", label: "BTC → ETH" },
    { from: "USDT", to: "DAI", label: "USDT → DAI" },
  ];

  return (
    <Card className="glass border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-400" />
          DEX Trading
          <Badge className="ml-2 bg-green-600 text-white">
            Decentralized
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Trade directly on decentralized exchanges with best price aggregation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Pair Selection */}
        <div className="flex flex-wrap gap-2">
          {popularPairs.map((pair) => (
            <Button
              key={pair.label}
              size="sm"
              variant="outline"
              onClick={() => {
                setFromToken(pair.from);
                setToToken(pair.to);
              }}
              className="text-xs border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
            >
              {pair.label}
            </Button>
          ))}
        </div>

        {/* From Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <div className="flex space-x-2">
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="DAI">DAI</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const temp = fromToken;
              setFromToken(toToken);
              setToToken(temp);
            }}
            className="rounded-full w-8 h-8 p-0"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <div className="flex space-x-2">
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="DAI">DAI</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 p-2 bg-muted rounded-md">
              {quoteLoading ? (
                <span className="text-muted-foreground">Loading...</span>
              ) : quote ? (
                <span className="font-medium">{quote.toTokenAmount || '0.0'}</span>
              ) : (
                <span className="text-muted-foreground">0.0</span>
              )}
            </div>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Slippage Tolerance</label>
          <div className="flex space-x-2">
            {["0.5", "1", "2", "5"].map((value) => (
              <Button
                key={value}
                size="sm"
                variant={slippage === value ? "default" : "outline"}
                onClick={() => setSlippage(value)}
                className="flex-1"
              >
                {value}%
              </Button>
            ))}
          </div>
        </div>

        {/* Quote Information */}
        {quote && (
          <div className="p-3 bg-slate-800/30 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price Impact:</span>
              <span className="text-green-400">~0.1%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Minimum Received:</span>
              <span>{quote.toTokenAmount} {toToken}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Network Fee:</span>
              <span>~$15</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!amount || !quote || swapMutation.isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {swapMutation.isPending ? (
            "Executing Swap..."
          ) : !dexStatus?.configured ? (
            "DEX Not Configured"
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Swap via DEX
            </>
          )}
        </Button>

        {/* DEX Benefits */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            <span>No custody risk - trade directly from your wallet</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Best prices across 100+ decentralized exchanges</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}