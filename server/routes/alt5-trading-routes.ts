import { Router } from 'express';
import { alt5TradingService } from '../services/alt5-trading-service';
import { db } from '../db';
import { fxSwapOrders, alt5Accounts } from '@shared/fx_swap_schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Check if service is available
const checkServiceAvailability = (res: any) => {
  if (!alt5TradingService) {
    return res.status(503).json({
      success: false,
      error: 'Service unavailable',
      message: 'ALT5 trading service is not configured. Please set the required environment variables.'
    });
  }
  return null; // Service is available
};

// Get or create user's ALT5 account
const getOrCreateUserAccount = async (userId: string) => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  // Check if user already has an ALT5 account
  const existingAccount = await db.select().from(alt5Accounts)
    .where(eq(alt5Accounts.userId, userId))
    .limit(1);

  if (existingAccount.length > 0) {
    return existingAccount[0].alt5AccountId;
  }

  // Create new account if none exists
  return await alt5TradingService.createUserAccount(userId);
};

// Initialize master account authentication
const initializeMasterAccount = async () => {
  if (!await alt5TradingService.authenticate()) {
    throw new Error('Failed to authenticate with ALT5 master account');
  }
};

// On-ramp: Create fiat-to-crypto conversion order
router.post('/on-ramp', async (req, res) => {
  try {
    // Check if service is available
    const serviceCheck = checkServiceAvailability(res);
    if (serviceCheck) return serviceCheck;

    const { 
      gbpAmount, 
      destinationWallet, 
      targetToken, 
      userId, 
      clientOrderId,
      paymentMethod 
    } = req.body;

    // Validate required fields
    if (!gbpAmount || !destinationWallet || !targetToken || !userId || !clientOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'gbpAmount, destinationWallet, targetToken, userId, and clientOrderId are required'
      });
    }

    // Validate amount
    if (gbpAmount < 25 || gbpAmount > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be between £25 and £50,000'
      });
    }

    console.log('[ALT5-Trading] Creating on-ramp order:', {
      gbpAmount,
      destinationWallet,
      targetToken,
      userId,
      clientOrderId,
      paymentMethod
    });

    // Initialize master account
    await initializeMasterAccount();

    // Get or create user's ALT5 account
    const alt5AccountId = await getOrCreateUserAccount(userId);
    if (!alt5AccountId) {
      throw new Error('Failed to get or create ALT5 account for user');
    }

    // Create bank wire transfer deposit request to deposit fiat
    const bankTransferResponse = await alt5TradingService.createBankTransferRequest(alt5AccountId, {
      amount: gbpAmount,
      paymentSystem: 'BankWireTransfer',
      assetId: 'gbp',
      accountInfo: {
        beneficiary: 'Alt5Pay User',
        beneficiaryAddress: 'User Address',
        bankName: 'User Bank'
      },
      nonce: `transfer_${Date.now()}`
    });

    if (bankTransferResponse.status === 'error') {
      throw new Error(`Failed to create bank transfer request: ${bankTransferResponse.message}`);
    }

    // Store order in database
    if (!db) {
      throw new Error('Database not available');
    }

    const [dbOrder] = await db.insert(fxSwapOrders).values({
      id: clientOrderId,
      userId: userId,
      stripePaymentIntentId: `alt5_${clientOrderId}`,
      clientOrderId: clientOrderId,
      fiatCurrency: 'GBP',
      fiatAmount: gbpAmount.toString(),
      targetToken: targetToken,
      targetTokenAmount: '0', // Will be updated when order executes
      destinationWallet: destinationWallet,
      fxRate: '1.00', // Will be updated when order executes
      fxRateSource: 'alt5_trading',
      fxRateTimestamp: new Date(),
      platformFeePercent: '2.00', // 2% ALT5 fee
      platformFeeAmount: (gbpAmount * 0.02).toString(),
      totalFeesUsd: (gbpAmount * 0.02).toString(),
      status: 'pending',
      createdAt: new Date()
    }).returning();

    res.json({
      success: true,
      message: 'ALT5 on-ramp order created successfully',
      data: {
        orderId: clientOrderId,
        alt5AccountId,
        bankTransferDetails: bankTransferResponse.data,
        estimatedCryptoAmount: gbpAmount // Will be updated when order executes
      }
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] On-ramp order creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'On-ramp order creation failed',
      message: error.message || 'Failed to create ALT5 on-ramp order'
    });
  }
});

