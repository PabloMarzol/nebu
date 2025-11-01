import { Router } from 'express';
import { randomUUID } from 'crypto';
import { paymentProviderService } from '../services/payment-provider-service';
import { fxSwapService } from '../services/fx_swap_service';
import { fxSwapExecutionService } from '../services/fx_swap_execution_service';
import { verifyWalletAuth } from '../middleware/walletAuth';
import { walletUserService } from '../services/wallet-user-service';
import monitoringRoutes from './fx-swap-monitoring';

const router = Router();

/**
 * POST /api/fx-swap/quote
 * Get swap quote (FX rate + estimated output)
 */
router.post('/quote', async (req: any, res) => {
  try {
    const { gbpAmount, targetToken = 'USDT' } = req.body;
    
    if (!gbpAmount || gbpAmount <= 0) {
      return res.status(400).json({ error: 'Valid GBP amount required' });
    }
    
    // Calculate swap output
    const quote = await fxSwapService.calculateSwapOutput(gbpAmount, targetToken);
    
    // Calculate additional fields required by frontend
    const totalCost = gbpAmount; // Total GBP amount user pays
    const minimumOutput = quote.estimatedOutput * 0.95; // 5% slippage protection
    const rateValidUntil = new Date(Date.now() + 30000).toISOString(); // 30 seconds from now
    
    res.json({
      success: true,
      quote: {
        fiatAmount: gbpAmount,
        fiatCurrency: 'GBP',
        fxRate: quote.fxRate,
        usdAmount: quote.usdAmount,
        estimatedOutput: quote.estimatedOutput,
        targetToken: targetToken,
        platformFee: quote.platformFee,
        gasFee: quote.estimatedGasFee, // ← Fixed: Frontend expects "gasFee"
        totalCost: totalCost,
        minimumOutput: minimumOutput,
        priceImpact: 0.1, // Placeholder - 0.1% impact
        rateValidUntil: rateValidUntil,
      }
    });
    
  } catch (error: any) {
    console.error('[FxSwap] Quote error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get swap quote' 
    });
  }
});

/**
 * POST /api/fx-swap/create-payment
 * Create payment with best provider (Stripe vs ALT5 Pay)
 */
router.post('/create-payment', verifyWalletAuth, async (req: any, res) => {
  try {
    const { 
      gbpAmount, 
      destinationWallet, 
      targetToken = 'USDT',
      preferredProvider,
      fiatCurrency = 'USD'
    } = req.body;
    const walletAddress = req.walletAddress; // Get wallet address from auth middleware
    
    if (!walletAddress) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Find or create user by wallet address
    const userId = await walletUserService.findOrCreateUserByWallet(walletAddress);
    
    if (!gbpAmount || gbpAmount <= 0) {
      return res.status(400).json({ error: 'Valid GBP amount required' });
    }
    
    if (!destinationWallet) {
      return res.status(400).json({ error: 'Destination wallet required' });
    }
    
    // Validate parameters
    const validation = await fxSwapService.validateSwapParams({
      fiatAmount: gbpAmount,
      destinationWallet,
    });
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    // Generate unique client order ID
    const clientOrderId = `FX_${Date.now()}_${randomUUID().slice(0, 8)}`;
    
    // Create payment with best provider (or user preferred)
    const paymentResult = await paymentProviderService.createPayment({
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId,
      preferredProvider,
      fiatCurrency
    });
    
    // Format response based on provider
    let responseData: any = {
      success: true,
      provider: paymentResult.provider,
      orderId: clientOrderId,
      amount: gbpAmount,
      targetToken,
      fiatCurrency,
      comparison: paymentResult.comparison,
    };

    if (paymentResult.provider === 'stripe') {
      responseData.clientSecret = paymentResult.paymentData.clientSecret;
      responseData.paymentIntentId = paymentResult.paymentData.paymentIntentId;
      responseData.swapEstimate = paymentResult.paymentData.swapEstimate;
    } else if (paymentResult.provider === 'alt5pay') {
      responseData.paymentAddress = paymentResult.paymentData.paymentAddress;
      responseData.expiresAt = paymentResult.paymentData.expiresAt;
      responseData.cryptoAmount = gbpAmount / parseFloat(paymentResult.paymentData.rate || '1');
    }
    
    res.json(responseData);
    
  } catch (error: any) {
    console.error('[FxSwap] Payment creation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create payment' 
    });
  }
});

