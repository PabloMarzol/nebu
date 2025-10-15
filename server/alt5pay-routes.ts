import { Router } from 'express';
import { createAlt5PayService } from './alt5pay-integration';
import type { WebhookPayload } from './alt5pay-integration';

const router = Router();

// Initialize Alt5Pay service
let alt5PayService: ReturnType<typeof createAlt5PayService>;

try {
  alt5PayService = createAlt5PayService();
} catch (error) {
  console.warn('[Alt5Pay] Service not configured:', (error as Error).message);
}

// Create payment wallet endpoint
router.post('/alt5pay/create-wallet', async (req, res) => {
  if (!alt5PayService) {
    return res.status(500).json({
      status: 'error',
      message: 'Alt5Pay service not configured. Please set environment variables.'
    });
  }

  try {
    const { asset, refId, amount, currency, webhookUrl } = req.body;

    if (!asset || !refId || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: asset, refId, amount'
      });
    }

    const result = await alt5PayService.createWallet(
      asset,
      refId,
      webhookUrl,
      currency || 'USD'
    );

    res.json(result);
  } catch (error) {
    console.error('[Alt5Pay] Create wallet error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create payment wallet'
    });
  }
});

// Check payment status by address
router.post('/alt5pay/check-payment', async (req, res) => {
  if (!alt5PayService) {
    return res.status(500).json({
      status: 'error',
      message: 'Alt5Pay service not configured'
    });
  }

  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        status: 'error',
        message: 'Address is required'
      });
    }

    const result = await alt5PayService.getTransactionByAddress(address);
    res.json(result);
  } catch (error) {
    console.error('[Alt5Pay] Check payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check payment status'
    });
  }
});

// Check payment status by transaction ID
router.post('/alt5pay/check-transaction', async (req, res) => {
  if (!alt5PayService) {
    return res.status(500).json({
      status: 'error',
      message: 'Alt5Pay service not configured'
    });
  }

  try {
    const { txid } = req.body;

    if (!txid) {
      return res.status(400).json({
        status: 'error',
        message: 'Transaction ID is required'
      });
    }

    const result = await alt5PayService.getTransactionByTxId(txid);
    res.json(result);
  } catch (error) {
    console.error('[Alt5Pay] Check transaction error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check transaction status'
    });
  }
});

// Webhook endpoint for payment notifications
router.post('/alt5pay/webhook', async (req, res) => {
  if (!alt5PayService) {
    return res.status(500).json({
      status: 'error',
      message: 'Alt5Pay service not configured'
    });
  }

  try {
    const signature = req.headers['signature'] as string;
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    if (!signature || !alt5PayService.verifyWebhookSignature(body, signature)) {
      console.error('[Alt5Pay] Invalid webhook signature');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid signature'
      });
    }

    const payload: WebhookPayload = req.body;
    
    console.log('[Alt5Pay] Webhook received:', {
      ref_id: payload.ref_id,
      status: payload.status,
      coin: payload.coin,
      amount: payload.amount,
      transaction_id: payload.transaction_id
    });

    // Process the payment notification
    if (payload.status === 'Paid') {
      // Here you would typically:
      // 1. Update your database with the payment status
      // 2. Credit the user's account
      // 3. Send confirmation emails
      // 4. Trigger any other business logic
      
      console.log(`[Alt5Pay] Payment confirmed for order ${payload.ref_id}: ${payload.amount} ${payload.coin}`);
      
      // Example: You could emit a WebSocket event to notify the frontend
      // wsServer.emit('payment-confirmed', payload);
    }

    // Always respond with 200 OK to acknowledge receipt
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('[Alt5Pay] Webhook processing error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process webhook'
    });
  }
});

// Get supported cryptocurrencies
router.get('/alt5pay/supported-assets', (req, res) => {
  const assets = [
    { code: 'BTC', name: 'Bitcoin', network: 'mainnet' },
    { code: 'ETH', name: 'Ethereum', network: 'mainnet' },
    { code: 'USDT', name: 'Tether (ERC20)', network: 'mainnet' },
    { code: 'USDC', name: 'USD Coin', network: 'mainnet' },
    { code: 'SOL', name: 'Solana', network: 'mainnet' },
    { code: 'ADA', name: 'Cardano', network: 'mainnet' },
    { code: 'AVAX', name: 'Avalanche', network: 'mainnet' },
    { code: 'MATIC', name: 'Polygon', network: 'mainnet' },
    { code: 'LTC', name: 'Litecoin', network: 'mainnet' },
    { code: 'BCH', name: 'Bitcoin Cash', network: 'mainnet' },
    { code: 'DOGE', name: 'Dogecoin', network: 'mainnet' },
    { code: 'XRP', name: 'XRP', network: 'mainnet' },
    { code: 'BNB', name: 'BNB', network: 'mainnet' },
    { code: 'DASH', name: 'Dash', network: 'mainnet' },
    { code: 'SHIB', name: 'Shiba Inu', network: 'mainnet' }
  ];

  res.json({
    status: 'success',
    data: assets
  });
});

export default router;