import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { Users, Shield, Clock, DollarSign, CreditCard, Building2 } from "lucide-react";

export default function P2PTrading() {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [asset, setAsset] = useState("BTC");
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const { isAuthenticated } = useWalletAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: p2pOrders, isLoading } = useQuery({
    queryKey: ["/api/p2p/orders", { asset, type: orderType, fiatCurrency }],
    refetchInterval: 10000,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/p2p/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "P2P Order Created",
        description: "Your P2P order has been posted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/p2p/orders"] });
      setAmount("");
      setPrice("");
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to create P2P order",
        variant: "destructive",
      });
    },
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // User will be prompted to connect wallet via the UI
      return;
    }

    createOrderMutation.mutate({
      type: orderType,
      asset,
      amount,
      price,
      fiatCurrency,
      paymentMethod,
      minOrderAmount: (parseFloat(amount) * 0.1).toString(),
      maxOrderAmount: amount,
    });
  };

  const paymentMethods = [
    { value: "bank_transfer", label: "Bank Transfer", icon: Building2 },
    { value: "paypal", label: "PayPal", icon: CreditCard },
    { value: "wise", label: "Wise", icon: CreditCard },
    { value: "revolut", label: "Revolut", icon: CreditCard },
    { value: "sepa", label: "SEPA", icon: Building2 },
  ];

  return (
    <div className="min-h-screen page-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              P2P Trading Marketplace
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">Trade directly with other users using your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Order Panel */}
          <div className="lg:col-span-1">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Create P2P Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      className={`flex-1 ${orderType === "buy" ? "bg-green-600" : "bg-muted"}`}
                      onClick={() => setOrderType("buy")}
                    >
                      Buy
                    </Button>
                    <Button
                      type="button"
                      className={`flex-1 ${orderType === "sell" ? "bg-red-600" : "bg-muted"}`}
                      onClick={() => setOrderType("sell")}
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
                    <Label>Fiat Currency</Label>
                    <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Amount ({asset})</Label>
                    <Input
                      type="number"
                      step="0.00000001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label>Price per {asset} ({fiatCurrency})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center">
                              <method.icon className="w-4 h-4 mr-2" />
                              {method.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? "Creating..." : `Create ${orderType} Order`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Available Orders
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{asset}/{fiatCurrency}</Badge>
                    <Badge variant={orderType === "buy" ? "default" : "destructive"}>
                      {orderType === "buy" ? "Buying" : "Selling"}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="orders">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="orders">Active Orders</TabsTrigger>
                    <TabsTrigger value="my-orders">My Orders</TabsTrigger>
                  </TabsList>

                  <TabsContent value="orders" className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (p2pOrders && Array.isArray(p2pOrders) && p2pOrders.length > 0) ? (
                      p2pOrders.map((order: any) => (
                        <Card key={order.id} className="border border-muted">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Badge variant={order.type === "buy" ? "default" : "destructive"}>
                                    {order.type}
                                  </Badge>
                                  <span className="font-semibold">
                                    {order.amount} {order.asset}
                                  </span>
                                  <span className="text-muted-foreground">@</span>
                                  <span className="font-semibold">
                                    {order.price} {order.fiatCurrency}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-center">
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    {order.paymentMethod}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    15 min limit
                                  </span>
                                  <span className="flex items-center">
                                    <Shield className="w-4 h-4 mr-1" />
                                    Escrow protected
                                  </span>
                                </div>
                              </div>
                              <Button size="sm">
                                {order.type === "buy" ? "Sell to" : "Buy from"} user
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No {orderType} orders available for {asset}/{fiatCurrency}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="my-orders">
                    <div className="text-center py-4 text-muted-foreground">
                      {isAuthenticated ? "You have no active P2P orders" : "Connect wallet to view your orders"}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Escrow Protection</h3>
              <p className="text-muted-foreground text-sm">
                All trades are protected by our secure escrow system until payment confirmation
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-semibold mb-2">Fast Settlements</h3>
              <p className="text-muted-foreground text-sm">
                Quick payment processing with automated dispute resolution
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2">Global Community</h3>
              <p className="text-muted-foreground text-sm">
                Trade with verified users worldwide using local payment methods
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}