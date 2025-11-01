import Stripe from 'stripe';
import dotenv from "dotenv";
import { fxSwapService } from './fx_swap_service';
import { fxSwapExecutionService } from './fx_swap_execution_service';
import { FxSwapOrderStatus } from '@shared/fx_swap_schema';
import { randomUUID } from 'crypto';

dotenv.config();

let secretKey = process.env.STRIPE_LIVE_SECRET_KEY;

console.log('[Stripe] Raw key from env:', secretKey ? 'Key found (length: ' + secretKey.length + ')' : 'No key found');

if (!secretKey || (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_'))) {
  console.error('[Stripe] Invalid or missing secret key in environment');
  console.error('[Stripe] Expected format: sk_test_... or sk_live_...');
  console.error('[Stripe] Current value:', secretKey ? secretKey.substring(0, 10) + '...' : 'undefined');
  throw new Error('Invalid Stripe secret key. Please check your environment variables.');
}

console.log('[Stripe] Initializing with key type:', secretKey.startsWith('sk_test_') ? 'TEST' : 'LIVE');

export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-06-30.basil',
});

export class EnhancedStripePaymentService {
  /**
   * Create payment intent for FX swap (GBP->USDT)
   */
  async createFxSwapPaymentIntent(params: {
    userId: string;
    gbpAmount: number;
    destinationWallet: string;
    targetToken?: string;
  }) {
    try {
      const targetToken = params.targetToken || 'USDT';
      
      // Validate swap parameters
      const validation = await fxSwapService.validateSwapParams({
        fiatAmount: params.gbpAmount,
        destinationWallet: params.destinationWallet,
      });
      
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // Check user daily limit
      const withinLimit = await fxSwapService.checkUserDailyLimit(
        params.userId,
        params.gbpAmount
      );
      
      if (!withinLimit) {
        throw new Error('Daily swap limit exceeded');
      }
      
      // Calculate swap output for display
      const swapEstimate = await fxSwapService.calculateSwapOutput(
        params.gbpAmount,
        targetToken
      );
      
      // Generate unique client order ID
      const clientOrderId = `FX_${Date.now()}_${randomUUID().slice(0, 8)}`;
      
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(params.gbpAmount * 100), // Convert to pence
        currency: 'gbp',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          type: 'fx_swap',
          userId: params.userId,
          targetToken,
          destinationWallet: params.destinationWallet,
          clientOrderId,
          estimatedOutput: swapEstimate.estimatedOutput.toString(),
          fxRate: swapEstimate.fxRate.toString(),
          platform: 'NebulaX',
        },
        description: `Buy ${targetToken} with GBP - ${params.destinationWallet.slice(0, 10)}...`,
      });
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        clientOrderId,
        amount: paymentIntent.amount / 100, // Back to GBP
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        swapEstimate,
      };
    } catch (error: any) {
      console.error('[Stripe] FX swap payment intent creation failed:', error);
      throw new Error(error.message || 'Payment initialization failed');
    }
  }
  
  /**
   * Standard payment intent for regular deposits
   */
  async createPaymentIntent(amount: number, currency: string = 'usd', customerId?: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          type: 'deposit',
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
      console.error('[Stripe] Payment intent creation failed:', error);
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
      console.error('[Stripe] Customer creation failed:', error);
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
      console.error('[Stripe] Withdrawal failed:', error);
      throw new Error('Withdrawal processing failed');
    }
  }

  /**
   * Enhanced webhook handler with FX swap support
   */
  async handleWebhook(payload: any, signature: string) {
    try {
      console.log('[Stripe] Webhook received, signature:', signature ? 'present' : 'missing');
      console.log('[Stripe] Payload type:', typeof payload);
      
      // Use live webhook secret for live environment, test for test
      const isLiveKey = secretKey?.startsWith('sk_live_') || false;
      const webhookSecret = isLiveKey 
        ? process.env.STRIPE_WEBHOOK_SECRET 
        : process.env.STRIPE_WEBHOOK_SECRET_TEST || process.env.STRIPE_WEBHOOK_SECRET;
      
      console.log('[Stripe] Webhook secret configured:', !!webhookSecret);
      console.log('[Stripe] Environment:', isLiveKey ? 'LIVE' : 'TEST');
      
      let event;
      try {
        if (webhookSecret && signature && signature !== '') {
          // Verify signature if secret is configured and signature is provided
          console.log('[Stripe] Verifying webhook signature...');
          event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
          console.log('[Stripe] Signature verified successfully');
        } else if (!webhookSecret || (secretKey?.startsWith('sk_test_') && !signature)) {
          // No secret configured or test environment without signature - parse directly (for testing)
          console.log('[Stripe] No webhook secret or test environment, parsing payload directly');
          event = typeof payload === 'string' ? JSON.parse(payload) : payload;
        } else {
          // Secret configured but no signature provided in production
          throw new Error('Webhook signature required but not provided');
        }
        console.log('[Stripe] Event parsed successfully:', event.type);
      } catch (parseError) {
        console.error('[Stripe] Event parsing failed:', parseError);
        throw parseError;
      }

      console.log(`[Stripe] Webhook event received: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('[Stripe] Processing payment_intent.succeeded');
          return await this.handlePaymentSuccess(event.data.object);
        case 'payment_intent.payment_failed':
          console.log('[Stripe] Processing payment_intent.payment_failed');
          return await this.handlePaymentFailure(event.data.object);
        case 'payment_intent.canceled':
          console.log('[Stripe] Processing payment_intent.canceled');
          return await this.handlePaymentCanceled(event.data.object);
        case 'customer.created':
          console.log('[Stripe] Processing customer.created');
          return await this.handleCustomerCreated(event.data.object);
        default:
          console.log(`[Stripe] Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error: any) {
      console.error('[Stripe] Webhook error:', error);
      throw new Error(error.message || 'Webhook processing failed');
    }
  }

  /**
   * Handle successful payment - trigger FX swap if applicable
   */
  async handlePaymentSuccess(paymentIntent: any) {
    console.log('[Stripe] Payment succeeded:', paymentIntent.id);
    console.log('[Stripe] Payment metadata:', paymentIntent.metadata);
    
    const metadata = paymentIntent.metadata;
    
    // Check if this is an FX swap payment
    if (metadata && metadata.type === 'fx_swap') {
      console.log('[Stripe] FX swap payment detected, processing...');
      try {
        await this.processFxSwapPayment(paymentIntent);
        return { 
          processed: true, 
          type: 'fx_swap_payment_success',
          paymentIntentId: paymentIntent.id 
        };
      } catch (error: any) {
        console.error('[Stripe] FX swap processing failed:', error);
        return { 
          processed: false, 
          type: 'fx_swap_payment_failed',
          error: error.message 
        };
      }
    } else {
      console.log('[Stripe] Regular payment (not FX swap), metadata:', metadata);
    }
    
    // Regular deposit handling
    return { 
      processed: true, 
      type: 'payment_success',
      paymentIntentId: paymentIntent.id 
    };
  }

  /**
   * Process FX swap after Stripe payment confirmation
   */
  private async processFxSwapPayment(paymentIntent: any) {
    const metadata = paymentIntent.metadata;
    
    console.log('[FxSwap] Processing payment for:', metadata.clientOrderId);
    
    // Check if order already exists
    let order = await fxSwapService.getOrderByPaymentIntent(paymentIntent.id);
    
    if (!order) {
      // Create new order
      const orderId = await fxSwapService.createOrder({
        userId: metadata.userId,
        stripePaymentIntentId: paymentIntent.id,
        clientOrderId: metadata.clientOrderId,
        fiatCurrency: 'GBP',
        fiatAmount: paymentIntent.amount / 100, // Convert pence to GBP
        targetToken: metadata.targetToken || 'USDT',
        destinationWallet: metadata.destinationWallet,
      });
      
      order = await fxSwapService.getOrder(orderId);
    }
    
    if (!order) {
      throw new Error('Failed to create or retrieve order');
    }
    
    // Update order status to STRIPE_CONFIRMED
    await fxSwapService.updateOrderStatus(
      order.id,
      FxSwapOrderStatus.STRIPE_CONFIRMED
    );
    
    console.log(`[FxSwap] Order ${order.id} confirmed, triggering swap execution`);
    
    // Trigger swap execution asynchronously (don't block webhook response)
    this.triggerSwapExecution(order.id).catch(error => {
      console.error(`[FxSwap] Async swap execution failed for order ${order.id}:`, error);
    });
    
    return order;
  }
  
  /**
   * Trigger swap execution asynchronously
   * This runs in background and doesn't block webhook response
   */
  private async triggerSwapExecution(orderId: string): Promise<void> {
    try {
      console.log(`[FxSwap] Starting async swap execution for order ${orderId}`);
      
      // Wait a bit to ensure webhook response is sent
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Execute the swap
      await fxSwapExecutionService.executeSwap(orderId);
      
      console.log(`[FxSwap] Async swap execution completed for order ${orderId}`);
      
    } catch (error: any) {
      console.error(`[FxSwap] Swap execution error for order ${orderId}:`, error);
      
      // Order status is already updated to SWAP_FAILED in executeSwap()
      // Here we could add additional error handling like:
      // - Send notification to admin
      // - Queue for retry
      // - Log to monitoring system
    }
  }

  async handlePaymentFailure(paymentIntent: any) {
    console.log('[Stripe] Payment failed:', paymentIntent.id);
    
    const metadata = paymentIntent.metadata;
    
    // If FX swap, mark order as failed
    if (metadata.type === 'fx_swap') {
      const order = await fxSwapService.getOrderByPaymentIntent(paymentIntent.id);
      
      if (order) {
        await fxSwapService.updateOrderStatus(
          order.id,
          FxSwapOrderStatus.STRIPE_FAILED,
          {
            errorMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
            errorCode: paymentIntent.last_payment_error?.code || 'payment_failed',
          }
        );
      }
    }
    
    return { 
      processed: true, 
      type: 'payment_failure',
      paymentIntentId: paymentIntent.id 
    };
  }
  
  async handlePaymentCanceled(paymentIntent: any) {
    console.log('[Stripe] Payment canceled:', paymentIntent.id);
    
    const metadata = paymentIntent.metadata;
    
    // If FX swap, mark order as failed
    if (metadata.type === 'fx_swap') {
      const order = await fxSwapService.getOrderByPaymentIntent(paymentIntent.id);
      
      if (order) {
        await fxSwapService.updateOrderStatus(
          order.id,
          FxSwapOrderStatus.STRIPE_FAILED,
          {
            errorMessage: 'Payment canceled by user',
            errorCode: 'payment_canceled',
          }
        );
      }
    }
    
    return { 
      processed: true, 
      type: 'payment_canceled',
      paymentIntentId: paymentIntent.id 
    };
  }

  async handleCustomerCreated(customer: any) {
    console.log('[Stripe] Customer created:', customer.id);
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
      console.error('[Stripe] Failed to fetch payment methods:', error);
      return [];
    }
  }
}

export const enhancedStripeService = new EnhancedStripePaymentService();

// For backwards compatibility
export const stripePaymentService = enhancedStripeService;
