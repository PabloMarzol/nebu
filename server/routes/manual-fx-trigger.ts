import { Router } from 'express';
import { fxSwapService } from '../services/fx_swap_service';
import { fxSwapExecutionService } from '../services/fx_swap_execution_service';
import { FxSwapOrderStatus } from '@shared/fx_swap_schema';

const router = Router();

/**
 * Manual FX Swap Trigger
 * Triggers FX swap execution for a specific payment without requiring Stripe webhook
 * FOR TESTING AND DEBUGGING ONLY
 */

/**
 * Manual trigger for FX swap execution
 * POST /api/manual/trigger-fx-swap
 * 
 * Body: {
 *   paymentIntentId: "pi_3SLUOYDtIRr6guyX1S7tEHVU",
 *   userId: "cd58399b-b81c-4e1a-bc8c-a41cc76e4325",
 *   fiatAmount: 10.00,
 *   destinationWallet: "0x3b2495e0f639bd4f942efd6cae2c15caa4efd312",
 *   clientOrderId: "FX_1761248519675_9a7334f9"
 * }
 */
router.post('/trigger-fx-swap', async (req, res) => {
  try {
    const { 
      paymentIntentId, 
      userId, 
      fiatAmount, 
      destinationWallet, 
      clientOrderId 
    } = req.body;

    console.log('[Manual FX Trigger] Starting manual FX swap execution');
    console.log('[Manual FX Trigger] Payment Intent:', paymentIntentId);
    console.log('[Manual FX Trigger] User ID:', userId);
    console.log('[Manual FX Trigger] Amount:', fiatAmount);
    console.log('[Manual FX Trigger] Destination:', destinationWallet);
    console.log('[Manual FX Trigger] Client Order ID:', clientOrderId);

    if (!paymentIntentId || !userId || !fiatAmount || !destinationWallet || !clientOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        required: ['paymentIntentId', 'userId', 'fiatAmount', 'destinationWallet', 'clientOrderId']
      });
    }

    // Check if order already exists for this payment intent
    let order = await fxSwapService.getOrderByPaymentIntent(paymentIntentId);
    
    if (!order) {
      console.log('[Manual FX Trigger] Creating new order for payment:', paymentIntentId);
      
      // Create order manually (simulating what webhook would do)
      const orderId = await fxSwapService.createOrder({
        userId,
        stripePaymentIntentId: paymentIntentId,
        clientOrderId,
        fiatCurrency: 'GBP',
        fiatAmount: parseFloat(fiatAmount),
        targetToken: 'USDT',
        destinationWallet: destinationWallet.toLowerCase(),
      });

      order = await fxSwapService.getOrder(orderId);
      
      if (!order) {
        throw new Error('Failed to create order');
      }

      // Update status to STRIPE_CONFIRMED (since payment already succeeded)
      await fxSwapService.updateOrderStatus(
        orderId,
        FxSwapOrderStatus.STRIPE_CONFIRMED
      );

      console.log('[Manual FX Trigger] Order created successfully:', orderId);
    } else {
      console.log('[Manual FX Trigger] Found existing order:', order.id);
      
      // Ensure order is in correct status
      if (order.status !== FxSwapOrderStatus.STRIPE_CONFIRMED) {
        await fxSwapService.updateOrderStatus(
          order.id,
          FxSwapOrderStatus.STRIPE_CONFIRMED
        );
        console.log('[Manual FX Trigger] Updated order status to STRIPE_CONFIRMED');
      }
    }

    console.log('[Manual FX Trigger] Starting FX swap execution for order:', order.id);
    
    // Execute the FX swap
    await fxSwapExecutionService.executeSwap(order.id);

    console.log('[Manual FX Trigger] FX swap execution completed successfully');

    res.json({
      success: true,
      message: 'Manual FX swap execution completed',
      data: {
        orderId: order.id,
        paymentIntentId: paymentIntentId,
        status: 'COMPLETED',
        estimatedOutput: order.targetTokenAmount,
        destinationWallet: order.destinationWallet
      }
    });

  } catch (error: any) {
    console.error('[Manual FX Trigger] Manual FX swap failed:', error);
    res.status(500).json({
      success: false,
      error: 'Manual FX swap execution failed',
      message: error.message
    });
  }
});

/**
 * Get manual FX swap status
 * GET /api/manual/fx-status/:paymentIntentId
 */
router.get('/fx-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const order = await fxSwapService.getOrderByPaymentIntent(paymentIntentId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found for this payment intent'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        fiatAmount: order.fiatAmount,
        targetTokenAmount: order.targetTokenAmount,
        destinationWallet: order.destinationWallet,
        createdAt: order.createdAt,
        completedAt: order.completedAt
      }
    });

  } catch (error: any) {
    console.error('[Manual FX Trigger] Status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check FX swap status',
      message: error.message
    });
  }
});

export default router;
