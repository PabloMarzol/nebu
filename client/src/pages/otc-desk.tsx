import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import MarketDataStatus from "@/components/trading/market-data-status";
import { Building2, Shield, TrendingUp, Users, Phone, Mail, FileText } from "lucide-react";

export default function OTCDesk() {
  const [dealType, setDealType] = useState<"buy" | "sell">("buy");
  const [asset, setAsset] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [notes, setNotes] = useState("");

  const { isAuthenticated } = useWalletAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: otcDeals, isLoading } = useQuery({
    queryKey: ["/api/otc/deals", { asset, type: dealType, visibility: "public" }],
    refetchInterval: 30000,
  });

  const createDealMutation = useMutation({
    mutationFn: async (dealData: any) => {
      return apiRequest("POST", "/api/otc/deals", dealData);
    },
    onSuccess: () => {
      toast({
        title: "OTC Deal Created",
        description: "Your OTC deal has been posted for institutional review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/otc/deals"] });
      setAmount("");
      setTargetPrice("");
      setNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Deal Failed",
        description: error.message || "Failed to create OTC deal",
        variant: "destructive",
      });
    },
  });

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // User will be prompted to connect wallet via the UI
      return;
    }

    createDealMutation.mutate({
      type: dealType,
      asset,
      amount,
      targetPrice,
      visibility,
      notes,
      minCounterpartyVolume: "1000000", // $1M minimum for OTC
      status: "pending",
    });
  };

  const minimumAmounts = {
    BTC: "10", // 10 BTC minimum
    ETH: "100", // 100 ETH minimum
    USDT: "500000", // $500k minimum
    SOL: "10000", // 10k SOL minimum
  };

  return (
    <div className="min-h-screen page-content pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-gold-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              OTC Trading Desk
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional trading for medium to large volume transactions
          </p>
        </div>

        {/* Market Data Status */}
        <div className="mb-8">
          <MarketDataStatus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Deal Panel */}
          <div className="lg:col-span-1">
            <Card className="glass border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Create OTC Deal
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Minimum transaction: $10,000 USD equivalent
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateDeal} className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      className={`flex-1 ${dealType === "buy" ? "bg-green-600" : "bg-muted"}`}
                      onClick={() => setDealType("buy")}
                    >
                      Buy
                    </Button>
                    <Button
                      type="button"
                      className={`flex-1 ${dealType === "sell" ? "bg-red-600" : "bg-muted"}`}
                      onClick={() => setDealType("sell")}
                    >
                      Sell
                    </Button>
                  </div>

                  <div>
                    <Label>Asset</Label>
                    <Select value={asset} onValueChange={setAsset}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        <SelectItem value="SOL">Solana (SOL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Amount ({asset})</Label>
                    <Input
                      type="number"
                      step="0.00000001"
                      min={minimumAmounts[asset as keyof typeof minimumAmounts]}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`Min: ${minimumAmounts[asset as keyof typeof minimumAmounts]} ${asset}`}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum: {minimumAmounts[asset as keyof typeof minimumAmounts]} {asset}
                    </p>
                  </div>

                  <div>
                    <Label>Target Price (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="Negotiable"
                    />
                  </div>

                  <div>
                    <Label>Deal Visibility</Label>
                    <Select value={visibility} onValueChange={setVisibility}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private (Direct contact only)</SelectItem>
                        <SelectItem value="institutional">Institutional Partners</SelectItem>
                        <SelectItem value="public">Public (Verified traders)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Settlement preferences, timing requirements, etc."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600"
                    disabled={createDealMutation.isPending}
                  >
                    {createDealMutation.isPending ? "Creating..." : `Post ${dealType} Deal`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Deals List */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Available OTC Deals
                  </span>
                  <Badge variant="outline" className="border-amber-500 text-amber-400">
                    Institutional Grade
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="public-deals">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="public-deals">Public Deals</TabsTrigger>
                    <TabsTrigger value="my-deals">My Deals</TabsTrigger>
                    <TabsTrigger value="negotiations">Active Negotiations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="public-deals" className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                    ) : Array.isArray(otcDeals) && otcDeals.length ? (
                      otcDeals.map((deal: any) => (
                        <Card key={deal.id} className="border border-amber-500/20">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                  <Badge variant={deal.type === "buy" ? "default" : "destructive"}>
                                    {deal.type}
                                  </Badge>
                                  <span className="text-2xl font-bold">
                                    {deal.amount} {deal.asset}
                                  </span>
                                  {deal.targetPrice && (
                                    <>
                                      <span className="text-muted-foreground">@</span>
                                      <span className="text-xl font-semibold">
                                        ${deal.targetPrice}
                                      </span>
                                    </>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                  <span className="flex items-center">
                                    <Building2 className="w-4 h-4 mr-1" />
                                    Institutional counterparty required
                                  </span>
                                  <span className="flex items-center">
                                    <Shield className="w-4 h-4 mr-1" />
                                    Escrow available
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    KYC Level 3+ required
                                  </span>
                                </div>

                                {deal.notes && (
                                  <div className="bg-muted/50 p-3 rounded">
                                    <p className="text-sm">{deal.notes}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col space-y-2">
                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                                  Contact Trader
                                </Button>
                                <Button size="sm" variant="outline">
                                  Request Quote
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No Public OTC Deals</h3>
                        <p>Check back later or create your own deal</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="my-deals">
                    <div className="text-center py-12 text-muted-foreground">
                      {isAuthenticated ? (
                        <>
                          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No Active Deals</h3>
                          <p>Create your first OTC deal to get started</p>
                        </>
                      ) : (
                        "Connect wallet to view your OTC deals"
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="negotiations">
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Active Negotiations</h3>
                      <p>Negotiations will appear here once you engage with counterparties</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* OTC Services */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <Phone className="w-12 h-12 mx-auto mb-4 text-amber-400" />
              <h3 className="text-lg font-semibold mb-2">Dedicated Support</h3>
              <p className="text-muted-foreground text-sm">
                24/7 dedicated relationship manager for all OTC transactions
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Secure Settlement</h3>
              <p className="text-muted-foreground text-sm">
                Multi-signature custody and escrow services for large transactions
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-semibold mb-2">Best Execution</h3>
              <p className="text-muted-foreground text-sm">
                Competitive pricing and optimal execution for institutional volumes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="glass mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Assistance?</h2>
            <p className="text-muted-foreground mb-6">
              Our institutional trading desk is available 24/7 for large volume transactions
            </p>
            <div className="flex justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>+1 (555) OTC-DESK</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <span>otc@nebulax.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}