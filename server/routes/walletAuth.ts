import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// In-memory nonce storage (temporary - we'll discuss upgrading later)
// Structure: { walletAddress: { nonce: string, timestamp: number } }
const nonceStore = new Map<string, { nonce: string; message: string; timestamp: number }>();

// Cleanup expired nonces (older than 5 minutes)
const NONCE_EXPIRATION = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [address, data] of nonceStore.entries()) {
    if (now - data.timestamp > NONCE_EXPIRATION) {
      nonceStore.delete(address);
    }
  }
}, 60 * 1000); // Run every minute

/**
 * POST /api/wallet-auth/nonce
 * Generate a nonce for wallet to sign
 */
router.post('/nonce', (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Normalize address to lowercase
    const normalizedAddress = walletAddress.toLowerCase();

    // Validate Ethereum address format
    if (!ethers.isAddress(normalizedAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Generate cryptographically secure nonce
    const nonce = ethers.hexlify(ethers.randomBytes(32));

    // Create the message to sign
    const message = createSignInMessage(normalizedAddress, nonce);

    // Store nonce AND message with timestamp
    nonceStore.set(normalizedAddress, {
      nonce,
      message,  // STORE THE MESSAGE
      timestamp: Date.now(),
    });

    // Return both nonce AND the complete message
    res.json({ nonce, message });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

/**
 * POST /api/wallet-auth/verify
 * Verify wallet signature and issue JWT
 */
router.post('/verify', (req: Request, res: Response) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature are required' });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Get stored nonce
    const storedData = nonceStore.get(normalizedAddress);
    if (!storedData) {
      return res.status(401).json({ error: 'No nonce found. Please request a new nonce.' });
    }

    const { nonce, message, timestamp } = storedData;  // GET STORED MESSAGE

    // Check if nonce is expired
    if (Date.now() - timestamp > NONCE_EXPIRATION) {
      nonceStore.delete(normalizedAddress);
      return res.status(401).json({ error: 'Nonce expired. Please request a new nonce.' });
    }

    // USE THE STORED MESSAGE - don't recreate it
    // const message = createSignInMessage(normalizedAddress, nonce); // DELETE THIS LINE

    // DEBUG LOGS
    console.log('=== SIGNATURE VERIFICATION DEBUG ===');
    console.log('Wallet Address (normalized):', normalizedAddress);
    console.log('Nonce:', nonce);
    console.log('Message to verify:', message);
    console.log('Signature received:', signature);

    // Verify signature
    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
      console.log('Recovered Address:', recoveredAddress);
      console.log('Recovered (lowercase):', recoveredAddress.toLowerCase());
      console.log('Match:', recoveredAddress.toLowerCase() === normalizedAddress);
    } catch (verifyError) {
      console.error('Signature verification threw error:', verifyError);
      return res.status(401).json({ error: 'Signature verification failed' });
    }

    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      console.log('❌ Address mismatch!');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('✅ Signature valid!');
    console.log('====================================');

    // Delete used nonce (one-time use)
    nonceStore.delete(normalizedAddress);

    // Check JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    // Generate JWT
    const token = jwt.sign(
      { walletAddress: normalizedAddress },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );

    res.json({
      token,
      walletAddress: normalizedAddress,
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

/**
 * Create EIP-4361 compliant sign-in message
 */
function createSignInMessage(address: string, nonce: string): string {
  const domain = process.env.DOMAIN || 'localhost:5000';
  const uri = process.env.URI || 'http://localhost:5000';
  const issuedAt = new Date().toISOString();

  return `${domain} wants you to sign in with your Ethereum account:
${address}

Sign in to NebulaX DEX

URI: ${uri}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuedAt}`;
}

export default router;