import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import StripePaymentForm from './StripePaymentForm';
import { 
  CreditCard, 
  Building, 
  Zap, 
  DollarSign,
  Euro,
  PoundSterling,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function EnhancedPaymentGateway() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [currency, setCurrency] = useState('USD');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card (Stripe)',
      icon: <CreditCard className="h-5 w-5" />,
      fees: '3.5%',
      time: 'Instant',
      limit: '$50,000',
      description: 'Secure payments powered by Stripe'
    },
    {
      id: 'bank_wire',
      name: 'Bank Wire Transfer',
      icon: <Building className="h-5 w-5" />,
      fees: '$25',
      time: '1-3 days',
      limit: '$1,000,000',
      description: 'Traditional bank wire transfers'
    },
    {
      id: 'sepa',
      name: 'SEPA Transfer',
      icon: <Euro className="h-5 w-5" />,
      fees: 'Free',
      time: 'Same day',
      limit: '€100,000',
      description: 'European instant transfers'
    }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ];

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
  const selectedCurrency = currencies.find(c => c.code === currency);

  const handleStripeSuccess = (paymentIntent: any) => {
    toast({
      title: 'Payment Successful',
      description: `Deposited ${currency} ${amount} successfully`,
    });
    setShowStripeForm(false);
    setAmount('');
  };

  const handleStripeError = (error: string) => {
    toast({
      title: 'Payment Failed',
      description: error,
      variant: 'destructive',
    });
  };

  const handleTraditionalPayment = () => {
    toast({
      title: 'Payment Instructions Sent',
      description: `Instructions for ${selectedMethod?.name} have been sent to your email`,
    });
  };

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return false;
    }
    if (numAmount > 50000) {
      toast({
        title: 'Amount Too Large',
        description: 'Maximum amount is $50,000 for card payments',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleProceed = () => {
    if (!validateAmount()) return;

    if (paymentMethod === 'stripe') {
      setShowStripeForm(true);
    } else {
      handleTraditionalPayment();
    }
  };

  if (showStripeForm) {
    return (
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowStripeForm(false)}
            className="mb-2"
          >
            ← Back to Payment Options
          </Button>
        </div>
        <StripePaymentForm
          amount={parseFloat(amount)}
          currency={currency.toLowerCase()}
          onSuccess={handleStripeSuccess}
          onError={handleStripeError}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Gateway
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Secure deposits and withdrawals for your NebulaX Exchange account
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/30">
          <TabsTrigger value="deposit" className="flex items-center gap-2 text-white data-[state=active]:text-white data-[state=active]:bg-purple-600">
            <ArrowDownLeft className="h-4 w-4" />
            Deposit Funds
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2 text-white data-[state=active]:text-white data-[state=active]:bg-purple-600">
            <ArrowUpRight className="h-4 w-4" />
            Withdraw Funds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all text-white ${
                      paymentMethod === method.id 
                        ? 'border-purple-500 bg-purple-900/30' 
                        : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-white">{method.icon}</span>
                        <span className="font-medium text-white">{method.name}</span>
                      </div>
                      <Badge variant={method.fees === 'Free' ? 'default' : 'secondary'} className="text-white">
                        {method.fees}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-white" />
                        <span className="text-white">{method.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-white" />
                        <span className="text-white">{method.limit}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white mt-1">{method.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Deposit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currency" className="text-white font-medium">Currency</Label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-black/30 px-3 py-2 text-sm text-white ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <span>
                        {currencies.find(c => c.code === currency)?.symbol} {currencies.find(c => c.code === currency)?.name}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-gray-600 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                        {currencies.map((curr) => (
                          <button
                            key={curr.code}
                            type="button"
                            onClick={() => {
                              setCurrency(curr.code);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center justify-between"
                          >
                            <span>{curr.symbol} {curr.name}</span>
                            {currency === curr.code && <Check className="h-4 w-4" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount" className="text-white font-medium">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-0 text-white font-medium z-10 pointer-events-none flex items-center h-10">
                      {selectedCurrency?.symbol}
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 bg-black/30 text-white placeholder:text-gray-400 border-gray-600 h-10"
                    />
                  </div>
                </div>

                {selectedMethod && (
                  <div className="bg-gray-800/70 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-white">Payment Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white">Amount:</span>
                        <span className="text-white font-medium">{selectedCurrency?.symbol}{amount || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white">Fee:</span>
                        <span className="text-white font-medium">{selectedMethod.fees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white">Processing Time:</span>
                        <span className="text-white font-medium">{selectedMethod.time}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleProceed} 
                  className="w-full"
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  {paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Get Payment Instructions'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="withdraw" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Request</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Enhanced Security Required</h3>
                <p className="text-gray-600 mb-4">
                  Withdrawals require additional verification and will be processed manually for security.
                </p>
                <Button variant="outline">
                  Request Withdrawal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}