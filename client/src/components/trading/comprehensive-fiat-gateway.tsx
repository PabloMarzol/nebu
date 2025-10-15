import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CreditCard, 
  Building, 
  Zap, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Shield,
  DollarSign,
  Euro,
  PoundSterling,
  Globe,
  Building2 as Bank,
  Phone,
  QrCode,
  Smartphone,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function ComprehensiveFiatGateway() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [autoConvert, setAutoConvert] = useState(true);

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      fees: "3.5%",
      time: "Instant",
      limit: "$50,000",
      supported: ["VISA", "Mastercard", "American Express"]
    },
    {
      id: "bank_wire",
      name: "Bank Wire Transfer", 
      icon: <Building className="h-5 w-5" />,
      fees: "$25",
      time: "1-3 days",
      limit: "$1,000,000",
      supported: ["SWIFT", "Fedwire"]
    },
    {
      id: "sepa",
      name: "SEPA Transfer",
      icon: <Euro className="h-5 w-5" />,
      fees: "Free",
      time: "Same day",
      limit: "€100,000",
      supported: ["SEPA Instant", "SEPA Credit Transfer"]
    },
    {
      id: "ach",
      name: "ACH Transfer",
      icon: <DollarSign className="h-5 w-5" />,
      fees: "$1.50",
      time: "1-2 days", 
      limit: "$250,000",
      supported: ["ACH Credit", "ACH Debit"]
    },
    {
      id: "open_banking",
      name: "Open Banking",
      icon: <Bank className="h-5 w-5" />,
      fees: "Free",
      time: "Instant",
      limit: "£25,000",
      supported: ["UK Banks", "EU Banks"]
    },
    {
      id: "instant",
      name: "Instant Payments",
      icon: <Zap className="h-5 w-5" />,
      fees: "1%",
      time: "Instant",
      limit: "varies",
      supported: ["FPS", "Pix", "UPI", "PayNow"]
    }
  ];

  const regionalMethods = [
    { name: "iDEAL", country: "Netherlands", icon: "🇳🇱", fees: "Free" },
    { name: "Sofort", country: "Germany", icon: "🇩🇪", fees: "Free" },
    { name: "Giropay", country: "Germany", icon: "🇩🇪", fees: "Free" },
    { name: "Bancontact", country: "Belgium", icon: "🇧🇪", fees: "Free" },
    { name: "EPS", country: "Austria", icon: "🇦🇹", fees: "Free" },
    { name: "Przelewy24", country: "Poland", icon: "🇵🇱", fees: "2.3%" },
    { name: "Multibanco", country: "Portugal", icon: "🇵🇹", fees: "Free" },
    { name: "MyBank", country: "Italy", icon: "🇮🇹", fees: "Free" },
    { name: "Trustly", country: "Nordic", icon: "🇸🇪", fees: "2.9%" },
    { name: "PayU", country: "Eastern EU", icon: "🇵🇱", fees: "2.8%" }
  ];

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", icon: <DollarSign className="h-4 w-4" /> },
    { code: "EUR", name: "Euro", symbol: "€", icon: <Euro className="h-4 w-4" /> },
    { code: "GBP", name: "British Pound", symbol: "£", icon: <PoundSterling className="h-4 w-4" /> },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", icon: <Globe className="h-4 w-4" /> },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", icon: <DollarSign className="h-4 w-4" /> },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", icon: <Globe className="h-4 w-4" /> },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", icon: <DollarSign className="h-4 w-4" /> },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF", icon: <Globe className="h-4 w-4" /> }
  ];

  const recentTransactions = [
    { type: "Deposit", method: "SEPA", amount: "€5,000", status: "Completed", time: "2 hours ago" },
    { type: "Withdrawal", method: "Wire", amount: "$12,500", status: "Processing", time: "1 day ago" },
    { type: "Deposit", method: "Card", amount: "$2,500", status: "Completed", time: "3 days ago" }
  ];

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <div className="space-y-6">
      {/* Currency Selection */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Multi-Currency Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {currencies.map((curr) => (
              <Button
                key={curr.code}
                variant={currency === curr.code ? "default" : "outline"}
                onClick={() => setCurrency(curr.code)}
                className="flex items-center gap-2 text-white border-gray-600 hover:bg-gray-800"
              >
                {curr.icon}
                {curr.code}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-black/30">
          {paymentMethods.map((method) => (
            <TabsTrigger key={method.id} value={method.id} className="text-xs flex items-center gap-1 text-white data-[state=active]:text-white data-[state=active]:bg-purple-600">
              {method.icon}
              <span className="hidden sm:inline text-white">{method.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {paymentMethods.map((method) => (
          <TabsContent key={method.id} value={method.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Form */}
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {method.icon}
                    {method.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Amount</Label>
                      <Input 
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/30 text-white placeholder:text-gray-400 border-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Crypto Asset</Label>
                      <Select>
                        <SelectTrigger className="bg-black/30 text-white border-gray-600">
                          <SelectValue placeholder="BTC" className="text-white" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                          <SelectItem value="usdt">Tether (USDT)</SelectItem>
                          <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Payment Method Specific Fields */}
                  {method.id === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white font-medium">Card Number</Label>
                        <Input placeholder="1234 5678 9012 3456" className="bg-black/30 text-white placeholder:text-gray-400 border-gray-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white font-medium">Expiry Date</Label>
                          <Input placeholder="MM/YY" className="bg-black/30 text-white placeholder:text-gray-400 border-gray-600" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white font-medium">CVV</Label>
                          <Input placeholder="123" className="bg-black/30 text-white placeholder:text-gray-400 border-gray-600" />
                        </div>
                      </div>
                    </div>
                  )}

                  {method.id === "bank_wire" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white font-medium">Bank Name</Label>
                        <Input placeholder="Your Bank Name" className="bg-black/30 text-white placeholder:text-gray-400 border-gray-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white font-medium">Account Number</Label>
                          <Input placeholder="Account Number" className="bg-black/30 text-white placeholder:text-gray-400 border-gray-600" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white font-medium">Routing Number</Label>
                          <Input placeholder="Routing Number" className="bg-black/30 text-white placeholder:text-gray-400 border-gray-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white font-medium">SWIFT Code</Label>
                        <Input placeholder="SWIFT Code" className="bg-black/30 text-white placeholder:text-gray-400 border-gray-600" />
                      </div>
                    </div>
                  )}

                  {method.id === "open_banking" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white font-medium">Select Your Bank</Label>
                        <Select>
                          <SelectTrigger className="bg-black/30 text-white border-gray-600">
                            <SelectValue placeholder="Choose your bank" className="text-white" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hsbc">HSBC</SelectItem>
                            <SelectItem value="barclays">Barclays</SelectItem>
                            <SelectItem value="lloyds">Lloyds</SelectItem>
                            <SelectItem value="natwest">NatWest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="secure-connection" defaultChecked />
                        <Label htmlFor="secure-connection" className="text-white font-medium">Secure Bank Connection</Label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                    <span className="text-gray-400">Processing Fee</span>
                    <span className="text-white">{method.fees}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                    <span className="text-gray-400">Processing Time</span>
                    <span className="text-white">{method.time}</span>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Continue with {method.name}
                  </Button>
                </CardContent>
              </Card>

              {/* Method Details & Limits */}
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Daily Limit</span>
                      <span className="text-white">{method.limit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Processing Fee</span>
                      <span className="text-white">{method.fees}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Settlement Time</span>
                      <span className="text-white">{method.time}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Supported Networks</Label>
                    <div className="space-y-2">
                      {method.supported.map((network, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">{network}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {method.id === "instant" && (
                    <div className="space-y-2">
                      <Label className="text-white">Regional Options</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["FPS (UK)", "Pix (Brazil)", "UPI (India)", "PayNow (Singapore)"].map((option, index) => (
                          <Button key={index} variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-800">
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Regional Payment Methods */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {regionalMethods.map((method, index) => (
              <Button key={index} variant="outline" className="flex items-center gap-2 justify-start border-gray-600 text-white hover:bg-gray-800">
                <span className="text-lg">{method.icon}</span>
                <div className="text-left">
                  <p className="text-white text-sm">{method.name}</p>
                  <p className="text-gray-400 text-xs">{method.fees}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Convert Settings */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Auto-Convert Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Auto-convert to preferred crypto</p>
              <p className="text-sm text-gray-400">Automatically convert fiat deposits to your selected cryptocurrency</p>
            </div>
            <Switch checked={autoConvert} onCheckedChange={setAutoConvert} />
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Fiat Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${tx.type === 'Deposit' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {tx.type === 'Deposit' ? 
                      <TrendingUp className="h-4 w-4 text-green-400" /> : 
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    }
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.type} via {tx.method}</p>
                    <p className="text-sm text-gray-400">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{tx.amount}</p>
                  <Badge className={
                    tx.status === 'Completed' ? 'bg-green-500' :
                    tx.status === 'Processing' ? 'bg-yellow-500' : 'bg-gray-500'
                  }>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}