/**
 * Alt5Pro API Routes Integration
 * Separating frontend client onboarding from backend management routes
 */

import { Router } from 'express';
import { alt5ProAPI } from '../services/alt5pro-api';
import { verifyWalletAuth } from "../middleware/walletAuth";

const router = Router();

// Test endpoint to verify routes are working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Alt5Pro routes are working',
    timestamp: new Date().toISOString()
  });
});

// =====================
// FRONTEND CLIENT ONBOARDING ROUTES
// =====================

/**
 * CLIENT AUTHENTICATION ROUTES
 */

// Sign up new client
router.post('/client/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const result = await alt5ProAPI.signUpUser({
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Account created successfully. Please check your email for verification.',
        data: result.data
      });
    } else {
      res.status(result.statusCode || 400).json({
        success: false,
        error: result.error || 'Failed to create account'
      });
    }
  } catch (error) {
    console.error('Client signup error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during signup' 
    });
  }
});

// Sign in client
router.post('/client/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const result = await alt5ProAPI.signInUser(email, password);

    if (result.success) {
      res.json({
        success: true,
        message: result.requires2FA ? '2FA verification required' : 'Login successful',
        requires2FA: result.requires2FA,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 401).json({
        success: false,
        error: result.error || 'Authentication failed'
      });
    }
  } catch (error) {
    console.error('Client signin error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during authentication' 
    });
  }
});

// Complete 2FA verification
router.post('/client/signin/2fa', async (req, res) => {
  try {
    const { token, sessionId } = req.body;

    if (!token || !sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: '2FA token and session ID are required' 
      });
    }

    const result = await alt5ProAPI.complete2FA(token, sessionId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Authentication completed successfully',
        data: result.data
      });
    } else {
      res.status(result.statusCode || 401).json({
        success: false,
        error: result.error || '2FA verification failed'
      });
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during 2FA verification' 
    });
  }
});

// Password reset for clients
router.post('/client/password/reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    const result = await alt5ProAPI.resetPassword(email);

    if (result.success) {
      res.json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } else {
      res.status(result.statusCode || 400).json({
        success: false,
        error: result.error || 'Password reset failed'
      });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during password reset' 
    });
  }
});

/**
 * CLIENT MARKET DATA ROUTES
 */

// Get real-time market ticker for client trading interface
router.get('/client/market/ticker', async (req, res) => {
  try {
    const { instrument } = req.query;
    const result = await alt5ProAPI.getMarketTicker(instrument as string);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch market data'
      });
    }
  } catch (error) {
    console.error('Market ticker error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve market ticker data' 
    });
  }
});

// Get order book depth for client trading
router.get('/client/market/orderbook/:instrument', async (req, res) => {
  try {
    const { instrument } = req.params;
    const { limit } = req.query;
    
    const result = await alt5ProAPI.getOrderBookDepth(
      instrument, 
      limit ? parseInt(limit as string) : undefined
    );

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch order book'
      });
    }
  } catch (error) {
    console.error('Order book error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve order book data' 
    });
  }
});

// Get recent trades for client interface
router.get('/client/market/trades/:instrument', async (req, res) => {
  try {
    const { instrument } = req.params;
    const { limit } = req.query;
    
    const result = await alt5ProAPI.getRecentTrades(
      instrument, 
      limit ? parseInt(limit as string) : undefined
    );

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch recent trades'
      });
    }
  } catch (error) {
    console.error('Recent trades error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve recent trades' 
    });
  }
});

// Get exchange rates for client conversions
router.get('/client/market/rates', async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await alt5ProAPI.getExchangeRates(from as string, to as string);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch exchange rates'
      });
    }
  } catch (error) {
    console.error('Exchange rates error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve exchange rates' 
    });
  }
});

// Get market assets for client trading
router.get('/client/market/assets', async (req, res) => {
  try {
    const result = await alt5ProAPI.getMarketAssets();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch market assets'
      });
    }
  } catch (error) {
    console.error('Market assets error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve market assets' 
    });
  }
});

