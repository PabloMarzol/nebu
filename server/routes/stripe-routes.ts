import { Router } from 'express';
import { stripePaymentService } from '../services/stripe-service';

const router = Router();

// Create payment intent for deposits
router.post('/create-intent', async (req: any, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    const userId = req.user?.claims?.sub;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    if (amount > 50000) {
      return res.status(400).json({ error: 'Amount exceeds maximum limit' });
    }

    const result = await stripePaymentService.createPaymentIntent(amount, currency);

    res.json(result);
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Process withdrawal
router.post('/withdraw', async (req: any, res) => {
  try {
    const { amount, currency = 'usd', destination } = req.body;
    const userId = req.user?.claims?.sub;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    if (!destination) {
      return res.status(400).json({ error: 'Destination account is required' });
    }

    const result = await stripePaymentService.processWithdrawal(amount, currency, destination);

    res.json(result);
  } catch (error) {
    console.error('Withdrawal processing error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

// Create customer
router.post('/create-customer', async (req: any, res) => {
  try {
    const { email, name } = req.body;
    const userId = req.user?.claims?.sub;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await stripePaymentService.createCustomer(email, name);

    res.json(result);
  } catch (error) {
    console.error('Customer creation error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Get payment methods
router.get('/payment-methods/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    const paymentMethods = await stripePaymentService.getPaymentMethods(customerId);

    res.json({ paymentMethods });
  } catch (error) {
    console.error('Payment methods fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.get('stripe-signature');
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing Stripe signature' });
    }

    const result = await stripePaymentService.handleWebhook(req.body, signature);

    res.json(result);
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Get publishable key for frontend
router.get('/config', (req, res) => {
  const publishableKey = process.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RgpjICv8i69yuqzH9YNbzAWZWoStFRRb69Gw9DOT8KHrcOj7tj2DqQOJAhLA2jxvcLGVP1EeCCZm6Oycw0PIR9Z00xdRsazWo';
  
  res.json({
    publishableKey,
    currency: 'usd',
    supportedPaymentMethods: ['card', 'bank_transfer', 'sepa', 'ach']
  });
});

export default router;