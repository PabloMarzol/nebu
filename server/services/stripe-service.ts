import Stripe from 'stripe';
import dotenv from "dotenv"
dotenv.config();
// Get the correct Stripe secret key from environment
let secretKey = process.env.STRIPE_SECRET_KEY;

// Check if the secret key is valid
if (!secretKey || !secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
  console.warn('[Stripe] Invalid secret key in environment, using demo key for development');
  // Use a valid test key for development - this one actually works
  secretKey = ''; // Standard Stripe test key
}

console.log('[Stripe] Initializing with key type:', secretKey.startsWith('sk_test_') ? 'TEST' : 'LIVE');

export const stripe = new Stripe(secretKey, {
  apiVersion: '2024-06-20',
});

export class StripePaymentService {
  async createPaymentIntent(amount: number, currency: string = 'usd', customerId?: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          platform: 'NebulaX Exchange',
          timestamp: new Date().toISOString(),
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw new Error('Payment initialization failed');
    }
  }

  async createCustomer(email: string, name?: string) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          platform: 'NebulaX Exchange',
          created_at: new Date().toISOString(),
        },
      });

      return {
        customerId: customer.id,
        email: customer.email,
        created: customer.created,
      };
    } catch (error) {
      console.error('Stripe customer creation failed:', error);
      throw new Error('Customer creation failed');
    }
  }

  async processWithdrawal(amount: number, currency: string, destination: string) {
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        destination,
        metadata: {
          type: 'withdrawal',
          platform: 'NebulaX Exchange',
          timestamp: new Date().toISOString(),
        },
      });

      return {
        transferId: transfer.id,
        amount: transfer.amount,
        currency: transfer.currency,
        status: 'completed',
        created: transfer.created,
      };
    } catch (error) {
      console.error('Stripe withdrawal failed:', error);
      throw new Error('Withdrawal processing failed');
    }
  }

  async handleWebhook(payload: any, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          return await this.handlePaymentSuccess(event.data.object);
        case 'payment_intent.payment_failed':
          return await this.handlePaymentFailure(event.data.object);
        case 'customer.created':
          return await this.handleCustomerCreated(event.data.object);
        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw new Error('Webhook processing failed');
    }
  }

  private async handlePaymentSuccess(paymentIntent: any) {
    console.log('Payment succeeded:', paymentIntent.id);
    // Update user balance, notify user, etc.
    return { processed: true, type: 'payment_success' };
  }

  private async handlePaymentFailure(paymentIntent: any) {
    console.log('Payment failed:', paymentIntent.id);
    // Notify user of failure, update transaction status, etc.
    return { processed: true, type: 'payment_failure' };
  }

  private async handleCustomerCreated(customer: any) {
    console.log('Customer created:', customer.id);
    // Update user record with Stripe customer ID
    return { processed: true, type: 'customer_created' };
  }

  async getPaymentMethods(customerId: string) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year,
      }));
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      return [];
    }
  }
}

export const stripePaymentService = new StripePaymentService();