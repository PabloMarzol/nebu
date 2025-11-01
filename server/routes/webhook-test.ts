import { Router } from 'express';
import { enhancedStripeService } from '../services/stripe-service';

const router = Router();

/**
 * Test webhook endpoint for FX swap processing
 * This bypasses signature verification for testing purposes
 * POST /api/test/webhook
 */
router.post('/webhook', async (req, res) => {
  try {
    console.log('[Test Webhook] Received test webhook request');
    console.log('[Test Webhook] Body:', JSON.stringify(req.body, null, 2));
    
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({
        success: false,
        error: 'Missing type or data in webhook payload'
      });
    }
    
    console.log(`[Test Webhook] Processing event type: ${type}`);
    
    // Handle PowerShell serialization where metadata might be a string
    let paymentObject = data.object || data;
    
    // If metadata is a string (PowerShell serialization), convert it properly
    if (paymentObject.metadata && typeof paymentObject.metadata === 'string') {
      try {
        // Try to parse it as JSON if it's a string representation of an object
        paymentObject.metadata = JSON.parse(paymentObject.metadata);
      } catch (e) {
        // If it's not JSON, create mock metadata for testing
        console.log('[Test Webhook] Metadata is string, creating mock metadata for FX swap test');
        paymentObject.metadata = {
          type: 'fx_swap',
          userId: 'cd58399b-b81c-4e1a-bc8c-a41cc76e4325',
          targetToken: 'USDT',
          destinationWallet: '0x3b2495e0f639bd4f942efd6cae2c15caa4efd312',
          clientOrderId: 'FX_test_webhook_888',
          estimatedOutput: '12.7',
          fxRate: '1.27'
        };
      }
    }
    
    // Simulate Stripe event structure for testing
    const mockEvent = {
      type,
      data: {
        object: paymentObject
      }
    };
    
    // Process the event directly without signature verification
    let result;
    
    switch (type) {
      case 'payment_intent.succeeded':
        console.log('[Test Webhook] Processing payment_intent.succeeded');
        result = await enhancedStripeService.handlePaymentSuccess(mockEvent.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('[Test Webhook] Processing payment_intent.payment_failed');
        result = await enhancedStripeService.handlePaymentFailure(mockEvent.data.object);
        break;
      case 'payment_intent.canceled':
        console.log('[Test Webhook] Processing payment_intent.canceled');
        result = await enhancedStripeService.handlePaymentCanceled(mockEvent.data.object);
        break;
      default:
        console.log(`[Test Webhook] Unhandled event type: ${type}`);
        result = { processed: true, type: 'unknown_event' };
    }
    
    console.log('[Test Webhook] Processing result:', result);
    
    res.json({
      success: true,
      message: 'Test webhook processed successfully',
      result
    });
    
  } catch (error: any) {
    console.error('[Test Webhook] Processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Test webhook processing failed',
      message: error.message
    });
  }
});

/**
 * Test FX swap webhook specifically
 * POST /api/test/fx-swap-webhook
 */
router.post('/fx-swap-webhook', async (req, res) => {
  try {
    console.log('[Test FX Webhook] Received FX swap webhook test');
    
    const { paymentIntentId, userId, fiatAmount, destinationWallet, clientOrderId, targetToken = 'USDT' } = req.body;
    
    if (!paymentIntentId || !userId || !fiatAmount || !destinationWallet || !clientOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        required: ['paymentIntentId', 'userId', 'fiatAmount', 'destinationWallet', 'clientOrderId']
      });
    }
    
    // Create mock payment intent data
    const mockPaymentIntent = {
      id: paymentIntentId,
      amount: Math.round(fiatAmount * 100), // Convert to pence
      currency: 'gbp',
      metadata: {
        type: 'fx_swap',
        userId: userId,
        targetToken: targetToken,
        destinationWallet: destinationWallet,
        clientOrderId: clientOrderId,
        estimatedOutput: (fiatAmount * 1.27 * 0.95).toString(), // Mock estimate
        fxRate: '1.27'
      }
    };
    
    console.log('[Test FX Webhook] Processing mock payment intent:', mockPaymentIntent.id);
    
    // Process the FX swap payment
    const result = await enhancedStripeService.handlePaymentSuccess(mockPaymentIntent);
    
    console.log('[Test FX Webhook] FX swap processing result:', result);
    
    res.json({
      success: true,
      message: 'FX swap webhook test completed',
      result
    });
    
  } catch (error: any) {
    console.error('[Test FX Webhook] Processing error:', error);
    res.status(500).json({
      success: false,
      error: 'FX swap webhook test failed',
      message: error.message
    });
  }
});

export default router;