/**
 * GET /api/fx-swap/order/:orderId
 * Get order status
 */
router.get('/order/:orderId', verifyWalletAuth, async (req: any, res) => {
  try {
    const { orderId } = req.params;
    const walletAddress = req.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Find user by wallet address
    const userId = await walletUserService.findOrCreateUserByWallet(walletAddress);
    
    const order = await fxSwapService.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Verify order belongs to user
    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({
      success: true,
      order: {
        id: order.id,
        clientOrderId: order.clientOrderId,
        status: order.status,
        fiatCurrency: order.fiatCurrency,
        fiatAmount: order.fiatAmount,
        targetToken: order.targetToken,
        targetTokenAmount: order.targetTokenAmount,
        destinationWallet: order.destinationWallet,
        fxRate: order.fxRate,
        fxRateSource: order.fxRateSource,
        platformFeeAmount: order.platformFeeAmount,
        networkFeeAmount: order.networkFeeAmount,
        swapTxHash: order.swapTxHash,
        transferTxHash: order.transferTxHash,
        errorMessage: order.errorMessage,
        createdAt: order.createdAt,
        completedAt: order.completedAt,
      }
    });
    
  } catch (error: any) {
    console.error('[FxSwap] Order fetch error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch order' 
    });
  }
});

/**
 * GET /api/fx-swap/history
 * Get user's swap history
 */
router.get('/history', verifyWalletAuth, async (req: any, res) => {
  try {
    const walletAddress = req.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Find user by wallet address
    const userId = await walletUserService.findOrCreateUserByWallet(walletAddress);
    
    const limit = parseInt(req.query.limit as string) || 20;
    const orders = await fxSwapService.getUserOrders(userId, limit);
    
    res.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        clientOrderId: order.clientOrderId,
        status: order.status,
        fiatAmount: order.fiatAmount,
        targetTokenAmount: order.targetTokenAmount,
        targetToken: order.targetToken,
        fxRate: order.fxRate,
        createdAt: order.createdAt,
        completedAt: order.completedAt,
      }))
    });
    
  } catch (error: any) {
    console.error('[FxSwap] History fetch error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch history' 
    });
  }
});

/**
 * GET /api/fx-swap/limits
 * Get user's swap limits
 */
router.get('/limits', verifyWalletAuth, async (req: any, res) => {
  try {
    const walletAddress = req.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Find user by wallet address (just for validation, limits are global)
    await walletUserService.findOrCreateUserByWallet(walletAddress);
    
    const config = await fxSwapService.getActiveConfig();
    
    res.json({
      success: true,
      limits: {
        minSwapAmountGbp: parseFloat(config.minSwapAmountGbp),
        maxSwapAmountGbp: parseFloat(config.maxSwapAmountGbp),
        dailyUserLimitGbp: parseFloat(config.dailyUserLimitGbp),
        platformFeePercent: parseFloat(config.platformFeePercent),
      }
    });
    
  } catch (error: any) {
    console.error('[FxSwap] Limits fetch error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch limits' 
    });
  }
});

/**
 * GET /api/fx-swap/hot-wallet/balance
 * Get hot wallet balance (admin only)
 */
router.get('/hot-wallet/balance', async (req: any, res) => {
  try {
    // TODO: Add admin authentication check
    
    const tokenAddress = req.query.token ? String(req.query.token) : 'ETH';
    
    const balance = await fxSwapExecutionService.getHotWalletBalance(tokenAddress);
    
    res.json({
      success: true,
      balance,
      token: tokenAddress,
    });
    
  } catch (error: any) {
    console.error('[FxSwap] Balance fetch error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch balance' 
    });
  }
});

// Register monitoring routes
router.use('/', monitoringRoutes);

export default router;
