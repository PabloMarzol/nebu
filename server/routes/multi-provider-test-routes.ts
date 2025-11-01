import { Router } from 'express';
import { changeNowService } from '../services/changenow-service';
import { nowPaymentsService } from '../services/nowpayments-service';
import { paymentProviderService } from '../services/payment-provider-service';

const router = Router();

/**
 * Test ChangeNow API connectivity
 */
router.get('/changenow/test', async (req, res) => {
  try {
    console.log('[MultiProviderTest] Testing ChangeNow API connectivity...');
    
    // Test supported currencies
    const currencies = await changeNowService.getSupportedCurrencies();
    const cryptoCurrencies = currencies.filter(c => !c.isFiat);
    const fiatCurrencies = currencies.filter(c => c.isFiat);

    // Test health check
    const health = await changeNowService.getProviderHealth();

    res.json({
      success: true,
      message: 'ChangeNow API test completed',
      data: {
        totalCurrencies: currencies.length,
        cryptoCurrencies: cryptoCurrencies.length,
        fiatCurrencies: fiatCurrencies.length,
        sampleCrypto: cryptoCurrencies.slice(0, 5).map(c => ({ ticker: c.ticker, name: c.name })),
        sampleFiat: fiatCurrencies.slice(0, 3).map(c => ({ ticker: c.ticker, name: c.name })),
        health
      }
    });
  } catch (error: any) {
    console.error('[MultiProviderTest] ChangeNow test failed:', error);
    res.status(500).json({
      success: false,
      message: 'ChangeNow API test failed',
      error: error.message
    });
  }
});

/**
 * Test NOWPayments API connectivity
 */
router.get('/nowpayments/test', async (req, res) => {
  try {
    console.log('[MultiProviderTest] Testing NOWPayments API connectivity...');
    
    // Test supported currencies
    const currencies = await nowPaymentsService.getSupportedCurrencies();

    // Test health check
    const health = await nowPaymentsService.getProviderHealth();

    res.json({
      success: true,
      message: 'NOWPayments API test completed',
      data: {
        totalCurrencies: currencies.currencies.length,
        totalFiat: currencies.fiat.length,
        sampleCrypto: currencies.currencies.slice(0, 10),
        sampleFiat: currencies.fiat.slice(0, 5),
        health
      }
    });
  } catch (error: any) {
    console.error('[MultiProviderTest] NOWPayments test failed:', error);
    res.status(500).json({
      success: false,
      message: 'NOWPayments API test failed',
      error: error.message
    });
  }
});

/**
 * Test multi-provider comparison
 */
router.post('/provider-comparison', async (req, res) => {
  try {
    const { gbpAmount = 100, targetToken = 'USDT', fiatCurrency = 'USD' } = req.body;
    
    console.log('[MultiProviderTest] Testing multi-provider comparison...', { gbpAmount, targetToken, fiatCurrency });

    const comparison = await paymentProviderService.compareProviders({
      gbpAmount,
      targetToken,
      fiatCurrency
    });

    res.json({
      success: true,
      message: 'Multi-provider comparison completed',
      data: comparison
    });
  } catch (error: any) {
    console.error('[MultiProviderTest] Provider comparison failed:', error);
    res.status(500).json({
      success: false,
      message: 'Provider comparison failed',
      error: error.message
    });
  }
});

/**
 * Test ChangeNow exchange creation
 */
router.post('/changenow/create-exchange', async (req, res) => {
  try {
    const { gbpAmount = 100, targetToken = 'USDT', destinationWallet, userId = 'test-user', clientOrderId = `test-${Date.now()}` } = req.body;
    
    if (!destinationWallet) {
      return res.status(400).json({
        success: false,
        message: 'destinationWallet is required'
      });
    }

    console.log('[MultiProviderTest] Creating ChangeNow exchange...', { gbpAmount, targetToken, destinationWallet });

    const exchange = await changeNowService.createFxSwapPayment({
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId
    });

    res.json({
      success: true,
      message: 'ChangeNow exchange created',
      data: exchange
    });
  } catch (error: any) {
    console.error('[MultiProviderTest] ChangeNow exchange creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'ChangeNow exchange creation failed',
      error: error.message
    });
  }
});

/**
 * Test NOWPayments payment creation
 */
router.post('/nowpayments/create-payment', async (req, res) => {
  try {
    const { gbpAmount = 100, targetToken = 'USDT', destinationWallet, userId = 'test-user', clientOrderId = `test-${Date.now()}` } = req.body;
    
    if (!destinationWallet) {
      return res.status(400).json({
        success: false,
        message: 'destinationWallet is required'
      });
    }

    console.log('[MultiProviderTest] Creating NOWPayments payment...', { gbpAmount, targetToken, destinationWallet });

    const payment = await nowPaymentsService.createFxSwapPayment({
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId
    });

    res.json({
      success: true,
      message: 'NOWPayments payment created',
      data: payment
    });
  } catch (error: any) {
    console.error('[MultiProviderTest] NOWPayments payment creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'NOWPayments payment creation failed',
      error: error.message
    });
  }
});

/**
 * Test NOWPayments hosted invoice creation
 */
router.post('/nowpayments/create-invoice', async (req, res) => {
  try {
    const { gbpAmount = 100, targetToken = 'USDT', userId = 'test-user', clientOrderId = `test-${Date.now()}` } = req.body;

    console.log('[MultiProviderTest] Creating NOWPayments hosted invoice...', { gbpAmount, targetToken });

    const invoice = await nowPaymentsService.createHostedPayment({
      gbpAmount,
      targetToken,
      userId,
      clientOrderId
    });

    res.json({
      success: true,
      message: 'NOWPayments hosted invoice created',
      data: invoice
    });
  } catch (error: any) {
    console.error('[MultiProviderTest] NOWPayments invoice creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'NOWPayments invoice creation failed',
      error: error.message
    });
  }
});

/**
 * Test provider health status
 */
router.get('/provider-health', async (req, res) => {
  try {
    console.log('[MultiProviderTest] Getting provider health status...');
    
    const health = await paymentProviderService.getProviderHealth();

    res.json({
      success: true,
      message: 'Provider health status retrieved',
      data: health
    });
  } catch (error: any) {
    console.error('[MultiProviderTest] Provider health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Provider health check failed',
      error: error.message
    });
  }
});

/**
 * Test payment creation with specific provider
 */
router.post('/create-payment', async (req, res) => {
  try {
    const { 
      gbpAmount = 100, 
      destinationWallet, 
      targetToken = 'USDT', 
      userId = 'test-user', 
      clientOrderId = `test-${Date.now()}`,
      preferredProvider 
    } = req.body;
    
    if (!destinationWallet) {
      return res.status(400).json({
        success: false,
        message: 'destinationWallet is required'
      });
    }

    console.log('[MultiProviderTest] Creating payment with provider...', { 
      gbpAmount, 
      targetToken, 
      destinationWallet, 
      preferredProvider 
    });

    const result = await paymentProviderService.createPayment({
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId,
      preferredProvider
    });

    res.json({
      success: true,
      message: 'Payment created successfully',
      data: result
    });
  } catch (error: any) {
    console.error('[MultiProviderTest] Payment creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Payment creation failed',
      error: error.message
    });
  }
});

export default router;
