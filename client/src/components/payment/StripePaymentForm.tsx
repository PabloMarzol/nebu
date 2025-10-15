import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

// Initialize Stripe with environment variable
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

console.log('[Stripe] Using publishable key from env:', STRIPE_PUBLISHABLE_KEY ? 'Key loaded successfully' : 'Key not found');

// Check if we have a valid publishable key (should start with pk_)
if (STRIPE_PUBLISHABLE_KEY && !STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
  console.warn('[Stripe] Warning: Key should start with pk_ for frontend use');
}

// Fallback to fetch from backend if env var not available
const getStripePromise = async () => {
  if (STRIPE_PUBLISHABLE_KEY) {
    return loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  
  // Fetch from backend if not in env
  try {
    const response = await fetch('/api/payments/config');
    const config = await response.json();
    return loadStripe(config.publishableKey);
  } catch (error) {
    console.error('Failed to get Stripe config:', error);
    return null;
  }
};

// Get publishable key from environment or use working fallback
const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY?.startsWith('pk_') 
  ? import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  : 'pk_test_51RgpjICv8i69yuqzH9YNbzAWZWoStFRRb69Gw9DOT8KHrcOj7tj2DqQOJAhLA2jxvcLGVP1EeCCZm6Oycw0PIR9Z00xdRsazWo';

console.log('[Stripe] Using publishable key:', publishableKey?.substring(0, 20) + '...');
const stripePromise = loadStripe(publishableKey);

interface PaymentFormProps {
  amount: number;
  currency: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

function PaymentForm({ amount, currency, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Create payment intent when component mounts
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          onError('Failed to initialize payment');
        }
      })
      .catch(err => {
        console.error('Payment intent creation failed:', err);
        onError('Payment initialization failed');
      });
  }, [amount, currency, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'NebulaX Exchange User',
        },
      },
    });

    setProcessing(false);

    if (error) {
      console.error('Payment failed:', error);
      onError(error.message || 'Payment failed');
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent);
      toast({
        title: 'Payment Successful',
        description: `Deposited ${currency.toUpperCase()} ${amount}`,
      });
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#000000', // Changed to black for better visibility
        '::placeholder': {
          color: '#666666', // Darker placeholder for better readability
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              value={`${currency.toUpperCase()} ${amount}`}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label>Card Details</Label>
            <div className="mt-2 p-3 border rounded-md">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || processing || !clientSecret}
          >
            {processing ? 'Processing...' : `Pay ${currency.toUpperCase()} ${amount}`}
          </Button>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Secured by Stripe
          </div>
          <p>Your payment information is encrypted and secure</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StripePaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}