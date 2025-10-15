import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Copy, ExternalLink, RefreshCw, Wallet, AlertCircle, CheckCircle, Clock } from "lucide-react";
import QRCode from "qrcode";

interface DepositAddress {
  address: string;
  currency: string;
  network: string;
}

interface Balance {
  address: string;
  balance: string;
  currency: string;
  decimals: number;
}

export default function CryptoDepositInterface() {
  const [selectedCurrency, setSelectedCurrency] = useState("ETH");
  const [depositAddress, setDepositAddress] = useState<DepositAddress | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Supported currencies
  const supportedCurrencies = [
    { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
    { symbol: 'USDT', name: 'Tether USD', network: 'Ethereum' },
    { symbol: 'USDC', name: 'USD Coin', network: 'Ethereum' },
    { symbol: 'DAI', name: 'Dai Stablecoin', network: 'Ethereum' },
    { symbol: 'LINK', name: 'Chainlink', network: 'Ethereum' },
    { symbol: 'UNI', name: 'Uniswap', network: 'Ethereum' }
  ];

  // Generate deposit address mutation
  const generateAddressMutation = useMutation({
    mutationFn: async (currency: string) => {
      return apiRequest("/api/crypto/deposit/address", {
        method: "POST",
        body: JSON.stringify({ currency }),
      });
    },
    onSuccess: async (data: DepositAddress) => {
      setDepositAddress(data);
      
      // Generate QR code
      try {
        const qrUrl = await QRCode.toDataURL(data.address);
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
      
      toast({
        title: "Address Generated",
        description: `Deposit address created for ${data.currency}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Address Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get balance for selected currency
  const { data: balance, refetch: refetchBalance } = useQuery({
    queryKey: ["/api/crypto/balance", selectedCurrency],
    enabled: !!selectedCurrency,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Handle address generation
  const handleGenerateAddress = () => {
    generateAddressMutation.mutate(selectedCurrency);
  };

  // Copy address to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  // Get currency info
  const getCurrencyInfo = (symbol: string) => {
    return supportedCurrencies.find(c => c.symbol === symbol);
  };

  return (
    <div className="space-y-6">
      {/* Currency Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Crypto Deposits
          </CardTitle>
          <CardDescription>
            Generate deposit addresses and monitor incoming payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Select Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCurrencies.map((currency) => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {currency.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{currency.name}</div>
                            <div className="text-xs text-muted-foreground">{currency.network}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateAddress}
                disabled={generateAddressMutation.isPending}
                className="w-full"
              >
                {generateAddressMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Generate Deposit Address
                  </>
                )}
              </Button>
            </div>

            {/* Current Balance */}
            <div className="space-y-4">
              <div>
                <Label>Current Balance</Label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {balance ? (
                    <div>
                      <div className="text-2xl font-bold">
                        {parseFloat(balance.balance).toFixed(6)} {balance.currency}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Address: {balance.address.slice(0, 6)}...{balance.address.slice(-4)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Select a currency to view balance</div>
                  )}
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={() => refetchBalance()}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Balance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Address Display */}
      {depositAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Deposit Address</CardTitle>
            <CardDescription>
              Send {depositAddress.currency} to this address to deposit funds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Only send {depositAddress.currency} tokens on the {depositAddress.network} network to this address. 
                Sending other tokens or using other networks may result in permanent loss of funds.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Details */}
              <div className="space-y-4">
                <div>
                  <Label>Deposit Address</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={depositAddress.address} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(depositAddress.address)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Currency</Label>
                    <div className="font-medium">{depositAddress.currency}</div>
                  </div>
                  <div>
                    <Label className="text-xs">Network</Label>
                    <div className="font-medium">{depositAddress.network}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://etherscan.io/address/${depositAddress.address}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Etherscan
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                {qrCodeUrl && (
                  <>
                    <img 
                      src={qrCodeUrl} 
                      alt="Deposit Address QR Code"
                      className="w-48 h-48 border rounded-lg"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      Scan with your wallet app
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deposit Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Deposit Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold mt-1">
                1
              </div>
              <div>
                <h4 className="font-medium">Generate Deposit Address</h4>
                <p className="text-sm text-muted-foreground">
                  Select your currency and generate a unique deposit address for your account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold mt-1">
                2
              </div>
              <div>
                <h4 className="font-medium">Send Cryptocurrency</h4>
                <p className="text-sm text-muted-foreground">
                  Use your external wallet to send cryptocurrency to the generated address. 
                  Double-check the address and network before sending.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold mt-1">
                3
              </div>
              <div>
                <h4 className="font-medium">Wait for Confirmations</h4>
                <p className="text-sm text-muted-foreground">
                  Your deposit will be credited after network confirmations. 
                  ETH and ERC-20 tokens require 12 confirmations (~3-5 minutes).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 text-sm font-bold mt-1">
                4
              </div>
              <div>
                <h4 className="font-medium">Start Trading</h4>
                <p className="text-sm text-muted-foreground">
                  Once confirmed, your funds will be available for trading, staking, or withdrawal.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Information */}
      <Card>
        <CardHeader>
          <CardTitle>Network Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedCurrencies.map((currency) => (
              <div key={currency.symbol} className="p-3 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {currency.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{currency.symbol}</div>
                    <div className="text-xs text-muted-foreground">{currency.name}</div>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span className="font-medium">{currency.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confirmations:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Time:</span>
                    <span className="font-medium">3-5 min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}