// Get user's ALT5 account details
router.get('/account/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId',
        message: 'userId is required'
      });
    }

    // Initialize master account
    await initializeMasterAccount();

    // Get user's ALT5 account details
    const accountDetails = await alt5TradingService.getUserAccountDetails(userId);
    
    if (!accountDetails) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
        message: 'No ALT5 account found for this user'
      });
    }

    // Get account balance
    const balanceResponse = await alt5TradingService.getAccountBalance(accountDetails.alt5AccountId);

    res.json({
      success: true,
      message: 'Account details retrieved successfully',
      data: {
        ...accountDetails,
        balance: balanceResponse.status === 'success' ? balanceResponse.data : null
      }
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] Get account details failed:', error);
    res.status(500).json({
      success: false,
      error: 'Account details retrieval failed',
      message: error.message || 'Failed to get account details'
    });
  }
});

// Create trading order (fiat-to-crypto conversion)
router.post('/order', async (req, res) => {
  try {
    const { userId, instrument, type, requestedQuoteAmount, isLimit = false } = req.body;

    if (!userId || !instrument || !type || !requestedQuoteAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId, instrument, type, and requestedQuoteAmount are required'
      });
    }

    // Initialize master account
    await initializeMasterAccount();

    // Get user's ALT5 account
    const alt5AccountId = await getOrCreateUserAccount(userId);
    if (!alt5AccountId) {
      throw new Error('Failed to get or create ALT5 account for user');
    }

    // Create trading order
    const orderResponse = await alt5TradingService.createOrder(alt5AccountId, {
      instrument,
      type,
      requestedQuoteAmount,
      isLimit
    });

    if (orderResponse.status === 'error') {
      throw new Error(`Failed to create trading order: ${orderResponse.message}`);
    }

    res.json({
      success: true,
      message: 'Trading order created successfully',
      data: orderResponse.data
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] Create order failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order creation failed',
      message: error.message || 'Failed to create trading order'
    });
  }
});

// Get user's active orders
router.get('/orders/active/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId',
        message: 'userId is required'
      });
    }

    // Initialize master account
    await initializeMasterAccount();

    // Get user's ALT5 account
    const accountDetails = await alt5TradingService.getUserAccountDetails(userId);
    if (!accountDetails) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
        message: 'No ALT5 account found for this user'
      });
    }

    // Get active orders
    const ordersResponse = await alt5TradingService.getActiveOrders(accountDetails.alt5AccountId);

    res.json({
      success: true,
      message: 'Active orders retrieved successfully',
      data: ordersResponse.data
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] Get active orders failed:', error);
    res.status(500).json({
      success: false,
      error: 'Active orders retrieval failed',
      message: error.message || 'Failed to get active orders'
    });
  }
});

// Get user's order history
router.get('/orders/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId',
        message: 'userId is required'
      });
    }

    // Initialize master account
    await initializeMasterAccount();

    // Get user's ALT5 account
    const accountDetails = await alt5TradingService.getUserAccountDetails(userId);
    if (!accountDetails) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
        message: 'No ALT5 account found for this user'
      });
    }

    // Get order history
    const historyResponse = await alt5TradingService.getOrderHistory(accountDetails.alt5AccountId);

    res.json({
      success: true,
      message: 'Order history retrieved successfully',
      data: historyResponse.data
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] Get order history failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order history retrieval failed',
      message: error.message || 'Failed to get order history'
    });
  }
});

// Get deposit address for bank transfer details
router.get('/deposit-details/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId',
        message: 'userId is required'
      });
    }

    // Initialize master account
    await initializeMasterAccount();

    // Get user's ALT5 account
    const accountDetails = await alt5TradingService.getUserAccountDetails(userId);
    if (!accountDetails) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
        message: 'No ALT5 account found for this user'
      });
    }

    // Get deposit address information (contains bank details for wire transfer)
    const depositResponse = await alt5TradingService.getDepositAddress(
      accountDetails.alt5AccountId,
      'BankWireTransfer',
      'gbp'
    );

    res.json({
      success: true,
      message: 'Deposit details retrieved successfully',
      data: depositResponse.data
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] Get deposit details failed:', error);
    res.status(500).json({
      success: false,
      error: 'Deposit details retrieval failed',
      message: error.message || 'Failed to get deposit details'
    });
  }
});

