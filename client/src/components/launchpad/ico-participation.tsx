import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Rocket, AlertCircle, DollarSign, Clock, Users, Shield, Calculator, FileText, CheckCircle } from "lucide-react";

interface ICOParticipationProps {
  launchId: string;
  projectName: string;
  tokenSymbol: string;
}

export default function ICOParticipation({ launchId, projectName, tokenSymbol }: ICOParticipationProps) {
  const [participationAmount, setParticipationAmount] = useState("");
  const [selectedTier, setSelectedTier] = useState("bronze");
  const [paymentMethod, setPaymentMethod] = useState("usdt");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(true); // Assume KYC is completed for demo
  const [whitelistStatus, setWhitelistStatus] = useState("approved"); // Assume approved for demo
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const launchData = {
    price: 0.05,
    minBuy: 100,
    maxBuy: 5000,
    timeRemaining: "2d 14h 32m",
    currentRaise: 1875000,
    targetRaise: 2500000,
    participants: 8420,
    maxParticipants: 10000,
    vestingSchedule: "25% TGE, 75% over 12 months"
  };

  const tierBenefits = {
    bronze: { 
      multiplier: 1, 
      allocation: 500, 
      priority: "Standard",
      benefits: ["Basic allocation", "Standard support"]
    },
    silver: { 
      multiplier: 1.5, 
      allocation: 1500, 
      priority: "Priority",
      benefits: ["1.5x allocation", "Priority support", "Early access"]
    },
    gold: { 
      multiplier: 2, 
      allocation: 3000, 
      priority: "VIP",
      benefits: ["2x allocation", "VIP support", "Private telegram", "Bonus tokens"]
    },
    platinum: { 
      multiplier: 3, 
      allocation: 5000, 
      priority: "Ultra VIP",
      benefits: ["3x allocation", "Personal manager", "Pre-sale access", "Exclusive events"]
    }
  };

  const calculateTokens = (amount: number) => {
    const baseTokens = amount / launchData.price;
    const multiplier = tierBenefits[selectedTier as keyof typeof tierBenefits].multiplier;
    return baseTokens * multiplier;
  };

  const participationSteps = [
    { id: 1, title: "KYC Verification", completed: kycCompleted, required: true },
    { id: 2, title: "Whitelist Application", completed: whitelistStatus === "approved", required: true },
    { id: 3, title: "Terms Agreement", completed: agreedToTerms, required: true },
    { id: 4, title: "Payment", completed: false, required: true }
  ];

  const paymentMethods = [
    { id: "usdt", name: "USDT", icon: "₮", description: "Tether USD" },
    { id: "usdc", name: "USDC", icon: "🪙", description: "USD Coin" },
    { id: "eth", name: "ETH", icon: "⟠", description: "Ethereum" },
    { id: "btc", name: "BTC", icon: "₿", description: "Bitcoin" }
  ];

  const participationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/launchpad/participate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          launchId,
          amount: parseFloat(participationAmount),
          tier: selectedTier,
          paymentMethod,
          ...data
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Participation Confirmed!",
        description: `Successfully invested $${participationAmount} in ${projectName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: (error: any) => {
      toast({
        title: "Participation Failed",
        description: error.message || "Failed to process investment",
        variant: "destructive",
      });
    }
  });

  const handleParticipate = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    if (!participationAmount || parseFloat(participationAmount) < launchData.minBuy) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment is $${launchData.minBuy}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await participationMutation.mutateAsync({
        tokenSymbol,
        projectName
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{projectName} Token Sale</CardTitle>
              <p className="text-muted-foreground mt-1">Participate in the {tokenSymbol} token launch</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Ends in</div>
              <div className="text-xl font-bold text-red-400">{launchData.timeRemaining}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Steps */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="w-5 h-5" />
                <span>Participation Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.completed ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? '✓' : step.id}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${step.completed ? 'text-green-400' : ''}`}>
                        {step.title}
                      </div>
                      {step.required && (
                        <div className="text-xs text-muted-foreground">Required</div>
                      )}
                    </div>
                    {!step.completed && step.id === 1 && (
                      <Button size="sm" variant="outline">
                        Start KYC
                      </Button>
                    )}
                    {!step.completed && step.id === 2 && (
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tier Selection */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Select Participation Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(tierBenefits).map(([tier, benefits]) => (
                  <div
                    key={tier}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTier === tier 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-border hover:border-purple-500/50'
                    }`}
                    onClick={() => setSelectedTier(tier)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{tier}</h3>
                      <Badge variant={selectedTier === tier ? "default" : "outline"}>
                        {benefits.multiplier}x
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Max: ${benefits.allocation.toLocaleString()}
                    </div>
                    <ul className="text-xs space-y-1">
                      {benefits.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-purple-400 rounded-full" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Investment Amount */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Investment Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Amount (USDT)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={participationAmount}
                    onChange={(e) => setParticipationAmount(e.target.value)}
                    placeholder={`Min: ${launchData.minBuy} - Max: ${launchData.maxBuy}`}
                    className="pl-10 text-right font-mono"
                    min={launchData.minBuy}
                    max={Math.min(launchData.maxBuy, tierBenefits[selectedTier as keyof typeof tierBenefits].allocation)}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: ${launchData.minBuy}</span>
                  <span>Max: ${Math.min(launchData.maxBuy, tierBenefits[selectedTier as keyof typeof tierBenefits].allocation)}</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percent) => (
                  <Button
                    key={percent}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const maxAmount = Math.min(launchData.maxBuy, tierBenefits[selectedTier as keyof typeof tierBenefits].allocation);
                      const amount = (maxAmount * percent / 100);
                      setParticipationAmount(amount.toString());
                    }}
                  >
                    {percent}%
                  </Button>
                ))}
              </div>

              {/* Calculation Summary */}
              {participationAmount && (
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Investment:</span>
                      <span className="font-mono">${parseFloat(participationAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Price:</span>
                      <span className="font-mono">${launchData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Tokens:</span>
                      <span className="font-mono">{(parseFloat(participationAmount) / launchData.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier Multiplier:</span>
                      <span className="font-mono">{tierBenefits[selectedTier as keyof typeof tierBenefits].multiplier}x</span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Tokens:</span>
                        <span className="font-mono text-purple-400">
                          {calculateTokens(parseFloat(participationAmount)).toLocaleString()} {tokenSymbol}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{method.icon}</span>
                          <div>
                            <div className="font-semibold">{method.name}</div>
                            <div className="text-xs text-muted-foreground">{method.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <div className="text-sm">
                    I agree to the{" "}
                    <Button variant="link" className="p-0 h-auto text-purple-400">
                      Terms and Conditions
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="p-0 h-auto text-purple-400">
                      Token Sale Agreement
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-200">
                    <div className="font-semibold mb-1">Investment Risk Warning</div>
                    <div>Token investments carry high risk. Only invest what you can afford to lose. Past performance does not guarantee future results.</div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={!agreedToTerms || !kycCompleted || whitelistStatus !== "approved" || !participationAmount || isLoading}
                size="lg"
                onClick={handleParticipate}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Participate in Token Sale
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Launch Progress */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Launch Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-semibold">
                    ${launchData.currentRaise.toLocaleString()} / ${launchData.targetRaise.toLocaleString()}
                  </span>
                </div>
                <Progress value={(launchData.currentRaise / launchData.targetRaise) * 100} className="h-3" />
                <div className="text-center text-sm font-semibold text-purple-400">
                  {((launchData.currentRaise / launchData.targetRaise) * 100).toFixed(1)}% Complete
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-muted/20 rounded">
                  <div className="font-bold text-lg">{launchData.participants.toLocaleString()}</div>
                  <div className="text-muted-foreground">Participants</div>
                </div>
                <div className="text-center p-2 bg-muted/20 rounded">
                  <div className="font-bold text-lg">${launchData.price}</div>
                  <div className="text-muted-foreground">Token Price</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vesting Schedule */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Vesting Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm font-semibold">{launchData.vestingSchedule}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>TGE (Token Generation Event):</span>
                    <span className="font-semibold text-green-400">25%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Unlock:</span>
                    <span className="font-semibold">6.25%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Full Unlock:</span>
                    <span className="font-semibold">12 months</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tokens are locked in smart contract and released automatically according to schedule.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => window.open("https://t.me/nebulaxexchange", "_blank")}
              >
                <Users className="w-4 h-4 mr-2" />
                Join Telegram
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => window.open("/docs/defichain-whitepaper.pdf", "_blank")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Read Whitepaper
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => window.open("/docs/defichain-audit-report.pdf", "_blank")}
              >
                <Shield className="w-4 h-4 mr-2" />
                View Audit Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}