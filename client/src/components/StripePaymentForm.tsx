// components/StripePaymentForm.tsx
import { useState, useEffect } from 'react';
import { 
  useStripe, 
  useElements, 
  PaymentElement,
  Elements 
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_LIVE_KEY || '');

function CheckoutForm({ clientSecret, onSuccess }: {
  clientSecret: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [elementError, setElementError] = useState<string | null>(null);

  // Wait for the Payment Element to be fully ready
  useEffect(() => {
    if (!elements) return;

    // Use a simple timeout approach to ensure the PaymentElement has time to mount
    const timeoutId = setTimeout(() => {
      console.log('Payment Element initialization timeout - assuming ready');
      setIsElementReady(true);
      setElementError(null);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !isElementReady) {
      console.error('Stripe, elements, or payment element not ready');
      alert('Payment form is not ready. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Get the payment element and verify it's mounted
      const paymentElement = elements.getElement('payment');
      if (!paymentElement) {
        console.error('Payment Element not found');
        alert('Payment form is not properly loaded. Please refresh the page.');
        setIsLoading(false);
        return;
      }

      // Wait a moment to ensure the element is fully initialized
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Confirming payment with Stripe...');
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success?payment_intent_client_secret=' + clientSecret,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('Payment failed:', error);
        alert(`Payment failed: ${error.message}`);
      } else {
        console.log('Payment successful - handling completion');
        // Don't call onSuccess immediately - let the return_url handle it
        // or check if payment is complete
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          console.log('Payment confirmed as succeeded');
          onSuccess();
        } else {
          console.log('Payment initiated, waiting for redirect or completion');
          // The return_url will handle the success
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment processing error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while Payment Element is initializing
  if (!isElementReady && !elementError) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="text-center text-sm text-gray-500">
          Loading secure payment form...
        </div>
      </div>
    );
  }

  // Show error state if element failed to load
  if (elementError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{elementError}</div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button 
        type="submit" 
        disabled={!stripe || isLoading || !isElementReady}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Pay now'
        )}
      </button>
    </form>
  );
}

export default function StripePaymentForm({ 
  clientSecret, 
  onSuccess 
}: {
  clientSecret: string;
  onSuccess: () => void;
}) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements 
      stripe={stripePromise} 
      options={options}
    >
      <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
}