// Get user's account balance
router.get('/balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId',
        message: 'userId is required'
      });
    }

    // Initialize master account
    await initializeMasterAccount();

    // Get user's ALT5 account
    const accountDetails = await alt5TradingService.getUserAccountDetails(userId);
    if (!accountDetails) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
        message: 'No ALT5 account found for this user'
      });
    }

    // Get account balance
    const balanceResponse = await alt5TradingService.getAccountBalance(accountDetails.alt5AccountId);

    res.json({
      success: true,
      message: 'Account balance retrieved successfully',
      data: balanceResponse.data
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] Get balance failed:', error);
    res.status(500).json({
      success: false,
      error: 'Balance retrieval failed',
      message: error.message || 'Failed to get account balance'
    });
  }
});

// Get order status by order ID
router.get('/order-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing orderId',
        message: 'orderId is required'
      });
    }

    console.log('[ALT5-Trading] Getting order status:', orderId);

    // Initialize master account
    await initializeMasterAccount();

    // Look up order in database to get user and account info
    if (!db) {
      throw new Error('Database not available');
    }

    const order = await db.select().from(fxSwapOrders)
      .where(eq(fxSwapOrders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: 'No order found with the provided ID'
      });
    }

    const orderData = order[0];

    // Get user's ALT5 account details
    const accountDetails = await alt5TradingService.getUserAccountDetails(orderData.userId);
    if (!accountDetails) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
        message: 'No ALT5 account found for this user'
      });
    }

    // Get active orders to check status
    const ordersResponse = await alt5TradingService.getActiveOrders(accountDetails.alt5AccountId);

    let orderStatus = 'pending';
    let depositAddress = null;

    if (ordersResponse.status === 'success' && ordersResponse.data) {
      // Check if order exists in active orders
      const activeOrder = ordersResponse.data.find((order: any) => order.id === orderId || order.clientOrderId === orderId);
      if (activeOrder) {
        orderStatus = activeOrder.status || 'processing';
      } else {
        // Order might be completed, check order history
        const historyResponse = await alt5TradingService.getOrderHistory(accountDetails.alt5AccountId);
        if (historyResponse.status === 'success' && historyResponse.data) {
          const completedOrder = historyResponse.data.find((order: any) => order.id === orderId || order.clientOrderId === orderId);
          if (completedOrder) {
            orderStatus = completedOrder.status || 'completed';
          }
        }
      }
    }

    // If order is completed, try to get the deposit address
    if (orderStatus === 'completed') {
      try {
        const depositResponse = await alt5TradingService.getDepositAddress(
          accountDetails.alt5AccountId,
          'BankWireTransfer', // or appropriate payment system
          orderData.targetToken.toLowerCase() // crypto token as asset
        );
        if (depositResponse.status === 'success' && depositResponse.data) {
          depositAddress = depositResponse.data.depositAddress || depositResponse.data.address;
        }
      } catch (depositError) {
        console.log('[ALT5-Trading] Deposit address not available for completed order:', depositError);
        // This is expected if the deposit address is only available after crypto delivery
      }
    }

    res.json({
      success: true,
      message: 'Order status retrieved successfully',
      data: {
        orderId: orderId,
        status: orderStatus,
        depositAddress: depositAddress,
        originalOrder: {
          fiatAmount: orderData.fiatAmount,
          targetToken: orderData.targetToken,
          destinationWallet: orderData.destinationWallet,
          createdAt: orderData.createdAt
        }
      }
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] Get order status failed:', error);
    res.status(500).json({
      success: false,
      error: 'Order status retrieval failed',
      message: error.message || 'Failed to get order status'
    });
  }
});

// Test ALT5 trading connectivity
router.get('/test', async (req, res) => {
  try {
    // Check if service is available
    const serviceCheck = checkServiceAvailability(res);
    if (serviceCheck) return serviceCheck;

    console.log('[ALT5-Trading] Testing connectivity');

    // Initialize master account
    const authSuccess = await alt5TradingService.authenticate();

    if (!authSuccess) {
      throw new Error('Failed to authenticate with ALT5 master account');
    }

    res.json({
      success: true,
      message: 'ALT5 trading service test completed successfully',
      data: {
        status: 'operational',
        alt5Connected: true,
        timestamp: new Date().toISOString(),
        note: 'Trading on-ramp service ready for fiat-to-crypto conversions'
      }
    });

  } catch (error: any) {
    console.error('[ALT5-Trading] Test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message || 'ALT5 trading service test failed'
    });
  }
});

export default router;