// Get historical data for client charts
router.get('/client/market/history/:instrument', async (req, res) => {
  try {
    const { instrument } = req.params;
    const { interval, from, to } = req.query;

    if (!interval) {
      return res.status(400).json({
        success: false,
        error: 'Interval parameter is required'
      });
    }

    const result = await alt5ProAPI.getHistoricalData(
      instrument,
      interval as string,
      from as string,
      to as string
    );

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch historical data'
      });
    }
  } catch (error) {
    console.error('Historical data error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve historical data' 
    });
  }
});

/**
 * CLIENT PLATFORM INFO ROUTES
 */

// Get platform information for client interface
router.get('/client/platform/info', async (req, res) => {
  try {
    const result = await alt5ProAPI.getPlatformInfo();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch platform info'
      });
    }
  } catch (error) {
    console.error('Platform info error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve platform information' 
    });
  }
});

// Get countries for client onboarding
router.get('/client/platform/countries', async (req, res) => {
  try {
    const { id } = req.query;
    const result = await alt5ProAPI.getCountries(id as string);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch countries data'
      });
    }
  } catch (error) {
    console.error('Countries data error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve countries information' 
    });
  }
});

// =====================
// BACKEND MANAGEMENT ROUTES
// (Requires authentication and admin privileges)
// =====================

/**
 * ADMIN ACCOUNT MANAGEMENT ROUTES
 */

// Get accounts by owner (admin only)
router.get('/admin/accounts/owner/:ownerId', verifyWalletAuth, async (req, res) => {
  try {
    const { ownerId } = req.params;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
      return res.status(401).json({
        success: false,
        error: 'Admin authentication token required'
      });
    }

    const result = await alt5ProAPI.getAccountsByOwner(ownerId, authToken);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch accounts data'
      });
    }
  } catch (error) {
    console.error('Admin accounts error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve accounts data' 
    });
  }
});

/**
 * ADMIN MARKET DATA ROUTES
 */

// Get comprehensive market data for admin dashboard
router.get('/admin/market/comprehensive', verifyWalletAuth, async (req, res) => {
  try {
    // Fetch multiple data sources for admin dashboard
    const [tickerResult, assetsResult, ratesResult] = await Promise.allSettled([
      alt5ProAPI.getMarketTicker(),
      alt5ProAPI.getMarketAssets(),
      alt5ProAPI.getExchangeRates()
    ]);

    const response = {
      success: true,
      data: {
        ticker: tickerResult.status === 'fulfilled' && tickerResult.value.success 
          ? tickerResult.value.data : null,
        assets: assetsResult.status === 'fulfilled' && assetsResult.value.success 
          ? assetsResult.value.data : null,
        rates: ratesResult.status === 'fulfilled' && ratesResult.value.success 
          ? ratesResult.value.data : null
      },
      errors: [
        tickerResult.status === 'rejected' ? tickerResult.reason : null,
        assetsResult.status === 'rejected' ? assetsResult.reason : null,
        ratesResult.status === 'rejected' ? ratesResult.reason : null
      ].filter(Boolean)
    };

    res.json(response);
  } catch (error) {
    console.error('Admin comprehensive market data error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve comprehensive market data' 
    });
  }
});

/**
 * SYSTEM HEALTH AND TESTING ROUTES
 */

// Test Alt5Pro API connectivity
router.get('/admin/system/test-connection', verifyWalletAuth, async (req, res) => {
  try {
    const result = await alt5ProAPI.testConnection();
    res.json(result);
  } catch (error) {
    console.error('Alt5Pro connection test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test Alt5Pro API connectivity' 
    });
  }
});

// Get build information for admin
router.get('/admin/platform/build-info', verifyWalletAuth, async (req, res) => {
  try {
    const result = await alt5ProAPI.getBuildInfo();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch build info'
      });
    }
  } catch (error) {
    console.error('Build info error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve build information' 
    });
  }
});

// Get front office assets for admin management
router.get('/admin/assets/front-office', verifyWalletAuth, async (req, res) => {
  try {
    const result = await alt5ProAPI.getFrontOfficeAssets();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({
        success: false,
        error: result.error || 'Failed to fetch front office assets'
      });
    }
  } catch (error) {
    console.error('Front office assets error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve front office assets' 
    });
  }
});

export default router;