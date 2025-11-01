import { Router } from 'express';
import { alt5PayService } from '../services/alt5pay-service';
import { alt5ProService } from '../services/alt5pro-service';
import { paymentProviderService } from '../services/payment-provider-service';

const router = Router();

/**
 * GET /api/alt5-test/config
 * Test ALT5 configuration and connectivity
 */
router.get('/config', async (req, res) => {
  try {
    console.log('[ALT5 Test] Checking configuration...');
    
    // Check ALT5 Pay configuration
    const alt5PayConfig = {
      apiKey: process.env.ALT5_PAY_API_KEY ? '✅ Set' : '❌ Missing',
      secretKey: process.env.ALT5_PAY_SECRET_KEY ? '✅ Set' : '❌ Missing',
      merchantId: process.env.ALT5_PAY_MERCHANT_ID ? '✅ Set' : '❌ Missing',
      environment: process.env.ALT5_PAY_ENVIRONMENT || 'sandbox',
      enabled: process.env.ALT5_PAY_ENABLED === 'true'
    };

    // Check ALT5 Pro configuration
    const alt5ProConfig = {
      email: process.env.ALT5_EMAIL ? '✅ Set' : '❌ Missing',
      password: process.env.ALT5_PASSWORD ? '✅ Set' : '❌ Missing',
      environment: process.env.ALT5_PRO_ENVIRONMENT || 'sandbox'
    };

    res.json({
      success: true,
      alt5Pay: alt5PayConfig,
      alt5Pro: alt5ProConfig,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[ALT5 Test] Config check failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/alt5-test/payment-address
 * Test creating a payment address with ALT5 Pay
 */
router.post('/payment-address', async (req, res) => {
  try {
    const { asset = 'usdt', refId = 'test_' + Date.now(), currency = 'USD' } = req.body;
    
    console.log('[ALT5 Test] Creating payment address...', { asset, refId, currency });
    
    const paymentAddress = await alt5PayService.createPaymentAddress({
      asset: asset as any,
      refId,
      currency: currency as any
    });
    
    res.json({
      success: true,
      paymentAddress: paymentAddress.data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[ALT5 Test] Payment address creation failed:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

/**
 * POST /api/alt5-test/price
 * Test getting current price from ALT5 Pay
 */
router.post('/price', async (req, res) => {
  try {
    const { coin = 'USDT', currency = 'USD' } = req.body;
    
    console.log('[ALT5 Test] Getting price...', { coin, currency });
    
    const price = await alt5PayService.getCurrentPrice({
      coin: coin as any,
      currency: currency as any
    });
    
    console.log('[ALT5 Test] Price response:', JSON.stringify(price, null, 2));
    
    res.json({
      success: true,
      price: price.data,
      fullResponse: price,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[ALT5 Test] Price fetch failed:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

/**
 * POST /api/alt5-test/provider-comparison
 * Test provider comparison logic
 */
router.post('/provider-comparison', async (req, res) => {
  try {
    const { gbpAmount = 100, targetToken = 'USDT', fiatCurrency = 'USD' } = req.body;
    
    console.log('[ALT5 Test] Comparing providers...', { gbpAmount, targetToken, fiatCurrency });
    
    const comparison = await paymentProviderService.compareProviders({
      gbpAmount,
      targetToken,
      fiatCurrency
    });
    
    res.json({
      success: true,
      comparison,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[ALT5 Test] Provider comparison failed:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
});

/**
 * GET /api/alt5-test/balances
 * Test getting ALT5 Pay balances
 */
router.get('/balances', async (req, res) => {
  try {
    console.log('[ALT5 Test] Getting balances...');
    
    const balances = await alt5PayService.getBalances();
    
    res.json({
      success: true,
      balances: balances.data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[ALT5 Test] Balance fetch failed:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

/**
 * POST /api/alt5-test/fx-swap-payment
 * Test creating FX swap payment with ALT5 Pay
 */
router.post('/fx-swap-payment', async (req, res) => {
  try {
    const { 
      gbpAmount = 100, 
      destinationWallet = '0x1234567890123456789012345678901234567890',
      targetToken = 'USDT',
      userId = 'test_user',
      clientOrderId = 'test_' + Date.now()
    } = req.body;
    
    console.log('[ALT5 Test] Creating FX swap payment...', { 
      gbpAmount, 
      destinationWallet, 
      targetToken, 
      userId, 
      clientOrderId 
    });
    
    const payment = await alt5PayService.createFxSwapPayment({
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId
    });
    
    res.json({
      success: true,
      payment,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[ALT5 Test] FX swap payment creation failed:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

/**
 * GET /api/alt5-test/market-data
 * Test ALT5 Pro market data
 */
router.get('/market-data', async (req, res) => {
  try {
    const { fiatCurrency = 'USD', cryptoCurrency = 'USDT' } = req.query;
    
    console.log('[ALT5 Test] Getting market data...', { fiatCurrency, cryptoCurrency });
    
    const marketData = await alt5ProService.getMarketDataForFxSwap(
      fiatCurrency as string,
      cryptoCurrency as string
    );
    
    res.json({
      success: true,
      marketData,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[Alt5Pro] Market data fetch failed:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

export default router;
